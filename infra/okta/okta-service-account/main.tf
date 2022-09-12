terraform {
  required_providers {
    okta = {
      source = "okta/okta"
      version = "~> 3.20"
    }
  }
}

# Configure the Okta Provider - API token set in env var.
provider "okta" {
  org_name  = var.org_name
  base_url  = var.base_url
  api_token = var.api_token
}

resource "okta_user" "terraform_application" {
  login = "chris.hatton+oktaadmin@robotsandpencils.com"
  email = "chris.hatton+oktaadmin@robotsandpencils.com"
  first_name = "Terraform"
  last_name = "Application Automation"
  password = var.password
  lifecycle {
    ignore_changes = [admin_roles]
  }
}

resource "okta_user_admin_roles" "terraform_application" {
  user_id = okta_user.terraform_application.id
  admin_roles = [
    "APP_ADMIN", 
    "API_ACCESS_MANAGEMENT_ADMIN",
    "ORG_ADMIN"
  ]
}
