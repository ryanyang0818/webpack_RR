var r_playlist ;
(function() {
    r_playlist = function(options) {
        this.index = 0 ;
        this.items = [] ;
        this.random = false ;
        this.repeat = 'none' ;  //['none' | 'one' | 'all']
        this.volume = 0.1 ;
        this.sidCount = 0 ;
        this.currentTarget = null ;
        this.playlist = [] ;
        this.hooks = [] ;
        $.extend(true, this, options) ;
        
        this._bindEvents() ;
        this._init() ;
    } ;
    
    r_playlist.prototype = {
        _init: function() {
            var pg = this ;
            
            
            pg._makePlaylist() ;
            pg._trigger('beforeChange') ;
            pg.currentTarget = pg._makeAudioEle(pg.playlist[pg.index]) ;
            pg._trigger('changed') ;
        },
        
        //製作播放清單
        _makePlaylist: function() {
            var pg = this ;
            
            pg.setRandom(pg.random) ;
        },
        
        _on: function(eventType, callback) {
            var pg = this ;

            if ($.inArray(eventType, 
            [
                'beforeChange',
                'changed',
                'beforePlay'
            ])<0) return false ;
            
            if (!pg.hooks[eventType]) pg.hooks[eventType] = [] ;
            
            return pg.hooks[eventType].push(callback) ;
            
        },
        
        _off: function(eventType) {
            var pg = this ;
            
            pg.hooks[eventType] = [] ;
        },
        
        _trigger: function(eventType) {
            var pg = this ;

            if (!(pg.hooks[eventType] instanceof Array)) {
                return true;
            }
            (pg.hooks[eventType]).every(function(fn) {
                
                fn() ;
                return true ;
                
            }) ;
            
        },
        
        _bindEvents: function() {
            var pg = this ;

            pg._on('beforeChange', function() {
                if (pg.currentTarget) {
                    pg.stop() ;
                }
                
                if (pg.events && pg.events.beforeChange instanceof Function) {
                    pg.events.beforeChange.apply(pg.player, [pg.currentTarget]) ;
                }
            }) ;
            
            pg._on('changed', function() {
                if (pg.events && pg.events.changed instanceof Function) {
                    pg.events.changed.apply(pg.player, [pg.currentTarget]) ;
                }
            }) ;
            
            pg._on('beforePlay', function() {
                if (pg.events && pg.events.beforePlay instanceof Function) {
                    pg.events.beforePlay.apply(pg.player, [pg.currentTarget]) ;
                }
            }) ;

        },
        
        _makeAudioEle: function(itemObj) {
            var pg = this ;

            if (!itemObj) return false ;
            
            var _audio = new Audio(itemObj.src) ;
            _audio.sid = itemObj.sid ;
            _audio.fileId = itemObj.fileId ;
            _audio.title = itemObj.title ;
            _audio.fileThumbnailPathURL = itemObj.fileThumbnailPathURL ;
            _audio.volume = pg.volume ;
            
            _audio.addEventListener("timeupdate", function() {
                if (pg.events && pg.events.timeupdate instanceof Function) {
                    pg.events.timeupdate.apply(pg.player, [this]) ;
                }
            });

            _audio.addEventListener("loadedmetadata", function() {
                if (pg.events && pg.events.loadedmetadata instanceof Function) {
                    pg.events.loadedmetadata.apply(pg.player, [this]) ;
                }
            });
            
            _audio.addEventListener("ended", function() {
                if (pg.repeat=='one') {
                    pg.replay() ;
                }
                else {
                    pg.next() ;
                }
            });
            
            _audio.addEventListener("error", function(ev) {
                if (_audio.errored) return true ;
                _audio.errored = true ;
                if ($.isFunction(_audio.canPlayType)) {
                    if (!_audio.canPlayType("audio/"+RR.util.getFilext(_audio.title))) {
                        if (this.error && this.error.code && this.error.code===4) {
                            if (this.error.message) {
                                if (this.error.message.match('DEMUXER_ERROR_COULD_NOT_OPEN')) {
                                    if (pg.events && pg.events.error instanceof Function) {
                                        pg.events.error.apply(pg.player, [this]) ;
                                    }
                                }
                            }
                            else {  //for safari no error.message
                                if (pg.events && pg.events.error instanceof Function) {
                                    pg.events.error.apply(pg.player, [this]) ;
                                }
                            }
                        }
                    }
                }
            });
            
            return _audio ;
        },
        
        play: function() {
            var pg = this ;

            if (!pg.currentTarget) {
                return ;
            }
            
            pg._trigger('beforePlay') ;
            pg.currentTarget.play() ;
        },
        
        replay: function() {
            var pg = this ;

            if (!pg.currentTarget) {
                return ;
            }
            
            pg._trigger('beforePlay') ;
            pg.currentTarget.currentTime = 0 ;
            pg.currentTarget.play() ;
        },
        
        pause: function() {
            var pg = this ;
            
            if (!pg.currentTarget) {
                return ;
            }
            
            pg.currentTarget.pause() ;
        },
        
        stop: function() {
            var pg = this ;
            
            if (!pg.currentTarget) return false ;
            
            pg.currentTarget.pause() ;
            pg.currentTarget.src = '' ;
            pg.currentTarget = null ;
        },
        
        prev: function() {
            var pg = this ;
            
            pg._trigger('beforeChange') ;

            var newIndex ;
            newIndex = pg.index-1 ;
            if (newIndex<0) newIndex = (pg.playlist.length-1) ;
            pg.index = newIndex ;
            
            pg.currentTarget = pg._makeAudioEle(pg.playlist[pg.index]) ;
            pg._trigger('changed') ;
            
            pg.play() ;
        },
        
        next: function() {
            var pg = this ;
            
            pg._trigger('beforeChange') ;
            
            var newIndex ;
            var isAllPlayed ;
            newIndex = pg.index+1 ;
            if (newIndex>=pg.playlist.length) {
                isAllPlayed = true ;
                newIndex = 0 ;
            }
            pg.index = newIndex ;
            
            pg.currentTarget = pg._makeAudioEle(pg.playlist[pg.index]) ;
            pg._trigger('changed') ;
            
            if (isAllPlayed) {
                if (pg.repeat==='all') {
                    pg.play() ;
                    return ;
                }
                else {
                    
                    
                    
                }
                
            }
            pg.play() ;
        },        
        
        seekTo: function(s) {
            var pg = this ;

            if (!pg.currentTarget) {
                return ;
            }
            
            pg.currentTarget.currentTime = s ;
        },
        
        volumeSeekTo: function(s) {
            var pg = this ;

            if (!pg.currentTarget) {
                return ;
            }
            
            if (s<0) s = 0 ;
            if (s>1) s = 1 ;
            
            pg.currentTarget.volume = s ;
        },
        
        setRepeat: function(mode) {
            var pg = this ;
            
            if ($.inArray(mode, 
            [
                'none',
                'one',
                'all'
            ])<0) return false ;
            
            pg.repeat = mode ;
            
        },
        
        setRandom: function(mode) {
            var pg = this ;
            
            pg.random = mode ;
            
            var _setSid = function() {
                $.each(pg.items, function(idx, obj) {
                    obj.sid = idx ;
                }) ;
            } ;
            
            var shuffle = function (array) {
                var currentIndex = array.length, temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }
            
            var _random = function() {
                var currentSid
                if (pg.currentSid) currentSid = pg.currentTarget.sic ;

                pg.playlist = shuffle(pg.items.slice()) ;
                $.each(pg.playlist, function(idx, itemObj) {

                    if (itemObj.sid===currentSid) {
                        var currnetItemObj = pg.playlist.splice(idx, 1) ;
                        pg.playlist.unshift(currnetItemObj[0]) ;
                        pg.index = idx ;
                    }
                    
                }) ;
                
            } ;
            
            var _unrandom = function() {
                var currentSid
                if (pg.currentTarget) currentSid = pg.currentTarget.sid ;
                
                pg.playlist = pg.items ;
                $.each(pg.playlist, function(idx, itemObj) {
                    //確認舊的SID是否正是目前的歌，填入index
                    if (itemObj.sid && itemObj.sid===currentSid) {
                        pg.index = idx ;
                    }
                }) ;
            } ;

            _setSid() ;
            
            if (pg.random) {
                _random() ;
            }
            else {
                _unrandom() ;
            }
            
        },
    
        pick: function(orderId) {
            var pg = this ;
            
            var _picked = pg.items[orderId] ;
            
            if (!_picked) {
                pg.play() ;
                return false ;
            }
            
            $.each(pg.playlist, function(idx, itemObj) {
                if (_picked.sid===itemObj.sid) {
                    pg.index = idx ;
                    return ;
                }
            }) ;
            
            pg._trigger('beforeChange') ;
            pg.currentTarget = pg._makeAudioEle(pg.playlist[pg.index]) ;
            pg._trigger('changed') ;
            
            pg.play() ;
        },
        
        destroy: function() {
            var pg = this ;
            pg.stop() ;
            pg.currentTarget = '' ;
            pg.items = [] ;
            pg.playlist = [] ;
            
        },
    } ;
    
})() ;


