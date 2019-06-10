//全域變數
var MainObj = {
    IsTwoPage: false,
    IsRight: true, //向右或向左翻的參數(true是向右，false是向左)
    NowPage: 0,
    LeftPage: 0,
    RightPage: -1,
    CanvasWidth: 1024,
    CanvasHeight: 768,
    NewCanvasWidth: 0,
    NewCanvasHeight: 0,
    CanvasL: 0,
    CanvasT: 0,
    Scale: 0,
    NextPage: false,
    PrePage: false,
    AllObjslist: [], //存入整本書的物件(除了背景以外)
    AllBackground: [], //存入整本書的背景圖
    ImgCount: 0,
    BGMusic: null,

    ReadStartTime: 0, //閱讀紀錄開始時間
    ReadEndTime: 0, //閱讀紀錄結束時間

    Loaded: false, //紀錄圖片是否已載入
    FirstLoad: true,
    automaticPage: null, // 自動翻頁的timeout存進來，翻頁的時候要clear
    saveList: [],
    trashList: [],
    isPinch: false,
    dragCanvasPosition: {
        left: 0,
        top: 0
    }
};


//書開始前會先跑onload的function
//將xml解析到HamaList
window.onload = OnLoad();

function OnLoad() {
    JsonToHamaList();


    //測驗計分
    if (BookList.BookInfoList != undefined) {

        if (BookList.BookInfoList.ExamInfo.IsExam == '1') {
            Quiz.IsExam = true;
        }

        //隨機頁數
        if (Number(BookList.BookInfoList.ExamInfo.RandomQuizCount) > 0) {
            Quiz.IsRandomQuiz = true;
            getRandomQuiz();
        }
    }

    LoadAllObjs();
    LoadBackgroundImage();

    setWaterMark();

    var syncXML = toSyncXML(true);
    var message = '[scmd]' + Base64.encode('pgna' + syncXML);
    rmcall(message);
}

//書ready
$(document).ready(function () {

    console.log("%c 此產品的使用權係授權予動雲端客戶使用 ", "color: red");
    console.log("%c 版權所有 哈瑪星科技股份有限公司 ", "color: blue");
    console.log("%c Copyright (c) Hamastar Technology CO., LTD. All rights reserved.", "color: blue");
    console.log("%c eBookVersion : " + eBookVersion, "color: blue");

    MainObj.ReadStartTime = new Date();

    (function ($) {
        $.UrlParam = function (name) {
            //宣告正規表達式
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            /*
             * window.location.href 獲取URL ?之後的參數(包含問號)
             * substr(1) 獲取第一個字以後的字串(就是去除掉?號)
             * match(reg) 用正規表達式檢查是否符合要查詢的參數
             */
            var r = window.location.href.substr(1).match(reg);
            //如果取出的參數存在則取出參數的值否則回傳null
            if (r != null) return unescape(r[2]);
            return null;
        }
    })(jQuery);
    /*
     *UrlParam取得網址參數需帶入參數名稱
     *UrlParam(參數名稱)
     */
    Exam.LoginID = $.UrlParam('LoginID'); //登入帳號
    Exam.FileName = $.UrlParam('FileName'); //書名

    CommandToWPF('RequestExternalInformation');
    BookInit();

    BackgroundMusicSetting();

    resize_canvas();
    drawCanvas(MainObj.NowPage);
    setWaterMark();

    GalleryEvent();
    if (!isApp) {
        getFaceModuleList();
    }
    getItem(BookList.EBookID);
    callSLcomplete();

    //indexDB
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    var request;
    if (indexedDB != undefined) {

        request = indexedDB.open("ebook", 1); //db name
        request.onsuccess = function (evt) {
            // 將db暫存起來供以後操作
            db = request.result;
        };

        request.onerror = function (evt) {
            console.log("IndexedDB error: " + evt.target.errorCode);
        };

        request.onupgradeneeded = function (evt) {
            var objectStore = evt.currentTarget.result.createObjectStore("ebook", {
                keyPath: "id",
                autoIncrement: true
            }); //table name

            objectStore.createIndex("BookID", "BookID", {
                unique: true
            });
            objectStore.createIndex("Content", "Content", {
                unique: false
            });

        };
    } else {
        // alert('此瀏覽器不支援本機註記儲存');
        window.external.requestLoadNoteXML();
    }

    $('*').on("click mousedown mousemove mouseup focus blur keydown change touchstart touchmove touchend touchcancel mousewheel", function (e) {
        window.event = e;
    });

    //APP上縮放改為滑鼠滾輪
    // if (rmcallBookSyncMessage('')) {
    //滾輪縮放事件
    $('#HamastarWrapper')[0].addEventListener("mousewheel", function (e) {
        if (isMouseInText) return;

        //delta=1 : 放大   delta=-1 : 縮小
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        if (delta == 1 && ToolBarList.ZoomScale < 3) {
            zoomIn();
        } else if (delta == -1 && ToolBarList.ZoomScale > 1) {
            zoomOut();
        }

    }, false);
    // }

    //是否為測驗模式或一般正確錯誤訊息模式 (是否有送出測驗按鈕)
    if (Quiz.IsExam) {
        // BookAlertShow('開始測驗');

        Quiz.StartTime = getRecordTime();

        var examTime = BookList.BookInfoList.ExamInfo.TestTime.split(':');
        examTime = Number(examTime[0]) * 60 + Number(examTime[1]);

        //測驗時間
        if (examTime > 0) {
            $('.allTimer').css("display", "block");
            $('.allTimer').css("z-index", "1000");

            //append Timer
            var timer = document.createElement('div');
            $(timer).attr('data-seconds-left', examTime);
            $(timer).addClass('timer');
            $(timer).css({
                'position': 'absolute',
                'float': 'left',
                'margin-left': '30%'
            })

            $('.timerbtndiv').append(timer);

            $(function () {
                $('.timer').startTimer({
                    onComplete: function (element) {

                        //由於有些測驗的參數要有進過那個頁面才會產生，避免沒有進過頁面就測驗結束
                        //這邊把全部頁面run過一遍，最後在跳回現在頁面
                        for (var page = 0; page < HamaList.length; page++) {
                            if (page != MainObj.NowPage) { //當頁不用再run了
                                drawCanvas(page);
                            }
                        }
                        gotoPage(MainObj.NowPage);

                        ExamFinish();
                        element.addClass('is-complete');
                    }
                });
            })

            $('.allTimer').show().draggable({
                //多拖動或是click判斷
                start: function (event, ui) {
                    $('.allTimer').addClass('noclick');
                }
            });
        }

        $('#btnConfirm').click(function (e) {
            e.preventDefault();
            unblockUi();

            if (BookList.BookInfoList.ExamInfo.CorrectMistake == 'false') {
                window.close();
            } else {
                errorList();
            }

        });
    }

    NewOffset();
    ChapterListSet();

    $('#HamastarWrapper')[0].addEventListener('touchmove', function (e) {
        var target = e.target;

        // 在 scroller 上滑动，阻止事件冒泡，启用浏览器默认行为。
        if (!target.classList) return;
        e.preventDefault();
    });

    $(document).ajaxStart(function () {
        blockView.open();
    });

    $(document).ajaxStop(function () {
        blockView.close();
    });

    var tmp = location.search.replace('?', '').split('&').map(function (x) {
        return x.split('=').map(function (y) {
            return decodeURIComponent(y);
        });
    });
    var token = tmp.filter(function (x) {
        if (x[0] === 'token2') {
            return x;
        }
    });
    if (token.length) {
        MainObj.token = token[0][1];
    }

    getNote();

    pinchSet('HamastarWrapper');
    palmToggle();

});

