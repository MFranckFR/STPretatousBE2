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
var Loan;
// Testing The Loan Model
describe('Loan Model', function () {

    var id;
    var id2;

    before(function () {  /* jslint ignore:line */
        Loan = require('../../models/Loans');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function () {
        it('should save data', function (done) {
            var myloan = Loan.create({ name: 'femi' });

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read data', function (done) {
            var myloan = Loan.findOne({ name: 'femi' });

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read all data', function (done) {
            var myloan = Loan.find();

            myloan.then(function (res) {
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update data', function (done) {
            var cb = sinon.spy();
            var myloan = Loan.updateMany({ name: 'femi' }, { name: 'Olaoluwa' });

            myloan.then(function (res) {
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
            var myloan = Loan.updateMany({ name: 'femi' }, { name: 'Olaoluwa Olanipekun' });

            myloan.then(function (res) {
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
            var myloan = Loan.search('femi');

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete data', function (done) {
            var cb2 = sinon.spy();
            var ourloan = Loan.create([{ name: 'Olaolu' }, { name: 'fola' }, { name: 'bolu' }]);

            ourloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                return Loan.deleteOne({ name: 'bolu' });
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
            var myloan = Loan.deleteMany({ name: 'femi' });

            myloan.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add createdAt', function (done) {
            var myloan = Loan.create({ name: 'this is for the gods' });

            myloan.then(function (res) {
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add updatedAt', function (done) {
            var myloan = Loan.create({ name: 'i am a demigod!' });
            myloan.then(function (res) {
                id2 = res._id;
                return Loan.updateMany({ _id: id }, { name: 'This is the titan' });
            })
                .then(function (res) {
                    return Loan.findById(id);
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
            var myloan = await Loan.create({ name: 'femi', someOtherStringData: 'stuff' });

            return q.Promise(function (resolve, reject) {
                setTimeout(function () {
                    Loan.findById(myloan._id)
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
            var myloan = Loan.estimatedDocumentCount({ name: 'This is the titan' });

            myloan.then(function (res) {
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id', function (done) {
            var myloan = Loan.findById(id);

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and delete', function (done) {
            var myloan = Loan.findByIdAndRemove(id2);

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and update', function (done) {
            var myloan = Loan.findByIdAndUpdate(id, { name: 'fufu' });

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query', function (done) {
            var myloan = Loan.findOne({ name: 'fufu' });

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and update', function (done) {
            var myloan = Loan.findOneAndUpdate({ name: 'fufu' }, { name: 'funmi' });

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and delete', function (done) {
            var myloan = Loan.findOneAndRemove({ name: 'funmi' });

            myloan.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

    });
});
