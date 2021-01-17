/*
deploy.js DeployFolder --ignore
*/
let argv = require('minimist')(process.argv.slice(2));

if (!argv._) throw new Error('Deploy folder missing,');
argv.ignore = argv.ignore ? argv.ignore : argv.i;

require('./deploy.utils')(
  require('path').join(process.cwd(), argv._[0])
  , argv.ignore 
    ? argv.ignore instanceof Array 
      ? argv.ignore.map(v => new RegExp(v))
      : [ new RegExp(argv.ignore) ]
    : []
);