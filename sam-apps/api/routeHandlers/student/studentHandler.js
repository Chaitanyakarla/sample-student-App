const AWS = require('aws-sdk')
const multipart = require('lambda-multipart-parser');
const salesforce = require('/opt/nodejs/salesforce');
const common = require('/opt/nodejs/common');
const db = require('/opt/nodejs/middleware-db');

// Create client outside of handler to reuse
const s3 = new AWS.S3();

// How long to cache studsent data in elasticache?
const DEFAULT_CACHE_EXPIRATION = 43200

// Handler
exports.getStudentsInfo = async function(event, context) {
  // console.info('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
  // console.info('## CONTEXT: ' + JSON.stringify(context))
  // console.info('## EVENT: ' + JSON.stringify(event));
  
  let response
  common.fixHeaders(event)
  let cachingEnabled = true

  // fix the headers and check for x-api-key presence
  let api_key = common.getApiKey(event);
  console.info("action=getApiKey, success=true, apiKey=" + api_key)

  // get studentId
  const studentId = common.getUserId(event);
  const config = await db.getApplicationConfigByApikey(api_key)
  if (config == undefined) console.error("action=getConfigByApiKey, success=false")
  else console.info("action=getConfigByApiKey, success=true, config=" + JSON.stringify(config))
  if ( ! config.options.caching.enabled ) {
    cachingEnabled = false
  } 
  console.info("action=getCachingState, caching=" + cachingEnabled)

  // generate the url
  let url = `${config.crm_config.domain}/services/apexrest/rnpedu/v1/students/${studentId}/`
  console.info("action=buildingURl, integration=" + config.crm_config.type)

  // setup the parameters for any event.body passed to the API
  const params = {
    data: ''
  }
  if (event.body) {
    params.data = event.body
  }

  switch (event.resource) {

    ////////////////// ACADEMIC TERMS //////////////////
    case '/students/me/academicTerms':
      // check cache
      let cachedTerms = await common.getFromCache(`${studentId}:academicTerms`)
      if ( cachedTerms != null && cachingEnabled ) {
        console.debug("## RETURNING FROM CACHE ##")
        response = {results: JSON.parse(cachedTerms)}
        console.info("action=getAcademicTermsFromCache, success=true, terms=", JSON.stringify(response))
        return common.formatResponse(200, JSON.stringify(response))
      }
      if (!!event.queryStringParameters) url += `academicTerms?${common.generateQueryStringParams(event.queryStringParameters)}`
      else url += `academicTerms`
      break

    ////////////////// PROFILE //////////////////
    case '/students/me/profile':
      // check cache
      if (cachingEnabled) {
        let cachedProfile = await common.getFromCache(`${studentId}:profile`)
        if ( cachedProfile != null ) {
          console.debug("## RETURNING FROM CACHE ##")
          response = JSON.parse(cachedProfile)
          console.info("action=getProfileFromCache, success=true, profile=", JSON.stringify(response))
          return common.formatResponse(200, JSON.stringify(response))
        }
      }
      url += 'profile'
      break

    ////////////////// SUCCESS CONTACTS //////////////////
    case '/students/me/successContacts':
      
      return common.formatResponse(200, JSON.stringify(await salesforce.getStudentSuccessContacts(config, studentId)))

    ////////////////// TASKS //////////////////
    case '/students/me/tasks':
      if (!!event.queryStringParameters) url += `tasks?${common.generateQueryStringParams(event.queryStringParameters)}`
      else url += `tasks`
      await salesforce.generateSalesforceParams(params, studentId)
      console.info("action=generateFileKeys, success=true, params.files=" + JSON.stringify(params.files))
      break
      
      ////////////////// TASK //////////////////
      case '/students/me/tasks/{taskId}':
        url += `tasks/${event.pathParameters.taskId}`
        // check if there are files in s3, get there names to add to params
        await salesforce.generateSalesforceParams(params, studentId)
        if (params.files.length > 0) console.info("action=generateFileKeys, success=true, params.files=" + JSON.stringify(params.files))
        else console.info("action=generateFileKeys, success=true, files=noFilesFound")
      break
      
    
    case '/students/me/tasks/{taskId}/files':
      switch(event.httpMethod) {

        case 'POST':   ////////////////// TASK DOCUMENT UPLOAD //////////////////

          let uploadFile
          if (event.headers['content-type'].indexOf('multipart/form-data') != -1) {
            console.debug('Parsing multpart/form-data...')
            const result = await multipart.parse(event)
            console.info('action=getMultipartData, success=true')
            uploadFile = result.files[0]
          } 
          // this should only be needed if we switch to a binary upload system, currently all apps utilize multipart/form-data
          // else {
          //   console.info('setting=binaryUpload status=creating buffer')
          //   uploadFile = {}
          //   uploadFile.content = Buffer.from(event.body, 'base64')
          //   uploadFile.filename = event.queryStringParameters['fileName']
          //   console.info('action=getUploadfile, success=true')
          // }
          
          // store the file in s3
          let taskBucket = process.env.TASK_DOCUMENT_STORAGE
          await s3.putObject({Bucket: taskBucket, Key: `students/${studentId}/tasks/${event.pathParameters.taskId}/files/${uploadFile.filename}`, Body: uploadFile.content }).promise()
          
          return common.formatResponse(200, JSON.stringify({
            message: "successfully uploaded file"
          }))

        case 'DELETE': /////////////////// TASK DOCUMENT DELETE //////////////////////

          if ( ! event.queryStringParameters || ! event.queryStringParameters["doc"] || event.queryStringParameters["doc"].length == 0 ) {
            console.error("action=getDocName, success=false")
            return common.formatResponse(400, JSON.stringify({message: "query string \"doc\" is required"}))
          }
          let docId = event.queryStringParameters["doc"]
          let key = `students/${studentId}/tasks/${event.pathParameters.taskId}/files/${docId}`
          console.info("action=deletingS3File, key=" + key)
          await s3.deleteObject({Bucket: process.env.TASK_DOCUMENT_STORAGE, Key: key}).promise()

          return common.formatResponse(200, JSON.stringify({message: "successfully deleted file"}))

        default:

          console.error('action=getHttpMethod, success=false')
          return common.formatResponse(400, JSON.stringify({message: "invalid http method"}))

      }

    default:
      console.error('action=generateEndpoint, success=false')
      return common.formatResponse(400, JSON.stringify({message: "invalid endpoint"}))

  }

  console.info('action=generateUrl, success=true, result=' + url)

  try {
    // make the call
    switch (event.httpMethod) {
      case 'GET':
        response = await salesforce.get(config, url, params)
        break
      case 'PATCH':
        response = await salesforce.patch(config, url, params)
        break
      case 'POST':
        // currently the only post will not get here, as it is all handled above in the endpoint handler
        response = await salesforce.post(config, url, params)
        break
      default:
        response = null
    }
    // break
  } catch(err) {
    console.error(err.message)
    response = common.formatError(common.getErrorCode(err), err.message)
  }

  if ( cachingEnabled ) {

    let cacheExpiration 

    switch (event.resource) {

      case '/students/me/academicTerms':
        console.debug("caching academic terms")
        // Read cache expiration from config
        cacheExpiration = config.options.caching.student_course_list_expiration ?
          config.options.caching.student_course_list_expiration : DEFAULT_CACHE_EXPIRATION

        await common.setInCache(`${studentId}:academicTerms`, response.body, {EX: cacheExpiration})
        console.info("action=cachingAcademicTerms, success=true")
        break

      case '/students/me/profile':
        console.debug("caching profile")
        // Read cache expiration from config
        cacheExpiration = config.options.caching.student_profile_expiration ?
          config.options.caching.student_course_list_expiration : DEFAULT_CACHE_EXPIRATION

        await common.setInCache(`${studentId}:profile`, response.body, {EX: 86400})
        console.info("action=cachingProfile, success=true")
        break

      default:
        break
    }
  }
  // format for multiple objects within a results array
  console.info("action=getResponseObject, response=" + JSON.stringify(response.body))
  if (response.hasOwnProperty('statusCode') && response.statusCode != 200) {
    console.error("info=responseIsAnError")
    return response
  }
  if (typeof response == 'object') {
    console.info('action=getResponse, success=true')
    console.debug("info=responseIsObject, length=" + response.body.length)
    if (JSON.parse(response.body).length != undefined) { // array 
      console.debug("info=responseIsArray")
      response = { results: JSON.parse(response.body) }
    } else {
      response = JSON.parse(response.body)
    }
  }
  else {
    console.error('action=getResponse, success=false')
    return common.formatResponse(500, JSON.stringify({message: "invalid database response"}))
  }

  // return response to the front-end
  
  console.info("info=gotToResponse, response=" + JSON.stringify(response))
  return common.formatResponse(200, JSON.stringify(response))  
  
}
