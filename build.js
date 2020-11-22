const SQRL = require('squirrelly')
const PATH = require('path');
const FS = require('fs');
const MINIFY = require('minify');

const OUT_DIR = PATH.join(__dirname, 'dist/');

build_html();
build_scss();

function build_html() {
  const HTML_OUT_DIR = PATH.join(OUT_DIR, 'html/');
  const DATA_DIR_NAME = PATH.join(__dirname, 'template-data');
  const DATA_LANG_DIR_NAME = PATH.join(DATA_DIR_NAME, 'per-lang');
  const DATAS_PER_LANG = FS.readdirSync(DATA_LANG_DIR_NAME);
  const TEMPLATE = FS.readFileSync('template.html', 'utf8');
  const SHARED_DATA = require(PATH.join(DATA_DIR_NAME, 'shared.json'), 'utf8');

  if (!FS.existsSync(HTML_OUT_DIR))
    FS.mkdirSync(HTML_OUT_DIR);
  DATAS_PER_LANG.forEach(d => {
    FS.writeFileSync(
      `${PATH.join(HTML_OUT_DIR, d.slice(0, -4 /*json*/))}html`
      , SQRL.render(
        TEMPLATE
        , mergeObjects(SHARED_DATA, require(PATH.join(DATA_LANG_DIR_NAME, d)))
      )
    );
  });
}

async function build_scss() {
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
      if (obj2[p].constructor == Object) {
        obj1[p] = mergeObjects(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}