// 掌型切換
function palmToggle() {
    $('#HamastarWrapper').on('mousedown', function (e) {
        e.preventDefault();
        if (ToolBarList.ZoomScale > 1) {
            if (e.buttons == 4) {
                MainObj.dragCanvasPosition.left = $('.dragCanvas').offset().left;
                MainObj.dragCanvasPosition.top = $('.dragCanvas').offset().top;
                $('.dragCanvas').toggle();
                if ($('.dragCanvas').css('display') == 'none') {
                    $('#palm').css('background-image', 'url(ToolBar/arrow.png)');
                } else {
                    $('#palm').css('background-image', 'url(ToolBar/palmbefore.png)');
                }
            }
        } else {
            $('#palm').css('background-image', 'url(ToolBar/arrow.png)');
        }
    })
}

// 多指縮放
function pinchSet(id) {
    var wrapper = document.getElementById(id);
    var hammer = new Hammer(wrapper);
    hammer.get('pinch').set({
        enable: true
    });

    hammer.on('pinchstart', function (e) {
        GalleryStopMove();
        MainObj.isPinch = true;
    });

    hammer.on('pinchout', function (e) {
        zoomIn(e.scale);
        NewOffset();
    });

    hammer.on('pinchin', function (e) {
        if (ToolBarList.ZoomScale == 1) return;
        zoomOut(true);
        NewOffset();
        changeAllBtnToFalse(navigatorToolBar);
    });

    hammer.on('pinchend pinchcancel', function (e) {
        GalleryStartMove();
        MainObj.isPinch = false;
    });
}

var getPixelRatio = function (context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};

// function resizeCanvas(canvas, ctx) {
//     // do something...
// }

function resizeCanvas(canvas, ctx) {

    // var ratio = getPixelRatio(ctx);

    // var oldWidth = canvas.width;
    // var oldHeight = canvas.height;

    // canvas.width = oldWidth * ratio;
    // canvas.height = oldHeight * ratio;

    // canvas.style.width = oldWidth + 'px';
    // canvas.style.height = oldHeight + 'px';

    // ctx.scale(ratio, ratio);
}

//視窗大小變換
$(window).resize(resizeInit);

//視窗關閉前回傳閱讀紀錄(三總)
window.onbeforeunload = function () {

    MainObj.ReadEndTime = new Date();

    var serverURL = document.location.protocol + '//' + document.domain;
    var examURL = '/webservice/ReadRecord.asmx/InsertReadtimeByString';

    // console.log("serverURL: " + serverURL);

    var x2js = new X2JS();
    var obj = {
        Record: {
            UserData: {
                LoginID: Exam.LoginID,
                PassWord: Exam.PassWord,
                Token: ''
            },
            Books: {
                Book: {
                    '_ID': Exam.FileName + '.html5',
                    '_ReadCount': '1',
                    '_ReadTime': ((MainObj.ReadEndTime - MainObj.ReadStartTime) / 1000).toFixed(0)
                }
            }
        }
    }
    var data = x2js.json2xml_str(obj).replace(/'/g, '"');

    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: serverURL + examURL,
        async: false,
        //要傳過去的值
        data: "doc=" + data,
        dataType: "xml",
        //成功接收的function
        success: function (oXml, xhr) {
            console.log("=====Success=====");

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("=====Error=====");

        }
    });

    // clibraryplus關書前戳API
    var tmp = location.search.replace('?', '').split('&').map(function (x) {
        return x.split('=').map(function (y) {
            return decodeURIComponent(y);
        });
    });
    var domain = tmp.filter(function (x) {
        if (x[0] === 'domain') {
            return x;
        }
    });
    var token = tmp.filter(function (x) {
        if (x[0] === 'token2') {
            return x;
        }
    });
    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: ReceiveList ? ReceiveList.HostURL : domain[0][1] + '/api/File/log?token=' + token[0][1],
        async: false,
        dataType: "json",
        //成功接收的function
        success: function (oXml, xhr) {
            console.log("=====Success=====");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("=====Error=====");
        }
    });
};


