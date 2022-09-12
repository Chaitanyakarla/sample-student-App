#
# AWS resources that can be deployed using this terraform modules
  - netwoking(vpc,natgateway,public and private subnets)
  - database(elasticache, RDS)
  - Iam
  - serverless(lambda)

#
# Pre-requisites
 ## Create the backend terraform state bucket
  `cd ./tf-scripts/backend` 

  Open the file `main.tf` and comment out the terraform state code as shown below. 
  ```hcl
  provider "aws" {
    profile = "default"
    region  = var.region
    default_tags {
      tags = {
        Environment = var.env
        Workspace   = terraform.workspace
      }
    }
  }


  module "terraform_backend_s3" {
    source              = "../shared-modules/s3backend"
    storage_bucket_name = var.storage_bucket_name
  }


  #terraform {
  #  required_providers {
  #    aws = {
  #      source  = "hashicorp/aws"
  #      version = ">= 4.0.0"
  #    }
  #  }
  #  backend "s3" {
  #    bucket             = "test-studentapp-infrastructure"
  #    key                = "backend/terraform/state"
  #    region             = "ca-central-1"
  #
  #  }
  #}
  ```
  Edit "variables.tf" and modify requried fields (region, bucket_name)

  ```hcl
  variable "region" {
    type    = string
    default = "ca-central-1"
  }

  variable "storage_bucket_name" {
    type        = string
    description = "Environment to place infra in"
    default     = "test-studentapp-infrastructure"
  }
  ```

  Once done with editing go to command line and run terraform init, terraform plan and terraform apply. this will create backend s3 bucket where you will store your state file.
  
  next again edit "main.tf" and un-comment lines that commented in first step and run terraform init, terraform plan,terraform apply. this will create remote state file for the backend s3 bucket.(note:- you need to make sure the bucket name (bucket             = "test-studentapp-infrastructure")) is matching with the name that you specified in "variable.tf")

  ```hcl
  provider "aws" {
    profile = "default"
    region  = var.region
    default_tags {
      tags = {
        Environment = var.env
        Workspace   = terraform.workspace
      }
    }
  }


  module "terraform_backend_s3" {
    source              = "../shared-modules/s3backend"
    storage_bucket_name = var.storage_bucket_name
  }


  terraform {
    required_providers {
      aws = {
        source  = "hashicorp/aws"
        version = ">= 4.0.0"
      }
    }
    backend "s3" {
      bucket             = "test-studentapp-infrastructure"
      key                = "backend/terraform/state"
      region             = "ca-central-1"
  
    }
  }
  ```
  your backend s3 bucket setup is completed.
  
  ## Setting up workspace
  In order to use this code for different environments(dev,pord,ect) you need to setup terraform workspace for those environments. You can skip this step if workspace is already setup. Note that im using vpc module in this example and you can follow same procedure for all other modules to setup workspace.
  ### Step 1 - setting up state file for individual modules
  cd to "student-app/config/networking" and edit "backend.tf". Enter required fields(bucket, region) and save file. Skip this step if you already updated "backen.tf"

    ```hcl
    terraform {
      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = ">= 4.0.0"
        }
      }
      backend "s3" {
        bucket             = "XXXXXXXXX"
        key                = "networking/terraform/state"
        region             = "XXXXXXXX"
      }
    }
    ```
  ### Step 2 - creating different workspace
  run cli command "terraform init". This will download required modules.

  next run cli command "terraform workspace list" in order to get the list of workspaces. If you are running this command for the first time you will only see one workspace "default" which is created by terraform by default.
  
  ```hcl
  $ terraform workspace list
    * default
  ```
  To create new workspace run command "terraform workspace new < env >". this will create and switched to workspace "example". This means you're now on a new, empty workspace.

  ```hcl
  $ terraform workspace new dev
    default
    * dev
  ```
  Similarly you can create different workspaces (Eg: test,dev,utc,etc). once  done creating required workspaces. run ""terraform workspace list", now you will all the workspaces that you created.

  ```hcl
  $ terraform workspace new dev
    default
    * dev
    prod
  ```  
  You can now switch to differend workspace with respect to the environments that you want to work with by running command "terraform workspace select prod".
  ```hcl
  $ terraform workspace select prod
    default
    dev
    * prod
  ```
  Setting up your workspace is completed. Note that setting up workspace is required only during the initial setup

#
# Deployment

Before proceding make sure your backen s3 and workspace is setup by following the steps in pre-reqisits section.

Note currently you can deploy mentioned in first section (AWS resources that can be deployed using this terraform modules). Also, this document is a live document and will be updated with other modules depending upon the requirement.

lets get started

### Usage

cd to "student-app/config/< module >"(eg: networking,database,..). Edit "< environment >.tfvars" (eg: dev.tfvars,prod.tfvars) and specify required variables shown below and save. 

Note:- currently you will see variables ("< environment >.tfvars") for dev and prod. If needed any other environments you need to create that environment variable file in the same folder by running command "touch < environment >.tfvars". Also, need to make sure respective workspace  created and selecting before running terraform init,terraform plan, terraform apply commands. For more details on how to create and selecting workspaces refer section "Pre-requisits -> Setting up workspace".

```hcl
env = "xxx"
region = "xxxxxxxx"
cidr_block = "xxxxxxxxxx"
public_subnet_cidr_blocks = ["xxxxxxxxxx", "xxxxxxxxxx"]
private_subnet_cidr_blocks = ["xxxxxxxxxx", "xxxxxxxxxx"]
availability_zones = ["xxxxxxxxxx", "xxxxxxxxxx"]
vpc_tags = "xxxxxxxxxx"
Environment = "xxxxxxxxxx"
```

once done with editing "< environment >.tfvars". Next select workspace(Eg: dev, prod, etc) that you want to work with by running command "terraform workspace select < environment >".

Next run terraform init, terraform plan, terraform apply. by doing this, resources get created for respective module.