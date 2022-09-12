variable "cluster_identifier" {
  default     = ""
  type        = string
  description = "Name of cluster"
}

variable "database_name" {
  type        = string
  description = "Name of database_name"
  default = ""
}

variable "master_username" {
  default     = ""
  type        = string
  description = "Username for db"
}

variable "master_password" {
  default     = ""
  type        = string
  description = "Password for db"
}

variable "vpc_id"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}


variable "subnets"{
  type = list(string)
  default = []
}


variable "sg_id"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}


variable "db_subnet_group_name"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}


variable "min_capacity"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}

variable "max_capacity"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}

variable "target_value"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}

variable "scale_in_cooldown"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}

variable "scale_out_cooldown"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}


variable "identifier"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
}

variable "instance_class"{
  default     =  ""
  type        =  string
  description =  "Provide vpc id"
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

variable "tf_state_bucket" {
  type        = string
  description = "Environment to place infra in"
  default     = ""
}