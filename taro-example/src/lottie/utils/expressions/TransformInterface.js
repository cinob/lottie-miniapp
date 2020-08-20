'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExpressionValueFactory = require('../expressions/ExpressionValueFactory');

exports.default = function (transform) {
  /* eslint consistent-return: 0 */
  function thisFunction(name) {
    switch (name) {
      case 'scale':
      case 'Scale':
      case 'ADBE Scale':
      case 6:
        return thisFunction.scale;
      case 'rotation':
      case 'Rotation':
      case 'ADBE Rotation':
      case 'ADBE Rotate Z':
      case 10:
        return thisFunction.rotation;
      case 'ADBE Rotate X':
        return thisFunction.xRotation;
      case 'ADBE Rotate Y':
        return thisFunction.yRotation;
      case 'position':
      case 'Position':
      case 'ADBE Position':
      case 2:
        return thisFunction.position;
      case 'ADBE Position_0':
        return thisFunction.xPosition;
      case 'ADBE Position_1':
        return thisFunction.yPosition;
      case 'ADBE Position_2':
        return thisFunction.zPosition;
      case 'anchorPoint':
      case 'AnchorPoint':
      case 'Anchor Point':
      case 'ADBE AnchorPoint':
      case 1:
        return thisFunction.anchorPoint;
      case 'opacity':
      case 'Opacity':
      case 11:
        return thisFunction.opacity;
      default:
        break;
    }
  }

  Object.defineProperty(thisFunction, 'rotation', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.r || transform.rz)
  });

  Object.defineProperty(thisFunction, 'zRotation', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.rz || transform.r)
  });

  Object.defineProperty(thisFunction, 'xRotation', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.rx)
  });

  Object.defineProperty(thisFunction, 'yRotation', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.ry)
  });
  Object.defineProperty(thisFunction, 'scale', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.s)
  });

  var _transformFactory = void 0;
  if (transform.p) {
    _transformFactory = (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.p);
  }
  Object.defineProperty(thisFunction, 'position', {
    get: function get() {
      if (transform.p) {
        return _transformFactory();
      }
      return [transform.px.v, transform.py.v, transform.pz ? transform.pz.v : 0];
    }
  });

  Object.defineProperty(thisFunction, 'xPosition', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.px)
  });

  Object.defineProperty(thisFunction, 'yPosition', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.py)
  });

  Object.defineProperty(thisFunction, 'zPosition', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.pz)
  });

  Object.defineProperty(thisFunction, 'anchorPoint', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.a)
  });

  Object.defineProperty(thisFunction, 'opacity', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.o)
  });

  Object.defineProperty(thisFunction, 'skew', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.sk)
  });

  Object.defineProperty(thisFunction, 'skewAxis', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.sa)
  });

  Object.defineProperty(thisFunction, 'orientation', {
    get: (0, _ExpressionValueFactory.ExpressionPropertyInterface)(transform.or)
  });

  return thisFunction;
};