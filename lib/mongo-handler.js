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
var hostname = "localhost";

function onerror(err) {
  //console.log(err.stack);
  throw new Error(err);
}

function setHost(newhost) {
  hostname = newhost;
}

function url() {
  return 'mongodb://'+hostname+':27017/banking-swift-messages';
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

function rm( filename ) {
  // console.log("mongo rm "+filename+" .. start");
  return co(function*() {
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url());

    // Update multiple documents
    var r = yield db.collection(collectionName).deleteMany({filename: basename(filename)});
    // assert.equal(1, r.deletedCount);

    // Close the connection
    db.close();

    // console.log("mongo rm "+filename+" .. end");
  }).catch(onerror);
}

module.exports.upsert = upsert;
module.exports.get = get;
module.exports.rm = rm;
module.exports.setHost = setHost;
