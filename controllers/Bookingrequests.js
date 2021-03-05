'use strict';

var Bookingrequests = require('../models').Bookingrequests;
var Trash = require('../models').Trash;
var q = require('q');
var queue = require('../services/queue');
var debug = require('debug')('bookingrequestsController');

var service = 'Bookingrequests';

var BookingrequestsController = {};

BookingrequestsController.buildProjection = function (projections) {
    debug('starting build...');
    var projection = projections.split(','); // Projection should be comma separated. eg. name,location
    return q.Promise(function (resolve, reject, notify) {
        debug('This is a promise...');
        var num = projection.length;
        var last = num - 1;
        var select = {};
        for (var n in projection) {
            if (typeof projection[n] === 'string') {
                debug('Processing...', projection[n]);
                notify('Adding ' + projection[n] + ' to projection');
                select[projection[n]] = 1;
                if (n * 1 === last) {
                    debug('Coming out of the loop...', select);
                    notify('Ending Build.');
                    return resolve(select);
                }
            } else {
                debug('Skiping...', projection[n]);
                if (n * 1 === last) {
                    debug('Coming out of the loop......', select);
                    notify('Ending Build..');
                    return resolve(select);
                }
            }
        }
    });
};

BookingrequestsController.find = function (req, res, next) {
    var query;
    if (req.query.search) {
        query = req.query.search;
        // Clean appId and userId
        if (query && query.appId) {
            delete query.appId;
        }
        if (query && query.accountId) {
            delete query.accountId;
        }

        Bookingrequests.search(query)
            .then(function (resp) {
                res.ok(resp);
            })
            .catch(function (err) {
                next(err);
            });
    } else {
        query = req.query;
        // Clean appId and userId
        if (query && query.appId) {
            delete query.appId;
        }
        if (query && query.accountId) {
            delete query.accountId;
        }
        var projection = query.select; // Projection should be comma separated. eg. name,location
        var ourProjection;

        if (projection) {
            ourProjection = BookingrequestsController.buildProjection(projection);
            delete query.select;
        }
        var limit = query.limit * 1;
        if (limit) {
            delete query.limit;
        }

        var from = query.from;
        var to = query.to;
        if (from) {
            query.createdAt = {};
            query.createdAt.$gt = from;
            delete query.from;
            if (to) {
                delete query.to;
            } else {
                to = new Date().toISOString();
            }
            query.createdAt.$lt = to;
        } else {
            query.createdAt = {};
            query.createdAt.$gt = new Date('1989-03-15T00:00:00').toISOString();
            if (to) {
                delete query.to;
            } else {
                to = new Date().toISOString();
            }
            query.createdAt.$lt = to;
        }
        var lastId = query.lastId;
        if (lastId) {
            if (query.desc) {
                query._id = {};
                query._id.$lt = lastId;
                delete query.desc;
            } else {
                query._id = {};
                query._id.$gt = lastId;
            }
            delete query.lastId;
        }
        if (query.desc) {
            delete query.desc;
        }
        var sort = query.sort; // -fieldName: means descending while fieldName without the minus mean ascending bith by fieldName. eg, '-fieldName1 fieldName2'
        if (sort) {
            delete query.sort;
        }
        var populate = query.populate; // Samples: 'name location' will populate name and location references. only supports this for now | 'name', 'firstname' will populate name reference and only pick the firstname attribute
        if (populate) {
            delete query.populate;
        }
        var totalResult = Bookingrequests.estimatedDocumentCount(query);
        var total = Bookingrequests.estimatedDocumentCount({});
        var question = Bookingrequests.find(query);

        if (limit) {
            totalResult = totalResult.limit(limit);
            question = question.limit(limit);
        } else {
            limit = 50;
            totalResult = totalResult.limit(limit);
            question = question.limit(limit);
        }
        if (sort) {
            question = question.sort(sort);
        }
        if (populate) {
            question = question.populate(populate);
        }

        if (projection) {
            q.all([ourProjection, total, totalResult])
                .spread(function (resp, total, totalResult) {
                    return [question.select(resp), total, totalResult];
                })
                .spread(function (resp, total, totalResult) {
                    var ourLastId;
                    if (resp.length === 0) {
                        ourLastId = null;
                    } else {
                        ourLastId = resp[resp.length - 1]._id;
                    }
                    var extraData = {};
                    extraData.limit = limit * 1;
                    extraData.total = total;
                    extraData.totalResult = totalResult;
                    extraData.lastId = ourLastId;
                    extraData.isLastPage = (totalResult < limit) ? true : false;
                    res.ok(resp, false, extraData);
                })
                .catch(function (err) {
                    next(err);
                });
        } else {
            q.all([question, total, totalResult])
                .spread(function (resp, total, totalResult) {
                    var ourLastId;
                    if (resp.length === 0) {
                        ourLastId = null;
                    } else {
                        ourLastId = resp[resp.length - 1]._id;
                    }
                    var extraData = {};
                    extraData.limit = limit * 1;
                    extraData.total = total;
                    extraData.lastId = ourLastId;
                    extraData.totalResult = totalResult;
                    extraData.isLastPage = (totalResult < limit) ? true : false;
                    res.ok(resp, false, extraData);
                })
                .catch(function (err) {
                    next(err);
                });
        }

    }
};

