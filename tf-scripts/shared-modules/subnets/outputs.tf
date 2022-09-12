

output "public_subnet_id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = aws_subnet.public.*.id
}

output "public_subnet_arns" {
  description = "List of ARNs of public subnets"
  value       = aws_subnet.public.*.arn
}

output "public_subnets_cidr_blocks" {
  description = "List of cidr_blocks of public subnets"
  value       = aws_subnet.public.*.cidr_block
}

output "private_subnet_id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = aws_subnet.private.*.id
}


output "private_subnets_cidr_blocks" {
  description = "List of cidr_blocks of public subnets"
  value       = aws_subnet.private.*.cidr_block
}