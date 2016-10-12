var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;
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
        var input = bsm.readFile(path.join(__dirname,inputFn));
        var actual = bsm.preprocess(input);

        var expectedFn = path.join(__dirname,fixturesPreprocess[inputFn]);
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
          inputFn = path.join(__dirname,inputFn);
          var input = JSON.parse(bsm.readFile(inputFn));
          var actual = mustache.render(template,input).trim();

          // drop >>>>>> and <<<<<< which I added
          actual = actual.replace(/>>>>>> \d{2}[A-Z]{0,1}\n/g,'');

          // get expected file
          var expected = bsm.readFile(path.join(__dirname,expectedFn)).trim();

          // save both text outputs to temporary files
          var temp1 = '/tmp/f1.txt';
          var temp2 = '/tmp/f2.txt';
          fs.writeFileSync(temp1,actual);
          fs.writeFileSync(temp2,expected);

          expect(actual).to.equal(expected, expectedFn +"; "+ inputFn + "; vimdiff "+temp1+" "+temp2);
        }
    });
  });

  describe( "Fixtures", function() {
    it('Successfully parsed', function() {
      for(var actualFn in fixturesParse) {
        var actual = bsm.parse(path.join(__dirname,actualFn));

        var expectedFn = fixturesParse[actualFn];
        var expected = path.join(__dirname,expectedFn);
        // fs.writeFileSync(expected,JSON.stringify(actual,null,4));
        expected = JSON.parse(bsm.readFile(expected));

        expect(actual).to.deep.equal(expected,actualFn);
      }
    });
  });

});

describe( "Console app", function() {
  it('parses to valid json', function() {
    var cmd = "node "+path.join(__dirname,"..","bin","swift2json.js")+" "+path.join(__dirname,'example-1.txt');
    var actual = execSync(cmd); // /mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs/15570035-20160307_082026.txt');
    actual = JSON.parse(actual);

    var expected = path.join(__dirname,"example-1.json");
    // fs.writeFileSync(expected,JSON.stringify(actual,null,4));
    expected = JSON.parse(bsm.readFile(expected));

    expect(actual).to.deep.equal(expected);
  });
});


describe( "Proprietary files", function() {
  var folder = '/mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs';

  before(function() {
    fs.statSync(folder); // fails if inexistant
  });

  it('Parsed without errors', function() {
    // obtained with
    // cd /mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs
    // grep "FIN 103" *2016*txt
    var fixturesProprietary = [
      '15570035-20160307_082026.txt',
      '15570036-20160307_082227.txt',
      '15570037-20160307_082227.txt',
      '15570039-20160307_093828.txt',
      '15570040-20160307_093828.txt',
      '15570049-20160307_152219.txt',
      '15570055-20160307_174018.txt',
      '15570079-20160308_081824.txt',
      '15570082-20160308_093024.txt',
      '15570089-20160308_144228.txt',
      '15570097-20160308_202430.txt',
      '15570118-20160309_081634.txt',
      '15570180-20160310_172510.txt',
      '15570201-20160311_081715.txt',
      '15570258-20160314_104545.txt',
      '15570271-20160314_183948.txt',
      '15570304-20160315_151156.txt',
      '15570306-20160315_151957.txt',
      '15570336-20160316_133006.txt',
      '15570336-20160316_133006.txt',
      '15570337-20160316_134406.txt',
      '15570339-20160316_135805.txt',
      '15570340-20160316_140205.txt',
      '15570373-20160317_081813.txt',
      '15570380-20160317_111014.txt',
      '15570384-20160317_132615.txt',
      '15570394-20160317_210018.txt',
      '15570412-20160318_084422.txt',
      '15570430-20160318_155825.txt',
      '15570478-20160321_103457.txt',
      '15570485-20160321_141858.txt',
      '15570611-20160324_082325.txt',
      '15570612-20160324_082724.txt',
      '15570616-20160324_115926.txt',
      '15570627-20160324_164927.txt',
      '15570628-20160324_170733.txt',
      '15570710-20160329_175821.txt',
      '15570711-20160329_175821.txt',
      '15570734-20160330_084625.txt',
      '15570735-20160330_084625.txt',
      '15570738-20160330_093224.txt',
    ];

    var expected = path.join(__dirname,"example-1.json");
    expected = JSON.parse(bsm.readFile(expected));
    var expectedKeys = Object.keys(expected);

    fixturesProprietary.map(function(filename) {
        var actual = bsm.parse(path.join(folder,filename));
        // http://chaijs.com/api/bdd/#method_keys
        expect(actual).to.have.all.keys(expectedKeys);
    });
  });
});

