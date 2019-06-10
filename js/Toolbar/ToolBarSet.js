//工具列

var ToolBarList = {
    AddWidgetState: 'none', //新增物件的狀態
    TapList: [],
    ZoomScale: 1,
    ZoomNumber: [1, 1.5, 2, 2.5, 3],

    ChapterList: [], //頁面的資訊及閱讀狀態
    IsChapter: false, //是否正在章節模式
    searchWeb: [],
    timer: null,
    isCountdown: false,
    isStop: false,
    selectorNumberList: [],
    isDrag: false,
    canvasboardDrag: false,
    canvasboardTemp: null
};

var fileObj = {
    saveList: []
};

var canvasboard = {
    saveList: []
};

var classProgressList = [];

//工具列顯示
function ToolBarShow() {
    if (!ToolBarList.IsChapter) {
        if ($('#ToolBarIcon').css('left') == '0px') {
            $('#ToolBarIcon').css('left', '10em');
            $('#ToolBarMenu').css('left', '0em');
        } else {
            $('#ToolBarIcon').css('left', '0em');
            $('#ToolBarMenu').css('left', '-10em');
        }
    } else {
        if ($('#ToolBarIcon').css('right') == '0px') {
            $('#ToolBarIcon').css('right', '10em');
            $('#ToolBarMenu').css('right', '0em');
        } else {
            $('#ToolBarIcon').css('right', '0em');
            $('#ToolBarMenu').css('right', '-10em');
        }
    }
}

//判斷書在站台或本機開啟
function getFaceModuleList() {

    var ToolBarList = customToolBar;
    if (ReceiveList != null) {
        if (ReceiveList.EnableIRS == 'True') {
            ToolBarList = AppToolBar;
        }
    }

    if ((location.href).indexOf("file://") == -1) {
        try {
            $http.post(location.origin + '/Api/HTML5Api/CheckHTML5ToolBar.ashx').success(function (data) {

                ToolBarSetting(data);

            }).error(function (err) {
                ToolBarSetting(ToolBarList);
            });

        } catch (err) {
            ToolBarSetting(ToolBarList);
        }
    } else {
        ToolBarSetting(ToolBarList);
    }
}

//工具列列表
function ToolBarSetting(custom) {

    $(custom).each(function () {
        for (var i = 0; i < tempToolBars[0].btns.length; i++) {
            if (this.id == tempToolBars[0].btns[i].id) {

                //APP才有返回鍵
                // if (!rmcallBookSyncMessage('')) {
                //     if (this.id == 'back') {
                //         return;
                //     }
                // }

                //app工具列icon圖示改變
                if (ReceiveList != null) {
                    if (ReceiveList.EnableIRS == 'True') {
                        switch (this.id) {
                            case 'back':
                                if (ReceiveList.UserRole == 1) { //學生返回icon不一樣
                                    tempToolBars[0].btns[i].beforeStyle = {
                                        'background-image': 'url(ToolBar/appstuback.png)'
                                    };
                                    tempToolBars[0].btns[i].afterStyle = {
                                        'background-image': 'url(ToolBar/appstuback.png)'
                                    };
                                }
                                break;

                            case 'jump':
                                tempToolBars[0].btns[i].beforeStyle = {
                                    'background-image': 'url(ToolBar/appjump1.png)'
                                };
                                tempToolBars[0].btns[i].afterStyle = {
                                    'background-image': 'url(ToolBar/appjump2.png)'
                                };
                                break;

                            case 'tab':
                                tempToolBars[0].btns[i].beforeStyle = {
                                    'background-image': 'url(ToolBar/apptab.png)'
                                };
                                tempToolBars[0].btns[i].afterStyle = {
                                    'background-image': 'url(ToolBar/apptab.png)'
                                };
                                break;

                            case 'IRS':
                                if (ReceiveList.UserRole == 1) { //學生的IRS圖示是A，老師是Q
                                    tempToolBars[0].btns[i].beforeStyle = {
                                        'background-image': 'url(ToolBar/appirsA1.png)'
                                    };
                                    tempToolBars[0].btns[i].afterStyle = {
                                        'background-image': 'url(ToolBar/appirsA2.png)'
                                    };
                                }
                                break;

                            case 'prevPage':
                                tempToolBars[0].btns[i].beforeStyle = {
                                    'background-image': 'url(ToolBar/appprevpage1.png)'
                                };
                                tempToolBars[0].btns[i].afterStyle = {
                                    'background-image': 'url(ToolBar/appprevpage1.png)'
                                };
                                break;

                            case 'nextPage':
                                tempToolBars[0].btns[i].beforeStyle = {
                                    'background-image': 'url(ToolBar/appnextpage1.png)'
                                };
                                tempToolBars[0].btns[i].afterStyle = {
                                    'background-image': 'url(ToolBar/appnextpage1.png)'
                                };
                                break;
                        }
                    }
                }

                var that = tempToolBars[0].btns[i];
                var NewLi = document.createElement('li');
                var NewSpan = document.createElement('span');
                NewSpan.id = that.id;
                var NewLabel = document.createElement('label');

                if (that.id == 'textSearch') {
                    if (TextlocationList != '') {
                        that.beforeStyle = {
                            'background-image': 'url(ToolBar/btnSearchBefore.png)'
                        };
                    } else {
                        that.beforeStyle = {
                            'background-image': 'url(ToolBar/SearchNo.png)'
                        };
                    }
                }

                if (!ReceiveList) {
                    // 本機不用'回書櫃'
                    if (that.id == 'back') {
                        return;
                    }
                } else {
                    // APP不用'全螢幕'
                    if (that.id == 'fullscreen') {
                        return;
                    }
                }

                $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                $(NewSpan).click(function (e) {
                    e.preventDefault();
                    that.action();
                });
                $(NewLabel).text(that.beforespanTextName);
                $(NewSpan).append(NewLabel);
                $(NewLi).append(NewSpan);
                $('#ToolBarUl').append(NewLi);

                if (that.id == 'zoomOut') {
                    $(NewSpan).css('background-image', that.afterStyle['background-image']);
                    that.afterClick = true;
                }

            }
        }
    })

    $(IRSBars).each(function () {

        for (var i = 0; i < NoteBars[0].btns.length; i++) {
            if (this.id == NoteBars[0].btns[i].id) {

                //學生原畫面作答的地方沒有白板跟題目送出這兩個按鈕
                if (this.id == 'IRSwhiteboard' || this.id == 'IRSupload') return;

                var that = NoteBars[0].btns[i];
                var NewLi = document.createElement('li');
                var NewSpan = document.createElement('span');
                NewSpan.id = that.id;
                $(NewSpan).addClass(that.id);
                var NewLabel = document.createElement('label');

                $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                $(NewSpan).click(function (e) {
                    e.preventDefault();
                    that.action();
                });
                $(NewLabel).text(that.beforespanTextName);
                $(NewSpan).append(NewLabel);
                $(NewLi).append(NewSpan);
                $('#IRS_QuizUl').append(NewLi);
            }
        }
    })

    var toolHeigth = $('#ToolBarIcon').css('height', $(window).height() - 5 + 'px');
    $('#ToolBarSidesImg').draggable({
        containment: '#ToolBarIcon',
        drag: function () {

            var windowHeight = $(window).height();
            var draggableTop = $(this).css('top');
            var toolBarUlHeight = $('#ToolBarMenu > ul').height();

            $('#ToolBarMenu').scrollTop((parseInt(draggableTop) / windowHeight) * toolBarUlHeight);
        }
    });


    //將畫筆及橡皮擦綁在body上，才不會侷限到點擊的地方
    $('body').on('mousedown', function (e) {
        penEventSet(e);
    });
    $('body').on('touchstart', function (e) {
        penEventSet(e);
    });


    var slider = $('#chance_slider'),
        slider2 = $('#chance_sliderop');

    //畫筆粗細
    slider.change(function () {
        var newValue = parseInt($(this).val());
        $('.colorStateBar > div').css({
            'height': newValue
        });
    });

    //畫筆透明度
    slider2.change(function () {
        var newValue = parseInt($(this).val());

        $('.colorStateBar > div').css({
            'opacity': newValue / 10
        });

    });

    //引用調色盤套件
    $('#picker').farbtastic('#color');

    $('#noteBgcolor').farbtastic('.noteBgcolor');
    $('#canvasBgcolor').farbtastic('.canvasBgcolor');
    $('#commentBgcolor').farbtastic('.commentBgcolor');

    //調色盤視窗
    $("#colorPicker").dialog({
        resizable: false,
        modal: true,
        autoOpen: false,
        dialogClass: "window_layout",
        width: '360px',
        close: function (event, ui) {
            closePicker();
        }
    });

    //全文檢索視窗
    $("#dialogSearchText").dialog({
        resizable: false,
        modal: false,
        autoOpen: false,
        dialogClass: "window_layout",
        close: function (event, ui) {
            closeSearch();
        }
    });

    //上傳討論結果視窗
    $("#UploadDiscussion").dialog({
        resizable: false,
        modal: false,
        autoOpen: false,
        dialogClass: "window_layout",
        close: function (event, ui) {

        }
    });

    //IRS
    $(IRSBars).each(function () {

        for (var i = 0; i < NoteBars[0].btns.length; i++) {
            if (this.id == NoteBars[0].btns[i].id) {

                //IRS版面沒有WebCam跟上傳答案這兩個按鈕
                if (this.id == 'WebCam' || this.id == 'StuQuizUpload') return;

                var that = NoteBars[0].btns[i];
                var NewLi = document.createElement('li');
                var NewSpan = document.createElement('span');
                NewSpan.id = that.id;
                $(NewSpan).addClass(that.id);
                var NewLabel = document.createElement('label');

                $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                $(NewSpan).click(function (e) {
                    e.preventDefault();
                    that.action();
                });
                $(NewLabel).text(that.beforespanTextName);
                $(NewSpan).append(NewLabel);
                $(NewLi).append(NewSpan);
                $('#IRS_Ul').append(NewLi);
            }
        }
    })

    if (ReceiveList != null) {
        if (ReceiveList.EnableIRS == 'True') {

            //APP筆記
            $(AppNoteBars).each(function () {
                for (var i = 0; i < NoteBars[0].btns.length; i++) {
                    if (this.id == NoteBars[0].btns[i].id) {

                        var that = NoteBars[0].btns[i];
                        var NewLi = document.createElement('li');
                        var NewSpan = document.createElement('span');
                        NewSpan.id = that.id;
                        $(NewSpan).addClass(that.id);
                        var NewLabel = document.createElement('label');

                        $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                        $(NewSpan).click(function (e) {
                            e.preventDefault();
                            that.action();
                        });
                        $(NewLabel).text(that.beforespanTextName);
                        $(NewSpan).append(NewLabel);
                        $(NewLi).append(NewSpan);
                        $('#App_NotesUl').append(NewLi);
                    }
                }
            })

            //APP分組討論
            $(AppDiscussBars).each(function () {

                for (var i = 0; i < NoteBars[0].btns.length; i++) {
                    if (this.id == NoteBars[0].btns[i].id) {

                        if (ReceiveList.UserRole == 1) {

                            //學生沒有題目送出跟討論結果這兩個按鈕
                            if (this.id == 'sendexam' || this.id == 'result') return;

                        } else if (ReceiveList.UserRole == 2) {

                            //老師沒有開始討論跟上傳這兩個按鈕
                            if (this.id == 'start' || this.id == 'uploadDiscuss') return;

                        }

                        var that = NoteBars[0].btns[i];
                        var NewLi = document.createElement('li');
                        var NewSpan = document.createElement('span');
                        NewSpan.id = that.id;
                        $(NewSpan).addClass(that.id);
                        var NewLabel = document.createElement('label');

                        $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                        $(NewSpan).click(function (e) {
                            e.preventDefault();
                            that.action();
                        });
                        $(NewLabel).text(that.beforespanTextName);
                        $(NewSpan).append(NewLabel);
                        $(NewLi).append(NewSpan);
                        $('#App_DiscussUl').append(NewLi);
                    }
                }
            })
        }
    }

    //開書只顯示開始測驗按鈕，送出試卷先隱藏
    $('#quizUpload').css('display', 'none');

    setTextboard();
    setCavnasboard();
    setNoteMove();

}

