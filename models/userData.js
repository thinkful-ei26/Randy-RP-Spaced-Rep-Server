'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  userScore: {type: Number},
  wordList: [{
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Word', required: true },
    correctCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Transform output during `res.json(data)`, `console.log(data)` etc.
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

userSchema.methods.serialize = function() {
  return {
    userScore: this.userScore || '',
    wordList: this.wordList || '',
    userId: this.userId
  };
};

// wordSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

const User = mongoose.model('User', userSchema);

module.exports = { User };