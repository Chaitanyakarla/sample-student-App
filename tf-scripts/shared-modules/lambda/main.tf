
resource "aws_lambda_function" "lambda" {

  function_name = var.function_name
  role          = var.role
  handler       = var.handler

  filename         = var.filename
  source_code_hash = "filebase64sha256(var.filename)"
  timeout = 60


  runtime = var.runtime #neeed to change to 3.9
  
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }

}

#resource "aws_lambda_permission" "lambda_permission" {
#  statement_id  = "lambda"
#  action        = "lambda:InvokeFunction"
#  function_name = aws_lambda_function.lambda.function_name
#  principal     = "logs.us-east-1.amazonaws.com"
#  source_arn    = "arn:aws:logs:us-east-1:923401614847:log-group:API-Gateway-Execution-Logs_jlxgibr0uf/test:*"
#  #qualifier     = aws_lambda_alias.alias.name
#}

# resource "aws_cloudwatch_log_subscription_filter" "lambda_logs_filter" {
#   name            = "lambda_subscription"
#role_arn        = aws_iam_role.lambda_subscription_role.arn
#depends_on      = [aws_lambda_permission.lambda_permission]
#log_group_name  = "API-Gateway-Execution-Logs_jlxgibr0uf/test"
#filter_pattern  = ""
#destination_arn = "${aws_lambda_function.lambda.arn}"
#distribution    = "Random"
#}


#resource "aws_lambda_permission" "apigw_lambda" {
#  statement_id  = "apigw_lambda_permissions"
#  action        = "lambda:InvokeFunction"
#  function_name = aws_lambda_function.lambda.function_name
#  principal     = "apigateway.amazonaws.com"
#  source_arn    = "arn:aws:execute-api:us-west-2:312450586937:flslj46ih7/*/GET/orders"
#  #qualifier     = aws_lambda_alias.alias.name
#}