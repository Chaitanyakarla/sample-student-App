# Continous Integration - Overview
As our maturity and sophistication as a Product Engineering team grows,
we will increasingly refer back to our automation processes in order to
improve upon our foundation.

## MVP
The MVP release for Fall 2021 will make extensive usage of AWS Serverless
capabilities. AWS provides a CLI toolset called the [Serverless Application
Model](https://aws.amazon.com/serverless/sam/). AWS SAM has the ability to
templatize serverless resources (API Gateway, SQS, Lambda, etc.) and provide
a fairly robust mechanish for provisioning/configuring public cloud assets.

### Branching Strategy
We will reserve `main` for tested and releasable (to a pre-prod environment,
e.g. "staging") software artifacts. As such, all feature development will
be conducted in developer-defined feature branches. Upon being determined
"ready for integration", we will merge feature branches into `main` via a PR.<br>
We are reserving `dev-{name}` as branches for development, these will have custom branch names for the developer, as well as custom stack names within the github action template for that developers `SAM` stack.


## Release Automation
### Dev
Check-ins to `dev-{name}` will trigger a build|release to AWS `dev-{name}` via AWS SAM. On any **push** to `dev-{name}` branch, a **deploy** will occur to that developer's `SAM` stack.

### Staging
Check-ins to `main` will trigger a build|release to AWS `preprod` via AWS SAM.
Current options we are exploring for triggering are 1) Github Actions, 
and 2) Jenkins. Decision is TBD (July 2021).\
Decision to use Github Actions (July 2021)\
We have built out an Action sequence on **push** to `main` that instigates an initial **build-test** of the api, and then a **deploy** to the `sam-studentapp-staging` stack.
### Prod
All Production releases will be manually initiated/completed for MVP.\
The `sam-studentapp-prod` stack has been created to be a placeholder for the **prod** environment.

## Future
We are adopting an evolutionary approach to much of this products development
process, including our sophistication in release automation. As such, this
process is very much a WORK IN PROGRESS and will be elaborated upon as
product growth warrants, and our automation investment deems worthwhile.