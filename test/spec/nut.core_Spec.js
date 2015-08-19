describe('test selector', function() {

  it('id selector', function() {
    expect($('#id1').length).toEqual(1);
  });

  it('class selector', function() {
    expect($('.class1').length).toEqual(1);
  });

  it('tag selector', function() {
    expect($('.li').length).toEqual(3);
  });

  it('tranverse selector', function() {
    expect($('#jasmine ul').length).toEqual(1);
  });

  it('selector deep', function() {
    expect($('#jasmine ul li').length).toEqual(0);
  });

  it('none selector', function() {
    expect($('#jasmine1').length).toEqual(0);
  });

  it('create dom by string', function() {
    var str = '<div class="tech"></div>';
    expect($(str)).toEqual(jasmine.any(Object));
    expect($(str).length).toEqual(1);
  });

  it('create dom by DOMElement', function() {
    var dom = document.createElement('div');
    expect($(dom)).toEqual(jasmine.any(Object));
    expect($(dom).length).toEqual(1);
  });

  it('create domReady function', function() {
    var ready = function() {
      console.log('dom ready');
    };
    expect($(ready)).toEqual(jasmine.any(Object));
    expect($(ready).length).toBeUndefined();
  });

});

describe('test extend', function() {

  it('simple copy', function() {
    var base = {
      a: 1,
      b: [1, 2, 3],
      c: {
        x: 1,
        y: 2
      },
      d: 'dd'
    };

    var obj = {
      a: 1,
      b: [4],
      c: {
        z: 1
      }
    };

    expect($.extend({}, base, obj)).toEqual(jasmine.any(Object));
    expect($.extend({}, base, obj).d).toEqual('dd');
    expect($.extend({}, base, obj).b).not.toEqual(jasmine.arrayContaining([2]));
    expect($.extend({}, base, obj).b).toEqual(jasmine.arrayContaining([4]));
    expect($.extend({}, base, obj).c).toEqual(jasmine.any(Object));
    expect($.extend({}, base, obj).c.x).toBeUndefined();
    expect($.extend({}, base, obj).c.z).toEqual(1);
    expect(base.b).toEqual(jasmine.arrayContaining([1]));
    expect(base.b).not.toEqual(jasmine.arrayContaining([4]));
    expect($.extend(base, obj).c.x).toBeUndefined();
    expect($.extend(base, obj).c.z).toEqual(1);
    expect(base.b).not.toEqual(jasmine.arrayContaining([1]));
    expect(base.b).not.toEqual(jasmine.arrayContaining([2]));
  });

  it('deep copy', function() {
    var base = {
      a: 1,
      b: [1, 2, 3],
      c: {
        x: 1,
        y: 2
      },
      d: 'dd'
    };

    var obj = {
      a: 1,
      b: [4],
      c: {
        z: 1
      }
    };

    expect($.extend(true, {}, base, obj)).toEqual(jasmine.any(Object));
    expect($.extend(true, {}, base, obj).b).toEqual(jasmine.arrayContaining([2]));
    expect($.extend(true, {}, base, obj).b).toEqual(jasmine.arrayContaining([4]));
    expect($.extend(true, {}, base, obj).c).toEqual(jasmine.any(Object));
    expect($.extend(true, {}, base, obj).c.x).toEqual(1);
    expect($.extend(true, {}, base, obj).c.z).toEqual(1);
    expect(base.b).toEqual(jasmine.arrayContaining([1]));
    expect(base.b).not.toEqual(jasmine.arrayContaining([4]));
    expect($.extend(true, base, obj).c.x).toEqual(1);
    expect($.extend(true, base, obj).c.z).toEqual(1);
    expect(base.b).not.toEqual(jasmine.arrayContaining([1]));
    expect(base.b).toEqual(jasmine.arrayContaining([2]));
  });

});

