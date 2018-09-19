'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _host = require('./host.css');

var _host2 = _interopRequireDefault(_host);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var host = function host(props) {
	if (!props.host || props.host.id == undefined || props.host.hostName == undefined || props.host.playerCount == undefined) return null;

	var classes = [];
	classes.push(_host2.default.host);

	if (props.isSelected) {
		classes.push(_host2.default.activeHost);
	}

	classes = classes.join(' ');
	return _react2.default.createElement(
		'div',
		{ className: classes, onClick: props.selectGame },
		_react2.default.createElement(
			'div',
			{ className: _host2.default.hostID },
			'#',
			props.host.id
		),
		_react2.default.createElement(
			'div',
			{ className: _host2.default.name },
			'Name: ',
			decodeURIComponent(props.host.hostName)
		),
		_react2.default.createElement(
			'div',
			{ className: _host2.default.players },
			'Players: ',
			props.host.playerCount,
			' / 4'
		)
	);
};

exports.default = host;