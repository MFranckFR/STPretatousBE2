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
var Product;
// Testing The Product Model
describe('Product Model', function () {

    var id;
    var id2;

    before(function () {  /* jslint ignore:line */
        Product = require('../../models/Products');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function () {
        it('should save data', function (done) {
            var myproduct = Product.create({ name: 'femi' });

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read data', function (done) {
            var myproduct = Product.findOne({ name: 'femi' });

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should read all data', function (done) {
            var myproduct = Product.find();

            myproduct.then(function (res) {
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should update data', function (done) {
            var cb = sinon.spy();
            var myproduct = Product.updateMany({ name: 'femi' }, { name: 'Olaoluwa' });

            myproduct.then(function (res) {
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
            var myproduct = Product.updateMany({ name: 'femi' }, { name: 'Olaoluwa Olanipekun' });

            myproduct.then(function (res) {
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
            var myproduct = Product.search('femi');

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should delete data', function (done) {
            var cb2 = sinon.spy();
            var ourproduct = Product.create([{ name: 'Olaolu' }, { name: 'fola' }, { name: 'bolu' }]);

            ourproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                return Product.deleteOne({ name: 'bolu' });
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
            var myproduct = Product.deleteMany({ name: 'femi' });

            myproduct.then(function (res) {
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add createdAt', function (done) {
            var myproduct = Product.create({ name: 'this is for the gods' });

            myproduct.then(function (res) {
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should add updatedAt', function (done) {
            var myproduct = Product.create({ name: 'i am a demigod!' });
            myproduct.then(function (res) {
                id2 = res._id;
                return Product.updateMany({ _id: id }, { name: 'This is the titan' });
            })
                .then(function (res) {
                    return Product.findById(id);
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
            var myproduct = await Product.create({ name: 'femi', someOtherStringData: 'stuff' });

            return q.Promise(function (resolve, reject) {
                setTimeout(function () {
                    Product.findById(myproduct._id)
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
            var myproduct = Product.estimatedDocumentCount({ name: 'This is the titan' });

            myproduct.then(function (res) {
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id', function (done) {
            var myproduct = Product.findById(id);

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and delete', function (done) {
            var myproduct = Product.findByIdAndRemove(id2);

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find a record by id and update', function (done) {
            var myproduct = Product.findByIdAndUpdate(id, { name: 'fufu' });

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query', function (done) {
            var myproduct = Product.findOne({ name: 'fufu' });

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and update', function (done) {
            var myproduct = Product.findOneAndUpdate({ name: 'fufu' }, { name: 'funmi' });

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

        it('should find the first match from a query and delete', function (done) {
            var myproduct = Product.findOneAndRemove({ name: 'funmi' });

            myproduct.then(function (res) {
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
                .catch(function (err) {
                    done(err);
                });
        });

    });
});
