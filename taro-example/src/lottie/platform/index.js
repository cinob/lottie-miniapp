'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // @jgb-ignore


exports.canvasPutImageData = canvasPutImageData;
exports.getUserDataPath = getUserDataPath;

var _getEnvObj = require('../utils/getEnvObj');

var _wx2ali = require('./wx2ali');

var _wx2ali2 = _interopRequireDefault(_wx2ali);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function canvasPutImageData(_ref) {
  var canvasContext = _ref.canvasContext,
      data = _ref.data,
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height;

  if (canvasContext.canvasPutImageData) {
    canvasContext.canvasPutImageData({
      canvasId: canvasContext.canvasId || '',
      data: data,
      x: x,
      y: y,
      width: width,
      height: height
    });
  } else {
    // 支付宝
    canvasContext.putImageData({
      data: data,
      x: x,
      y: y,
      width: width,
      height: height
    });
  }
}

var api = _extends({}, (0, _getEnvObj.getEnvObj)());

function getUserDataPath() {
  try {
    return api.env.USER_DATA_PATH;
  } catch (error) {
    console.warn('getUserDataPath error');
    return '/USER_DATA_PATH';
  }
}

if (!api.getFileSystemManager) {
  api.getFileSystemManager = function () {
    // eslint-disable-next-line no-console
    console.warn('当前小程序不支持 getFileSystemManager');
  };
}

if (!api.base64ToArrayBuffer) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  api.base64ToArrayBuffer = function (base64) {
    var bufferLength = base64.length * 0.75;
    var len = base64.length;var i = void 0;var p = 0;
    var encoded1 = void 0;var encoded2 = void 0;var encoded3 = void 0;var encoded4 = void 0;

    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return arraybuffer;
  };
}

// 支付宝
if (api.ap) {
  Object.keys(_wx2ali2.default).forEach(function (key) {
    api[key] = _wx2ali2.default[key];
  });
}

exports.default = api;