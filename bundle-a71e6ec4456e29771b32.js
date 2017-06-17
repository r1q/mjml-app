/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(0);

var REL_URL = 'https://api.github.com/repos/mjmlio/mjml-app/releases';

var os = 'linux';

if (navigator.appVersion.indexOf('Win') !== -1) {
  os = 'windows';
} else if (navigator.appVersion.indexOf('Mac') !== -1) {
  os = 'osx';
}

var osLabel = { windows: 'Windows', osx: 'Mac', linux: 'Linux' }[os];

fetch(REL_URL).then(function (res) {
  return res.json();
}).then(function (res) {
  var lastVersion = res[0];
  document.getElementById('dl-btn-label').innerHTML = '&nbsp;- ' + lastVersion.tag_name;
  document.getElementById('dl-dl-dl').innerHTML = 'Download for ' + osLabel;
}

// tracking

);var dlGeneral = document.getElementById('dl-general');
var dlLinux = document.getElementById('dl-linux');
var dlWin = document.getElementById('dl-win');
var dlOSX = document.getElementById('dl-osx'

// windows being windows... always shitty, even on links.
);if (os === 'windows') {
  dlGeneral.setAttribute('href', 'http://mjml-app.sigsev.io/download/win_64');
}

dlGeneral.addEventListener('click', createTracking(os));
dlLinux.addEventListener('click', createTracking('linux'));
dlWin.addEventListener('click', createTracking('windows'));
dlOSX.addEventListener('click', createTracking('osx'));

function createTracking(os) {
  return function () {
    dataLayer.push({ // eslint-disable-line
      eventValue: 'mjmlApp-Downloaded',
      event: 'mjml-app',
      button: os
    });
  };
}

/***/ })
/******/ ]);