# Third-party Identity Federation & Student Login

## Status

Proposed & Implemented in MVP (Fall 2021)

## Context

Most Higher Ed institutions will leverage a third-party system (whether COTS or Open Source)
in order to offload their identity management capabilities and provide Single-Sign-On
across the myriad of systems that comprise a modern Higher Ed solution. Today's security
risks suggest a standards-based approach to provide a sufficient security posture.

## Decision

OpenID Connect (OIDC) is the latest evolution of OAuth 2 that provides both authorization AND
authenication. The Student Application will take advantage of whatever standards-based
solution our partners may have incorporated within their ecosystem. As such, this decision
requires that any Higher Ed institution be partnered/licensed with an identity provider that
supports OIDC (i.e. Ping, Okta, Auth0, Microsoft, etc.). This will provide the Student App
with both a secure means of authn/authz but also a just-in-time User Provisioning approach
that is controlled entirely by the Institution through their IdM provider.

Other providers will of course be assesed for applicability, but will not be targeted for 
the MVP release.

## Consequences

This approach assumes that all partners must have an OIDC Identity Management solution. At
this time, we do not have an identified launch partner so there is some risk in proceeding
with this approach. However, early conversations with partners suggests that this requirement
is acceptable.