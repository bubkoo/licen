#!/usr/bin/env node

var config    = require('../lib/config');
var actions   = require('../lib/actions');
var prompts   = require('../lib/prompts');
var parseArgs = require('minimist');

var argv = parseArgs(process.argv.slice(2), {
  alias: {
    V: 'version',
    h: 'help',
    c: 'config',
    H: 'header',
    i: 'introduce',
    g: 'generate',
    s: 'show',
    o: 'overwrite',
    l: 'license',
    p: 'path',
    n: 'filename',
    f: 'fullname',
    e: 'email',
    y: 'year'
  },

  string: [
    'license',
    'path',
    'filename',
    'fullname',
    'email',
    'year',
  ],

  boolean: [
    'config',
    'overwrite',
    'version',
    'header',
    'introduce',
    'generate',
    'show',
    'list'
  ],
  default: config.get()
});


//console.log(argv);


if (argv.help) {
  return actions.help(argv.help);
}

if (argv.version) {
  return actions.version();
}

if (argv.config) {
  return actions.config(argv._);
}

if (argv.list) {
  return actions.list(argv.header);
}

if (argv.license) {

  if (argv.introduce) {
    return actions.introduce(argv.license);
  }

  if (argv.show) {
    return actions.show(argv);
  }

  if (argv.generate && argv.filename) {
    return actions.generate(argv);
  }
}

prompts.dispatch(argv);

