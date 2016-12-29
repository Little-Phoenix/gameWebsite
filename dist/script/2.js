webpackJsonp([2],{

/***/ 426:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reducers = __webpack_require__(201);

var _aboutUsContainer = __webpack_require__(436);

var _aboutUsContainer2 = _interopRequireDefault(_aboutUsContainer);

var _aboutUs = __webpack_require__(437);

var _aboutUs2 = _interopRequireDefault(_aboutUs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
  (0, _reducers.injectReducer)(store, { key: 'aboutUs', reducer: _aboutUs2.default });
  cb(null, _aboutUsContainer2.default);
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

/***/ 434:
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

var _header = __webpack_require__(435);

var _header2 = _interopRequireDefault(_header);

__webpack_require__(453);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AboutUs = function (_React$Component) {
  (0, _inherits3.default)(AboutUs, _React$Component);

  function AboutUs() {
    (0, _classCallCheck3.default)(this, AboutUs);
    return (0, _possibleConstructorReturn3.default)(this, (AboutUs.__proto__ || (0, _getPrototypeOf2.default)(AboutUs)).apply(this, arguments));
  }

  (0, _createClass3.default)(AboutUs, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'container about' },
        _react2.default.createElement(_header2.default, null),
        _react2.default.createElement('i', { className: 'aboutus-banner' }),
        _react2.default.createElement(
          'div',
          { className: 'content' },
          _react2.default.createElement('i', { className: 'icon' }),
          _react2.default.createElement(
            'p',
            null,
            '\u201C\u5929\u6E38\u4E92\u5A31\u201D\u96B6\u5C5E\u4E8E\u5317\u4EAC\u871C\u70B9\u79D1\u6280\u6709\u9650\u516C\u53F8\uFF0C\u662F\u4E00\u5BB6\u4E13\u6CE8\u4E8E\u6E38\u620F\u5185\u5BB9\u5206\u4EAB\u7684\u4E00\u7AD9\u5F0F\u624B\u6E38\u4E92\u52A8\u5A31\u4E50\u5E73\u53F0\uFF0C \u4E0B\u8BBE\u624B\u6E38\u4E0B\u8F7D\u3001\u65B0\u6E38\u9884\u7EA6\u3001\u7CBE\u54C1\u63A8\u8350\u3001\u6E38\u620F\u6392\u884C\u3001\u653B\u7565\u517B\u6210\u3001\u8D85\u503C\u793C\u5305\u7B49\u5404\u7C7B\u529F\u80FD\u4E13\u533A\u3002'
          ),
          _react2.default.createElement(
            'p',
            null,
            '\u516C\u53F8\u81F4\u529B\u4E8E\u4F18\u79C0\u6E38\u620F\u7684\u53D1\u6398\u548C\u8FD0\u8425\uFF0C\u4EE5\u4E3A\u4E2D\u56FD\u73A9\u5BB6\u63D0\u4F9B\u4F18\u8D28\u3001\u4FBF\u6377\u3001\u5FEB\u4E50\u7684\u6E38\u620F\u4F53\u9A8C\u4E3A\u5DF1\u4EFB\uFF0C\u8BA9\u6BCF\u4E00\u4F4D\u73A9\u5BB6\u53EF\u4EE5 \u7545\u60F3\u6E38\u620F\u5E26\u6765\u7684\u4E50\u8DA3\uFF01'
          ),
          _react2.default.createElement(
            'p',
            null,
            '\u622A\u6B62\u81F32016\u5E7411\u6708\uFF0C\u5929\u6E38\u4E92\u5A31\u4E0E\u884C\u4E1A\u5185\u8FD1200\u5BB6\u6E38\u620F\u4F01\u4E1A\u7B80\u5386\u5BC6\u5207\u7684\u5408\u4F5C\u4F19\u4F34\u5173\u7CFB\uFF0C\u6536\u5F55\u4E86\u4E0A\u5343\u6B3E\u7CBE\u54C1\u624B\u6E38\uFF0C \u6CE8\u518C\u7528\u6237\u8D85\u8FC71000\u4E07\u4EBA\uFF0C\u65E5\u5747\u8BBF\u95EE\u7528\u6237\u8D85\u8FC720\u4E07\uFF0C\u6708\u6D3B\u8DC3\u7528\u6237\u8D85\u8FC7100\u4E07\uFF0C\u65E5\u5747\u6D41\u91CF\u8D85\u8FC71000\u4E07\u6B21\uFF0C\u5404\u9879\u6570\u636E\u5747\u5904\u4E8E\u884C\u4E1A\u9886\u5148\u6C34\u5E73\uFF0C \u4E30\u5BCC\u7684\u5185\u5BB9\u548C\u4E00\u6D41\u7684\u8FD0\u8425\u83B7\u5F97\u4E86\u624B\u6E38\u73A9\u5BB6\u548C\u6E38\u620F\u5F00\u53D1\u5546\u3001\u53D1\u884C\u5546\u7684\u5E7F\u6CDB\u8D5E\u8A89\u3002\u7528\u5FC3\u670D\u52A1\u597D\u6BCF\u4E00\u4F4D\u73A9\u5BB6\uFF0C\u662F\u6BCF\u4E00\u4F4D\u5929\u6E38\u4E92\u5A31\u4EBA\u7684\u5DE5\u4F5C\u7406\u5FF5\u3002 \u5929\u6E38\u4E92\u5A31\u5C06\u7EE7\u7EED\u79C9\u627F\u8FD9\u6837\u7684\u4FE1\u4EF0\uFF0C\u81F4\u529B\u4E8E\u6253\u9020\u6700\u53D7\u73A9\u5BB6\u559C\u7231\u7684\u624B\u6E38\u4E92\u52A8\u5A31\u4E50\u5E73\u53F0\u3002'
          )
        )
      );
    }
  }]);
  return AboutUs;
}(_react2.default.Component);

