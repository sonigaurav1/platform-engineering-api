## Getting Started

To get started with this project, you will need the following:

1. **AWS Account**: Sign up for an AWS account if you don't have one already. You will need to generate an Access Key ID and a Secret Access Key from the AWS Management Console.

2. **MongoDB Cluster URI**: Set up a MongoDB cluster using MongoDB Atlas or any other MongoDB provider. Obtain the connection URI for your cluster.

### Steps

1. **Set up AWS Credentials**:
    - Go to the AWS Management Console.
    - Navigate to the IAM (Identity and Access Management) service.
    - Create a new user with programmatic access.
    - Attach the necessary policies to the user.
    - Download the Access Key ID and Secret Access Key.

2. **Configure Environment Variables**:
    - Create a `.env` file in the root of your project.
    - Add your AWS credentials and MongoDB URI to the `.env` file:
      ```plaintext
      AWS_ACCESS_KEY_ID=your_access_key_id
      AWS_SECRET_ACCESS_KEY=your_secret_access_key
      DB_URI=your_mongodb_uri
      ENVIRONMENT=development
      ```

3. **Install Dependencies**:
    - Run the following commands to install the necessary dependencies:
      ```sh
      nvm use
      npm install
      npm run husky
      ```

4. **Start the Development Server**:
    - Run the following command to start the development server:
      ```sh
      npm run dev
      ```

Your project should now be up and running. You can access it at `http://localhost:4000` or the specified port in your configuration.
