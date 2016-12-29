webpackJsonp([0],{

/***/ 427:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reducers = __webpack_require__(201);

var _homeContainer = __webpack_require__(441);

var _homeContainer2 = _interopRequireDefault(_homeContainer);

var _home = __webpack_require__(442);

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
  (0, _reducers.injectReducer)(store, { key: 'home', reducer: _home2.default });
  cb(null, _homeContainer2.default);
};

/***/ },

/***/ 429:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },

/***/ 430:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },

/***/ 431:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(73);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(74);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(75);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(77);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(76);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './goodItem.sass'

var GoodItem = function (_Component) {
  (0, _inherits3.default)(GoodItem, _Component);

  function GoodItem() {
    (0, _classCallCheck3.default)(this, GoodItem);
    return (0, _possibleConstructorReturn3.default)(this, (GoodItem.__proto__ || (0, _getPrototypeOf2.default)(GoodItem)).apply(this, arguments));
  }

  (0, _createClass3.default)(GoodItem, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "good" },
        _react2.default.createElement("i", { className: "icon" }),
        _react2.default.createElement(
          "span",
          { className: "name" },
          "\u65B9\u5757\u9A91\u58EB"
        ),
        _react2.default.createElement(
          "span",
          { className: "down-num" },
          "1.2\u4EBF\u4EBA\u4E0B\u8F7D"
        )
      );
    }
  }]);
  return GoodItem;
}(_react.Component);

exports.default = GoodItem;

/***/ },

/***/ 432:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(73);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(74);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(75);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(77);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(76);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './lbfl.sass'

var Lbfl = function (_Component) {
  (0, _inherits3.default)(Lbfl, _Component);

  function Lbfl() {
    (0, _classCallCheck3.default)(this, Lbfl);
    return (0, _possibleConstructorReturn3.default)(this, (Lbfl.__proto__ || (0, _getPrototypeOf2.default)(Lbfl)).apply(this, arguments));
  }

  (0, _createClass3.default)(Lbfl, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "ul",
        { className: "lbfl" },
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "div",
            { className: "left" },
            _react2.default.createElement(
              "span",
              { className: "name" },
              "\u65B9\u5757\u9A91\u58EB"
            ),
            _react2.default.createElement(
              "span",
              null,
              "138\u91D1\u5E01 \uFF08\u6D3B\u52A8\u6388\u6743\uFF09"
            )
          ),
          _react2.default.createElement(
            "a",
            null,
            "\u9886\u53D6"
          )
        ),
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "div",
            { className: "left" },
            _react2.default.createElement(
              "span",
              { className: "name" },
              "\u65B9\u5757\u9A91\u58EB"
            ),
            _react2.default.createElement(
              "span",
              null,
              "138\u91D1\u5E01 \uFF08\u6D3B\u52A8\u6388\u6743\uFF09"
            )
          ),
          _react2.default.createElement(
            "a",
            null,
            "\u9886\u53D6"
          )
        ),
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "div",
            { className: "left" },
            _react2.default.createElement(
              "span",
              { className: "name" },
              "\u65B9\u5757\u9A91\u58EB"
            ),
            _react2.default.createElement(
              "span",
              null,
              "138\u91D1\u5E01 \uFF08\u6D3B\u52A8\u6388\u6743\uFF09"
            )
          ),
          _react2.default.createElement(
            "a",
            null,
            "\u9886\u53D6"
          )
        )
      );
    }
  }]);
  return Lbfl;
}(_react.Component);

exports.default = Lbfl;

/***/ },

/***/ 433:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(73);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(74);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(75);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(77);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(76);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './phb.sass'

