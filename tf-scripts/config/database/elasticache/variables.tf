variable "cluster_id" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "region" {
  default     = ""
  type        = string
  description = "region for AWS in which you want to deploy your resources"
}


variable "subnets" {
  default     = []
  type        = list
  description = "List of availability zones"
}

variable "node_type" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "port" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "parameter_group_name" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "snapshot_retention_limit" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "snapshot_window" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "cluster_mode_replicas_per_node_group" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "cluster_mode_num_node_groups" {
  default     = ""
  type        = string
  description = "List of availability zones"
}

variable "env" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}

variable "automatic_failover_enabled" {
  description = "Controls if VPC should be created (it affects almost all resources)"
  type        = bool
  default     = true
}