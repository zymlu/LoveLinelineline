//縮放

var syncZoomSlider = {};




//放大
function zoomIn() {

    GalleryStopMove();
    $(window).off("resize", resizeInit);

    $('#dragCanvas').remove();

    ZoomAttrPosition();

    //在APP時放大是用滑鼠滾輪，一次增加0.1，而最大一樣是3
    if (!rmcallBookSyncMessage('')) {
        for (i = 0; i < ToolBarList.ZoomNumber.length; i++) {
            if (ToolBarList.ZoomScale == ToolBarList.ZoomNumber[i]) {
                ToolBarList.ZoomScale = ToolBarList.ZoomNumber[i + 1];
                break;
            }
        }
    } else {
        ToolBarList.ZoomScale = ToolBarList.ZoomScale + 0.05;
        if (ToolBarList.ZoomScale > 3) ToolBarList.ZoomScale = 3;
    }

    var scale = ToolBarList.ZoomScale;
    // console.log('Scale: ' + scale);

    zoomSetting(scale);

    var zoomInBtn = checkBtnStatus('zoomIn');
    var zoomOutBtn = checkBtnStatus('zoomOut');

    zoomOutBtn.afterClick = false;
    checkBtnChange(zoomOutBtn);

    if (ToolBarList.ZoomScale == 3) {
        zoomInBtn.afterClick = true;
        checkBtnChange(zoomInBtn);
    }

    SendSyncZoom(scale);

    $('#palm').css('background-image', 'url(ToolBar/palmbefore.png)');

}

//縮小
function zoomOut(zoom100) {

    GalleryStopMove();
    $(window).off("resize", resizeInit);

    //縮放前，先加最原始的left及top至html5上，縮放時物件的位置才不會跑掉
    if (ToolBarList.ZoomScale == 1) {
        if ($('.canvasObj')[0] != undefined) {
            for (var j = 0; j < $('.canvasObj').length; j++) {

                $($('.canvasObj')[j]).attr({
                    'left': $('.canvasObj')[j].offsetLeft,
                    'top': $('.canvasObj')[j].offsetTop
                })
            }
        }
    }

    //在APP時縮小是用滑鼠滾輪，一次減少0.1，而最小一樣是1
    if (!rmcallBookSyncMessage('')) {
        for (i = 0; i < ToolBarList.ZoomNumber.length; i++) {
            if (ToolBarList.ZoomScale == ToolBarList.ZoomNumber[i]) {
                ToolBarList.ZoomScale = ToolBarList.ZoomNumber[i - 1];
                break;
            }
        }
    } else {
        ToolBarList.ZoomScale = ToolBarList.ZoomScale - 0.05;
        if (ToolBarList.ZoomScale < 1) ToolBarList.ZoomScale = 1;
    }

    if (zoom100) {
        ToolBarList.ZoomScale = 1;
    }

    var scale = ToolBarList.ZoomScale;
    // console.log('Scale: ' + scale);

    // ZoomAttrPosition();
    zoomSetting(scale);

    $('#dragCanvas').remove();

    var zoomInBtn = checkBtnStatus('zoomIn');
    zoomInBtn.afterClick = false;
    checkBtnChange(zoomInBtn);

    if (ToolBarList.ZoomScale == 1) {
        $('#dragCanvas').remove();

        GalleryStartMove();

        // //回復resize
        // $(window).resize(resizeInit);

        // //如果有搜內文的手指，則記錄到Text裡
        // //不然縮小到100%時會重畫書，手指會不見
        // if ($('.Text')[0] != undefined) {
        //     var Text = $('.Text')[0];
        // }
        // resize_canvas();
        // drawCanvas(MainObj.NowPage);
        // setWaterMark();

        // //如果原本有有搜內文的手指，在這裡在append出來
        // if (Text != undefined) {
        //     $('body').append(Text);
        //     $(Text).css({
        //         'left': Number($(Text).css('left').split('px')[0]) + MainObj.CanvasL,
        //         'top': Number($(Text).css('top').split('px')[0]) + MainObj.CanvasT
        //     })
        // }

        var zoomOutBtn = checkBtnStatus('zoomOut');
        zoomOutBtn.afterClick = true;
        checkBtnChange(zoomOutBtn);

        $('#palm').css('background-image', 'url(ToolBar/arrow.png)');
    }

    SendSyncZoom(scale);

    if (ToolBarList.ZoomScale == 1) {
        DrawPen(MainObj.NowPage);
    }
}

