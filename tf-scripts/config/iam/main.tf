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
data "terraform_remote_state" "netwoiamrking" {
  backend   = "s3"
  workspace = terraform.workspace
  config = {
    bucket = "prod-studentapp-infrastructure"
    key    = "iam/terraform/state"
    region = var.region
  }
}


module "iam" {

  source                               = "../../shared-modules/iam"
  iam_policy_name                      = var.iam_policy_name
  iam_role_name                        = var.iam_role_name
  assume_role_policy_path              = var.assume_role_policy_path
  policy_path                          = var.policy_path

}