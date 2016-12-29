webpackJsonp([32],{

/***/ 450:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _taskDetailSpecialContainer = __webpack_require__(537);

var _taskDetailSpecialContainer2 = _interopRequireDefault(_taskDetailSpecialContainer);

var _taskDetailSpecial = __webpack_require__(538);

var _taskDetailSpecial2 = _interopRequireDefault(_taskDetailSpecial);

__webpack_require__(588);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'taskDetailSpecial', reducer: _taskDetailSpecial2.default });
	cb(null, _taskDetailSpecialContainer2.default);
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

/***/ 458:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var userAgent = navigator.userAgent.toLowerCase();
exports.default = {
	isAndroid: /Android/i.test(userAgent),
	isIOS: /iphone|ipad|ipod/i.test(userAgent),
	isAfterIOS8: /iphone|ipad|ipod/i.test(userAgent) && userAgent.split('like')[0].split('os')[1].replace(/\s+/g, '').split('_')[0] - 0 > 8,
	isIOS10: /iphone|ipad|ipod/i.test(userAgent) && userAgent.split('like')[0].split('os')[1].replace(/\s+/g, '').split('_')[0] - 0 === 10,
	isWeixin: /micromessenger/i.test(userAgent),
	isWeibo: /weibo/i.test(userAgent),
	isQQ: /qq/i.test(userAgent),
	isBeforeIOS7: /iphone|ipad|ipod/i.test(userAgent) && userAgent.split('like')[0].split('os')[1].replace(/\s+/g, '').split('_')[0] - 0 < 7
};

/***/ },

/***/ 461:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = __webpack_require__(87);

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = __webpack_require__(55);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(56);

var _createClass3 = _interopRequireDefault(_createClass2);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _util = __webpack_require__(86);

var _ua = __webpack_require__(458);

var _ua2 = _interopRequireDefault(_ua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
	function _class(websocketUrl, vm) {
		(0, _classCallCheck3.default)(this, _class);

		this.websocket_url = websocketUrl;
		vm.ws = {};
		this.vm = vm;
		// 用于区分是未连接还是主动关闭
		this.connect = true;
	}

	// methods


	(0, _createClass3.default)(_class, [{
		key: 'init',
		value: function init() {
			window.WebSocket = window.WebSocket || window.MozWebSocket;
			var that = this;
			that.connect = true;
			that.ws = new WebSocket(that.websocket_url, 'echo-protocol');
			that.ws.onopen = function () {
				that.ws.send((0, _stringify2.default)({
					messageType: 'JSON',
					socketName: 'init',
					user: _storage2.default.local.get('user') || ''
				}));
				that.vm.props.valChange(true, 'isOnline'); // 判断是否在线
				_storage2.default.session.set('isOnline', true);
			};
			that.ws.onclose = function () {
				that.close();
				if (that.vm.props.isOnline) {
					that.vm.props.valChange(false, 'isOnline');
				}
				_storage2.default.session.remove('isOnline');
				if (that.connect) that.init();
			};

			that.ws.onmessage = function (message) {
				var obj = void 0;
				try {
					obj = JSON.parse(message.data);
				} catch (e) {
					console.error(message.data, 'JSON parse Error');
				}

				obj.socketName = obj.socketName.toLowerCase(); // 忽略大小写,转小写
				// adopen  result: false 未安装
				if (obj.socketName === 'adopen') that.adOpenCallback(obj);
				if (obj.result) {
					if (obj.text) {
						if (obj.socketName === 'init') {
							var params = (0, _util.urlParamsFormat)(obj.text);
							_storage2.default.local.set('91atm', (0, _stringify2.default)(params));
							that.open(obj);
						} else if (obj.socketName === 'adclick') {
							if (!_ua2.default.isAfterIOS8) {
								that.adClickCallback(); // 非ios9，10点击
							}
						} else if (obj.socketName === 'adinstall') {
							that.adInstallCallback();
						} else if (obj.socketName === 'adautoopen') {
							that.adAutoOpenCallback();
						}
					}
				}
			};
		}
	}, {
		key: 'open',
		value: function open(message) {}
	}, {
		key: 'adOpen',
		value: function adOpen() {}
	}, {
		key: 'adOpenCallback',
		value: function adOpenCallback(message) {}
	}, {
		key: 'close',
		value: function close() {}
	}, {
		key: 'adClick',
		value: function adClick() {}
	}, {
		key: 'adClickCallback',
		value: function adClickCallback() {}
	}, {
		key: 'adInstall',
		value: function adInstall() {}
	}, {
		key: 'adInstallCallback',
		value: function adInstallCallback() {}
	}, {
		key: 'adAutoOpen',
		value: function adAutoOpen() {}
	}, {
		key: 'adAutoOpenCallback',
		value: function adAutoOpenCallback() {}
	}]);
	return _class;
}();

exports.default = _class;

/***/ },

/***/ 462:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = __webpack_require__(87);

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = wsInit;

var _djws = __webpack_require__(461);

var _djws2 = _interopRequireDefault(_djws);

