webpackJsonp([28],{

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _bindPhoneContainer = __webpack_require__(493);

var _bindPhoneContainer2 = _interopRequireDefault(_bindPhoneContainer);

var _bindPhone = __webpack_require__(494);

var _bindPhone2 = _interopRequireDefault(_bindPhone);

__webpack_require__(576);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { injectReducer } from '../../reducers'
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

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'bindPhone', reducer: _bindPhone2.default });
	cb(null, _bindPhoneContainer2.default);
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

/***/ 483:
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

var _account = __webpack_require__(575);

var _account2 = _interopRequireDefault(_account);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Account = function (_React$Component) {
	(0, _inherits3.default)(Account, _React$Component);

	function Account(props) {
		(0, _classCallCheck3.default)(this, Account);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Account).call(this, props));

		_this.handlePhoneChange = _this.handlePhoneChange.bind(_this);
		_this.handleCodeChange = _this.handleCodeChange.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(Account, [{
		key: 'handlePhoneChange',
		value: function handlePhoneChange() {
			var telR = /^1[3|4|5|7|8][0-9]\d{8}$/;
			var phone = this.refs.phone_ref.value;
			if (telR.test(phone)) {
				if (!this.props.codeInfo.hasSent) {
					this.props.sendCode(phone);
				}
			} else {
				this.props.phoneInputFormat();
				(0, _util.toast)('手机号格式不正确');
			}
		}
	}, {
		key: 'handleCodeChange',
		value: function handleCodeChange() {
			var phone = this.refs.phone_ref.value;
			var code = this.refs.code_ref.value;
			var codeR = /\S/;
			var telR = /^1[3|4|5|7|8][0-9]\d{8}$/;

			if (!telR.test(phone)) {
				this.props.phoneInputFormat();
				return (0, _util.toast)('手机号格式不正确');
			}

			if (this.props.hasSent) {
				if (codeR.test(code)) {
					this.props.codeSubmit(phone, code);
				} else {
					(0, _util.toast)('验证码未填写');
				}
			} else {
				(0, _util.toast)('请先获取验证码');
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var sendCodeClass = props.codeInfo.isCounting && props.codeInfo.delay ? 'send-code btn-reverse send-code-already' : 'send-code btn-reverse';
			var codeInfoEle = this.props.routerID === 'bind-phone' ? _react2.default.createElement(
				'div',
				{ className: 'verify-note' },
				_react2.default.createElement(
					'p',
					null,
					'绑定手机后再也不担心账号丢失，随时可以通过'
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'a',
						{ href: 'javascript:;', className: 'rem-info' },
						'我的钱包—>切换账号'
					),
					'找回'
				)
			) : _react2.default.createElement(
				'div',
				{ className: 'verify-note' },
				_react2.default.createElement(
					'p',
					null,
					'请注意：切换账号后，现有未绑定手机的账号'
				),
				_react2.default.createElement(
					'p',
					null,
					' 将被清空，无法找回 '
				)
			);

			// const btnConnectDesc = this.props.codeInfo.hasSent ?
			// `${this.props.codeInfo.btnTitle}(${toDou(this.props.codeInfo.delay)})`
			// : this.props.codeInfo.btnTitle

			return _react2.default.createElement(
				'div',
				{ className: 'account-component-wrap' },
				codeInfoEle,
				_react2.default.createElement(
					'ul',
					{ className: 'verify-data' },
					_react2.default.createElement(
						'li',
						{ className: props.phoneInputError ? 'valilate-error' : '' },
						_react2.default.createElement(
							'span',
							null,
							'手机号'
						),
						_react2.default.createElement('input', {
							ref: 'phone_ref',
							type: 'number',
							name: 'tel',
							placeholder: '请输入手机号码',
							onFocus: props.phoneInputError && props.phoneInputFormat
						})
					),
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement(
							'span',
							null,
							'验证码'
						),
						_react2.default.createElement('input', { ref: 'code_ref', type: 'text', name: 'code' }),
						_react2.default.createElement(
							'div',
							{ className: sendCodeClass, onClick: this.handlePhoneChange },
							props.btnTitle
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'btn-reverse confirm-btn', onClick: this.handleCodeChange },
					'提交'
				),
				_react2.default.createElement(
					'div',
					{ className: 'rem-note' },
					_react2.default.createElement(
						'div',
						{ className: 'rem-note-title' },
						'注意：'
					),
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								null,
								'.'
							),
							'因运营商问题，如无法收取验证码，请更换手机后重新绑定。'
						)
					)
				)
			);
		}
	}]);
	return Account;
}(_react2.default.Component);

