var reverseMustache = require('reverse-mustache');
var fs = require('fs');
var path = require('path');

function readFile(filename) {
  return fs.readFileSync(filename, 'utf8').trim();
}

function template() {
  // var templateFn = 'template-hello.mustache';
  var templateFn = path.join(__dirname,'MT103.mustache');
  return readFile(templateFn);
}

function tag(content,key) {
  var exp = content.split("\n");
  var found = false;
  var re = new RegExp("^"+key+":");
  for(var index in exp) {
    var line = exp[index];
    if(!found && re.test(line)) {
      found = true;
      continue;
    }
    if(found && (line.match(/^\d{2}[A-Z]{0,1}:/) || line.match(/Message Trailer/))) {
      exp.splice(index,0,">>>>>> "+key);
      break;
    }
  }
  return exp.join("\n");
}

function preprocessTag(content) {
    content = tag(content,"32A");
    content = tag(content,"50K");

    content = tag(content,"33B");
    content = tag(content,"50F");
    content = tag(content,"52A");
    content = tag(content,"52D");
    content = tag(content,"53A");
    content = tag(content,"54A");
    content = tag(content,"57A");
    content = tag(content,"57D");
    content = tag(content,"59" );
    content = tag(content,"59A");
    content = tag(content,"59F");
    return content;
}

// add >>>>>> after 32A
// add <<<<<< after 33
// add >>>>>> after 53A
// add <<<<<< after 57A
function preprocess(content) {
  // split multi-swift into array
  var multi = content.split(/(\d{2}\/\d{2}\/\d{2}.\d{2}:\d{2}:\d{2}\n)/).filter(function(lines) { return !!lines; });
  var content2 = [];
  var temp = "";
  for(var index in multi) {
    temp+=multi[index];
    if((index % 2)!==0) {
      content2.push(temp.trim());
      temp = "";
    }
  }

  content2 = content2.map(function(content) {
    return preprocessTag(content);
  });

  return content2;
}

// e.g. var filename = '/mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs/15570035-20160307_082026.txt'
function parse(filename) {
  var content = readFile(filename);

  // preprocess the file to make it easier for reverse-mustache
  content = preprocess(content);

  // reverse template
  var parsed = content.map(function(single) {
    return reverseMustache({
      template: template(),
        content: single
    });
  }).filter(function(single) {
    return single !== null;
  });

  if(parsed.length === 0) {
    throw new Error("File has no MT103 txt file: "+filename);
  }

  return parsed;
}

module.exports.parse = parse;
module.exports.template = template;
module.exports.preprocess = preprocess;
module.exports.preprocessTag = preprocessTag;
module.exports.readFile = readFile;
