'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var bookingrequestsController = require('../controllers/Bookingrequests');

var service = 'bookingrequests';

// get bookingrequests or search bookingrequests
router.get('/'+service, bookingrequestsController.find);

// get bookingrequest
router.get('/'+service+'/:id', bookingrequestsController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create bookingrequest(s) a single bookingrequest object will create one bookingrequest while an array of bookingrequests will create multiple bookingrequests
router.post('/'+service, bookingrequestsController.create);

// update all records that matches the query
router.put('/'+service, bookingrequestsController.update);

// update a single record
router.patch('/'+service+'/:id', bookingrequestsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, bookingrequestsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', bookingrequestsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', bookingrequestsController.restore);

module.exports = router;
