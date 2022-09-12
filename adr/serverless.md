# Amazon Web Services (AWS) - Serverless

## Status

Proposed & Implemented in MVP (Fall 2021)

## Context

The Studemt Application is primarily a front-end application (native and web) that
takes advantage of data/services that are distributed across a myriad of back-end
systems, e.g. SIS, LMS, CRM ,etc. Due to the variety of systems that could make up
any given Institutions ecosystem, and our deisre to support as many eventual Higher
Ed institutions as possible, it becomes advantageous to develop an abstraction layer
between the front-end applications and the back-end data storage in support of the 
[Liskov Substiution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle).

Additionally, our engineering resource availability (and budget) is limited and suggests
that we build where necessary, and buy/license wherever appropriate.

## Decision

[AWS Serverless](https://aws.amazon.com/serverless/?nc2=h_ql_prod_serv) capabilities 
provide a number of low-cost features that are directly
in support of our goals with the Student App Middleware:
- Low-cost to develop
- Quick-to-market
- Abstraction between Front-End applications and Back-End systems
- Release automation

These features include:
- [AWS API Gateway](https://aws.amazon.com/api-gateway/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [RDS](https://aws.amazon.com/rds/)
- [Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/)f

Lambdas will be developed using Node.js, which supports eventual code reuse
should we outgrow the serverless model and need to move towards self-managed
containers or self-managed instances (code can be ported to Node.js hosts).

## Consequences

Adoption serverless provides significant advantages with respect to implementation cost,
essentially supporting a No-Ops style Product. This supports our aggressive release
schedule, low Cap Ex for the MVP, and provides a path towards a more robust solution
in the future (if necessary).