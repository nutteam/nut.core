

<!-- Start src/nut.core.js -->

# Nut.core.js
A DOM library. Impressed by jQuery and Zepto.
The APIs is subset of jQuery, if you know jQuery, you already know Nut.

Author: Shengjie.Yu

Version: 0.0.2

## $(selector)

$ singleton.

### Params:

* **String|DOMElement|Selector|Function** *selector* <br/> - html string. such as "#id",".class","tag".<br/>
- html string. such as "`<div></div>`".<br/>
- dom element. such as "document.body".<br/>
- Selector instance. such as "$('#id')".<br/>
- an anonymous function. such as "function(){}".<br/>

### Return:

* **Selector** return Selector instance.

## fn

Create Plugin

```javascript
$.fn.tab = function(config) {
  // balabala
};

$('.tab').tab();
```

## extend

Deep or shallow copy an object

### example:
```javascript
var base = { a : 1, b : { c : 1 } };
var obj = { a : 1, b : { c : 1, d : 2 } };
// shallow copy
var newObj = $.extend({}, base, obj); // base not changed
var newObj2 = $.extend(base, obj); // base changed
// deep copy
var newObj3 = $.extend(true, {}, base, obj); // base not changed
```

## attributes

DOM attribute module.

## addClass(classList)

Add class,or class list

### example:
```javascript
$('#id').addClass('myclass');
$('.class').addClass('myclass1 myclass2');
```

### Params:

* **String** *classList* class or classList

### Return:

* **Selector** origin selector object

## hasClass(className)

Dose has some class

### example:
```javascript
$('#id').hasClass('myclass');
```

### Params:

* **String** *className* 

### Return:

* **Boolean** 

## removeClass(classList)

Remove class,or class list

### example:
```javascript
$('#id').removeClass('myclass');
$('.class').removeClass('myclass1 myclass2');
$('.class').removeClass(); // remove all class
```

### Params:

* **String** *classList* 

### Return:

* **Selector** origin selector object

## toggleClass(className)

Toggle some class

### example:
```javascript
$('#id').toggleClass('myclass');
```

### Params:

* **String** *className* 

### Return:

* **Selector** origin selector object

## attr(attr, val)

Set or get attribute

### example:
```javascript
$('#id').attr('myattr', 'value'); // set
$('#id').attr('myattr'); // get
```

### Params:

* **String** *attr* 
* **String** *val* 

### Return:

* **Selector** origin selector object

## removeAttr(attr)

Delete attribute

### example:
```javascript
$('#id').removeAttr('myattr');
```

### Params:

* **String** *attr* 

### Return:

* **Selector** origin selector object

## val(val)

Set or get value of form elements

### example:
```javascript
$('input').val('1'); // set
$('input').val(); // get
```

### Params:

* **String** *val* 

### Return:

* **Selector** origin selector object

## text(text)

Set or get text content

### example:
```javascript
$('#id').text('mytext'); // set
$('.class').text(); // get
```

### Params:

* **String** *text* 

### Return:

* **Selector** origin selector object

## html(html)

Set or get inner html content

### example:
```javascript
$('#id').html('<i>html</i>'); // set
$('.class').html(); // get
```

### Params:

* **String** *html* 

### Return:

* **Selector** origin selector object

## traverse

DOM tranverse module.

## find(selector)

Find some child element

### example:
```javascript
$('#id').find('.class');
$('#id').find($('.class'));
$('#id').find(document.getElementById('id2'));
```

### Params:

* **String|Selector|DOMElement** *selector* 

### Return:

* **Selector** the finded elements

## parent()

Find parent element

### example:
```javascript
$('#id').parent();
```

### Return:

* **Selector** the parent element

## children()

Find children element

### example:
```javascript
$('#id').children();
```

### Return:

* **Selector** the children elements

## closest(selector)

Find closest parent element

### example:
```javascript
$('#id').closest('.class');
$('#id').closest($('.class'));
$('#id').closest(document.getElementById('id2'));
```

### Params:

* **String|Selector|DOMElement** *selector* 

### Return:

* **Selector** the closest parent element

## eq(index)

Find some sibling element or certain index

### example:
```javascript
$('.class').eq(2);
```

### Params:

* **Integer** *index* 

### Return:

* **Selector** the finded element

## get(index)

Find some sibling element or certain index,
different from eq is that get return native dom

### example:
```javascript
$('.class').get(2);
```

### Params:

* **Integer** *index* 

### Return:

* **DOMElement** the finded element

## siblings()

Find all the sibling elements

### example:
```javascript
$('#id').siblings();
```

### Return:

* **Selector** the sibling elements

## prev()

Find the prev sibling element

### example:
```javascript
$('#id').prev();
```

### Return:

* **Selector** the prev element

## next()

Find the next sibling element

### example:
```javascript
$('#id').next();
```

### Return:

* **Selector** the next element

## index(element)

Get the index of some element in sibling elements

### expample:
```javascript
$('#id').index(); // return the current element index
$('.class').index(document.getElementById('id'));
$('.class').index($('#id'));
```

### Params:

* **Integer|Selector|DOMElement** *element* 

### Return:

* **Number** the index

## each(callback)

Callback traversal of dom elements

### Params:

* **Function** *callback* 

### Return:

* **Selector** origin selector object

## effects

DOM effect module.

## hide()

Hide some element/s

### Return:

* **Selector** origin selector object

## show()

Show some element/s

### Return:

* **Selector** origin selector object

