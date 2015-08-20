/*!
 * A DOM library. Impressed by jQuery and Zepto.
 * The APIs is subset of jQuery, if you know jQuery, you already know Nut.
 * @author Shengjie.Yu
 * @since 2015-01-22
 * Copyright 2014-2015 ucweb.
 * Released under the MIT license.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.$ = factory(root);
  }
}(this, function(window) {
  'use strict';

  var document = window.document;

  // Global variable.
  var nut = window.nut = {};

  nut.version = '0.0.2';

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
  var rdata = /(\w+)_data$/,
    rid = /^#(.+)/,
    rclass = /^\.(.+)/,
    rtag = /^([a-zA-Z]+)$/,
    rnoInnerhtml = /<(?:script|style|link)/i;

  // Suffixs.
  var eventSuffix = '_event',
    selfSuffix = '_self',
    dataSuffix = '_data';

  /**
   * Selector constructor.
   * @param {Object} selector.
   * @constructor
   */
  var Selector = function(selector) {
    if (!selector) {
      return this;
    }

    var element;
    if (typeof selector === 'string') {
      // html string
      if (selector[0] === '<' && selector[selector.length - 1] === '>' &&
          selector.length >= 3) {
        var arr = $.parseHTML(selector),
          i = 0,
          len = arr.length;

        for (; i < len; i++) {
          this[i] = arr[i];
        }
        this.length = len;
      } else { // id class tag and other
        var selectorList = selector.split(','),
          i = 0,
          listLen = selectorList.length,
          index = 0,
          j = 0,
          k = 0,
          thisLen = this.length || 0,
          elLen;

        for (; i < listLen; i++) {
          selector = selectorList[i].trim().split(/\s/);
          var deepLen = selector.length;
          if (deepLen === 1) {
            selector = selector[0];
            element = $.getSelectorMatch(document, selector);
          } else if(deepLen === 2) {
            var parentSel = selector[0],
              chileSel = selector[1],
              els = [],
              parentEls = $.getSelectorMatch(document, parentSel);

            for (var flen = parentEls.length; k < flen; k++) {
              var childrens = $.getSelectorMatch(parentEls[k], chileSel);
              for (var l = 0, clen = childrens.length; l < clen; l++) {
                els.push(childrens[l]);
              }
            }

            element = els;
          } else {
            console.error('selector too deep');
            element = [];
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
   * @param {String} selector: string selector. such as "#id",".class","tag".
   * @param {String} selector: html string. such as "<div></div>".
   * @param {HTMLElement} selector: html element. such as "document.body".
   * @param {Selector} selector: Selector instance. such as "$('#id')".
   * @param {Function} selector: an anonymous function. such as "function(){}".
   * @returns {Selector} return Selector instance.
   */
  var $ = function(selector) {
    return new Selector(selector);
  };

  $.fn = Selector.prototype;

  /**
   * Register a module.
   * @param {Object} module: a module of functions.
   */
  var register = function(module) {
    $.extend(Selector.prototype, module);
  };

  /**
   * Extend function.
   */
  $.extend = $.fn.extend = function() {
    var src, copyIsArray, copy, name, options, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    if (typeof target === "boolean") {
      deep = target;

      target = arguments[i] || {};
      i++;
    }

    if (typeof target !== "object" && $.type(target) !== 'function') {
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
              clone = src && $.type(src) == 'object' ? src : {};
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
    addClass: function(classList) {
      var className;
      $.each(this, function(i, elem) {
        if (typeof classList === 'string') {
          var classArr = classList.split(' ');
          for (var j = 0, len = classArr.length; j < len; j++) {
            className = classArr[j];
            !elem.classList.contains(className) && elem.classList.add(className);
          }
        }
      });

      return this;
    },

    removeClass: function(classList) {
      var className;
      $.each(this, function(i, elem) {
        if (typeof classList === 'string') {
          var classArr = classList.split(' ');
          for (var j = 0, len = classArr.length; j < len; j++) {
            className = classArr[j];
            elem.classList.contains(className) && elem.classList.remove(className);
          }
        } else if (classList === undefined) {
          elem.className = '';
        }
      });

      return this;
    },

    hasClass: function(className) {
      return this[0] ? this[0].classList.contains(className) : '';
    },

    toggleClass: function(className) {
      $.each(this, function(i, elem) {
        elem.classList.contains(className) ? elem.classList.remove(className) :
          elem.classList.add(className);
      });
      return this;
    },

    attr: function(attr, val) {
      if ($.type(attr) === 'object') {
        $.each(this, function(i, elem) {
          var key, value;
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

    removeAttr: function(attr) {
      $.each(this, function(i, elem) {
        elem.removeAttribute(attr);
      });
      return this;
    },

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
    find: function(selector) {
      var k = 0,
        that = new Selector();

      $.each(this, function(i, elem) {
        if (!selector) {
          return $();
        }

        var element = $.getSelectorMatch(elem, selector),
          len = element.length,
          j = 0;
        for (; j < len; j++) {
          that[k + j] = element[j];
        }
        k += len;
      });

      that.length = k;
      return that;
    },

    parent: function() {
      var k = 0,
        element,
        that = new Selector();

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

    children: function() {
      var k = 0,
        element,
        that = new Selector();

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

    closest: function(selector) {
      var k = 0,
        that = new Selector(),
        pos = typeof selector !== 'string' ? $(selector) : 0,
        cur;

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

    eq: function(index) {
      var that = new Selector(),
        len = this.length,
        ret = 0;

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

    get: function(index) {
      return $(this).eq(index)[0];
    },

    siblings: function() {
      var k = 0,
        that = new Selector();

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

    prev: function() {
      var k = 0,
        element,
        that = new Selector();

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

    next: function() {
      var k = 0,
        element,
        that = new Selector();

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

    each: function(callback) {
      $.each(this, callback);
      return this;
    }
  };

  /**
   * DOM effect module.
   */
  var effects = {
    hide: function() {
      $.each(this, function(i, elem) {
        elem.style.display = 'none';
      });
      return this;
    },

    show: function() {
      $.each(this, function(i, elem) {
        elem.style.display = 'block';
      });
      return this;
    },

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
    css: function(attr, val, extra) {
      if ($.type(attr) === 'object') {
        $.each(this, function(i, elem) {
          var key, value;
          for (key in attr) {
            value = attr[key];
            elem.style[key] =
              (typeof value === 'number' && key !== 'zIndex' && key !== 'opacity')
              ? value + 'px' : value;
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

    width: function(w) {
      if (w === undefined) {
        var elem = this[0];
        if (elem === window) {
          return window.innerWidth;
        } else if (elem === document) {
          return Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
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

    height: function(h) {
      if (h === undefined) {
        var elem = this[0];
        if (elem === window) {
          return window.innerHeight;
        } else if (elem === document) {
          return Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
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
    empty: function() {
      $.each(this, function(i, elem) {
        elem.innerHTML = '';
      });
      return this;
    },

    remove: function() {
      $.each(this, function(i, elem) {
        elem.parentNode.removeChild(elem);
      });
      return this;
    },

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

    appendTo: function(value) {
      $(value).append(this);
      return this;
    },

    prepend: function(value) {
      $.each(this, function(i, elem) {
        var first = elem.firstElementChild;
        if(first) {
          $(first).before(value);
        } else {
          $(elem).append(value);
        }
      });
      return this;
    },

    toArray: function() {
      var ret = [];
      for (var i = 0, len = this.length; i < len; i++) {
        ret.push(this[i]);
      }
      return ret;
    },

    size: function() {
      return $(this).length;
    }
  };

  var filters = {
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
    data: function(key, value) {
      if (key === undefined && value === undefined) {
        var el = this[0],
          i,
          j,
          ret = {};

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
    offset: function() {
      var elem = this[0];

      var rect = {
          left: 0,
          top: 0
        },
        clientRect = elem.getBoundingClientRect();

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
    on: function(ev, selector, fn) {

      $.each(this, function(i, elem) {
        var eventList = ev.split(' '),
          j = 0,
          eventLen = eventList.length,
          eventsData = $(elem).data('events') || {};

        for (; j < eventLen; j++) {
          var event = $.eventSupportBubbles(eventList[j]),
            handle, isSelf, sel, eventHandle;

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
            eventHandle = function(e) {
              return $.event.dispatch.call(elem, e);
            };

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

    trigger: function(event) {
      var handle,
        isSelf,
        cur;
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
   * @param {String} src: event type or Event Object. Support standard or custom events.
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

      var elem = this,
        eventsData = $(elem).data('events') || {},
        target = e.target,
        handlers, eventObj,
        handle, related = e.relatedTarget,
        i = 0,
        len, type = e.type,
        selector,
        findElList, findElLen, findEl;

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
              if (findEl.contains(target) && !e.isDefaultPrevented() && !e.isPropagationStopped()) {
                handle.call(findEl, e);
                break;
              }
            } else {
              if (findEl.contains(target)) {
                if (!related || (related !== findEl && !findEl.contains(related)) && !e.isDefaultPrevented() && !e.isPropagationStopped()) {
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
        if (typeof originalEvent[prop] === "function") {
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
    hover: function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
    delegate: function(selector, types, fn) {
      return this.on(types, selector, fn);
    }
  });

  /**
   * Help functions.
   */
  var tools = {
    each: function(obj, callback) {
      var i = 0,
        value,
        len = obj.length,
        elem;

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
        var matchs = $(selector),
          match;

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

    proxy: function(fn, context) {
      if ($.type(fn) !== 'function') {
        return null;
      }
      return fn.bind(context);
    },

    globalEval: function(data) {
      if (typeof data === 'string' && data.trim()) {
        window['eval'].call(window, data);
      }
    },

    buildFragment: function(value) {
      var frag = document.createDocumentFragment(),
        temp = document.createElement('div'),
        clone;
      temp.innerHTML = value;

      var childs = temp.childNodes;

      for (var i = 0, len = childs.length; i < len; i++) {
        clone = childs[i].cloneNode(true);
        frag.appendChild(clone);
      }

      var scripts = temp.getElementsByTagName('script');
      if (scripts.length > 0) {
        for (var j = 0, len = scripts.length; j < len; j++) {
          var script = scripts[j],
            scriptContent = script.text || script.textContent;
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
   * @param options
   */
  var ajaxs = {
    ajax: function (options) {
      var formatParam = function(p) {
        var ret = [];
        for(var k in p) {
          var v = p[k];
          ret.push(k + '=' + v);
        }
        ret = ret.join('&');
        return ret;
      };

      var accepts = {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: 'application/json',
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain'
      };

      var url = options.url,
        data = options.data || {},
        type = options.type || 'GET',
        dataType = options.dataType,
        charset =  options.scriptCharset,
        jsonpCallback = options.jsonpCallback || 'callback' + Date.now(),
        contentType = options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
        success = options.success || $.noop,
        complete = options.complete || $.noop,
        error = options.error || $.noop;

      if(dataType === 'jsonp') {
        data.callback = jsonpCallback;
      }

      data = formatParam(data);

      if(type === 'GET') {
        url += (url.indexOf('?') === -1 && data !== '' ? '?' + data : data);
      }

      if(dataType === 'jsonp') {
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
        success.call(null, request.responseText);
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
      var url = param.url,
        jsonpCallback = param.jsonpCallback,
        success = param.success,
        complete = param.complete,
        error = param.error,
        charset = param.charset;

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

  /**
   * Hook tool functions to $.
   */
  $.extend(tools);

  /**
   * Hook ajax functions to $.
   */
  $.extend(ajaxs);

  $.each(['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight'], function(i, name) {
    if (name.match(/(inner|outer)(\w+)/)) {
      $.fn[name] = function(prop, value, extra) {
        return function() {
          return $(this).css(prop, null, extra);
        };
      }(RegExp.$2, null, RegExp.$1);
    }
  });

  // Build-in objects handle.
  $.each(buildInObjs, function(i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });

  return $;
}));