exports.default = AboutUs;

/***/ },

/***/ 435:
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

__webpack_require__(454);

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
                { to: _config.rootPath + "/" },
                '\u9996\u9875'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _config.rootPath + '/yysc' },
                '\u5E94\u7528\u5E02\u573A'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _config.rootPath + '/aboutUs', className: 'current' },
                '\u5173\u4E8E\u6211\u4EEC'
              )
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

/***/ 436:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(202);

var _actions = __webpack_require__(127);

var _aboutUs = __webpack_require__(434);

var _aboutUs2 = _interopRequireDefault(_aboutUs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
  fetchList: function fetchList(url, options, key, filter) {
    return (0, _actions.fetchList)(url, options, key, filter);
  }
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    aboutUsInfo: state.aboutUs.aboutUsInfo
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_aboutUs2.default);

/***/ },

/***/ 437:
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

  if (location.pathname !== _config.rootPath + '/aboutUs') return state;
  var handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

/***/ },

/***/ 447:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(429)();
// imports


// module
exports.push([module.i, ".about.container {\n  background-color: #F2F2F2; }\n\n.aboutus-banner {\n  display: block;\n  height: 181px;\n  background-image: url(\"/web/img/about-banner.png\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  margin: 0 auto; }\n\n.content {\n  background-color: #f2f2f2;\n  font-size: 16px;\n  color: #4A4A4A;\n  width: 1050px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0 auto;\n  line-height: 33px;\n  letter-spacing: 1.8px;\n  padding-bottom: 140px; }\n  .content .icon {\n    width: 450px;\n    height: 95px;\n    background: url(\"/web/img/icon-gs-about.png\") no-repeat;\n    background-size: contain;\n    display: block;\n    margin: 50px auto 34px; }\n  .content p {\n    margin: 0;\n    padding: 0; }\n\nfooter ::before {\n  background-image: url(\"/web/img/icon-bl-gray.png\"); }\n", ""]);

// exports


/***/ },

/***/ 448:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(429)();
// imports


// module
exports.push([module.i, ".about header {\n  background-size: cover;\n  background-repeat: no-repeat;\n  height: 104px;\n  position: relative;\n  padding-top: 12px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  background-color: #fff;\n  background-image: none; }\n  .about header .top {\n    width: 1050px;\n    height: 80px;\n    border-radius: 5px;\n    background: rgba(255, 255, 255, 0.7);\n    margin: 0 auto;\n    position: relative; }\n    .about header .top .top-bg {\n      width: 100%;\n      height: 100%;\n      background: rgba(255, 255, 255, 0.7);\n      border-radius: 5px;\n      -webkit-filter: blur(14px);\n              filter: blur(14px);\n      position: absolute; }\n    .about header .top .top-bg2 {\n      position: absolute;\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -ms-flexbox;\n      display: flex;\n      width: 100%;\n      height: 100%; }\n    .about header .top .icon-logo {\n      width: 100px;\n      display: inline-block;\n      height: 80px;\n      background-image: url(\"/web/img/icon-logo1.png\");\n      background-repeat: no-repeat;\n      background-position: center;\n      position: relative; }\n      .about header .top .icon-logo::after {\n        content: '';\n        position: absolute;\n        height: 50px;\n        border-left: 1px solid #EDC25C;\n        right: 0px;\n        -webkit-transform: translateY(-50%);\n                transform: translateY(-50%);\n        top: 50%; }\n    .about header .top .banner {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      background-image: url(\"/web/img/icon-slogan1.png\");\n      background-repeat: no-repeat;\n      background-position: 16px center;\n      line-height: 80px;\n      font-size: 18px;\n      color: #9b9b9b;\n      text-align: center; }\n      .about header .top .banner a {\n        text-decoration: none;\n        color: #9B9B9B;\n        padding: 0 20px; }\n      .about header .top .banner .current {\n        color: #000; }\n", ""]);

// exports


/***/ },

/***/ 453:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(447);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(430)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./aboutUs.sass", function() {
			var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./aboutUs.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 454:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(448);
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