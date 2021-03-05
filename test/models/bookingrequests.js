'use strict';

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
var mongooseMock = require('mongoose-mock');
// var expect = chai.expect;
var sinon = require('sinon');
var q = require('q');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var Bookingrequest;
// Testing The Bookingrequest Model
describe('Bookingrequest Model', function () {

    var id;
    var id2;

    before(function () {  /* jslint ignore:line */
        Bookingrequest = require('../../models/Bookingrequests');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function () {
        it('should save data', function (done) {
            var mybookingrequest = Bookingrequest.create({ name: 'femi' });

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read data', function (done) {
            var mybookingrequest = Bookingrequest.findOne({ name: 'femi' });

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read all data', function (done) {
            var mybookingrequest = Bookingrequest.find();

            mybookingrequest.then(function (res) {
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update data', function (done) {
            var cb = sinon.spy();
            var mybookingrequest = Bookingrequest.updateMany({ name: 'femi' }, { name: 'Olaoluwa' });

            mybookingrequest.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update many data', function (done) {
            var cb = sinon.spy();
            var mybookingrequest = Bookingrequest.updateMany({ name: 'femi' }, { name: 'Olaoluwa Olanipekun' });

            mybookingrequest.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should search data', function (done) {
            // Search needs more work for more accuracy
            var mybookingrequest = Bookingrequest.search('femi');

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete data', function (done) {
            var cb2 = sinon.spy();
            var ourbookingrequest = Bookingrequest.create([{ name: 'Olaolu' }, { name: 'fola' }, { name: 'bolu' }]);

            ourbookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                return Bookingrequest.deleteOne({ name: 'bolu' });
            }).then(function (res) {
                cb2();
                cb2.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete many data', function (done) {
            var cb = sinon.spy();
            var mybookingrequest = Bookingrequest.deleteMany({ name: 'femi' });

            mybookingrequest.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add createdAt', function (done) {
            var mybookingrequest = Bookingrequest.create({ name: 'this is for the gods' });

            mybookingrequest.then(function (res) {
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add updatedAt', function (done) {
            var mybookingrequest = Bookingrequest.create({ name: 'i am a demigod!' });
            mybookingrequest.then(function (res) {
                id2 = res._id;
                return Bookingrequest.updateMany({ _id: id }, { name: 'This is the titan' });
            })
                .then(function (res) {
                    return Bookingrequest.findById(id);
                })
                .then(function (res) {
                    res.should.have.property('updatedAt');
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should tag database entries properly', async function () {
            var mybookingrequest = await Bookingrequest.create({ name: 'femi', someOtherStringData: 'stuff' });

            return q.Promise(function (resolve, reject) {
                setTimeout(function () {
                    Bookingrequest.findById(mybookingrequest._id)
                        .then(function (res) {
                            console.log(res);
                            res.tags.length.should.equal(2);/* jslint ignore:line */
                            resolve(res);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                }, 3000);
            });

        });

        it('should count returned records', function (done) {
            var mybookingrequest = Bookingrequest.estimatedDocumentCount({ name: 'This is the titan' });

            mybookingrequest.then(function (res) {
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id', function (done) {
            var mybookingrequest = Bookingrequest.findById(id);

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and delete', function (done) {
            var mybookingrequest = Bookingrequest.findByIdAndRemove(id2);

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and update', function (done) {
            var mybookingrequest = Bookingrequest.findByIdAndUpdate(id, { name: 'fufu' });

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query', function (done) {
            var mybookingrequest = Bookingrequest.findOne({ name: 'fufu' });

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and update', function (done) {
            var mybookingrequest = Bookingrequest.findOneAndUpdate({ name: 'fufu' }, { name: 'funmi' });

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and delete', function (done) {
            var mybookingrequest = Bookingrequest.findOneAndRemove({ name: 'funmi' });

            mybookingrequest.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

    });
});
