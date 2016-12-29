webpackJsonp([35],{

/***/ 452:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducers = __webpack_require__(23);

var _taskListContainer = __webpack_require__(544);

var _taskListContainer2 = _interopRequireDefault(_taskListContainer);

var _taskList = __webpack_require__(545);

var _taskList2 = _interopRequireDefault(_taskList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store, cb) {
	(0, _reducers.injectReducer)(store, { key: 'taskList', reducer: _taskList2.default });
	cb(null, _taskListContainer2.default);
};

/***/ },

/***/ 459:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tabs = __webpack_require__(460);

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _tabs2.default;

/***/ },

/***/ 460:
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

var Tabs = function (_React$Component) {
	(0, _inherits3.default)(Tabs, _React$Component);

	function Tabs() {
		(0, _classCallCheck3.default)(this, Tabs);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Tabs).apply(this, arguments));
	}

	(0, _createClass3.default)(Tabs, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var props = this.props;
			return _react2.default.createElement(
				'ul',
				{ className: props.tabClassName },
				props.tabs.map(function (item, index) {
					var itemClass = index === props.tabNum ? 'active-nav' : '';
					return _react2.default.createElement(
						'li',
						{ key: index, onClick: props.tabChange.bind(_this2, index), className: itemClass },
						_react2.default.createElement(
							'span',
							null,
							item.title
						)
					);
				})
			);
		}
	}]);
	return Tabs;
}(_react2.default.Component);

Tabs.propTypes = {
	tabNum: _react.PropTypes.number,
	tabs: _react.PropTypes.array,
	tabChange: _react.PropTypes.func.isRequired,
	tabClassName: _react.PropTypes.string
};
Tabs.defaultProps = {
	tabClassName: 'list-nav'
};
exports.default = Tabs;

/***/ },

/***/ 468:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recordCompare = __webpack_require__(469);

var _recordCompare2 = _interopRequireDefault(_recordCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _recordCompare2.default;

/***/ },

/***/ 469:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RecordCompare = function RecordCompare(props) {
	return _react2.default.createElement(
		"div",
		{ className: "compare-wrap" },
		_react2.default.createElement(
			"div",
			{ className: "compare-top border-bottom" },
			_react2.default.createElement(
				"p",
				{ className: "border-right" },
				"日期"
			),
			_react2.default.createElement(
				"p",
				{ className: "" },
				props.compareTitle
			)
		),
		_react2.default.createElement(
			"ul",
			null,
			props.compareMessage.map(function (item, index) {
				return _react2.default.createElement(
					"li",
					{ key: index, className: "" },
					_react2.default.createElement(
						"span",
						{ className: "border-right" },
						item.c_date
					),
					_react2.default.createElement(
						"span",
						{ className: "progress" },
						(item.sum_money / 100).toFixed(2),
						"元"
					)
				);
			})
		)
	);
};

RecordCompare.propTypes = {
	compareMessage: _react.PropTypes.array.isRequired,
	compareTitle: _react.PropTypes.string.isRequired
};

RecordCompare.defaultProps = {
	compareMessage: []
};

exports.default = RecordCompare;

/***/ },

/***/ 470:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recordList = __webpack_require__(471);

var _recordList2 = _interopRequireDefault(_recordList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _recordList2.default;

/***/ },

/***/ 471:
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

