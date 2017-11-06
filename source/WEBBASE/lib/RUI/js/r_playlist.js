function r_playlist_audio(options) {
    this.sid = options.sid ;
    this.title = options.title ;
    this.src = options.src ;
    this.playing = false ;
    this.played = false ;
    this.recordInRandom = false ;
    this.element = new Audio() ;
    this.element.src = options.src ;
    this.element.preload = "none";
    this.element.onended = options.onended ;
    this.element.onerror = options.onerror ; 
    var _this = this ;
    $.each(options.data, function(prop, value) {
        if (!_this[prop]) {
            _this[prop] = value ;
        }
    }) ;
} ;

r_playlist_audio.prototype = {
    play: function(s) {
        
        this.element.play() ;

        if (s) this.element.currentTime = s ;
        
        this.playing = true ;
        this.played = true ;
    },
    
    pause: function() {
        this.element.pause() ;
        
        this.playing = false ;
    },
    
    stop: function() {
        var _audio = this ;
        try {
            _audio.element.pause() ;
            _audio.element.currentTime = 0 ;
            _audio.playing = false ;
            _audio.element.src = _audio.element.src ;            
        } catch(e) {
            
        }
    },
    
    volume: function(s) {
        this.element.volume = s ;
    },
} ;

var r_playlist ; 
(function() {
    r_playlist = function(options) {
        this.defaultOptions = {
            random: false,
            repeat: 'none',  //['none' | 'one' | 'all']
            volume: 0.5,
        } ;
        this.sidCount = 0 ;
        this.items = [] ;
        this.currentTarget = null ;
        this.records = [] ;
        this.options = $.extend(true, {}, this.defaultOptions, options) ;
        
        this._init() ;
        
    } ;
    
    r_playlist.prototype = {
        //初始化
        _init: function() {
            var pg = this ;
            
            if (pg.options.items && pg.options.items.length) {
                $.each(pg.options.items, function(idx, itemObj) {
                    
                    var obj = new r_playlist_audio({
                        sid: pg.sidCount,
                        title: itemObj.title,  
                        src: itemObj.src,
                        onended: function() {
                            pg._afterPlay() ;
                        },
                        onerror: function() {
                            RR.util.toast($.i18n.map["player_notsurpport"]) ;
                            pg._afterPlay() ;
                        },
                        data: itemObj
                    }) ;

                    obj.element.volume = pg.options.volume ;

                    pg.items.push(obj) ;
                    
                    pg.sidCount++ ;
                    
                }) ;
            }

            //每秒回傳currentTarget
            setInterval(function() {
                if ($.isFunction(pg.options.playcallback)) {
                    pg.options.playcallback(pg.currentTarget) ;
                }
            }, 1000) ;
            
        },
        
        //打開隨機模式
        _randomModeOn: function() {
            var pg = this ;
            
            pg.options.random = true ;
            if (pg.currentTarget) pg.currentTarget.recordInRandom = true ;
        },
        
        //關閉隨機模式
        _randomModeOff: function() {
            var pg = this ;
            
            pg.options.random = false ;
            pg._cleanRecords() ;
        },        
        
        //在隨機模式下，選擇
        _randomChoose: function(array) {
            var pg = this ;
            
            var currentIndex = array.length ;

            randomIndex = Math.floor(Math.random() * currentIndex) ;

            return array[randomIndex] ;
        },
        
        _cleanRecords: function() {
            var pg = this ;
            
            pg.records = [] ;
            $.each(pg.items, function(idx, itemObj) {
                itemObj.played = false ;
                itemObj.recordInRandom = false ;
            }) ;
            if (pg.currentTarget) pg._record(pg.currentTarget) ;
        },
        
        _record: function(item, preFlag) {
            var pg = this ;
            
            if (pg.options.random) {
                item.recordInRandom = true ;
            }

            if (pg.records.length>=pg.items.length) return ;
            
            $.each(pg.records, function(idx, itemObj) {
                if (item.sid===itemObj.sid) {
                    pg.records.splice(idx, 1) ;
                    return false ;
                }
            }) ;
            
            if (preFlag) {
                pg.records.unshift(item) ;
            } else {
                pg.records.push(item) ;
            }

        },
        
        _kickOffRecordInNormalItems: function() {  //踢掉不是在隨機模式中紀錄的檔案(紀錄隨機模式中紀錄的檔案)
            var pg = this ;
            
            var newRecords = [] ;
            $.each(pg.records, function(idx, itemObj) {
                if (itemObj.recordInRandom) {
                    newRecords.push(itemObj) ;
                } else {
                    itemObj.played = false ;
                }
            }) ;
            pg.records = newRecords ;
            
        },
        
        _next: function(flag) {
            var pg = this ;
            
            pg.stop() ;
            
            if (pg.options.random) {
                pg._randomNext(flag) ;
            } else {
                pg._normalNext(flag) ;
            }
        },
        
        _randomNext: function(flag) {
            var pg = this ;
            
            if (!pg.currentTarget) {
                pg.currentTarget = pg._randomChoose(pg.items) ;
                pg._afterChangeTarget() ;
                pg.currentTarget.play() ;
                pg._record(pg.currentTarget) ;
                return ;
            }

            $.each(pg.records, function(idx, itemObj) {
                if (pg.currentTarget.sid===itemObj.sid) {
                    targetIdx = idx+1 ;
                    if (targetIdx>=pg.records.length) {  //已經是紀錄檔的最後一筆
                    
                        //嘗試找出recordInRandom false的項目並踢出紀錄
                        if (pg.records.length>=pg.items.length) pg._kickOffRecordInNormalItems() ;
                        
                        var rawsItems = [] ;
                        $.each(pg.items, function(_idx, _itemObj) {
                            if (_itemObj.played===false) {
                                rawsItems.push(_itemObj) ;
                            }
                        }) ;

                        if (!rawsItems.length) {
                            pg.currentTarget = pg.records[0] ;
                        } else {
                            pg.currentTarget = pg._randomChoose(rawsItems) ;
                        }
                        
                    } else {
                        pg.currentTarget = pg.records[targetIdx] ;
                    }
                    return false ;
                }
            }) ;
            
            pg._afterChangeTarget() ;
            pg.currentTarget.play() ;
            pg._record(pg.currentTarget) ;
            
        },
        
        _normalNext: function(flag) {
            var pg = this ;
            
            if (!pg.currentTarget) {
                pg.currentTarget = pg.items[0] ;
                pg._afterChangeTarget() ;
                pg.currentTarget.play() ;
                pg._record(pg.currentTarget) ;
                return ;
            }
            
            var targetIdx ;
            $.each(pg.items, function(idx, itemObj) {
                if (pg.currentTarget.sid===itemObj.sid) {
                    targetIdx = idx+1 ;
                    if (targetIdx>=pg.items.length) {
                        targetIdx = 0 ;
                    }
                    return false ;
                }
            }) ;
            
            pg.currentTarget = pg.items[targetIdx] ;
            pg._afterChangeTarget() ;
            pg.currentTarget.play() ;
            pg._record(pg.currentTarget) ;
        },
        
        _prev: function(flag) {
            var pg = this ;
            
            pg.stop() ;
            
            if (pg.options.random) {
                pg._randomPrev(flag) ;
            } else {
                pg._normalPrev(flag) ;
            }
        },
        
        _randomPrev: function(flag) {
            var pg = this ;

            if (!pg.currentTarget) {
                pg.currentTarget = pg._randomChoose(pg.items) ;
                pg._afterChangeTarget() ;
                pg.currentTarget.play() ;
                pg._record(pg.currentTarget) ;
                return ;
            }
            
            var prerecordFlag = false ;
            
            $.each(pg.records, function(idx, itemObj) {
                if (pg.currentTarget.sid===itemObj.sid) {
                    targetIdx = idx-1 ;

                    if (targetIdx<0) {
                        
                        if (pg.records.length>=pg.items.length) pg._kickOffRecordInNormalItems() ;
                        
                        var rawsItems = [] ;
                        $.each(pg.items, function(_idx, _itemObj) {
                            if (_itemObj.played===false) {
                                rawsItems.push(_itemObj) ;
                            }
                        }) ;

                        if (!rawsItems.length) {
                            pg.currentTarget = pg.records[pg.records.length-1] ;
                        } else {
                            pg.currentTarget = pg._randomChoose(rawsItems) ;
                            prerecordFlag = true ;  //如果有排出新東西，就寫入紀錄
                        }
                        
                    } else {
                        pg.currentTarget = pg.records[targetIdx] ;
                    }
                    return false ;
                }
            }) ;
            
            pg._afterChangeTarget() ;
            pg.currentTarget.play() ;
            if (prerecordFlag) pg._record(pg.currentTarget, true) ;
        },
        
        _normalPrev: function(flag) {
            var pg = this ;
            
            if (!pg.currentTarget) {
                pg.currentTarget = pg.items[0] ;
                pg._afterChangeTarget() ;
                pg.currentTarget.play() ;
                pg._record(pg.currentTarget) ;
                return ;
            }
            
            var targetIdx ;
            $.each(pg.items, function(idx, itemObj) {
                if (pg.currentTarget.sid===itemObj.sid) {
                    targetIdx = idx-1 ;

                    if (targetIdx<0) {
                        
                        if (pg.options.repeat==='none') {
                            targetIdx = 0 ;
                        } else {
                            targetIdx = pg.items.length-1 ;
                        }
                    }
                    return false ;
                }
            }) ;

            pg.currentTarget = pg.items[targetIdx] ;
            pg._afterChangeTarget() ;
            pg.currentTarget.play() ;
            pg._record(pg.currentTarget) ;
        },
        
        _afterPlay: function() {
            var pg = this ;

            if (pg.options.repeat==='none') {
                if (pg.records.length>=pg.items.length) {
                    var _arr = pg.records.slice(-1) ;
                    var lastItem = _arr[0] ;
                    if (lastItem) {
                        if (pg.currentTarget.sid===lastItem.sid) {
                            return false ;  //停住不要動。
                        }
                    }
                }
                pg._next() ;
            }
            else if (pg.options.repeat==='one') {
                pg.stop() ;
                pg.play() ;
            }
            else if (pg.options.repeat==='all') {
                pg._next() ;
            }
        },
        
        _afterChangeTarget: function() {
            var pg = this ;
            
            if ($.isFunction(pg.options.changecallback)) {
                pg.options.changecallback(pg.currentTarget) ;
            }
        },
        
        play: function(s) {
            var pg = this ;

            if (!pg.currentTarget) {
                pg._next() ;
                return ;
            }
            pg.currentTarget.play(s) ;
            pg._record(pg.currentTarget) ;
        },
        
        pause: function() {
            var pg = this ;
            
            if (pg.currentTarget) pg.currentTarget.pause() ;
        },
        
        stop: function() {
            var pg = this ;

            if (pg.currentTarget) pg.currentTarget.stop() ;
        },
        
        randomMode: function(flag) {
            var pg = this ;
            
            if (flag) {
                pg._randomModeOn() ;
            } else {
                pg._randomModeOff() ;
            }
        },
        
        repeatMode: function(flag) {
            var pg = this ;
            
            pg.options.repeat = flag ;
        },
        
        next: function() {
            var pg = this ;
            
            pg._next(true) ;
        },
        
        prev: function() {
            var pg = this ;
            
            pg._prev(true) ;
        },
    
        pick: function(id) {
            var pg = this ;

            pg._cleanRecords() ;
            
            if (pg.items[parseInt(id)-1]) {
                pg.stop() ;
                pg.currentTarget = pg.items[parseInt(id)-1] ;
                pg._afterChangeTarget() ;
                pg.play() ;
            }
        },
    
        add: function(options) {
            var pg = this ;
            
            if (options.items && options.items.length) {
                $.each(options.items, function(idx, itemObj) {
                    
                    var obj = new r_playlist_audio({
                        sid: pg.sidCount,
                        title: itemObj.title,
                        src: itemObj.src,
                        onended: function() {
                            pg._afterPlay() ;
                        },
                        onerror: function() {
                            RR.util.toast($.i18n.map["player_notsurpport"]) ;
                            pg._afterPlay() ;
                        },
                        data: itemObj
                    }) ;

// obj.element.controls = true ;
// $('<hr>').appendTo('body') ;
// $(obj.element).appendTo('body') ;
                    
                    pg.items.push(obj) ;
                    
                    pg.sidCount++ ;
                    
                }) ;
            }
        },
    
        volume: function(s) {
            var pg = this ;

            s = Math.max(0, s) ;
            s = Math.min(1, s) ;

            if (pg.currentTarget) {
                pg.currentTarget.volume(s) ;
            }
        },
        
    } ;
    
})() ;