describe('test attributes', function() {

  it('addClass', function() {
    var $el = $('#attributes');
    $el[0].className = '';
    expect($el.addClass('class1')[0].className.match(/class1/)).not.toBeNull();
    expect($el.addClass('class1 class2')[0].className.match(/class1/)).not.toBeNull();
    expect($el.addClass('class1 class2')[0].className.match(/class2/)).not.toBeNull();
  });

  it('removeClass', function() {
    var $el = $('#attributes');
    $el[0].className = '';
    $el.addClass('class1 class2');
    expect($el.removeClass('class1')[0].className.match(/class1/)).toBeNull();
    expect($el.removeClass('class2')[0].className.match(/class1/)).toBeNull();
    $el.addClass('class1 class2');
    expect($el.removeClass('class1 class2')[0].className.match(/class2/)).toBeNull();
  });

  it('hasClass', function() {
    var $el = $('#attributes');
    $el[0].className = '';
    expect($el.hasClass('class1')).toEqual(false);
    $el.addClass('class1');
    expect($el.hasClass('class1')).toEqual(true);
  });

  it('toggleClass', function() {
    var $el = $('#attributes');
    $el[0].className = '';
    $el.toggleClass('class1');
    expect($el.hasClass('class1')).toEqual(true);
  });

  it('attr', function() {
    var $el = $('#attributes');
    $el.attr('myattr', 'yes');
    expect($el.attr('myattr')).toEqual('yes');
    $el.attr({
      'myattr1': 'yes',
      'myattr2': 'no'
    });
    expect($el.attr('myattr2')).toEqual('no');
  });

  it('removeAttr', function() {
    var $el = $('#attributes');
    $el.attr('myattr', 'yes');
    $el.removeAttr('myattr');
    expect($el.attr('myattr')).toBeNull();
  });

  it('val', function() {
    var $input = $('#input');
    $input.val('hello');
    expect($input.val()).toEqual('hello');
  });

  it('text', function() {
    var $text = $('#text');
    $text.text('hello');
    expect($text.text()).toEqual('hello');
  });

  it('html', function() {
    var $html = $('#text');
    $html.html('<i>a</i>');
    expect($html.html()).toEqual(jasmine.stringMatching(/<i>/));
    $html.html('');

    var frag = document.createDocumentFragment();
    var i = document.createElement('i');
    frag.appendChild(i);
    $html.html(frag);
    expect($html.html()).toEqual(jasmine.stringMatching(/<i>/));
    $html.html('');

    i = $('<i>a</i>');
    $html.html(i);
    expect($html.html()).toEqual(jasmine.stringMatching(/<i>/));
  });

});


describe('test traverse', function() {

  it('find', function() {
    expect($('#traverse').find('#level3').length).toEqual(1);
    expect($('#traverse').find('.level4').length).toEqual(1);
    expect($('#traverse').find('i').length).toEqual(1);
    var level4 = document.getElementsByClassName('level4')[0];
    expect($('#traverse').find(level4).length).toEqual(1);
    expect($('#traverse').find($('.level4')).length).toEqual(1);
  });

  it('parent', function() {
    expect($('.level4').parent()).toEqual(jasmine.any(Object));
    expect($('.level4').parent().attr('id')).toEqual('level3');
  });

  it('children', function() {
    expect($('#level3').children().length).toEqual(5);
  });

  it('closest', function() {
    expect($('.level4').closest('#level2').length).toEqual(1);
    expect($('.level4').closest('div').length).toEqual(1);
    expect($('.level4').closest($('#level1')).length).toEqual(1);
    var level1 = document.getElementById('level1');
    expect($('.level4').closest(level1).length).toEqual(1);
  });

  it('eq', function() {
    expect($('.eq').eq()).toEqual(jasmine.any(Object));
    expect($('.eq').eq(1).length).toEqual(1);
  });

  it('index', function() {
    expect($('.eq').get(1)).toEqual(jasmine.any(Object));
    expect($('.eq').get(1) instanceof HTMLElement).toEqual(true);
  });

  it('siblings', function() {
    expect($('#traverse').find('i').siblings().length).toEqual(4);
  });

  it('prev', function() {
    expect($('#traverse').find('i').prev().length).toEqual(1);
    expect($('#traverse').find('i').prev().hasClass('level4')).toEqual(true);
  });

  it('next', function() {
    expect($('#traverse').find('i').next().length).toEqual(1);
    expect($('#traverse').find('i').next().hasClass('eq')).toEqual(true);
  });

  it('index', function() {
    expect($('#traverse').find('i').index()).toEqual(1);
    expect($('#traverse').find('i').index($('.level4'))).toEqual(0);
  });

  it('each', function() {
    expect($('.eq').each(function() {})).toEqual(jasmine.any(Object));
    expect($('.eq').each(function() {}).length).toEqual(3);
  });

});

