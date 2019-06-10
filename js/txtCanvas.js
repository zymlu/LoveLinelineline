//便利貼

var txtCanvas = {
    Move: {X: 0, Y: 0}, //mousedown
    Down: {X: 0, Y: 0}, //mousemove
    Drag: false,
    Line: {X: [], Y: []},   //存入畫線的所有座標
    canvasList: [],
    SaveList: [],
    selectedCanvasBgId: null
}


function txtCanvasLayer() {

    var ID = newguid();

    var divBox = document.createElement('div');
    $('#HamastarWrapper').append(divBox);
    divBox.id = ID;
    $(divBox).attr('class', 'CanvasBox');
    $(divBox).css('z-index', 1);

    if (ToolBarList.AddWidgetState == 'IRStxtcanvas') {
        $(divBox).addClass('IRScanvas');
    }
    
    var div = document.createElement('div');
    $(divBox).append(div);
    div.id = 'Div' + ID;
    $(div).draggable({
        //如果有移動，則不觸發click事件
        stop: function(event, ui) {
            $(this).addClass('noclick');
            FindBoundary(ui, div);

            SaveCanvas();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);
        }
    });

    NewCanvas();
    var canvas = $('#canvas')[0];
    $(div).append(canvas);
    var cxt = canvas.getContext('2d');
    canvas.id = 'txtCanvas' + ID;
    $(canvas).attr('class', 'noteCanvas');

    // var Left = event.clientX;
    // var Top = event.clientY;

    var Left = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    var Top = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    var img = new Image();
    img.onload = function() {
        canvas.width = 400 * MainObj.Scale;
        canvas.height = img.height * MainObj.Scale;
        // resizeCanvas(canvas, cxt);
        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);

        var newPosition = txtPosition(Left, Top, canvas);
        Left = newPosition[0];
        Top = newPosition[1];

        $('#' + div.id).css({
            'position': 'absolute',
            'width': canvas.width,
            'height': canvas.height,
            'left': Left,
            'top': Top
        })

        txtCloseSetting(div, ID);
        txtNarrowLayer(div, ID);
        txtCanvasBackgroundBtn(div, ID);
        CanvasNarrowSmall(divBox, img, ID);

        var canvasArea = txtCanvasArea(div, img, ID);

        //canvasArea畫畫
        $(canvasArea).on('mousedown', function(e) { txtCanvasDown(e, this, div) })
        $(canvasArea).on('mousemove', function(e) { txtCanvasMove(e, this) });
        $(canvasArea).on('mouseup', function() { txtCanvasUp(this, div) });
        $(canvasArea).on('mouseout', function() { txtCanvasUp(this, div) });

        $(canvasArea).on('touchstart', function(e) { txtCanvasDown(e, this, div) })
        $(canvasArea).on('touchmove', function(e) { txtCanvasMove(e, this) });
        $(canvasArea).on('touchend', function() { txtCanvasUp(this, div) });

        //紀錄canvas縮放後的scale
        $(canvasArea).attr('ScaleW', 1);
        $(canvasArea).attr('ScaleH', 1);

        $(canvasArea).resizable({
            minHeight: canvas.height,
            minWidth: canvas.width,
            start: function() {
                $(window).off("resize", resizeInit);
            },
            resize: function() {
                var Width = Number(this.style.width.split('px')[0]);
                canvas.width = Width;
                cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                $('#' + div.id).css('width', Width);
                $(canvasArea).css({
                    'position': 'absolute',
                    'top': 0
                })
            },
            stop: function(event, ui) {
                var NewWidth = ui.size.width;
                var NewHeight = ui.size.height;

                canvasArea.width = NewWidth;
                canvasArea.height = NewHeight;

                var cxtArea = canvasArea.getContext('2d');
                // cxtArea.fillStyle = "#fdfdc8";
                // cxtArea.fillRect(0, 0, canvasArea.width, canvasArea.height);
                txtCanvas.SaveList.map(function(res) {
                    if (res) {
                        for (var i = 0; i < res.points.length; i++) {
                            if (res.points[i]) {
                                for (var p = 1; p < res.points[i].length; p++) {
                                    if (cxtArea.canvas.id == res.points[i][0].id) {
                                        cxtArea.lineWidth = 3;

                                        var x1 = res.points[i][p - 1].X * MainObj.Scale;
                                        var y1 = res.points[i][p - 1].Y * MainObj.Scale;
                                        var x2 = res.points[i][p].X * MainObj.Scale;
                                        var y2 = res.points[i][p].Y * MainObj.Scale;

                                        cxtArea.moveTo(x1, y1);
                                        cxtArea.lineTo(x2, y2);
                                        cxtArea.stroke();
                                    }
                                }
                            }
                        }
                    }
                });

                $(canvasArea).attr('ScaleW', NewWidth / canvasArea.width);
                $(canvasArea).attr('ScaleH', NewHeight / canvasArea.height);

                SaveCanvas();
                $(window).resize(resizeInit);
            }
        });

        SaveCanvas();
        MainObj.saveList.push({
            page: MainObj.NowPage,
            id: ID,
            type: 'txtCanvas',
            top: Top + 'px',
            left: Left + 'px',
            points: [],
            StickyViewVisibility: FindStickyViewVisibility(ID),
            action: 'add'
        });
        if (MainObj.saveList.length > 5) {
            MainObj.saveList.splice(0, 1);
        }

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

    }
    img.src = 'ToolBar/txtcanvas.png';
}

