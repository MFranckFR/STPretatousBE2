'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var bookingsController = require('../controllers/Bookings');

var service = 'bookings';

// get bookings or search bookings
router.get('/'+service, bookingsController.find);

// get booking
router.get('/'+service+'/:id', bookingsController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create booking(s) a single booking object will create one booking while an array of bookings will create multiple bookings
router.post('/'+service, bookingsController.create);

// update all records that matches the query
router.put('/'+service, bookingsController.update);

// update a single record
router.patch('/'+service+'/:id', bookingsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, bookingsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', bookingsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', bookingsController.restore);

module.exports = router;
