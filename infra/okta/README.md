# Okta Infrastructure Setup

Terraform scripts to provide infrastructure as code.

It was inspired by [this post](https://matthewdavis111.com/terraform/okta-terraform/).

First, create a developer account at okta.com. Then log in (as a Super Admin)
using your recently created account, and navigate to
Security => API => Tokens and create a new API token. This value should be placed
in `okta-service-account/variables.tf` 

```
variable "org_name" {
  default = "dev-6626298"
}

variable "base_url" {
  default = "okta.com"
}

variable "api_token" {
  default = "..."
}
```