//background color button設置
function txtCanvasBackgroundBtn(div, id, color) {
    if (!color) {
        color = '#fdfdc8';
    }
    var narrowBtn = document.createElement('div');
    narrowBtn.id = 'narrowBtn';
    $(div).append(narrowBtn);
    var narrowImg = new Image();
    $(narrowBtn).append(narrowImg);
    narrowImg.onload = function() {
        narrowImg.width = 36 * MainObj.Scale;
        narrowImg.height = 36 * MainObj.Scale;
        $(narrowBtn).css('right', 36 * MainObj.Scale * 2);
    }
    narrowImg.src = 'ToolBar/palette_icon.png';

    // var colorBtn = document.createElement('button');
    // colorBtn.id = 'narrowBtn';
    // $(colorBtn).addClass('color-' + id)
    // $(div).append(colorBtn);
    // $(colorBtn).css({
    //     'right': 36 * MainObj.Scale * 2,
    //     'width': 30 * MainObj.Scale,
    //     'height': 30 * MainObj.Scale,
    //     'background-color': color,
    //     'border': '2px solid #fcecae',
    //     'margin-top': '2px'
    // })
    $(narrowBtn).click(function(e) {
        e.preventDefault();
        $('.canvasBgcolor')[0].value = color;
        $('.canvasBgcolor').css('background-color', color);
        $('.bgColorPickerCanvas').toggle();
        txtCanvas.selectedCanvasBgId = id;
    })
}

// 變換文字便利貼背景色
function changeCanvasBg() {
    $('.bgColorPickerCanvas').toggle();
    $('.' + txtCanvas.selectedCanvasBgId).css('background-color', $('.canvasBgcolor')[0].value);
    $('.color-' + txtCanvas.selectedCanvasBgId).css('background-color', $('.canvasBgcolor')[0].value);
}

//便利貼小圖設置
function CanvasNarrowSmall(div, img, id) {
    //note小圖
    var narrowDiv = document.createElement('div');
    $(div).append(narrowDiv);
    narrowDiv.id = 'narrowDiv' + id;
    $(narrowDiv).attr('class', 'narrowDiv');
    $(narrowDiv).css({
        'position': 'absolute',
        'width': img.width,
        'height': img.height
    })
    var smallImg = new Image();
    $(narrowDiv).append(smallImg);
    smallImg.onload = function() {
        smallImg.width = 50 * MainObj.Scale;
        smallImg.height = 50 * MainObj.Scale;
    }
    smallImg.src = 'ToolBar/paste1.png';
    $(narrowDiv).css({
        'display': 'none'
    });
    txtNarrowSetting(narrowDiv, id);
    $(narrowDiv).draggable({
        //如果有移動，則不觸發click事件
        stop: function(event, ui) {
            $(this).addClass('noclick');

            var left = ui.offset.left;
            var top = ui.offset.top;
            var width = 50 * MainObj.Scale;
            var height = 50 * MainObj.Scale;

            var canvasW = $('#CanvasGallery')[0].width + MainObj.CanvasL;
            var canvasH = $('#CanvasGallery')[0].height + MainObj.CanvasT;

            if (left < MainObj.CanvasL) {
                $(narrowDiv).css('left', MainObj.CanvasL);
            } else if (left + width > canvasW) {
                $(narrowDiv).css('left', canvasW - width);
            } else if (top < MainObj.CanvasT) {
                $(narrowDiv).css('top', MainObj.CanvasT);
            } else if (top + height > canvasH) {
                $(narrowDiv).css('top', canvasH - height);
            }

            $('#Div' + id).css({
                'left': $(narrowDiv)[0].offsetLeft,
                'top': $(narrowDiv)[0].offsetTop
            })

            SaveCanvas();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);

        }
    });
}

