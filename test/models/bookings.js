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
var Booking;
// Testing The Booking Model
describe('Booking Model', function () {

    var id;
    var id2;

    before(function () {  /* jslint ignore:line */
        Booking = require('../../models/Bookings');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function () {
        it('should save data', function (done) {
            var mybooking = Booking.create({ name: 'femi' });

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read data', function (done) {
            var mybooking = Booking.findOne({ name: 'femi' });

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read all data', function (done) {
            var mybooking = Booking.find();

            mybooking.then(function (res) {
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update data', function (done) {
            var cb = sinon.spy();
            var mybooking = Booking.updateMany({ name: 'femi' }, { name: 'Olaoluwa' });

            mybooking.then(function (res) {
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
            var mybooking = Booking.updateMany({ name: 'femi' }, { name: 'Olaoluwa Olanipekun' });

            mybooking.then(function (res) {
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
            var mybooking = Booking.search('femi');

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete data', function (done) {
            var cb2 = sinon.spy();
            var ourbooking = Booking.create([{ name: 'Olaolu' }, { name: 'fola' }, { name: 'bolu' }]);

            ourbooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                return Booking.deleteOne({ name: 'bolu' });
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
            var mybooking = Booking.deleteMany({ name: 'femi' });

            mybooking.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add createdAt', function (done) {
            var mybooking = Booking.create({ name: 'this is for the gods' });

            mybooking.then(function (res) {
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add updatedAt', function (done) {
            var mybooking = Booking.create({ name: 'i am a demigod!' });
            mybooking.then(function (res) {
                id2 = res._id;
                return Booking.updateMany({ _id: id }, { name: 'This is the titan' });
            })
                .then(function (res) {
                    return Booking.findById(id);
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
            var mybooking = await Booking.create({ name: 'femi', someOtherStringData: 'stuff' });

            return q.Promise(function (resolve, reject) {
                setTimeout(function () {
                    Booking.findById(mybooking._id)
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
            var mybooking = Booking.estimatedDocumentCount({ name: 'This is the titan' });

            mybooking.then(function (res) {
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id', function (done) {
            var mybooking = Booking.findById(id);

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and delete', function (done) {
            var mybooking = Booking.findByIdAndRemove(id2);

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and update', function (done) {
            var mybooking = Booking.findByIdAndUpdate(id, { name: 'fufu' });

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query', function (done) {
            var mybooking = Booking.findOne({ name: 'fufu' });

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and update', function (done) {
            var mybooking = Booking.findOneAndUpdate({ name: 'fufu' }, { name: 'funmi' });

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and delete', function (done) {
            var mybooking = Booking.findOneAndRemove({ name: 'funmi' });

            mybooking.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

    });
});
