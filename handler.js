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