//縮放第一次，物件新增初始位置尺寸屬性
function ZoomAttrPosition() {
    //縮放前，先加最原始的left及top至html5上，縮放時物件的位置才不會跑掉
    if (ToolBarList.ZoomScale == 1) {
        if ($('.canvasObj')[0] != undefined) {
            for (var j = 0; j < $('.canvasObj').length; j++) {

                if ($('.canvasObj')[j].type == 'text') {

                    $($('.canvasObj')[j]).attr({
                        'width': $($('.canvasObj')[j]).css('width').split('px')[0],
                        'height': $($('.canvasObj')[j]).css('height').split('px')[0]
                    })
                }

                $($('.canvasObj')[j]).attr({
                    'tempWidth': $($('.canvasObj')[j]).width(),
                    'tempHeight': $($('.canvasObj')[j]).height(),
                    'left': $('.canvasObj')[j].offsetLeft,
                    'top': $('.canvasObj')[j].offsetTop
                })
            }
        }

        //影片要將初始位置及初始尺寸都記錄下來
        if ($('.video')[0] != undefined) {
            for (var i = 0; i < $('.video').length; i++) {
                $($('.video')[i]).attr({
                    'left': $('.video')[i].offsetLeft,
                    'top': $('.video')[i].offsetTop,
                    'oldwidth': $('.video')[i].width,
                    'oldheight': $('.video')[i].height
                })
            }
        }

        //影片要將初始位置及初始尺寸都記錄下來
        if ($('.videoPosition')[0] != undefined) {
            for (var i = 0; i < $('.videoPosition').length; i++) {
                $($('.videoPosition')[i]).attr({
                    'left': $('.videoPosition')[i].offsetLeft,
                    'top': $('.videoPosition')[i].offsetTop,
                    'oldwidth': $('.videoPosition')[i].width,
                    'oldheight': $('.videoPosition')[i].height
                })
            }
        }

        if ($('.videoClose')[0] != undefined) {
            for (var i = 0; i < $('.videoClose').length; i++) {
                $($('.videoClose')[i]).attr({
                    'tempWidth': $($('.videoClose')[i]).width(),
                    'tempHeight': $($('.videoClose')[i]).height(),
                    'left': $('.videoClose')[i].offsetLeft,
                    'top': $('.videoClose')[i].offsetTop
                })
            }
        }

        //影片關閉按鈕要將初始位置及初始尺寸都記錄下來
        if ($('.iframeObj')[0] != undefined) {
            for (var i = 0; i < $('.iframeObj').length; i++) {
                $($('.iframeObj')[i]).attr({
                    'tempWidth': $($('.iframeObj')[i]).width(),
                    'tempHeight': $($('.iframeObj')[i]).height(),
                    'left': $('.iframeObj')[i].offsetLeft,
                    'top': $('.iframeObj')[i].offsetTop
                })
            }
        }
    }
}

