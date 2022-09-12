const AWS = require('aws-sdk')
const s3 = new AWS.S3()

// Usage:
// let files = require('/opt/nodejs/aws-functions').listAllFiles(bucket, prefix).promise()
// this will return a files object
// {
//      IsTruncated: false,
//      Marker: '',
//      Contents: [
//          {
//          Key: <String>,
//          LastModified: <String>,
//          ETag: <String>,
//          Size: <Int>,
//          StorageClass: <String>,
//          Owner: [Object]
//          },
//          {
//              ...
//              ...
//          }
//      ],
//      Name: 'upload-s3-josh-middlewareap-documentuploadstorage-1umgtqa4c5ez1',
//      Prefix: 'students/joshua.upton@robotsandpencils.com/tasks/00T5e00000N3F5VEAV/files/',
//      MaxKeys: 1000,
//      CommonPrefixes: []
// }
let listAllFiles = (bucket, prefix) => {
    return s3.listObjects({Bucket: bucket, Prefix: prefix})
}


// Usage:
// let file = require('/opt/nodejs/aws-functions').getFile(bucket, key).promise()
// this will return a file object
// {
//     AcceptRanges: <String>,
//     LastModified: <String>,
//     ContentLength: <Int>,
//     ETag: <String>,
//     VersionId: <String>,
//     ContentType: <String>,
//     ServerSideEncryption: <String>,
//     Metadata: <Object>,
//     Body: <Buffer>
// }
let getFile = (bucket, key) => {
    return s3.getObject({Bucket: bucket, Key: key})
}

let purgeStudentTaskDocuments = async (bucket, prefix) => {
    // first get all the objects within a bucket at the prefix specified
    console.info(`action=purgingTaskDocuments, bucket=${bucket}, folder=${prefix}`)
    let allFiles = await s3.listObjects({Bucket: bucket, Prefix: prefix}).promise()
    let files = (await allFiles).Contents
    let deleteObjects = {
        Objects: []
    }
    for (file of files) {
        deleteObjects.Objects.push({Key: file.Key})
    }
    if (deleteObjects.Objects.length > 0) {
        let params = {
            Bucket: bucket,
            Delete: deleteObjects
        }
        let s3Delete = await s3.deleteObjects(params).promise()
        let deleted = (await s3Delete).Deleted
        console.debug(`Deleted: ${JSON.stringify(deleted)}`)
    }
}

module.exports = {
    listAllFiles,
    getFile,
    purgeStudentTaskDocuments
}