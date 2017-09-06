'use strict';
const Logr = require('logr');
const logrSNS = require('../index.js');
const test = require('tap').test;

test('can load the sns plugin ', (t) => {
  t.plan(1);
  const log = Logr.createLogger({
    type: 'sns',
    reporters: {
      sns: {
        reporter: logrSNS
      }
    }
  });
  t.equal(typeof log, 'function', 'should register a "log" function');
});

test('can send a message to SNS', (t) => {
  const log = Logr.createLogger({
    type: 'sns',
    reporters: {
      sns: {
        reporter: logrSNS,
        options: {
          topic: process.env.SNS_TOPIC
        }
      }
    }
  });
  log(['logr-sns', 'notice'], 'this is a test message');
  t.end();
});

test('can send an object to SNS', (t) => {
  const log = Logr.createLogger({
    type: 'sns',
    reporters: {
      sns: {
        reporter: logrSNS,
        options: {
          topic: process.env.SNS_TOPIC
        }
      }
    }
  });
  log(['logr-sns', 'notice'], { date: new Date(), message: { a: true, b: 123 }, err: new Error('an error') });
  t.end();
});