//便利貼畫圖區域設置
function txtCanvasArea(div, img, id) {
    //畫畫區域
    var canvasArea = document.createElement('canvas');
    var cxtArea = canvasArea.getContext('2d');
    canvasArea.width = 400 * MainObj.Scale;
    canvasArea.height = 300 * MainObj.Scale;
    canvasArea.id = id;
    $(canvasArea).attr('class', 'canvasArea');
    $(canvasArea).addClass(id);
    $(div).append(canvasArea);
    $(canvasArea).css({
        'position': 'absolute',
        'top': Math.floor(img.height * MainObj.Scale),
        'background-color': '#fdfdc8'
    })
    // cxtArea.fillStyle = "#fdfdc8";
    // cxtArea.fillRect(0, 0, canvasArea.width, canvasArea.height);

    // resizeCanvas(canvasArea, cxtArea);

    return canvasArea;
}

function txtCanvasDown(event, canvas, div) {
    //便利貼縮放後的滑鼠座標位置會跑掉，因此要除上縮放後的scale

    var scaleW = $(canvas).attr('ScaleW');
    var scaleH = $(canvas).attr('ScaleH');

    // txtCanvas.Down.X = event.offsetX / scaleW;
    // txtCanvas.Down.Y = event.offsetY / scaleH;
    txtCanvas.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX - $(canvas).offset().left : event.offsetX;
    txtCanvas.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY - $(canvas).offset().top : event.offsetY;

    txtCanvas.Down.X = txtCanvas.Down.X / scaleW;
    txtCanvas.Down.Y = txtCanvas.Down.Y / scaleH;

    txtCanvas.Drag = true;

    //將畫線的座標都存入txtCanvas.Line裡面
    var list = {X: Number(txtCanvas.Down.X), Y: Number(txtCanvas.Down.Y)};
    txtCanvas.Line.X.push(list.X);
    txtCanvas.Line.Y.push(list.Y);

    //停止draggable事件
    $(div).draggable('destroy');
    
}

function txtCanvasMove(event, canvas) {
    //便利貼縮放後的滑鼠座標位置會跑掉，因此要除上縮放後的scale

    var scaleW = $(canvas).attr('ScaleW');
    var scaleH = $(canvas).attr('ScaleH');

    // txtCanvas.Move.X = event.offsetX / scaleW;
    // txtCanvas.Move.Y = event.offsetY / scaleH;
    txtCanvas.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX - $(canvas).offset().left : event.offsetX;
    txtCanvas.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY - $(canvas).offset().top : event.offsetY;

    txtCanvas.Move.X = txtCanvas.Move.X / scaleW;
    txtCanvas.Move.Y = txtCanvas.Move.Y / scaleH;

    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    if (txtCanvas.Drag && !MainObj.isPinch) {
        // console.log(txtCanvas.Move.X + ',' + txtCanvas.Move.Y);
        cxt.lineWidth = 3;

        cxt.moveTo(txtCanvas.Down.X, txtCanvas.Down.Y);
        cxt.lineTo(txtCanvas.Move.X, txtCanvas.Move.Y);
        cxt.stroke();

        //將( txtCanvas.Move.X , txtCanvas.Move.Y )取代起始點
        txtCanvas.Down.X = txtCanvas.Move.X;
        txtCanvas.Down.Y = txtCanvas.Move.Y;

        //將畫線的座標都存入txtCanvas.Line裡面
        var list = {X: Number(txtCanvas.Move.X), Y: Number(txtCanvas.Move.Y)};
        txtCanvas.Line.X.push(list.X);
        txtCanvas.Line.Y.push(list.Y);

    }
}

