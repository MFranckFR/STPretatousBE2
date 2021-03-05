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
var Useraccount;
// Testing The Useraccount Model
describe('Useraccount Model', function () {

    var id;
    var id2;

    before(function () {  /* jslint ignore:line */
        Useraccount = require('../../models/Useraccounts');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function () {
        it('should save data', function (done) {
            var myuseraccount = Useraccount.create({ name: 'femi' });

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read data', function (done) {
            var myuseraccount = Useraccount.findOne({ name: 'femi' });

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read all data', function (done) {
            var myuseraccount = Useraccount.find();

            myuseraccount.then(function (res) {
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update data', function (done) {
            var cb = sinon.spy();
            var myuseraccount = Useraccount.updateMany({ name: 'femi' }, { name: 'Olaoluwa' });

            myuseraccount.then(function (res) {
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
            var myuseraccount = Useraccount.updateMany({ name: 'femi' }, { name: 'Olaoluwa Olanipekun' });

            myuseraccount.then(function (res) {
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
            var myuseraccount = Useraccount.search('femi');

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete data', function (done) {
            var cb2 = sinon.spy();
            var ouruseraccount = Useraccount.create([{ name: 'Olaolu' }, { name: 'fola' }, { name: 'bolu' }]);

            ouruseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                return Useraccount.deleteOne({ name: 'bolu' });
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
            var myuseraccount = Useraccount.deleteMany({ name: 'femi' });

            myuseraccount.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add createdAt', function (done) {
            var myuseraccount = Useraccount.create({ name: 'this is for the gods' });

            myuseraccount.then(function (res) {
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add updatedAt', function (done) {
            var myuseraccount = Useraccount.create({ name: 'i am a demigod!' });
            myuseraccount.then(function (res) {
                id2 = res._id;
                return Useraccount.updateMany({ _id: id }, { name: 'This is the titan' });
            })
                .then(function (res) {
                    return Useraccount.findById(id);
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
            var myuseraccount = await Useraccount.create({ name: 'femi', someOtherStringData: 'stuff' });

            return q.Promise(function (resolve, reject) {
                setTimeout(function () {
                    Useraccount.findById(myuseraccount._id)
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
            var myuseraccount = Useraccount.estimatedDocumentCount({ name: 'This is the titan' });

            myuseraccount.then(function (res) {
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id', function (done) {
            var myuseraccount = Useraccount.findById(id);

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and delete', function (done) {
            var myuseraccount = Useraccount.findByIdAndRemove(id2);

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and update', function (done) {
            var myuseraccount = Useraccount.findByIdAndUpdate(id, { name: 'fufu' });

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query', function (done) {
            var myuseraccount = Useraccount.findOne({ name: 'fufu' });

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and update', function (done) {
            var myuseraccount = Useraccount.findOneAndUpdate({ name: 'fufu' }, { name: 'funmi' });

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and delete', function (done) {
            var myuseraccount = Useraccount.findOneAndRemove({ name: 'funmi' });

            myuseraccount.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

    });
});
