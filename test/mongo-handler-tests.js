var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
var path = require('path');
var execSync = require('child_process').execSync;
var mongoHandler = require('../lib/mongo-handler.js');



describe( "Mongo handler", function() {

  it('ls', function(done) {
    function errcb(err) { done(err); }
    var inputFn = "testls";

    mongoHandler.rm(inputFn).then(function() {
      mongoHandler.ls().then(function(docs1) {
        mongoHandler.upsert(inputFn,[]).then(function() {
          mongoHandler.ls().then(function(docs2) {
            expect(docs2.length).to.equal(docs1.length+1);
            done();
          }).catch(errcb);
        }).catch(errcb);
      }).catch(errcb);
    }).catch(errcb);
  });

  it('rm/get/upsert/ls', function(done) {
    function errcb(err) { done(err); }
    var inputFn = "example-1.txt";

    mongoHandler.rm(inputFn).then(function() {
      mongoHandler.get(inputFn).then(function(doc) {
        expect(doc.length).to.equal(0);

        var json = bsm.parse(path.join(__dirname,"fixtures",inputFn));
        mongoHandler.upsert(inputFn,json).then(function() {
          mongoHandler.get(inputFn).then(function(doc) {
            expect(doc.length).to.equal(1);
            mongoHandler.ls().then(function(docs1) {
              mongoHandler.rm(inputFn).then(function() {
                mongoHandler.get(inputFn).then(function(doc) {
                  expect(doc.length).to.equal(0);
                  mongoHandler.ls().then(function(docs2) {
                    expect(docs2.length).to.equal(docs1.length-1);
                    done();
                  }).catch(errcb);
                }).catch(errcb);
              }).catch(errcb);
            }).catch(errcb);
          }).catch(errcb);
        }).catch(errcb);
      }).catch(errcb);
    }).catch(errcb);
  });

  it('rm can handle array', function(done) {
    function errcb(err) { done(err); }
    var inputFn = ["testRm-1","testRm-2"];

    mongoHandler.rm(inputFn).then(function() {
      mongoHandler.upsert(inputFn[0],[]).then(function() {
        mongoHandler.upsert(inputFn[1],[]).then(function() {
            mongoHandler.ls().then(function(docs1) {
              expect(docs1.indexOf(inputFn[0])).to.not.equal(-1);
              expect(docs1.indexOf(inputFn[1])).to.not.equal(-1);
              mongoHandler.rm(inputFn).then(function() {
                mongoHandler.ls().then(function(docs2) {
                  expect(docs2.indexOf(inputFn[0])).to.equal(-1);
                  expect(docs2.indexOf(inputFn[1])).to.equal(-1);
                  done();
                }).catch(errcb);
              }).catch(errcb);
            }).catch(errcb);
        }).catch(errcb);
      }).catch(errcb);
    }).catch(errcb);
  });
});

describe('Exceptions', function() {
  it('fails on inexistant mongo hostname', function(done) {
    mongoHandler.hostname = 'inexistant';
    mongoHandler.get('bla').then(function() {
      done("Should have thrown an error");
    }, function() {
      done();
    });
  });
});


