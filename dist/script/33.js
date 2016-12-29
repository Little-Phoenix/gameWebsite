webpackJsonp([33],{

/***/ 451:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _taskDetailContainer = __webpack_require__(541);

var _taskDetailContainer2 = _interopRequireDefault(_taskDetailContainer);

var _taskDetail = __webpack_require__(542);

var _taskDetail2 = _interopRequireDefault(_taskDetail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'taskDetail', reducer: _taskDetail2.default });
	cb(null, _taskDetailContainer2.default);
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

/***/ 539:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = __webpack_require__(87);

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = __webpack_require__(212);

var _keys2 = _interopRequireDefault(_keys);

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

var _ua = __webpack_require__(458);

var _ua2 = _interopRequireDefault(_ua);

var _util = __webpack_require__(86);

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

var _taskDetailDeep = __webpack_require__(540);

var _taskDetailDeep2 = _interopRequireDefault(_taskDetailDeep);

__webpack_require__(589);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getJson(key) {
	var hasKey = (0, _util.hasStorage)(key);
	return JSON.parse(hasKey || '{}');
}

var localToken = _storage2.default.local.get('token');
var localUser = _storage2.default.local.get('user');
var adTypeStart = +_storage2.default.local.get('adType');
var keyData = getJson('keyData');
var isAfterIOS8 = _ua2.default.isAfterIOS8;
var judgeVersionInfo = {
	isNewVersion: +_storage2.default.local.get('isNewVersion') + 1,
	isAutoOpen: +_storage2.default.local.get('isAutoOpen') + 1
};

var adTypeDesc = adTypeStart === 1 ? '注册并试玩' : '打开试玩';

var keyInfo = getJson('91atm');

function expireFormat(num) {
	var expireSec = num;
	if (expireSec - 0) {
		expireSec = Math.floor(expireSec);
		expireSec = (0, _util.toDou)(Math.floor(expireSec / 60)) + ':' + (0, _util.toDou)(expireSec % 60);
	}
	return expireSec;
}

var taskDetailEle = function (_Component) {
	(0, _inherits3.default)(taskDetailEle, _Component);

	function taskDetailEle(props) {
		(0, _classCallCheck3.default)(this, taskDetailEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(taskDetailEle).call(this, props));

		_this.keywordsCopy = _this.keywordsCopy.bind(_this);
		_this.noKeywordsCopy = _this.noKeywordsCopy.bind(_this);
		_this.keywordsCopyJudg = _this.keywordsCopyJudg.bind(_this);
		_this.appDownload = _this.appDownload.bind(_this);
		_this.openStart = _this.openStart.bind(_this);
		_this.adInstallFn = _this.adInstallFn.bind(_this);
		_this.adAutoOpenFn = _this.adAutoOpenFn.bind(_this);
		_this.clickTaskDown = _this.clickTaskDown.bind(_this);
		_this.clickCopy = _this.clickCopy.bind(_this);
		_this.clickCopyJudg = _this.clickCopyJudg.bind(_this);
		_this.adOpenFn = _this.adOpenFn.bind(_this);
		_this.adClickFn = _this.adClickFn.bind(_this);
		_this.openPopReminfo = _this.openPopReminfo.bind(_this);
		_this.copyTimeLimit = _this.copyTimeLimit.bind(_this);
		_this.sizeCutDown = _this.sizeCutDown.bind(_this);
		_this.clickConfigDown = _this.clickConfigDown.bind(_this);
		_this.clickConfigSubmit = _this.clickConfigSubmit.bind(_this);
		_this.init = _this.init.bind(_this);
		_this.treasureModal = _this.treasureModal.bind(_this);
		_this.treasureFailModal = _this.treasureFailModal.bind(_this);
		_this.ws = {};
		_this.keywords = _this.props.ongoing.keywords || '';
		_this.setTime = null;
		_this.counter = 0;
		_this.cutDownProgress = 0;
		var domain = 'http://' + location.hostname;
		if (location.hostname === '91atm.local.com') {
			domain = 'http://91atm.aa123bb.com';
		}
		_this.configLink = domain + '/firmware/client/profile_download/online.mobileconfig';
		_this.urlHashParams = location.hash && (0, _util.urlParamsFormat)(location.hash.slice(1)) || {};
		return _this;
	}

	(0, _createClass3.default)(taskDetailEle, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var props = this.props;
			if (this.props.modalState) {
				this.props.modalClose();
			}
			this.init();
			this.counter = 0;
			this.cutDownProgress = 0;
			//  保存udid
			var urlParams = location.hash && (0, _util.urlParamsFormat)(location.hash.slice(1)) || {};
			var udid = urlParams.udid || _storage2.default.local.get('udid') || '';

			if ((0, _keys2.default)(urlParams)[0] === 'udid') {
				var ongoingData = {
					icon: 'http://cc-cdn.dianjoy.com/91atm/images/treasure-icon.png',
					name: '宝箱任务',
					size: '*** M',
					number: 50,
					tasks: []
				};
				(0, _util.logEvent)('enter_treasure');
				props.valChange(7, 'adType');
				props.valChange(ongoingData, 'ongoing');
				_storage2.default.session.set('ongoing', (0, _stringify2.default)(ongoingData));
				_storage2.default.local.set('adType', 7);
			} else {
				if (+_storage2.default.local.get('adType') === 7) {
					_storage2.default.local.remove('adType');
					props.valChange(null, 'adType');
				} else {
					var adType = +_storage2.default.local.get('adType');
					props.valChange(adType, 'adType');
				}
			}
			if (udid && !_storage2.default.local.get('udid')) _storage2.default.local.set('udid', udid);
			// set ongoing
			var ongoingStr = _storage2.default.session.get('ongoing');
			if (ongoingStr && ongoingStr !== 'null' && ongoingStr !== 'undefined') {
				props.valChange(JSON.parse(ongoingStr), 'ongoing');
			}

			var adTypeInfo = +_storage2.default.local.get('adType');
			if (adTypeInfo) {
				props.valChange(adTypeInfo, 'adType');
			}
			if (props.adType === 2) {
				document.body.style.backgroundColor = '#f4f4f4';
			} else if ((0, _keys2.default)(urlParams)[0] !== 'udid' && props.adType !== 7 && props.adType !== 2) {
				this.sizeCutDown();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var props = this.props;
			var that = this;
			var copyAlready = _storage2.default.local.get('copyAlready');
			if (nextProps.isOnline && !props.isOnline) {
				if (this.props.modalState) {
					this.props.modalClose();
				}
			}
			if (!nextProps.isOnline && props.isOnline) {
				this.offLineModal();
			}
			function setOngoing() {
				copyAlready = _storage2.default.local.get('copyAlready');
				if (nextProps.ongoingDetail <= 0) {
					clearTimeout(that.setTime);
					return;
				}
				props.valChange(nextProps.ongoingDetail - 1, 'ongoingDetail');
				// set cutdown every 5 seconds
				if (!(that.counter % 5)) {
					_storage2.default.session.set('cutDown', nextProps.ongoingDetail - 1);
				}
				that.counter += 1;
			}
			if (nextProps.ongoingDetail && nextProps.ongoingDetail > 0 && props.ongoingDetail > Math.abs(nextProps.ongoingDetail) && props.adType !== 2) {
				that.setTime = setTimeout(setOngoing, 1000);
			} else if (nextProps.ongoingDetail <= 0 && copyAlready) {
				clearTimeout(that.setTime);
			} else if (nextProps.ongoingDetail <= 0 && !copyAlready && !props.modalState) {
				clearTimeout(that.setTime);
				// 深度任务不倒计时
				if ((0, _keys2.default)(that.urlHashParams)[0] !== 'udid' && props.adType !== 2 && props.adType !== 7) {
					props.modalOpen({
						content: '您在2分钟内，没有进行下一步操作，任务已经自动放弃，请您重新领取',
						confirm: '确认',
						confirmCallback: function confirmCallback() {
							setTimeout(function () {
								props.directTo('/');
							}, 10);
						}
					});
				}
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.setTime) clearTimeout(this.setTime);
			_storage2.default.session.set('cutDown', this.props.ongoingDetail);
		}
	}, {
		key: 'sizeCutDown',
		value: function sizeCutDown() {
			var that = this;
			var props = that.props;
			this.cutDownProgress += 1;
			var copyAlready = _storage2.default.local.get('copyAlready');
			if (this.cutDownProgress > 2 && copyAlready) {
				return;
			}
			// size > 100 倒计时45min   size < 100 倒计时20min
			var size = props.ongoing.size && props.ongoing.size.substr(0, props.ongoing.size.length - 2);
			size = size.replace(/(^\s*)|(\s*$)/g, '');
			var ongoingDetail = void 0;
			if (copyAlready) {
				if (size > 100) {
					ongoingDetail = +_storage2.default.session.get('cutDown') || 2699;
				} else {
					ongoingDetail = +_storage2.default.session.get('cutDown') || 1199;
				}
			} else {
				ongoingDetail = +_storage2.default.session.get('cutDown') || 120;
			}
			_storage2.default.session.set('cutDown', ongoingDetail);
			props.valChange(ongoingDetail - 1 || +props.ongoingDetail - 1, 'ongoingDetail');
			function cutDownOngoingDetail() {
				props.valChange(ongoingDetail - 2 || +props.ongoingDetail - 2, 'ongoingDetail');
			}
			setTimeout(cutDownOngoingDetail, 1000);
		}
	}, {
		key: 'offLineModal',
		value: function offLineModal() {
			var that = this;
			keyData = getJson('keyData');
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
		key: 'init',
		value: function init() {
			var that = this;
			if (that.ws.websocket_url) return;
			this.ws = (0, _wsConnect2.default)(9098, that);
			var min2Giveup = _storage2.default.local.get('min2Giveup');
			var copyAlready = _storage2.default.local.get('copyAlready');
			var adTypeInfo = +_storage2.default.local.get('adType');
			if (!min2Giveup && !copyAlready && (0, _keys2.default)(that.urlHashParams)[0] !== 'udid' && adTypeInfo !== 7) {
				this.props.modalOpen({
					content: '若2分钟之内，没有进行第一步操作，将会自动放弃任务，需要重新领取',
					confirm: '我知道了',
					confirmCallback: function confirmCallback() {
						_storage2.default.local.set('min2Giveup', true);
					}
				});
			}
		}
	}, {
		key: 'adClickFn',
		value: function adClickFn() {
			var paramsInfo = this.sendBaseInfo();
			this.ws.adClick(paramsInfo);
		}
	}, {
		key: 'adInstallFn',
		value: function adInstallFn() {
			// 新版客户端复制协议  adInstall
			var paramsInfo = this.sendBaseInfo();
			var ongoing = this.props.ongoing || {};
			var keywords = ongoing.keywords || this.keywords || '';
			if (keywords) {
				this.ws.adInstall(paramsInfo, keywords);
			} else {
				this.ws.adInstall(paramsInfo);
			}
		}
	}, {
		key: 'adOpenFn',
		value: function adOpenFn() {
			// 新版客户端打开app  adOpen
			var paramsInfo = this.sendBaseInfo();
			this.ws.adOpen(paramsInfo);
		}
	}, {
		key: 'adAutoOpenFn',
		value: function adAutoOpenFn() {
			var ongoing = this.props.ongoing || {};
			var keywords = ongoing.keywords || this.keywords || '';
			// 新版客户端打开app  adOpen
			var hrefParams = this.props.ongoing.href_params;
			var params = hrefParams + '&snuid=' + localUser + '&token=' + localToken;
			if (keywords) {
				this.ws.adAutoOpen(params, keywords);
			} else {
				this.ws.adAutoOpen(params);
			}
		}
	}, {
		key: 'appDownload',
		value: function appDownload() {
			var ongoing = this.props.ongoing;
			function appDownloadFilter() {
				var appDownloadInfo = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				var appSearch = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?mt=8&submit=edit&term=#software';
				var appUrl = ongoing.keywords ? appSearch : encodeURIComponent(ongoing.ad_url);
				var downloadUrl = ongoing.red ? ongoing.red + appUrl : decodeURIComponent(appUrl);
				location.href = downloadUrl;
			}
			// app下载
			this.props.fetchList('/trial/task/download/?' + ongoing.href_params, undefined, 'appDownloadInfo', appDownloadFilter);
		}
	}, {
		key: 'copyTimeLimit',
		value: function copyTimeLimit() {
			// 通知服务端，copy  开始2min倒计时
			var limitData = {
				ad_id: this.props.ongoing.ad_id || '',
				copy_keyword: true
			};
			this.props.fetchList('/trial/task/control/', { method: 'POST', params: limitData }, undefined);
		}
	}, {
		key: 'keywordsCopyJudg',
		value: function keywordsCopyJudg() {
			var _this2 = this;

			var that = this;
			// 复制关键词后，清除2min倒计时
			var copyAlready = _storage2.default.local.get('copyAlready');
			if (!copyAlready) {
				_storage2.default.session.remove('cutDown');
				clearTimeout(that.setTime);
			}
			// 没有关键词，点击下载   ios7,8发送adclick
			_storage2.default.local.set('copyAlready', true);
			if (isAfterIOS8) {
				this.appDownload();
			} else {
				this.adClickFn(); // ios7,8用户走正常流程,直接下载
			}
			setTimeout(function () {
				_this2.copyTimeLimit();
				_this2.sizeCutDown();
			}, 10);
		}
	}, {
		key: 'noKeywordsCopy',
		value: function noKeywordsCopy() {
			// copy日志统计: 复制关键词
			(0, _util.logEvent)('click_copy_keyword');
			this.keywordsCopyJudg();
		}
	}, {
		key: 'keywordsCopy',
		value: function keywordsCopy() {
			// copy日志统计: 复制关键词
			(0, _util.logEvent)('click_copy_keyword');
			var that = this;
			var copyRemStatus = _storage2.default.local.get('copyRemStatus');
			if (copyRemStatus) {
				that.keywordsCopyJudg();
			} else {
				this.props.modalOpen({
					title: '<p>复制成功，请在App Store搜索框内</p><h4>粘贴关键词，搜索并下载</h4>',
					content: 'showImg',
					confirm: '我知道了',
					cancel: '不再提示',
					imgSrc: 'http://cc-cdn.dianjoy.com/91atm/images/get_rem_2.jpg',
					showImgClass: 'task-detail-showimg',
					popClassStr: 'popup-showimgbig-wrap',
					confirmCallback: function confirmCallback() {
						(0, _util.logEvent)('click_i_know');
						// ios9用户，copy走下载流程，不发送adClick
						that.keywordsCopyJudg();
					},
					cancelCallback: function cancelCallback() {
						_storage2.default.local.set('copyRemStatus', true); // 不再发送复制提示
						(0, _util.logEvent)('click_not_remind');
						that.keywordsCopyJudg();
					}
				});
			}
		}
	}, {
		key: 'clickCopyJudg',
		value: function clickCopyJudg() {
			var _this3 = this;

			var that = this;
			// 复制关键词后，清除2min倒计时
			var copyAlready = _storage2.default.local.get('copyAlready');
			if (!copyAlready) {
				_storage2.default.session.remove('cutDown');
				clearTimeout(that.setTime);
			}
			// 没有关键词，点击直接下载，发送adInstall协议
			_storage2.default.local.set('copyAlready', true);
			if (judgeVersionInfo.isAutoOpen) {
				// 客户端自动打开应用1.4.0
				this.adAutoOpenFn();
			} else {
				this.adInstallFn();
			}
			setTimeout(function () {
				_this3.copyTimeLimit();
				_this3.sizeCutDown();
			}, 10);
		}
	}, {
		key: 'clickTaskDown',
		value: function clickTaskDown() {
			(0, _util.logEvent)('click_copy_keyword');
			this.clickCopyJudg();
		}
	}, {
		key: 'clickCopy',
		value: function clickCopy() {
			(0, _util.logEvent)('click_copy_keyword');
			var that = this;
			var copyRemStatus = _storage2.default.local.get('copyRemStatus');
			if (copyRemStatus) {
				this.clickCopyJudg();
			} else {
				this.props.modalOpen({
					title: '<p>复制成功，请在App Store搜索框内</p><h4>粘贴关键词，搜索并下载</h4>',
					content: 'showImg',
					confirm: '我知道了',
					cancel: '不再提示',
					imgSrc: 'http://cc-cdn.dianjoy.com/91atm/images/get_rem_2.jpg',
					showImgClass: 'task-detail-showimg',
					popClassStr: 'popup-showimgbig-wrap',
					confirmCallback: function confirmCallback() {
						(0, _util.logEvent)('click_i_know');
						that.clickCopyJudg();
					},
					cancelCallback: function cancelCallback() {
						// 不再发送复制提示
						_storage2.default.local.set('copyRemStatus', true);
						(0, _util.logEvent)('click_not_remind');
						that.clickCopyJudg();
					}
				});
			}
		}
	}, {
		key: 'openPopReminfo',
		value: function openPopReminfo() {
			var that = this;
			this.props.modalOpen({
				content: '<h5 class="wait-content">如果没安装应用，请下载安装后，回到试玩团重新打开。</h5>',
				confirm: '前往下载',
				cancel: '取消',
				// popClassStr: 'popup-deep-wrap',
				confirmCallback: function confirmCallback() {
					that.appDownload();
				}
			});
		}
	}, {
		key: 'openStart',
		value: function openStart() {
			var that = this;
			var props = that.props;
			var copyAlreadyStatus = _storage2.default.local.get('copyAlready') || '';
			if (!copyAlreadyStatus) {
				this.props.modalOpen({
					content: '<h6>请先按照第一步操作，复制粘贴关键词，在App Store中下载该任务。</h6>',
					confirm: '我知道了',
					popClassStr: 'one-line'
				});
				return;
			}

			function openStartWork() {
				if (that.props.isOnline && copyAlreadyStatus) {
					(0, _util.logEvent)('click_open_play');
					// 旧版web端判断url_schema打开应用，并发送adclick   --ios9
					// 新版发送协议adOpen,客户端打开协议，不用判断schema
					if (judgeVersionInfo.isNewVersion) {
						that.adOpenFn();
						return;
					} else if (isAfterIOS8 && props.ongoing.url_schema) {
						(function () {
							// adClick
							location.href = props.ongoing.url_schema; // ios9 且存在url_schema，直接打开
							// this.loading.icon = false
							that.adClickFn();
							// 判断是否能打开应用
							var begin = new Date();
							window.setTimeout(function () {
								if (new Date().getTime() - begin < 3000) {
									that.appDownload();
									// 不直接跳转下载，弹框提示去下载
									// that.openPopReminfo()
								} else {
									window.stop();
								}
							}, 2000);
						})();
					} else if (isAfterIOS8 && !props.ongoing.url_schema) {
						// ios9 且不存在url_schema，弹窗提示
						that.adClickFn();
						// 不直接跳转下载，弹框提示去下载
						that.openPopReminfo();
					}
				}
			}

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
						openStartWork();
					},
					cancelCallback: function cancelCallback() {
						_storage2.default.local.set('ios10GetdataRem', true); // 不再发送ios10获取数据提示
						openStartWork();
					}
				});
				return;
			}
			openStartWork();
		}
	}, {
		key: 'sendBaseInfo',
		value: function sendBaseInfo() {
			var hrefParams = this.props.ongoing.href_params;
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
		key: 'clickConfigDown',
		value: function clickConfigDown() {
			location.href = this.configLink;
		}
	}, {
		key: 'treasureModal',
		value: function treasureModal() {
			var props = this.props;
			function clearAdType() {
				_storage2.default.local.remove('adType');
				props.valChange(null, 'adType');
			}
			props.modalOpen({
				content: '恭喜您完成宝箱任务，快去做其他任务吧',
				confirm: '我知道了',
				confirmCallback: function confirmCallback() {
					props.directTo('/');
					setTimeout(clearAdType, 10);
				}
			});
		}
	}, {
		key: 'treasureFailModal',
		value: function treasureFailModal() {
			this.props.modalOpen({
				content: '您还没有完成宝箱任务，请重新完成！',
				confirm: '我知道了'
			});
		}
	}, {
		key: 'clickConfigSubmit',
		value: function clickConfigSubmit() {
			var that = this;
			var urlParams = location.hash && (0, _util.urlParamsFormat)(location.hash.slice(1)) || {};
			var udid = urlParams.udid || _storage2.default.local.get('udid') || '';
			var inviterInfo = _storage2.default.local.get('inviter') || '';
			function userInfoFilter(userData) {
				if (!userData.user && !userData.token) return 0;
				_storage2.default.local.set('user', userData.user);
				_storage2.default.local.set('token', userData.token);
				_storage2.default.local.set('had_udid', userData.had_udid);
				if (userData.code === 200 && userData.had_udid) {
					setTimeout(that.treasureModal, 10);
				} else {
					setTimeout(that.treasureFailModal, 10);
				}
				return userData;
			}
			if (udid) {
				var params = {
					app_version: keyInfo.app_version,
					device_id: keyInfo.device_id,
					openid: keyInfo.openid,
					package_name: keyInfo.package_name,
					inviter: inviterInfo,
					udid: udid
				};
				this.props.fetchList('/account/web/token/', {
					method: 'POST',
					params: params
				}, 'userInfo', userInfoFilter);
			} else {
				this.treasureFailModal();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var ongoing = props.ongoing;
			ongoing.deep_rmb = ongoing.total_number - ongoing.number;
			var panelTopEle = ongoing.number && ongoing.deep_rmb ? _react2.default.createElement('div', { className: 'task-panel-top' }) : '';

			var panelBottomEle = ongoing.tasks.length ? _react2.default.createElement('div', { className: 'task-panel' }) : '';

			var waveTopEle = ongoing.number && ongoing.deep_rmb ? _react2.default.createElement(
				'div',
				{ className: 'task-wave-top' },
				'任务总金额：',
				_react2.default.createElement(
					'span',
					null,
					(ongoing.number / 100).toFixed(2)
				),
				'元试玩＋',
				_react2.default.createElement(
					'span',
					null,
					(ongoing.deep_rmb / 100).toFixed(2)
				),
				'元深度＝',
				_react2.default.createElement(
					'span',
					null,
					(ongoing.total_number / 100).toFixed(2)
				),
				'元'
			) : '';

			var deepDescInfoEle = ongoing.tasks.length ? _react2.default.createElement(
				'div',
				{ className: 'deep-task-desc-wrap' },
				_react2.default.createElement('span', null),
				_react2.default.createElement(
					'h4',
					null,
					'深度任务: '
				),
				_react2.default.createElement(
					'h5',
					null,
					'(完成上面任务后，将解锁下列深度任务)'
				),
				ongoing.tasks.map(function (item, index) {
					return _react2.default.createElement(
						'p',
						{ key: index },
						_react2.default.createElement(
							'b',
							null,
							index + 1,
							'.'
						),
						item.name,
						'，+',
						(item.step_rmb / 100).toFixed(2),
						'元奖励。'
					);
				})
			) : '';

			var taskDetailTopEle = _react2.default.createElement(
				'div',
				{ className: 'task-detail-top' },
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-top-icon' },
					_react2.default.createElement('img', { alt: 'icon', src: ongoing.icon })
				),
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-top-desc' },
					_react2.default.createElement(
						'h3',
						null,
						ongoing.name
					),
					_react2.default.createElement(
						'p',
						null,
						'大小： ',
						ongoing.size
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-cost' },
						'+',
						_react2.default.createElement(
							'b',
							null,
							(ongoing.number / 100).toFixed(2)
						),
						'元'
					)
				)
			);
			var ios10Ele = _react2.default.createElement(
				'b',
				{ className: 'progress' },
				'ios10用户注意：必须允许该任务app使用数据，否则无法获得奖励！'
			);
			var cutDownEle = void 0;
			if (props.ongoingDetail > 0) {
				cutDownEle = _react2.default.createElement(
					'span',
					null,
					'(倒计时 ',
					expireFormat(props.ongoingDetail),
					')'
				);
			}
			var taskDetailDescEle = void 0;
			if (props.adType === 7) {
				taskDetailDescEle = _react2.default.createElement(
					'div',
					{ className: 'task-detail-description' },
					_react2.default.createElement(
						'div',
						{ className: 'task-description-title' },
						'特别提醒'
					),
					_react2.default.createElement(
						'p',
						null,
						'为了保证您的账号安全，请您完成该宝箱任务，还可以拿到0.5元的奖励哦！'
					)
				);
			} else {
				taskDetailDescEle = _react2.default.createElement(
					'div',
					{ className: 'task-detail-description' },
					_react2.default.createElement(
						'div',
						{ className: 'task-description-title' },
						'特别提醒',
						cutDownEle
					),
					+ongoing.rank ? _react2.default.createElement(
						'p',
						null,
						'1. 认准图标，排名大概在',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.rank,
							'名'
						)
					) : _react2.default.createElement(
						'p',
						null,
						' 1.请认准任务图标，在搜索结果中找到正确的任务进行下载。'
					),
					ongoing.tips && _react2.default.createElement(
						'p',
						null,
						'2. 请',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.tips
						),
						'，可轻松获得奖励'
					),
					ongoing.notice && (ongoing.tips ? _react2.default.createElement(
						'p',
						null,
						'3. 温馨提示：',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.notice
						)
					) : _react2.default.createElement(
						'p',
						null,
						'2. 温馨提示：',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.notice
						)
					)),
					_ua2.default.isIOS10 && !ongoing.tips && (ongoing.notice ? _react2.default.createElement(
						'p',
						null,
						'3. ',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ios10Ele
						)
					) : _react2.default.createElement(
						'p',
						null,
						'2. ',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ios10Ele
						)
					)),
					_ua2.default.isIOS10 && ongoing.tips && (ongoing.notice ? _react2.default.createElement(
						'p',
						null,
						'4. ',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ios10Ele
						)
					) : _react2.default.createElement(
						'p',
						null,
						'3. ',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ios10Ele
						)
					))
				);
			}

			var taskDetailOpenEle =
			// 第二步，打开试玩
			isAfterIOS8 || judgeVersionInfo.isNewVersion ? _react2.default.createElement(
				'div',
				{ className: 'task-detail-start task-detail-item' },
				_react2.default.createElement(
					'p',
					null,
					'第二步：下载后回',
					_react2.default.createElement(
						'b',
						{ className: 'progress' },
						'试玩团'
					),
					'打开'
				),
				_react2.default.createElement(
					'a',
					{
						href: 'javascript:;',
						className: 'btn-reverse',
						onClick: this.openStart
					},
					adTypeDesc
				)
			) : _react2.default.createElement(
				'div',
				{ className: 'task-detail-start task-detail-item' },
				_react2.default.createElement(
					'p',
					null,
					'第二步：下载后，回手机桌面打开试玩'
				)
			);

			var taskDetailContentEle1 = _react2.default.createElement(
				'div',
				{ className: 'task-detail-content-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-content-title' },
					'任务步骤:'
				),
				ongoing.keywords ? _react2.default.createElement(
					'div',
					{ className: 'task-detail-copy task-detail-item' },
					_react2.default.createElement(
						'p',
						null,
						'第一步：长按下方区域，复制关键词',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.keywords
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-touch', onCopy: this.keywordsCopy },
						isAfterIOS8 && _react2.default.createElement('img', {
							src: 'data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=',
							alt: ongoing.keywords,
							className: 'task-detail-touch-copyUseImg'
						}),
						isAfterIOS8 && _react2.default.createElement('div', { className: 'task-detail-touch-ios9select' }),
						_react2.default.createElement(
							'div',
							{ className: 'task-detail-touch-keyword', 'data-content': ongoing.keywords },
							_react2.default.createElement(
								'div',
								{ className: 'task-detail-touch-port' },
								ongoing.keywords
							)
						)
					)
				) :
				// 没有关键词
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-copy task-detail-item' },
					_react2.default.createElement(
						'p',
						null,
						'第一步：点击开始任务',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.name
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-touch', onClick: this.noKeywordsCopy },
						_react2.default.createElement(
							'div',
							{ className: 'task-detail-touch-start btn-orange' },
							'开始任务'
						)
					)
				),
				taskDetailOpenEle
			);

			var taskDetailContentEle2 = _react2.default.createElement(
				'div',
				{ className: 'task-detail-content-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-content-title' },
					'任务步骤:'
				),
				ongoing.keywords ? _react2.default.createElement(
					'div',
					{ className: 'task-detail-copy task-detail-item' },
					_react2.default.createElement(
						'p',
						null,
						'第一步：点击按钮，复制关键词',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.keywords
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-touch' },
						_react2.default.createElement(
							'div',
							{ className: 'task-detail-touch-start btn-orange', onClick: this.clickCopy },
							'复制并在App Store搜索'
						)
					)
				) :
				// 没有关键词
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-copy task-detail-item' },
					_react2.default.createElement(
						'p',
						null,
						'第一步：点击开始下载任务',
						_react2.default.createElement(
							'b',
							{ className: 'progress' },
							ongoing.name
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-touch' },
						_react2.default.createElement(
							'div',
							{ className: 'task-detail-touch-start btn-orange', onClick: this.clickTaskDown },
							'点击前往App Store下载'
						)
					)
				),
				taskDetailOpenEle
			);

			var treasureContentEle = _react2.default.createElement(
				'div',
				{ className: 'task-detail-content-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-content-title' },
					'任务步骤:'
				),
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-copy task-detail-item' },
					_react2.default.createElement(
						'p',
						null,
						'第一步：点击下方按钮，安装配置文件'
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-touch' },
						_react2.default.createElement(
							'div',
							{ className: 'task-detail-touch-start btn-orange', onClick: this.clickConfigDown },
							'安装配置文件'
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-start task-detail-item' },
					_react2.default.createElement(
						'p',
						null,
						'第二步：安装配置文件后，提交任务'
					),
					_react2.default.createElement(
						'a',
						{
							className: 'btn-reverse',
							onClick: this.clickConfigSubmit
						},
						'提交任务'
					)
				)
			);
			var taskDetailContentEle = void 0;
			if (props.adType === 7) {
				taskDetailContentEle = treasureContentEle;
			} else {
				if (judgeVersionInfo.isNewVersion) {
					taskDetailContentEle = taskDetailContentEle2;
				} else {
					taskDetailContentEle = taskDetailContentEle1;
				}
			}

			var popupEle = this.props.modalState ? _react2.default.createElement(_popup2.default, {
				popupMessage: this.props.modal,
				modal: this.props.modal,
				modalClose: this.props.modalClose,
				directTo: this.props.directTo
			}) : '';

			return props.adType === 2 ? _react2.default.createElement(_taskDetailDeep2.default, {
				isAfterIOS8: isAfterIOS8,
				judgeVersionInfo: judgeVersionInfo,
				keyInfo: keyInfo,
				appDownload: this.appDownload.bind(this),
				adOpenFn: this.adOpenFn.bind(this),
				adClickFn: this.adClickFn.bind(this),
				openPopReminfo: this.openPopReminfo,
				isOnline: props.isOnline,
				modalState: props.modalState,
				modalOpen: props.modalOpen,
				modalClose: props.modalClose,
				modal: props.modal,
				directTo: props.directTo,
				ongoing: props.ongoing
			}) : _react2.default.createElement(
				'div',
				{ className: 'container task-detail' },
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-top-wrap' },
					waveTopEle,
					panelTopEle,
					taskDetailTopEle,
					taskDetailDescEle
				),
				_react2.default.createElement('div', { className: 'task-panel' }),
				taskDetailContentEle,
				panelBottomEle,
				deepDescInfoEle,
				popupEle
			);
		}
	}]);
	return taskDetailEle;
}(_react.Component);

taskDetailEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	isOnline: _react.PropTypes.bool.isRequired,
	adType: _react.PropTypes.number.isRequired,
	ongoing: _react.PropTypes.object.isRequired,
	ongoingDetail: _react.PropTypes.number
};
taskDetailEle.defaultPropTypes = {
	ongoing: JSON.parse(_storage2.default.session.get('ongoing') || '{}'),
	adType: +_storage2.default.local.get('adType')
};
exports.default = taskDetailEle;

/***/ },

/***/ 540:
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

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeepDetailEle = function (_Component) {
	(0, _inherits3.default)(DeepDetailEle, _Component);

	function DeepDetailEle(props) {
		(0, _classCallCheck3.default)(this, DeepDetailEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DeepDetailEle).call(this, props));

		_this.deepDetailInfo = JSON.parse(_storage2.default.session.get('ongoing') || '{}');
		_this.openDeepStart = _this.openDeepStart.bind(_this);
		_this.openPopReminfo = _this.openPopReminfo.bind(_this);
		_this.appDownload = _this.appDownload.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(DeepDetailEle, [{
		key: 'openDeepStart',
		value: function openDeepStart() {
			// 打开深度任务试玩
			var that = this;
			var props = this.props;
			var judgeVersionInfo = this.props.judgeVersionInfo;
			if (this.props.isOnline) {
				(0, _util.logEvent)('click_open_play');
				// 旧版web端判断url_schema打开应用，并发送adclick   --ios9
				// 新版发送协议adOpen,客户端打开协议，不用判断schema
				if (judgeVersionInfo.isNewVersion) {
					return props.adOpenFn();
				} else if (props.ongoing.url_schema) {
					(function () {
						// adClick
						location.href = props.ongoing.url_schema; // ios9 且存在url_schema，直接打开
						// this.loading.icon = false
						props.adClickFn();
						// 判断是否能打开应用
						var begin = new Date();
						window.setTimeout(function () {
							if (new Date().getTime() - begin < 3000) {
								props.appDownload();
								// 不直接跳转下载，弹框提示去下载
								// that.openPopReminfo()
							} else {
								window.stop();
							}
						}, 2000);
					})();
				} else if (!props.ongoing.url_schema) {
					// ios9 且不存在url_schema，弹窗提示
					props.adClickFn();
					// 不直接跳转下载，弹框提示去下载
					props.openPopReminfo();
				}
			}
		}
	}, {
		key: 'appDownload',
		value: function appDownload() {
			this.props.appDownload();
		}
	}, {
		key: 'openPopReminfo',
		value: function openPopReminfo() {
			this.props.openPopReminfo();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var deepDetailInfo = this.deepDetailInfo;
			var deepDetailList = deepDetailInfo.tasks;
			var deepDetailTop = _react2.default.createElement(
				'div',
				{ className: 'task-detail-top-wrap' },
				_react2.default.createElement(
					'div',
					{ className: 'task-detail-top' },
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-top-icon' },
						_react2.default.createElement('img', { alt: 'icon', src: deepDetailInfo.icon })
					),
					_react2.default.createElement(
						'div',
						{ className: 'task-detail-top-deepdesc' },
						_react2.default.createElement(
							'h3',
							null,
							deepDetailInfo.name
						),
						_react2.default.createElement(
							'p',
							null,
							_react2.default.createElement('span', { className: 'time-icon' }),
							'开始时间： ',
							deepDetailInfo.due_date
						),
						_react2.default.createElement(
							'div',
							{ className: 'task-detail-cost' },
							'+',
							_react2.default.createElement(
								'b',
								null,
								(deepDetailInfo.number / 100).toFixed(2)
							),
							'元'
						)
					)
				)
			);

			var deepDetailContent = _react2.default.createElement(
				'div',
				{ className: 'task-detail-deepcontent-wrap' },
				_react2.default.createElement(
					'h4',
					null,
					'深度任务',
					_react2.default.createElement(
						'span',
						null,
						'(仅限当天完成)'
					)
				),
				_react2.default.createElement(
					'ul',
					{ className: 'task-deep-listinfo' },
					deepDetailList.map(function (item, index) {
						var statusItem = void 0;
						if (item.task_status === 0) {
							statusItem = _react2.default.createElement(
								'span',
								{ className: 'deep-status0' },
								'过期'
							);
						} else if (item.task_status === 1) {
							statusItem = _react2.default.createElement(
								'span',
								{ className: 'deep-status1' },
								'进行'
							);
						} else if (item.task_status === 2) {
							statusItem = _react2.default.createElement(
								'span',
								{ className: 'deep-status2' },
								'等待'
							);
						}

						return _react2.default.createElement(
							'li',
							{ className: 'task-deep-item', key: index },
							statusItem,
							_react2.default.createElement(
								'div',
								{ className: 'task-deep-desc' },
								_react2.default.createElement(
									'p',
									null,
									index + 1,
									'.',
									item.name,
									'，',
									(item.step_rmb / 100).toFixed(2),
									'元奖励'
								),
								item.task_status === 1 ? _react2.default.createElement(
									'div',
									{ className: 'start-open-task btn-orange', onClick: _this2.openDeepStart },
									'开始任务'
								) : ''
							)
						);
					})
				)
			);
			var popupEle = this.props.modalState ? _react2.default.createElement(_popup2.default, {
				popupMessage: this.props.modal,
				modal: this.props.modal,
				modalClose: this.props.modalClose,
				directTo: this.props.directTo
			}) : '';

			return _react2.default.createElement(
				'div',
				{ className: 'container task-detail task-deep-detail' },
				deepDetailTop,
				deepDetailContent,
				_react2.default.createElement(
					'div',
					{ className: 'logo-shadow task-logo-shadow' },
					_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/logo-shadow.png', alt: 'logo-shadow' })
				),
				popupEle
			);
		}
	}]);
	return DeepDetailEle;
}(_react.Component);

