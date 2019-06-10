var syncPage = 0,
    fullScreen = false;
var isIRS = false;
var isUndo = 0;

var tempToolBars = [
    //左選單內容設定
    {
        'toolBarId': 'toolLeftBar', //左選單id
        'toggle': true,
        'show': true,
        //左選單內的按鈕們
        'btns': [{
            //書架
            "id": "back",
            "beforespanTextName": "書架",
            "afterspanTextName": "書架",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnBack.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnBack.png)'
            },
            action: function () {
                CallExToExit();
            }
        }, {
            // 班級進度
            "id": "classProgress",
            "beforespanTextName": "班級進度",
            "afterspanTextName": "班級進度",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/classProgressbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/classProgressafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ReceiveList) {
                    CommandToWPF('RequestClassSchedule');
                } else {
                    $('.class-layout').toggle();
                    $('.class-tr').remove();
                    for (var index = 0; index < classProgressList.length; index++) {
                        var res = classProgressList[index];
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
                    }
                }
            }
        }, {
            // 頁面總覽
            "id": "jump",
            "beforespanTextName": "頁面總覽",
            "afterspanTextName": "頁面總覽",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnJumpBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnJumpAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;

                checkBtnChange(this);
                JumpTableShow(this);
                JumpIconShow(this);
                $('.note-layout').css('display', 'none');
            }
        }, {
            // 輸入頁數
            "id": "inputPage",
            "beforespanTextName": "輸入頁數",
            "afterspanTextName": "輸入頁數",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnTabBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnTabAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.note-layout').css('display', 'none');
                $('.page-layout').toggle();
            }
        }, {
            //上頁 
            "id": "prevPage",
            "beforespanTextName": "上頁",
            "afterspanTextName": "上頁",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnPrevPage.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnPrevPage.png)'
            },
            action: function () {
                // changeAllBtnToFalse();
                if (!MainObj.IsTwoPage) {
                    gotoPage(MainObj.NowPage - 1, true, false);
                } else {
                    gotoPage(MainObj.NowPage - 2, true, false);
                }

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('prpg' + syncPage);
                rmcall(message);
            }
        }, {
            //下頁
            "id": "nextPage",
            "beforespanTextName": "下頁",
            "afterspanTextName": "下頁",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnNextPage.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnNextPage.png)'
            },
            action: function () {
                // changeAllBtnToFalse();
                if (!MainObj.IsTwoPage) {
                    gotoPage(MainObj.NowPage + 1, true, true);
                } else {
                    gotoPage(MainObj.NowPage + 2, true, true);
                }

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('nxpg' + syncPage);
                rmcall(message);
            }
        }, {
            // 插入
            "id": "insert",
            "beforespanTextName": "插入",
            "afterspanTextName": "插入",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnInsertBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnInsertAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (this.afterClick) {
                    toggleToolBar(insertToolBar);
                    $('.note-layout').css('display', 'block');
                } else {
                    $('.note-layout').css('display', 'none');
                }
            }
        }, {
            // 頁面縮放
            "id": "navigator",
            "beforespanTextName": "頁面縮放",
            "afterspanTextName": "頁面縮放",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/navigatorbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/navigatorafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (this.afterClick) {
                    toggleToolBar(navigatorToolBar);
                    $('.note-layout').css('display', 'block');
                } else {
                    $('.note-layout').css('display', 'none');
                }
            }
        }, {
            // 全文檢索
            "id": "textSearch",
            "beforespanTextName": "全文檢索",
            "afterspanTextName": "全文檢索",
            "afterClick": false,
            "type": "textSearch",
            "beforeStyle": {
                'background-image': 'url(ToolBar/SearchNo.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnSearchAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(treasureToolBar);
                }

                if (TextlocationList == '')
                    return;

                if (!$('#dialogSearchText').dialog('isOpen')) {
                    $('#dialogSearchText').dialog('open')
                } else {
                    $('#dialogSearchText').dialog('close')
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                // toolbarBtnChange(this.id);
            }
        }, {
            // 工具百寶箱
            "id": "treasure",
            "beforespanTextName": "工具百寶箱",
            "afterspanTextName": "工具百寶箱",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/treasurebefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/treasureafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (this.afterClick) {
                    toggleToolBar(treasureToolBar);
                    $('.note-layout').css('display', 'block');
                } else {
                    $('.note-layout').css('display', 'none');
                }
            }
        }, {
            // 操作說明
            "id": "instructions",
            "beforespanTextName": "操作說明",
            "afterspanTextName": "操作說明",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/instructions_before.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/instructions_after.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                // if (this.afterClick) {
                //     toggleToolBar(treasureToolBar);
                //     $('.note-layout').css('display', 'block');
                // } else {
                //     $('.note-layout').css('display', 'none');
                // }
            }
        }, {
            // 備課存取
            "id": "editor",
            "beforespanTextName": "備課存取",
            "afterspanTextName": "備課存取",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/editorbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/editorafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (this.afterClick) {
                    toggleToolBar(editorToolBar);
                    $('.note-layout').css('display', 'block');
                } else {
                    $('.note-layout').css('display', 'none');
                }
            }
        }, {
            //復原
            "id": "recovery",
            "beforespanTextName": "復原",
            "afterspanTextName": "復原",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/recoverybefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/recoveryafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                if (!MainObj.saveList.length) return;
                var temp = MainObj.saveList[MainObj.saveList.length - 1];
                MainObj.trashList.push(temp);
                MainObj.saveList.splice(MainObj.saveList.length - 1, 1);

                switch (temp.type) {
                    case 'pen':
                        $('#' + temp.id).remove();
                        break;
                    case 'comment':
                        removeComment(temp.id);
                        break;
                    case 'txtNote':
                        isUndo = 2;
                        if (temp.action == 'add') {
                            $('#' + temp.id).remove();
                        } else if (temp.action == 'edit') {
                            for (var i = MainObj.saveList.length - 1; i >= 0; i--) {
                                if (MainObj.saveList[i].id == temp.id) {
                                    CKEDITOR.instances['textArea' + temp.id].setData(MainObj.saveList[i].value);
                                    break;
                                }
                            }
                        }
                        break;
                }
            }
        }, {
            //取消復原
            "id": "notrecovery",
            "beforespanTextName": "取消復原",
            "afterspanTextName": "取消復原",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/notrecoverybefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/notrecoveryafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                if (!MainObj.trashList.length) return;
                var temp = MainObj.trashList[MainObj.trashList.length - 1];
                MainObj.saveList.push(temp);
                MainObj.trashList.splice(MainObj.trashList.length - 1, 1);

                switch (temp.type) {
                    case 'pen':
                        reDoPen(temp);
                        break;
                    case 'comment':
                        reDrawComment(temp);
                        break;
                    case 'txtNote':
                        isUndo = 2;
                        if (temp.action == 'add') {
                            reSetNote(temp);
                        } else if (temp.action == 'edit') {
                            // for (var i = MainObj.trashList.length - 1; i >= 0; i--) {
                            //     if (MainObj.trashList[i].id == temp.id) {
                            CKEDITOR.instances['textArea' + temp.id].setData(temp.value);
                            //         break;
                            //     }
                            // }
                        }
                        break;
                }

            }
        }, {
            // 便利貼
            "id": 'txtnote',
            "beforespanTextName": "便利貼",
            "afterspanTextName": "便利貼",
            "beforeStyle": {
                'background-image': 'url(ToolBar/textnotebefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/textnoteafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(insertToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'txtNote') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'txtNote'
                }

            },
            "afterClick": false,
            "type": "txtNote"
        }, {
            // 手寫便利貼 
            "id": "txtcanvasID",
            "beforespanTextName": "手寫便利貼",
            "afterspanTextName": "手寫便利貼",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnNoteBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnNoteAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(insertToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'txtCanvas') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'txtCanvas'
                }
            },
            "afterClick": false,
            "type": "txtCanvas"
        }, {
            // 插入檔案
            "id": "insertFile",
            "beforespanTextName": "插入檔案",
            "afterspanTextName": "插入檔案",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/filebefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/fileafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(insertToolBar);
                }
                this.afterClick = !this.afterClick;

                if (ReceiveList) {
                    CommandToWPF('OpenFile');
                } else {
                    $('#fileinput').click();
                }
            }
        }, {
            // 插入超連結
            "id": "insertLink",
            "beforespanTextName": "插入超連結",
            "afterspanTextName": "插入超連結",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/linkbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/linkafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(insertToolBar);
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.inputLink').toggle();
            }
        }, {
            // 享備課
            "id": "teachLibrary",
            "beforespanTextName": "享備課",
            "afterspanTextName": "享備課",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/teachLibrarybefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/teachLibraryafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(insertToolBar);
                }
                this.afterClick = !this.afterClick;
            }
        }, {
            //畫筆
            "id": "colorPen",
            "beforespanTextName": "畫筆",
            "afterspanTextName": "畫筆",
            "afterClick": false,
            "type": "pen",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnPenBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnPenAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'pen') {
                    GalleryStartMove();
                    ToolBarList.AddWidgetState = 'none';
                    $('#canvasPad').remove();
                } else {
                    ToolBarList.AddWidgetState = 'pen';

                    GalleryStopMove();
                    NewCanvas();
                    var canvasPad = $('#canvas')[0];
                    canvasPad.id = 'canvasPad';
                    $(canvasPad).attr('class', 'canvasPad');
                    canvasPad.width = $(window).width();
                    canvasPad.height = $(window).height();
                    var cxt = canvasPad.getContext('2d');
                    cxt.strokeStyle = colorPen.Color;
                    cxt.lineWidth = colorPen.Width;
                    cxt.globalAlpha = colorPen.Opacity;

                    $(canvasPad).on('mousedown touchstart', function (e) {
                        StartPen(e, canvasPad);
                    });
                    $(canvasPad).on('mousemove touchmove', function (e) {
                        canvasPadMove(e, canvasPad);
                    });
                    $(canvasPad).on('mouseup touchend', function () {
                        canvasPadUp(canvasPad);
                    });

                    Hammer(canvasPad).on('doubletap', function (e) {
                        GalleryStartMove();
                        ToolBarList.AddWidgetState = 'none';
                        $('#canvasPad').remove();
                        changeAllBtnToFalse();
                        colorPen.Drag = false;
                    });
                }
            }
        }, {
            //調色盤
            "id": "ColorsPicker",
            "beforespanTextName": "調色盤",
            "afterspanTextName": "調色盤",
            "afterClick": false,
            "type": "colorPicker",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnPaletteBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnPaletteAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'ColorsPicker') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'ColorsPicker'
                }

                $('#colorPicker').dialog('open');
                changeSharp(colorPen.BrushType);
            }
        }, {
            //橡皮擦
            "id": "eraser",
            "beforespanTextName": "橡皮擦",
            "afterspanTextName": "橡皮擦",
            "afterClick": false,
            "type": "eraser",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnEraserBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnEraserAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'eraser') {
                    GalleryStartMove();
                    ToolBarList.AddWidgetState = 'none';
                    $('#canvasEraser').remove();
                } else {
                    ToolBarList.AddWidgetState = 'eraser';

                    GalleryStopMove();
                    NewCanvas();
                    var canvasEraser = $('#canvas')[0];
                    canvasEraser.id = 'canvasEraser';
                    $(canvasEraser).attr('class', 'canvasEraser');
                    canvasEraser.width = $(window).width();
                    canvasEraser.height = $(window).height();
                    $(canvasEraser).css('z-index', '1000');

                    $(canvasEraser).on('mousedown', function (e) {
                        StartEraser(e);
                    });
                    $(canvasEraser).on('mousemove', function (e) {
                        EraserMove(e, canvasEraser);
                    });
                    $(canvasEraser).on('mouseup', function (e) {
                        EraserUp(e, canvasEraser);
                    });

                    $(canvasEraser).on('touchstart', function (e) {
                        StartEraser(e);
                    });
                    $(canvasEraser).on('touchmove', function (e) {
                        EraserMove(e, canvasEraser);
                    });
                    $(canvasEraser).on('touchend', function (e) {
                        EraserUp(e, canvasEraser);
                    });
                }
            }
        }, {
            //註解
            "id": "comment",
            "beforespanTextName": "註解",
            "afterspanTextName": "註解",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/commentbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/commentafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(insertToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'comment') {
                    GalleryStartMove();
                    ToolBarList.AddWidgetState = 'none';
                    $('#canvasPad').remove();
                } else {
                    ToolBarList.AddWidgetState = 'comment';

                    GalleryStopMove();
                    NewCanvas();
                    var canvasPad = $('#canvas')[0];
                    canvasPad.id = 'canvasPad';
                    $(canvasPad).attr('class', 'canvasPad');
                    canvasPad.width = $(window).width();
                    canvasPad.height = $(window).height();
                    var cxt = canvasPad.getContext('2d');
                    cxt.strokeStyle = '#000000';
                    cxt.lineWidth = 3;

                    $(canvasPad).on('mousedown', function (e) {
                        startComment(e);
                    });
                    $(canvasPad).on('mousemove', function (e) {
                        moveComment(e, canvasPad);
                    });
                    $(canvasPad).on('mouseup', function () {
                        upComment(canvasPad);
                    });

                    $(canvasPad).on('touchstart', function (e) {
                        startComment(e);
                    });
                    $(canvasPad).on('touchmove', function (e) {
                        moveComment(e, canvasPad);
                    });
                    $(canvasPad).on('touchend', function () {
                        upComment(canvasPad);
                    });
                }

            }
        }, {
            //放大/100%
            "id": "zoomIn",
            "beforespanTextName": "放大",
            "afterspanTextName": "放大",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnZoomInBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnZoomInAfter.png)'
            },
            "afterClick": false,
            action: function () {
                changeAllBtnToFalse();

                if (ToolBarList.ZoomScale == 3) {
                    this.afterClick = true;
                    // checkBtnChange(this);
                    return;
                }

                zoomIn();
                NewOffset();
            }
        }, {
            //縮小
            "id": "zoomOut",
            "beforespanTextName": "縮小",
            "afterspanTextName": "縮小",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnZoomOutBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnZoomOutAfter.png)'
            },
            "afterClick": false,
            action: function () {
                changeAllBtnToFalse();

                if (ToolBarList.ZoomScale == 1) {
                    this.afterClick = true;
                    checkBtnChange(this);
                    return;
                }

                zoomOut();
                NewOffset();
            }
        }, {
            // 放大左上
            "id": "zoomLeftTop",
            "beforespanTextName": "放大左上",
            "afterspanTextName": "放大左上",
            "beforeStyle": {
                'background-image': 'url(ToolBar/zoomLeftTopbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/zoomLeftTopafter.png)'
            },
            "afterClick": false,
            action: function () {
                if (this.afterClick) return;
                changeAllBtnToFalse(navigatorToolBar);

                this.afterClick = true;
                checkBtnChange(this);
                zoomCorner(true, true);
            }
        }, {
            // 放大左下
            "id": "zoomLeftBottom",
            "beforespanTextName": "放大左下",
            "afterspanTextName": "放大左下",
            "beforeStyle": {
                'background-image': 'url(ToolBar/zoomLeftBottombefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/zoomLeftBottomafter.png)'
            },
            "afterClick": false,
            action: function () {
                if (this.afterClick) return;
                changeAllBtnToFalse(navigatorToolBar);

                this.afterClick = true;
                checkBtnChange(this);
                zoomCorner(true, false);
            }
        }, {
            // 放大右上
            "id": "zoomRightTop",
            "beforespanTextName": "放大右上",
            "afterspanTextName": "放大右上",
            "beforeStyle": {
                'background-image': 'url(ToolBar/zoomRightTopbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/zoomRightTopafter.png)'
            },
            "afterClick": false,
            action: function () {
                if (this.afterClick) return;
                changeAllBtnToFalse(navigatorToolBar);

                this.afterClick = true;
                checkBtnChange(this);
                zoomCorner(false, true);
            }
        }, {
            // 放大右下
            "id": "zoomRightBottom",
            "beforespanTextName": "放大右下",
            "afterspanTextName": "放大右下",
            "beforeStyle": {
                'background-image': 'url(ToolBar/zoomRightBottombefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/zoomRightBottomafter.png)'
            },
            "afterClick": false,
            action: function () {
                if (this.afterClick) return;
                changeAllBtnToFalse(navigatorToolBar);

                this.afterClick = true;
                checkBtnChange(this);
                zoomCorner(false, false);
            }
        }, {
            // 整頁顯示
            "id": "zoom100",
            "beforespanTextName": "整頁顯示",
            "afterspanTextName": "整頁顯示",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnSearchBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnSearchBefore.png)'
            },
            action: function () {
                changeAllBtnToFalse();
                zoomOut(true);
            }
        }, {
            // 掌型
            "id": "palm",
            "beforespanTextName": "掌型",
            "afterspanTextName": "掌型",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/arrow.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/palmbefore.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(navigatorToolBar);
                }
                this.afterClick = !this.afterClick;
                checkBtnChange(this);
                if (ToolBarList.ZoomScale > 1) {
                    MainObj.dragCanvasPosition.left = $('.dragCanvas').offset().left;
                    MainObj.dragCanvasPosition.top = $('.dragCanvas').offset().top;
                    $('.dragCanvas').toggle();
                }
            }
        }, {
            //數位黑板
            "id": "blackboard",
            "beforespanTextName": "數位黑板",
            "afterspanTextName": "數位黑板",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/blackboardbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/blackboardafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(treasureToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (this.afterClick) {
                    $('#HamastarWrapper').addClass('blackboard-invert');
                } else {
                    $('#HamastarWrapper').removeClass('blackboard-invert');
                }
            }
        }, {
            //計時器
            "id": "noteTimer",
            "beforespanTextName": "計時器",
            "afterspanTextName": "計時器",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/noteTimerbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/noteTimerafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(treasureToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.timer_layout').toggle();
                resetTimer();

            }
        }, {
            //選號器
            "id": "selector",
            "beforespanTextName": "選號器",
            "afterspanTextName": "選號器",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/selectorbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/selectorafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(treasureToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                resetSelector();
                if (this.afterClick) {
                    $('.selector_layout').css('display', 'block');
                } else {
                    $('.selector_layout').css('display', 'none');
                }
            }
        }, {
            // 文字白板
            "id": "textWhiteboard",
            "beforespanTextName": "文字白板",
            "afterspanTextName": "文字白板",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/textWhiteboardbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/textWhiteboardafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(treasureToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.textboard-layout').toggle();
                CKEDITOR.instances['textboard-input'].resize($('.textboard-cont').width(), $('.textboard-cont').height());
            }
        }, {
            // 手寫白板
            "id": "canvasWhiteboard",
            "beforespanTextName": "手寫白板",
            "afterspanTextName": "手寫白板",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/canvasWhiteboardbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/canvasWhiteboardafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(treasureToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.canvasboard-layout').toggle();
            }
        }, {
            // 儲存本機
            "id": "save",
            "beforespanTextName": "儲存本機",
            "afterspanTextName": "儲存本機",
            "afterClick": false,
            "type": "save",
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnSaveBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnSaveAfter.png)'
            },
            action: function () {
                var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                if (indexedDB == undefined) {
                    // alert('此瀏覽器不支援本機註記儲存');
                    window.external.saveNoteXML(toSyncXML(true));
                } else {
                    SaveAll();
                    resetUndo();
                }
                BookAlertShow('儲存成功！');
            }
        }, {
            //清除全部
            "id": "clearAll",
            "beforespanTextName": "清除全部",
            "afterspanTextName": "清除全部",
            "afterClick": false,
            "type": "colorPicker",
            "beforeStyle": {
                'background-image': 'url(ToolBar/clearAllbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/clearAllafter.png)'
            },
            action: function () {
                changeAllBtnToFalse(editorToolBar);

                confirmShow('是否確定刪除全部物件', function (res) {
                    if (res) {
                        clearAllNote();
                    }
                })
            }
        }, {
            // 上傳編修檔
            "id": "uploadEdit",
            "beforespanTextName": "上傳編修檔",
            "afterspanTextName": "上傳編修檔",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/uploadEditbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/uploadEditafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(editorToolBar);
                }

                this.afterClick = !this.afterClick;
                // uploadNoteLoad();

                $('.editor-layout').css('display', 'block');
                $('.editor-input')[0].value = moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + BookList.EBookName;

                $('.editor_submit').click(function () {
                    // uploadNoteFile(data.docs[0].id);
                    CommandToWPF('UploadNoteData', JSON.stringify({
                        name: $('.editor-input')[0].value,
                        note: toSyncXML(true)
                    }));
                    $('.editor-layout').css('display', 'none');
                });
            }
        }, {
            // 下載編修檔
            "id": "downloadEdit",
            "beforespanTextName": "下載編修檔",
            "afterspanTextName": "下載編修檔",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/downloadEditbefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/downloadEditafter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(editorToolBar);
                }

                this.afterClick = !this.afterClick;

                // loadPicker();
                CommandToWPF('DownloadNoteData');
            }
        }, {
            // 註記移動
            "id": "noteMove",
            "beforespanTextName": "註記移動",
            "afterspanTextName": "註記移動",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/noteMoveBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/noteMoveAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse(editorToolBar);
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.noteMove-layout').toggle();
                if (this.afterClick) {
                    for (var i = 0; i < Base64ImageList.length - 1; i++) {
                        var Widget = false;
                        if (txtCanvas.SaveList.length > 0) {
                            for (var x = 0; x < txtCanvas.SaveList.length; x++) {
                                // console.log(txtCanvas.SaveList[i]);
                                if (txtCanvas.SaveList[x] != undefined) {
                                    if (txtCanvas.SaveList[x].page == i) {
                                        Widget = true;
                                    }
                                }
                            }
                        }

                        if (txtNote.SaveList.length > 0) {
                            for (var y = 0; y < txtNote.SaveList.length; y++) {
                                // console.log(txtCanvas.SaveList[i]);
                                if (txtNote.SaveList[y] != undefined) {
                                    if (txtNote.SaveList[y].page == i) {
                                        Widget = true;
                                    }
                                }
                            }
                        }

                        colorPen.LineList.map(function (res) {
                            if (res.page == i) {
                                Widget = true;
                            }
                        });

                        comment.saveList.map(function (res) {
                            if (res.page == i) {
                                Widget = true;
                            }
                        });

                        if (Widget) {
                            var noteImg = new Image();
                            $('#noteMove-' + i).append(noteImg);
                            $(noteImg).addClass('noteTag');
                            noteImg.src = 'ToolBar/noteicon.png';
                            $(noteImg).css({
                                'top': '1em',
                                'right': 0,
                                'position': 'absolute'
                            })

                            noteMoveEvent(i);
                        }
                    }
                } else {
                    $('.noteTag').remove();
                }

            }
        }, {
            //全螢幕
            "id": "fullscreen",
            "beforespanTextName": "全螢幕",
            "afterspanTextName": "全螢幕",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/fullscreen_open.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/fullscreen_close.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                var elem = $('body')[0];

                var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

                if (!isFullScreen) { // 目前非全螢幕狀態 開啟全螢幕
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    }
                    fullScreen = true;
                } else { // 目前為全螢幕狀態 關閉全螢幕
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                    fullScreen = false;
                }
            }
        }, {
            // 頁籤
            "id": "tab",
            "beforespanTextName": "頁籤",
            "afterspanTextName": "頁籤",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnTabBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnTabAfter.png)'
            },
            action: function () {

                tapLayer();

            }
        }, {
            //封面
            "id": "coverPage",
            "beforespanTextName": "封面",
            "afterspanTextName": "封面",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnCoverPage.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnCoverPage.png)'
            },
            action: function () {
                changeAllBtnToFalse();
                gotoPage(0);

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('goto' + syncPage);
                rmcall(message);
            }
        }, {
            //封底
            "id": "backCoverPage",
            "beforespanTextName": "封底",
            "afterspanTextName": "封底",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnBackCoverPage.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnBackCoverPage.png)'
            },
            action: function () {
                changeAllBtnToFalse();
                gotoPage(HamaList.length - 1);

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('goto' + syncPage);
                rmcall(message);
            }
        }, {
            //分享
            "id": "share",
            "beforespanTextName": "分享",
            "afterspanTextName": "分享",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnShareBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnShareAfter.png)'
            },
            action: function () {

                //影片截圖，先將影片做成canvas再截圖
                if ($('.video')[0] != undefined) {
                    NewCanvas();
                    var videoCanvas = $('#canvas')[0];
                    videoCanvas.width = $('.video')[0].width;
                    videoCanvas.height = $('.video')[0].height;
                    $(videoCanvas).css({
                        'left': $('.video')[0].offsetLeft,
                        'top': $('.video')[0].offsetTop
                    })
                    $('.video')[0].pause();
                    var videoCxt = videoCanvas.getContext('2d');
                    resizeCanvas(videoCanvas, videoCxt);
                    videoCxt.drawImage($('.video')[0], 0, 0, videoCanvas.width, videoCanvas.height);
                }

                html2canvas($('#HamastarWrapper'), {
                    allowTaint: true,
                    taintTest: false,
                    onrendered: function (canvas) {

                        canvas.id = "mycanvas";
                        var newImg = document.createElement("img");
                        $(newImg).attr({
                            'class': 'shareImg',
                            'width': '100%'
                        });

                        newImg.src = canvas.toDataURL();
                        $('#imgList').append(newImg);
                        $('#imgList').click(function (e) {
                            e.preventDefault();
                            choiceImg(this);
                        })

                        alert('請確定開啟封鎖彈跳視窗選項!!，否則facebook分享功能可能會無法正確執行。');

                        $(videoCanvas).remove();

                        $('#EditDiv').toggle();

                        //載具上執行才會有LINE選項
                        if (!(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) || (/(Android)/i.test(navigator.userAgent))) {
                            $('#lineBtn').css('display', 'none');
                        }
                    }
                });

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

            }
        }, {
            //搜外網
            "id": "searchWeb",
            "beforespanTextName": "搜外網",
            "afterspanTextName": "搜外網",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnShareBefore.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnShareAfter.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.searchweb_div').css('display', 'flex');
            }
        }, {
            //交作業
            "id": "email",
            "beforespanTextName": "交作業",
            "afterspanTextName": "交作業",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/mailclose.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/mailopen.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.classhub_email_div').css('display', 'flex');
            }
        }, {
            //註記下載
            "id": "switch",
            "beforespanTextName": "註記下載",
            "afterspanTextName": "註記下載",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/change1.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/change1.png)'
            },
            action: function () {
                changeAllBtnToFalse();

                getNotesList();
            }
        }, {
            //上傳(筆記)
            "id": "upload",
            "beforespanTextName": "註記上傳",
            "afterspanTextName": "註記上傳",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/Upload.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/Upload.png)'
            },
            action: function () {
                changeAllBtnToFalse();

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

                var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote?token=' + token[0][1];
                $.ajax({
                    type: "POST",
                    contentType: "text/xml",
                    url: url,
                    async: false,
                    data: toSyncXML(true),
                    dataType: "json",
                    //成功接收的function
                    success: function (oXml, xhr) {
                        BookAlertShow('註記上傳成功！');
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log("=====Error=====");
                    }
                });
            }
        }, {
            //首頁
            "id": "home",
            "beforespanTextName": "首頁",
            "afterspanTextName": "首頁",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/btnBack.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/btnBack.png)'
            },
            action: function () {

                location.href = 'http://cirn.hamastar.com.tw/Guildline/index.aspx?sid=18';

            }
        }, {
            //IRS
            "id": "IRS",
            "beforespanTextName": "IRS",
            "afterspanTextName": "IRS",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/appirsQ1.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/appirsQ2.png)'
            },
            action: function () {
                if (ReceiveList.UserRole == 2) {

                    if (!this.afterClick) {
                        changeAllBtnToFalse();
                    }

                    isIRS = true;
                    this.afterClick = !this.afterClick;
                    checkBtnChange(this);

                    $('#IRS_Div').toggle();
                    $('#App_Notes').css('display', 'none');
                    $('#App_Discuss').css('display', 'none');
                    $('#discussCanvas').remove();

                    GalleryStartMove();
                } else {
                    CheckHasAnswer();
                }
            }
        }, {
            //測驗結果
            "id": 'examResult',
            "beforespanTextName": "測驗結果",
            "afterspanTextName": "測驗結果",
            "beforeStyle": {
                'background-image': 'url(ToolBar/appresult.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/appresult.png)'
            },
            "afterClick": false,
            action: function () {

                CommandToWPF('ShowExamResult');

            }
        }, {
            //筆記
            "id": "notes",
            "beforespanTextName": "筆記",
            "afterspanTextName": "筆記",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/appnotes1.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/appnotes2.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('#App_Notes').toggle();
                $('#IRS_Div').css('display', 'none');
                $('#App_Discuss').css('display', 'none');
                $('#discussCanvas').remove();

                GalleryStartMove();
            }
        }, {
            //問題便籤
            "id": "QA",
            "beforespanTextName": "問題便籤",
            "afterspanTextName": "問題便籤",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/appQ&A.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/appQ&A.png)'
            },
            action: function () {

                CommandToWPF('OpenIssuseNote');

            }
        }, {
            //網頁瀏覽
            "id": "web",
            "beforespanTextName": "網頁瀏覽",
            "afterspanTextName": "網頁瀏覽",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/appweb.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/appweb.png)'
            },
            action: function () {

                CommandToWPF('OpenWebBrowser');

            }
        }, {
            //分組討論
            "id": "discuss",
            "beforespanTextName": "分組討論",
            "afterspanTextName": "分組討論",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/appdiscuss1.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/appdiscuss2.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (!$('#discussCanvas')[0]) {
                    startDiscussion();
                } else {
                    isIRS = false;
                    $('#discussCanvas').remove();
                    GalleryStartMove();
                    IRSinit();
                    changeAllBtnToFalse();
                }

                $('#App_Discuss').toggle();
                $('#App_Notes').css('display', 'none');
                $('#IRS_Div').css('display', 'none');
            }
        }, {
            //同步
            "id": "sync",
            "beforespanTextName": "同步",
            "afterspanTextName": "同步",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/SyncButton.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/SyncButton.png)'
            },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                if (bookSyncInfo.UserState == undefined || bookSyncInfo.UserState == 0) {

                    var message = '[scmd]' + Base64.encode('sybt' + syncPage);
                    rmcall(message);
                } else {

                    var message = '[scmd]' + Base64.encode('nosy' + syncPage);
                    rmcall(message);

                }


            }
        }, {
            //開始測驗
            "id": "quizAction",
            "beforespanTextName": "開始測驗",
            "afterspanTextName": "開始測驗",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/quizAction.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/quizAction.png)'
            },
            action: function () {

                quizBtnToggle();

                quizAction();

            }
        }, {
            //送出試卷
            "id": "quizUpload",
            "beforespanTextName": "送出試卷",
            "afterspanTextName": "送出試卷",
            "afterClick": false,
            "beforeStyle": {
                'background-image': 'url(ToolBar/quizUpload.png)'
            },
            "afterStyle": {
                'background-image': 'url(ToolBar/quizUpload.png)'
            },
            action: function () {

                quizBtnToggle();

                OldQuizUpload();

            }
        }]
    }
];