var RecordList = function (_React$Component) {
	(0, _inherits3.default)(RecordList, _React$Component);

	function RecordList() {
		(0, _classCallCheck3.default)(this, RecordList);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RecordList).apply(this, arguments));
	}

	(0, _createClass3.default)(RecordList, [{
		key: 'render',
		value: function render() {
			var props = this.props;
			var wrapClass = 'list-data';
			var contentClass = 'list-content';
			var iconWrapClass = 'list-icon';
			var adTitle = void 0;
			if (props.type === 'invite') {
				wrapClass = 'list-data list-data-prentice';
				contentClass = 'list-content list-content-prentice';
				iconWrapClass = 'list-icon-prentice';
			}
			var renderEle = void 0;
			if (!this.props.list.length) {
				renderEle = _react2.default.createElement(
					'div',
					{ className: 'record-none' },
					'您还没有相关记录！'
				);
			} else {
				renderEle = _react2.default.createElement(
					'ul',
					{ className: 'record-list' },
					props.list.map(function (item, index) {
						var iconEle = void 0;
						var iconEleClass = void 0;
						var rewardEle = void 0;
						var moneyEle = void 0;
						var money = void 0;
						if (props.type === 'invite') {
							money = 100;
						} else {
							money = item.atmtask.price;
						}

						if (props.type === 'invite') {
							iconEleClass = 'icon-' + item.receiver % 12;
							iconEle = _react2.default.createElement('div', { className: iconEleClass });
							adTitle = '徒弟: ' + item.receiver;
						} else if (item.atmtask) {
							iconEle = _react2.default.createElement('img', { alt: '', src: item.atmtask.ad_icon });
							adTitle = item.atmtask.ad_name;
						}
						if (item.atmtask && item.atmtask.ad_name) {
							var formateCtime = item.ctime.slice(-1) === '日';
							if (!formateCtime) {
								item.ctime = (0, _util.operateTimeFormat)(item.ctime).split(' ')[0];
							}
							rewardEle = _react2.default.createElement(
								'div',
								{ className: 'list-desc' },
								'于',
								item.ctime,
								'完成',
								item.atmtask.ad_name,
								'任务，您获得',
								props.title,
								'奖励！'
							);
						}
						if (money) {
							moneyEle = _react2.default.createElement(
								'div',
								{ className: 'list-price progress' },
								'+',
								_react2.default.createElement(
									'span',
									null,
									(money / 100).toFixed(2)
								),
								'元'
							);
						}

						var contentEle = void 0;
						if (+item.e_type === 6) {
							contentEle = _react2.default.createElement(
								'div',
								{ className: contentClass },
								_react2.default.createElement(
									'h4',
									null,
									adTitle
								),
								_react2.default.createElement(
									'p',
									null,
									'深度任务'
								)
							);
						} else {
							contentEle = _react2.default.createElement(
								'div',
								{ className: contentClass },
								_react2.default.createElement(
									'h3',
									null,
									adTitle
								)
							);
						}

						return _react2.default.createElement(
							'li',
							{ key: index },
							_react2.default.createElement(
								'div',
								{ className: wrapClass },
								_react2.default.createElement(
									'div',
									{ className: iconWrapClass },
									iconEle
								),
								contentEle,
								moneyEle
							),
							rewardEle
						);
					})
				);
			}
			return _react2.default.createElement(
				'div',
				{ className: 'record-wrap' },
				_react2.default.createElement(
					'ul',
					{ className: 'record-top' },
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement(
							'h5',
							null,
							'今日实时数据'
						),
						_react2.default.createElement(
							'p',
							null,
							props.title,
							'收入: ',
							_react2.default.createElement(
								'span',
								{ className: 'progress' },
								props.income
							),
							'元'
						)
					),
					_react2.default.createElement(
						'li',
						null,
						props.title,
						'人数：',
						props.count,
						'个'
					)
				),
				renderEle
			);
		}
	}]);
	return RecordList;
}(_react2.default.Component);

RecordList.propTypes = {
	list: _react.PropTypes.array.isRequired,
	income: _react.PropTypes.string.isRequired,
	count: _react.PropTypes.number.isRequired,
	title: _react.PropTypes.string.isRequired,
	type: _react.PropTypes.string.isRequired
};
RecordList.defaultProps = {
	list: [],
	income: 0,
	count: 0,
	title: ''
};
exports.default = RecordList;

/***/ },

/***/ 543:
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

var _recordList = __webpack_require__(470);

var _recordList2 = _interopRequireDefault(_recordList);

var _tabs = __webpack_require__(459);

var _tabs2 = _interopRequireDefault(_tabs);

var _recordCompare = __webpack_require__(468);

var _recordCompare2 = _interopRequireDefault(_recordCompare);

var _util = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var screenHeight = Math.max(document.documentElement.clientHeight || window.innerHeight);

