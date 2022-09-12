const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager")
const { Client } = require('pg')

const region = process.env.AWS_REGION
const secretId = process.env.MIDDLEWARE_ENVIRONMENT + '/student-app-middleware-db'

/**
 * Accesses AWS Secrets Manager to retrieve the DB connection details
 * 
 * TODO: Maybe we should be using a dynamic reference rather than code to read from SecretsManager?
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 * @returns 
 */
let getDatabaseConnectionSecret = async function() {

    try {
        console.debug(`DB: Loading AWS Secret from Region [${region}] + and Name: [${secretId}]`)

        const client = new SecretsManagerClient({region: region})
        const command = new GetSecretValueCommand({SecretId: secretId})

        console.debug('DB: Loading DB Connection details from Secret: ' + secretId)

        let response = await client.send(command)

        return JSON.parse(response.SecretString)

    } catch (error) {
        let message = 'DB: Unable to load Database Connection secret: [' + secretId + '] from AWS Secrets Manager'
        console.fatal(message + ':' + error)
        throw new Error(message)
    }
}

/**
 * Loads a configured (but not connected) PG driver client
 * @returns 
 */
let getDbClient = async function() {
    
    let awsSecret = await getDatabaseConnectionSecret()

    console.debug('DB: Connecting to database at: ' + awsSecret.host)

    return new Client({
        host: awsSecret.host,
        user: awsSecret.username,
        password: awsSecret.password,
        database: 'postgres'
    })
 }

/**
 * Load the organization/application configuration by apikey
 * @param {*} apikey Unique ID for the front-end client to which the configuration beloings 
 * @returns Configuration object from the database.
 */
let getApplicationConfigByApikey = async function(apikey) {

    const client = await getDbClient()

    let sql = `
        SELECT * 
        FROM applications a 
        INNER JOIN organizations o ON o.id = a.organization_id 
        WHERE a.apikey = $1::text`

    try {

        client.connect()
    
        let result = await client.query(sql, [apikey])

        // console.debug('Successfully loaded Config: ' + JSON.stringify(result.rows[0]))

        return (result.rows.length < 1) ? undefined : result.rows[0]
        
    } catch (error) {
        let message = 'DB: Unable to load configuration for apikey: ' + apikey
        console.error(message + ':' + error)
        throw new Error(message)
    }
}

/**
 * Loads the configuration from the middleware database for the Organization
 * as identified by orgCode.
 * @param {*} code 
 * @returns 
 */
let getOrganizationConfigByCode = async function(code) {

    const client = await getDbClient()

    let sql = `
        SELECT * 
        FROM organizations o 
        WHERE o.code = $1::text`

    try { 
        client.connect()
        let result = await client.query(sql, [code])

        return (result.rows.length < 1) ? undefined : result.rows[0]

    } catch (error) {
        let message = 'DB: Unable to load ogranization config for code: ' + code
        console.error(message + ':' + error)
        throw new Error(message)
    }
}

/**
 * Loads the User Identity currently held in the database (or undefined)
 * @param {*} organizationId 
 * @param {*} principalId 
 * @returns 
 */
let getUserIdentityByPrincipalId = async function(organizationId, principalId) {

    console.debug(`DB: Loading User [${principalId}] for OrganizationId [${organizationId}] `)

    const client = await getDbClient()

    let sql = `
        SELECT * 
        FROM users w 
        WHERE organization_id = $1::bigint 
        AND crm_principal_id = $2::text`

    try {
        client.connect()
        let result = await client.query(sql, [organizationId, principalId])

        return (result.rows.length < 1) ? undefined : result.rows[0]

    } catch (error) {
        let message = 'Unable to load User: ' + principalId + ' from Org: ' + organizationId
        console.error(message + ':' + error)
        throw new Error(message)
    }
}

/**
 * Loads the User Identity currently held in the database (or undefined)
 * @param {*} organizationId 
 * @param {*} idpSubscriber 
 * @returns 
 */
 let getUserIdentityByIdpSubscriber = async function(organizationId, idpSubscriber) {

    console.debug(`DB: Loading User [${idpSubscriber}] for OrganizationId [${organizationId}] `)

    const client = await getDbClient()

    let sql = `
        SELECT * 
        FROM users
        WHERE organization_id = $1::bigint 
        AND idp_sub = $2::text`

    try {
        client.connect()
        let result = await client.query(sql, [organizationId, idpSubscriber])

        return (result.rows.length < 1) ? undefined : result.rows[0]

    } catch (error) {
        let message = 'Unable to load User: ' + idpSubscriber + ' from Org: ' + organizationId
        console.error(message + ':' + error)
        throw new Error(message)
    }
}

/**
 * Inserts new record into User table
 * @param {*} organizationId 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} email 
 * @param {*} idpIdentityJson 
 * @param {*} crmPrincipalId 
 * @param {*} applicationId 
 * @returns 
 */
let insertUserIdentity = async function(organizationId, apikey, userIdentity) {

// let insertUserIdentity = async function(organizationId, firstName, lastName, email,
//     idpIdentityJson, idpSub, crmPrincipalId, applicationId) {

    console.debug(`DB: Inserting User [${userIdentity.crmPrincipalId}] 
        for OrganizationId [${organizationId}] and apikey [${apikey}]`)

    const client = await getDbClient()

    let sql = `
        INSERT INTO public.users (
            organization_id, 
            first_name, 
            last_name, 
            email, 
            idp_identity,
            idp_sub,
            crm_principal_id,
            apikey_created_by
        )
        VALUES (
            $1::bigint,
            $2::text,
            $3::text,
            $4::text,
            $5::jsonb,
            $6::text,
            $7::text,
            $8::text
        )`

    let record = [
        organizationId, 
        userIdentity.firstName, 
        userIdentity.lastName, 
        userIdentity.email, 
        userIdentity.idpIdentityJson, 
        userIdentity.idpSubscriber, 
        userIdentity.crmPrincipalId, 
        apikey
    ]

    console.debug('DB: *** Inserting User record: ' + JSON.stringify(record))

    try {
        client.connect()
        let result = await client.query(sql, record)
        console.debug(JSON.stringify(result))

        // TODO: Return something better ... ?
        return userIdentity.crmPrincipalId
    }
    catch (error) {
        let message = 'DB: Unable to insert User: ' + userIdentity.crmPrincipalId + ' from Org: ' + organizationId
        console.error(message + ':' + error)
        throw new Error(message)
    }
}

module.exports = {
    getApplicationConfigByApikey,
    getOrganizationConfigByCode,
    getUserIdentityByPrincipalId,
    getUserIdentityByIdpSubscriber,
    insertUserIdentity
}