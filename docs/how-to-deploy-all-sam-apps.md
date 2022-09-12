# How to Deploy all the Serverless Application Model (SAM) apps

## Background
Development individual SAM apps is convenient, but the Middleware is a composition of multiple SAM apps working together. They need to be deployed together to provide the full functionality we expect.

If for any reason we need to rebuild or migrate our environment, we don't want to forget to deploy any function, or spin them in a way where necessary dependencies are not in place.

We need a reproducible deployment process.

## Current Solution
Each SAM app is developed independently with its own template file declaring what it needs and how Cloudformation can provision it.

We have created a root Cloudformation template that lists how each SAM app is deployed and maps the dependencies between them.

All you need to do is:

1. `npm run deploy` in the repository root folder