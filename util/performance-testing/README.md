# Performance Testing Overview
These very simple scripts conduct some lightweight performance testing
against some of the Student App Middleware APIs.

## Set up
The `run-benchmark.sh` is the primary entry point. It runs a set of basic
GETs on 5 different middleware (and Salesforce endpoints) as well as tests
the internal caching (if configured). The shell script requires the following 
3 env vars. I recommend creating a `setEnv.sh`
script in this folder to export the following:

```
#!/usr/bin/env zsh

export APIKEY='8d79180x-378f-42ae-884e-f2d00ad44f54'
export ACCESSTOKEN='fubar'
export BENCHMARK_HOST='https://studentapp-api-preprod.rnp.io'
```

Note: you will need to get an access token from Postman (or similar) that
is fresh.

You can also point these directly to Salesforce (if you can get a SF Access Token)
```
export APIKEY=...
export ACCESSTOKEN=...
export BENCHMARK_HOST='https://studentapp-uat-dev-ed.my.salesforce.com'
```