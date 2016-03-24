var configFile = '../.config.json';

var cp   = require('child_process');
var fs   = require('fs');
var path = require('path');
var raw  = require(configFile);


var config = {
  license : raw.license || 'mit',
  filename: raw.filename || 'LICENSE',
  fullname: raw.fullname,
  email   : raw.email,
  year    : raw.year || new Date().getFullYear()
};


if (!config.fullname) {
  parsePackage();
}
if (!config.fullname || !config.email) {
  parseGit();
}
if (!config.fullname) {
  config.fullname = process.env.USER;
}


// exports
// -------

exports.raw = function () {
  return raw;
};

exports.get = function (key) {
  return key ? config[key] : config;
};

exports.set = function (key, value) {
  updateConfig(config, key, value);
};

exports.save = function (key, value) {

  updateConfig(raw, key, value);

  var filePath = path.resolve(__dirname, configFile);
  var content  = JSON.stringify(raw, null, '\t');

  fs.writeFile(filePath, content, { encoding: 'utf8' });
};


// helpers
// -------

var keys = Object.keys(config);

function isValidKey(key) {
  return keys.indexOf(key) >= 0;
}

function updateConfig(entry, key, value) {
  if (typeof key === 'object') {
    Object.keys(key).forEach(function (name) {
      if (isValidKey(name)) {
        entry[name] = key[name] || '';
      }
    });
  } else {
    if (isValidKey(key)) {
      entry[key] = value || '';
    }
  }
}

function parsePackage() {
  // try to parse username from package.json
  try {
    var filepath = path.join(process.cwd(), 'package.json');
    var package  = require(filepath);

    if (package) {
      var author = package.author;

      if (Array.isArray(author)) {
        author = author[0];
      }

      if (typeof author === 'string') {
        config.fullname = author;
      } else if (typeof author === 'object') {
        config.fullname = author.name;

        if (!config.email) {
          config.email = author.email;
        }
      }
    }
  } catch (e) { }
}

function parseGit() {
  // try to parse username from git config
  try {

    var result;

    if (!config.fullname) {
      result = cp.execSync('git config --get user.name', { encoding: 'utf8' });
      result = result.replace('\n', '');

      config.fullname = result;
    }

    if (!config.email) {
      result = cp.execSync('git config --get user.email', { encoding: 'utf8' });
      result = result.replace('\n', '');

      config.email = result;
    }
  } catch (e) {}
}
