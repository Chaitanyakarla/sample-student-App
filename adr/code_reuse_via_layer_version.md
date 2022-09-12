# Code Reuse via Layer Version

## Status
Proposed as of June 11, 2021

## Context
Breaking down application logic into discrete units is a sensible programming practice.

With AWS Lambdas, there are a number of ways to package and consume these discrete units.

## Decision
We've decided to use AWS Layer feature as our strategy for sharing code between AWS Lambdas.

## Consequences
- Lambdas do not auto-update to the most-recent Layer Version. Additional work is needed to ensure all Lambdas are on the same version.

- Lambdas are limited to 5 layers; need to carefully decide what goes into layers.