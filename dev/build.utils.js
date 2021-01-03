const SQRL = require('squirrelly')
const PATH = require('path');
const FS = require('fs');
const MINIFY = require('minify');

const OUT_DIR = PATH.join(process.cwd(), 'dist/');

function read_json_file(filePath) {
  return FS.readFileSync(filePath, { encoding: 'utf8' });
}

function parse_json_file(filePath) {
  return JSON.parse(read_json_file(filePath));
}

function build_html() {
  console.log('Building HTML');
  const HTML_OUT_DIR = PATH.join(OUT_DIR, 'html/');
  const DATA_DIR_NAME = PATH.join(process.cwd(), 'template-data');
  const DATA_LANG_DIR_NAME = PATH.join(DATA_DIR_NAME, 'per-lang');
  let template, datasPerLang;
  try {
    const SHARED_DATA = read_json_file(PATH.join(DATA_DIR_NAME, 'shared.json'));
    datasPerLang = FS
    .readdirSync(DATA_LANG_DIR_NAME)
    .map(d => ({
      data: mergeObjects(
        JSON.parse(SHARED_DATA)
        , parse_json_file(PATH.join(DATA_LANG_DIR_NAME, d)))
      , fileName: d
    }));
    template = FS.readFileSync('template.html', 'utf8');
  } catch (e) {
    console.error('Failed to fetch data files.', e);
  }

  if (!FS.existsSync(HTML_OUT_DIR))
    FS.mkdirSync(HTML_OUT_DIR);
  datasPerLang.forEach(dpl => {
    const FILE_NAME = `${PATH.join(HTML_OUT_DIR, dpl.fileName.slice(0, -4 /*json*/))}html`;
    if (FS.existsSync(FILE_NAME))
      FS.unlinkSync(FILE_NAME);
    FS.writeFileSync(
      FILE_NAME
      , SQRL.render(template, dpl.data)
    );
  });
}

async function build_scss() {
  console.log('Building SCSS');
  const OUT_CSS_FNAME = 'dist/stylez.css';
  const OUT_CSS_MIN_FNAME = 'dist/stylez.min.css';
  const SASS = require('sass');
  FS.writeFileSync(
    PATH.join(OUT_CSS_FNAME)
    , SASS.renderSync({ file: 'styles/app.scss' }).css);
  FS.writeFileSync(
    PATH.join(OUT_CSS_MIN_FNAME)
    , await MINIFY(OUT_CSS_FNAME)
  );
}

/*
* Recursively merge properties of two objects.
* @{source} https://stackoverflow.com/a/383245/7095512
*/
function mergeObjects(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor == Object)
        obj1[p] = mergeObjects(obj1[p], obj2[p]);
      else
        obj1[p] = obj2[p];
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }

  return obj1;
}

module.exports = {
  build_html
  , build_scss
  , build: () => {
    build_html();
    build_scss();
  }
};