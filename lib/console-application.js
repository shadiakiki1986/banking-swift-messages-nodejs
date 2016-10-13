// var util = require('util');
var stringify = require('json-stable-stringify'),
  bankingSwiftMessages = require('../lib/banking-swift-messages.js'),
  mongoHandler = require('../lib/mongo-handler.js')
;

//--------------------------
// https://github.com/janl/mustache.js/blob/master/bin/mustache#L130
function usage() {
    console.error("Error: Usage ... swift2json -f path/to/filename.txt [-m localhost]");
    console.error("                 swift2json -d path/to/folder       [-m localhost]");
    console.error("Note that either -d or -f is allowed. Also, -d requires -m");
    process.exit(3);
}


function getParam(option) {
  var mIndex = process.argv.indexOf(option);
  if(mIndex == -1) return false;
  return process.argv.splice(mIndex, 2)[1];
}

// 255 is selected for xargs in the dockerfile
// http://stackoverflow.com/a/26485626/4126114
function mongoErr(err) {
  console.error(err.stack);
  process.exit(255);
}

function handleFile(filename,mongoHost) {
  try {
    var json = bankingSwiftMessages.parse(filename);
  } catch(err) {
      console.error(err);
      // exit with 1, not 255, so that a non-MT103 file does not block
      // the xargs call in the dockerfile
      process.exit(1);
  }

  if(mongoHost) {
    mongoHandler.upsert(filename,json).then(
      function() {
        console.log("Saved to mongo the parsed json of "+filename);
      },
      mongoErr
    );
    return;
  }

  // output sorted keys
  // https://www.npmjs.com/package/json-stable-stringify
  // THIS IS NOT SORTED: console.log(util.inspect(parsed,false,null));
  console.log(stringify(json,{space:4}));
}

function checkMongo(filename,mongoHost) {
  if(mongoHost) {
    mongoHandler.setHost(mongoHost);

    mongoHandler.get(filename).then(function(doc) {
      if(doc.length==1) {
        console.error("Already found in mongo. Skipping: "+filename);
        process.exit(2);
      }
    }, mongoErr).then(function() {
      handleFile(filename,mongoHost);
    });
    return;
  }
}


module.exports.process = function(filename,mongoHost) {
  checkMongo(filename,mongoHost);
  handleFile(filename,mongoHost);
}
module.exports.usage = usage;
module.exports.getParam = getParam;
