# Configuration Storage

## Status

Proposed & Implemented in MVP (Fall 2021)

## Context

The Student Application requires configuration storage to support the integration with
a variety of SalesForce organizations, most notably 1) UAT, and 2) Partner #1.

The MVP release will target only a single higher ed institution and will require that
they have a SalesForce back-end. As such, the robustness of our configuration solution
can be solved with a very simple solution that can be expanded over time (as we grow in 
adoption and complexity).

## Decision

Configuration values will be relatively static (set at deploy time and will be limited
in both number-of-values and number-of-partners. As such, we will leverage a simple
JSON document stored in S3.

## Consequences

Keeping our config storage solution simple means low-cost to develop. However, we
acknowledge a higher cost to manage configuration as our adoption grows. At some future
time, we will most certainly outgrow a "flat file" approach and need to be build a more
robust solution. We look forward to having that problem!