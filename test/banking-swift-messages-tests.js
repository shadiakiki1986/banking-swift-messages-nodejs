var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
// var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

var fixturesParse = {
  'example-1.txt': "example-1.json",
  'example-2.txt': "example-2.json",
  'example-3.txt': "example-3.json",
  'example-4.txt': "example-4.json",
  'example-5.txt': "example-5.json",
};

var fixturesPreprocess = {
  'example-1.txt': "preprocessed-1.txt",
  'example-2.txt': "preprocessed-2.txt",
  'example-3.txt': "preprocessed-3.txt",
  'example-4.txt': "preprocessed-4.txt",
  'example-5.txt': "preprocessed-5.txt",
};

describe("preprocess", function() {
  describe( "unit test", function() {
    it('adds to 32A', function() {
      var input =    "header\n32A: l1\nl2\nl3\nl4\nl5\nl6\nl7\n55: bla\nl9";
      var expected = "header\n32A: l1\nl2\nl3\nl4\nl5\nl6\nl7\n>>>>>> 32A\n55: bla\nl9";
      var actual = bsm.preprocess(input);
      expect(actual).to.equal(expected);
    });
  });

  describe( "fixtures", function() {
    it('add tags', function() {
      for(var inputFn in fixturesPreprocess) {
        var input = bsm.readFile(path.join(__dirname,"fixtures",inputFn));
        var actual = bsm.preprocess(input);

        var expectedFn = path.join(__dirname,"fixtures",fixturesPreprocess[inputFn]);
        var expected = bsm.readFile(expectedFn);
        expect(actual).to.equal(expected,inputFn);
      }
    });
  });
});
 
describe( "Library", function() {
  describe( "Forward mustache from json", function() {
    it('Generates same txt', function() {
        // read template and unescape all variables
        // https://www.npmjs.com/package/mustache#variables
        var template = bsm.template();
        template = template.replace(/{{([^#\/].*)}}/g,'{{&$1}}');

        for(var expectedFn in fixturesParse) {
          // read json
          var inputFn = fixturesParse[expectedFn];
          inputFn = path.join(__dirname,"fixtures",inputFn);
          var input = JSON.parse(bsm.readFile(inputFn));
          var actual = mustache.render(template,input).trim();

          // drop >>>>>> and <<<<<< which I added
          actual = actual.replace(/>>>>>> \d{2}[A-Z]{0,1}\n/g,'');

          // get expected file
          var expected = bsm.readFile(path.join(__dirname,"fixtures",expectedFn)).trim();

          // save both text outputs to temporary files
          //var temp1 = '/tmp/f1.txt';
          //var temp2 = '/tmp/f2.txt';
          //fs.writeFileSync(temp1,actual);
          //fs.writeFileSync(temp2,expected);

          expect(actual).to.equal(expected, expectedFn +"; "+ inputFn); // + "; vimdiff "+temp1+" "+temp2);
        }
    });
  });

  describe( "Fixtures", function() {
    it('Successfully parsed', function() {
      for(var actualFn in fixturesParse) {
        var actual = bsm.parse(path.join(__dirname,"fixtures",actualFn));

        var expectedFn = fixturesParse[actualFn];
        var expected = path.join(__dirname,"fixtures",expectedFn);
        // fs.writeFileSync(expected,JSON.stringify(actual,null,4));
        expected = JSON.parse(bsm.readFile(expected));

        expect(actual).to.deep.equal(expected,actualFn);
      }
    });
  });

});


