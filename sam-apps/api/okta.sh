#!/usr/bin/env zsh

sam build  && sam local invoke IdentityProviderBasedApiAuthorizer -n student-task-env.json -e events/okta-idp.json
