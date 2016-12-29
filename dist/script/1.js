webpackJsonp([1],{

/***/ 428:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reducers = __webpack_require__(201);

var _yyscContainer = __webpack_require__(445);

var _yyscContainer2 = _interopRequireDefault(_yyscContainer);

var _yysc = __webpack_require__(446);

var _yysc2 = _interopRequireDefault(_yysc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
  (0, _reducers.injectReducer)(store, { key: 'yysc', reducer: _yysc2.default });
  cb(null, _yyscContainer2.default);
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

/***/ 443:
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

__webpack_require__(457);

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
                { to: _config.rootPath + '/yysc', className: 'current' },
                '\u5E94\u7528\u5E02\u573A'
              ),
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _config.rootPath + '/aboutUs' },
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

/***/ 444:
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

var _header = __webpack_require__(443);

var _header2 = _interopRequireDefault(_header);

__webpack_require__(458);

var _goodItem = __webpack_require__(431);

var _goodItem2 = _interopRequireDefault(_goodItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Yysc = function (_React$Component) {
  (0, _inherits3.default)(Yysc, _React$Component);

  function Yysc(props) {
    (0, _classCallCheck3.default)(this, Yysc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Yysc.__proto__ || (0, _getPrototypeOf2.default)(Yysc)).call(this, props));

    _this.state = {
      games: [{
        img: '',
        name: '方块骑士',
        downCounts: '1.2亿',
        type: 'xxyz'
      }, {
        img: '',
        name: '暗点空战',
        downCounts: '1.2亿',
        type: 'wlyx'
      }, {
        img: '',
        name: '鱿鱼公司',
        downCounts: '1.3亿',
        type: 'dzmx'
      }, {
        img: '',
        name: '太空刑警',
        downCounts: '1.2亿',
        type: 'qpzx'
      }, {
        img: '',
        name: '几何比赛',
        downCounts: '1.2亿',
        type: 'fxsj'
      }, {
        img: '',
        name: '梦境防御',
        downCounts: '1.3亿',
        type: 'jycl'
      }, {
        img: '',
        name: '方块骑士',
        downCounts: '1.2亿',
        type: 'jycl'
      }, {
        img: '',
        name: '暗点空战',
        downCounts: '1.2亿',
        type: 'jsby'
      }, {
        img: '',
        name: '鱿鱼公司',
        downCounts: '1.3亿',
        type: 'tyjs'
      }, {
        img: '',
        name: '太空刑警',
        downCounts: '1.2亿',
        type: 'tyjs'
      }, {
        img: '',
        name: '几何比赛',
        downCounts: '1.2亿',
        type: 'jsby'
      }, {
        img: '',
        name: '梦境防御',
        downCounts: '1.3亿',
        type: 'jycl'
      }]
    };
    return _this;
  }

  (0, _createClass3.default)(Yysc, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'queryGames',
    value: function queryGames(type) {

      var queryUrl = '';
      var queryParam = {};

      var games = [{
        img: '',
        name: '方块骑士',
        downCounts: '1.2亿',
        type: 'xxyz'
      }, {
        img: '',
        name: '暗点空战',
        downCounts: '1.2亿',
        type: 'wlyx'
      }, {
        img: '',
        name: '鱿鱼公司',
        downCounts: '1.3亿',
        type: 'dzmx'
      }, {
        img: '',
        name: '太空刑警',
        downCounts: '1.2亿',
        type: 'qpzx'
      }, {
        img: '',
        name: '几何比赛',
        downCounts: '1.2亿',
        type: 'fxsj'
      }, {
        img: '',
        name: '梦境防御',
        downCounts: '1.3亿',
        type: 'jycl'
      }, {
        img: '',
        name: '方块骑士',
        downCounts: '1.2亿',
        type: 'jycl'
      }, {
        img: '',
        name: '暗点空战',
        downCounts: '1.2亿',
        type: 'jsby'
      }, {
        img: '',
        name: '鱿鱼公司',
        downCounts: '1.3亿',
        type: 'tyjs'
      }, {
        img: '',
        name: '太空刑警',
        downCounts: '1.2亿',
        type: 'tyjs'
      }, {
        img: '',
        name: '几何比赛',
        downCounts: '1.2亿',
        type: 'jsby'
      }, {
        img: '',
        name: '梦境防御',
        downCounts: '1.3亿',
        type: 'jycl'
      }];

      console.log(type);

      if (type) {
        this.setState({
          games: games.filter(function (item) {
            return item.type === type;
          })
        });
      } else {
        this.setState({
          games: games
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'container about' },
        _react2.default.createElement(_header2.default, null),
        _react2.default.createElement(
          'div',
          { className: 'tabs' },
          _react2.default.createElement(
            'ul',
            null,
            _react2.default.createElement(
              'li',
              { className: 'selected', onClick: this.queryGames.bind(this, null) },
              '\u5168\u90E8\u6E38\u620F'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'xxyz') },
              '\u4F11\u95F2\u76CA\u667A'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'wlyx') },
              '\u7F51\u7EDC\u6E38\u620F'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'dzmx') },
              '\u52A8\u4F5C\u5192\u9669'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'qpzx') },
              '\u68CB\u724C\u4E2D\u5FC3'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'fxsj') },
              '\u98DE\u884C\u5C04\u51FB'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'jycl') },
              '\u7ECF\u8425\u7B56\u7565'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'jsby') },
              '\u89D2\u8272\u626E\u6F14'
            ),
            _react2.default.createElement(
              'li',
              { onClick: this.queryGames.bind(this, 'tyjs') },
              '\u4F53\u80B2\u7ADE\u901F'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'games' },
          _react2.default.createElement(
            'ul',
            null,
            this.state.games.map(function (game, index) {
              return _react2.default.createElement(
                'li',
                { key: index },
                _react2.default.createElement(_goodItem2.default, null)
              );
            })
          )
        )
      );
    }
  }]);
  return Yysc;
}(_react2.default.Component);