var Phb = function (_Component) {
  (0, _inherits3.default)(Phb, _Component);

  function Phb() {
    (0, _classCallCheck3.default)(this, Phb);
    return (0, _possibleConstructorReturn3.default)(this, (Phb.__proto__ || (0, _getPrototypeOf2.default)(Phb)).apply(this, arguments));
  }

  (0, _createClass3.default)(Phb, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "ul",
        { className: "phb" },
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "span",
            { className: "num" },
            "1"
          ),
          _react2.default.createElement("i", { className: "icon" }),
          _react2.default.createElement(
            "div",
            { className: "right" },
            _react2.default.createElement(
              "span",
              { className: "name" },
              "\u65B9\u5757\u9A91\u58EB"
            ),
            _react2.default.createElement(
              "span",
              { className: "desc" },
              "1.2\u4EBF\u4EBA\u4E0B\u8F7D"
            )
          )
        ),
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "span",
            { className: "num" },
            "1"
          ),
          _react2.default.createElement("i", { className: "icon" }),
          _react2.default.createElement(
            "div",
            { className: "right" },
            _react2.default.createElement(
              "span",
              { className: "name" },
              "\u65B9\u5757\u9A91\u58EB"
            ),
            _react2.default.createElement(
              "span",
              { className: "desc" },
              "1.2\u4EBF\u4EBA\u4E0B\u8F7D"
            )
          )
        ),
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "span",
            { className: "num" },
            "1"
          ),
          _react2.default.createElement("i", { className: "icon" }),
          _react2.default.createElement(
            "div",
            { className: "right" },
            _react2.default.createElement(
              "span",
              { className: "name" },
              "\u65B9\u5757\u9A91\u58EB"
            ),
            _react2.default.createElement(
              "span",
              { className: "desc" },
              "1.2\u4EBF\u4EBA\u4E0B\u8F7D"
            )
          )
        )
      );
    }
  }]);
  return Phb;
}(_react.Component);

exports.default = Phb;

/***/ },

/***/ 438:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(73);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(74);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(75);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(77);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(76);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(455);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var About = function (_Component) {
  (0, _inherits3.default)(About, _Component);

  function About() {
    (0, _classCallCheck3.default)(this, About);
    return (0, _possibleConstructorReturn3.default)(this, (About.__proto__ || (0, _getPrototypeOf2.default)(About)).apply(this, arguments));
  }

  (0, _createClass3.default)(About, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'about' },
        _react2.default.createElement('i', { className: 'about-logo' }),
        _react2.default.createElement(
          'ul',
          null,
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-hlzy' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u6D77\u91CF\u8D44\u6E90'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '\u6D77\u91CF\u7CBE\u54C1\u624B\u6E38',
              _react2.default.createElement('br', null),
              '\u4E00\u7AD9\u5F0F\u514D\u8D39\u4E0B\u8F7D'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-xycx' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u65B0\u6E38\u5C1D\u9C9C'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '\u7B2C\u4E00\u65F6\u95F4\u63D0\u4F9B\u65B0\u6E38\u9884\u7EA6\u4E0B\u8F7D',
              _react2.default.createElement('br', null),
              '\u5C1D\u9C9C\u5FEB\u4EBA\u4E00\u6B65'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-jptj' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u7CBE\u54C1\u63A8\u8350'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '\u8D44\u6DF1\u6E38\u620F\u4E3B\u7F16\u4E3A\u60A8\u63A8\u8350',
              _react2.default.createElement('br', null),
              '\u6700\u597D\u73A9\u7684\u6E38\u620F\u5185\u5BB9'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-glcp' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u653B\u7565\u6D4B\u8BC4'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '\u5168\u9762\u7684\u6E38\u620F\u653B\u7565\u8BC4\u6D4B',
              _react2.default.createElement('br', null),
              '\u8BA9\u60A8\u968F\u5904\u638C\u63E1'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-czfl' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u8D85\u503C\u798F\u5229'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '\u4E30\u5BCC\u7684\u70ED\u95E8\u6E38\u620F\u6D3B\u52A8\u793C\u5305',
              _react2.default.createElement('br', null),
              '\u8BA9\u60A8\u7545\u723D\u4F53\u9A8C\u6E38\u620F'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-gqsp' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u9AD8\u6E05\u89C6\u9891'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '\u6D77\u91CF\u539F\u521B\u7684\u9AD8\u6E05\u6E38\u620F\u89C6\u9891',
              _react2.default.createElement('br', null),
              '\u8BA9\u60A8\u968F\u5174\u89C2\u770B'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-mnkf' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '\u7F8E\u5973\u5BA2\u670D'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '7*24\u5C0F\u65F6\u7684\u70ED\u60C5\u7F8E\u5973\u5BA2\u670D',
              _react2.default.createElement('br', null),
              '\u968F\u65F6\u4E3A\u4F60\u7B54\u7591\u89E3\u60D1'
            )
          )
        ),
        _react2.default.createElement('i', { className: 'banner-center' })
      );
    }
  }]);
  return About;
}(_react.Component);

exports.default = About;

/***/ },

/***/ 439:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(73);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(74);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(75);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(77);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(76);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(129);

__webpack_require__(456);

