var inquirer = require('inquirer');
var actions  = require('./actions');
var licenses = require('./licenses');

function action(license) {

  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      {
        name: '   Generate',
        value: 'generate'
      },
      {
        name: '   Generate Header',
        value: 'generateHeader'
      },
      {
        name: '   Show Content',
        value: 'display'
      },
      {
        name: '   Show Header',
        value: 'header'
      },
      {
        name: '   Introduction',
        value: 'introduce'
      }
    ],
    default: 'generate'
  }, function (answer) {
    actions[answer.action](license);
    //console.log(answer);
  });
}

// list licenses
exports.list = function (opts) {

  var choices = [];
  var mapping = {};

  licenses.data.forEach(function (item, index) {

    // choices
    if (index === 0) {
      choices.push(new inquirer.Separator('<Featured licenses>'))
    } else if (index === 5) {
      choices.push(new inquirer.Separator('<Other licenses>'))
    }

    choices.push({
      name: '   ' + item.abbr,
      value: item.ref
    });

    // cache
    mapping[item.ref] = item;
  });

  inquirer.prompt({
    type: 'list',
    name: 'license',
    message: 'Choose a license:      ',
    choices: choices,
    default: 'mit',
  }, function (answer) {
    action(answer.license);
  });
};
