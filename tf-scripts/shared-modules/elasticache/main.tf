
resource "aws_elasticache_subnet_group" "private" {
  name       = var.name
  subnet_ids = var.subnets #data.aws_subnet_ids.private.ids

}



resource "aws_elasticache_replication_group" "default" {


  replication_group_id          = var.cluster_id
  replication_group_description = "Redis cluster for Hashicorp ElastiCache example"

  node_type            = var.node_type  ##### "ElastiCache for Redis Auto Scaling is limited to the following: Instance type families - R5, R6g, M5, M6g && Instance sizes - Large, XLarge, 2XLarge#####
  port                 = var.port
  parameter_group_name = var.parameter_group_name

  snapshot_retention_limit = var.snapshot_retention_limit
  snapshot_window          = var.snapshot_window

  subnet_group_name = aws_elasticache_subnet_group.private.name

  automatic_failover_enabled = var.automatic_failover_enabled



  cluster_mode {
    replicas_per_node_group = var.cluster_mode_replicas_per_node_group
    num_node_groups         = var.cluster_mode_num_node_groups
  }
} 
