'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var loansController = require('../controllers/Loans');

var service = 'loans';

// get loans or search loans
router.get('/'+service, loansController.find);

// get loan
router.get('/'+service+'/:id', loansController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create loan(s) a single loan object will create one loan while an array of loans will create multiple loans
router.post('/'+service, loansController.create);

// update all records that matches the query
router.put('/'+service, loansController.update);

// update a single record
router.patch('/'+service+'/:id', loansController.updateOne);

// delete all records that matches the query
router.delete('/'+service, loansController.delete);

// Delete a single record
router.delete('/'+service+'/:id', loansController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', loansController.restore);

module.exports = router;
