'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _debug = require('./debug');

Object.keys(_debug).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _debug[key];
    }
  });
});

var _AnimationManager = require('./animation/AnimationManager');

var _AnimationManager2 = _interopRequireDefault(_AnimationManager);

var _index = require('./platform/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.api = _index2.default;
exports.default = _AnimationManager2.default;