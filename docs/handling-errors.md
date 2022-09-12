# Handling Http errors across all Middleware APIs

### The most common errors that we encounter from salesforce are 
- `400` - There could be a case for a 400 error if the syntax of the request is invalid
- `401` - most likely due to an invalid api key or invalid Access Token
- `500` - something from AWS failed 
- `501` - an error has occured somewhere in the Middleware, and the Salesforce api does not handle the request 

### Possible Errors
- `504` - AWS or Salesforce could timeout

## The current way we throw errors
Currently we have API Gateway sending the errors to the front-end.  We throw our new errors for internal logging, and by default return a 500/501 from AWS.\
The front-end does not need to present our errors to the students, so our errors are only really for the front-end developers.  Therefore, adding some simple message about where in the task the error occurred could be beneficial to early diagnosing the problem.\
Ie. passing along a 401 from Salesforce to the front-end as a `SalesforceError`.\
As per my discussion with Chris, we will not be sending anything more to the front-end than is necessary, they will be handling the error presentation to the students, so probably ignoring our error messages anyways.