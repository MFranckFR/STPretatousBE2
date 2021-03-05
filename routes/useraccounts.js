'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var useraccountsController = require('../controllers/Useraccounts');

var service = 'useraccounts';

// get useraccounts or search useraccounts
router.get('/'+service, useraccountsController.find);

// get useraccount
router.get('/'+service+'/:id', useraccountsController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create useraccount(s) a single useraccount object will create one useraccount while an array of useraccounts will create multiple useraccounts
router.post('/'+service, useraccountsController.create);

// update all records that matches the query
router.put('/'+service, useraccountsController.update);

// update a single record
router.patch('/'+service+'/:id', useraccountsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, useraccountsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', useraccountsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', useraccountsController.restore);

module.exports = router;
