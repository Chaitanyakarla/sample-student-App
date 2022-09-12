const salesforce = require('/opt/nodejs/salesforce');
const db = require('/opt/nodejs/middleware-db')

exports.createAndCacheSalesforceAccessToken = async function(event, context) {

    // Org Codes is a commm-delimited string, e.g. 'rnpdev,maryville,flc'
    let codesString = process.env.ORGANIZATION_CODES
    let organizationCodes = codesString.split(',')

    for (let i = 0; i < organizationCodes.length; i++) {

        let organizationConfig = await db.getOrganizationConfigByCode(organizationCodes[i])

        console.info(`Creating new access token for Organization: [${JSON.stringify(organizationConfig)}]`)
    
        await salesforce.refreshSalesforceAccessTokenCache(organizationConfig)    
    }
}
