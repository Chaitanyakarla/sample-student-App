terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0.0"
    }
  }
  backend "s3" {
    bucket             = "prod-studentapp-infrastructure"
    key                = "iam/terraform/state"
    region             = "us-west-2"
  }
}