function toggleToolBar(toolBarList) {
    $('.note-layout').css('display', 'none');
    $('.note-block').empty();
    $(toolBarList).each(function () {
        for (var i = 0; i < tempToolBars[0].btns.length; i++) {
            if (this.id == tempToolBars[0].btns[i].id) {
                if (!ReceiveList) {
                    // 本機
                    if (this.id == 'uploadEdit' || this.id == 'downloadEdit') {
                        return;
                    }
                }

                var that = tempToolBars[0].btns[i];

                var div = document.createElement('div');
                $(div).addClass('note-cont');
                var span = document.createElement('span');
                $(span).css('background-image', that.beforeStyle['background-image']);
                span.id = that.id;
                $(span).addClass(that.id);
                $(div).append(span);
                var label = document.createElement('label');
                $(label).text(that.beforespanTextName);
                $(div).append(label);

                $(div).click(function (e) {
                    e.preventDefault();
                    that.action();
                });

                $('.note-block').append(div);

                if (that.id == 'zoomOut') {
                    $(span).css('background-image', that.afterStyle['background-image']);
                    that.afterClick = true;
                }

                if (that.id == 'palm') {
                    if (ToolBarList.ZoomScale == 1) {
                        $(span).css('background-image', 'url(ToolBar/arrow.png)');
                    } else {
                        $(span).css('background-image', 'url(ToolBar/palmbefore.png)');
                    }
                }
            }
        }
    })
}

function penEventSet(event) {
    if ($(event.target).attr('class') != null) {
        var touchClass = $(event.target).attr('class').split(' ')[0];

        //由於是綁在body上，因此案工具列也會觸發
        //所以要判斷是點擊在翻頁canvas上或物件canvas上才觸發
        if (touchClass == 'canvas' || touchClass == 'canvasObj' || touchClass == 'whiteboard') {
            switch (ToolBarList.AddWidgetState) {

                case 'pen':
                case 'IRSpen':
                    // StartPen();

                    break;

                case 'eraser':
                case 'IRSeraser':
                    // StartEraser();

                    break;

                case 'txtNote':
                case 'IRStxtnote':
                    // alert('note, ' + event.type);
                    txtNoteLayer();

                    FindTool(ToolBarList.AddWidgetState);
                    break;

                case 'txtCanvas':
                case 'IRStxtcanvas':
                    txtCanvasLayer();

                    FindTool(ToolBarList.AddWidgetState);
                    break;

                case 'IRSinsert':
                    insertImageLayer();

                    FindTool(ToolBarList.AddWidgetState);
                    break;
            }
        }
    }
}

//取得btn並回到點擊前狀態
function FindTool(toolID) {
    var obj;

    $(tempToolBars[0].btns).each(function () {
        if (this.type == toolID) obj = this;
    })

    $(NoteBars[0].btns).each(function () {
        if (this.type == toolID) obj = this;
    })

    obj.afterClick = !obj.afterClick;
    checkBtnChange(obj);

    ToolBarList.AddWidgetState = 'none';
}

//JumpIcon初始化
function initListpng() {
    $('#btnAll').attr({
        'src': "ToolBar/allpage.png"
    });
    $('#btnBook').attr({
        'src': "ToolBar/switchJumpPageDefaultBtn1.png"
    });
    $('#btnChapter').attr({
        'src': "ToolBar/chapterbtn1.png"
    });
}

//點擊後改變按鈕圖示
function checkBtnChange(btn) {
    var span;
    if ($('.' + btn.id)[0] == undefined) {
        span = '#' + btn.id; //工具列
    } else {
        span = '.' + btn.id; //IRS
    }

    if (btn.afterClick) {
        $(span).css('background-image', btn.afterStyle['background-image']);
    } else {
        $(span).css('background-image', btn.beforeStyle['background-image']);
    }
}

//跳頁列表設定
function JumpTableShow(btn) {

    var Top = $(window).height() - 200;

    if (btn.afterClick) {

        btnBookSetting();
        initListpng();
        $('#btnBook').attr({
            'src': "ToolBar/switchJumpPageDefaultBtn2.png"
        });

        $('#Jumptable').css({
            'display': 'block',
            'top': Top,
            'padding': '0 0 0 5%'
        });

    } else {
        $('#JumptableAll').css('display', 'none');
        $('#Jumptable').css('display', 'none');
        $('#JumpChapter').css('display', 'none');
        $('#JumpBar').remove();

        ToolBarList.IsChapter = false;

        toolbarChange();
        ResetEBook();
    }
}

//btnAll版面設定
function btnAllSetting() {
    $('#JumptableAll').css({
        'display': 'block',
        'height': $('#CanvasGallery').height()
    });
    $('#Jumptable').css('display', 'none');
    $('#JumpChapter').css('display', 'none');
    $('.pptType').remove();
    $('#JumpBar').remove();

    $('body').css('background', '#fbf3f3');

    //清除章節模式設定的style
    $('.JumpIcon').removeAttr('style');
    $('.JumpIcon > li').removeAttr('style');

    var NewUl = document.createElement('ul');
    $(NewUl).attr('class', 'pptType');
    $('#JumptableAll').append(NewUl);

    for (var i = 0; i < Base64ImageList.length - 1; i++) {
        var NewLi = document.createElement('li');
        NewLi.id = 'noteDiv' + i;
        $(NewLi).addClass('noteDiv');
        $(NewUl).append(NewLi);

        JumpTableSetting(i, NewLi);
    }
}

//btnBook版面設定
function btnBookSetting() {
    $('#JumpChapter').css('display', 'none');
    $('#JumptableAll').css('display', 'none');
    $('#Jumptable').css('display', 'block');
    $('#JumpBar').remove();
    $('.pptType').remove();

    //清除章節模式設定的style
    $('.JumpIcon').removeAttr('style');
    $('.JumpIcon > li').removeAttr('style');

    $('body').css('background', '#fbf3f3');

    var Jumpbar = document.createElement('table');
    Jumpbar.id = 'JumpBar';
    $(Jumpbar).css('position', 'absolute');
    $('#Jumptable').append(Jumpbar);

    var Newtbody = document.createElement('tbody');
    $(Jumpbar).append(Newtbody);
    var Newtr = document.createElement('tr');
    $(Newtbody).append(Newtr);

    for (var i = 0; i < Base64ImageList.length - 1; i++) {

        var Newtd = document.createElement('td');
        $(Newtr).append(Newtd);
        $(Newtd).css({
            'width': '150px',
            'color': 'white'
        })

        JumpTableSetting(i, Newtd);
    }
}

//章節模式版面設置
function btnChapterSetting() {

    $('#JumpChapter').css('display', 'block');
    $('#JumptableAll').css('display', 'none');
    $('#Jumptable').css('display', 'none');

    $('.ChapterLi').remove();

    $('.JumpIcon').css({
        'top': '1%',
        'left': '0px',
        'position': 'absolute',
        'width': '200px',
        'height': '30px'
    })

    $('.JumpIcon > li').css({
        'position': 'absolute'
    })

    $('body').css('background', '#353535');

    var iconCount = $('.JumpIcon > li').length;
    var padding = (200 - (30 * iconCount)) / (iconCount + 1);

    //設置左右icon間距
    for (var i = 0; i < iconCount; i++) {
        var left = (padding * (i + 1)) + (30 * i);
        var icon = $('.JumpIcon > li')[i];
        $(icon).css({
            'left': left
        })
    }

    // if (ToolBarList.ChapterList == '') {
    //     for (var page = 0; page < HamaList.length; page++) {
    //         var list = {
    //             title: HamaList[page].PageTitle,
    //             page: page,
    //             isChapter: HamaList[page].IsChapter,
    //             readStatus: false
    //         }

    //         if (MainObj.NowPage == page) {
    //             list.readStatus = true;
    //         }

    //         ToolBarList.ChapterList.push(list);
    //     }
    // }

    $(ToolBarList.ChapterList).each(function () {

        var that = this;

        var li = document.createElement('li');
        var img = document.createElement('img');
        var label = document.createElement('label');

        $(li).click(function (e) {
            e.preventDefault();
            gotoPage(that.page);
        });

        $(li).addClass('ChapterLi');

        img.src = 'ToolBar/unread.png';
        img.width = 16;
        img.height = 16;
        $(li).append(img);

        //title超過五個字以上都變點點點
        // if (that.title.length > 8) {
        //     var title = ''
        //     for (var a = 0; a < 8; a++) {
        //         title += that.title[a];
        //     }
        //     that.title = title + '...';
        // }

        $(label).text(that.title);

        $(li).append(label);
        $('#Chapter_ul').append(li);

        if (that.isChapter == '0') { //縮排
            $(img).css('margin-left', '25px');
        }

    })

    toolbarChange();
    ChapterSwitchImg();
}

//章節模式閱讀紀錄清單設定
function ChapterListSet() {
    if (ToolBarList.ChapterList == '') {
        for (var page = 0; page < HamaList.length; page++) {
            var list = {
                title: HamaList[page].PageTitle,
                page: page,
                isChapter: HamaList[page].IsChapter,
                readStatus: false
            }

            if (MainObj.NowPage == page) {
                list.readStatus = true;
            }

            ToolBarList.ChapterList.push(list);
        }
    }
}

//工具列左右互換
function toolbarChange() {
    if (ToolBarList.IsChapter) { //右

        $('#ToolBarIcon').removeClass('ToolBarIcon').addClass('ToolBarIcon_right');
        $('#ToolBarMenu').removeClass('ToolBarMenu').addClass('ToolBarMenu_right');

        $('.ToolBarIcon_right').removeAttr('style');
        $('.ToolBarMenu_right').removeAttr('style');

        $('#ToolBarSidesImg')[0].src = "ToolBar/ToolBarLandscapeHide_right.png";

    } else { //左

        $('#ToolBarIcon').removeClass('ToolBarIcon_right').addClass('ToolBarIcon');
        $('#ToolBarMenu').removeClass('ToolBarMenu_right').addClass('ToolBarMenu');

        $('.ToolBarIcon').removeAttr('style');
        $('.ToolBarMenu').removeAttr('style');

        $('#ToolBarSidesImg')[0].src = "ToolBar/ToolBarLandscapeHide.png";
    }

    $('#ToolBarIcon').css('height', $(window).height() - 5 + 'px');
}

