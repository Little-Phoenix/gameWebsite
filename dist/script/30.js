webpackJsonp([30],{

/***/ 434:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _downInviteContainer = __webpack_require__(505);

var _downInviteContainer2 = _interopRequireDefault(_downInviteContainer);

var _downInvite = __webpack_require__(506);

var _downInvite2 = _interopRequireDefault(_downInvite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'downInvite', reducer: _downInvite2.default });
	cb(null, _downInviteContainer2.default);
}; // import { injectReducer } from '../../reducers'
// import { rootPath } from '../config'

// export default (store) => ({
// 	path: `${rootPath}/down-invite`,
// 	getComponent(nextState, cb) {
// 		Promise.all([
// 			System.import('./containers/downInviteContainer'),
// 			System.import('./modules/downInvite')
// 		]).then((modules) => {
// 			const downInvite = modules[0].default
// 			const reducer = modules[1].default
// 			injectReducer(store, { key: 'downInvite', reducer })
// 			cb(null, downInvite)
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

/***/ 476:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(562);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(455)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./downInvite.sass", function() {
			var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./downInvite.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 501:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});
var userNeedknowInfo = exports.userNeedknowInfo = '<p>试玩团所提供的各项服务的所有权和运作权均归深圳蜜乐无限信息科技有限公司（以下简称“蜜乐”）所有。试玩团用户使用协议（以下简称“本协议”）系由试玩团用户与蜜乐就试玩团的各项服务所订立的相关权利义务规范。用户通过访问或使用本应用，即表示接受并同意本协议的所有条件和条款。蜜乐作为试玩团的运营者依据本协议为用户提供服务。不愿接受本协议条款的，不得访问或使用本应用。</p>' + '<p>蜜乐有权对本协议条款进行修改，修改后的协议一旦公布即有效代替原来的协议。用户可随时查阅最新协议。</p>' + '<h7>一、服务内容</h7>' + '<p>1、试玩团运用自己的系统，通过互联网络、手机应用等方式为用户提供应用下载、奖品兑换等服务。</p>' + '<p>2、用户提供的注册资料，用户同意：（1）提供合法、真实、准确、详尽的个人资料； （2）如有变动，及时更新用户资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且蜜乐保留终止用户使用试玩团各项服务的权利。</p>' + '<h7>二、服务的提供、修改及终止</h7>' + '<p>1、用户在接受试玩团各项服务的同时，同意接受试玩团提供的各类信息服务。用户在此授权蜜乐可以向其电子邮件、手机、通信地址等发送商业信息</p>' + '<p>2、试玩团保留随时修改或中断服务而不需通知用户的权利。试玩团有权行使修改或中断服务的权利，不需对用户或任何无直接关系的第三方负责。</p>' + '<p>3、用户对本协议的修改有异议，或对试玩团的服务不满，可以行使如下权利：</p>' + '<p>（1）停止使用试玩团的服务；</p>' + '<p>（2）通过客服等渠道告知试玩团停止对其服务。 结束服务后，用户使用试玩团络服务的权利立即终止。在此情况下，试玩团没有义务传送任何未处理的信息或未完成的服务给用户或任何无直接关系的第三方。</p>' + '<h7>三、用户信息的保密</h7>' + '<p>1、本协议所称之试玩团用户信息是指符合法律、法规及相关规定，并符合下述范围的信息：</p>' + '<p>（1）用户注册试玩团或申请试玩团服务时，向试玩团提供的个人信息；</p>' + '<p>（2）用户在使用试玩团服务、参加应用活动或访问应用网页时，试玩团自动接收并记录的用户浏览器端或手机客户端数据，包括但不限于IP地址、应用Cookie中的资料及用户要求取用的网页记录；</p>' + '<p>（3）试玩团从商业伙伴处合法获取的用户个人信息；</p>' + '<p>（4）其它试玩团通过合法途径获取的用户个人信息。</p>' + '<p>2、试玩团承诺：非经法定原因或用户事先许可，试玩团不会向任何第三方透露用户的手机号码等非公开信息</p>' + '<p>3、在下述法定情况下，用户的个人信息将会被部分或全部披露：</p>' + '<p>（1）经用户同意向用户本人或其他第三方披露；</p>' + '<p>（2）根据法律、法规等相关规定，或行政机构要求，向行政、司法机构或其他法律规定的第三方披露；</p>' + '<p>（3）其它试玩团根据法律、法规等相关规定进行的披露。</p>' + '<h7>四、用户权利</h7>' + '<p>1、用户的账号、安全性</p>' + '<p>（1）用户有权选择是否成为试玩团会员，用户选择成为试玩团注册用户的，可自行创建、修改昵称。用户名和昵称的命名及使用应遵守相关法律法规并符合网络道德。用户名和昵称中不能含有任何侮辱、威胁、淫秽、谩骂等侵害他人合法权益的文字。</p>' + '<p>（2）用户一旦注册成功，成为试玩团的会员，将得到用户账号，并对以此组账号登入系统后所发生的所有活动和事件负责，自行承担一切使用该用户名的言语、行为等而直接或者间接导致的法律责任。</p>' + '<p>（3）用户有义务妥善保管试玩团账号、用户名，用户将对账号安全负全部责任。因用户原因导致用户名泄露而造成的任何法律后果由用户本人负责。</p>' + '<p>（4）用户账号丢失，可以通过绑定的手机号码发送的验证码找回账号。用户若发现任何非法使用用户名或存在其他安全漏洞的情况，应立即告知试玩团。</p>' + '<p>2、用户有权根据应用相关规定，在完成应用所规定的任务后，取得试玩团给予的奖励；</p>' + '<p>3、用户有权修改其个人账户中各项可修改信息；</p>' + '<p>4、用户有权参加试玩团社区、贴吧、微信社区并发表符合国家法律规定，并符合试玩团社区、贴吧规则的文章及观点；</p>' + '<p>5、用户有权根据应用相关规定，获得试玩团给与的奖励（如积分、徽章、虚拟道具等）；</p>' + '<p>6、用户有权参加试玩团组织提供的各项线上、线下活动；</p>' + '<p>7、用户有权在试玩团上自行浏览、兑换奖品。</p>' + '<p>8、用户有权根据试玩团规定，享受试玩团提供的其它各类服务。</p>' + '<h7>五、用户义务</h7>' + '<p>1、不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：</p>' + '<p>（1）煽动抗拒、破坏宪法和法律、行政法规实施的；</p>' + '<p>（2）煽动颠覆国家政权，推翻社会主义制度的；</p>' + '<p>（3）煽动分裂国家、破坏国家统一的；</p>' + '<p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>' + '<p>（5）捏造或者歪曲事实，散布谣言，扰乱社会秩序的；</p>' + '<p>（6）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；</p>' + '<p>（7）公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；</p>' + '<p>（8）损害国家机关信誉的；</p>' + '<p>（9）其他违反宪法和法律行政法规的；</p>' + '<p>（10）进行商业广告行为的。</p>' + '<p>2、用户不得通过任何手段恶意注册试玩团站帐号，包括但不限于以牟利、炒作、套现、获奖等为目的多个账号注册。用户亦不得盗用其他用户帐号。</p>' + '<p>如用户违反上述规定，则试玩团有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在应用获得的虚拟、实物财富，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。</p>' + '<p>3、禁止用户将试玩团以任何形式作为从事各种非法活动的场所、平台或媒介。未经试玩团的授权或许可，用户不得借用本站的名义从事任何商业活动，也不得以任何形式将试玩团作为从事商业活动的场所、平台或媒介。 如用户违反上述规定，则试玩团有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在应用获得的星级、荣誉以及虚拟财富，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。</p>' + '<p>4、用户在试玩团以各种形式发布的一切信息，均应符合国家法律法规等相关规定及应用相关规定，符合社会公序良俗，并不侵犯任何第三方主体的合法权益，否则用户自行承担因此产生的一切法律后果，且蜜乐因此受到的损失，有权向用户追偿。</p>' + '<p>六、拒绝担保与免责</p>' + '<p>1、试玩团作为“网络服务提供者”的第三方平台，不担保应用平台上的信息及服务能充分满足用户的需求。对于用户在接受试玩团的服务过程中可能遇到的错误、侮辱、诽谤、不作为、淫秽、色情或亵渎事件，试玩团不承担法律责任。</p>' + '<p>2、基于互联网的特殊性，试玩团也不担保服务不会受中断，对服务的及时性、安全性都不作担保，不承担非因试玩团导致的责任。试玩团力图使用户能对本应用进行安全访问和使用，但试玩团不声明也不保证本应用或其服务器是不含病毒或其它潜在有害因素的；</p>' + '<p>3、试玩团不对用户所发布信息的保存、修改、删除或储存失败负责。对应用上的非因试玩团故意所导致的排字错误、疏忽等不承担责任。试玩团有权但无义务，改善或更正本应用任何部分之疏漏、错误。</p>' + '<p>4、除非试玩团以书面形式明确约定，试玩团对于用户以任何方式（包括但不限于包含、经由、连接或下载）从本应用所获得的任何内容信息，包括但不限于广告、应用下载、奖励兑换内容等，不保证其准确性、完整性、可靠性；对于用户因本应用上的内容信息而购买、获取的任何产品、服务、信息或资料，试玩团不承担责任。用户自行承担使用本应用信息内容所导致的风险。</p>' + '<p>5、试玩团内所有用户所发表的用户信息，仅代表用户个人观点，并不表示本应用赞同其观点或证实其描述，本应用不承担用户所发布的信息引发的任何法律责任。</p>' + '<p>6、蜜乐有权删除试玩团内各类不符合法律或协议规定的用户信息，而保留不通知用户的权利。</p>' + '<p>7、所有发给用户的通告，试玩团都将通过正式的页面公告、应用内通知、电子邮件、客服电话、手机短信或常规的信件送达。任何非经试玩团正规渠道获得的中奖、优惠等活动或信息，试玩团不承担法律责任。</p>' + '<p>8、为了更好的服务试玩团用户，给用户更好的体验效果，也为了留住优质用户清除“僵尸用户“，我们有权对现有用户和新注册用户进行甄别，针对三个月内没有登陆行为或者任何积分更新行为（加减积分）的用户我们会进行筛选并短信或站内信通知，被通知用户将进入14天的休眠期。如果休眠期内的用户在休眠期间有登录行为或者任何积分更新行为（加减积分），用户将消除休眠状态恢复正常，如果休眠期内用户仍没有任何登陆行为或者任何积分更新行为（加减积分），该用户余额将被清零。用户由此产生的损失我公司概不负责。（提醒广大用户一定要保证注册信息真实有效且注册手机号能够正常使用，由于用户修改个人信息且没有在试玩团上更新的，造成损失的由用户个人承担）</p>' + '<h7>七、侵权投诉</h7>' + '<p>1、据《中华人民共和国侵权责任法》第三十六条，任何第三方认为，用户利用试玩团平台侵害本人民事权益或实施侵权行为的，包括但不限于侮辱、诽谤等，被侵权人有权书面通知试玩团采取删除、屏蔽、断开链接等必要措施。</p>' + '<p>2、据《信息网络传播权保护条例》，任何第三方认为，试玩团所涉及的作品、表演、录音录像制品，侵犯自己的信息网络传播权或者被删除、改变了自己的权利管理电子信息的，可以向试玩团提交书面通知，要求试玩团删除该侵权作品，或者断开链接。通知书应当包含下列内容：</p>' + '<p>（一）权利人的姓名（名称）、联系方式和地址；</p>' + '<p>（二）要求删除或者断开链接的侵权作品、表演、录音录像制品的名称和网络地址；</p>' + '<p>（三）构成侵权的初步证明材料。</p>' + '<p>权利人应当对通知书的真实性负责。</p>' + '<p>此外，为使试玩团能及时、准确作出判断，还请侵权投诉人一并提供以下材料：</p>' + '<p>3、任何第三方（包括但不限于企业、公司、单位或个人等）认为试玩团用户发布的任何信息侵犯其合法权益的，包括但不限于以上两点；</p>' + '<p>4、侵权投诉必须包含下述信息：</p>' + '<p>（1）被侵权人的证明材料，或被侵权作品的原始链接及其它证明材料。</p>' + '<p>（2）侵权信息或作品在试玩团上的具体界面。</p>' + '<p>（3）侵权投诉人的联络方式，以便试玩团相关部门能及时回复您的投诉，最好包括电子邮件地址、电话号码或手机等。</p>' + '<p>（4）投诉内容须纳入以下声明：“本人本着诚信原则，有证据认为该对象侵害本人或他人的合法权益。本人承诺投诉全部信息真实、准确，否则自愿承担一切后果。”</p>' + '<p>（5）本人亲笔签字并注明日期，如代理他人投诉的，必须出具授权人签字的授权书。</p>' + '<p>5、试玩团建议用户在提起投诉之前咨询法律顾问或律师。我们提请用户注意：如果对侵权投诉不实，则用户可能承担法律责任。</p>' + '<h7>八、适用法律和裁判地点</h7>' + '<p>1、因用户使用试玩团站而引起或与之相关的一切争议、权利主张或其它事项，均受中华人民共和国法律的管辖。</p>' + '<p>2、用户和试玩团发生争议的，应首先本着诚信原则通过协商加以解决。如果协商不成，则应向蜜乐所在地人民法院提起诉讼。</p>' + '<h7>九、可分性</h7>' + '<p>如果本协议的任何条款被视为不合法、无效或因任何原因而无法执行，则此等规定应视为可分割，不影响任何其它条款的法律效力。</p>' + '<h7>十、冲突选择</h7>' + '<p>本协议是试玩团与用户注册成为试玩团用户，使用试玩团服务之间的重要法律文件，试玩团或者用户的任何其他书面或者口头意思表示与本协议不一致的，均应当以本协议为准。</p>' + '<h7>十一、特别提醒</h7>' + '<p>鉴于试玩团已依法明确了上述条款、履行了格式条款制订方的义务，用户点击立即注册或使用试玩团各项服务，将被视为且应当被视为用户已经完全注意并同意了本合同所有条款尤其是提醒用户注意的条款的合法性及有效性，用户不应当以试玩团未对格式条款以合理方式提醒用户注意或未根据用户要求尽到说明义务为理由而声称或要求法院或其它任何第三方确认相关条款非法或无效。</p>' + '<p class="popup-footer">《试玩团》项目组</p>' + '<p class="popup-footer">2016年4月18日</p>';

