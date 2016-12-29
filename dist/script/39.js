webpackJsonp([39],{

/***/ 429:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _aboutContainer = __webpack_require__(490);

var _aboutContainer2 = _interopRequireDefault(_aboutContainer);

var _about = __webpack_require__(491);

var _about2 = _interopRequireDefault(_about);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './about.sass'

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'about', reducer: _about2.default });
	cb(null, _aboutContainer2.default);
}; // import about from './components/about'
// export default {
// 	path: 'about',
// 	component: about
// }

/***/ },

/***/ 489:
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

var _storage = __webpack_require__(60);

var _storage2 = _interopRequireDefault(_storage);

var _config = __webpack_require__(46);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import styles from '../about.sass'

var AboutEle = function (_React$Component) {
	(0, _inherits3.default)(AboutEle, _React$Component);

	function AboutEle() {
		(0, _classCallCheck3.default)(this, AboutEle);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AboutEle).apply(this, arguments));
	}

	(0, _createClass3.default)(AboutEle, [{
		key: 'contactEvent',
		value: function contactEvent() {
			(0, _util.logEvent)('concat_server');
			var partnerId = _storage2.default.local.get('user');
			setTimeout(function () {
				location.href = 'https://www.sobot.com/chat/h5/index.html?sysNum=5ba3a208416a4dbfbecfa46cea3c8b53&partnerId=' + partnerId;
			}, 200);
		}
	}, {
		key: 'render',
		value: function render() {
			var downLoadUrl = _config.rootPath + '/download';
			var qaUrl = _config.rootPath + '/qa';
			return _react2.default.createElement(
				'div',
				{ className: 'container' },
				_react2.default.createElement(
					'div',
					{ className: 'main about' },
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: downLoadUrl, className: 'list-item' },
						'下载守护',
						_react2.default.createElement('span', { className: 'icon-next' })
					),
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: qaUrl, className: 'list-item' },
						'常见问题',
						_react2.default.createElement('span', { className: 'icon-next' })
					),
					_react2.default.createElement(
						'span',
						{ onClick: this.contactEvent.bind(this), className: 'list-item' },
						'联系客服',
						_react2.default.createElement('span', { className: 'icon-next' })
					)
				)
			);
		}
	}]);
	return AboutEle;
}(_react2.default.Component);

exports.default = AboutEle;

/***/ },

/***/ 490:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _about = __webpack_require__(489);

var _about2 = _interopRequireDefault(_about);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		aboutInfo: state.about.aboutInfo
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_about2.default);

/***/ },

/***/ 491:
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
	aboutInfo: {}
};

function homeReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/about') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ }

});