function resizeInit() {
    $('#Narration').remove();
    resize_canvas();
    drawCanvas(MainObj.NowPage);
    setWaterMark();
    ResizeTouch();
    $('.ErrorCanvas').remove();
    AdditionalReset();
    RotationImageReset();
    ScrollReset();

    //頁籤
    if (ToolBarList.TapList[MainObj.NowPage]) {
        tapLayer();
    }

    //當頁的註記回復
    DrawPen(MainObj.NowPage);
    ReplyNote(MainObj.NowPage);
    ReplyCanvas(MainObj.NowPage);
    ReplyImage(MainObj.NowPage);
    replyComment(MainObj.NowPage);

    NewOffset();

}

//開書時，書的初始化
function BookInit() {
    MainObj.CanvasWidth = BookList.eBookWidth;
    MainObj.CanvasHeight = BookList.eBookHeight;

    //判斷是否為雙頁
    if (MainObj.CanvasHeight > MainObj.CanvasWidth) {
        MainObj.IsTwoPage = true;
        $('#CanvasRight').css('display', 'block');
    } else {
        MainObj.IsTwoPage = false;
        $('#CanvasRight').css('display', 'none');
    }

    //判斷是向左或向右翻
    if (BookList.PageTurnMode == 'left') {
        MainObj.IsRight = false;
    }
}

//嵌入浮水印
function setWaterMark() {

    if (BookList.WatermarkType == 'None') return;

    var watermarkImg = new Image();
    watermarkImg.id = 'WaterMark';
    watermarkImg.src = 'data:image/png;base64,' + BookList.WatermarkImage.Value;

    //先記錄浮水印圖的大小到BookList裡
    if ($('#WaterMark')[0] == undefined) {
        BookList.WaterMarkWidth = watermarkImg.width;
        BookList.WaterMarkHeight = watermarkImg.height;
    }

    $('#WebBox').before(watermarkImg);

    //resize
    var scale = MainObj.Scale;
    watermarkImg.width = BookList.WaterMarkWidth * scale;
    watermarkImg.height = BookList.WaterMarkHeight * scale;

    console.log(watermarkImg.width + ',' + watermarkImg.height);

    switch (BookList.WatermarkType) {

        case 'Default': //預設浮水印

            $(watermarkImg).css({
                'position': 'absolute',
                'right': MainObj.CanvasL,
                'top': MainObj.CanvasT,
                'z-index': '1000',
                'pointer-events': 'none'
            })

            break;

        case 'Custom': //自訂浮水印

            $(watermarkImg).css({
                'position': 'absolute',
                'z-index': '1000',
                'pointer-events': 'none'
            })

            //自訂左右位置
            if (BookList.WatermarkHorizontalAlignment == 'Right') {
                $(watermarkImg).css('right', MainObj.CanvasL)
            } else {
                $(watermarkImg).css('left', MainObj.CanvasL)
            }

            //自訂上下位置
            if (BookList.WatermarkVerticalAlignment == 'Top') {
                $(watermarkImg).css('top', MainObj.CanvasT)
            } else {
                $(watermarkImg).css('bottom', MainObj.CanvasT)
            }

            break;
    }

}

//第一次開書先載入整本書的全部物件
function LoadAllObjs() {
    for (var x = 0; x < HamaList.length; x++) {

        //將HamaList的Objects依照zIndex重新排序(由最底層至最上層)
        HamaList[x].Objects.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });

        for (var y = 0; y < HamaList[x].Objects.length; y++) {
            var obj = {};
            obj.Page = x;
            obj.Identifier = HamaList[x].Objects[y].Identifier;
            obj.Type = HamaList[x].Objects[y].FormatterType;

            if (HamaList[x].Objects[y].FormatterType == 'ImageLayer') {
                var img = new Image();
                img.src = "Resource/" + setExt(HamaList[x].Objects[y].XFileName);

                obj.Image = [];
                obj.Image.push(img);
            }
            MainObj.AllObjslist.push(obj);
        }
    }
}

//第一次開書載入整本書的全部背景圖片
function LoadBackgroundImage() {
    // 剛開書時會抓不到背景圖片，導致畫面空白，因此在這先載入畫上第一頁背景
    if (HamaList[0].BackgroundImage != '') {
        var Backgroundimg = new Image();
        Backgroundimg.onload = function () {

            var canvas = $('#CanvasLeft')[0];
            if (canvas != undefined) {
                var cxt = canvas.getContext("2d");
                cxt.drawImage(Backgroundimg, 0, 0, MainObj.NewCanvasWidth, MainObj.NewCanvasHeight);
            }

        }
        Backgroundimg.src = "Resource/" + setExt(HamaList[0].BackgroundImage);
    }

    for (var i = 0; i < HamaList.length; i++) {
        var BackgroundList = {};
        if (HamaList[i].BackgroundImage != '') {
            var img = new Image();
            img.src = "Resource/" + setExt(HamaList[i].BackgroundImage);
            BackgroundList.img = img;
        }
        MainObj.AllBackground.push(BackgroundList);
    }
}