describe('test effects', function() {

  it('hide', function() {
    $('#effects').hide();
    expect($('#effects')[0].offsetParent).toEqual(null);
  });

  it('show', function() {
    $('#effects').show();
    expect(window.getComputedStyle($('#effects')[0]).getPropertyValue('display'))
      .toEqual('block');
  });

  it('toggle', function() {
    $('#effects').hide();
    $('#effects').toggle();
    expect(window.getComputedStyle($('#effects')[0]).getPropertyValue('display'))
      .toEqual('block');
  });

});


describe('test css', function() {

  it('css', function() {
    $('#css').css('width', 100);
    expect($('#css')[0].style.width).toEqual('100px');
    $('#css').css({
      'width': 200,
      'height': 100,
      'opacity': 0.4
    });
    expect($('#css')[0].style.width).toEqual('200px');
    expect($('#css')[0].style.height).toEqual('100px');
    expect($('#css')[0].style.opacity).toEqual('0.4');
    expect($('#css').css('height')).toEqual('100px');
  });

  it('width', function() {
    $('#css').width(400);
    expect($('#css').width()).toEqual(400);
  });

  it('height', function() {
    $('#css').height(300);
    expect($('#css').height()).toEqual(300);
  });

});

describe('test events', function() {

  it('on', function() {
    var handler = jasmine.createSpy('callback');
    $('#on').on('click', handler);
    $('#on')[0]['click']();
    expect(handler).toHaveBeenCalled();
    var handler2 = jasmine.createSpy('callback');
    $('#on').on('click', handler2);
    $('#on_level3')[0]['click']();
    expect(handler2).toHaveBeenCalled();
    var handler3 = jasmine.createSpy('callback');
    $('#on').on('click', '#on_level2', handler3);
    $('#on_level2')[0]['click']();
    expect(handler3).toHaveBeenCalled();
  });

  it('trigger', function() {
    var handler = jasmine.createSpy('callback');
    $('#trigger').on('click', handler);
    $('#trigger').trigger('click');
    expect(handler).toHaveBeenCalled();
    var handler2 = jasmine.createSpy('callback');
    $('#trigger').on('keyup', handler2);
    $('#trigger').trigger('keyup');
    expect(handler2).toHaveBeenCalled();
  });

});

describe('test dom', function() {

  it('empty', function() {
    $('#empty').empty();
    expect($('#empty').html()).toEqual('');
  });

  it('remove', function() {
    $('#remove').remove();
    expect($('#remove').length).not.toEqual(1);
  });

  it('before', function() {
    $('#before').before('<i></i>');
    expect($('#before').prev()[0].tagName).toEqual('I');
    expect($('#before').prev().prev()[0].tagName).not.toEqual('I');
    $('#before').before(document.createElement('span'));
    expect($('#before').prev()[0].tagName).toEqual('SPAN');
    $('#before').before($('<em></em>'));
    expect($('#before').prev()[0].tagName).toEqual('EM');
  });

  it('after', function() {
    $('#after').after('<i></i>');
    expect($('#after').next()[0].tagName).toEqual('I');
    expect($('#after').next().next()[0].tagName).not.toEqual('I');
    $('#after').after(document.createElement('span'));
    expect($('#after').next()[0].tagName).toEqual('SPAN');
    $('#after').after($('<em></em>'));
    expect($('#after').next()[0].tagName).toEqual('EM');
  });

  it('append', function() {
    $('#append').append('<i></i>');
    expect($('#append').find('i').length).toEqual(1);
    $('#append').append($('<em></em>'));
    expect($('#append').find('em').length).toEqual(1);
    $('#append').append(document.createElement('div'));
    expect($('#append').find('div').length).toEqual(1);
  });

  it('appendTo', function() {
    $('<h1>dd</h1>').appendTo('#append');
    expect($('#append').find('h1').length).toEqual(1);
  });

  it('prepend', function() {
    $('#prepend').prepend('<h1>dd</h1>');
    expect($('#prepend').find('h1').length).toEqual(1);
    $('#prepend').prepend('<h2>dd</h2>');
    expect($('#prepend').find('h2').index()).toEqual(0);
  });

  it('toArray', function() {
    expect($('.toarray').toArray() instanceof Array).toEqual(true);
    expect($('.toarray').toArray().length).toEqual(3);
  });

  it('size', function() {
    expect($('.toarray').size()).toEqual(3);
  });

});

