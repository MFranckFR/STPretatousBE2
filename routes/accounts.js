'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var accountsController = require('../controllers/Accounts');

var service = 'accounts';

// get accounts or search accounts
router.get('/'+service, accountsController.find);

// get account
router.get('/'+service+'/:id', accountsController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create account(s) a single account object will create one account while an array of accounts will create multiple accounts
router.post('/'+service, accountsController.create);

// update all records that matches the query
router.put('/'+service, accountsController.update);

// update a single record
router.patch('/'+service+'/:id', accountsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, accountsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', accountsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', accountsController.restore);

module.exports = router;
