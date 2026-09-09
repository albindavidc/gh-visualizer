export const id = 576;
export const ids = [576];
export const modules = {

/***/ 7576:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ index$1)
/* harmony export */ });
/* harmony import */ var _dep_BK3b2jBa_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7490);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6928);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9896);
/* harmony import */ var _dep_IQS_Za7F_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1479);
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3136);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6760);
/* harmony import */ var node_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8995);









const __filename = (0,node_url__WEBPACK_IMPORTED_MODULE_4__.fileURLToPath)(import.meta.url);
const __dirname = (0,node_path__WEBPACK_IMPORTED_MODULE_5__.dirname)(__filename);
const require = (0,node_module__WEBPACK_IMPORTED_MODULE_6__.createRequire)(import.meta.url);
const __require = require;
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    var e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (var k in e) {
      if (k !== 'default' && !(k in n)) {
        n[k] = e[k];
      }
    } }
  }
  return n;
}

var formatImportPrelude$2 = function formatImportPrelude(layer, media, supports) {
  const parts = [];

  if (typeof layer !== "undefined") {
    let layerParams = "layer";
    if (layer) {
      layerParams = `layer(${layer})`;
    }

    parts.push(layerParams);
  }

  if (typeof supports !== "undefined") {
    parts.push(`supports(${supports})`);
  }

  if (typeof media !== "undefined") {
    parts.push(media);
  }

  return parts.join(" ")
};

const formatImportPrelude$1 = formatImportPrelude$2;

// Base64 encode an import with conditions
// The order of conditions is important and is interleaved with cascade layer declarations
// Each group of conditions and cascade layers needs to be interpreted in order
// To achieve this we create a list of base64 encoded imports, where each import contains a stylesheet with another import.
// Each import can define a single group of conditions and a single cascade layer.
var base64EncodedImport = function base64EncodedConditionalImport(prelude, conditions) {
  conditions.reverse();
  const first = conditions.pop();
  let params = `${prelude} ${formatImportPrelude$1(
    first.layer,
    first.media,
    first.supports,
  )}`;

  for (const condition of conditions) {
    params = `'data:text/css;base64,${Buffer.from(`@import ${params}`).toString(
      "base64",
    )}' ${formatImportPrelude$1(
      condition.layer,
      condition.media,
      condition.supports,
    )}`;
  }

  return params
};

const base64EncodedConditionalImport = base64EncodedImport;

var applyConditions$1 = function applyConditions(bundle, atRule) {
  bundle.forEach(stmt => {
    if (
      stmt.type === "charset" ||
      stmt.type === "warning" ||
      !stmt.conditions?.length
    ) {
      return
    }

    if (stmt.type === "import") {
      stmt.node.params = base64EncodedConditionalImport(
        stmt.fullUri,
        stmt.conditions,
      );
      return
    }

    const { nodes } = stmt;
    const { parent } = nodes[0];

    const atRules = [];

    // Convert conditions to at-rules
    for (const condition of stmt.conditions) {
      if (typeof condition.media !== "undefined") {
        const mediaNode = atRule({
          name: "media",
          params: condition.media,
          source: parent.source,
        });

        atRules.push(mediaNode);
      }

      if (typeof condition.supports !== "undefined") {
        const supportsNode = atRule({
          name: "supports",
          params: `(${condition.supports})`,
          source: parent.source,
        });

        atRules.push(supportsNode);
      }

      if (typeof condition.layer !== "undefined") {
        const layerNode = atRule({
          name: "layer",
          params: condition.layer,
          source: parent.source,
        });

        atRules.push(layerNode);
      }
    }

    // Add nodes to AST
    const outerAtRule = atRules.shift();
    const innerAtRule = atRules.reduce((previous, next) => {
      previous.append(next);
      return next
    }, outerAtRule);

    parent.insertBefore(nodes[0], outerAtRule);

    // remove nodes
    nodes.forEach(node => {
      node.parent = undefined;
    });

    // better output
    nodes[0].raws.before = nodes[0].raws.before || "\n";

    // wrap new rules with media query and/or layer at rule
    innerAtRule.append(nodes);

    stmt.type = "nodes";
    stmt.nodes = [outerAtRule];
    delete stmt.node;
  });
};

var applyRaws$1 = function applyRaws(bundle) {
  bundle.forEach((stmt, index) => {
    if (index === 0) return

    if (stmt.parent) {
      const { before } = stmt.parent.node.raws;
      if (stmt.type === "nodes") stmt.nodes[0].raws.before = before;
      else stmt.node.raws.before = before;
    } else if (stmt.type === "nodes") {
      stmt.nodes[0].raws.before = stmt.nodes[0].raws.before || "\n";
    }
  });
};