//閱讀紀錄圖片變換
function ChapterSwitchImg() {

    $(ToolBarList.ChapterList).each(function () {

        var li = $('.ChapterLi')[this.page];
        if (li == undefined) return;

        if (this.page == MainObj.NowPage) { //目前頁面

            li.children[0].src = 'ToolBar/reading.png';
            this.readStatus = true;

        } else if (this.readStatus) { //已讀

            li.children[0].src = 'ToolBar/read.png';

        }

    })
}

//版面圖片設定
function JumpTableSetting(num, table) {

    var Widget = false;

    var NewDiv = document.createElement('div');
    $(table).append(NewDiv);
    $(NewDiv).css({
        'width': '150px',
        'height': '150px',
        'position': 'relative'
    })

    var NewSpan = document.createElement('span');
    $(NewDiv).append(NewSpan);
    $(NewSpan).css('display', 'block');
    $(NewSpan).text(num + 1);

    var Img = new Image();
    $(NewDiv).append(Img);
    Img.id = num;
    Img.src = 'data:image/png;base64,' + Base64ImageList[num].Value;
    $(Img).css({
        'width': '150px',
        'height': '150px',
        'float': 'left',
        'position': 'absolute'
    })

    //跳頁視窗顯示頁籤
    if (ToolBarList.TapList[num]) {
        var tapImg = new Image();
        $(NewDiv).append(tapImg);
        tapImg.src = 'ToolBar/tagicon.png';
        $(tapImg).css({
            'width': '60px',
            'height': '30px',
            'float': 'left',
            'position': 'absolute',
            'right': '0px',
            'padding-top': '37px'
        })
    }

    if (txtCanvas.SaveList.length > 0) {
        for (var i = 0; i < txtCanvas.SaveList.length; i++) {
            // console.log(txtCanvas.SaveList[i]);
            if (txtCanvas.SaveList[i] != undefined) {
                if (txtCanvas.SaveList[i].page == num) {
                    Widget = true;
                }
            }
        }
    }

    if (txtNote.SaveList.length > 0) {
        for (var i = 0; i < txtNote.SaveList.length; i++) {
            // console.log(txtCanvas.SaveList[i]);
            if (txtNote.SaveList[i] != undefined) {
                if (txtNote.SaveList[i].page == num) {
                    Widget = true;
                }
            }
        }
    }

    if (Widget) {
        var noteImg = new Image();
        $(NewDiv).append(noteImg);
        noteImg.src = 'ToolBar/noteicon.png';
        $(noteImg).css({
            'width': '40px',
            'height': '35px',
            'float': 'left',
            'position': 'absolute',
            'padding-left': '110px'
        })
    }

    $(Img).click(function (e) {
        e.preventDefault();
        JumpPage(Number(this.id));
    });
}

//點擊跳頁列表的圖片後跳頁
function JumpPage(page) {
    gotoPage(page);
    $('#Jumptable').css('display', 'none');
    $('#JumptableAll').css('display', 'none');
    $('.JumpIcon').css('display', 'none');
    $('#JumpBar').remove();
    $('.pptType').remove();

    $(tempToolBars[0].btns).each(function () {
        if (this.id == 'jump') {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
        }
    })

    syncPage = MainObj.NowPage;

    var message = '[scmd]' + Base64.encode('goto' + syncPage);
    rmcall(message);
}

//JumpIcon顯示
function JumpIconShow(btn) {
    if (btn.afterClick) {

        if (MainObj.IsTwoPage) {
            $('#Chapter_li').css('display', 'none');
        }

        $('.JumpIcon').css('display', 'block');

    } else {
        $('.JumpIcon').css('display', 'none');
    }
}

//Icon功能判別
function JumpChange(list) {
    initListpng();

    switch (list.id) {
        case 'btnAll':
            $('#btnAll').attr({
                'src': "ToolBar/allpage2.png"
            });
            ToolBarList.IsChapter = false;
            btnAllSetting();
            break;

        case 'btnBook':
            $('#btnBook').attr({
                'src': "ToolBar/switchJumpPageDefaultBtn2.png"
            });
            ToolBarList.IsChapter = false;
            btnBookSetting();
            break;

        case 'btnChapter':
            $('#btnChapter').attr({
                'src': "ToolBar/chapterbtn2.png"
            });
            ToolBarList.IsChapter = true;
            btnChapterSetting();
            break;
    }

    if (MainObj.IsTwoPage) {
        $('#Chapter_li').css('display', 'none');
    }

    toolbarChange();
    ResetEBook();
}

//所有button變回false
function changeAllBtnToFalse(note) {
    GalleryStartMove();

    ToolBarList.AddWidgetState = 'none';
    $('#canvasPad').remove();
    $('#canvasEraser').remove();
    clearAllTreasure();

    $(tempToolBars[0].btns).each(function () {
        if (this.id == 'zoomIn' || this.id == 'zoomOut') {
            return;
        }
        if (!note) {
            this.afterClick = false;
            checkBtnChange(this);
            ToolBarList.AddWidgetState = 'none';
        } else {
            for (var i = 0; i < note.length; i++) {
                if (this.id == note[i].id) {
                    this.afterClick = false;
                    ToolBarList.AddWidgetState = 'none';
                    $('.' + this.id).css('background-image', this.beforeStyle['background-image']);
                }
            }
        }
    });
}

//調色盤改變上面顏色條
function changecolorlw(color) {
    $('#color').attr("value", color);
    $(".colorStateBar").children("div").css("background-color", color);
    $('.bgcolor').css('background-color', color);
}

//調色盤
function penchane(obj, COLOR) {
    $("#norColor .option").removeClass("active");
    $(obj).addClass("active");
    var tempPenColor = $(obj)[0].style.backgroundColor;

    penCmdStatus = 0;
    $(".colorStateBar").children("div").css("background-color", tempPenColor);
}

//調色盤 形狀
function changeSharp(type) {
    $('.sharp_btn').css({
        'background-color': '#ffffff'
    })
    $('#' + type).css({
        'background-color': '#ffff00'
    })
    colorPen.selectedType = type;
}

//調色盤：確定
function starDraw() {

    var picker;

    colorPen.Color = $('.colorStateBar >div')[0].style.backgroundColor;
    colorPen.Opacity = $('.colorStateBar >div')[0].style.opacity;
    colorPen.Width = parseInt($('#chance_slider').val());
    colorPen.BrushType = colorPen.selectedType;

    if (ToolBarList.AddWidgetState == 'ColorsPicker') {
        picker = 'colorPen';
    } else {
        picker = 'IRSPen';
    }

    var colorPenClick = checkPickerStatus(picker);
    var colorPicker = checkPickerStatus('ColorsPicker');
    if (colorPenClick.afterClick == false) {
        $('#' + picker)[0].click();
    }
    $('#ColorsPicker').attr("src", "ToolBar/qpenToolStripButton.Image1.png");

    $('#colorPicker').dialog('close');

}

//調色盤：取消
function closePicker() {

    var btn;

    $('#colorPicker').dialog('close');

    if (ToolBarList.AddWidgetState == 'ColorsPicker') {
        btn = tempToolBars[0].btns;
    } else {
        btn = NoteBars[0].btns;
    }

    $(btn).each(function () {
        if (this.id == ToolBarList.AddWidgetState) {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
            ToolBarList.AddWidgetState = 'none';
        }
    })
}

//取得調色盤btn
function checkPickerStatus(objID) {
    var obj, btn;

    if (ToolBarList.AddWidgetState == 'ColorsPicker') {
        btn = tempToolBars[0].btns;
    } else {
        btn = NoteBars[0].btns;
    }

    $(btn).each(function () {
        if (this.id == objID) {
            obj = this;
        }
    })
    return obj;
}

//取得btn
function checkBtnStatus(objID) {
    var obj;
    $(tempToolBars[0].btns).each(function () {
        if (this.id == objID) {
            obj = this;
        }
    })
    return obj;
}

//頁籤
function tapLayer() {

    if ($('#tap')[0] == undefined) {

        NewCanvas();
        var canvasTap = $('#canvas')[0];
        canvasTap.id = 'tap';
        canvasTap.width = 94 * MainObj.Scale;
        canvasTap.height = 44 * MainObj.Scale;

        if (MainObj.IsTwoPage) {
            var left = $('#CanvasGallery')[0].width - canvasTap.width;
        } else {
            var left = $('#CanvasGallery')[0].width - canvasTap.width;
        }

        $(canvasTap).css({
            'position': 'absolute',
            'top': 100 + MainObj.CanvasT,
            'left': left + (MainObj.NowPage == 0 ? $('#CanvasGallery').offset().left : MainObj.CanvasL)
        })

        var cxtTap = canvasTap.getContext('2d');
        resizeCanvas(canvasTap, cxtTap);

        var imgTap = new Image();
        imgTap.onload = function () {
            cxtTap.drawImage(imgTap, 0, 0, canvasTap.width, canvasTap.height);
        }
        imgTap.src = 'ToolBar/tag.png';

        ToolBarList.TapList[MainObj.NowPage] = true;

    } else {
        $('#tap').remove();
        ToolBarList.TapList[MainObj.NowPage] = false;
    }
}

