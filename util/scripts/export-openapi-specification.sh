#!/usr/bin/env zsh

aws apigateway get-export \
 --parameters extensions='apigateway' \
 --rest-api-id ijuhfm53zf \
 --stage-name Prod \
 --export-type oas30 \
 --accepts application/yaml \
 ~/Desktop/student-app-opeanapi.yaml