var applyStyles$1 = function applyStyles(bundle, styles) {
  styles.nodes = [];

  // Strip additional statements.
  bundle.forEach(stmt => {
    if (["charset", "import"].includes(stmt.type)) {
      stmt.node.parent = undefined;
      styles.append(stmt.node);
    } else if (stmt.type === "nodes") {
      stmt.nodes.forEach(node => {
        node.parent = undefined;
        styles.append(node);
      });
    }
  });
};

var readCache$1 = {exports: {}};

var pify$2 = {exports: {}};

var processFn = function (fn, P, opts) {
	return function () {
		var that = this;
		var args = new Array(arguments.length);

		for (var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		return new P(function (resolve, reject) {
			args.push(function (err, result) {
				if (err) {
					reject(err);
				} else if (opts.multiArgs) {
					var results = new Array(arguments.length - 1);

					for (var i = 1; i < arguments.length; i++) {
						results[i - 1] = arguments[i];
					}

					resolve(results);
				} else {
					resolve(result);
				}
			});

			fn.apply(that, args);
		});
	};
};

var pify$1 = pify$2.exports = function (obj, P, opts) {
	if (typeof P !== 'function') {
		opts = P;
		P = Promise;
	}

	opts = opts || {};
	opts.exclude = opts.exclude || [/.+Sync$/];

	var filter = function (key) {
		var match = function (pattern) {
			return typeof pattern === 'string' ? key === pattern : pattern.test(key);
		};

		return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
	};

	var ret = typeof obj === 'function' ? function () {
		if (opts.excludeMain) {
			return obj.apply(this, arguments);
		}

		return processFn(obj, P, opts).apply(this, arguments);
	} : {};

	return Object.keys(obj).reduce(function (ret, key) {
		var x = obj[key];

		ret[key] = typeof x === 'function' && filter(key) ? processFn(x, P, opts) : x;

		return ret;
	}, ret);
};

pify$1.all = pify$1;

var pifyExports = pify$2.exports;

var fs = fs__WEBPACK_IMPORTED_MODULE_2__;
var path$3 = path__WEBPACK_IMPORTED_MODULE_1__;
var pify = pifyExports;

var stat = pify(fs.stat);
var readFile = pify(fs.readFile);
var resolve = path$3.resolve;

var cache = Object.create(null);

function convert(content, encoding) {
	if (Buffer.isEncoding(encoding)) {
		return content.toString(encoding);
	}
	return content;
}

readCache$1.exports = function (path, encoding) {
	path = resolve(path);

	return stat(path).then(function (stats) {
		var item = cache[path];

		if (item && item.mtime.getTime() === stats.mtime.getTime()) {
			return convert(item.content, encoding);
		}

		return readFile(path).then(function (data) {
			cache[path] = {
				mtime: stats.mtime,
				content: data
			};

			return convert(data, encoding);
		});
	}).catch(function (err) {
		cache[path] = null;
		return Promise.reject(err);
	});
};

readCache$1.exports.sync = function (path, encoding) {
	path = resolve(path);

	try {
		var stats = fs.statSync(path);
		var item = cache[path];

		if (item && item.mtime.getTime() === stats.mtime.getTime()) {
			return convert(item.content, encoding);
		}

		var data = fs.readFileSync(path);

		cache[path] = {
			mtime: stats.mtime,
			content: data
		};

		return convert(data, encoding);
	} catch (err) {
		cache[path] = null;
		throw err;
	}

};

readCache$1.exports.get = function (path, encoding) {
	path = resolve(path);
	if (cache[path]) {
		return convert(cache[path].content, encoding);
	}
	return null;
};

readCache$1.exports.clear = function () {
	cache = Object.create(null);
};

var readCacheExports = readCache$1.exports;

const anyDataURLRegexp = /^data:text\/css(?:;(base64|plain))?,/i;
const base64DataURLRegexp = /^data:text\/css;base64,/i;
const plainDataURLRegexp = /^data:text\/css;plain,/i;

function isValid(url) {
  return anyDataURLRegexp.test(url)
}

function contents(url) {
  if (base64DataURLRegexp.test(url)) {
    // "data:text/css;base64,".length === 21
    return Buffer.from(url.slice(21), "base64").toString()
  }

  if (plainDataURLRegexp.test(url)) {
    // "data:text/css;plain,".length === 20
    return decodeURIComponent(url.slice(20))
  }

  // "data:text/css,".length === 14
  return decodeURIComponent(url.slice(14))
}

var dataUrl = {
  isValid,
  contents,
};

const readCache = readCacheExports;
const dataURL$1 = dataUrl;

var loadContent$1 = function loadContent(filename) {
  if (dataURL$1.isValid(filename)) {
    return dataURL$1.contents(filename)
  }

  return readCache(filename, "utf-8")
};

// external tooling
const valueParser = _dep_IQS_Za7F_js__WEBPACK_IMPORTED_MODULE_3__.l;

// extended tooling
const { stringify } = valueParser;

var parseStatements$1 = function parseStatements(result, styles, conditions, from) {
  const statements = [];
  let nodes = [];

  styles.each(node => {
    let stmt;
    if (node.type === "atrule") {
      if (node.name === "import")
        stmt = parseImport(result, node, conditions, from);
      else if (node.name === "charset")
        stmt = parseCharset(result, node, conditions, from);
    }

    if (stmt) {
      if (nodes.length) {
        statements.push({
          type: "nodes",
          nodes,
          conditions: [...conditions],
          from,
        });
        nodes = [];
      }
      statements.push(stmt);
    } else nodes.push(node);
  });

  if (nodes.length) {
    statements.push({
      type: "nodes",
      nodes,
      conditions: [...conditions],
      from,
    });
  }

  return statements
};

function parseCharset(result, atRule, conditions, from) {
  if (atRule.prev()) {
    return result.warn("@charset must precede all other statements", {
      node: atRule,
    })
  }
  return {
    type: "charset",
    node: atRule,
    conditions: [...conditions],
    from,
  }
}

function parseImport(result, atRule, conditions, from) {
  let prev = atRule.prev();

  // `@import` statements may follow other `@import` statements.
  if (prev) {
    do {
      if (
        prev.type === "comment" ||
        (prev.type === "atrule" && prev.name === "import")
      ) {
        prev = prev.prev();
        continue
      }

      break
    } while (prev)
  }

  // All `@import` statements may be preceded by `@charset` or `@layer` statements.
  // But the `@import` statements must be consecutive.
  if (prev) {
    do {
      if (
        prev.type === "comment" ||
        (prev.type === "atrule" &&
          (prev.name === "charset" || (prev.name === "layer" && !prev.nodes)))
      ) {
        prev = prev.prev();
        continue
      }

      return result.warn(
        "@import must precede all other statements (besides @charset or empty @layer)",
        { node: atRule },
      )
    } while (prev)
  }

  if (atRule.nodes) {
    return result.warn(
      "It looks like you didn't end your @import statement correctly. " +
        "Child nodes are attached to it.",
      { node: atRule },
    )
  }

  const params = valueParser(atRule.params).nodes;
  const stmt = {
    type: "import",
    uri: "",
    fullUri: "",
    node: atRule,
    conditions: [...conditions],
    from,
  };

  let layer;
  let media;
  let supports;

  for (let i = 0; i < params.length; i++) {
    const node = params[i];

    if (node.type === "space" || node.type === "comment") continue

    if (node.type === "string") {
      if (stmt.uri) {
        return result.warn(`Multiple url's in '${atRule.toString()}'`, {
          node: atRule,
        })
      }

      if (!node.value) {
        return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
          node: atRule,
        })
      }

      stmt.uri = node.value;
      stmt.fullUri = stringify(node);
      continue
    }

    if (node.type === "function" && /^url$/i.test(node.value)) {
      if (stmt.uri) {
        return result.warn(`Multiple url's in '${atRule.toString()}'`, {
          node: atRule,
        })
      }

      if (!node.nodes?.[0]?.value) {
        return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
          node: atRule,
        })
      }

      stmt.uri = node.nodes[0].value;
      stmt.fullUri = stringify(node);
      continue
    }

    if (!stmt.uri) {
      return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
        node: atRule,
      })
    }

    if (
      (node.type === "word" || node.type === "function") &&
      /^layer$/i.test(node.value)
    ) {
      if (typeof layer !== "undefined") {
        return result.warn(`Multiple layers in '${atRule.toString()}'`, {
          node: atRule,
        })
      }

      if (typeof supports !== "undefined") {
        return result.warn(
          `layers must be defined before support conditions in '${atRule.toString()}'`,
          {
            node: atRule,
          },
        )
      }

      if (node.nodes) {
        layer = stringify(node.nodes);
      } else {
        layer = "";
      }

      continue
    }

    if (node.type === "function" && /^supports$/i.test(node.value)) {
      if (typeof supports !== "undefined") {
        return result.warn(
          `Multiple support conditions in '${atRule.toString()}'`,
          {
            node: atRule,
          },
        )
      }

      supports = stringify(node.nodes);

      continue
    }

    media = stringify(params.slice(i));
    break
  }

  if (!stmt.uri) {
    return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
      node: atRule,
    })
  }

  if (
    typeof media !== "undefined" ||
    typeof layer !== "undefined" ||
    typeof supports !== "undefined"
  ) {
    stmt.conditions.push({
      layer,
      media,
      supports,
    });
  }

  return stmt
}

