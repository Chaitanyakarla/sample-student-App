

output "iam_role_name" {
  description = "The unique name of your Lambda Function."
  value       = aws_iam_role.lambda_role.arn
}