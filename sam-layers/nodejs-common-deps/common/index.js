const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const redis = require('redis')

/**
 * There exists some weird behavior in AWS where at least 2 HTTP Headers (X-Api-Key and X-User-Id)
 * are converted to all lower case. This differs from how local development works in docker.
 * Regardless, we need this hack in place until the issue is addressed somewhere.
 * See this link for more info => https://github.com/aws/aws-sam-cli/issues/1860
 * @param {*} event 
 */
var fixHeaders = function(event) {
  for (header in event.headers) {
      event.headers[header.toLowerCase()] = event.headers[header]
  }
}
  
/**
 * Convenience method for obtaining the apikey from the request
 * @param {*} event 
 * @returns The apikey from http headers, originally stored in HTTP headers at X-Api-Key
 */
var getApiKey = function(event) {

  // console.debug("Looking for apikey from: " + JSON.stringify(event))
  
  let apiKey;

  if (event.headers["x-api-key"] && ("x-api-key" in event.headers)) {
      apiKey = event.headers["x-api-key"]
  }
  else {
      throw new Error("action=getApiKey, success=false, reason=no x-api-key in http headers")
  }
  console.info("action=getApiKey, success=true, api_key=" + apiKey)
  return apiKey  
}

var getAccessToken = function(event) {

  let authorizationHeader = event.headers['authorization']

  let token = authorizationHeader.replace('Bearer ', '')

  return token;
}


/**
 * Pull the Student's ID which is institution-specific
 * @param {*} event 
 * @returns The students CRM ID (which could be an email, or an integer, or alphanumeric) 
 */
var getUserId = function(event) {

  // console.debug("Looking for userid from: " + JSON.stringify(event))

  if ( ! event.requestContext.hasOwnProperty('authorizer') ) {
    throw new Error('action=getStudentId, success=false, reason=Request did not include authorizer')
  }
  if ( ! event.requestContext.authorizer.hasOwnProperty('crm_id') ) {
    throw new Error('action=getStudentId, success=false, reason=Request Authorizer did not contain a crm_id')
  }
  
  console.info("action=getUserId, success=true, userId=" + event.requestContext.authorizer.crm_id)
  return event.requestContext.authorizer.crm_id
}

/**
 * Load Salesforce configuration based on Institution
 * @param {*} event 
 * @returns 
 */
var getApiRequirements = async function(api_key) {
  console.debug("action=gettingApiRequirements")
  // Load instition for this apikey
  let invokeArgs = {
    FunctionName: process.env.CONFIG_MANAGER,
    Payload: JSON.stringify({
      action: "get-api-requirements",
      api_key: api_key
    })
  }

  const invokeResult = await lambda.invoke(invokeArgs).promise()
  const successfulInvoke = ! invokeResult.hasOwnProperty("FunctionError")
  if ( ! successfulInvoke ) throw new Error("action=getApiReqs, success=false")

  let apiRequirements = JSON.parse(invokeResult.Payload)
  console.debug("action=getApiRequirements, success=true, apiRequirements=" + JSON.stringify(apiRequirements))

  return apiRequirements

}

var formatResponse = function(code, body){
  var response = {
    "statusCode": code,
    "headers": {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PATCH,DELETE",
      "Access-Control-Allow-Headers": "X-Api-Key, Authorization, Content-Type"
    },
    "isBase64Encoded": false,
    "body": body
  }
  return response
}

var formatError = function(code, message) {
  let response = {
    "statusCode": code,
    "headers": {
      "Content-Type": "application/json",
    },
    "body": message
  }
  return response
}

var serialize = function(object) {
  return JSON.stringify(object, null, 2)
}

var getErrorCode = function(err) {
  let errRegex = new RegExp(/[\d+]+/g)
  return parseInt(errRegex.exec(err))
}

var generateQueryStringParams = function(params) {
  if (Object.keys(params)[0] != null) {
    let first = Object.keys(params)[0]
    let paramString = `${first}=${params[first]}`
    if (Object.keys(params).length > 1) {
      for (let i = 1; i < Object.keys(params).length; i++) {
        const current = Object.keys(params)[i]
        paramString += `&${current}=${params[current]}`
      }
    } 
    console.debug('action=generateQueryStringParams, success=true, params=' + paramString)
    return paramString
  } else {
    console.debug('action=generateQueryStringParams, success=false')
    return null
  }
}

// ** get a key from the redis cache ** //
const getFromCache = async (key) => {

  console.debug(`Checking cache for: [${key}]`)

  const client = await redis.createClient({url: `redis://${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`})
  await client.connect()
  console.debug("action=getFromCache, connection=success, key=" + key)
  
  let cachedValue = await client.get(key)

  if (cachedValue) {
    console.debug(`Cache Hit: [${key}], [${cachedValue}]`)
  }
  else {
    console.debug(`Cache Miss: [${key}]`)
  }

  return cachedValue
}

const setInCache = async (key, val, options) => {

  console.debug(`Caching: [${key}], [${val}]`)

  const client = await redis.createClient({url: `redis://${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`})
  await client.connect()
  if (typeof val != "string") {
    val = JSON.stringify(val)
  }
  console.debug("action=settingInCache, connection=success, key=" + key + ", val=" + val, options)
  return client.set(key, val)
}

const flushCache = async () => {
  console.log("## Flushing Redis Cache ##")
  const client = await redis.createClient({url: `redis://${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`})
  await client.connect()
  return await client.FLUSHALL('ASYNC')
}

module.exports = {
    fixHeaders,
    getApiKey,
    getApikey: getApiKey,
    getAccessToken,
    getUserId,
    getApiRequirements,
    formatResponse,
    formatError,
    generateQueryStringParams,
    serialize,
    getErrorCode,
    getFromCache,
    setInCache,
    flushCache
}