Account.propTypes = {
	codeSubmit: _react.PropTypes.func.isRequired,
	sendCode: _react.PropTypes.func.isRequired,
	codeInfo: _react.PropTypes.object.isRequired,
	routerID: _react.PropTypes.string,
	phoneInputError: _react.PropTypes.bool.isRequired,
	phoneInputFormat: _react.PropTypes.func.isRequired,
	btnTitle: _react.PropTypes.string.isRequired,
	hasSent: _react.PropTypes.bool
};
exports.default = Account;

/***/ },

/***/ 484:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _account = __webpack_require__(483);

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _account2.default;

/***/ },

/***/ 485:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loading = __webpack_require__(486);

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _loading2.default;

/***/ },

/***/ 486:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loading = function Loading() {
	return _react2.default.createElement('div', { className: 'loader' });
};

// class Loading extends React.Component{
// 	static propTypes = {
// 		loadingStatus: PropTypes.bool.isRequired
// 	}
//
// 	render() {
// 		return (
// 			<div className='loader'></div>
// 		)
// 	}
// }

exports.default = Loading;

/***/ },

/***/ 492:
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

var _account = __webpack_require__(484);

var _account2 = _interopRequireDefault(_account);

var _loading = __webpack_require__(485);

var _loading2 = _interopRequireDefault(_loading);

