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
```
serverless --version
```

### Create a new Serverless project using the serverless command:
```
serverless create --template aws-nodejs --path serverless-elb
```

_This template includes a simple Node.js Lambda function that returns a message when invoked. It also generates a serverless.yml file that contains the project's configuration._

### Install serverless-localstack plugin:
```
npm init -y
npm install -D serverless serverless-localstack serverless-deployment-bucket
```

### To setup the plugins installed earlier, add the following properties to serverless.yml file:
```
service: serverless-elb

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs12.x


functions:
  hello:
    handler: handler.hello

plugins:
  - serverless-deployment-bucket
  - serverless-localstack

custom:
  localstack:
    stages:
      - local
```

### Configure a deploy script in your package.json file to simplify the deployment process. It lets you run the serverless deploy command directly over your local infrastructure. Update package.json file to the following:
```
{
  "name": "serverless-elb",
  "version": "1.0.0",
  "description": "",
  "main": "handler.js",
  "scripts": {
    "deploy": "sls deploy --stage local"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "serverless": "^3.25.0",
    "serverless-deployment-bucket": "^1.6.0",
    "serverless-localstack": "^1.0.1"
  }
}
```

With this configuration, you can now run the deployment script using:
```
npm run deploy
```

This will execute the serverless deploy --stage local command, deploying your Serverless project to LocalStack.

## Create Lambda functions & ELB Application Load Balancers

### Create two Lambda functions named hello1 and hello2 that will run on the Node.js 12.x runtime. Open the handler.js file and replace the existing code with the following:
```
'use strict';

module.exports.hello1 = async (event) => {
  console.log(event);
  return {
    "isBase64Encoded": false,
    "statusCode": 200,
    "statusDescription": "200 OK",
    "headers": {
        "Content-Type": "text/plain"
    },
    "body": "Hello 1"
  };
};

module.exports.hello2 = async (event) => {
  console.log(event);
    return {
    "isBase64Encoded": false,
    "statusCode": 200,
    "statusDescription": "200 OK",
    "headers": {
        "Content-Type": "text/plain"
    },
    "body": "Hello 2"
  };
};
```
_Each function will log the incoming event and respond with a status code of 200 and a custom message._

### Configure the serverless.yml file to create an Application Load Balancer (ALB) and attach the Lambda functions to it:
```
service: serverless-elb

provider:
  name: aws
  runtime: nodejs12.x
  deploymentBucket:
    name: testbucket

functions:
  hello1:
    handler: handler.hello1
    events:
    - alb:
        listenerArn: !Ref HTTPListener
        priority: 1
        conditions:
          path: /hello1
  hello2:
    handler: handler.hello2
    events:
    - alb:
        listenerArn: !Ref HTTPListener
        priority: 2
        conditions:
          path: /hello2

plugins:
  - serverless-deployment-bucket
  - serverless-localstack

custom:
  localstack:
    stages:
      - local
```

### Create a VPC, a subnet, an Application Load Balancer, and an HTTP listener on the load balancer that redirects traffic to the target group. To do this, add the following resources to your serverless.yml file:
```
...
resources:
  Resources:
    LoadBalancer:
      Type: AWS::ElasticLoadBalancingV2::LoadBalancer
      Properties:
        Name: lb-test-1
        Subnets:
          - !Ref Subnet
    HTTPListener:
      Type: AWS::ElasticLoadBalancingV2::Listener
      Properties:
        DefaultActions:
          - Type: redirect
            RedirectConfig:
              Protocol: HTTPS
              Port: 443
              Host: "#{host}"
        LoadBalancerArn: !Ref LoadBalancer
        Protocol: HTTP
    Subnet:
      Type: AWS::EC2::Subnet
      Properties:
        VpcId: !Ref VPC
        CidrBlock: 12.2.1.0/24
        AvailabilityZone: !Select
          - 0
          - Fn::GetAZs: !Ref "AWS::Region"
    VPC:
      Type: AWS::EC2::VPC
      Properties:
        EnableDnsSupport: "true"
        EnableDnsHostnames: "true"
        CidrBlock: 12.2.1.0/24
```

## Creating the infrastructure on LocalStack

### Deploy the Serverless project and verify the resources created in LocalStack. Run the following command:
```
npm run deploy
```






