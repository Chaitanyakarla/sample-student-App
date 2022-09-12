# Code Reuse: Layer vs Lambda

## Background
Breaking down application logic into discrete units is a sensible programming practice.

With AWS Lambdas, there are a number of ways to package and consume these discrete units.

This document is an attempt to analyze two techniques and surface a viable strategy for the Middleware team.

## What is "Layer"?
AWS Lambda has a feature called Layer, which can be used to package code shared between multiple Lambdas.

For example, if your API endpoints needed to validate a session token, you could put the validation logic into a layer which every endpoint Lambda shares. This way, the Lambda can validate the token without you writing any validation-specific logic into the Lambda, or having to repeat it across a number of Lambdas.

### Pros
- No network call needed to utilize shared logic

### Cons
- Max 5 Layers per Lambda
- Publishing a new version of a Layer doesn't automatically update dependent Lambdas

## What is "Lambda"?
A Lambda (in the AWS ecosystem) is a serverless function. While they are typically described as invoked by events from API Gateway or other AWS services, a Lambda can invoke another Lambda the same way a function can call another function in many programming lanugages.

Given the example of validating a session token, you could write a Lambda whose role is to validate a session token, and any of the API endpoint Lambdas can invoke the "Validation Lambda" and use its result. All validation logic is kept in one place. No need to repeat the logic anywhere else.

### Pros
- Dependent Lambdas will always utilize the most up-to-date version without any extra legwork

### Cons
- Network call needed to invoke a Lambda
