const common = require('/opt/nodejs/common')

exports.lambdaHandler = async (event, context) => {

    // Load user idenity from Context (which was placed there by the Authorizer)
    return common.formatResponse(200, JSON.stringify(event.requestContext.authorizer))  
};