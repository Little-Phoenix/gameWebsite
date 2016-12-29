webpackJsonp([34],{

/***/ 439:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _homeContainer = __webpack_require__(513);

var _homeContainer2 = _interopRequireDefault(_homeContainer);

var _home = __webpack_require__(514);

var _home2 = _interopRequireDefault(_home);

__webpack_require__(478);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'home', reducer: _home2.default });
	cb(null, _homeContainer2.default);
};

/***/ },

/***/ 454:
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

/***/ 455:
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

/***/ 456:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _popup = __webpack_require__(457);

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _popup2.default;

/***/ },

/***/ 457:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(57);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(55);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(56);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(59);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(58);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popup = function (_React$Component) {
	(0, _inherits3.default)(Popup, _React$Component);

	function Popup(props) {
		(0, _classCallCheck3.default)(this, Popup);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Popup).call(this, props));

		_this.confirm = _this.confirm.bind(_this);
		_this.cancel = _this.cancel.bind(_this);
		_this.alertClick = _this.alertClick.bind(_this);
		_this.closePop = _this.closePop.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(Popup, [{
		key: 'confirm',
		value: function confirm(e) {
			e.stopPropagation();
			var that = this;
			var modal = that.props.modal;
			if (modal.confirmCallback) modal.confirmCallback();
			if (modal.isBlock) return false;
			this.props.modalClose();
		}
	}, {
		key: 'cancel',
		value: function cancel(e) {
			e.stopPropagation();
			var modal = this.props.modal;
			if (modal.cancelCallback) modal.cancelCallback();
			if (modal.isBlock) return false;
			this.props.modalClose();
		}
	}, {
		key: 'alertClick',
		value: function alertClick(e) {
			this.confirm(e);
		}
	}, {
		key: 'closePop',
		value: function closePop(e) {
			e.stopPropagation();
			this.props.modalClose();
		}
	}, {
		key: 'render',
		value: function render() {
			var modal = this.props.modal;
			if (!modal.content) return false;
			var popTitleEle = void 0;
			if (!modal.noTitle) {
				popTitleEle = _react2.default.createElement('h2', {
					className: 'popup-title',
					dangerouslySetInnerHTML: { __html: modal.title || '团长提示' }
				});
			}

			var okEle = _react2.default.createElement(
				'span',
				{
					onClick: this.confirm,
					className: 'ok'
				},
				modal.confirm || '确认'
			);

			var cancelEle = void 0;
			if (modal.cancel) {
				cancelEle = _react2.default.createElement(
					'span',
					{
						onClick: this.cancel,
						className: 'cancel'
					},
					modal.cancel
				);
			} else {
				okEle = _react2.default.createElement(
					'div',
					{ className: 'one-line' },
					okEle
				);
			}

			if (modal.closeable) {
				var popupTranEle = _react2.default.createElement('div', { className: 'popup-tran' });
			}

			var canCloseEle = void 0;
			if (modal.canClose) {
				canCloseEle = _react2.default.createElement('div', { className: 'popup-close', onClick: this.closePop });
			}

			var contentInitEle = _react2.default.createElement('div', {
				className: 'popup-content',
				dangerouslySetInnerHTML: { __html: modal.content }
			});

			var contentEle = void 0;
			var descEle = void 0;
			var imgClass = modal.showImgClass || 'popup-icon';
			switch (modal.content) {
				case 'showImg':
					if (modal.desc) {
						descEle = _react2.default.createElement(
							'span',
							null,
							modal.desc
						);
					}
					contentEle = _react2.default.createElement(
						'div',
						{ className: 'popup-content' },
						_react2.default.createElement('img', { alt: '', src: modal.imgSrc, className: imgClass }),
						descEle
					);
					break;
				default:
					contentEle = contentInitEle;
			}

			var popupAlertClass = modal.popClassStr ? 'popup-alert ' + modal.popClassStr : 'popup-alert';
			var popupInnerEle = _react2.default.createElement(
				'div',
				{ className: 'popup-inner' },
				popTitleEle,
				contentEle,
				okEle,
				cancelEle
			);
			var popupAlertEle = _react2.default.createElement(
				'div',
				{ className: popupAlertClass },
				canCloseEle,
				popupInnerEle
			);
			if (modal.popClassStr === 'popup-down-alert') {
				popupAlertEle = _react2.default.createElement(
					'div',
					{ className: popupAlertClass, onClick: this.alertClick },
					canCloseEle,
					popupInnerEle
				);
			}

			return _react2.default.createElement(
				'div',
				{ className: 'popup-wrap' },
				popupAlertEle
			);
		}
	}]);
	return Popup;
}(_react2.default.Component);

