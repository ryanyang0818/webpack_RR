 //plugin: r_confirm
;(function ( $, window, document, undefined ) {  
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    // Create the defaults once     
    var pgn = 'r_confirm',  
        defaults = {  
            wrapCSS: 'r_confirm-container',
            fitToView: true,
            autoSize: false,
            autoHeight: true,
            closeBtn: true,
            closeClick: true,
            modal: true ,
            maxWidth: '400px',
            width  : '300px',
            height: '150px',
            afterShow: function() {},
        } ;
    
    var _private = {} ;
    
    _private.init = function() {
        
        _private.options = {} ;
        
        _private.tpl = {
            tpl_1: '<div class="'+_private.classObj.wrapper+'">{0}</div>',
            tpl_2: '<div class="r_confirm_title">{0}</div>',
            tpl_3: '<div class="r_confirm_content">{0}</div>',
            tpl_4: '<div class="r_confirm_buttons"><table width="100%" cellspacing="0" cellpadding="0"><tr>{0}{1}</tr></table></div>',
            tpl_5: '<td width="50%"><input type="button" class="'+_private.classObj.yes_button+' btn" value="{0}"></td>',
            tpl_6: '<td width="50%"><input type="button" class="'+_private.classObj.no_button+' btn"  value="{0}"></td>',
        } ;
        
    } ;
    
    _private.classObj = {
        wrapper: 'r_confirm_wrapper',
        yes_button: 'r_confirm_yes_button',
        no_button: 'r_confirm_no_button',
    }

    _private.get_fancybox_option = function() {
        
        var opt = {} ;
        opt.wrapCSS = _private.options.wrapCSS ;
        opt.afterClose = _private.options.afterClose ;
        opt.fitToView = _private.options.fitToView ;
        opt.autoSize = _private.options.autoSize ;
        opt.autoHeight = _private.options.autoHeight ;
        opt.closeBtn = _private.options.closeBtn ;
        opt.closeClick = _private.options.closeClick ;
        opt.modal = _private.options.modal ;
        opt.width = _private.options.width ;
        opt.height = _private.options.height ;
        opt.content = _private.get_fancybox_content() ;
        opt.afterShow = function() {
            if (_private.options.yes_button_display) {
                
                $('.'+_private.classObj.wrapper).find('.'+_private.classObj.yes_button).click(function() {
                    $[pgn].close() ;
                    _private.options.yes_button_callback() ;
                    
                }) ;
            }
            
            if (_private.options.no_button_display) {
                $('.'+_private.classObj.wrapper).find('.'+_private.classObj.no_button).click(function() {
                    $[pgn].close() ;
                    _private.options.no_button_callback() ;
                    
                }) ;
            }
            
            if ($.isFunction( _private.options.afterShow )) {
                _private.options.afterShow() ;
            }
            
        } ;
        opt.beforeShow = function() {
            
            if ($.isFunction( _private.options.beforeShow )) _private.options.beforeShow() ;
            
        } ;
        
        
        return opt ;
    }
    
    _private.get_fancybox_content = function() {
        
        var title = '' ;
        if (_private.options.title) title = _private.tpl.tpl_2.replace('{0}', _private.options.title) ;
        
        var message = '' ;
        if (_private.options.message) message = _private.tpl.tpl_3.replace('{0}', _private.options.message) ;

        var buttons = _private.get_buttons() ;
        
        return _private.tpl.tpl_1.replace('{0}', title + message + buttons) ;
    }
    
    _private.get_buttons = function() {
        
        var buttons ;

        if (_private.options.yes_button_display) {

            _private.tpl.tpl_4 = _private.tpl.tpl_4.replace('{1}', _private.tpl.tpl_5.replace('{0}', _private.options.yes_button_text)) ;
        } else {
            _private.tpl.tpl_4 = _private.tpl.tpl_4.replace('{1}', '') ;
        }

        if (_private.options.no_button_display) {
            
            _private.tpl.tpl_4 = _private.tpl.tpl_4.replace('{0}', _private.tpl.tpl_6.replace('{0}', _private.options.no_button_text)) ;
        } else {
            _private.tpl.tpl_4 = _private.tpl.tpl_4.replace('{0}', '') ;
        }

        return _private.tpl.tpl_4 ;
    }
    
    _private.fancybox = function(opt) {

        $.fancybox(opt) ;
        
    }
    
    $[pgn] = function(options) {

        _private.init() ;
        
        _private.options = {} ;
        
        _private.options = $.extend({}, defaults, options) ;

        return _private.fancybox( _private.get_fancybox_option() ) ;
        
    }
    
    $[pgn].close = function() {
        
        $.fancybox.close() ;
        
    }
    
})( jQuery, window, document ); 