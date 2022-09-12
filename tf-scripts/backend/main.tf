
provider "aws" {
  profile = "default"
  region  = var.region
  default_tags {
    tags = {
      Environment = var.env
      Workspace   = terraform.workspace
    }
  }
}


module "terraform_backend_s3" {
  source              = "../shared-modules/s3backend"
  storage_bucket_name = var.storage_bucket_name
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0.0"
    }
  }
  backend "s3" {
    bucket             = "prod-studentapp-infrastructure"
    key                = "backend/terraform/state"
    region             = "us-west-2"
  }
}