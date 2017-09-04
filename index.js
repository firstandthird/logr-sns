'use strict';
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.defaults = {
  clientId: process.env.AWS_ACCESS_KEY_ID,
  secretId: process.env.AWS_SECRET_ACCESS_KEY,
  phoneNumbers: [] // 11-digit phone number starting with 1
};
exports.log = function(options, tags, message) {
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