BookingrequestsController.findOne = function (req, res, next) {
    var id = req.params.id;
    var query = req.query;
    var populate;
    if (query) {
        populate = query.populate; // Samples: 'name location' will populate name and location references. only supports this for now | 'name', 'firstname' will populate name reference and only pick the firstname attribute
    }
    var question = Bookingrequests.findById(id);
    if (populate) {
        delete query.populate;
        question = question.populate(populate);
    }

    question
        .then(function (resp) {
            if (!resp) {
                next();
            } else {
                res.ok(resp);
            }
        })
        .catch(function (err) {
            next(err);
        });
};

BookingrequestsController.create = function (req, res, next) {
    var data = req.body;
    if (data && data.secure) {
        delete data.secure;
    }
    Bookingrequests.create(data)
        .then(function (resp) {
            res.ok(resp);
        })
        .catch(function (err) {
            next(err);
        });
};

BookingrequestsController.update = function (req, res, next) {
    var query = req.query;
    // Clean appId and userId
    if (query && query.appId) {
        delete query.appId;
    }
    if (query && query.accountId) {
        delete query.accountId;
    }
    var data = req.body;
    if (data && data.secure) {
        delete data.secure;
    }
    Bookingrequests.updateMany(query, data)
        .then(function (resp) {
            res.ok(resp);
        })
        .catch(function (err) {
            next(err);
        });
};

BookingrequestsController.updateOne = function (req, res, next) {
    var id = req.params.id;
    var data = req.body;
    if (data && data.secure) {
        delete data.secure;
    }

    Bookingrequests.findByIdAndUpdate(id, data)
        .then(function (resp) {
            if (!resp) {
                next();
            } else {
                res.ok(resp);
            }
        })
        .catch(function (err) {
            next(err);
        });
};

BookingrequestsController.delete = function (req, res, next) {
    var query = req.query;
    // Clean appId and userId
    if (query && query.appId) {
        delete query.appId;
    }
    if (query && query.accountId) {
        delete query.accountId;
    }
    // Find match
    Bookingrequests.find(query)
        .then(function (resp) {
            var num = resp.length;
            var last = num - 1;
            for (var n in resp) {
                if (typeof resp === 'object') {
                    // Backup data in Trash
                    var backupData = {};
                    backupData.service = service;
                    backupData.data = resp[n];
                    backupData.owner = req.accountId;
                    backupData.deletedBy = req.accountId;
                    backupData.client = req.appId;
                    backupData.developer = req.developer;

                    queue.create('saveToTrash', backupData)
                        .save();
                    if (n * 1 === last) {
                        return resp;
                    }
                } else {
                    if (n * 1 === last) {
                        return resp;
                    }
                }
            }
        })
        .then(function (resp) {
            // Delete matches
            return [Bookingrequests.deleteMany(query), resp];
        })
        .spread(function (deleted, resp) {
            res.ok(resp);
        })
        .catch(function (err) {
            next(err);
        });
};

BookingrequestsController.deleteOne = function (req, res, next) {
    var id = req.params.id;
    // Find match
    Bookingrequests.findById(id)
        .then(function (resp) {
            // Backup data in Trash
            var backupData = {};
            backupData.service = service;
            backupData.data = resp;
            backupData.owner = req.accountId;
            backupData.deletedBy = req.accountId;
            backupData.client = req.appId;
            backupData.developer = req.developer;

            queue.create('saveToTrash', backupData)
                .save();
            return [resp];
        })
        .then(function (resp) {
            // Delete match
            return [Bookingrequests.findByIdAndRemove(id), resp];
        })
        .spread(function (deleted, resp) {
            if (!resp) {
                next();
            } else {
                res.ok(resp[0]);
            }
        })
        .catch(function (err) {
            next(err);
        });
};

BookingrequestsController.restore = function (req, res, next) {
    var id = req.params.id;
    // Find data by ID from trash 
    Trash.findById(id)
        .then(function (resp) {
            // Restore to DB
            return Bookingrequests.create(resp.data);
        })
        .then(function (resp) {
            // Delete from trash
            return [Trash.findByIdAndRemove(id), resp];
        })
        .spread(function (trash, resp) {
            res.ok(resp);
        })
        .catch(function (err) {
            next(err);
        });
};

module.exports = BookingrequestsController;
