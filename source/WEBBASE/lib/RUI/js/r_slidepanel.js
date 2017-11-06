/*
$.r_slidepanel(
{
    target: $('.rr1'),
}) ;  
*/
;(function ( $, window, document, undefined ) {
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    var pgn = 'r_slidepanel' ;
    var defaultOptions = {
        bodyClass: 'r_sp_body',
        panelClass: 'r_sp_panel',
        panelOpenClass: 'r_sp_panel_open',
        torightPanelClass: 'r_sp_toright_panel',
        toleftPanelClass: 'r_sp_toleft_panel',
        totopPanelClass: 'r_sp_totop_panel',
        tobottomPanelClass: 'r_sp_tobottom_panel',
        blurContainerClass: '',
        blurClass: 'r_sp_blur',

        //mask
        maskStyle: {
            background: 'gray',
            opacity: '0.5',
        },
        
        maskClass: 'r_sp_mask',
        direction:'',
        minW: 320, //iphone4 width
        maxW: 350,
    } ;
    
    var _ = {} ;
    
    //初始化，設定
    _.init = function() {
        
        _.close(true) ;
        _.options.body = $('body') ;
        _.options.target = $(_.options.target) ;
        _.options.targetParent = _.options.target.parent() ;
        
        //reset body
        if ( ! _.options.body.hasClass(_.options.bodyClass)) _.options.body.addClass(_.options.bodyClass) ;
        
        //set panel
        _.options.target.addClass(_.options.panelClass) ;

        //set direction
        if (_.options.target.hasClass(_.options.torightPanelClass)) {
            _.direction = 'toright' ;
        }
        else if (_.options.target.hasClass(_.options.toleftPanelClass)) {
            _.direction = 'toleft' ;
        }
        else if (_.options.target.hasClass(_.options.totopPanelClass)) {
            _.direction = 'totop' ;
        }
        else if (_.options.target.hasClass(_.options.tobottomPanelClass)) {
            _.direction = 'tobottom' ;
        }

    } ;
    
    _.mask = function() {
        var _mask = $('<div class="'+_.options.maskClass+' '+_.direction+'">')
            .prependTo(_.options.targetParent)
        
        _mask.css(_.options.maskStyle) ;
        
        if (_.options.blurContainerClass) $('.'+_.options.blurContainerClass).addClass('r_sp_blur') ;
    } ;
    
    //
    _.slide = function() {
        //只在尚未展開時執行展開
        if ( ! _.options.target.hasClass(_.options.panelOpenClass)) {
            
            _.options.target.addClass(_.options.panelOpenClass) ;
            
            var W = $(window).width() ;
            var w ;
            if (_.isMobile() || _.direction==='totop' || _.direction==='tobottom') {
                w = W ;
            } else {
                w = (W<_.options.maxW)?_.options.minW:_.options.maxW ;
            }
        
            if (_.direction==='toright') {
                
                _.options.target
                    .css({
                        width: w+'px',
                        visibility: 'visible',
                        left: -w+'px',
                    }) ;
                    
                setTimeout(function() {
                    _.options.target.css('left', 0) ;
                }, 0) ;
                
            }
            else if (_.direction==='toleft') {
                
                _.options.target
                    .css({
                        width: w+'px',
                        visibility: 'visible',
                        right: -w+'px',
                    }) ;
                    
                setTimeout(function() {
                    _.options.target.css('right', 0) ;
                }, 0) ;
                
            }
            else if (_.direction==='totop') {
                _.options.target
                    .css({
                        visibility: 'visible',
                        bottom: '-100%',
                    }) ;
                    
                setTimeout(function() {
                    _.options.target.css('bottom', '0') ;
                }, 0) ;
            }
            else if (_.direction==='tobottom') {
                _.options.target
                    .css({
                        visibility: 'visible',
                        top: '-100%',
                    }) ;
                    
                setTimeout(function() {
                    _.options.target.css('top', '0') ;
                }, 0) ;
            }

        }
    } ;
    
    _.bindEvent = function() {
        
        if (true) {
            setTimeout(function() {
                $(document)
                    .off('click.'+pgn)
                    .on('click.'+pgn, function(e) { 
                        _.close();
                        
                    }) ; 

                $('.'+_.options.panelClass)
                    .off('click.'+pgn)
                    .on('click.'+pgn, function(e) { 
                        e.stopPropagation(); 
                    }) ; 
            }, 0) ;
        }
        
    } ;

    _.close = function(flag) {
        
        $.each($('.'+_.options.panelClass), function() {
            
            if (flag) {
                //同元素重複觸發時不做反應
                if ($(this)[0]===_.options.target[0]) {
                    return true ;
                }
            }
            
            //已經帶有panelOpenClass的執行關閉
            if ($(this).hasClass(_.options.panelOpenClass)) {
                var w = $(this).width() ;
                
                $(this).toggleClass(_.options.panelOpenClass)
                
                if ($(this).hasClass(_.options.torightPanelClass)) {
                    $(this).css('left', -w+'px') ;
                }
                if ($(this).hasClass(_.options.toleftPanelClass)) {
                    $(this).css('right', -w+'px') ;
                }
                if ($(this).hasClass(_.options.totopPanelClass)) {
                    $(this).css('bottom', '-100%') ;
                }
                if ($(this).hasClass(_.options.tobottomPanelClass)) {
                    $(this).css('top', '-100%') ;
                }
            }
        }) ;
        
        if (_.options.body && _.options.body.hasClass(_.options.bodyClass)) _.options.body.removeClass(_.options.bodyClass) ;
        $('.'+_.options.maskClass).remove() ;
        if (_.options.blurContainerClass) $('.'+_.options.blurContainerClass).removeClass('r_sp_blur') ;
        
        
        $(document).off('click.'+pgn) ;
        
        if ($.isFunction(_.options.afterHide)) {
            setTimeout(function() {
                _.options.afterHide() ;
            }, 100) ;
        }
    } ;
    
    _.isMobile = function() {
        return (
            (navigator.userAgent.match(/Android/i)) ||
            (navigator.userAgent.match(/webOS/i)) ||
            (navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i)) ||
            (navigator.userAgent.match(/BlackBerry/))
        ) ;
    } ;
    
    $[pgn] = function(options) {
        //設定參數
        _.options = $.extend({}, defaultOptions, options) ;
        //初始化
        _.init() ;
        _.mask() ;
        _.slide() ;
        _.bindEvent() ;
        if ($.isFunction(_.options.afterShow)) {
            setTimeout(function() {
                _.options.afterShow() ;
            }, 100) ;
        }
    } ;
    
    $[pgn].close = function() {
         _.close() ;
    } ;
    
})( jQuery, window, document ); 