// builtin tooling
const path$2 = path__WEBPACK_IMPORTED_MODULE_1__;

// placeholder tooling
let sugarss;

var processContent$1 = function processContent(
  result,
  content,
  filename,
  options,
  postcss,
) {
  const { plugins } = options;
  const ext = path$2.extname(filename);

  const parserList = [];

  // SugarSS support:
  if (ext === ".sss") {
    if (!sugarss) {
      /* c8 ignore next 3 */
      try {
        sugarss = __require('sugarss');
      } catch {} // Ignore
    }
    if (sugarss)
      return runPostcss(postcss, content, filename, plugins, [sugarss])
  }

  // Syntax support:
  if (result.opts.syntax?.parse) {
    parserList.push(result.opts.syntax.parse);
  }

  // Parser support:
  if (result.opts.parser) parserList.push(result.opts.parser);
  // Try the default as a last resort:
  parserList.push(null);

  return runPostcss(postcss, content, filename, plugins, parserList)
};

function runPostcss(postcss, content, filename, plugins, parsers, index) {
  if (!index) index = 0;
  return postcss(plugins)
    .process(content, {
      from: filename,
      parser: parsers[index],
    })
    .catch(err => {
      // If there's an error, try the next parser
      index++;
      // If there are no parsers left, throw it
      if (index === parsers.length) throw err
      return runPostcss(postcss, content, filename, plugins, parsers, index)
    })
}

