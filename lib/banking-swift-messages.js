var reverseMustache = require('reverse-mustache');
var fs = require('fs');
var path = require('path');

function template() {
  // var templateFn = 'template-hello.mustache';
  var templateFn = path.join(__dirname,'MT103.mustache');
  return readFile(templateFn);
}

// add >>>>>> after 32A
// add <<<<<< after 33
// add >>>>>> after 53A
// add <<<<<< after 57A
function preprocess(content) {
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

function tag(content,key) {
  var exp = content.split("\n");
  var found = false;
  var re = new RegExp("^"+key+":");
  for(index in exp) {
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

function readFile(filename) {
  return fs.readFileSync(filename, 'utf8').trim();
}

// e.g. var filename = '/mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs/15570035-20160307_082026.txt'
function parse(filename) {
  var content = readFile(filename);

  // preprocess the file to make it easier for reverse-mustache
  content = preprocess(content);

  // reverse template
  var parsed = reverseMustache({
      template: template(),
        content: content
  });

  if(parsed == null) {
    throw new Error("Error: File is not MT103 txt file: "+filename); 
  }

  return parsed;
}

module.exports.parse = parse;
module.exports.template = template;
module.exports.preprocess = preprocess;
module.exports.readFile = readFile;
