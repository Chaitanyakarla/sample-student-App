# What You Need to Work on Student App's Middleware

## Background
We're currently building the app using AWS SAM _(Amazon Web Services Serverless Application Model)_.

This allows us to take advantage of existing AWS products and paradigms for generic problems, and we can write "functions" to solve app-specific problems using whichever language best fits the probem-space or the team's expertise.

## Setup: General Development Environment
You'll need to have a few things installed to get up-and-running with the project. 

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) 
- [Docker](https://docs.docker.com/get-docker/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [VS Code Extension: AWS Toolkit](https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.aws-toolkit-vscode)
- [VS Code Extension: Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

Done installing all of the above? Sweet.

You're now ready to set up your machine for app-specific development.

## Setup: App-specific Development Environment
Each AWS SAM app is defined by a template file which details its dependencies, from serverless functions to AWS features.

Each serverless function specifies a programming language version it expects as its runtime environment. Thankfully, AWS SAM handles the details of spinning up the environment for deployed functions, but you'll need to do a little bit of work to get your local environment ready.

To setup an app locally:
- Locate its template file. _( Check the app's directory )_
- Check the Resource section for each function _( type is `AWS::Serverless::Function` )_
- Install each function's runtime programming language
- Install a VS Code extension for each function's runtime _( note: Node.js has built-in language support; no need to install an extension )_

**Congratulations! You're now ready to locally run and edit the SAM app.**

To setup the app in AWS:
- Create a new Dev Branch in the Github Repo with the name: `dev-{yourname}`
```
git branch dev-{myname} && git checkout dev-{myname}
git push origin dev-{myname}
```
- Copy/Paste/Replace the file `studentapp-middleware/.github/workflows/dev-{someone}-pipeline.yml` with your name in the file name.
- on line 43 in your file, change the stack name for the AWS CloudFormation stack to your name
```yaml
- run: sam build && sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --stack-name {dev-name} --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --region us-west-2 --s3-bucket aws-sam-cli-mana********
```
- deploy your development stack by committing the new changes and pushing to your remote dev branch.
```
git add .
git commit -m "dev branch workflow setup"
git push origin dev-{myname}