const path$1 = path__WEBPACK_IMPORTED_MODULE_1__;

const dataURL = dataUrl;
const parseStatements = parseStatements$1;
const processContent = processContent$1;
const resolveId$1 = (id) => id;
const formatImportPrelude = formatImportPrelude$2;

async function parseStyles$1(
  result,
  styles,
  options,
  state,
  conditions,
  from,
  postcss,
) {
  const statements = parseStatements(result, styles, conditions, from);

  for (const stmt of statements) {
    if (stmt.type !== "import" || !isProcessableURL(stmt.uri)) {
      continue
    }

    if (options.filter && !options.filter(stmt.uri)) {
      // rejected by filter
      continue
    }

    await resolveImportId(result, stmt, options, state, postcss);
  }

  let charset;
  const imports = [];
  const bundle = [];

  function handleCharset(stmt) {
    if (!charset) charset = stmt;
    // charsets aren't case-sensitive, so convert to lower case to compare
    else if (
      stmt.node.params.toLowerCase() !== charset.node.params.toLowerCase()
    ) {
      throw stmt.node.error(
        `Incompatible @charset statements:
  ${stmt.node.params} specified in ${stmt.node.source.input.file}
  ${charset.node.params} specified in ${charset.node.source.input.file}`,
      )
    }
  }

  // squash statements and their children
  statements.forEach(stmt => {
    if (stmt.type === "charset") handleCharset(stmt);
    else if (stmt.type === "import") {
      if (stmt.children) {
        stmt.children.forEach((child, index) => {
          if (child.type === "import") imports.push(child);
          else if (child.type === "charset") handleCharset(child);
          else bundle.push(child);
          // For better output
          if (index === 0) child.parent = stmt;
        });
      } else imports.push(stmt);
    } else if (stmt.type === "nodes") {
      bundle.push(stmt);
    }
  });

  return charset ? [charset, ...imports.concat(bundle)] : imports.concat(bundle)
}

async function resolveImportId(result, stmt, options, state, postcss) {
  if (dataURL.isValid(stmt.uri)) {
    // eslint-disable-next-line require-atomic-updates
    stmt.children = await loadImportContent(
      result,
      stmt,
      stmt.uri,
      options,
      state,
      postcss,
    );

    return
  } else if (dataURL.isValid(stmt.from.slice(-1))) {
    // Data urls can't be used as a base url to resolve imports.
    throw stmt.node.error(
      `Unable to import '${stmt.uri}' from a stylesheet that is embedded in a data url`,
    )
  }

  const atRule = stmt.node;
  let sourceFile;
  if (atRule.source?.input?.file) {
    sourceFile = atRule.source.input.file;
  }
  const base = sourceFile
    ? path$1.dirname(atRule.source.input.file)
    : options.root;

  const paths = [await options.resolve(stmt.uri, base, options, atRule)].flat();

  // Ensure that each path is absolute:
  const resolved = await Promise.all(
    paths.map(file => {
      return !path$1.isAbsolute(file)
        ? resolveId$1(file)
        : file
    }),
  );

  // Add dependency messages:
  resolved.forEach(file => {
    result.messages.push({
      type: "dependency",
      plugin: "postcss-import",
      file,
      parent: sourceFile,
    });
  });

  const importedContent = await Promise.all(
    resolved.map(file => {
      return loadImportContent(result, stmt, file, options, state, postcss)
    }),
  );

  // Merge loaded statements
  // eslint-disable-next-line require-atomic-updates
  stmt.children = importedContent.flat().filter(x => !!x);
}

