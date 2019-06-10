//影片





//影片若是畫在canvas上就沒有控制列，因此還是要video tag
function NewVideo(obj, scale) {

    if ($('#' + obj.Identifier)[0] == null) { //確認是否已有新增過同樣的video

        var NewVideo = document.createElement('video');
        NewVideo.id = obj.Identifier;
        NewVideo.width = obj.Width * scale;
        NewVideo.height = obj.Height * scale;
        var Left = obj.Left * scale;
        var Top = obj.Top * scale;
        $('#HamastarWrapper').append(NewVideo);

        $('#' + NewVideo.id).attr('class', 'video');
        // $('#' + NewVideo.id).addClass('canvasObj');
        $('#' + NewVideo.id).css({
            'position': 'absolute',
            'cursor': 'pointer',
            'left': Left + MainObj.CanvasL,
            'top': Top + MainObj.CanvasT,
            'object-fit': 'fill'
        })

        NewVideo.src = 'Resource/' + setExt(obj.VideoFileName);

        //是否有控制列
        if (obj.SliderBar == 'true') {
            $('#' + NewVideo.id).attr('controls', true);

        } else {
            $('#' + NewVideo.id).click(function(e) {
                e.preventDefault();
                if (this.paused) {
                    this.play();
                } else {
                    this.pause();
                }
            });
        }

        //是否自動撥放
        if (obj.AutoPlay == '1') {
            $('#' + NewVideo.id).attr('autoplay', true);
        }

        //是否結束後淡出
        if (obj.Fadeout == 'true') {
            $('#' + NewVideo.id).on('ended', function() {
                // done playing
                $(this).fadeOut(400, function() {
                    $(this).remove();
                })
            });
        }

        SyncVideoSet(NewVideo.id);
    }
}

//同步影片事件
function SyncVideoSet(id) {
    //影片start
    $('#' + id).on('play', function() {

        // BGMusicPause();

        var message = MainObj.NowPage + ',' + id + ',START';
        rmcallBookSyncMessage(message);
    })

    //影片pause
    $('#' + id).on('pause', function() {

        // BGMusicPlay();

        var message = MainObj.NowPage + ',' + id + ',PAUSE';
        rmcallBookSyncMessage(message);
    })

    //影片放大縮小
    $('#' + id).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
        var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        var event = state ? 'FullscreenOn' : 'FullscreenOff';

        SyncSendVideoFullScreen(id, event);
    });

    //影片放大縮小(IE11)
    document.addEventListener('MSFullscreenChange', function(e) {
        var state = document.msFullscreenElement;
        var event = state ? 'FullscreenOn' : 'FullscreenOff';

        SyncSendVideoFullScreen(id, event);
    });

    //影片時間不能一直傳，載具會怪怪的
    $('#' + id).click(function(e) {
        e.preventDefault();
        // $('#' + id).on('timeupdate', function() {
            var message = MainObj.NowPage + ',' + id + ',JUMP:' + (this.currentTime * 1000);
            rmcallBookSyncMessage(message);
        // });
    })
}

//傳送端同步影片全螢幕狀態
function SyncSendVideoFullScreen(id, event) {
    if(event == 'FullscreenOn') {
        var message = MainObj.NowPage + ',' + id + ',FULLSCREEN_MODE';
        rmcallBookSyncMessage(message);
    } else {
        var message = MainObj.NowPage + ',' + id + ',NORMAL_MODE';
        rmcallBookSyncMessage(message);
    }
}



