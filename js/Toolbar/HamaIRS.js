



var NoteBars = [
    //APP註記功能內容設定
    {
        'toolBarId': 'NoteBar', //左選單id
        'toggle': true,
        'show': true,
        //IRS選單內的按鈕們
        'btns': [{
            //畫筆
            "id": "IRSPen",
            "beforespanTextName": "畫筆",
            "afterspanTextName": "畫筆",
            "afterClick": false,
            "type": "IRSPen",
            "beforeStyle": { 'background-image': 'url(IRS/pen1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/pen2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'IRSpen') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'IRSpen';
                }
            }
        }, {
            //調色盤
            "id": "IRSPicker",
            "beforespanTextName": "調色盤",
            "afterspanTextName": "調色盤",
            "afterClick": false,
            "type": "colorPicker",
            "beforeStyle": { 'background-image': 'url(IRS/color1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/color2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'IRSPicker') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'IRSPicker';
                }

                $('#colorPicker').dialog('open');
            }
        }, {
            //便利貼 
            "id": "IRStxtcanvas",
            "beforespanTextName": "便利貼",
            "afterspanTextName": "便利貼",
            "beforeStyle": { 'background-image': 'url(IRS/paste1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/paste2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'IRStxtcanvas') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'IRStxtcanvas';
                }
            },
            "afterClick": false,
            "type": "IRStxtcanvas"
        }, {
            //文字
            "id": 'IRStxtnote',
            "beforespanTextName": "文字",
            "afterspanTextName": "文字",
            "beforeStyle": { 'background-image': 'url(IRS/btnTextbox1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/btnTextbox2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'IRStxtnote') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'IRStxtnote';
                }

            },
            "afterClick": false,
            "type": "IRStxtnote"
        }, {
            //刪除
            "id": "IRSeraser",
            "beforespanTextName": "刪除",
            "afterspanTextName": "刪除",
            "afterClick": false,
            "type": "IRSeraser",
            "beforeStyle": { 'background-image': 'url(IRS/eraser1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/eraser2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'IRSeraser') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'IRSeraser';
                }
            }
        }, {
            //插入圖片
            "id": "IRSinsert",
            "beforespanTextName": "插入圖片",
            "afterspanTextName": "插入圖片",
            "afterClick": false,
            "type": "IRSinsert",
            "beforeStyle": { 'background-image': 'url(IRS/btnPic1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/btnPic2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                insertClick();            

            }
        }, {
            //老師才有
            //白板
            "id": "IRSwhiteboard",
            "beforespanTextName": "白板",
            "afterspanTextName": "白板",
            "afterClick": false,
            "type": "whiteboard",
            "beforeStyle": { 'background-image': 'url(IRS/btnDrawingBoard1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/btnDrawingBoard2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('#whiteboard').remove();

                if (this.afterClick) {
                    NewCanvas();
                    var canvas = $('#canvas')[0];
                    canvas.id = 'whiteboard';
                    canvas.width = $('#CanvasGallery')[0].width;
                    canvas.height = $('#CanvasGallery')[0].height;
                    $(canvas).css({
                        'position': 'absolute',
                        'left': $('#CanvasGallery')[0].offsetLeft,
                        'top': $('#CanvasGallery')[0].offsetTop
                    })
                    $(canvas).attr('class', 'whiteboard');

                    var cxt = canvas.getContext('2d');
                    resizeCanvas(canvas, cxt);
                    var img = new Image();
                    img.onload = function() {
                        cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
                    }
                    img.src = 'IRS/WhiteBoard.jpg';
                }
            }
        }, {
            //老師才有
            //題目送出
            "id": "IRSupload",
            "beforespanTextName": "題目送出",
            "afterspanTextName": "題目送出",
            "afterClick": false,
            "type": "upload",
            "beforeStyle": { 'background-image': 'url(IRS/uploadexam.png)' },
            "afterStyle": { 'background-image': 'url(IRS/uploadexam.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                IRStype();
            }
        }, {
            //學生才有
            //WebCam
            "id": "WebCam",
            "beforespanTextName": "WebCam",
            "afterspanTextName": "WebCam",
            "afterClick": false,
            "type": "WebCam",
            "beforeStyle": { 'background-image': 'url(IRS/prtscrn1.png)' },
            "afterStyle": { 'background-image': 'url(IRS/prtscrn1.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                CommandToWPF('WebcamSnapshot');
                
            }
        }, {
            //學生才有
            //上傳答案
            "id": "StuQuizUpload",
            "beforespanTextName": "上傳答案",
            "afterspanTextName": "上傳答案",
            "afterClick": false,
            "type": "StuQuizUpload",
            "beforeStyle": { 'background-image': 'url(IRS/quizupload.png)' },
            "afterStyle": { 'background-image': 'url(IRS/quizupload.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }

                isIRS = false;

                html2canvas($('#HamastarWrapper'), {
                    allowTaint: true,
                    taintTest: false,
                    onrendered: function(canvas) {
                        canvas.id = "mycanvas";
                        
                        UploadQuestionAnswerPicForHtml5(canvas.toDataURL());

                        $('#IRS_OriginalQuiz').css('display', 'none');
                        $('#ToolBar').css('display', 'block');
                        $('.answerCanvas').remove();
                        GalleryStartMove();

                        IRSinit();
                    }
                });
                
            }
        }, {
            //錄音
            "id": "recording",
            "beforespanTextName": "錄音",
            "afterspanTextName": "錄音",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/recording1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/recording2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('#App_Recording').toggle();
                $('#App_Notes').css('display', 'none');
            }
        }, {
            //上傳(筆記)
            "id": "upload",
            "beforespanTextName": "上傳",
            "afterspanTextName": "上傳",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);
                var tmp = location.search.replace('?','').split('&').map(function(x) {
                    return x.split('=').map(function(y) {
                        return decodeURIComponent(y);
                    });
                });
                var domain = tmp.filter(function(x) {
                    if (x[0] === 'domain') {
                        return x;
                    }
                });
                var token = tmp.filter(function(x) {
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
                    dataType: "xml",
                    //成功接收的function
                    success: function(oXml, xhr) {
                        console.log("=====Success=====");
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log("=====Error=====");
                    }
                });
            }
        }, {
            //切換
            "id": "switch",
            "beforespanTextName": "註記下載",
            "afterspanTextName": "註記下載",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/change1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/change1.png)' },
            action: function () {
                // changeAllBtnToFalse();

                getNotesList();
            }
        }, {
            //儲存
            "id": "IRSsave",
            "beforespanTextName": "儲存",
            "afterspanTextName": "儲存",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/save.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/save.png)' },
            action: function () {
                // var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                // if (indexedDB == undefined) {
                //     alert('此瀏覽器不支援本機註記儲存');
                // } else {
                //     SaveAll();
                // }
                var tmp = location.search.replace('?','').split('&').map(function(x) {
                    return x.split('=').map(function(y) {
                        return decodeURIComponent(y);
                    });
                });var domain = tmp.filter(function(x) {
                    if (x[0] === 'domain') {
                        return x;
                    }
                });
                var token = tmp.filter(function(x) {
                    if (x[0] === 'token2') {
                        return x;
                    }
                });
                var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote?token=' + (ReceiveList ? ReceiveList.token : token[0][1]);
                $.ajax({
                    type: "POST",
                    contentType: "text/xml",
                    url: url,
                    async: false,
                    data: toSyncXML(true),
                    dataType: "json",
                    //成功接收的function
                    success: function(oXml, xhr) {
                        BookAlertShow('註記上傳成功！');
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        Html5WirteLog(JSON.stringify(xhr));
                    }
                });
            }
        }, {
            //開啟檔案
            "id": "openfile",
            "beforespanTextName": "開啟檔案",
            "afterspanTextName": "開啟檔案",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appopen1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appopen1.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);
            }
        }, {
            //螢幕截圖
            "id": "printscreen",
            "beforespanTextName": "螢幕截圖",
            "afterspanTextName": "螢幕截圖",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/apprintscreen1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/apprintscreen1.png)' },
            action: function () {

                CommandToWPF('ScreenShotInRegion');
                
            }
        }, {
            //題目送出(老師)
            "id": "sendexam",
            "beforespanTextName": "題目送出",
            "afterspanTextName": "題目送出",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appsendexam.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appsendexam.png)' },
            action: function () {

                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }

                html2canvas($('#HamastarWrapper'), {
                    allowTaint: true,
                    taintTest: false,
                    onrendered: function(canvas) {
                        canvas.id = "mycanvas";

                        TeacherUploadDiscussionPicForHtml5(canvas.toDataURL());

                    }
                });

            }
        }, {
            //討論結果(老師)
            "id": "result",
            "beforespanTextName": "討論結果",
            "afterspanTextName": "討論結果",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appdiscussresult.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appdiscussresult.png)' },
            action: function () {

                CommandToWPF('ShowDiscussionResult');

            }
        }, {
            //開始討論(學生)
            "id": "start",
            "beforespanTextName": "開始討論",
            "afterspanTextName": "開始討論",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appsendexam.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appsendexam.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }

                $('#discussCanvas').remove();
                IRSinit();

                //蓋上一個空白的討論畫面
                NewCanvas();
                var canvas = $('#canvas')[0];
                canvas.id = 'discussCanvas';
                $(canvas).attr('class', 'discussCanvas');
                $(canvas).css('pointer-events', 'none');
                canvas.width = $(window).width();
                canvas.height = $(window).height();
                var cxt = canvas.getContext('2d');
                resizeCanvas(canvas, cxt);
                var img = new Image();
                img.onload = function() {
                    cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
                }
                img.src = 'ToolBar/DiscussionBG.jpg';
                
                GalleryStopMove();

            }
        }, {
            //上傳(學生)
            "id": "uploadDiscuss",
            "beforespanTextName": "上傳",
            "afterspanTextName": "上傳",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeIRSBtnToFalse();
                }

                GetCurrentDiscussData();

                $('#GroupName')[0].innerText = GroupList.GroupName;
                $('#GroupLeader')[0].innerText = GroupList.GroupLeaderName;
                
                //開啟小組資訊視窗
                $('#UploadDiscussion').dialog('open');

                if (ReceiveList.LoginID != GroupList.GroupLeader) { //不是小組長
                    $('#UploadDiscussionBtn').css('display', 'none');
                    $('#notLeader').css('display', 'block');
                }
            }
        }]
    }
];

