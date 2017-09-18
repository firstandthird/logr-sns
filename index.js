'use strict';
const AWS = require('aws-sdk');
const flatten = require('flat');
const stringify = require('json-stringify-safe');

exports.defaults = {
  clientId: process.env.AWS_ACCESS_KEY_ID,
  secretId: process.env.AWS_SECRET_ACCESS_KEY,
  topic: ''
};

let sns = false;

exports.log = function(options, tags, message) {
  if (!sns) {
    AWS.config.update({
      accessKeyId: options.clientId,
      secretAccessKey: options.secretId
    });
    sns = new AWS.SNS();
  }
  // force object to be flat and also a string:
  let smsMessage = '';
  if (typeof message === 'object') {
    const flatObj = flatten(message);
    Object.keys(flatObj).forEach((key) => {
      smsMessage += `${key}: ${stringify(flatObj[key])} `;
    });
  } else {
    smsMessage = message.toString();
  }
  const params = {
    Message: `[${tags}] ${smsMessage}`,
    TopicArn: options.topic
  };
  sns.publish(params, (err, data) => {
    if (err) {
      console.log(err);
    }
  });
};