//全文檢索清單
function searchTextList() {
    $('.centent_Text').css({
        'height': '240px'
    });
    //$('#dialogSearchText').css({ 'height': '300px' });
    if ($('.centent_Text >ul>li').length > 0) {
        $('.centent_Text >ul').empty()
    }
    var temp = '';

    var searchText = '';
    var alltext = [];
    for (var i = 0; i < TextlocationList.length; i++) {
        if (TextlocationList[i].content.length > 0) {
            for (var j = 0; j < TextlocationList[i].content.length; j++) {

                if (TextlocationList[i].content[j].keyword == $('#TextKeyword').val()[0]) {
                    searchText = '';

                    for (var k = 0; k < $('#TextKeyword').val().length; k++) {

                        searchText += TextlocationList[i].content[j + (k)].keyword;
                    }

                    if (searchText != '') {
                        var searchData = [TextlocationList[i].content[j].top, TextlocationList[i].content[j].left, TextlocationList[i].content[j].width, TextlocationList[i].content[j].height, (i + 1), searchText];

                        alltext.push(searchData);
                    }

                }

            }
        }

    }
    var isRightpage = false;

    for (var y = 0; y < alltext.length; y++) {
        if ($('#TextKeyword').val() == alltext[y][5]) {

            if (!MainObj.IsTwoPage) {
                temp += "<li onclick=\"searchTextLocation(" + (alltext[y][4] - 1) + ',' + alltext[y][0] + ',' + alltext[y][1] + ',' + alltext[y][2] + ',' + alltext[y][3] + ");\"><div style=\"display:inline-block;;    width: 50px;\"><span >" + alltext[y][4] + '</span></div><div style=\"display:inline-block;;    \"><span style=\"padding-left:20px;\">' + alltext[y][5] + "</span></div></li>";
            } else {
                // console.log('page : ' + (alltext[y][4] - 1));
                isRightpage = false;

                if ((alltext[y][4] - 1) % 2 == 0) {
                    isRightpage = true;
                }
                temp += "<li onclick=\"searchTextLocation(" + (alltext[y][4] - 1) + ',' + alltext[y][0] + ',' + alltext[y][1] + ',' + alltext[y][2] + ',' + alltext[y][3] + ',' + isRightpage + ");\"><div style=\"display:inline-block;;    width: 50px;\"><span >" + alltext[y][4] + '</span></div><div style=\"display:inline-block;;    \"><span style=\"padding-left:20px;\">' + alltext[y][5] + "</span></div></li>";
            }

        }
    }

    $("#TextUL").append(temp);
    if ($('.centent_Text >ul>li').length < 1) {
        var temp = "<li>查無資料</li>";
        $("#TextUL").append(temp);
        $('.centent_Text').css({
            'height': '25px'
        });
        $('#dialogSearchText').css({
            'height': '80px'
        });
    }

    $('#textcount').text($('.centent_Text >ul>li').length);
}

//搜內文的手指圖片設定
function searchTextLocation(page, top, left, width, height, isRightpage) {

    $('.Text').remove();

    gotoPage(page);

    syncPage = MainObj.NowPage;

    var message = '[scmd]' + Base64.encode('goto' + syncPage);
    rmcall(message);

    var scalepdfy = 1;
    var scalepdfx = 1;
    var twoscalepdfx = 1;
    //換算縮放比例:母版/pdf原始寬高
    if (TextlocationList.length > 0) {

        var textlocation;

        for (var i = 0; i < TextlocationList.length; i++) {

            if (TextlocationList[i].pdfHeight != 0) {
                textlocation = TextlocationList[i];
                break;
            }
        }

        scalepdfy = MainObj.NewCanvasHeight / parseInt(textlocation.pdfHeight);
        scalepdfx = MainObj.NewCanvasWidth / parseInt(textlocation.pdfWidth);
        // scalepdfy = BookList.eBookHeight / parseInt(TextlocationList[0].pdfHeight);
        twoscalepdfx = (MainObj.NewCanvasWidth * 2) / (parseInt(textlocation.pdfWidth) * 2);
        console.log('two page : ' + twoscalepdfx);
    }

    var layer = new textImgLayer($('body'));

    layer.setTop((((top) * scalepdfy)) + MainObj.CanvasT - $('.Text').height() - 5);
    layer.setLeft(((left) * scalepdfx) + MainObj.CanvasL - $('.Text').width());

    if (MainObj.IsTwoPage) {
        if (isRightpage == true) {
            layer.setLeft(((left + parseInt(textlocation.pdfWidth)) * twoscalepdfx) + MainObj.CanvasL - $('.Text').width());
        }
    }
}

//搜內文的手指圖片新增
function textImgLayer(parentNode) {
    //Division
    this.Division = document.createElement('img');

    this.Division.super = this;
    this.Division.src = 'ToolBar/hand_finger2.png';
    this.Division.className = 'Text';
    $(this.Division).addClass('canvasObj');
    this.Division.style.position = 'absolute';
    this.Division.style.left = '0px';
    this.Division.style.top = '0px';
    this.Division.style.width = '23px';
    this.Division.style.height = '23px';

    $(this.Division).addClass('canvasObj');

    this.setLeft = function (left) {
        this.Division.style.left = (left + '').replace('px', '') + 'px';
    }

    this.setTop = function (top) {
        this.Division.style.top = (top + '').replace('px', '') + 'px';
    }


    if (parentNode != null) {
        parentNode.append(this.Division);
    }

}

//搜內文：取消
function closeSearch() {

    $('#dialogSearchText').dialog('close');

    $(tempToolBars[0].btns).each(function () {
        if (this.id == 'textSearch') {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
        }
    })
}

//IRS
function IRSSetting() {

    $('#IRS_Div').toggle();

    $(NoteBars[0].btns).each(function () {

        var that = this;
        var NewLi = document.createElement('li');
        var NewSpan = document.createElement('span');
        NewSpan.id = that.id;
        var NewLabel = document.createElement('label');

        $(NewSpan).css('background-image', that.beforeStyle['background-image']);
        $(NewSpan).click(function (e) {
            e.preventDefault();
            that.action();
        });
        $(NewLabel).text(that.beforespanTextName);
        $(NewSpan).append(NewLabel);
        $(NewLi).append(NewSpan);
        $('#IRS_Ul').append(NewLi);

    })
}

//改變同步ICON的狀態
function checkBtnStatusFroSync(imgName) {

    var syncBtn = checkBtnStatus('sync');

    syncBtn.beforeStyle = {
        'background-image': 'url(ToolBar/' + imgName + '.png)'
    };

    checkBtnChange(syncBtn);

}

//開始測驗跟送出試卷按鈕轉換
function quizBtnToggle() {
    $('#quizAction').toggle()
    $('#quizUpload').toggle()
}

//取得單一註記
function getNote() {
    // if (!$('li.selected').length) {
    //     alert('請選擇註記');
    //     return;
    // }
    // var bookNotesID = $('li.selected')[0].id;
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
    var noteId = tmp.filter(function (x) {
        if (x[0] === 'note') {
            return x;
        }
    });
    if (domain.length && noteId.length) {
        var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote/' + noteId[0][1] + '.xml';
        $.ajax({
            type: "GET",
            contentType: "text/xml",
            url: url,
            async: false,
            dataType: "xml",
            //成功接收的function
            success: function (xml) {
                noteSwitch(xml);
                // closeNote();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("=====Error=====");
            }
        });
    }
}

//關閉註記切換視窗
function closeNote() {
    $('.note_switch_layout').css('display', 'none');
}

//註記切換
function noteSwitch(xml) {
    Html5WirteLog('Note:' + JSON.stringify(xml2jsonAttributeVer(xml)));
    if (window.DOMParser) {

        txtNote.SaveList = [];
        txtCanvas.SaveList = [];
        colorPen.LineList = [];
        txtCanvas.canvasList = [];
        InsertImg.SaveList = [];
        comment.saveList = [];
        fileObj.saveList = [];
        hyperLink.saveList = [];

        $(xml).find('ProcedureSlice').each(function () {

            var page = xml2jsonAttributeVer(this).page;

            if ($(this).find('UserCreateObjectList').length > 0) {
                $(this).find('UserCreateObjectList').each(function () {

                    if ($(this).find('UserCreateObject').length > 0) {

                        $(this).find('UserCreateObject').each(function () {

                            var ebookjson = {};

                            if ($(this).attr('FormatterType') != undefined) {
                                switch ($(this).attr('FormatterType').split('.').pop()) {
                                    //文字、便利貼
                                    case 'StickyObjectFormatter':

                                        switch ($(this).attr('StickyViewType')) {
                                            //文字
                                            case 'stickyText':

                                                ebookjson = {
                                                    page: page,
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
                                                    page: page,
                                                    id: $(this).attr('Identifier'),
                                                    type: 'txtCanvas',
                                                    width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                                    height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                                    top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                                    left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                                    StickyViewVisibility: $(this).attr('StickyViewVisibility'),
                                                    points: FindCanvasPoint($(this).find('IntegerPath'), $(this).attr('Identifier'))
                                                }

                                                // if (txtCanvas.SaveList.length > 0) {
                                                //     for (var x = 0; x < txtCanvas.SaveList.length; x++) {
                                                //         if (txtCanvas.SaveList[x] != undefined) {
                                                //             if (txtCanvas.SaveList[x].id == ebookjson.id) {
                                                //                 delete txtCanvas.SaveList[x];
                                                //             }
                                                //         }
                                                //     }
                                                // }

                                                txtCanvas.SaveList.push(ebookjson);
                                                if (ebookjson.points.length > 0) {
                                                    for (var p = 0; p < ebookjson.points.length; p++) {
                                                        txtCanvas.canvasList.push(ebookjson.points[p]);
                                                    }
                                                }

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
                                                opacity: $(this).attr('Opacity') ? $(this).attr('Opacity') : 1
                                            },
                                            page: page,
                                            points: FindPenSize(point, $(this).attr('PixelSize'))[4],
                                            BrushType: $(this).attr('BrushType'),
                                        }

                                        colorPen.LineList.push(ebookjson);

                                        break;

                                        //註記
                                    case 'MarkObjectFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'mark',
                                            value: $(this).attr('MarkContent')
                                        }
                                        markList.push(ebookjson);
                                        break;

                                        //圖片
                                    case 'InsertImageFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'InsertImg',
                                            width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                            height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                            top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                            left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                            pic: $(this).attr('Picture')
                                        }
                                        InsertImg.SaveList.push(ebookjson);
                                        break;

                                        //註解
                                    case 'AnnotationObjectFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'comment',
                                            value: $(this).attr('Contents'),
                                            position: getCommentPoint($(this).find('Point'))
                                        };
                                        comment.saveList.push(ebookjson);
                                        break;

                                        //檔案
                                    case 'FileObjectFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'file',
                                            fileName: $(this).attr('FileName'),
                                            file: $(this).attr('File'),
                                            width: $(this).attr('BoundaryPoint.Bounds.Size.Width'),
                                            height: $(this).attr('BoundaryPoint.Bounds.Size.Height'),
                                            top: $(this).attr('BoundaryPoint.Bounds.Location.Y'),
                                            left: $(this).attr('BoundaryPoint.Bounds.Location.X'),
                                        };
                                        fileObj.saveList.push(ebookjson);
                                        break;

                                        //超連結
                                    case 'HyperLinkObjectFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'hyperLink',
                                            title: $(this).attr('Title'),
                                            src: $(this).attr('Src'),
                                            top: $(this).attr('BoundaryPoint.Bounds.Location.Y'),
                                            left: $(this).attr('BoundaryPoint.Bounds.Location.X'),
                                        };
                                        hyperLink.saveList.push(ebookjson);
                                        break;

                                }
                            } else {
                                $('.NoteBox').remove();
                            }
                        })
                    }
                })
            }
        })
    }

    ReplyImage(MainObj.NowPage);
    ReplyMark(MainObj.NowPage);
    ReplyNote(MainObj.NowPage);
    ReplyCanvas(MainObj.NowPage);
    DrawPen(MainObj.NowPage);
    replyComment(MainObj.NowPage);
    replyFile();
    replyLink();
}

//取得註解point
function getCommentPoint(points) {
    if (points.length > 0) {
        var list = {
            from: {
                x: Number($($(points)[0]).attr('X')),
                y: Number($($(points)[0]).attr('Y'))
            },
            to: {
                x: Number($($(points)[1]).attr('X')),
                y: Number($($(points)[1]).attr('Y'))
            }
        };
    }
    return list;
}

