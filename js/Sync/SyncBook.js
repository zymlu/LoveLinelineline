//同步(接收)

var SyncData = null;



//同步註記()
function SyncNotes(msg) {

    var connInfoString = msg;

    if (window.DOMParser) {
        var parser = new DOMParser();
        var xml = parser.parseFromString(connInfoString, "text/xml");
        // console.log(xml);

        $(xml).find('ProcedureSlice').each(function() {

            if ($(this).find('UserCreateObjectList').length > 0) {
                $(this).find('UserCreateObjectList').each(function() {

                    if ($(this).find('UserCreateObject').length > 0) {

                        txtNote.SaveList = [];
                        txtCanvas.SaveList = [];
                        colorPen.LineList = [];

                        $(this).find('UserCreateObject').each(function() {

                            var ebookjson = {};

                            if($(this).attr('FormatterType') != undefined) {
                                switch ($(this).attr('FormatterType').split('.').pop()) {
                                    //文字、便利貼
                                    case 'StickyObjectFormatter':

                                        switch ($(this).attr('StickyViewType')) {
                                            //文字
                                            case 'stickyText':

                                                ebookjson = {
                                                    page: MainObj.NowPage,
                                                    id: $(this).attr('Identifier'),
                                                    type: 'txtNote',
                                                    width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                                    height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                                    top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                                    left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                                    value: utf8to16($(this).attr('Contents')),
                                                    StickyViewVisibility: $(this).attr('StickyViewVisibility')
                                                }

                                                if (txtNote.SaveList.length > 0) {
                                                    for (var x = 0; x < txtNote.SaveList.length; x++) {
                                                        if (txtNote.SaveList[x] != undefined) {
                                                            if (txtNote.SaveList[x].id == ebookjson.id) {
                                                                delete txtNote.SaveList[x];
                                                            }
                                                        }
                                                    }
                                                }
                                                    
                                                txtNote.SaveList.push(ebookjson);

                                                break;

                                            //便利貼
                                            case 'stickyDraw':

                                                ebookjson = {
                                                    page: MainObj.NowPage,
                                                    id: $(this).attr('Identifier'),
                                                    type: 'txtCanvas',
                                                    width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                                    height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                                    top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                                    left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                                    StickyViewVisibility: $(this).attr('StickyViewVisibility'),
                                                    points: FindCanvasPoint($(this).find('IntegerPath'), $(this).attr('Identifier'))
                                                }

                                                if (txtCanvas.SaveList.length > 0) {
                                                    for (var x = 0; x < txtCanvas.SaveList.length; x++) {
                                                        if (txtCanvas.SaveList[x] != undefined) {
                                                            if (txtCanvas.SaveList[x].id == ebookjson.id) {
                                                                delete txtCanvas.SaveList[x];
                                                            }
                                                        }
                                                    }
                                                }
                                                    
                                                txtCanvas.SaveList.push(ebookjson);

                                                break;

                                        }

                                        break;

                                    //畫筆
                                    case 'BrushObjectFormatter':
                                        var point = $(this).find('Point');

                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            type: 'pen',
                                            object: {
                                                width: FindPenSize(point, $(this).attr('PixelSize'))[0],
                                                height: FindPenSize(point, $(this).attr('PixelSize'))[1],
                                                left: FindPenSize(point, $(this).attr('PixelSize'))[2],
                                                top: FindPenSize(point, $(this).attr('PixelSize'))[3],
                                                penwidth: $(this).attr('PixelSize'),
                                                color: argbToRGB($(this).attr('ForeColor')),
                                                opacity: $(this).attr('Opacity')
                                            },
                                            page: MainObj.NowPage,
                                            points: FindPenSize(point, $(this).attr('PixelSize'))[4]
                                        }

                                        colorPen.LineList.push(ebookjson);
                                        
                                        break;

                                }
                            } else {
                                $('.NoteBox').remove();
                            }

                            ReplyNote(MainObj.NowPage);
                            ReplyCanvas(MainObj.NowPage);
                            DrawPen(MainObj.NowPage);
                        })
                    }
                })
            }
        })
    }
}

