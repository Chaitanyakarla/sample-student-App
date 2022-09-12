variable "cluster_id" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "database_name" {
  type        = string
  description = "Name of database_name"
  default     = ""
}

variable "master_username" {
  default     = "studentadmin"
  type        = string
  description = "Username for db"
}

variable "master_password" {
  default     = "Welc0mee123$"
  type        = string
  description = "Password for db"
}

variable "vpc_id" {
  default     = ""
  type        = string
  description = "Provide vpc id"
}


variable "subnets" {
  type        = list(string)
  description = "Subnet IDs"
}


variable "name" {
  description = "Name to be used on all the resources as identifier"
  type        = string
  default     = ""
}

variable "node_type" {
  description = "Name to be used on all the resources as identifier"
  type        = string
  default     = ""
}

variable "port" {
  description = "Name to be used on all the resources as identifier"
  type        = string
  default     = ""
}

variable "parameter_group_name" {
  description = "Name to be used on all the resources as identifier"
  type        = string
  default     = ""
}

variable "snapshot_retention_limit" {
  description = "Name to be used on all the resources as identifier"
  type        = string
  default     = ""
}

variable "snapshot_window" {
  type        = string
  description = "The daily time range (in UTC) during which ElastiCache will begin taking a daily snapshot of your cache cluster."
  default     = ""
}


variable "automatic_failover_enabled" {
  type        = bool
  default     = false
  description = "Automatic failover (Not available for T1/T2 instances)"
}

variable "cluster_mode_replicas_per_node_group" {
  type        = string
  description = "The daily time range (in UTC) during which ElastiCache will begin taking a daily snapshot of your cache cluster."
  default     = ""
}

variable "cluster_mode_num_node_groups" {
  type        = string
  description = "The daily time range (in UTC) during which ElastiCache will begin taking a daily snapshot of your cache cluster."
  default     = ""
}