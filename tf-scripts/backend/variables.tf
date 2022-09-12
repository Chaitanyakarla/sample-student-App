variable "region" {
  type    = string
  default = "us-west-2"
}

variable "env" {
  type        = string
  description = "Environment to place infra in"
  default     = "prod"
}

variable "storage_bucket_name" {
  type        = string
  description = "Environment to place infra in"
  default     = "prod-studentapp-infrastructure"
}
