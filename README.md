# Setting up Elastic Load Balancing (ELB) Application Load Balancers using LocalStack, deployed via the Serverless framework

## This project demonstrates setting up Elastic Load Balancing (ELB) using LocalStack, focusing on creating a load balancer to distribute traffic among multiple instances of a Node.js Lambda function.

## Prerequisites

Before you start, ensure you have the following installed:

- **Docker**: Required to run LocalStack, providing a local AWS cloud stack.
- **AWS CLI**: Used to interact with AWS services and LocalStack.
- **Node.js**: Necessary for running Node.js applications and Lambda functions.
- **Serverless Framework**: Utilized for deploying serverless applications to AWS or LocalStack.

## Setup a Serverless project

### Install Serverless framework: 
```
npm install -g serverless
```

### Verify the installation:
serverless --version

### Create a new Serverless project using the serverless command:
serverless create --template aws-nodejs --path serverless-elb

_This template includes a simple Node.js Lambda function that returns a message when invoked. It also generates a serverless.yml file that contains the project's configuration._

### Install serverless-localstack plugin:
npm init -y
npm install -D serverless serverless-localstack serverless-deployment-bucket