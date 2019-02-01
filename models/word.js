'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const wordSchema = mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

// Transform output during `res.json(data)`, `console.log(data)` etc.
wordSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

wordSchema.methods.serialize = function() {
  return {
    word: this.word || '',
    answer: this.answer || '',
    _id: this._id
  };
};

const Word = mongoose.model('Word', wordSchema);

module.exports = {Word};