/***/ },

/***/ 502:
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

__webpack_require__(476);

var _ua = __webpack_require__(458);

var _ua2 = _interopRequireDefault(_ua);

var _util = __webpack_require__(86);

var _mask = __webpack_require__(466);

var _mask2 = _interopRequireDefault(_mask);

var _previewTask = __webpack_require__(592);

var _previewTask2 = _interopRequireDefault(_previewTask);

var _userNeedKnow = __webpack_require__(501);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DownInvite = function (_React$Component) {
	(0, _inherits3.default)(DownInvite, _React$Component);

	function DownInvite(props) {
		(0, _classCallCheck3.default)(this, DownInvite);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DownInvite).call(this, props));

		_this.clickDown = _this.clickDown.bind(_this);
		_this.totalScrollFn = _this.totalScrollFn.bind(_this);
		_this.plistVerify = _this.plistVerify.bind(_this);
		_this.clickUerAgree = _this.clickUerAgree.bind(_this);
		_this.userNeedknow = _this.userNeedknow.bind(_this);
		_this.usedataDownload = _this.usedataDownload.bind(_this);
		_this.total = 327393240;
		_this.scrollTimer = {};
		_this.isMask = _this.props.isMask || false;
		return _this;
	}

	(0, _createClass3.default)(DownInvite, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.props.modalState === nextProps.modalState && this.refs.total_info) {
				this.totalScrollFn();
			}
		}
	}, {
		key: 'clickUerAgree',
		value: function clickUerAgree() {
			this.props.valChange(!this.props.userAgreeStatus, 'userAgreeStatus');
		}
	}, {
		key: 'userNeedknow',
		value: function userNeedknow() {
			var props = this.props;
			props.modalOpen({
				title: '试玩团用户协议须知',
				content: _userNeedKnow.userNeedknowInfo,
				confirm: '我已阅读并同意',
				popClassStr: 'popup-needknow',
				closable: true,
				confirmCallback: function confirmCallback() {
					props.valChange(true, 'userAgreeStatus');
				},
				canClose: true
			});
		}
	}, {
		key: 'plistVerify',
		value: function plistVerify(downloadUrl) {
			var props = this.props;
			props.valChange('http://cc-cdn.dianjoy.com/91atm/images/announce-down-wait.jpg', 'downInviteBottom');
			location.href = downloadUrl || props.downInviteInfo.url;
			setTimeout(function () {
				if (_ua2.default.isAfterIOS8) props.valChange(true, 'guideStatus');
			}, 2000);

			setTimeout(function () {
				if (+props.inviter === 63451) {
					props.valChange('http://cc-cdn.dianjoy.com/91atm/images/sst-down.jpg', 'downInviteBottom');
				} else {
					props.valChange('http://cc-cdn.dianjoy.com/91atm/images/announce-down2.jpg', 'downInviteBottom');
				}
			}, 60000);
		}
	}, {
		key: 'clickDown',
		value: function clickDown() {
			var that = this;
			var props = that.props;
			// s微信中显示跳转 Safari, 安卓跳转红包锁屏下载
			if (_ua2.default.isWeixin || _ua2.default.isQQ) {
				this.isMask = true;
				props.valChange(true, 'isMask');
				return;
			} else if (_ua2.default.isAndroid) {
				props.directTo('./hb-download');
				return;
			}

			var downInviteInfo = props.downInviteInfo;

			// 邀请团号为1853941的落地页
			var downloadUrl = void 0;
			if (~[1853941, 1614790].indexOf(+props.inviter)) {
				downloadUrl = 'itms-services://?action=download-manifest&url=https://www.hongbaosuoping.com/plist/aishiplay1.plist';
			} else {
				downloadUrl = downInviteInfo.url;
			}
			// 判断是否为企业版的包
			var plisIndex = downloadUrl.lastIndexOf('.');
			function confirmCallback() {
				(0, _util.logEvent)('invite_download');
				if (downloadUrl) {
					setTimeout(function () {
						location.href = downloadUrl;
					}, 100);
				}
			}
			if (downloadUrl.slice(plisIndex + 1) === 'plist') {
				this.plistVerify(downloadUrl);
			} else {
				if (_ua2.default.isIOS10) {
					props.valChange(true, 'usedataPopStatus');
				} else {
					props.modalOpen({
						title: '您的试玩专用守护是',
						content: 'showImg',
						confirm: '立即下载',
						desc: downInviteInfo.app_name || '试玩守护',
						imgSrc: downInviteInfo.icon || 'http://cc-cdn.dianjoy.com/91atm/images/logo.png',
						closeable: true,
						popClassStr: 'popup-down-alert',
						confirmCallback: confirmCallback,
						canClose: true
					});
				}
			}
		}
	}, {
		key: 'usedataDownload',
		value: function usedataDownload() {
			var props = this.props;
			function changeUsedataStatus() {
				props.valChange(false, 'usedataPopStatus');
			}
			setTimeout(changeUsedataStatus, 50);
			location.href = props.downInviteInfo.url || '';
		}
	}, {
		key: 'totalScrollFn',
		value: function totalScrollFn() {
			var totalInfoEle = this.refs.total_info;
			// let width = document.body.offsetWidth
			// let fontSize = width / 320 * 12
			var h = totalInfoEle.offsetHeight / 2;
			var T = 0;
			var that = this;
			function toTopScroll() {
				T -= 1;
				if (T < 0) {
					totalInfoEle.style.webkitTransform = 'translateY(' + T % h + 'px)';
					totalInfoEle.style.transform = 'translateY(' + T % h + 'px)';
				} else {
					totalInfoEle.style.webkitTransform = 'translateY(' + (T % h - h) % h + 'px)';
					totalInfoEle.style.transform = 'translateY(' + (T % h - h) % h + 'px)';
				}
				// total每2s加20元
				if (T % h === 20 - h) {
					that.total += 20;
				}
			}
			function toTop() {
				clearInterval(that.scrollTimer);
				that.scrollTimer = setInterval(toTopScroll, 100);
			}
			toTop();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var props = this.props;
			var maskEle = props.isMask ? _react2.default.createElement(_mask2.default, null) : '';
			var iconSrc = props.downInviteInfo.icon || 'http://cc-cdn.dianjoy.com/91atm/images/logo.png';
			var appName = props.downInviteInfo.app_name || '试玩守护';
			var useDataAgreeEle = void 0;
			if (props.usedataPopStatus) {
				useDataAgreeEle = _react2.default.createElement(
					'div',
					{ className: 'usedata-agree' },
					_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/usedata-agree.png', alt: '' }),
					_react2.default.createElement(
						'div',
						{ className: 'usedata-agree-icon' },
						_react2.default.createElement('img', { src: iconSrc, alt: '' }),
						_react2.default.createElement(
							'p',
							null,
							_react2.default.createElement(
								'span',
								null,
								'“',
								appName,
								'”'
							),
							'是您的专用守护'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'usedata-agree-down', onClick: this.usedataDownload },
						'立即下载'
					)
				);
			}

			return _react2.default.createElement(
				'div',
				{ className: 'main down-invite container' },
				_react2.default.createElement(
					'div',
					{ className: 'announce' },
					_react2.default.createElement('img', {
						src: props.downInviteTop,
						alt: 'announce'
					}),
					_react2.default.createElement(
						'div',
						{ className: 'announce-info' },
						_react2.default.createElement(
							'div',
							{ className: 'total-info-wrap' },
							_react2.default.createElement(
								'div',
								{ className: 'total-info', ref: 'total_info' },
								_react2.default.createElement(
									'p',
									{ className: 'gold-rem-info' },
									'￥',
									this.total
								),
								_react2.default.createElement(
									'p',
									{ className: 'gold-rem-info' },
									'￥',
									this.total
								)
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'down-invite-container' },
					_react2.default.createElement(
						'div',
						{ className: 'title' },
						'海量任务即将上线，',
						_react2.default.createElement(
							'span',
							{ className: 'rem-info' },
							_react2.default.createElement(
								'span',
								{ className: 'cash-rem-info' },
								'618'
							),
							'元'
						),
						'现金等你来拿！'
					),
					_react2.default.createElement(
						'ul',
						null,
						_previewTask2.default.offers.map(function (item, i) {
							var stepRmb = (item.step_rmb / 100).toFixed(1);
							return _react2.default.createElement(
								'li',
								{ key: i, onClick: _this2.downPup },
								_react2.default.createElement(
									'div',
									{ className: 'list-icon' },
									_react2.default.createElement('img', { src: item.icon, alt: 'icon' })
								),
								_react2.default.createElement(
									'div',
									{ className: 'list-content' },
									_react2.default.createElement(
										'p',
										null,
										item.ad_name
									),
									_react2.default.createElement(
										'span',
										null,
										'剩余',
										item.reset_num,
										'个'
									)
								),
								_react2.default.createElement(
									'div',
									{ className: 'list-price rem-info' },
									_react2.default.createElement(
										'span',
										null,
										'+'
									),
									_react2.default.createElement(
										'span',
										null,
										stepRmb
									),
									'元'
								)
							);
						})
					),
					_react2.default.createElement(
						'div',
						{ className: 'copyright' },
						_react2.default.createElement(
							'div',
							{ className: 'user-agreement' },
							_react2.default.createElement(
								'div',
								{ onClick: this.clickUerAgree, className: 'user-agreement-box' },
								_react2.default.createElement('input', { type: 'checkbox', name: 'agree' }),
								_react2.default.createElement('span', { className: props.userAgreeStatus ? 'agree' : 'disagree' })
							),
							_react2.default.createElement(
								'div',
								{ onClick: this.userNeedknow, className: 'user-need-know' },
								'我已经阅读并同意《试玩团用户须知协议》'
							)
						),
						_react2.default.createElement(
							'p',
							null,
							'官方微博：深圳蜜乐'
						),
						_react2.default.createElement(
							'p',
							null,
							'粤ICP备16037684号-1'
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'down-invite-footer' },
					_react2.default.createElement('img', {
						alt: '安装试玩团',
						onClick: this.clickDown,
						src: props.downInviteBottom
					})
				),
				maskEle,
				useDataAgreeEle
			);
		}
	}]);
	return DownInvite;
}(_react2.default.Component);

