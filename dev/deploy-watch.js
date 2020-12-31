const FS = require('fs');
const PATH = require('path');
const DEPLOY = require('./deploy.utils');
const BUILD = require('./build.utils');

const BUILD_N_DEPLOY = (() => {
  let buildTimeout;
  return () => {
    clearTimeout(buildTimeout);
    buildTimeout = setTimeout(() => {
      console.log('Change detected, re-building and deploying.');
      BUILD.build();
      DEPLOY();
    }, 666);
  };
})();

// files to watch
[
  'template.html'
  , 'dist/favicon.ico'
].forEach(v => 
  FS.watch(
    PATH.join(process.cwd(), v)
    , BUILD_N_DEPLOY)
);
// folders to watch
[
  'styles/'
  , 'dist/img/'
  , 'template-data/'
].forEach(v => 
  FS.watch(
    PATH.join(process.cwd(), v)
    , { recursive: true }
    , BUILD_N_DEPLOY)
);