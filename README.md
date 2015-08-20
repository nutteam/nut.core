# Nut API文档
> 所含接口是jQuery的常用子集。主要包括：DOM,Event,Ajax

-------

## DOM-attributes

### addClass `.addClass(classList)`
DOM增加class,或class list
* param classList {String}
```javascript
$('#id').addClass('myclass');
$('.class').addClass('myclass1 myclass2');
```
### removeClass `.removeClass(classList)`
DOM删除class,或class list
* param classList {String || undefined}
```javascript
$('#id').removeClass('myclass');
$('.class').removeClass('myclass1 myclass2');
$('.class').removeClass(); // 删除所有class
```
### hasClass `.hasClass(className)`
判断DOM是否含有某个class
* param className {String}
```javascript
$('#id').hasClass('myclass');
```
### toggleClass `.toggleClass(className)`
DOM切换某个class，有则删，无则加
* param className {String}
```javascript
$('#id').toggleClass('myclass');
```
### attr `.attr(attr, val)`
DOM设置属性，或读取属性
* param attr {String}
* param val {String || undefined}
```javascript
$('#id').attr('myattr', 'value'); // 设置
$('#id').attr('myattr'); // 读取
```
### removeAttr `.removeAttr(attr)`
DOM删除属性
* param attr {String}
```javascript
$('#id').removeAttr('myattr');
```
### val `.val(val)`
表单标签设置值或取值
* param val {String || undefined}
```javascript
$('input').val('1'); // 设置
$('input').val(); // 读取
```
### text `.text(text)`
DOM设置文本或读文本
* param text {String || undefined}
```javascript
$('#id').text('mytext'); // 设置
$('.class').text(); // 取值
```
### html `.html(html)`
DOM设置html或读html
* param html {String || undefined}
```javascript
$('#id').html('<i>html</i>'); // 设置
$('.class').html(); // 取值
```

## DOM-traverse

### find
### parent
### children
### closest
### eq
### get
### siblings
### prev
### next
### index
### each

## DOM-effect

### hide
### show
### toggle

## DOM-css

### css
### width
### height

## DOM-dom

### empty
### remove
### before
### after
### append
### appendTo
### prepend
### toArray
### size

## DOM-filters

### is

## DOM-data

### data

## DOM-styles

### offset

## Event

### on
### trigger

## Ajax
### ajax

## CHANGELOG
* 0.0.1 支持UC浏览器PC版新标签页
* 0.0.2 支持m.uc123.com，[UMD](https://github.com/umdjs/umd)

## 谁在用:
[UC浏览器PC版](http://pc.uc.cn/)

[m.uc123.com](http://m.uc123.com/)