describe('test filters', function() {

  it('is', function() {
    expect($('#filter').find('#hidden').is(':hidden')).toEqual(true);
    expect($('#filter').find('#show').is(':visible')).toEqual(true);
    expect($('#filter').find('#show').is('#show')).toEqual(true);
    expect($('#filter').find('#show').is('div')).toEqual(true);
  });

  it('data', function() {
    $('#data').data('data1', 1);
    expect($('#data').data('data1')).toEqual(1);
  });

  it('offset', function() {
    expect($('#styles').offset().top).toEqual(0);
    expect($('.title').offset().top).not.toEqual(0);
    expect($('.title').offset().left).not.toEqual(0);
  });

});

describe('test tools', function() {

  it('each', function() {
    var handler = jasmine.createSpy('callback');
    $.each([1, 2, 3], handler);
    expect(handler).toHaveBeenCalledWith(jasmine.any(Number), jasmine.any(Number));
    var handler2 = jasmine.createSpy('callback');
    $.each($('.eq'), handler2);
    expect(handler2).toHaveBeenCalledWith(jasmine.any(Number), jasmine.any(Object));
    var handler3 = jasmine.createSpy('callback');
    $.each({
      a: 1,
      b: 2
    }, handler3);
    expect(handler3).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Number));
  });


  it('getSelectorMatch', function() {
    var node = document.getElementById('traverse');
    var child = document.getElementById('level1');
    expect($.getSelectorMatch(node, 'i').length).toEqual(1);
    expect($.getSelectorMatch(node, '.eq').length).toEqual(3);
    expect($.getSelectorMatch(node, '#level2').length).toEqual(1);
    expect($.getSelectorMatch(node, 'span.eq').length).toEqual(3);
    expect($.getSelectorMatch(node, 'ss').length).toEqual(0);


    expect($.getSelectorMatch(node, child).length).toEqual(1);
    expect($.getSelectorMatch(node, $(child)).length).toEqual(1);
  });

  it('matchSelector', function() {
    var node = document.getElementById('traverse');
    expect($.matchSelector(node, '#traverse')).toEqual(true);
  });

  it('parseHTML', function() {
    expect($.parseHTML('<div></div>').length).toEqual(1);
    expect($.parseHTML('<div><i></i></div><div><i></i></div>').length).toEqual(2);
  });

  it('type', function() {
    expect($.type('str')).toEqual('string');
    expect($.type(/s/)).toEqual('regexp');
    expect($.type(1)).toEqual('number');
    expect($.type([])).toEqual('array');
    expect($.type(function() {})).toEqual('function');
  });

  it('calCSS', function() {
    var node = document.getElementById('traverse');
    expect($.calCSS(node, 'innerWidth')).not.toEqual(0);
    expect($.calCSS(node, 'outerWidth')).not.toEqual(0);
    expect($.calCSS(node, 'width')).not.toEqual(0);
    expect($.calCSS(node, 'top')).toEqual('auto');
  });

  it('proxy', function() {
    var a = {
      x: 100,
      handler: function() {
        return this.x;
      }
    };
    var b = {
      x: 200
    };
    expect($.proxy(a.handler, b)()).toEqual(200);
  });

  it('buildFragment', function() {
    expect($.buildFragment('<i>ddd</i><i>ddd</i>') instanceof DocumentFragment).toEqual(true);
    expect($.buildFragment('<i>ddd</i><i>ddd</i>').childNodes.length).toEqual(2);
  });

  it('isPlainObject', function() {
    expect($.isPlainObject({})).toEqual(true);
    expect($.isPlainObject(new Object)).toEqual(true);
  });

});


describe('test ajax', function() {

  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('ajax', function() {
    var doneFn = jasmine.createSpy("success");

    $.ajax({
      url: "/some/cool/url",
      type: 'GET',
      data: {
        x:1,
        y:2
      },
      success: doneFn
    });

    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/cool/url?x=1&y=2');
    expect(doneFn).not.toHaveBeenCalled();

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": 'text/plain',
      "responseText": 'awesome response'
    });

    expect(doneFn).toHaveBeenCalledWith('awesome response');
  });

});