DownInvite.propTypes = {
	downInviteInfo: _react.PropTypes.object.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	downInviteBottom: _react.PropTypes.string.isRequired,
	downInviteTop: _react.PropTypes.string.isRequired,
	inviter: _react.PropTypes.string.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	userAgreeStatus: _react.PropTypes.bool.isRequired,
	isMask: _react.PropTypes.bool.isRequired,
	usedataPopStatus: _react.PropTypes.bool.isRequired
};
DownInvite.defaultProps = {
	downInviteBottom: 'http://cc-cdn.dianjoy.com/91atm/images/announce-down2.jpg',
	downInviteTop: 'http://cc-cdn.dianjoy.com/91atm/images/announce4.jpg',
	userAgreeStatus: true
};
exports.default = DownInvite;

/***/ },

/***/ 503:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

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

var _downInvite = __webpack_require__(502);

var _downInvite2 = _interopRequireDefault(_downInvite);

var _specialDownInvite = __webpack_require__(504);

var _specialDownInvite2 = _interopRequireDefault(_specialDownInvite);

var _popup = __webpack_require__(456);

var _popup2 = _interopRequireDefault(_popup);

var _guide = __webpack_require__(465);

var _guide2 = _interopRequireDefault(_guide);

var _util = __webpack_require__(86);

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

