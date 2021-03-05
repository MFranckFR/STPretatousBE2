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
var Account;
// Testing The Account Model
describe('Account Model',function(){

    var id;
    var id2;

    before(function(){  /* jslint ignore:line */
        Account = require('../../models/Accounts');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function(){
        it('should save data', function(done){
            var myaccount = Account.create({name: 'femi'});

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read data', function(done){
            var myaccount = Account.findOne({name: 'femi'});

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read all data', function(done){
            var myaccount = Account.find();

            myaccount.then(function(res){
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should update data', function(done){
            var cb = sinon.spy();
            var myaccount = Account.updateMany({name: 'femi'},{name: 'Olaoluwa'});

            myaccount.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should update many data', function(done){
            var cb = sinon.spy();
            var myaccount = Account.updateMany({name: 'femi'},{name: 'Olaoluwa Olanipekun'});

            myaccount.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should search data', function(done){
            // Search needs more work for more accuracy
            var myaccount = Account.search('femi');

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete data', function(done){
            var cb2 = sinon.spy();
            var ouraccount = Account.create([{name:'Olaolu'},{name: 'fola'},{name: 'bolu'}]);

            ouraccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                return Account.deleteOne({name: 'bolu'});
            }).then(function(res){
                cb2();
                cb2.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete many data', function(done){
            var cb = sinon.spy();
            var myaccount = Account.deleteMany({name: 'femi'});

            myaccount.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should add createdAt', function(done){
            var myaccount = Account.create({name: 'this is for the gods'});

            myaccount.then(function(res){
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should add updatedAt', function(done){
            var myaccount = Account.create({name: 'i am a demigod!'});
            myaccount.then(function(res){
                id2 = res._id;
                return Account.updateMany({_id: id},{name: 'This is the titan'});
            })
            .then(function(res){
                return Account.findById(id);
            })
            .then(function(res){
                res.should.have.property('updatedAt');
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should tag database entries properly', async function(){
            var myaccount = await Account.create({name: 'femi',someOtherStringData: 'stuff'});
            
            return q.Promise(function(resolve, reject) {
            setTimeout(function(){
                Account.findById(myaccount._id)
                .then(function(res){
                    console.log(res);
                    res.tags.length.should.equal(2);/* jslint ignore:line */
                    resolve(res);
                })
                .catch(function(err){
                    reject(err);
                });
            },3000);
            });
            
        });

        it('should count returned records', function(done){
            var myaccount = Account.estimatedDocumentCount({name: 'This is the titan'});

            myaccount.then(function(res){
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find a record by id', function(done){
            var myaccount = Account.findById(id);

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find a record by id and delete', function(done){
            var myaccount = Account.findByIdAndRemove(id2);

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find a record by id and update', function(done){
            var myaccount = Account.findByIdAndUpdate(id,{name: 'fufu'});

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find the first match from a query', function(done){
            var myaccount = Account.findOne({name: 'fufu'});

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find the first match from a query and update', function(done){
            var myaccount = Account.findOneAndUpdate({name: 'fufu'},{name: 'funmi'});

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find the first match from a query and delete', function(done){
            var myaccount = Account.findOneAndRemove({name: 'funmi'});

            myaccount.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

    });
});
