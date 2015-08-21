

<!-- Start src/nut.core.js -->

A DOM library. Impressed by jQuery and Zepto.
The APIs is subset of jQuery, if you know jQuery, you already know Nut.

Author: Shengjie.Yu

Version: 0.0.2

## $(selector)

$ singleton.

### Params:

* **String|Object|Function** *selector* such as "#id",".class","tag".
html string. such as "<div></div>".
html element. such as "document.body".
Selector instance. such as "$('#id')".
an anonymous function. such as "function(){}".

### Return:

* **Selector** return Selector instance.

## fn

Create plugin

### Return:

* **** plugin

## extend

deep or shallow copy an object

## attributes

DOM attribute module.

## addClass(classList)

DOM增加class,或class list

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

判断DOM是否含有某个class

### example:
```javascript
$('#id').hasClass('myclass');
```

### Params:

* **String** *className* 

### Return:

* **Boolean** 

## removeClass(classList)

DOM删除class,或class list

### example:
```javascript
$('#id').removeClass('myclass');
$('.class').removeClass('myclass1 myclass2');
$('.class').removeClass(); // 删除所有class
```

### Params:

* **String** *classList* 

### Return:

* **Selector** origin selector object

## toggleClass(className)

DOM切换某个class，有则删，无则加

### example:
```javascript
$('#id').toggleClass('myclass');
```

### Params:

* **String** *className* 

### Return:

* **Selector** origin selector object

## attr(attr, val)

DOM设置属性，或读取属性

### example:
```javascript
$('#id').attr('myattr', 'value'); // 设置
$('#id').attr('myattr'); // 读取
```

### Params:

* **String** *attr* 
* **String** *val* 

### Return:

* **Selector** origin selector object

## removeAttr(attr)

DOM删除属性

### example:
```javascript
$('#id').removeAttr('myattr');
```

### Params:

* **String** *attr* 

### Return:

* **Selector** origin selector object

## val(val)

表单标签设置值或取值

### example:
```javascript
$('input').val('1'); // 设置
$('input').val(); // 读取
```

### Params:

* **String** *val* 

### Return:

* **Selector** origin selector object

## text(text)

DOM设置文本或读文本

### example:
```javascript
$('#id').text('mytext'); // 设置
$('.class').text(); // 取值
```

### Params:

* **String** *text* 

### Return:

* **Selector** origin selector object

## html(html)

DOM设置html或读html

### example:
```javascript
$('#id').html('<i>html</i>'); // 设置
$('.class').html(); // 取值
```

### Params:

* **String** *html* 

### Return:

* **Selector** origin selector object

## traverse

DOM tranverse module.

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

