;(function ( $, window, document, undefined ) {
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    var pgn = 'r_pageMgr' ;
    var defaultOptions = {
        duration: 400,
        activeClass: 'r_page_active',
        waitClass: 'r_page_wait',
        animatingClass: 'r_page_animating',
        animationEnhance: true,
        offset: '10%',
    } ;
    
    var _ = {} ;
    
    _.mainPage = '' ;
    
    _.setPageGroup = function() {
        
        var group = $('.r_page_wrapper>.r_page') ;

        if (group.length) {
            _.pageGroup = {} ;
            $.each(group, function(idx, pageElement) {
                var $page = $(pageElement) ;
                
                var name = $page.data('r_page_name') ;
                
                if (name) {
                    if ($page.hasClass(_.options.activeClass)) {
                        _.mainPage = name ;
                    }
                        
                    _.pageGroup[name] = $page ;
                }
            }) ;
        }
    } ;
    
    _.load = function(pageName) {
        var oldMainPage = _.pageGroup[_.mainPage] ;

        _.pageGroup[pageName].trigger('start.'+pgn) ;
        
        _.pageGroup[pageName]
            .css('left', '100%')
            .promise()
            .always(function() {

                if (oldMainPage) {
                    oldMainPage
                        .addClass(_.options.waitClass)
                        .removeClass(_.options.activeClass)
                }
                _.pageGroup[pageName].addClass(_.options.activeClass)
                _.mainPage = pageName ;
                
                _.pageGroup[pageName].stop(true, false);
                _.pageGroup[pageName].addClass(_.options.animatingClass) ;
                _.pageGroup[pageName].animate({
                    left: '0%',
                }, _.options.duration, 'pageTransitionEasing', function() {
                    
                    oldMainPage.removeClass(_.options.waitClass)
                    _.pageGroup[pageName].removeClass(_.options.animatingClass) ;
                    _.pageGroup[pageName].trigger('end.'+pgn) ;
                    
                }) ;
                
                //enhance effect
                if (_.options.animationEnhance) {
                    oldMainPage.animate({left: '-'+_.options.offset}, _.options.duration) ;
                }
                
            }) ;
    } ;
    
    _.loadFrom = function(pageName) {
        var oldMainPage = _.pageGroup[_.mainPage] ;
        
        _.pageGroup[pageName].trigger('start.'+pgn) ;
        
        var _offset = '0%' ;
        if (_.options.animationEnhance) {
            _offset = '-'+_.options.offset ;
        }
        
        _.pageGroup[pageName]
            .css('left', _offset)
            .promise()
            .always(function() {
                
                _.pageGroup[pageName].addClass(_.options.waitClass) ;
                
                if (oldMainPage) {
                    oldMainPage.stop(true, false);
                    oldMainPage.addClass(_.options.animatingClass) ;
                    oldMainPage.animate({
                        left: '100%',
                    }, _.options.duration, 'pageTransitionEasing', function() {
                        
                        oldMainPage
                            .removeClass(_.options.activeClass)
                            .removeClass(_.options.animatingClass)
                        
                        _.pageGroup[pageName].removeClass(_.options.waitClass) ;
                        _.pageGroup[pageName].addClass(_.options.activeClass) ;
                        _.mainPage = pageName ;
                        _.pageGroup[pageName].trigger('end.'+pgn) ;
                    }) ;

                    //enhance effect
                    if (_.options.animationEnhance) {
                        _.pageGroup[pageName].animate({left: '0%'}, _.options.duration) ;
                    }
                    
                } else {
                    _.pageGroup[pageName].removeClass(_.options.waitClass) ;
                    _.pageGroup[pageName].addClass(_.options.activeClass) ;
                }
            }) ;
    } ;
    
    // ease-in-out-cubic
    $.easing.pageTransitionEasing = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    
    $[pgn] = (function() {
        
        return {
            
            load: function(pageName, options) {
                var pgObj = this ;

                _.options = $.extend({}, defaultOptions, options) ;

                // if (!_.pageGroup) _.setPageGroup() ;
                _.setPageGroup() ;

                if (pageName===_.mainPage) return false ;

                if (_.pageGroup[pageName]) _.load(pageName) ;
                
            },
            
            loadFrom: function(pageName, options) {
                var pgObj = this ;
                
                // if (!_.mainPage) pgObj.load(pageName, options) ;
                
                _.options = $.extend({}, defaultOptions, options) ;
                
                // if (!_.pageGroup) _.setPageGroup() ;
                _.setPageGroup() ;

                if (pageName===_.mainPage) return false ;
                
                if (_.pageGroup[pageName]) _.loadFrom(pageName) ;
            },
            
            getMainPage: function() {
                var pgObj = this ;
                
                return _.mainPage ;
                
            },
            
        } ;
        
    })() ;
    
})( jQuery, window, document ); 