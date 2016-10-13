/*jshint esversion: 6 */

// Why does JSHint throw a warning if I am using const?
// http://stackoverflow.com/a/27442276/4126114

// Based on example code from
// http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/connecting/
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert'),
  basename = require('basename');

// Connection URL
var collectionName = 'inserts';
module.exports.hostname = false;// "localhost"

function onerror(err) {
  //console.log(err.stack);
  throw new Error(err);
}

function url() {
  if(!module.exports.hostname) {
    onerror("Please set hostname before using mongo-handler.js");
  }

  return 'mongodb://'+module.exports.hostname+':27017/banking-swift-messages';
}

function upsert( filename, json ) {
  // console.log("mongo upsert "+filename+" .. start");
  return co(function*() {
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url());

    // Upserting
    // http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/crud/
    var r = yield db.collection(collectionName).findOneAndUpdate(
      { filename: basename(filename)},
      { $set: {json: json} },
      { returnOriginal: false, upsert: true }
    );
    assert.equal(1,r.ok);

    // Close the connection
    db.close();

    // console.log("mongo upsert "+filename+" .. end");
  }).catch(onerror);
}

function get( filename ) {
  // console.log("mongo get "+filename+" .. start");
  return co(function*() {
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url());

    // Get first two documents that match the query
    var doc = yield db.collection(collectionName).find({filename:basename(filename)},{_id:0}).limit(1).toArray();

    // Close the connection
    db.close();

    // console.log("mongo get "+filename+" .. end");
    return doc;
  }).catch(onerror);
}

// Either pass a single filename, which ends up as a key in the mongo db,
// or pass an array of filenames, which end up as an array of keys in the mongo db
function rm( filename ) {
  // if filename is not an array, convert to array
  // http://stackoverflow.com/a/4775737/4126114
  filename = [].concat( filename );

  // get basename of all files
  filename = filename.map(function(fn) {
    return basename(fn);
  });

  // console.log("mongo rm "+filename+" .. start");
  return co(function*() {
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url());

    // Update multiple documents
    var r = yield db.collection(collectionName).deleteMany({filename: {"$in": filename}});
    // assert.equal(1, r.deletedCount);

    // Close the connection
    db.close();

    // console.log("mongo rm "+filename+" .. end");
  }).catch(onerror);
}

function ls() {
  // console.log("mongo ls .. start");
  return co(function*() {
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url());

    // Get first two documents that match the query
    var docs = yield db.collection(collectionName).find({},{filename:1}).toArray();

    // Close the connection
    db.close();

    // console.log("mongo ls .. end");
    return docs.map(function(doc) { return doc.filename; });
  }).catch(onerror);
}

module.exports.upsert = upsert;
module.exports.get = get;
module.exports.rm = rm;
module.exports.ls = ls;
