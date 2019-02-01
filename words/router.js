'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require ('passport');
const {Word} = require('../models/word');


const router = express.Router();

const jsonParser = bodyParser.json();

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return Word.find()
    .then(words => res.json(words.map(word => word.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});
 

//GET user by ID
router.get('/getWord/:id', (req,res, next)=>{
  
  Word.findById(req.params.id)
    .then((word)=>{
      return res.json(word);
    });
}); 

//AUTH get all blocks with the uerRef of an authorized User
const jwtAuth = passport.authenticate('jwt', { session: false });

 

module.exports = {router};
