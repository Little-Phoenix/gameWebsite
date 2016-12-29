webpackJsonp([29],{

/***/ 453:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _taskContainer = __webpack_require__(556);

var _taskContainer2 = _interopRequireDefault(_taskContainer);

var _task = __webpack_require__(477);

var _task2 = _interopRequireDefault(_task);

__webpack_require__(590);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'task', reducer: _task2.default });
	cb(null, _taskContainer2.default);
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

/***/ 464:
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

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Guide = function (_React$Component) {
	(0, _inherits3.default)(Guide, _React$Component);

	function Guide(props) {
		(0, _classCallCheck3.default)(this, Guide);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Guide).call(this, props));

		_this.guideImage = _this.props.guideImage;
		_this.swipe = {};
		_this.run = _this.run.bind(_this);
		_this.prev = _this.prev.bind(_this);
		_this.next = _this.next.bind(_this);
		_this.close = _this.close.bind(_this);
		_this.guideClose = _this.guideClose.bind(_this);
		_this.alreadySet = _this.alreadySet.bind(_this);
		// this.toSet = this.toSet.bind(this)
		_this.guideClassName = 'ios9-guide';
		_this.taskResetProgress = {
			ready: true,
			finish: false,
			index: 0,
			steps: ['第一步', '第二步', '第三步', '去设置']
		};
		return _this;
	}

	(0, _createClass3.default)(Guide, [{
		key: 'run',
		value: function run() {
			var that = this;
			var props = this.props;
			var user = _storage2.default.local.get('user') || 'noUserInfo';
			var runProgress = void 0;
			if (props.guideImage.type === 'tasks') {
				(0, _util.logEvent)('ios10_to_set', user);
				runProgress = {
					ready: false,
					finish: false,
					index: 0,
					steps: ['第一步', '第二步', '第三步', '去设置']
				};
			} else {
				runProgress = {
					ready: false,
					finish: false,
					index: 0,
					steps: ['第一步', '第二步', '去设置']
				};
			}

			props.valChange(runProgress, 'progress');
			// if (_this.swipe.getNumSlides) return
			that.swipe = new _swipe2.default(document.getElementById('guide-swipe'), {
				continuous: false,
				disableScroll: true,
				stopPropagation: true,
				callback: function callback(index) {
					if (props.guideImage.type === 'tasks') {
						props.valChange({
							ready: false,
							finish: index === props.progress.steps.length - 1,
							index: index,
							steps: ['第一步', '第二步', '第三步', '去设置']
						}, 'progress');
					} else {
						props.valChange({
							ready: false,
							finish: index === props.progress.steps.length - 1,
							index: index,
							steps: ['第一步', '第二步', '去设置']
						}, 'progress');
					}
				}
			});
		}
	}, {
		key: 'prev',
		value: function prev() {
			this.swipe.prev();
		}
	}, {
		key: 'next',
		value: function next() {
			this.swipe.next();
		}
	}, {
		key: 'close',
		value: function close() {
			this.props.valChange(false, 'guideStatus');
			this.guideClose();
		}
	}, {
		key: 'guideClose',
		value: function guideClose() {
			var resetProgress = {
				ready: true,
				finish: false,
				index: 0,
				steps: ['第一步', '第二步', '去设置']
			};
			this.props.valChange(resetProgress, 'progress');
		}

		// toSet() {
		// 	setTimeout(() => {
		// 		this.alreadySet()
		// 	}, 1000)
		// 	location.href = 'app-settings:'
		// }

	}, {
		key: 'alreadySet',
		value: function alreadySet() {
			var user = _storage2.default.local.get('user') || 'noUserInfo';
			(0, _util.logEvent)('ios10_already_set', user);
			this.props.valChange(false, 'guideStatus');
			this.props.valChange(this.taskResetProgress, 'progress');
			this.props.justConnect();
			setTimeout(function () {
				location.reload();
			}, 500);
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var swipeStartEle = void 0;
			if (props.guideImage.type === 'tasks') {
				this.guideClassName = 'ios9-guide ios10-guide';
				swipeStartEle = props.progress.ready ? _react2.default.createElement(
					'div',
					{ className: 'tasks-swipe-start' },
					_react2.default.createElement('img', { src: this.guideImage.start, alt: 'ios10引导' }),
					_react2.default.createElement(
						'span',
						{ onClick: this.run },
						'设置两步走'
					)
				) : '';
			} else {
				swipeStartEle = props.progress.ready ? _react2.default.createElement(
					'div',
					{ className: 'swipe-start' },
					_react2.default.createElement(
						'div',
						{ className: 'swipe-start-wrap' },
						_react2.default.createElement('img', { src: this.guideImage.start, alt: 'ios9引导' }),
						_react2.default.createElement(
							'h2',
							null,
							'致iOS9用户'
						),
						_react2.default.createElement(
							'p',
							null,
							'试玩团是一款企业级应用'
						),
						_react2.default.createElement(
							'p',
							null,
							'iOS9用户需设置后才能正常使用'
						),
						_react2.default.createElement(
							'span',
							{ onClick: this.run },
							'设置两步走'
						)
					)
				) : '';
			}

			var modalContainerEle = void 0;
			var modalContainerEle1 = _react2.default.createElement(
				'div',
				{ id: 'guide-swipe', className: 'swipe modal-container' },
				_react2.default.createElement(
					'div',
					{ className: 'swipe-wrap' },
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement('img', { src: this.guideImage.step1, alt: 'step1' }),
						_react2.default.createElement(
							'p',
							null,
							'通过最后一页“去设置”按钮前往'
						)
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement('img', { src: this.guideImage.step2, alt: 'step2' }),
						_react2.default.createElement(
							'p',
							null,
							'找到“试玩团”对应的企业名称'
						)
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'p',
							null,
							'设置两步走，简单不简单？'
						),
						_react2.default.createElement(
							'p',
							null,
							'红包在招手！快快动起来~'
						),
						_react2.default.createElement(
							'a',
							{ href: this.guideImage.settingScheme },
							'戳我去设置'
						)
					)
				),
				props.progress.index && _react2.default.createElement('img', { className: 'swipe-prev', src: this.guideImage.arrowPrev, onClick: this.prev, alt: 'prev' }),
				props.progress.finish || _react2.default.createElement('img', { className: 'swipe-next', src: this.guideImage.arrowNext, onClick: this.next, alt: 'next' }),
				_react2.default.createElement(
					'div',
					{ className: 'swipe-step', id: 'swipe-step' },
					props.progress.steps.map(function (item, index) {
						_react2.default.createElement(
							'label',
							{ className: props.progress.index >= index && 'finish' },
							item,
							_react2.default.createElement('span', null)
						);
					})
				)
			);

			var modalContainerEle2 = _react2.default.createElement(
				'div',
				{ id: 'guide-swipe', className: 'swipe modal-container tasks-modal-container' },
				_react2.default.createElement(
					'div',
					{ className: 'swipe-wrap tasks-swipe-wrap' },
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement('img', { src: this.guideImage.step1, alt: 'step1' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement('img', { src: this.guideImage.step2, alt: 'step2' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement('img', { src: this.guideImage.step3, alt: 'step3' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement('img', { src: this.guideImage.end, alt: 'end' }),
						_react2.default.createElement(
							'span',
							{ className: 'already-set', onClick: this.alreadySet },
							'已完成设置'
						)
					)
				)
			);

			if (props.guideImage.type === 'tasks') {
				modalContainerEle = modalContainerEle2;
			} else {
				modalContainerEle = modalContainerEle1;
			}

			var guideCloseEle = props.progress.finish && props.guideImage.type !== 'tasks' ? _react2.default.createElement('img', {
				src: this.guideImage.close,
				className: 'intro_close',
				onClick: this.close, alt: 'close'
			}) : '';

			return _react2.default.createElement(
				'div',
				{ className: this.guideClassName },
				_react2.default.createElement(
					'div',
					{ className: 'modal' },
					swipeStartEle,
					modalContainerEle,
					guideCloseEle
				)
			);
		}
	}]);
	return Guide;
}(_react2.default.Component);

Guide.propTypes = {
	guideInfo: _react.PropTypes.array,
	valChange: _react.PropTypes.func.isRequired,
	progress: _react.PropTypes.object.isRequired,
	guideStatus: _react.PropTypes.bool.isRequired,
	guideImage: _react.PropTypes.object.isRequired,
	justConnect: _react.PropTypes.func,
	fetchList: _react.PropTypes.func
};
exports.default = Guide;

/***/ },

/***/ 465:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _guide = __webpack_require__(464);

var _guide2 = _interopRequireDefault(_guide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _guide2.default;

/***/ },

/***/ 466:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mask = __webpack_require__(467);

var _mask2 = _interopRequireDefault(_mask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _mask2.default;

/***/ },

/***/ 467:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

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

var Mask = function (_React$Component) {
	(0, _inherits3.default)(Mask, _React$Component);

	function Mask() {
		(0, _classCallCheck3.default)(this, Mask);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Mask).apply(this, arguments));
	}

	(0, _createClass3.default)(Mask, [{
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				"div",
				{ className: "mask" },
				_react2.default.createElement("img", { src: "http://cc-cdn.dianjoy.com/91atm/images/mask.png", alt: "mask" })
			);
		}
	}]);
	return Mask;
}(_react2.default.Component);

exports.default = Mask;

/***/ },

/***/ 472:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _share = __webpack_require__(473);

var _share2 = _interopRequireDefault(_share);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _share2.default;

/***/ },

/***/ 473:
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

var Share = function (_React$Component) {
	(0, _inherits3.default)(Share, _React$Component);

	function Share() {
		(0, _classCallCheck3.default)(this, Share);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Share).apply(this, arguments));
	}

	(0, _createClass3.default)(Share, [{
		key: 'render',
		value: function render() {
			var props = this.props;
			var sharePlatformClass = 'share-platform';
			if (props.shareStatus) {
				sharePlatformClass += ' share-platform-show';
			}
			return _react2.default.createElement(
				'div',
				{ className: sharePlatformClass, onClick: props.hideShare },
				_react2.default.createElement(
					'div',
					{ className: 'share-wrapper' },
					_react2.default.createElement(
						'div',
						{ className: 'share-pan' },
						_react2.default.createElement(
							'p',
							{ className: 'border-bottom' },
							'分享到'
						),
						_react2.default.createElement(
							'ul',
							null,
							_react2.default.createElement('li', {
								'data-content': '微信好友',
								onClick: props.infoShare.bind(this, 'wechat'),
								className: 'share-wechat'
							}),
							_react2.default.createElement('li', {
								'data-content': '朋友圈',
								onClick: props.infoShare.bind(this, 'moments'),
								className: 'share-moments'
							}),
							_react2.default.createElement('li', {
								'data-content': 'QQ好友',
								onClick: props.infoShare.bind(this, 'qq'),
								className: 'share-qq'
							}),
							_react2.default.createElement('li', {
								'data-content': 'QQ空间',
								onClick: props.infoShare.bind(this, 'qzone'),
								className: 'share-qzone'
							})
						)
					),
					_react2.default.createElement(
						'div',
						{ onClick: props.toggleShare.bind(this, 'hide'), className: 'share-cancel' },
						'取消'
					)
				)
			);
		}
	}]);
	return Share;
}(_react2.default.Component);

Share.propTypes = {
	infoShare: _react.PropTypes.func.isRequired,
	hideShare: _react.PropTypes.func.isRequired,
	toggleShare: _react.PropTypes.func.isRequired,
	shareStatus: _react.PropTypes.bool.isRequired,
	modalOpen: _react.PropTypes.func
};
Share.defaultProps = {
	shareStatus: false
};
exports.default = Share;

/***/ },

/***/ 477:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = taskReducer;

var _reducers = __webpack_require__(23);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var keyInfoStr = _storage2.default.local.get('91atm');
var keyInfo = void 0;
if (keyInfoStr && keyInfoStr !== 'null' && keyInfoStr !== 'undefined' && keyInfoStr[0] === '{') {
	keyInfo = JSON.parse(keyInfoStr);
}

