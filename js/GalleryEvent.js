
//翻頁功能JS

// 全域變數
var Gallery = {
    Canvas: null,
    Cxt: null,
    Mouse: { x: 0, y: 0 },
    MousedownX: 0,
    Drag: false //滑鼠是否拖拉
};





function GalleryEvent() {
    Gallery.Canvas = document.getElementById('CanvasGallery');
    Gallery.Cxt = Gallery.Canvas.getContext("2d");

    Gallery.Canvas.addEventListener( "mousemove", mouseMoveHandler, false ); //滑鼠移動事件
    Gallery.Canvas.addEventListener( "mousedown", mouseDownHandler, false ); //滑鼠點擊事件
    Gallery.Canvas.addEventListener( "mouseup", mouseUpHandler, false );     //滑鼠放開事件
    Gallery.Canvas.addEventListener( "mouseout", mouseUpHandler, false );    //滑鼠離開事件

    Gallery.Canvas.addEventListener( "touchmove", mouseMoveHandler, false ); //手指移動事件
    Gallery.Canvas.addEventListener( "touchstart", mouseDownHandler, false ); //手指點擊事件
    Gallery.Canvas.addEventListener( "touchend", mouseUpHandler, false );     //手指放開事件
    Gallery.Canvas.addEventListener( "touchcancel", mouseUpHandler, false );    //手指離開事件

}

function GalleryStopMove() {
    Gallery.Drag = false;
    // $('#CanvasGallery').css('display', 'none');
    Gallery.Canvas.removeEventListener( "mousemove", mouseMoveHandler, false ); //滑鼠移動事件
    Gallery.Canvas.removeEventListener( "mousedown", mouseDownHandler, false ); //滑鼠點擊事件
    Gallery.Canvas.removeEventListener( "mouseup", mouseUpHandler, false );     //滑鼠放開事件
    Gallery.Canvas.removeEventListener( "mouseout", mouseUpHandler, false );    //滑鼠離開事件

    Gallery.Canvas.removeEventListener( "touchmove", mouseMoveHandler, false ); //手指移動事件
    Gallery.Canvas.removeEventListener( "touchstart", mouseDownHandler, false ); //手指點擊事件
    Gallery.Canvas.removeEventListener( "touchend", mouseUpHandler, false );     //手指放開事件
    Gallery.Canvas.removeEventListener( "touchcancel", mouseUpHandler, false );    //手指離開事件
}

function GalleryStartMove() {
    // $('#CanvasGallery').css('display', 'block');
    Gallery.Canvas.addEventListener( "mousemove", mouseMoveHandler, false ); //滑鼠移動事件
    Gallery.Canvas.addEventListener( "mousedown", mouseDownHandler, false ); //滑鼠點擊事件
    Gallery.Canvas.addEventListener( "mouseup", mouseUpHandler, false );     //滑鼠放開事件
    Gallery.Canvas.addEventListener( "mouseout", mouseUpHandler, false );    //滑鼠離開事件

    Gallery.Canvas.addEventListener( "touchmove", mouseMoveHandler, false ); //手指移動事件
    Gallery.Canvas.addEventListener( "touchstart", mouseDownHandler, false ); //手指點擊事件
    Gallery.Canvas.addEventListener( "touchend", mouseUpHandler, false );     //手指放開事件
    Gallery.Canvas.addEventListener( "touchcancel", mouseUpHandler, false );    //手指離開事件
}


function mouseMoveHandler(e) {

    e.preventDefault();

    if (Gallery.Drag) {
        
        x = e.type == 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
        Gallery.Mouse.x = x - $('#CanvasGallery').offset().left;
        // Gallery.Mouse.y = event.clientY - $('#CanvasGallery').offset().top;

        // console.log(Gallery.Mouse.x + ',' + Gallery.Mouse.y);

        GallerySetting();

        $('#DivErrorMsg').css('display', 'none');
        $('#ErrorMsg').off('click');
        $('#DivCorrectMsg').css('display', 'none');
        $('#CorrectMsg').off('click');

    } else {
        Gallery.Cxt.clearRect(0, 0, Gallery.Canvas.width, Gallery.Canvas.height);
    }
}

function mouseDownHandler(e) {

    e.preventDefault();

    x = e.type == 'touchstart' ? e.targetTouches[0].pageX : e.clientX;
    Gallery.MousedownX = x - $('#CanvasGallery').offset().left;

    // console.log(Gallery.MousedownX);

    Gallery.Drag = true;

}

function mouseUpHandler( event ) {

    Gallery.Drag = false;
    Gallery.Cxt.clearRect(0, 0, Gallery.Canvas.width, Gallery.Canvas.height);

    var jumpPageValue;

    if (MainObj.IsTwoPage) {
        jumpPageValue = 2;
    } else {
        jumpPageValue = 1;
    }

    //在有動畫時，若判斷不是翻頁，則Animate.NoGallery = true(click事件)
    if (MainObj.PrePage) {
        gotoPage(MainObj.NowPage - jumpPageValue, true, false);
        MainObj.PrePage = false;
        Animate.NoGallery = false;

        PageTurnMusic();

    } else if (MainObj.NextPage) {
        gotoPage(MainObj.NowPage + jumpPageValue, true, true);
        MainObj.NextPage = false;
        Animate.NoGallery = false;

        PageTurnMusic();

    } else {
        Animate.NoGallery = true;
    }

    syncPage = MainObj.NowPage;

    var message = '[scmd]' + Base64.encode('goto' + syncPage);
    rmcall(message);

}

function GallerySetting() {

    var moveX = Gallery.Mouse.x - Gallery.MousedownX;

    if (MainObj.IsTwoPage) {
        var lastPage = MainObj.NowPage + 1;
        var Length = HamaList.length;
    } else {
        var lastPage = MainObj.NowPage;
        var Length = HamaList.length - 1;
    }

    // 滑鼠拖動大於50才觸發翻頁
    if (MainObj.IsRight) {// 右翻
        if (moveX > 50) {
            if (lastPage < Length) {// 往右滑，下一頁
                turnPage('Right', true);
            } else {
                BookAlertShow('此頁為最後一頁');
            }
        } else if (moveX < -50) {
            if (MainObj.NowPage > 0) {// 往左滑，上一頁
                turnPage('Left', false);
            }
        }
    } else {// 左翻
        if (moveX > 50) {
            if (MainObj.NowPage > 0) {// 往右滑，上一頁
                turnPage('Right', false);
            }
        } else if (moveX < -50) {
            if (lastPage < Length) {// 往左滑，下一頁
                turnPage('Left', true);
            } else {
                BookAlertShow('此頁為最後一頁');
            }
        }
    }
}

//翻頁判斷(page = true為下一頁，false為上一頁)
function turnPage(str, page) {

    MainObj.PrePage = !page;
    MainObj.NextPage = page;

    if (page) {
        if (noNextPage()) return;
        drawCanvas(MainObj.NowPage + 1, str);
    } else {
        if (noPrePage()) return;
        drawCanvas(MainObj.NowPage - 1, str);
    }

}

// 禁止往後翻頁
function noNextPage() {
    if (HamaList[MainObj.NowPage].SwipeToNextSliceEnable == 0) {
        return true;
    }
}

// 禁止往前翻頁
function noPrePage() {
    if (HamaList[MainObj.NowPage].SwipeToNextSliceEnable == 0) {
        return true;
    }
}