
/*
$.r_fancytooltip($el) ;  
*/
;(function ( $, window, document, undefined ) {
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    var pgn = 'r_fancytooltip' ;
    var defaultOptions = {
        wrapCSS: 'r_fancytooltip-container',
        fitToView: true,
        autoSize: false,
        autoHeight: true,
        closeBtn: false,
        closeClick: true,
        autoResize: false,
        modal: false ,
        maxWidth: '400',
        width: '300',
        minHeight: '80',
        dialogPadding: '10',
        arrowHeight: '10',
        afterShow: function() {},
    } ;
    
    var _ = {} ;

    _.init = function() {
        _.close() ;
    } ;
    
    _.bindEvent = function() {

    } ;
    
    _.prepare = function() {
        
        _.options.$elInfo = _.options.$el.offset() ;
        _.options.$elInfo.width = _.options.$el.width() ;
        _.options.$elInfo.height = _.options.$el.height() ;
        _.options.direction = _.getDirection() ;
    } ;
    
    //判斷對話框的相對方位
    _.getDirection = function() {
        var rtnObj = {
            x: 0,
            y: 0
        } ;
        var H = Math.round($(window).height()/2) ;
        var W = Math.round($(window).width()/2) ;

        if ((_.options.$elInfo.top + (_.options.$elInfo.height / 2))>H) {
            rtnObj.x = 'top' ;  //arrow down, dialog upside
        } else {
            rtnObj.x = 'bottom' ;  //arrow up, dialog downside
        }
        
        if ((_.options.$elInfo.left + (_.options.$elInfo.width / 2))>W) {
            rtnObj.y = 'right' ;
        } else {
            rtnObj.y = 'left' ; 
        }
        
        return rtnObj ;
    } ;
    
    _.resetPosition = function() {
    
        var cssObj = {

        } ;
        var top = 0 ;
        
        $(".fancybox-wrap").find('.fancybox-inner').css('height', 'auto') ;

        if (_.options.direction.x==='top') {
            cssObj.top = _.options.$elInfo.top - (_.options.layers.length*(122)+30) - _.options.arrowHeight ;
            // cssObj.top = _.options.$elInfo.top - 275 - _.options.arrowHeight ;
        } else {  //bottom
            cssObj.top = _.options.$elInfo.top + _.options.$elInfo.height - _.options.arrowHeight ;
        }
        
        if (_.options.direction.y==='left') {
            cssObj.left = _.options.dialogPadding+'px' ;
            cssObj.right = 'initial' ;
        } else {  //bottom
            cssObj.left = 'initial' ;
            cssObj.right = _.options.dialogPadding+'px' ;
        }

        cssObj.display = 'block' ;
        $(".fancybox-wrap").css(cssObj);
        _.setPointer() ;
    } ;
    
    _.setPointer = function() {
        var arrowContainer = $('<div style="height:20px;"><div class="r_fancytooltip-arrow"></div></div>') ;

        if (_.options.direction.y==='left') {
            arrowContainer.find('.r_fancytooltip-arrow').css('left',  _.options.$elInfo.left+(_.options.$elInfo.width/2)-_.options.dialogPadding-_.options.dialogPadding) ;
        } else {
            arrowContainer.find('.r_fancytooltip-arrow').css('right', ($(window).width()-(_.options.$elInfo.left+(_.options.$elInfo.width/2))-_.options.arrowHeight-_.options.dialogPadding)) ;
        }
            
        if (_.options.direction.x==='top') {
            arrowContainer.find('.r_fancytooltip-arrow').addClass('down').end().appendTo(".fancybox-wrap") ;
        } else {
            arrowContainer.find('.r_fancytooltip-arrow').addClass('up').end().prependTo(".fancybox-wrap") ;
        }
        
    } ;

    _.get_fancybox_option = function() {
        var opt = {} ;
        opt.wrapCSS = _.options.wrapCSS ;
        opt.autoResize = false ;
        opt.autoCenter = false ;
        opt.fitToView = _.options.fitToView ;
        opt.autoSize = _.options.autoSize ;
        opt.autoHeight = _.options.autoHeight ;
        opt.closeBtn = _.options.closeBtn ;
        opt.closeClick = _.options.closeClick ;
        opt.modal = _.options.modal ;
        opt.width = _.options.width ;
        opt.minHeight = _.options.minHeight ;
        opt.content = _.get_fancybox_content() ;
        opt.afterShow = function() {
        
            setTimeout(function() {
                _.resetPosition() ;
            }, 0) ;
        
            if ($.isFunction( _.options.afterShow )) {
                _.options.afterShow() ;
            }
            
        } ;
        opt.beforeShow = function() {
            
            $(".fancybox-wrap").css('display', 'none') ;
            if ($.isFunction( _.options.beforeShow )) _.options.beforeShow() ;
            
        } ;
        opt.afterClose = function() {
            
            if ($.isFunction( _.options.afterClose )) _.options.afterClose() ;
            
        } ;
console.log(opt) ;
        return opt ;
    } ;
    
    _.get_fancybox_content = function() {
        var content = '' ;
        
        $.each(_.options.layers, function(idx, layerArr) {
            content += _.getLayerContent(layerArr)+"\n" ;
        }) ;
        
        return '<div class="r_fancytooltip-innerContainer">'+content+'</div>' ;
    } ;
    
    _.getLayerContent = function(layerArr) {
        var layerContent = '' ;

        $.each(layerArr, function(idx, funcName) {
            layerContent += _.tpl[funcName]+"\n" ;
        }) ;
        
        return '<div class="r_fancytooltip-row">'+layerContent+'</div>' ;
    } ;
    
    _.tpl = {
        rename: 
            '<div class="r_fancytooltip-block">'+
                '<div class="r_fancytooltip-icon"><i class="fa fa-pencil-square-o fa-2x" aria-hidden="true"></i></div>'+
                '<div class="r_fancytooltip-text"><span>重新命名檔案</span></div>'+
            '</div>',
        print: 
            '<div class="r_fancytooltip-block">'+
                '<div class="r_fancytooltip-icon"><i class="fa fa-print fa-2x" aria-hidden="true"></i></div>'+
                '<div class="r_fancytooltip-text"><span>列印</span></div>'+
            '</div>',
        more: 
            '<div class="r_fancytooltip-block">'+
                '<div class="r_fancytooltip-icon"><i class="fa fa-ellipsis-h fa-2x" aria-hidden="true"></i></div>'+
                '<div class="r_fancytooltip-text"><span>更多</span></div>'+
            '</div>',
    } ;
    
    _.close = function(flag) {
        $.fancybox.close() ;
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
    
    _.fancybox = function(opt) {

        $.fancybox(opt) ;
        
    }
    
    $[pgn] = function(options) {

        _.init() ;
        
        _.options = {} ;
        
        _.options = $.extend({}, defaultOptions, options) ;
        $[pgn].options = _.options ;
        _.prepare() ;
        
        return _.fancybox( _.get_fancybox_option() ) ;
        
    } ;
    
    $[pgn].close = function() {
        _.close() ;
    } ;
    
})( jQuery, window, document ); 