function resize_canvas() {
    RotationImageReset();
    SlideShowReset();
    ScrollReset();
    //每次翻頁或跳頁，要將另外新增的canvas砍掉，包括輔助視窗也是
    $('.canvasObj').remove();
    $('.canvasPosition').remove();
    $('.IntroDiv').remove();
    $('.Text').remove();
    $('#WaterMark').remove();
    //判斷是否為全螢幕模式
    //如果否則砍掉video
    //如果是則不能砍掉video，不然全螢幕會跳掉
    if (fullScreen) {
        $('.video').remove();
        $('.iframeObj').remove();
        $('.videoPosition').remove();
    } else {
        if (getFSWindow() == null) {
            $('.video').remove();
            $('.iframeObj').remove();
            $('.videoPosition').remove();
        }
    }
    $('#DivShortAnswer').css({
        'position': 'absolute',
        'width': $('#CanvasGallery').width(),
        'height': $('#CanvasGallery').height(),
        'left': MainObj.CanvasL,
        'top': MainObj.CanvasT
    });

    var oldCanvasWidth = MainObj.CanvasWidth;
    var oldCanvasHeight = MainObj.CanvasHeight;

    var WindowWidth = window.innerWidth; //視窗寬度
    var WindowHeight = window.innerHeight; //視窗高度

    if (MainObj.IsTwoPage || oldCanvasHeight > oldCanvasWidth) {
        //雙 -> 單
        if (WindowHeight > WindowWidth && oldCanvasHeight > oldCanvasWidth) {

            $('#CanvasRight').css('display', 'none');
            MainObj.IsTwoPage = false;
            PageSetting(1);

            //單 -> 雙
        } else {
            $('#CanvasRight').css('display', 'block');

            MainObj.IsTwoPage = true;
            if (MainObj.NowPage % 2 > 0) {
                MainObj.NowPage++;
            }

            PageSetting(2);
        }
    } else {
        PageSetting(1);
    }

    MainObj.CanvasL = $('#CanvasGallery')[0].offsetLeft;
    MainObj.CanvasT = $('#CanvasGallery')[0].offsetTop;

    //初始化移動的left,top
    var sliderOffset = $('#CanvasLeft').offset();
    syncZoomSlider.initSliderLeft = sliderOffset.left;
    syncZoomSlider.initSliderTop = sliderOffset.top;
    syncZoomSlider.afterSliderLeft = undefined;
    syncZoomSlider.afterSliderTop = undefined;

    var canvasL = document.getElementById('CanvasLeft');
    var ctxL = canvasL.getContext('2d');
    resizeCanvas(canvasL, ctxL);
    var canvasR = document.getElementById('CanvasRight');
    var ctxR = canvasR.getContext('2d');
    resizeCanvas(canvasR, ctxR);

    // $('.pageIcons_div').css('height', window.innerHeight);
    if ($('#canvasPad')[0]) {
        $('#canvasPad')[0].width = $(window).width();
        $('#canvasPad')[0].height = $(window).height();
    }
    if ($('#canvasEraser')[0]) {
        $('#canvasEraser')[0].width = $(window).width();
        $('#canvasEraser')[0].height = $(window).height();
    }

}

//頁面設定(pageValue == 1為單頁，2為雙頁)
function PageSetting(pageValue) {

    var oldCanvasWidth = MainObj.CanvasWidth * pageValue;
    var oldCanvasHeight = MainObj.CanvasHeight;

    var WindowWidth = window.innerWidth; //視窗寬度
    var WindowHeight = window.innerHeight; //視窗高度

    //章節模式
    if (ToolBarList.IsChapter) {
        WindowWidth -= 216; //扣掉章節menu的width，再扣掉書的左右各8px的間隙
    }

    var NewWidthScale = WindowWidth / oldCanvasWidth; //寬度比例
    var NewHeightScale = WindowHeight / oldCanvasHeight; //高度比例

    var canvasLeft = document.getElementById('CanvasLeft');
    var canvasRight = document.getElementById('CanvasRight');
    var CanvasGallery = document.getElementById('CanvasGallery');

    if (NewWidthScale >= NewHeightScale) {

        canvasRight.width = canvasLeft.width = oldCanvasWidth * NewHeightScale / pageValue;
        canvasRight.height = canvasLeft.height = WindowHeight;

        MainObj.Scale = NewHeightScale;

    } else if (NewWidthScale < NewHeightScale) {

        canvasRight.width = canvasLeft.width = WindowWidth / pageValue;
        canvasRight.height = canvasLeft.height = oldCanvasHeight * NewWidthScale;

        MainObj.Scale = NewWidthScale;
    }

    // $(canvasLeft).css({ 'width': canvasLeft.width, 'height': canvasLeft.height});
    // $(canvasRight).css({ 'width': canvasRight.width, 'height': canvasRight.height});

    MainObj.NewCanvasWidth = canvasLeft.width;
    MainObj.NewCanvasHeight = CanvasGallery.height = canvasLeft.height;
    CanvasGallery.width = canvasLeft.width * pageValue;

    //Canvas置中
    var Left = (WindowWidth - CanvasGallery.width) / 2;
    var Top = (WindowHeight - CanvasGallery.height) / 2;

    //章節模式
    if (ToolBarList.IsChapter) {
        Left += 208; //加上章節menu的width，再加上書的8px的間隙
    }

    if (MainObj.IsTwoPage) {
        canvasSetting(Left, Top);
    } else {
        $('#CanvasLeft').css({
            'left': Left + 'px',
            'top': Top + 'px'
        });
        $('#CanvasLeft').attr({
            'left': Left,
            'top': Top
        });
    }

    $('#CanvasGallery').css({
        'left': Left + 'px',
        'top': Top + 'px'
    });

    $('.canvas').css('position', 'absolute');

    //所有物件及背景都放在HamastarWrapper裡
    $('#HamastarWrapper').css({
        'position': 'absolute',
        'width': WindowWidth,
        'height': WindowHeight,
    })

}

