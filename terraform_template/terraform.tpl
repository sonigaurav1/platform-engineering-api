terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.80.0"
    }
  }
  backend "s3" {
    bucket         = "terraform-practice-state-file"
    key            = "{{BACKEND_KEY}}"
    region         = "us-east-1"
    dynamodb_table = "tf-state-locking"
    encrypt        = true
  }
}