var initialState = {
	isLoading: false,
	isReload: true,
	inited: false, // 防止重复请求
	downloadUrl: '',
	modal: {},
	modalState: false,
	scrollBannerInfo: {
		scroll: [],
		banner: [],
		exchange: [],
		p_success: -1
	},
	tasks: {},
	isOnline: false, // 是否在线
	userInfo: {}, // get from web/token
	versionInfo: {}, // get from download info
	keyInfo: keyInfo || {}, // get from key or localStorage
	userHasClicked: false, // user has click anything
	ongoing: null,
	taskNoteAlready: JSON.parse(_storage2.default.session.get('taskNoteAlready')) || false,
	hasPopInvite: JSON.parse(_storage2.default.local.get('hasPopInvite')) || false,
	taskPopWay: 'firstAccount',
	hasNoTaskPop: JSON.parse(_storage2.default.session.get('hasNoTaskPop')) || false,
	hasFirstFinishPop: JSON.parse(_storage2.default.local.get('hasFirstFinishPop')) || false,
	guideStatus: false,
	progress: {
		ready: true,
		finish: false,
		index: 0,
		steps: ['第一步', '第二步', '第三步', '去设置']
	},
	guideImage: {
		type: 'tasks',
		start: 'http://cc-cdn.dianjoy.com/91atm/images/ios10_1.png',
		step1: 'http://cc-cdn.dianjoy.com/91atm/images/ios10_2.png',
		step2: 'http://cc-cdn.dianjoy.com/91atm/images/ios10_3.png',
		step3: 'http://cc-cdn.dianjoy.com/91atm/images/ios10_4.png',
		end: 'http://cc-cdn.dianjoy.com/91atm/images/ios10_5.png',
		settingScheme: 'app-settings:',
		arrowPrev: 'http://cc-cdn.dianjoy.com/91atm/images/arrow_left.png',
		arrowNext: 'http://cc-cdn.dianjoy.com/91atm/images/arrow_right.png',
		close: 'http://cc-cdn.dianjoy.com/91atm/images/bengchacha.png'
	},
	shareStatus: false,
	infoShareData: {},
	canShare: false,
	treasureStatus: false,
	hasTreasureSlide: false
};

function taskReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 487:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scroll = __webpack_require__(488);

var _scroll2 = _interopRequireDefault(_scroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _scroll2.default;

/***/ },

/***/ 488:
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

var Scroll = function (_React$Component) {
	(0, _inherits3.default)(Scroll, _React$Component);

	function Scroll() {
		(0, _classCallCheck3.default)(this, Scroll);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Scroll).apply(this, arguments));
	}

	(0, _createClass3.default)(Scroll, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps() {
			var scrollLen = this.props.scrollInfo.length;
			if (scrollLen && !document.getElementById('head-scroll')) {
				this.autoScroll(this.refs.aniEle, scrollLen);
			}
		}
	}, {
		key: 'autoScroll',
		value: function autoScroll(ele, length) {
			var keyframesString = this.keyframesSegment(length);
			var styleEle = document.createElement('style');
			styleEle.id = 'head-scroll';
			styleEle.type = 'text/css';
			styleEle.innerHTML = '.animation-class{-webkit-animation: scroll-info ' + 3 * length + 's ease 2s infinite;animation: scroll-info ' + 3 * length + 's ease 2s infinite}@-webkit-keyframes scroll-info{' + keyframesString + '}@keyframes scroll-info{' + keyframesString + '}';
			document.querySelector('head').appendChild(styleEle);
		}
	}, {
		key: 'keyframesSegment',
		value: function keyframesSegment(num) {
			var unit = 100 / num;
			var keyframesString = '';
			var endePer = void 0;
			for (var item = 0; item <= num; item++) {
				endePer = unit * (item + 1);
				if (endePer > 100) {
					endePer = 100;
				}
				if (item * unit === 100) return keyframesString;
				keyframesString += parseInt(item * unit) + '%,' + parseInt(endePer) + '%{-webkit-transform: translateY(-' + 3.17 * item + 'rem) translateZ(0);transform: translateY(-' + 3.17 * item + 'rem) translateZ(0);}';
			}
			return keyframesString;
		}
	}, {
		key: 'render',
		value: function render() {
			var broadEle = void 0;
			var infosEle = void 0;
			var initInfoEle = void 0;
			var aniClass = void 0;
			var renderInfoEle = function renderInfoEle(info, index) {
				return _react2.default.createElement(
					'p',
					{ key: index, className: 'success' },
					_react2.default.createElement(
						'span',
						null,
						info.user
					),
					'成功完成',
					info.ad_name,
					',',
					_react2.default.createElement(
						'span',
						{ className: 'progress' },
						info.price
					),
					'元现金到手。'
				);
			};
			var firstInfo = this.props.scrollInfo[0];
			if (firstInfo && firstInfo.user) {
				aniClass = 'horn-info animation-class';
				broadEle = _react2.default.createElement('span', { className: 'broadcast' });

				initInfoEle = renderInfoEle(firstInfo, 0);
				infosEle = this.props.scrollInfo.map(function (item, index) {
					if (!item.user) return null;
					return renderInfoEle(item, index);
				});
			} else {
				aniClass = 'horn-info';
			}

			return _react2.default.createElement(
				'div',
				{ className: 'horn-wrap' },
				_react2.default.createElement(
					'div',
					{ className: aniClass, ref: 'aniEle' },
					infosEle,
					initInfoEle
				),
				broadEle
			);
		}
	}]);
	return Scroll;
}(_react2.default.Component);

Scroll.propTypes = {
	scrollInfo: _react.PropTypes.array
};
exports.default = Scroll;

/***/ },

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function activityToInvite(props) {
	if (props.canShare) {
		props.toggleShare();
	} else {
		props.directTo('/invite');
	}
	(0, _util.logEvent)('dragonToInvite');
}
var ActivityEle = function ActivityEle(props) {
	return _react2.default.createElement(
		'div',
		{ className: 'activity-wrap', onClick: activityToInvite.bind(undefined, props) },
		_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/dragon.png', alt: '' })
	);
};

ActivityEle.propTypes = {
	directTo: _react.PropTypes.func.isRequired,
	toggleShare: _react.PropTypes.func.isRequired,
	canShare: _react.PropTypes.bool.isRequired
};

exports.default = ActivityEle;

/***/ },

/***/ 547:
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

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CloudNote = function (_React$Component) {
	(0, _inherits3.default)(CloudNote, _React$Component);

	function CloudNote(props) {
		(0, _classCallCheck3.default)(this, CloudNote);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CloudNote).call(this, props));

		_this.closeNote = _this.closeNote.bind(_this);
		_this.taskNoteAlready = _storage2.default.session.get('task_note_already') || false;
		return _this;
	}

	(0, _createClass3.default)(CloudNote, [{
		key: 'closeNote',
		value: function closeNote() {
			(0, _util.logEvent)('close_tasknote');
			var that = this;
			var task_note_animate_item = document.querySelector('.task-note-animate');
			task_note_animate_item.style.transition = 'all .5s ease';
			task_note_animate_item.style.webkitTransition = 'all .5s ease';
			task_note_animate_item.style.transform = 'translateY(-' + task_note_animate_item.offsetHeight + 'px)';
			task_note_animate_item.style.webkitTransform = 'translateY(-' + task_note_animate_item.offsetHeight + 'px)';
			task_note_animate_item.style.height = 0;

			setTimeout(function () {
				that.props.valChange(true, 'taskNoteAlready');
				_storage2.default.session.set('taskNoteAlready', true);
			}, 500);
		}
	}, {
		key: 'render',
		value: function render() {
			var cloudNoteInfo = this.props.cloudInfo[0];
			cloudNoteInfo.url = cloudNoteInfo.url || 'javascript:;';
			var taskNoteClass = 'task-note';
			if (this.refs.taskNote) {
				taskNoteClass = 'task-note task-note-animate';
				var task_note_item = document.querySelector('.task-note');
				if (!task_note_item) return;
				task_note_item.style.height = task_note_item.offsetHeight + 'px';
			}
			return _react2.default.createElement(
				'div',
				{ className: taskNoteClass, ref: 'taskNote' },
				_react2.default.createElement('a', { className: 'task-note-href', href: cloudNoteInfo.url, dangerouslySetInnerHTML: {
						__html: cloudNoteInfo.content } }),
				_react2.default.createElement(
					'div',
					{ className: 'close-btn', onClick: this.closeNote },
					_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/close-btn.png', alt: 'close' })
				)
			);
		}
	}]);
	return CloudNote;
}(_react2.default.Component);

CloudNote.propTypes = {
	cloudInfo: _react.PropTypes.array.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	taskNoteAlready: _react.PropTypes.bool.isRequired,
	fetchList: _react.PropTypes.func.isRequired
};
exports.default = CloudNote;

/***/ },

/***/ 549:
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

function expireFormat(num) {
	var expireSec = num;
	if (expireSec - 0) {
		expireSec = Math.floor(expireSec);
		expireSec = (0, _util.toDou)(Math.floor(expireSec / 60)) + ':' + (0, _util.toDou)(expireSec % 60);
	}
	return expireSec;
}

var DeepList = function (_React$Component) {
	(0, _inherits3.default)(DeepList, _React$Component);

	function DeepList(props) {
		(0, _classCallCheck3.default)(this, DeepList);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DeepList).call(this, props));

		_this.taskHandle = _this.taskHandle.bind(_this);
		_this.openItemApp = _this.openItemApp.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(DeepList, [{
		key: 'taskHandle',
		value: function taskHandle(currentTask) {
			var props = this.props;
			// user has clicked
			if (!props.isOnline) {
				props.valChange(true, 'userHasClicked');
				return;
			}
			if (currentTask.task_status === 2) {
				this.waitPopFn();
				return;
			}
			if (!props.ongoing || currentTask.ongoing && currentTask.ongoing > 0) {
				if (currentTask.task_status === 1) {
					props.enterItem(currentTask, 2);
				} else if (currentTask.task_status === 2) {
					props.deepModal();
				}
			} else {
				props.giveUp(currentTask, 2);
			}
			return;
		}
	}, {
		key: 'waitPopFn',
		value: function waitPopFn() {
			this.props.deepModal();
		}
	}, {
		key: 'openItemApp',
		value: function openItemApp(item, e) {
			e.stopPropagation();
			if (item.task_status === 1) {
				this.props.openApp(item);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				{ className: 'task-list-wrap deep-list-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-list-title' },
					'深度任务',
					_react2.default.createElement(
						'span',
						{ className: 'success' },
						'只有时间规定的那天才能获得奖励哦！'
					)
				),
				_react2.default.createElement(
					'ul',
					{ className: 'list-base task-list-base' },
					this.props.listData.map(function (item, index) {
						var taskStateEle = void 0;
						var listPriceEle = void 0;
						var playState = void 0;
						if (item.task_status === 1) {
							playState = _react2.default.createElement(
								'span',
								{ className: 'open-app' },
								'深度试玩'
							);
						} else if (item.task_status === 2) {
							playState = _react2.default.createElement(
								'span',
								{ className: 'open-app wait-open' },
								'等待开始'
							);
						}

						if (!item.expire_sec) {
							if (item.task_status === 1) taskStateEle = _react2.default.createElement(
								'p',
								null,
								'任务开始，快来试玩'
							);
							if (item.task_status === 2 && item.due_date) taskStateEle = _react2.default.createElement(
								'p',
								null,
								item.due_date,
								' 开始'
							);
						}
						if (item.ongoing && _this2.props.ongoing) {
							taskStateEle = _react2.default.createElement(
								'p',
								{ className: 'rem-info' },
								'剩余',
								expireFormat(_this2.props.ongoing)
							);
							listPriceEle = _react2.default.createElement(
								'div',
								{ onClick: _this2.openItemApp.bind(_this2, item), className: 'list-price' },
								_react2.default.createElement(
									'span',
									{ className: 'open-app' },
									'开始任务'
								)
							);
						} else {
							listPriceEle = _react2.default.createElement(
								'div',
								{ className: 'list-price' },
								playState
							);
						}

						return _react2.default.createElement(
							'li',
							{ onClick: _this2.taskHandle.bind(_this2, item), key: index, className: item.itemClass },
							_react2.default.createElement(
								'div',
								{ className: 'list-icon' },
								_react2.default.createElement('img', { alt: '', src: item.icon })
							),
							_react2.default.createElement(
								'div',
								{ className: 'list-content' },
								_react2.default.createElement(
									'h3',
									null,
									item.name
								),
								taskStateEle
							),
							listPriceEle
						);
					})
				)
			);
		}
	}]);
	return DeepList;
}(_react2.default.Component);

DeepList.propTypes = {
	listData: _react.PropTypes.array,
	openApp: _react.PropTypes.func.isRequired,
	deepModal: _react.PropTypes.func.isRequired,
	ongoing: _react.PropTypes.number,
	enterItem: _react.PropTypes.func.isRequired,
	giveUp: _react.PropTypes.func.isRequired
};
DeepList.defaultPropTypes = {
	listData: []
};
exports.default = DeepList;

/***/ },

