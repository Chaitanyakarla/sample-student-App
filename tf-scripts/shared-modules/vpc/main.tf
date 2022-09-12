

################################################################################
# VPC
################################################################################

resource "aws_vpc" "this" {

  cidr_block                       = var.cidr_block
  enable_dns_hostnames             = var.enable_dns_hostnames

  tags = merge(
    { "Name" = var.name },
    var.tags,
    var.vpc_tags,
  )
}

resource "aws_vpc_ipv4_cidr_block_association" "this" {
  count = var.create_vpc && length(var.secondary_cidr_blocks) > 0 ? length(var.secondary_cidr_blocks) : 0

  # Do not turn this into `local.vpc_id`
  vpc_id = aws_vpc.this.id

  cidr_block = element(var.secondary_cidr_blocks, count.index)
}