var TaskListEle = function (_React$Component) {
	(0, _inherits3.default)(TaskListEle, _React$Component);

	function TaskListEle(props) {
		(0, _classCallCheck3.default)(this, TaskListEle);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TaskListEle).call(this, props));

		_this.getTasks = _this.getTasks.bind(_this);
		_this.previousScroll = 0;
		return _this;
	}

	(0, _createClass3.default)(TaskListEle, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.previousScroll = 0;
			var that = this;
			document.addEventListener('scroll', (0, _util.debounce)(function () {
				var tasks = that.props.taskList && that.props.taskList.tasks || {};
				// 向上滚动时, 或者未滚动时
				if (document.body.scrollTop <= that.previousScroll) {
					that.previousScroll = document.body.scrollTop;
					return;
				}
				// 当数据不满屏时, 此条件永远成立
				//  && document.documentElement.offsetHeight > screenHeight
				// or count > tasks.result.length
				if (document.body.scrollTop + screenHeight + 150 > document.documentElement.offsetHeight) {
					that.previousScroll = document.body.scrollTop;
					if (tasks && tasks.count > tasks.results.length) {
						that.getTasks(that.props.taskList.tasks.next);
					}
				}
			}, 300));
			that.getTasks();
			function resetTab() {
				that.tabChangeCb(0);
			}
			if (that.props.taskList.tab) {
				setTimeout(resetTab, 10);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var taskList = this.props.taskList;
			if (taskList.tabs && !taskList.tabs[taskList.tab].checked && taskList.tab === 1) {
				this.getRecords(taskList.tab);
				this.props.tabChecked(1);
			}
		}
	}, {
		key: 'getTasks',
		value: function getTasks() {
			var url = arguments.length <= 0 || arguments[0] === undefined ? '/trial/exchange/log/' : arguments[0];

			var props = this.props;
			var tasks = props.taskList.tasks;
			var taskList = tasks.results;
			if (taskList.length && taskList.length === tasks.count) return;
			function taskFilter(data) {
				var dataList = data.results;
				if (dataList.length) {
					data.results = dataList.filter(function (item) {
						return item.atmtask;
					});
					if (taskList && taskList.length) {
						data.results = taskList.concat(data.results);
					}
				}
				return data;
			}
			props.fetchList(url, undefined, 'tasks', taskFilter);
		}
	}, {
		key: 'getRecords',
		value: function getRecords() {
			function tasksChartFilter(data) {
				return data.results;
			}
			this.props.fetchList('/trial/exchange/chart/', undefined, 'tasksChart', tasksChartFilter);
		}
	}, {
		key: 'tabChangeCb',
		value: function tabChangeCb(tabNum) {
			this.props.tabChange(tabNum);
		}
	}, {
		key: 'render',
		value: function render() {
			var taskList = this.props.taskList || {};
			var dataList = taskList.tasks.results || [];
			var count = taskList.tasks.today_task_count;
			var income = ((taskList.tasks.today_task_income || 0) / 100).toFixed(2);
			var showEle = taskList.tab === 0 ? _react2.default.createElement(_recordList2.default, {
				list: dataList,
				title: '试玩',
				count: count,
				income: income,
				type: 'task'
			}) : _react2.default.createElement(_recordCompare2.default, { compareMessage: taskList.tasksChart, compareTitle: '试玩收入' });
			return _react2.default.createElement(
				'div',
				{ className: 'container list-container' },
				_react2.default.createElement(_tabs2.default, { tabs: taskList.tabs, tabChange: this.tabChangeCb.bind(this), tabNum: taskList.tab }),
				showEle,
				_react2.default.createElement(
					'div',
					{ className: 'logo-shadow' },
					_react2.default.createElement('img', { alt: '', src: 'http://cc-cdn.dianjoy.com/91atm/images/logo-shadow.png' })
				)
			);
		}
	}]);
	return TaskListEle;
}(_react2.default.Component);

TaskListEle.propTypes = {
	fetchList: _react.PropTypes.func.isRequired,
	taskList: _react.PropTypes.object.isRequired,
	tabChange: _react.PropTypes.func.isRequired,
	tabChecked: _react.PropTypes.func.isRequired
};
exports.default = TaskListEle;

/***/ },

/***/ 544:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactRedux = __webpack_require__(210);

var _actions = __webpack_require__(133);

var _components = __webpack_require__(543);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapActionCreators = {
	fetchList: function fetchList(url, options, key, filter) {
		return (0, _actions.fetchList)(url, options, key, filter);
	},
	tabChange: function tabChange(newTab, oldTab, cb) {
		return (0, _actions.tabChange)(newTab, oldTab, cb);
	},
	tabChecked: function tabChecked(tabNum) {
		return (0, _actions.tabChecked)(tabNum);
	}
};

var mapStateToProps = function mapStateToProps(state) {
	return { taskList: state.taskList };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapActionCreators)(_components2.default);

/***/ },

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(132);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = inviteListReducer;

var _reducers = __webpack_require__(23);

var _config = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_HANDLERS = (0, _extends3.default)({}, _reducers.globalHandler);

var initialState = {
	tasksChart: [],
	tasks: {
		count: 0,
		next: null,
		previous: null,
		results: [],
		today_invite_count: 0,
		today_invite_income: 0
	},
	tab: 0,
	tabs: [{
		title: '试玩明细',
		checked: true
	}, {
		title: '历史对比',
		checked: false
	}]
};

function inviteListReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];

	if (location.pathname !== _config.rootPath + '/task-list') return state;
	var handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}

/***/ }

});