const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')
const util = require('util')
const got = require('got')

module.exports = {
  getVerifiedSubscriber,
  getRemoteIdentity
}
/**
 * Uses the third-party IdP in idpConfig to verify the access token and returns the "sub" from the JWT
 * @param {*} idpConfig 
 * @param {*} accessToken 
 * @returns 
 */
async function getVerifiedSubscriber(idpConfig, accessToken) {

  console.log("AUTH0: Verifying Subscriber against :[" + idpConfig.issuer)

  const decodedToken = decodeToken( accessToken )
  console.log( 'action=decode-auth0-token success=true' )
  console.log('AUTH0: token payload: ' + JSON.stringify(decodedToken))

  // ensure token hasn't been tampered with
  // TODO: Need to cache this key locally to avoid remote calls to Auth0
  const signingKey = await getSigningKey( idpConfig.issuer, decodedToken.header.kid )

  verifyToken( accessToken, signingKey, idpConfig.issuer, idpConfig.audience )

  console.log( 'action=verify-token-signature success=true' )

  let idpSub = decodedToken.payload.sub
  
  console.debug('AUTH0: idpSub: ' + idpSub)
  return idpSub
}

function decodeToken( encodedToken ){
  return jwt.decode( encodedToken, { complete: true })
}

function verifyToken( encodedToken, signingKey, issuer, audience ){
  
  return jwt.verify( encodedToken, signingKey, { issuer: issuer, audience })
}

async function getSigningKey( issuer, keyId ){

  let jwksUri = issuer + `.well-known/jwks.json`
  console.debug ('AUTH0: Using Key URI: ' + jwksUri)

  const jwksClient = jwks({jwksUri: jwksUri})

  // console.debug('Getting Signing Key')
  const getJwtSigningKey = util.promisify( jwksClient.getSigningKey )

  const getSigningKeyResponse = await getJwtSigningKey( keyId )
  // console.log ('Got signing key response')

  const signingKey = getSigningKeyResponse.publicKey || getSigningKeyResponse.rsaPublicKey

  return signingKey
}

async function getRemoteIdentity( idpConfig, accessToken ){

  let url = idpConfig.issuer.endsWith('/') ? `${idpConfig.issuer}userinfo` :  `${idpConfig.issuer}/userinfo`

  console.debug('AUTH0: Retrieving remote identity from : ' + url)

  const response = await got.get(url, {
    headers: {
      'authorization': 'Bearer ' + accessToken
    },
    responseType: 'json'
  })

  return castToUserIdentity(idpConfig, response.body)
}

/**
 * UserIdentity is designed to be a system-wide class for holding a generic (IDaaS-wide)
 *  version of UserIdentity attributes. This function casts from Okta-specific to generic.
 * @param {*} idpConfig 
 * @param {*} oktaUserIdentity 
 * @returns 
 */
 function castToUserIdentity(idpConfig, auth0UserIdentity) {
    
  // TODO Better error handling here. This makes a lot of assumptions about the structure of the JWT
  return {
      firstName: auth0UserIdentity.name.split(' ')[0],
      lastName: auth0UserIdentity.name.split(' ')[1],
      email: auth0UserIdentity.email,
      idpIdentityJson: JSON.stringify(auth0UserIdentity),
      idpSubscriber: auth0UserIdentity.sub,
      crmPrincipalId: auth0UserIdentity[idpConfig.crm_id_attribute]
  }
}