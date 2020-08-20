'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _TransformProperty = require('../utils/TransformProperty');

var _TransformProperty2 = _interopRequireDefault(_TransformProperty);

var _CVShapeData = require('../shapes/CVShapeData');

var _CVShapeData2 = _interopRequireDefault(_CVShapeData);

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _CVBaseElement = require('../canvasElements/CVBaseElement');

var _CVBaseElement2 = _interopRequireDefault(_CVBaseElement);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _TransformElement = require('../elements/TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

var _ShapeElement = require('../elements/ShapeElement');

var _ShapeElement2 = _interopRequireDefault(_ShapeElement);

var _HierarchyElement = require('../elements/HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _FrameElement = require('../elements/FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _RenderableElement = require('../elements/RenderableElement');

var _RenderableElement2 = _interopRequireDefault(_RenderableElement);

var _RenderableDOMElement = require('../elements/RenderableDOMElement');

var _RenderableDOMElement2 = _interopRequireDefault(_RenderableDOMElement);

var _common = require('../utils/common');

var _DashProperty = require('../shapes/DashProperty');

var _DashProperty2 = _interopRequireDefault(_DashProperty);

var _ShapeModifiers = require('../shapes/ShapeModifiers');

var _ShapeModifiers2 = _interopRequireDefault(_ShapeModifiers);

var _GradientProperty = require('../shapes/GradientProperty');

var _RoundCornersModifier = require('../shapes/RoundCornersModifier');

var _RoundCornersModifier2 = _interopRequireDefault(_RoundCornersModifier);

var _MouseModifier = require('../shapes/MouseModifier');

var _MouseModifier2 = _interopRequireDefault(_MouseModifier);

var _RepeaterModifier = require('../shapes/RepeaterModifier');

var _RepeaterModifier2 = _interopRequireDefault(_RepeaterModifier);

var _TrimModifier = require('../shapes/TrimModifier');

var _TrimModifier2 = _interopRequireDefault(_TrimModifier);

var _ShapeTransformManager = require('../utils/helpers/ShapeTransformManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import Matrix from '../3rd_party/transformation-matrix';


_ShapeModifiers2.default.registerModifier('rd', _RoundCornersModifier2.default);
_ShapeModifiers2.default.registerModifier('ms', _MouseModifier2.default);
_ShapeModifiers2.default.registerModifier('rp', _RepeaterModifier2.default);
_ShapeModifiers2.default.registerModifier('tm', _TrimModifier2.default);

var degToRads = Math.PI / 180;

var CVShapeElement = function (_Mixin) {
  _inherits(CVShapeElement, _Mixin);

  function CVShapeElement(data, globalData, comp) {
    _classCallCheck(this, CVShapeElement);

    var _this = _possibleConstructorReturn(this, (CVShapeElement.__proto__ || Object.getPrototypeOf(CVShapeElement)).call(this));

    _this.initElement = _RenderableDOMElement2.default.prototype.initElement;
    _this.transformHelper = {
      opacity: 1,
      _opMdf: false
    };
    _this.dashResetter = [];

    _this.shapes = [];
    _this.shapesData = data.shapes;
    _this.stylesList = [];
    _this.itemsData = [];
    _this.prevViewData = [];
    _this.shapeModifiers = [];
    _this.processedElements = [];
    _this.transformsManager = new _ShapeTransformManager.ShapeTransformManager();
    _this.initElement(data, globalData, comp);
    return _this;
  }

  _createClass(CVShapeElement, [{
    key: 'createContent',
    value: function createContent() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
    }
  }, {
    key: 'createStyleElement',
    value: function createStyleElement(data, transforms) {
      var styleElem = {
        data: data,
        type: data.ty,
        preTransforms: this.transformsManager.addTransformSequence(transforms),
        transforms: [],
        elements: [],
        closed: data.hd === true
      };
      var elementData = {};
      if (data.ty === 'fl' || data.ty === 'st') {
        elementData.c = _PropertyFactory2.default.getProp(this, data.c, 1, 255, this);
        if (!elementData.c.k) {
          styleElem.co = 'rgb(' + (0, _common.bm_floor)(elementData.c.v[0]) + ',' + (0, _common.bm_floor)(elementData.c.v[1]) + ',' + (0, _common.bm_floor)(elementData.c.v[2]) + ')';
        }
      } else if (data.ty === 'gf' || data.ty === 'gs') {
        elementData.s = _PropertyFactory2.default.getProp(this, data.s, 1, null, this);
        elementData.e = _PropertyFactory2.default.getProp(this, data.e, 1, null, this);
        elementData.h = _PropertyFactory2.default.getProp(this, data.h || {
          k: 0
        }, 0, 0.01, this);
        elementData.a = _PropertyFactory2.default.getProp(this, data.a || {
          k: 0
        }, 0, degToRads, this);
        elementData.g = new _GradientProperty.GradientProperty(this, data.g, this);
      }
      elementData.o = _PropertyFactory2.default.getProp(this, data.o, 0, 0.01, this);
      if (data.ty === 'st' || data.ty === 'gs') {
        styleElem.lc = this.lcEnum[data.lc] || 'round';
        styleElem.lj = this.ljEnum[data.lj] || 'round';
        if (data.lj === 1) {
          styleElem.ml = data.ml;
        }
        elementData.w = _PropertyFactory2.default.getProp(this, data.w, 0, null, this);
        if (!elementData.w.k) {
          styleElem.wi = elementData.w.v;
        }
        if (data.d) {
          var d = new _DashProperty2.default(this, data.d, 'canvas', this);
          elementData.d = d;
          if (!elementData.d.k) {
            styleElem.da = elementData.d.dashArray;
            styleElem.do = elementData.d.dashoffset[0];
          }
        }
      } else {
        styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero';
      }
      this.stylesList.push(styleElem);
      elementData.style = styleElem;
      return elementData;
    }
  }, {
    key: 'createGroupElement',
    value: function createGroupElement() {
      var elementData = {
        it: [],
        prevViewData: []
      };
      return elementData;
    }
  }, {
    key: 'createTransformElement',
    value: function createTransformElement(data) {
      var elementData = {
        transform: {
          opacity: 1,
          _opMdf: false,
          key: this.transformsManager.getNewKey(),
          op: _PropertyFactory2.default.getProp(this, data.o, 0, 0.01, this),
          mProps: _TransformProperty2.default.getTransformProperty(this, data, this)
        }
      };
      return elementData;
    }
  }, {
    key: 'createShapeElement',
    value: function createShapeElement(data) {
      var elementData = new _CVShapeData2.default(this, data, this.stylesList, this.transformsManager);

      this.shapes.push(elementData);
      this.addShapeToModifiers(elementData);
      return elementData;
    }
  }, {
    key: 'reloadShapes',
    value: function reloadShapes() {
      this._isFirstFrame = true;
      var i = void 0;
      var len = this.itemsData.length;
      for (i = 0; i < len; i += 1) {
        this.prevViewData[i] = this.itemsData[i];
      }
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
      len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue();
      }
      this.renderModifiers();
      this.transformsManager.processSequences(this._isFirstFrame);
    }
  }, {
    key: 'addTransformToStyleList',
    value: function addTransformToStyleList(transform) {
      var i = void 0;
      var len = this.stylesList.length;
      for (i = 0; i < len; i += 1) {
        if (!this.stylesList[i].closed) {
          this.stylesList[i].transforms.push(transform);
        }
      }
    }
  }, {
    key: 'removeTransformFromStyleList',
    value: function removeTransformFromStyleList() {
      var i = void 0;
      var len = this.stylesList.length;
      for (i = 0; i < len; i += 1) {
        if (!this.stylesList[i].closed) {
          this.stylesList[i].transforms.pop();
        }
      }
    }
  }, {
    key: 'closeStyles',
    value: function closeStyles(styles) {
      var i = void 0;
      var len = styles.length;
      // let j;
      // let jLen;
      for (i = 0; i < len; i += 1) {
        styles[i].closed = true;
      }
    }
  }, {
    key: 'searchShapes',
    value: function searchShapes(arr, itemsData, prevViewData, shouldRender, transforms) {
      var i = void 0;
      var len = arr.length - 1;
      var j = void 0;
      var jLen = void 0;
      var ownStyles = [];
      var ownModifiers = [];
      var processedPos = void 0;
      var modifier = void 0;
      var currentTransform = void 0;
      var ownTransforms = [].concat(transforms);
      for (i = len; i >= 0; i -= 1) {
        processedPos = this.searchProcessedElement(arr[i]);
        if (!processedPos) {
          arr[i]._shouldRender = shouldRender;
        } else {
          itemsData[i] = prevViewData[processedPos - 1];
        }
        if (arr[i].ty === 'fl' || arr[i].ty === 'st' || arr[i].ty === 'gf' || arr[i].ty === 'gs') {
          if (!processedPos) {
            itemsData[i] = this.createStyleElement(arr[i], ownTransforms);
          } else {
            itemsData[i].style.closed = false;
          }

          ownStyles.push(itemsData[i].style);
        } else if (arr[i].ty === 'gr') {
          if (!processedPos) {
            itemsData[i] = this.createGroupElement(arr[i]);
          } else {
            jLen = itemsData[i].it.length;
            for (j = 0; j < jLen; j += 1) {
              itemsData[i].prevViewData[j] = itemsData[i].it[j];
            }
          }
          this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, shouldRender, ownTransforms);
        } else if (arr[i].ty === 'tr') {
          if (!processedPos) {
            currentTransform = this.createTransformElement(arr[i]);
            itemsData[i] = currentTransform;
          }
          ownTransforms.push(itemsData[i]);
          this.addTransformToStyleList(itemsData[i]);
        } else if (arr[i].ty === 'sh' || arr[i].ty === 'rc' || arr[i].ty === 'el' || arr[i].ty === 'sr') {
          if (!processedPos) {
            itemsData[i] = this.createShapeElement(arr[i]);
          }
        } else if (arr[i].ty === 'tm' || arr[i].ty === 'rd') {
          if (!processedPos) {
            modifier = _ShapeModifiers2.default.getModifier(arr[i].ty);
            modifier.init(this, arr[i]);
            itemsData[i] = modifier;
            this.shapeModifiers.push(modifier);
          } else {
            modifier = itemsData[i];
            modifier.closed = false;
          }
          ownModifiers.push(modifier);
        } else if (arr[i].ty === 'rp') {
          if (!processedPos) {
            modifier = _ShapeModifiers2.default.getModifier(arr[i].ty);
            itemsData[i] = modifier;
            modifier.init(this, arr, i, itemsData);
            this.shapeModifiers.push(modifier);
            shouldRender = false;
          } else {
            modifier = itemsData[i];
            modifier.closed = true;
          }
          ownModifiers.push(modifier);
        }
        this.addProcessedElement(arr[i], i + 1);
      }
      this.removeTransformFromStyleList();
      this.closeStyles(ownStyles);
      len = ownModifiers.length;
      for (i = 0; i < len; i += 1) {
        ownModifiers[i].closed = true;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      this.transformHelper.opacity = 1;
      this.transformHelper._opMdf = false;
      this.renderModifiers();
      this.transformsManager.processSequences(this._isFirstFrame);

      this.renderShape(this.transformHelper, this.shapesData, this.itemsData, true);
    }
  }, {
    key: 'renderShapeTransform',
    value: function renderShapeTransform(parentTransform, groupTransform) {
      // let props;
      // let groupMatrix;
      if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
        groupTransform.opacity = parentTransform.opacity;
        groupTransform.opacity *= groupTransform.op.v;
        groupTransform._opMdf = true;
      }
    }
  }, {
    key: 'drawLayer',
    value: function drawLayer() {
      var i = void 0;
      var len = this.stylesList.length;
      var j = void 0;
      var jLen = void 0;
      var k = void 0;
      var kLen = void 0;
      var elems = void 0;
      var nodes = void 0;
      var renderer = this.globalData.renderer;
      var ctx = this.globalData.canvasContext;
      var type = void 0;
      var currentStyle = void 0;
      for (i = 0; i < len; i += 1) {
        currentStyle = this.stylesList[i];
        type = currentStyle.type;

        // Skipping style when
        // Stroke width equals 0
        // style should not be rendered (extra unused repeaters)
        // current opacity equals 0
        // global opacity equals 0
        if ((type === 'st' || type === 'gs') && currentStyle.wi === 0 || !currentStyle.data._shouldRender || currentStyle.coOp === 0 || this.globalData.currentGlobalAlpha === 0) {
          continue;
        }
        renderer.save();
        elems = currentStyle.elements;
        if (type === 'st' || type === 'gs') {
          ctx.strokeStyle = type === 'st' ? currentStyle.co : currentStyle.grd;
          ctx.lineWidth = currentStyle.wi;
          ctx.lineCap = currentStyle.lc;
          ctx.lineJoin = currentStyle.lj;
          ctx.miterLimit = currentStyle.ml || 0;
        } else {
          ctx.fillStyle = type === 'fl' ? currentStyle.co : currentStyle.grd;
        }
        renderer.ctxOpacity(currentStyle.coOp);
        if (type !== 'st' && type !== 'gs') {
          ctx.beginPath();
        }
        renderer.ctxTransform(currentStyle.preTransforms.finalTransform.props);
        jLen = elems.length;
        for (j = 0; j < jLen; j += 1) {
          if (type === 'st' || type === 'gs') {
            ctx.beginPath();
            if (currentStyle.da) {
              ctx.setLineDash(currentStyle.da);
              ctx.lineDashOffset = currentStyle.do;
            }
          }
          nodes = elems[j].trNodes;
          kLen = nodes.length;

          for (k = 0; k < kLen; k += 1) {
            if (nodes[k].t === 'm') {
              ctx.moveTo(nodes[k].p[0], nodes[k].p[1]);
            } else if (nodes[k].t === 'c') {
              ctx.bezierCurveTo(nodes[k].pts[0], nodes[k].pts[1], nodes[k].pts[2], nodes[k].pts[3], nodes[k].pts[4], nodes[k].pts[5]);
            } else {
              ctx.closePath();
            }
          }
          if (type === 'st' || type === 'gs') {
            ctx.stroke();
            if (currentStyle.da) {
              ctx.setLineDash(this.dashResetter);
            }
          }
        }

        if (type !== 'st' && type !== 'gs') {
          if (currentStyle.r === 'nonzero') {
            ctx.fill();
          } else {
            ctx.fill(currentStyle.r);
          }
        }

        renderer.restore();
      }
    }
  }, {
    key: 'renderShape',
    value: function renderShape(parentTransform, items, data, isMain) {
      var i = void 0;
      var len = items.length - 1;
      var groupTransform = void 0;
      groupTransform = parentTransform;
      for (i = len; i >= 0; i -= 1) {
        if (items[i].ty === 'tr') {
          groupTransform = data[i].transform;
          this.renderShapeTransform(parentTransform, groupTransform);
        } else if (items[i].ty === 'sh' || items[i].ty === 'el' || items[i].ty === 'rc' || items[i].ty === 'sr') {
          this.renderPath(items[i], data[i]);
        } else if (items[i].ty === 'fl') {
          this.renderFill(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'st') {
          this.renderStroke(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'gf' || items[i].ty === 'gs') {
          this.renderGradientFill(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'gr') {
          this.renderShape(groupTransform, items[i].it, data[i].it);
        } else if (items[i].ty === 'tm') {
          //
        }
      }
      if (isMain) {
        this.drawLayer();
      }
    }
  }, {
    key: 'renderStyledShape',
    value: function renderStyledShape(styledShape, shape) {
      if (this._isFirstFrame || shape._mdf || styledShape.transforms._mdf) {
        var shapeNodes = styledShape.trNodes;
        var paths = shape.paths;
        var i = void 0;
        var len = void 0;
        var j = void 0;
        var jLen = paths._length;
        shapeNodes.length = 0;
        var groupTransformMat = styledShape.transforms.finalTransform;
        for (j = 0; j < jLen; j += 1) {
          var pathNodes = paths.shapes[j];
          if (pathNodes && pathNodes.v) {
            len = pathNodes._length;
            for (i = 1; i < len; i += 1) {
              if (i === 1) {
                shapeNodes.push({
                  t: 'm',
                  p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
                });
              }
              shapeNodes.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[i], pathNodes.v[i])
              });
            }
            if (len === 1) {
              shapeNodes.push({
                t: 'm',
                p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
              });
            }
            if (pathNodes.c && len) {
              shapeNodes.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[0], pathNodes.v[0])
              });
              shapeNodes.push({
                t: 'z'
              });
            }
          }
        }
        styledShape.trNodes = shapeNodes;
      }
    }
  }, {
    key: 'renderPath',
    value: function renderPath(pathData, itemData) {
      if (pathData.hd !== true && pathData._shouldRender) {
        var i = void 0;
        var len = itemData.styledShapes.length;
        for (i = 0; i < len; i += 1) {
          this.renderStyledShape(itemData.styledShapes[i], itemData.sh);
        }
      }
    }
  }, {
    key: 'renderFill',
    value: function renderFill(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;

      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + (0, _common.bm_floor)(itemData.c.v[0]) + ',' + (0, _common.bm_floor)(itemData.c.v[1]) + ',' + (0, _common.bm_floor)(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
    }
  }, {
    key: 'renderGradientFill',
    value: function renderGradientFill(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;
      if (!styleElem.grd || itemData.g._mdf || itemData.s._mdf || itemData.e._mdf || styleData.t !== 1 && (itemData.h._mdf || itemData.a._mdf)) {
        var ctx = this.globalData.canvasContext;
        var grd = void 0;
        var pt1 = itemData.s.v;
        var pt2 = itemData.e.v;
        if (styleData.t === 1) {
          grd = ctx.createLinearGradient(pt1[0], pt1[1], pt2[0], pt2[1]);
        } else {
          var rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
          var ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);

          var percent = itemData.h.v >= 1 ? 0.99 : itemData.h.v <= -1 ? -0.99 : itemData.h.v;
          var dist = rad * percent;
          var x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
          var y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
          grd = ctx.createRadialGradient(x, y, 0, pt1[0], pt1[1], rad);
        }

        var i = void 0;
        var len = styleData.g.p;
        var cValues = itemData.g.c;
        var opacity = 1;

        for (i = 0; i < len; i += 1) {
          if (itemData.g._hasOpacity && itemData.g._collapsable) {
            opacity = itemData.g.o[i * 2 + 1];
          }
          grd.addColorStop(cValues[i * 4] / 100, 'rgba(' + cValues[i * 4 + 1] + ',' + cValues[i * 4 + 2] + ',' + cValues[i * 4 + 3] + ',' + opacity + ')');
        }
        styleElem.grd = grd;
      }
      styleElem.coOp = itemData.o.v * groupTransform.opacity;
    }
  }, {
    key: 'renderStroke',
    value: function renderStroke(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;
      var d = itemData.d;
      if (d && (d._mdf || this._isFirstFrame)) {
        styleElem.da = d.dashArray;
        styleElem.do = d.dashoffset[0];
      }
      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + (0, _common.bm_floor)(itemData.c.v[0]) + ',' + (0, _common.bm_floor)(itemData.c.v[1]) + ',' + (0, _common.bm_floor)(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
      if (itemData.w._mdf || this._isFirstFrame) {
        styleElem.wi = itemData.w.v;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.shapesData = null;
      this.globalData = null;
      this.canvasContext = null;
      this.stylesList.length = 0;
      this.itemsData.length = 0;
    }
  }]);

  return CVShapeElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _CVBaseElement2.default, _ShapeElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableElement2.default));

exports.default = CVShapeElement;