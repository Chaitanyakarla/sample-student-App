variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "us-east-1"
}



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
  default     = []
  type        = list
  description = "Name of cluster"
}

variable "security_group_ids" {
  default     = []
  type        = list
  description = "Name of cluster"
}

variable "function_name" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "role" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "handler" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "filename" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "runtime" {
  default     = ""
  type        = string
  description = "Name of cluster"
}