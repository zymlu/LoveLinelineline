//360

var Rotation = {
    Interval: [],
    SrcNum: [], //計數ImageList中的圖片項目
    Drag: false,
    Mouse1: { X: 0, Y: 0 },
    Mouse2: { X: 0, Y: 0 },
    Scale: 1
};


function RotationImageSet(obj, page) {
    Rotation.SrcNum[page] = 0;

    getPagePosition(page);

    var scale = MainObj.Scale;
    var Left = obj.Left * scale + MainObj.CanvasL;
    var Top = obj.Top * scale + MainObj.CanvasT;
    var Width = obj.Width * scale;
    var Height = obj.Height * scale;

    Left = getNewLeft(Left);

    $('#canvas')[0].class = 'canvasObj';
    $('#canvas')[0].width = Width;
    $('#canvas')[0].height = Height;
    $('#canvas').css({ 'left': Left, 'top': Top });

    var canvas = $('#canvas')[0];
    var cxt = canvas.getContext('2d');
    resizeCanvas(canvas, cxt);

    canvas.id = obj.Identifier;

    var img = new Image();
    img.onload = function() {
        cxt.drawImage(img, 0, 0, Width, Height);
        cxt.globalCompositeOperation = 'copy'; //移除舊圖，只保留新圖，不使用clear的方式，因為畫圖的過程會閃
    }
    img.src = 'Resource/' + setExt(obj.ImageList.Images[Rotation.SrcNum[page]].XFileName);

    if (obj.Autoplay == '1') {
        Rotation.Interval[page] = setInterval(function() {
            Rotation.SrcNum[page]++;
            addRotationImg(obj, img, page);
            // console.log(page);
        }, Number(obj.AutoplayInterval));
    }

    canvas.addEventListener( "mousedown", function() { RotationDown(obj, img, page); }, false ); //滑鼠點擊事件
    canvas.addEventListener( "touchstart", function() { RotationDown(obj, img, page); }, false ); //手指點擊事件
    if (obj.PinchZoom == '1') {
        canvas.addEventListener( "dblclick", function() { RotationdbClick(obj, img); }, false ); //滑鼠雙擊事件
    }
}

//改變canvas的圖片
function addRotationImg(obj, img, page) {
    // console.log(obj);
    if ($('#' + obj.Identifier)[0] != undefined) {
        var canvas = document.getElementById(obj.Identifier);
        var cxt = canvas.getContext('2d');
        resizeCanvas(canvas, cxt);
        var scale = MainObj.Scale;
        var Width = obj.Width * scale;
        var Height = obj.Height * scale;
        
        if (Rotation.SrcNum[page] >= obj.ImageList.Images.length) {
            Rotation.SrcNum[page] = 0;
        } else if (Rotation.SrcNum[page] < 0) {
            Rotation.SrcNum[page] = obj.ImageList.Images.length - 1;
        }
        img.src = 'Resource/' + setExt(obj.ImageList.Images[Rotation.SrcNum[page]].XFileName);
        cxt.drawImage(img, 0, 0, Width, Height);
    }
}

function RotationDown(obj, img, page) {
    Rotation.Drag = true;
    GalleryStopMove();

    x = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    Rotation.Mouse1.X = x - $('#CanvasGallery').offset().left;
    Rotation.Mouse1.Y = y - $('#CanvasGallery').offset().top;

    //滑鼠點著的期間，是不會轉動的
    clearInterval(Rotation.Interval[page]);

    document.addEventListener( "mousemove", function() { RotationMove(obj, img, page); }, false ); //滑鼠移動事件
    document.addEventListener( "mouseup", function() { RotationUp(obj, img, page); }, false ); //滑鼠放開事件

    document.addEventListener( "touchmove", function() { RotationMove(obj, img, page); }, false );     //手指移動事件
    document.addEventListener( "touchend", function() { RotationUp(obj, img, page); }, false );    //手指離開事件

}

