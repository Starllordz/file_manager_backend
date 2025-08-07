
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "pack-project"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-0c02fb55956c7d323"
}

variable "key_pair_name" {
  description = "Name of the AWS key pair to use for SSH access"
  type        = string
  default     = ""
}

variable "bucket_name" {
  description = "Name of the S3 bucket (must be globally unique)"
  type        = string
  default     = "pack-project-bucket-2025"
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
  default     = ""
}

variable "aws_secret_key" {
  description = "AWS secret key"
  type        = string
  default     = ""
}

variable "database_host" {
  description = "Database host"
  type        = string
  default     = ""
}

variable "database_user" {
  description = "Database user"
  type        = string
  default     = ""
}

variable "database_password" {
  description = "Database password"
  type        = string
  default     = ""
}

variable "database_name" {
  description = "Database name"
  type        = string
  default     = ""
}

variable "bucket_aws_access_key" {
  description = "AWS access key"
  type        = string
  default     = ""
}

variable "bucket_aws_secret_key" {
  description = "AWS secret key"
  type        = string
  default     = ""
}