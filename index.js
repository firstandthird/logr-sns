'use strict';
const AWS = require('aws-sdk');
const flatten = require('flat');
const stringify = require('json-stringify-safe');

exports.defaults = {
  clientId: process.env.AWS_ACCESS_KEY_ID,
  secretId: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  topic: ''
};

let sns = false;

exports.log = function(options, tags, message) {
  if (!sns) {
    AWS.config.update({
      accessKeyId: options.clientId,
      secretAccessKey: options.secretId,
      region: options.region
    });
    sns = new AWS.SNS();
  }
  // force object to be flat and also a string:
  let smsMessage = '';
  if (typeof message === 'object') {
    const flatObj = flatten(message);
    if (typeof flatObj.message === 'string') {
      smsMessage = `${flatObj.message} \n`;
      delete flatObj.message;
    }
    Object.keys(flatObj).forEach((key) => {
      smsMessage += `${key}: ${stringify(flatObj[key])} \n`;
    });
  } else {
    smsMessage = message.toString();
  }
  const params = {
    Message: `${smsMessage} \n [${tags}] `,
    TopicArn: options.topic
  };
  sns.publish(params, (err, data) => {
    if (err) {
      console.log(err);
    }
  });
};