//判斷左右翻，將canvas左右對調，用left的值來控制
function canvasSetting(left, top) {
    if (MainObj.IsRight) {
        var PageLeft = [0, $('#CanvasLeft').width()];
    } else {
        var PageLeft = [$('#CanvasLeft').width(), 0];
    }

    $('#CanvasLeft').css({
        'left': left + PageLeft[0] + 'px',
        'top': top + 'px'
    });
    $('#CanvasRight').css({
        'left': left + PageLeft[1] + 'px',
        'top': top + 'px'
    });
}

//跳頁
function gotoPage(page, isTurnPage, isNext) {
    if (isTurnPage) { // 翻頁狀態
        if (isNext) { // 下一頁
            if (HamaList[MainObj.NowPage].SwipeToNextSliceEnable == 0) {
                alert('禁止往後翻頁');
                return;
            }
        } else { // 上一頁
            if (HamaList[MainObj.NowPage].SwipeToNextSliceEnable == 0) {
                alert('禁止往前翻頁');
                return;
            }
        }
    }

    if (page >= 0) { //判斷為第一頁或最後一頁

        if (page >= HamaList.length) {
            BookAlertShow('此頁為最後一頁');
            return;
        }

        $('.dragCanvas').remove();
        ToolBarList.ZoomScale = 1;

        //翻頁關掉旁白
        $('#Narration').remove();
        $('#Voice').remove();

        //每次都先把HamaStar的click事件砍掉，才不會重複click事件
        //沒有動畫的頁面也不會有Click事件
        $('#HamastarWrapper').unbind('click');

        // 搜外網按鈕
        $('.searchweb_btn').remove();

        // 超連結按鈕
        $('.link_btn').remove();

        // 檔案
        $('.fileObj').remove();
        $('.videoFile').remove();

        if (MainObj.IsTwoPage) {
            if (page % 2 == 1) page = page + 1;
        }

        // SaveMark();

        resize_canvas();

        //翻頁後保存資訊
        SaveNote();
        SaveCanvas();
        SaveRecording();

        AdditionalReset();
        RotationImageReset();
        SlideShowReset();
        ScrollReset();
        ResetSelect();
        QuizInit();
        txtNoteReset();
        txtCanvasReset();

        var canvasLeft = document.getElementById('CanvasLeft');
        var contextL = canvasLeft.getContext('2d');
        var canvas = document.getElementById('CanvasRight');
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
        contextL.clearRect(0, 0, canvas.width, canvas.height);
        Gallery.Cxt.clearRect(0, 0, canvas.width, canvas.height);

        MainObj.NowPage = Number(page); //紀錄現在頁數
        $('.pageNumber')[0].value = MainObj.NowPage + 1;

        if (MainObj.IsTwoPage) {
            MainObj.LeftPage = page;
            MainObj.RightPage = page - 1;
        }
        drawCanvas(page);
        setWaterMark();

        //翻頁時若錯誤回饋視窗開著，則關掉
        if ($('#DivErrorMsg').attr('style') == "") {
            $('#DivErrorMsg').toggle();
        }

        //頁籤
        if (ToolBarList.TapList[page]) {
            tapLayer();
        }

        ReplyMark(page);
        ReplyImage(page);

        //當頁的註記回復
        DrawPen(page);
        ReplyNote(page);

        replySearchWeb(page);

        //便利貼resize時會觸發到這裡，會影響到便利貼resize的動作
        //因此在ReplyCanvas(page)裡多一個判斷是否此便利貼存在
        //如果已存在頁面上，則不再重生便利貼
        ReplyCanvas(page);
        replyComment(page);

        replyLink();

        replyFile();

        if (Exam.Finish) {
            showQuizAnswer(page);
        }

        //紀錄已讀的頁面
        if (ToolBarList.ChapterList.length) {
            ToolBarList.ChapterList[page].readStatus = true;
        }
        ChapterSwitchImg();

        changeAllBtnToFalse(navigatorToolBar);
        // zoomOut(true);

        $('#canvasPad').remove();

        resetUndo();
    }

}

// reset undo&redo
function resetUndo() {
    checkPen();
    MainObj.saveList = [];
    MainObj.trashList = [];
}

//判斷是否為影片全螢幕
function getFSWindow() {
    if (document.fullscreenElement) {
        return document.fullscreenElement;
    } else if (document.msFullscreenElement) {
        return document.msFullscreenElement;
    } else if (document.mozFullScreenElement) {
        return document.mozFullScreenElement;
    } else if (document.webkitFullscreenElement) {
        return document.webkitFullscreenElement;
    }
}

function newguid() {
    guid = ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    }));
    return guid;
};

