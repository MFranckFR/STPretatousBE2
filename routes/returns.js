'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var returnsController = require('../controllers/Returns');

var service = 'returns';

// get returns or search returns
router.get('/'+service, returnsController.find);

// get return
router.get('/'+service+'/:id', returnsController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create return(s) a single return object will create one return while an array of returns will create multiple returns
router.post('/'+service, returnsController.create);

// update all records that matches the query
router.put('/'+service, returnsController.update);

// update a single record
router.patch('/'+service+'/:id', returnsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, returnsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', returnsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', returnsController.restore);

module.exports = router;
