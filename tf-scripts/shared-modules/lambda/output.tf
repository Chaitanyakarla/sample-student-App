output "aws_lambda_function" {
  description = "The ARN of the reverse proxy Lambda function"
  value       = join("", aws_lambda_function.lambda.*.arn)
}

output "function_name" {
  description = "The unique name of your Lambda Function."
  value       = aws_lambda_function.lambda.function_name
}