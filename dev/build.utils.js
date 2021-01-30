const SQRL = require('squirrelly')
const PATH = require('path');
const SASS = require('sass');
const FS = require('fs');
const MINIFY = require('minify');

const OUT_DIR = PATH.join(process.cwd(), 'dist/');

function read_json_file(filePath) {
  return FS.readFileSync(filePath, { encoding: 'utf8' });
}

function parse_json_file(filePath) {
  return JSON.parse(read_json_file(filePath));
}

/**
 * Converts some generic data entries.
 * Entries from ... to ... :
 * - scssToRender: scss file names to compiled css.
 * @param {*} data 
 */
function process_generic_data(data) {
  if (data.scssToRender) {
    // For every scss file, we replace the filename by the compiled css.
    if (!Array.isArray(data.scssToRender)) data.scssToRender = [ data.scssToRender ];
    data.scssToRender = data.scssToRender.map(s => SASS.renderSync({ file: `styles/${s}` }).css);
  }

  return data;
}

/**
 * Uses Squirrelly to compile a template into a file, using some data.
 * @param {string} fileName 
 * @param {string} template 
 * @param {*} data 
 */
function sqrl_to_file(fileName, template, data) {
  if (FS.existsSync(fileName))
    FS.unlinkSync(fileName);
  FS.writeFileSync(
    fileName
    , SQRL.render(template, process_generic_data(data))
  );
}

function build_html() {
  console.log('Building HTML');
  const PARTIALS_DIR_NAME = 'partials';
  const PARTIALS_DIR = PATH.join(process.cwd(), PARTIALS_DIR_NAME);
  const PARTIALS = get_files(PARTIALS_DIR, PARTIALS_DIR_NAME);
  // Save partials into pre-defined templates, for later in-page use
  PARTIALS.forEach(p =>
    SQRL.templates.define(
      PATH.join(p.directories, p.fullName)
      , SQRL.compile(FS.readFileSync(p.path, 'utf8'))
    )
  );
  const TEMPLATE_DIR_NAME = 'templates';
  const TEMPLATE_DIR = PATH.join(process.cwd(), TEMPLATE_DIR_NAME);
  const SHARED_DATA_FILE_NAME = `shared.json`;
  const APP_WIDE_DATA_FILE_NAME = 'app-wide.json';

  const TEMPLATES = get_files(TEMPLATE_DIR, TEMPLATE_DIR_NAME);
  if (TEMPLATES.length == 0) return;
  const HTML_OUT_DIR = PATH.join(OUT_DIR, 'html/');
  if (!FS.existsSync(HTML_OUT_DIR))
    FS.mkdirSync(HTML_OUT_DIR);
  const DATA_DIR_NAME = PATH.join(process.cwd(), 'template-data');
  const APP_WIDE_SETTINGS = read_json_file(PATH.join(DATA_DIR_NAME, APP_WIDE_DATA_FILE_NAME));

  TEMPLATES.forEach(t => {
    const t_OUT_PATH = PATH.join(HTML_OUT_DIR, t.directories);
    const t_DATA_DIR = PATH.join(DATA_DIR_NAME, PATH.join(t.directories, t.name));
    const t_TEMPLATE = FS.readFileSync(t.path, 'utf8');
    if (!FS.existsSync(t_DATA_DIR)) {
      // No multilingual support, we might have a single data file
      const t_JSON_PATH = PATH.join(DATA_DIR_NAME, PATH.join(t.directories, `${t.name}.json`));
      assure_directories_exist(HTML_OUT_DIR, t.splitDirectories);
      sqrl_to_file(
        PATH.join(t_OUT_PATH, t.fullName)
        , t_TEMPLATE
        , FS.existsSync(t_JSON_PATH) 
          ? merge_objects(JSON.parse(APP_WIDE_SETTINGS), parse_json_file(t_JSON_PATH))
          : JSON.stringify(APP_WIDE_SETTINGS)
      );
    } else {
      const t_SHARED_DATA_PATH = PATH.join(t_DATA_DIR, SHARED_DATA_FILE_NAME);
      const t_SHARED_DATA = 
        FS.existsSync(t_SHARED_DATA_PATH)
          ? read_json_file(t_SHARED_DATA_PATH) 
          : '{}';
  
      const DATAS = FS.readdirSync(t_DATA_DIR);
      const X_OF_SHARED = DATAS.indexOf(SHARED_DATA_FILE_NAME);
      DATAS.splice(X_OF_SHARED, 1);
      if (DATAS.length == 0)
        console.warn(`Hey, ${t_DATA_DIR} was empty or only contained a "shared.json", so the corresponding template was not processed.`);
      DATAS.forEach(d => {
        let res = {
          data: merge_objects(
            JSON.parse(APP_WIDE_SETTINGS)
            , JSON.parse(t_SHARED_DATA)
            , parse_json_file(PATH.join(t_DATA_DIR, d))
          )
          , fileName: d
        };
        res.data.lang = d.slice(0, -'.json'.length);
        if (!res.data.languages) throw new Error(`No "languages" found in ${d}`);
        res.data.languages = Object.entries(res.data.languages).map(l => {
          return {
            href: `${t.name}.${l[0]}.html`
            , text: l[1]
            , shortText: l[0]
            , current: l[0] == res.data.lang
          };
        });
        assure_directories_exist(HTML_OUT_DIR, t.splitDirectories);
        sqrl_to_file(
          PATH.join(t_OUT_PATH, `${t.name}.${res.data.lang}.html`)
          , t_TEMPLATE
          , res.data
        );
      });
    }
  });
}

