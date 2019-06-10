//橡皮擦

var Eraser = {
    Drag: false,
    Down: {
        X: 0,
        Y: 0
    }, //滑鼠點擊的座標
    Move: {
        X: 0,
        Y: 0
    } //滑鼠移動的座標
}




function StartEraser(event) {
    // Eraser.Down.X = event.clientX;
    // Eraser.Down.Y = event.clientY;
    Eraser.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    Eraser.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);


    // GalleryStopMove();
    Eraser.Drag = true;
    // NewCanvas();
    // var canvasEraser = $('#canvas')[0];
    // canvasEraser.id = 'canvasEraser';
    // canvasEraser.width = $(window).width();
    // canvasEraser.height = $(window).height();
    // $(canvasEraser).css('z-index', '1000');

    // $(canvasEraser).on('mousemove', function(e) { EraserMove(e, canvasEraser); });
    // $(canvasEraser).on('mouseup', function(e) { EraserUp(e, canvasEraser); });

    // $(canvasEraser).on('touchmove', function(e) { EraserMove(e, canvasEraser); });
    // $(canvasEraser).on('touchend', function(e) { EraserUp(e, canvasEraser); });
}

function EraserMove(event, canvas) {
    if (Eraser.Drag) {

        // Eraser.Move.X = event.clientX;
        // Eraser.Move.Y = event.clientY;
        Eraser.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
        Eraser.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

        var width = Eraser.Move.X - Eraser.Down.X;
        var height = Eraser.Move.Y - Eraser.Down.Y;

        var cxt = canvas.getContext('2d');
        // resizeCanvas(canvas, cxt);

        // IE不支援copy參數，所以只能清除重畫了
        cxt.clearRect(0, 0, canvas.width, canvas.height);

        cxt.lineWidth = 5; //線寬度
        cxt.setLineDash([15, 20]); //虛線
        cxt.strokeRect(Eraser.Down.X, Eraser.Down.Y, width, height);
        cxt.stroke();

        // cxt.globalCompositeOperation = 'copy'; //只顯示新畫的圖
    }
}

function EraserUp(event, canvas) {

    var X1 = FindMin(Eraser.Down.X, Eraser.Move.X), //橡皮擦左上角的X
        Y1 = FindMin(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦左上角的Y
        X2 = FindMax(Eraser.Down.X, Eraser.Move.X), //橡皮擦右下角的X
        Y2 = FindMax(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦右下角的Y
        Obj = []; //要刪除的線存在這裡

    //刪除畫筆
    colorPen.LineList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            if (res.BrushType == 'arbitrarily') {
                $(res.points).each(function () {
                    //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡

                    var Xpoint = this.X * MainObj.Scale + MainObj.CanvasL;
                    var Ypoint = this.Y * MainObj.Scale + MainObj.CanvasT;

                    if (Xpoint > X1 && Xpoint < X2 && Ypoint > Y1 && Ypoint < Y2) {
                        Obj.push(res.id);
                    }
                });
            } else if (res.BrushType == 'line') {
                var lineX1 = res.points[0].X * MainObj.Scale + MainObj.CanvasL,
                    lineY1 = res.points[0].Y * MainObj.Scale + MainObj.CanvasT,
                    lineX2 = res.points[1].X * MainObj.Scale + MainObj.CanvasL,
                    lineY2 = res.points[1].Y * MainObj.Scale + MainObj.CanvasT;

                var case1 = X1 < lineX1 && X2 > lineX1 && Y1 < lineY1 && Y2 > lineY1,
                    case2 = X1 < lineX2 && X2 > lineX2 && Y1 < lineY2 && Y2 > lineY2,
                    case3 = lineX2 > X1 && X1 > lineX1 && lineX2 > X2 && X2 > lineX1;

                if (case1 || case2 || case3) {
                    Obj.push(res.id);
                }
            } else {
                var left = res.points[0].X * MainObj.Scale + MainObj.CanvasL;
                var top = res.points[0].Y * MainObj.Scale + MainObj.CanvasT;
                var right = res.object.width * MainObj.Scale + left;
                var down = res.object.height * MainObj.Scale + top;
                if (!(left > X2 || right < X1 || top > Y2 || down < Y1)) {
                    Obj.push(res.id);
                }
            }
        }
    });

    var boardLine = [];

    // 刪除手寫白板
    canvasboard.saveList.map(function (res, index) {
        res.points.map(function (p) {
            //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡

            if (
                p.x + $('.canvasboard').offset().left > X1 &&
                p.x + $('.canvasboard').offset().left < X2 &&
                p.y + $('.canvasboard').offset().top > Y1 &&
                p.y + $('.canvasboard').offset().top < Y2
            ) {
                boardLine.push(index);
            }
        });
    });

    var Point = {
        X1: X1,
        Y1: Y1,
        X2: X2,
        Y2: Y2
    };

    FindWidget(Obj, Point, txtNote.SaveList);
    FindWidget(Obj, Point, txtCanvas.SaveList);
    FindWidget(Obj, Point, InsertImg.SaveList);
    FindWidget(Obj, Point, Recoding.SaveList);
    FindWidget(Obj, Point, ToolBarList.searchWeb);
    FindWidget(Obj, Point, hyperLink.saveList);
    FindWidget(Obj, Point, fileObj.saveList);

    if (Obj.length > 0 || boardLine.length > 0) {
        confirmShow('是否確定刪除物件', function (res) {
            if (res) {

                //刪除手寫白版的線
                boardLine.map(function (res) {
                    if (canvasboard.saveList[res]) {
                        delete canvasboard.saveList[res];
                    }
                });
                replyCavnasboard();

                //一次刪除有框到的線
                for (var objid = 0; objid < Obj.length; objid++) {

                    $('#' + Obj[objid]).remove();

                    DeleteList(Obj, colorPen.LineList, objid); //畫筆             
                    DeleteList(Obj, txtNote.SaveList, objid); //文字便利貼
                    DeleteList(Obj, txtCanvas.SaveList, objid); //便利貼
                    DeleteList(Obj, InsertImg.SaveList, objid); //插入圖片
                    DeleteList(Obj, Recoding.SaveList, objid); //錄音
                    DeleteList(Obj, ToolBarList.searchWeb, objid); //搜外網
                    DeleteList(Obj, hyperLink.saveList, objid); //超連結
                    DeleteList(Obj, fileObj.saveList, objid); //檔案
                }

                changeAllBtnToFalse();
            }
        })
    }

    // $('#canvasEraser').remove();
    var cxt = canvas.getContext('2d');
    cxt.clearRect(0, 0, canvas.width, canvas.height);

    Eraser.Drag = false;
    GalleryStartMove();

    var syncXML = toSyncXML();
    var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
    rmcall(message);
}