//取得註記列鰾
function getNotesList() {
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
    var url = ReceiveList.HostURL + '/api/File/ebookNote/list?token=' + ReceiveList.token;
    var x2js = new X2JS();
    var jsonObjTitle = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    var jsonObj = {
        Book: {
            Account: null,
            Identifier: ReceiveList.BookName,
        }
    };
    var xmlAsStr = jsonObjTitle + x2js.json2xml_str(jsonObj).replace(/'/g, '"');
    Html5WirteLog(url);
    $.ajax({
        type: "POST",
        contentType: "text/xml",
        url: url,
        async: false,
        data: xmlAsStr,
        dataType: "xml",
        //成功接收的function
        success: function (res) {
            var list = xml2jsonAttributeVer(res).NoteList.Note;

            if (!list) {
                return;
            }

            $.ajax({
                type: "POST",
                contentType: "text/xml",
                url: list.length ? list[0].path : list.path,
                async: false,
                dataType: "xml",
                //成功接收的function
                success: function (xml) {
                    noteSwitch(xml);
                    // closeNote();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    Html5WirteLog(JSON.stringify(xhr));
                }
            });

            // if ($('.note_switch_ul').length) {
            //     $('.note_switch_ul').remove();
            // }

            // if (list) {
            //     list.forEach(function(x) {
            //         var ul = document.createElement('ul');
            //         $('.note_switch_cont').append(ul);
            //         $(ul).addClass('note_switch_ul');
            //         var li = document.createElement('li');
            //         li.id = x.bookNotesID;
            //         $('.note_switch_ul').append(li);
            //         var p = document.createElement('p');
            //         p.innerHTML = x.date + '(' + x.author + ')';
            //         $(li).append(p);
            //         var deleteBtn = document.createElement('img');
            //         deleteBtn.src = 'ToolBar/txtclose.png';
            //         $(li).append(deleteBtn);

            //         $(deleteBtn).click(function() {
            //             deleteNotes(x.bookNotesID);
            //         });

            //         $(li).click(function() {
            //             if ($('li.selected').length) {
            //                 $('li.selected').removeClass('selected');
            //             }
            //             $(this).addClass('selected');
            //         });
            //     });
            // }

            // $('.note_switch_layout').css('display', 'flex');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            Html5WirteLog(JSON.stringify(xhr));
        }
    });
}

//刪除註記
function deleteNotes(id) {
    confirmShow('是否確定刪除此註記', function (res) {
        if (res) {
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
            if (token) {
                var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote?token=' + token[0][1] + '&bookNotesID=' + id;
                $.ajax({
                    type: "DELETE",
                    contentType: "text/xml",
                    url: url,
                    async: false,
                    dataType: "json",
                    //成功接收的function
                    success: function (oXml, xhr) {
                        getNotesList();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log("=====Error=====");
                    }
                });
            }
        }
    })
}

//送出email
function submitEmail() {
    var emailVal = $('.classhub_email_cont')[0].value;
    var reg = /^.+@.+$/;
    if (!reg.test(emailVal)) {
        alert('請輸入正確E-mail');
        return;
    }
    $.ajax({
        type: "POST",
        contentType: "text/xml",
        url: ReceiveList.HostURL + '/api/File/ebookNote?token=' + ReceiveList.token,
        async: false,
        data: toSyncXML(true),
        dataType: "json",
        //成功接收的function
        success: function (oXml, xhr) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: ReceiveList.HostURL + '/api/File/shareLastEbookNote?token=' + ReceiveList.token + '&identifier=' + ReceiveList.BookName + '&classId=' + ReceiveList.ClassID,
                async: false,
                data: JSON.stringify(emailVal),
                dataType: "json",
                //成功接收的function
                success: function (oXml, xhr) {
                    BookAlertShow('已成功寄出E-mail！');
                    closeEmail();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    Html5WirteLog('shareLastEbookNote error');
                    Html5WirteLog(JSON.stringify(xhr));
                }
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            Html5WirteLog('ebookNote error');
            Html5WirteLog(JSON.stringify(xhr));
        }
    });
}

//關閉email視窗
function closeEmail() {
    $('.classhub_email_div').css('display', 'none');
    $('.classhub_email_cont')[0].value = '';
    changeAllBtnToFalse();
}

function discussionSet() {

    $('#discussionDialog').css('display', 'none');
    $('#App_Discuss').css('display', 'block');
    changeDiscussionBtn();
    startDiscussion();
}

function changeDiscussionBtn() {
    $(tempToolBars[0].btns).each(function () {
        if (this.id == 'discuss') {
            this.afterClick = true;
            $('#discuss').css('background-image', this.afterStyle['background-image']);
        }
    });
}

function startDiscussion() {

    isIRS = true;

    //學生開啟分組討論要先取得老師上傳的題目
    if (ReceiveList.UserRole == 1) {
        GetDiscussionImage();
        GalleryStopMove();
    }

    NewCanvas();
    var canvas = $('#canvas')[0];
    canvas.id = 'discussCanvas';
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    $(canvas).css('pointer-events', 'none');
    var cxt = canvas.getContext('2d');

    //當身分為老師或當取得的圖片為空字串時，補上新的討論畫面
    //如果不是為空字串，表示老師有上傳圖片，存到圖片位置DiscussionImage
    if (DiscussionImage != '') {

        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', DiscussionImage, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            try {
                var uInt8Array = new Uint8Array(this.response);
                var i = uInt8Array.length;
                var binaryString = new Array(i);
                while (i--) {
                    binaryString[i] = String.fromCharCode(uInt8Array[i]);
                }
                var data = binaryString.join('');

                var dataURL = "data:image/png;base64," + btoa(data);
            } catch (e) {
                Html5WirteLog(e);
            }

            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous') //跨域圖片屬性設置
            img.onload = function () {
                cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
            }
            img.src = dataURL;
        };
        xmlHTTP.send();
    } else {
        var img = new Image();
        img.onload = function () {
            cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
        }
        img.src = 'ToolBar/DiscussionBG.jpg';
    }
}

// 搜外網
function submitSearchWeb(type) {
    if (!$('.searchweb_cont')[0].value) return;

    var btn = document.createElement('div');
    btn.id = newguid();
    $('#HamastarWrapper').append(btn);
    btn.innerHTML = $('.searchweb_cont')[0].value;
    $(btn).addClass('searchweb_btn');
    $(btn).draggable({
        scroll: false,
        stop: function (event, ui) {
            var that = this;
            ToolBarList.searchWeb = ToolBarList.searchWeb.map(function (res) {
                if (res.id == that.id) {
                    res.left = (ui.offset.left - MainObj.CanvasL) / MainObj.Scale;
                    res.top = (ui.offset.top - MainObj.CanvasT) / MainObj.Scale;
                }
                return res;
            });
        }
    });

    switch (type) {
        case 'YouTube':
            window.open('https://www.youtube.com/results?search_query=' + $('.searchweb_cont')[0].value);
            break;
        case 'Google':
            window.open('https://www.google.com.tw/search?q=' + $('.searchweb_cont')[0].value);
            break;
        case 'Wiki':
            window.open('https://zh.wikipedia.org/wiki/' + $('.searchweb_cont')[0].value);
            break;
    }

    ToolBarList.searchWeb.push({
        id: btn.id,
        keyword: $('.searchweb_cont')[0].value,
        type: type,
        page: MainObj.NowPage,
        left: ($(btn).offset().left - MainObj.CanvasL) / MainObj.Scale,
        top: ($(btn).offset().top - MainObj.CanvasL) / MainObj.Scale
    });

    $(btn).click(function (e) {
        e.preventDefault();
        for (var i = 0; i < ToolBarList.searchWeb.length; i++) {
            if (ToolBarList.searchWeb[i].id == this.id) {
                var temp = ToolBarList.searchWeb[i];
                switch (temp.type) {
                    case 'YouTube':
                        window.open('https://www.youtube.com/results?search_query=' + temp.keyword);
                        break;
                    case 'Google':
                        window.open('https://www.google.com.tw/search?q=' + temp.keyword);
                        break;
                    case 'Wiki':
                        window.open('https://zh.wikipedia.org/wiki/' + temp.keyword);
                        break;
                }
            }
        }
    });
    closeSearchWeb();
}

function replySearchWeb(page) {
    $(ToolBarList.searchWeb).each(function () {
        if (this != undefined) {
            if (this.page == page) {
                var btn = document.createElement('div');
                btn.id = this.id;
                $('#HamastarWrapper').append(btn);
                btn.innerHTML = this.keyword;
                $(btn).addClass('searchweb_btn');
                $(btn).draggable({
                    scroll: false,
                    stop: function (event, ui) {
                        var that = this;
                        ToolBarList.searchWeb = ToolBarList.searchWeb.map(function (res) {
                            if (res.id == that.id) {
                                res.left = (ui.offset.left - MainObj.CanvasL) / MainObj.Scale;
                                res.top = (ui.offset.top - MainObj.CanvasT) / MainObj.Scale;
                            }
                            return res;
                        });
                    }
                });

                $(btn).css({
                    left: (this.left * MainObj.Scale) + MainObj.CanvasL,
                    top: (this.top * MainObj.Scale) + MainObj.CanvasT
                });

                var that = this;
                $(btn).click(function (e) {
                    e.preventDefault();
                    switch (that.type) {
                        case 'YouTube':
                            window.open('https://www.youtube.com/results?search_query=' + that.keyword);
                            break;
                        case 'Google':
                            window.open('https://www.google.com.tw/search?q=test' + that.keyword);
                            break;
                        case 'Wiki':
                            window.open('https://zh.wikipedia.org/wiki/' + that.keyword);
                            break;
                    }
                });
            }
        }
    })
}

function closeSearchWeb() {
    $('.searchweb_div').css('display', 'none');
    $('.searchweb_cont')[0].value = '';
    changeAllBtnToFalse();
}