function txtCanvasUp(canvas, div) {
    if (txtCanvas.Drag) {
        // txtCanvas.canvasList.points = [];
        var list = [];
        for (var i = 1; i < txtCanvas.Line.X.length; i++) {
            // txtCanvas.canvasList.points.push({X: txtCanvas.Line.X[i], Y: txtCanvas.Line.Y[i]});
            list.push({X: txtCanvas.Line.X[i] / MainObj.Scale, Y: txtCanvas.Line.Y[i] / MainObj.Scale, id: canvas.id});
        }
        txtCanvas.canvasList.push(list);

        SaveCanvas();
        saveUndoCanvas(canvas.id, 'edit');

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

        txtCanvas.Line = {X: [], Y: []};

        //重新綁上draggable事件
        $(div).draggable({
            //如果有移動，則不觸發click事件
            stop: function(event, ui) {
                $(this).addClass('noclick');
                FindBoundary(ui, div);

                SaveCanvas();

                var syncXML = toSyncXML();
                var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
                rmcall(message);
            }
        });

        txtCanvas.Drag = false;
    }
}

// 儲存便利貼還原資訊
function saveUndoCanvas(id, action) {
    var left = ($('#Div' + id).offset().left - MainObj.CanvasL) / MainObj.Scale;
    var top = ($('#Div' + id).offset().top - MainObj.CanvasT) / MainObj.Scale;
    MainObj.saveList.push({
        page: MainObj.NowPage,
        id: id,
        type: 'txtCanvas',
        top: top + 'px',
        left: left + 'px',
        points: txtCanvas.canvasList.slice(0),
        StickyViewVisibility: FindStickyViewVisibility(id),
        action: action
    });
    if (MainObj.saveList.length > 5) {
        MainObj.saveList.splice(0, 1);
    }
}

//初始化
function txtCanvasReset() {
    $('.CanvasBox').remove();
}

//儲存note的資訊於txtCanvas.SaveList
function SaveCanvas() {

    if (ToolBarList.AddWidgetState == 'IRStxtcanvas') return;

    var list = {};
    var note = $('.canvasArea');

    if (txtCanvas.SaveList.length > 0) {
        for (var x = 0; x < txtCanvas.SaveList.length; x++) {
            if (txtCanvas.SaveList[x] != undefined) {
                if (txtCanvas.SaveList[x].page == MainObj.NowPage) {
                    delete txtCanvas.SaveList[x];
                }
            }
        }
    }

    for (var i = 0; i < note.length; i++) {
        var tmp;
        if (FindStickyViewVisibility(note[i].id) == 'true') {
            var tmp = '#Div';
        } else {
            var tmp = '#narrowDiv';
        }

        var left = ($(tmp + note[i].id).offset().left - MainObj.CanvasL) / MainObj.Scale;
        var top = ($(tmp + note[i].id).offset().top - MainObj.CanvasT) / MainObj.Scale;
        
        list = {
            page: MainObj.NowPage,
            id: note[i].id,
            type: 'txtCanvas',
            width: $(note[i]).css('width'),
            height: $(note[i]).css('height'),
            top: top + 'px',
            left: left + 'px',
            // points: txtCanvas.canvasList.points,
            points: txtCanvas.canvasList,
            StickyViewVisibility: FindStickyViewVisibility(note[i].id)
        };
            
        txtCanvas.SaveList.push(list);
    }
}

//如有文字便利貼註記，從txtCanvas.SaveList取得
function ReplyCanvas(page) {

    $('.txtCanvas').remove();
    $(txtCanvas.SaveList).each(function() {

        if (this != undefined) {
            if (this.page == page) {
                reSetCanvas(this);
            }
        }

    })
}

