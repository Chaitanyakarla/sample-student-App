const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

const configManagerLambda = process.env.CONFIG_MANAGER

exports.handler = async function( event, context ){
  console.log('### EVENT: ' + JSON.stringify(event))
  const httpHeaders = event.headers

  // create a map of lower-cased header names to actual http headers
  // reason: http headers aren't case sensitive, but string comparison in javascript is
  //         so we normalize received headers by lower-casing them
  //         and do string comparisons on the normalized headers
    let normalizedHttpHeaderNameMap = {}
    Object.keys( httpHeaders ).forEach( headerName => {
      normalizedHttpHeaderNameMap[ headerName.toLowerCase() ] = headerName
    })

  // ensure middleware api key is present
    if( ! normalizedHttpHeaderNameMap.hasOwnProperty( 'x-api-key' ) ){
      console.log( 'action=ensure-api-key-is-present success=false reason="http header x-api-key not present"' )
      return createAuthorizerResponse( 'unknown', 'Deny' )
    }

    console.log( 'action=ensure-api-key-is-present success=true' )
    const apiKey = httpHeaders[ normalizedHttpHeaderNameMap[ 'x-api-key' ] ]

  // get configs associated with api key
    const getApiConfigInvokeArgs = {
      FunctionName: configManagerLambda,
      Payload: JSON.stringify({
        action: 'get-institution-api-config-by-key',
        api_key: apiKey
      })
    }
    const getApiConfigResult = await lambda.invoke(getApiConfigInvokeArgs).promise()
    const successfulInvoke = ! getApiConfigResult.hasOwnProperty('FunctionError')
    if( ! successfulInvoke ){
      console.log( 'action=get-api-key-config success=false reason="'+ getApiConfigResult.Payload +'"' )
      return createAuthorizerResponse( 'unknown', 'Deny' )
    }

    const apiConfig = JSON.parse(getApiConfigResult.Payload)
    if( ! apiConfig ){
      console.log( 'action=get-api-key-config success=false reason="no config found"' )
      return createAuthorizerResponse( 'unknown', 'Deny' )
    }

    console.log( 'action=get-api-key-config success=true' )

  // ensure api config has identity provider integration
    if( ! apiConfig.integrations || ! apiConfig.integrations.identity_provider ){
      console.log( 'action=ensure-api-key-has-identity-provider-integration success=false reason="identity provider integration for given api key not found"' )
      return createAuthorizerResponse( 'unknown', 'Deny' )
    }

    console.log( 'action=ensure-api-key-has-identity-provider-integration success=true' )
    const identityProviderIntegration = apiConfig.integrations.identity_provider

  // handle validation for specified identity provider integration type
    switch( identityProviderIntegration.type ){
      case 'auth0':
        // ensure integration has specified domain attribute
          if( ! identityProviderIntegration.domain || typeof identityProviderIntegration.domain !== 'string' || identityProviderIntegration.domain.length < 1 ){
            console.log( 'action=ensure-auth0-integration-domain-is-specified success=false' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          console.log( 'action=ensure-auth0-integration-domain-is-specified success=true' )

        // get token from Authorization header
          if( ! normalizedHttpHeaderNameMap.hasOwnProperty( 'authorization' ) ){
            console.log( 'action=get-auth0-token success=false reason="header containing auth0 token not found"' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          const tokenHeaderContent = httpHeaders[ normalizedHttpHeaderNameMap[ 'authorization' ] ]
          if( tokenHeaderContent.indexOf( 'Bearer ' ) !== 0 || tokenHeaderContent.length <= 7 ){
            console.log( 'action=get-auth0-token success=false reason="unexpected content structure in auth0 token header"' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }
          console.log(tokenHeaderContent)
          const encodedToken = tokenHeaderContent.replace('Bearer ', '')
          console.log(encodedToken)
          console.log( 'action=get-auth0-token success=true' )

          const auth0 = require('./auth0')
          const token = auth0.decodeToken( encodedToken )
          console.log( 'action=decode-auth0-token success=true' )

          // #region Get IdP Configuration

        // get auth0 apis and applications
          const getAuth0ApisInvokeArgs = {
            FunctionName: configManagerLambda,
            Payload: JSON.stringify({
              action: 'list-auth0-apis'
            })
          }

          const getAuth0ApplicationsInvokeArgs = {
            FunctionName: configManagerLambda,
            Payload: JSON.stringify({
              action: 'list-auth0-applications'
            })
          }

          const getAuth0ApisAndApplications = await Promise.allSettled([
            lambda.invoke(getAuth0ApisInvokeArgs).promise(),
            lambda.invoke(getAuth0ApplicationsInvokeArgs).promise()
          ])

          const successfulGetApisInvoke = ! getAuth0ApisAndApplications[0].status !== 'fulfilled' || getAuth0ApisAndApplications[0].value.hasOwnProperty('FunctionError')
          if( ! successfulGetApisInvoke ){
            const reasonForFail = getAuth0ApisAndApplications[0].status !== 'fulfilled' ? getAuth0ApisAndApplications[0].reason : getAuth0ApisAndApplications[0].value.Payload
            console.log( 'action=get-auth0-apis success=false reason="'+ reasonForFail +'"' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          const successfulGetApplicationsInvoke = ! getAuth0ApisAndApplications[1].status !== 'fulfilled' || getAuth0ApisAndApplications[1].value.hasOwnProperty('FunctionError')
          if( ! successfulGetApplicationsInvoke ){
            const reasonForFail = getAuth0ApisAndApplications[0].status !== 'fulfilled' ? getAuth0ApisAndApplications[1].reason : getAuth0ApisAndApplications[1].value.Payload
            console.log( 'action=get-auth0-applications success=false reason="'+ reasonForFail +'"' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          const auth0Apis = JSON.parse( getAuth0ApisAndApplications[0].value.Payload )
          const auth0Applications = JSON.parse( getAuth0ApisAndApplications[1].value.Payload )

          if( ! auth0Apis ){
            console.log( 'action=get-auth0-apis success=false reason="no auth0 apis found"' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          console.log( 'action=get-auth0-apis success=true' )

          if( ! auth0Applications ){
            console.log( 'action=get-auth0-applications success=false reason="no auth0 applications found"' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          console.log( 'action=get-auth0-applications success=true' )

        // find auth0 application and api token was generated for
          console.log('token payload: ' + JSON.stringify(token.payload))
          const tokenApplication = auth0Applications.find( application => application.client_id === token.payload.azp )
          if( ! tokenApplication ){
            console.log( 'action=find-token-specific-auth0-application success=false' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          console.log( 'action=find-token-specific-auth0-application success=true application=' + JSON.stringify(tokenApplication, null, 2) )

          const tokenApi = auth0Apis.find( api => token.payload.aud.indexOf( api.audience ) > -1 )
          if( ! tokenApi ){
            console.log( 'action=find-token-specific-auth0-api success=false' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          console.log( 'action=find-token-specific-auth0-api success=true' )

        // ensure application and api domain match
          if( tokenApplication.domain !== tokenApi.domain ){
            console.log( 'action=ensure-auth0-application-and-api-domain-match success=false' )
            return createAuthorizerResponse( 'unknown', 'Deny' )
          }

          console.log( 'action=ensure-auth0-application-and-api-domain-match success=true' )
          // #endregion

        // ensure token hasn't been tampered with
          const signingKey = await auth0.getSigningKey( tokenApi.domain, token.header.kid )
          auth0.verifyToken( encodedToken, signingKey, tokenApi.domain, tokenApi.audience )

          console.log( 'action=verify-token-signature success=true' )

        // load user identifying attribute from access token
          if( identityProviderIntegration.crm_id_attribute && token.payload.scope.indexOf( 'openid' ) > -1 ){
            const identityToken = await auth0.getIdentityToken( tokenApi.domain, encodedToken )
            console.log( 'action=get-identity-token success=true token=' + JSON.stringify(identityToken) )

            if( identityToken[ identityProviderIntegration.crm_id_attribute ] ){
              const authorizerPrincipalId = apiConfig.institution +'-'+ identityToken[ identityProviderIntegration.crm_id_attribute ]
              const allowPolicyDocument = createAuthorizerResponse( authorizerPrincipalId, 'Allow' )

              allowPolicyDocument.context = {
                crm_id: identityToken[ identityProviderIntegration.crm_id_attribute ]
              }

              console.log( 'action=add-crm-identity-to-request-context success=true id=' + allowPolicyDocument.context.crm_id )

              console.log(JSON.stringify(allowPolicyDocument))

              return allowPolicyDocument
            }
          }

        return createAuthorizerResponse( apiConfig.institution +'-'+ token.payload.sub, 'Allow' )

        break

      default:
        console.log( 'action=handle-identity-validation success=false reason="no handler for identity provider \''+ identityProviderIntegration.type +'\'"' )
        return createAuthorizerResponse( 'unknown', 'Deny' )
    }
}


const validPolicyDocumentEffects = [ 'Allow', 'Deny' ]

function createApiLambdaInvokePolicyDocument( effect ){
  if( ! effect ) throw new Error( 'no policy effect specified' )
  if( typeof effect !== 'string' || validPolicyDocumentEffects.indexOf(effect) === -1 ) throw new Error( 'invalid policy effect "'+ effect +'"' )

  const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*' // DANGER: asterisk means user is authorized to access ALL endpoints. NOT PRODUCTION READY.
        }
      ]
  }

  return policyDocument
}

function createAuthorizerResponse( principalId, effect, context ){
  const response = {
    principalId: principalId,
    policyDocument: createApiLambdaInvokePolicyDocument( effect )
  }

  if( context ) response.context = context

  return response
}