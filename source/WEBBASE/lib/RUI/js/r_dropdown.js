$(function()
{
    $('.r_dropdown-toggler')
    
        .on('click', function(e) {
            var $this = $(this) ;

            var targetStr = $this.attr('r_dropdown-toggle-target') ;
            
            var targetSelector = $(targetStr) ;
            
            if (targetSelector.hasClass('open')) {
                targetSelector.slideUp() ;
                targetSelector.toggleClass('open') ;
            } else {
                targetSelector.slideDown(function() {
                    targetSelector.toggleClass('open') ;
                }) ;
                
            }
        }) ;


    $('.r_dropdown')
    
        .on('click', '.r_dropdown-menu, .r_dropdown-submenu', function(e) {
            e.preventDefault() ;
            e.stopPropagation() ;
            
            var $this = $(this) ;
            
            //$(this).toggleClass('open')
            
            if ($this.hasClass('open')) {
                $this.find('>.r_dropdown-menu').slideUp(function() {
                    $this.removeClass('open') ;
                }) ;
                
            } else {
                $this.find('>.r_dropdown-menu').slideDown() ;
                $this.addClass('open') ;
            }

        })
}) ;