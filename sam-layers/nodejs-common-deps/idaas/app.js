const okta = require('./okta')
const auth0 = require('./auth0')

/**
 * Uses the Organization-specific setup (provided by idpConfig) to determine which IdP
 * to authenticate the user (accessToken) against
 * @param {*} idpConfig Determines how the verification process should behave
 * @param {*} accessToken Bearer Token to verify
 * @returns The identity of the principal to which this (valid) accessToken belongs,
 * e.g. "student@university.edu"
 */
async function getVerifiedIdpSubscriber(idpConfig, accessToken) {

    console.debug ('Verifying token against: [' + idpConfig.issuer + ']')

    // let idp
    let idpSub

    // Time it and log it for auditting performance characteristics
    let start = Date.now()
    switch (idpConfig.type) {
        
        case 'okta':
            console.debug(' _____ OKTA')
            idpSub = await okta.getVerifiedSubscriber(idpConfig, accessToken)
            break

        case 'auth0':
            console.debug(' _____ AUTHO')
            idpSub = await auth0.getVerifiedSubscriber(idpConfig, accessToken)
            break

        default:
            throw new Error('Unknown Federated Identity Provider: ' + idpConfig) 
    }

    // let verifiedSubscriber = await idp.getVerifiedSubscriber(idpConfig, accessToken)
    let duration = ((Date.now() - start)/1000)

    console.log(`===== Identity Token Verification Success for [${idpSub}] against [${idpConfig.issuer}] took [${duration}] seconds =====`)

    return idpSub
}

/**
 * Makes a remote call to the IdP to retrieve the User Identity (user info) held by this (valid) token
 * @param {*} idpConfig 
 * @param {*} accessToken 
 * @returns 
 */
async function getRemoteUserIdentity(idpConfig, accessToken) {

    console.debug ('Retrieving remote user identity against: [' + idpConfig.issuer + ']')

    let idp

    switch (idpConfig.type) {
        case 'okta':
            idp = okta
            break
        case 'auth0':
            idp = auth0
            break
        default:
            throw new Error('Unknown Federated Identity Provider: '+ idpConfig.type)
    }

    // Time it and log it for auditting performance characteristics
    let start = Date.now()
    let remoteIdentity = await idp.getRemoteIdentity(idpConfig, accessToken)
    let duration = ((Date.now() - start)/1000)

    console.log(`===== Loading Remote Identity User Info against [${idpConfig.issuer}] took [${duration}] seconds =====`)

    console.debug(`Remote Identity = ${JSON.stringify(remoteIdentity)}`)
    
    return remoteIdentity
}

// function verifyAccessToken(idpConfig, accessToken) {

//     let tokenVerifier;

//     switch (idpConfig.type) {
//         case 'okta':
//             tokenVerifier = okta
//             break
//         case 'auth0':
//             tokenVerifier = auth0
//             break
//         default:
//             throw new Error('Unknown Federated Identity Provider: ' + idpConfig)
//     }

//     return tokenVerifier.verifyAccessToken(accessToken)
// }

// function getSubjectFromToken(idpConfig, jwt) {

//     switch (idpConfig.type) {
//         case 'okta':
//             return jwt.claims.sub
//         case 'auth':
//             return jwt
//         default:
//             throw new Error ('Unknown IdP Config: ' + idpConfig)
//     }
// }

module.exports = {
    getVerifiedIdpSubscriber,
    getRemoteUserIdentity
}