// 開始計時
function startTimer() {
    var reg = /^\d{0,2}$/;
    if (!reg.test($('.time_h')[0].value) || !reg.test($('.time_m')[0].value) || !reg.test($('.time_s')[0].value)) {
        alert('請輸入正確時間');
        resetTimer();
        return;
    }
    var s = 0,
        m = 0,
        h = 0;

    if (ToolBarList.isStop) {
        ToolBarList.isStop = false;
        $('.timer_start')[0].innerHTML = '暫停';
        $('.timer_start').css('color', 'red');
        h = Number($('.time_h')[0].value);
        m = Number($('.time_m')[0].value);
        s = Number($('.time_s')[0].value);

        if (!ToolBarList.isCountdown) {
            ToolBarList.timer = setInterval(function () {
                s++;
                var time = new Date();
                time.setHours(h, m, s);
                s = time.getSeconds();
                m = time.getMinutes();
                h = time.getHours();
                $('.time_s')[0].value = s < 10 ? '0' + s : s;
                $('.time_m')[0].value = m < 10 ? '0' + m : m;
                $('.time_h')[0].value = h < 10 ? '0' + h : h;
            }, 1000);
        } else {
            ToolBarList.timer = setInterval(function () {
                s--;
                var time = new Date();
                time.setHours(h, m, s);
                s = time.getSeconds();
                m = time.getMinutes();
                h = time.getHours();
                $('.time_s')[0].value = s < 10 ? '0' + s : s;
                $('.time_m')[0].value = m < 10 ? '0' + m : m;
                $('.time_h')[0].value = h < 10 ? '0' + h : h;
                if (!s && !m && !h) {
                    // alert('Time`s Up!');
                    resetTimer();
                }
            }, 1000);
        }
        return;
    }

    if ($('.timer_start')[0].innerHTML == '開始') {
        ToolBarList.isStop = false;
        $('.timer_start')[0].innerHTML = '暫停';
        $('.timer_start').css('color', 'red');

        h = Number($('.time_h')[0].value);
        m = Number($('.time_m')[0].value);
        s = Number($('.time_s')[0].value);

        if (!h && !m && !s) {
            ToolBarList.isCountdown = false;
            ToolBarList.timer = setInterval(function () {
                s++;
                var time = new Date();
                time.setHours(h, m, s);
                s = time.getSeconds();
                m = time.getMinutes();
                h = time.getHours();
                $('.time_s')[0].value = s < 10 ? '0' + s : s;
                $('.time_m')[0].value = m < 10 ? '0' + m : m;
                $('.time_h')[0].value = h < 10 ? '0' + h : h;
            }, 1000);
        } else {
            ToolBarList.isCountdown = true;
            ToolBarList.timer = setInterval(function () {
                s--;
                var time = new Date();
                time.setHours(h, m, s);
                s = time.getSeconds();
                m = time.getMinutes();
                h = time.getHours();
                $('.time_s')[0].value = s < 10 ? '0' + s : s;
                $('.time_m')[0].value = m < 10 ? '0' + m : m;
                $('.time_h')[0].value = h < 10 ? '0' + h : h;
                if (!s && !m && !h) {
                    // alert('Time`s Up!');
                    resetTimer();
                }
            }, 1000);
        }
    } else {
        $('.timer_start')[0].innerHTML = '開始';
        $('.timer_start').css('color', '#ffffff');
        clearInterval(ToolBarList.timer);
        ToolBarList.isStop = true;
        // alert($('.time_h')[0].value + '：' + $('.time_m')[0].value + '：' + $('.time_s')[0].value);
        // resetTimer();
    }
}

// 重置計時
function resetTimer() {
    $('.timer_start')[0].innerHTML = '開始';
    $('.timer_start').css('color', '#fff');
    clearInterval(ToolBarList.timer);
    ToolBarList.timer = null;
    ToolBarList.isStop = false;
    ToolBarList.isCountdown = false;
    $('.time_s')[0].value = '00';
    $('.time_m')[0].value = '00';
    $('.time_h')[0].value = '00';
}

// 關閉計時器
function closeTimer() {
    changeAllBtnToFalse(treasureToolBar);
    $('.timer_layout').css('display', 'none');
    resetTimer();
}

// 開始選號
function startRandomNumber() {
    var min = Number($('.selector_min')[0].value);
    var max = Number($('.selector_max')[0].value);
    if (min && max) {
        var reg = /^[0-9]*$/;
        if (!reg.test(min) || !reg.test(max)) {
            alert('請輸入正確數字!');
            return;
        }
        if (min >= max) {
            alert('請輸入正確區間!');
            return;
        }
        var temp = [];
        var groupTemp = [];
        if (!$('.selector_group').val()) {
            var count = $('.selector_count').val();
            if (max - ToolBarList.selectorNumberList.length == 0) {
                $('.selector_answer')[0].innerHTML = '已全部選取!';
                return;
            } else if (max - ToolBarList.selectorNumberList.length < count) {
                count = max - ToolBarList.selectorNumberList.length;
            }
            for (var i = 0; i < count; i++) {
                var number = getRandom(min, max, temp);
                temp.push(number);
                ToolBarList.selectorNumberList.push(number);
            }
            $('.selector_answer')[0].innerHTML = temp.sort(function (a, b) {
                return a - b;
            }).join('、');
        } else {
            var allCount = max - min + 1;
            if ($('.selector_group').val() > allCount) {
                alert('分組數大於區間，請重新選擇');
                return;
            }
            var groupCount = $('.selector_group').val();
            var groupMember = Math.floor(allCount / groupCount);
            var data = new Array(allCount);
            for (var d = 0; d < data.length; d++) {
                data[d] = d + 1;
            }
            var count = 0;
            for (var x = 0; x < data.length; x += groupMember) {
                count++;
                if (count > groupCount) {
                    temp[temp.length - 1] = temp[temp.length - 1].concat(data.slice(x, x + groupMember).filter(function (v) {
                        !temp[temp.length - 1].includes(v);
                    }))
                } else {
                    temp.push(data.slice(x, x + groupMember));
                }
            }

            $(temp).each(function () {
                var number = getRandom(this[0], this[this.length - 1], groupTemp);
                groupTemp.push(number);
                ToolBarList.selectorNumberList.push(number);
            });

            $('.selector_answer')[0].innerHTML = groupTemp.join('、');
        }
    }
}

//選號器，產生min到max之間的亂數 (不能重複)
function getRandom(min, max, oldList) {
    var temp = Math.floor(Math.random() * (max - min + 1)) + min;
    var isSame = oldList.filter(function (x) {
        if (x == temp) {
            return x;
        }
    });
    if (isSame.length) {
        temp = getRandom(min, max, oldList);
    }
    isSame = ToolBarList.selectorNumberList.filter(function (x) {
        if (x == temp) {
            return x;
        }
    });
    if (isSame.length) {
        temp = getRandom(min, max, oldList);
    }
    return temp;
};

// 關閉選號器
function closeSelector() {
    changeAllBtnToFalse(treasureToolBar);
    $('.selector_layout').css('display', 'none');
    resetSelector();
}

// 重置選號器
function resetSelector() {
    ToolBarList.selectorNumberList = [];
    $('.selector_min')[0].value = '';
    $('.selector_max')[0].value = '';
    $('.selector_answer')[0].innerHTML = '';
    $('.selector_group').val(0);
    $('.selector_count').children().each(function () {
        if ($(this).text() == 1) {
            this.selected = true;
        }
    });
}

// 關閉所有彈跳視窗
function clearAllTreasure() {
    $('.selector_layout').css('display', 'none');
    $('.timer_layout').css('display', 'none');
    $('.page-layout').css('display', 'none');
}

// 輸入頁數
function inputPage() {
    var inputVal = $('.pageNumber')[0].value;
    if (!/^(0|[1-9][0-9]*)$/.test(inputVal)) {
        alert('請輸入正確頁碼!');
        $('.pageNumber')[0].value = MainObj.NowPage + 1;
        return;
    }

    if (inputVal - 1 >= HamaList.length) {
        $('.pageNumber')[0].value = HamaList.length;
        gotoPage(HamaList.length - 1);
        return;
    }

    if (inputVal - 1 < 0) {
        $('.pageNumber')[0].value = 0;
        gotoPage(0);
        return;
    }

    gotoPage(inputVal - 1);
}

function closeInputPage() {
    changeAllBtnToFalse();
    $('.page-layout').css('display', 'none');
}

// 插入檔案
function handleFiles(files) {
    if (files.length) {
        if (files[0].size > 50000000) {
            alert('檔案大小上限為50MB，請重新上傳');
            return;
        }
        NewCanvas();
        var canvas = $('#canvas')[0];
        $(canvas).attr('class', 'inputFile');
        canvas.id = 'inputFile';
        $(canvas).css({
            'left': MainObj.CanvasL,
            'top': MainObj.CanvasT
        })

        if (files[0].type.indexOf('video/') > -1) {
            // 影片
            $(canvas).click(function (e) {
                e.preventDefault();
                var mouseX = e.offsetX,
                    mouseY = e.offsetY;

                var videoDiv = document.createElement('div');
                videoDiv.id = newguid();
                $(videoDiv)
                    .attr('class', 'videoFile')
                    .css({
                        width: 640,
                        height: 360,
                        'position': 'absolute',
                        'left': mouseX,
                        'top': mouseY
                    });
                $('#HamastarWrapper').append(videoDiv);

                var NewVideo = document.createElement('video');
                NewVideo.width = 640;
                NewVideo.height = 360;
                $(videoDiv).append(NewVideo);

                $(NewVideo)
                    .attr('controls', true)
                    .css({
                        'position': 'absolute',
                        'cursor': 'pointer',
                        'object-fit': 'fill'
                    });

                NewVideo.src = window.URL.createObjectURL(files[0]);

                $(videoDiv).resizable({
                    alsoResize: '#' + videoDiv.id + '>video',
                    minHeight: 100,
                    minWidth: 100,
                    start: function () {
                        $(window).off("resize", resizeInit);
                    },
                    stop: function () {
                        $(window).resize(resizeInit);
                        var fileTemp = this;
                        fileObj.saveList = fileObj.saveList.map(function (x) {
                            if (x.id == fileTemp.id) {
                                x.width = $(fileTemp).width() / MainObj.Scale;
                                x.height = $(fileTemp).height() / MainObj.Scale;
                            }
                            return x;
                        });
                    }
                });

                $(videoDiv).draggable({
                    scroll: false,
                    stop: function (e) {
                        var fileTemp = this;
                        fileObj.saveList = fileObj.saveList.map(function (x) {
                            if (x.id == fileTemp.id) {
                                x.left = ($(fileTemp).offset().left - MainObj.CanvasL) / MainObj.Scale;
                                x.top = ($(fileTemp).offset().top - MainObj.CanvasT) / MainObj.Scale;
                            }
                            return x;
                        });
                    }
                });

                $('#inputFile').remove();

                getBase64(files[0]).then(function (x) {
                    fileObj.saveList.push({
                        id: videoDiv.id,
                        page: MainObj.NowPage,
                        type: 'file',
                        file: x,
                        fileName: files[0].name,
                        left: ($(videoDiv).offset().left - MainObj.CanvasL) / MainObj.Scale,
                        top: ($(videoDiv).offset().top - MainObj.CanvasT) / MainObj.Scale,
                        width: 640 / MainObj.Scale,
                        height: 360 / MainObj.Scale
                    });
                });
            });
        } else {
            $(canvas).click(function (e) {
                e.preventDefault();
                var mouseX = e.offsetX,
                    mouseY = e.offsetY;
                NewCanvas();
                var fileCanvas = $('#canvas')[0];
                fileCanvas.id = newguid();
                $(fileCanvas).attr('class', 'fileObj');
                var fileCxt = fileCanvas.getContext('2d');
                var img = new Image();
                $(fileCanvas).css({
                    'left': mouseX,
                    'top': mouseY
                })
                img.onload = function () {
                    fileCanvas.width = img.width;
                    fileCanvas.height = img.height;
                    fileCxt.drawImage(img, 0, 0, fileCanvas.width, fileCanvas.height);

                    $(fileCanvas).resizable({
                        minHeight: 100,
                        minWidth: 100,
                        start: function () {
                            $(window).off("resize", resizeInit);
                        },
                        stop: function () {
                            $(window).resize(resizeInit);
                            var fileTemp = $(this).children()[0];
                            fileObj.saveList = fileObj.saveList.map(function (x) {
                                if (x.id == fileTemp.id) {
                                    x.width = $(fileTemp).width() / MainObj.Scale;
                                    x.height = $(fileTemp).height() / MainObj.Scale;
                                }
                                return x;
                            });
                        }
                    });

                    $(fileCanvas.parentElement).draggable({
                        scroll: false,
                        stop: function (e) {
                            var fileTemp = $(this).children()[0];
                            fileObj.saveList = fileObj.saveList.map(function (x) {
                                if (x.id == fileTemp.id) {
                                    x.left = ($(fileTemp).offset().left - MainObj.CanvasL) / MainObj.Scale;
                                    x.top = ($(fileTemp).offset().top - MainObj.CanvasT) / MainObj.Scale;
                                }
                                return x;
                            });
                        }
                    });

                    $(fileCanvas.parentElement).click(function (e) {
                        e.preventDefault();
                        window.open(window.URL.createObjectURL(files[0]));
                    });

                    $('#inputFile').remove();

                    getBase64(files[0]).then(function (x) {
                        fileObj.saveList.push({
                            id: fileCanvas.id,
                            page: MainObj.NowPage,
                            type: 'file',
                            file: x,
                            fileName: files[0].name,
                            left: ($(fileCanvas).offset().left - MainObj.CanvasL) / MainObj.Scale,
                            top: ($(fileCanvas).offset().top - MainObj.CanvasT) / MainObj.Scale,
                            width: img.width / MainObj.Scale,
                            height: img.height / MainObj.Scale
                        });
                    });
                };
                // 檔案對應圖示
                switch (files[0].name.split('.').pop().toLowerCase()) {
                    case 'doc':
                    case 'docx':
                        img.src = 'ToolBar/FileType/DocDocx.png';
                        break;
                    case 'jpg':
                    case 'png':
                    case 'gif':
                        img.src = window.URL.createObjectURL(files[0]);
                        break;
                    case 'ppt':
                    case 'pptx':
                        img.src = 'ToolBar/FileType/PptPptx.png';
                        break;
                    default:
                        img.src = 'ToolBar/FileType/' + files[0].name.split('.').pop().toLowerCase() + '.png';
                        break;
                }
            });
        }
    }
}

