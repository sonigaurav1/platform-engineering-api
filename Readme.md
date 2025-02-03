# Project Setup Guide

This document provides step-by-step instructions for setting up and running the project. Follow the guidelines below to ensure a smooth configuration and deployment process.

## Prerequisites

Before proceeding, make sure you have the following tools installed and configured:

### Terraform

Download and install Terraform from the [official website](https://www.terraform.io/downloads.html).

### AWS CLI

Install the AWS Command Line Interface to interact with AWS services from your terminal. Download it from the [AWS CLI website](https://aws.amazon.com/cli/).

### AWS Account

Sign up for an AWS account if you don’t already have one. Ensure you have the necessary permissions to create and manage S3 buckets, DynamoDB tables, and IAM resources.

### MongoDB Cluster URI

Set up a MongoDB cluster (e.g., using MongoDB Atlas) and obtain the connection URI.

## Setting Up Remote S3 Backend for Terraform

To store your Terraform state remotely and enable state locking, follow these steps:

### 1. Create an S3 Bucket

- Log in to the AWS Management Console.
- Navigate to the S3 service.
- Create a new bucket with a unique name (e.g., `my-terraform-state-bucket`).
- Configure the bucket to enable versioning (recommended for state management).

### 2. Create a DynamoDB Table

- Navigate to the DynamoDB service in the AWS Management Console.
- Create a new table:
    - **Table Name**: `terraform-lock-table`
    - **Primary Key**: `LockID` (String)

### 3. Configure Terraform Backend

Update the `terraform.tf` file in the `terraform_template` folder with the following configuration:

```hcl
terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "5.80.0"
        }
    }

    backend "s3" {
        bucket         = "my-terraform-state-bucket"
        key            = "{{BACKEND_KEY}}"  
        region         = "us-east-1"
        dynamodb_table = "terraform-lock-table"
        encrypt        = true
    }
}
```

This configuration ensures that:

- Your Terraform state is securely stored in the S3 bucket.
- DynamoDB handles state locking to prevent concurrent modifications.

## Project Setup

Follow these steps to set up and run the project:

### 1. Set Up AWS Credentials

- Log in to the AWS Management Console.
- Navigate to the IAM (Identity and Access Management) service.
- Create a new user with programmatic access.
- Attach the necessary policies (e.g., `AmazonS3FullAccess`, `DynamoDBFullAccess`, `AdministratorAccess`).
- Download the Access Key ID and Secret Access Key for the user.

### 2. Configure Environment Variables

Create a `.env` file in the root of your project. Add the following variables to the `.env` file or copy paste from `.env.save` file:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
DB_URI=your_mongodb_uri
ENVIRONMENT=development
DEFAULT_SENDER=yourEmail@example.com
JWT_ACCESS_TOKEN=yourGeneratedJwtAccessToken
JWT_REFRESH_TOKEN=yourGeneratedJwtRefreshToken
```

### 3. Install Dependencies

Run the following commands to set up the project:

```sh
nvm use                # Use the correct Node.js version
npm install            # Install project dependencies
npm run husky          # Set up Git hooks (if applicable)
```

### 4. Start the Development Server

Start the development server with:

```sh
npm run dev
```

The application will be accessible at [http://localhost:4000] or the port specified in your configuration.

## Helpful Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform)
- [AWS Documentation](https://docs.aws.amazon.com)