var _config = __webpack_require__(46);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BindPhoneEle = function (_React$Component) {
	(0, _inherits3.default)(BindPhoneEle, _React$Component);

	function BindPhoneEle(props) {
		(0, _classCallCheck3.default)(this, BindPhoneEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BindPhoneEle).call(this, props));

		_this.countDown = _this.countDown.bind(_this);
		_this.resetCodeInfo = _this.resetCodeInfo.bind(_this);
		_this.resetSubmitInfo = _this.resetSubmitInfo.bind(_this);
		_this.hasSent = false;
		_this.routerID = '';
		_this.commitApi = '';
		_this.timer = null;
		_this.backPage = _storage2.default.local.get('backPage') || 'home';
		_this.udid = _storage2.default.local.get('udid') || '';
		return _this;
	}

	(0, _createClass3.default)(BindPhoneEle, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var that = this;
			that.hasSent = false;
			if (location.pathname === _config.rootPath + '/bind-phone') {
				that.routerID = 'bind-phone';
				that.commitApi = '/account/bind/phone/';
			} else {
				that.routerID = 'check-account';
				that.commitApi = '/account/phone/token/';
			}
			// reset countDown
			that.props.valChange({
				code: 0,
				isCounting: false,
				delay: 59
			}, 'codeInfo');
			function resetLoading() {
				that.props.valChange(false, 'isLoading');
			}
			// TODO: there should has a state reset function
			// if isLoading true
			if (that.props.isLoading) {
				setTimeout(resetLoading, 10);
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var that = this;
			var props = that.props;
			var nextCode = nextProps.codeInfo;
			var nextSubmit = nextProps.submitInfo;
			var propsCode = props.codeInfo;
			// is counting
			if (nextCode.isCounting) {
				if (propsCode.delay !== nextCode.delay) {
					clearTimeout(that.timer);
					if (nextCode.delay > 0) {
						that.timer = setTimeout(that.countDown, 1000);
					} else if (nextCode.delay <= 0) {
						// 倒计时完成
						setTimeout(that.resetCodeInfo, 1000);
						that.timer = null;
					}
				}
			}
			// 验证码发送成功
			if (nextCode.code === 200 && nextCode.isCounting === true && nextCode.delay === 59) {
				setTimeout(that.countDown, 1000);
				return;
			}
			if (this.hasSent && nextSubmit.msg) {
				(0, _util.toast)(nextSubmit.msg);
				setTimeout(this.resetSubmitInfo, 2000);
				if (this.routerID === 'check-account') {
					if (nextSubmit.user && nextSubmit.token) {
						localStorage.setItem('user', nextSubmit.user);
						localStorage.setItem('token', nextSubmit.token);
						(0, _util.toast)('正在跳转...');
						setTimeout(function () {
							that.props.directTo('/home');
						}, 2000);
					}
				} else {
					if (nextSubmit.msg === '绑定成功') {
						(0, _util.toast)('正在跳转...');
						setTimeout(function () {
							that.props.directTo('/' + that.backPage);
						}, 2000);
					}
				}
			}
		}
	}, {
		key: 'countDown',
		value: function countDown() {
			this.props.valChange({
				code: 200,
				isCounting: true,
				delay: this.props.codeInfo.delay - 1
			}, 'codeInfo');
		}
	}, {
		key: 'resetCodeInfo',
		value: function resetCodeInfo() {
			this.props.valChange({
				code: 0,
				isCounting: false,
				delay: 59
			}, 'codeInfo');
		}
	}, {
		key: 'resetSubmitInfo',
		value: function resetSubmitInfo() {
			this.props.valChange({ msg: '' }, 'submitInfo');
		}
	}, {
		key: 'sendCode',
		value: function sendCode(phone) {
			var that = this;
			if (that.props.isLoading) return;
			if (that.props.codeInfo.isCounting && that.props.codeInfo.delay < 59) return;
			function codeFilter(data) {
				that.hasSent = true;
				var result = {
					code: 0,
					isCounting: false,
					delay: 59
				};
				if (data.code === 200) {
					result = {
						code: 200,
						isCounting: true,
						delay: 59
					};
				}
				return result;
			}
			// 发送验证码
			this.props.fetchList('/firmware/send/vcode/', { querys: { phone: phone } }, 'codeInfo', codeFilter);
		}
	}, {
		key: 'codeSubmit',
		value: function codeSubmit(phone, vcode) {
			var that = this;
			if (this.props.isLoading) return;
			var queryData = {
				method: 'POST',
				params: {
					phone: phone,
					vcode: vcode
				}
			};

			if (this.routerID === 'check-account') {
				queryData = {
					method: 'POST',
					params: {
						phone: phone,
						vcode: vcode,
						udid: that.udid
					}
				};
			}

			this.props.fetchList(
			// '/account/bind/phone/',
			this.commitApi, queryData, 'submitInfo');
		}
	}, {
		key: 'phoneInputFormat',
		value: function phoneInputFormat() {
			this.props.boolToggle('phoneInputError');
		}
	}, {
		key: 'render',
		value: function render() {
			var btnTitle = void 0;
			var props = this.props;
			var propsCode = props.codeInfo;
			var delayStr = void 0;
			if (propsCode.delay && propsCode.delay > 0 && propsCode.isCounting) {
				delayStr = '(' + propsCode.delay + ')';
			}
			if (!propsCode.isCounting && !this.hasSent) {
				btnTitle = '获取验证码';
			} else {
				btnTitle = '重新获取' + (delayStr || '');
			}
			var loadingEle = this.props.isLoading ? _react2.default.createElement(_loading2.default, null) : '';
			return _react2.default.createElement(
				'div',
				{ className: 'container' },
				_react2.default.createElement(_account2.default, {
					sendCode: this.sendCode.bind(this),
					codeSubmit: this.codeSubmit.bind(this),
					phoneInputFormat: this.phoneInputFormat.bind(this),
					codeInfo: propsCode,
					btnTitle: btnTitle,
					routerID: this.routerID,
					phoneInputError: props.phoneInputError,
					hasSent: this.hasSent
				}),
				loadingEle
			);
		}
	}]);
	return BindPhoneEle;
}(_react2.default.Component);

BindPhoneEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	cutDown: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	boolToggle: _react.PropTypes.func.isRequired,
	codeInfo: _react.PropTypes.object.isRequired,
	phoneInputError: _react.PropTypes.bool.isRequired,
	isLoading: _react.PropTypes.bool.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	submitInfo: _react.PropTypes.object.isRequired
};
BindPhoneEle.defaultProps = {
	codeInfo: {
		code: 0,
		isCounting: false,
		delay: 59
	}
};
exports.default = BindPhoneEle;

