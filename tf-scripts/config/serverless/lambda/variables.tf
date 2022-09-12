
variable "vpc_config" {
  description = "Lambda VPC configuration"
  type = object({
    subnet_ids : list(string)
    security_group_ids : list(string)
  })
  default = {
    subnet_ids : ["subnet-06bd34a397cc8c02e", "subnet-08d93798fc61e0005"]
    security_group_ids : ["sg-0319998bcee845f78"]
  }
}

variable "subnet_ids" {
  default     = ["subnet-0322e41f77bf9a3ba", "subnet-080c3ad039cbb26da"]
  type        = list
  description = "Name of cluster"
}

variable "security_group_ids" {
  default     = ["sg-0988fb81938d4a165"]
  type        = list
  description = "Name of cluster"
}

variable "function_name" {
  default     = "lambda_studentapp"
  type        = string
  description = "Name of cluster"
}

variable "role" {
  default     = "arn:aws:iam::017937263664:role/lambda_studentapp_temp_policy"
  type        = string
  description = "Name of cluster"
}

variable "handler" {
  default     = "lambda_studentapp.lambda_handler"
  type        = string
  description = "Name of cluster"
}

variable "filename" {
  default     = "my-deployment-package.zip"
  type        = string
  description = "Name of cluster"
}

variable "runtime" {
  default     = "python3.9"
  type        = string
  description = "Name of cluster"
}


variable "region" {
  default     = ""
  type        = string
  description = "region for AWS in which you want to deploy your resources"
}

variable "env" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}