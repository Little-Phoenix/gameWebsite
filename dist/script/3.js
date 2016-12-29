webpackJsonp([3],{

/***/ 411:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reducers = __webpack_require__(208);

var _homeContainer = __webpack_require__(421);

var _homeContainer2 = _interopRequireDefault(_homeContainer);

var _home = __webpack_require__(422);

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
  (0, _reducers.injectReducer)(store, { key: 'home', reducer: _home2.default });
  cb(null, _homeContainer2.default);
};

/***/ },

/***/ 413:
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

/***/ 414:
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

/***/ 415:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './goodItem.sass'

var GoodItem = function (_Component) {
  (0, _inherits3.default)(GoodItem, _Component);

  function GoodItem() {
    (0, _classCallCheck3.default)(this, GoodItem);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GoodItem).apply(this, arguments));
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
          "方块骑士"
        ),
        _react2.default.createElement(
          "span",
          { className: "down-num" },
          "1.2亿人下载"
        )
      );
    }
  }]);
  return GoodItem;
}(_react.Component);

exports.default = GoodItem;

/***/ },

/***/ 416:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './lbfl.sass'

var Lbfl = function (_Component) {
  (0, _inherits3.default)(Lbfl, _Component);

  function Lbfl() {
    (0, _classCallCheck3.default)(this, Lbfl);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Lbfl).apply(this, arguments));
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
              "方块骑士"
            ),
            _react2.default.createElement(
              "span",
              null,
              "138金币 （活动授权）"
            )
          ),
          _react2.default.createElement(
            "a",
            null,
            "领取"
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
              "方块骑士"
            ),
            _react2.default.createElement(
              "span",
              null,
              "138金币 （活动授权）"
            )
          ),
          _react2.default.createElement(
            "a",
            null,
            "领取"
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
              "方块骑士"
            ),
            _react2.default.createElement(
              "span",
              null,
              "138金币 （活动授权）"
            )
          ),
          _react2.default.createElement(
            "a",
            null,
            "领取"
          )
        )
      );
    }
  }]);
  return Lbfl;
}(_react.Component);

exports.default = Lbfl;

/***/ },

/***/ 417:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './phb.sass'

var Phb = function (_Component) {
  (0, _inherits3.default)(Phb, _Component);

  function Phb() {
    (0, _classCallCheck3.default)(this, Phb);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Phb).apply(this, arguments));
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
              "方块骑士"
            ),
            _react2.default.createElement(
              "span",
              { className: "desc" },
              "1.2亿人下载"
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
              "方块骑士"
            ),
            _react2.default.createElement(
              "span",
              { className: "desc" },
              "1.2亿人下载"
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
              "方块骑士"
            ),
            _react2.default.createElement(
              "span",
              { className: "desc" },
              "1.2亿人下载"
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

/***/ 418:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(428);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var About = function (_Component) {
  (0, _inherits3.default)(About, _Component);

  function About() {
    (0, _classCallCheck3.default)(this, About);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(About).apply(this, arguments));
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
              '海量资源'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '海量精品手游',
              _react2.default.createElement('br', null),
              '一站式免费下载'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-xycx' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '新游尝鲜'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '第一时间提供新游预约下载',
              _react2.default.createElement('br', null),
              '尝鲜快人一步'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-jptj' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '精品推荐'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '资深游戏主编为您推荐',
              _react2.default.createElement('br', null),
              '最好玩的游戏内容'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-glcp' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '攻略测评'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '全面的游戏攻略评测',
              _react2.default.createElement('br', null),
              '让您随处掌握'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-czfl' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '超值福利'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '丰富的热门游戏活动礼包',
              _react2.default.createElement('br', null),
              '让您畅爽体验游戏'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-gqsp' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '高清视频'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '海量原创的高清游戏视频',
              _react2.default.createElement('br', null),
              '让您随兴观看'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement('i', { className: 'icon icon-mnkf' }),
            _react2.default.createElement(
              'span',
              { className: 'theme' },
              '美女客服'
            ),
            _react2.default.createElement(
              'span',
              { className: 'describe' },
              '7*24小时的热情美女客服',
              _react2.default.createElement('br', null),
              '随时为你答疑解惑'
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

/***/ 419:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(130);

__webpack_require__(429);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function (_Component) {
  (0, _inherits3.default)(Header, _Component);

  function Header() {
    (0, _classCallCheck3.default)(this, Header);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Header).apply(this, arguments));
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
                { to: './', className: 'current' },
                '首页'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: './yysc' },
                '应用市场'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: './aboutUs' },
                '关于我们'
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
              'iPhone版下载'
            ),
            _react2.default.createElement(
              'a',
              { className: 'android-down' },
              'Android版下载'
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

/***/ 420:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _header = __webpack_require__(419);

var _header2 = _interopRequireDefault(_header);

var _about = __webpack_require__(418);

var _about2 = _interopRequireDefault(_about);

var _goodItem = __webpack_require__(415);

var _goodItem2 = _interopRequireDefault(_goodItem);

var _lbfl = __webpack_require__(416);

var _lbfl2 = _interopRequireDefault(_lbfl);

var _phb = __webpack_require__(417);

var _phb2 = _interopRequireDefault(_phb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HomeEle = function (_React$Component) {
  (0, _inherits3.default)(HomeEle, _React$Component);

  function HomeEle() {
    (0, _classCallCheck3.default)(this, HomeEle);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HomeEle).apply(this, arguments));
  }

  (0, _createClass3.default)(HomeEle, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'container' },
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

exports.default = HomeEle;

/***/ },

/***/ 421:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(209);

var _actions = __webpack_require__(128);

var _home = __webpack_require__(420);

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
  fetchList: function fetchList(url, options, key, filter) {
    return (0, _actions.fetchList)(url, options, key, filter);
  }
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    homeInfo: state.home.homeInfo
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_home2.default);

