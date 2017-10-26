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
   * @memberOf Barba.HistoryManager
   * @readOnly
   * @type {Array}
   */
  history: [],

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
  }
};

module.exports = HistoryManager;
