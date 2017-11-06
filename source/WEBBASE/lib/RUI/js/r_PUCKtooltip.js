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
    var pgn = 'r_PUCKtooltip' ;
    var defaultOptions = {
        width: 330,
        height: 300,
        padding: 10,
        arrow: true,
        wrapperClass: 'r_PUCKtooltip_wrpper',
        rowClass: 'r_PUCKtooltip_row',
        blockClass: 'r_PUCKtooltip_block',
        blockIconClass: 'r_PUCKtooltip_blockIcon',
        blockTextClass: 'r_PUCKtooltip_blockText',
    } ;

    var _ = {} ;

    _.tpl = {
        wrapper: '<div class="{0}"></div>',
        row: '<div class="{0}"></div>',
        block: '<div class="{0}"><div class="{1}">{2}</div><div class="{3}">{4}</div></div>',
    } ;
    
    _.icon = {
        download: '<i class="fa fa-download fa-2x" aria-hidden="true"></i>',
        rename: '<i class="fa fa-pencil-square-o fa-2x" aria-hidden="true"></i>',
        copy: '<i class="fa fa-copy fa-2x" aria-hidden="true"></i>',
        move: '<i class="fa fa-folder fa-2x" aria-hidden="true"></i>',
        print: '<i class="fa fa-print fa-2x" aria-hidden="true"></i>',
        more: '<i class="fa fa-ellipsis-h fa-2x" aria-hidden="true"></i>',
        lock: '<i class="fa fa-lock fa-2x" aria-hidden="true"></i>',
    } ;

    _.text = {
        download: $.i18n.map["tooltip_funciton_download"],
        rename: $.i18n.map["tooltip_funciton_rename"],
        copy: $.i18n.map["tooltip_funciton_copy"],
        move: $.i18n.map["tooltip_funciton_move"],
        print: $.i18n.map["tooltip_funciton_print"],
        more: $.i18n.map["tooltip_funciton_more"],
        lock: $.i18n.map["tooltip_funciton_lock"],
    } ;
    
    _.init = function() {
        _.close() ;
        
        _.prepare() ;
    } ;

    _.prepare = function() {
        
        var lineH = 125 ;
        var H = lineH * _.options.layers.length + (_.options.padding*2) ;

        var opt = {
            target: _.options.target,
            width: _.options.width,
            height: H,
            arrow: _.options.arrow,
            center: _.options.center,
            content: _.getContent(),
            afterShow: function() {
                if ($.isFunction(_.options.afterShow)) _.options.afterShow() ;
            },
            afterClose: function() {
                if ($.isFunction(_.options.afterClose)) _.options.afterClose() ;
            }
        } ;
        
        $.r_tooltip(opt) ;
        
    } ;
    
    _.getContent = function() {
        _.actors = {} ;
        
        _.actors.wrapper = $(_.tpl.wrapper.format(_.options.wrapperClass)).css('padding', _.options.padding) ;
        
        $.each(_.options.layers, function(layerIndex, layerArr) {
            var $layer = $(_.tpl.row.format(_.options.rowClass)) ;
            
            $.each(layerArr, function(itemIndex, itemString) {
if (itemString==='lock') return ;
                var $block = $(_.tpl.block.format(
                    _.options.blockClass,
                    _.options.blockIconClass,
                    _.icon[itemString],
                    _.options.blockTextClass,
                    _.text[itemString]
                )) ;
                $block.data('data', {key: itemString}) ;
                if ($.isFunction(_.options.respHandler)) {
                    $block.on('click', function() {
                        _.options.respHandler(_.options.target, itemString) ;
                        
                        _.close() ;
                    }) ;
                    
                }
                $layer.append($block) ;
            }) ;
            _.actors.wrapper.append($layer) ;
        }) ;
        
        var content = _.actors.wrapper ;

        return content ;
        
    } ;
    
    _.close = function() {
        if ($('.'+_.options.wrapperClass).length>0) {
            _.actors.wrapper.remove() ;
            $.r_tooltip.close() ;
        }
    } ;
    
    _.resetPosition = function() {
        $.r_tooltip.resetPosition() ;
    } ;
    
    $[pgn] = function(options) {

        _.options = {} ;  //
        
        _.options = $.extend({}, defaultOptions, options) ;

        if (_.options.layers[0].length===1 && _.options.layers[0][0]==='more') {
            
            _.options.afterClose() ;
            
            return false ;
        }
        

        _.text = {
            download: $.i18n.map["tooltip_funciton_download"],
            rename: $.i18n.map["tooltip_funciton_rename"],
            copy: $.i18n.map["tooltip_funciton_copy"],
            move: $.i18n.map["tooltip_funciton_move"],
            print: $.i18n.map["tooltip_funciton_print"],
            more: $.i18n.map["tooltip_funciton_more"],
            lock: $.i18n.map["tooltip_funciton_lock"],
        } ;
        
        _.init() ;

    } ;
    
    $[pgn].close = function() {
        _.close() ;
    } ;
    
    $[pgn].resetPosition = function() {
        _.resetPosition() ;
    } ;
    
    $(window).resize(function(){
        $[pgn].resetPosition();
    });
    
})( jQuery, window, document ); 
