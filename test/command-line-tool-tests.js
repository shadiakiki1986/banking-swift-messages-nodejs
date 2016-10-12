var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
var path = require('path');
var execSync = require('child_process').execSync;
var mongoHandler = require('../lib/mongo-handler.js');

var inputFn = 'example-1.txt';
var inputPath = path.join(__dirname,"fixtures",inputFn);
var cmd = "node "+path.join(__dirname,"..","bin","swift2json")+" -f "+inputPath;

describe( "Command line tool", function() {
  it('parses to valid json', function() {
    var actual = execSync(cmd); // /mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs/15570035-20160307_082026.txt');
    actual = JSON.parse(actual);

    var expected = path.join(__dirname,"fixtures","example-1.json");
    expected = JSON.parse(bsm.readFile(expected));

    expect(actual).to.deep.equal(expected);
  });

  it('saves to mongo', function(done) {
    function onerror(err) { done(err.stack); }

    mongoHandler.rm(inputFn).then(function() {
      mongoHandler.get(inputFn).then(function(doc) {
        expect(doc.length).to.equal(0);
        cmd2 = cmd+" -m localhost";
        execSync(cmd2);

        mongoHandler.get(inputFn).then(function(doc) {
          expect(doc.length).to.equal(1);
          doc = doc[0];

          var expected = bsm.parse(inputPath);
          expect(doc.json).to.deep.equal(expected);
          done();
        }).catch(onerror);
      }).catch(onerror);
    });
  });

  it('exits with non-zero value on inexistant mongo hostname', function() {
    cmd2 = cmd + " -m inexistant";
    var fn = function() { execSync(cmd2); }
    // http://chaijs.com/api/bdd/#method_throw
    expect(fn).to.throw('MongoError: failed to connect to server');
  });

});

