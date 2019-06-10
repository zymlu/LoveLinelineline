//畫筆

var colorPen = {
    Color: 'rgb(255,0,0)', //畫筆顏色
    Width: 3, //畫筆寬度
    Opacity: 1.0, //畫筆透明度
    Drag: false,
    Down: {
        X: 0,
        Y: 0
    }, //滑鼠點擊的座標
    Move: {
        X: 0,
        Y: 0
    }, //滑鼠移動的座標
    Line: {
        X: [],
        Y: []
    }, //存入畫線的所有座標
    LineList: [], //保存所有畫完的線的資訊(id、大小位置、所在頁數、所有座標)
    BrushType: 'arbitrarily',
    selectedType: 'arbitrarily',
    size: {
        width: 0,
        height: 0
    },
    lastPoint: {}
};

var comment = {
    Down: {
        X: 0,
        Y: 0
    }, //滑鼠點擊的座標
    Move: {
        X: 0,
        Y: 0
    }, //滑鼠移動的座標
    Drag: false,
    lastPoint: {},
    saveList: [],
    positionList: {}
}


function StartPen(event, canvas) {

    colorPen.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    colorPen.Drag = true;

    var cxt = canvas.getContext('2d');
    // cxt.strokeStyle = colorPen.Color;
    // cxt.lineWidth = colorPen.Width;
    // cxt.globalAlpha = colorPen.Opacity;
    if (colorPen.BrushType == 'arbitrarily') {
        cxt.beginPath();
        cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
    }

}