/***/ 550:
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

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExpensiveList = function (_Component) {
	(0, _inherits3.default)(ExpensiveList, _Component);

	function ExpensiveList(props) {
		(0, _classCallCheck3.default)(this, ExpensiveList);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ExpensiveList).call(this, props));

		_this.handleSpecialTask = _this.handleSpecialTask.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(ExpensiveList, [{
		key: 'handleSpecialTask',
		value: function handleSpecialTask(currentTask) {
			var props = this.props;
			var ongoingItem = props.ongoingItem || {};
			function filter() {
				props.resetOngoing();
				_storage2.default.session.remove('specialOngoing');
				setTimeout(props.getTasks, 10);
			}
			function confirmGiveUp() {
				if (ongoingItem.type === 'atm_offers') {
					props.fetchList('/trial/atm_task/' + ongoingItem.task_id + '/', { method: 'DELETE' }, undefined, filter);
				} else {
					props.fetchList('/trial/task/' + ongoingItem.task_id + '/', { method: 'DELETE' }, undefined, filter);
				}
				props.valChange(null, 'ongoing');
				_storage2.default.local.remove('hasGetSpecialTask');
			}
			function cancelGiveUp() {
				if (props.ongoingItem.type === 'atm_offers') {
					_storage2.default.local.set('specialOngoing', (0, _stringify2.default)(props.ongoingItem));
					props.directTo('/taskdetail-special');
				} else {
					props.directTo('/task-detail');
				}
			}
			if (props.ongoingItem.task_id && !currentTask.ongoing) {
				props.modalOpen({
					content: '确认放弃当前未完成的任务吗?',
					confirm: '继续任务',
					confirmCallback: cancelGiveUp,
					cancel: '放弃任务',
					cancelCallback: confirmGiveUp
				});
			} else {
				_storage2.default.local.set('specialOngoing', (0, _stringify2.default)(currentTask));
				// 保存广告形式
				_storage2.default.local.set('adType', currentTask.ad_type);
				// hasGetSpecialTask
				if (!currentTask.committed && !currentTask.ongoing) {
					_storage2.default.local.remove('hasGetSpecialTask');
				}
				props.directTo('/taskdetail-special');
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var props = this.props;
			return _react2.default.createElement(
				'div',
				{ className: 'task-list-wrap expensive-list-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-list-title' },
					'高额任务'
				),
				_react2.default.createElement(
					'ul',
					{ className: 'list-base task-list-base' },
					props.listData.map(function (item, index) {
						var wordInfo = item.desc;
						var wordInfoClass = void 0;
						if (item.expire_sec && props.ongoing) {
							wordInfo = '剩余' + (0, _util.expireFormat)(props.ongoing || item.expire_sec);
							wordInfoClass = 'rem-info';
						}
						return _react2.default.createElement(
							'li',
							{
								key: index,
								className: 'border-bottom',
								onClick: _this2.handleSpecialTask.bind(_this2, item)
							},
							_react2.default.createElement(
								'div',
								{ className: 'list-icon' },
								_react2.default.createElement('img', { alt: '', src: item.icon })
							),
							_react2.default.createElement(
								'div',
								{ className: 'list-content' },
								_react2.default.createElement(
									'h3',
									null,
									item.name
								),
								_react2.default.createElement(
									'p',
									{ className: wordInfoClass },
									wordInfo
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'list-price' },
								'+',
								_react2.default.createElement(
									'span',
									{ className: 'price' },
									item.price_desc
								),
								'元'
							)
						);
					})
				)
			);
		}
	}]);
	return ExpensiveList;
}(_react.Component);

ExpensiveList.propTypes = {
	directTo: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	fetchList: _react.PropTypes.func.isRequired,
	getTasks: _react.PropTypes.func.isRequired,
	listData: _react.PropTypes.array,
	ongoing: _react.PropTypes.number,
	resetOngoing: _react.PropTypes.func,
	ongoingItem: _react.PropTypes.object.isRequired
};
ExpensiveList.defaultPropTypes = {
	listData: [],
	ongoingItem: {}
};
exports.default = ExpensiveList;

/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = __webpack_require__(87);

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = __webpack_require__(88);

var _assign2 = _interopRequireDefault(_assign);

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

var _taskDataList = __webpack_require__(553);

var _taskDataList2 = _interopRequireDefault(_taskDataList);

var _deepList = __webpack_require__(549);

var _deepList2 = _interopRequireDefault(_deepList);

var _installedList = __webpack_require__(552);

var _installedList2 = _interopRequireDefault(_installedList);

var _expensiveList = __webpack_require__(550);

var _expensiveList2 = _interopRequireDefault(_expensiveList);

var _scroll = __webpack_require__(487);

var _scroll2 = _interopRequireDefault(_scroll);

var _wsConnect = __webpack_require__(462);

var _wsConnect2 = _interopRequireDefault(_wsConnect);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _ua = __webpack_require__(458);

var _ua2 = _interopRequireDefault(_ua);

var _util = __webpack_require__(86);

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

var _waitList = __webpack_require__(555);

var _waitList2 = _interopRequireDefault(_waitList);

var _cloudNote = __webpack_require__(547);

var _cloudNote2 = _interopRequireDefault(_cloudNote);

var _mask = __webpack_require__(466);

var _mask2 = _interopRequireDefault(_mask);

var _guide = __webpack_require__(465);

var _guide2 = _interopRequireDefault(_guide);

var _activity = __webpack_require__(546);

var _activity2 = _interopRequireDefault(_activity);

var _share = __webpack_require__(472);

var _share2 = _interopRequireDefault(_share);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import taskDataTest from '../../../../docs/task.json'

