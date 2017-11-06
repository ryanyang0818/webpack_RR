if (!$.isFunction( String.prototype.format )) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
    }
}

;(function ( $, window, document, undefined ) {
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    var pgn = 'r_tooltip' ;
    var defaultOptions = {
        wrapperClass: 'r_tooltip_wrapper',
        maskClass: 'r_tooltip_mask',
        dialogClass: 'r_tooltip_dialog',
        arrowClass: 'r_tooltip_arrow',
        dialogContainerClass: 'r_tooltip_dialogContainer',
        gapHeight: 10,
        arrow: true,
        center: true,
    } ;

    var _ = {} ;

    _.tpl = {
        wrapper: '<div class="{0}"><div class="{1}"></div></div>',
        dialog: '<div class="{0}"><div class="{1}"></div><div class="{2}"></div></div>',
    } ;
    
    _.init = function() {
        _.close() ;
        
        _.prepare() ;
        
    } ;
    
    _.prepare = function() {
        _.mask() ;
        _.setActors() ;
        _.getTargetInfo() ;
        _.getDialogPosition() ;
        _.setDialog() ;
        _.bindEvent() ;
    } ;
    
    _.mask = function() {
        $(_.tpl.wrapper.format(_.options.wrapperClass, _.options.maskClass))
            .appendTo('body') ;
    } ;
    
    _.setActors = function() {
        _.actors = {} ;
        _.actors.wrapper = $('.'+ _.options.wrapperClass) ;
        _.actors.mask = $('.'+ _.options.maskClass) ;
    } ;
    
    _.getTargetInfo = function() {

        _.options.targetInfo = _.options.target.offset() ;
        _.options.targetInfo.top = _.options.targetInfo.top-$(window).scrollTop() ;
        _.options.targetInfo.width = _.options.target.outerWidth() ;
        _.options.targetInfo.height = _.options.target.outerHeight() ;
    } ;
    
    _.getDialogPosition = function() {
        var rtnObj = {} ;
        var H = Math.round($(window).height()/2) ;
        var W = Math.round($(window).width()/2) ;

        if ((_.options.targetInfo.top + (_.options.targetInfo.height / 2))>H) {
            rtnObj.positionX = 'top' ;  //arrow down, dialog upside
        } else {
            rtnObj.positionX = 'bottom' ;  //arrow up, dialog downside
        }
        
        if (_.options.center===true) {
            rtnObj.positionY = 'center' ;
        } else {
            if ((_.options.targetInfo.left + (_.options.targetInfo.width / 2))>W) {
                rtnObj.positionY = 'right' ;
            } else {
                rtnObj.positionY = 'left' ; 
            }
        }
        
        if (rtnObj.positionX==='top') {
            rtnObj.top = _.options.targetInfo.top - _.options.gapHeight - _.options.height ;
        } else {  //bottom
            rtnObj.top = _.options.targetInfo.top + _.options.targetInfo.height + _.options.gapHeight ;
        }
        
        if (rtnObj.positionY==='center') {
            var tmpleft = _.options.targetInfo.left+(_.options.targetInfo.width/2)-(_.options.width/2) ;
            if (tmpleft<10) {
                rtnObj.left = 10 ;
                rtnObj.right = 'initial' ;
                rtnObj.arrowOffset = rtnObj.left-tmpleft ;
            }
            else if ((Math.round($(window).width())-tmpleft-_.options.width)<10) {
                rtnObj.left = Math.round($(window).width())-_.options.width-10 ;
                rtnObj.right = 'initial' ;
                rtnObj.arrowOffset = rtnObj.left-tmpleft ;
            }
            else {
                rtnObj.left = tmpleft ;
                rtnObj.right = 'initial' ;
                rtnObj.arrowOffset = 0 ;
            }
            
            
        } else {
            if (rtnObj.positionY==='left') {
                rtnObj.left = _.options.targetInfo.left ;
                rtnObj.right = 'initial' ;
            } else {  //bottom
                rtnObj.left = 'initial' ;
                rtnObj.right = $(window).width() - _.options.targetInfo.left - _.options.targetInfo.width ;
            }
        }

        _.options.dialogInfo = rtnObj ;
    } ;
    
    _.setDialog = function() {
        
        var css = {
            top: _.options.dialogInfo.top,
            left: _.options.dialogInfo.left,
            right: _.options.dialogInfo.right,
            width: _.options.width,
            height: _.options.height,
        } ;
        
        $.extend(css, _.options.css) ;

        $(_.tpl.dialog.format(_.options.dialogClass, _.options.arrowClass, _.options.dialogContainerClass))
            .css(css)
            .appendTo(_.actors.wrapper) ;
            
        _.actors.container = _.actors.wrapper.find('.'+_.options.dialogContainerClass) ;
        _.actors.container.append(_.options.content) ;
        _.actors.dialogContainer = _.actors.wrapper.find('.'+ _.options.dialogContainerClass) ;
        
        if (_.options.arrow) {
            _.actors.arrow = _.actors.wrapper.find('.'+ _.options.arrowClass).addClass(_.options.dialogInfo.positionX) ;
            if (_.options.css && _.options.css.background) {
                _.actors.arrow.css('border-'+_.options.dialogInfo.positionX+'-color', _.options.css.background) ;
            }
            if (_.options.dialogInfo.positionY==='center') {
                
                var left = _.options.width/2 - 10 -_.options.dialogInfo.arrowOffset ;

                if (left<10) left=10 ;
                if (left>_.options.width-20-10) {
                    left=_.options.width-20-10 ;
                }
                _.actors.arrow.css('left', left) ;  //10是arrow半寬
                
            } else {
                if (_.options.dialogInfo.positionY==='left') {
                    _.actors.arrow.css('left', _.options.targetInfo.width/2 - 10) ;  //10是arrow半寬
                } else {
                    _.actors.arrow.css('right', _.options.targetInfo.width/2 - 10) ;  //10是arrow半寬
                }
            }
        }
    } ;
    
    _.bindEvent = function() {
        if ($.isFunction(_.options.afterShow)) _.options.afterShow() ;
        
        _.actors.mask
            .on('click', function() {
                _.close() ;
            }) ;
        
    } ;
    
    _.resetPosition = function() {
        
    } ;
    
    _.close = function() {
        if (_.options && $('.'+_.options.wrapperClass).length>0) {
            _.actors.wrapper.remove() ;
            if ($.isFunction(_.options.afterClose)) _.options.afterClose() ;
        }
    } ;
    
    $[pgn] = function(options) {

        _.options = {} ;
        
        _.options = $.extend({}, defaultOptions, options) ;

        _.init() ;

    } ;
    
    $[pgn].close = function() {
        _.close() ;
    } ;
    
    $[pgn].resetPosition = function() {
        $[pgn].close() ;
    } ;
    
    $(window).resize(function(){
        $[pgn].resetPosition();
    });
    
    $(window).scroll(function(){
        $[pgn].resetPosition();
    });
    
})( jQuery, window, document ); 