__webpack_require__(476);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DownInviteEle = function (_React$Component) {
	(0, _inherits3.default)(DownInviteEle, _React$Component);

	function DownInviteEle(props) {
		(0, _classCallCheck3.default)(this, DownInviteEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DownInviteEle).call(this, props));

		_this.specialChannel = false;
		_this.inviter = '';
		return _this;
	}

	(0, _createClass3.default)(DownInviteEle, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var user = _storage2.default.local.get('user');
			var inviter = (0, _util.blurryTrim)('inviter') || '';
			if (inviter) {
				_storage2.default.local.set('inviter', inviter);
			}
			this.inviter = inviter;
			if (~[63450, 1614505, 1614746].indexOf(+inviter)) {
				// 对于渠道邀请的用户，跳转到特殊版本的着陆页
				this.specialChannel = true;
			} else {
				this.specialChannel = false;
			}

			if (+inviter === 63451) {
				// 试尚团推荐下载
				this.props.valChange('http://cc-cdn.dianjoy.com/91atm/images/sst-zhuan.jpg', 'downInviteTop');
				this.props.valChange('http://cc-cdn.dianjoy.com/91atm/images/sst-down.jpg', 'downInviteBottom');
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.props.fetchList('/firmware/client/refresh/', undefined, 'downInviteInfo');
		}
	}, {
		key: 'render',
		value: function render() {
			var props = this.props;
			var popupEle = props.modalState ? _react2.default.createElement(_popup2.default, {
				popupMessage: props.modal,
				modal: props.modal,
				modalClose: props.modalClose,
				directTo: props.directTo
			}) : '';

			var guideEle = this.props.guideStatus ? _react2.default.createElement(_guide2.default, {
				valChange: props.valChange,
				progress: props.progress,
				guideStatus: props.guideStatus,
				guideImage: props.guideImage
			}) : '';
			var mainEle = this.specialChannel ? _react2.default.createElement(_specialDownInvite2.default, props) : _react2.default.createElement(_downInvite2.default, (0, _extends3.default)({}, props, {
				inviter: this.inviter
			}));

			return _react2.default.createElement(
				'div',
				null,
				mainEle,
				popupEle,
				guideEle
			);
		}
	}]);
	return DownInviteEle;
}(_react2.default.Component);

DownInviteEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	modal: _react.PropTypes.object.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	valChange: _react.PropTypes.func.isRequired,
	progress: _react.PropTypes.object.isRequired,
	guideStatus: _react.PropTypes.bool.isRequired,
	downInviteBottom: _react.PropTypes.string.isRequired,
	downInviteTop: _react.PropTypes.string.isRequired,
	userAgreeStatus: _react.PropTypes.bool.isRequired,
	guideImage: _react.PropTypes.object.isRequired,
	downInviteInfo: _react.PropTypes.object.isRequired,
	isMask: _react.PropTypes.bool.isRequired,
	usedataPopStatus: _react.PropTypes.bool.isRequired
};
exports.default = DownInviteEle;

/***/ },

/***/ 504:
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

__webpack_require__(476);

var _ua = __webpack_require__(458);

var _ua2 = _interopRequireDefault(_ua);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Mask from '../../../components/mask'

var SpecialDownInvite = function (_React$Component) {
	(0, _inherits3.default)(SpecialDownInvite, _React$Component);

	function SpecialDownInvite(props) {
		(0, _classCallCheck3.default)(this, SpecialDownInvite);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SpecialDownInvite).call(this, props));

		_this.isWeixin = _ua2.default.isWeixin || false;
		_this.downInviteInfo = _this.props.downInviteInfo;
		_this.specialChannelDownload = _this.specialChannelDownload.bind(_this);
		_this.specialPlistVerify = _this.specialPlistVerify.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(SpecialDownInvite, [{
		key: 'specialPlistVerify',
		value: function specialPlistVerify() {
			var that = this;
			location.href = this.downInviteInfo.url;
			setTimeout(function () {
				return _ua2.default.isAfterIOS8 && that.props.valChange(true, 'guideStatus');
			}, 2000);
		}
	}, {
		key: 'specialChannelDownload',
		value: function specialChannelDownload() {
			// if($ua.isWeibo) {
			// 	return this.isWeixin = true
			// }
			(0, _util.logEvent)('special_channel_download');

			// 判断是否为企业版的包
			var downInviteInfo = this.props.downInviteInfo;
			var plisIndex = downInviteInfo.url.lastIndexOf('.');
			if (downInviteInfo.url.slice(plisIndex + 1) === 'plist') {
				this.specialPlistVerify();
			} else {
				location.href = downInviteInfo.url;
			}
		}
	}, {
		key: 'render',
		value: function render() {

			return _react2.default.createElement(
				'div',
				{ className: 'main down-invite-speical container' },
				_react2.default.createElement(
					'div',
					{ className: 'down-invite-speical-top' },
					_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/down_invite_1.png', className: 'down-invite-speical-topimg', alt: '' }),
					_react2.default.createElement(
						'a',
						{
							href: 'javascript:;',
							onClick: this.specialChannelDownload,
							className: 'donw-invite-speical-btn'
						},
						_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/down_invite_special2.png', alt: '' })
					)
				),
				_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/down_invite_special822.png', className: 'down-invite-speical-center', alt: '' }),
				_react2.default.createElement('img', { src: 'http://cc-cdn.dianjoy.com/91atm/images/down_invite_3.png', className: 'down-invite-speical-foot', alt: '' })
			);
		}
	}]);
	return SpecialDownInvite;
}(_react2.default.Component);

