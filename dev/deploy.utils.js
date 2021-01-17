const path = require('path');
const fs = require('fs');

const DIST_DIR = path.join(process.cwd(), 'dist/');
const HTML_DIR = path.join(DIST_DIR, 'html/');

/**
 * Root directories in the source folder, that have a specific copy behavior.
 */
const SPECIFIC_BAHAVIOR_DIRS = {
  'html': (deployLocation, toIgnoreRegexes) => {
    fs.readdirSync(HTML_DIR)
      .forEach(html => copy(
        path.join(HTML_DIR, html)
        , path.join(deployLocation, html)
        , toIgnoreRegexes
      ));
  }
};

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
 * @param {RegExp[]} toIgnoreRegexes 
 */
function copy(srcPath, destPath, toIgnoreRegexes) {
  if (!fs.existsSync(srcPath)
    || (toIgnoreRegexes && toIgnoreRegexes.find(v => v.test(srcPath))))
    return;
  if (fs.lstatSync(srcPath).isDirectory()) {
    if (!fs.existsSync(destPath)) 
      fs.mkdirSync(destPath);
    fs.readdirSync(srcPath).forEach(f => {
      const _srcPath = path.join(srcPath, f);
      const _destPath = path.join(destPath, f);
      copy(_srcPath, _destPath, toIgnoreRegexes);
    });
  } else {
    console.log(`Copying ${srcPath}`);
    fs.copyFileSync(srcPath, destPath);
  }
};

/**
 * Deploy a folder.
 * @param {*} deployLocation 
 * @param {*} toIgnoreRegexes 
 */
module.exports = function (deployLocation, toIgnoreRegexes = []) {
  deleteFolderRecursive(deployLocation);
  fs.mkdirSync(deployLocation);

  fs.readdirSync(DIST_DIR)
    .forEach(f => {
      if (SPECIFIC_BAHAVIOR_DIRS[f]) 
        SPECIFIC_BAHAVIOR_DIRS[f](deployLocation, toIgnoreRegexes);
      else 
        copy(path.join(DIST_DIR, f), path.join(deployLocation, f), toIgnoreRegexes)
    });
};