function getBase64(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
        // reader.onerror = error => reject(error);
    });
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        type: mime
    });
}

function replyFile() {
    $('.fileObj').remove();
    $('.videoFile').remove();
    fileObj.saveList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            if (res.fileName.split('.').pop().toLowerCase() == 'mp4') {
                var videoDiv = document.createElement('div');
                videoDiv.id = res.id;
                $(videoDiv)
                    .attr('class', 'videoFile')
                    .css({
                        width: res.width * MainObj.Scale,
                        height: res.height * MainObj.Scale,
                        'position': 'absolute',
                        'left': res.left * MainObj.Scale + MainObj.CanvasL,
                        'top': res.top * MainObj.Scale + MainObj.CanvasT
                    });
                $('#HamastarWrapper').append(videoDiv);

                var NewVideo = document.createElement('video');
                NewVideo.width = res.width * MainObj.Scale;
                NewVideo.height = res.height * MainObj.Scale;
                $(videoDiv).append(NewVideo);

                $(NewVideo)
                    .attr('controls', true)
                    .css({
                        'position': 'absolute',
                        'cursor': 'pointer',
                        'object-fit': 'fill'
                    });

                NewVideo.src = ReceiveList ? ('Note/' + res.fileName) : res.file;

                $(videoDiv).resizable({
                    alsoResize: '#' + videoDiv.id + '>video',
                    minHeight: 100,
                    minWidth: 100,
                    start: function () {
                        $(window).off("resize", resizeInit);
                    },
                    stop: function () {
                        $(window).resize(resizeInit);
                        var fileTemp = this;
                        fileObj.saveList = fileObj.saveList.map(function (x) {
                            if (x.id == fileTemp.id) {
                                x.width = $(fileTemp).width() / MainObj.Scale;
                                x.height = $(fileTemp).height() / MainObj.Scale;
                            }
                            return x;
                        });
                    }
                });

                $(videoDiv).draggable({
                    scroll: false,
                    stop: function (e) {
                        var fileTemp = this;
                        fileObj.saveList = fileObj.saveList.map(function (x) {
                            if (x.id == fileTemp.id) {
                                x.left = ($(fileTemp).offset().left - MainObj.CanvasL) / MainObj.Scale;
                                x.top = ($(fileTemp).offset().top - MainObj.CanvasT) / MainObj.Scale;
                            }
                            return x;
                        });
                    }
                });
            } else {
                NewCanvas();
                var fileCanvas = $('#canvas')[0];
                fileCanvas.id = res.id;
                $(fileCanvas).attr('class', 'fileObj');
                var fileCxt = fileCanvas.getContext('2d');
                var img = new Image();
                $(fileCanvas).css({
                    'left': res.left * MainObj.Scale + MainObj.CanvasL,
                    'top': res.top * MainObj.Scale + MainObj.CanvasT
                })
                img.onload = function () {
                    fileCanvas.width = res.width * MainObj.Scale;
                    fileCanvas.height = res.height * MainObj.Scale;
                    fileCxt.drawImage(img, 0, 0, fileCanvas.width, fileCanvas.height);

                    $(fileCanvas).resizable({
                        minHeight: 100,
                        minWidth: 100,
                        start: function () {
                            $(window).off("resize", resizeInit);
                        },
                        stop: function () {
                            $(window).resize(resizeInit);
                            var fileTemp = $(this).children()[0];
                            fileObj.saveList = fileObj.saveList.map(function (x) {
                                if (x.id == fileTemp.id) {
                                    x.width = $(fileTemp).width() / MainObj.Scale;
                                    x.height = $(fileTemp).height() / MainObj.Scale;
                                }
                                return x;
                            });
                        }
                    });

                    $(fileCanvas.parentElement).draggable({
                        scroll: false,
                        stop: function (e) {
                            var fileTemp = $(this).children()[0];
                            fileObj.saveList = fileObj.saveList.map(function (x) {
                                if (x.id == fileTemp.id) {
                                    x.left = ($(fileTemp).offset().left - MainObj.CanvasL) / MainObj.Scale;
                                    x.top = ($(fileTemp).offset().top - MainObj.CanvasT) / MainObj.Scale;
                                }
                                return x;
                            });
                        }
                    });

                    $(fileCanvas.parentElement).click(function (e) {
                        e.preventDefault();
                        window.open(ReceiveList ? ('Note/' + res.fileName) : window.URL.createObjectURL(dataURLtoFile(res.file, res.fileName)));
                    });

                    $('#inputFile').remove();
                };
                // 檔案對應圖示
                switch (res.fileName.split('.').pop().toLowerCase()) {
                    case 'doc':
                    case 'docx':
                        img.src = 'ToolBar/FileType/DocDocx.png';
                        break;
                    case 'jpg':
                    case 'png':
                    case 'gif':
                        img.src = ReceiveList ? ('Note/' + res.fileName) : res.file;
                        break;
                    case 'ppt':
                    case 'pptx':
                        img.src = 'ToolBar/FileType/PptPptx.png';
                        break;
                    default:
                        img.src = 'ToolBar/FileType/' + res.fileName.split('.').pop().toLowerCase() + '.png';
                        break;
                }
            }
        }
    });
}

// 插入超連結
function submitLink() {
    var title = $('.link-title')[0].value;
    var link = $('.link-input')[0].value;
    if (!title || !link) {
        alert('請輸入標題及網址');
        return;
    }

    var btn = document.createElement('div');
    $('#HamastarWrapper').append(btn);
    btn.id = newguid();
    $(btn)[0].innerHTML = title;
    $(btn).addClass('link_btn');
    $(btn).draggable({
        scroll: false,
        stop: function (e) {
            var linkBtn = this;
            hyperLink.saveList = hyperLink.saveList.map(function (x) {
                if (x.id == linkBtn.id) {
                    x.left = ($(linkBtn).offset().left - MainObj.CanvasL) / MainObj.Scale;
                    x.top = ($(linkBtn).offset().top - MainObj.CanvasT) / MainObj.Scale;
                }
                return x;
            });
        }
    });
    $(btn).click(function (e) {
        e.preventDefault();
        window.open(link);
    })

    hyperLink.saveList.push({
        id: btn.id,
        page: MainObj.NowPage,
        type: 'hyperLink',
        title: title,
        src: link,
        left: ($(btn).offset().left - MainObj.CanvasL) / MainObj.Scale,
        top: ($(btn).offset().top - MainObj.CanvasT) / MainObj.Scale
    });

    closeLink();
}

function replyLink() {
    $('.link_btn').remove();
    hyperLink.saveList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            var btn = document.createElement('div');
            $('#HamastarWrapper').append(btn);
            btn.id = res.id;
            $(btn)[0].innerHTML = res.title;
            $(btn).addClass('link_btn');
            $(btn).css({
                left: res.left * MainObj.Scale + MainObj.CanvasL,
                top: res.top * MainObj.Scale + MainObj.CanvasT
            });
            $(btn).draggable({
                scroll: false,
                stop: function (e) {
                    var linkBtn = this;
                    hyperLink.saveList = hyperLink.saveList.map(function (x) {
                        if (x.id == linkBtn.id) {
                            x.left = ($(linkBtn).offset().left - MainObj.CanvasL) / MainObj.Scale;
                            x.top = ($(linkBtn).offset().top - MainObj.CanvasT) / MainObj.Scale;
                        }
                        return x;
                    });
                }
            });
            $(btn).click(function (e) {
                e.preventDefault();
                window.open(res.src);
            })
        }
    });
}

function closeLink() {
    changeAllBtnToFalse(insertToolBar);
    $('.inputLink').css('display', 'none');
    $('.link-title')[0].value = '';
    $('.link-input')[0].value = '';
}

