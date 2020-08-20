'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GradientProperty = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _index = require('../utils/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GradientProperty = exports.GradientProperty = function () {
  function GradientProperty(elem, data) {
    _classCallCheck(this, GradientProperty);

    this.container = elem;
    this.prop = _PropertyFactory2.default.getProp(elem, data.k, 1, null, this);
    this.data = data;
    this.k = this.prop.k;
    this.c = (0, _index.createTypedArray)('uint8c', data.p * 4);
    var cLength = data.k.k[0].s ? data.k.k[0].s.length - data.p * 4 : data.k.k.length - data.p * 4;
    this.o = (0, _index.createTypedArray)('float32', cLength);
    this._cmdf = false;
    this._omdf = false;
    this._collapsable = this.checkCollapsable();
    this._hasOpacity = cLength;
    this._mdf = false;
    this.getValue(true);
  }

  _createClass(GradientProperty, [{
    key: 'addDynamicProperty',
    value: function addDynamicProperty() /* prop */{
      this.container.addDynamicProperty(this);
    }
  }, {
    key: 'comparePoints',
    value: function comparePoints(values, points) {
      var i = 0;
      var len = this.o.length / 2;
      var diff = void 0;
      while (i < len) {
        diff = Math.abs(values[i * 4] - values[points * 4 + i * 2]);
        if (diff > 0.01) {
          return false;
        }
        i += 1;
      }
      return true;
    }
  }, {
    key: 'checkCollapsable',
    value: function checkCollapsable() {
      if (this.o.length / 2 !== this.c.length / 4) {
        return false;
      }
      if (this.data.k.k[0].s) {
        var i = 0;
        var len = this.data.k.k.length;
        while (i < len) {
          if (!this.comparePoints(this.data.k.k[i].s, this.data.p)) {
            return false;
          }
          i += 1;
        }
      } else if (!this.comparePoints(this.data.k.k, this.data.p)) {
        return false;
      }
      return true;
    }
  }, {
    key: 'getValue',
    value: function getValue(forceRender) {
      this.prop.getValue();
      this._mdf = false;
      this._cmdf = false;
      this._omdf = false;
      if (this.prop._mdf || forceRender) {
        var i = void 0;
        var len = this.data.p * 4;
        var mult = void 0;
        var val = void 0;
        for (i = 0; i < len; i += 1) {
          mult = i % 4 === 0 ? 100 : 255;
          val = Math.round(this.prop.v[i] * mult);
          if (this.c[i] !== val) {
            this.c[i] = val;
            this._cmdf = !forceRender;
          }
        }
        if (this.o.length) {
          len = this.prop.v.length;
          for (i = this.data.p * 4; i < len; i += 1) {
            mult = i % 2 === 0 ? 100 : 1;
            val = i % 2 === 0 ? Math.round(this.prop.v[i] * 100) : this.prop.v[i];
            if (this.o[i - this.data.p * 4] !== val) {
              this.o[i - this.data.p * 4] = val;
              this._omdf = !forceRender;
            }
          }
        }
        this._mdf = !forceRender;
      }
    }
  }]);

  return GradientProperty;
}();