//blockUi遮罩(傳值進去可顯示)
function blockUi(string) {
    $.blockUI({
        message: '<div class="load-3"><p>' + string + '</p><div class="ballLine"></div><div class="ballLine"></div><div class="ballLine"></div></div>',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
};

//取消遮罩
function unblockUi() {
    $.unblockUI({
        onUnblock: function () {}
    });
};

//alert視窗
function BookAlertShow(str) {
    var AlertEvent = setTimeout(function () {
        $("#BookAlert").stop(true, true).fadeIn();
        $("#BookAlert > p")[0].innerHTML = str;
        //置中
        $('#BookAlert').css('margin-left', -($('#BookAlert')[0].clientWidth / 2));
        $("#BookAlert").stop(true, true).fadeOut(3000);
        clearTimeout(AlertEvent);
    }, 500);
}

// confirm視窗
function confirmShow(str, callback) {
    $('.confirm_text')[0].innerHTML = str;

    var yesBtn = document.createElement('button');
    $(yesBtn)[0].innerHTML = '確定';
    $(yesBtn).addClass('confirm_btn');
    $('.confirm_btns').append(yesBtn);
    $(yesBtn).click(function (e) {
        e.preventDefault();
        callback(confirmState(true));
    })

    var noBtn = document.createElement('button');
    $(noBtn)[0].innerHTML = '取消';
    $(noBtn).addClass('confirm_btn');
    $(noBtn).addClass('cancel');
    $('.confirm_btns').append(noBtn);
    $(noBtn).click(function (e) {
        e.preventDefault();
        callback(confirmState(false));
    })

    $('.confirm').css('display', 'flex');
}

function confirmState(value) {
    $('.confirm').css('display', 'none');
    $('.confirm_btn').remove();
    return value;
}

//將註記轉成xml格式
//all = true表示整本書的註記，false表示當頁註記
function toSyncXML(all) {

    var jsonObjTitle = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

    var x2js = new X2JS();

    var jsonObj = {
        Note: {
            // SourceDataList: {},
            UserData: {
                LoginID: Exam.LoginID,
                PassWord: Exam.PassWord,
                NonCodedPassword: null
            },
            Book: {
                Device: null,
                Identifier: BookList.EBookID,
                FileName: Exam.FileName,
                Date: new Date()
            },
            ProcedureSliceList: {}
        }
    };

    var UserCreateObject;

    if (!all) {
        jsonObj.Note.ProcedureSliceList.ProcedureSlice = {
            '_page': MainObj.NowPage,
            UserCreateObjectList: {}
        }

        UserCreateObjectList = jsonObj.Note.ProcedureSliceList.ProcedureSlice.UserCreateObjectList;

        UserCreateObject = xmlAddNotes(UserCreateObjectList, MainObj.NowPage);
    } else {

        jsonObj.Note.ProcedureSliceList = {
            ProcedureSlice: []
        }

        for (var i = 0; i < HamaList.length; i++) {

            var arr = {
                '_page': i,
                UserCreateObjectList: {}
            }

            jsonObj.Note.ProcedureSliceList.ProcedureSlice.push(arr);

            UserCreateObjectList = jsonObj.Note.ProcedureSliceList.ProcedureSlice[i].UserCreateObjectList;

            UserCreateObject = xmlAddNotes(UserCreateObjectList, i);
        }
    }

    var xmlAsStr = jsonObjTitle + x2js.json2xml_str(jsonObj).replace(/'/g, '"');

    // alert(xmlAsStr);

    return xmlAsStr;
}

//RGB轉為ARGB
function getARGBInt(color, opacity) {

    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
        color = hexToRgb(color);
    }

    color = color.substr(4).split(')')[0].split(',');
    opacity = opacity * 255;

    var a = opacity << 24;
    var r = Number(color[0]) << 16;
    var g = Number(color[1]) << 8;
    var b = Number(color[2]);


    return a + r + g + b;

}

// HEX to RGB
function hexToRgb(hexValue) {
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = hexValue.replace(rgx, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return 'rgb(' + parseInt(rgb[1], 16) + ',' + parseInt(rgb[2], 16) + ',' + parseInt(rgb[3], 16) + ')';
}

//用ARGB取得RGB值([RGB, A])
function CovertIntToRGB(ARGBInt) {
    var argb = [];
    ARGBInt = Number(ARGBInt);
    var a = ARGBInt >> 24 & 255;

    var r = ARGBInt >> 16 & 255;

    var g = ARGBInt >> 8 & 255;

    var b = ARGBInt >> 0 & 255;

    argb.push('rgb(' + r + ',' + g + ',' + b + ')');
    argb.push(Math.round(a / 255, 2));


    return argb;
}

//畫筆point組成array
function creatAllPoints(points) {
    var P = [];
    if (points != undefined) {
        for (var i = 0; i < points.length; i++) {

            var arr = {
                '_X': points[i].X.toFixed(3),
                '_Y': points[i].Y.toFixed(3)
            }

            P.push(arr);
        }
    }

    return P;
}

function xmlAddNotes(list, page) {
    if (
        txtNote.SaveList.length > 0 ||
        txtCanvas.SaveList.length > 0 ||
        colorPen.LineList.length > 0 ||
        markList.length > 0 ||
        InsertImg.SaveList.length > 0 ||
        comment.saveList.length > 0 ||
        fileObj.saveList.length > 0 ||
        hyperLink.saveList.length > 0
    ) {

        list.UserCreateObject = [];

        list = list.UserCreateObject;

        //文字
        for (var n = 0; n < txtNote.SaveList.length; n++) {
            var obj = txtNote.SaveList[n];

            if (obj != undefined) {
                if (obj.page == page) {

                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.StickyObjectFormatter",
                        '_InitialTargetSize.Height': MainObj.CanvasHeight,
                        '_InitialTargetSize.Width': MainObj.CanvasWidth,
                        '_BoundaryPoint.Bounds.Location.Y': obj.top.split('px')[0],
                        '_BoundaryPoint.Bounds.Location.X': obj.left.split('px')[0],
                        '_BoundaryPoint.Bounds.Size.Height': obj.height.split('px')[0],
                        '_BoundaryPoint.Bounds.Size.Width': obj.width.split('px')[0],
                        '_StickyViewVisibility': obj.StickyViewVisibility,
                        '_StickyViewType': "stickyText",
                        '_LayerIndex': n,
                        '_Identifier': obj.id,
                        '_Contents': obj.value
                    }

                    list.push(arr);
                }
            }
        }

        //便利貼
        for (var a = 0; a < txtCanvas.SaveList.length; a++) {
            var obj = txtCanvas.SaveList[a];
            if (obj != undefined) {
                if (obj.page == page) {

                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.StickyObjectFormatter",
                        '_InitialTargetSize.Height': MainObj.CanvasHeight,
                        '_InitialTargetSize.Width': MainObj.CanvasWidth,
                        '_BoundaryPoint.Bounds.Location.Y': obj.top.split('px')[0],
                        '_BoundaryPoint.Bounds.Location.X': obj.left.split('px')[0],
                        '_BoundaryPoint.Bounds.Size.Height': obj.height.split('px')[0],
                        '_BoundaryPoint.Bounds.Size.Width': obj.width.split('px')[0],
                        '_StickyViewVisibility': obj.StickyViewVisibility,
                        '_StickyViewType': "stickyDraw",
                        '_LayerIndex': a,
                        '_Identifier': obj.id,
                        'StickyDraw.IntegerPathList': {
                            // 'IntegerPath': {
                            //     'Point': creatAllPoints(obj.points)
                            // }
                            'IntegerPath': []
                        }
                    }

                    for (var p = 0; p < obj.points.length; p++) {
                        if (obj.points[p]) {
                            arr['StickyDraw.IntegerPathList']['IntegerPath'].push({
                                'Point': creatAllPoints(obj.points[p])
                            });
                        }
                    }

                    list.push(arr);
                }
            }
        }

        //畫筆
        for (var i = 0; i < colorPen.LineList.length; i++) {

            if (colorPen.LineList[i] != undefined) {
                var obj = colorPen.LineList[i].object;

                if (colorPen.LineList[i].page == page) {

                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.BrushObjectFormatter",
                        '_InitialTargetSize.Height': MainObj.CanvasHeight,
                        '_InitialTargetSize.Width': MainObj.CanvasWidth,
                        '_BoundaryPoint.Bounds.Location.Y': "0",
                        '_BoundaryPoint.Bounds.Location.X': "0",
                        '_BoundaryPoint.Bounds.Size.Height': MainObj.CanvasHeight,
                        '_BoundaryPoint.Bounds.Size.Width': MainObj.CanvasWidth,
                        '_ForeColor': getARGBInt(obj.color, obj.opacity),
                        '_PixelSize': obj.penwidth,
                        '_Opacity': obj.opacity,
                        '_LayerIndex': i,
                        '_Identifier': colorPen.LineList[i].id,
                        '_BrushType': colorPen.LineList[i].BrushType,
                        'Points': {
                            'Point': creatAllPoints(colorPen.LineList[i].points)
                        }
                    }

                    list.push(arr);
                }
            }
        }

        //註記
        for (var m = 0; m < markList.length; m++) {
            if (markList[m]) {
                var mark = markList[m];
                if (mark.page == page) {
                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.MarkObjectFormatter",
                        '_Identifier': mark.id,
                        '_MarkContent': mark.value
                    }
                    list.push(arr);
                }
            }
        }

        //圖片
        for (var r = 0; r < InsertImg.SaveList.length; r++) {
            if (InsertImg.SaveList[r]) {
                var img = InsertImg.SaveList[r];
                if (Number(img.page) == Number(page)) {
                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.InsertImageFormatter",
                        '_Identifier': img.id,
                        '_BoundaryPoint.Bounds.Location.Y': img.top.split('px')[0],
                        '_BoundaryPoint.Bounds.Location.X': img.left.split('px')[0],
                        '_BoundaryPoint.Bounds.Size.Height': img.height.split('px')[0],
                        '_BoundaryPoint.Bounds.Size.Width': img.width.split('px')[0],
                        '_Picture': img.pic
                    }
                    list.push(arr);
                }
            }
        }

        //註解
        comment.saveList.map(function (res) {
            if (res.page == page) {
                var arr = {
                    '_FormatterType': "Hamastar.AddIns.Whiteboard.AnnotationObjectFormatter",
                    '_Identifier': res.id,
                    '_Contents': res.value,
                    'Points': {
                        'Point': []
                    }
                }

                var p = [];
                p.push({
                    '_X': res.position.from.x.toFixed(3),
                    '_Y': res.position.from.y.toFixed(3)
                });
                p.push({
                    '_X': res.position.to.x.toFixed(3),
                    '_Y': res.position.to.y.toFixed(3)
                });
                arr.Points.Point = p;

                list.push(arr);
            }
        });

        //檔案
        fileObj.saveList.map(function (res) {
            if (res) {
                if (Number(res.page) == Number(page)) {
                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.FileObjectFormatter",
                        '_Identifier': res.id,
                        '_BoundaryPoint.Bounds.Location.Y': res.top,
                        '_BoundaryPoint.Bounds.Location.X': res.left,
                        '_BoundaryPoint.Bounds.Size.Height': res.height,
                        '_BoundaryPoint.Bounds.Size.Width': res.width,
                        '_FileName': res.fileName
                    };
                    if (res.file) {
                        arr['_File'] = res.file;
                    }
                    list.push(arr);
                }
            }
        });

        //超連結
        hyperLink.saveList.map(function (res) {
            if (res) {
                if (Number(res.page) == Number(page)) {
                    var arr = {
                        '_FormatterType': "Hamastar.AddIns.Whiteboard.HyperLinkObjectFormatter",
                        '_Identifier': res.id,
                        '_BoundaryPoint.Bounds.Location.Y': res.top,
                        '_BoundaryPoint.Bounds.Location.X': res.left,
                        '_Title': res.title,
                        '_Src': res.src
                    };
                    list.push(arr);
                }
            }
        });
    }

    return list;
}

