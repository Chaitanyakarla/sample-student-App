# AWS Layers for Common code
These scripts are installed as an AWS Lambda base layer and are made available
to the Lambda at runtime by installing them at `/opt/nodejs/_LAYERNAME_`

## Current Layers
- `auth0` includes specific functions for dealing with Auth0 as an IdP (can be deleted)
- `aws-functions` helper for AWS specific items
- `common` does what it sounds like it does
- `idaas` used as an abstraction layer against the organization-specific identity provider, i.e. Okta or Auth0
- `institution-api-keys` is to be deprecated in favor of config in the database
- `institutions` is to be deprecated in favor of config in the database
- `institutions-salesforce-integrations` is to be deprecated in favor of config in the database
- `middleware-db` is the replacement for config storage in S3 and local caching
- `salesforce` ???

## Installation
This collection is installed as a single Lambda Layer by the API SAM application
as described by `./sam-apps/api/template.yml`