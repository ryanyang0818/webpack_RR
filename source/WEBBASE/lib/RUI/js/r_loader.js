;(function ($) {
    
    "use strict";
    
    var _options ;
 
    $.r_loader = function(options) {

        if (typeof options == 'string') {
            
            if (options == 'close') {
                
                setTimeout(function(){
                    $('.r_loader').fadeOut(function() {
                        $(this).remove() ;
                    });
                }, 1);
            } 
            
            return ;
        }
        
        //Defaults
        var settings = $.extend({
            timeToHide: '', // Default Time to hide r_loader
            pos:'fixed',// Default Position
            top:'0px',  // Default Top value
            left:'0px', // Default Left value
            width:'100%', // Default width 
            height:'100%', // Default Height
            zIndex: '9999',  // Default zIndex
            bgColor: 'white', // Default background color
            bgOpacity: '1', // Default background color
            spinner:'spinner1', // Default Spinner
            imagePath:'', // Default Path custom image
            imageWidth: 100
        }, options);

        _options = settings ;
        
        //Customized Spinners
        var spinner01 = '<div class="fl spinner1"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
        var spinner02 = '<div class="fl spinner2"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>';
        var spinner03 = '<div class="fl spinner3"><div class="dot1"></div><div class="dot2"></div></div>';
        var spinner04 = '<div class="fl spinner4"></div>'; 
        var spinner05 = '<div class="fl spinner5"><div class="cube1"></div><div class="cube2"></div></div>'; 
        var spinner06 = '<div class="fl spinner6"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'; 
        var spinner07 = '<div class="fl spinner7"><div class="circ1"></div><div class="circ2"></div><div class="circ3"></div><div class="circ4"></div></div>'; 

        //The target
        var el = $('<div class="r_loader"></div>').appendTo('body') ;

        //Init styles
        var initStyles = {
            'position':settings.pos,
            'width':settings.width,
            'height':settings.height,
            'top':settings.top,
            'left':settings.left
        };

        //Apply styles
        el.css(initStyles);

        //Each 
        el.each(function() {
            var a = settings.spinner;
            //console.log(a)
                switch (a) {
                    case 'spinner1':
                            el.html(spinner01);
                        break;
                    case 'spinner2':
                            el.html(spinner02);
                        break;
                    case 'spinner3':
                            el.html(spinner03);
                        break;
                    case 'spinner4':
                            el.html(spinner04);
                        break;
                    case 'spinner5':
                            el.html(spinner05);
                        break;
                    case 'spinner6':
                            el.html(spinner06);
                        break;
                    case 'spinner7':
                            el.html(spinner07);
                        break;
                    default:
                        el.html(spinner01);
                    }

                //Add customized loader image

                if (settings.imagePath !='') {
                    
                    var img = $('<img src="'+settings.imagePath+'"></div>') ;
                    
                    img.css({
                        width: settings.imageWidth,
                    }) ;
                    
                    $('<div class="f2">').append(img).prependTo(el) ;
                }
                centerLoader();
        });

        //Time to hide r_loader
        
        if (settings.timeToHide) {
            setTimeout(function(){
                $(el).fadeOut(function() {
                    $(this).remove() ;
                });
            }, settings.timeToHide);
        }

        //Return Styles 
        return el.css({
            'background':settings.bgColor,
            'opacity':settings.bgOpacity,
            'zIndex':settings.zIndex
        });

 
    }; // End Fake Loader
    
        //Center Spinner
        function centerLoader() {

            var winW = $(window).width();
            var winH = $(window).height();

            var spinnerW = $('.fl').outerWidth();
            var spinnerH = $('.fl').outerHeight();

            $('.fl').css({
                'position':'absolute',
                'left':(winW/2)-(spinnerW/2),
                'top':(winH/2)
            });
            
            if (_options && _options.imagePath !='') {

                $('.fl').css({
                    'position':'absolute',
                    'left':(winW/2)-(spinnerW/2),
                    'top':(winH/2)
                });                
                
                $('.f2').css({
                    'position':'absolute',
                    'left':(winW/2)-(_options.imageWidth/2),
                    'top':(winH/2)-_options.imageWidth-15
                });
            
            } else {
                $('.fl').css({
                    'position':'absolute',
                    'left':(winW/2)-(spinnerW/2),
                    'top':(winH/2)
                });   
            }
            
        }

        $(window).resize(function(){
            centerLoader();
        });


}(jQuery));




