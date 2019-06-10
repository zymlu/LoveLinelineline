//動畫
//是用JQ的transition方式呈現動畫

var Animate = {
    Sequence: 0, //動畫順序
    Click: false, //點第二下是中斷前一個動畫並開始下一個動畫，用此參數判斷是點第幾下
    NoGallery: false //判斷是否翻頁
}




//動畫感應區設定
function AnimationGroupSet(obj) {

    Animate.Sequence = 0;
    Animate.Click = false;
    Animate.NoGallery = true;

    var list;

    $(HamaList[MainObj.NowPage].AnimationSet.AnimationSet).each(function() {
        if (this.AnimationGroupPlayerIdentifier == obj.AnimationGroupIdentifier) {
            list = this;
        }
    })

    if (list == undefined) return;

    if (list.Sequence == '-1' || list.AnimationSetTriggerType == 'Group') {
        //Sequence為-1時，表示無順序，則是由動畫感應區控制動畫
        //此時才要將感應區生成canvas，並將click事件綁在感應區上
        NewCanvas(obj);
        var canvas = $('#canvas')[0];
        canvas.id = obj.AnimationGroupIdentifier;
        canvas.width = obj.Width * MainObj.Scale;
        canvas.height = obj.Height * MainObj.Scale;
        $(canvas).css({
            'left': obj.Left * MainObj.Scale + MainObj.CanvasL,
            'top': obj.Top * MainObj.Scale + MainObj.CanvasT
        })

        $(canvas).unbind('click');
        $(canvas).click(function(e) {
            e.preventDefault();
            AnimateClick();
            // $(this).remove();
        })

    } else {
        //每次都先把HamaStar的click事件砍掉，才不會重複click事件
        //動畫click事件是綁在HamaStar上
        $('#HamastarWrapper').unbind('click');
        $('#HamastarWrapper').click(function(e) {
            e.preventDefault();
            AnimateEvent();
        })
    }
}

//動畫點擊事件，若Animate.NoGallery為true，則為點擊而不是翻頁
//從GalleryEvent.js的mouseup事件判斷
function AnimateEvent() {
    if (Animate.NoGallery) {
        Animate.Click = !Animate.Click;
        AnimateEnd();
        AnimateClick();
    }
}

//動畫物件建立
function AnimationObjSet(obj) {
    if (HamaList[MainObj.NowPage].AnimationSet != undefined) {
        var list = HamaList[MainObj.NowPage].AnimationSet.AnimationSet;

        if (list == undefined) return;

        if (list.length == undefined) {
            list = [list];
        }

        for (var i = 0; i < list.length; i++) {

            if (list[i].AnimationList.WhiteboardObjectIdentifier != undefined) {
                if (obj.Identifier == list[i].AnimationList.WhiteboardObjectIdentifier) {

                    AnimateCanvas(obj, list[i].AnimationList);

                    if (list[i].AnimationSetTriggerType == 'Auto') {
                        AnimateClick(true, i);
                    }

                    break;
                }
            } else {
                for (var j = 0; j < list[i].AnimationList.length; j++) {
                    if (obj.Identifier == list[i].AnimationList[j].WhiteboardObjectIdentifier) {
                        
                        AnimateCanvas(obj, list[i].AnimationList[j]);

                        if (list[i].AnimationSetTriggerType == 'Auto') {
                            AnimateClick(true, i, j);
                        }
                        break;
                    }
                }
            }
        }
    }
}

