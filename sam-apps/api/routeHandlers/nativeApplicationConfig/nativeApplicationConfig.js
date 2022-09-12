var aws = require('aws-sdk');
const s3 = new aws.S3()

const common = require('/opt/nodejs/common');
const middlewaredb = require('/opt/nodejs/middleware-db');

/**
 * Loads the config specific to this Application based on the X-Api-Key header.

 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * Response is loosely typed to whatever document is in storage at: S3_Bucket/clientapps/{apikey}/config.json
 */
exports.lambdaHandler = async (event, context) => {

    common.fixHeaders(event)
    const apikey = common.getApiKey(event)

    try {
        console.debug(JSON.stringify(event));

        if (!apikey || apikey === undefined) {
            response = {
                'statusCode': 403
            }
        }
        else {
            console.info('action=loadingConfigFromApiKey, apikey=[ ' + apikey + ' ]');

            let applicationConfig = await middlewaredb.getApplicationConfigByApikey(apikey)

            if (applicationConfig) {
                console.debug(`CONFIG: Successfully loaded ApiConfig: ${JSON.stringify(applicationConfig)}`)
        
                response = {
                    'statusCode': 200,
                    'body': JSON.stringify(applicationConfig.native_app_config)
                }
            }
            else {
                response = {
                    'statusCode': 404,
                    'body':''
                }
            }
        }
    } catch (err) {
        console.error(err);
        return err;
    }

    return response
};