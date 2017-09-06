'use strict';
const AWS = require('aws-sdk');
const flatten = require('flat');

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
  // force string:
  const smsMessage = typeof message === 'object' ? JSON.stringify(flatten(message)) : message.toString();
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