//用canvas建立有動畫的物件
function AnimateCanvas(obj, list) {
    var scale = MainObj.Scale,
        width, height, left, top, scaleX, scaleY, duration, alpha, rotate, newlist;

    if (list.AnimEffect == 'msoAnimEffectTransparency') {
        newlist = list.Animation;
    } else if (list.AnimEffect == 'msoAnimEffectFadedZoom' || list.AnimEffect == 'msoAnimEffectGrowAndTurn') {
        newlist = list.Animation[1];
    } else {
        newlist = list.Animation.length ? list.Animation[0] : list.Animation;
    }

    width = newlist["BoundaryPoint.Size.Width"] * scale;
    height = newlist["BoundaryPoint.Size.Height"] * scale;
    left = newlist["BoundaryPoint.Location.X"] * scale;
    top = newlist["BoundaryPoint.Location.Y"] * scale;
    scaleX = newlist.ScaleX;
    scaleY = newlist.ScaleY;
    duration = newlist.Duration * 1000;
    delay = newlist.Delay * 1000;
    alpha = Number(newlist.Alpha);
    rotate = newlist.Rotate;

    if (list.AnimEffect == 'msoAnimEffectCustom') {
        width = obj.Width * scale;
        height = obj.Height * scale;
        left = obj.Left * scale;
        top = obj.Top * scale;
    }

    // NewCanvas(obj);
    // var canvas = $('#canvas')[0];
    // canvas.id = obj.Identifier;
    var canvas = $('#' + obj.Identifier)[0];
    
    canvas.width = width;
    canvas.height = height;
    $(canvas).css({
        'left': left + MainObj.CanvasL,
        'top': top + MainObj.CanvasT
    })

    var cxt = canvas.getContext('2d');
    resizeCanvas(canvas, cxt);

    $(MainObj.AllObjslist).each(function() {

        if (this.Identifier == obj.Identifier) {

            if (list.AnimEffect == 'msoAnimEffectFly' || list.AnimEffect == 'msoAnimEffectFade' || list.AnimEffect == 'msoAnimEffectAppear' || 
                list.AnimEffect == 'msoAnimEffectRiseUp' || list.AnimEffect == 'msoAnimEffectTeeter' || list.AnimEffect == 'msoAnimEffectGrowShrink') {

                cxt.drawImage(this.Image[0], 0, 0, canvas.width, canvas.height);

            } else if (list.AnimEffect == 'msoAnimEffectTransparency') {
                cxt.drawImage(this.Image[0], 0, 0, canvas.width, canvas.height);
                $(canvas).css({
                    'opacity': 1
                })

            } else if (list.AnimEffect == 'msoAnimEffectExpand' || list.AnimEffect == 'msoAnimEffectZoom' || 
                list.AnimEffect == 'msoAnimEffectPinwheel' || list.AnimEffect == 'msoAnimEffectSwivel' || list.AnimEffect == 'msoAnimEffectFloat' || 
                list.AnimEffect == 'msoAnimEffectBoomerang' || list.AnimEffect == 'msoAnimEffectSpinner' || list.AnimEffect == 'msoAnimEffectArcUp') {

                cxt.drawImage(this.Image[0], 0, 0, canvas.width, canvas.height);
                $(canvas).css({
                    'scale': [scaleX, scaleY],
                    'opacity': alpha,
                    'rotate': rotate + 'deg'
                })
                $(canvas).css('display', 'none');

            } else {
                cxt.drawImage(this.Image[0], 0, 0, canvas.width, canvas.height);
                $(canvas).css({
                    'scale': [scaleX, scaleY],
                    'opacity': alpha,
                    'rotate': rotate + 'deg'
                })
            }

            if (alpha == 0 && (list.AnimEffect == 'msoAnimEffectFade' || list.AnimEffect == 'msoAnimEffectAppear' || list.AnimEffect == 'msoAnimEffectRiseUp')) {
                $(canvas).css('display', 'none');
            }
        }
    })
}

//動畫點擊事件
function AnimateClick(auto, num, num2) {

    var list = HamaList[MainObj.NowPage].AnimationSet.AnimationSet,
        canvas, width, height, left, top, id;

    if (list.length == undefined) {
        list = [list];
    }

    if (!auto) {
        list = list.filter(function(e) {
            if (e.Sequence != '-1') {
                return e;
            }
        });
        for (var i = 0; i < list.length; i++) {
            if (list[i].Sequence != '-1') {
                if (Number(list[i].Sequence) == Animate.Sequence) {

                    id = list[i].AnimationList.WhiteboardObjectIdentifier;

                    if (id == undefined) {
                        for (var x = 0; x < list[i].AnimationList.length; x++) {
                            id = list[i].AnimationList[x].WhiteboardObjectIdentifier;
                            canvas = $('#' + id)[0];
                            AnimateType(list[i].AnimationList[x], canvas);
                            if (x < list[i].AnimationList.length - 1) {
                                Animate.Sequence--;
                            }
                        }
                    } else {
                        canvas = $('#' + id)[0];
                        AnimateType(list[i].AnimationList, canvas);
                    }

                    if (list.length == Animate.Sequence || list.length == 1) {
                        $('#' + list[i].AnimationGroupPlayerIdentifier).remove();
                        Animate.Sequence = 0;
                    }
                    // else {
                    //     Animate.Sequence++;
                    // }

                    break;
                }
            } else {
                if (event.target.id == list[i].AnimationGroupPlayerIdentifier) {
                    canvas = $('#' + list[i].AnimationList.WhiteboardObjectIdentifier)[0];
                    AnimateType(list[i].AnimationList, canvas);
                }
            }
        }
    } else {
        id = list[num].AnimationList.WhiteboardObjectIdentifier;

        if (id == undefined) {
            id = list[num].AnimationList[num2].WhiteboardObjectIdentifier;
            list = list[num].AnimationList[num2];
        } else {
            list = list[num].AnimationList;
        }

        canvas = $('#' + id)[0];
        AnimateType(list, canvas);
    }
}

