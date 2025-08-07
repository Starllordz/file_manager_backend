terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# Default VPC
data "aws_vpc" "default" {
  default = true
}

# Default subnets
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Get the first default subnet
data "aws_subnet" "default" {
  id = data.aws_subnets.default.ids[0]
}

# Security Group for EC2 (updated to use default VPC)
resource "aws_security_group" "ec2" {
  name_prefix = "${var.project_name}-ec2-sg"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

resource "tls_private_key" "key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ec2_key" {
  key_name   = "my-ec2-key"
  public_key = tls_private_key.key.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.key.private_key_pem
  filename = "${path.module}/my-ec2-key.pem"
  file_permission = "0600"
}

resource "aws_instance" "main" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = aws_key_pair.ec2_key.key_name
  associate_public_ip_address = true

  tags = {
    Name = "${var.project_name}-ec2"
  }

  user_data = <<-EOF
    #!/bin/bash
    # Update system
    dnf update -y
    
    # Install Docker
    dnf install -y docker
    systemctl start docker
    systemctl enable docker
    
    # Add ec2-user to docker group
    usermod -a -G docker ec2-user

    # Create a network
    docker network create ${var.project_name}-network

    sudo docker run -d --name postgres -p 5432:5432 \
    --network ${var.project_name}-network \
    --restart on-failure \
    -e POSTGRES_DB=${var.database_name} \
    -e POSTGRES_USER=${var.database_user} \
    -e POSTGRES_PASSWORD=${var.database_password} \
    postgres:15-alpine

    sudo docker run -d --name ${var.project_name} -p 80:3000 \
    --network ${var.project_name}-network \
    --restart on-failure \
    -e NODE_ENV='production' \
    -e PORT='3000' \
    -e HOST='0.0.0.0' \
    -e DATABASE_HOST='${var.database_host}' \
    -e DATABASE_PORT='5432' \
    -e DATABASE_USER='${var.database_user}' \
    -e DATABASE_PASSWORD='${var.database_password}' \
    -e DATABASE_NAME='${var.database_name}' \
    -e AWS_ACCESS_KEY_ID='${var.bucket_aws_access_key}' \
    -e AWS_SECRET_ACCESS_KEY='${var.bucket_aws_secret_key}' \
    -e AWS_BUCKET_NAME='${aws_s3_bucket.main.bucket}' \
    -e AWS_REGION='eu-central-1' \
    -e CORS_ORIGIN='*' \
    -e MAX_FILE_SIZE='100' \
    ghcr.io/starllordz/file_manager_backend:main-f8411fe

    EOF

  user_data_replace_on_change = true
}

# S3 Bucket
resource "aws_s3_bucket" "main" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_name
  }
}

# Outputs
output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.main.public_ip
}

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.main.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.main.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.main.arn
}