var _util = __webpack_require__(86);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ws connect
function wsInit() {
	var port = arguments.length <= 0 || arguments[0] === undefined ? 9098 : arguments[0];
	var vm = arguments[1];

	var keyData = JSON.parse(_storage2.default.local.get('keyData') || '{}') || vm.versionInfo || {};
	var wsPort = keyData.port || port;
	// if (vm.props.isOnline) return
	var djws = new _djws2.default('ws://127.0.0.1:' + wsPort, vm);
	djws.init();
	djws.open = function (message) {
		// 钥匙已经链接成功onmessage
		// check package_name and app_version
		try {
			message = (0, _util.urlParamsFormat)(message.text);
		} catch (e) {
			console.error('keyInfo is not valid!');
		}
		// const flag = keyData.version === message.app_version
		// 	&& keyData.package_name === message.package_name
		// if (!keyData.need_update || flag) {
		// 	vm.popupMessage.dataOrigin || (vm.popupMessage = {})
		// }

		_storage2.default.local.set('91atm', (0, _stringify2.default)(message));
		vm.props.valChange(message, 'keyInfo');
		vm.props.valChange(true, 'isOnline');
		if ((0, _util.versionCompare)(message.app_version, '1.9.0') > 0) {
			vm.props.valChange(true, 'canShare');
		}
		// 存储app版本信息，便于做版本区分，区分是否通过钥匙打开应用+客户端复制关键词
		var isNewVersion = (0, _util.versionCompare)(message.app_version, '1.2.0');
		_storage2.default.local.set('isNewVersion', isNewVersion);

		// 1.4.0钥匙端自动打开应用
		var isAutoOpen = (0, _util.versionCompare)(message.app_version, '1.4.0');
		_storage2.default.local.set('isAutoOpen', isAutoOpen);

		// 如果检测到installed不存在则去存储
		if (!_storage2.default.local.get('installed')) {
			_storage2.default.local.set('installed', true);
		}

		// 执行openCallback
		djws.openCallback(message);
	};
	djws.openCallback = function () {};

	djws.close = function () {
		// 钥匙信息
		var keyInfo = JSON.parse(_storage2.default.local.get('91atm')) || {};
		// 钥匙未连接且没有本地信息，跳转邀请下载页
		if (!keyInfo.device_id) {
			vm.props.directTo('down-invite');
			return;
		}

		if (vm.props.isOnline) {
			vm.props.valChange(false, 'isOnline');
		}
		// websocket未连接上，且用户未进行任何操作，不显示弹框
		// 点击试玩或注册, userHasClicked turn to true
		if (location.pathname === _config.rootPath + '/' && !vm.props.userHasClicked) {
			return;
		}
		// return
		if (!keyData.need_update || keyData.is_new_user) {
			// modal only index and task-detail page
			if (!~[_config.rootPath + '/', _config.rootPath + '/task-detail'].indexOf(location.pathname)) return;
			vm.props.modalOpen({
				content: '您还没有开启试玩守护,无法试玩!(如已打开,请手动关闭应用并重新启动)',
				confirm: '立即开启',
				confirmCallback: function confirmCallback() {
					(0, _util.logEvent)('immediate_open');
					location.href = keyData.scheme;
				},

				isBlock: true,
				cancel: keyData.disabled ? '守护不能用？' : '',
				cancelCallback: function cancelCallback() {
					if (keyData.disabled) {
						vm.props.directTo('/download');
					}
				}
			});
			return;
		}
	};
	djws.adClick = function (text) {
		if (vm.props.isOnline) {
			// alert('adClick')
			if (djws.ws.readyState === 1) {
				djws.ws.send((0, _stringify2.default)({
					messageType: 'JSON',
					socketName: 'adClick',
					text: text
				}));
			}
		}
	};
	djws.adClickCallback = function () {
		var adType = +_storage2.default.local.get('adType');
		if (adType === 2) {
			if (vm.openPopReminfo) vm.openPopReminfo();
		} else {
			vm.appDownload();
		}
	};

	djws.adInstall = function (text) {
		var keywords = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

		if (vm.props.isOnline) {
			// alert('adInstall')
			djws.ws.send((0, _stringify2.default)({
				messageType: 'JSON',
				socketName: 'adInstall',
				text: text,
				keywords: keywords
			}));
		}
	};

	djws.adInstallCallback = function () {
		vm.appDownload();
	};

	djws.adAutoOpen = function (text) {
		var keywords = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

		if (vm.props.isOnline) {
			// alert('adAutoOpen')
			djws.ws.send((0, _stringify2.default)({
				messageType: 'JSON',
				socketName: 'adAutoOpen',
				text: text,
				keywords: keywords
			}));
		}
	};

	djws.adAutoOpenCallback = function () {
		vm.appDownload();
	};

	djws.adOpen = function (text) {
		if (vm.props.isOnline) {
			// alert('adOpen')
			var dataToSend = {
				messageType: 'JSON',
				socketName: 'adOpen',
				text: text
			};
			var dataToSendStr = (0, _stringify2.default)(dataToSend);
			djws.ws.send(dataToSendStr);
		}
	};

	djws.adOpenCallback = function (adOpenMessage) {
		if (!adOpenMessage.result) {
			if (vm.openPopReminfo) vm.openPopReminfo();
		}
	};

	djws.shareImg = function (imageUrl, text) {
		if (djws.ws.readyState === 1) {
			djws.ws.send((0, _stringify2.default)({
				messageType: 'JSON',
				socketName: 'shareImageSave',
				text: text,
				imageUrl: imageUrl
			}));
		}
	};

	djws.shareImgCallback = function (shareImgMessage) {
		(0, _util.toast)(shareImgMessage.text);
	};

	return djws;
}

/***/ },

/***/ 474:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _swiperModel = __webpack_require__(475);

var _swiperModel2 = _interopRequireDefault(_swiperModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _swiperModel2.default;

/***/ },

/***/ 475:
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

var _swipe = __webpack_require__(211);