var taskEle = function (_Component) {
	(0, _inherits3.default)(taskEle, _Component);

	function taskEle(props) {
		(0, _classCallCheck3.default)(this, taskEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(taskEle).call(this, props));

		_this.enterItem = _this.enterItem.bind(_this);
		_this.openAppWork = _this.openAppWork.bind(_this);
		_this.openApp = _this.openApp.bind(_this);
		_this.giveUp = _this.giveUp.bind(_this);
		_this.tryConnect = _this.tryConnect.bind(_this);
		_this.justConnect = _this.justConnect.bind(_this);
		_this.getTasks = _this.getTasks.bind(_this);
		_this.hasClick = _this.hasClick.bind(_this);
		_this.noMove = _this.noMove.bind(_this);
		_this.resetOngoing = _this.resetOngoing.bind(_this);
		_this.deepModal = _this.deepModal.bind(_this);
		_this.closePopInvite = _this.closePopInvite.bind(_this);
		_this.closeBtnPopInvite = _this.closeBtnPopInvite.bind(_this);
		_this.toInvite = _this.toInvite.bind(_this);
		_this.checkDeviceId = _this.checkDeviceId.bind(_this);
		_this.collectTreasure = _this.collectTreasure.bind(_this);
		_this.enterTreasure = _this.enterTreasure.bind(_this);
		_this.setTime = null;
		_this.deepTaskRem = false;
		_this.ws = {};
		_this.keyData = '';
		_this.localUser = '';
		_this.localToken = '';
		_this.localHadUdid = '';
		_this.keyInfo = null;
		_this.taskPopImg = '';
		_this.deepTaskCan = false;
		_this.activityStatus = false;
		_this.infoShare = _this.infoShare.bind(_this);
		_this.hideShare = _this.hideShare.bind(_this);
		_this.toggleShare = _this.toggleShare.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(taskEle, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.activityJudg();
			var keyInfoStr = (0, _util.hasStorage)('91atm');
			var keyInfo = keyInfoStr && JSON.parse(keyInfoStr);
			if ((0, _util.versionCompare)(keyInfo.app_version, '1.9.0') > 0) {
				this.props.valChange(true, 'canShare');
			}
			this.props.valChange(false, 'isLoading');
			var hadUdid = false;
			if ((0, _util.hasStorage)('had_udid')) {
				hadUdid = JSON.parse(_storage2.default.local.get('had_udid')) || false;
			}
			if (hadUdid) this.props.valChange(false, 'treasureStatus');
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var that = this;
			var props = that.props;
			var inviter = '';
			if (location.search) {
				inviter = (0, _util.blurryTrim)('inviter') || location.search.slice(1).split('&')[0].split(':')[1].match(/\d+/);
			}
			// has inviter
			if (inviter) {
				_storage2.default.local.set('inviter', inviter);
				props.directTo('/down-invite?inviter=' + inviter);
				return;
			}
			// else {
			// 	$storage.local.remove('inviter')
			// }

			// wechat or android
			if (_ua2.default.isWeixin) {
				return;
			} else if (_ua2.default.isAndroid) {
				props.directTo('/hb-download');
				return;
			}

			this.refreshLocal();
			this.justConnect();

			function localUpdateModal() {
				that.updateModal(that.props.versionInfo);
			}
			setTimeout(localUpdateModal, 200);
			var ongoingSession = JSON.parse(_storage2.default.session.get('ongoing') || '{}');
			var hasGetSpecialTask = _storage2.default.local.get('hasGetSpecialTask');
			// reset modal
			if (this.props.modalState) {
				this.props.modalClose();
			}
			// reset ongoing
			if (this.props.ongoing) {
				this.props.valChange(null, 'ongoing');
			}
			// 刷新列表
			if (props.ongoing || ongoingSession && ongoingSession.ongoing && this.localHadUdid || hasGetSpecialTask) {
				this.getTasks(props.keyInfo);
			}

			if (this.props.inited) return;
			this.init();
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var props = this.props;
			var that = this;
			var copyAlready = _storage2.default.local.get('copyAlready');
			function setOngoing() {
				copyAlready = _storage2.default.local.get('copyAlready');
				if (nextProps.ongoing <= 0) {
					clearTimeout(that.setTime);
				}
				props.valChange(nextProps.ongoing - 1, 'ongoing');
			}

			if (nextProps.isOnline && !props.isOnline) {
				if (this.props.modalState) {
					this.props.modalClose();
				}
			}
			if (!nextProps.isOnline && props.isOnline) {
				this.offLineModal();
			}
			// TODO: 倒计时完, props.getTasks
			if (!isNaN(nextProps.ongoing) && nextProps.ongoing && nextProps.ongoing > 0) {
				if (that.setTime) {
					clearTimeout(that.setTime);
				}
				that.setTime = setTimeout(setOngoing, 1000);
			} else if (nextProps.ongoing !== props.ongoing && nextProps.ongoing <= 0 && !props.modalState) {
				clearTimeout(that.setTime);
				if (!copyAlready) {
					if (nextProps.ongoing === 0 && +_storage2.default.local.get('adType') === 3) {
						that.getTasks();
						return;
					}
					if (nextProps.ongoing === 0 && +_storage2.default.local.get('adType') !== 2 && +_storage2.default.local.get('adType') !== 3 && +_storage2.default.local.get('adType') !== 7) {
						props.modalOpen({
							content: '您在2分钟内，没有进行下一步操作，任务已经自动放弃，请您重新领取',
							confirm: '确认',
							confirmCallback: function confirmCallback() {
								that.getTasks();
							}
						});
					}
				} else {
					that.getTasks();
				}
			} else {
				clearTimeout(that.setTime);
			}
			if (nextProps.downloadUrl !== props.downloadUrl) {
				location.href = nextProps.downloadUrl;
			}
			// keyInfo update
			if (nextProps.keyInfo.package_name !== props.keyInfo.package_name || nextProps.keyInfo.app_version !== nextProps.keyInfo.app_version) {
				this.refreshLocal();
				this.getUserInfo(nextProps.keyInfo);
			}
			// TODO: keyInfo update, then get new client/download
			if (nextProps.userInfo && nextProps.userInfo.user !== props.userInfo.user && this.localHadUdid) {
				this.refreshLocal();
				this.getVersionInfo({ user: nextProps.userInfo.user });
				this.getAllList(props.keyInfo);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var that = this;
			function localUpdateModal() {
				that.updateModal(that.props.versionInfo);
			}
			setTimeout(localUpdateModal, 200);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.setTime) clearTimeout(this.setTime);
		}
	}, {
		key: 'getAllList',
		value: function getAllList(data) {
			var props = this.props;
			function scrollFilter(listData) {
				var scrollData = listData.scroll;
				if (!scrollData || !scrollData.length) return [];
				var result = scrollData.map(function (item) {
					return {
						ad_name: item.ad_name,
						user: item.user,
						price: (item.price / 100).toFixed(2)
					};
				});
				// 首次完成任务
				if (listData.exchange.length === 1 && !props.hasFirstFinishPop) {
					setTimeout(function () {
						return props.valChange('firstFinish', 'taskPopWay');
					}, 10);
				}
				return {
					scroll: result,
					banner: listData.banner,
					exchange: listData.exchange,
					p_success: listData.p_success
				};
			}
			this.getTasks(data);
			this.props.fetchList('/letter/inform/', undefined, 'scrollBannerInfo', scrollFilter);
		}
	}, {
		key: 'getTasks',
		value: function getTasks(data) {
			if (!this.localUser || !this.localToken) return;
			var that = this;
			var keyInfo = void 0;
			if ((0, _util.hasStorage)('91atm')) {
				keyInfo = JSON.parse(_storage2.default.local.get('91atm'));
			}
			var keyInfoItem = keyInfo || data || this.props.keyInfo || {};
			if (!keyInfoItem || !keyInfoItem.device_id) return;
			if (!that.checkDeviceId(keyInfoItem.device_id)) return;
			if (!this.props.isOnline) {
				(0, _util.logEvent)('offline_task');
			}
			var keyInfoParams = (0, _assign2.default)(keyInfoItem);
			keyInfoParams.chicken_version = '1.3';
			this.props.fetchList('/trial/', { method: 'POST',
				params: keyInfoParams,
				querys: {
					time: Date.now()
				}
			}, 'tasks', this.taskFilter.bind(this));
			// this.taskFilter()
			function toggleReload() {
				that.props.valChange(true, 'isReload');
			}
			setTimeout(toggleReload, 50);
		}
	}, {
		key: 'getUserInfo',
		value: function getUserInfo(data) {
			var that = this;
			var keyInfoItem = data || this.props.keyInfo || {};
			if ((0, _util.hasStorage)('91atm')) {
				keyInfoItem = JSON.parse(_storage2.default.local.get('91atm'));
			}

			if (!that.checkDeviceId(keyInfoItem.device_id)) return;
			if (this.localUser && this.localToken && this.localHadUdid || !keyInfoItem.device_id) return;
			var inviterInfo = (0, _util.blurryTrim)('inviter') || _storage2.default.local.get('inviter') || '';
			var params = {
				app_version: data.app_version,
				device_id: data.device_id,
				openid: data.openid,
				package_name: data.package_name,
				inviter: inviterInfo
			};
			function userInfoFilter(userData) {
				_storage2.default.local.set('had_udid', userData.had_udid);
				if (!userData.had_udid) {
					setTimeout(that.collectTreasure, 10);
				}
				if (userData.user && userData.token) {
					_storage2.default.local.set('user', userData.user);
					_storage2.default.local.set('token', userData.token);
				}
				return userData;
			}
			this.props.fetchList('/account/web/token/', {
				method: 'POST',
				params: params
			}, 'userInfo', userInfoFilter);
		}
	}, {
		key: 'taskFilter',
		value: function taskFilter(data) {
			var _this2 = this;

			// const data = taskDataTest
			if (data.code !== 200) return {};
			// the third place
			var inviteEle = {
				ad_id: 0,
				name: '邀请好友',
				desc: '好友试玩你拿钱，最高10元',
				icon: 'http://cc-cdn.dianjoy.com/91atm/images/icon.png',
				number: '1000'
			};

			// const oneAdEle = {
			// 	ad_id: 'c8e128f3ecda08165b6afdd0fc33bb76',
			// 	name: '一元微信红包秒到',
			// 	desc: '支付1分钱，微信红包秒到账',
			// 	icon: 'http://cc-cdn.dianjoy.com/91atm/images/wchat-task-icon.png',
			// 	number: '180'
			// }
			var resultData = {
				comeSoonList: [],
				comeSoonTotal: 0,
				ongoingItem: null,
				offers: [],
				cp_offers: [],
				task_offers: [],
				atm_offers: [],
				installed_offers: data.installed_offers || [],
				red: data.red
			};
			var that = this;
			function setInit() {
				that.props.valChange(true, 'inited');
			}
			setTimeout(setInit, 100);
			var cutDown = _storage2.default.session.get('cutDown') - 0;
			var deepData = [];
			if (data.task_offers && data.task_offers.length) {
				deepData = data.task_offers;
			}
			deepData.forEach(function (item) {
				if (item.tasks.length) {
					item.tasks.forEach(function (deepItem) {
						if (deepItem.task_status === 1 || !item.task_status && deepItem.task_status === 2) {
							item.href_params = deepItem.href_params;
							item.number = deepItem.step_rmb;
							item.ad_task_id = deepItem.ad_task_id;
							item.task_status = deepItem.task_status;
							item.due_date = deepItem.due_date;
						}
					});
				}

				if (item.uptime) {
					resultData.comeSoonTotal += item.number;
				}
				if (item.remain) {
					item.remain = +item.remain;
				}
				if (item.ongoing) {
					// 取消任务时恢复余量
					item.againRemain = item.remain;
					// 如果任务正在进行且余量为0，将余量置为1
					item.remain = item.remain || 1;
					item.type = 'task_offers';
					// 保存广告形式
					_storage2.default.local.set('adType', 2);
					// 保存正在进行的任务数据
					resultData.ongoingItem = item;

					// 如果倒计时为字符串
					// 如果倒计时小于0则置为0
					if (+item.expire_sec < 0) {
						item.expire_sec = 0;
					}
					// 舍去小数
					item.expire_sec = Math.floor(+item.expire_sec);
				} else if (!item.remian && !item.desc && item.uptime) {
					item.uptime = item.uptime || '16:00';
					resultData.comeSoonList.push(item);
				} else {
					resultData.task_offers.push(item);
				}

				// 4.如果不是invite项且余量为0  置为disable，不可点击
				item.classStr = item.desc || item.remain ? '' : 'disable';

				// 6.敬请期待时间
			});
			if (data.offers && data.offers.length) {
				data.offers.forEach(function (item) {
					if (item.uptime) {
						resultData.comeSoonTotal += item.number;
					}
					if (item.remain) {
						item.remain = +item.remain;
					}

					if (item.ongoing) {
						// 取消任务时恢复余量
						item.againRemain = item.remain;
						// 如果任务正在进行且余量为0，将余量置为1
						item.remain = item.remain || 1;
						item.type = 'offers';
						// 保存广告形式
						_storage2.default.local.set('adType', 0);
						// 保存正在进行的任务数据
						resultData.ongoingItem = item;

						// 如果倒计时为字符串
						// 如果倒计时小于0则置为0
						if (+item.expire_sec < 0) {
							item.expire_sec = 0;
						}
						// 舍去小数
						item.expire_sec = Math.floor(+item.expire_sec);
					} else if (!item.remain && !item.desc && item.uptime) {
						item.uptime = item.uptime || '16:00';
						resultData.comeSoonList.push(item);
					} else {
						resultData.offers.push(item);
					}

					// 4.如果不是invite项且余量为0  置为disable，不可点击
					item.classStr = item.desc || item.remain ? '' : 'disable';

					// 6.敬请期待时间
				});
			}

			// 【注册专区】  可进行的任务+敬请期待
			if (data.cp_offers && data.cp_offers.length) {
				data.cp_offers.forEach(function (item) {
					// 5. 敬请期待的金额
					if (item.uptime) {
						resultData.comeSoonTotal += item.number;
					}
					if (item.remain) {
						item.remain = +item.remain;
					}

					// 3.正在进行 ongoing为1
					if (item.ongoing) {
						item.againRemain = item.remain;
						// 如果任务正在进行且余量为0，将余量置为1
						item.remain = item.remain || 1;

						// 保存正在进行的任务数据
						item.type = 'cp_offers';
						resultData.ongoingItem = item;
						// 保存广告形式
						_storage2.default.local.set('adType', 1);

						// 如果倒计时为字符串
						item.expire_sec = +item.expire_sec || cutDown;
						// 如果倒计时小于0则置为0
						if (item.expire_sec < 0) {
							item.expire_sec = 0;
						}
						// 舍去小数
						item.expire_sec = Math.floor(item.expire_sec);
					} else if (!item.remian && !item.desc && item.uptime) {
						item.uptime = item.uptime || '16:00';
						resultData.comeSoonList.push(item);
					} else {
						resultData.cp_offers.push(item);
					}

					// 4.如果不是invite项且余量为0  置为disable，不可点击
					item.classStr = item.desc || item.remain ? '' : 'disable';

					// 6.敬请期待时间
				});
			}

			// 【 高额专区 】
			if (data.atm_offers && data.atm_offers.length) {
				data.atm_offers.forEach(function (item) {
					if (item.ongoing) {
						item.type = 'atm_offers';
						resultData.ongoingItem = item;
						// 保存广告形式
						_storage2.default.local.set('adType', 3);
						// 如果倒计时为字符串
						item.expire_sec = +item.expire_sec || cutDown;
						// 如果倒计时小于0则置为0
						if (item.expire_sec < 0) {
							item.expire_sec = 0;
						}
						// 舍去小数
						item.expire_sec = Math.floor(item.expire_sec);
					} else {
						resultData.atm_offers.push(item);
					}
				});
			}

			resultData.comeSoonList.sort(function (item1, item2) {
				return item2.number - item1.number;
			});

			function ongoingIdChange() {
				that.props.valChange(resultData.ongoingItem.expire_sec, 'ongoing');
			}
			if (!resultData.ongoingItem) {
				that.resetOngoing();
			} else {
				// init change
				setTimeout(ongoingIdChange, 1000);
				_storage2.default.session.set('ongoing', (0, _stringify2.default)(resultData.ongoingItem));
			}
			if (resultData.offers.length) {
				resultData.offers.sort(function (item1, item2) {
					return item2.number - item1.number;
				});
			}
			var ongoingCons = resultData.ongoingItem;
			if (ongoingCons) {
				resultData[ongoingCons.type].unshift(ongoingCons);
			}
			if (resultData.offers.length >= 2) {
				resultData.offers.splice(2, 0, inviteEle);
			} else {
				resultData.offers.push(inviteEle);
			}

			if (resultData.offers) {
				var offersTask = resultData.offers || [];
				var cpoffersTask = resultData.cp_offers || [];
				var firstOffersTask = offersTask[0] || {};
				var deepTask = resultData.task_offers || [];
				deepTask.forEach(function (item) {
					if (item.task_status === 1) {
						that.deepTaskCan = true;
					}
				});
				if (!firstOffersTask.ad_id && !cpoffersTask.length && !this.deepTaskCan && !resultData.atm_offers.length) {
					if (!this.props.hasNoTaskPop && _storage2.default.local.get('notaskGudieTime') < 3) {
						setTimeout(function () {
							return _this2.props.valChange('noTasks', 'taskPopWay');
						}, 10);
					}
				}
			}
			// resultData  任务日志
			// offers cp_offers comeSoonList task_offers installed_offers
			var taskTotalLog = {
				offersTotal: resultData.offers && resultData.offers.length - 1 || 0,
				cpOffersTotal: resultData.cp_offers && resultData.cp_offers.length || 0,
				comeSoonListTotal: resultData.comeSoonList && resultData.comeSoonList.length || 0,
				taskOffersTotal: resultData.task_offers && resultData.task_offers.length || 0,
				installedOffersTotal: resultData.installed_offers && resultData.installed_offers.length || 0
			};
			(0, _util.logEvent)('taskTotal&' + (0, _util.json2url)(taskTotalLog));
			return resultData;
		}
	}, {
		key: 'checkDeviceId',
		value: function checkDeviceId(deviceId) {
			var keyInfo = JSON.parse(_storage2.default.local.get('91atm') || '{}');
			var deviceIdInfo = keyInfo.device_id || deviceId;
			var deviceMatch = /[0\-]+/;
			if (deviceIdInfo && deviceIdInfo.match(deviceMatch) && deviceIdInfo.match(deviceMatch)[0].length === deviceIdInfo.length) {
				this.props.valChange(false, 'isReload');
				this.props.valChange(true, 'guideStatus');
				return false;
			}
			return true;
		}
	}, {
		key: 'collectTreasure',
		value: function collectTreasure() {
			// 搜集udid 宝箱
			var props = this.props;
			// const hadUdid = JSON.parse($storage.local.get('had_udid')) || false
			function changeBoxClass() {
				(0, _util.logEvent)('show_treasure');
				props.valChange(true, 'hasTreasureSlide');
			}
			if (!_storage2.default.local.get('treasureStatus')) {
				props.valChange(true, 'treasureStatus');
				setTimeout(changeBoxClass, 1000);
			} else {
				props.valChange(false, 'treasureStatus');
			}
		}
	}, {
		key: 'enterTreasure',
		value: function enterTreasure() {
			this.props.directTo('/task-detail#udid');
		}
	}, {
		key: 'justConnect',
		value: function justConnect() {
			this.ws = (0, _wsConnect2.default)(9098, this);
		}
	}, {
		key: 'tryConnect',
		value: function tryConnect() {
			if (this.ws.websocket_url) return;
			// if (Object.keys(this.ws).length) return
			this.ws = (0, _wsConnect2.default)(9098, this);
		}
	}, {
		key: 'offLineModal',
		value: function offLineModal() {
			var that = this;
			var keyData = void 0;
			if (this.keyData && this.keyData !== 'undefined' && this.keyData !== 'null') {
				keyData = JSON.parse(this.keyData);
			} else {
				keyData = {};
			}
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
		key: 'enterItem',
		value: function enterItem(item, adType) {
			if (!item.ongoing) {
				this.getTaskItem(item, adType);
				return;
			}
			var props = this.props;
			if (!props.isOnline) {
				this.offLineModal();
				return;
			}
			if (props.isLoading || props.modalState) return;
			var detailItem = (0, _extends3.default)({}, item, {
				expire_sec: props.ongoing,
				red: props.tasks.red
			});
			_storage2.default.session.set('ongoing', (0, _stringify2.default)(detailItem));
			if (props.ongoing) {
				_storage2.default.session.set('cutDown', props.ongoing);
			}
			// 保存广告形式
			_storage2.default.local.set('adType', adType);
			this.props.directTo('/task-detail');
		}
	}, {
		key: 'getTaskItem',
		value: function getTaskItem(item, adType) {
			var that = this;
			this.resetOngoing();
			var adTaskId = '';
			if (adType === 2 && item.tasks.length) {
				item.tasks.forEach(function (deepItem) {
					if (deepItem.task_status === 1) {
						adTaskId = deepItem.ad_task_id;
					}
				});
			}
			function toEnter() {
				// if error
				if (!that.props.modalState) {
					that.enterItem(item, adType);
				}
			}
			function taskDetailFilter(data) {
				if (data.ad_id) {
					item.ongoing = 1;
					setTimeout(toEnter, 50);
				}
			}
			var data = {
				user_id: this.localUser,
				ad_id: item.ad_id,
				ad_name: item.name,
				ad_icon: item.icon,
				price: item.number,
				needConfirmInstall: item.needConfirmInstall,
				ad_type: adType,
				device_id: item.device_id || '',
				ad_task_id: adTaskId || ''
			};
			this.props.fetchList('/trial/task/', { method: 'POST', params: data }, undefined, taskDetailFilter);
		}
	}, {
		key: 'refreshLocal',
		value: function refreshLocal() {
			this.localUser = _storage2.default.local.get('user');
			this.localToken = _storage2.default.local.get('token');
			if ((0, _util.hasStorage)('had_udid')) {
				this.localHadUdid = JSON.parse(_storage2.default.local.get('had_udid')) || false;
			}
			var localKeyInfo = _storage2.default.local.get('91atm');
			if (localKeyInfo && localKeyInfo !== 'null' && localKeyInfo !== 'undefined') {
				this.keyInfo = JSON.parse(localKeyInfo);
			}
			this.keyData = _storage2.default.local.get('keyData');
		}
	}, {
		key: 'giveUp',
		value: function giveUp() {
			// popup
			var that = this;
			var props = that.props;
			var tasks = props.tasks || {};
			var ongoingItem = tasks.ongoingItem || {};
			function reFresh() {
				that.getTasks();
			}
			function clearOngoing() {
				clearTimeout(that.setTime);
			}
			function giveUpCancel() {
				// that.tasks.ongoingItem
				var detailItem = (0, _extends3.default)({}, props.tasks.ongoingItem, {
					expire_sec: props.ongoing,
					red: props.tasks.red
				});
				var cutDown = props.ongoing || +_storage2.default.session.get('cutDown') || 2699;
				_storage2.default.session.set('ongoing', (0, _stringify2.default)(detailItem));
				_storage2.default.session.set('cutDown', cutDown);
				if (ongoingItem.type === 'atm_offers') {
					props.directTo('/taskdetail-special');
				} else {
					props.directTo('/task-detail');
				}
			}
			function giveUpConfirm() {
				clearOngoing();
				setTimeout(clearOngoing, 1000);
				props.valChange(null, 'ongoing');
				that.resetOngoing();
				function deleteFilter() {
					setTimeout(reFresh, 10);
					return null;
				}
				function deleteSpecialfilter() {
					_storage2.default.session.remove('cutDown');
					_storage2.default.local.remove('specialOngoing');
					_storage2.default.session.remove('ongoing');
					setTimeout(reFresh, 10);
				}

				if (ongoingItem.type === 'atm_offers') {
					props.fetchList('/trial/atm_task/' + ongoingItem.task_id + '/', { method: 'DELETE' }, undefined, deleteSpecialfilter);
				} else {
					props.fetchList('/trial/task/' + ongoingItem.task_id + '/', { method: 'DELETE' }, 'ongoing', deleteFilter);
				}
			}

			props.modalOpen({
				content: '确认放弃当前未完成的任务吗?',
				confirm: '继续任务',
				confirmCallback: giveUpCancel,
				cancel: '放弃任务',
				cancelCallback: giveUpConfirm
			});
		}
	}, {
		key: 'cutDownTime',
		value: function cutDownTime() {
			var oTarget = new Date();
			var iNow = oTarget.getTime();
			// 设置目标日期时间
			oTarget.setFullYear(2016, 4, 14);
			oTarget.setHours(0, 0, 0, 0);
			var iTarget = oTarget.getTime();
			if (iTarget - iNow < 0) {
				this.newGuide = false;
			}
		}
	}, {
		key: 'enterInvite',
		value: function enterInvite() {
			this.props.directTo('/invite');
		}
	}, {
		key: 'appDownload',
		value: function appDownload() {
			var ongoing = JSON.parse(_storage2.default.session.get('ongoing') || '{}');
			// app下载
			function downloadFilter() {
				var appSearch = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?mt=8&submit=edit&term=#software';
				var appUrl = ongoing.keywords ? appSearch : encodeURIComponent(ongoing.ad_url);
				var downloadUrl = ongoing.red ? ongoing.red + appUrl : decodeURIComponent(appUrl);
				return downloadUrl;
			}
			this.props.fetchList('/trial/task/download/?' + ongoing.href_params, undefined, 'downloadUrl', downloadFilter);
		}
	}, {
		key: 'openPopReminfo',
		value: function openPopReminfo() {
			var that = this;
			this.props.modalOpen({
				content: '<h5 class="wait-content">如果没安装应用，请下载安装后，回到试玩团重新打开。</h5>',
				confirm: '前往下载',
				cancel: '取消',
				classStr: 'popup-deep-wrap',
				confirmCallback: function confirmCallback() {
					that.appDownload();
				}
			});
		}
	}, {
		key: 'hasClick',
		value: function hasClick() {
			var props = this.props;
			props.valChange(true, 'userHasClicked');
			if (!props.isOnline) {
				this.offLineModal();
			}
		}
	}, {
		key: 'openAppWork',
		value: function openAppWork(item) {
			var _this3 = this;

			var that = this;
			var paramsInfo = void 0;
			// 旧版web端判断url_schema打开应用，并发送adclick   --ios9
			// 新版发送协议adOpen,客户端打开协议，不用判断schema
			if (+_storage2.default.local.get('isNewVersion') + 1) {
				paramsInfo = this.sendItemInfo(item);
				return this.ws.adOpen(paramsInfo);
			}

			if (item.url_schema) {
				(function () {
					location.href = item.url_schema;
					paramsInfo = _this3.sendItemInfo(item);
					_this3.ws.adClick(paramsInfo);
					// 判断是否能打开应用
					var begin = new Date();
					setTimeout(function () {
						if (new Date().getTime() - begin < 3000) {
							that.appDownload();
						} else {
							window.stop();
						}
					}, 2000);
				})();
			} else {
				paramsInfo = this.sendItemInfo(item);
				this.ws.adClick(paramsInfo);
				// 新版用户群，没有url_shcema，弹窗提示，不走app_store下载
				this.props.modalOpen({
					title: '',
					content: '请在桌面打开该应用并按要求试玩，即可获得奖励。'
				});
			}
		}
	}, {
		key: 'openApp',
		value: function openApp(item) {
			var that = this;
			(0, _util.logEvent)('click_open_play');
			// ios10 获取数据提示
			var ios10GetdataRem = _storage2.default.local.get('ios10GetdataRem');
			if (!ios10GetdataRem && _ua2.default.isIOS10) {
				this.props.modalOpen({
					title: '<h3>必须允许该任务APP使用</h3><h3>数据，否则无法获得奖励</h3>',
					content: 'showImg',
					confirm: '我知道了',
					cancel: '不再提示',
					imgSrc: 'http://cc-cdn.dianjoy.com/91atm/images/ios10-datarem.png',
					showImgClass: 'task-detail-showimg',
					popClassStr: 'popup-showimgbig-wrap',
					confirmCallback: function confirmCallback() {
						that.openAppWork(item);
					},
					cancelCallback: function cancelCallback() {
						_storage2.default.local.set('ios10GetdataRem', true); // 不再发送ios10获取数据提示
						that.openAppWork(item);
					}
				});
				return;
			}
			this.openAppWork(item);
		}
	}, {
		key: 'sendItemInfo',
		value: function sendItemInfo(item) {
			var hrefParams = item.href_params;
			hrefParams = (0, _util.trimKeyParams)(hrefParams, 'snuid');
			var snuid = (0, _util.hasStorage)('user') || '';
			var params = void 0;
			if (snuid) {
				params = hrefParams + '&snuid=' + snuid;
			} else {
				params = hrefParams;
			}
			return params;
		}
	}, {
		key: 'noMove',
		value: function noMove(e) {
			e.preventDefault();
			e.stopPropagation();
		}
	}, {
		key: 'updateModal',
		value: function updateModal(vData) {
			function confirmCallbackFun(url) {
				location.href = url;
				// TODO: downloading
			}
			if (!vData.is_new_user && vData.need_update) {
				this.props.modalOpen({
					content: '试玩团版本有更新，请下载最新版',
					confirm: '立即安装',
					confirmCallback: function confirmCallback() {
						confirmCallbackFun(vData.url);
					},

					isBlock: true
				});
			}
		}
	}, {
		key: 'getVersionInfo',
		value: function getVersionInfo(data) {
			var that = this;
			var props = that.props;
			function warnModal() {
				props.modalOpen({
					content: '服务器暂无可用的应用'
				});
			}
			function versionFilter() {
				var vData = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				that.tryConnect(vData.port, that);
				if (vData.msg) {
					setTimeout(warnModal, 10);
				} else {
					_storage2.default.local.set('keyData', (0, _stringify2.default)(vData));
					if (!vData.is_new_user && vData.need_update) {
						setTimeout(function () {
							that.updateModal(vData);
						}, 10);
					}
				}
				return vData;
			}
			this.props.fetchList('/firmware/client/download/', {
				querys: {
					package_name: that.keyInfo.package_name || '',
					version: that.keyInfo.app_version || '',
					user: _storage2.default.local.get('user') || data.user || ''
				} }, 'versionInfo', versionFilter);
		}
	}, {
		key: 'deepModal',
		value: function deepModal() {
			var that = this;
			if (that.deepTaskRem) {
				return;
			}
			this.props.modalOpen({
				content: '<h5 class="wait-content">您暂时还没有权限完成该任务，请在指定的时间内完成。</h5>',
				confirm: '我知道了',
				classStr: 'popup-deep-wrap',
				cancel: '不再提醒',
				cancelCallback: function cancelCallback() {
					that.deepTaskRem = true;
				}
			});
		}
	}, {
		key: 'resetOngoing',
		value: function resetOngoing() {
			_storage2.default.local.remove('adType');
			_storage2.default.session.remove('ongoing');
			_storage2.default.session.remove('cutDown');
			_storage2.default.local.remove('copyAlready');
		}
	}, {
		key: 'closeBtnPopInvite',
		value: function closeBtnPopInvite() {
			var _this4 = this;

			// firstAccount 首次提现成功 noTasks 空墙
			this.closePopInvite();
			if (this.props.taskPopWay === 'noTasks') {
				(0, _util.logEvent)('notaskCloseInvite');
			} else if (this.props.taskPopWay === 'firstAccount') {
				(0, _util.logEvent)('firstAccountCloseInvite');
			} else if (this.props.taskPopWay === 'firstFinish') {
				(0, _util.logEvent)('firstFinishCloseInvite');
			}
			setTimeout(function () {
				_this4.props.valChange(false, 'isLoading');
			}, 50);
		}
	}, {
		key: 'closePopInvite',
		value: function closePopInvite() {
			var notaskGudieTime = +_storage2.default.local.get('notaskGudieTime') || 0;
			var props = this.props;
			var taskPopWay = props.taskPopWay;
			if (taskPopWay === 'noTasks') {
				_storage2.default.local.set('notaskGudieTime', notaskGudieTime + 1);
				_storage2.default.local.set('hasNoTaskPop', true);
				props.valChange(true, 'hasNoTaskPop');
			} else if (taskPopWay === 'firstAccount') {
				_storage2.default.local.set('hasPopInvite', true);
				props.valChange(true, 'hasPopInvite');
			} else if (taskPopWay === 'firstFinish') {
				_storage2.default.local.set('hasFirstFinishPop', true);
				props.valChange(true, 'hasFirstFinishPop');
			}
			this.taskPopImg = '';
		}
	}, {
		key: 'toInvite',
		value: function toInvite() {
			var _this5 = this;

			var props = this.props;
			// tasks 空墙  invite  首次提现成功  firstFinish首次完成任务
			this.closePopInvite();
			if (this.props.taskPopWay === 'noTasks') {
				(0, _util.logEvent)('notaskToInvite');
			} else if (this.props.taskPopWay === 'firstAccount') {
				(0, _util.logEvent)('firstAccountToInnvite');
			} else if (props.taskPopWay === 'firstFinish') {
				(0, _util.logEvent)('firstFinishToInnvite');
			}
			setTimeout(function () {
				if (props.canShare) {
					_this5.toggleShare();
				} else {
					props.directTo('/invite');
				}
			}, 10);
		}
	}, {
		key: 'activityJudg',
		value: function activityJudg() {
			// 10.1活动是否出现
			var oDate = new Date();
			var oStart = new Date();
			oStart.setMonth(9, 1);
			oStart.setHours(0, 0);
			var oTarget = new Date();
			oTarget.setMonth(9, 8);
			oTarget.setHours(0, 0);
			if (oDate.getTime() >= oStart.getTime() && oDate.getTime() < oTarget.getTime()) {
				this.activityStatus = true;
			}
		}
	}, {
		key: 'infoShare',
		value: function infoShare(platform) {
			// 0_朋友圈；1_微信好友；2_qq空间；3_qq好友
			// wechat moments  qq  qzone
			(0, _util.logEvent)('task_share_' + platform);
			var platformNum = void 0;
			switch (platform) {
				case 'moments':
					platformNum = 0;
					break;
				case 'wechat':
					platformNum = 1;
					break;
				case 'qzone':
					platformNum = 2;
					break;
				case 'qq':
					platformNum = 3;
					break;
				default:
					platformNum = 1;
			}
			function infoShareDataFilter(data) {
				var infoShareData = {
					platform: platformNum,
					title: data.title || '',
					text: data.brief || '',
					shareURL: data.invite_url || '',
					imgURL: data.img_url || ''
				};
				location.href = 'nwshare://?' + (0, _util.json2url)(infoShareData);
				return infoShareData;
			}
			this.props.fetchList('/firmware/client/invite/', undefined, 'infoShareData', infoShareDataFilter);
			setTimeout(this.toggleShare, 20);
		}
	}, {
		key: 'hideShare',
		value: function hideShare(e) {
			if (e.target.className === 'share-platform share-platform-show') {
				this.toggleShare();
			}
		}
	}, {
		key: 'toggleShare',
		value: function toggleShare() {
			var props = this.props;
			props.boolToggle('shareStatus');
		}
	}, {
		key: 'init',
		value: function init() {
			// has token
			if (this.localToken && this.localUser && this.keyInfo.device_id && this.localHadUdid) {
				this.getAllList(this.keyInfo);
				this.getVersionInfo({ user: this.localUser });
			}
			this.getUserInfo(this.keyInfo);
			this.tryConnect();
			this.props.valChange(false, 'hasNoTaskPop');
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var tasks = props.tasks;
			var popupEle = this.props.modalState ? _react2.default.createElement(_popup2.default, {
				popupMessage: this.props.modal,
				modal: this.props.modal,
				modalClose: this.props.modalClose,
				directTo: this.props.directTo
			}) : '';
			var offersEle = void 0;
			if (tasks.offers && tasks.offers.length) {
				offersEle = _react2.default.createElement(_taskDataList2.default, {
					isOnline: props.isOnline,
					listData: tasks.offers,
					type: 'offers',
					enterInvite: this.enterInvite,
					enterItem: this.enterItem,
					valChange: props.valChange,
					directTo: this.props.directTo,
					toggleShare: this.toggleShare,
					canShare: this.props.canShare,
					openApp: this.openApp,
					giveUp: this.giveUp,
					ongoing: props.ongoing
				});
			}
			var cpOffersEle = void 0;
			if (tasks.cp_offers && tasks.cp_offers.length) {
				cpOffersEle = _react2.default.createElement(_taskDataList2.default, {
					isOnline: props.isOnline,
					listData: tasks.cp_offers,
					type: 'cp_offers',
					enterInvite: this.enterInvite,
					enterItem: this.enterItem,
					valChange: props.valChange,
					directTo: this.props.directTo,
					openApp: this.openApp,
					giveUp: this.giveUp,
					ongoing: props.ongoing,
					isLoading: props.isLoading
				});
			}
			var deepListEle = void 0;
			if (tasks.task_offers && tasks.task_offers.length) {
				deepListEle = _react2.default.createElement(_deepList2.default, {
					isOnline: props.isOnline,
					listData: tasks.task_offers,
					enterInvite: this.enterInvite,
					enterItem: this.enterItem,
					valChange: props.valChange,
					directTo: this.props.directTo,
					openApp: this.openApp,
					giveUp: this.giveUp,
					ongoing: props.ongoing,
					isLoading: props.isLoading,
					deepModal: this.deepModal
				});
			}
			var comeSoonEle = void 0;
			if (tasks.comeSoonTotal && tasks.comeSoonList.length) {
				comeSoonEle = _react2.default.createElement(_waitList2.default, {
					listData: tasks.comeSoonList,
					comeSoonTotal: tasks.comeSoonTotal
				});
			}
			var installedOffersEle = void 0;
			if (tasks.installed_offers && tasks.installed_offers.length) {
				installedOffersEle = _react2.default.createElement(_installedList2.default, {
					listData: tasks.installed_offers || [],
					directTo: props.directTo,
					toggleShare: this.toggleShare,
					canShare: props.canShare
				});
			}

			var atmOffersEle = void 0;
			if (tasks.atm_offers && tasks.atm_offers.length) {
				atmOffersEle = _react2.default.createElement(_expensiveList2.default, {
					listData: tasks.atm_offers || [],
					fetchList: props.fetchList,
					valChange: props.valChange,
					resetOngoing: this.resetOngoing,
					directTo: props.directTo,
					modalOpen: props.modalOpen,
					getTasks: this.getTasks,
					ongoingItem: tasks.ongoingItem || {},
					ongoing: props.ongoing
				});
			}

			var cloudNoteEle = void 0;
			if (!props.taskNoteAlready && props.scrollBannerInfo.banner && props.scrollBannerInfo.banner.length) {
				cloudNoteEle = _react2.default.createElement(_cloudNote2.default, {
					cloudInfo: props.scrollBannerInfo.banner,
					valChange: props.valChange,
					taskNoteAlready: props.taskNoteAlready,
					fetchList: props.fetchList
				});
			}
			var refreshImg = void 0;
			var refreshClass = void 0;
			if (props.isReload) {
				refreshImg = _react2.default.createElement('img', { alt: '', src: 'http://cc-cdn.dianjoy.com/91atm/images/refresh-flower.png' });
				refreshClass = 'refresh-line refresh-line-animate';
			} else {
				refreshImg = _react2.default.createElement('img', { alt: '', src: 'http://cc-cdn.dianjoy.com/91atm/images/refresh-circle.png' });
				refreshClass = 'refresh-line';
			}
			var loadEle = void 0;
			if (props.isLoading) {
				loadEle = _react2.default.createElement('div', { className: 'loader' });
			}

			// udid treasureStatus
			var treasureEle = void 0;
			if (props.treasureStatus) {
				treasureEle = _react2.default.createElement(
					'div',
					{ className: 'treasure-wrap', onTouchMove: this.noMove },
					_react2.default.createElement(
						'div',
						{ className: 'treasure-main', onClick: this.enterTreasure },
						_react2.default.createElement('img', {
							src: 'http://cc-cdn.dianjoy.com/91atm/images/treasure.png',
							alt: '',
							className: props.hasTreasureSlide ? 'treasure-box-shake' : ''
						}),
						_react2.default.createElement('img', {
							src: 'http://cc-cdn.dianjoy.com/91atm/images/treasure-info.png',
							alt: '',
							className: 'treasure-info'
						}),
						_react2.default.createElement('img', {
							src: 'http://cc-cdn.dianjoy.com/91atm/images/sunshine.png',
							alt: '',
							className: props.hasTreasureSlide ? 'treasure-sunshine treasure-sunshine-bling' : 'treasure-sunshine'
						}),
						_react2.default.createElement('span', { className: 'yellow-line' })
					)
				);
			}
			var maskEle = void 0;
			if (_ua2.default.isWeixin) {
				maskEle = _react2.default.createElement(_mask2.default, null);
			}

			var taskPopEle = void 0;
			if (!props.modalState) {
				if (props.taskPopWay === 'noTasks' && !props.hasNoTaskPop && _storage2.default.local.get('notaskGudieTime') < 3) {
					this.taskPopImg = 'http://cc-cdn.dianjoy.com/91atm/images/task-pop2.png';
				} else if (props.taskPopWay === 'firstAccount' && !props.hasPopInvite && props.scrollBannerInfo.p_success === 1) {
					this.taskPopImg = 'http://cc-cdn.dianjoy.com/91atm/images/task-pop1.png';
				} else if (props.taskPopWay === 'firstFinish' && !props.hasFirstFinishPop && props.scrollBannerInfo.exchange.length === 1) {
					this.taskPopImg = 'http://cc-cdn.dianjoy.com/91atm/images/task-pop3.png';
				}
			}
			if (this.taskPopImg) {
				taskPopEle = _react2.default.createElement(
					'div',
					{ className: 'task-mask' },
					_react2.default.createElement(
						'div',
						{ className: 'task-mask-wrap' },
						_react2.default.createElement('img', { src: this.taskPopImg, alt: 'mask' }),
						_react2.default.createElement(
							'span',
							{ className: 'task-popbtn', onClick: this.toInvite },
							'马上去邀请'
						),
						_react2.default.createElement('div', { className: 'task-popup-close', onClick: this.closeBtnPopInvite }),
						props.taskPopWay === 'firstFinish' && !props.hasFirstFinishPop && props.scrollBannerInfo.exchange.length === 1 && _react2.default.createElement(
							'div',
							{ className: 'first-finish-info' },
							_react2.default.createElement(
								'h4',
								null,
								'恭喜你!',
								_react2.default.createElement(
									'b',
									null,
									'刚刚拿到',
									(props.scrollBannerInfo.exchange[0] / 100).toFixed(2),
									'元！'
								)
							),
							_react2.default.createElement(
								'p',
								null,
								'邀请1人最多可拿到10元奖励，'
							),
							_react2.default.createElement(
								'p',
								null,
								'上不封顶！'
							)
						)
					)
				);
			}

			var guideEle = this.props.guideStatus ? _react2.default.createElement(_guide2.default, {
				valChange: props.valChange,
				progress: props.progress,
				guideStatus: props.guideStatus,
				guideImage: props.guideImage,
				justConnect: this.justConnect,
				fetchList: this.props.fetchList
			}) : '';

			var ActivityEle = void 0;
			if (this.activityStatus) {
				ActivityEle = _react2.default.createElement(_activity2.default, {
					directTo: props.directTo,
					toggleShare: this.toggleShare,
					canShare: props.canShare
				});
			}
			return _react2.default.createElement(
				'div',
				{ className: 'container task-container' },
				_react2.default.createElement(
					'div',
					{ onClick: this.getTasks.bind(this, this.keyInfo), className: 'refresh' },
					refreshImg
				),
				_react2.default.createElement('div', { className: refreshClass }),
				cloudNoteEle,
				_react2.default.createElement(_scroll2.default, { scrollInfo: props.scrollBannerInfo.scroll }),
				ActivityEle,
				offersEle,
				cpOffersEle,
				atmOffersEle,
				deepListEle,
				comeSoonEle,
				installedOffersEle,
				popupEle,
				loadEle,
				maskEle,
				taskPopEle,
				guideEle,
				_react2.default.createElement(_share2.default, {
					infoShare: this.infoShare,
					hideShare: this.hideShare,
					toggleShare: this.toggleShare,
					shareStatus: props.shareStatus
				}),
				treasureEle
			);
		}
	}]);
	return taskEle;
}(_react.Component);