// 四角放大
function zoomCorner(isLeft, isTop) {
    // zoomOut(true);
    $('#dragCanvas').remove();
    GalleryStopMove();
    $(window).off("resize", resizeInit);
    ZoomAttrPosition();
    ToolBarList.ZoomScale = 2;
    var canvas = $('#CanvasLeft')[0];
    var cxt = canvas.getContext('2d');

    canvas.width = MainObj.NewCanvasWidth * 2;
    canvas.height = MainObj.NewCanvasHeight * 2;

    var left = isLeft ? MainObj.CanvasL : -MainObj.NewCanvasWidth + MainObj.CanvasL,
        top = isTop ? MainObj.CanvasT : -MainObj.NewCanvasHeight + MainObj.CanvasT;

    $(canvas).css({
        'left': left,
        'top': top,
        'position': 'absolute'
    })

    var img = MainObj.AllBackground[MainObj.NowPage].img;
    if (img) {
        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    zoomDragCanvas(ToolBarList.ZoomScale);

    var scale = ToolBarList.ZoomScale;

    //物件放大
    if ($('.canvasObj')[0] != undefined) {

        for (var num = 0; num < $('.canvasObj').length; num++) {

            var left = (Number($($('.canvasObj')[num]).attr('left')) - MainObj.CanvasL) * 2 + MainObj.CanvasL;
            var top = (Number($($('.canvasObj')[num]).attr('top')) - MainObj.CanvasT) * 2 + MainObj.CanvasT;
            left = isLeft ? left : -MainObj.NewCanvasWidth + left;
            top = isTop ? top : -MainObj.NewCanvasHeight + top;

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
                            $(canvas).css({
                                'width': $($('.canvasObj')[num]).attr('width') * scale,
                                'height': $($('.canvasObj')[num]).attr('height') * scale,
                                'left': 0,
                                'top': 0
                            })
                        } else {
                            HamaList[MainObj.NowPage].Objects.map(function (res) {
                                if (res.Identifier == Identifier) {

                                    if (res.FormatterType == 'RotationImageObject' || res.FormatterType == 'SlideshowObject' || res.FormatterType == 'ScrollObject' || res.FormatterType == 'HtmlScriptObject') {
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

    //影片縮放
    if ($('.video')[0] != undefined) {
        for (var i = 0; i < $('.video').length; i++) {

            var left = (Number($($('.video')[i]).attr('left')) - MainObj.CanvasL) * 2 + MainObj.CanvasL;
            var top = (Number($($('.video')[i]).attr('top')) - MainObj.CanvasT) * 2 + MainObj.CanvasT;
            left = isLeft ? left : -MainObj.NewCanvasWidth + left;
            top = isTop ? top : -MainObj.NewCanvasHeight + top;

            $($('.video')[i]).css({
                'left': left,
                'top': top
            })

            var width = Number($($('.video')[i]).attr('oldwidth')) * 2;
            var height = Number($($('.video')[i]).attr('oldheight')) * 2;

            $('.video')[i].width = width;
            $('.video')[i].height = height;
        }
    }

    // 連連看的線縮放
    if ($('.canvasConnector')[0] != undefined) {

        for (var num = 0; num < $('.canvasConnector').length; num++) {

            var left = (Number($($('.canvasConnector')[num]).attr('left')) - MainObj.CanvasL) * 2 + MainObj.CanvasL;
            var top = (Number($($('.canvasConnector')[num]).attr('top')) - MainObj.CanvasT) * 2 + MainObj.CanvasT;
            left = isLeft ? left : -MainObj.NewCanvasWidth + left;
            top = isTop ? top : -MainObj.NewCanvasHeight + top;

            $($('.canvasConnector')[num]).css({
                'width': $('.canvasConnector')[num].width * 2,
                'height': $('.canvasConnector')[num].height * 2,
                'left': left,
                'top': top
            })
        }
    }
}

// 文字白板
function setTextboard() {
    CKEDITOR.replace('textboard-input', {
        toolbarGroups: [{
                "name": "basicstyles",
                "groups": ["basicstyles"]
            },
            {
                "name": "colors",
                "groups": ["colors"]
            },
            {
                "name": "styles",
                "groups": ["styles"]
            }
        ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
        contentsCss: ["body {font-size: 20px;}"],
        removePlugins: 'elementspath',
        resize_dir: 'both',
        resize_enabled: false
    });
    $('.textboard-block')
        .draggable({
            scroll: false
        }).resizable({
            minHeight: 400,
            minWidth: 400,
            start: function () {
                $(window).off("resize", resizeInit);
            },
            resize: function () {
                CKEDITOR.instances['textboard-input'].resize($('.textboard-cont').width(), $('.textboard-cont').height());
            },
            stop: function () {
                $(window).resize(resizeInit);
            }
        });
}

function closeTextboard() {
    changeAllBtnToFalse(treasureToolBar);
    $('.textboard-layout').css('display', 'none');
}

// 手寫白板
function setCavnasboard() {
    $('.canvasboard-block')
        .draggable({
            scroll: false,
            cancel: '.canvasboard'
        }).resizable({
            minHeight: 400,
            minWidth: 400,
            start: function () {
                $(window).off("resize", resizeInit);
            },
            resize: function () {
                var canvas = $('.canvasboard')[0];
                canvas.width = $('.canvasboard-cont').width();
                canvas.height = $('.canvasboard-cont').height();
            },
            stop: function () {
                $(window).resize(resizeInit);
                replyCavnasboard();
            }
        });
    var pointList = {};
    $('.canvasboard')
        .on('mousedown', function (e) {
            ToolBarList.canvasboardDrag = true;
            var cxt = this.getContext('2d');
            cxt.strokeStyle = colorPen.Color;
            cxt.lineWidth = colorPen.Width;
            cxt.globalAlpha = colorPen.Opacity;
            cxt.beginPath();
            cxt.moveTo(e.offsetX, e.offsetY);
            pointList = {
                color: colorPen.Color,
                width: colorPen.Width,
                opacity: colorPen.Opacity,
                points: []
            };
            pointList.points.push({
                x: e.offsetX,
                y: e.offsetY
            });
        }).on('mousemove', function (e) {
            if (ToolBarList.canvasboardDrag) {
                var cxt = this.getContext('2d');
                cxt.lineTo(e.offsetX, e.offsetY);
                pointList.points.push({
                    x: e.offsetX,
                    y: e.offsetY
                });
                cxt.stroke();
            }
        }).on('mouseup', function (e) {
            if (!ToolBarList.canvasboardDrag) {
                return;
            }
            canvasboard.saveList.push(pointList);
            pointList = {};
            ToolBarList.canvasboardDrag = false;
            ToolBarList.canvasboardTemp = $('.canvasboard')[0].toDataURL();
        })
}

function replyCavnasboard() {
    var canvas = $('.canvasboard')[0];
    var cxt = canvas.getContext('2d');
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    canvasboard.saveList.map(function (res) {
        if (res) {
            cxt.strokeStyle = res.color;
            cxt.lineWidth = res.width;
            cxt.globalAlpha = res.opacity;
            res.points.map(function (p, index) {
                if (index == 0) {
                    cxt.beginPath();
                    cxt.moveTo(p.x, p.y);
                } else {
                    cxt.lineTo(p.x, p.y);
                    cxt.stroke();
                }
            });
        }
    });
}

function closeCanvasboard() {
    changeAllBtnToFalse(treasureToolBar);
    $('.canvasboard-layout').css('display', 'none');
}

// 新增班級進度
function createClassProgress() {
    classProgressList.push({
        id: newguid(),
        page: MainObj.NowPage,
        time: moment().format('YYYY/MM/DD HH:mm:ss'),
        name: '新增班級'
    });
    $('.class-tr').remove();
    classProgressList.map(function (res, index) {
        var tr = document.createElement('tr');
        $('.class-table').append(tr);
        $(tr).addClass('class-tr');
        $(tr).addClass('class-tr-' + index);
        var timeTd = document.createElement('td');
        $(timeTd).addClass('time');
        $(tr).append(timeTd);
        $(timeTd).text(res.time);
        var classTd = document.createElement('td');
        $(tr).append(classTd);
        var inputName = document.createElement('input');
        $(classTd).append(inputName);
        $(inputName)
            .val(res.name || '新增班級')
            .on('keyup', function (e) {
                classProgressList = classProgressList.map(function (x) {
                    if (res.id === x.id) {
                        x.name = e.target.value;
                    }
                    return x;
                });
                saveClassProgress(classProgressList);
            });
        createButton('儲存', classTd, res, function (item) {
            classProgressList = classProgressList.map(function (x, i) {
                if (item.id === x.id) {
                    item.time = moment().format('YYYY/MM/DD HH:mm:ss');
                    $('.class-tr.class-tr-' + i + '>.time').text(item.time);
                    item.page = MainObj.NowPage;
                }
                return x;
            });
            saveClassProgress(classProgressList);
        });
        createButton('刪除', classTd, res, function (item) {
            classProgressList = classProgressList.filter(function (x) {
                if (item.id !== x.id) {
                    return x;
                }
            });
            $('.class-tr.class-tr-' + index).remove();
            saveClassProgress(classProgressList);
        });
        createButton('前往', classTd, res, function (item) {
            gotoPage(item.page);
        });
    });
    saveClassProgress(classProgressList);
}

// 加入班級進度的按鈕
function createButton(name, ele, classItem, callback) {
    var btn = document.createElement('button');
    $(ele).append(btn);
    $(btn)
        .text(name)
        .addClass('selector_btn')
        .click(function () {
            callback(classItem);
        });
}

function closeClassProgress() {
    changeAllBtnToFalse();
    $('.class-layout').css('display', 'none');
}

// 註記移動版面設置
function setNoteMove() {
    for (var i = 0; i < Base64ImageList.length - 1; i++) {
        var div = document.createElement('div');
        div.id = 'noteMove-' + i;
        $(div).addClass('noteMove-block');
        $('.noteMove-conts').append(div);

        var label = document.createElement('label');
        $(div).append(label);
        $(label).text(i + 1);

        var img = document.createElement('img');
        img.src = 'data:image/png;base64,' + Base64ImageList[i].Value;
        $(div).append(img);
    }
}

// 註記移動事件綁定
function noteMoveEvent(index) {
    $('#noteMove-' + index).css('cursor', 'move');
    $('#noteMove-' + index).draggable({
        revert: function (dropped) {
            return !dropped;
        },
        cursorAt: {
            top: -12,
            left: -20
        },
        helper: function (event) {
            return $("<img src=\"ToolBar/noteicon.png\">");
        }
    });
    $('.noteMove-block').droppable({
        classes: {
            "ui-droppable-hover": "noteMove-hover"
        },
        drop: function (event, ui) {
            if ($(this).find($('.noteTag')).length) {
                return;
            }

            var that = this;
            confirmShow('是否確定移動註記', function (res) {
                if (res) {
                    var pageFrom = Number($(ui.draggable)[0].id.split('noteMove-').pop()),
                        pageTo = Number($(that)[0].id.split('noteMove-').pop()),
                        from = ui.draggable,
                        to = $(that);

                    // 文字便利貼
                    txtNote.SaveList.map(function (res) {
                        if (res.page == pageFrom) {
                            res.page = pageTo;
                        }
                    });

                    // 畫筆
                    colorPen.LineList.map(function (res) {
                        if (res.page == pageFrom) {
                            res.page = pageTo;
                        }
                    })

                    // 註解
                    comment.saveList.map(function (res) {
                        if (res.page == pageFrom) {
                            res.page = pageTo;
                        }
                    })

                    $(to).append($(from).find($('.noteTag')));

                    if (Number($(from)[0].id.split('noteMove-').pop()) == MainObj.NowPage) {
                        $('.NoteBox').remove();
                        $('.pen').remove();
                        $('.commentNote').remove();
                    }
                }
            });
        }
    });
}