//背景音樂
//如果有則將audio物件存為MainObj.BGMusic，否則MainObj.BGMusic = null
function BackgroundMusicSetting() {
    if (BookList.BackgroundMusicFileName != '') {
        $('<audio/>', {
            id: 'BGMusic',
            class: 'BGMusic',
            src: 'Resource/' + setExt(BookList.BackgroundMusicFileName),
            loop: true,
            autoplay: true
        }).appendTo('body');

        $('#BGMusic')[0].volume = BookList.BackgroundMusicVolume / 100;
        // $('#BGMusic')[0].play();

        MainObj.BGMusic = $('#BGMusic')[0];
    }
}

//背景音樂播放
function BGMusicPlay() {
    if (MainObj.BGMusic != null) {
        MainObj.BGMusic.play();
    }
}

//背景音樂暫停
function BGMusicPause() {
    if (MainObj.BGMusic != null) {
        MainObj.BGMusic.pause();
    }
}

//翻頁音效
function PageTurnMusic() {
    if (BookList.PageTurnFileName != '') {
        $('#PageTurnMusic').remove();
        $('<audio/>', {
            id: 'PageTurnMusic',
            class: 'PageTurnMusic',
            src: 'Resource/' + setExt(BookList.PageTurnFileName)
        }).appendTo('#HamastarWrapper');

        $('#PageTurnMusic')[0].volume = 1;
        $('#PageTurnMusic')[0].play();

        $("#PageTurnMusic").on('ended', function () {
            // done playing
            $(this).remove();
        });
    }
}