//同步取得畫筆的尺寸及點
function FindPenSize(points, penwidth) {

    if (points.length > 0) {

        var pointX = [];
        var pointY = [];
        var PointList = [];

        $(points).each(function() {

            var X = Number($(this).attr('X'));
            var Y = Number($(this).attr('Y'));

            pointX.push(X);
            pointY.push(Y);

            PointList.push({ 'X': X, 'Y': Y });

        });
    }

    //將線的座標由小至大排序，才能知道canvas的大小
    var ListX = pointX.sort(function(a,b) { return a - b; });
    var minX = ListX[0];
    var maxX = ListX[ListX.length - 1];

    var ListY = pointY.sort(function(a,b) { return a - b; });
    var minY = ListY[0];
    var maxY = ListY[ListY.length - 1];

    var width = maxX - minX + penwidth * 2;
    var height = maxY - minY + penwidth * 2;
    var left = minX - penwidth;
    var top = minY - penwidth;

    return [width, height, left, top, PointList];
}

//取得便利貼畫線的座標
function FindCanvasPoint(list, id) {

    var tmppath = [];

    for (var i = 0; i < list.length; i++) {
        tmppath[i] = [];
        $(list[i]).find('Point').each(function() {

            var X = parseInt($(this).attr('X'));
            var Y = parseInt($(this).attr('Y'));
            var Id = id;

            tmppath[i].push({ X: X, Y: Y, id: Id });
        })
    }

    return tmppath;
}

//同步書的功能
function SyncBook(data) {

    //傳送端雖然只有送一個訊息，但接收端有時會收到一個以上，這樣判斷時會重複執行動作
    //因此先將data紀錄再SyncData裡，每次都判斷有沒有跟上一次一樣，如果一樣就不執行動作
    if (SyncData == data) return;
    SyncData = data;

    data = data.split(',');

    var obj = $('#' + data[1])[0];

    if (Number(data[0]) == MainObj.NowPage) {
        switch (data[2]) {

            //影片播放
            case 'START':
                if (obj.paused) {
                    obj.play();
                }
                break;

            //影片暫停
            case 'PAUSE':
                if (!obj.paused) {
                    obj.pause();
                }
                break;

            //影片同步全螢幕無法用程式來控制，因此只能用css方式將影片撐到最大(fullvideo)
            //必須要將本來的left、top記住，這樣同步關閉影片全螢幕時才能回到原本的位置
            //影片放大
            case 'FULLSCREEN_MODE':

                $(obj).addClass('fullvideo');
                $(obj).attr('left', obj.offsetLeft);
                $(obj).attr('top', obj.offsetTop);
                $(obj).css({
                    'left': 0,
                    'top': 0
                })

                break;

            //影片縮小
            case 'NORMAL_MODE':

                $(obj).removeClass('fullvideo');
                $(obj).css({
                    'left': $(obj).attr('left') + 'px',
                    'top': $(obj).attr('top')+ 'px'
                })

                break;

            //遮罩貼紙、圖影定位、輔助彈跳視窗
            case 'TAP':

                $(obj).click();

                break;

            //圖影定位、輔助彈跳視窗關閉
            case 'CLOSE':

                //圖影定位
                if ($('#Locaton' + data[1])[0] != undefined) {
                    $('#Locaton' + data[1]).remove();

                //輔助彈跳視窗關閉
                } else if ($('#IntroDiv' + data[1])[0] != undefined) {
                    $('#IntroDiv' + data[1]).remove();
                    $('#Voice').remove();
                }

                break;

            //測驗正確回饋視窗關閉
            case 'CLOSE_CORRECT_MESSAGE_WINDOW':

                $('#DivCorrectMsg').toggle();

                break;

            //測驗錯誤回饋視窗關閉
            case 'CLOSE_ERROR_MESSAGE_WINDOW':

                $('#DivErrorMsg').toggle();

                break;

            default:
                var newdata = data[2].split(':');

                switch (newdata[0]) {

                    //同步影片時間
                    case 'JUMP':

                        obj.currentTime = newdata[1] / 1000;

                        break;

                    //同步360
                    case 'XFileName':
                        var cxt = obj.getContext('2d');
                        resizeCanvas(obj, cxt);
                        var img = new Image();
                        img.onload = function() {
                            cxt.drawImage(this, 0, 0, obj.width, obj.height);
                        }
                        img.src = 'Resource/' + setExt(newdata[1]);

                        //被控端同步時，setInterval還是持續在運作的，而是依照全域變數Rotation.SrcNum在改變
                        //因此要判斷同步變的圖是HamaList中的第幾個，同時去改變Rotation.SrcNum的值，360運作才會順暢
                        $(HamaList[MainObj.NowPage].Objects).each(function() {
                            if (this.ImageList != undefined) {
                                var imgList = this.ImageList.Images;
                                for (var i = 0; i < imgList.length; i++) {

                                    if (imgList[i].XFileName == newdata[1]) {
                                        Rotation.SrcNum[MainObj.NowPage] = i;
                                        break;
                                    }
                                }
                            }
                        })

                        break;

                    //同步連連看
                    case 'VERIFY':
                        var from = newdata[1].split(';')[0];
                        var to = newdata[1].split(';')[1];

                        var list = HamaList[Quiz.Page].Objects;

                        $(list).each(function() {
                            if (this.Identifier == from) {
                                Quiz.Objs.From = this;
                            }
                        })

                        $(list).each(function() {
                            if (this.Identifier == to) {
                                Quiz.Objs.To = this;
                            }
                        })

                        //一般連連看
                        if (Quiz.Objs.From.FormatterType != 'ImageLayer') {

                            Quiz.Canvas = document.createElement('canvas');
                            Quiz.Canvas.id = 'canvas';
                            $('body').append(Quiz.Canvas);
                            Quiz.Canvas.width = $('#CanvasLeft').width();
                            Quiz.Canvas.height = $('#CanvasLeft').height();
                            $('#canvas').css({
                                'position': 'absolute',
                                'left': MainObj.CanvasL,
                                'top': MainObj.CanvasT
                            });

                            Quiz.Cxt = Quiz.Canvas.getContext("2d");

                            ConnectorUp(event, true);

                        //圖片連連看
                        } else {
                            imgDragUp(event, true);
                        }

                        break;

                    //同步輔助視窗位置
                    case 'MOVETO':

                        var canvasleft = Number($('#Introduction' + data[1]).css('left').split('px')[0]);
                        var canvastop = Number($('#Introduction' + data[1]).css('top').split('px')[0]);

                        var left = (Number(newdata[1].split(';')[0]) * MainObj.Scale * 1000) - canvasleft + MainObj.CanvasL;
                        var top = (Number(newdata[1].split(';')[1]) * MainObj.Scale * 1000) - canvastop + MainObj.CanvasT;

                        $('#IntroDiv' + data[1]).css({
                            'position': 'absolute',
                            'left': left + 'px',
                            'top': top + 'px'
                        })

                        break;

                    //同步塗抹
                    default:
                        SyncErasing(obj, data[2]);
                }

        }
    }
}

