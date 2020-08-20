'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupEffect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.EffectsManager = EffectsManager;

var _SliderEffect = require('./effects/SliderEffect');

var _dynamicProperties = require('./utils/dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function EffectsManager(data, element) {
  var effects = data.ef || [];
  this.effectElements = [];
  var i = void 0;
  var len = effects.length;
  var effectItem = void 0;
  for (i = 0; i < len; i++) {
    effectItem = new GroupEffect(effects[i], element);
    this.effectElements.push(effectItem);
  }
}

var GroupEffect = function (_DynamicPropertyConta) {
  _inherits(GroupEffect, _DynamicPropertyConta);

  function GroupEffect(data, element) {
    _classCallCheck(this, GroupEffect);

    var _this = _possibleConstructorReturn(this, (GroupEffect.__proto__ || Object.getPrototypeOf(GroupEffect)).call(this));

    _this.init(data, element);
    return _this;
  }

  _createClass(GroupEffect, [{
    key: 'init',
    value: function init(data, element) {
      this.data = data;
      this.effectElements = [];
      this.initDynamicPropertyContainer(element);
      var i = void 0;
      var len = this.data.ef.length;
      var eff = void 0;
      var effects = this.data.ef;
      for (i = 0; i < len; i += 1) {
        eff = null;
        switch (effects[i].ty) {
          case 0:
            eff = new _SliderEffect.SliderEffect(effects[i], element, this);
            break;
          case 1:
            eff = new _SliderEffect.AngleEffect(effects[i], element, this);
            break;
          case 2:
            eff = new _SliderEffect.ColorEffect(effects[i], element, this);
            break;
          case 3:
            eff = new _SliderEffect.PointEffect(effects[i], element, this);
            break;
          case 4:
          case 7:
            eff = new _SliderEffect.CheckboxEffect(effects[i], element, this);
            break;
          case 10:
            eff = new _SliderEffect.LayerIndexEffect(effects[i], element, this);
            break;
          case 11:
            eff = new _SliderEffect.MaskIndexEffect(effects[i], element, this);
            break;
          case 5:
            eff = new EffectsManager(effects[i], element, this);
            break;
          // case 6:
          default:
            eff = new _SliderEffect.NoValueEffect(effects[i], element, this);
            break;
        }
        if (eff) {
          this.effectElements.push(eff);
        }
      }
    }
  }]);

  return GroupEffect;
}(_dynamicProperties2.default);

GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties;

exports.GroupEffect = GroupEffect;