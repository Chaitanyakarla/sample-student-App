const salesforce = require('/opt/nodejs/salesforce');
const functions = require('/opt/nodejs/aws-functions');
const common = require('/opt/nodejs/common');
const db = require('/opt/nodejs/middleware-db')

exports.processSQSMessage = async function(event, context) {

    console.info('action=processSQSMessage, success=true, result=' + JSON.stringify(event));
    let record = event.Records[0]
    const {body} = record;
    const json = JSON.parse(body);

    if (json.taskId) console.info('action=getTaskId, success=true, bucket=' + json.taskId);
    else {
      console.error('action=getTaskId, success=false');
      return common.formatResponse(400, "invalid task id")
    }
    if (json.crmUserId) console.info('action=getUserId, success=true, prefix=' + json.crmUserId);
    else {
      console.error('action=getUserId, success=false');
      return common.formatResponse(400, "invalid user id")
    }

    if (json.apiKey) console.info('action=getApiKey, success=true, token: ' + json.apiKey)
    else {
      console.error('action=getApiKey, success=false')
      return common.formatResponse(400, "invalid api key")
    }

    if (json.timestamp) console.info("action=getTimestamp, success=true, result=" + json.timestamp)
    else console.error("action=getTimestamp, success=false")

    let config = await db.getApplicationConfigByApikey(json.apiKey)

    // get the api requirements from the config manager
    // const apiReqs = await common.getApiRequirements(json.apiKey)
    // if (apiReqs.requirements.endpoint == undefined || apiReqs.requirements.endpoint == null || apiReqs.requirements.endpoint == '') throw new Error('action=getApiReqs, success=false')
    // else console.info('action=getApiReqs, success=true, endpoint=' + apiReqs.requirements.endpoint)
    
    let totalFiles;
    let totalUploads = 0
    // get any files from s3 that correspond to the provided student
    let fileRecords = functions.listAllFiles(process.env.TASK_DOCUMENT_STORAGE, `students/${json.crmUserId}/tasks/${json.taskId}/files`).promise()
    // for each file in the records, go through and upload to SF
    // if the upload is successful add to the fileUploads counter
    let files = (await fileRecords).Contents
    console.info('action=getFiles, success=true')
    totalFiles = files.length

    let params = {
      // access_token: apiReqs.requirements.credentials.access_token,
      data: JSON.stringify({
        fileCount: totalFiles
      })
    }
    console.info("action=gettingIntegration, integration=" + config.crm_config.type)
    switch(config.crm_config.type) {
      case 'salesforce':
        // POST /services/apexrest/rnpedu/v1/students/:studentID/tasks/:taskID/submissions/
        // Body: { fileCount: :files.length }
        let url = `${config.crm_config.domain}/services/apexrest/rnpedu/v1/students/${json.crmUserId}/tasks/${json.taskId}/submissions/`

        let submissionEvent = await salesforce.post(config, url, params)
    
        if ( ! submissionEvent.hasOwnProperty('body')) {
          console.error('action=getSubmissionEvent, success=false')
          // retry submission?
        }
        console.info("action=getSubmissionEvent, success=true, event=" + submissionEvent.body)

        submissionEvent = JSON.parse(submissionEvent.body)
        console.info("action=convertingSubmissionEvent, success=true")

        // if the submission event is returned, we can now start the file upload TO the submission event
        for (file of files) {
          let fileKey = file.Key.split("files/")[1] // get the filename from the key
          console.info("action=getFileKey, success=true, key=" + fileKey)

          let fileObject = functions.getFile(process.env.TASK_DOCUMENT_STORAGE, file.Key).promise() // go and get the actual file data from s3
          console.info("action=getIntegration, success=true, integration=" + config.crm_config.type)
          
          let sfResponse = await salesforce.post(config, 
            `${config.crm_config.domain}/services/apexrest/rnpedu/v1/students/${json.crmUserId}/tasks/${json.taskId}/submissions/${submissionEvent.id}/files?fileName=${fileKey}`, 
            { data: (await fileObject).Body})
            
          console.info("action=getSfResponseStatus, status=" + sfResponse.statusCode)
          console.info("action=getSfResponseBody, body=" + JSON.stringify(sfResponse.body))

          if (sfResponse.statusCode == 200) {
          totalUploads++
            console.info("action=uploadFileToSalesforce, success=true, uploads=" + totalUploads + "/" + totalFiles)
          } else {
            console.error("action=uploadFileToSalesforce, success=false, filename=" + fileKey)
          }
        }
        break;
      default:
        break;
    }
    // if all files have successfully uploaded send the patch request to salesforce
    if (totalUploads == totalFiles) {

      console.info("action=uploadAllFiles, success=true, files=" + totalUploads + "/" + totalFiles)
      response = common.formatResponse(200, `successfully uploaded ${totalUploads}/${totalFiles}`)

      // purge the s3 documents for this task
      let prefix = `students/${json.crmUserId}/tasks/${json.taskId}/files/`
      try {
        await functions.purgeStudentTaskDocuments(process.env.TASK_DOCUMENT_STORAGE, prefix)
      } catch (err) {
        console.error(err)
      }

    } else {

      // one or more of the files did not successfully upload to salesforce
      console.error("action=uploadAllFiles, success=false")
      // this is going to need to be a 200 to end the queue uploading the working files
      response = common.formatResponse(200, `error uploading one or more of the files, successfully uploaded ${totalUploads}/${totalFiles}`)

    }

    return response
}