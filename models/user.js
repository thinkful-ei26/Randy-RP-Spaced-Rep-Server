'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, require: true},
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Add `createdAt` and `updatedAt` fields
userSchema.set('timestamps', true);

// Transform output during `res.json(data)`, `console.log(data)` etc.
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('User', userSchema);