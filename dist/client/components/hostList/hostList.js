'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hostList = require('./hostList.css');

var _hostList2 = _interopRequireDefault(_hostList);

var _host = require('./host/host');

var _host2 = _interopRequireDefault(_host);

var _button = require('../button/button');

var _button2 = _interopRequireDefault(_button);

var _serverActions = require('../../../server/serverActions');

var ActionNames = _interopRequireWildcard(_serverActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hostList = function hostList(props) {

	var content = null;

	var button = null;
	if (props.gameSelected != null && props.hostList.find(function (el) {
		return el.id == props.gameSelected;
	})) {
		button = _react2.default.createElement(_button2.default, { onClick: function onClick() {
				return props.joinGame(props.gameSelected);
			}, type: 'button',
			value: "JOIN GAME #" + props.gameSelected
		});
	} else {
		button = _react2.default.createElement(_button2.default, { onClick: props.createGame, type: 'button',
			value: "CREATE GAME"
		});
	}

	if (props.hostList) {
		content = props.hostList.map(function (host) {
			return _react2.default.createElement(_host2.default, {
				key: host.id,
				host: host,
				selectGame: function selectGame() {
					return props.onSelectGame(host.id);
				},
				isSelected: host.id == props.gameSelected
			});
		});
	}

	return _react2.default.createElement(
		'div',
		{ className: _hostList2.default.hostList },
		_react2.default.createElement(
			'div',
			{ className: _hostList2.default.list },
			content
		),
		button
	);
};

exports.default = hostList;