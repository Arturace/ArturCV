const SQRL = require('squirrelly')
const PATH = require('path');
const FS = require('fs');
const MINIFY = require('minify');

const TEMPLATE_DIR = PATH.join(process.cwd(), 'templates/');
const OUT_DIR = PATH.join(process.cwd(), 'dist/');
const INDEX_HTML = `index.html`;

function read_json_file(filePath) {
  return FS.readFileSync(filePath, { encoding: 'utf8' });
}

function parse_json_file(filePath) {
  return JSON.parse(read_json_file(filePath));
}

function sqrl_to_file(fileName, template, data) {
  if (FS.existsSync(fileName))
      FS.unlinkSync(fileName);
    FS.writeFileSync(
      fileName
      , SQRL.render(template, data)
    );
}
function build_html() {
  console.log('Building HTML');
  const HTML_OUT_DIR = PATH.join(OUT_DIR, 'html/');
  const DATA_DIR_NAME = PATH.join(process.cwd(), 'template-data');
  const DATA_LANG_DIR_NAME = PATH.join(DATA_DIR_NAME, 'per-lang');
  let mainPageTemplate, datasPerLang, indexTemplate;
  try {
    const SHARED_DATA = read_json_file(PATH.join(DATA_DIR_NAME, 'shared.json'));
    datasPerLang = FS
      .readdirSync(DATA_LANG_DIR_NAME)
      .map(d => {
        let res = {
          data: mergeObjects(
            JSON.parse(SHARED_DATA)
            , parse_json_file(PATH.join(DATA_LANG_DIR_NAME, d)))
          , fileName: d
        };
        if (!res.data.lang) throw new Error(`No "lang" found in ${d}`);
        if (!res.data.languages) throw new Error(`No "languages" found in ${d}`);
        res.data.languages = Object.entries(res.data.languages).map(l => {
          return {
            href: `${l[0]}.html`
            , text: l[1]
            , shortText: l[0]
            , current: l[0] == res.data.lang
          };
        });
        return res;
      });
    mainPageTemplate = FS.readFileSync(PATH.join(TEMPLATE_DIR, 'main-page.html'), 'utf8');
    indexTemplate = FS.readFileSync(PATH.join(TEMPLATE_DIR, INDEX_HTML), 'utf8');
  } catch (e) {
    console.error('Failed to fetch data files.', e);
    return;
  }

  if (!FS.existsSync(HTML_OUT_DIR))
    FS.mkdirSync(HTML_OUT_DIR);

  datasPerLang.forEach(dpl => {
    sqrl_to_file(
      `${PATH.join(HTML_OUT_DIR, dpl.fileName.slice(0, -4 /*json*/))}html`
      , mainPageTemplate, dpl.data);
  });
  
  // index decides what language to pick.
  sqrl_to_file(
    `${PATH.join(HTML_OUT_DIR, INDEX_HTML)}`
    , indexTemplate
    , {
      languages: datasPerLang[0].data.languages.map(l => ({ href: l.href, shortText: l.shortText }))
      , defaultLangHref: 'en.html'
    }
  );
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