async function loadImportContent(
  result,
  stmt,
  filename,
  options,
  state,
  postcss,
) {
  const atRule = stmt.node;
  const { conditions, from } = stmt;
  const stmtDuplicateCheckKey = conditions
    .map(condition =>
      formatImportPrelude(condition.layer, condition.media, condition.supports),
    )
    .join(":");

  if (options.skipDuplicates) {
    // skip files already imported at the same scope
    if (state.importedFiles[filename]?.[stmtDuplicateCheckKey]) {
      return
    }

    // save imported files to skip them next time
    if (!state.importedFiles[filename]) {
      state.importedFiles[filename] = {};
    }
    state.importedFiles[filename][stmtDuplicateCheckKey] = true;
  }

  if (from.includes(filename)) {
    return
  }

  const content = await options.load(filename, options);

  if (content.trim() === "" && options.warnOnEmpty) {
    result.warn(`${filename} is empty`, { node: atRule });
    return
  }

  // skip previous imported files not containing @import rules
  if (
    options.skipDuplicates &&
    state.hashFiles[content]?.[stmtDuplicateCheckKey]
  ) {
    return
  }

  const importedResult = await processContent(
    result,
    content,
    filename,
    options,
    postcss,
  );

  const styles = importedResult.root;
  result.messages = result.messages.concat(importedResult.messages);

  if (options.skipDuplicates) {
    const hasImport = styles.some(child => {
      return child.type === "atrule" && child.name === "import"
    });
    if (!hasImport) {
      // save hash files to skip them next time
      if (!state.hashFiles[content]) {
        state.hashFiles[content] = {};
      }

      state.hashFiles[content][stmtDuplicateCheckKey] = true;
    }
  }

  // recursion: import @import from imported file
  return parseStyles$1(
    result,
    styles,
    options,
    state,
    conditions,
    [...from, filename],
    postcss,
  )
}

function isProcessableURL(uri) {
  // skip protocol base uri (protocol://url) or protocol-relative
  if (/^(?:[a-z]+:)?\/\//i.test(uri)) {
    return false
  }

  // check for fragment or query
  try {
    // needs a base to parse properly
    const url = new URL(uri, "https://example.com");
    if (url.search) {
      return false
    }
  } catch {} // Ignore

  return true
}

var parseStyles_1 = parseStyles$1;

// builtin tooling
const path = path__WEBPACK_IMPORTED_MODULE_1__;

// internal tooling
const applyConditions = applyConditions$1;
const applyRaws = applyRaws$1;
const applyStyles = applyStyles$1;
const loadContent = loadContent$1;
const parseStyles = parseStyles_1;
const resolveId = (id) => id;

function AtImport(options) {
  options = {
    root: process.cwd(),
    path: [],
    skipDuplicates: true,
    resolve: resolveId,
    load: loadContent,
    plugins: [],
    addModulesDirectories: [],
    warnOnEmpty: true,
    ...options,
  };

  options.root = path.resolve(options.root);

  // convert string to an array of a single element
  if (typeof options.path === "string") options.path = [options.path];

  if (!Array.isArray(options.path)) options.path = [];

  options.path = options.path.map(p => path.resolve(options.root, p));

  return {
    postcssPlugin: "postcss-import",
    async Once(styles, { result, atRule, postcss }) {
      const state = {
        importedFiles: {},
        hashFiles: {},
      };

      if (styles.source?.input?.file) {
        state.importedFiles[styles.source.input.file] = {};
      }

      if (options.plugins && !Array.isArray(options.plugins)) {
        throw new Error("plugins option must be an array")
      }

      const bundle = await parseStyles(
        result,
        styles,
        options,
        state,
        [],
        [],
        postcss,
      );

      applyRaws(bundle);
      applyConditions(bundle, atRule);
      applyStyles(bundle, styles);
    },
  }
}

AtImport.postcss = true;

var postcssImport = AtImport;

var index = /*@__PURE__*/(0,_dep_BK3b2jBa_js__WEBPACK_IMPORTED_MODULE_0__.C)(postcssImport);