/***/ },

/***/ 493:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _components = __webpack_require__(492);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	},
	cutDown: function cutDown(cutDownInfo) {
		return (0, _actions.cutDown)(cutDownInfo);
	},
	directTo: function directTo(url) {
		return (0, _actions.directTo)(url);
	},
	boolToggle: function boolToggle(key) {
		return (0, _actions.boolToggle)(key);
	},
	valChange: function valChange(val, key) {
		return (0, _actions.valChange)(val, key);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		codeInfo: state.bindPhone.codeInfo,
		submitInfo: state.bindPhone.submitInfo,
		phoneInputError: state.bindPhone.phoneInputError,
		isLoading: state.bindPhone.isLoading
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_components2.default);

/***/ },

/***/ 494:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = bindPhoneReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	codeInfo: {
		isCounting: false,
		delay: 59,
		code: 0
	},
	// 倒计时
	submitInfo: {
		msg: ''
	},
	// 判断手机格式是否正确的样式展示
	phoneInputError: false,
	isLoading: false
};

function bindPhoneReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (!~[_config.rootPath + '/bind-phone', _config.rootPath + '/check-account'].indexOf(location.pathname)) return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 557:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".verify-note {\n  font-size: 1rem;\n  margin: 2rem 1rem;\n  color: #aaa;\n  border: 1px dashed #d9d9d9;\n  padding: .6rem 0;\n  text-align: center;\n  line-height: 1.5rem; }\n\n.verify-data {\n  border-top: 1px solid #d9d9d9;\n  border-bottom: 1px solid #d9d9d9;\n  margin: 0; }\n  .verify-data .valilate-error {\n    color: #ff6f3a; }\n    .verify-data .valilate-error input {\n      color: #ff6f3a; }\n    .verify-data .valilate-error ::-webkit-input-placeholder {\n      color: #ff6f3a; }\n    .verify-data .valilate-error ::-moz-placeholder {\n      color: #ff6f3a; }\n    .verify-data .valilate-error :-ms-input-placeholder {\n      color: #ff6f3a; }\n  .verify-data li {\n    background: #fff;\n    border-bottom: 1px solid #d9d9d9;\n    line-height: 4rem;\n    padding: 0 1rem;\n    position: relative; }\n    .verify-data li span {\n      font-size: 1.1rem; }\n    .verify-data li input {\n      line-height: 2rem;\n      width: 70%;\n      padding: .94rem  1rem  .94rem 2rem;\n      font-size: 1.1rem; }\n    .verify-data li .send-code {\n      position: absolute;\n      right: 2rem;\n      top: .8rem;\n      width: 5rem;\n      padding: .2rem .6rem;\n      height: 2rem;\n      line-height: 2rem;\n      -webkit-border-radius: .4rem;\n              border-radius: .4rem;\n      text-align: center; }\n    .verify-data li .send-code-already {\n      width: 6rem;\n      background: #d8d8d8; }\n    .verify-data li:last-child {\n      border: 0 none; }\n      .verify-data li:last-child input {\n        width: 40%; }\n\n.confirm-btn {\n  margin: 3rem 2rem 0;\n  line-height: 4rem;\n  font-size: 1.3rem;\n  -webkit-border-radius: .6rem;\n          border-radius: .6rem;\n  text-align: center; }\n\n.rem-note {\n  color: #aaa;\n  font-size: 1rem;\n  padding: 3rem 1rem 0;\n  line-height: 2.5rem; }\n  .rem-note div {\n    font-weight: bold; }\n  .rem-note ul li {\n    line-height: 1.5rem; }\n    .rem-note ul li span {\n      display: inline-block;\n      font-weight: 900;\n      margin-right: 0.2rem;\n      -webkit-transform: translateY(-0.2rem);\n              transform: translateY(-0.2rem); }\n", ""]);

// exports


/***/ },

/***/ 558:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ },

/***/ 575:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(557);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./account.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./account.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 576:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(558);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./bindPhone.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./bindPhone.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});