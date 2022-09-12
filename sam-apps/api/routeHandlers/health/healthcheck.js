const common = require('/opt/nodejs/common')

exports.check_health = async function(event, context) {

    // TODO: Need additional health checks for downstream dependencies
    let response = {
        "buildVersion": process.env.MIDDLEWARE_API_BUILD_VERSION,
        "dependencies": {
            "database_available": true,
            "cache_available": true,
            "crm_available": true,
            "aws_s3_available": true,
            "aws_secrets_manager_available": true,
            "aws_sqs_available": true
        }
    }

    return common.formatResponse(200, JSON.stringify(response))
}
