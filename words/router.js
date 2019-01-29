'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require ('passport');
const {Word} = require('../models/word');


const router = express.Router();

const jsonParser = bodyParser.json();

// // Auth Post to register a new user
// router.post('/', jsonParser, (req, res) => {
 
//   const requiredFields = ['word', 'meaning'];
//   const missingField = requiredFields.find(field => !(field in req.body));

//   if (missingField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Missing field',
//       location: missingField
//     });
//   }

//   const stringFields = ['word', 'meaning'];
//   const nonStringField = stringFields.find(
//     field => field in req.body && typeof req.body[field] !== 'string'
//   );

//   if (nonStringField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Incorrect field type: expected string',
//       location: nonStringField
//     });
//   }

//   // If the username and password aren't trimmed we give an error.  Users might
//   // expect that these will work without trimming (i.e. they want the password
//   // "foobar ", including the space at the end).  We need to reject such values
//   // explicitly so the users know what's happening, rather than silently
//   // trimming them and expecting the user to understand.
//   // We'll silently trim the other fields, because they aren't credentials used
//   // to log in, so it's less of a problem.
//   const explicityTrimmedFields = ['word', 'meaning'];
//   const nonTrimmedField = explicityTrimmedFields.find(
//     field => req.body[field].trim() !== req.body[field]
//   );

//   if (nonTrimmedField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Cannot start or end with whitespace',
//       location: nonTrimmedField
//     });
//   }

//   let { word, meaning } = req.body;

//   return Word.find({word})
//     .count()
//     .then(count => {
//       if (count > 0) {
//         // There is an existing user with the same username
//         return Promise.reject({
//           code: 422,
//           reason: 'ValidationError',
//           message: 'Username already taken',
//           location: 'username'
//         });
//       }
//       // If there is no existing user, hash the password
//       return Word.hashPassword(password);
//     })
//     .then(hash => {
//       return User.create({
//         username,
//         password: hash,
//         firstName,
//         lastName
//       });
//     })
//     .then(user => {
//       return res.status(201).json(user.serialize());
//     })
//     .catch(err => {
//       // Forward validation errors on to the client, otherwise give a 500
//       // error because something unexpected has happened
//       if (err.reason === 'ValidationError') {
//         return res.status(err.code).json(err);
//       }
//       res.status(500).json({code: 500, message: 'Internal server error'});
//     });
// });

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {

  console.log('Get fetched from server');

  return Word.find()
    .then(words => res.json(words.map(word => word.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


//GET user by ID
router.get('/getWord/:id', (req,res, next)=>{

  console.log('finding by this id>>> ',req.params.id);
  
  Word.findById(req.params.id)
    .then((word)=>{

      return res.json(word);
 
    });
 
}); 

 

//AUTH get all blocks with the uerRef of an authorized User
const jwtAuth = passport.authenticate('jwt', { session: false });

// router.get('/blocks/',jwtAuth,(req,res) => {
 
//   console.log('looking for this user id: ',req.user.id);

//   //let testId = "5c3655bdead1409174e85298";

//   Block.find({userRef: req.user.id})
//     .then((data)=>{return res.json(data);});

// });

// //AUTH post blocks
// //Post--Create a block
// router.post('/blocks/post',jwtAuth,(req,res,next)=>{

//   console.log('body>> ',req.body);

  
//   const startDateInput = req.body.startDate;
//   const endDateInput = req.body.endDate;
//   const userRefInput = req.body.userRef;

//   const newBlock = {

//     userRef: userRefInput,
//     startDate: startDateInput,
//     endDate: endDateInput


//   };

//   Block.create(newBlock)
//     .then((data)=>{

//       res.json(data);
 
//     });

// });

// //PUT--edit by ID by its ID and user ID
// router.put('/blocks/put/:id',jwtAuth,(req,res,next)=>{

//   const blockId = req.params.id;
//   //const userRef = req.body.userRef;

//   const updateStartDate = req.body.startDate;
//   const updateEndDate = req.body.endDate;

//   const blockUpdate = {
 
//     startDate: updateStartDate,
//     endDate: updateEndDate

//   };

//   Block.findOneAndUpdate({_id: blockId}, blockUpdate, {new: true})
//     .then((data)=>{

//       res.json(data);

//     });
 

// }); 


// //DELETE
// router.delete('/delete/:id',jwtAuth,(req,res,next)=>{

//   const findById = req.params.id;

//   Block.findByIdAndRemove({_id : findById})
//     .then((data)=>{

//       res.sendStatus(204);
//       console.log('gone!');
//       return res.json(data);


//     });



// });

 

module.exports = {router};
