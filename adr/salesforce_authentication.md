# SalesForce API Authentication

## Status

Proposed & Implemented in MVP (Fall 2021)

## Context

What is the issue that we're seeing that is motivating this decision or change?
The Student App Middleware serves as a facade and reverse proxy for many SaleForce-housed
data elements. This will increase latency for the Student User Experience, as well
introduce a significant number of redundant API calls (authenticate before every
SF REST call)

## Decision

The SalesForce access token is required for all secure API calls. Because the
vast majority of Student App API calls (from the Application Tier) require data
from SalesForce, this will result in O(N) additional API calls. This authn
call acts as a refresh, resulting in the same access_token being returned/utilized
for essentially all SF API calls.

In order to 1) reduce latency, 2) improve the Student User Experience and 3) reduce
redundant/unnecessary API authn calls we will build and schedule a routine job that
is responsible for ensuring that the SF access_token remains "fresh" and available
for usage  by subsequent API execution.

## Consequences

The Student User Experience will improve slightly by reducing a serial API call.
Additionally, we will significantly reduce the nubmer of API calls against 
SalesForce (the author is not certain if Authn calls are included in the API usage
tiers as recorded by SalesForce).

As a side affect, this MAY result in a single access token that is good indefinitely.
From a security standpoint, this has potential for theft/abuse. If the token is indeed
infinitely reusable due to routine refresh, then this has the potential for long-term
abuse if the access token is somehow compromised.
