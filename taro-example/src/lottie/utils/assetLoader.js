'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadZip = downloadZip;
exports.unzipFile = unzipFile;
exports.getDirStat = getDirStat;
exports.getFileTree = getFileTree;
exports.loadZipFiles = loadZipFiles;

var _index = require('../platform/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // load json
  load: function assetLoader(path, callback, error_callback) {
    var self = this;
    if (path.includes('.zip')) {
      // eslint-disable-next-line no-use-before-define
      return loadZipFiles(path).then(function (_ref) {
        var data = _ref.data,
            tempDir = _ref.tempDir;

        self.path = tempDir;
        callback(data);
      }).catch(function (err) {
        if (typeof error_callback !== 'function') return;
        error_callback(err);
      });
    }
    _index2.default.request({
      url: path,
      success: function success(res) {
        callback(res.data);
      },
      fail: function fail(err) {
        if (typeof error_callback !== 'function') return;
        error_callback(err);
      }
    });
  }
}; /* eslint-disable no-console */

var fs = typeof _index2.default.getFileSystemManager === 'function' ? _index2.default.getFileSystemManager() : {};

function downloadZip(url) {
  return new Promise(function (resolve) {
    _index2.default.downloadFile({
      url: url,
      success: function success(res) {
        console.log('downloadZip', res);
        resolve(res.tempFilePath);
      }
    });
  });
}

/**
 * 确保路径存在
 */
function ensureDir(dir) {
  var dirs = dir.split('/');
  var len = dirs.length;
  var i = 1;
  while (i <= len) {
    var targetPath = dirs.slice(0, i).join('/');
    try {
      fs.mkdirSync(targetPath);
    } catch (error) {
      console.warn('ensureDir [' + targetPath + ']', error);
    }
    i++;
  }
}

function unzipFile(tempFilePath) {
  var targetPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _index.getUserDataPath)() + '/tmp-unzip';

  return new Promise(function (resolve) {
    ensureDir(targetPath);
    fs.unzip({
      targetPath: targetPath,
      zipFilePath: tempFilePath,
      success: function success(res) {
        console.log('unzipFile', res);
        resolve({
          targetPath: targetPath
        });
      },
      fail: function fail(err) {
        console.error('unzipFile', err);
      }
    });
  });
}

function getDirStat(dir) {
  return fs.statSync(dir);
}

function getFileTree(dir) {
  var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    var filePath = dir + '/' + file;
    var Stats = getDirStat(filePath);
    var isDir = Stats.isDirectory();

    if (isDir) {
      tree[file] = getFileTree(filePath);
    } else {
      tree[file] = filePath;
    }
  });
  return tree;
}

function loadZipFiles(url) {
  var tempDir = '';
  var unzipDir = (0, _index.getUserDataPath)() + '/tmp-unzip/' + easyHashCode(url);
  return downloadZip(url).then(function (tempFilePath) {
    return unzipFile(tempFilePath, unzipDir);
  }).then(function (_ref2) {
    var targetPath = _ref2.targetPath;

    tempDir = targetPath + '/';
    var tree = getFileTree(targetPath);
    var keys = Object.keys(tree);
    var dataJsonPath = keys.find(function (key) {
      return key.endsWith('.json');
    });
    if (!dataJsonPath) return;
    return {
      tempDir: tempDir,
      data: JSON.parse(fs.readFileSync(tree[dataJsonPath], 'utf-8') || '{}')
    };
  });
}

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