## toggle()

Toggle some element/s

### Return:

* **Selector** origin selector object

## css

DOM style module.

## css(attr, val, extra)

Set or get the css value of some attribute

### example:
```javascript
$('#id').css('width', 100);
$('#id').css('height');
$('#id').css({
  'width': 100,
  'height': 100
});
```

### Params:

* **String|Object** *attr* 
* **String** *val* 
* **String** *extra* inner or outer

### Return:

* **Selector** origin selector object

## width(w)

Get the width of element

### Params:

* **String** *w* width

### Return:

* **Selector** origin selector object

## height(h)

Get the height of element

### Params:

* **String** *h* 

### Return:

* **Selector** origin selector object

## dom

DOM manipulations module.

## empty()

Set the inner html of selected element empty

### Return:

* **Selector** origin selector object

## remove()

Remove the selected element

### Return:

* **Selector** origin selector object

## before(value)

Insert some element before selected element

### example:
```javascript
$('#id').before($('#id1'));
$('#id').before('<div>1</div>');
$('#id').before(document.createElement('p'));
```

### Params:

* **Selector|String|DOMElement** *value* 

### Return:

* **Selector** origin selector object

## after(value)

Insert some element after selected element

### example:
```javascript
$('#id').after($('#id1'));
$('#id').after('<div>1</div>');
$('#id').after(document.createElement('p'));
```

### Params:

* **Selector|String|DOMElement** *value* 

### Return:

* **Selector** origin selector object

## append(value)

Append some element of selected element

### example:
```javascript
$('#id').append($('#id1'));
$('#id').append('<div>1</div>');
$('#id').append(document.createElement('p'));
```

### Params:

* **Selector|String|DOMElement** *value* 

### Return:

* **Selector** origin selector object

## appendTo(value)

Append element to the certain element

### example:
```javascript
$($('#id1')).appendTo('#id');
$('<div>1</div>').appendTo('#id');
$(document.createElement('p')).appendTo('#id');
```

### Params:

* **Selector|String|DOMElement** *value* 

### Return:

* **Selector** origin selector object

## prepend(value)

Pre append element to the certain element

### example:
```javascript
$($('#id1')).prepend('#id');
$('<div>1</div>').prepend('#id');
$(document.createElement('p')).prepend('#id');
```

### Params:

* **Selector|String|DOMElement** *value* 

### Return:

* **Selector** origin selector object

## toArray()

Convert Selector objects to Array

### example:
```javascript
$('.class').toArray(); // return [dom1, dom2..]
```

### Return:

* **Array** the dom array

## size()

Get the length of selected objects

### example:
```javascript
$('.class').size(); // get 5
```

### Return:

* **Number** the length

## is(selector)

Check the element belong to some type

### example:
```javascript
$('#id').is(':hidden');
$('#id').is(':visible');
$('#id').is('#id');
$('.class').is('.class');
$('a').is('a');
```

### Params:

* **String** *selector* 

### Return:

* **Boolean** 

## data

DOM data module.

## data(key, value)

Set or get the data of dom element

### example:
```javascript
$('#id').data('attr', '1'); // set
$('#id').data('attr'); // get the data of attr
$('#id').data(); // get all data
```

### Params:

* **String** *key* 
* **String** *value* 

### Return:

* **Object|String|Selector** 

## styles

Style module.

## offset()

Compute the offset relative to the browser

### example:
```javascript
$('#id').offset(); // return {left:100,top:100}
```

### Return:

* **Object** object contains left and top key

## events

Event module.

## on(ev, selector, fn)

Bind events to some element/s

### example:
```javascript
$('#id').on('click', function(e){ alert(e) });
$('#id').on('click mousedown', function(e){ alert(e) });
$('#id').on('click mousedown', '#child', function(e){ alert(e) });
```

### Params:

* **String** *ev* eventList
* **Function|String** *selector* 
* **Function** *fn* 

### Return:

* **Selector** origin selector object

## trigger(event)

Trigger event

### example:
```javascript
$('#id').on('click', function(){ alert(1) });
$('#id').trigger('click'); // alert 1
```

### Params:

* **String** *event* 

### Return:

* **Selector** 

## Event

Event constructor

### Params:

* **String** *src* event type or Event Object.   Support standard or custom events.

### Return:

* **$.Event** 

## $.Event

Prototype functions of $.Event.

## hover(fnOver, fnOut)

Hover event

### Params:

* **Function** *fnOver* 
* **Function** *fnOut* 

### Return:

* **Selector** 

## delegate()

Delegate event

**Deprecated**

### Return:

* **Selector** 

## tools

Help functions.

## each(obj, callback)

Tranverse function

### Params:

* **Array|Object|Selector** *obj* 
* **Function** *callback* 

## getSelectorMatch()

Find element

## proxy(fn, context)

Proxy function to certain context

### Params:

* **Function** *fn* 
* **Object** *context* 

### Return:

* **Function** the binded function

## buildFragment(value)

Build document fragment

### Params:

* **String** *value* html string

### Return:

* **DocumentFragment** 

## ajaxs

Ajax module.

## ajax(options)

Ajax function

### example:
```javascript
$.ajax({
  url: '/api',
  type: 'POST',
  data: {a:1,b:2},
  success: function(data){
  },
  error: function(data){
  },
  complete: function(data){
  }
});
```

See: http://api.jquery.com/jquery.ajax/

### Params:

* **Object** *options* 

<!-- End src/nut.core.js -->