taskEle.propTypes = {
	tasks: _react.PropTypes.object.isRequired,
	scrollBannerInfo: _react.PropTypes.object.isRequired,
	fetchList: _react.PropTypes.func.isRequired,
	downloadUrl: _react.PropTypes.string.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	isOnline: _react.PropTypes.bool.isRequired,
	versionInfo: _react.PropTypes.object.isRequired,
	keyInfo: _react.PropTypes.object.isRequired,
	userInfo: _react.PropTypes.object.isRequired,
	ongoing: _react.PropTypes.number,
	inited: _react.PropTypes.bool.isRequired,
	taskNoteAlready: _react.PropTypes.bool.isRequired,
	isLoading: _react.PropTypes.bool.isRequired,
	hasPopInvite: _react.PropTypes.bool.isRequired,
	taskPopWay: _react.PropTypes.string.isRequired,
	hasNoTaskPop: _react.PropTypes.bool.isRequired,
	hasFirstFinishPop: _react.PropTypes.bool.isRequired,
	guideStatus: _react.PropTypes.bool.isRequired,
	progress: _react.PropTypes.object.isRequired,
	guideImage: _react.PropTypes.object.isRequired,
	shareStatus: _react.PropTypes.bool.isRequired,
	boolToggle: _react.PropTypes.func.isRequired,
	infoShareData: _react.PropTypes.object.isRequired,
	canShare: _react.PropTypes.bool.isRequired,
	treasureStatus: _react.PropTypes.bool.isRequired,
	hasTreasureSlide: _react.PropTypes.bool.isRequired
};
taskEle.defaultPropTypes = {
	tasks: {
		offers: [],
		cp_offers: [],
		atm_offers: [],
		installed_offers: [],
		task_offers: []
	},
	scrollBannerInfo: {
		scroll: [],
		banner: [],
		exchange: [],
		p_success: -1
	},
	infoShareData: {
		platform: ''
	}
};
exports.default = taskEle;

