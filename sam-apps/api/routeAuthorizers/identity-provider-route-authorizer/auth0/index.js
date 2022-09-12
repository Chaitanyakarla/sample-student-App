const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')
const util = require('util')
const got = require('got')

module.exports = {
  decodeToken,
  verifyToken,
  getSigningKey,
  getIdentityToken
}

function decodeToken( encodedToken ){
  return jwt.decode( encodedToken, { complete: true })
}

function verifyToken( encodedToken, signingKey, domain, audience ){
  return jwt.verify( encodedToken, signingKey, { issuer: 'https://'+ domain + '/', audience })
}

async function getSigningKey( domain, keyId ){
  const jwksClient = jwks({
    jwksUri: 'https://'+ domain + '/.well-known/jwks.json'
  })

  const getJwtSigningKey = util.promisify( jwksClient.getSigningKey )
  const getSigningKeyResponse = await getJwtSigningKey( keyId )
  const signingKey = getSigningKeyResponse.publicKey || getSigningKeyResponse.rsaPublicKey

  return signingKey
}

async function getIdentityToken( domain, encodedAccessToken ){
  const response = await got.get( 'https://'+ domain + '/userinfo', {
    headers: {
      'authorization': 'Bearer ' + encodedAccessToken
    },
    responseType: 'json'
  })

  return response.body
}