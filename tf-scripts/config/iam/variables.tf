
variable "iam_role_name" {
  default     = ""
  type        = string
  description = "Name of iam role"
}

variable "iam_policy_name" {
  type        = string
  description = "Name of database_name"
  default = ""
}

variable "policy_path" {
  type        = string
  description = "Name of database_name"
  default = ""
}

variable "assume_role_policy_path" {
  type        = string
  description = "Name of database_name"
  default = ""
}

variable "env" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}

variable "region" {
  default     = ""
  type        = string
  description = "region for AWS in which you want to deploy your resources"
}