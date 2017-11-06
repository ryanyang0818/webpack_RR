//plugin: q_navbar
//navbar 
;(function ( $, window, document, undefined ) {
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    // Create the defaults once     
    var pgn = 'r_mqttHandler',  
        defaultOptions = {  

        } ;

    var _ = {} ;
    
    _.log = function() {
        // cl(arguments) ;
    } ;
    
    _.handle = function() {
        console.log(_.options) ;
        if (typeof _.options.severity && _.options.severity == '0') {  //info
            _.handler_0(_.options) ;
        }
    
        if (typeof _.options.severity && _.options.severity == '1') {  //dialog
            _.handler_1(_.options) ;
        }
    
        if (typeof _.options.severity && _.options.severity == '7') {  //update db
            _.handler_7(_.options) ;
        }
        
    } ;

    _.handler_0 = function(respObj) {
        RR.util.toast(respObj.message) ;
    },
    
    _.handler_1 = function(respObj) {
        var msg = '<div style="text-align:center;">'+ respObj.message +'</div>' ;
        
        var opt = {
            message: msg,
            yes_button_display: true,
            yes_button_text: 'DONE',
            yes_button_callback: function() {

            },
            no_button_display: false,
            no_button_text: 'CANCEL',
            no_button_callback: function() {
                
            },
            afterClose: function() {
                
            }
        } ;
        $.r_confirm(opt) ;
    },
    
    _.handler_7 = function() {
        if (_.options.message_id===1) {
            RR.pager.pages.ixpand.categroyRefreshFlag.music = true ;
            RR.pager.pages.ixpand.categroyRefreshFlag.file = true ;
        }
        if (_.options.message_id===2) {
            RR.pager.pages.ixpand.categroyRefreshFlag.photo = true ;
            RR.pager.pages.ixpand.categroyRefreshFlag.file = true ;
        }
        if (_.options.message_id===3) {
            RR.pager.pages.ixpand.categroyRefreshFlag.video = true ;
            RR.pager.pages.ixpand.categroyRefreshFlag.file = true ;
        }
        if (_.options.message_id===4) {
            RR.pager.pages.ixpand.categroyRefreshFlag.file = true ;
        }
    } ;
    
    $[pgn] = function (options) {  
        
        _.options = {} ;  //
        
        _.options = $.extend({}, defaultOptions, options) ;

        _.handle() ;
        
    } 
    
})( jQuery, window, document ); 