/***/ },

/***/ 552:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installedToInvite(props) {
	if (props.canShare) {
		props.toggleShare();
	} else {
		props.directTo('/invite');
	}
	(0, _util.logEvent)('installedToInvite');
}

var InstalledList = function InstalledList(props) {
	return _react2.default.createElement(
		'div',
		{ className: 'task-list-wrap task-installed-wrap' },
		_react2.default.createElement(
			'div',
			{ className: 'task-list-titleline' },
			_react2.default.createElement(
				'div',
				null,
				'已安装'
			)
		),
		_react2.default.createElement(
			'div',
			{ className: 'installed-share', onClick: installedToInvite.bind(undefined, props) },
			'分享，邀请好友一起赚钱'
		),
		_react2.default.createElement(
			'ul',
			{ className: 'list-base task-list-base' },
			props.listData.map(function (item, index) {
				return _react2.default.createElement(
					'li',
					{ key: index, className: 'border-bottom' },
					_react2.default.createElement(
						'div',
						{ className: 'list-icon' },
						_react2.default.createElement('img', { alt: '', src: item.icon })
					),
					_react2.default.createElement(
						'div',
						{ className: 'list-content' },
						_react2.default.createElement(
							'h3',
							null,
							item.name
						),
						_react2.default.createElement(
							'p',
							null,
							'您已安装过此应用'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'list-price list-installed' },
						'已安装'
					)
				);
			})
		)
	);
};

