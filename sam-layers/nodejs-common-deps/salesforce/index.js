const got = require('got')
const aws = require('aws-sdk')
const jwt = require('jsonwebtoken')
const common = require('/opt/nodejs/common')
const awsFuncs = require('/opt/nodejs/aws-functions')

const s3 = new aws.S3()
const SALESFORCE_APP_PATH = '/services/apexrest/rnpedu/v1'

const getData = async (orgConfig, url, params) => {
    // if (params.access_token == "") throw new Error('Access token required')

    let httpHeaders = await generateSalesforceRequestHeaders(orgConfig)

    console.debug(`Preparing to get Salesforce [${url}] with parameters [${JSON.stringify(httpHeaders)}]`)

    let response =  await got.get(url, {headers: httpHeaders})

    if (params.hasOwnProperty("files") && response.statusCode == 200) {
        let body = JSON.parse(response.body)
        if (body.length != undefined) { // array check
            // this is coming from all tasks, so there are an array of objects that have been returned
            for (task of body) {
                if (task.request != null) {
                    let taskId = task.id
                    task.request.uploads = params.files.filter(x => x.task == taskId).map(x => { return {fileName: x.filename, fileSize: x.filesize} })
                    if (task.request.uploads.length > 0) console.info("action=getTaskFiles, success=true, task=" + taskId + ", files=" + JSON.stringify(task.request.uploads))  
                }
            }
        } else {
            // this is just a single task, so we can just inject the files into the object and return it
            if (body.request != null) {
                // can only have files on a request
                body.request.uploads = params.files.map(x => { return {fileName: x.filename, fileSize: x.filesize}})
                console.info("action=getTaskFiles, success=true, files=" + JSON.stringify(body.request.uploads))
            }
        }
        response.body = JSON.stringify(body)
    }

    return response
    
}

const patchData = async (orgConfig, url, params) => {
    // if (params.access_token == "") throw new Error('Access token required')
    let httpHeaders = await generateSalesforceRequestHeaders(orgConfig)

    return await got.patch(url, {
        headers: httpHeaders,
        body: Buffer.from(JSON.stringify(params.data))
    })
}

const postData = async (orgConfig, url, params) => {
    // if (params.access_token == "") throw new Error('Access token required')
    let httpHeaders = await generateSalesforceRequestHeaders(orgConfig)

    console.info('action=postParams, url=' + url + ', params=' + JSON.stringify(params))

    return await got(url, {
        headers: httpHeaders,
        body: params.data,
        method: 'POST'
    })
}

let doGet = async (orgConfig, url) => {

    // Prepare HTTP Headers for Salesforce
    let requestHeaders = await generateSalesforceRequestHeaders(orgConfig)

    console.debug(`Salesforce GET on url: [${url}] with Headers: [${JSON.stringify(requestHeaders)}]`)

    let response = await got.get(url, { headers: requestHeaders })
    console.debug(`Response from Salesforce: [${response.body}]`)

    // TODO Make this an obj?
    return response.body
}