var _config = __webpack_require__(78);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function (_Component) {
  (0, _inherits3.default)(Header, _Component);

  function Header() {
    (0, _classCallCheck3.default)(this, Header);
    return (0, _possibleConstructorReturn3.default)(this, (Header.__proto__ || (0, _getPrototypeOf2.default)(Header)).apply(this, arguments));
  }

  (0, _createClass3.default)(Header, [{
    key: 'render',
    value: function render() {

      return _react2.default.createElement(
        'header',
        null,
        _react2.default.createElement(
          'div',
          { className: 'top' },
          _react2.default.createElement('div', { className: 'top-bg' }),
          _react2.default.createElement(
            'div',
            { className: 'top-bg2' },
            _react2.default.createElement('i', { className: 'icon-logo' }),
            _react2.default.createElement(
              'div',
              { className: 'banner' },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _config.rootPath + "/", className: 'current' },
                '\u9996\u9875'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _config.rootPath + '/yysc' },
                '\u5E94\u7528\u5E02\u573A'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _config.rootPath + '/aboutUs' },
                '\u5173\u4E8E\u6211\u4EEC'
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'banner-right' },
          _react2.default.createElement(
            'div',
            { className: 'center' },
            _react2.default.createElement('div', { className: 'erweima' }),
            _react2.default.createElement(
              'a',
              { className: 'ios-down' },
              'iPhone\u7248\u4E0B\u8F7D'
            ),
            _react2.default.createElement(
              'a',
              { className: 'android-down' },
              'Android\u7248\u4E0B\u8F7D'
            )
          )
        )
      );
    }
  }]);
  return Header;
}(_react.Component);

exports.default = Header;

/***/ },

/***/ 440:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(73);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(74);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(75);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(77);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(76);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _header = __webpack_require__(439);

var _header2 = _interopRequireDefault(_header);

var _about = __webpack_require__(438);

var _about2 = _interopRequireDefault(_about);

var _goodItem = __webpack_require__(431);

var _goodItem2 = _interopRequireDefault(_goodItem);

var _lbfl = __webpack_require__(432);

var _lbfl2 = _interopRequireDefault(_lbfl);

var _phb = __webpack_require__(433);

var _phb2 = _interopRequireDefault(_phb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HomeEle = function (_React$Component) {
  (0, _inherits3.default)(HomeEle, _React$Component);

  function HomeEle() {
    (0, _classCallCheck3.default)(this, HomeEle);
    return (0, _possibleConstructorReturn3.default)(this, (HomeEle.__proto__ || (0, _getPrototypeOf2.default)(HomeEle)).apply(this, arguments));
  }

  (0, _createClass3.default)(HomeEle, [{
    key: 'render',
    value: function render() {

      console.log(this.props.fetchError(1));
      return _react2.default.createElement(
        'div',
        { className: 'container home' },
        _react2.default.createElement(_header2.default, null),
        _react2.default.createElement(_about2.default, null),
        _react2.default.createElement(_goodItem2.default, null),
        _react2.default.createElement(_lbfl2.default, null),
        _react2.default.createElement(_phb2.default, null)
      );
    }
  }]);
  return HomeEle;
}(_react2.default.Component);

HomeEle.propTypes = {
  fetchList: _react.PropTypes.func.isRequired,
  fetchError: _react.PropTypes.func.isRequired
};
exports.default = HomeEle;

/***/ },

/***/ 441:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(202);

var _actions = __webpack_require__(127);

var _home = __webpack_require__(440);

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
  fetchList: function fetchList(url, options, key, filter) {
    return (0, _actions.fetchList)(url, options, key, filter);
  },
  fetchError: function fetchError(status) {
    return (0, _actions.fetchError)(status);
  }
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    homeInfo: state.home.homeInfo
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_home2.default);

/***/ },

/***/ 442:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(128);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = homeReducer;

var _reducers = __webpack_require__(201);

var _config = __webpack_require__(78);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
  homeInfo: {}
};

function homeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (location.pathname !== _config.rootPath + '/') return state;
  var handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

/***/ },

/***/ 449:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(429)();
// imports


