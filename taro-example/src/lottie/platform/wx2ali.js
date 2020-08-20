'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _getEnvObj = require('../utils/getEnvObj');

var ALI_OBJ = (0, _getEnvObj.getEnvObj)();

/**
 * @param {Object} opts 原参数
 * @param {Function} getOptions 获取 success 回调修改后的参数
 */
var handleSuccess = function handleSuccess(opts) {
  var getOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var thisObj = arguments[2];

  if (!opts.success) {
    return;
  }
  var _this = thisObj;
  var cacheSuc = opts.success;
  opts.success = function (res) {
    var changedRes = getOptions(res) || res;
    cacheSuc.call(_this, changedRes);
  };
};

function noop() {}

var wxToAliApi = {
  /**
   * 网络
   */

  request: function request() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = changeOpts(options, {
      header: 'headers'
    });

    handleSuccess(opts, function (res) {
      return changeOpts(res, {
        headers: 'header',
        status: 'statusCode'
      });
    });

    // request 在 1.11.0 以上版本才支持
    // httpRequest 即将被废弃，钉钉端仍需要使用
    if (ALI_OBJ.canIUse('request')) {
      return ALI_OBJ.request(opts);
    }
    return ALI_OBJ.httpRequest(opts);
  },
  downloadFile: function downloadFile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = changeOpts(options);

    handleSuccess(opts, function (res) {
      return changeOpts(res, {
        apFilePath: 'tempFilePath'
      });
    });

    return ALI_OBJ.downloadFile(opts);
  }
};

exports.default = wxToAliApi;


function changeOpts(options) {
  var updateOrRemoveOpt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var extraOpt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var opts = {};

  Object.keys(options).forEach(function (key) {
    var myKey = Object.prototype.hasOwnProperty.call(updateOrRemoveOpt, key) ? updateOrRemoveOpt[key] : key;
    if (myKey !== '') {
      opts[myKey] = options[key];
    }
  });

  opts = _extends({}, opts, extraOpt);

  return opts;
}