Popup.propTypes = {
	modal: _react.PropTypes.object.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func
};
Popup.defaultProps = {
	modal: {
		title: '团长提示',
		content: '试玩一下吧',
		cancel: '取消',
		cancelCallback: function cancelCallback() {},
		confirm: '确认',
		confirmCallback: function confirmCallback() {},
		isBlock: false
	}
};
exports.default = Popup;

/***/ },

/***/ 478:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(565);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./home.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./home.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 511:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(57);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(55);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(56);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(59);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(58);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(61);

__webpack_require__(478);

var _config = __webpack_require__(46);

var _util = __webpack_require__(86);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function (_React$Component) {
	(0, _inherits3.default)(Home, _React$Component);

	function Home(props) {
		(0, _classCallCheck3.default)(this, Home);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Home).call(this, props));

		_this.getAccount = _this.getAccount.bind(_this);
		_this.enterConvertList = _this.enterConvertList.bind(_this);
		_this.bindPhoneJudge = _this.bindPhoneJudge.bind(_this);
		_this.bindWchatJudge = _this.bindWchatJudge.bind(_this);
		_this.wchatRebindJudg = _this.wchatRebindJudg.bind(_this);
		_this.enterInvite = _this.enterInvite.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(Home, [{
		key: 'getAccount',
		value: function getAccount() {
			var props = this.props;
			// 点击我要提现logevent
			(0, _util.logEvent)('get_account');
			// 微信绑定优先
			// if (this.props.userInfo.is_bind === 1) {
			// 	this.props.directTo('/convert')
			// } else {
			// 	$storage.local.set('backPage', 'convert')
			// 	this.props.directTo('/bind-wchat')
			// }
			// return
			var bindPhone = props.userInfo.bind_phone || '';
			if (bindPhone) {
				props.directTo('/convert');
			} else {
				_storage2.default.local.set('backPage', 'convert');
				setTimeout(function () {
					props.modalOpen({
						content: '为确保您的账号安全，请先绑定手机号码',
						confirm: '去绑定',
						confirmCallback: function confirmCallback() {
							props.directTo('/bind-phone');
						}
					});
				}, 5);
			}
		}
	}, {
		key: 'enterConvertList',
		value: function enterConvertList() {
			var props = this.props;
			props.directTo('/convert-list');
		}
	}, {
		key: 'bindPhoneJudge',
		value: function bindPhoneJudge() {
			var _this2 = this;

			var bindPhone = this.props.userInfo.bind_phone || '';
			if (bindPhone) {
				this.props.modalOpen({
					content: '已绑定手机号 <b>' + bindPhone + '</b>，是否要更换手机号?',
					confirm: '更换',
					cancel: '取消',
					confirmCallback: function confirmCallback() {
						_this2.props.directTo('/bind-phone');
					}
				});
			} else {
				this.props.directTo('/bind-phone');
			}
		}
	}, {
		key: 'bindWchatJudge',
		value: function bindWchatJudge() {
			var _this3 = this;

			var userInfo = this.props.userInfo;
			var props = this.props;
			_storage2.default.local.set('backPage', 'home');
			if (userInfo.is_bind === 1) {
				userInfo.nickname = userInfo.nickname || '';
				setTimeout(function () {
					_this3.props.modalOpen({
						content: '<h5>您已经成功绑定微信：\'' + userInfo.nickname + '\'</h5>',
						confirm: '确认',
						cancel: '更换绑定',
						// popClassStr: 'popup-deep-wrap',
						cancelCallback: function cancelCallback() {
							props.directTo('/bind-wchat');
						}
					});
				}, 10);
			} else {
				setTimeout(function () {
					_this3.props.directTo('/bind-wchat');
				}, 10);
			}
		}
	}, {
		key: 'wchatRebindJudg',
		value: function wchatRebindJudg() {
			var that = this;
			var data = {
				method: 'POST',
				querys: { time: Date.now() }
			};
			// 点击微信绑定logevent
			(0, _util.logEvent)('bind_wchat');

			function rebindInfoFiter(rebindInfo) {
				if (rebindInfo.code >= 200 && rebindInfo.code < 300) {
					that.bindWchatJudge();
				}
				return rebindInfo;
			}
			this.props.fetchList('/account/bind/wechat/rebind/', data, 'rebindInfo', rebindInfoFiter);
		}
	}, {
		key: 'enterInvite',
		value: function enterInvite() {
			(0, _util.logEvent)('inviteTab&tab=2a');
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var userInfo = props.userInfo;

			var classStr = void 0;
			if (userInfo.user_id) {
				if (props.userInfo.headimgurl) {
					classStr = 'purse-top-iconround purse-top-icon';
				} else {
					props.userInfo.headimgurl = 'http://cc-cdn.dianjoy.com/91atm/images/user-icon.png';
					classStr = 'purse-top-icon';
				}
			}

			var inviteLink = _config.rootPath + '/invite';
			var purseTopInfoEle =
			/* 钱包头部用户信息 */
			_react2.default.createElement(
				'div',
				{ className: 'purse-top-info' },
				_react2.default.createElement(
					'div',
					{ className: classStr },
					_react2.default.createElement('img', { alt: '', src: userInfo.headimgurl })
				),
				userInfo.user_id ? _react2.default.createElement(
					'div',
					{ className: 'purse-top-uid' },
					'团号：',
					userInfo.user_id
				) : '',
				_react2.default.createElement(
					_reactRouter.Link,
					{ className: 'purse-top-ecode', to: inviteLink },
					_react2.default.createElement(
						'div',
						{ className: 'ecode-icon' },
						_react2.default.createElement('img', { alt: '', src: 'http://cc-cdn.dianjoy.com/91atm/images/er-code.png' })
					),
					_react2.default.createElement(
						'div',
						{ className: 'ecode-info' },
						'邀请',
						_react2.default.createElement(
							'p',
							null,
							'二维码'
						)
					)
				)
			);

			var taskPath = _config.rootPath + '/task-list';
			var listPath = _config.rootPath + '/invite-list';
			var rankPath = _config.rootPath + '/rank';
			var shareInviteLink = _config.rootPath + '/invite?tab=1';
			var purseTopNavEle =
			/* 钱包头部nav */
			_react2.default.createElement(
				'ul',
				{ className: 'purse-top-nav' },
				_react2.default.createElement(
					'li',
					null,
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: taskPath },
						'试玩记录'
					)
				),
				_react2.default.createElement(
					'li',
					null,
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: listPath },
						'邀请记录'
					)
				),
				_react2.default.createElement(
					'li',
					null,
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: rankPath },
						'排行榜'
					)
				)
			);

			var purseIncomeEle =
			/* 今日收入 */
			_react2.default.createElement(
				'div',
				{ className: 'purse-income' },
				_react2.default.createElement(
					'h5',
					null,
					'今日收入',
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: shareInviteLink, onClick: this.enterInvite, className: 'toshare-enter' },
						_react2.default.createElement(
							'span',
							{ className: 'text' },
							'去晒单'
						),
						_react2.default.createElement('span', { className: 'icon-next' })
					)
				),
				_react2.default.createElement(
					'h4',
					{ className: 'progress' },
					(userInfo.today_income / 100).toFixed(2),
					'元'
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'span',
						null,
						'账户余额: ',
						(userInfo.balance / 100).toFixed(2),
						'元'
					),
					_react2.default.createElement(
						'span',
						null,
						'总计: ',
						(userInfo.total / 100).toFixed(2),
						'元'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'purse-operate' },
					_react2.default.createElement(
						'a',
						{ className: 'btn-reverse', onClick: this.getAccount },
						'我要提现'
					),
					_react2.default.createElement(
						'a',
						{ className: 'btn', onClick: this.enterConvertList },
						'提现记录'
					)
				)
			);

			var bindWchatEle = _react2.default.createElement(
				'a',
				{ href: 'javascript:;', className: 'purse-item purse-wchat', onClick: this.wchatRebindJudg },
				'微信绑定',
				_react2.default.createElement('span', { className: 'icon-next' })
			);

			return _react2.default.createElement(
				'div',
				{ className: 'purse' },
				_react2.default.createElement(
					'div',
					{ className: 'purse-top' },
					purseTopInfoEle,
					purseTopNavEle
				),
				_react2.default.createElement(
					'div',
					{ className: 'purse-content-wrap' },
					purseIncomeEle,
					_react2.default.createElement(
						'div',
						{ className: 'purse-feature' },
						_react2.default.createElement(
							'div',
							{ className: 'purse-row' },
							bindWchatEle,
							_react2.default.createElement(
								'a',
								{ href: 'javascript:;', className: 'purse-item purse-bindphone', onClick: this.bindPhoneJudge },
								'绑定手机',
								_react2.default.createElement('span', { className: 'icon-next' })
							),
							props.purseLinkItems.map(function (item, index) {
								return _react2.default.createElement(
									_reactRouter.Link,
									{ key: index, className: 'purse-item ' + item.classStr, to: item.pathName },
									item.pathNameDesc,
									_react2.default.createElement('span', { className: 'icon-next' }),
									index === 1 && userInfo.unread_num ? _react2.default.createElement('span', { className: 'unread-mark' }) : ''
								);
							})
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'logo-shadow' },
					_react2.default.createElement('img', { alt: '', src: 'http://cc-cdn.dianjoy.com/91atm/images/logo-shadow.png' })
				)
			);
		}
	}]);
	return Home;
}(_react2.default.Component);