//取得橡皮擦範圍內的物件(文字便利貼、便利貼、圖片、錄音)
function FindWidget(Obj, Point, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined) {
            if (list[i].page == MainObj.NowPage) {
                var obj = list[i];
                var left, top, right, down;
                if (obj.type == 'txtCanvas' || obj.type == 'txtNote') {
                    left = Number(obj.left.split('px')[0]) * MainObj.Scale + MainObj.CanvasL;
                    top = Number(obj.top.split('px')[0]) * MainObj.Scale + MainObj.CanvasT;
                    right = (Number(obj.width.split('px')[0]) + Number(obj.left.split('px')[0])) * MainObj.Scale;
                    down = (Number(obj.height.split('px')[0]) + Number(obj.top.split('px')[0])) * MainObj.Scale;
                    if (obj.StickyViewVisibility == 'false') {
                        left = Number(obj.left.split('px')[0]) * MainObj.Scale + MainObj.CanvasL;
                        top = Number(obj.top.split('px')[0]) * MainObj.Scale + MainObj.CanvasT;
                        right = 50 * MainObj.Scale + left;
                        down = 50 * MainObj.Scale + top;
                    }
                } else if (obj.type == 'YouTube' || obj.type == 'Google' || obj.type == 'Wiki') {
                    left = obj.left;
                    top = obj.top;
                    right = $('#' + obj.id).width() + left;
                    down = $('#' + obj.id).height() + top;
                } else if (obj.type == 'hyperLink' || obj.type == 'file') {
                    left = obj.left * MainObj.Scale + MainObj.CanvasL;
                    top = obj.top * MainObj.Scale + MainObj.CanvasT;
                    right = $('#' + obj.id).width() + left;
                    down = $('#' + obj.id).height() + top;
                } else {
                    left = Number(obj.left.split('px')[0]);
                    top = Number(obj.top.split('px')[0]);
                    right = Number(obj.width.split('px')[0]) + left;
                    down = Number(obj.height.split('px')[0]) + top;
                }

                if (!(left > Point.X2 || right < Point.X1 || top > Point.Y2 || down < Point.Y1)) {
                    Obj.push(obj.id);
                }
            }
        }
    }
}

//取兩點最大
function FindMax(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

//取兩點最小
function FindMin(a, b) {
    if (a > b) {
        return b;
    } else {
        return a;
    }
}

//刪除有保存到list的各個Widget
function DeleteList(obj, list, objid) {
    for (var i = 0; i < list.length; i++) {
        //刪掉canvas之外，還要把原本有記錄到的刪掉
        if (list[i] != undefined) {
            if (list[i].id == obj[objid]) {
                list.splice(i, 1);
            }
        }
    }

    SaveCanvas();
    SaveNote();


}