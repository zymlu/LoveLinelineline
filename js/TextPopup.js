// 文字彈跳視窗

var textBorderId = null;

function setTextPopup(obj) {
    NewCanvas(obj);
    var canvas = $('#canvas')[0];
    canvas.id = obj.Identifier;
    canvas.width = obj.Width * MainObj.Scale;
    canvas.height = obj.Height * MainObj.Scale;
    $(canvas).css({
        'left': obj.Left * MainObj.Scale + MainObj.CanvasL,
        'top': obj.Top * MainObj.Scale + MainObj.CanvasT
    })
    var cxt = canvas.getContext('2d');
    drawButtonImage(obj, cxt, canvas.width, canvas.height);
    $(canvas).click(function (e) {
        e.preventDefault();
        if ($('#div' + obj.Identifier)[0]) {
            $('#div' + obj.Identifier).toggle();
            return;
        }
        var btnSize = 36 * MainObj.Scale;

        var div = document.createElement('div');
        div.id = 'div' + obj.Identifier;
        $('#HamastarWrapper').append(div);
        $(div)
            .css({
                'position': 'absolute',
                'border-style': 'solid',
                'border-color': obj.ViewBorderBrush || '#ffff00',
                'border-width': btnSize + 'px 3px 3px 3px',
                'width': obj.Position.W * MainObj.Scale,
                'height': obj.Position.H * MainObj.Scale - btnSize,
                'left': obj.Position.X * MainObj.Scale + MainObj.CanvasL,
                'top': obj.Position.Y * MainObj.Scale + MainObj.CanvasT
            })
            .addClass('canvasObj textPopup')
            .attr('Identifier', obj.Identifier)

        var title = document.createElement('label');
        $(div).append(title);
        title.id = 'title' + obj.Identifier;
        $(title).text(obj.Title);
        $(title).css({
            'position': 'absolute',
            'top': -btnSize,
            'font-size': btnSize,
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap'
        })

        var textArea = document.createElement('textarea');
        textArea.id = 'text' + obj.Identifier;
        $(div).append(textArea);
        var editor = CKEDITOR.replace('text' + obj.Identifier, {
            on: {
                instanceReady: function (e) {
                    $('.cke_top').css('display', 'none');
                    CKEDITOR.instances['text' + obj.Identifier].resize($('#div' + obj.Identifier).width(), $('#div' + obj.Identifier).height());
                    editor.setData(obj.Content);
                }
            }
        });

        $('#div' + obj.Identifier)
            .draggable({
                scroll: false
            }).resizable({
                minHeight: 400,
                minWidth: 400,
                start: function () {
                    $(window).off("resize", resizeInit);
                },
                resize: function () {
                    CKEDITOR.instances['text' + obj.Identifier].resize($('#div' + obj.Identifier).width(), $('#div' + obj.Identifier).height());
                    $('#title' + obj.Identifier).css('width', $('#div' + obj.Identifier).width());
                },
                stop: function () {
                    $(window).resize(resizeInit);
                }
            });



        setTextCloseBtn(div, obj.Identifier, btnSize);
        setTextEditBtn(div, obj.Identifier, btnSize);
        setTextBorderBtn(div, obj.Identifier, btnSize, obj.ViewBorderBrush || '#ffff00');
    });
}

// 文字彈跳視窗關閉按鈕設置
function setTextCloseBtn(div, id, btnSize) {
    var closeBtn = document.createElement('div');
    closeBtn.id = 'closeBtn';
    $(div).append(closeBtn);
    var closeImg = new Image();
    $(closeBtn).append(closeImg);
    closeImg.onload = function () {
        closeImg.width = btnSize;
        closeImg.height = btnSize;
    }
    $(closeBtn).css({
        'top': -btnSize
    });
    closeImg.src = 'ToolBar/txtclose.png';
    $(closeBtn).click(function (e) {
        e.preventDefault();
        $('#div' + id).toggle();
    })
}

// 文字彈跳視窗編輯按鈕設置
function setTextEditBtn(div, id, btnSize) {
    var narrowBtn = document.createElement('div');
    narrowBtn.id = 'narrowBtn';
    $(div).append(narrowBtn);
    var narrowImg = new Image();
    $(narrowBtn).append(narrowImg);
    narrowImg.onload = function () {
        narrowImg.width = btnSize;
        narrowImg.height = btnSize;
        $(narrowBtn).css({
            'right': narrowImg.width,
            'top': -btnSize
        });
    }
    narrowImg.src = 'ToolBar/txtnarrow.png';
    $(narrowBtn).click(function (e) {
        e.preventDefault();
        $('.cke_top').toggle();
        CKEDITOR.instances['text' + id].resize($('#div' + id).width(), $('#div' + id).height());
    })
}

// 文字彈跳視窗邊框顏色按鈕設置
function setTextBorderBtn(div, id, btnSize, color) {
    //引用調色盤套件
    $('#textNoteBgcolor').farbtastic('.textNoteBgcolor');

    if (!color) {
        color = '#fdecac';
    }
    var narrowBtn = document.createElement('div');
    narrowBtn.id = 'narrowBtn';
    $(div).append(narrowBtn);
    var narrowImg = new Image();
    $(narrowBtn).append(narrowImg);
    narrowImg.onload = function() {
        narrowImg.width = 36 * MainObj.Scale;
        narrowImg.height = 36 * MainObj.Scale;
        $(narrowBtn).css('right', btnSize * 2);
    }
    $(narrowBtn).click(function (e) {
        e.preventDefault();
        $('.textNoteBgcolor')[0].value = color;
        $('.textNoteBgcolor').css('background-color', color);
        $('.bgColorPicker').toggle();
        textBorderId = id;
    })
}

// 變換文字彈跳視窗邊框顏色
function changeTextBorder() {
    $('.bgColorPicker').toggle();
    $('#div' + textBorderId).css('border-color', $('.textNoteBgcolor')[0].value);
    $('.color-' + textBorderId).css('background-color', $('.textNoteBgcolor')[0].value);
}