async function build_scss() {
  console.log('Building SCSS');
  const OUT_CSS_FNAME = 'dist/stylez.css';
  const OUT_CSS_MIN_FNAME = 'dist/stylez.min.css';
  FS.writeFileSync(
    PATH.join(OUT_CSS_FNAME)
    , SASS.renderSync({ file: 'styles/app.scss' }).css);
  FS.writeFileSync(
    PATH.join(OUT_CSS_MIN_FNAME)
    , await MINIFY(OUT_CSS_FNAME)
  );
}

/**
 * Gets file location info recursively.
 * @param {string} directoryPath 
 * @param {string} directoryName
 * @returns {{ 
 * name: string
 * , fullName: string
 * , path: string
 * , directories: string
 * , splitDirectories: string[]
 * }}
 */
function get_files(directoryPath, directoryName) {
  function _internal(directoryPath, directoryName, add) {
    const FILES = FS.readdirSync(directoryPath, { withFileTypes: true });
    /** @type {{ name:string, fullName: string, path: string, directories: string, splitDirectories: string[] }} */
    const RES = [];
    FILES.forEach(dirent => {
      if (dirent.isDirectory())
        _internal(PATH.join(directoryPath, dirent.name), dirent.name, true)
          .forEach(f => {
            if (add) f.directories = PATH.join(directoryName, f.directories);
            RES.push(f);
          });
      else
        RES.push({
          name: dirent.name.substring(0, dirent.name.lastIndexOf('.'))
          , fullName: dirent.name
          , path: PATH.join(directoryPath, dirent.name)
          , directories : add ? directoryName : ''
          , splitDirectories : add ? [ directoryName ] : []
        });
    });
    return RES;
  }
  return _internal(directoryPath, directoryName, false);
}

/**
 * Makes sure the directories exist in the base path.
 * @param {string} basePath 
 * @param {string[]} directories 
 */
function assure_directories_exist(basePath, directories) {
  directories.forEach(f => {
    basePath = PATH.join(basePath, f);
    if (!FS.existsSync(basePath))
      FS.mkdirSync(basePath);
  });
}

/*
* Recursively merge properties of two objects.
* @{source} https://stackoverflow.com/a/383245/7095512
*/
function merge_objects(obj1, ...objs) {
  for (let obj of objs)
    for (let p in obj) {
      try {
        // Property in destination object set; update its value.
        if (obj[p].constructor == Object)
          obj1[p] = merge_objects(obj1[p], obj[p]);
        else
          obj1[p] = obj[p];
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj[p];
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