var _swipe2 = _interopRequireDefault(_swipe);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SwiperModel = function (_React$Component) {
	(0, _inherits3.default)(SwiperModel, _React$Component);

	function SwiperModel(props) {
		(0, _classCallCheck3.default)(this, SwiperModel);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SwiperModel).call(this, props));

		_this.swiperModelInit = _this.swiperModelInit.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(SwiperModel, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			function fontResize() {
				var width = document.body.offsetWidth;
				var fontSize = width / 320 * 12;
				document.querySelector('html').style.fontSize = fontSize + 'px';
				return fontSize;
			}
			fontResize();
			this.swiperModelInit();
		}
	}, {
		key: 'noMove',
		value: function noMove(e) {
			e.preventDefault();
			e.stopPropagation();
		}
	}, {
		key: 'swiperModelInit',
		value: function swiperModelInit() {
			var props = this.props;
			var wiper = new _swipe2.default(document.getElementById('swipe-model'), {
				effect: 'coverflow',
				grabCursor: true,
				centeredSlides: true,
				startSlide: props.swipeModelIndex || 0,
				continuous: false,
				disableScroll: false,
				stopPropagation: true,
				pagination: '.swipe-model-progress',
				callback: function callback(index) {
					_storage2.default.local.set('swipeModelIndex', index);
					props.valChange(index, 'swipeModelIndex');
				}
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var swipeProgressEle = void 0;
			if (props.swiperImgArr.length > 1) {
				swipeProgressEle = _react2.default.createElement(
					'div',
					{ className: 'swipe-model-progress' },
					props.swiperImgArr.map(function (item, index) {
						var itemClass = void 0;
						if (props.swipeModelIndex === index) itemClass = 'current-swipe-dot';
						return _react2.default.createElement('span', { key: index, className: itemClass });
					})
				);
			}
			return _react2.default.createElement(
				'div',
				{ className: 'swipe-model-wrap', onTouchMove: this.noMove },
				_react2.default.createElement(
					'div',
					{ className: 'swipe-model-container' },
					_react2.default.createElement('span', { className: 'swipe-model-close', onClick: props.closeSwipe }),
					_react2.default.createElement(
						'div',
						{ className: 'swipe swipe-model', id: 'swipe-model' },
						_react2.default.createElement(
							'div',
							{ className: 'swipe-wrapper' },
							props.swiperImgArr.map(function (item, index) {
								return _react2.default.createElement(
									'div',
									{ className: 'swipe-slide', key: index },
									_react2.default.createElement('img', { src: item, alt: '' })
								);
							})
						),
						swipeProgressEle
					)
				)
			);
		}
	}]);
	return SwiperModel;
}(_react2.default.Component);

SwiperModel.propTypes = {
	swipeModelIndex: _react.PropTypes.number,
	valChange: _react.PropTypes.func,
	closeSwipe: _react.PropTypes.func,
	swiperImgArr: _react.PropTypes.array
};
SwiperModel.defaultPropTypes = {
	swiperImgArr: []
};
exports.default = SwiperModel;

/***/ },

/***/ 535:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = __webpack_require__(87);

var _stringify2 = _interopRequireDefault(_stringify);

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

var _wsConnect = __webpack_require__(462);

var _wsConnect2 = _interopRequireDefault(_wsConnect);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

var _swiperModel = __webpack_require__(474);

var _swiperModel2 = _interopRequireDefault(_swiperModel);

var _upimg = __webpack_require__(536);