let generateSalesforceRequestHeaders = async (orgConfig) => {

    let accessToken = await getSalesforceAccessToken(orgConfig)

    return {
        "Authorization": `Bearer ${accessToken.access_token}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Accept": "*/*",
    }
}

let getStudentSuccessContacts = async (orgConfig, studentId) => {

    let studentSuccessContacts, salesforceSuccessContacts

    if (orgConfig.options.caching.enabled) {
        let cacheKey = `student_success_contacts:${studentId}`

        let studentSuccessContactsStr = await common.getFromCache(cacheKey)

        if (studentSuccessContactsStr) {
            // use the cached object
            return JSON.parse(studentSuccessContactsStr)
        }
        else {
            // load remote
            salesforceSuccessContacts = await getRemoteStudentSuccessContacts(orgConfig, studentId)
            studentSuccessContacts = transform(salesforceSuccessContacts)

            // cache
            let expiration = orgConfig.options.caching.student_success_contacts_expiration ?
                orgConfig.options.caching.student_success_contacts_expiration : 43200

            await common.setInCache(cacheKey, JSON.stringify(studentSuccessContacts), { EX:  expiration })
        }
    }
    else {
        salesforceSuccessContacts = await getRemoteStudentSuccessContacts(orgConfig, studentId)
        studentSuccessContacts = transform(salesforceSuccessContacts)
    }

    return studentSuccessContacts
}

let getRemoteStudentSuccessContacts = async (orgConfig, studentId) => {

    let url = orgConfig.crm_config.domain + 
        SALESFORCE_APP_PATH + `/students/${studentId}/successContacts`

    let salesforceResponse = await doGet(orgConfig, url)

    return JSON.parse(salesforceResponse)
}

let transform = function (remoteSuccessContacts) {

    // Success Contacts is an array and should be wrapped in "results"
    return { results: remoteSuccessContacts }
}

/**
 * This method returns a viable Salesforce access token for the given organization. This method
 * is cache aware, meaning that it will look in the cache first if so configured.
 * @param {*} orgConfig 
 * @returns 
 */
let getSalesforceAccessToken = async (orgConfig) => {

    let accessToken

    if (orgConfig.options.caching.enabled) {

        let cacheKey = `salesforce_access_token:${orgConfig.code}`

        console.debug(`Checking cache for Salesforce access_token: [${cacheKey}]`)

        // check cache
        let accessTokenStr = await common.getFromCache(cacheKey)
    
        if (accessTokenStr == null) { // Cache Miss

            console.debug(`Cache miss on [${cacheKey}]`)

            // Create new access token
            accessToken = await createSalesforceAccessToken(orgConfig)
    
            // Store in cache
            let tokenExpirationSeconds = orgConfig.crm_config.authentication.tokenExpiration ?
                orgConfig.crm_config.authentication.tokenExpiration : 21600

            await common.setInCache(cacheKey, JSON.stringify(accessToken), {EX: tokenExpirationSeconds})
        }
        else {
            accessToken = JSON.parse(accessTokenStr)
        }
    }
    else {
        console.warn(`Caching of the Salesforce Access Token is NOT enabled for Organization: [${orgConfig.code}]`)
        accessToken = await createSalesforceAccessToken(orgConfig)
    }

    console.debug(`Using access token :[${JSON.stringify(accessToken)}]`)

    return accessToken
}

/**
 * This method will create and cache a Salesforce access token for later usage.
 * @param {*} orgConfig 
 * @returns 
 */
 let refreshSalesforceAccessTokenCache = async (orgConfig) => {

    if (orgConfig.options.caching.enabled) {

        let cacheKey = `salesforce_access_token:${orgConfig.code}`

        let accessToken = await createSalesforceAccessToken(orgConfig)

        // Store in cache
        let tokenExpirationSeconds = orgConfig.crm_config.authentication.tokenExpiration ?
            orgConfig.crm_config.authentication.tokenExpiration : 21600

        await common.setInCache(cacheKey, JSON.stringify(accessToken), {EX: tokenExpirationSeconds})

        console.info(`New Salesforce Access Token cached at [${cacheKey}] with payload [${JSON.stringify(accessToken)}]`)
    }
    else {
        console.warn(`Salesforce Access Token cache is not enabled for Organization: [${orgConfig.code}]`)
    }
}

/***
 * Follows the OAuth 2.0JWT Bearer Flow for Server-to-Server integration process
 * as defined by Salesforce to authenticate against the remote Salesforce API and obtain
 * a fresh access token.
 * https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5
 */
let createSalesforceAccessToken = async (orgConfig) => {

    console.debug('Authenticating against Salesforce via Org Config: ' + JSON.stringify(orgConfig))
    
    let crmAuthnConfig = orgConfig.crm_config.authentication

    // JWT Token expiration request needs to be within 3 minutes for SF access (I add 120 seconds)
    let expirationSecs = Math.floor(Date.now() / 1000) + 120

    let payload = {
        iss: crmAuthnConfig.consumerKey,
        sub: crmAuthnConfig.username,
        aud: crmAuthnConfig.audience,
        exp: expirationSecs
    }

    console.debug(`Preparing Salesforce Authn request with payload: [${JSON.stringify(payload)}]`)

    // Load private key from storage
    let privateKey = await loadPrivateKey(crmAuthnConfig.s3_privateKey)
    
    // console.debug(`Preparing Salesforce Authn request with private key: [${privateKey}]`)

    // Sign JWT assertion to validate the authentication request
    let assertion = jwt.sign(payload, privateKey, { algorithm: crmAuthnConfig.jwtAlgorithm })

    let accessTokenRequest = {
        grant_type: crmAuthnConfig.grantType,
        assertion: assertion
    }

    let response = await got.post( crmAuthnConfig.uri, {form: accessTokenRequest})

    // console.log(response.body)

    let responseObj = JSON.parse(response.body)
    responseObj.created_on = ( new Date() ).toISOString()

    return responseObj
}

/**
 * Helper method for loading Private Key from storage in S3
 * @param {*} objectKey 
 * @returns 
 */
let loadPrivateKey = async (objectKey) => {

    const configBucket = process.env.CONFIG_S3_BUCKET

    console.debug(`Loading Salesforce Connected App Private Key from Bucket: [${configBucket}] and Key: [${objectKey}]`)

    let response = await s3.getObject({ Bucket: configBucket, Key: objectKey }).promise()

    console.debug(`Successfully loaded private key for JWT signature from Bucket: [${configBucket}] and Key: [${objectKey}]`)

    return response.Body.toString()
}

let generateSalesforceParams = async (params, studentId) => {
    let allTaskFiles = await awsFuncs.listAllFiles(process.env.TASK_DOCUMENT_STORAGE, `students/${studentId}/`).promise()
    console.info("action=getAllTaskFiles, success=true, allTaskFiles=" + JSON.stringify(allTaskFiles))
    let fileKeys = (await allTaskFiles).Contents.map(x => {
        return {Key: x.Key, Size: x.Size}
    })
    if (fileKeys.length > 0) {
        // files present
        if (fileKeys[0].Key.split("files/")[1] == "") {
        fileKeys.shift() // remove the first key as it will just be the prefix "students/{studendId}/tasks/{taskId}/files/"
        }
        console.info("action=getFileKeys, success=true, files=" + JSON.stringify(fileKeys))
        // loop through each key and create a file object with a Task ID and Filename
        // add each to the params.files array
        params.files = []
        for (key of fileKeys) {
            let mapTask = key.Key.split("/")[3]
            let mapFilename = key.Key.split('files/')[1]
            let fileSize = key.Size
            params.files.push({
                task: mapTask,
                filename: mapFilename,
                filesize: fileSize
            })
        }
    }
}

module.exports = {
    get: getData,
    patch: patchData,
    post: postData,
    getSalesforceAccessToken,
    createSalesforceAccessToken,
    refreshSalesforceAccessTokenCache,
    getStudentSuccessContacts,
    generateSalesforceParams
}