//結束前一個動畫，原理是將原本的物件canvas砍掉重建一個新的是最後的位置及大小
function AnimateEnd() {

    var list = HamaList[MainObj.NowPage].AnimationSet.AnimationSet,
        scale = MainObj.Scale,
        obj, width, height, left, top, newlist;

    for (var i = 0; i < list.length; i++) {

        if (Animate.Sequence > 0) {
            if (Number(list[i].Sequence) == Animate.Sequence - 1) {

                var id = list[i].AnimationList.WhiteboardObjectIdentifier;

                $('#' + id).remove();

                $(HamaList[MainObj.NowPage].Objects).each(function() {
                    if (this.Identifier == id) {
                        obj = this;
                    }
                })

                var AnimEffect = list[i].AnimationList.AnimEffect;

                if (AnimEffect == undefined) return;

                if (AnimEffect == 'msoAnimEffectRiseUp' || AnimEffect == 'msoAnimEffectFloat' || AnimEffect == 'msoAnimEffectBoomerang') {
                    newlist = list[i].AnimationList.Animation[2];
                } else if (AnimEffect == 'msoAnimEffectSwivel') {
                    newlist = list[i].AnimationList.Animation[5];
                } else if (AnimEffect == 'msoAnimEffectTransparency') {
                    newlist = list[i].AnimationList.Animation;
                } else {
                    newlist = list[i].AnimationList.Animation[1];
                }

                width = newlist['BoundaryPoint.Size.Width'] * scale;
                height = newlist['BoundaryPoint.Size.Height'] * scale;
                left = newlist['BoundaryPoint.Location.X'] * scale;
                top = newlist['BoundaryPoint.Location.Y'] * scale;
                scaleX = newlist.ScaleX;
                scaleY = newlist.ScaleY;
                alpha = Number(newlist.Alpha);
                rotate = newlist.Rotate;

                NewCanvas(obj);

                var canvas = $('#canvas')[0];
                canvas.id = obj.Identifier;
                canvas.width = width;
                canvas.height = height;
                $(canvas).css({
                    'left': left + MainObj.CanvasL,
                    'top': top + MainObj.CanvasT
                })

                var cxt = canvas.getContext('2d');
                resizeCanvas(canvas, cxt);
                cxt.globalAlpha = alpha;

                $(MainObj.AllObjslist).each(function() {
                    if (this.Identifier == obj.Identifier) {

                        if (AnimEffect == 'msoAnimEffectFly' || AnimEffect == 'msoAnimEffectFade' ||
                            AnimEffect == 'msoAnimEffectRiseUp' || AnimEffect == 'msoAnimEffectExpand' ||
                            AnimEffect == 'msoAnimEffectZoom' || AnimEffect == 'msoAnimEffectPinwheel' || AnimEffect == 'msoAnimEffectSwivel' || 
                            AnimEffect == 'msoAnimEffectFloat' || AnimEffect == 'msoAnimEffectBoomerang' || AnimEffect == 'msoAnimEffectSpinner' || 
                            AnimEffect == 'msoAnimEffectTeeter' || AnimEffect == 'msoAnimEffectSpin' || 
                            AnimEffect == 'msoAnimEffectGrowShrink' || AnimEffect == 'msoAnimEffectTransparency' || AnimEffect == 'msoAnimEffectWipe' || 
                            AnimEffect == 'msoAnimEffectAscend') {

                            cxt.drawImage(this.Image[0], 0, 0, canvas.width, canvas.height);
                            $(canvas).css({
                                'scale': [scaleX, scaleY],
                                'rotate': rotate + 'deg'
                            })
                        } else {

                            var AnimationPaths = list[i].AnimationList.Animation[1].AnimationPaths;

                            if (AnimationPaths) {

                                var AnimationPath = AnimationPaths.AnimationPath;
                                AnimationPath = AnimationPath[AnimationPath.length - 1];
                                if (AnimationPath == undefined) {
                                    AnimationPath = [AnimationPaths.AnimationPath];
                                    AnimationPath = AnimationPath[AnimationPath.length - 1];
                                }

                                if (AnimationPath) {

                                    left = AnimationPath.X * scale + MainObj.CanvasL;
                                    top = AnimationPath.Y * scale + MainObj.CanvasT;

                                    cxt.drawImage(this.Image[0], 0, 0, canvas.width, canvas.height);
                                    $(canvas).css({
                                        'left': left,
                                        'top': top,
                                        'scale': [scaleX, scaleY],
                                        'rotate': rotate + 'deg'
                                    })
                                }
                            }
                        }
                    }
                })
            }
        }
    }
}

