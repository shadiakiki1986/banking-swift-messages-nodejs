var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
var path = require('path');
var execSync = require('child_process').execSync;
var mongoHandler = require('../lib/mongo-handler.js');

var inputFn = 'example-1.txt';
var inputPath = path.join(__dirname,"fixtures",inputFn);
var cmd = "node "+path.join(__dirname,"..","bin","swift2json");

describe( "CLI: -f option", function() {
  it('swift2json -f .. : generates JSON', function() {
    var actual = execSync(cmd+" -f "+inputPath); // /mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs/15570035-20160307_082026.txt');
    actual = JSON.parse(actual);

    var expected = path.join(__dirname,"fixtures","example-1.json");
    expected = JSON.parse(bsm.readFile(expected));

    expect(actual).to.deep.equal(expected);
  });
});

describe("CLI: -m option", function() {
  it('swift2json -f .. -m localhost : saves to mongo', function(done) {
    function onerror(err) { done(err); }

    mongoHandler.hostname = "localhost";
    mongoHandler.rm(inputFn).then(function() {
      mongoHandler.get(inputFn).then(function(doc) {
        expect(doc.length).to.equal(0);
        var cmd2 = cmd+" -f "+inputPath+" -m localhost";
        execSync(cmd2);

        mongoHandler.get(inputFn).then(function(doc) {
          expect(doc.length).to.equal(1);
          doc = doc[0];

          var expected = bsm.parse(inputPath);
          expect(doc.json).to.deep.equal(expected[0]);
          done();
        }).catch(onerror);
      }).catch(onerror);
    }).catch(onerror);
  });

  it('multi-transfer in file', function(done) {
    function onerror(err) { done(err); }

    var multiFn = "example-6";
    var multiPath = path.join(__dirname,"fixtures",multiFn+".txt");

    mongoHandler.hostname = "localhost";
    mongoHandler.rm(multiFn+"/0").then(function() {
    mongoHandler.rm(multiFn+"/1").then(function() {

      mongoHandler.get(multiFn+"/0").then(function(doc) {
        expect(doc.length).to.equal(0);
        var cmd2 = cmd+" -f "+multiPath+" -m localhost";
        execSync(cmd2);

        mongoHandler.get(multiFn+"/0").then(function(doc) {
          expect(doc.length).to.equal(1);
          doc = doc[0];

          var expected = bsm.parse(multiPath);
          expect(doc.json).to.deep.equal(expected[0]);
          done();
        }).catch(onerror);
      }).catch(onerror);

    }).catch(onerror);
    }).catch(onerror);
  });

});

// http://chaijs.com/api/bdd/#method_throw
describe("CLI exceptions", function() {
  it('swift2json -f .. -m inexistant : exits with non-zero value on inexistant mongo hostname', function() {
    var cmd2 = cmd+" -f "+inputPath + " -m inexistant";
    var fn = function() { execSync(cmd2); };
    expect(fn).to.throw('MongoError: failed to connect to server');
  });

  it('swift2json -f .. -d .. : throws error because illegal to have both -f and -d', function() {
    var cmd2 = cmd+" -f bla -d bli";
    var fn = function() { execSync(cmd2); };
    expect(fn).to.throw('Error: Usage');
  });

  it('swift2json -d .. : throws error because requires -m', function() {
    var cmd2 = cmd+" -d bli";
    var fn = function() { execSync(cmd2); };
    expect(fn).to.throw('Error: Usage');
  });

});


describe("-d option", function() {
  it('swift2json -d test/fixtures -m localhost: parses txt files and saves to mongo', function(done) {
    function onerror(err) { done(err); }

    mongoHandler.hostname = "localhost";
    mongoHandler.rm(['example-1.txt','example-2.txt']).then(function(doc) {
      mongoHandler.ls().then(function(docs) {
        expect(docs.indexOf('example-1')).to.equal(-1);
        expect(docs.indexOf('example-2')).to.equal(-1);
 
        var cmd2 = cmd + " -d  "+ path.join(__dirname,"fixtures") + " -m localhost 2>&1";
        var out = execSync(cmd2);

        // check all in mongo
        mongoHandler.ls().then(function(docs) {
          expect(docs.indexOf('example-1')).to.not.equal(-1);
          expect(docs.indexOf('example-2')).to.not.equal(-1);
          done();
        }).catch(onerror);
      }).catch(onerror);
    }).catch(onerror);

  });

});

