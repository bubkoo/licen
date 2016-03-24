#!/usr/bin/env node

var pkg       = require('../package.json');
var prompts   = require('../lib/prompts');
var parseArgs = require('minimist');

var version = 'v' + pkg.version;

var argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    V: 'version',
    l: 'list',
    y: 'year',
    u: ['fullname', 'user', 'username', 'user-name', 'full-name',],
    e: 'email'
  },
  default: {},
  boolean: [],
  string: [],
  unknown: function (name) {
    console.log('  Unknown option: ', name);
  }
});


if (argv.help) {
  return;
}


if (argv.version) {
  return console.log(version);
}


prompts.list(argv);
