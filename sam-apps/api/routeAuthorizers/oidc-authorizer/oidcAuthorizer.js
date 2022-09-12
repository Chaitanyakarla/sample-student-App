const common = require('/opt/nodejs/common')
const middlewaredb = require('/opt/nodejs/middleware-db')
const idaas = require('/opt/nodejs/idaas')


exports.handler = async function( event, context ){
  // console.log('### EVENT: ' + JSON.stringify(event))
  common.fixHeaders(event)
  try {
    let apikey = common.getApiKey(event)

    let accessToken = common.getAccessToken(event)

    console.debug(`## NO CACHED IDENTITY ## OIDC: Apikey: [${apikey}], and Token: [${accessToken}]`)

    let applicationConfig = await middlewaredb.getApplicationConfigByApikey(apikey)
    console.log(`OIDC: Using ApiConfig: ${JSON.stringify(applicationConfig)}`)

    let idpSubscriber = await idaas.getVerifiedIdpSubscriber(applicationConfig.identity_provider_config, accessToken)

    // Have we seen this user before?
    let userIdentity = await middlewaredb.getUserIdentityByIdpSubscriber(applicationConfig.organization_id, idpSubscriber)



    let crmPrincipalId

    if (userIdentity) {
      console.debug(`OIDC: Found Local DB Identity: [${JSON.stringify(userIdentity)}]`)
      crmPrincipalId = userIdentity.crm_principal_id
    }
    else {
      // This user has never logged in before so ... 
      
      // 1) Get Remote Identity info from IdP
      console.debug(`OIDC: User has not authenticated before ... 
        retrieving remote identity info from IdP for Subscriber: ${idpSubscriber}`)
      let remoteUserIdentity = await idaas.getRemoteUserIdentity(applicationConfig.identity_provider_config, accessToken)

      console.debug(`OIDC: Remote Identity: [${JSON.stringify(remoteUserIdentity)}`)

      // 2. Store in User Identity table for caching pruposes
      crmPrincipalId = await middlewaredb.insertUserIdentity(
        applicationConfig.organization_id, apikey, remoteUserIdentity)

      userIdentity = await middlewaredb.getUserIdentityByIdpSubscriber(applicationConfig.organization_id, idpSubscriber)
    }

    // Return valid Authorizer Policy Document
    // TODO: Should not allow access to all (*) resources ... tighten this up
    let policyDocument = generateAwsIamPolicy(crmPrincipalId, applicationConfig, userIdentity, 'Allow')
    
    console.log(JSON.stringify(policyDocument))
    return policyDocument
  }
  catch (err) {
    console.log('OIDC: === Unable to Verify Identity Token ===')
    console.log(err)

    return generateAwsIamDenyPolicy()
  }
}

/**
 * Helper to return a DENY policy 
 * @returns 
 */
let generateAwsIamDenyPolicy = function() {
  let authResponse = {}
  
  authResponse.policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    }
    
    return authResponse
}

/**
 * Creates an IAM Policy document for use in downstream authn/authz requests in lambda, api-gateway, etc.
 * @param {*} principalId 
 * @param {*} effect 
 * @param {*} resource 
 * @returns 
 */
let generateAwsIamPolicy = function(principalId, applicationConfig, userIdentity, effect) {

  let authResponse = {}

  authResponse.principalId = principalId
  
  if (effect) {
    
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*'
          // Resource: resource // DANGER: asterisk means user is authorized to access ALL endpoints. NOT PRODUCTION READY.
        }
      ]
    }

    authResponse.policyDocument = policyDocument
  }

  if (applicationConfig && userIdentity && effect == 'Allow') {
    // Injects some useful metadata about this authenticated user into the request context
    // This is used by the route handlers when calling SalesForce APIs via reverse proxy pattern
    authResponse.context = {
      crm_id: principalId,
      organization_id: applicationConfig.organization_id,
      organization_code: applicationConfig.code,
      organization_name: applicationConfig.name,
      idp_issuer: applicationConfig.identity_provider_config.issuer,
      idp_sub: userIdentity.idp_sub
      // user_identity: userIdentity
    }
  }
  else {
    authResponse.context = {
      crm_id: principalId
    }
  }

  return authResponse
}