InstalledList.propTypes = {
	directTo: _react.PropTypes.func.isRequired,
	toggleShare: _react.PropTypes.func.isRequired,
	canShare: _react.PropTypes.bool.isRequired,
	listData: _react.PropTypes.array
};

InstalledList.defaultPropTypes = {
	listData: []
};

exports.default = InstalledList;

/***/ },

/***/ 553:
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

var _taskItem = __webpack_require__(554);

var _taskItem2 = _interopRequireDefault(_taskItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaskDataList = function (_React$Component) {
	(0, _inherits3.default)(TaskDataList, _React$Component);

	function TaskDataList() {
		(0, _classCallCheck3.default)(this, TaskDataList);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TaskDataList).apply(this, arguments));
	}

	(0, _createClass3.default)(TaskDataList, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate() {
			return true;
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var listData = props.listData;
			var isOnline = props.isOnline;
			var listWrapClass = 'task-list-wrap';
			var titleEle = '试玩专区';
			if (props.type === 'cp_offers') {
				listWrapClass += ' register-list-wrap';
				titleEle = ['注册专区', _react2.default.createElement(
					'span',
					{ key: 0, className: 'progress' },
					'广告主审核后，获得奖励！'
				)];
			}
			var listItem = void 0;
			if (listData && listData.length) {
				listItem = listData.map(function (item, index) {
					return _react2.default.createElement(_taskItem2.default, {
						key: index,
						taskItem: item,
						isOnline: isOnline,
						enterInvite: props.enterInvite,
						enterItem: props.enterItem,
						valChange: props.valChange,
						directTo: props.directTo,
						toggleShare: props.toggleShare,
						openApp: props.openApp,
						type: props.type,
						ongoing: props.ongoing,
						giveUp: props.giveUp,
						isLoading: props.isLoading,
						canShare: props.canShare
					});
				});
			}
			return _react2.default.createElement(
				'div',
				{ key: props.type, className: 'task-list-wrap register-list-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-list-title' },
					titleEle
				),
				_react2.default.createElement(
					'ul',
					{ className: 'list-base task-list-base' },
					listItem
				)
			);
		}
	}]);
	return TaskDataList;
}(_react2.default.Component);

TaskDataList.propTypes = {
	listData: _react.PropTypes.array,
	isOnline: _react.PropTypes.bool.isRequired,
	enterInvite: _react.PropTypes.func.isRequired,
	enterItem: _react.PropTypes.func.isRequired,
	openApp: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	toggleShare: _react.PropTypes.func,
	type: _react.PropTypes.string.isRequired,
	giveUp: _react.PropTypes.func.isRequired,
	canShare: _react.PropTypes.bool.isRequired,
	ongoing: _react.PropTypes.number,
	isLoading: _react.PropTypes.bool
};
TaskDataList.defaultProps = {
	listData: [],
	canShare: false
};
exports.default = TaskDataList;

/***/ },

/***/ 554:
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

var _ua = __webpack_require__(458);

var _ua2 = _interopRequireDefault(_ua);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function expireFormat(num) {
	var expireSec = num;
	if (expireSec - 0) {
		expireSec = Math.floor(expireSec);
		expireSec = (0, _util.toDou)(Math.floor(expireSec / 60)) + ':' + (0, _util.toDou)(expireSec % 60);
	}
	return expireSec;
}

var TaskItem = function (_React$Component) {
	(0, _inherits3.default)(TaskItem, _React$Component);

	function TaskItem(props) {
		(0, _classCallCheck3.default)(this, TaskItem);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TaskItem).call(this, props));

		_this.taskHandle = _this.taskHandle.bind(_this);
		_this.openItemApp = _this.openItemApp.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(TaskItem, [{
		key: 'taskHandle',
		value: function taskHandle() {
			var props = this.props;
			if (props.isLoading) return;
			var currentTask = props.taskItem;
			var type = ['offers', 'cp_offers', 'task_offers'].indexOf(props.type);
			// is invite item
			if (currentTask.ad_id === 0) {
				(0, _util.logEvent)('taskInvite_toInvite');
				if (props.canShare) {
					props.toggleShare();
				} else {
					props.directTo('/invite');
				}
				return;
			}
			// user has clicked
			if (!props.isOnline) {
				props.valChange(true, 'userHasClicked');
				return;
			}
			var adType = _storage2.default.local.get('adType');
			var hasGetSpecialTask = _storage2.default.local.get('hasGetSpecialTask');
			// const taskOngingStatus = props.ongoing || $storage.local.get('cutDown')
			if (adType !== null && !currentTask.ongoing) {
				if (+adType === 3 && !hasGetSpecialTask) {
					props.enterItem(currentTask, type);
				} else {
					props.giveUp(currentTask, type);
				}
			} else {
				props.enterItem(currentTask, type);
			}
			return;
		}
	}, {
		key: 'openItemApp',
		value: function openItemApp(e) {
			e.stopPropagation();
			this.props.openApp(this.props.taskItem);
		}
	}, {
		key: 'render',
		value: function render() {
			var item = this.props.taskItem;
			var playOrShowEle = void 0;
			if (item.ongoing && _storage2.default.local.get('copyAlready') === 'true' && (_ua2.default.isAfterIOS8 || +_storage2.default.local.get('isNewVersion') + 1)) {
				if (this.props.type === 'offers') {
					playOrShowEle = _react2.default.createElement(
						'div',
						{ className: 'list-price', onClick: this.openItemApp },
						_react2.default.createElement(
							'span',
							{ className: 'open-app' },
							'打开试玩'
						)
					);
				} else {
					playOrShowEle = _react2.default.createElement(
						'div',
						{ className: 'list-price register-list-price', onClick: this.openItemApp },
						_react2.default.createElement(
							'span',
							{ className: 'open-app' },
							'试玩并注册'
						)
					);
				}
			} else {
				playOrShowEle = _react2.default.createElement(
					'div',
					{ className: 'list-price' },
					'+',
					_react2.default.createElement(
						'span',
						{ className: 'price' },
						((item.total_number || item.number) / 100).toFixed(2)
					),
					'元'
				);
			}
			var playState = void 0;
			var needRig = void 0;
			var needPay = void 0;
			if (item.remain && !item.ongoing) {
				playState = _react2.default.createElement(
					'p',
					null,
					'剩余',
					item.againRemain || item.remain,
					'个'
				);
			} else if (item.ongoing && this.props.ongoing) {
				playState = _react2.default.createElement(
					'p',
					{ className: 'rem-info' },
					'剩余',
					expireFormat(this.props.ongoing)
				);
			} else if (!item.remain && !item.ongoing) {
				playState = _react2.default.createElement(
					'p',
					null,
					item.desc
				);
			}

			if (item.pay_ad == 1) {
				needPay = _react2.default.createElement(
					'span',
					{ className: 'pay_ad' },
					'付费'
				);
			}

			if (!item.classStr && !item.desc && this.props.type === 'cp_offers') {
				needRig = _react2.default.createElement(
					'span',
					{ className: 'register-info' },
					'需注册'
				);
			}
			return _react2.default.createElement(
				'li',
				{ className: item.classStr + ' border-bottom', onClick: this.taskHandle },
				_react2.default.createElement(
					'div',
					{ className: 'list-icon' },
					_react2.default.createElement('img', { alt: '', src: item.icon })
				),
				_react2.default.createElement(
					'div',
					{ className: 'list-content' },
					_react2.default.createElement(
						'h3',
						null,
						item.name
					),
					playState,
					needPay,
					needRig
				),
				playOrShowEle
			);
		}
	}]);
	return TaskItem;
}(_react2.default.Component);

TaskItem.propTypes = {
	taskItem: _react.PropTypes.object.isRequired,
	type: _react.PropTypes.string.isRequired,
	isOnline: _react.PropTypes.bool.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	toggleShare: _react.PropTypes.func,
	enterItem: _react.PropTypes.func.isRequired,
	openApp: _react.PropTypes.func.isRequired,
	giveUp: _react.PropTypes.func.isRequired,
	canShare: _react.PropTypes.bool.isRequired,
	ongoing: _react.PropTypes.number,
	isLoading: _react.PropTypes.bool
};
exports.default = TaskItem;

/***/ },

/***/ 555:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WaitList = function WaitList(props) {
	return _react2.default.createElement(
		"div",
		{ className: "task-list-wrap" },
		_react2.default.createElement(
			"div",
			{ className: "task-list-titleline" },
			_react2.default.createElement(
				"div",
				null,
				_react2.default.createElement(
					"span",
					null,
					" 任务即将开始，总计"
				),
				_react2.default.createElement(
					"span",
					{ className: "progress" },
					(props.comeSoonTotal / 100).toFixed(2)
				),
				"元，准时来抢！"
			)
		),
		_react2.default.createElement(
			"div",
			{ className: "task-list-title" },
			"敬请期待"
		),
		_react2.default.createElement(
			"ul",
			{ className: "list-base task-list-base" },
			props.listData.map(function (item, index) {
				return _react2.default.createElement(
					"li",
					{ key: index, className: item.classStr + " border-bottom" },
					_react2.default.createElement(
						"div",
						{ className: "list-icon" },
						_react2.default.createElement("img", { alt: "", src: item.icon })
					),
					_react2.default.createElement(
						"div",
						{ className: "list-content" },
						_react2.default.createElement(
							"h3",
							null,
							"神秘任务"
						),
						_react2.default.createElement(
							"p",
							{ className: "success" },
							item.uptime,
							" 正式开抢"
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "list-price" },
						"+",
						_react2.default.createElement(
							"span",
							null,
							(item.number / 100).toFixed(2)
						),
						"元"
					)
				);
			})
		)
	);
};

WaitList.propTypes = {
	listData: _react.PropTypes.array,
	comeSoonTotal: _react.PropTypes.number
};

WaitList.defaultPropTypes = {
	listData: [],
	comeSoonTotal: 0
};

exports.default = WaitList;

/***/ },

/***/ 556:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _task = __webpack_require__(477);

var _components = __webpack_require__(551);

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
	boolToggle: function boolToggle(key, val) {
		return (0, _actions.boolToggle)(key, val);
	},
	valChange: function valChange(key, val) {
		return (0, _actions.valChange)(key, val);
	},
	ongoingState: function ongoingState(ongoing) {
		return (0, _task.ongoingState)(ongoing);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		tasks: state.task.tasks,
		downloadUrl: state.task.downloadUrl,
		modal: state.task.modal,
		modalState: state.task.modalState,
		scrollBannerInfo: state.task.scrollBannerInfo,
		isOnline: state.task.isOnline,
		versionInfo: state.task.versionInfo,
		keyInfo: state.task.keyInfo,
		userInfo: state.task.userInfo,
		userHasClicked: state.task.userHasClicked,
		ongoing: state.task.ongoing,
		inited: state.task.inited,
		isLoading: state.task.isLoading,
		isReload: state.task.isReload,
		taskNoteAlready: state.task.taskNoteAlready,
		hasPopInvite: state.task.hasPopInvite,
		taskPopWay: state.task.taskPopWay,
		hasNoTaskPop: state.task.hasNoTaskPop,
		hasFirstFinishPop: state.task.hasFirstFinishPop,
		guideStatus: state.task.guideStatus,
		progress: state.task.progress,
		guideImage: state.task.guideImage,
		shareStatus: state.task.shareStatus,
		infoShareData: state.task.infoShareData,
		canShare: state.task.canShare,
		treasureStatus: state.task.treasureStatus,
		hasTreasureSlide: state.task.hasTreasureSlide
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_components2.default);

