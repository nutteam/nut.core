/**
 * # Nut.core.js
 * A DOM library. Impressed by jQuery and Zepto.
 * The APIs is subset of jQuery, if you know jQuery, you already know Nut.
 *
 * ## 使用:
 * ```bash
 * npm install wow-nut
 * ```
 * ```javascript
 * var $ = require('wow-nut');
 * ```
 *
 * ## 应用：
 *
 * [UC浏览器网址分享](http://tbsweb.browser.taobao.com/recommend/index.html)
 *
 * [UC浏览器购物车](http://browser.taobao.com/logistics/tbHelper.htm)
 *
 * [UC浏览器新PC版标签页](chrome://newtab/)
 *
 * [UC浏览器iPad版导航](http://m.uc123.com/)
 *
 * @author Shengjie.Yu
 * @version 0.0.2
 * @since 2015-01-22
 * Copyright 2014-2015 ucweb.
 * Released under the MIT license.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(window);
  } else {
    root.$ = factory(window);
  }
}(this, function(window) {
  'use strict';

  var document = window.document;

  // Object types.
  var class2type = {};

  // Special handle events.
  var littleBubbleEvents = ['mouseover', 'mouseout'];

  // Build-in events.
  var buildInEvents = ['focusin', 'focusout', 'focus', 'blur', 'load', 'resize',
    'scroll', 'unload', 'click', 'dblclick', 'mousedown',
    'mouseup', 'mousemove', 'mouseover', 'mouseout',
    'mouseenter', 'mouseleave', 'change', 'select', 'keydown',
    'keypress', 'keyup', 'error', 'submit'
  ];

  // Build-in objects.
  var buildInObjs = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date',
    'RegExp', 'Object', 'Error'
  ];

  // Function for return false.
  var returnFalse = function() {
    return false;
  };

  // Function for return true.
  var returnTrue = function() {
    return true;
  };

  // Regexps.
  var rdata = /(\w+)_data$/;
  var rid = /^#(.+)/;
  var rclass = /^\.(.+)/;
  var rtag = /^([a-zA-Z]+)$/;
  var rnoInnerhtml = /<(?:script|style|link)/i;

  // Suffixs.
  var eventSuffix = '_event';
  var selfSuffix = '_self';
  var dataSuffix = '_data';

  // Selector constructor.
  var Selector = function(selector) {
    if (!selector) {
      return this;
    }

    var element = [];
    var i = 0;
    if (typeof selector === 'string') {
      // html string
      if (selector[0] === '<' && selector[selector.length - 1] === '>' &&
          selector.length >= 3) {
        var arr = $.parseHTML(selector);
        var len = arr.length;

        for (; i < len; i++) {
          this[i] = arr[i];
        }
        this.length = len;
      } else { // id class tag and other
        var selectorList = selector.split(',');
        var listLen = selectorList.length;
        var sel;
        var index = 0;
        var j = 0;
        var k = 0;
        var thisLen = this.length || 0;
        var elLen;
        var selectorMath = [];

        for (; i < listLen; i++) {
          sel = selectorList[i].trim().split(/\s/);
          var deepLen = sel.length;
          if (deepLen === 1) {
            sel = sel[0];
            selectorMath = $.getSelectorMatch(document, sel);
            element = element.length === 0 ? selectorMath :
              element.concat(selectorMath);
          } else if (deepLen === 2) {
            var parentSel = sel[0];
            var chileSel = sel[1];
            var els = [];
            var parentEls = $.getSelectorMatch(document, parentSel);

            for (var flen = parentEls.length; k < flen; k++) {
              var childrens = $.getSelectorMatch(parentEls[k], chileSel);
              for (var l = 0, clen = childrens.length; l < clen; l++) {
                els.push(childrens[l]);
              }
            }

            element = element.length === 0 ? els :
              element.concat(els);
          } else {
            try {
              element = document.querySelectorAll(selector);
            } catch (e) {
              element = [];
            }
          }

          for (elLen = element.length; j < elLen; j++) {
            index = j + thisLen;
            this[index] = element[j];
          }
          this.length = thisLen + elLen;
        }
      }
    } else if (selector.nodeType || selector === window) {
      element = [selector];
      this[0] = element[0];
      this.length = 1;
    } else if (selector instanceof Selector) {
      return selector;
    } else if (typeof selector === 'function') {
      $.ready(selector);
    }

    return this;
  };

  /**
   * $ singleton.
   *
   * @param {String | DOMElement | Selector | Function} selector <br/>
   * - html string. such as "#id",".class","tag".<br/>
   * - html string. such as "`<div></div>`".<br/>
   * - dom element. such as "document.body".<br/>
   * - Selector instance. such as "$('#id')".<br/>
   * - an anonymous function. such as "function(){}".<br/>
   *
   * @returns {Selector} return Selector instance.
   */
  var $ = function(selector) {
    return new Selector(selector);
  };

  /**
   * Create Plugin
   *
   * ```javascript
   * $.fn.tab = function(config) {
   *   // balabala
   * };
   *
   * $('.tab').tab();
   * ```
   *
   * @type {Object|Function}
   */
  $.fn = Selector.prototype;

  // Register a module. module: a module of functions.
  var register = function(module) {
    $.extend(Selector.prototype, module);
  };

  /**
   * Deep or shallow copy an object
   *
   * ### example:
   * ```javascript
   * var base = { a : 1, b : { c : 1 } };
   * var obj = { a : 1, b : { c : 1, d : 2 } };
   * // shallow copy
   * var newObj = $.extend({}, base, obj); // base not changed
   * var newObj2 = $.extend(base, obj); // base changed
   * // deep copy
   * var newObj3 = $.extend(true, {}, base, obj); // base not changed
   * ```
   *
   * @type {Function}
   */
  $.extend = $.fn.extend = function() {
    var src;
    var copyIsArray;
    var copy;
    var name;
    var options;
    var clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;

    if (typeof target === 'boolean') {
      deep = target;

      target = arguments[i] || {};
      i++;
    }

    if (typeof target !== 'object' && $.type(target) !== 'function') {
      target = {};
    }

    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];

          if (target === copy) {
            continue;
          }

          if (deep && copy && ($.isPlainObject(copy) ||
              (copyIsArray = $.type(copy) === 'array'))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $.type(src) === 'array' ? src : [];
            } else {
              clone = src && $.type(src) === 'object' ? src : {};
            }

            target[name] = $.extend(deep, clone, copy);

          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  /**
   * DOM attribute module.
   */
  var attributes = {

    /**
     * Add class,or class list
     *
     * ### example:
     * ```javascript
     * $('#id').addClass('myclass');
     * $('.class').addClass('myclass1 myclass2');
     * ```
     *
     * @param {String} classList class or classList
     * @returns {Selector} origin selector object
     */
    addClass: function(classList) {
      var className;
      $.each(this, function(i, elem) {
        if (typeof classList === 'string') {
          var classArr = classList.split(' ');
          for (var j = 0, len = classArr.length; j < len; j++) {
            className = classArr[j];
            !elem.classList.contains(className) &&
            elem.classList.add(className);
          }
        }
      });

      return this;
    },

    /**
     * Dose has some class
     *
     * ### example:
     * ```javascript
     * $('#id').hasClass('myclass');
     * ```
     *
     * @param {String} className
     * @returns {Boolean}
     */
    hasClass: function(className) {
      return this[0] ? this[0].classList.contains(className) : '';
    },

    /**
     * Remove class,or class list
     *
     * ### example:
     * ```javascript
     * $('#id').removeClass('myclass');
     * $('.class').removeClass('myclass1 myclass2');
     * $('.class').removeClass(); // remove all class
     * ```
     *
     * @param {String | undefined} classList
     * @returns {Selector} origin selector object
     */
    removeClass: function(classList) {
      var className;
      $.each(this, function(i, elem) {
        if (typeof classList === 'string') {
          var classArr = classList.split(' ');
          for (var j = 0, len = classArr.length; j < len; j++) {
            className = classArr[j];
            elem.classList.contains(className) &&
            elem.classList.remove(className);
          }
        } else if (classList === undefined) {
          elem.className = '';
        }
      });

      return this;
    },

    /**
     * Toggle some class
     *
     * ### example:
     * ```javascript
     * $('#id').toggleClass('myclass');
     * ```
     *
     * @param {String} className
     * @returns {Selector} origin selector object
     */
    toggleClass: function(className) {
      $.each(this, function(i, elem) {
        elem.classList.contains(className) ? elem.classList.remove(className) :
          elem.classList.add(className);
      });
      return this;
    },

    /**
     * Set or get attribute
     *
     * ### example:
     * ```javascript
     * $('#id').attr('myattr', 'value'); // set
     * $('#id').attr('myattr'); // get
     * ```
     *
     * @param {String} attr
     * @param {String | undefined} val
     * @returns {Selector} origin selector object
     */
    attr: function(attr, val) {
      if ($.type(attr) === 'object') {
        $.each(this, function(i, elem) {
          var key;
          var value;
          for (key in attr) {
            value = attr[key];
            elem.setAttribute(key, value);
          }
        });
        return this;
      } else if (val !== undefined) {
        $.each(this, function(i, elem) {
          elem.setAttribute(attr, val);
        });
        return this;
      } else {
        return this[0] ? this[0].getAttribute(attr) : '';
      }
    },

    /**
     * Delete attribute
     *
     * ### example:
     * ```javascript
     * $('#id').removeAttr('myattr');
     * ```
     *
     * @param {String} attr
     * @returns {Selector} origin selector object
     */
    removeAttr: function(attr) {
      $.each(this, function(i, elem) {
        elem.removeAttribute(attr);
      });
      return this;
    },

    /**
     * Set or get value of form elements
     *
     * ### example:
     * ```javascript
     * $('input').val('1'); // set
     * $('input').val(); // get
     * ```
     *
     * @param {String | undefined} val
     * @returns {Selector} origin selector object
     */
    val: function(val) {
      if (val !== undefined) {
        $.each(this, function(i, elem) {
          elem.value = val;
        });
        return this;
      } else {
        return this[0] ? this[0].value : '';
      }
    },

    /**
     * Set or get text content
     *
     * ### example:
     * ```javascript
     * $('#id').text('mytext'); // set
     * $('.class').text(); // get
     * ```
     *
     * @param {String | undefined} text
     * @returns {Selector} origin selector object
     */
    text: function(text) {
      if (text !== undefined) {
        $.each(this, function(i, elem) {
          elem.textContent = text;
        });
        return this;
      } else {
        return this[0] ? this[0].textContent : '';
      }
    },

    /**
     * Set or get inner html content
     *
     * ### example:
     * ```javascript
     * $('#id').html('<i>html</i>'); // set
     * $('.class').html(); // get
     * ```
     *
     * @param {String | undefined} html
     * @returns {Selector} origin selector object
     */
    html: function(html) {
      if (html !== undefined) {
        $.each(this, function(i, elem) {
          if (html instanceof DocumentFragment) {
            elem.innerHTML = '';
            elem.appendChild(html);
          } else if (typeof html === 'string' && !rnoInnerhtml.test(html)) {
            elem.innerHTML = html;
          } else {
            $(elem).empty().append(html);
          }
        });
        return this;
      } else {
        return this[0] ? this[0].innerHTML : '';
      }
    }
  };

  /**
   * DOM tranverse module.
   */
  var traverse = {

    /**
     * Find some child element
     *
     * ### example:
     * ```javascript
     * $('#id').find('.class');
     * $('#id').find($('.class'));
     * $('#id').find(document.getElementById('id2'));
     * ```
     *
     * @param {String | Selector | DOMElement} selector
     * @returns {Selector} the finded elements
     */
    find: function(selector) {
      var k = 0;
      var that = new Selector();

      $.each(this, function(i, elem) {
        if (!selector) {
          return $();
        }

        var element = $.getSelectorMatch(elem, selector);
        var len = element.length;
        var j = 0;
        for (; j < len; j++) {
          that[k + j] = element[j];
        }
        k += len;
      });

      that.length = k;
      return that;
    },

    /**
     * Find parent element
     *
     * ### example:
     * ```javascript
     * $('#id').parent();
     * ```
     *
     * @returns {Selector} the parent element
     */
    parent: function() {
      var k = 0;
      var element;
      var that = new Selector();

      $.each(this, function(i, elem) {
        element = elem.parentNode;
        if (element && element.nodeType === 1) {
          that[k] = element;
          k += 1;
        }
      });

      that.length = k;
      return that;
    },

    /**
     * Find children element
     *
     * ### example:
     * ```javascript
     * $('#id').children();
     * ```
     *
     * @returns {Selector} the children elements
     */
    children: function() {
      var k = 0;
      var element;
      var that = new Selector();

      $.each(this, function(i, elem) {
        var childs = elem.childNodes;
        for (var j = 0, len = childs.length; j < len; j++) {
          element = childs[j];
          if (element.nodeType === 1) {
            that[k] = element;
            k += 1;
          }
        }
      });

      that.length = k;
      return that;
    },

    /**
     * Find closest parent element
     *
     * ### example:
     * ```javascript
     * $('#id').closest('.class');
     * $('#id').closest($('.class'));
     * $('#id').closest(document.getElementById('id2'));
     * ```
     *
     * @param {String | Selector | DOMElement} selector
     * @returns {Selector} the closest parent element
     */
    closest: function(selector) {
      var k = 0;
      var that = new Selector();
      var pos = typeof selector !== 'string' ? $(selector) : 0;
      var cur;

      $.each(this, function(i, elem) {
        for (cur = elem; cur; cur = cur.parentNode) {
          if (cur.nodeType === 1 && (pos ?
              pos.index(cur) !== -1 :
              $.matchSelector(cur, selector))) {
            that[k] = cur;
            k += 1;
            break;
          }
        }
      });

      that.length = k;
      return that;
    },

    /**
     * Find some sibling element or certain index
     *
     * ### example:
     * ```javascript
     * $('.class').eq(2);
     * ```
     *
     * @param {Integer} index
     * @returns {Selector} the finded element
     */
    eq: function(index) {
      var that = new Selector();
      var len = this.length;
      var ret = 0;

      for (var i = 0; i < len; i++) {
        if (i === index) {
          that[0] = this[i];
          ret = 1;
          break;
        }
      }

      that.length = ret;
      return that;
    },

    /**
     * Find some sibling element or certain index,
     * different from eq is that get return native dom
     *
     * ### example:
     * ```javascript
     * $('.class').get(2);
     * ```
     *
     * @param {Integer} index
     * @returns {DOMElement} the finded element
     */
    get: function(index) {
      return $(this).eq(index)[0];
    },

    /**
     * Find all the sibling elements
     *
     * ### example:
     * ```javascript
     * $('#id').siblings();
     * ```
     *
     * @returns {Selector} the sibling elements
     */
    siblings: function() {
      var k = 0;
      var that = new Selector();

      $.each(this, function(i, elem) {
        var parent = this.parentNode;
        if (parent) {
          var nodes = parent.children;
          var len = nodes.length;
          for (var j = 0, l = 0; j < len; j++) {
            if (nodes[j] !== elem) {
              that[k + l] = nodes[j];
              l++;
            }
          }
          k += (len - 1);
        }
      });

      that.length = k;
      return that;
    },

    /**
     * Find the prev sibling element
     *
     * ### example:
     * ```javascript
     * $('#id').prev();
     * ```
     *
     * @returns {Selector} the prev element
     */
    prev: function() {
      var k = 0;
      var element;
      var that = new Selector();

      $.each(this, function(i, elem) {
        element = elem.previousElementSibling;
        if (element) {
          that[k] = element;
          k += 1;
        }
      });

      that.length = k;
      return that;
    },

    /**
     * Find the next sibling element
     *
     * ### example:
     * ```javascript
     * $('#id').next();
     * ```
     *
     * @returns {Selector} the next element
     */
    next: function() {
      var k = 0;
      var element;
      var that = new Selector();

      $.each(this, function(i, elem) {
        element = elem.nextElementSibling;
        if (element) {
          that[k] = element;
          k += 1;
        }
      });

      that.length = k;
      return that;
    },

    /**
     * Get the index of some element in sibling elements
     *
     * ### expample:
     * ```javascript
     * $('#id').index(); // return the current element index
     * $('.class').index(document.getElementById('id'));
     * $('.class').index($('#id'));
     * ```
     *
     * @param {Integer | Selector | DOMElement} element
     * @returns {Number} the index
     */
    index: function(element) {
      var ret = -1;

      $.each(this, function(i, elem) {
        var parent = this.parentNode;
        if (parent) {
          var nodes = parent.children;
          var len = nodes.length;
          for (var j = 0; j < len; j++) {
            if (element instanceof Selector) {
              element = element[0];
            }

            if (nodes[j] === (element === undefined ?
                elem : element)) {
              ret = j;
              return false;
            }
          }
        }
      });

      return ret;
    },

    /**
     * Callback traversal of dom elements
     *
     * @param {Function} callback
     * @returns {Selector} origin selector object
     */
    each: function(callback) {
      $.each(this, callback);
      return this;
    }
  };

  /**
   * DOM effect module.
   */
  var effects = {

    /**
     * Hide some element/s
     *
     * @returns {Selector} origin selector object
     */
    hide: function() {
      $.each(this, function(i, elem) {
        elem.style.display = 'none';
      });
      return this;
    },

    /**
     * Show some element/s
     *
     * @returns {Selector} origin selector object
     */
    show: function() {
      $.each(this, function(i, elem) {
        elem.style.display = 'block';
      });
      return this;
    },

    /**
     * Toggle some element/s
     *
     * @returns {Selector} origin selector object
     */
    toggle: function() {
      $.each(this, function(i, elem) {
        $.calCSS(elem, 'display') !== 'none' ?
          elem.style.display = 'none' : elem.style.display = 'block';
      });
      return this;
    }
  };

  /**
   * DOM style module.
   */
  var css = {

    /**
     * Set or get the css value of some attribute
     *
     * ### example:
     * ```javascript
     * $('#id').css('width', 100);
     * $('#id').css('height');
     * $('#id').css({
     *   'width': 100,
     *   'height': 100
     * });
     * ```
     *
     * @param {String | Object} attr
     * @param {String | undefined} val
     * @param {String} extra inner or outer
     * @returns {Selector} origin selector object
     */
    css: function(attr, val, extra) {
      if ($.type(attr) === 'object') {
        $.each(this, function(i, elem) {
          var key;
          var value;
          for (key in attr) {
            value = attr[key];
            elem.style[key] =
              (typeof value === 'number' && key !== 'zIndex' &&
                key !== 'opacity') ? value + 'px' : value;
          }
        });
        return this;
      } else if (val != null) {
        $.each(this, function(i, elem) {
          val = typeof val === 'number' ? val + 'px' : val;
          elem.style[attr] = val;
        });
        return this;
      } else {
        return this[0] ? $.calCSS(this[0], attr, extra) : '';
      }
    },

    /**
     * Get the width of element
     *
     * @param {String} w width
     * @returns {Selector} origin selector object
     */
    width: function(w) {
      if (w === undefined) {
        var elem = this[0];
        if (elem === window) {
          return window.innerWidth;
        } else if (elem === document) {
          return Math.max(document.body.offsetWidth,
            document.documentElement.offsetWidth);
        } else {
          return this[0] ? parseInt($.calCSS(this[0], 'width')) : 0;
        }
      } else {
        w = typeof w === 'number' ? w + 'px' : w;
        $.each(this, function(i, elem) {
          elem.style.width = w;
        });
        return this;
      }
    },

    /**
     * Get the height of element
     *
     * @param {String} h
     * @returns {Selector} origin selector object
     */
    height: function(h) {
      if (h === undefined) {
        var elem = this[0];
        if (elem === window) {
          return window.innerHeight;
        } else if (elem === document) {
          return Math.max(document.body.offsetHeight,
            document.documentElement.offsetHeight);
        } else {
          return this[0] ? parseInt($.calCSS(this[0], 'height')) : 0;
        }
      } else {
        h = typeof h === 'number' ? h + 'px' : h;
        $.each(this, function(i, elem) {
          elem.style.height = h;
        });
        return this;
      }
    }
  };

  /**
   * DOM manipulations module.
   */
  var dom = {

    /**
     * Set the inner html of selected element empty
     *
     * @returns {Selector} origin selector object
     */
    empty: function() {
      $.each(this, function(i, elem) {
        elem.innerHTML = '';
      });
      return this;
    },

    /**
     * Remove the selected element
     *
     * @returns {Selector} origin selector object
     */
    remove: function() {
      $.each(this, function(i, elem) {
        elem.parentNode.removeChild(elem);
      });
      return this;
    },

    /**
     * Insert some element before selected element
     *
     * ### example:
     * ```javascript
     * $('#id').before($('#id1'));
     * $('#id').before('<div>1</div>');
     * $('#id').before(document.createElement('p'));
     * ```
     *
     * @param {Selector | String | DOMElement} value
     * @returns {Selector} origin selector object
     */
    before: function(value) {
      if (value instanceof Selector) {
        $.each(this, function(i, elem) {
          for (var j = 0, len = value.length; j < len; j++) {
            var el = value[j];
            elem.parentNode.insertBefore(el, elem);
          }
        });
        return this;
      } else if (typeof value === 'string') {
        $.each(this, function(i, elem) {
          var frag = $.buildFragment(value);

          elem.parentNode.insertBefore(frag, elem);
        });
        return this;
      } else if (value.nodeType) {
        $.each(this, function(i, elem) {
          elem.parentNode.insertBefore(value, elem);
        });
        return this;
      } else {
        return this;
      }
    },

    /**
     * Insert some element after selected element
     *
     * ### example:
     * ```javascript
     * $('#id').after($('#id1'));
     * $('#id').after('<div>1</div>');
     * $('#id').after(document.createElement('p'));
     * ```
     *
     * @param {Selector | String | DOMElement} value
     * @returns {Selector} origin selector object
     */
    after: function(value) {
      if (value instanceof Selector) {
        $.each(this, function(i, elem) {
          for (var j = 0, len = value.length; j < len; j++) {
            var el = value[j];
            var parentNode = elem.parentNode;
            if (parentNode.lastElementChild === elem) {
              parentNode.appendChild(el);
            } else {
              parentNode.insertBefore(el, elem.nextSibling);
            }
          }
        });
        return this;
      } else if (typeof value === 'string') {
        $.each(this, function(i, elem) {
          var frag = $.buildFragment(value);

          var parentNode = elem.parentNode;
          if (parentNode.lastElementChild === elem) {
            parentNode.appendChild(frag);
          } else {
            parentNode.insertBefore(frag, elem.nextElementSibling);
          }
        });
        return this;
      } else if (value.nodeType) {
        $.each(this, function(i, elem) {
          var parentNode = elem.parentNode;
          if (parentNode.lastElementChild === elem) {
            parentNode.appendChild(value);
          } else {
            parentNode.insertBefore(value, elem.nextSibling);
          }
        });
        return this;
      } else {
        return this;
      }
    },

    /**
     * Append some element of selected element
     *
     * ### example:
     * ```javascript
     * $('#id').append($('#id1'));
     * $('#id').append('<div>1</div>');
     * $('#id').append(document.createElement('p'));
     * ```
     *
     * @param {Selector | String | DOMElement} value
     * @returns {Selector} origin selector object
     */
    append: function(value) {
      if (value instanceof Selector) {
        $.each(this, function(i, elem) {
          for (var j = 0, len = value.length; j < len; j++) {
            var el = value[j];
            elem.appendChild(el);
          }
        });
        return this;
      } else if (typeof value === 'string') {
        $.each(this, function(i, elem) {
          var frag = $.buildFragment(value);

          elem.appendChild(frag);
        });
        return this;
      } else if (value.nodeType) {
        $.each(this, function(i, elem) {
          elem.appendChild(value);
        });
        return this;
      } else {
        return this;
      }
    },

    /**
     * Append element to the certain element
     *
     * ### example:
     * ```javascript
     * $($('#id1')).appendTo('#id');
     * $('<div>1</div>').appendTo('#id');
     * $(document.createElement('p')).appendTo('#id');
     * ```
     *
     * @param {Selector | String | DOMElement} value
     * @returns {Selector} origin selector object
     */
    appendTo: function(value) {
      $(value).append(this);
      return this;
    },

    /**
     * Pre append element to the certain element
     *
     * ### example:
     * ```javascript
     * $($('#id1')).prepend('#id');
     * $('<div>1</div>').prepend('#id');
     * $(document.createElement('p')).prepend('#id');
     * ```
     *
     * @param {Selector | String | DOMElement} value
     * @returns {Selector} origin selector object
     */
    prepend: function(value) {
      $.each(this, function(i, elem) {
        var first = elem.firstElementChild;
        if (first) {
          $(first).before(value);
        } else {
          $(elem).append(value);
        }
      });
      return this;
    },

    /**
     * Convert Selector objects to Array
     *
     * ### example:
     * ```javascript
     * $('.class').toArray(); // return [dom1, dom2..]
     * ```
     *
     * @returns {Array} the dom array
     */
    toArray: function() {
      var ret = [];
      for (var i = 0, len = this.length; i < len; i++) {
        ret.push(this[i]);
      }
      return ret;
    },

    /**
     * Get the length of selected objects
     *
     * ### example:
     * ```javascript
     * $('.class').size(); // get 5
     * ```
     *
     * @returns {Number} the length
     */
    size: function() {
      return $(this).length;
    }
  };

  var filters = {

    /**
     * Check the element belong to some type
     *
     * ### example:
     * ```javascript
     * $('#id').is(':hidden');
     * $('#id').is(':visible');
     * $('#id').is('#id');
     * $('.class').is('.class');
     * $('a').is('a');
     * ```
     *
     * @param {String} selector
     * @returns {Boolean}
     */
    is: function(selector) {
      var ret;

      $.each(this, function(i, elem) {
        if (selector.match(':hidden')) {
          ret = $.calCSS(elem, 'display') === 'none';
        } else if (selector.match(':visible')) {
          ret = $.calCSS(elem, 'display') !== 'none';
        } else if (selector.match(rid)) {
          ret = elem.id === RegExp.$1;
        } else if (selector.match(rclass)) {
          ret = elem.className.match(RegExp.$1) !== null;
        } else if (selector.match(rtag)) {
          ret = elem.nodeName.toLowerCase() === selector;
        } else {
          ret = false;
        }
      });

      return ret;
    }
  };

  /**
   * DOM data module.
   */
  var data = {

    /**
     * Set or get the data of dom element
     *
     * ### example:
     * ```javascript
     * $('#id').data('attr', '1'); // set
     * $('#id').data('attr'); // get the data of attr
     * $('#id').data(); // get all data
     * ```
     *
     * @param {String | undefined} key
     * @param {String | undefined} value
     * @returns {Object | String | Selector}
     */
    data: function(key, value) {
      if (key === undefined && value === undefined) {
        var el = this[0];
        var i;
        var j;
        var ret = {};

        for (i in el) {
          if (i.match(rdata) !== null) {
            ret[RegExp.$1] = el[i];
          }
        }

        for (j in el.dataset) {
          ret[j] = el.dataset[j];
        }

        return ret;
      } else if (value === undefined) {
        return this[0][key + dataSuffix] ||
          (this[0].dataset && this[0].dataset[key]);
      } else {
        $.each(this, function(i, elem) {
          elem[key + dataSuffix] = value;
        });
        return this;
      }
    }
  };

  /**
   * Style module.
   */
  var styles = {

    /**
     * Compute the offset relative to the browser
     *
     * ### example:
     * ```javascript
     * $('#id').offset(); // return {left:100,top:100}
     * ```
     *
     * @returns {Object} object contains left and top key
     */
    offset: function() {
      var elem = this[0];
      var rect = {
        left: 0,
        top: 0
      };
      var clientRect = elem.getBoundingClientRect();

      if (clientRect != null) {
        rect = {
          left: clientRect.left,
          top: clientRect.top
        };
      }

      return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset
      };
    }
  };

  // Register modules to Selector.
  register(attributes);
  register(traverse);
  register(effects);
  register(css);
  register(dom);
  register(filters);
  register(data);
  register(styles);

  /**
   * Event module.
   */
  var events = {

    /**
     * Bind events to some element/s
     *
     * ### example:
     * ```javascript
     * $('#id').on('click', function(e){ alert(e) });
     * $('#id').on('click mousedown', function(e){ alert(e) });
     * $('#id').on('click mousedown', '#child', function(e){ alert(e) });
     * ```
     *
     * @param {String} ev eventList
     * @param {Function | String} selector
     * @param {Function | undefined} fn
     * @returns {Selector} origin selector object
     */
    on: function(ev, selector, fn) {

      $.each(this, function(i, elem) {
        var eventList = ev.split(' ');
        var j = 0;
        var eventLen = eventList.length;
        var eventsData = $(elem).data('events') || {};
        var eventHandle = function(e) {
          return $.event.dispatch.call(elem, e);
        };

        for (; j < eventLen; j++) {
          var event = $.eventSupportBubbles(eventList[j]);
          var handle;
          var isSelf;
          var sel;

          if (fn == null) {
            handle = selector;
            isSelf = true;
            sel = elem;
          } else {
            handle = fn;
            isSelf = false;
            sel = selector;
          }

          var eventObj = {
            elem: sel,
            handle: handle
          };

          if (eventsData[event] === undefined) {
            elem[event + eventSuffix] = handle;
            elem[event + selfSuffix] = isSelf;
            elem.addEventListener(event, eventHandle, false);

            eventsData[event] = [eventObj];
          } else {
            eventsData[event].push(eventObj);
          }

          $(elem).data('events', eventsData);
        }
      });

      return this;
    },

    /**
     * Trigger event
     *
     * ### example:
     * ```javascript
     * $('#id').on('click', function(){ alert(1) });
     * $('#id').trigger('click'); // alert 1
     * ```
     *
     * @param {String} event
     * @returns {Selector}
     */
    trigger: function(event) {
      var handle;
      var isSelf;
      var cur;
      $.each(this, function(i, elem) {
        cur = elem;
        for (; cur; cur = cur.parentNode) {
          handle = cur[event + eventSuffix];
          isSelf = cur[event + selfSuffix];

          if (isSelf === false && cur === elem) {
            break;
          } else if (handle) {
            event = $.event.fix(event);
            event.target = elem;
            handle.call(elem, event);
            break;
          }
        }

        elem['on' + event] = null;

        elem[event] && elem[event]();
      });

      return this;
    }
  };

  register(events);

  /**
   * Event constructor
   *
   * @param {String} src event type or Event Object.
   *   Support standard or custom events.
   * @returns {$.Event}
   * @constructor
   */
  $.Event = function(src) {
    if (!(this instanceof $.Event)) {
      return new $.Event(src);
    }

    if (src && src.type) {
      this.originalEvent = src;
      this.isDefaultPrevented = src.defaultPrevented ? returnTrue : returnFalse;
    } else {
      this.type = src;
    }
  };

  /**
   * Prototype functions of $.Event.
   * @this {$.Event}
   */
  $.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,

    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;

      if (e && e.preventDefault) {
        e.preventDefault();
      }
    },

    stopPropagation: function() {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;

      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
    }
  };

  $.event = {
    dispatch: function(e) {

      var elem = this;
      var eventsData = $(elem).data('events') || {};
      var target = e.target;
      var handlers;
      var eventObj;
      var handle;
      var related = e.relatedTarget;
      var i = 0;
      var len;
      var type = e.type;
      var selector;
      var findElList;
      var findElLen;
      var findEl;

      e = $.event.fix(e); // convert e to $.Event
      e.target = target;
      e.relatedTarget = related;

      handlers = eventsData[type];
      len = handlers.length;

      for (; i < len; i++) {
        eventObj = handlers[i];
        selector = eventObj.elem;
        handle = eventObj.handle;

        if (selector.nodeType || selector === window) {
          handle.call(elem, e);
        } else {
          findElList = $.getSelectorMatch(elem, selector);
          findElLen = findElList.length;

          for (var l = 0; l < findElLen; l++) {
            findEl = findElList[l];

            if (littleBubbleEvents.indexOf(type) === -1) {
              if (findEl.contains(target) && !e.isDefaultPrevented() &&
                  !e.isPropagationStopped()) {
                handle.call(findEl, e);
                break;
              }
            } else {
              if (findEl.contains(target)) {
                if (!related ||
                  (related !== findEl && !findEl.contains(related)) &&
                  !e.isDefaultPrevented() && !e.isPropagationStopped()) {
                  handle.call(findEl, e);
                  break;
                }
              }
            }
          }
        }
      }
    },

    fix: function(event) {
      var originalEvent = event;

      event = new $.Event(event);

      for (var prop in originalEvent) {
        if (prop.indexOf('webkit') !== -1) {
          continue;
        }
        if (typeof originalEvent[prop] === 'function') {
          event[prop] = originalEvent[prop].bind(originalEvent);
        } else {
          event[prop] = originalEvent[prop];
        }
      }

      return event;
    }
  };

  // Build-in events handle.
  buildInEvents.forEach(function(name) {
    Selector.prototype[name] = function(fn) {
      var args = arguments;
      $.each(this, function(i, elem) {
        return args.length > 0 ? $(elem).on(name, fn) : $(elem).trigger(name);
      });

      return this;
    };
  });

  // Hover and Delegate event.
  $.extend(Selector.prototype, {

    /**
     * Hover event
     *
     * @param {Function} fnOver
     * @param {Function} fnOut
     * @returns {Selector}
     */
    hover: function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },

    /**
     * Delegate event
     *
     * @deprecated
     * @returns {Selector}
     */
    delegate: function(selector, types, fn) {
      return this.on(types, selector, fn);
    }
  });

  /**
   * Help functions.
   */
  var tools = {

    /**
     * Tranverse function
     *
     * @param {Array | Object | Selector} obj
     * @param {Function} callback
     */
    each: function(obj, callback) {
      var i = 0;
      var value;
      var len = obj.length;
      var elem;

      if (obj instanceof Selector || $.type(obj) === 'array') {
        for (; i < len; i++) {
          elem = obj[i];
          value = callback.call(elem, i, elem);

          if (value === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          elem = obj[i];
          value = callback.call(elem, i, elem);

          if (value === false) {
            break;
          }
        }
      }
    },

    /**
     * Find element
     */
    getSelectorMatch: function(node, selector) {
      var element = [];
      if (typeof selector === 'string') {
        if (selector.match(rid)) {
          var idElem = document.getElementById(RegExp.$1);
          element = node.contains(idElem) ? [idElem] : [];
        } else if (selector.match(rclass)) {
          element = node.getElementsByClassName(RegExp.$1);
        } else if (selector.match(rtag)) {
          element = node.getElementsByTagName(RegExp.$1);
        } else {
          try {
            element = node.querySelectorAll(selector);
          } catch (e) {
            console.error('invalid selector:' + selector);
          }
        }
      } else {
        var matchs = $(selector);
        var match;

        for (var i = 0, len = matchs.length; i < len; i++) {
          match = matchs[i];
          if (node.contains(match)) {
            element.push(match);
          }
        }
      }

      return element;
    },

    matchSelector: function(node, selector) {
      if (selector.match(rid)) {
        return node.id === RegExp.$1;
      } else if (selector.match(rclass)) {
        return node.className.match(RegExp.$1) !== null;
      } else if (selector.match(rtag)) {
        return node.tagName === RegExp.$1.toUpperCase();
      } else {
        return false;
      }
    },

    parseHTML: function(html) {
      var ret = [];

      var temp = document.createElement('div');
      temp.innerHTML = html;
      for (var j = 0, len = temp.childNodes.length; j < len; j++) {
        ret.push(temp.childNodes[j].cloneNode(true));
      }

      return ret;
    },

    type: function(value) {
      return class2type[Object.prototype.toString.call(value)];
    },

    eventSupportBubbles: function(event) {
      if (event === 'mouseenter') {
        return 'mouseover';
      } else if (event === 'mouseleave') {
        return 'mouseout';
      } else {
        return event;
      }
    },

    noop: function() {},

    ready: function(callback) {
      document.addEventListener('DOMContentLoaded', callback, false);
    },

    calCSS: function(elem, prop, extra) {
      if (elem.nodeType === 1) {
        if (extra === 'inner') {
          return elem['client' + prop];
        }
        if (extra === 'outer') {
          return elem['offset' + prop];
        }

        var style = elem.style && elem.style[prop];
        return (style !== undefined && style !== '' && style !== 'auto' &&
            style !== 'initial' && style !== 'inherit') ? style :
          window.getComputedStyle(elem).getPropertyValue(prop);
      } else {
        return this;
      }
    },

    /**
     * Proxy function to certain context
     *
     * @param {Function} fn
     * @param {Object} context
     * @returns {Function} the binded function
     */
    proxy: function(fn, context) {
      if ($.type(fn) !== 'function') {
        return $.noop();
      }
      return fn.bind(context);
    },

    globalEval: function(data) {
      if (typeof data === 'string' && data.trim()) {
        window.eval.call(window, data);
      }
    },

    /**
     * Build document fragment
     *
     * @param {String} value html string
     * @returns {DocumentFragment}
     */
    buildFragment: function(value) {
      var frag = document.createDocumentFragment();
      var temp = document.createElement('div');
      var clone;
      temp.innerHTML = value;

      var childs = temp.childNodes;

      for (var i = 0, childsLen = childs.length; i < childsLen; i++) {
        clone = childs[i].cloneNode(true);
        frag.appendChild(clone);
      }

      var scripts = temp.getElementsByTagName('script');
      if (scripts.length > 0) {
        for (var j = 0, scriptsLen = scripts.length; j < scriptsLen; j++) {
          var script = scripts[j];
          var scriptContent = script.text || script.textContent;
          $.globalEval(scriptContent);
        }
      }

      return frag;
    },

    isPlainObject: function(obj) {
      if ($.type(obj) !== 'object') {
        return false;
      }

      if (obj.constructor &&
        !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
        return false;
      }

      return true;
    }
  };

  /**
   * Ajax module.
   */
  var ajaxs = {

    /**
     * Ajax function
     *
     * ### example:
     * ```javascript
     * $.ajax({
     *   url: '/api',
     *   type: 'POST',
     *   data: {a:1,b:2},
     *   success: function(data){
     *   },
     *   error: function(data){
     *   },
     *   complete: function(data){
     *   }
     * });
     * ```
     *
     * @param {Object} options
     * @see http://api.jquery.com/jquery.ajax/
     */
    ajax: function(options) {
      var formatParam = function(p) {
        var ret = [];
        for (var k in p) {
          var v = p[k];
          ret.push(k + '=' + v);
        }
        ret = ret.join('&');
        return ret;
      };

      var accepts = {
        script: 'text/javascript, application/javascript, ' +
          'application/x-javascript',
        json: 'application/json',
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain'
      };

      var url = options.url;
      var data = options.data || {};
      var type = options.type || 'GET';
      var dataType = options.dataType;
      var charset =  options.scriptCharset;
      var jsonpCallback = options.jsonpCallback || 'callback' + Date.now();
      var contentType = options.contentType ||
        'application/x-www-form-urlencoded; charset=UTF-8';
      var success = options.success || $.noop;
      var complete = options.complete || $.noop;
      var error = options.error || $.noop;

      if (dataType === 'jsonp') {
        data.callback = jsonpCallback;
      }

      data = formatParam(data);

      if (type === 'GET') {
        url += (url.indexOf('?') === -1 && data !== '' ? '?' + data : data);
      }

      if (dataType === 'jsonp') {
        var param = {
          url: url,
          jsonpCallback: jsonpCallback,
          success: success,
          error: error,
          complete: complete,
          charset: charset
        };
        $.JSONP(param);
        return;
      }

      var request = new XMLHttpRequest();
      dataType && request.overrideMimeType(accepts[dataType]);
      request.onload = function() {
        var text = request.responseText;
        if (request.getResponseHeader('Content-Type').match(/json/)) {
          try {
            text = JSON.parse(text);
          } catch (e) {}
        }
        success.call(null, text);
        complete.call(null, request);
      };
      request.onerror = function() {
        error.call(null, request.responseText);
        complete.call(null, request);
      };
      request.open(type, url, true);
      type === 'POST' && request.setRequestHeader('content-type', contentType);
      request.send(data);
    },

    JSONP: function(param) {
      var url = param.url;
      var jsonpCallback = param.jsonpCallback;
      var success = param.success;
      var complete = param.complete;
      var error = param.error;
      var charset = param.charset;

      charset = charset || 'utf-8';
      window[jsonpCallback] = success;

      var temp = document.createElement('script');
      temp.charset = charset;
      temp.src = url;
      temp.onload = function() {
        complete();
      };
      temp.onerror = error;
      document.body.appendChild(temp);
    }
  };

  // Hook tool functions to $.
  $.extend(tools);

  // Hook ajax functions to $.
  $.extend(ajaxs);

  $.each(['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight'],
      function(i, name) {
    if (name.match(/(inner|outer)(\w+)/)) {
      $.fn[name] = (function(prop, value, extra) {
        return function() {
          return $(this).css(prop, null, extra);
        };
      }(RegExp.$2, null, RegExp.$1));
    }
  });

  // Build-in objects handle.
  $.each(buildInObjs, function(i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });

  return $;
}));