Home.propTypes = {
	userInfo: _react.PropTypes.object.isRequired,
	rebindInfo: _react.PropTypes.object.isRequired,
	purseLinkItems: _react.PropTypes.array.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	fetchList: _react.PropTypes.func.isRequired
};
exports.default = Home;

/***/ },

/***/ 512:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(57);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(55);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(56);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(59);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(58);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _home = __webpack_require__(511);

var _home2 = _interopRequireDefault(_home);

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HomeEle = function (_React$Component) {
	(0, _inherits3.default)(HomeEle, _React$Component);

	function HomeEle() {
		(0, _classCallCheck3.default)(this, HomeEle);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HomeEle).apply(this, arguments));
	}

	(0, _createClass3.default)(HomeEle, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var props = this.props;
			if (this.props.modalState) {
				this.props.modalClose();
			}

			function userInfoFilter(userInfo) {
				_storage2.default.local.set('unread_num', userInfo.unread_num);
				if (userInfo.is_bind === 1) {
					_storage2.default.local.set('hasBindWchat', true);
					_storage2.default.local.set('nickname', userInfo.nickname);
				}
				return userInfo;
			}
			var user = _storage2.default.local.get('user') || '';
			// 没有 user弹框提醒，跳转首页
			if (!user) {
				props.modalOpen({
					content: '无法获取信息，请稍后再试。',
					confirm: '确认',
					confirmCallback: function confirmCallback() {
						props.directTo('/');
					}
				});
				return;
			}
			props.fetchList('/account/' + user + '/', { querys: {
					time: Date.now()
				} }, 'userInfo', userInfoFilter);
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var purseLinkItems = [{
				pathName: _config.rootPath + '/check-account',
				classStr: 'purse-account',
				pathNameDesc: '切换账号'
			}, {
				pathName: _config.rootPath + '/notify',
				classStr: 'purse-notify',
				pathNameDesc: '消息中心'
			}, {
				pathName: _config.rootPath + '/about',
				classStr: 'purse-about',
				pathNameDesc: '关于我们'
			}];
			var popupEle = props.modalState ? _react2.default.createElement(_popup2.default, {
				modal: props.modal,
				modalClose: props.modalClose,
				directTo: props.directTo
			}) : '';
			return _react2.default.createElement(
				'div',
				{ className: 'container' },
				_react2.default.createElement(_home2.default, {
					fetchList: props.fetchList,
					userInfo: props.userInfo,
					purseLinkItems: purseLinkItems,
					modalOpen: props.modalOpen,
					directTo: props.directTo,
					rebindInfo: props.rebindInfo
				}),
				popupEle
			);
		}
	}]);
	return HomeEle;
}(_react2.default.Component);

HomeEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	userInfo: _react.PropTypes.object.isRequired,
	rebindInfo: _react.PropTypes.object.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	cutDown: _react.PropTypes.func.isRequired
};
exports.default = HomeEle;

/***/ },

/***/ 513:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _components = __webpack_require__(512);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	},
	modalClose: function modalClose() {
		return (0, _actions.modalClose)();
	},
	modalOpen: function modalOpen(payload) {
		return (0, _actions.modalOpen)(payload);
	},
	directTo: function directTo(url) {
		return (0, _actions.directTo)(url);
	},
	cutDown: function cutDown(cutDownInfo) {
		return (0, _actions.cutDown)(cutDownInfo);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		userInfo: state.home.userInfo,
		modal: state.home.modal,
		modalState: state.home.modalState,
		rebindInfo: state.home.rebindInfo
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_components2.default);

/***/ },

/***/ 514:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = homeReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	userInfo: {
		total: 0,
		balance: 0,
		ad_count: 0,
		ad_money: 0,
		invite_money: 0,
		ranking: '',
		today_income: 0,
		user_id: 0,
		unread_num: 0
	},
	modal: {},
	modalState: false,
	rebindInfo: {}
};

function homeReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/home') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".account-rem {\n  text-indent: 1rem !important; }\n\n.purse {\n  padding-top: 0;\n  background: #f4f4f4;\n  min-height: 40.67rem; }\n\n.purse-top {\n  background: -webkit-gradient(linear, left top, right top, from(#03baff), to(#00daff));\n  background: -webkit-linear-gradient(left, #03baff, #00daff);\n  background: linear-gradient(to right, #03baff, #00daff);\n  padding-bottom: .917rem;\n  font-size: 1.083rem;\n  color: #fff; }\n  .purse-top .purse-top-info {\n    position: relative;\n    padding: 0 1.25rem 1.167rem 1.083rem;\n    overflow: hidden;\n    height: 3.747rem; }\n    .purse-top .purse-top-info .purse-top-icon {\n      width: 4.83rem;\n      height: 5.17rem;\n      float: left;\n      overflow: hidden; }\n      .purse-top .purse-top-info .purse-top-icon img {\n        width: 100%;\n        height: 100%; }\n    .purse-top .purse-top-info .purse-top-iconround {\n      width: 3.33rem;\n      height: 3.33rem;\n      overflow: hidden;\n      -webkit-border-radius: 100%;\n              border-radius: 100%;\n      padding-top: .417rem; }\n      .purse-top .purse-top-info .purse-top-iconround img {\n        width: 100%;\n        height: 100%;\n        -webkit-border-radius: 100%;\n                border-radius: 100%; }\n\n.purse-top-iconround {\n  width: 3.33rem;\n  height: 3.33rem;\n  overflow: hidden;\n  -webkit-border-radius: 100%;\n          border-radius: 100%;\n  padding-top: .417rem; }\n  .purse-top-iconround img {\n    width: 3.33rem;\n    height: 3.33rem;\n    -webkit-border-radius: 100%;\n            border-radius: 100%; }\n\n.purse-top-uid {\n  padding-left: .917rem;\n  padding-top: 1.5rem;\n  float: left; }\n  .purse-top-uid p {\n    padding-top: .5rem; }\n\n.purse-top-ecode {\n  margin-top: .33rem;\n  height: 3rem;\n  font-size: 1.1rem;\n  padding: .417rem .417rem 0;\n  -webkit-border-radius: .4rem;\n          border-radius: .4rem;\n  overflow: hidden;\n  position: absolute;\n  right: 1.25rem;\n  top: 0;\n  border: 2px solid rgba(191, 231, 255, 0.5); }\n  .purse-top-ecode .ecode-icon {\n    float: left;\n    width: 2.5rem;\n    height: 2.5rem;\n    vertical-align: top; }\n  .purse-top-ecode .ecode-info {\n    float: left;\n    padding-left: .5rem;\n    -webkit-transform: translateY(0.417rem);\n            transform: translateY(0.417rem); }\n\n.purse-top-nav {\n  width: 100%;\n  overflow: hidden; }\n  .purse-top-nav li {\n    float: left;\n    width: 33.3333%;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    line-height: 1.5rem;\n    text-align: center;\n    border-right: 1px solid rgba(255, 255, 255, 0.5); }\n    .purse-top-nav li:last-child {\n      border-right: none 0; }\n\n.purse-content-wrap {\n  background: #f4f4f4;\n  padding: .667rem; }\n  .purse-content-wrap .purse-income {\n    background: #fff; }\n    .purse-content-wrap .purse-income h5 {\n      position: relative;\n      font-size: 1.083rem;\n      line-height: 2.83rem;\n      color: #333;\n      border-bottom: 1px dashed #f4f5f6;\n      padding-left: .83rem;\n      font-weight: normal; }\n    .purse-content-wrap .purse-income h4 {\n      text-align: center;\n      font-size: 2.917rem;\n      line-height: 5.5rem;\n      font-weight: normal;\n      color: #ff733d; }\n    .purse-content-wrap .purse-income p {\n      padding: .791rem .83rem;\n      color: #999;\n      font-size: .917rem;\n      overflow: hidden;\n      border-bottom: 1px solid #f4f5f6; }\n      .purse-content-wrap .purse-income p span {\n        float: left; }\n      .purse-content-wrap .purse-income p span:last-child {\n        float: right; }\n    .purse-content-wrap .purse-income .purse-operate {\n      border-bottom: none;\n      text-align: center;\n      padding: 1rem .83rem; }\n      .purse-content-wrap .purse-income .purse-operate a {\n        -webkit-box-sizing: border-box;\n                box-sizing: border-box;\n        display: inline-block;\n        width: 47%;\n        font-size: 1.167rem;\n        line-height: 2.667rem;\n        -webkit-border-radius: 2rem;\n                border-radius: 2rem; }\n        .purse-content-wrap .purse-income .purse-operate a:first-child {\n          margin-right: 6%; }\n\n.purse-feature {\n  margin-top: .667rem;\n  width: 100%; }\n  .purse-feature .purse-row {\n    background: #f4f4f4;\n    height: 8rem; }\n    .purse-feature .purse-row .purse-item {\n      float: left;\n      width: 48.75%;\n      margin-bottom: .667rem;\n      -webkit-box-sizing: border-box;\n              box-sizing: border-box;\n      line-height: 3.33rem;\n      height: 3.33rem;\n      padding-left: 3.417rem;\n      position: relative;\n      font-size: 1.083rem;\n      color: #666; }\n      .purse-feature .purse-row .purse-item span {\n        position: absolute;\n        right: .917rem;\n        top: 1.16rem; }\n      .purse-feature .purse-row .purse-item .unread-mark {\n        right: 3.8rem;\n        top: 1rem; }\n      .purse-feature .purse-row .purse-item:nth-child(odd) {\n        margin-right: 2.5%; }\n\n.purse-wchat {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/wchat-dark.png\") no-repeat 0.83rem center #fff;\n  background-size: 16%; }\n\n.purse-bindphone {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/bind-phone.png\") no-repeat 0.83rem center #fff;\n  background-size: 16%; }\n\n.purse-account {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/account.png\") no-repeat 0.83rem center #fff;\n  background-size: 16%; }\n\n.purse-notify {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/notify.png\") no-repeat 0.83rem center #fff;\n  background-size: 16%; }\n\n.purse-about {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/about.png\") no-repeat 0.83rem center #fff;\n  background-size: 16%; }\n\n.toshare-enter {\n  position: absolute;\n  overflow: hidden;\n  right: 0;\n  top: .58rem;\n  height: 1.66rem;\n  width: 5.66rem;\n  line-height: 1.66rem;\n  background-color: #ff723e;\n  -webkit-border-radius: 0.83rem 0 0 0.83rem;\n          border-radius: 0.83rem 0 0 0.83rem;\n  font-size: .9rem;\n  color: #fff; }\n  .toshare-enter .text {\n    float: right;\n    margin-right: 1.6rem; }\n  .toshare-enter .icon-next {\n    width: .5rem;\n    height: .5rem;\n    border-color: #fff !important;\n    color: #fff;\n    top: .5rem; }\n", ""]);

// exports


/***/ }

});