var _upimg2 = _interopRequireDefault(_upimg);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaskdDetailSpecialEle = function (_React$Component) {
	(0, _inherits3.default)(TaskdDetailSpecialEle, _React$Component);

	function TaskdDetailSpecialEle(props) {
		(0, _classCallCheck3.default)(this, TaskdDetailSpecialEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TaskdDetailSpecialEle).call(this, props));

		_this.clickSpecialStart = _this.clickSpecialStart.bind(_this);
		_this.clickUploadShow = _this.clickUploadShow.bind(_this);
		_this.init = _this.init.bind(_this);
		_this.offLineModal = _this.offLineModal.bind(_this);
		_this.clickOpenImg = _this.clickOpenImg.bind(_this);
		_this.closeSwipe = _this.closeSwipe.bind(_this);
		_this.ws = {};
		_this.oneAdInfo = JSON.parse(_storage2.default.local.get('specialOngoing') || '{}');
		_this.userID = _storage2.default.local.get('user') || '';
		return _this;
	}

	(0, _createClass3.default)(TaskdDetailSpecialEle, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var that = this;
			var props = this.props;
			var adID = this.oneAdInfo.ad_id;
			var keyInfo = JSON.parse(_storage2.default.local.get('91atm') || '{}');
			function filter(adDetailInfo) {
				_storage2.default.session.set('ongoing', (0, _stringify2.default)(that.oneAdInfo));
				var result = adDetailInfo || {};
				result.swiperImgArr = [];
				if (adDetailInfo.pic.length) {
					adDetailInfo.pic.forEach(function (item) {
						result.swiperImgArr = result.swiperImgArr.concat([item.url]);
					});
				}
				result.custom_field = adDetailInfo.custom_field || { pic: '截图',
					user_name: '姓名',
					user_phone: '手机号',
					user_idcard: '身份证',
					extra_info: '其他' };
				return result;
			}
			if (adID) {
				props.fetchList('/trial/atm_task/' + adID + '/', {
					querys: {
						device_id: keyInfo.device_id || '',
						time: Date.now()
					}
				}, 'adDetailInfo', filter);
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var props = this.props;
			if (this.props.modalState) {
				this.props.modalClose();
			}
			if (this.oneAdInfo.ongoing || this.oneAdInfo.committed) {
				_storage2.default.local.set('hasGetSpecialTask', true);
				props.valChange(true, 'hasGetSpecialTask');
			}
			this.init();
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var props = this.props;
			if (nextProps.isOnline && !props.isOnline) {
				if (this.props.modalState) {
					this.props.modalClose();
				}
			}

			// test
			if (!nextProps.isOnline && props.isOnline) {
				this.offLineModal();
			}

			if (!props.showSwiperModel && nextProps.showSwiperModel) {
				document.body.className = 'body-hidden';
			} else {
				document.body.className = '';
			}
		}
	}, {
		key: 'offLineModal',
		value: function offLineModal() {
			var that = this;
			function getJson(key) {
				var hasKey = (0, _util.hasStorage)(key);
				return JSON.parse(hasKey || '{}');
			}
			var keyData = getJson('keyData');
			function cancelCallback() {
				if (keyData.disabled) {
					that.props.directTo('/download');
				}
			}
			if (!keyData.need_update || keyData.is_new_user) {
				this.props.modalOpen({
					content: '您还没有开启试玩守护,无法试玩!(如已打开,请手动关闭应用并重新启动)',
					confirm: '立即开启',
					confirmCallback: function confirmCallback() {
						(0, _util.logEvent)('immediate_open');
						location.href = keyData.scheme;
					},

					isBlock: true,
					cancel: keyData.disabled ? '守护不能用？' : '',
					cancelCallback: cancelCallback
				});
			}
		}
	}, {
		key: 'clickSpecialStart',
		value: function clickSpecialStart() {
			var that = this;
			var props = this.props;
			var adDetailInfo = props.adDetailInfo;
			// if (props.hasGetSpecialTask) {
			// 	toast('您已成功领取任务！')
			// 	return
			// }
			var isNewVersion = +_storage2.default.local.get('isNewVersion') + 1;
			var deviceID = JSON.parse(_storage2.default.local.get('91atm') || '{}').device_id || '';
			var oneAdInfo = this.oneAdInfo || {};
			var specialData = {
				user_id: that.userID,
				ad_id: oneAdInfo.ad_id,
				ad_type: oneAdInfo.ad_type,
				device_id: deviceID
			};
			function changeStatus() {
				props.valChange(true, 'hasGetSpecialTask');
				_storage2.default.local.set('hasGetSpecialTask', true);
				// jump_type 1 跳转网页  jump_type 0 跳转APP
				// jump_type 0 跳转APP 打开微信jump weixin://  jump_package   com.tencent.xin
				// 无法打开app,延时跳转下载 app_url
				var sendParams = 'pack_name=' + adDetailInfo.jump_package + '&snuid=' + that.userID;
				if (isNewVersion && !adDetailInfo.jump_type) {
					that.ws.adOpen(sendParams);
				} else {
					location.href = adDetailInfo.jump;
				}
				// 判断是否能打开应用
				var begin = new Date();
				window.setTimeout(function () {
					if (new Date().getTime() - begin < 3000) {
						location.href = adDetailInfo.app_url;
						// 不直接跳转下载，弹框提示去下载
						// that.openPopReminfo()
					}
					// else {
					// 	window.stop()
					// }
				}, 2000);
			}

			function specialDataFilter(data) {
				if (data.code >= 200 && data.code < 300) {
					setTimeout(changeStatus, 10);
					(0, _util.toast)('成功领取任务！');
				}
			}
			this.props.fetchList('/trial/atm_task/', { method: 'POST', params: specialData }, undefined, specialDataFilter);
		}
	}, {
		key: 'clickUploadShow',
		value: function clickUploadShow() {
			var props = this.props;
			var hasGetSpecialTask = props.hasGetSpecialTask || _storage2.default.local.get('hasGetSpecialTask');
			if (hasGetSpecialTask) {
				props.valChange(true, 'clickUploadEleShow');
			} else {
				props.modalOpen({
					content: '点击开始任务后，上传截图，审核通过才能获得奖励'
				});
			}
		}
	}, {
		key: 'clickOpenImg',
		value: function clickOpenImg(index) {
			_storage2.default.local.set('swipeModelIndex', index || 0);
			this.props.valChange(index, 'swipeModelIndex');
			this.props.valChange(true, 'showSwiperModel');
		}
	}, {
		key: 'closeSwipe',
		value: function closeSwipe() {
			this.props.valChange(false, 'showSwiperModel');
		}
	}, {
		key: 'init',
		value: function init() {
			var that = this;
			if (that.ws.websocket_url) return;
			this.ws = (0, _wsConnect2.default)(9098, that);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var props = this.props;
			var adDetailInfo = props.adDetailInfo || {};
			var swiperImgArr = adDetailInfo.swiperImgArr || [];
			var coursePics = adDetailInfo.pic || [];
			var oneAdInfo = this.oneAdInfo;
			var taskSpecialTopEle = _react2.default.createElement(
				'div',
				{ className: 'taskitem-top' },
				_react2.default.createElement(
					'div',
					{ className: 'taskitem-top-icon' },
					_react2.default.createElement('img', { alt: 'icon', src: oneAdInfo.icon })
				),
				_react2.default.createElement(
					'div',
					{ className: 'taskitem-top-desc' },
					_react2.default.createElement(
						'h3',
						null,
						oneAdInfo.name
					),
					_react2.default.createElement(
						'p',
						null,
						oneAdInfo.desc
					),
					_react2.default.createElement(
						'div',
						{ className: 'taskitem-cost' },
						'+',
						_react2.default.createElement(
							'b',
							null,
							oneAdInfo.price_desc
						),
						'元'
					)
				)
			);

			var taskSpecialDescEle = _react2.default.createElement(
				'div',
				{ className: 'taskitem-description taskitem-step' },
				_react2.default.createElement(
					'div',
					{ className: 'taskitem-description-title' },
					'特别提醒',
					_react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: adDetailInfo.remind } })
				)
			);

			var taskSpecialContentEle = _react2.default.createElement(
				'div',
				{ className: 'taskitem-course taskitem-step' },
				_react2.default.createElement(
					'h3',
					null,
					'图文教程'
				),
				_react2.default.createElement(
					'p',
					null,
					'第一步：请按教程依次完成并截图，即可获得奖励'
				),
				_react2.default.createElement(
					'ul',
					{ className: 'taskitem-course-list' },
					coursePics.map(function (item, index) {
						var cornerEle = item.p_type === 0 ? _react2.default.createElement(
							'span',
							null,
							index + 1
						) : _react2.default.createElement(
							'span',
							{ className: 'corner-full' },
							'请截图上传此页'
						);
						return _react2.default.createElement(
							'li',
							{ key: index },
							_react2.default.createElement('img', { src: item.url, alt: '', onClick: _this2.clickOpenImg.bind(_this2, index) }),
							cornerEle
						);
					})
				)
			);

			var upimgEle = void 0;
			if (props.clickUploadEleShow) {
				upimgEle = _react2.default.createElement(_upimg2.default, {
					modalOpen: props.modalOpen,
					valChange: props.valChange,
					fetchList: props.fetchList,
					directTo: props.directTo,
					transSrc: props.transSrc,
					uploadProgress: props.uploadProgress,
					clickUploadEleShow: props.clickUploadEleShow,
					submitResult: props.submitResult,
					adId: oneAdInfo.ad_id,
					customField: props.adDetailInfo.custom_field,
					committed: props.adDetailInfo.committed
				});
			}

			var popupEle = this.props.modalState ? _react2.default.createElement(_popup2.default, {
				popupMessage: this.props.modal,
				modal: this.props.modal,
				modalClose: this.props.modalClose,
				directTo: this.props.directTo
			}) : '';

			var swiperModelEle = props.showSwiperModel ? _react2.default.createElement(_swiperModel2.default, {
				swipeModelIndex: props.swipeModelIndex,
				valChange: props.valChange,
				closeSwipe: this.closeSwipe,
				swiperImgArr: swiperImgArr
			}) : '';

			return _react2.default.createElement(
				'div',
				{ className: 'container task-special-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'taskitem-top-wrap' },
					taskSpecialTopEle,
					taskSpecialDescEle
				),
				_react2.default.createElement('div', { className: 'task-panel' }),
				taskSpecialContentEle,
				_react2.default.createElement('div', { className: 'task-panel' }),
				_react2.default.createElement(
					'div',
					{ className: 'taskitem-step taskitem-bottom-wrap' },
					_react2.default.createElement(
						'div',
						{
							className: 'taskitem-bottom-btn taskitem-btn-start btn-orange',
							onClick: this.clickSpecialStart
						},
						'开始任务'
					),
					_react2.default.createElement(
						'div',
						{ className: 'taskitem-btn-upload' },
						_react2.default.createElement(
							'span',
							{
								className: 'taskitem-bottom-btn btn-reverse',
								onClick: this.clickUploadShow
							},
							'提交审核'
						),
						_react2.default.createElement(
							'p',
							null,
							'上传资料后请等待1~3个工作日。'
						)
					)
				),
				popupEle,
				upimgEle,
				swiperModelEle
			);
		}
	}]);
	return TaskdDetailSpecialEle;
}(_react2.default.Component);
// import { rootPath } from '../../config'