//書以外的空間建立div，可以擋住超過書的物件
//左右兩側翻頁功能
function NewOffset() {

    $('.divOffset').remove();

    if ($('.dragCanvas')[0] == undefined) { //如有縮放，不開啟此功能

        if (!ToolBarList.IsChapter && !MainObj.IsTwoPage) {
            //左右
            if (MainObj.CanvasL > 0) {
                var divLeft = document.createElement('div');
                $(divLeft).addClass('divOffset');
                $('#HamastarWrapper').append(divLeft);
                $(divLeft).css({
                    'left': '0px',
                    'height': '100%',
                    'width': MainObj.CanvasL
                })

                $(divLeft).click(function (e) {
                    e.preventDefault();
                    gotoPage(MainObj.NowPage - 1, true, false);
                })

                var divRight = document.createElement('div');
                $(divRight).addClass('divOffset');
                $('#HamastarWrapper').append(divRight);
                $(divRight).css({
                    'right': '0px',
                    'height': '100%',
                    'width': MainObj.CanvasL
                })

                $(divRight).click(function (e) {
                    e.preventDefault();
                    gotoPage(MainObj.NowPage + 1, true, true);
                })

            }

            //上下
            if (MainObj.CanvasT > 0) {
                var divTop = document.createElement('div');
                $(divTop).addClass('divOffset');
                $('#HamastarWrapper').append(divTop);
                $(divTop).css({
                    'top': '0px',
                    'width': '100%',
                    'height': MainObj.CanvasT
                })

                var divBottom = document.createElement('div');
                $(divBottom).addClass('divOffset');
                $('#HamastarWrapper').append(divBottom);
                $(divBottom).css({
                    'bottom': '0px',
                    'width': '100%',
                    'height': MainObj.CanvasT
                })
            }
        } else if (ToolBarList.IsChapter) {
            //左右
            if (MainObj.CanvasL > 0) {
                var divLeft = document.createElement('div');
                $(divLeft).addClass('divOffset');
                $('#HamastarWrapper').append(divLeft);
                $(divLeft).css({
                    'left': '200px',
                    'height': '100%',
                    'width': MainObj.CanvasL - 200,
                    'background': '#353535'
                })

                var divRight = document.createElement('div');
                $(divRight).addClass('divOffset');
                $('#HamastarWrapper').append(divRight);
                $(divRight).css({
                    'left': MainObj.CanvasL + $('#CanvasGallery').width(),
                    'height': '100%',
                    'width': MainObj.CanvasL - 200,
                    'background': '#353535'
                })
            }
        }
    }
}

//重新規劃書的大小及位置
function ResetEBook() {
    zoomOut(true);
    // resize_canvas();
    // drawCanvas(MainObj.NowPage);
    setWaterMark();
    NewOffset();
}

var blockView = {
    open: function () {
        $('.blockView').css('display', 'flex');
    },
    close: function () {
        $('.blockView').css('display', 'none');
    }
};

// 清除全部註記
function clearAllNote() {
    txtNote.SaveList = [];
    txtCanvas.SaveList = [];
    colorPen.LineList = [];

    txtCanvas.canvasList = [];
    InsertImg.SaveList = [];
    MainObj.saveList = [];

    fileObj.saveList = [];
    hyperLink.saveList = [];

    DrawPen(MainObj.NowPage);
    ReplyNote(MainObj.NowPage);
    ReplyCanvas(MainObj.NowPage);
    replyComment(MainObj.NowPage);
    replyFile();
    replyLink();
}

// 將檔案附檔名改為dat
function setExt(path) {
    // return path.split('.')[0] + '.png';
    return path;
}