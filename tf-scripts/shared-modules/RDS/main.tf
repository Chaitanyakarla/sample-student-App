data "aws_subnet_ids" "private" {
  vpc_id = var.vpc_id
}

resource "aws_db_subnet_group" "private" {
  name       = var.db_subnet_group_name
  subnet_ids = var.subnets 

}

resource "aws_rds_cluster_instance" "cluster_instances" {
  count = length(var.subnets)
  db_subnet_group_name    = aws_db_subnet_group.private.name
  identifier         = "aurora-cluster-demo-${count.index}"
  cluster_identifier = aws_rds_cluster.default.id
  instance_class     = var.instance_class
  engine             = aws_rds_cluster.default.engine
  engine_version     = aws_rds_cluster.default.engine_version

}


resource "aws_rds_cluster" "default" {
  enabled_cloudwatch_logs_exports  = ["audit", "error", "general", "slowquery"]
  cluster_identifier = var.cluster_identifier
  db_subnet_group_name    = aws_db_subnet_group.private.name
  database_name      = var.database_name
  master_username    = var.master_username
  master_password    = var.master_password
  skip_final_snapshot = true
}


#resource "aws_db_instance_role_association" "example" {
#  db_instance_identifier = aws_db_instance.example.id
#  feature_name           = "S3_INTEGRATION"
#  role_arn               = aws_iam_role.example.arn
#}

resource "aws_appautoscaling_target" "replicas" {
  service_namespace  = "rds"
  scalable_dimension = "rds:cluster:ReadReplicaCount"
  resource_id        = "cluster:${aws_rds_cluster.default.id}"
  min_capacity       = var.min_capacity
  max_capacity       = var.max_capacity
}

resource "aws_appautoscaling_policy" "replicas" {
  name               = "cpu-auto-scaling"
  service_namespace  = aws_appautoscaling_target.replicas.service_namespace
  scalable_dimension = aws_appautoscaling_target.replicas.scalable_dimension
  resource_id        = aws_appautoscaling_target.replicas.resource_id
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "RDSReaderAverageCPUUtilization"
    }

    target_value       = var.target_value
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
  }
}