/***/ },

/***/ 422:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(129);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = homeReducer;

var _reducers = __webpack_require__(208);

var _config = __webpack_require__(81);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
  homeInfo: {}
};

function homeReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  if (location.pathname !== _config.rootPath + '/home') return state;
  var handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

/***/ },

/***/ 426:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(413)();
// imports


// module
exports.push([module.i, ".about .about-logo {\n  display: block;\n  margin-top: 60px;\n  height: 95px;\n  background: url(\"/web/img/icon-about.png\") no-repeat;\n  background-position: center; }\n\n.about ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  width: 1128px;\n  margin: 0 auto; }\n  .about ul li {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    margin-top: 72px;\n    width: 282px;\n    display: inline-block;\n    vertical-align: middle; }\n    .about ul li .icon {\n      width: 132px;\n      height: 132px;\n      display: block;\n      background-repeat: no-repeat;\n      margin: 0 auto; }\n    .about ul li .icon-hlzy {\n      background-image: url(\"/web/img/icon-hlzy.png\"); }\n    .about ul li .icon-xycx {\n      background-image: url(\"/web/img/icon-xycx.png\"); }\n    .about ul li .icon-jptj {\n      background-image: url(\"/web/img/icon-jptj.png\"); }\n    .about ul li .icon-glcp {\n      background-image: url(\"/web/img/icon-glcp.png\"); }\n    .about ul li .icon-czfl {\n      background-image: url(\"/web/img/icon-czfl.png\"); }\n    .about ul li .icon-gqsp {\n      background-image: url(\"/web/img/icon-gqsp.png\"); }\n    .about ul li .icon-mnkf {\n      background-image: url(\"/web/img/icon-mnkf.png\"); }\n    .about ul li .theme {\n      display: block;\n      font-size: 26px;\n      color: #0C253D;\n      margin-top: 25px;\n      text-align: center; }\n    .about ul li .describe {\n      display: block;\n      font-size: 20px;\n      color: #9EA8B2;\n      line-height: 30px;\n      text-align: center; }\n\n.about .banner-center {\n  width: 1200px;\n  height: 202px;\n  background: url(\"/web/img/icon-banner-center.jpg\") no-repeat;\n  display: block;\n  margin: 0 auto;\n  margin-top: 125px; }\n", ""]);

// exports


/***/ },

/***/ 427:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(413)();
// imports


// module
exports.push([module.i, "header {\n  background-image: url(\"/web/img/icon-banner.jpg\");\n  background-size: cover;\n  background-repeat: no-repeat;\n  height: 691px;\n  padding-top: 58px;\n  position: relative; }\n  header::after {\n    content: '';\n    position: absolute;\n    background-image: url(\"/web/img/icon-bl-up.png\");\n    height: 34px;\n    width: 100%;\n    bottom: -1px; }\n  header .top {\n    width: 1050px;\n    height: 80px;\n    -webkit-border-radius: 5px;\n            border-radius: 5px;\n    background: rgba(255, 255, 255, 0.7);\n    margin: 0 auto;\n    position: relative; }\n    header .top .top-bg {\n      width: 100%;\n      height: 100%;\n      background: rgba(255, 255, 255, 0.7);\n      -webkit-border-radius: 5px;\n              border-radius: 5px;\n      -webkit-filter: blur(14px);\n              filter: blur(14px);\n      position: absolute; }\n    header .top .top-bg2 {\n      position: absolute;\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -ms-flexbox;\n      display: flex;\n      width: 100%;\n      height: 100%; }\n    header .top .icon-logo {\n      width: 100px;\n      display: inline-block;\n      height: 80px;\n      background-image: url(\"/web/img/icon-logo1.png\");\n      background-repeat: no-repeat;\n      background-position: center;\n      position: relative; }\n      header .top .icon-logo::after {\n        content: '';\n        position: absolute;\n        height: 50px;\n        border-left: 1px solid #EDC25C;\n        right: 0px;\n        -webkit-transform: translateY(-50%);\n                transform: translateY(-50%);\n        top: 50%; }\n    header .top .banner {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      background-image: url(\"/web/img/icon-slogan1.png\");\n      background-repeat: no-repeat;\n      background-position: 16px center;\n      line-height: 80px;\n      font-size: 18px;\n      color: #9b9b9b;\n      text-align: center; }\n      header .top .banner a {\n        text-decoration: none;\n        color: #9B9B9B;\n        padding: 0 20px; }\n      header .top .banner .current {\n        color: #000; }\n  header .banner-right {\n    width: 1050px;\n    margin: 0 auto; }\n    header .banner-right .center {\n      width: 160px;\n      float: right; }\n    header .banner-right .erweima {\n      height: 126px;\n      width: 126px;\n      background-color: #fff;\n      -webkit-border-radius: 5px;\n              border-radius: 5px;\n      margin: 118px auto 0; }\n    header .banner-right a {\n      width: 160px;\n      height: 48px;\n      border: 1px solid #4A4A4A;\n      -webkit-border-radius: 5px;\n              border-radius: 5px;\n      text-indent: 45px;\n      display: block;\n      line-height: 48px;\n      color: #4A4A4A; }\n    header .banner-right .ios-down {\n      background: url(\"/web/img/download-ios.png\") no-repeat;\n      background-position: 5px center;\n      margin-top: 40px; }\n    header .banner-right .android-down {\n      background: url(\"/web/img/download-android.png\") no-repeat;\n      background-position: 5px center;\n      margin-top: 35px; }\n", ""]);

// exports


/***/ },

/***/ 428:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(426);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(414)(content, {});
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

/***/ 429:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(427);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(414)(content, {});
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