function canvasPadMove(event, canvas) {

    // colorPen.Move.X = event.clientX;
    // colorPen.Move.Y = event.clientY;
    colorPen.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    colorPen.size.width = colorPen.Move.X - colorPen.Down.X;
    colorPen.size.height = colorPen.Move.Y - colorPen.Down.Y;

    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    if (colorPen.Drag) {
        if (colorPen.BrushType == 'arbitrarily') {
            cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.stroke();
            // //將畫線的座標都存入colorPen.Line裡面
            var x = (Number(colorPen.Move.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale;
            var y = (Number(colorPen.Move.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale;
            colorPen.Line.X.push(x);
            colorPen.Line.Y.push(y);
        } else if (colorPen.BrushType == 'line') {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.beginPath();
            cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
            cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            cxt.stroke();
        } else if (colorPen.BrushType == 'rect') {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.strokeRect(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height);
            cxt.stroke();
        } else {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            var width = Math.abs(colorPen.size.width);
            var height = Math.abs(colorPen.size.height);

            BezierEllipse(cxt, colorPen.Down.X, colorPen.Down.Y, width / 2, height / 2);
        }
    }
}

//canvasPad為畫板
//newCanvas為畫完後呈現的結果
function canvasPadUp(canvas) {
    colorPen.Drag = false;
    var canvasList = {};
    var id = newguid();
    canvasList.points = [];
    if (colorPen.BrushType == 'arbitrarily') {
        for (var i = 0; i < colorPen.Line.X.length; i++) {

            canvasList.points.push({
                X: colorPen.Line.X[i],
                Y: colorPen.Line.Y[i]
            });
        }

        //將線的座標由小至大排序，才能知道canvas的大小
        var ListX = colorPen.Line.X.sort(function (a, b) {
            return a - b;
        });
        ListX = ListX.filter(function (x) {
            if (x) {
                return x;
            }
        })
        var minX = ListX[0];
        var maxX = ListX[ListX.length - 1];

        var ListY = colorPen.Line.Y.sort(function (a, b) {
            return a - b;
        });
        ListY = ListY.filter(function (x) {
            if (x) {
                return x;
            }
        })
        var minY = ListY[0];
        var maxY = ListY[ListY.length - 1];

        NewCanvas();
        var newCanvas = $('#canvas')[0];
        newCanvas.id = id;

        $(newCanvas).addClass('pen');

        var width = maxX - minX + colorPen.Width * 2;
        var height = maxY - minY + colorPen.Width * 2;
        var left = minX - colorPen.Width;
        var top = minY - colorPen.Width;

        if (!width && !height) {
            $(newCanvas).remove();
            return;
        }

        //width、height都+colorPen.Width*2的原因是
        //原本的大小不包含線的寬度
        //如果沒有加上兩倍的寬度，會截到線
        //left、top也是一樣的原理
        // newCanvas.width = width * MainObj.Scale;
        // newCanvas.height = height * MainObj.Scale;
        // if (ToolBarList.ZoomScale > 1) {
        //     newCanvas.width = $('#CanvasLeft').width();
        //     newCanvas.height = $('#CanvasLeft').width();
        // } else {
        newCanvas.width = $(window).width();
        newCanvas.height = $(window).height();
        // }

        var newCxt = newCanvas.getContext('2d');
        // resizeCanvas(newCanvas, newCxt);

        // newCxt.globalAlpha = colorPen.Opacity;
        // newCxt.drawImage(canvas, -(left * MainObj.Scale + MainObj.CanvasL), -(top * MainObj.Scale + MainObj.CanvasT));
        newCxt.drawImage(canvas, 0, 0);

        // $(newCanvas).css({
        //     'left': left * MainObj.Scale + MainObj.CanvasL,
        //     'top': top * MainObj.Scale + MainObj.CanvasT,
        //     'pointer-events': 'none'
        // })
        $(newCanvas)
            .css({
                'left': 0,
                'top': 0,
                'pointer-events': 'none'
            })
            .attr({
                'tempScale': ToolBarList.ZoomScale
            });

        // $('#canvasPad').remove();

        if (ToolBarList.AddWidgetState == 'IRSpen') {
            $(newCanvas).addClass('IRSpen');
        }

        if ($('#discussCanvas')[0] == undefined) {
            GalleryStartMove();
        }

    } else if (colorPen.BrushType == 'line') {
        // 直線
        var newCxt = newSharpSet(id);
        newCxt.clearRect(0, 0, canvas.width, canvas.height);
        newCxt.beginPath();
        newCxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
        newCxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
        newCxt.stroke();
        canvasList.points.push({
            X: (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale,
            Y: (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale
        }, {
            X: (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale,
            Y: (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale
        });
    } else if (colorPen.BrushType == 'rect') {
        // 矩形
        var newCxt = newSharpSet(id);
        newCxt.strokeRect(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height);
        newCxt.stroke();

        canvasList.points.push({
            X: (Number(colorPen.Down.X < colorPen.Move.X ? colorPen.Down.X : colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale,
            Y: (Number(colorPen.Down.X < colorPen.Move.X ? colorPen.Down.Y : colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale
        }, {
            X: (Number(colorPen.Down.X > colorPen.Move.X ? colorPen.Down.X : colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale,
            Y: (Number(colorPen.Down.X > colorPen.Move.X ? colorPen.Down.Y : colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale
        });

        var width = colorPen.size.width / MainObj.Scale;
        var height = colorPen.size.height / MainObj.Scale;

    } else {
        // 圓形
        var newCxt = newSharpSet(id);
        var width = Math.abs(colorPen.size.width);
        var height = Math.abs(colorPen.size.height);

        BezierEllipse(newCxt, colorPen.Down.X, colorPen.Down.Y, width / 2, height / 2);

        canvasList.points.push({
            X: (Number(colorPen.Down.X < colorPen.Move.X ? colorPen.Down.X : colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale,
            Y: (Number(colorPen.Down.X < colorPen.Move.X ? colorPen.Down.Y : colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale
        }, {
            X: (Number(colorPen.Down.X > colorPen.Move.X ? colorPen.Down.X : colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale,
            Y: (Number(colorPen.Down.X > colorPen.Move.X ? colorPen.Down.Y : colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale
        });

        var width = width / MainObj.Scale;
        var height = height / MainObj.Scale;
    }

    if (!isIRS) {
        canvasList = {
            id: id,
            type: 'pen',
            BrushType: colorPen.BrushType,
            object: {
                width: Math.abs(width),
                height: Math.abs(height),
                left: left,
                top: top,
                penwidth: colorPen.Width,
                color: colorPen.Color,
                opacity: Number(colorPen.Opacity)
            },
            page: MainObj.NowPage,
            points: canvasList.points,
            isIRS: false,
            isZoom: ToolBarList.ZoomScale
        };

        if (canvasList.points.length) {
            colorPen.LineList.push(canvasList);
            MainObj.saveList.push(canvasList);
            if (MainObj.saveList.length > 5) {
                MainObj.saveList.splice(0, 1);
            }
        }
    }

    colorPen.Line = {
        X: [],
        Y: []
    };

    var syncXML = toSyncXML();
    var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
    rmcall(message);

    var tempCxt = canvas.getContext('2d');
    tempCxt.clearRect(0, 0, canvas.width, canvas.height);

}

// 畫形狀的canvas
function newSharpSet(id) {
    NewCanvas();
    var newCanvas = $('#canvas')[0];
    newCanvas.id = id || newguid();
    newCanvas.width = $(window).width();
    newCanvas.height = $(window).height();
    $(newCanvas).addClass('pen');
    $(newCanvas).css({
        'pointer-events': 'none'
    })
    var newCxt = newCanvas.getContext('2d');
    newCxt.strokeStyle = colorPen.Color;
    newCxt.lineWidth = colorPen.Width;
    newCxt.globalAlpha = colorPen.Opacity;
    return newCxt;
}

//回來此頁面時，若原本有畫筆，則在重新建一個canvas畫出來
//gotoPage最後執行
function DrawPen(page) {

    $('.pen').remove();

    $(colorPen.LineList).each(function () {
        if (this.page == page && this.type == 'pen') {
            // console.log(this.id);

            if (!$('#' + this.id)[0]) {

                reDoPen(this);
            }
        }
    });
}

function reDoPen(obj) {
    if (obj.BrushType == 'arbitrarily') {
        NewCanvas();
        var canvas = $('#canvas')[0];

        var width = obj.object.width * MainObj.Scale;
        var height = obj.object.height * MainObj.Scale;
        var left = obj.object.left * MainObj.Scale + MainObj.CanvasL;
        var top = obj.object.top * MainObj.Scale + MainObj.CanvasT;

        canvas.id = obj.id;
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        $(canvas).css({
            'left': 0,
            'top': 0,
            'opacity': obj.object.opacity,
            'pointer-events': 'none'
        })

        $(canvas).addClass('pen');
        var cxt = canvas.getContext('2d');

        for (var i = 1; i < obj.points.length; i++) {
            cxt.strokeStyle = obj.object.color;
            cxt.lineWidth = obj.object.penwidth;
            var x1 = obj.points[i - 1].X * MainObj.Scale + MainObj.CanvasL;
            var y1 = obj.points[i - 1].Y * MainObj.Scale + MainObj.CanvasT;
            var x2 = obj.points[i].X * MainObj.Scale + MainObj.CanvasL;
            var y2 = obj.points[i].Y * MainObj.Scale + MainObj.CanvasT;
            cxt.moveTo(x1, y1);
            cxt.lineTo(x2, y2);
            cxt.stroke();
        }
    } else if (obj.BrushType == 'line') {
        // 直線
        var newCxt = newSharpSet();
        var canvas = newCxt.canvas;
        canvas.id = obj.id;
        newCxt.clearRect(0, 0, canvas.width, canvas.height);
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        newCxt.beginPath();
        var x1 = obj.points[0].X * MainObj.Scale + MainObj.CanvasL;
        var y1 = obj.points[0].Y * MainObj.Scale + MainObj.CanvasT;
        var x2 = obj.points[1].X * MainObj.Scale + MainObj.CanvasL;
        var y2 = obj.points[1].Y * MainObj.Scale + MainObj.CanvasT;
        newCxt.moveTo(x1, y1);
        newCxt.lineTo(x2, y2);
        newCxt.stroke();
    } else if (obj.BrushType == 'rect') {
        // 矩形
        var newCxt = newSharpSet();
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        var canvas = newCxt.canvas;
        canvas.id = obj.id;
        var x1 = obj.points[0].X * MainObj.Scale + MainObj.CanvasL;
        var y1 = obj.points[0].Y * MainObj.Scale + MainObj.CanvasT;
        var width = (obj.points[1].X - obj.points[0].X) * MainObj.Scale;
        var height = (obj.points[1].Y - obj.points[0].Y) * MainObj.Scale;
        newCxt.strokeRect(x1, y1, width, height);
        newCxt.stroke();
    } else {
        // 圓形
        var newCxt = newSharpSet();
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        var canvas = newCxt.canvas;
        canvas.id = obj.id;
        var x1 = obj.points[0].X * MainObj.Scale + MainObj.CanvasL;
        var y1 = obj.points[0].Y * MainObj.Scale + MainObj.CanvasT;
        var width = (obj.points[1].X - obj.points[0].X) * MainObj.Scale;
        var height = (obj.points[1].Y - obj.points[0].Y) * MainObj.Scale;
        newCxt.save();
        var a = width / 2;
        var b = height / 2;
        var r = (a > b) ? a : b;
        var ratioX = a / r;
        var ratioY = b / r;
        newCxt.scale(ratioX, ratioY);
        newCxt.beginPath();
        newCxt.arc(x1 / ratioX, y1 / ratioY, r, 0, 2 * Math.PI, false);
        newCxt.closePath();
        newCxt.restore();
        newCxt.stroke();
    }
}

function checkPen() {
    for (var i = 0; i < colorPen.LineList.length; i++) {
        for (var j = 0; j < MainObj.trashList.length; j++) {
            if (colorPen.LineList[i].id == MainObj.trashList[j].id) {
                colorPen.LineList.splice(i, 1);
            }
        }
    }
}

/** 開始畫註解 */
function startComment(event) {

    comment.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    comment.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    comment.Drag = true;

    comment.lastPoint = {
        x: comment.Down.X,
        y: comment.Down.Y
    };

}

function moveComment(event, canvas) {

    comment.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    comment.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    var cxt = canvas.getContext('2d');
    if (comment.Drag) {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        cxt.beginPath();
        cxt.moveTo(comment.Down.X, comment.Down.Y);

        comment.lastPoint = getLastPoint(comment.Down, comment.Move);
        cxt.lineTo(comment.lastPoint.x, comment.lastPoint.y);

        cxt.stroke();
    }
}

function upComment(canvas) {
    comment.Drag = false;

    var newCxt = newSharpSet();
    $(newCxt.canvas).addClass('commentObj');
    $(newCxt.canvas).addClass('commentNote');
    newCxt.strokeStyle = '#000000';
    newCxt.lineWidth = 3;

    newCxt.clearRect(0, 0, canvas.width, canvas.height);
    newCxt.beginPath();
    newCxt.moveTo(comment.Down.X, comment.Down.Y);
    newCxt.lineTo(comment.lastPoint.x, comment.lastPoint.y);
    newCxt.stroke();

    var tempCxt = canvas.getContext('2d');
    tempCxt.clearRect(0, 0, canvas.width, canvas.height);

    NewCanvas();
    var commentBall = $('#canvas')[0];
    commentBall.id = 'ball' + newCxt.canvas.id;
    commentBall.width = 20;
    commentBall.height = 20;
    var ballLeft = (comment.lastPoint.x + comment.Down.X) / 2 - 10;
    var ballTop = (comment.lastPoint.y + comment.Down.Y) / 2 - 10;
    $(commentBall).addClass('commentNote');
    $(commentBall).css({
        'left': ballLeft,
        'top': ballTop
    });
    var commentBallCxt = commentBall.getContext('2d');
    commentBallCxt.fillStyle = '#ff0000';
    commentBallCxt.beginPath();
    commentBallCxt.arc(10, 10, 10, 0, 2 * Math.PI);
    commentBallCxt.fill();

    var textDiv = document.createElement('div');
    textDiv.id = 'textDiv' + newCxt.canvas.id;
    $('#HamastarWrapper').append(textDiv);
    $(textDiv).addClass('commentTextDiv');
    $(textDiv).addClass('canvasObj');
    $(textDiv).addClass('commentNote');
    $(textDiv).css({
        'left': ballLeft,
        'top': ballTop + 30
    });

    $(textDiv)
        .draggable({
            handle: '.commentBtns'
        })
        .resizable({
            minHeight: 300,
            minWidth: 450,
            alsoResize: '#cke_text' + newCxt.canvas.id + '>.cke_inner>.cke_contents',
            start: function () {
                $(window).off("resize", resizeInit);
            },
            stop: function (event, ui) {
                $(window).resize(resizeInit);
            }
        });

    $(textDiv).append(
        '<div class=\"commentBtns\"><img class=\"commentBg\" onClick=\"commentBg(\'' + newCxt.canvas.id + '\')\" src=\"ToolBar/palette_icon.png\"><img class=\"commentNarrow\" onClick=\"commentNarrow(\'' + newCxt.canvas.id + '\')\" src=\"ToolBar/txtnarrow.png\"><img class=\"commentClose\" onClick=\"commentClose(\'' + newCxt.canvas.id + '\')\" src=\"ToolBar/txtclose.png\"></div>'
    );

    var commentText = document.createElement('textarea');
    commentText.id = 'text' + newCxt.canvas.id;
    $(textDiv).append(commentText);

    var editor = CKEDITOR.replace(commentText.id, {
        on: {
            instanceReady: function (e) {
                editor.on('change', function (e) {
                    saveComment();
                    // saveUndoComment(newCxt.canvas.id, 'edit');
                })
                $('.cke_resizer').css('border-width', '30px 30px 0 0')
            }
        }
    });
    $(commentBall).click(function (e) {
        e.preventDefault();
        $('#textDiv' + newCxt.canvas.id).toggle();
    });

    comment.positionList[newCxt.canvas.id] = {
        position: {
            from: {
                x: (comment.Down.X - MainObj.CanvasL) / MainObj.Scale,
                y: (comment.Down.Y - MainObj.CanvasT) / MainObj.Scale
            },
            to: {
                x: (comment.lastPoint.x - MainObj.CanvasL) / MainObj.Scale,
                y: (comment.lastPoint.y - MainObj.CanvasT) / MainObj.Scale
            }
        }
    };

    saveComment();

    changeAllBtnToFalse();
    GalleryStartMove();
    ToolBarList.AddWidgetState = 'none';
    $('#canvasPad').remove();

    MainObj.saveList.push({
        id: newCxt.canvas.id,
        page: MainObj.NowPage,
        type: 'comment',
        value: CKEDITOR.instances['text' + newCxt.canvas.id].getData(),
        position: comment.positionList[newCxt.canvas.id].position,
        action: 'add'
    });
    if (MainObj.saveList.length > 5) {
        MainObj.saveList.splice(0, 1);
    }

}
/** 結束畫註解 */

function saveUndoComment(id, action) {
    if (MainObj.saveList.length) {
        if (MainObj.saveList[MainObj.saveList.length - 1].id == id && MainObj.saveList[MainObj.saveList.length - 1].value == CKEDITOR.instances['text' + id].getData()) return;
    }

    MainObj.saveList.push({
        id: id,
        page: MainObj.NowPage,
        type: 'comment',
        value: CKEDITOR.instances['text' + id].getData(),
        position: comment.positionList[id].position,
        action: action
    });
    if (MainObj.saveList.length > 5) {
        MainObj.saveList.splice(0, 1);
    }
}

// 用四個象限判斷畫直線或橫線
function getLastPoint(start, end) {
    if (end.X < start.X && end.Y < start.Y) {
        // 左上
        if (start.X - end.X > start.Y - end.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else if (end.X > start.X && end.Y < start.Y) {
        // 右上
        if (end.X - start.X > start.Y - end.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else if (end.X > start.X && end.Y > start.Y) {
        // 右下
        if (end.X - start.X > end.Y - start.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else if (end.X < start.X && end.Y > start.Y) {
        // 左下
        if (start.X - end.X > end.Y - start.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else {
        return {
            x: start.X,
            y: start.Y
        }
    }
}

// 儲存註記資訊
function saveComment() {
    for (var i = 0; i < $('.commentObj').length; i++) {
        var obj = $('.commentObj')[i];
        for (var x = 0; x < comment.saveList.length; x++) {
            if (obj.id == comment.saveList[x].id) {
                comment.saveList.splice(x, 1);
            }
        }

        var temp = {
            id: obj.id,
            page: MainObj.NowPage,
            type: 'comment',
            value: CKEDITOR.instances['text' + obj.id].getData(),
            position: comment.positionList[obj.id].position
        };
        comment.saveList.push(temp);

    }
}

// 回復註記
function replyComment(page) {
    $('.commentNote').remove();
    $(comment.saveList).each(function () {
        if (this.page == page && this.type == 'comment') {
            reDrawComment(this, function (editor, obj) {
                editor.on('change', function (e) {
                    saveComment();

                    saveUndoComment(obj.id, 'edit');
                })
            });
        }
    });
}

// 重建單個comment
function reDrawComment(obj, callback) {
    var newCxt = newSharpSet();
    newCxt.canvas.id = obj.id;
    $(newCxt.canvas).addClass('commentObj');
    $(newCxt.canvas).addClass('commentNote');
    newCxt.strokeStyle = '#000000';
    newCxt.lineWidth = 3;

    var fromX = (obj.position.from.x * MainObj.Scale) + MainObj.CanvasL,
        fromY = (obj.position.from.y * MainObj.Scale) + MainObj.CanvasT,
        toX = (obj.position.to.x * MainObj.Scale) + MainObj.CanvasL,
        toY = (obj.position.to.y * MainObj.Scale) + MainObj.CanvasT;

    newCxt.clearRect(0, 0, newCxt.canvas.width, newCxt.canvas.height);
    newCxt.beginPath();
    newCxt.moveTo(fromX, fromY);
    newCxt.lineTo(toX, toY);
    newCxt.stroke();

    NewCanvas();
    var commentBall = $('#canvas')[0];
    commentBall.id = 'ball' + obj.id;
    commentBall.width = 20;
    commentBall.height = 20;
    var ballLeft = (toX + fromX) / 2 - 10;
    var ballTop = (toY + fromY) / 2 - 10;
    $(commentBall).addClass('commentNote');
    $(commentBall).css({
        'left': ballLeft,
        'top': ballTop
    });
    var commentBallCxt = commentBall.getContext('2d');
    commentBallCxt.fillStyle = '#ff0000';
    commentBallCxt.beginPath();
    commentBallCxt.arc(10, 10, 10, 0, 2 * Math.PI);
    commentBallCxt.fill();

    var textDiv = document.createElement('div');
    textDiv.id = 'textDiv' + obj.id;
    $('#HamastarWrapper').append(textDiv);
    $(textDiv).addClass('commentTextDiv');
    $(textDiv).addClass('canvasObj');
    $(textDiv).addClass('commentNote');
    $(textDiv).css({
        // 'display': 'none',
        'left': ballLeft,
        'top': ballTop + 30
    });

    $(textDiv)
        .draggable({
            handle: '.commentBtns'
        })
        .resizable({
            minHeight: 300,
            minWidth: 450,
            alsoResize: '#cke_text' + obj.id + '>.cke_inner>.cke_contents',
            start: function () {
                $(window).off("resize", resizeInit);
            },
            stop: function (event, ui) {
                $(window).resize(resizeInit);
            }
        });

    $(textDiv).append(
        '<div class=\"commentBtns\"><img class=\"commentBg\" onClick=\"commentBg(\'' + newCxt.canvas.id + '\')\" src=\"ToolBar/palette_icon.png\"><img class=\"commentNarrow\" onClick=\"commentNarrow(\'' + newCxt.canvas.id + '\')\" src=\"ToolBar/txtnarrow.png\"><img class=\"commentClose\" onClick=\"commentClose(\'' + newCxt.canvas.id + '\')\" src=\"ToolBar/txtclose.png\"></div>'
    );

    var commentText = document.createElement('textarea');
    commentText.id = 'text' + obj.id;
    $(textDiv).append(commentText);
    $(commentText).css({
        'display': 'none',
        'height': '100%',
        'resize': 'none'
    })
    var that = obj;
    setTimeout(function () {
        if (CKEDITOR.instances[commentText.id]) {
            CKEDITOR.instances[commentText.id].destroy();
        }
        var editor = CKEDITOR.replace(commentText.id, {
            on: {
                instanceReady: function (e) {
                    CKEDITOR.instances[commentText.id].setData(that.value);
                    $('.cke_resizer').css('border-width', '30px 30px 0 0');
                    if (callback) {
                        callback(editor, obj);
                    }
                }
            }
        });
    })

    $(commentBall).click(function (e) {
        e.preventDefault();
        $('#textDiv' + newCxt.canvas.id).toggle();
    });

    comment.positionList[newCxt.canvas.id] = {
        position: {
            from: {
                x: (fromX - MainObj.CanvasL) / MainObj.Scale,
                y: (fromY - MainObj.CanvasT) / MainObj.Scale
            },
            to: {
                x: (toX - MainObj.CanvasL) / MainObj.Scale,
                y: (toY - MainObj.CanvasT) / MainObj.Scale
            }
        }
    };
}

function commentNarrow(id) {
    $('#textDiv' + id).toggle();
}

//background color button設置
function commentBg(id, color) {
    if (!color) {
        color = '#fdecac';
    }
    $('.commentBgcolor')[0].value = color;
    $('.commentBgcolor').css('background-color', color);
    $('.bgColorPickerComment').toggle();
    txtNote.selectedCommentBgId = id;
}

function changeCommentBg() {
    $('.bgColorPickerComment').toggle();
    $('#textDiv' + txtNote.selectedCommentBgId).css({
        'border': '3px solid ' + $('.commentBgcolor')[0].value,
        'background-color': $('.commentBgcolor')[0].value
    });
}

function commentClose(id) {
    confirmShow('是否確定刪除物件', function (res) {
        if (res) {
            removeComment(id);

            for (var i = 0; i < comment.saveList.length; i++) {
                if (id == comment.saveList[i].id) {
                    comment.saveList.splice(i, 1);
                }
            }
        }
    })
}

function removeComment(id) {
    $('#' + id).remove();
    $('#ball' + id).remove();
    $('#textDiv' + id).remove();
}