SpecialDownInvite.propTypes = {
	modal: _react.PropTypes.object.isRequired,
	modalState: _react.PropTypes.bool.isRequired,
	modalOpen: _react.PropTypes.func.isRequired,
	modalClose: _react.PropTypes.func.isRequired,
	directTo: _react.PropTypes.func.isRequired,
	downInviteInfo: _react.PropTypes.object.isRequired,
	valChange: _react.PropTypes.func.isRequired
};
exports.default = SpecialDownInvite;

/***/ },

/***/ 505:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _index = __webpack_require__(503);

var _index2 = _interopRequireDefault(_index);

var _actions = __webpack_require__(133);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	modalClose: function modalClose() {
		return (0, _actions.modalClose)();
	},
	modalOpen: function modalOpen(payload) {
		return (0, _actions.modalOpen)(payload);
	},
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	},
	directTo: function directTo(url) {
		return (0, _actions.directTo)(url);
	},
	valChange: function valChange(val, key) {
		return (0, _actions.valChange)(val, key);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		downInviteInfo: state.downInvite.downInviteInfo,
		modal: state.downInvite.modal,
		modalState: state.downInvite.modalState,
		progress: state.downInvite.progress,
		guideStatus: state.downInvite.guideStatus,
		downInviteBottom: state.downInvite.downInviteBottom,
		downInviteTop: state.downInvite.downInviteTop,
		userAgreeStatus: state.downInvite.userAgreeStatus,
		guideImage: state.downInvite.guideImage,
		isMask: state.downInvite.isMask,
		usedataPopStatus: state.downInvite.usedataPopStatus
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_index2.default);

/***/ },

/***/ 506:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = downloadReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by madeling on 7/26/16.
 */


var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	downInviteInfo: {},
	modal: {},
	modalState: false,
	progress: {
		ready: true,
		finish: false,
		index: 0,
		steps: ['第一步', '第二步', '去设置']
	},
	guideImage: {
		start: 'http://cc-cdn.dianjoy.com/91atm/images/IOS9.png',
		step1: 'http://cc-cdn.dianjoy.com/91atm/images/IOS9_guide_1.jpg',
		step2: 'http://cc-cdn.dianjoy.com/91atm/images/IOS9_guide_2.jpg',
		settingScheme: 'prefs:root=General&path=ManagedConfigurationList',
		arrowPrev: 'http://cc-cdn.dianjoy.com/91atm/images/arrow_left.png',
		arrowNext: 'http://cc-cdn.dianjoy.com/91atm/images/arrow_right.png',
		close: 'http://cc-cdn.dianjoy.com/91atm/images/bengchacha.png'
	},
	guideStatus: false,
	downInviteBottom: 'http://cc-cdn.dianjoy.com/91atm/images/announce-down2.jpg',
	downInviteTop: 'http://cc-cdn.dianjoy.com/91atm/images/announce4.jpg',
	userAgreeStatus: true, // 用户须知
	isMask: false,
	usedataPopStatus: false
};

function downloadReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/down-invite') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ },

/***/ 562:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(454)();
// imports


