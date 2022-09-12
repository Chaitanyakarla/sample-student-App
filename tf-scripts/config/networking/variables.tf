variable "region" {
  default     = ""
  type        = string
  description = "region for AWS in which you want to deploy your resources"
}

######172.16.0.0/16, 192.168.0.0/16,10.0.0.0/16######
variable "cidr_block" {
  default     = ""
  type        = string
  description = "CIDR block for the VPC"
}

variable "public_subnet_cidr_blocks" {
  default = []
  type = list
}

variable "private_subnet_cidr_blocks" {
  default = []
  type = list
}


#### change these default availability_zones values to the region where you want to deploy Eg: "us-east-1", ca-central-1,ect"
variable "availability_zones" {
  default     = []
  type        = list
  description = "List of availability zones"
}

variable "vpc_tags" {
  default     = ""
  type        = string
  description = "tags for the VPC"
}

variable "Environment" {
  default     = ""
  type        = string
  description = "Environment in which you want to deploy"
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "env" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}

variable "bucket" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}

variable "key" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}
