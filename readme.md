# studentapp-middleware
Contains the API and necessary logic to provide Student authentication,
LMS/SIS information, and necessary storage for the Robots & Pencils
Student App.

## Getting Started
This [guide](docs/getting-started.md) should help get your machine setup to locally run and make changes to the Student App Middleware application.

## Deploy Middleware
Designed as a collection of Serverless Application Model apps, here's [how to get everything deployed](docs/how-to-deploy-all-sam-apps.md) to form the Student App Middleware system.

TLDR: `npm run deploy` in the repo root. That's it.

## Configure Middleware
Need to add a new institution or modify the integration to an existing backend?

This [configuration guide](docs/how-to-configure-a-deployed-stack.md) outlines the different types of Middleware data, what they do, and where they're stored].


## Structure

/api - documentation and source code for the API.
/util - misc scripts for stuff

## API Docs
- [Institution](sam-layers/nodejs-common-deps/institutions/README.md)
- [Institution Salesforce Integration](sam-layers/nodejs-common-deps/institutions/README.md)

## Testing the API
Follow the instructions [here](docs/testing.md) to run basic unit tests of each API endpoint