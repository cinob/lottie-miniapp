'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CVBaseElement = require('../canvasElements/CVBaseElement');

var _CVBaseElement2 = _interopRequireDefault(_CVBaseElement);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _FrameElement = require('../elements/FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _HierarchyElement = require('../elements/HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _ImageElement = require('../elements/ImageElement');

var _ImageElement2 = _interopRequireDefault(_ImageElement);

var _RenderableElement = require('../elements/RenderableElement');

var _RenderableElement2 = _interopRequireDefault(_RenderableElement);

var _TransformElement = require('../elements/TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

var _RenderableDOMElement = require('../elements/RenderableDOMElement');

var _RenderableDOMElement2 = _interopRequireDefault(_RenderableDOMElement);

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CVImageElement = function (_Mixin) {
  _inherits(CVImageElement, _Mixin);

  function CVImageElement(data, globalData, comp) {
    _classCallCheck(this, CVImageElement);

    var _this = _possibleConstructorReturn(this, (CVImageElement.__proto__ || Object.getPrototypeOf(CVImageElement)).call(this));

    _this.initElement = _RenderableDOMElement2.default.prototype.initElement;
    _this.prepareFrame = _ImageElement2.default.prototype.prepareFrame;

    _this.failed = false;
    _this.assetData = globalData.getAssetData(data.refId);
    _this.img = globalData.imageLoader.getImage(_this.assetData);
    // this.globalData.addPendingElement();
    // 指向CanvasRenderer
    _this.renderer = comp;
    _this.initElement(data, globalData, comp);
    return _this;
  }

  // SVGShapeElement.prototype.initElement


  _createClass(CVImageElement, [{
    key: 'createContent',
    value: function createContent() {
      // 小程序暂不支持裁剪
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      if (this.failed || !this.img.src) {
        return;
      }

      if (this.img.src instanceof Uint8ClampedArray) {
        this.canvasContext.canvasPutImageData({
          canvasId: this.canvasContext.canvasId || '',
          data: this.img.src,
          x: 0,
          y: 0
        });
        return;
      }

      // fix 宽高不同，导致绘制差异
      if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
        this.canvasContext.drawImage(this.img.src || this.img, 0, 0, this.assetData.w, this.assetData.h);
        return;
      }

      this.canvasContext.drawImage(this.img.src || this.img, 0, 0);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.img = null;
    }
  }]);

  return CVImageElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _CVBaseElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableElement2.default));

exports.default = CVImageElement;