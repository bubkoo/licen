var fs       = require('fs');
var path     = require('path');
var mkdirp   = require('mkdirp');
var cursor   = require('ansi.js')(process.stdout);
var pkg      = require('../package.json');
var config   = require('./config');
var licenses = require('./licenses');


// exports
// -------

exports.version = function () {
  console.log('  v' + pkg.version);
};

exports.help = function (command) {

  if (!command || command === true) {
    command = 'help';
  }

  try {
    var filepath = path.join('../doc/console', command + '.txt');
    var content  = readFileSync(filepath);

    console.log(content);
  } catch (e) {
    console.log('"' + command + '" help can\'t be found.\n');
  }
};

exports.config = function (args) {

  if (args && args.length) {

    if (args.length < 2) {
      // just for speed up
      var pairs = args[0].split('=');
      exports.updateConfig(pairs[0], pairs[1]);

    } else {

      var obj = {};

      args.forEach(function (arg) {
        var pairs = arg.split('=');

        obj[pairs[0]] = pairs[1];
      });

      exports.updateConfig(obj);
    }
  } else {
    exports.showConfig();
  }
};

exports.showConfig = function () {

  var raw  = config.raw();
  var keys = Object.keys(raw);
  var max  = 0;

  keys.forEach(function (key) {
    max = Math.max(max, key.length);
  });

  console.log('\n  The default value of variables: ');

  keys.forEach(function (key) {

    var value = raw[key] || '';

    cursor
      .grey()
      .write('  ● ')
      .magenta()
      .write(padRight(key, max, ' '))
      .grey()
      .write(' -> ')
      .cyan()
      .write(value + '\n')
      .fg.reset().end();
  });

  exports.help('config');
};

exports.updateConfig = function (key, value) {
  config.save(key, value);
  cursor
    .green()
    .write('\n  Variables updated. \n\n')
    .fg.reset();
};

exports.list = function (isHeader) {

  if (isHeader) {
    console.log('\n  Available license headers:');
  } else {
    console.log('\n  Available licenses:');
  }

  var max = 0;

  licenses.data.forEach(function (license) {

    if (isHeader && !license.header) {
      return;
    }
    max = Math.max(max, license.ref.length)
  });

  licenses.data.forEach(function (license) {

    if (isHeader && !license.header) {
      return;
    }

    cursor
      .grey()
      .write('  ● ')
      .magenta()
      .write(padRight(license.ref, max, ' '))
      .grey()
      .write('   ')
      .cyan()
      .write(license.name + '\n')
      .fg.reset().end();
  });

  console.log();
};

exports.introduce = function (license) {

  license = typeof license === 'string'
    ? license
    : license.license;

  if (checkLicense(license)) {
    var filepath = '../doc/introduces/' + license + '.txt';
    var contents = readFileSync(filepath);

    console.log(contents);
  }
};

exports.show = show;

exports.generate = generate;

exports.getLicenseContent = function (options) {
  return getContent(options, true);
};

// helpers
// -------

function padRight(str, len, sub) {

  if (!str || !sub || str.length >= len) {
    return str;
  }

  var max = (len - str.length) / sub.length;

  for (var i = 0; i < max; i++) {
    str += sub;
  }

  return str;
}

function readFileSync(filepath) {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
}

function getContent(options, raw) {

  var dirname  = options.header ? 'headers' : 'licenses';
  var filepath = '../doc/' + dirname + '/' + options.license + '.txt';
  var content  = readFileSync(filepath);

  if (!raw) {
    if (options.fullname) {
      content = content.replace(/\{\{ fullname \}\}/g, options.fullname);
    }

    if (options.year) {
      content = content.replace(/\{\{ year \}\}/g, options.year);
    }

    if (options.email) {
      content = content.replace(/\{\{ email \}\}/g, options.email);
    }
  }

  return content;
}

function checkLicense(license, isHeader) {

  var metadata = licenses.mapping[license];

  if (!metadata) {

    cursor
      .red()
      .write('\n  Invalid license: "' + license + '".\n')
      .fg.reset();

    exports.list();

    return false;

  } else if (isHeader && !metadata.header) {

    cursor
      .red()
      .write('\n  License "' + license + '" has no header.\n')
      .fg.reset();

    exports.list(true);

    return false;
  }

  return metadata;
}

function show(options) {
  if (checkLicense(options.license, options.header)) {
    var content = getContent(options);
    console.log(content);
  }
}

function writeFile(filepath, content, overwrite) {

  fs.stat(filepath, function (err, stats) {

    if (stats && stats.isFile() && !overwrite) {

      cursor
        .red()
        .write('\n  License file exist, ignored.\n\n')
        .fg.reset();

    } else {
      fs.writeFile(filepath, content, function () {

        cursor
          .green()
          .write('\n  License generated in: ' + filepath + '\n\n')
          .fg.reset();
      });
    }
  });
}

function generate(options) {

  if (!checkLicense(options.license, options.header)) {
    return;
  }

  var content  = getContent(options);
  var dirpath  = options.path || process.cwd();
  var filepath = path.resolve(dirpath, options.filename);

  dirpath = path.resolve(filepath, '../');

  fs.stat(dirpath, function (err, stats) {
    if (stats) {
      writeFile(filepath, content, options.overwrite);
    } else {
      mkdirp(dirpath, function (err) {
        if (err) {

          cursor
            .red()
            .write('\n  Failed write license to file.\n\n')
            .fg.reset();

        } else {
          writeFile(filepath, content, options.overwrite);
        }
      });
    }
  });
}