// module
exports.push([module.i, ".down-invite {\n  padding-top: 0; }\n  .down-invite .announce {\n    width: 100%;\n    height: 14.5rem;\n    color: #fff;\n    position: fixed;\n    left: 0;\n    top: 0;\n    z-index: 100; }\n    .down-invite .announce img {\n      height: 100%;\n      width: 100%; }\n    .down-invite .announce .announce-info {\n      width: 84%;\n      padding: 0 8%;\n      margin: 0 auto;\n      position: absolute;\n      left: 0;\n      bottom: 1.6rem;\n      height: 34px;\n      text-align: center;\n      font-size: 2.8rem;\n      overflow: hidden;\n      font-weight: bold; }\n      .down-invite .announce .announce-info .total-info-wrap {\n        overflow: hidden; }\n        .down-invite .announce .announce-info .total-info-wrap .total-info {\n          line-height: 54px; }\n        .down-invite .announce .announce-info .total-info-wrap .total-weixin-info {\n          line-height: 34px; }\n  .down-invite .down-invite-container {\n    background-color: #fafafa;\n    -webkit-flex: 1;\n    -webkit-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    padding-top: 14.5rem;\n    padding-bottom: 8rem;\n    position: relative; }\n    .down-invite .down-invite-container .title {\n      color: #757575;\n      line-height: 2.625rem;\n      text-align: center; }\n      .down-invite .down-invite-container .title .cash-rem-info {\n        font-size: 1.4rem; }\n    .down-invite .down-invite-container .copyright {\n      position: absolute;\n      bottom: 3rem;\n      color: #ccc; }\n    .down-invite .down-invite-container ul {\n      padding: 0 1.25rem; }\n      .down-invite .down-invite-container ul li {\n        display: -webkit-flex;\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        background-color: #fff;\n        border: 1px solid #d9d9d9;\n        margin-bottom: 0.417rem;\n        -webkit-border-radius: .5rem;\n                border-radius: .5rem; }\n        .down-invite .down-invite-container ul li .list-icon {\n          width: 3.33rem;\n          padding: 0.625rem 1.25rem 0.625rem 0.583rem; }\n        .down-invite .down-invite-container ul li .list-content {\n          -webkit-flex: 1;\n          -webkit-box-flex: 1;\n              -ms-flex: 1;\n                  flex: 1;\n          padding: 1rem 0; }\n          .down-invite .down-invite-container ul li .list-content p {\n            font-size: 1.167rem;\n            color: #757575;\n            padding-bottom: .583rem; }\n          .down-invite .down-invite-container ul li .list-content span {\n            font-size: .917rem;\n            color: #ccc; }\n        .down-invite .down-invite-container ul li .list-price {\n          width: 5.8rem;\n          border-left: 1px dashed #d9d9d9;\n          font-size: 1.25rem;\n          line-height: 5.08rem;\n          text-align: center; }\n          .down-invite .down-invite-container ul li .list-price span:first-child {\n            display: inline-block;\n            -webkit-transform: translateY(-0.1rem);\n            transform: translateY(-0.1rem); }\n          .down-invite .down-invite-container ul li .list-price span:nth-child(2) {\n            font-size: 2rem;\n            font-weight: bold; }\n  .down-invite .down-invite-footer {\n    position: fixed;\n    left: 0;\n    bottom: 0;\n    width: 100%; }\n    .down-invite .down-invite-footer img {\n      vertical-align: top; }\n\n@-webkit-keyframes total-scroll {\n  0%, 25% {\n    -webkit-transform: translateY(0) translateZ(0);\n    transform: translateY(0) translateZ(0); }\n  25%, 50% {\n    -webkit-transform: translateY(-38px) translateZ(0);\n    transform: translateY(-38px) translateZ(0); }\n  50%, 75% {\n    -webkit-transform: translateY(-38px) translateZ(0);\n    transform: translateY(-38px) translateZ(0); }\n  75%, 100% {\n    -webkit-transform: translateY(-76px) translateZ(0);\n    transform: translateY(-76px) translateZ(0); } }\n\n@keyframes total-scroll {\n  0%, 25% {\n    -webkit-transform: translateY(0) translateZ(0);\n    transform: translateY(0) translateZ(0); }\n  25%, 50% {\n    -webkit-transform: translateY(-38px) translateZ(0);\n    transform: translateY(-38px) translateZ(0); }\n  50%, 75% {\n    -webkit-transform: translateY(-38px) translateZ(0);\n    transform: translateY(-38px) translateZ(0); }\n  75%, 100% {\n    -webkit-transform: translateY(-76px) translateZ(0);\n    transform: translateY(-76px) translateZ(0); } }\n\n.down-invite-speical {\n  padding: 0 !important; }\n  .down-invite-speical img {\n    vertical-align: middle;\n    display: block; }\n\n.down-invite-speical-top {\n  position: relative;\n  height: 19.3rem;\n  width: 100%;\n  min-height: 19.3rem; }\n  .down-invite-speical-top img.down-invite-speical-topimg {\n    width: 100%;\n    height: 100%; }\n\n.down-invite-speical-center {\n  padding-top: 2.1rem;\n  background-color: #efefef;\n  height: 52.7rem; }\n\n.down-invite-speical-foot {\n  padding-top: 1.8rem;\n  height: 25.6rem; }\n\n.donw-invite-speical-btn {\n  position: absolute;\n  left: 0;\n  bottom: 1.1rem;\n  width: 100%;\n  height: 2.75rem; }\n  .donw-invite-speical-btn img {\n    width: 11.5rem;\n    height: 100%;\n    margin: 0 auto;\n    display: block; }\n\n.user-agreement .user-need-know {\n  display: inline-block;\n  padding-left: .5rem; }\n\n.user-agreement .user-agreement-box {\n  display: inline-block;\n  position: relative;\n  -webkit-transform: translateY(0.05rem);\n          transform: translateY(0.05rem); }\n  .user-agreement .user-agreement-box input {\n    width: .8rem;\n    height: .8rem;\n    background: transparent; }\n  .user-agreement .user-agreement-box span {\n    position: absolute;\n    left: 0;\n    top: 0; }\n  .user-agreement .user-agreement-box span.agree:after {\n    content: '\\2611';\n    font-size: .8rem; }\n  .user-agreement .user-agreement-box span.disagree:after {\n    content: '\\2610';\n    font-size: .9rem; }\n\n.usedata-agree {\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 100;\n  background: #fff;\n  width: 100%;\n  height: 100%; }\n\n.usedata-agree-icon {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: .833rem; }\n  .usedata-agree-icon img {\n    width: 5rem;\n    -webkit-border-radius: .75rem;\n            border-radius: .75rem;\n    display: block;\n    margin: 0 auto; }\n  .usedata-agree-icon p {\n    padding-top: .833rem;\n    font-size: 1.25rem;\n    text-align: center;\n    color: #999; }\n    .usedata-agree-icon p span {\n      font-weight: bold;\n      color: #007cff; }\n\n.usedata-agree-down {\n  position: absolute;\n  left: 3.75%;\n  bottom: 4.66rem;\n  line-height: 3.667rem;\n  width: 92.5%;\n  text-align: center;\n  -webkit-border-radius: 1.83rem;\n          border-radius: 1.83rem;\n  font-size: 1.417rem;\n  font-weight: bold;\n  background-color: #46a0fe;\n  color: #fff; }\n", ""]);

