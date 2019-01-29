'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const wordSchema = mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  correctCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 }
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
    meaning: this.meaning || '',
    correctCount: this.correctCount || 0,
    totalCount: this.totalCount || 0,
    id: this._id
  };
};

// wordSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// wordSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// };

const Word = mongoose.model('Word', wordSchema);

module.exports = {Word};