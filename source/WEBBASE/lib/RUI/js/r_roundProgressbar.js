;(function ( $, window, document, undefined ) {
    var pluginName = 'r_roundProgressBar',
        defaults = {
            current: 0,
            total: 100,
            stroke: 15,
            lineCap: 'butt',  // butt, round or square
            fontStyle: {
                color: 'gray',
            },
            color: 'gray',
            bgColor: '#DDD',
            animation: true,
            duration: 1200,
            easing: 'circleProgressEasing',
            displayMode: '%', //[%, number]
        };
        
    function Plugin( element, options ) {
        this.element = element;
        this.$this = $(element) ;
        this.options = $.extend( {}, defaults, options) ;
        
        this.actors = {} ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
        
    }
    
    Plugin.prototype = (function() {
        
        var _private = {} ;
        
        return {
            init: function() {
                var pgObj = this ;
                
                pgObj.initProperty() ;
                pgObj.setActors() ;
                pgObj.draw() ;
                
            },
            
            initProperty: function() {
                var pgObj = this ;
                
                //size
                if (!pgObj.options.size) {

                    pgObj.options.size = pgObj.$this.width() ;
                    
                }
                
                pgObj.$this.css({
                    width: pgObj.options.size,
                    height: pgObj.options.size,
                    position: 'relative',
                    display: 'inline-block',
                }) ;
                
                pgObj.progressStartValue = 0 ;
                pgObj.progress = (pgObj.options.current-pgObj.progressStartValue)/pgObj.options.total ;

            },
            
            setActors: function() {
                var pgObj = this ;
                
                var container =  pgObj.$this ;
                
                pgObj.actors.text = $('<span></span>') ;
                pgObj.actors.text.css({
                    // width: 'inherit',
                    // height: 'inherit',
                    display: 'table-cell',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                })
                .css(pgObj.options.fontStyle) ;
                
                pgObj.actors.text.appendTo(container) ;
                
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d') ;
                canvas.width = pgObj.options.size ;
                canvas.height = pgObj.options.size ;
                
                pgObj.actors.eleCanvas = canvas ;
                pgObj.actors.canvas = $(canvas) ;
                pgObj.actors.ctx = pgObj.actors.eleCanvas.getContext('2d') ;
                
                pgObj.actors.canvas
                    .css({
                        display: 'block',
                        position: 'absolute',
                        width: 'inherit',
                        height: 'inherit',
                    })
                    .appendTo(container) ;
                
            },
            
            //
            draw: function() {
                var pgObj = this ;
                
                if (pgObj.options.animation) {
                    pgObj.drawAnimated() ;
                } else {
                    // pgObj.drawStatic() ;
                }
                
            },
            
            drawAnimated: function() {
                var pgObj = this ;
                var canvas = pgObj.actors.canvas ;
                var ctx = pgObj.actors.ctx ;
                var progress = (pgObj.options.current - pgObj.progressStartValue)/pgObj.options.total ;

                // stop previous animation before new "start" event is triggered
                canvas.stop(true, false);
                pgObj.$this.trigger('start.'+pluginName) ;
                
                canvas
                    .css({ animationProgress: 0 })
                    .animate({ animationProgress: 1 }, $.extend({}, {duration: pgObj.options.duration, easing: 'circleProgressEasing'}, {
                        
                        step: function (animationProgress) {

                            // var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
                            var stepValue = (pgObj.progressStartValue/pgObj.options.total) + progress * animationProgress ;

                            pgObj.drawFrame(stepValue) ;
                            pgObj.textUpdate(animationProgress, stepValue) ;

                            pgObj.$this.trigger('progress.'+pluginName, [animationProgress, stepValue]) ;
                        }
                        
                    }))
                    .promise()
                    .always(function() {
                        pgObj.$this.trigger('end.'+pluginName) ;
                    });
                
            },
            
            drawFrame: function(v) {
                var pgObj = this ;
                
                pgObj.lastFrameValue = v;
                pgObj.actors.ctx.clearRect(0, 0, pgObj.options.size, pgObj.options.size);
                pgObj.drawEmptyArc();
                pgObj.drawArc(v);
                
            },
            
            drawEmptyArc: function() {
                var pgObj = this ;
                var ctx = pgObj.actors.ctx ;
                var radius = pgObj.options.size / 2 ;
                var stroke = pgObj.options.stroke ;
                
                ctx.save() ;
                ctx.beginPath() ;
                ctx.arc(radius, radius, radius - stroke / 2, Math.PI*-0.5, (Math.PI*-0.5)+(Math.PI*2));
/*
context.arc(x,y,r,sAngle,eAngle,counterclockwise);
x	圆的中心的 x 坐标。
y	圆的中心的 y 坐标。
r	圆的半径。
sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
eAngle	结束角，以弧度计。
counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
*/
                ctx.lineWidth = stroke ;
                ctx.lineCap = pgObj.options.lineCap ;
                ctx.strokeStyle = pgObj.options.bgColor ;
                ctx.stroke() ;
                ctx.restore() ;
            },
            
            drawArc: function(v) {
                var pgObj = this ;
                var ctx = pgObj.actors.ctx ;
                var radius = pgObj.options.size / 2 ;
                var stroke = pgObj.options.stroke ;
                
                ctx.save() ;
                ctx.beginPath() ;
                ctx.arc(radius, radius, radius - stroke / 2, Math.PI*-0.5, (Math.PI*-0.5)+(Math.PI*2)*v);
/*
context.arc(x,y,r,sAngle,eAngle,counterclockwise);
x	圆的中心的 x 坐标。
y	圆的中心的 y 坐标。
r	圆的半径。
sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
eAngle	结束角，以弧度计。
counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
*/
                ctx.lineWidth = stroke ;
                ctx.lineCap = pgObj.options.lineCap ;
                ctx.strokeStyle = pgObj.options.color ;
                ctx.stroke() ;
                ctx.restore() ;
            },
            
            textUpdate: function(p, v) {
                var pgObj = this ;

                if (pgObj.options.displayMode==='%') pgObj.actors.text.text( Math.round(v*100)+'%' ) ;
                if (pgObj.options.displayMode==='number') pgObj.actors.text.text( Math.round(v*pgObj.options.total) ) ;

            },
            
            increase: function(v) {
                var pgObj = this ;

                pgObj.progressStartValue = pgObj.options.current ;

                pgObj.options.current = pgObj.options.current + v ;

                pgObj.draw() ;
                
            },
            
            decrease: function(v) {
                var pgObj = this ;

                pgObj.progressStartValue = pgObj.options.current ;

                pgObj.options.current = pgObj.options.current - v ;

                pgObj.draw() ;
                
            },
            
            setValue: function(v) {
                var pgObj = this ;

                pgObj.progressStartValue = pgObj.options.current ;

                pgObj.options.current = v ;

                pgObj.draw() ;
                
            },
            
            getValue: function() {
                var pgObj = this ;

                return $.extend({}, pgObj.options) ;
                
            },
        } ;
    })() ;
    
    // ease-in-out-cubic
    $.easing.circleProgressEasing = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    
    $.fn[pluginName] = function (configOrCommand, commandArgument) {
        
        if (typeof configOrCommand==='string') {
            
            if (configOrCommand==='getValue') {
                instance = $(this).data('plugin_' + pluginName) ;

                if (instance) {
                    return instance[configOrCommand]() ;
                }
                return false ;
            }
            
            return this.each(function() {
                instance = $.data(this, 'plugin_' + pluginName) ;
                if (instance) {
                    return instance[configOrCommand](commandArgument) ;
                }
            });
        } 

        return this.each(function () {
            
            var el = $(this),
                instance = $.data(this, 'plugin_' + pluginName) ;
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (!instance) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, config ));
            } else {
                instance.init(config) ;
            }
        });
    }
        
})( jQuery, window, document );
