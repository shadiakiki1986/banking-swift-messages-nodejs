var expect = require('chai').expect;
var bsm = require('../lib/banking-swift-messages.js');
var fs = require('fs');
var path = require('path');

describe( "Proprietary files", function() {
  var folder = '/mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs';
  // http://stackoverflow.com/a/32820119/4126114
  before(function() {
    try {
      // http://stackoverflow.com/a/4482701/4126114
      fs.accessSync(folder,fs.F_OK); // fails if inexistant
    } catch(err) {
      console.error("Error: "+err);
      this.skip(); // inexistant folder?
    }
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

    var expected = path.join(__dirname,"fixtures","example-1.json");
    expected = JSON.parse(bsm.readFile(expected));
    var expectedKeys = Object.keys(expected[0]);

    fixturesProprietary.map(function(filename) {
        var actual = bsm.parse(path.join(folder,filename));
        actual.map(function(single) {
          // http://chaijs.com/api/bdd/#method_keys
          expect(single).to.have.all.keys(expectedKeys);
        });
    });
  });
});