//動畫種類
function AnimateType(list, canvas) {

    var newlist;
    if (list.AnimEffect == 'msoAnimEffectTransparency') {
        newlist = list.Animation;
    } else {
        newlist = list.Animation[1];
    }

    var scale = MainObj.Scale,
        width = newlist['BoundaryPoint.Size.Width'] * scale,
        height = newlist['BoundaryPoint.Size.Height'] * scale,
        left = newlist['BoundaryPoint.Location.X'] * scale,
        top = newlist['BoundaryPoint.Location.Y'] * scale,
        scaleX = newlist.ScaleX;
        scaleY = newlist.ScaleY;
        delay = newlist.Delay * 1000,
        duration = newlist.Duration * 1000,
        rotate = newlist.Rotate;
        alpha = newlist.Alpha;

    if (list.AnimEffect == 'msoAnimEffectFly') { //飛入、飛出
        $(canvas).transition({
            'left': Number(left) + MainObj.CanvasL,
            'top': Number(top) + MainObj.CanvasT,
            'delay': delay
        }, duration, 'linear');

        Animate.Sequence++;

    } else if (list.AnimEffect == 'msoAnimEffectFade') { //淡出
        if (alpha == '1') {
            $(canvas).fadeIn(duration);
        } else {
            $(canvas).fadeOut(duration);
        }

        Animate.Sequence++;

    } else if (list.AnimEffect == 'msoAnimEffectAppear') { //出現
        $(canvas).css('display', 'block');

        Animate.Sequence++;

    //展開、放大及旋轉、縮放物件中心、縮放投影片中心、紙風車、放大/縮小水平垂直
    } else if (list.AnimEffect == 'msoAnimEffectExpand' || list.AnimEffect == 'msoAnimEffectZoom'
    || list.AnimEffect == 'msoAnimEffectPinwheel' || list.AnimEffect == 'msoAnimEffectGrowShrink') {
        $(canvas).css('display', 'block');
        $(canvas).transition({
            'scale': [scaleX, scaleY],
            'opacity': alpha,
            'rotate': rotate + 'deg',
            'delay': delay
        }, duration, 'linear');

        Animate.Sequence++;

    //透明
    } else if (list.AnimEffect == 'msoAnimEffectTransparency') {
        $(canvas).css('display', 'block');
        $(canvas).css({
            'opacity': alpha
        });

        Animate.Sequence++;

    //弧形向上、心形、水滴、新月、圓形、橄欖球、S型、圖案路徑、弧線、轉向
    //Z字形、正弦波、斜、彎曲、漏斗、彈簧、螺旋...
    } else {
        $(canvas).css('display', 'block');

        for (var i = 0; i < list.Animation.length; i++) {

            var width = list.Animation[i]['BoundaryPoint.Size.Width'] * scale,
                height = list.Animation[i]['BoundaryPoint.Size.Height'] * scale,
                left = list.Animation[i]['BoundaryPoint.Location.X'] * scale,
                top = list.Animation[i]['BoundaryPoint.Location.Y'] * scale,
                scaleX = list.Animation[i].ScaleX;
                scaleY = list.Animation[i].ScaleY;
                delay = list.Animation[i].Delay * 1000,
                duration = list.Animation[i].Duration * 1000,
                rotate = list.Animation[i].Rotate,
                alpha = list.Animation[i].Alpha,
                AnimationPaths = list.Animation[i].AnimationPaths;

            if (AnimationPaths) {

                var AnimationPath = AnimationPaths.AnimationPath;

                if (AnimationPath) {

                    var pathcount = AnimationPath.length;

                    if (pathcount == undefined) {
                        AnimationPath = [AnimationPath];
                        pathcount = AnimationPath.length;
                    }

                    duration = duration / (pathcount + 1);

                    for (var j = 0; j < pathcount; j++) {
                        var pathtype = AnimationPath[j].Type;
                        var pathX = Number(AnimationPath[j].X) * scale + MainObj.CanvasL;
                        var pathY = Number(AnimationPath[j].Y) * scale + MainObj.CanvasT;

                        //直線
                        if (pathtype == "Line") {
                            $(canvas).transition({ "left": pathX, "top": pathY, "width": width, "height": height, "rotate": rotate + 'deg', "scale": [scaleX, scaleY], "opacity": alpha, 'delay': delay }, duration, 'linear');

                        //曲線
                        } else {
                            var ControlPoint = AnimationPath[j].ControlPoint;

                            CP0_X = Number(ControlPoint[0].X) * scale + MainObj.CanvasL;
                            CP0_Y = Number(ControlPoint[0].Y) * scale + MainObj.CanvasT;
                            CP1_X = Number(ControlPoint[1].X) * scale + MainObj.CanvasL;
                            CP1_Y = Number(ControlPoint[1].Y) * scale + MainObj.CanvasT;

                            var cpduration = duration / 3;

                            $(canvas).transition({ "left": CP0_X, "top": CP0_Y, "width": width, "height": height, "rotate": rotate + 'deg', "scale": [scaleX, scaleY], "opacity": alpha, 'delay': delay }, cpduration, 'linear');
                            $(canvas).transition({ "left": CP1_X, "top": CP1_Y, "width": width, "height": height, "rotate": rotate + 'deg', "scale": [scaleX, scaleY], "opacity": alpha, 'delay': delay }, cpduration, 'linear');
                            $(canvas).transition({ "left": pathX, "top": pathY, "width": width, "height": height, "rotate": rotate + 'deg', "scale": [scaleX, scaleY], "opacity": alpha, 'delay': delay }, cpduration, 'linear');
                        }
                    }
                }

            //上升、基本旋轉水平、基本旋轉垂直、浮動、迴旋鏢、旋式誘餌、陀螺
            } else {
                $(canvas).css('display', 'block');
                Animation(list.Animation[i], canvas);
            }
        }
        Animate.Sequence++;
    }
}

