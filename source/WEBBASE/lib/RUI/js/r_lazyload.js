
//plugin: r_lazyload
//用來處理scroll load 圖
;(function ( $, window, document, undefined ) {  
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    // Create the defaults once     
    var pgn = 'r_lazyload',  
        defaults = {  
            scrollDelay: 300,
            TTL: 86400, //ms
        } ;
        
    var _ = {} ;
    _.base64Encode = function(str) {
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = str.length, c1, c2, c3;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += CHARS.charAt(c3 & 0x3F);
        }
        return out;        
    } ;

 
    // The actual plugin constructor  
    function Plugin( element, options ) {
        this.ele = element;  
        this.$ele = $(element);  
        this.options = $.extend( {}, defaults, options) ;  
          
        this._defaults = defaults;  
        this._name = pgn;  

        this.init();  
    }  

    //初始化
    Plugin.prototype = (function()
    {
        return {
            count:0,
            running: false,
            base64Q: [],
            //初始
            init: function() {
                var pg = this ;
                pg.setActors() ;
                pg.initSetting() ;
                pg.bindEvent() ;
                pg.run() ;
            },
            
            setActors: function() {
                var pg = this ;
                
                pg.actors = {
                    'container': pg.$ele,
                }
            },
            
            initSetting: function() {
                var pg = this ;
            },

            bindEvent: function() {
                var pg = this ;
                
                $(window)
                    .on('resize', function(e)
                    {
                        pg.actors.container.trigger('scroll') ;
                    })

                pg.actors.container
                    .on('scroll', function(e)
                    {
                        clearTimeout( $.data( this, "scrollCheck" ) );
                        $.data( this, "scrollCheck", setTimeout(function() {
                            pg.detect() ;
                        }, pg.options.scrollDelay) );
                        
                    })
                    .trigger('scroll') ;
            },

            detect: function() {
                var pg = this ;
                pg.count++ ;
                var colorGroup = ['red', 'blue', 'yellow'] ;
                var color = colorGroup[pg.count%3] ;
                // var wrapperTop = pg.actors.container.scrollTop() ;
                var wrapperTop = pg.actors.container.offset().top ;
                var wrapperBottom = wrapperTop+pg.actors.container.height() ;

                var startLoad = false ;  //當遇到可以下載的圖，之後再遇到一個不能下載的，就要停止迴圈。
                $.each($('img.r_lazyload_img:visible'), function(idx, imgObj) {
                    var imgObj = $(this) ;
                    var imgTop = imgObj.offset().top ;
                    var imgBottom = imgTop + imgObj.height() ;
// cl('===') ;
// cl(idx) ;
// cl(imgTop, imgBottom) ;
// cl(',') ;
// cl(wrapperTop, wrapperBottom) ;
// imgObj.css('border-left', '5px solid '+color) ;
// cl('===') ;
                    //整張圖都出現在區塊內
                    // if ((imgTop >= wrapperTop) && (imgBottom <= wrapperBottom)) {
                    //整張圖有露出上面一部分
                    if (
                        ((imgTop >= wrapperTop) && (imgTop <= wrapperBottom)) ||
                        ((imgBottom >= wrapperTop) && (wrapperBottom>=imgBottom))
                    ) {
                        var src = imgObj.attr('data-r-src') ;
                        
                        pg.loadImage(imgObj, src) ;
                        imgObj.removeClass('r_lazyload_img') ;
// imgObj.css('border-right', '5px solid '+color) ;
                        startLoad = true ;
                    } else {
                        if (startLoad) return false ;
                    }
                }) ;
            },
            
            loadImage: function(imgObj, src) {
                var pg = this ;
                
                var ori_src = imgObj.attr('src') ;
                
                imgObj[0].onerror = function() {
                    imgObj.attr('src', ori_src) ;
                    imgObj[0].onerror = '' ;
                } ;
                
                imgObj.attr('src', src) ;
                return ;
                
                if (!$.jStorage) {
                    imgObj.attr('src', src) ;
                    return ;
                }

                if ($.jStorage.get(src)) {
                    imgObj.attr('src', "data:image/png;base64,"+ $.jStorage.get(src) ) ;
                    return ;
                }
                
                var opt = {
                    url: src,
                    method: 'GET',
                    mimeType: "text/plain; charset=x-user-defined"
                } ;

                $.ajaxq('r_lazyload', opt)
                    .done(function(resp, textStatus, xhr) {
                        try {
                            var imgb64 = _.base64Encode(resp)
                            imgObj.attr('src', "data:image/png;base64,"+ imgb64 ) ;
                            
                            // $.jStorage.set(src, imgb64)
                            pg.base64Q.push({
                                name: src,
                                base64: imgb64
                            }) ;

                        } catch(e) {console.log(e)}

                    }) ;
                
            },
            
            run: function() {
                var pg = this ;

                setInterval(function() {
                    try {
                        if (pg.running) return ;
                        pg.running = true ;
                        
                        var qObj = pg.base64Q.shift() ;
                        if (qObj) {

                            $.jStorage.set(qObj.name, qObj.base64, {TTL: pg.options.TTL}) ;
                        }
                        
                        pg.running = false ;
                    } catch(e) {
                        console.log(e) ;
                    }
                }, 20) ;
            },
        } ;
    })() ;

    $.fn[pgn] = function () {  
        args = Array.prototype.slice.call(arguments) ;  

        return this.each(function () {
            if (!$.data(this, 'plugin_' + pgn)) {
                
                var _plugin = new Plugin( this, args[0] ) ;

                $.data(this, 'plugin_' + pgn, _plugin);  
            }  
            
            else if ($.isFunction(Plugin.prototype[args[0]]))  
            {
                $.data(this, 'plugin_' + pgn)[args[0]](args[1]);
            }  
        });  
    } 
})( jQuery, window, document ); 