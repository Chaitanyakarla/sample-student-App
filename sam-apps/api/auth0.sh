#!/usr/bin/env zsh

sam build -c && sam local invoke IdentityProviderBasedApiAuthorizer -n student-task-env.json -e events/auth0-idp.json