/***/ },

/***/ 574:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".clamp3, .task-container .task-note a.task-note-href {\n  word-break: break-all;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  box-orient: vertical;\n  line-clamp: 3; }\n\n.task-container {\n  background-color: #f4f4f4; }\n  .task-container .header-shadow {\n    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);\n            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }\n  .task-container .list-base li {\n    min-height: 5.33rem; }\n    .task-container .list-base li.border-bottom:last-child:after {\n      border-bottom: 0; }\n    .task-container .list-base li .list-content p {\n      color: #999; }\n\n.first-wrap-fade {\n  opacity: 0;\n  -webkit-transition: opacity 1s ease;\n  transition: opacity 1s ease; }\n\n.first-show-wrap {\n  position: fixed;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 20000;\n  background: rgba(64, 191, 255, 0.9); }\n  .first-show-wrap .first-show-img1 {\n    position: absolute;\n    left: 0;\n    top: 4%;\n    width: 100%;\n    height: 60%;\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/first1.png\") no-repeat center center;\n    background-size: contain; }\n  .first-show-wrap .first-show-img2 {\n    position: absolute;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n    height: 40%;\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/first2.png\") no-repeat center center;\n    background-size: 80%; }\n  .first-show-wrap span {\n    position: absolute;\n    left: 0;\n    bottom: 8%;\n    width: 100%;\n    height: 10%; }\n\n.horn-wrap {\n  padding-left: 1rem;\n  font-size: .917rem;\n  height: 3.17rem;\n  overflow: hidden;\n  position: relative;\n  background: #f4f4f4;\n  margin-top: -1px; }\n\n.horn-info {\n  padding: 0 1rem 0 2.8rem;\n  color: #757575; }\n  .horn-info p {\n    height: .917rem;\n    padding: 1.1265rem 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n    .horn-info p span.progress {\n      font-weight: bold; }\n    .horn-info p span {\n      font-family: PingFang-SC-Regular; }\n\n.broadcast {\n  position: absolute;\n  left: 1rem;\n  top: .1rem;\n  background: url(\"http://cc-cdn.dianjoy.com/91atm/images/broadcast.png\") no-repeat center center;\n  width: 3rem;\n  height: 3rem;\n  background-size: 80%; }\n\n.task-container {\n  position: relative; }\n  .task-container .refresh {\n    position: fixed;\n    right: 1rem;\n    top: .7rem;\n    z-index: 998;\n    width: 2rem; }\n  .task-container .task-note {\n    position: relative;\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/ad-bg.png\") no-repeat center center #46d3fe;\n    background-size: 100% 100%;\n    width: 100%;\n    vertical-align: middle;\n    text-align: left;\n    line-height: 1.33rem;\n    font-size: .917rem;\n    color: #fff; }\n    .task-container .task-note a, .task-container .task-note span, .task-container .task-note em, .task-container .task-note strong, .task-container .task-note p {\n      font-size: 0.917rem !important; }\n    .task-container .task-note a.task-note-href {\n      padding: 1rem 3rem 2rem 2rem;\n      display: block; }\n    .task-container .task-note .close-btn {\n      position: absolute;\n      right: 0;\n      top: 0;\n      padding: .5rem 1rem 1rem; }\n      .task-container .task-note .close-btn img {\n        width: 1.5rem;\n        display: block; }\n  .task-container .expensive-list-wrap {\n    margin-top: .583rem; }\n  .task-container .task-installed-wrap {\n    padding-bottom: 2rem !important; }\n    .task-container .task-installed-wrap .task-list-titleline div {\n      padding-right: 1rem !important; }\n    .task-container .task-installed-wrap .installed-share {\n      color: #007cff;\n      text-align: center;\n      position: relative;\n      height: 2.79rem;\n      line-height: 2.79rem;\n      border: 1px solid rgba(0, 124, 255, 0.3);\n      background-color: #fff;\n      margin-bottom: .625rem;\n      font-size: 1.083rem;\n      padding-left: 2rem; }\n      .task-container .task-installed-wrap .installed-share:before {\n        background: url(\"/web/img/share-icon.png\") no-repeat center center;\n        background-size: 1.8rem;\n        width: 2rem;\n        height: 2rem;\n        position: absolute;\n        left: 22%;\n        top: 12%;\n        content: ''; }\n  .task-container .task-loading-wrap {\n    position: fixed;\n    left: 50%;\n    -webkit-transform: translateX(-50%);\n            transform: translateX(-50%);\n    top: 30%;\n    width: 10rem; }\n    .task-container .task-loading-wrap img {\n      vertical-align: top; }\n    .task-container .task-loading-wrap p {\n      padding: 1rem 0;\n      text-align: center;\n      color: #888; }\n  .task-container .task-list-wrap {\n    background-color: #f4f4f4 !important;\n    padding: 0 .583rem; }\n    .task-container .task-list-wrap .task-list-titleline {\n      line-height: 3.16rem;\n      color: #666;\n      text-align: center;\n      position: relative;\n      z-index: 1;\n      overflow: hidden; }\n      .task-container .task-list-wrap .task-list-titleline:before {\n        content: '';\n        position: absolute;\n        bottom: 0;\n        display: block;\n        border-left: 0;\n        border-bottom: 1px dashed #bfbfbf;\n        width: 100%;\n        height: 0;\n        -webkit-transform: translate(0, -1.5rem);\n                transform: translate(0, -1.5rem); }\n      .task-container .task-list-wrap .task-list-titleline:before {\n        left: -.583rem; }\n      .task-container .task-list-wrap .task-list-titleline div {\n        background-color: #f4f4f4;\n        position: relative;\n        z-index: 2;\n        display: inline-block;\n        padding: 0 .5rem 0 1rem;\n        font-size: .917rem;\n        color: #666; }\n        .task-container .task-list-wrap .task-list-titleline div:nth-child(2) {\n          font-family: PingFang-SC-Regular; }\n        .task-container .task-list-wrap .task-list-titleline div:before, .task-container .task-list-wrap .task-list-titleline div:after {\n          content: '';\n          position: absolute;\n          bottom: 0;\n          display: block;\n          width: .8rem;\n          height: .8rem;\n          -webkit-border-radius: 50%;\n                  border-radius: 50%;\n          border: 1px solid #bfbfbf;\n          -webkit-transform: translateY(-1.1rem) scale(0.5);\n                  transform: translateY(-1.1rem) scale(0.5); }\n        .task-container .task-list-wrap .task-list-titleline div:before {\n          left: 0; }\n        .task-container .task-list-wrap .task-list-titleline div:after {\n          right: 0; }\n        .task-container .task-list-wrap .task-list-titleline div span.progress {\n          font-weight: bold; }\n    .task-container .task-list-wrap .task-list-title {\n      background-color: #fff;\n      padding-top: 1rem;\n      font-size: .917rem;\n      padding-left: 1rem;\n      color: #999; }\n      .task-container .task-list-wrap .task-list-title span {\n        padding-left: .5rem;\n        opacity: .6; }\n    .task-container .task-list-wrap .task-list-base div {\n      border: none 0; }\n    .task-container .task-list-wrap .task-list-base .list-icon {\n      margin: 1rem; }\n    .task-container .task-list-wrap .task-list-base .list-content {\n      margin-top: 0; }\n      .task-container .task-list-wrap .task-list-base .list-content h3 {\n        color: #333;\n        font-size: 1.083rem;\n        line-height: 1.083rem;\n        padding-top: 1.5rem;\n        font-weight: normal;\n        max-width: 12rem; }\n      .task-container .task-list-wrap .task-list-base .list-content .register-info {\n        color: #ff8e65;\n        border: 1px solid #FFB99F; }\n    .task-container .task-list-wrap .task-list-base .list-price {\n      color: #ff723e;\n      font-size: 1.083rem;\n      padding-right: 1rem; }\n      .task-container .task-list-wrap .task-list-base .list-price span {\n        font-size: 1.83rem;\n        font-family: PingFang-SC-Regular;\n        display: inline-block; }\n      .task-container .task-list-wrap .task-list-base .list-price .price {\n        -webkit-transform: translateY(0.2rem);\n        transform: translateY(0.2rem); }\n  .task-container .register-list-wrap .task-list-title {\n    margin-top: .67rem; }\n  .task-container .deep-list-wrap .task-list-title {\n    margin-top: .67rem; }\n\n.task-mask {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 998;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n   -ms-user-select: none;\n       user-select: none;\n  text-align: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-display: flex;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n      align-items: center;\n  -webkit-align-items: center;\n  background: rgba(0, 0, 0, 0.4); }\n  .task-mask .task-mask-wrap {\n    width: 75%;\n    margin: 0 auto;\n    -webkit-transform: translateY(-1rem);\n            transform: translateY(-1rem);\n    position: relative; }\n  .task-mask .task-popbtn {\n    position: absolute;\n    left: 0;\n    bottom: 10%;\n    width: 100%;\n    height: 14%;\n    opacity: 0; }\n  .task-mask .task-popup-close {\n    position: absolute;\n    left: 50%;\n    bottom: -3.5rem;\n    background: url(http://cc-cdn.dianjoy.com/91atm/images/bengchacha.png) no-repeat center center #cfcfcf;\n    background-size: 1.6rem;\n    width: 3rem;\n    height: 3rem;\n    -webkit-border-radius: 50%;\n            border-radius: 50%;\n    -webkit-transform: translateX(-1.5rem);\n            transform: translateX(-1.5rem); }\n\n.activity-wrap {\n  padding: 0 .583rem; }\n\n.first-finish-info {\n  color: #fff;\n  position: absolute;\n  left: 4%;\n  right: 0;\n  top: 48%;\n  text-align: center; }\n  .first-finish-info h4 {\n    font-size: 1.125rem;\n    font-weight: bold;\n    padding-bottom: 1.667rem; }\n    .first-finish-info h4 b {\n      font-size: 1.875rem; }\n  .first-finish-info p {\n    font-size: 1rem;\n    line-height: 1.5rem;\n    padding-left: 4%; }\n\n.treasure-wrap {\n  position: fixed;\n  left: 0;\n  top: 0;\n  background-color: rgba(0, 0, 0, 0.6);\n  height: 100%;\n  width: 100%;\n  z-index: 1000; }\n\n.treasure-wrap img {\n  position: absolute;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n  width: 21.42rem;\n  top: 10rem; }\n\n.treasure-main {\n  position: fixed;\n  left: 0;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  z-index: 1000;\n  -webkit-animation: treasureSlide .7s linear;\n          animation: treasureSlide .7s linear; }\n\n.treasure-box-shake {\n  -webkit-animation: treasureShake 3s infinite linear;\n          animation: treasureShake 3s infinite linear; }\n\n.treasure-wrap .treasure-info {\n  top: 11.5rem;\n  width: 13.33rem; }\n\n.treasure-sunshine {\n  z-index: -1; }\n\n.treasure-sunshine-bling {\n  -webkit-animation: treasureBing 10s infinite linear;\n          animation: treasureBing 10s infinite linear; }\n\n.yellow-line {\n  position: absolute;\n  left: 50%;\n  right: 0;\n  top: 0;\n  height: 17rem;\n  border-left: 2px solid #e28712;\n  z-index: -1;\n  -webkit-transform: translateX(-0.8rem);\n          transform: translateX(-0.8rem); }\n\n@-webkit-keyframes treasureSlide {\n  0% {\n    -webkit-transform: translateY(-10rem);\n            transform: translateY(-10rem); }\n  100% {\n    -webkit-transform: translateY(0);\n            transform: translateY(0); } }\n\n@keyframes treasureSlide {\n  0% {\n    -webkit-transform: translateY(-10rem);\n            transform: translateY(-10rem); }\n  100% {\n    -webkit-transform: translateY(0);\n            transform: translateY(0); } }\n\n@-webkit-keyframes treasureBing {\n  0% {\n    -webkit-transform: rotate(0);\n            transform: rotate(0); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes treasureBing {\n  0% {\n    -webkit-transform: rotate(0);\n            transform: rotate(0); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@-webkit-keyframes treasureShake {\n  0%, 100% {\n    transform: rotate(0);\n    -webkit-transform: rotate(0); }\n  10%, 30%, 50%, 70%, 90% {\n    transform: rotate(-5deg);\n    -webkit-transform: rotate(-5deg); }\n  20%, 40%, 60%, 80% {\n    transform: rotate(5deg);\n    -webkit-transform: rotate(5deg); } }\n\n@keyframes treasureShake {\n  0%, 100% {\n    transform: rotate(0);\n    -webkit-transform: rotate(0); }\n  10%, 30%, 50%, 70%, 90% {\n    transform: rotate(-5deg);\n    -webkit-transform: rotate(-5deg); }\n  20%, 40%, 60%, 80% {\n    transform: rotate(5deg);\n    -webkit-transform: rotate(5deg); } }\n", ""]);

// exports


/***/ },

/***/ 590:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(574);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./task.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./task.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});