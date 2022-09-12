
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


data "terraform_remote_state" "networking" {
  backend   = "s3"
  workspace = terraform.workspace
  config = {
    bucket = "prod-studentapp-infrastructure"
    key    = "networking/terraform/state"
    region = var.region
  }
}

module "RDS" {

  source                               = "../../../shared-modules/RDS"
  db_subnet_group_name                 = var.db_subnet_group_name
  subnets                              = data.terraform_remote_state.networking.outputs.private_subnet_id[0] 
  identifier                           = var.identifier
  instance_class                       = var.instance_class
  database_name                        = var.database_name
  master_username                      = var.master_username
  master_password                      = var.master_password
  cluster_identifier                   = var.cluster_identifier
  min_capacity                         = var.min_capacity
  max_capacity                         = var.max_capacity
  target_value                         = var.target_value
  scale_in_cooldown                    = var.scale_in_cooldown
  scale_out_cooldown                   = var.scale_out_cooldown

}
