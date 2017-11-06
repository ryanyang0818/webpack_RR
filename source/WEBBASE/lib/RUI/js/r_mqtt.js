//plugin: q_navbar
//navbar 
;(function ( $, window, document, undefined ) {
    var H = $("html") ;
    var W = $(window) ;
    var D = $(document) ;
    // Create the defaults once     
    var pgn = 'r_mqtt',  
        defaultOptions = {  
            clientId: '/qnasws',
        } ;

    var _ = {} ;
    
    _.log = function(output) {
        // cl(output) ;
    } ;
    
    _.init = function() {
        
        _.setActors() ;
        
        _.bindEvent() ;
    } ;
    
    _.setActors = function() {
        
        _.actors = {} ;
        
        _.client = new Paho.MQTT.Client(location.hostname, Number((location.port)?location.port:80), _.options.clientId, (new Date()).toGMTString()+Math.random(1, 9999));
        
    } ;
    
    _.bindEvent = function() {
        _.client.onConnectionLost = _.onConnectionLost;
        _.client.onMessageArrived = _.onMessageArrived;
        _.client.connect({
            onSuccess:_.onConnect,
            onFailure:_.onFailure,
        });
    } ;

    _.onConnectionLost = function(message) {
        _.log('onConnectionLost') ;
        _.log(arguments) ;

        var count = 0 ;
        do {
            
            count++;
        
            if ($(document).r_mqtt()) break ;

        } while(count<3) ;
        
    },
                
    _.onMessageArrived = function(message) {
        if (message.payloadString) {
            respObj = JSON.parse(message.payloadString) ;

            if (typeof respObj == 'object') {
                _.log(respObj) ;
                if (_.options.handler) _.options.handler(respObj) ;
                
            }
        }
    },
    
    _.onConnect = function() {
        _.client.subscribe('89b75e7ca7146a12d70bfd80cc61cf2c') ;
        _.log('websocket linked') ;

    },
    
    _.onFailure = function() {
        _.log('onFailure') ;
        _.log(arguments) ;
    },

    $[pgn] = function (options) {  
        
        _.options = {} ;  //
        
        _.options = $.extend({}, defaultOptions, options) ;

        _.init() ;
        
    } 
    
})( jQuery, window, document ); 