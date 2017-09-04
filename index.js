'use strict';
const AWS = require('aws-sdk');

exports.defaults = {
  clientId: process.env.AWS_ACCESS_KEY_ID,
  secretId: process.env.AWS_SECRET_ACCESS_KEY,
  phoneNumbers: [] // 11-digit phone number starting with 1
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
  options.phoneNumbers.forEach((number) => {
    const params = {
      Message: `[${tags}] ${message}`,
      PhoneNumber: number
    };
    sns.publish(params, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  });
};
