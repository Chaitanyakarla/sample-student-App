const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const common = require('/opt/nodejs/common');
const salesforce = require('/opt/nodejs/salesforce');
const db = require('/opt/nodejs/middleware-db');
const awsFuncs = require('/opt/nodejs/aws-functions');

/**
 * A PATCH is used to initiate the Doc Upload process to SalesForce via a command message 
 * an AWS SQS queue.
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 */
exports.lambdaHandler = async (event, context) => {

  console.debug("## EVENT " + JSON.stringify(event))

  common.fixHeaders(event)

  const validInputs = [
    "ACCEPT",
    "DECLINE",
    "ACKNOWLEDGE",
    "SUBMIT",
    "SELF_COMPLETE"
  ]

  let patchAction = JSON.parse(event.body).action
  if ( patchAction && patchAction.length > 0 && typeof patchAction == 'string' && validInputs.includes(patchAction)) console.info("action=getPatchAction, success=true, patchAction=" + patchAction)
  else {
    console.error("action=getPatchAction, success=false")
    return common.formatResponse(400, JSON.stringify({message: "invalid action provided"}))
  }

  // let taskId = event.pathParameters.taskId
  // if ( taskId && taskId.length > 0 && typeof taskId == 'string') console.info("action=getTaskId, success=true, id=" + taskId)
  // else {
  //   console.error("action=getTaskId, success=false")
  //   return common.formatResponse(400, JSON.stringify({message: "\"taskId\" not provided"}))
  // }
  let userId = common.getUserId(event)
  if ( userId && userId.length > 0) console.info("action=getUserId, success=true, id=" + userId)
  else {
    console.error("action=getUserId, success=false")
    return common.formatResponse(400, JSON.stringify({message: "\"userId\" not provided"}))
  }

  let apiKey = common.getApiKey(event)
  console.info("action=getApiKey, success=true, apiKey=" + apiKey)

  let filesPresent = checkForFiles(event)

  let applicationConfig = await db.getApplicationConfigByApikey(apiKey)
  console.info("action=getApplicationConfigByApiKey, success=true, config=" + JSON.stringify(applicationConfig))

  // let apiReqs = await common.getFromCache(`${apiKey}:api_requirements`)
  // if (apiReqs != null) {
  //   console.debug("## RETURNING FROM CACHE ##")
  //   apiReqs = JSON.parse(apiReqs)
  // } else {
  //   console.debug("## NO CACHED REQUIREMENTS ##")
  //   apiReqs = await common.getApiRequirements(apiKey)
  //   await common.setInCache(`${apiKey}:api_requirements`, JSON.stringify(apiReqs), {EX: 3600})
  // } 
  // let endpoint = apiReqs.requirements.endpoint
  let taskFiles, keys
  if (filesPresent == "true") {
    // trigger the upload process
    console.debug("sending document upload message to queue")
    sendDocumentUploadCommandEvent(apiKey, userId, taskId)
    console.debug("getting files from s3 prefix=" + `students/${userId}/tasks/${event.pathParameters.taskId}/files/`)
    taskFiles = await awsFuncs.listAllFiles(process.env.TASK_DOCUMENT_STORAGE, `students/${userId}/tasks/${event.pathParameters.taskId}/files/`).promise()
    keys = (await taskFiles).Contents.map(x => {
      return { fileName: x.Key.split("files/")[1], fileSize: x.Size }
    })
    console.info("action=createUploadsArray, success=true, uploads=" + JSON.stringify(keys))
  }

  // switch(apiReqs.integration) {
  //   case 'salesforce':
      endpoint = `${applicationConfig.crm_config.domain}/services/apexrest/rnpedu/v1/students/${userId}/tasks/${taskId}`
      let params = {
        // access_token: apiReqs.requirements.credentials.access_token,
        data: {
          action: patchAction
        }
      }
      console.debug("sending salesforce patch endpoint=" + endpoint + ", params=" + JSON.stringify(params))
      let sfResponse = await salesforce.patch(applicationConfig, endpoint, params)
      let response = JSON.parse(sfResponse.body)
      console.info("action=patchSalesforce, success=true, response=" + JSON.stringify(response))
      console.debug("adding the uploads to the response object")
      response.request.uploads = keys

      return common.formatResponse(sfResponse.statusCode, JSON.stringify(response))

    // default:
    //   console.info("action=getApiIntegration, success=false, integration=" + apiReqs.integration)
    //   throw new Error("invalid api integration")
  // }
};

/**
 * Sends event to SQS for downstream processing
 * @param {*} event 
 * @param {*} task 
 */
var sendDocumentUploadCommandEvent = async function(apiKey, userId, taskId) {
  console.info("action=sendingUploadCommandEvent")
  let queueUrl = process.env.STUDENT_TASK_QUEUE_URL;
  console.log('action=getQueueURL, url=' + queueUrl)

  let messageBody = {
    apiKey: apiKey,
    crmUserId: userId,
    taskId: taskId,
    timestamp: Date.now()
  }

  console.info('action=sendingToQueue, message=' + JSON.stringify(messageBody) + ', url=' + queueUrl)

  // put message on queue for processing
  let messageParams = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: queueUrl
  }

  // The doc upload process is handled async and triggered via this event
  await sqs.sendMessage(messageParams).promise()
}

var checkForFiles = function(event) {
  let queryParams = event.queryStringParameters
  console.debug("checking for files")
  if (queryParams !== null) {
    console.info("action=checkingForFiles, files=" + queryParams['upload'])
    return queryParams['upload']
  }
}