
module "terraform_backend_s3" {
  source              = "../../shared-modules/s3backend"
  storage_bucket_name = var.storage_bucket_name
}



 