// import { Link } from 'react-router'


TaskdDetailSpecialEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	isOnline: _react.PropTypes.bool.isRequired,
	transSrc: _react.PropTypes.string.isRequired,
	submitResult: _react.PropTypes.object.isRequired,
	hasGetSpecialTask: _react.PropTypes.bool.isRequired,
	clickUploadEleShow: _react.PropTypes.bool.isRequired,
	uploadProgress: _react.PropTypes.number.isRequired,
	swipeModelIndex: _react.PropTypes.number.isRequired,
	showSwiperModel: _react.PropTypes.bool.isRequired,
	adDetailInfo: _react.PropTypes.object.isRequired
};
exports.default = TaskdDetailSpecialEle;

/***/ },

/***/ 536:
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaskdDetailUpimgEle = function (_React$Component) {
	(0, _inherits3.default)(TaskdDetailUpimgEle, _React$Component);

	function TaskdDetailUpimgEle(props) {
		(0, _classCallCheck3.default)(this, TaskdDetailUpimgEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TaskdDetailUpimgEle).call(this, props));

		_this.drawCanvasImage = _this.drawCanvasImage.bind(_this);
		_this.handleImgChange = _this.handleImgChange.bind(_this);
		_this.readImage = _this.readImage.bind(_this);
		_this.submitImage = _this.submitImage.bind(_this);
		_this.closeUploadEle = _this.closeUploadEle.bind(_this);
		_this.handleDeleteUpload = _this.handleDeleteUpload.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(TaskdDetailUpimgEle, [{
		key: 'noMove',
		value: function noMove(e) {
			e.preventDefault();
			e.stopPropagation();
		}
	}, {
		key: 'handleImgChange',
		value: function handleImgChange(event) {
			if (this.props.uploadProgress === 1) {
				return;
			}
			this.props.valChange(1, 'uploadProgress');
			this.readImage(event.target.files[0]);
		}
	}, {
		key: 'drawCanvasImage',
		value: function drawCanvasImage(image) {
			var props = this.props;
			// 绘制图片
			var width = image.width;
			var height = image.height;
			// 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
			var ratio = width * height / 1000000;
			if (ratio > 1) {
				ratio = Math.sqrt(ratio);
				width /= ratio;
				height /= ratio;
			} else {
				ratio = 1;
			}

			function onloadCanvas() {
				// 用于压缩图片的canvas
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				// 瓦片canvas
				var tCanvas = document.createElement('canvas');
				var tctx = tCanvas.getContext('2d');
				// canvas 清屏
				ctx.fillStyle = '#fff';
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// 重置canvas宽高
				canvas.width = width;
				canvas.height = height;
				// 绘制
				// 如果图片像素大于100万则使用瓦片绘制
				var count = width * height / 1000000;
				if (count > 1) {
					// 计算要分成多少块瓦片
					count = ~~(Math.sqrt(count) + 1);
					// 计算每块瓦片的宽和高
					var nw = ~~(width / count);
					var nh = ~~(height / count);

					tCanvas.width = nw;
					tCanvas.height = nh;

					for (var i = 0; i < count; i++) {
						for (var j = 0; j < count; j++) {
							tctx.drawImage(image, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

							ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
						}
					}
				} else {
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				}
				var imgSrcData = canvas.toDataURL('image/jpg', 0.1);
				// tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
				props.valChange(imgSrcData, 'transSrc');
			}
			onloadCanvas();
		}
	}, {
		key: 'readImage',
		value: function readImage(src) {
			var that = this;
			// 创建 FileReader 对象 并调用 render 函数来完成渲染
			// src.type
			var reader = new FileReader();
			reader.onload = function (e) {
				// that.drawImage(e.target.result)
				that.loadImage(e.target.result, that.drawCanvasImage);
			};
			// 读取文件内容
			reader.readAsDataURL(src);
		}
	}, {
		key: 'loadImage',
		value: function loadImage(src, onload) {
			var img = new Image();
			img.src = src;
			img.onload = function () {
				onload(img);
			};
			img.onerror = function () {
				onload(false);
			};
		}
	}, {
		key: 'submitImage',
		value: function submitImage() {
			var props = this.props;
			var customField = props.customField || {};
			var transSrc = this.props.transSrc || '';
			var username = customField.user_name && this.refs.username.value;
			var phone = customField.user_phone && this.refs.phone.value || '';
			var idcard = customField.user_idcard && this.refs.idcard.value || '';
			var extrainfo = customField.extra_info && this.refs.extrainfo.value || '';
			var nameRem = /^[\u4e00-\u9fa5]{2,6}$/;
			var phoneRem = /^1[3-8]\d{9}$/;
			var idcardRem = /^\d{17}(\d|[xX])$/;
			if (customField.user_name && !nameRem.test(username)) {
				(0, _util.toast)('请输入真实姓名');
				return;
			} else if (customField.user_phone && (!phone || !phoneRem.test(phone))) {
				(0, _util.toast)('请输入注册用的手机号');
				return;
			} else if (customField.user_idcard && (!idcard || !idcardRem.test(idcard))) {
				(0, _util.toast)('请输入正确的身份证号');
				return;
			} else if (customField.extra_info && !extrainfo) {
				(0, _util.toast)('请输入其他信息');
				return;
			} else if (customField.extra_info && extrainfo.length > 15) {
				(0, _util.toast)('其他信息字数不可超过15个字');
				this.refs.extrainfo.value = extrainfo.slice(0, 15);
				return;
			} else if (customField.pic && !transSrc) {
				(0, _util.toast)('请先选择所需上传的截图');
				return;
			}
			props.valChange(2, 'uploadProgress');
			var postParams = {
				type: 'jpg',
				ad_id: props.adId,
				pic: transSrc,
				user_name: username,
				user_phone: phone,
				user_idcard: idcard,
				extra_info: extrainfo
			};
			function changeReload() {
				location.reload();
			}
			function handleResult() {
				props.valChange(3, 'uploadProgress');
				changeReload();
			}
			function submitResultFilter(submitResult) {
				if (submitResult.code >= 200 && submitResult.code < 300) {
					if (submitResult.type > 0) {
						(0, _util.toast)('图片上传成功');
						setTimeout(handleResult, 1000);
					} else {
						var toastMsg = submitResult.msg || '图片上传失败，请重试';
						(0, _util.toast)(toastMsg);
						setTimeout(changeReload, 3000);
					}
				}
				return submitResult;
			}
			this.props.fetchList('/trial/atm_task/picture/', {
				method: 'POST',
				params: postParams
			}, 'submitResult', submitResultFilter);
		}
	}, {
		key: 'closeUploadEle',
		value: function closeUploadEle() {
			this.props.valChange(false, 'clickUploadEleShow');
		}
	}, {
		key: 'handleDeleteUpload',
		value: function handleDeleteUpload() {
			this.props.valChange('', 'transSrc');
			this.props.valChange(0, 'uploadProgress');
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var customField = props.customField || {};
			var uploadContentEle = _react2.default.createElement(
				'div',
				{
					className: props.uploadProgress === 1 ? 'add-upload add-noupload' : 'add-upload'
				},
				_react2.default.createElement('input', {
					type: 'file',
					accept: 'image/png,image/jpeg,image/gif',
					name: 'file',
					onChange: this.handleImgChange,
					className: 'file-input'
				})
			);
			var uploadEle = void 0;
			if (customField.pic) {
				uploadEle = _react2.default.createElement(
					'div',
					{ className: 'upload-content-wrap' },
					uploadContentEle,
					_react2.default.createElement(
						'div',
						{ className: 'add-upload-desc' },
						_react2.default.createElement(
							'h4',
							null,
							'选择上传任务截图'
						),
						_react2.default.createElement(
							'p',
							null,
							'上传截图后请等待1-2个工作日'
						)
					)
				);
			}

			var uploadShowEle = void 0;
			if (props.transSrc && customField.pic) {
				uploadShowEle = _react2.default.createElement(
					'ul',
					{ className: 'upload-show-wrap' },
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement('img', { src: props.transSrc, alt: '' }),
						_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/delete-icon.png', alt: '', className: 'delete-icon', onClick: this.handleDeleteUpload }),
						props.transSrc && props.uploadProgress === 2 && _react2.default.createElement(
							'span',
							null,
							'上传中...'
						)
					)
				);
			}

			var uploadBtnClass = 'taskitem-bottom-btn btn-gray upload-wrap-btn';
			if (props.uploadProgress === 1 || !customField.pic) {
				uploadBtnClass = 'taskitem-bottom-btn btn-reverse upload-wrap-btn';
			}

			var verifyInfoEle = _react2.default.createElement(
				'div',
				{ className: 'verify-list' },
				customField.user_name && _react2.default.createElement('input', { type: 'text', className: 'verify-list-item', placeholder: '请输入姓名', ref: 'username' }),
				customField.user_phone && _react2.default.createElement('input', { type: 'number', className: 'verify-list-item', placeholder: '请输入注册用的手机号', ref: 'phone' }),
				customField.user_idcard && _react2.default.createElement('input', { type: 'text', className: 'verify-list-item', placeholder: '请输入身份证号', ref: 'idcard' }),
				customField.extra_info && _react2.default.createElement('input', { type: 'text', className: 'verify-list-item', placeholder: '请输入其他信息', ref: 'extrainfo' })
			);

			var remText = props.committed ? '已上传，只保留最后一次上传的图片' : '只保留最后一次上传的图片';
			return _react2.default.createElement(
				'div',
				{ className: 'upload-wrap', onTouchMove: this.noMove },
				_react2.default.createElement(
					'div',
					{ className: 'header' },
					'提交审核',
					_react2.default.createElement(
						'span',
						{ className: 'close-uploadele', onClick: this.closeUploadEle },
						'取消'
					)
				),
				_react2.default.createElement('div', {
					className: props.uploadProgress === 2 ? 'refresh-line refresh-line-animate' : 'refresh-line'
				}),
				verifyInfoEle,
				uploadEle,
				uploadShowEle,
				_react2.default.createElement(
					'div',
					{
						className: uploadBtnClass,
						onClick: this.submitImage
					},
					'提交审核',
					_react2.default.createElement(
						'p',
						null,
						remText
					)
				)
			);
		}
	}]);
	return TaskdDetailUpimgEle;
}(_react2.default.Component);
// import $storage from '../../../services/storage'


TaskdDetailUpimgEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	transSrc: _react.PropTypes.string.isRequired,
	uploadProgress: _react.PropTypes.number.isRequired,
	clickUploadEleShow: _react.PropTypes.bool.isRequired,
	submitResult: _react.PropTypes.object.isRequired,
	adId: _react.PropTypes.string.isRequired,
	customField: _react.PropTypes.object,
	committed: _react.PropTypes.number
};
TaskdDetailUpimgEle.defaultPropTypes = {
	customField: {}
};
exports.default = TaskdDetailUpimgEle;

/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _components = __webpack_require__(535);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	},
	modalOpen: function modalOpen(payload) {
		return (0, _actions.modalOpen)(payload);
	},
	modalClose: function modalClose() {
		return (0, _actions.modalClose)();
	},
	directTo: function directTo(url) {
		return (0, _actions.directTo)(url);
	},
	valChange: function valChange(key, val) {
		return (0, _actions.valChange)(key, val);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		transSrc: state.taskDetailSpecial.transSrc,
		modal: state.taskDetailSpecial.modal,
		modalState: state.taskDetailSpecial.modalState,
		adDetailInfo: state.taskDetailSpecial.adDetailInfo,
		isOnline: state.taskDetailSpecial.isOnline,
		submitResult: state.taskDetailSpecial.submitResult,
		hasGetSpecialTask: state.taskDetailSpecial.hasGetSpecialTask,
		clickUploadEleShow: state.taskDetailSpecial.clickUploadEleShow,
		uploadProgress: state.taskDetailSpecial.uploadProgress,
		swipeModelIndex: state.taskDetailSpecial.swipeModelIndex,
		showSwiperModel: state.taskDetailSpecial.showSwiperModel
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_components2.default);

