'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShapeTransformManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformationMatrix = require('../../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShapeTransformManager = exports.ShapeTransformManager = function () {
  function ShapeTransformManager() {
    _classCallCheck(this, ShapeTransformManager);

    this.sequences = {};
    this.sequenceList = [];
    this.transform_key_count = 0;
  }

  _createClass(ShapeTransformManager, [{
    key: 'addTransformSequence',
    value: function addTransformSequence(transforms) {
      var i = void 0;
      var len = transforms.length;
      var key = '_';
      for (i = 0; i < len; i += 1) {
        key += transforms[i].transform.key + '_';
      }
      var sequence = this.sequences[key];
      if (!sequence) {
        sequence = {
          transforms: [].concat(transforms),
          finalTransform: new _transformationMatrix2.default(),
          _mdf: false
        };
        this.sequences[key] = sequence;
        this.sequenceList.push(sequence);
      }
      return sequence;
    }
  }, {
    key: 'processSequence',
    value: function processSequence(sequence, isFirstFrame) {
      var i = 0;
      var len = sequence.transforms.length;
      var _mdf = isFirstFrame;
      while (i < len && !isFirstFrame) {
        if (sequence.transforms[i].transform.mProps._mdf) {
          _mdf = true;
          break;
        }
        i += 1;
      }
      if (_mdf) {
        var props = void 0;
        sequence.finalTransform.reset();
        for (i = len - 1; i >= 0; i -= 1) {
          props = sequence.transforms[i].transform.mProps.v.props;
          sequence.finalTransform.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
        }
      }
      sequence._mdf = _mdf;
    }
  }, {
    key: 'processSequences',
    value: function processSequences(isFirstFrame) {
      var i = void 0;
      var len = this.sequenceList.length;
      for (i = 0; i < len; i += 1) {
        this.processSequence(this.sequenceList[i], isFirstFrame);
      }
    }
  }, {
    key: 'getNewKey',
    value: function getNewKey() {
      return '_' + this.transform_key_count++;
    }
  }]);

  return ShapeTransformManager;
}();