var index$1 = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: index
}, [postcssImport]);




/***/ }),

/***/ 1479:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ lib)
/* harmony export */ });
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3136);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
/* harmony import */ var node_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8995);




const __filename = (0,node_url__WEBPACK_IMPORTED_MODULE_0__.fileURLToPath)(import.meta.url);
const __dirname = (0,node_path__WEBPACK_IMPORTED_MODULE_1__.dirname)(__filename);
const require = (0,node_module__WEBPACK_IMPORTED_MODULE_2__.createRequire)(import.meta.url);
const __require = (/* unused pure expression or super */ null && (require));
var openParentheses = "(".charCodeAt(0);
var closeParentheses = ")".charCodeAt(0);
var singleQuote = "'".charCodeAt(0);
var doubleQuote = '"'.charCodeAt(0);
var backslash = "\\".charCodeAt(0);
var slash = "/".charCodeAt(0);
var comma = ",".charCodeAt(0);
var colon = ":".charCodeAt(0);
var star = "*".charCodeAt(0);
var uLower = "u".charCodeAt(0);
var uUpper = "U".charCodeAt(0);
var plus = "+".charCodeAt(0);
var isUnicodeRange = /^[a-f0-9?-]+$/i;

var parse$1 = function(input) {
  var tokens = [];
  var value = input;

  var next,
    quote,
    prev,
    token,
    escape,
    escapePos,
    whitespacePos,
    parenthesesOpenPos;
  var pos = 0;
  var code = value.charCodeAt(pos);
  var max = value.length;
  var stack = [{ nodes: tokens }];
  var balanced = 0;
  var parent;

  var name = "";
  var before = "";
  var after = "";

  while (pos < max) {
    // Whitespaces
    if (code <= 32) {
      next = pos;
      do {
        next += 1;
        code = value.charCodeAt(next);
      } while (code <= 32);
      token = value.slice(pos, next);

      prev = tokens[tokens.length - 1];
      if (code === closeParentheses && balanced) {
        after = token;
      } else if (prev && prev.type === "div") {
        prev.after = token;
        prev.sourceEndIndex += token.length;
      } else if (
        code === comma ||
        code === colon ||
        (code === slash &&
          value.charCodeAt(next + 1) !== star &&
          (!parent ||
            (parent && parent.type === "function" && parent.value !== "calc")))
      ) {
        before = token;
      } else {
        tokens.push({
          type: "space",
          sourceIndex: pos,
          sourceEndIndex: next,
          value: token
        });
      }

      pos = next;

      // Quotes
    } else if (code === singleQuote || code === doubleQuote) {
      next = pos;
      quote = code === singleQuote ? "'" : '"';
      token = {
        type: "string",
        sourceIndex: pos,
        quote: quote
      };
      do {
        escape = false;
        next = value.indexOf(quote, next + 1);
        if (~next) {
          escapePos = next;
          while (value.charCodeAt(escapePos - 1) === backslash) {
            escapePos -= 1;
            escape = !escape;
          }
        } else {
          value += quote;
          next = value.length - 1;
          token.unclosed = true;
        }
      } while (escape);
      token.value = value.slice(pos + 1, next);
      token.sourceEndIndex = token.unclosed ? next : next + 1;
      tokens.push(token);
      pos = next + 1;
      code = value.charCodeAt(pos);

      // Comments
    } else if (code === slash && value.charCodeAt(pos + 1) === star) {
      next = value.indexOf("*/", pos);

      token = {
        type: "comment",
        sourceIndex: pos,
        sourceEndIndex: next + 2
      };

      if (next === -1) {
        token.unclosed = true;
        next = value.length;
        token.sourceEndIndex = next;
      }

      token.value = value.slice(pos + 2, next);
      tokens.push(token);

      pos = next + 2;
      code = value.charCodeAt(pos);

      // Operation within calc
    } else if (
      (code === slash || code === star) &&
      parent &&
      parent.type === "function" &&
      parent.value === "calc"
    ) {
      token = value[pos];
      tokens.push({
        type: "word",
        sourceIndex: pos - before.length,
        sourceEndIndex: pos + token.length,
        value: token
      });
      pos += 1;
      code = value.charCodeAt(pos);

      // Dividers
    } else if (code === slash || code === comma || code === colon) {
      token = value[pos];

      tokens.push({
        type: "div",
        sourceIndex: pos - before.length,
        sourceEndIndex: pos + token.length,
        value: token,
        before: before,
        after: ""
      });
      before = "";

      pos += 1;
      code = value.charCodeAt(pos);

      // Open parentheses
    } else if (openParentheses === code) {
      // Whitespaces after open parentheses
      next = pos;
      do {
        next += 1;
        code = value.charCodeAt(next);
      } while (code <= 32);
      parenthesesOpenPos = pos;
      token = {
        type: "function",
        sourceIndex: pos - name.length,
        value: name,
        before: value.slice(parenthesesOpenPos + 1, next)
      };
      pos = next;

      if (name === "url" && code !== singleQuote && code !== doubleQuote) {
        next -= 1;
        do {
          escape = false;
          next = value.indexOf(")", next + 1);
          if (~next) {
            escapePos = next;
            while (value.charCodeAt(escapePos - 1) === backslash) {
              escapePos -= 1;
              escape = !escape;
            }
          } else {
            value += ")";
            next = value.length - 1;
            token.unclosed = true;
          }
        } while (escape);
        // Whitespaces before closed
        whitespacePos = next;
        do {
          whitespacePos -= 1;
          code = value.charCodeAt(whitespacePos);
        } while (code <= 32);
        if (parenthesesOpenPos < whitespacePos) {
          if (pos !== whitespacePos + 1) {
            token.nodes = [
              {
                type: "word",
                sourceIndex: pos,
                sourceEndIndex: whitespacePos + 1,
                value: value.slice(pos, whitespacePos + 1)
              }
            ];
          } else {
            token.nodes = [];
          }
          if (token.unclosed && whitespacePos + 1 !== next) {
            token.after = "";
            token.nodes.push({
              type: "space",
              sourceIndex: whitespacePos + 1,
              sourceEndIndex: next,
              value: value.slice(whitespacePos + 1, next)
            });
          } else {
            token.after = value.slice(whitespacePos + 1, next);
            token.sourceEndIndex = next;
          }
        } else {
          token.after = "";
          token.nodes = [];
        }
        pos = next + 1;
        token.sourceEndIndex = token.unclosed ? next : pos;
        code = value.charCodeAt(pos);
        tokens.push(token);
      } else {
        balanced += 1;
        token.after = "";
        token.sourceEndIndex = pos + 1;
        tokens.push(token);
        stack.push(token);
        tokens = token.nodes = [];
        parent = token;
      }
      name = "";

      // Close parentheses
    } else if (closeParentheses === code && balanced) {
      pos += 1;
      code = value.charCodeAt(pos);

      parent.after = after;
      parent.sourceEndIndex += after.length;
      after = "";
      balanced -= 1;
      stack[stack.length - 1].sourceEndIndex = pos;
      stack.pop();
      parent = stack[balanced];
      tokens = parent.nodes;

      // Words
    } else {
      next = pos;
      do {
        if (code === backslash) {
          next += 1;
        }
        next += 1;
        code = value.charCodeAt(next);
      } while (
        next < max &&
        !(
          code <= 32 ||
          code === singleQuote ||
          code === doubleQuote ||
          code === comma ||
          code === colon ||
          code === slash ||
          code === openParentheses ||
          (code === star &&
            parent &&
            parent.type === "function" &&
            parent.value === "calc") ||
          (code === slash &&
            parent.type === "function" &&
            parent.value === "calc") ||
          (code === closeParentheses && balanced)
        )
      );
      token = value.slice(pos, next);

      if (openParentheses === code) {
        name = token;
      } else if (
        (uLower === token.charCodeAt(0) || uUpper === token.charCodeAt(0)) &&
        plus === token.charCodeAt(1) &&
        isUnicodeRange.test(token.slice(2))
      ) {
        tokens.push({
          type: "unicode-range",
          sourceIndex: pos,
          sourceEndIndex: next,
          value: token
        });
      } else {
        tokens.push({
          type: "word",
          sourceIndex: pos,
          sourceEndIndex: next,
          value: token
        });
      }

      pos = next;
    }
  }

  for (pos = stack.length - 1; pos; pos -= 1) {
    stack[pos].unclosed = true;
    stack[pos].sourceEndIndex = value.length;
  }

  return stack[0].nodes;
};

