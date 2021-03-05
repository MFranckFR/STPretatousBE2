'use strict';

var db = require('../services/database').mongo;

var queue = require('../services/queue');

var collection = 'Products';

var debug = require('debug')(collection);

const REGEX_URL = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi; 


var schemaObject = {
    // ++++++++++++++ Modify to your own schema ++++++++++++++++++
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    owner:{
        type:String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        maxlength: 20
    },
    bookingEnable: {
        type: Boolean,
        required: false,
        default:true
    },
    image: {
        type: String
    },
    toPop: {
        type: db._mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }

    // ++++++++++++++ Modify to your own schema ++++++++++++++++++
};

schemaObject.createdAt = {
    type: 'Date',
    default: Date.now
};

schemaObject.updatedAt = {
    type: 'Date',
    default: new Date().toISOString()
};

schemaObject.owner = {
    type: db._mongoose.Schema.Types.ObjectId,
    ref: 'Useraccount'
};

schemaObject.createdBy = {
    type: db._mongoose.Schema.Types.ObjectId,
    ref: 'Useraccount'
};

// schemaObject.client = {
//     type: db._mongoose.Schema.Types.ObjectId,
//     ref: 'Clients'
// };

// schemaObject.developer = {
//     type: db._mongoose.Schema.Types.ObjectId,
//     ref: 'Users'
// };

schemaObject.tags = {
    type: [String],
    index: 'text'
};

// Let us define our schema
var Schema = db._mongoose.Schema(schemaObject);

// Index all text for full text search
// MyModel.find({$text: {$search: searchString}})
//    .skip(20)
//    .limit(10)
//    .exec(function(err, docs) { ... });
// Schema.index({'tags': 'text'});

Schema.statics.search = function (string) {
    return this.find({ $text: { $search: string } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
};

// assign a function to the "methods" object of our Schema
// Schema.methods.someMethod = function (cb) {
//     return this.model(collection).find({}, cb);
// };

// assign a function to the "statics" object of our Schema
// Schema.statics.someStaticFunction = function(query, cb) {
// eg. pagination
// this.find(query, null, { skip: 10, limit: 5 }, cb);
// };

// Adding hooks

Schema.pre('save', function (next) {
    // Indexing for search
    var ourDoc = this._doc;

    ourDoc.model = collection;

    // Dump it in the queue
    queue.create('searchIndex', ourDoc)
        .save();

    next();
});

Schema.post('init', function (doc) {
    debug('%s has been initialized from the db', doc._id);
});

Schema.post('validate', function (doc) {
    debug('%s has been validated (but not saved yet)', doc._id);
});

Schema.post('save', function (doc) {
    debug('%s has been saved', doc._id);
});

Schema.post('remove', function (doc) {
    debug('%s has been removed', doc._id);
});

Schema.pre('validate', function (next) {
    debug('this gets printed first');
    next();
});

Schema.post('validate', function () {
    debug('this gets printed second');
});

Schema.pre('find', function (next) {
    debug(this instanceof db._mongoose.Query); // true
    this.start = Date.now();
    next();
});

Schema.post('find', function (result) {
    debug(this instanceof db._mongoose.Query); // true
    // prints returned documents
    debug('find() returned ' + JSON.stringify(result));
    // prints number of milliseconds the query took
    debug('find() took ' + (Date.now() - this.start) + ' millis');
});

Schema.pre('update', function (next) {
    // Indexing for search
    var ourDoc = this._update;
    ourDoc.model = collection;
    ourDoc.update = true;
    if (ourDoc.updatedAt || ourDoc.tags) { /* jslint ignore:line */
        // Move along! Nothing to see here!!
    } else {
        // Dump it in the queue
        queue.create('searchIndex', ourDoc)
            .save();
    }

    ourDoc.updatedAt = new Date(Date.now()).toISOString();

    next();
});

var Model = db.model(collection, Schema);
Model._mongoose = db._mongoose;

module.exports = Model;