// module
exports.push([module.i, ".about .about-logo {\n  display: block;\n  margin-top: 60px;\n  height: 95px;\n  background: url(\"/web/img/icon-about.png\") no-repeat;\n  background-position: center; }\n\n.about ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  width: 1128px;\n  margin: 0 auto; }\n  .about ul li {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    margin-top: 72px;\n    width: 282px;\n    display: inline-block;\n    vertical-align: middle; }\n    .about ul li .icon {\n      width: 132px;\n      height: 132px;\n      display: block;\n      background-repeat: no-repeat;\n      margin: 0 auto; }\n    .about ul li .icon-hlzy {\n      background-image: url(\"/web/img/icon-hlzy.png\"); }\n    .about ul li .icon-xycx {\n      background-image: url(\"/web/img/icon-xycx.png\"); }\n    .about ul li .icon-jptj {\n      background-image: url(\"/web/img/icon-jptj.png\"); }\n    .about ul li .icon-glcp {\n      background-image: url(\"/web/img/icon-glcp.png\"); }\n    .about ul li .icon-czfl {\n      background-image: url(\"/web/img/icon-czfl.png\"); }\n    .about ul li .icon-gqsp {\n      background-image: url(\"/web/img/icon-gqsp.png\"); }\n    .about ul li .icon-mnkf {\n      background-image: url(\"/web/img/icon-mnkf.png\"); }\n    .about ul li .theme {\n      display: block;\n      font-size: 26px;\n      color: #0C253D;\n      margin-top: 25px;\n      text-align: center; }\n    .about ul li .describe {\n      display: block;\n      font-size: 20px;\n      color: #9EA8B2;\n      line-height: 30px;\n      text-align: center; }\n\n.about .banner-center {\n  width: 1200px;\n  height: 202px;\n  background: url(\"/web/img/icon-banner-center.jpg\") no-repeat;\n  display: block;\n  margin: 0 auto;\n  margin-top: 125px; }\n", ""]);

// exports


/***/ },

/***/ 450:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(429)();
// imports


// module
exports.push([module.i, ".home header {\n  background-image: url(\"/web/img/icon-banner.jpg\");\n  background-size: cover;\n  background-repeat: no-repeat;\n  height: 691px;\n  padding-top: 58px;\n  position: relative; }\n  .home header::after {\n    content: '';\n    position: absolute;\n    background-image: url(\"/web/img/icon-bl-up.png\");\n    height: 34px;\n    width: 100%;\n    bottom: -1px; }\n  .home header .top {\n    width: 1050px;\n    height: 80px;\n    border-radius: 5px;\n    background: rgba(255, 255, 255, 0.7);\n    margin: 0 auto;\n    position: relative; }\n    .home header .top .top-bg {\n      width: 100%;\n      height: 100%;\n      background: rgba(255, 255, 255, 0.7);\n      border-radius: 5px;\n      -webkit-filter: blur(14px);\n              filter: blur(14px);\n      position: absolute; }\n    .home header .top .top-bg2 {\n      position: absolute;\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -ms-flexbox;\n      display: flex;\n      width: 100%;\n      height: 100%; }\n    .home header .top .icon-logo {\n      width: 100px;\n      display: inline-block;\n      height: 80px;\n      background-image: url(\"/web/img/icon-logo1.png\");\n      background-repeat: no-repeat;\n      background-position: center;\n      position: relative; }\n      .home header .top .icon-logo::after {\n        content: '';\n        position: absolute;\n        height: 50px;\n        border-left: 1px solid #EDC25C;\n        right: 0px;\n        -webkit-transform: translateY(-50%);\n                transform: translateY(-50%);\n        top: 50%; }\n    .home header .top .banner {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      background-image: url(\"/web/img/icon-slogan1.png\");\n      background-repeat: no-repeat;\n      background-position: 16px center;\n      line-height: 80px;\n      font-size: 18px;\n      color: #9b9b9b;\n      text-align: center; }\n      .home header .top .banner a {\n        text-decoration: none;\n        color: #9B9B9B;\n        padding: 0 20px; }\n      .home header .top .banner .current {\n        color: #000; }\n  .home header .banner-right {\n    width: 1050px;\n    margin: 0 auto; }\n    .home header .banner-right .center {\n      width: 160px;\n      float: right; }\n    .home header .banner-right .erweima {\n      height: 126px;\n      width: 126px;\n      background-color: #fff;\n      border-radius: 5px;\n      margin: 118px auto 0; }\n    .home header .banner-right a {\n      width: 160px;\n      height: 48px;\n      border: 1px solid #4A4A4A;\n      border-radius: 5px;\n      text-indent: 45px;\n      display: block;\n      line-height: 48px;\n      color: #4A4A4A; }\n    .home header .banner-right .ios-down {\n      background: url(\"/web/img/download-ios.png\") no-repeat;\n      background-position: 5px center;\n      margin-top: 40px; }\n    .home header .banner-right .android-down {\n      background: url(\"/web/img/download-android.png\") no-repeat;\n      background-position: 5px center;\n      margin-top: 35px; }\n", ""]);

// exports


/***/ },

/***/ 455:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(449);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(430)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./about.sass", function() {
			var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./about.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 456:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(450);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(430)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./header.sass", function() {
			var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./header.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});