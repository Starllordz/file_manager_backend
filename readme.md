# Backend File Management API

A HTTP server built with Node.js, TypeScript, and Express that manages file uploads and provides data for a dashboard.
The server is integrated with a PostgreSQL database using Kysely and uploads file into a S3 bucket.

## Features and assumptions
During the development I assumed that values for Category, Language, Provider, Roles fields are not a finite set of options
but can vary through time. 
The choice of storing the roles in a jsonb column is due to the Kysley ORM not supporting array data types. Other ORMs support
this type of datatypes that can be a better fit to model the requirements. 

All the files are uploaded in a single path in an S3 bucket. For the future, when an authentication structure will be in place the files
can be differentiated by path based on the users or the tenants. 

The files download are served trough the generation of a direct pre signed url that allow secure access to a resource in the bucket. The urls
have a 60 minutes expiration. 

## Requisites

- Node.js (v18 or higher)
- PostgreSQL
- AWS S3 account with a S3 bucket
- Docker & Docker Compose

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```
Then move inside the cloned folder. 

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy then `.env.example` file in the docker directory and fill edit the variables with yours:
   ```env
   # Server Configuration
   PORT=3000
   HOST=0.0.0.0
   NODE_ENV=development

   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=backend_db

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_BUCKET_NAME=your_bucket_name
   AWS_REGION=eu-west-1

   # File Upload Configuration
   MAX_FILE_SIZE=100

   # CORS Configuration
   CORS_ORIGIN=*
   ```
Note that the aws credentials are used to operate with an S3 bucket, so the corresponding user should have permissions to do that.

4. **Start the development server**
   ```bash
   docker/docker-compose up
   ```
This script wraps the docker compose command in order to pass the specified variables to the docker-compose.yml.
Upon startup the server runs the migrations autonomously to setup the database schema.

### Docker Setup
The production Dockerfile is situated in the main folder.
It includes ARGS that should be passed when the built image is run. This is used in the terraform deployment

## API Endpoints

### Health Check
- `GET /api/v1/healthcheck` - Server health status

### File Management
- `GET /api/v1/files` - List all files with optional filtering
- `POST /api/v1/files` - Upload a new file
- `GET /api/v1/files/:id` - Get file information by ID
- `GET /api/v1/files/stats` - Get file statistics

For more information about the API endpoints and usage, check the Postman collection: `backend_apis.postman_collection.json`

## Testing
The unit tests are located in the `tests` folder.
Here's how to run them:
```bash
npm test
```
To run them with coverage:
```bash
npm run test:coverage
```

## Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm run start` - Start the production server
- `npm run migrate` - Run database migrations
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report


## Infrastructure

The infrastructure to deploy the solution is quite simple. It consists of the following resources: 

- An EC2 instance
- An S3 bucket
- Some security group configuration

I chose to deploy the solution on AWS cloud using Terraform, that is a very popular infrastructure-as-code tool.
Terraform allows to create resurces in a declarative form.
The resources are defined in the `main.tf` file while the variables that are passed to the resources are defined in the `variables.tf` file.

### Setup

Make shure that you have Terraform installed.

To deploy the solution we need a file called `terraform.tfvars.json` in which all the 
values and secrets should be stored. It should have this structure:

```json
{
    "aws_region": "eu-west-1",
    "project_name": "pack-project",
    "instance_type": "t3.micro",
    "ami_id": "ami-0669b163befffbdfc",
    "bucket_name": "pack-project-bucket-2025",
    "aws_access_key": "xxx",
    "aws_secret_key": "xxx",
    "database_host": "postgres",
    "database_user": "backend_user",
    "database_password": "password",
    "database_name": "backend_db",
    "bucket_aws_access_key": "xxx",
    "bucket_aws_secret_key": "xxx"
}
```

The values can be of our choice. Only aws keys should have some requirements.
The values `aws_access_key`, `aws_secret_key` are used to create the resources, so the associated user should have 
permissions to create such resources (EC2, S3).
The values `bucket_aws_access_key`, `aws_bucket_aws_secret_keysecret_key` are used to access the S3 bucket, so the associated 
user or role should have permissions to operate with S3 buckets. 

### Deployment

Once configured we need a couple of commands to create the infrastructure.

1. **Init Terraform**
Setup the terraform environment
   ```bash
   terraform init
   ```
2. **Plan**
Plan the creation of the resources
   ```bash
   terraform plan
   ```

3. **Apply**
Create the resources
   ```bash
   terraform apply
   ```

4. **Destroy**
If we need to destroy all the resources created we can do so with this command
   ```bash
   terraform destroy
   ```