DeepDetailEle.propTypes = {
	isAfterIOS8: _react.PropTypes.bool.isRequired,
	judgeVersionInfo: _react.PropTypes.object.isRequired,
	keyInfo: _react.PropTypes.object.isRequired,
	appDownload: _react.PropTypes.func.isRequired,
	adOpenFn: _react.PropTypes.func.isRequired,
	adClickFn: _react.PropTypes.func.isRequired,
	isOnline: _react.PropTypes.bool.isRequired,
	openPopReminfo: _react.PropTypes.func.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	ongoing: _react.PropTypes.object.isRequired
};
exports.default = DeepDetailEle;

/***/ },

/***/ 541:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _index = __webpack_require__(539);

var _index2 = _interopRequireDefault(_index);

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
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		modal: state.taskDetail.modal,
		modalState: state.taskDetail.modalState,
		isOnline: state.taskDetail.isOnline,
		adType: state.taskDetail.adType,
		ongoing: state.taskDetail.ongoing,
		deepDetailInfo: state.taskDetail.deepDetailInfo,
		ongoingDetail: state.taskDetail.ongoingDetail
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_index2.default);

/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = taskDetailReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	modal: {},
	modalState: false,
	isOnline: true, // 是否在线
	adType: +_storage2.default.local.get('adType'),
	ongoing: JSON.parse(_storage2.default.session.get('ongoing')) || { tasks: [] },
	ongoingDetail: +_storage2.default.local.get('cutDown') || null
};

function taskDetailReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/task-detail') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 573:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".task-detail .task-wave-top {\n  width: 100%;\n  height: 2.25rem;\n  line-height: 1.25rem;\n  font-size: 1.083rem;\n  color: #fff;\n  text-align: center;\n  background: -webkit-gradient(linear, left top, right top, from(#03baff), to(#00daff));\n  background: -webkit-linear-gradient(left, #03baff, #00daff);\n  background: linear-gradient(to right, #03baff, #00daff);\n  background: -webkit-linear-gradient(to right, #03baff, #00daff);\n  position: fixed;\n  left: 0;\n  top: 3.33rem;\n  z-index: 997; }\n\n.task-detail .task-wave-top:after {\n  display: block;\n  content: '';\n  height: 1rem;\n  width: 100%;\n  background-size: 1rem 2rem;\n  background-color: transparent;\n  background-image: -webkit-linear-gradient(45deg, #fff 50%, transparent 25%, transparent), -webkit-linear-gradient(135deg, #fff 50%, transparent 25%, transparent), -webkit-linear-gradient(45deg, transparent 25%, transparent 50%), -webkit-linear-gradient(135deg, transparent 25%, transparent 50%);\n  background-image: linear-gradient(45deg, #fff 50%, transparent 25%, transparent), linear-gradient(-45deg, #fff 50%, transparent 25%, transparent), linear-gradient(45deg, transparent 25%, transparent 50%), linear-gradient(-45deg, transparent 25%, transparent 50%);\n  position: absolute;\n  left: 0;\n  bottom: 0; }\n\n.task-detail .task-panel {\n  width: 100%;\n  height: .83rem;\n  border-top: 1px solid #f4f5f6;\n  border-bottom: 1px solid #f4f5f6;\n  background: #f4f4f4; }\n\n.task-detail .task-panel-top {\n  height: 2.25rem;\n  width: 100%; }\n\n.task-detail .task-detail-top-wrap {\n  background: #fff !important;\n  margin-bottom: .83rem; }\n  .task-detail .task-detail-top-wrap .task-detail-top {\n    padding: 1.25rem .83rem 0;\n    overflow: hidden;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    display: -webkit-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-align-items: center; }\n    .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-icon {\n      width: 3.33rem;\n      height: 3.33rem;\n      -webkit-border-radius: .8rem;\n              border-radius: .8rem;\n      overflow: hidden;\n      -webkit-transform: translateY(-0.5rem);\n      transform: translateY(-0.5rem); }\n      .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-icon img {\n        width: 100%;\n        height: 100%; }\n    .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-desc, .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc {\n      margin-left: .917rem;\n      -webkit-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      -webkit-flex: 1;\n      border-bottom: 1px solid #f4f5f7;\n      padding-bottom: .83rem;\n      position: relative; }\n      .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-desc h3, .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc h3 {\n        margin-bottom: .6rem;\n        color: #333;\n        font-size: 1.33rem;\n        font-weight: normal; }\n      .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-desc p, .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc p {\n        font-size: 1.083rem;\n        color: #999; }\n      .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-desc .task-detail-cost, .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc .task-detail-cost {\n        position: absolute;\n        right: 0;\n        bottom: 1.83rem;\n        font-size: 1.083rem;\n        color: #fe5900; }\n        .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-desc .task-detail-cost b, .task-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc .task-detail-cost b {\n          font-size: 1.83rem;\n          position: relative;\n          top: .2rem; }\n  .task-detail .task-detail-top-wrap .task-detail-description {\n    padding-left: 5.077rem;\n    font-size: 1.083rem;\n    line-height: 1.6rem;\n    padding-right: .83rem; }\n    .task-detail .task-detail-top-wrap .task-detail-description .task-description-title {\n      padding: 1.25rem 0 .5rem;\n      color: #333;\n      font-weight: bold; }\n    .task-detail .task-detail-top-wrap .task-detail-description p {\n      color: #666; }\n    .task-detail .task-detail-top-wrap .task-detail-description p.progress {\n      color: #ff733d;\n      font-weight: bold; }\n\n.task-detail .task-detail-content-wrap {\n  padding: 0 5.077rem;\n  font-size: 1.083rem;\n  color: #333; }\n  .task-detail .task-detail-content-wrap .task-detail-content-title {\n    padding-top: 1.25rem;\n    font-weight: bold; }\n  .task-detail .task-detail-content-wrap .task-detail-item {\n    padding-bottom: 1.25rem; }\n    .task-detail .task-detail-content-wrap .task-detail-item p {\n      text-align: left;\n      padding: 1.25rem 0 .83rem;\n      line-height: 1.7rem;\n      font-size: 1.083rem !important; }\n  .task-detail .task-detail-content-wrap .task-detail-copy {\n    border-bottom: 1px solid #f4f5f7; }\n    .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch {\n      padding-top: 0;\n      width: 15rem;\n      font-size: 2rem;\n      -webkit-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      -webkit-flex: 1;\n      line-height: 8rem;\n      position: relative;\n      text-align: center;\n      -webkit-user-select: text;\n      -moz-user-select: text;\n       -ms-user-select: text;\n           user-select: text;\n      background-color: #fff;\n      color: #fff; }\n      .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-copyUseImg, .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-ios9select {\n        position: absolute;\n        top: 0;\n        left: 50%;\n        z-index: 99;\n        width: 15rem;\n        height: 7rem;\n        -webkit-transform: translateX(-50%);\n        transform: translateX(-50%);\n        border: 1px dashed transparent; }\n      .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-start {\n        width: 15rem;\n        height: 4rem;\n        line-height: 4rem;\n        font-size: 1.13rem;\n        margin: 1rem auto;\n        -webkit-border-radius: 2rem;\n                border-radius: 2rem; }\n      .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-copyUseImg {\n        -webkit-user-select: none;\n        -moz-user-select: none;\n         -ms-user-select: none;\n             user-select: none;\n        z-index: -1; }\n      .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-keyword {\n        margin: 0 auto;\n        width: 15rem;\n        height: 7rem;\n        -webkit-border-radius: .5rem;\n                border-radius: .5rem;\n        white-space: nowrap;\n        position: relative;\n        color: #fff;\n        border: 1px dashed #cdcdcd; }\n        .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-keyword .task-detail-touch-port {\n          width: 7rem;\n          height: 6rem;\n          background: url(\"http://cc-cdn.dianjoy.com/91atm/images/hand_code.jpg\") no-repeat center center;\n          background-size: contain;\n          position: absolute;\n          left: 50%;\n          top: 50%;\n          transform: translate(-50%, -50%);\n          -webkit-transform: translate(-50%, -50%);\n          overflow: hidden; }\n        .task-detail .task-detail-content-wrap .task-detail-copy .task-detail-touch .task-detail-touch-keyword:after {\n          content: attr(data-content);\n          font-size: 2rem;\n          position: absolute;\n          left: 0;\n          right: 0;\n          text-align: center;\n          top: -.5rem;\n          color: #333; }\n\n.task-detail .task-detail-start {\n  font-size: 1.1666rem;\n  padding: 0 0 6rem;\n  text-align: center;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  -webkit-flex: 1; }\n  .task-detail .task-detail-start a {\n    display: block;\n    height: 4rem;\n    line-height: 4rem;\n    -webkit-border-radius: 2rem;\n            border-radius: 2rem;\n    margin: 0;\n    width: 15rem;\n    font-size: 1.13rem; }\n\n.task-deep-detail {\n  min-height: 26.887rem;\n  background: #f4f4f4 !important; }\n  .task-deep-detail .task-detail-top-wrap {\n    margin-top: .667rem; }\n    .task-deep-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc {\n      border-bottom: none 0; }\n      .task-deep-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc h3 {\n        font-size: 1.083rem;\n        font-weight: normal; }\n      .task-deep-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc p {\n        position: relative;\n        padding-left: 1.617rem;\n        font-size: .917rem; }\n        .task-deep-detail .task-detail-top-wrap .task-detail-top .task-detail-top-deepdesc p .time-icon {\n          position: absolute;\n          left: 0;\n          top: -.12rem;\n          width: 1.2rem;\n          height: 1.2rem;\n          background: url(\"http://cc-cdn.dianjoy.com/91atm/images/time.png\") no-repeat center center;\n          background-size: cover; }\n    .task-deep-detail .task-detail-top-wrap .task-detail-top .task-detail-cost b {\n      font-weight: normal; }\n  .task-deep-detail .task-detail-deepcontent-wrap {\n    background: #fff;\n    font-size: 1.083rem; }\n    .task-deep-detail .task-detail-deepcontent-wrap h4 {\n      margin-left: 5.25rem;\n      border-bottom: 1px solid #f4f5f6;\n      padding: 1.25rem 0;\n      font-weight: normal; }\n      .task-deep-detail .task-detail-deepcontent-wrap h4 span {\n        color: #999; }\n\nul.task-deep-listinfo {\n  padding-left: 1.25rem; }\n  ul.task-deep-listinfo li.task-deep-item {\n    position: relative; }\n    ul.task-deep-listinfo li.task-deep-item span {\n      background: #f4f4f4;\n      color: #999;\n      border: 1px solid #d6d6d6;\n      -webkit-border-radius: 50%;\n              border-radius: 50%;\n      position: absolute;\n      left: 0;\n      top: .7rem;\n      width: 2.08rem;\n      height: 2.08rem;\n      line-height: 2.08rem;\n      text-align: center;\n      font-size: .83rem;\n      vertical-align: middle; }\n    ul.task-deep-listinfo li.task-deep-item .deep-status1 {\n      background: #fef1e8;\n      border: 1px solid rgba(255, 83, 20, 0.4);\n      color: #ff733d; }\n    ul.task-deep-listinfo li.task-deep-item .deep-status0 + div p {\n      color: #999; }\n    ul.task-deep-listinfo li.task-deep-item .task-deep-desc {\n      margin-left: 4rem;\n      border-bottom: 1px solid #f4f5f6;\n      padding: .66rem .83rem .66rem 0;\n      color: #333; }\n      ul.task-deep-listinfo li.task-deep-item .task-deep-desc p {\n        line-height: 2.4rem; }\n      ul.task-deep-listinfo li.task-deep-item .task-deep-desc .start-open-task {\n        line-height: 3rem;\n        -webkit-border-radius: 2rem;\n                border-radius: 2rem;\n        text-align: center;\n        margin: .58rem 0 1.416rem; }\n  ul.task-deep-listinfo li:last-child .task-deep-desc {\n    border-bottom: none 0 !important; }\n\n.deep-task-desc-wrap {\n  position: relative;\n  padding-left: 5.077rem; }\n  .deep-task-desc-wrap span {\n    position: absolute;\n    left: .917rem;\n    top: .5rem;\n    background: url(\"http://cc-cdn.dianjoy.com/91atm/images/deblock.png\") no-repeat center center;\n    background-size: contain;\n    width: 2.5rem;\n    height: 2.5rem;\n    -webkit-border-radius: 50%;\n            border-radius: 50%;\n    overflow: hidden; }\n  .deep-task-desc-wrap h4 {\n    padding-top: 1.25rem;\n    font-size: 1.083rem;\n    color: #333; }\n  .deep-task-desc-wrap h5 {\n    font-weight: normal;\n    color: #999;\n    padding: .5rem  0 .583rem;\n    font-size: 1.083rem; }\n  .deep-task-desc-wrap p {\n    color: #333;\n    font-size: 1.083rem;\n    line-height: 1.8rem; }\n    .deep-task-desc-wrap p b {\n      font-weight: normal;\n      padding-right: .917rem; }\n", ""]);

// exports


/***/ },

/***/ 589:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(573);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./taskDetail.sass", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/sass-loader/index.js!./taskDetail.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }

});