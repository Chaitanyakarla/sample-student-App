terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0.0"
    }
  }
  backend "s3" {
    bucket             = "prod-studentapp-infrastructure"
    key                = "database/RDS/terraform/state"
    region             = "us-west-2"
  }
}

#data "terraform_remote_state" "state" {
#  backend = "s3"
#  config {
#    bucket     = var.tf_state_bucket
#    region     = "var.region"
#  }
#}
