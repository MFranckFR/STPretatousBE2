'use strict';

var chai = require('chai');
chai.should();
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var accounts = require('../../controllers/Accounts.js');
var workers = require('../../services/queue/workers');
var workers2 = require('../../services/queue/workers');
var workers3 = require('../../services/queue/workers');
var _ = require('lodash');
var db = require('../../models');


var accountId;
var accountId2;
var lastId;
var forDelete;
var trashId;
var from = new Date(new Date().setMinutes(new Date().getMinutes() - 3)).toISOString();
var objId1 = db.Accounts._mongoose.Types.ObjectId();
describe('Accounts controller', function () {
    it('should create documents', function (done) {
        var next = function (err) {
            done(err);
        };
        var res = {};
        res.ok = function (data) {
            data.should.be.an.object; /* jslint ignore:line */
            accountId2 = data[0]._id;
            done();
        };
        var req = {};
        req.body = [{
            name: 'Femi',
            someOtherStringData: 'this is pizza',
            developer: objId1
        },
        {
            name: 'Bolu',
            someOtherStringData: 'this is a meat',
            developer: objId1
        },
        {
            name: 'Bayo',
            someOtherStringData: 'Meta',
            developer: objId1
        }];
        accounts.create(req, res, next);
    });

    it('should create a document', function (done) {
        var next = function (err) {
            done(err);
        };
        var res = {};
        res.ok = function (data, cache, extraData) {

            data.should.be.an.object; /* jslint ignore:line */
            accountId = data._id;
            done();
        };
        var req = {};
        req.body = {
            name: 'Femi Olanipekun',
            someOtherStringData: 'FooFoo Tahh',
            toPop: accountId2,
            developer: objId1
        };
        accounts.create(req, res, next);
    });

    describe('Find', function () {
        it('should build projection', function (done) {
            var projection = 'name,someOtherStringData';
            var project = accounts.buildProjection(projection);
            project.should.eventually.be.an('object');
            project.should.eventually.have.property('name');
            project.should.eventually.have.property('someOtherStringData').notify(done);
        });
        it('should search for matching documents for a given string', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.search = 'i like pizza';
            accounts.find(req, res, next);
        });
        it('should limit the number of returned documents and check if it is the last page', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                extraData.isLastPage.should.exist; /* jslint ignore:line */
                data.length.should.equal(2);
                done();
            };
            var req = {};
            req.query = {};
            req.query.limit = 2;
            accounts.find(req, res, next);
        });
        it('should contain count of total record for the query', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                extraData.total.should.be.a.number; /* jslint ignore:line */
                extraData.totalResult.should.be.a.number; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            accounts.find(req, res, next);
        });
        it('should return the last document Id in the array of documents returned from a query', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {
                lastId = extraData.lastId;
                data.should.be.an.object; /* jslint ignore:line */
                extraData.lastId.should.be.a.string; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            accounts.find(req, res, next);
        });
        it('should sort documents in ascending order', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.sort = 'name';
            accounts.find(req, res, next);
        });
        it('should sort documents in descending order', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.sort = '-name';
            accounts.find(req, res, next);
        });
        it('should select just few parameters from the documents', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an('array'); /* jslint ignore:line */
                console.log(data);
                expect(data[0].someOtherStringData).to.be.undefined; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.select = 'name';
            accounts.find(req, res, next);
        });

        it('should populate data of a references', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {
                data[0].toPop.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = { _id: accountId };
            req.query.populate = 'toPop';
            accounts.find(req, res, next);
        });

        it('should load next page for pagination', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data) {
                var next = function (err) {
                    done(err);
                };
                var res = {};
                res.ok = function (data, cache, extraData) {
                    forDelete = _.map(data, function (value) {
                        return value._id.toString();
                    });
                    data.length.should.be.above(0); /* jslint ignore:line */
                    done();
                };
                var req = {};
                req.query = { lastId: lastId.toString() };
                accounts.find(req, res, next);
            };
            var req = {};
            req.body = [{
                name: 'Femi2',
                someOtherStringData: 'this is pizza'
            },
            {
                name: 'Bolu2',
                someOtherStringData: 'this is a meat'
            },
            {
                name: 'Bayo2',
                someOtherStringData: 'Meta'
            }];
            accounts.create(req, res, next);
        });

        it('should filter by date range', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                data.length.should.be.above(0); /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.from = from;

            req.query.to = new Date().toISOString();
            accounts.find(req, res, next);
        });

        it('should filter by date range without setting the end date', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.should.be.an.object; /* jslint ignore:line */
                data.length.should.be.above(0); /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.from = from;
            accounts.find(req, res, next);
        });
    });

    it('should find one document', function (done) {
        var next = function (err) {
            done(err);
        };
        var res = {};
        res.ok = function (data, cache, extraData) {
            data.should.be.an.object; /* jslint ignore:line */
            done();
        };
        var req = {};
        req.params = {};
        req.params.id = accountId;
        accounts.findOne(req, res, next);
    });
    it('should update documents', function (done) {
        var next = function (err) {
            done(err);
        };
        var res = {};
        res.ok = function (data, cache, extraData) {
            data.nModified.should.be.above(0); /* jslint ignore:line */
            done();
        };
        var req = {};
        req.query = { name: 'Femi' };
        req.body = { name: 'Femi Updated' };
        accounts.update(req, res, next);
    });
    it('should update a document', function (done) {
        var next = function (err) {
            done(err);
        };
        var res = {};
        res.ok = function (data, cache, extraData) {

            data.should.be.an('object'); /* jslint ignore:line */
            done();
        };
        var req = {};
        req.params = {};
        req.params.id = accountId;
        req.body = { name: 'Mr Fufuf' };
        accounts.updateOne(req, res, next);
    });
    describe('Delete', function () {
        it('should delete multiple data', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {

                data.length.should.be.above(0); /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = { _id: { $gt: lastId } };
            accounts.delete(req, res, next);
        });
        it('should have backed up multiple deleted data', function (done) {
            setTimeout(function () {
                db.Trash.find()
                    .where('data._id')
                    .in(forDelete)
                    .then(function (res) {
                        res.length.should.be.above(0);
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            }, 1000);
        });
        it('should delete one data', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {
                data.should.be.an('object'); /* jslint ignore:line */
                done();
            };
            var req = {};
            req.params = { id: lastId };
            accounts.deleteOne(req, res, next);
        });
        it('should have backed up one data', function (done) {
            setTimeout(function () {
                db.Trash.find({ 'data._id': lastId.toString() })
                    .then(function (resp) {
                        trashId = resp[0]._id;
                        resp.length.should.be.above(0);
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            }, 1000);
        });
    });
    describe('Restore', function () {
        it('should restore a previously deleted data', function (done) {
            var next = function (err) {
                done(err);
            };
            var res = {};
            res.ok = function (data, cache, extraData) {
                data.should.be.an('object'); /* jslint ignore:line */
                done();
            };
            var req = {};
            req.params = { id: trashId };
            accounts.restore(req, res, next);
        });
    });
});