function reSetCanvas(obj) {
    if ($('#' + obj.id)[0] != undefined) {
        $('#' + obj.id).remove();
    }

    var ID = obj.id;
    var note = obj;

    var divBox = document.createElement('div');
    $('#HamastarWrapper').append(divBox);
    divBox.id = ID;
    $(divBox).attr('class', 'CanvasBox');
    $(divBox).css('z-index', 1);
    $(divBox).addClass('txtCanvas');
    
    var div = document.createElement('div');
    $(divBox).append(div);
    div.id = 'Div' + ID;
    $(div).draggable({
        //如果有移動，則不觸發click事件
        stop: function(event, ui) {
            $(obj).addClass('noclick');
            FindBoundary(ui, div);
            SaveCanvas();
        }
    });

    NewCanvas();
    var canvas = $('#canvas')[0];
    $(div).append(canvas);
    var cxt = canvas.getContext('2d');
    canvas.id = 'txtCanvas' + ID;
    $(canvas).attr('class', 'noteCanvas');

    var Left = (Number(note.left.split('px')[0]) * MainObj.Scale) + MainObj.CanvasL;
    var Top = (Number(note.top.split('px')[0]) * MainObj.Scale) + MainObj.CanvasT;
    var img = new Image();
    img.onload = function() {
        // canvas.width = Number(note.width.split('px')[0]);
        // canvas.height = img.height;
        canvas.width = 400 * MainObj.Scale;
        canvas.height = img.height * MainObj.Scale;
        // resizeCanvas(canvas, cxt);
        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
        $('#' + div.id).css({
            'position': 'absolute',
            'width': canvas.width,
            'height': canvas.height,
            'left': Left + 'px',
            'top': Top + 'px'
        })

        txtCloseSetting(div, ID);
        txtNarrowLayer(div, ID);
        CanvasNarrowSmall(divBox, img, ID);
        txtCanvasBackgroundBtn(div, ID);

        var canvasArea = txtCanvasArea(div, img, ID);
        var cxtArea = canvasArea.getContext('2d');
        // resizeCanvas(canvasArea, cxtArea);
        // cxtArea.drawImage(note.canvas, 0, 0, canvasArea.width, canvasArea.height);

        if (note.points != undefined) {
            for (var i = 0; i < note.points.length; i++) {
                if (note.points[i]) {
                    for (var p = 1; p < note.points[i].length; p++) {
                        if (cxtArea.canvas.id == note.points[i][0].id) {
                            cxtArea.lineWidth = 3;

                            // var left = Number(Left.split('px')[0]);
                            // var top = Number(Top.split('px')[0]);

                            var x1 = note.points[i][p - 1].X * MainObj.Scale;
                            var y1 = note.points[i][p - 1].Y * MainObj.Scale;
                            var x2 = note.points[i][p].X * MainObj.Scale;
                            var y2 = note.points[i][p].Y * MainObj.Scale;

                            cxtArea.moveTo(x1, y1);
                            cxtArea.lineTo(x2, y2);
                            cxtArea.stroke();
                        }
                    }
                }
            }
        }

        $(canvasArea).css({
            'width': canvas.width,
            'height': 300 * MainObj.Scale
        })

        $(canvasArea).attr('ScaleW', canvas.width / canvasArea.width);
        $(canvasArea).attr('ScaleH', 300 * MainObj.Scale / canvasArea.height);

        //canvasArea畫畫
        $(canvasArea).on('mousedown', function(e) { txtCanvasDown(e, this, div) })
        $(canvasArea).on('mousemove', function(e) { txtCanvasMove(e, this) });
        $(canvasArea).on('mouseup', function() { txtCanvasUp(this, div) });
        $(canvasArea).on('mouseout', function() { txtCanvasUp(this, div) });

        $(canvasArea).on('touchstart', function(e) { txtCanvasDown(e, this, div) })
        $(canvasArea).on('touchmove', function(e) { txtCanvasMove(e, this) });
        $(canvasArea).on('touchend', function() { txtCanvasUp(this, div) });
        

        $(canvasArea).resizable({
            minHeight: canvas.height,
            minWidth: canvas.width,
            start: function() {
                $(window).off("resize", resizeInit);
            },
            resize: function() {
                var Width = Number(this.style.width.split('px')[0]);
                canvas.width = Width;
                cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                $('#' + div.id).css('width', Width);
            },
            stop: function(event, ui) {
                var NewWidth = ui.size.width;
                var NewHeight = ui.size.height;

                canvasArea.width = NewWidth;
                canvasArea.height = NewHeight;

                var cxtArea = canvasArea.getContext('2d');
                // cxtArea.fillStyle = "#fdfdc8";
                // cxtArea.fillRect(0, 0, canvasArea.width, canvasArea.height);
                txtCanvas.SaveList.map(function(res) {
                    if (res) {
                        for (var i = 0; i < res.points.length; i++) {
                            if (res.points[i]) {
                                for (var p = 1; p < res.points[i].length; p++) {
                                    if (cxtArea.canvas.id == res.points[i][0].id) {
                                        cxtArea.lineWidth = 3;

                                        var x1 = res.points[i][p - 1].X * MainObj.Scale;
                                        var y1 = res.points[i][p - 1].Y * MainObj.Scale;
                                        var x2 = res.points[i][p].X * MainObj.Scale;
                                        var y2 = res.points[i][p].Y * MainObj.Scale;

                                        cxtArea.moveTo(x1, y1);
                                        cxtArea.lineTo(x2, y2);
                                        cxtArea.stroke();
                                    }
                                }
                            }
                        }
                    }
                });

                $(canvasArea).attr('ScaleW', NewWidth / canvasArea.width);
                $(canvasArea).attr('ScaleH', NewHeight / canvasArea.height);

                SaveCanvas();
                $(window).resize(resizeInit);
            }
        });

        if (note.StickyViewVisibility == 'true') {
            $('#narrowDiv' + note.id).css('display', 'none');
            $('#Div' + note.id).css('display', 'block');
        } else {
            $('#narrowDiv' + note.id).css({
                'display': 'block',
                'left': $('#Div' + note.id).css('left'),
                'top': $('#Div' + note.id).css('top'),
            });
            $('#Div' + note.id).css('display', 'none');
        }

        SaveCanvas();

    }
    img.src = 'ToolBar/txtcanvas.png';
}

