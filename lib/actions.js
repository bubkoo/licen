var fs   = require('fs');
var path = require('path');
var ansi = require('ansi.js');

var cursor = ansi(process.stdout);


function generate(isHeader) {}

function display(isHeader) {}

function readfile(filepath) {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
}

exports.generate = function () {};

exports.generate = function () {};

exports.generate = function () {};

exports.introduce = function (license) {

  var filepath = '../doc/introduces/' + license + '.txt';
  var contents = readfile(filepath);

  console.log(contents);
};
