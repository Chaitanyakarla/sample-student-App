# Amazon Web Services (AWS) - Public Cloud Provider

## Status

Proposed & Implemented in MVP (Fall 2021)

## Context

The Student Application is a solution that is targeted towards a near-term release
in order to prove the viability of a given product. Because the market value of this
product is still currently unknown, we desire a cheap-to-implement MVP that can prove
out that perceived value. With this in mind, it makes sense to target a public cloud
option that can improve our speed-to-market and MVP Cap Ex spend. By selecting a 
well-known public cloud provider, we can shift much of the cost towards available
cloud options/features, e.g. API gateways, serverless, hosted data stores, etc. and
revisit when/if our cloud spend outweighs the cost to develop/host on our own.

## Decision

Amazon Web Services provides a feature-rich and best-of-breed cloud solution that
is well known and highly adopted, in addition to being extremely low cost (if adopted
cautiously). In addition, the availability of skilled AWS dev/ops resources is
well-established as a very common skill, resulting in greater accessibility to skilled
engineers. These same arguments could be made for other oublic cloud providers, i.e.
Azure, GCP, Heroku, DigitalOcean, etc. but at this time the engineering resources
available to Student App are most highly proficient in AWS.

## Consequences

We can suffer from vendor lock-in, but in 2021 AWS is an extremely well-established
player (the market leader to be accurate). As such, the relative trade offs of this
public cloud solution are well known. e.g. cost, feature set, etc. As such we feel
confident that AWS is most certainly a good option and thus is our chosen solution.