Yysc.propTypes = {
  fetchList: _react.PropTypes.func.isRequired
};
exports.default = Yysc;

/***/ },

/***/ 445:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(202);

var _actions = __webpack_require__(127);

var _yysc = __webpack_require__(444);

var _yysc2 = _interopRequireDefault(_yysc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
  fetchList: function fetchList(url, options, key, filter) {
    return (0, _actions.fetchList)(url, options, key, filter);
  }
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    yyscInfo: state.yysc.yyscInfo
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_yysc2.default);

/***/ },

/***/ 446:
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

  if (location.pathname !== _config.rootPath + '/yysc') return state;
  var handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

/***/ },

/***/ 451:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(429)();
// imports


// module
exports.push([module.i, ".about header {\n  background-size: cover;\n  background-repeat: no-repeat;\n  height: 104px;\n  position: relative;\n  padding-top: 12px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  background-color: #fff;\n  background-image: none; }\n  .about header .top {\n    width: 1050px;\n    height: 80px;\n    border-radius: 5px;\n    background: rgba(255, 255, 255, 0.7);\n    margin: 0 auto;\n    position: relative; }\n    .about header .top .top-bg {\n      width: 100%;\n      height: 100%;\n      background: rgba(255, 255, 255, 0.7);\n      border-radius: 5px;\n      -webkit-filter: blur(14px);\n              filter: blur(14px);\n      position: absolute; }\n    .about header .top .top-bg2 {\n      position: absolute;\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -ms-flexbox;\n      display: flex;\n      width: 100%;\n      height: 100%; }\n    .about header .top .icon-logo {\n      width: 100px;\n      display: inline-block;\n      height: 80px;\n      background-image: url(\"/web/img/icon-logo1.png\");\n      background-repeat: no-repeat;\n      background-position: center;\n      position: relative; }\n      .about header .top .icon-logo::after {\n        content: '';\n        position: absolute;\n        height: 50px;\n        border-left: 1px solid #EDC25C;\n        right: 0px;\n        -webkit-transform: translateY(-50%);\n                transform: translateY(-50%);\n        top: 50%; }\n    .about header .top .banner {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      background-image: url(\"/web/img/icon-slogan1.png\");\n      background-repeat: no-repeat;\n      background-position: 16px center;\n      line-height: 80px;\n      font-size: 18px;\n      color: #9b9b9b;\n      text-align: center; }\n      .about header .top .banner a {\n        text-decoration: none;\n        color: #9B9B9B;\n        padding: 0 20px; }\n      .about header .top .banner .current {\n        color: #000; }\n", ""]);

// exports


/***/ },

/***/ 452:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(429)();
// imports


// module
exports.push([module.i, ".about.container {\n  background-color: #f2f2f2; }\n\n.tabs {\n  width: 1200px;\n  margin: 0 auto;\n  padding-top: 70px; }\n  .tabs ul {\n    margin: 0; }\n    .tabs ul li {\n      display: inline-block;\n      padding: 0 22px;\n      border-right: 1px solid #4a4a4a;\n      color: #4a4a4a;\n      margin: 0;\n      width: auto; }\n      .tabs ul li:first-child {\n        padding-left: 0; }\n    .tabs ul .selected {\n      font-weight: bold; }\n\n.games ul {\n  width: 1216px;\n  margin: 18px auto 0;\n  padding-bottom: 170px; }\n  .games ul li {\n    display: inline-block;\n    background-color: #fff;\n    margin: 16px 16px 0 0; }\n    .games ul li:nth-child(7n) {\n      margin-right: 0px; }\n", ""]);

// exports


/***/ },

/***/ 457:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(451);
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

/***/ },

/***/ 458:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(452);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(430)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./yysc.sass", function() {
			var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./yysc.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});