/***/ },

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = taskDetailSpecialReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	modal: {},
	modalState: false,
	isOnline: true,
	adDetailInfo: {},
	transSrc: '',
	submitResult: {},
	hasGetSpecialTask: false,
	clickUploadEleShow: false,
	uploadProgress: 0,
	swipeModelIndex: +_storage2.default.local.get('swipeModelIndex') || 0,
	showSwiperModel: false
};

function taskDetailSpecialReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/taskdetail-special') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 572:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".body-hidden {\n  overflow: hidden; }\n\n.close-uploadele {\n  position: absolute;\n  left: 1.33rem;\n  top: 0;\n  font-size: 1.083rem;\n  line-height: 3.33rem; }\n\n.taskitem-top-wrap {\n  background: #fff !important;\n  margin-bottom: .83rem; }\n\n.task-panel {\n  width: 100%;\n  height: .5rem;\n  border-top: 1px solid #f4f5f6;\n  border-bottom: 1px solid #f4f5f6;\n  background: #f4f4f4; }\n\n.taskitem-step {\n  padding-left: 5.077rem;\n  padding-right: .83rem; }\n\n.taskitem-top {\n  padding: 1.25rem .83rem 0;\n  overflow: hidden;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  display: -webkit-flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-align-items: center; }\n\n.taskitem-top-icon {\n  width: 3.33rem;\n  height: 3.33rem;\n  -webkit-border-radius: .8rem;\n          border-radius: .8rem;\n  overflow: hidden;\n  -webkit-transform: translateY(-0.5rem);\n  transform: translateY(-0.5rem); }\n  .taskitem-top-icon img {\n    width: 100%;\n    height: 100%; }\n\n.taskitem-top-desc {\n  margin-left: .917rem;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  -webkit-flex: 1;\n  border-bottom: 1px solid #f4f5f7;\n  padding-bottom: .83rem;\n  position: relative; }\n  .taskitem-top-desc h3 {\n    margin-bottom: .6rem;\n    color: #333;\n    font-size: 1.083rem;\n    font-weight: normal; }\n  .taskitem-top-desc p {\n    font-size: .917rem;\n    color: #999; }\n\n.taskitem-cost {\n  position: absolute;\n  right: 0;\n  bottom: 1.83rem;\n  font-size: 1.083rem;\n  color: #fe5900; }\n  .taskitem-cost b {\n    font-size: 1.83rem;\n    position: relative;\n    top: .2rem; }\n\n.taskitem-description {\n  font-size: 1.083rem;\n  line-height: 1.6rem; }\n  .taskitem-description a {\n    text-decoration: underline;\n    color: #007AFF; }\n  .taskitem-description .taskitem-description-title {\n    padding: 1.25rem 0 .5rem;\n    color: #333; }\n  .taskitem-description p {\n    color: #666; }\n  .taskitem-description p.progress {\n    color: #ff733d;\n    font-weight: bold; }\n\n.taskitem-course {\n  padding-bottom: 1.25rem; }\n  .taskitem-course h3 {\n    padding: 1.25rem 0 1.167rem;\n    font-weight: normal;\n    position: relative;\n    color: #333; }\n  .taskitem-course p {\n    padding-bottom: .83rem;\n    height: .917rem;\n    font-size: .917rem;\n    color: #333;\n    text-overflow: ellipsis;\n    overflow: hidden;\n    white-space: nowrap; }\n\n.taskitem-course-list {\n  overflow: hidden; }\n  .taskitem-course-list li:nth-child(3n+1) {\n    margin-right: 0; }\n  .taskitem-course-list li {\n    width: 32.5%;\n    height: 7rem;\n    position: relative;\n    float: left;\n    margin-right: 1.25%;\n    margin-bottom: 1.25%;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box; }\n    .taskitem-course-list li img {\n      width: 100%;\n      height: 100%; }\n    .taskitem-course-list li span {\n      color: #fff;\n      background: rgba(0, 0, 0, 0.4);\n      width: 1.25rem;\n      height: 1.25rem;\n      position: absolute;\n      right: 0;\n      bottom: 0;\n      line-height: 1.5rem;\n      text-align: center;\n      font-size: .917rem; }\n    .taskitem-course-list li .corner-full {\n      width: 100%; }\n\n.taskitem-bottom-wrap {\n  padding-right: 1rem; }\n  .taskitem-bottom-wrap .btn-reverse {\n    background: #4ba2fe; }\n\n.taskitem-bottom-btn {\n  height: 2.67rem;\n  line-height: 2.67rem;\n  font-size: 1.13rem;\n  -webkit-border-radius: 2.67rem;\n          border-radius: 2.67rem;\n  text-align: center; }\n  .taskitem-bottom-btn p {\n    color: #999;\n    font-size: .917rem;\n    text-align: center; }\n\n.taskitem-btn-start {\n  margin: 1.25rem 0 1.667rem; }\n\n.taskitem-btn-upload {\n  border-top: 1px solid #f4f4f4;\n  padding-top: 1.667rem;\n  margin-right: -1rem; }\n  .taskitem-btn-upload span {\n    margin: 0 1rem 1.167rem 0;\n    display: block; }\n  .taskitem-btn-upload p {\n    color: #999;\n    font-size: .917rem;\n    text-align: center; }\n\n.upload-wrap {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(252, 252, 252, 0.99);\n  z-index: 997; }\n\n.upload-wrap-btn {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 3.41rem;\n  width: 21.17rem;\n  margin: 0 auto; }\n\n.upload-content-wrap {\n  padding: 0 1.33rem 1.33rem;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1); }\n\n.add-upload-desc {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  padding-left: 1.33rem; }\n  .add-upload-desc h4 {\n    color: #333;\n    font-size: 1.083rem;\n    padding-top: 1rem; }\n  .add-upload-desc p {\n    color: #999;\n    padding-top: 1.167rem; }\n\n.add-upload {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/can-upload.png\") no-repeat center center;\n  background-size: 30%;\n  width: 5rem;\n  height: 5rem;\n  border: 1px dashed #ccc;\n  position: relative;\n  -webkit-border-radius: .25rem;\n          border-radius: .25rem;\n  overflow: hidden; }\n  .add-upload img {\n    width: 100%;\n    height: 100%; }\n\n.add-noupload {\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/no-upload.png\") no-repeat center center;\n  background-size: 30%; }\n  .add-noupload .file-input {\n    z-index: -1; }\n\n.file-input {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0; }\n\n.upload-show-wrap {\n  padding: 1.33rem; }\n  .upload-show-wrap li {\n    width: 5rem;\n    height: 5rem;\n    position: relative; }\n    .upload-show-wrap li span {\n      position: absolute;\n      left: 0;\n      top: 0;\n      line-height: 5rem;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.5);\n      color: #fff;\n      text-align: center;\n      font-size: .83rem; }\n    .upload-show-wrap li img {\n      width: 100%;\n      height: 100%;\n      display: block;\n      -webkit-border-radius: .25rem;\n              border-radius: .25rem; }\n    .upload-show-wrap li .delete-icon {\n      z-index: 1;\n      width: 1.083rem;\n      height: 1.083rem;\n      position: absolute;\n      right: -.5rem;\n      top: -.5rem; }\n\n.verify-list {\n  padding: 3.75rem 1.33rem 1.33rem;\n  line-height: 3.33rem;\n  font-size: 1.083rem;\n  color: #333; }\n\ninput::-webkit-input-placeholder {\n  color: #999; }\n\n.verify-list-item {\n  display: block;\n  width: 100%;\n  line-height: 3.33rem;\n  background: none;\n  position: relative;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1); }\n", ""]);

// exports


/***/ },

/***/ 588:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(572);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./taskDetailSpecial.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./taskDetailSpecial.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});