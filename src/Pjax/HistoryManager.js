var Utils = require('../Utils/Utils');

/**
 * HistoryManager helps to keep track of the navigation
 *
 * @namespace Barba.HistoryManager
 * @type {Object}
 */
var HistoryManager = {
  /**
   * Keep track of the status in historic order
   *
   * @readOnly
   * @type {Array}
   */
  history: [],

  /**
   * 遷移タイプを判別する為のルート階層の指定
   *
   * @memberOf Barba.HistoryManager
   * @type {Number}
   */
  rootHierarchy: 0,

  /**
   * Add a new set of url and namespace
   *
   * @memberOf Barba.HistoryManager
   * @param {String} url
   * @param {String} namespace
   * @private
   */
  add: function(url, namespace) {
    if (!namespace)
      namespace = undefined;

    this.history.push({
      url: url,
      path: url.replace(window.location.origin, '').replace(/#.*|\?.*/, ''),
      namespace: namespace
    });
  },

  /**
   * Return information about the current status
   *
   * @memberOf Barba.HistoryManager
   * @return {Object}
   */
  currentStatus: function() {
    return this.history[this.history.length - 1];
  },

  /**
   * Return information about the previous status
   *
   * @memberOf Barba.HistoryManager
   * @return {Object}
   */
  prevStatus: function() {
    var history = this.history;

    if (history.length < 2)
      return null;

    return history[history.length - 2];
  },

  /**
   * 遷移先のページのパスを返す
   * ※ newContainerLoading完了前はundefined
   *
   * @memberOf Barba.HistoryManager
   * @return {String} パス
   */
  getCurrentPath: function () {
    return this.currentStatus().path;
  },

  /**
   * 遷移元のページのパスを返す
   *
   * @memberOf Barba.HistoryManager
   * @return {String} パス
   */
  getPrevPath: function () {
    return this.prevStatus().path;
  },

  /**
   * ページバック判定の拡張
   *
   * @memberOf Barba.HistoryManager
   * @return {Boolean}
   */
  isBack: function () {
    var len = this.history.length;

    if ( len > 2 ) {
      var beforePrevPath = this.history.slice(len - 3)[0].path;
      var currentPath = this.currentStatus().path;
      return beforePrevPath === currentPath;
    } else {
      return false;
    }
  },

  /**
   * 遷移のタイプを返す
   *
   * @memberOf Barba.HistoryManager
   * @return {String} 遷移のタイプ（方向）
   */
  getDirection: function () {
    var len = this.history.length;

    if ( len > 0 ) {
      var prevPathArr = Utils.compact(this.history.slice(len - 2)[0].path.split('/'));
      var currentPathArr = Utils.compact(this.currentStatus().path.split('/'));
      return this.distinguishDirection(prevPathArr, currentPathArr);
    }

    return false;
  },

  /**
   * パス情報を元に遷移のタイプを判別する
   *
   * @memberOf Barba.HistoryManager
   * @param  {Array} prev    前のページのパス
   * @param  {Array} current 現在のページのパス
   * @return {String}        遷移のタイプ（方向）
   */
  distinguishDirection: function (prev, current) {
    var direction, diff;

    prev = prev.slice(this.rootHierarchy);
    current = current.slice(this.rootHierarchy);

    if ( prev[0] !== current[0] ) {
      direction = 'change';
      return direction;
    }

    if ( prev.length !== current.length ) {
      diff = current.length - prev.length;

      if ( diff < 0 ) {
        direction = 'back';
      } else {
        direction = ( prev[prev.length - 1] === current[prev.length - 1] ) ? 'forward' : 'change:category';
      }
    } else {
      direction = ( prev[prev.length - 2] === current[prev.length - 2] ) ? 'change:page' : 'change:category';
    }

    return direction;
  }
};

module.exports = HistoryManager;
