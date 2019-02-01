/* eslint-disable no-empty */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require ('passport');
const {User} = require('../models/user');

const router = express.Router();

const jsonParser = bodyParser.json();

// Auth Post to register a new user
router.post('/', jsonParser, (req, res) => {
 
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 5,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = '', questions} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        questions  
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});





//endpoint for user words
// //PUT--edit by ID
router.put('/put/:id',(req,res,next) =>{
  const findById = req.params.id;
  const newName = req.body.name;

  User.findOneAndUpdate({_id: findById}, {name: newName}, {new: true})
    .then(data =>{
      return res.json(data);
    });
});

//GET user by ID
router.get('/getNextWord/:id', (req,res, next)=>{
  User.findById(req.params.id)
    .then((data)=>{
      return res.json(data);
    });
}); 

//GET THE CURRENT WORD from current user head
router.get('/next/:id', (req, res, next)=>{
//geGet word by index
  User.findById(req.params.id)
    .then((data)=>{
      return (res.json(data));
    });
}); 

//AUTH  of an authorized User
  const jwtAuth = passport.authenticate('jwt', { session: false });
 
//PUT BY USER ID THE NEW ORDER OF QUESTIONS BASED ON RESULT
router.put('/next/:id/:testResults',(req,res,next) =>{
   
  const testResults = req.params.testResults;
  const findById = req.params.id;
  let userData = req.body;
  let questionsArray = userData.questions;
  let oldHead = userData.head;
  let oldWord = userData.questions[oldHead]; //we'll need to change this 'next' equal to the [head+m].next
  let newHead = userData.questions[oldHead].next;
  let oldMS = userData.questions[oldHead].memoryStrength;
  let newMS;

  //TRUE
  if(testResults === 'true'){
    newMS = oldMS*2;
    //increase score
    let newScore = userData.score;
    newScore = newScore + 1;
    userData.score = newScore;
  }
  /*FALSE*/ 
  else if(testResults === 'false') { 
    newMS = oldMS + 1; 
    //decrease score
    let newScore = userData.score;
    newScore = newScore - 1;
    userData.score = newScore;
  }

  //score shold not go less than 0!
  if (userData.score < 0){
    let newScore = 0;
    userData.score = newScore;
  }
  if (newMS > questionsArray.length - 1) {
    newMS = (questionsArray.length - 1);
  }

  let swapWordIndex;
  //testing
  if ((oldHead + newMS) > questionsArray.length - 1) {
    swapWordIndex = (questionsArray.length - 1);
  }
  else {
    swapWordIndex = oldHead + newMS;
  }
   
  let swappWord = userData.questions[swapWordIndex];
  
  oldWord.next = swappWord.next;
  oldWord.memoryStrength = newMS;
  swappWord.next = oldHead;
  questionsArray[swapWordIndex] = swappWord;
  questionsArray[oldHead] = oldWord;
  userData.questions = questionsArray;
  userData.head = newHead;

  User.findOneAndUpdate({_id: findById}, userData, {new: true})
    .then(data => res.json(data));
});

module.exports = {router};