//IRS功能
//畫筆、調色盤、便利貼、文字、刪除、插入圖片
//白板、題目送出(老師)
//WebCam、上傳答案(學生)
var IRSBars = [{
    id: "IRSPen",
    btnText: "畫筆"
}, {
    id: "IRSPicker",
    btnText: "調色盤"
}, {
    id: "IRStxtcanvas",
    btnText: "便利貼"
}, {
    id: "IRStxtnote",
    btnText: "文字"
}, {
    id: "IRSeraser",
    btnText: "刪除"
}, {
    id: "IRSinsert",
    btnText: "插入圖片"
}, {
    id: "IRSwhiteboard",
    btnText: "白板"
}, {
    id: "IRSupload",
    btnText: "題目送出"
}
// , {
//     id: "WebCam",
//     btnText: "WebCam"
// }
, {
    id: "StuQuizUpload",
    btnText: "上傳答案"
}];

//IRS答題種類
var IRSexam = [
    {
        'id': 1,
        'background': { 'background-image': 'url(IRS/OX.png)' },
        'textName': '是非題'
    }, 
    {
        'id': 2,
        'background': { 'background-image': 'url(IRS/SingleChoice.png)' },
        'textName': '單選題',
        'answer': [
            {
                'text': '1'
            }, 
            {
                'text': '2'
            },
            {
                'text': '3'
            },
            {
                'text': '4'
            },
            {
                'text': '5'
            },
            {
                'text': '6'
            }
        ]
    },
    {
        'id': 3,
        'background': { 'background-image': 'url(IRS/MultipleChoice.png)' },
        'textName': '複選題',
        'answer': [
            {
                'text': '1'
            }, 
            {
                'text': '2'
            },
            {
                'text': '3'
            },
            {
                'text': '4'
            },
            {
                'text': '5'
            },
            {
                'text': '6'
            }
        ]
    },
    {
        'id': 4,
        'background': { 'background-image': 'url(IRS/ShortAnswer.png)' },
        'textName': '簡答題'
    },
    {
        'id': 5,
        'background': { 'background-image': 'url(IRS/OriginalView.png)' },
        'textName': '原畫面作答'
    }
]

//所有IRS的button變回false
function changeIRSBtnToFalse() {
    $(NoteBars[0].btns).each(function() {
        this.afterClick = false;
        checkBtnChange(this);
    });
    ToolBarList.AddWidgetState = 'none';
}