function txtPosition(left, top, canvas) {
    var width = canvas.width * MainObj.Scale;
    var height = canvas.height * MainObj.Scale;
    if (left + width > $('#CanvasGallery')[0].width + $('#CanvasGallery')[0].offsetLeft) {
        left = $('#CanvasGallery')[0].width + $('#CanvasGallery')[0].offsetLeft - width;
    }

    if (top + height + (300 * MainObj.Scale) > $('#CanvasGallery')[0].height + $('#CanvasGallery')[0].offsetTop) {
        top = $('#CanvasGallery')[0].height + $('#CanvasGallery')[0].offsetTop - height - (300 * MainObj.Scale);
    }

    return [left, top];
}

function FindStickyViewVisibility(id) {
    if ($('#narrowDiv' + id).css('display') == 'none' || $('#narrowDiv' + id).css('display') == undefined) {
        return 'true';
    } else {
        return 'false';
    }
}

function reDrawCanvas(obj) {
    var canvas = $('.' + obj.id)[0];
    var cxt = canvas.getContext('2d');

    cxt.clearRect(0, 0, canvas.width, canvas.height);
    // cxt.fillStyle = "#fdfdc8";
    // cxt.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < obj.points.length; i++) {
        if (obj.points[i]) {
            for (var p = 1; p < obj.points[i].length; p++) {
                if (canvas.id == obj.points[i][0].id) {
                    cxt.lineWidth = 3;

                    var x1 = obj.points[i][p - 1].X * MainObj.Scale;
                    var y1 = obj.points[i][p - 1].Y * MainObj.Scale;
                    var x2 = obj.points[i][p].X * MainObj.Scale;
                    var y2 = obj.points[i][p].Y * MainObj.Scale;

                    cxt.beginPath();
                    cxt.moveTo(x1, y1);
                    cxt.lineTo(x2, y2);
                    cxt.closePath();
                    cxt.stroke();
                    
                }
            }
        }
    }
}
