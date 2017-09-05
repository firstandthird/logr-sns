'use strict';
const AWS = require('aws-sdk');

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
  const params = {
    Message: `[${tags}] ${message}`,
    TopicArn: options.topic
  };
  sns.publish(params, (err, data) => {
    if (err) {
      console.log(err);
    }
  });
};
