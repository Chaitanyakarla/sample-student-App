const common = require('/opt/nodejs/common');

exports.handler = async (event, context) => {
    try {
        let response = await common.flushCache()
        console.log(response)
        if (response == "OK") {
            console.log("flushed redis cache")
            return common.formatResponse(200, JSON.stringify({
                message: response
            }))
        } else {
            return common.formatResponse(200, JSON.stringify({message: "failed"}))
        }
    } catch (err) {
        return common.formatError(common.getErrorCode(err), err.message)
    }
}