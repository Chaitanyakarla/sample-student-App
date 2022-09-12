variable "env" {
  type = string
}

variable "ec2_server_name" {
  type = string
  default = "student-app-keypair.pem"
}

variable "ec2_ami" {
  type = string
  default = "ami-04505e74c0741db8d"
}

variable "ssh_key_name" {
  type = string
  default = "student-app-keypair.pem"
}


variable "vpc_security_group_ids" {
  type = list(string)
}

variable "subnetid" {
  type = string
}

variable "subnet_id" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

variable "alb_security_group_ids" {
  type = list(string)
}