//接收端同步縮放平移[scale, scroll]
function SyncZoomAndScroll(data) {
    // console.log(data);
    Html5WirteLog('ZoomData: ' + data);

    var scale = Number(data[0]);

    var scroll = data[1].split(',');
    var scrollX = scroll[0].split('{')[1];
    var scrollY = scroll[1].split('}')[0];

    ZoomAttrPosition();

    //同步縮放
    zoomSetting(scale);
    ToolBarList.ZoomScale = scale;

    //同步平移
    ScrollEBook(scale, Number(scrollX), Number(scrollY));

    if (scale == 1) {
        $('.dragCanvas').remove();

        //回復resize
        $(window).resize(resizeInit);

        GalleryStartMove();
        resize_canvas();
        drawCanvas(MainObj.NowPage);
        setWaterMark();
    }
}

//接收端同步平移
function ScrollEBook(scale, scrollX, scrollY) {

    var OldWidth = MainObj.NewCanvasWidth;
    var OldHeight = MainObj.NewCanvasHeight;

    //計算縮放後與縮放前的差距
    var scaleWidth = (OldWidth * scale - OldWidth) / 2;
    var scaleHeight = (OldHeight * scale - OldHeight) / 2;

    //這是從傳送端反推回來的公式
    //最後再扣掉縮放的差距，就是真正的位置
    w1 = (OldWidth * scale / 2) - (scrollX * OldWidth) - (OldWidth / 2) - scaleWidth;
    h1 = (OldHeight * scale / 2) - (scrollY * OldHeight) - (OldHeight / 2) - scaleHeight;


    //同步平移邏輯是，先將蓋在外層拖動的canvas移動
    //再計算dragCanvas跟背景的位移值，然後先移動當頁所有物件，最後再移動背景
    //由於載具上面的(0,0)是從白色的部分開始算
    //而HTML5是連白色部分都算進去，因此要加上白色部分
    $('.dragCanvas').css({
        'left': w1 + MainObj.CanvasL,
        'top': h1 + MainObj.CanvasT,
        'z-index': 100
    })

    ZoomDragScroll();
}


