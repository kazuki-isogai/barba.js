/**
 * Object that is going to deal with DOM parsing/manipulation
 *
 * @namespace Barba.Pjax.Dom
 * @type {Object}
 */
var Dom = {
  /**
   * The name of the data attribute on the container
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  dataNamespace: 'namespace',

  /**
   * Id of the main wrapper
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  wrapperId: 'barba-wrapper',

  /**
   * Class name used to identify the containers
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   * @default
   */
  containerClass: 'barba-container',

  /**
   * Full HTML String of the current page.
   * By default is the innerHTML of the initial loaded page.
   *
   * Each time a new page is loaded, the value is the response of the xhr call.
   *
   * @memberOf Barba.Pjax.Dom
   * @type {String}
   */
  currentHTML: document.documentElement.innerHTML,

	/**
   * 遷移時に変更するhead内要素
   *
   * @type {String}
   */
  headTags: [
		'title',
    'meta[name="keywords"]',
    'meta[name="description"]',
    'meta[property^="og"]',
    'meta[name^="twitter"]',
    'meta[itemprop]',
    'link[itemprop]',
    'link[rel="prev"]',
    'link[rel="next"]',
    'link[rel="canonical"]',
    'link[rel="alternate"]'
  ].join(','),

  /**
   * Parse the responseText obtained from the xhr call
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {String} responseText
   * @return {HTMLElement}
   */
  parseResponse: function(responseText) {
    this.currentHTML = responseText;

    this.updateHeadElements(responseText);

    return this.getContainer(wrapper);
  },

	/**
   * ヘッドのMetaタグ系を更新する
   *
   * @param  {String} newPageRawHTML ロードしたページの生HTML
   */
  updateHeadElements: function(newPageRawHTML) {
    var head = document.head;
    var newPageRawHead = newPageRawHTML.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[1];
    var newPageHead = document.createElement('head');
    var i, oldHeadTags, newHeadTags;

    newPageHead.innerHTML = newPageRawHead;

    oldHeadTags = head.querySelectorAll(this.headTags);
    for (i = 0; i < oldHeadTags.length; i++) {
      head.removeChild(oldHeadTags[i]);
    }

    newHeadTags = newPageHead.querySelectorAll(this.headTags);
    for (i = 0; i < newHeadTags.length; i++) {
      head.appendChild(newHeadTags[i]);
    }
  },

  /**
   * Get the main barba wrapper by the ID `wrapperId`
   *
   * @memberOf Barba.Pjax.Dom
   * @return {HTMLElement} element
   */
  getWrapper: function() {
    var wrapper = document.getElementById(this.wrapperId);

    if (!wrapper)
      throw new Error('Barba.js: wrapper not found!');

    return wrapper;
  },

  /**
   * Get the container on the current DOM,
   * or from an HTMLElement passed via argument
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {HTMLElement}
   */
  getContainer: function(element) {
    if (!element)
      element = document.body;

    if (!element)
      throw new Error('Barba.js: DOM not ready!');

    var container = this.parseContainer(element);

    if (container && container.jquery)
      container = container[0];

    if (!container)
      throw new Error('Barba.js: no container found');

    return container;
  },

  /**
   * Get the namespace of the container
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {String}
   */
  getNamespace: function(element) {
    if (element && element.dataset) {
      return element.dataset[this.dataNamespace];
    } else if (element) {
      return element.getAttribute('data-' + this.dataNamespace);
    }

    return null;
  },

  /**
   * Put the container on the page
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   */
  putContainer: function(element) {
    element.style.visibility = 'hidden';

    var wrapper = this.getWrapper();
    wrapper.appendChild(element);
  },

  /**
   * Get container selector
   *
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} element
   * @return {HTMLElement} element
   */
  parseContainer: function(element) {
    return element.querySelector('.' + this.containerClass);
  }
};

module.exports = Dom;
