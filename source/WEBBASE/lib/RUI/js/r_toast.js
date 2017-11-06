//plugin: r_toast
;(function ( $, window, document, undefined ) {  
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    // Create the defaults once     
    var pgn = 'r_toast',  
        defaults = {  
            backgroundColor: 'black', 
            color: 'white',
            borderWidth: '2px',
            borderColor: 'white',
            position: 'top', //  top | bottom
            timeout: 1500,
            offset: 20,  //偏移量
            gap: 100,  //最終位置(不包含偏移量)
        } ;
    
    var _private = {} ;
    
    _private.tpl = {
        tpl_1: '<div class="r_toast_wrapper"><div class="r_toast_content">{1}</div></div>',
    } ;
    
    _private.options = {
        animateOnTime: 200,  //啟動動畫時間
        animateOffTime: 100,  //關閉動畫時間
    } ;
    
    _private.get_wrapper_css_obj = function() {
        var wrapper_css_obj = {} ;
        
        if (_private.options.position == 'top') {
            wrapper_css_obj['top'] = '0px' ;
        } 
        
        
        if (_private.options.position == 'bottom') {
            wrapper_css_obj['bottom'] = '0px' ;
        } 
        
        return wrapper_css_obj ;
    }
    
    _private.get_content_css_obj = function() {
        var content_css_obj = {} ;
        
        if (_private.options.position == 'top') {
            content_css_obj['top'] = _private.options.gap+'px' ;
        }
        
        if (_private.options.position == 'bottom') {
            content_css_obj['top'] = '-'+_private.options.gap+'px' ;
        }
        
        content_css_obj['color'] = _private.options.color ;
        content_css_obj['backgroundColor'] = _private.options.backgroundColor ;
        content_css_obj['border'] = _private.options.borderWidth+' solid '+_private.options.borderColor ;
        
        return content_css_obj ;
    }

    _private.appendToBody = function(options) {
        $('.r_toast_wrapper').remove() ;
        
        clearInterval($[pgn].timeout) ;
        $[pgn].timeout = '' ;
        
        _private.hero
            .hide()
            .css(options.wrapper_css_obj)
                .find('.r_toast_content')
                .css(options.content_css_obj)
            .end()
            .appendTo('body').show() ;
    }
    
    _private.appendToBody_animate = function() {
        
        var animate_obj = (_private.options.position == 'top')? {top: "+="+_private.options.offset} : {bottom: "+="+_private.options.offset}
        
        _private.hero
            .animate(animate_obj, _private.options.animateOnTime) ;
    }
    
    _private.appendToBody_timeout_animate = function() {

        $[pgn].timeout = setTimeout(function() {
            
            var animate_obj = (_private.options.position == 'top')? {top: "-="+_private.options.offset} : {bottom: "-="+_private.options.offset}
            
            _private.hero
                .animate(animate_obj, _private.options.animateOffTime, function() {
                    
                    _private.hero.remove() ;

                }) ;
                
        }, _private.options.timeout) ;

    }
    
    $[pgn] = function(options) {
        
        if ($.type(options) === 'string' || $.type(options) === 'number') {
            var opt = {
                content: options
            } ;
            options = opt ;
        }

        _private.options = $.extend(defaults, options, _private.options) ;

        _private.hero = $(_private.tpl.tpl_1.replace('{1}', options.content)) ;
        
        var opt = {} ;
        opt.wrapper_css_obj = _private.get_wrapper_css_obj() ;
        opt.content_css_obj = _private.get_content_css_obj() ;

        _private.appendToBody(opt) ;
        _private.appendToBody_animate() ;
        _private.appendToBody_timeout_animate() ;
        
    }
    
})( jQuery, window, document ); 