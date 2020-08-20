'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchExpressions = searchExpressions;
exports.getExpressionValue = getExpressionValue;
exports.searchProperty = searchProperty;

var _ExpressionManager = require('./ExpressionManager');

var _ExpressionManager2 = _interopRequireDefault(_ExpressionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function searchExpressions() {
  if (this.data.d.x) {
    this.calculateExpression = _ExpressionManager2.default.initiateExpression.bind(this)(this.elem, this.data.d, this);
    this.addEffect(this.getExpressionValue.bind(this));
    return true;
  }
}

function getExpressionValue(currentValue, text) {
  var newValue = this.calculateExpression(text);
  if (currentValue.t !== newValue) {
    var newData = {};
    this.copyData(newData, currentValue);
    newData.t = newValue.toString();
    newData.__complete = false;
    return newData;
  }
  return currentValue;
}

function searchProperty() {
  var isKeyframed = this.searchKeyframes();
  var hasExpressions = this.searchExpressions();
  this.kf = isKeyframed || hasExpressions;
  return this.kf;
}