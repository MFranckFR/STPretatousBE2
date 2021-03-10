'use strict';
var express = require('express');
var router = express.Router();
var validator = require('../services/validator');
var productsController = require('../controllers/Products');

var service = 'products';

// get products or search products
router.get('/'+service, productsController.find);

// get product
router.get('/'+service+'/:id', productsController.findOne);

// get all bookingrequests for a product
router.get('/'+service+'/:id/bookingrequests', productsController.findAllBookingRequestsOfUser);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }, validator,

// create product(s) a single product object will create one product while an array of products will create multiple products
router.post('/'+service, productsController.create);

// update all records that matches the query
router.put('/'+service, productsController.update);

// update a single record
router.patch('/'+service+'/:id', productsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, productsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', productsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', productsController.restore);

module.exports = router;
