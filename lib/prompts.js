var inquirer = require('inquirer');
var licenses = require('./licenses');


exports.action = function (opts) {

  var choices = [];

  licenses.data.forEach(function (item, index) {

    if (index === 0) {
      choices.push(new inquirer.Separator('Featured licenses'))
    } else if (index === 5) {
      choices.push(new inquirer.Separator('Other licenses'))
    }

    choices.push({
      name : '  ' + item.abbr,
      value: item.ref
    });

  });

  inquirer.prompt({
    type   : 'list',
    name   : 'license',
    message: 'Choose a license from the list: ',
    choices: choices,
    default: 'mit'
  }, function (answer) {
    console.log(answer.action);
    //actions[res.action].apply(null, [opts]);
  });
};


//{
//  type   : 'list',
//    name   : 'action',
//  message: 'What do you want to do?',
//  choices: [
//  {
//    name : '  Generate  a license',
//    value: 'generate'
//  },
//  {
//    name : '  Show license content',
//    value: 'display'
//  },
//  {
//    name : '  Show license header',
//    value: 'header'
//  },
//  {
//    name : '  Show license introduction',
//    value: 'introduce'
//  }
//],
//default: 'generate'
//}
