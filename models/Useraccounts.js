'use strict';

const bcrypt = require('bcrypt');

var db = require('../services/database').mongo;

var queue = require('../services/queue');

var collection = 'Useraccounts';

var debug = require('debug')(collection);

// Validation
const REGEX_MATCH_EMAIL = /[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})/;
const REGEX_NAME = /^[\w-.\p{éèêëäàâüùûïîöô}']+$/;
const REGEX_STREET = /^[\w-.\p{éèêëäàâüùûïîöô}'\s,]+$/;
const REGEX_ZIPCODE = /^[\d]{5,7}$/;
const REGEX_CITY = /^[\w-.\p{éèêëäàâüùûïîöô}']+$/;
const REGEX_COUNTRY = /^[\w-.\p{éèêëäàâüùûïîöô}']+$/;
const REGEX_PHONE = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
// const REGEX_URL = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
const REGEX_URL = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi; 
// sel bcrypt
const BCRYPT_SALT = 7;


var schemaObject = { // ++++++++++++++ Modify to your own schema ++++++++++++++++++
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        maxlength: 100,
        match: REGEX_MATCH_EMAIL
    },
    password: {
        type: String,
        required: true,
        maxlength: 20
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 50,
        match: REGEX_NAME
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50,
        match: REGEX_NAME
    },
    address: {
        type: String,
        required: true,
        //default: 'Une rue par la',
        maxlength: 100,
        match: REGEX_STREET
    },
    addressAdd: {
        type: String,
        required: true,
        //default: 'Boite au lettre',
        maxlength: 50,
        match: REGEX_STREET
    },
    zipCode: {
        type: String,
        required: true,
        //default: '00001',
        maxlength: 10,
        match: REGEX_ZIPCODE
    },
    city: {
        type: String,
        required: true,
        //default: 'NULLEPART',
        maxlength: 50,
        match: REGEX_CITY
    },
    country: {
        type: String,
        required: true,
        //default: 'France',
        maxlength: 50,
        match: REGEX_COUNTRY
    },
    mobile: {
        type: String,
        required: true,
        maxlength: 15,
        match: REGEX_PHONE
    },
    picture: {
        type: String,
        required: true,
        maxlength: 100,
        match: REGEX_URL
    },

    toPop: {
        type: db._mongoose.Schema.Types.ObjectId,
        ref: 'Useraccounts'
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
    ref: 'Useraccounts'
};

schemaObject.createdBy = {
    type: db._mongoose.Schema.Types.ObjectId,
    ref: 'Useraccounts'
};

schemaObject.client = {
    type: db._mongoose.Schema.Types.ObjectId,
    ref: 'Clients'
};

schemaObject.developer = {
    type: db._mongoose.Schema.Types.ObjectId,
    ref: 'Users'
};

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
    return this.find({
        $text: {
            $search: string
        }
    }, {
        score: {
            $meta: 'textScore'
        }
    }).sort({
        score: {
            $meta: 'textScore'
        }
    });
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

// Controle du mot de passe haché
Schema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// Adding hooks
// hashage du password lors changemente de mot de passe
// https://stackoverflow.com/questions/62066921/hashed-password-update-with-mongoose-express
Schema.pre('findOneAndUpdate', async function (next) {
    try {
        if (this._update.password) {
            const hashed = await bcrypt.hash(this._update.password, 10);
            this._update.password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }
});


Schema.pre('save', async function (next) {
    // hashage du mot de passe si modifié ou nouveau
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, BCRYPT_SALT);

    console.log('pre_save', this);

    // if (this.isModified('password')) {
    //     this.password = bcrypt.hashSync(this.password, BCRYPT_SALT);
    // }


    // Indexing for search
    var ourDoc = this._doc;

    ourDoc.model = collection;

    // Dump it in the queue
    queue.create('searchIndex', ourDoc).save();

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
    debug(this instanceof db._mongoose.Query);
    // true
    // prints returned documents
    debug('find() returned ' + JSON.stringify(result));
    // prints number of milliseconds the query took
    debug('find() took ' + (
        Date.now() - this.start
    ) + ' millis');
});

Schema.pre('update', function (next) { // Indexing for search
    var ourDoc = this._update;
    ourDoc.model = collection;
    ourDoc.update = true;
    if (ourDoc.updatedAt || ourDoc.tags) {
        /* jslint ignore:line */
        // Move along! Nothing to see here!!
    } else { // Dump it in the queue
        queue.create('searchIndex', ourDoc).save();
    } ourDoc.updatedAt = new Date(Date.now()).toISOString();
    next();
});

var Model = db.model(collection, Schema);
Model._mongoose = db._mongoose;

module.exports = Model;

