'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const { Word } = require('../models/word');

const { words } = require('../db/data');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);

mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.info('Delete Data');
    return Promise.all([
      Word.deleteMany()
    ]);
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Word.insertMany(words)
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
