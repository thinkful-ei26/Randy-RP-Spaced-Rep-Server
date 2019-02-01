'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  questions: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      word: String,
      answer: String,
      memoryStrength: {type: Number, default: 1},
      next: Number
    }
  ],
  head: {type: Number, default: 0},
  score: {type: Number, default: 0}
});

// Add `createdAt` and `updatedAt` fields
UserSchema.set('timestamps', true);

// Transform output during `res.json(data)`, `console.log(data)` etc.
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    questions: this.questions,
    head: this.head,
    _id: this._id,
    score: this.score
  };

};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
