const OktaJwtVerifier = require('@okta/jwt-verifier')
const got = require('got')

/**
 * Uses idpConfig to remotely verify access token and return the "sub" from the JWT
 * @param {*} idpConfig 
 * @param {*} accessToken 
 * @returns 
 */
async function getVerifiedSubscriber(idpConfig, accessToken) {

    console.log("Okta: Verifying Token: " + accessToken)

    let oktaJwtVerifier = new OktaJwtVerifier({
        issuer: idpConfig.issuer,
        clientId: idpConfig.client_id
    })

    // TODO Cache the singing key locally to avoid remote calls
    // https://github.com/okta/okta-jwt-verifier-js#caching--rate-limiting
    return  oktaJwtVerifier.verifyIdToken(accessToken, idpConfig.audience)
        .then (jwt => {
            console.debug(`Okta: Verfied JWT Claims: [${JSON.stringify(jwt.claims)}]`)

            // Validating the token requires a few more steps 
            // https://developer.okta.com/docs/guides/validate-id-tokens/main/
            if (jwt.claims.iss != idpConfig.issuer) {
                throw new Error('issuer in JWT does not match expected issuer')
            }
            else if (jwt.claims.aud != idpConfig.audience) {
                throw new Error('audience in JWT does not match expected audience')
            }
            else if ( new Date(jwt.claims.exp) > Date.now()) {
                throw new Error ('token is expired')
            }
            else {
                // This is specific to the Okta JWT
                return jwt.claims.uid
            }
        })
        .catch(err => {
            console.error('Okta: ===== Identity Token Verification Failed ======'  + JSON.stringify(err))
            throw new Error(err.message)
        })
}

/**
 * Uses the idPcoinfig to load the User Identity information assocaited with this accessToken
 * @param {\} idpConfig 
 * @param {*} accessToken 
 * @returns 
 */
async function getRemoteIdentity(idpConfig, accessToken) {

    let url = idpConfig.issuer.endsWith('/') ? `${idpConfig.issuer}v1/userinfo` :  `${idpConfig.issuer}/v1/userinfo`
    
    console.debug('Okta: Retrieving Remote Identity from: ' + url)

    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }

    // console.log('Headers: ' + JSON.stringify(headers))

    let response = await got.get(url, {headers: headers})

    console.debug(`Okta: Loaded remote identity: ${response.body}`)

    return castToUserIdentity(idpConfig, JSON.parse(response.body))
}

/**
 * UserIdentity is designed to be a system-wide class for holding a generic (IDaaS-wide)
 *  version of UserIdentity attributes. This function casts from Okta-specific to generic.
 * @param {*} idpConfig 
 * @param {*} oktaUserIdentity 
 * @returns 
 */
function castToUserIdentity(idpConfig, oktaUserIdentity) {
    
    // TODO: Better error handling here. Lots of assumptions about strucuture of JWT
    return {
        firstName: oktaUserIdentity.given_name,
        lastName: oktaUserIdentity.family_name,
        email: oktaUserIdentity.email,
        idpIdentityJson: JSON.stringify(oktaUserIdentity),
        idpSubscriber: oktaUserIdentity.sub,
        crmPrincipalId: oktaUserIdentity[idpConfig.crm_id_attribute]
    }
}

module.exports = {
    getVerifiedSubscriber,
    getRemoteIdentity
}