function RotationMove(obj, img, page) {
    if (Rotation.Drag) {

        x = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
        y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

        Rotation.Mouse2.X = x - $('#CanvasGallery').offset().left;
        Rotation.Mouse2.Y = y - $('#CanvasGallery').offset().top;

        //旋轉90或270度時，圖片變成上下翻轉
        var case1 = obj.Rotate >= 80 && obj.Rotate <= 100,  //旋轉90+-10度時，由滑鼠Y座標來旋轉
            case2 = obj.Rotate >= 260 && obj.Rotate <= 280,  //旋轉270+-10度時，由滑鼠Y座標來旋轉
            move;  //其餘的角度都由X座標來判斷旋轉

        //滑鼠點擊的起始點與移動滑鼠後的點的距離
        if (case1) {
            move = Rotation.Mouse2.Y - Rotation.Mouse1.Y;
        } else if (case2) {
            move = Rotation.Mouse1.Y - Rotation.Mouse2.Y;
        } else {
            move = Rotation.Mouse2.X - Rotation.Mouse1.X;
        }

        //moveX若大於1，則判斷滑鼠為向右/上移動，圖片往右/上轉
        //反之，若小於-1，則往左/上轉
        if (move > 1) {
            Rotation.SrcNum[page]++;
            addRotationImg(obj, img, page);
        } else if (move < -1) {
            Rotation.SrcNum[page]--;
            addRotationImg(obj, img, page);
        }

        //將移動後的點取代點擊的起始點
        Rotation.Mouse1.X = Rotation.Mouse2.X;
        Rotation.Mouse1.Y = Rotation.Mouse2.Y;

        var message = MainObj.NowPage + ',' + obj.Identifier + ',XFileName:' + img.src.split('/').pop();
        rmcallBookSyncMessage(message);

        // console.log(message);

    }
}

function RotationUp(obj, img, page) {

    Panorama.RotationMove = false;

    //滑鼠放開後繼續自動360轉
    Rotation.Drag = false;
    GalleryStartMove();
    
    if (obj.Autoplay == '1') {
        //要再clearInterval一次，不然setInterval會一直重疊上去，轉動速度會越來越快
        clearInterval(Rotation.Interval[page]);
        Rotation.Interval[page] = setInterval(function() {
            Rotation.SrcNum[page]++;
            addRotationImg(obj, img, page);
        }, Number(obj.AutoplayInterval));
    }
}

//滑鼠雙擊圖片放大，再雙擊一次變回原本大小
function RotationdbClick(obj) {
    Rotation.Scale++;

    var canvas = document.getElementById(obj.Identifier),
        cxt = canvas.getContext('2d'),
        scale = MainObj.Scale,
        Left, Top;

    if (Rotation.Scale == 2) {
        Left = (obj.Left * scale + MainObj.CanvasL) / 2;
        Top = (obj.Top * scale + MainObj.CanvasT) / 2;

        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
        cxt.scale(2, 2);
    } else if (Rotation.Scale > 2) {
        Rotation.Scale = 1;

        Left = obj.Left * scale + MainObj.CanvasL;
        Top = obj.Top * scale + MainObj.CanvasT;

        canvas.width = obj.Width * scale;
        canvas.height = obj.Height * scale;
        cxt.scale(1, 1);
    }
    $(canvas).css({ 'left': Left, 'top': Top });

    resizeCanvas(canvas, cxt);
}

//360初始化
function RotationImageReset() {
    
    for (var i = 0; i < Rotation.Interval.length; i++) {
        clearInterval(Rotation.Interval[i]);
    }
    // Rotation.Interval = null;
    document.removeEventListener( "mousemove", function() { RotationMove(obj, img); }, false ); //滑鼠移動事件
    document.removeEventListener( "mouseup", function() { RotationUp(obj, img); }, false ); //滑鼠放開事件

    document.removeEventListener( "touchmove", function() { RotationMove(obj, img); }, false ); //手指移動事件
    document.removeEventListener( "touchend", function() { RotationUp(obj, img); }, false ); //手指放開事件
}