var walk$1 = function walk(nodes, cb, bubble) {
  var i, max, node, result;

  for (i = 0, max = nodes.length; i < max; i += 1) {
    node = nodes[i];
    if (!bubble) {
      result = cb(node, i, nodes);
    }

    if (
      result !== false &&
      node.type === "function" &&
      Array.isArray(node.nodes)
    ) {
      walk(node.nodes, cb, bubble);
    }

    if (bubble) {
      cb(node, i, nodes);
    }
  }
};

function stringifyNode(node, custom) {
  var type = node.type;
  var value = node.value;
  var buf;
  var customResult;

  if (custom && (customResult = custom(node)) !== undefined) {
    return customResult;
  } else if (type === "word" || type === "space") {
    return value;
  } else if (type === "string") {
    buf = node.quote || "";
    return buf + value + (node.unclosed ? "" : buf);
  } else if (type === "comment") {
    return "/*" + value + (node.unclosed ? "" : "*/");
  } else if (type === "div") {
    return (node.before || "") + value + (node.after || "");
  } else if (Array.isArray(node.nodes)) {
    buf = stringify$1(node.nodes, custom);
    if (type !== "function") {
      return buf;
    }
    return (
      value +
      "(" +
      (node.before || "") +
      buf +
      (node.after || "") +
      (node.unclosed ? "" : ")")
    );
  }
  return value;
}

