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
var Message;
// Testing The Message Model
describe('Message Model', function () {

    var id;
    var id2;

    before(function () {  /* jslint ignore:line */
        Message = require('../../models/Messages');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function () {
        it('should save data', function (done) {
            var mymessage = Message.create({ name: 'femi' });

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read data', function (done) {
            var mymessage = Message.findOne({ name: 'femi' });

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read all data', function (done) {
            var mymessage = Message.find();

            mymessage.then(function (res) {
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update data', function (done) {
            var cb = sinon.spy();
            var mymessage = Message.updateMany({ name: 'femi' }, { name: 'Olaoluwa' });

            mymessage.then(function (res) {
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
            var mymessage = Message.updateMany({ name: 'femi' }, { name: 'Olaoluwa Olanipekun' });

            mymessage.then(function (res) {
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
            var mymessage = Message.search('femi');

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete data', function (done) {
            var cb2 = sinon.spy();
            var ourmessage = Message.create([{ name: 'Olaolu' }, { name: 'fola' }, { name: 'bolu' }]);

            ourmessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                return Message.deleteOne({ name: 'bolu' });
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
            var mymessage = Message.deleteMany({ name: 'femi' });

            mymessage.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add createdAt', function (done) {
            var mymessage = Message.create({ name: 'this is for the gods' });

            mymessage.then(function (res) {
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add updatedAt', function (done) {
            var mymessage = Message.create({ name: 'i am a demigod!' });
            mymessage.then(function (res) {
                id2 = res._id;
                return Message.updateMany({ _id: id }, { name: 'This is the titan' });
            })
                .then(function (res) {
                    return Message.findById(id);
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
            var mymessage = await Message.create({ name: 'femi', someOtherStringData: 'stuff' });

            return q.Promise(function (resolve, reject) {
                setTimeout(function () {
                    Message.findById(mymessage._id)
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
            var mymessage = Message.estimatedDocumentCount({ name: 'This is the titan' });

            mymessage.then(function (res) {
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id', function (done) {
            var mymessage = Message.findById(id);

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and delete', function (done) {
            var mymessage = Message.findByIdAndRemove(id2);

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and update', function (done) {
            var mymessage = Message.findByIdAndUpdate(id, { name: 'fufu' });

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query', function (done) {
            var mymessage = Message.findOne({ name: 'fufu' });

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and update', function (done) {
            var mymessage = Message.findOneAndUpdate({ name: 'fufu' }, { name: 'funmi' });

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and delete', function (done) {
            var mymessage = Message.findOneAndRemove({ name: 'funmi' });

            mymessage.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

    });
});
