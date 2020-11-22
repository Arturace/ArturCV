const path = require('path');
const fs = require('fs');

const DEPLOY_LOCATION = path.join(
  __dirname
  , process.argv.length > 2 
    ? process.argv[2] 
    : 'local-deploy');
const DIST_DIR = path.join(__dirname, 'dist/');
const HTML_DIR = path.join(DIST_DIR, 'html/');
const SPECIFIC_BAHAVIOR_DIRS = {
  'html': () => {
    fs.readdirSync(HTML_DIR)
      .forEach(html => copy(path.join(HTML_DIR, html), path.join(DEPLOY_LOCATION, html)));
  }
};

deleteFolderRecursive(DEPLOY_LOCATION);
fs.mkdirSync(DEPLOY_LOCATION);

fs.readdirSync(DIST_DIR)
  .forEach(f => {
    if (SPECIFIC_BAHAVIOR_DIRS[f]) SPECIFIC_BAHAVIOR_DIRS[f]()
    else copy(path.join(DIST_DIR, f), path.join(DEPLOY_LOCATION, f))
  });

/**
 * https://stackoverflow.com/a/32197381/7095512
 * @param {*} folderPath 
 */
function deleteFolderRecursive(folderPath) {
  if (!fs.existsSync(folderPath)) return;
  fs.readdirSync(folderPath).forEach(f => {
    const curPath = path.join(folderPath, f);
    if (fs.lstatSync(curPath).isDirectory()) { // recurse
      deleteFolderRecursive(curPath);
    } else { // delete file
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(folderPath);
};

/**
 * @param {*} srcPath 
 * @param {*} destPath 
 */
function copy(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return;
  if (fs.lstatSync(srcPath).isDirectory()) {
    if (!fs.existsSync(destPath)) 
      fs.mkdirSync(destPath);
    fs.readdirSync(srcPath).forEach(f => {
      const _srcPath = path.join(srcPath, f);
      const _destPath = path.join(destPath, f);
      copy(_srcPath, _destPath);
    });
  } else
    fs.copyFileSync(srcPath, destPath);
};
