'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */


var _index = require('../platform/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImagePreloader = function () {
  function ImagePreloader() {
    _classCallCheck(this, ImagePreloader);

    this.assetsPath = '';
    this.path = '';
    this.totalAssets = 0;
    this.totalImages = 0;
    this.loadedAssets = 0;
    this.imagesLoadedCb = null;
    // canvas type=2d 需要指定
    this.canvas = null;
    this.images = [];
  }

  _createClass(ImagePreloader, [{
    key: 'imageLoaded',
    value: function imageLoaded() {
      this.loadedAssets += 1;
      if (this.loadedAssets === this.totalImages) {
        if (this.imagesLoadedCb) {
          this.imagesLoadedCb(null);
        }
      }
    }
  }, {
    key: 'getAssetsPath',
    value: function getAssetsPath(assetData) {
      var path = '';
      if (assetData.e) {
        path = assetData.p;
      } else if (this.assetsPath) {
        var imagePath = assetData.p;
        if (imagePath.indexOf('images/') !== -1) {
          imagePath = imagePath.split('/')[1];
        }
        path = this.assetsPath + imagePath;
      } else {
        path = this.path;
        path += assetData.u ? assetData.u : '';
        path += assetData.p;
      }
      return path;
    }
  }, {
    key: 'getImage',
    value: function getImage(assetData) {
      var i = 0;
      var len = this.images.length;
      while (i < len) {
        if (this.images[i].assetData === assetData) {
          return this.images[i].img;
        }
        i += 1;
      }
    }
  }, {
    key: 'createImageData',
    value: function createImageData(assetData) {
      var _this = this;

      var path = this.getAssetsPath(assetData, this.assetsPath, this.path);
      var img = {
        src: path
      };
      this.loadImage(path, function (tmpPath) {
        if (tmpPath) {
          if (_this.canvas && _this.canvas.createImage) {
            var image = _this.canvas.createImage();
            new Promise(function (resolve) {
              image.onload = resolve;
              image.onerror = resolve;
              img.src = image;
              image.src = tmpPath;
            }).then(function () {
              return _this.imageLoaded();
            });
            return;
          }

          new Promise(function (resolve) {
            return _index2.default.getImageInfo({
              src: tmpPath,
              success: function success(res) {
                var width = res.width,
                    height = res.height;

                img.src = tmpPath;
                img.width = width;
                img.height = height;
              },

              complete: resolve
            });
          }).then(function () {
            return _this.imageLoaded();
          });
        }
      });
      var ob = {
        img: img,
        assetData: assetData
      };
      return ob;
    }
  }, {
    key: 'loadImage',
    value: function loadImage(path, cb) {
      var imageLoaded = this.imageLoaded.bind(this);
      // 读取base64图片
      if (path.startsWith('data:')) {
        loadBase64Image(path).then(function (filePath) {
          console.log('loadImage base64', filePath);
          cb(filePath);
        }, function (err) {
          console.log('loadBase64Image:fail', err);
          cb();
        });
      } else if (path.startsWith('http')) {
        // 下载网络图片
        _index2.default.downloadFile({
          url: path,
          success: function success(res) {
            // 本地路径
            cb(res.tempFilePath);
          },
          fail: function fail() {
            cb();
            imageLoaded();
          }
        });
      } else {
        // 读取本地文件
        cb(path);
      }
    }
  }, {
    key: 'loaded',
    value: function loaded() {
      return this.totalImages === this.loadedAssets;
    }
  }, {
    key: 'loadAssets',
    value: function loadAssets(assets, cb) {
      this.imagesLoadedCb = cb;
      var i = void 0;
      var len = assets.length;
      for (i = 0; i < len; i += 1) {
        if (!assets[i].layers) {
          this.images.push(this.createImageData(assets[i]));
          this.totalImages += 1;
        }
      }
    }
  }, {
    key: 'setPath',
    value: function setPath(path) {
      this.path = path || '';
    }
  }, {
    key: 'setAssetsPath',
    value: function setAssetsPath(path) {
      this.assetsPath = path || '';
    }
  }, {
    key: 'setCanvas',
    value: function setCanvas(canvas) {
      this.canvas = canvas;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.imagesLoadedCb = null;
      this.images.length = 0;
    }
  }]);

  return ImagePreloader;
}();

function easyHashCode() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var len = str.length;
  var i = 0;
  var hash = 0;
  while (i < len) {
    var character = str.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash;
    i++;
  }
  return Math.abs(('' + hash).toString(16));
}

function loadBase64Image(base64data) {
  return new Promise(function (resolve, reject) {
    var _ref = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [],
        _ref2 = _slicedToArray(_ref, 3),
        format = _ref2[1],
        bodyData = _ref2[2];

    if (!format) {
      return reject(new Error('ERROR_BASE64SRC_PARSE'));
    }

    var buffer = _index2.default.base64ToArrayBuffer(bodyData);
    var fsm = _index2.default.getFileSystemManager();
    // 没有fsm 或者 支付宝
    if (!fsm || typeof my !== 'undefined' && !!my.ap) {
      // if (!fsm) {
      try {
        return resolve(new Uint8ClampedArray(buffer));
      } catch (error) {
        return reject();
      }
    }
    var filename = 'lottie-' + easyHashCode(bodyData);
    var filePath = (0, _index.getUserDataPath)() + '/' + filename + '.' + format;
    try {
      // 如果已经存在缓存, 直接缓存
      if (fsm.accessSync(filePath)) {
        return resolve(filePath);
      }
    } catch (error) {
      // @ignore
    }

    fsm.writeFile({
      filePath: filePath,
      data: buffer,
      encoding: 'binary',
      success: function success() {
        resolve(filePath);
      },
      fail: function fail(res) {
        console.error(res.errMsg);
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      }
    });
  });
}

exports.default = ImagePreloader;