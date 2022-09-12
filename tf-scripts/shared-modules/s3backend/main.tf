resource "aws_s3_bucket" "inf-storage" {
  bucket = var.storage_bucket_name

  tags = {
    Name = "Infrastructure Bucket"
  }
}

resource "aws_s3_bucket_acl" "inf-storage" {
  bucket = aws_s3_bucket.inf-storage.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "versioning-inf-storage" {
  bucket = aws_s3_bucket.inf-storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.inf-storage.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "inf-storage" {
  bucket                  = aws_s3_bucket.inf-storage.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "backend-permissions" {
  bucket = aws_s3_bucket.inf-storage.id
  policy = file("../scripts/s3-backend-permission.json")
}