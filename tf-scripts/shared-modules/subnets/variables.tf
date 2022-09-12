
variable "vpc_id" {
  type        = string
  description = "ID of the VPC to create subnet in"
}


variable "public_subnet_suffix" {
  description = "Suffix to append to public subnets name"
  type        = string
  default     = "public"
}

variable "public_subnet_cidr_blocks" {
  type = list
  default     = []
}

variable "private_subnet_cidr_blocks" {
  type = list
  default     = []
}

variable "azs" {
  description = "A list of availability zones names or ids in the region"
  type        = list
  default     = []
}


variable "map_public_ip_on_launch" {
  description = "Should be false if you do not want to auto-assign public IP on launch"
  type        = bool
  default     = true
}



variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}


variable "igw_tags" {
  description = "Additional tags for the internet gateway"
  type        = map(string)
  default     = {}
}

variable "public_subnet_tags" {
  description = "Additional tags for the public subnets"
  type        = map(string)
  default     = {}
}


variable "private_subnet_tags" {
  description = "Additional tags for the public subnets"
  type        = map(string)
  default     = {}
}


variable "Environment" {
  default     = ""
  type        = string
  description = "Environment in which you want to deploy"
}