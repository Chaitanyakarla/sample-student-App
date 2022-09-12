
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




module "redis" {

  source                               = "../../../shared-modules/elasticache"
  name                                 = "clustertempsubnetgroup"
  subnets                              = data.terraform_remote_state.networking.outputs.private_subnet_id[0]
  cluster_id                           = var.cluster_id
  node_type                            = var.node_type
  port                                 = var.port
  parameter_group_name                 = var.parameter_group_name
  snapshot_retention_limit             = var.snapshot_retention_limit
  snapshot_window                      = var.snapshot_window
  automatic_failover_enabled           = var.automatic_failover_enabled
  cluster_mode_replicas_per_node_group = var.cluster_mode_replicas_per_node_group
  cluster_mode_num_node_groups         = var.cluster_mode_num_node_groups

}


##############################################################################################################################
# slow-logs, engine-logs, Dynamic-Autoscaling  //un-comment below resources to enable Slow logs, enging logs and autoscaling
##############################################################################################################################

#resource "aws_cloudwatch_log_group" "elasticache_slow_log" {
#  depends_on = [module.redis]
#  name = "${var.cluster_id}-slow-logs"
#}

#resource "aws_cloudwatch_log_group" "elasticache_engine_log" {
#  depends_on = [module.redis]
#  name = "${var.cluster_id}-engine-log"
#}

#output "slowlog_groupname" {
#  depends_on = [aws_cloudwatch_log_group.elasticache_slow_log
#              ]
#  value = aws_cloudwatch_log_group.elasticache_slow_log.id
#}


#output "enginelog_groupname" {
#  depends_on = [aws_cloudwatch_log_group.elasticache_engine_log
#              ]
#  value = aws_cloudwatch_log_group.elasticache_engine_log.id
#}

#output "clustername" {
#  depends_on = [module.redis]
#  value = var.cluster_id
#}

#resource "null_resource" "slow_logs" {
#  depends_on = [aws_cloudwatch_log_group.elasticache_slow_log,
#                aws_cloudwatch_log_group.elasticache_engine_log
#              ]
#  provisioner "local-exec" {
#    command = "chmod +x ../../../scripts/enable-slow-log.sh; ../../../scripts/enable-slow-log.sh"
#  }
#  triggers = {
#    always_run = timestamp()
#  }
#}
