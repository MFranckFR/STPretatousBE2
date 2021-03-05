'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var messagesController = require('../controllers/Messages');

var service = 'messages';

// get messages or search messages
router.get('/'+service, messagesController.find);

// get message
router.get('/'+service+'/:id', messagesController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create message(s) a single message object will create one message while an array of messages will create multiple messages
router.post('/'+service, messagesController.create);

// update all records that matches the query
router.put('/'+service, messagesController.update);

// update a single record
router.patch('/'+service+'/:id', messagesController.updateOne);

// delete all records that matches the query
router.delete('/'+service, messagesController.delete);

// Delete a single record
router.delete('/'+service+'/:id', messagesController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', messagesController.restore);

module.exports = router;