//背景canvas的縮放
//是用最原本的大小及位置去做縮放
//而是縮放CSS的部分，這樣就不用一直重畫圖
//縮放後一律將位置移到(0,0)
function zoomSetting(scale) {

    var canvas = $('#CanvasLeft')[0];

    // $(canvas).css({
    // 'width': canvas.width * scale,
    // 'height': canvas.height * scale,
    //     'left': MainObj.CanvasL,
    //     'top': MainObj.CanvasT
    // })

    var cxt = canvas.getContext('2d');

    canvas.width = MainObj.NewCanvasWidth * scale;
    canvas.height = MainObj.NewCanvasHeight * scale;

    $(canvas).removeAttr('style');

    $(canvas).css({
        // 'width': canvas.width * scale,
        // 'height': canvas.height * scale,
        'left': MainObj.CanvasL,
        'top': MainObj.CanvasT,
        'position': 'absolute'
    })

    var img = MainObj.AllBackground[MainObj.NowPage].img;
    if (img) {
        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    twoPageZoomSet(scale);
    zoomDragCanvas(scale);
    zoomObjSetting(scale);
    zoomNote(scale);

    // resizeCanvas(canvas, cxt);
}

function zoomNote(scale) {
    // 文字便利貼 縮放
    txtNote.SaveList.forEach(function (x) {
        if (x.page == MainObj.NowPage) {
            $('#' + x.id).css({
                'transform': 'scale(' + scale + ',' + scale + ')',
                'position': 'absolute',
                'left': MainObj.CanvasL,
                'top': MainObj.CanvasT
            });
        }
    });

    // 便利貼 縮放
    txtCanvas.SaveList.forEach(function (x) {
        if (x.page == MainObj.NowPage) {
            $('#' + x.id).css({
                'transform': 'scale(' + scale + ',' + scale + ')',
                'position': 'absolute',
                'left': MainObj.CanvasL,
                'top': MainObj.CanvasT
            });
        }
    });
}

//物件canvas的縮放
function zoomObjSetting(scale) {
    //物件跟背景是一樣的縮放模式
    if ($('.canvasObj')[0] != undefined) {

        for (var num = 0; num < $('.canvasObj').length; num++) {

            var left = (Number($($('.canvasObj')[num]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.canvasObj')[num]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            if ($('.canvasObj')[num] == $('.Text')[0]) {

                $($('.canvasObj')[num]).css({
                    'width': 23 * scale,
                    'height': 23 * scale,
                    'left': left,
                    'top': top
                })
            } else {

                if ($('.canvasObj')[num].type == 'text') {

                    $($('.canvasObj')[num]).css({
                        'width': $($('.canvasObj')[num]).attr('width') * scale,
                        'height': $($('.canvasObj')[num]).attr('height') * scale,
                        'left': left,
                        'top': top
                    })

                } else {

                    var canvas = $('.canvasObj')[num];

                    var Identifier = $(canvas).attr('Identifier');

                    if (!$(canvas).hasClass('canvasIntro')) {

                        if ($(canvas).hasClass('canvasPosition')) {
                            HamaList[MainObj.NowPage].Objects.map(function (res) {
                                if ($(canvas).hasClass('introImage')) {
                                    if (res.IntroductionObjectList) {
                                        res.IntroductionObjectList.IntroductionObject.map(function (intro) {
                                            if (intro.Identifier == Identifier) {
                                                if (intro.FormatterType == 'Hamastar.AddIns.Introduction.IntroductionPictureScrollObjectFormatter') {
                                                    $($('.canvasObj')[num]).css({
                                                        'width': $('.canvasObj')[num].width * scale,
                                                        'height': $('.canvasObj')[num].height * scale,
                                                        'left': left,
                                                        'top': top
                                                    });
                                                } else {
                                                    $($('.canvasObj')[num]).css({
                                                        'left': left,
                                                        'top': top
                                                    });
                                                    canvas.width = $(canvas).attr('tempWidth') * scale;
                                                    canvas.height = $(canvas).attr('tempHeight') * scale;
                                                    var context = canvas.getContext('2d');
                                                    drawAdditionFileImage(intro, context, canvas.width, canvas.height);
                                                }
                                            }
                                        });
                                    }
                                }
                                if (res.Identifier == Identifier) {
                                    $($('.canvasObj')[num]).css({
                                        'left': left,
                                        'top': top
                                    });
                                    canvas.width = $(canvas).attr('tempWidth') * scale;
                                    canvas.height = $(canvas).attr('tempHeight') * scale;

                                    var context = canvas.getContext('2d');
                                    drawAdditionFileImage(res, context, canvas.width, canvas.height);
                                }
                            });
                        } else if ($(canvas).hasClass('textPopup')) {
                            // 文字彈跳視窗
                            HamaList[MainObj.NowPage].Objects.map(function (res) {
                                if (res.Identifier == Identifier) {
                                    $(canvas)
                                        .css({
                                            'position': 'absolute',
                                            'border-style': 'solid',
                                            'border-color': res.ViewBorderBrush || '#ffff00',
                                            'border-width': (36 * MainObj.Scale) + 'px 3px 3px 3px',
                                            'width': $(canvas).attr('tempWidth') * scale,
                                            'height': $(canvas).attr('tempHeight') * scale,
                                            'left': left,
                                            'top': top
                                        })
                                    CKEDITOR.instances['text' + res.Identifier].resize($('#div' + res.Identifier).width(), $('#div' + res.Identifier).height());
                                }
                            });
                        } else if ($(canvas).hasClass('pen')) {
                            // 畫筆

                            var tempScale = Number($(canvas).attr('tempScale')) || 1;

                            $(canvas).css({
                                'width': $(window).width() * scale,
                                'height': $(window).height() * scale,
                                'left': 0,
                                'top': 0
                            })

                            $(canvas).attr({
                                'tempScale': 1
                            });

                        } else {
                            HamaList[MainObj.NowPage].Objects.map(function (res) {
                                if (res.Identifier == Identifier) {

                                    if (res.FormatterType == 'RotationImageObject' || res.FormatterType == 'SlideshowObject' || res.FormatterType == 'ScrollObject' || res.FormatterType == 'HtmlScriptObject') {
                                        $($('.canvasObj')[num]).css({
                                            'width': $(canvas).hasClass('tempCanvas') ? $(canvas).attr('tempWidth') * scale : $('.canvasObj')[num].width * scale,
                                            'height': $(canvas).hasClass('tempCanvas') ? $(canvas).attr('tempHeight') * scale : $('.canvasObj')[num].height * scale,
                                            'left': left,
                                            'top': top
                                        });
                                    } else {
                                        $($('.canvasObj')[num]).css({
                                            'left': left,
                                            'top': top
                                        });
                                        canvas.width = $(canvas).attr('tempWidth') * scale;
                                        canvas.height = $(canvas).attr('tempHeight') * scale;

                                        var context = canvas.getContext('2d');
                                        if (res.FormatterType == 'ErasingPicture' || res.FormatterType == 'ImageLayer') {
                                            drawIntroImage(res, context, canvas.width, canvas.height);
                                        } else if (res.FormatterType == 'TextObject') {
                                            drawTextImage(res, context, canvas.width, canvas.height);
                                        } else {
                                            if (res.FormatterType == 'MaskingLayer') {
                                                borderstyle(res.Identifier, res.BorderStyle, res.BrushColor, res.PixelSize);
                                                context.strokeRect(res.PixelSize, res.PixelSize, canvas.width, canvas.height);
                                                context.fillStyle = res.BrushColor;
                                                context.fillRect(0, 0, canvas.width, canvas.height);
                                            }
                                            drawButtonImage(res, context, canvas.width, canvas.height);
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        var divId = $(canvas)[0].parentElement.id.split('IntroDiv')[1];
                        var context = canvas.getContext('2d');
                        HamaList[MainObj.NowPage].Objects.map(function (res) {
                            if (res.Identifier == divId) {
                                res.IntroductionObjectList.IntroductionObject.map(function (intro) {
                                    if (intro.Identifier == Identifier) {
                                        if (intro.FormatterType == 'Hamastar.AddIns.Introduction.IntroductionPictureScrollObjectFormatter') {
                                            $($('.canvasObj')[num]).css({
                                                'width': $('.canvasObj')[num].width * scale,
                                                'height': $('.canvasObj')[num].height * scale,
                                                'left': left,
                                                'top': top
                                            });
                                        } else {
                                            $($('.canvasObj')[num]).css({
                                                'left': left,
                                                'top': top
                                            });
                                            canvas.width = $(canvas).attr('tempWidth') * scale;
                                            canvas.height = $(canvas).attr('tempHeight') * scale;
                                            drawIntroImage(intro, context, canvas.width, canvas.height);
                                        }
                                    }
                                });
                            }
                        });
                    }

                }
            }
        }
    }

    if ($('.videoPosition').length) {
        for (var v = 0; v < $('.videoPosition').length; v++) {

            var left = (Number($($('.videoPosition')[v]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.videoPosition')[v]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            $($('.videoPosition')[v]).css({
                'left': left,
                'top': top
            })

            var width = Number($($('.videoPosition')[v]).attr('oldwidth')) * scale;
            var height = Number($($('.videoPosition')[v]).attr('oldheight')) * scale;

            $('.videoPosition')[v].width = width;
            $('.videoPosition')[v].height = height;
        }
    }

    if ($('.videoClose').length) {
        for (var v = 0; v < $('.videoClose').length; v++) {

            var left = (Number($($('.videoClose')[v]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.videoClose')[v]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            var canvas = $('.videoClose')[v];
            $(canvas).css({
                'left': left,
                'top': top
            });
            canvas.width = $(canvas).attr('tempWidth') * scale;
            canvas.height = $(canvas).attr('tempHeight') * scale;
            var context = canvas.getContext('2d');
            drawVideoCloseImage(context, canvas.width, canvas.height);
        }
    }

    if ($('.iframeObj').length) {
        for (var v = 0; v < $('.iframeObj').length; v++) {

            var left = (Number($($('.iframeObj')[v]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.iframeObj')[v]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            var canvas = $('.iframeObj')[v];
            $(canvas).css({
                'left': left,
                'top': top
            });
            canvas.width = $(canvas).attr('tempWidth') * scale;
            canvas.height = $(canvas).attr('tempHeight') * scale;
        }
    }

    //影片縮放
    if ($('.video')[0] != undefined) {
        for (var i = 0; i < $('.video').length; i++) {

            var left = (Number($($('.video')[i]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.video')[i]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            $($('.video')[i]).css({
                'left': left,
                'top': top
            })

            var width = Number($($('.video')[i]).attr('oldwidth')) * scale;
            var height = Number($($('.video')[i]).attr('oldheight')) * scale;

            $('.video')[i].width = width;
            $('.video')[i].height = height;
        }
    }

    // 連連看的線縮放
    if ($('.canvasConnector')[0] != undefined) {

        for (var num = 0; num < $('.canvasConnector').length; num++) {

            var left = (Number($($('.canvasConnector')[num]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.canvasConnector')[num]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            $($('.canvasConnector')[num]).css({
                'width': $('.canvasConnector')[num].width * scale,
                'height': $('.canvasConnector')[num].height * scale,
                'left': left,
                'top': top
            })
        }
    }
}

function drawIntroImage(obj, cxt, width, height) {
    if (obj.XFileName || obj.BackgroundXFileName) {
        var img = new Image();
        img.onload = function () {
            cxt.globalAlpha = Number(obj.Alpha);
            cxt.drawImage(img, 0, 0, width, height);
            if (obj.FormatterType == 'ErasingPicture') {
                cxt.lineCap = "round";
                cxt.lineJoin = "round";
                cxt.lineWidth = 30 * MainObj.Scale;
                cxt.globalCompositeOperation = "destination-out";
            }
        }
        img.src = 'Resource/' + setExt(obj.XFileName || obj.BackgroundXFileName);
    }
}

function drawTextImage(obj, cxt, width, height) {
    if (obj.CharSetImg) {
        cxt.globalCompositeOperation = 'copy';
        var img = new Image();
        img.onload = function () {
            cxt.drawImage(img, 0, 0, width, height);
        }
        img.src = 'Resource/' + setExt(obj.CharSetImg);
    }
}

// 畫圖影定位的圖片
function drawAdditionFileImage(obj, cxt, width, height) {
    var img = new Image();
    img.onload = function () {
        cxt.globalAlpha = Number(obj.Alpha);
        cxt.drawImage(img, 0, 0, width, height);
    }
    img.src = 'Resource/' + setExt(obj.PathFileName);
}

// 畫影片的關閉按鈕的圖片
function drawVideoCloseImage(cxt, width, height) {
    var img = new Image();
    img.onload = function () {
        cxt.drawImage(img, 0, 0, width, height);
    }
    img.src = 'ToolBar/closevideo.png';
}

//縮放drag
function zoomDragCanvas(scale) {
    //用一個新的canvas覆蓋在版面上面
    //是為了不讓其他功能觸發
    NewCanvas();
    var canvas = $('#canvas')[0];
    canvas.id = 'dragCanvas';
    canvas.width = ($('#CanvasRight')[0].width + $('#CanvasLeft')[0].width);
    canvas.height = $('#CanvasLeft')[0].height;

    // if (!MainObj.IsRight) {
    //     var left = Number($('#CanvasRight').css('left').split('px')[0]);
    // } else {
    //     var left = Number($('#CanvasLeft').css('left').split('px')[0]);
    // }
    var left = Number($('#CanvasLeft').css('left').split('px')[0]);

    $(canvas)
        .css({
            'left': left,
            'top': Number($('#CanvasLeft').css('top').split('px')[0]),
            'z-index': 100,
            'cursor': 'move'
        })
        .attr('class', 'dragCanvas');

    //將draggable事件綁在蓋在上面的canvas
    //移動的過程中底下的背景及物件也一起移動
    $(canvas).draggable({
        drag: function () {
            ZoomDragScroll();
        },
        stop: function () {

            var wrapperWidth = MainObj.NewCanvasWidth;
            var wrapperHeight = MainObj.NewCanvasHeight;
            var sliderOffset = $('.dragCanvas').offset();

            var left = sliderOffset.left - MainObj.CanvasL;
            var top = sliderOffset.top - MainObj.CanvasT;

            //根據siverlight的算法公式，但是移動的位移要自己這裡算
            var slideLeft = (wrapperWidth * scale / 2 - wrapperWidth / 2 - (left - syncZoomSlider.initSliderLeft)) / wrapperWidth;
            var slideTop = (wrapperHeight * scale / 2 - wrapperHeight / 2 - (top - syncZoomSlider.initSliderTop)) / wrapperHeight;
            var message = '[scmd]' + Base64.encode('scsh' + scale + ';{' + slideLeft + ',' + slideTop + '}');
            rmcall(message);

            //位移後要把值塞給全域變數，不然位置會跑掉
            syncZoomSlider.afterSliderLeft = left - syncZoomSlider.initSliderLeft;
            syncZoomSlider.afterSliderTop = top - syncZoomSlider.initSliderTop;

            //拖動結束，傳送同步指令
            SendSyncZoom(scale);
        }
    })
}

//拖動平移
//所有物件、背景
function ZoomDragScroll() {

    var dragOffsetLeft = $('.dragCanvas')[0].offsetLeft;
    var dragOffsetTop = $('.dragCanvas')[0].offsetTop;

    // if (MainObj.IsTwoPage) {
    //     if ($('.canvasObj')[x] != undefined) {
    //         if ($('.canvasObj')[x].offsetLeft < ($('.dragCanvas')[0].width / 2)) {
    //             var left = dragOffsetLeft - $('#CanvasLeft')[0].offsetLeft;
    //         } else {
    //             var left = dragOffsetLeft - $('#CanvasRight')[0].offsetLeft;
    //         }
    //     }
    // } else {
    //     var left = dragOffsetLeft - $('#CanvasLeft')[0].offsetLeft;
    // }

    var left = dragOffsetLeft - $('#CanvasLeft')[0].offsetLeft;
    var top = dragOffsetTop - $('#CanvasLeft')[0].offsetTop;

    // 文字便利貼 平移
    txtNote.SaveList.forEach(function (x) {
        if (x.page == MainObj.NowPage) {
            $('#' + x.id).css({
                'left': $('#' + x.id).offset().left + left,
                'top': $('#' + x.id).offset().top + top
            });
        }
    });

    // 便利貼 平移
    txtCanvas.SaveList.forEach(function (x) {
        if (x.page == MainObj.NowPage) {
            $('#' + x.id).css({
                'left': $('#' + x.id).offset().left + left,
                'top': $('#' + x.id).offset().top + top
            });
        }
    });

    //物件平移
    for (var x = 0; x < $('.canvasObj').length; x++) {
        if (MainObj.IsTwoPage) {
            if (Number($($('.canvasObj')[x]).attr('left')) < ($('.dragCanvas')[0].width / 2)) {
                left = dragOffsetLeft - $('#CanvasRight')[0].offsetLeft;
            }
        }
        $($('.canvasObj')[x]).css({
            'left': $('.canvasObj')[x].offsetLeft + left,
            'top': $('.canvasObj')[x].offsetTop + top
        })
    }

    //影片平移
    for (var i = 0; i < $('.video').length; i++) {
        $($('.video')[i]).css({
            'left': $('.video')[i].offsetLeft + left,
            'top': $('.video')[i].offsetTop + top
        })
    }

    //圖影定位影片平移
    for (var v = 0; v < $('.videoPosition').length; v++) {
        $($('.videoPosition')[v]).css({
            'left': $('.videoPosition')[v].offsetLeft + left,
            'top': $('.videoPosition')[v].offsetTop + top
        })
    }

    //圖影定位影片close按鈕平移
    for (var v = 0; v < $('.videoClose').length; v++) {
        $($('.videoClose')[v]).css({
            'left': $('.videoClose')[v].offsetLeft + left,
            'top': $('.videoClose')[v].offsetTop + top
        })
    }

    // iframe
    for (var v = 0; v < $('.iframeObj').length; v++) {
        $($('.iframeObj')[v]).css({
            'left': $('.iframeObj')[v].offsetLeft + left,
            'top': $('.iframeObj')[v].offsetTop + top
        })
    }

    //雙頁模式時，縮放後的拖拉是兩個canvas一起移動
    if (!MainObj.IsTwoPage) {
        $('#CanvasLeft').css({
            'left': dragOffsetLeft,
            'top': dragOffsetTop
        })
    } else {
        if (!MainObj.IsRight) {

            $('#CanvasRight').css({
                'left': dragOffsetLeft,
                'top': dragOffsetTop
            })

            var canvaswidth = Number($('#CanvasRight').css('width').split('px')[0]);

            $('#CanvasLeft').css({
                'left': dragOffsetLeft + canvaswidth,
                'top': dragOffsetTop
            })

        } else {

            $('#CanvasLeft').css({
                'left': dragOffsetLeft,
                'top': dragOffsetTop
            })

            var canvaswidth = Number($('#CanvasLeft').css('width').split('px')[0]);

            $('#CanvasRight').css({
                'left': dragOffsetLeft + canvaswidth,
                'top': dragOffsetTop
            })
        }
    }
}

//雙頁模式時的縮放
//雙頁變成兩個canvas，因此要另外從這設定
function twoPageZoomSet(scale) {

    if (MainObj.IsTwoPage) {

        if (MainObj.NowPage > 0) {
            $('#CanvasRight')[0].width = MainObj.NewCanvasWidth * scale;
            $('#CanvasRight')[0].height = MainObj.NewCanvasHeight * scale;
            var canvas = $('#CanvasRight')[0];
            var cxt = $('#CanvasRight')[0].getContext('2d');
            // resizeCanvas(canvas, cxt);
            var img = MainObj.AllBackground[MainObj.NowPage - 1].img;
            cxt.drawImage(img, 0, 0, $('#CanvasRight')[0].width, $('#CanvasRight')[0].height);
            $(canvas).removeAttr('style');
            $(canvas).css({
                'left': 0,
                'top': 0,
                'position': 'absolute'
            })
        }

        if (!MainObj.IsRight) {

            $('#CanvasRight').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': 0,
                'top': 0
            })

            $('#CanvasLeft').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': Number($('#CanvasRight').css('width').split('px')[0]),
                'top': 0
            })

        } else {

            $('#CanvasLeft').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': 0,
                'top': 0
            })

            $('#CanvasRight').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': Number($('#CanvasLeft').css('width').split('px')[0]),
                'top': 0
            })
        }
    }
}

//同步縮放平移(傳送)
function SendSyncZoom(scale) {
    //寬跟高一樣算法
    //( 書的寬(高) * 放大的值 / 2 - 書的一半 / 2 - 位移值 ) / 書的寬(高)
    var slideLeft, slideTop;

    if ($('.dragCanvas')[0] != undefined) {
        var sliderOffset = $('.dragCanvas').offset();
        var bookWidth = MainObj.NewCanvasWidth; //書寬
        var bookHeight = MainObj.NewCanvasHeight; //書高

        var left = sliderOffset.left - MainObj.CanvasL;
        var top = sliderOffset.top - MainObj.CanvasT;

        if (syncZoomSlider.afterSliderLeft == undefined && syncZoomSlider.afterSliderTop == undefined) {

            //如果沒有位移過，都是用放大後的位置減去初始位置
            syncZoomSlider.initSliderLeft = left;
            syncZoomSlider.initSliderTop = top;
            slideLeft = (bookWidth * scale / 2 - bookWidth / 2 - (left - syncZoomSlider.initSliderLeft)) / bookWidth;
            slideTop = (bookHeight * scale / 2 - bookHeight / 2 - (top - syncZoomSlider.initSliderTop)) / bookHeight;

        } else {

            //如果有位移過，要用移動後的位置下去算
            slideLeft = (bookWidth * scale / 2 - bookWidth / 2 - syncZoomSlider.afterSliderLeft) / bookWidth;
            slideTop = (bookHeight * scale / 2 - bookHeight / 2 - syncZoomSlider.afterSliderTop) / bookHeight;

            //放大後要把初始值改成位移後又放大的值
            syncZoomSlider.initSliderLeft = left - syncZoomSlider.afterSliderLeft;
            syncZoomSlider.initSliderTop = top - syncZoomSlider.afterSliderTop;

        }

        if (sliderOffset.left == 0 && sliderOffset.top == 0) {
            slideLeft = 0;
            slideTop = 0;
        }

    } else {

        //scale = 1時初始化
        slideLeft = 0;
        slideTop = 0;
    }

    var message = '[scmd]' + Base64.encode('scsh' + scale + ';{' + slideLeft + ',' + slideTop + '}');
    rmcall(message);
}