// exports


/***/ },

/***/ 592:
/***/ function(module, exports) {

module.exports = {
	"offers": [
		{
			"ad_name": "媚倾天下",
			"reset_num": 8837,
			"step_rmb": 350,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_1374b73e635320616ff946141f70ec69.png"
		},
		{
			"ad_name": "三国群英传",
			"reset_num": 8890,
			"step_rmb": 350,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_6db0260c86ca8317406073a765d029ad.png"
		},
		{
			"ad_name": "暴走部落",
			"reset_num": 8817,
			"step_rmb": 350,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201603/0_ca265d2bd528afbe092fa35495e8ca51.png"
		},
		{
			"ad_name": "三国龙翔传",
			"reset_num": 7907,
			"step_rmb": 350,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201606/0_6d276480ecf0d0f240cb36f7e17f6233.png"
		},
		{
			"ad_name": "爱财有道",
			"reset_num": 7851,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_689e237dc6a56614f424f9d2c0c09397.png"
		},
		{
			"ad_name": "儿童故事童谣",
			"reset_num": 6826,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201606/0_146bb9fb283bea5164e864013e2e015f.png"
		},
		{
			"ad_name": "京东",
			"reset_num": 9850,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_1feea45afb7002a2398f2c61cb45b2d1.png"
		},
		{
			"ad_name": "去哪儿攻略",
			"reset_num": 6809,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_f408d7cdcb160900dc84d634cc542d5b.png"
		},
		{
			"ad_name": "随手记",
			"reset_num": 5820,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201512/0_975056478b2e242cbdf366589572c0be.png"
		},
		{
			"ad_name": "春播",
			"reset_num": 6867,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201606/0_3165cd8b28971ce9cbcf79d6048e5bcd.png"
		},
		{
			"ad_name": "果酱直播",
			"reset_num": 8845,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201603/0_58057ff82f068740a82a8360dfd98423.png"
		},
		{
			"ad_name": "足球大师",
			"reset_num": 6911,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201603/0_fb7718ac64f902a7eaa1651a649d1dcf.png"
		},
		{
			"ad_name": "美团外卖",
			"reset_num": 7811,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201601/0_48fe99f37d19982f132c130e21520133.png"
		},
		{
			"ad_name": "古金群侠录",
			"reset_num": 9812,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_6f8b9e24405322f63a1896b356c94b82.png"
		},
		{
			"ad_name": "易到用车",
			"reset_num": 7832,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201604/0_7edb969a55c33ec79df3c211be473498.png"
		},
		{
			"ad_name": "你我贷理财",
			"reset_num": 7846,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201603/0_73ffbc3ad86864fa074f221f2e6c7743.png"
		},
		{
			"ad_name": "你我贷",
			"reset_num": 6811,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201603/0_26271ac66319388c9b892ac47340118a.png"
		},
		{
			"ad_name": "云之家",
			"reset_num": 8844,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201601/0_b3f02264b6649098b2cd313fe0c34c03.png"
		},
		{
			"ad_name": "繁星直播",
			"reset_num": 8804,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201604/0_1cb97a376d0ad31a5d0e396fceaaff38.png"
		},
		{
			"ad_name": "多米金融",
			"reset_num": 6862,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201604/0_ec39c631638c6857f04640b70bddd608.png"
		},
		{
			"ad_name": "一元爱疯购",
			"reset_num": 5911,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201606/0_d602c96aee8b6e1287e987f9a057ca2b.png"
		},
		{
			"ad_name": "墨迹天气",
			"reset_num": 6849,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201602/0_ce3fc61f67cc167998da3f6816abb2da.png"
		},
		{
			"ad_name": "元子育儿",
			"reset_num": 6860,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201606/0_3aa59bf68e88c3745edc7026394bc85c.png"
		},
		{
			"ad_name": "理财平台",
			"reset_num": 8836,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201512/0_fd4a785c30d80e8cb7071df1cb968f03.png"
		},
		{
			"ad_name": "京东秒杀",
			"reset_num": 9913,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_c810e937fccf7770ec77c854c830b89a.png"
		},
		{
			"ad_name": "飞飞",
			"reset_num": 6873,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_17e6ed404ca5946bcf4d699ab278581e.png"
		},
		{
			"ad_name": "胖熊一元买",
			"reset_num": 6894,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201605/0_3029cca617d44028608120902b33e895.png"
		},
		{
			"ad_name": "折买返利网",
			"reset_num": 6878,
			"step_rmb": 200,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201604/0_06e9c51700a1d90fa737775780d47d3e.png"
		},
		{
			"ad_name": "觉醒吧数码兽",
			"reset_num": 8870,
			"step_rmb": 180,
			"icon": "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201604/0_ceb173a5222d83f49fb6eb46375b8b1a.png"
		}
	]
};

/***/ }

});