function stringify$1(nodes, custom) {
  var result, i;

  if (Array.isArray(nodes)) {
    result = "";
    for (i = nodes.length - 1; ~i; i -= 1) {
      result = stringifyNode(nodes[i], custom) + result;
    }
    return result;
  }
  return stringifyNode(nodes, custom);
}

var stringify_1 = stringify$1;

var unit;
var hasRequiredUnit;

function requireUnit () {
	if (hasRequiredUnit) return unit;
	hasRequiredUnit = 1;
	var minus = "-".charCodeAt(0);
	var plus = "+".charCodeAt(0);
	var dot = ".".charCodeAt(0);
	var exp = "e".charCodeAt(0);
	var EXP = "E".charCodeAt(0);

	// Check if three code points would start a number
	// https://www.w3.org/TR/css-syntax-3/#starts-with-a-number
	function likeNumber(value) {
	  var code = value.charCodeAt(0);
	  var nextCode;

	  if (code === plus || code === minus) {
	    nextCode = value.charCodeAt(1);

	    if (nextCode >= 48 && nextCode <= 57) {
	      return true;
	    }

	    var nextNextCode = value.charCodeAt(2);

	    if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
	      return true;
	    }

	    return false;
	  }

	  if (code === dot) {
	    nextCode = value.charCodeAt(1);

	    if (nextCode >= 48 && nextCode <= 57) {
	      return true;
	    }

	    return false;
	  }

	  if (code >= 48 && code <= 57) {
	    return true;
	  }

	  return false;
	}

	// Consume a number
	// https://www.w3.org/TR/css-syntax-3/#consume-number
	unit = function(value) {
	  var pos = 0;
	  var length = value.length;
	  var code;
	  var nextCode;
	  var nextNextCode;

	  if (length === 0 || !likeNumber(value)) {
	    return false;
	  }

	  code = value.charCodeAt(pos);

	  if (code === plus || code === minus) {
	    pos++;
	  }

	  while (pos < length) {
	    code = value.charCodeAt(pos);

	    if (code < 48 || code > 57) {
	      break;
	    }

	    pos += 1;
	  }

	  code = value.charCodeAt(pos);
	  nextCode = value.charCodeAt(pos + 1);

	  if (code === dot && nextCode >= 48 && nextCode <= 57) {
	    pos += 2;

	    while (pos < length) {
	      code = value.charCodeAt(pos);

	      if (code < 48 || code > 57) {
	        break;
	      }

	      pos += 1;
	    }
	  }

	  code = value.charCodeAt(pos);
	  nextCode = value.charCodeAt(pos + 1);
	  nextNextCode = value.charCodeAt(pos + 2);

	  if (
	    (code === exp || code === EXP) &&
	    ((nextCode >= 48 && nextCode <= 57) ||
	      ((nextCode === plus || nextCode === minus) &&
	        nextNextCode >= 48 &&
	        nextNextCode <= 57))
	  ) {
	    pos += nextCode === plus || nextCode === minus ? 3 : 2;

	    while (pos < length) {
	      code = value.charCodeAt(pos);

	      if (code < 48 || code > 57) {
	        break;
	      }

	      pos += 1;
	    }
	  }

	  return {
	    number: value.slice(0, pos),
	    unit: value.slice(pos)
	  };
	};
	return unit;
}

var parse = parse$1;
var walk = walk$1;
var stringify = stringify_1;

function ValueParser(value) {
  if (this instanceof ValueParser) {
    this.nodes = parse(value);
    return this;
  }
  return new ValueParser(value);
}

ValueParser.prototype.toString = function() {
  return Array.isArray(this.nodes) ? stringify(this.nodes) : "";
};

ValueParser.prototype.walk = function(cb, bubble) {
  walk(this.nodes, cb, bubble);
  return this;
};

ValueParser.unit = requireUnit();

ValueParser.walk = walk;

ValueParser.stringify = stringify;

var lib = ValueParser;




/***/ })

};
