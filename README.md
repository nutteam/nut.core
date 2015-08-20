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

### find `.find(selector)`
查找元素
* param selector {String || Selector || DOMElement}
```javascript
$('#id').find('.class');
$('#id').find($('.class'));
$('#id').find(document.getElementById('id2'));
```
### parent `.parent()`
查找父元素
* param {undefined}
```javascript
$('#id').parent();
```
### children `.children()`
查找子元素
* param {undefined}
```javascript
$('#id').children();
```
### closest `.closest(selector)`
查找最近的父元素
* param selector {String || Selector || DOMElement}
```javascript
$('#id').closest('.class');
$('#id').closest($('.class'));
$('#id').closest(document.getElementById('id2'));
```
### eq `.eq(index)`
查找同级某个索引值的元素
* param index {Integer}
```javascript
$('.class').eq(2); // 返回同级的第三个Selector元素
```
### get `.get(index)`
查找同级某个索引值的元素，与eq的差异是get返回的是原生DOMElement
* param index {Integer}
```javascript
$('.class').get(2); // 返回同级的第三个DOMElement元素
```
### siblings `.siblings()`
查找所有兄弟节点
* param {undefined}
```javascript
$('#id').siblings();
```
### prev `.prev()`
查找上一个兄弟节点
* param {undefined}
```javascript
$('#id').prev();
```
### next `.next()`
查找下一个兄弟节点
* param {undefined}
```javascript
$('#id').next();
```
### index `.index(element)`
查找节点在同级节点中的索引
* param selector {Integer || Selector || DOMElement}
```javascript
$('#id').index(); // 返回当前节点的索引
$('.class').index(document.getElementById('id'));
$('.class').index($('#id'));
```
### each `.each(callback)`
对节点集合进行遍历
* param callback {Function}
```javascript
$('.class').each(function(i, elem){
  console.log(i); // 索引
  console.log(elem); // 元素
});
```
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
