'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://randy:password123@ds115595.mlab.com:15595/italian-spaced-repetition',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://randy:password123@ds115595.mlab.com:15595/italian-spaced-repetition'
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};
