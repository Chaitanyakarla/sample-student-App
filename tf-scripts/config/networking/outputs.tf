output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_arn" {
  description = "The ARN of the VPC"
  value       = module.vpc.vpc_arn
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "vpc_owner_id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = module.vpc.vpc_owner_id
}


output "public_subnet_id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = module.public_subnets.*.public_subnet_id
}

output "private_subnet_id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = module.private_subnets.*.private_subnet_id
}