variable "aws_region" {
  type    = string
  default = "ca-central-1"
}

variable "env" {
  type        = string
  description = "Environment to place infra in"
  default     = "test"
}


variable "storage_bucket_name" {
  type        = string
  description = "Environment to place infra in"
  default     = "test-studentapp-infrastructure"
}
