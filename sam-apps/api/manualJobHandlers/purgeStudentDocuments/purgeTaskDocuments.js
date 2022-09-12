const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function(event, context) {
    let action = event.action
    let student = event.student
    let task = event.task
    if ( ! action || ! action.length > 0 || ! typeof action == 'string') throw new Error("property \"action\" must be provided")
    if ( ! student || ! student.length > 0 || ! typeof student == 'string') throw new Error("property \"student\" must be provided")
    if ( ! task || ! task.length > 0 || ! typeof task == 'string') throw new Error("property \"task\" must be provided")

    let bucketName = process.env.TASK_DOCUMENT_STORAGE
    if ( ! bucketName || ! bucketName.length > 0 || ! typeof bucketName == 'string') throw new Error("error getting bucket name from the environment variables")
    
    let prefix = `students/${student}/tasks/${task}/`

    // get all the files in the bucket with the prefix students/{studentID}/tasks/{taskID}/files/
    let response = s3.listObjects({ Bucket: bucketName, Prefix: prefix }).promise()
    // get the file keys
    let files = (await response).Contents
    // build the array of keys
    let deleteObjects = {
        Objects: []
    }
    for (file of files) {
        console.debug("action=deletingFile, file=" + file.Key)
        deleteObjects.Objects.push({Key: file.Key})
    }
    if (deleteObjects.Objects.length > 0) {
        let params = {
            Bucket: bucketName,
            Delete: deleteObjects
        }
    
        response = s3.deleteObjects(params).promise()
    } else {
        response = {
            statusCode: 404,
            body: "no files found for that task"
        }
    }
    

    return response
}