webpackJsonp([4],{

/***/ 412:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reducers = __webpack_require__(208);

var _yyscContainer = __webpack_require__(424);

var _yyscContainer2 = _interopRequireDefault(_yyscContainer);

var _yysc = __webpack_require__(425);

var _yysc2 = _interopRequireDefault(_yysc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
  (0, _reducers.injectReducer)(store, { key: 'yysc', reducer: _yysc2.default });
  cb(null, _yyscContainer2.default);
};

/***/ },

/***/ 423:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(76);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(77);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(78);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(80);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(79);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Yysc = function (_React$Component) {
  (0, _inherits3.default)(Yysc, _React$Component);

  function Yysc() {
    (0, _classCallCheck3.default)(this, Yysc);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Yysc).apply(this, arguments));
  }

  (0, _createClass3.default)(Yysc, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "container" },
        "应用市场"
      );
    }
  }]);
  return Yysc;
}(_react2.default.Component);

exports.default = Yysc;

/***/ },

/***/ 424:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(209);

var _actions = __webpack_require__(128);

var _yysc = __webpack_require__(423);

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

/***/ 425:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(129);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = homeReducer;

var _reducers = __webpack_require__(208);

var _config = __webpack_require__(81);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
  homeInfo: {}
};

function homeReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  if (location.pathname !== _config.rootPath + '/yysc') return state;
  var handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

/***/ }

});