//基本變動位移的設定
function Animation(list, canvas) {
    var scale = MainObj.Scale,
        width = list['BoundaryPoint.Size.Width'] * scale,
        height = list['BoundaryPoint.Size.Height'] * scale,
        left = list['BoundaryPoint.Location.X'] * scale,
        top = list['BoundaryPoint.Location.Y'] * scale,
        scaleX = list.ScaleX,
        scaleY = list.ScaleY,
        delay = list.Delay * 1000,
        duration = list.Duration * 1000,
        rotate = list.Rotate;
        alpha = list.Alpha;

    $(canvas).transition({
        'width': width,
        'height': height,
        'left': Number(left) + MainObj.CanvasL,
        'top': Number(top) + MainObj.CanvasT,
        'scale': [scaleX, scaleY],
        'opacity': alpha,
        'rotate': rotate + 'deg',
        'delay': delay
    }, duration, 'linear');
}

//取得變數
function getVariable(obj) {
    var scale = MainObj.Scale;
    var list = {
        'width': obj["BoundaryPoint.Size.Width"] * scale,
        'height': obj["BoundaryPoint.Size.Height"] * scale,
        'left': obj["BoundaryPoint.Location.X"] * scale,
        'top': obj["BoundaryPoint.Location.Y"] * scale,
        'scaleX': obj.ScaleX,
        'scaleY': obj.ScaleY,
        'duration': obj.Duration * 1000,
        'delay': obj.Delay * 1000,
        'alpha': Number(obj.Alpha),
        'rotate': obj.Rotate,
    };
    return list;
}




