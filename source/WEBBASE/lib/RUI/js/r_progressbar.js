;(function ( $, window, document, undefined ) {
    var pluginName = 'r_progressbar',
        defaults = {
            thumbAlpha: 1,
            negativeColor: '#006699',
            positiveColor: 'gray',
            thumbColor: '#006699',
            
            thumbSize: 0,
            needleSize: 0.2,
            
            minValue: 0,
            maxValue: 10,
            value: 0,
            barSize: 5,
            

            
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
                pgObj.positionItems() ;
                pgObj.bineEvent() ;
                
            },
            
            initProperty: function() {
                var pgObj = this ;
                
                pgObj.value = pgObj.options.value ;
                
                pgObj.options.area = {width: 0, height: 0, max: 0} ;
                pgObj.options.valueArea = {min: 0, max: 0, width: 0} ;
                
            },
            
            setActors: function() {
                var pgObj = this ;
                
                pgObj.actors.container = pgObj.$this.html('') ;
                
                pgObj.actors.seekbar = $('<div class="dhtmlgoodies-seekbar" style="position:relative;width:100%;height:100%"></div>') ;
                
                pgObj.actors.container.append(pgObj.actors.seekbar) ;
                
                pgObj.options.area.width = pgObj.actors.seekbar.width();
                pgObj.options.area.height = pgObj.actors.seekbar.height();
                pgObj.options.area.size = pgObj.actors.seekbar.width();
                
                pgObj.actors.elNegative = $('<div class="seekbar-negative" style="position:absolute;z-index:1"></div>') ;
                pgObj.actors.elPositive = $('<div class="seekbar-positive" style="position:absolute;z-index:1"></div>') ;
                pgObj.actors.elNegative.css("background-color", pgObj.options.negativeColor) ;
                pgObj.actors.elPositive.css("background-color", pgObj.options.positiveColor) ;
                
                pgObj.actors.thumb = $('<div style="position:absolute;z-index:4"></div>');
                pgObj.actors.thumbInner = $('<div class="seekbar-thumb-needle" style="position:absolute;z-index:5;background-color:' + this.thumbColor + '"></div>');
                pgObj.actors.thumbOuter = $('<div class="seekbar-thumb" style="position:absolute;z-index:5;width:100%;height:100%;background-color:' + this.thumbColor + '"></div>');
                pgObj.actors.thumbInner.css("background-color", pgObj.options.thumbColor) ;
                pgObj.actors.thumbOuter.css("background-color", pgObj.options.thumbColor) ;
                        
                pgObj.updateAlpha() ;
                
                pgObj.actors.thumb.append(pgObj.actors.thumbInner) ;
                pgObj.actors.thumb.append(pgObj.actors.thumbOuter) ;
                
                pgObj.actors.seekbar.append(pgObj.actors.elNegative) ;
                pgObj.actors.seekbar.append(pgObj.actors.elPositive) ;
                pgObj.actors.seekbar.append(pgObj.actors.thumb) ;
                
                pgObj.actors.eventEl = $('<div style="position:absolute;z-index:3;width:100%;height:100%"></div>');
                pgObj.actors.seekbar.append(pgObj.actors.eventEl);
                
            },
            
            bineEvent: function() {
                var pgObj = this ;
                
                $(window).on('resize', pgObj.resize.bind(pgObj)) ;
                
                pgObj.actors.eventEl.on('click', pgObj.clickOnBar.bind(pgObj)) ;

                pgObj.actors.thumb.on('mousedown', pgObj.startDragging.bind(pgObj)) ;
                pgObj.actors.thumb.on('touchstart', pgObj.startDragging.bind(pgObj)) ;
                
                $(document.documentElement).on("touchmove", pgObj.drag.bind(pgObj)) ;
                $(document.documentElement).on("mousemove", pgObj.drag.bind(pgObj)) ;
                $(document.documentElement).on("mouseup", pgObj.endDrag.bind(pgObj)) ;
                $(document.documentElement).on("touchend", pgObj.endDrag.bind(pgObj)) ;
                
            },
            
            updateAlpha: function() {
                if (this.options.thumbAlpha < 1) {
                    this.actors.thumbOuter.css("opacity", this.options.thumbAlpha);
                }
            },
            
            positionItems: function() {
                var pgObj = this ;

                if (!pgObj.options.thumbSize) {
                    pgObj.options.thumbSize = pgObj.options.area.height ;
                    pgObj.options.thumbSize += pgObj.options.area.height % 2 ;
                }
                
                var size = pgObj.options.area.width ;
                
                pgObj.actors.thumbOuter.css({
                    'width': pgObj.options.thumbSize, 'height': pgObj.options.thumbSize, 'border-radius': pgObj.options.thumbSize / 2
                });
                pgObj.actors.thumb.css({
                    'width': pgObj.options.thumbSize, 'height': pgObj.options.thumbSize, 'border-radius': pgObj.options.thumbSize / 2
                });
                
                var needleSize = Math.round(pgObj.options.thumbSize * pgObj.options.needleSize);
                needleSize += needleSize % 2;
                var pos = (pgObj.options.thumbSize / 2) - (needleSize / 2);

                pgObj.actors.thumbInner.css({
                    width: needleSize, height: needleSize, borderRadius: needleSize / 2, left: pos, top: pos
                });
                
                pgObj.options.valueArea.min = pgObj.options.thumbSize / 2;
                pgObj.options.valueArea.max = size - pgObj.options.thumbSize / 2;
                pgObj.options.valueArea.size = pgObj.options.valueArea.max - pgObj.options.valueArea.min ;
                
                var barPos = (pgObj.options.thumbSize / 2) - (pgObj.options.barSize / 2) ;
                pgObj.actors.elNegative.css({
                    "left": pgObj.options.valueArea.min, top: barPos, height: pgObj.options.barSize
                });
                pgObj.actors.elPositive.css({
                    "left": pgObj.options.valueArea.min, top: barPos, height: pgObj.options.barSize
                });
                var br = Math.floor(pgObj.options.barSize / 2) + pgObj.options.barSize % 2;

                pgObj.actors.elNegative.css("border-radius", br);
                pgObj.actors.elPositive.css("border-radius", br);

                this.positionBars() ;
                this.positionThumb() ;
            },
            
            positionThumb: function () {
                var pgObj = this ;
                var pos = pgObj.getValuePos();
                pgObj.actors.thumb.css("left", pos);
            },

            positionBars: function () {
                var pgObj = this ;
                var pos = pgObj.getValuePos();

                pgObj.actors.elNegative.css("width", pos);
                pgObj.actors.elPositive.css({"left": pos + pgObj.options.valueArea.min, "width": pgObj.options.valueArea.size - pos}) ;

            },
                    
            getValuePos: function () {
                var pgObj = this ;
                return (pgObj.options.valueArea.size * (pgObj.value - pgObj.options.minValue) / pgObj.options.maxValue) ;
            },
                            
            setValue: function(value) {
                var pgObj = this ;

                pgObj.value = Math.max(pgObj.options.minValue, value);
                pgObj.value = Math.min(pgObj.options.maxValue, pgObj.value);

                pgObj.positionBars();
                pgObj.positionThumb();
                
            },
            
            getValue: function() {
                var pgObj = this ;

                return pgObj.value ;
                
            },
        
            clickOnBar: function(e) {
                var pgObj = this ;
                
                var pos = e.offsetX ;

                pos -= (pgObj.options.thumbSize/2) ;
                
                if (e.target && e.target.className === 'seekbar-thumb') return ;
                
                var value = pgObj.options.minValue + (pos / pgObj.options.valueArea.size * (pgObj.options.maxValue-pgObj.options.minValue)) ;
                
                pgObj.setValue(value) ;
                
                if (pgObj.options.valueListener != undefined) {
                    pgObj.options.valueListener.call(this, this.value);
                }
            },
        
            startDragging: function(e) {
                var pgObj = this ;

                pgObj.actors.thumbOuter.css('opacity', 0.3) ;
                pgObj.actors.thumbOuter.addClass("seekbar-thumb-over") ;
                pgObj.active = true ;
                        
                var position = pgObj.actors.thumb.position() ;
                        
                var x = e.pageX;
                var y = e.pageY;

                if (e.type && e.type == "touchstart") {
                    x = e.originalEvent.touches[0].pageX;
                    y = e.originalEvent.touches[0].pageY;
                }

                pgObj.options.startCoordinates = {x: x, y: y, elX: position.left, elY: position.top};

                return false;
            },
            
            drag: function(e) {
                var pgObj = this ;
                
                if (!pgObj.active) return ;
                
                var x = e.pageX;
                var y = e.pageY;

                if (e.type && e.type == "touchmove") {
                    x = e.originalEvent.touches[0].pageX;
                    y = e.originalEvent.touches[0].pageY;
                }

                var pos = 0;

                pos = pgObj.options.startCoordinates.elX + x - pgObj.options.startCoordinates.x;


                if (pos < 0)pos = 0;
                if (pos > pgObj.options.area.size - pgObj.options.thumbSize)pos = pgObj.options.area.size - pgObj.options.thumbSize;

                pgObj.value = pgObj.options.minValue + (pos / pgObj.options.valueArea.size * (pgObj.options.maxValue - pgObj.options.minValue));

                if (pgObj.options.valueListener != undefined) {
                    pgObj.options.valueListener.call(this, this.value);
                }

                pgObj.positionBars();

                pgObj.actors.thumb.css("left", pgObj.getValuePos());

                return false;
                
            },
            
            endDrag: function(e) {
                var pgObj = this ;

                if (!pgObj.active) return ;
                
                pgObj.updateAlpha() ;
                
                pgObj.actors.thumbOuter.css('opacity', "") ;
                pgObj.actors.thumbOuter.removeClass("seekbar-thumb-over") ;
                
                pgObj.active  = false ;
                
            },
        
            resize: function() {
                var pgObj = this ;

                clearTimeout(pgObj.timer) ;
                pgObj.timer = undefined ;
                
                pgObj.timer = setTimeout(function() {
                    pgObj.options.area.width = pgObj.actors.seekbar.width();
                    pgObj.options.area.height = pgObj.actors.seekbar.height();
                    pgObj.options.area.size = pgObj.actors.seekbar.width();

                    pgObj.positionItems() ;
                }, 0) ;
                
            }
        
        } ;
    })() ;
    
    $.fn[pluginName] = function (configOrCommand, commandArgument) {
        if (typeof configOrCommand==='string') {
            
            if (configOrCommand==='getValue') {
                instance = $(this).data('plugin_' + pluginName) ;

                if (instance) {
                    return instance[configOrCommand]() ;
                }
                return false ;
            }
            
            if (configOrCommand==='options') {
                instance = $(this).data('plugin_' + pluginName) ;

                if (instance) {
                    return instance.options ;
                }
                return false ;
            }            
            
            return this.each(function() {
                instance = $.data(this, 'plugin_' + pluginName) ;
                if (instance) {
                    return instance[configOrCommand](commandArgument) ;
                }
            });
            
            return ;
        }
        
        return this.each(function () {
            
            var el = $(this),
                instance = $.data(this, 'plugin_' + pluginName) ;
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};
            if (!instance) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, config ));
            } else {
                instance = '' ;
                $.data(this, 'plugin_' + pluginName, new Plugin( this, config ));
            }
        });
    
    }
        
})( jQuery, window, document );
