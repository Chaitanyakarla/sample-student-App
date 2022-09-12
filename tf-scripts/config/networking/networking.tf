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


locals {
  vpc_name = "${terraform.workspace}-vpc"
}

################################################################################
# VPC Module
################################################################################

module "vpc" {
  source = "../../shared-modules/vpc"

  name = local.vpc_name
  cidr_block = var.cidr_block

}


################################################################################
# Public subnet
################################################################################

module "public_subnets" {
  source                           = "../../shared-modules/subnets"
  vpc_id                           = module.vpc.vpc_id
  public_subnet_cidr_blocks        = var.public_subnet_cidr_blocks
  azs                              = var.availability_zones

}


################################################################################
# private subnet
################################################################################

module "private_subnets" {
  source                           = "../../shared-modules/subnets"
  vpc_id                           = module.vpc.vpc_id
  private_subnet_cidr_blocks        = var.private_subnet_cidr_blocks
  azs                              = var.availability_zones

}


################################################################################
# Internet Gateway
################################################################################


resource "aws_internet_gateway" "default" {
  vpc_id = module.vpc.vpc_id

  tags = merge(
    {
      Name        = "Student-tf-InternetGW",
      Environment = var.env
    },
    var.tags
  )
}


################################################################################
# Publiс routes
################################################################################

resource "aws_route_table" "public" {
  vpc_id = module.vpc.vpc_id

  tags = merge(
    {
      Name        = "Student-tf-PublicRouteTable",
      Environment = var.env
    },
    var.tags
  )
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.default.id
}

################################################################################
# Private routes
################################################################################


resource "aws_route_table" "private" {
  count = length(var.private_subnet_cidr_blocks)
  vpc_id = module.vpc.vpc_id

  tags = merge(
    {
      Name        = "Student-tf-PrivateRouteTable",
      Environment = var.env
    },
    var.tags
  )
}

resource "aws_route" "private" {
  count = length(var.private_subnet_cidr_blocks)

  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.default[count.index].id
}


################################################################################
# NAT resources
################################################################################

resource "aws_eip" "nat" {
  count = length(var.public_subnet_cidr_blocks)
  vpc = true
}


resource "aws_nat_gateway" "default" {
  depends_on = [aws_internet_gateway.default]

  count = length(var.public_subnet_cidr_blocks)


  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = module.public_subnets.public_subnet_id[count.index]

  tags = merge(
    {
      Name        = "Student-tf-NATGW${count.index}",
      Environment = var.env
    },
    var.tags
  )
}



################################################################################
# Route table association
################################################################################

resource "aws_route_table_association" "public" {
  count = length(var.public_subnet_cidr_blocks)

  subnet_id      = module.public_subnets.public_subnet_id[count.index]
  route_table_id = aws_route_table.public.id
}


resource "aws_route_table_association" "private" {
  count = length(var.private_subnet_cidr_blocks)

  subnet_id      = module.private_subnets.private_subnet_id[count.index]
  route_table_id = aws_route_table.private[count.index].id
}