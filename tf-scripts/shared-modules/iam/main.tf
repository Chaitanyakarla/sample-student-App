resource "aws_iam_role_policy" "lambda_policy" {
  name = "var.iam_policy_name"
  role = aws_iam_role.lambda_role.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = file(var.policy_path)
}


resource "aws_iam_role" "lambda_role" {
  name = var.iam_role_name

  assume_role_policy = file(var.assume_role_policy_path)
}