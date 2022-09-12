

output "iam_role_name" {
  description = "The unique name of your Lambda Function."
  value       = module.iam.iam_role_name
}