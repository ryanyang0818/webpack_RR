//plugin: r_uploader
//用來處理上傳
;(function ( $, window, document, undefined ) {  
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    // Create the defaults once     
    var pgn = 'r_i18n',  
        defaults = {
            path: 'language/',
            key: 'ri18n',
        } ;
    
    var _private = {} ;
    
    _private.classObj = {
        innerContainer: 'r_uploader_innerContainer',
    } ;
    
    _private.init = function(options) {
        _private.options = $.extend({}, defaults, _private.options, options) ;
    } ;
    
    //開始替換HTML內的文字
    _private.replace = function() {
        
        $.each($('.'+_private.options.key), function(idx, ele) {
            var $ele = $(ele) ;
            
            var ri18n = $ele.data(_private.options.key) ;
            
            $ele.text($.i18n.prop(ri18n)) ;
            
        }) ;
        
    } ;

    $[pgn] = function(options) {
        $[pgn].load(options) ;
    }
    
    $[pgn].run = function(options) {
        _private.replace() ;
    } ;
    
    $[pgn].load = function(options) {

        _private.init(options) ;

        var opt = {
            name:'Messages', 
            path: _private.options.path, 
            mode:'both',
            //language: _private.options.language,
            cache: true,
            callback: function() {
                if ($.isFunction(_private.options.callback)) _private.options.callback() ;
                _private.replace() ;
            }
        } ;

        jQuery.i18n.properties(opt);
    }
    
    $[pgn].setPath = function(path) {
        
        _private.init() ;
        _private.options.path = path ;
        
    }
    
    

})( jQuery, window, document ); 