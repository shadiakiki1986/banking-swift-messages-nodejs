var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
var path = require('path');
var execSync = require('child_process').execSync;
var mongoHandler = require('../lib/mongo-handler.js');

describe( "Mongo handler", function() {

  it('rm/get/upsert', function(done) {
    var inputFn = "example-1.txt";

    mongoHandler.rm(inputFn).then(function() {
      mongoHandler.get(inputFn).then(function(doc) {
        expect(doc.length).to.equal(0);

        var json = bsm.parse(path.join(__dirname,"fixtures",inputFn));
        mongoHandler.upsert(inputFn,json).then(function() {
          mongoHandler.get(inputFn).then(function(doc) {
            expect(doc.length).to.equal(1);

            mongoHandler.rm(inputFn).then(function() {
              mongoHandler.get(inputFn).then(function(doc) {
                expect(doc.length).to.equal(0);
                done();
              });
            });
          });
        });
      });
    });
  });
});

