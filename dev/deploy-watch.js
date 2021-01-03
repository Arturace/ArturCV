const FS = require('fs');
const PATH = require('path');
const DEPLOY = require('./deploy.utils');
const BUILD = require('./build.utils');
const { spawn: SPAWN } = require('child_process');

const BUILD_N_DEPLOY = (() => {
  let buildTimeout;
  return (isInitial = false) => {
    clearTimeout(buildTimeout);
    buildTimeout = setTimeout(() => {
      console.log(
        isInitial
          ? 'Initial build & deploy'
          : 'Change detected, re-building & deploying.'
      );
      BUILD.build();
      DEPLOY();
    }, 666);
  };
})();

BUILD_N_DEPLOY(true);

const SUB_PROC = SPAWN('http-server', [ 'local-deploy' ], { shell: true });

SUB_PROC.on('error', (err) => console.error('Failed to start subprocess.', err));
SUB_PROC.stdout.on('data', (data) => console.log(`${data}`));
SUB_PROC.stderr.on('data', (data) => console.error(`${data}`));

// files to watch
[
  'template.html'
  , 'dist/favicon.ico'
].forEach(v =>
  FS.watch(
    PATH.join(process.cwd(), v)
    , () => BUILD_N_DEPLOY())
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
    , () => BUILD_N_DEPLOY())
);