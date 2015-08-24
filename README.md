

<!-- Start src/nut.core.js -->

A DOM library. Impressed by jQuery and Zepto.
The APIs is subset of jQuery, if you know jQuery, you already know Nut.

Author: Shengjie.Yu

Version: 0.0.2

## $(selector)

$ singleton.

### Params:

* **String|Object|Function** *selector* html string. such as "#id",".class","tag".
html string. such as "<div></div>".
html element. such as "document.body".
Selector instance. such as "$('#id')".
an anonymous function. such as "function(){}".

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

* **Selector** 

## parent()

Find parent element

### example:
```javascript
$('#id').parent();
```

### Return:

* **Selector** 

## children()

Find children element

### example:
```javascript
$('#id').children();
```

### Return:

* **Selector** 

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

* **Selector** 

## eq(index)

Find some sibling element or certain index

### example:
```javascript
$('.class').eq(2);
```

### Params:

* **Integer** *index* 

### Return:

* **Selector** 

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

* **DOMElement** 

## siblings()

Find all the sibling elements

### example:
```javascript
$('#id').siblings();
```

### Return:

* **Selector** 

## prev()

Find the prev sibling element

### example:
```javascript
$('#id').prev();
```

### Return:

* **Selector** 

## next()

Find the next sibling element

### example:
```javascript
$('#id').next();
```

### Return:

* **Selector** 

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

* **Number** 

## each(callback)

Callback traversal of dom elements

### Params:

* **Function** *callback* 

### Return:

* **traverse** 

## effects

DOM effect module.

## css

DOM style module.

## dom

DOM manipulations module.

## data

DOM data module.

## styles

Style module.

## events

Event module.

## Event

Event constructor

### Params:

* **String** *src* event type or Event Object.   Support standard or custom events.

### Return:

* **$.Event** 

## $.Event

Prototype functions of $.Event.

## tools

Help functions.

## getSelectorMatch()

Find element

## ajaxs

Ajax module.

### Params:

* **** *options* 

Hook tool functions to $.

Hook ajax functions to $.

<!-- End src/nut.core.js -->

