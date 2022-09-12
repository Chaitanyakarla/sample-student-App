


################################################################################
# Public subnet
################################################################################

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidr_blocks)
  vpc_id                  = var.vpc_id
  cidr_block              = element((var.public_subnet_cidr_blocks), count.index)
  availability_zone       = element((var.azs), count.index)
  map_public_ip_on_launch = var.map_public_ip_on_launch


  tags = merge(
    {
      Name        = "Student-tf-PublicSubnet",
      Environment = "test"
    },
    var.tags
  )
}


################################################################################
# Private subnet
################################################################################


resource "aws_subnet" "private" {
  count            = length(var.private_subnet_cidr_blocks)

  vpc_id            = var.vpc_id
  cidr_block        = element((var.private_subnet_cidr_blocks), count.index)
  availability_zone = element((var.azs), count.index)

  tags = merge(
    {
      Name        = "Student-tf-PrivateSubnet${count.index}",
      Environment = var.Environment
    },
    var.tags
  )
}