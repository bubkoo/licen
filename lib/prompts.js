var fs       = require('fs');
var path     = require('path');
var inquirer = require('inquirer');
var actions  = require('./actions');
var licenses = require('./licenses');


exports.list = function (options) {

  var choices = [];

  licenses.data.forEach(function (item, index) {

    if (index === 0) {
      choices.push(new inquirer.Separator('<Featured licenses>'))
    } else if (index === 5) {
      choices.push(new inquirer.Separator('<Other licenses>'))
    }

    choices.push({
      name : '   ' + item.abbr,
      value: item.ref
    });
  });

  var defaultValue = options.license && licenses.mapping[options.license]
    ? options.license
    : 'mit';

  inquirer.prompt({
    type   : 'list',
    name   : 'license',
    message: 'Choose a license           ',
    choices: choices,
    default: defaultValue,
  }, function (answer) {

    options.license = answer.license;

    exports.action(options);
  });
};

exports.action = function (options) {

  var metadata = licenses.mapping[options.license];
  var choices  = [
    {
      name : '   ..Go back',
      value: 'back'
    },
    {
      name : '   Show introduction',
      value: 'introduce'
    },
    {
      name : '   Generate License',
      value: 'generateLicense'
    },
    {
      name : '   Show License',
      value: 'showLicense'
    }
  ];


  if (metadata.header) {
    choices.splice(3, 0, {
      name : '   Generate Header',
      value: 'generateHeader'
    });
    choices.splice(5, 0, {
      name : '   Show Header',
      value: 'showHeader'
    });
  }


  var defaultValue = 'generateLicense';

  if (options.generate) {
    defaultValue = options.header ? 'generateHeader' : 'generateLicense';
  } else if (options.show) {
    defaultValue = options.header ? 'showHeader' : 'showLicense';
  } else if (options.introduce) {
    defaultValue = 'introduce';
  }

  inquirer.prompt({
    type   : 'list',
    name   : 'action',
    message: 'What do you want to do?    ',
    choices: choices,
    default: defaultValue,
    filter : function (val) {

      var show     = 'show';
      var header   = 'Header';
      var generate = 'generate';

      options.header = val.indexOf(header) > 0;

      if (val.indexOf(generate) === 0) {
        return generate;
      } else if (val.indexOf(show) === 0) {
        return show;
      }

      return val;
    }
  }, function (answer) {

    var method = answer.action;

    if (method === 'back') {
      exports.list(options);
    } else {

      options[method] = true;

      if (method === 'generate') {
        exports.generate(options);
      } else {
        actions[method](options);
        exports.action(options);
      }
    }
  });
}

exports.generate = function (options) {

  var metadata = licenses.mapping[options.license];
  var content  = actions.getLicenseContent(options);
  var dirpath  = options.path || process.cwd();
  var filename = metadata.filename || options.filename || 'LICENSE';

  var questions = [
    {
      type   : 'input',
      name   : 'path',
      message: 'Where\'s the license file?     ',
      default: dirpath
    },
    {
      type   : 'input',
      name   : 'filename',
      message: 'What\'s the license file name? ',
      default: filename
    }
  ];

  var hasFullName = false;
  if (content.indexOf('{{ fullname }}')) {
    questions.push({
      type   : 'input',
      name   : 'fullname',
      message: 'What\'s your full name?        ',
      default: options.fullname
    });
    hasFullName = true;
  }

  var hasYear = false;
  if (content.indexOf('{{ year }}')) {
    questions.push({
      type   : 'input',
      name   : 'year',
      message: 'What\'s the year?              ',
      default: options.year
    });
    hasYear = true;
  }

  var hasEmail = false;
  if (content.indexOf('{{ email }}')) {
    questions.push({
      type   : 'input',
      name   : 'email',
      message: 'What\'s your email?            ',
      default: options.email
    });
    hasEmail = true;
  }

  inquirer.prompt(questions, function (answers) {

    options.path     = answers.path;
    options.filename = answers.filename;

    if (hasFullName) {
      options.fullname = answers.fullname;
    }

    if (hasYear) {
      options.year = answers.year;
    }

    if (hasEmail) {
      options.email = answers.email;
    }


    var filepath = path.resolve(options.path, options.filename);

    fs.stat(filepath, function (err, stats) {
      if (stats && stats.isFile()) {
        inquirer.prompt({
          type   : 'confirm',
          name   : 'overwrite',
          message: 'License file exist, overwrite?',
          default: 'y'
        }, function (answer) {
          options.overwrite = answer.overwrite;
          actions.generate(options);
        });
      } else {
        actions.generate(options);
      }
    });
  });
};


exports.dispatch = function (options) {

  if (!options.license || !licenses.mapping[options.license]
    || !(options.introduce || options.generate || options.show)) {
    exports.list(options);
  } else if (options.license && options.generate && !options.filename) {
    exports.generate(options);
  }
};
