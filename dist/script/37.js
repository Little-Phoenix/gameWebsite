webpackJsonp([37],{

/***/ 430:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _bindWchatContainer = __webpack_require__(496);

var _bindWchatContainer2 = _interopRequireDefault(_bindWchatContainer);

var _bindWchat = __webpack_require__(497);

var _bindWchat2 = _interopRequireDefault(_bindWchat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'bindWchat', reducer: _bindWchat2.default });
	cb(null, _bindWchatContainer2.default);
}; // import { injectReducer } from '../../reducers'
//
// export default (store) => ({
// 	path: 'bind-phone',
// 	getComponent(nextState, cb) {
// 		Promise.all([
// 			System.import('./containers/bindPhoneContainer'),
// 			System.import('./modules/bindPhone')
// 		]).then((modules) => {
// 			const bindPhone = modules[0].default
// 			const reducer = modules[1].default
// 			injectReducer(store, { key: 'bindPhone', reducer })
// 			cb(null, bindPhone)
// 		})
// 	}
// })

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

/***/ 495:
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

var _util = __webpack_require__(86);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

__webpack_require__(577);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BindWchatEle = function (_React$Component) {
	(0, _inherits3.default)(BindWchatEle, _React$Component);


	// static defaultProps = {
	// 	vcodeVerifyStatus: 0
	// }

	function BindWchatEle(props) {
		(0, _classCallCheck3.default)(this, BindWchatEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BindWchatEle).call(this, props));

		_this.backPage = _storage2.default.local.get('backPage') || 'home';
		_this.bindWchatCallback = _this.bindWchatCallback.bind(_this);
		_this.wchatVcodeSubmit = _this.wchatVcodeSubmit.bind(_this);
		_this.handleChange = _this.handleChange.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(BindWchatEle, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var that = this;
			(0, _util.logEvent)('bindwchat_page');
			function resetVcodeStatus() {
				that.props.valChange(0, 'vcodeVerifyStatus');
				that.props.valChange(false, 'modalState');
				that.props.valChange({}, 'modal');
			}
			setTimeout(resetVcodeStatus, 10);
		}
	}, {
		key: 'bindWchatCallback',
		value: function bindWchatCallback(bindWchatResult) {
			var _this2 = this;

			var props = this.props;
			var that = this;
			if (bindWchatResult.code >= 200 && bindWchatResult.code <= 300) {
				if (bindWchatResult.nickname) {
					// 绑定成功
					_storage2.default.local.set('hasBindWchat', true);
					_storage2.default.local.set('nickname', bindWchatResult.nickname);
					setTimeout(function () {
						return _this2.props.modalOpen({
							content: '<h5>您已经成功绑定微信：' + bindWchatResult.nickname + '</h5>',
							confirm: '确认',
							cancel: '更换绑定',
							confirmCallback: function confirmCallback() {
								props.directTo('/' + that.backPage);
							},
							cancelCallback: function cancelCallback() {
								location.reload();
							}
						});
					}, 10);

					setTimeout(function () {
						return props.valChange(true, 'hasBindWchat');
					}, 50);
				}
			} else {
				setTimeout(function () {
					return props.valChange(-1, 'vcodeVerifyStatus');
				}, 10);
			}
			return bindWchatResult;
		}
	}, {
		key: 'wchatVcodeSubmit',
		value: function wchatVcodeSubmit() {
			var numberR = /^\d{6}$/;
			var wchatVcode = this.refs.wchatVcode.value;

			if (numberR.test(wchatVcode)) {
				// 验证码输入正确
				var methodInfo = 'POST'; // 初次绑定
				if (this.props.hasBindWchat) {
					//  二次绑定
					methodInfo = 'PUT';
				}
				var data = { method: methodInfo,
					params: { inv_code: wchatVcode },
					querys: { time: Date.now() }
				};
				this.props.fetchList('/account/bind/wechat/check/', data, 'bindWchatResult', this.bindWchatCallback);
			} else {
				// 验证码输入错误
				(0, _util.toast)('请正确输入验证码');
			}
		}
	}, {
		key: 'handleChange',
		value: function handleChange() {
			var wchatVcode = this.refs.wchatVcode.value;
			var numberR = /^\d{6}$/;
			if (numberR.test(wchatVcode)) {
				this.props.valChange(1, 'vcodeVerifyStatus');
				this.wchatVcodeSubmit();
			} else {
				this.props.valChange(0, 'vcodeVerifyStatus');
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;

			var popupEle = this.props.modalState ? _react2.default.createElement(_popup2.default, {
				modal: this.props.modal,
				modalClose: this.props.modalClose,
				directTo: this.props.directTo
			}) : '';

			var wchatVerifyEle = void 0;
			if (props.vcodeVerifyStatus) {
				wchatVerifyEle = _react2.default.createElement('span', { className: !~props.vcodeVerifyStatus ? 'wchat-verify-wrong' : 'wchat-verify-right' });
			}

			return _react2.default.createElement(
				'div',
				{ className: 'main bind-wchat-page container' },
				_react2.default.createElement(
					'div',
					{ className: 'safe-rem' },
					_react2.default.createElement('span', { className: 'safe-icon' }),
					'为了您的账户安全，请先进行微信号绑定。'
				),
				_react2.default.createElement(
					'ul',
					null,
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement('span', { className: 'orange-logo' }),
						_react2.default.createElement(
							'div',
							{ className: 'list-wrap' },
							_react2.default.createElement(
								'div',
								{ className: 'white-tran-left-wrap' },
								_react2.default.createElement('span', { className: 'white-tran-left' })
							),
							_react2.default.createElement(
								'p',
								null,
								'1. 长按并储存下方二维码，打开“微信”扫一扫，识别该二维码，找到公众号（或搜',
								_react2.default.createElement(
									'span',
									null,
									'shiwanlife'
								),
								'），点击关注。'
							),
							_react2.default.createElement(
								'div',
								{ className: 'public-vcode' },
								_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/public-code.jpg', alt: '' }),
								_react2.default.createElement(
									'p',
									null,
									'shiwanlife'
								)
							)
						)
					),
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement('span', { className: 'orange-logo' }),
						_react2.default.createElement(
							'div',
							{ className: 'list-wrap' },
							_react2.default.createElement(
								'div',
								{ className: 'white-tran-left-wrap' },
								_react2.default.createElement('span', { className: 'white-tran-left' })
							),
							_react2.default.createElement(
								'p',
								null,
								'2. 在公众号中，点击“我要绑定”，获取验证码。'
							)
						)
					),
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement('span', { className: 'orange-logo' }),
						_react2.default.createElement(
							'div',
							{ className: 'list-wrap' },
							_react2.default.createElement(
								'div',
								{ className: 'white-tran-left-wrap' },
								_react2.default.createElement('span', { className: 'white-tran-left' })
							),
							_react2.default.createElement(
								'p',
								null,
								'3. 输入从公众号获取到的验证码。'
							),
							_react2.default.createElement(
								'div',
								{ className: 'wchat-vcode' },
								_react2.default.createElement('input', { type: 'number', placeholder: '验证码输入', ref: 'wchatVcode', onChange: this.handleChange }),
								_react2.default.createElement(
									'span',
									{ onClick: this.wchatVcodeSubmit, className: 'wchat-vcode-submit' },
									'提交'
								),
								wchatVerifyEle
							)
						)
					)
				),
				popupEle
			);
		}
	}]);
	return BindWchatEle;
}(_react2.default.Component);
// import Loading from '../../../components/loading'
// import { rootPath } from '../../../routes/config'


BindWchatEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	vcodeVerifyStatus: _react.PropTypes.number.isRequired,
	hasBindWchat: _react.PropTypes.bool.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	bindWchatResult: _react.PropTypes.object.isRequired
};
exports.default = BindWchatEle;

/***/ },

/***/ 496:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _components = __webpack_require__(495);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	},
	directTo: function directTo(url) {
		return (0, _actions.directTo)(url);
	},
	valChange: function valChange(val, key) {
		return (0, _actions.valChange)(val, key);
	},
	modalOpen: function modalOpen(payload) {
		return (0, _actions.modalOpen)(payload);
	},
	modalClose: function modalClose() {
		return (0, _actions.modalClose)();
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		// isLoading: state.bindWchat.isLoading,
		vcodeVerifyStatus: state.bindWchat.vcodeVerifyStatus, // 区分验证码是否正确
		hasBindWchat: state.bindWchat.hasBindWchat, // 区分知否绑定过微信
		modal: state.bindWchat.modal,
		modalState: state.bindWchat.modalState,
		bindWchatResult: state.bindWchat.bindWchatResult
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_components2.default);

/***/ },

/***/ 497:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = bindWchatReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	// isLoading: false,
	vcodeVerifyStatus: 0,
	hasBindWchat: JSON.parse(_storage2.default.local.get('hasBindWchat')) || false,
	modal: {},
	modalState: false,
	bindWchatResult: {}
};

function bindWchatReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (!~[_config.rootPath + '/bind-wchat'].indexOf(location.pathname)) return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 559:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".safe-rem {\n  color: #007aff;\n  line-height: 3.33rem;\n  padding-left: 3rem;\n  position: relative; }\n  .safe-rem .safe-icon {\n    width: 2rem;\n    height: 2rem;\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/safe.png\");\n    background-size: contain;\n    position: absolute;\n    left: .83rem;\n    top: .62rem; }\n\n.bind-wchat-page {\n  font-size: 1.083rem;\n  color: #333; }\n  .bind-wchat-page ul {\n    padding: 0 2rem 0 .83rem; }\n    .bind-wchat-page ul li:first-child .list-wrap {\n      padding-bottom: .5rem; }\n    .bind-wchat-page ul li {\n      position: relative;\n      display: block;\n      padding-left: 4rem;\n      padding-bottom: 1.667rem; }\n      .bind-wchat-page ul li .orange-logo {\n        background: url(\"http://cc-cdn.dianjoy.com/91atm/images/orange-log.png\");\n        background-size: contain;\n        width: 3rem;\n        height: 3.33rem;\n        position: absolute;\n        left: 0;\n        top: 0; }\n      .bind-wchat-page ul li .list-wrap {\n        padding: .75rem;\n        border: 1px solid #e0e0e0;\n        -webkit-border-radius: .33rem;\n                border-radius: .33rem;\n        background: #fff;\n        -webkit-box-sizing: border-box;\n                box-sizing: border-box; }\n        .bind-wchat-page ul li .list-wrap p {\n          line-height: 1.6rem; }\n          .bind-wchat-page ul li .list-wrap p span {\n            color: #007aff; }\n      .bind-wchat-page ul li .public-vcode {\n        text-align: center;\n        padding-top: .2rem; }\n        .bind-wchat-page ul li .public-vcode img {\n          width: 46%;\n          margin: 0 auto;\n          vertical-align: top; }\n        .bind-wchat-page ul li .public-vcode p {\n          line-height: 1.5rem; }\n          .bind-wchat-page ul li .public-vcode p span {\n            font-size: 1rem;\n            color: #333; }\n\n.white-tran-left-wrap {\n  position: absolute;\n  left: 2.8rem;\n  top: 1rem;\n  width: 0;\n  height: 0;\n  font-size: 0;\n  line-height: 0;\n  border-color: transparent #e0e0e0 transparent transparent;\n  border-style: solid;\n  border-width: .6417rem; }\n  .white-tran-left-wrap .white-tran-left {\n    position: absolute;\n    left: -.5rem;\n    top: -.6rem;\n    width: 0;\n    height: 0;\n    border-width: .6rem;\n    border-style: solid;\n    border-color: transparent #fff transparent transparent;\n    border-style: solid; }\n\n.wchat-vcode {\n  padding-top: 1rem;\n  font-size: 1.067rem;\n  position: relative; }\n  .wchat-vcode input {\n    width: 10rem;\n    background-color: #ededed;\n    line-height: 1.067rem;\n    height: 1.067rem;\n    padding: .675rem .5rem .675rem 1.067rem;\n    -webkit-border-radius: 1.2rem;\n            border-radius: 1.2rem;\n    font-size: 1.067rem;\n    color: #333; }\n  .wchat-vcode input::-webkit-input-placeholder {\n    color: rgba(204, 204, 204, 0.2); }\n  .wchat-vcode input::-moz-placeholder {\n    color: rgba(204, 204, 204, 0.2); }\n  .wchat-vcode input:-ms-input-placeholder {\n    color: rgba(204, 204, 204, 0.2); }\n  .wchat-vcode input::placeholder {\n    color: rgba(204, 204, 204, 0.2); }\n  .wchat-vcode input::-webkit-placeholder {\n    color: rgba(204, 204, 204, 0.2); }\n  .wchat-vcode .wchat-vcode-submit {\n    display: inline-block;\n    background: rgba(0, 122, 255, 0.8);\n    color: #fff;\n    width: 6rem;\n    text-align: center;\n    height: 2.417rem;\n    line-height: 2.417rem;\n    -webkit-border-radius: 1.2rem;\n            border-radius: 1.2rem;\n    margin-left: .583rem; }\n  .wchat-vcode .wchat-verify-right, .wchat-vcode .wchat-verify-wrong {\n    width: 1.5rem;\n    height: 1.5rem;\n    position: absolute;\n    right: 7rem;\n    bottom: .6rem; }\n  .wchat-vcode .wchat-verify-right {\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/verify-ok.png\");\n    background-size: contain; }\n  .wchat-vcode .wchat-verify-wrong {\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/verify-error.png\");\n    background-size: contain; }\n", ""]);

// exports


/***/ },

/***/ 577:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(559);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./bindWchat.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./bindWchat.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});