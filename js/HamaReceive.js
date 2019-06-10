//站台溝通

var ReceiveList = null,
    StudentList = null,
    StudentImage = null,
    StudentNoAnswer = 0,
    StudentAnswerLength = 0,
    DiscussionImage = '',
    GroupList = null,
    RecodingTimer = null,
    isApp = false;




//關書
function CallExToExit() {
    try {
        window.external.rtexit();
    } catch (e) {}
}

//開書先呼叫站台
function CommandToWPF(commandName, objectBase64String) {
    try {
        window.external.commandFromHtml5(commandName, objectBase64String);
        isApp = true;
    } catch (e) {
        Html5WirteLog(e);
    }
}

//接收封包
function CommandToHtml5(commandName, objectBase64String) {
    try {
        switch (commandName) {
            //開書時站台回傳資訊
            case 'RequestExternalInformationResult':
                var obj = JSON.parse(objectBase64String);
                Html5WirteLog('RequestExternalInformationResult: ' + JSON.stringify(obj));
                //接收到的資訊存到ReceiveList
                ReceiveList = obj;
                $('#ToolBarUl>li').remove();
                getFaceModuleList();
                MainObj.token = ReceiveList.token;
                if (!location.search) {
                    location.search = "?token2=" + ReceiveList.token + '&domain=' + ReceiveList.HostURL;
                }
                // getNotesList();
                break;

            case 'WebcamSnapshotResult': //WebCam
            case 'ScreenShotInRegionResult': //螢幕截圖
                //用插入圖片的方式導入書裡
                InsertImg.File = 'data:image/png;base64,' + objectBase64String;
                if (ToolBarList.AddWidgetState == 'IRSinsert') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'IRSinsert';
                }

                break;
            case 'OpenFileResult': //插入檔案
                var fileName = objectBase64String;
                if (fileName) {
                    NewCanvas();
                    var canvas = $('#canvas')[0];
                    $(canvas).attr('class', 'inputFile');
                    canvas.id = 'inputFile';
                    $(canvas).css({
                        'left': MainObj.CanvasL,
                        'top': MainObj.CanvasT
                    });
                    if (fileName.split('.').pop().toLowerCase() == 'mp4') {
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

                            NewVideo.src = 'Note/' + fileName;

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

                            fileObj.saveList.push({
                                id: videoDiv.id,
                                page: MainObj.NowPage,
                                type: 'file',
                                fileName: fileName,
                                left: ($(videoDiv).offset().left - MainObj.CanvasL) / MainObj.Scale,
                                top: ($(videoDiv).offset().top - MainObj.CanvasT) / MainObj.Scale,
                                width: 640 / MainObj.Scale,
                                height: 360 / MainObj.Scale
                            });
                        });
                    } else {
                        // 圖片or其他檔案
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
                                    window.open('Note/' + fileName);
                                });

                                $('#inputFile').remove();

                                fileObj.saveList.push({
                                    id: fileCanvas.id,
                                    page: MainObj.NowPage,
                                    type: 'file',
                                    fileName: fileName,
                                    left: ($(fileCanvas).offset().left - MainObj.CanvasL) / MainObj.Scale,
                                    top: ($(fileCanvas).offset().top - MainObj.CanvasT) / MainObj.Scale,
                                    width: img.width / MainObj.Scale,
                                    height: img.height / MainObj.Scale
                                });
                            };
                            // 檔案對應圖示
                            switch (fileName.split('.').pop().toLowerCase()) {
                                case 'doc':
                                case 'docx':
                                    img.src = 'ToolBar/FileType/DocDocx.png';
                                    break;
                                case 'jpg':
                                case 'png':
                                case 'gif':
                                    img.src = 'Note/' + fileName;
                                    break;
                                case 'ppt':
                                case 'pptx':
                                    img.src = 'ToolBar/FileType/PptPptx.png';
                                    break;
                                default:
                                    img.src = 'ToolBar/FileType/' + fileName.split('.').pop().toLowerCase() + '.png';
                                    break;
                            }
                        });
                    }
                }
                break;

            case 'LoadNoteXML': // 開書要求註記
            case 'DownloadNoteDataResult': // 下載編修檔
                Html5WirteLog(commandName + ': ' + objectBase64String);
                if (objectBase64String) {
                    noteSwitch(objectBase64String);
                }
                break;

                // 班級進度結果回傳
            case 'RequestClassScheduleResult':
                if (objectBase64String) {
                    Html5WirteLog(commandName + ': ' + objectBase64String);
                    $('.class-layout').toggle();
                    $('.class-tr').remove();
                    classProgressList = JSON.parse(objectBase64String);
                    if (typeof(classProgressList) == 'string') {
                        classProgressList = JSON.parse(classProgressList);
                    }
                    Html5WirteLog('classProgressList: ' + classProgressList);
                    Html5WirteLog(typeof(classProgressList));
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
                } else {
                    $('.class-layout').toggle();
                    $('.class-tr').remove();
                }
                break;
        }
    } catch (e) {
        Html5WirteLog("call CommandToHtml5 error");
        Html5WirteLog(e);
    }
}

//寫入Log
function Html5WirteLog(str) {
    try {
        window.external.html5WirteLog(str);
    } catch (e) {

    }
}

//老師選擇題型後送出題目
//UID=string&PWD=string&FileName=string&Pic=string&ClassID=string&QAType=string&ExamQuestionID=string
function UploadTeacherQuestionForHtml5(src) {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        Picture = src.split(',')[1],
        ClassID = ReceiveList.ClassID,
        QAType = IRS.Type,
        ExamQuestionID = -1;

    // var data =  'fileId=' + BookName +
    //             '&pic=' + encodeURIComponent(Picture) +
    //             '&classId=' + ClassID +
    //             '&qaType=' + QAType +
    //             '&ExamQuestionID=-1';

    var data = {
        pic: Picture,
        qaType: QAType,
        fileId: BookName,
        classId: ClassID,
        token: MainObj.token
    }

    $.ajax({
        type: "POST",
        url: domain + '/api/QA/UploadTeacherQuestion',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            // var list = JSON.stringify(xml2jsonElementVer(e));
            // Html5WirteLog(list);
            var quizType = ClassID + ',' + BookName;
            SendQuiz(quizType);
            GetStudentNoAnswerList();

            //每四秒抓一次未答題的學生清單
            IRS.Interval = setInterval(function () {
                GetStudentNoAnswerList();
            }, 4000);

        },
        error: function (e) {
            Html5WirteLog('UploadTeacherQuestion POST Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//取得課中測驗之題目圖片
//UID=string&PWD=string&FileName=string&ClassID=string
//StudentImage: [題目ID,題型號,圖片網址]
function GetQuestionImageQAType() {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        ClassID = ReceiveList.ClassID;

    // if (ReceiveList.UserRole == 1) {
    //     ClassID = -1;
    // }

    var data = 'fileId=' + BookName + '&classId=' + ClassID;

    $.ajax({
        type: "GET",
        url: domain + '/api/QA/GetQuestionImageQAType?' + data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            //取得的題目圖片及type存在StudentImage
            StudentImage = e.split(';');
        },
        error: function (e) {
            StudentImage = null;
        }
    });
}

//IRS取得學生清單
function GetStudent() {

    if (ReceiveList != null) {
        var domain = ReceiveList.HostURL;
        var data = ReceiveList.ClassID;

        $.ajax({
            type: "GET",
            url: domain + '/api/QA/GetStudentListByString?classId=' + data,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            dataType: "xml",
            headers: {
                'Authorization': MainObj.token
            },
            async: false,

            //成功接收的function
            success: function (e) {
                var list = xml2jsonAttributeVer(e);
                Html5WirteLog(JSON.stringify(list));
                StudentList = list.StudentList.Student;
            },
            error: function (e) {
                Html5WirteLog('GetStudent POST Error');
                Html5WirteLog(JSON.stringify(e));
            }
        });
    }
}

//老師出完題呼叫SendQuiz('ClassID, BookName');
function SendQuiz(quizType) {
    try {
        window.external.sendQuiz(quizType);
    } catch (e) {
        // alert(e.message);
    }
}

function SendAnswer(loginId) {
    try {
        window.external.sendAnswer(loginId);
    } catch (e) {
        // alert(e.message);
    }
}

// 分組討論 老師送出討論呼叫
function SendStartDiscuss() {
    try {
        window.external.sendStartDiscuss();
    } catch (e) {
        // alert(e.message);
    }
}

//WPF會攔截signalr傳出的Alert訊息再呼叫StartQuiz('[ClassID],[BookName]');
//接收到此訊息需判斷角色是否為學生，是否再同一個班級[ClassID]與書本[BookName]
function StartQuiz(quizType) {
    try {
        var ClassID = quizType.split(',')[0];
        var BookName = quizType.split(',')[1];
        if (ReceiveList.UserRole == 1) {
            if (ClassID == ReceiveList.ClassID && BookName == ReceiveList.BookName) {
                dialogQuizOpen();
            }
        }
    } catch (e) {
        // alert(e.message);
    }
}

function StartDiscuss() {
    try {
        $('#discussionDialog').css('display', 'block');
    } catch (e) {

    }
}

//學生上傳答題答案
//UID=string&PWD=string&FileName=string&InputAnswer=string
function UploadStudentAnswer(ans) {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        ClassId = ReceiveList.ClassID,
        InputAnswer;

    if (IRS.Type == 4) {
        InputAnswer = ans;
    } else {
        InputAnswer = GetAnswerNumber(ans);
    }

    var data = 'fileId=' + BookName +
        '&classId=' + ClassId +
        '&Answer=' + encodeURIComponent(InputAnswer);

    // alert(data);
    Html5WirteLog(domain + '/api/QA/UploadStudentAnswer?' + data);
    $.ajax({
        type: "POST",
        url: domain + '/api/QA/UploadStudentAnswer?' + data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        dataType: "xml",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            var list = JSON.stringify(xml2jsonElementVer(e));
            Html5WirteLog(list);
        },
        error: function (e) {
            Html5WirteLog('UploadStudentAnswer POST Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//取得沒有答題學生列表
//UID=string&PWD=string&ClassID=string&FileName=string
function GetStudentNoAnswerList() {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        ClassID = ReceiveList.ClassID;

    var data = 'classId=' + ClassID + '&fileId=' + BookName;

    $.ajax({
        type: "GET",
        url: domain + '/api/QA/GetStudentNoAnswerList?' + data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        dataType: "xml",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            var list = xml2jsonAttributeVer(e);
            // Html5WirteLog(JSON.stringify(list));
            StudentNoAnswer = list.StudentList.Student;
            StudentAnswerLength = StudentList.length - StudentNoAnswer.length;
            $('#answerYes_count')[0].innerText = StudentAnswerLength; //已作答人數
            $('#answerNo_count')[0].innerText = StudentNoAnswer.length; //未作答人數

            //用換class的方式改變背景(stuBtnFocus)
            //邏輯是，先把全部變黃色，再從未答題的學生清單中變回灰色(stuBtn)
            $('.stuBtn').attr('class', 'stuBtnFocus');
            for (var i = 0; i < StudentNoAnswer.length; i++) {
                document.getElementById(StudentNoAnswer[i].UserID).className = 'stuBtn';
                // $('#' + StudentNoAnswer[i].UserID).attr('class', 'stuBtn');
            }
        },
        error: function (e) {
            // alert(e.message);
        }
    });
}

//學生上傳答題畫面(原畫面答題)
//UID=string&PWD=string&FileName=string&Pic=string&ClassID=string
function UploadQuestionAnswerPicForHtml5(src) {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        Picture = src.split(',')[1],
        ClassID = ReceiveList.ClassID;

    var data = {
        pic: Picture,
        fileId: BookName,
        classId: ClassID,
        token: MainObj.token
    }

    $.ajax({
        type: "POST",
        url: domain + '/api/QA/UploadQuestionAnswerPic',
        contentType: "application/json",
        async: false,
        //要傳過去的值
        data: JSON.stringify(data),
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            var list = JSON.stringify(xml2jsonElementVer(e));
            Html5WirteLog(list);
        },
        error: function (e) {
            Html5WirteLog('UploadQuestionAnswerPicForHtml5 POST Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//取得挑選學生答案(四分割用)
//UserIDList=string&ClassID=string&FileName=string
function GetAnswerChoiceList(list) {
    var domain = ReceiveList.HostURL,
        UserIDList = list,
        ClassID = ReceiveList.ClassID,
        BookName = ReceiveList.BookName;

    var data = 'UserIDList=' + UserIDList +
        '&classId=' + ClassID +
        '&fileId=' + BookName;

    $.ajax({
        type: "GET",
        url: domain + '/api/QA/GetAnswerChoiceList?' + data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        dataType: "xml",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            var list = xml2jsonAttributeVer(e);
            list = list.AnswerList.Answer;
            Html5WirteLog(JSON.stringify(list));

            if (list.length == undefined) {
                list = [list];
            }

            //陣列反序
            list = list.reverse();

            //將每一個分割畫面放一個span(裡面包含左上角button跟答案canvas)
            $(list).each(function () {

                var span = document.createElement('span');
                $('#IRS_watch > div').prepend(span);

                NewCanvas();
                var canvas = $('#canvas')[0];
                canvas.id = this.UserName;
                canvas.width = $(window).width() / 2;
                canvas.height = $(window).height() / 2;

                $(canvas).attr('class', 'stuAnswerCanvas');
                $(canvas).css('position', 'relative');

                $(span).append(canvas);

                var cxt = canvas.getContext('2d');
                resizeCanvas(canvas, cxt);

                var that = this;

                if (this.QATypeID == '5') { //原畫面作答觀摩(四分割)

                    var img = new Image();
                    img.onload = function () {
                        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);

                        WatchBtnSet(span, canvas, that);
                    }
                    img.src = this.Answer;

                } else if (this.QATypeID == '4') { //簡答題觀摩(四分割)

                    var img = new Image();
                    img.onload = function () {
                        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                        cxt.font = "20px Georgia";
                        canvasTextAutoLine(that.Answer, canvas, 10, 80, 20);

                        WatchBtnSet(span, canvas, that);
                    }
                    img.src = 'IRS/BG.jpg';
                }

                $(canvas).click(function (e) {
                    e.preventDefault();
                    if ($(this).attr('class') == 'stuAnswerCanvas') {
                        $(this).attr('class', 'stuAnswerCanvasZoomIn');
                        $('.stuAnswerCanvas').css('display', 'none');
                    } else {
                        $('.stuAnswerCanvas').css('display', 'inline-block');
                        $(this).attr('class', 'stuAnswerCanvas');
                        $(this).css('position', 'relative');
                    }
                })
            })
        },
        error: function (e) {
            // alert(e.message);
        }
    });
}

//判斷學生有沒有答過題
//UID=string&PWD=string&FileName=string&ClassID=string
function CheckHasAnswer() {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        ClassID = ReceiveList.ClassID;

    var data = 'Student=' + UID +
        '&fileId=' + BookName +
        '&classId=' + ClassID;

    $.ajax({
        type: "GET",
        url: domain + '/api/QA/CheckHasAnswer?' + data,
        contentType: "application/json",
        async: false,
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            // var list = xml2jsonElementVer(e);
            // list = list['string']['#text'];
            Html5WirteLog(e);

            if (e) {
                BookAlertShow('已答題');
            } else {
                StudentQuizStart();
            }
        },
        error: function (e) {
            // alert(e.message);
        }
    });
}

//教師上傳正確答案
//UID=string&PWD=string&FileName=string&CorrectAnswer=string&ClassID=string
function UploadCorrectAnswer(ans) {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        CorrectAnswer = GetAnswerNumber(ans),
        ClassID = ReceiveList.ClassID;

    var data = {
        classId: ClassID,
        answer: CorrectAnswer,
        fileId: BookName
    };

    $.ajax({
        type: "POST",
        url: domain + '/api/QA/UploadCorrectAnswer',
        contentType: "application/json",
        async: false,
        //要傳過去的值
        data: JSON.stringify(data),
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            // var list = JSON.stringify(xml2jsonElementVer(e));
            // Html5WirteLog(list);
            //開啟作答結果網頁
            CommandToWPF('ShowExamResult');

            IRS_cancel();
        },
        error: function (e) {
            Html5WirteLog('UploadCorrectAnswer POST Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//小組討論-教師上傳討論題目
//UID=string&PWD=string&FileName=string&Pic=string&ClassID=string
function TeacherUploadDiscussionPicForHtml5(src) {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        Picture = src.split(',')[1],
        ClassID = ReceiveList.ClassID;

    var data = {
        pic: Picture,
        classId: ClassID
    }

    $.ajax({
        type: "POST",
        url: domain + '/api/classHub/GroupDiscussionService/TeacherUploadDiscussionPic',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            Html5WirteLog('TeacherUploadDiscussionPic: ' + e);
            SendStartDiscuss();
            BookAlertShow('題目送出');

        },
        error: function (e) {
            Html5WirteLog('TeacherUploadDiscussionPicForHtml5 POST Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//小組討論-取得教師上傳討論題目
//UID=string&PWD=string&FileName=string&ClassID=string
function GetDiscussionImage() {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        ClassID = ReceiveList.ClassID;

    $.ajax({
        type: "GET",
        url: domain + '/api/classHub/GroupDiscussionService/GetDiscussionImage?classId=' + ClassID,
        contentType: "application/json",
        async: false,
        dataType: "json",
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            // var img = xml2jsonElementVer(e);
            // img = img['string']['#text'];
            // Html5WirteLog(img);
            Html5WirteLog('GetDiscussionImage: ' + e);
            DiscussionImage = e;
        },
        error: function (e) {
            Html5WirteLog('GetDiscussionImage GET Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

// 取得目前小組討論資訊
// UID=string&PWD=string&FileName=string&ClassID=string
function GetCurrentDiscussData() {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        ClassID = ReceiveList.ClassID;

    $.ajax({
        type: "GET",
        url: domain + '/api/classHub/GroupDiscussionService/GetCurrentDiscussData?classId=' + ClassID,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "xml",
        async: false,
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            var list = xml2jsonAttributeVer(e);
            // list = list['string']['#text'];
            var teacherID = list.DiscussData.Discuss.TeacherId;
            // Html5WirteLog(teacherID);
            Html5WirteLog("teacherID:" + teacherID);
            GetUserGroupDataByTeacherID(teacherID);
        },
        error: function (e) {
            Html5WirteLog('GetCurrentDiscussData GET Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//取得小組資訊
//UserID=string&teacherID=string
function GetUserGroupDataByTeacherID(teacherID) {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID;

    var data = 'teacherId=' + teacherID + '&classId=' + ReceiveList.ClassID;
    $.ajax({
        type: "GET",
        url: domain + '/api/classHub/GroupDiscussionService/GetUserGroupDataByTeacherID?' + data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "xml",
        async: false,
        headers: {
            'Authorization': MainObj.token
        },
        //成功接收的function
        success: function (e) {
            var list = xml2jsonAttributeVer(e);
            var group = list.GroupData.Group;
            Html5WirteLog(JSON.stringify(group));

            //將小組資訊存在GroupList
            GroupList = group;

        },
        error: function (e) {
            Html5WirteLog('GetUserGroupDataByTeacherID GET Error');
            Html5WirteLog(JSON.stringify(e));
        }
    });
}

//小組討論-小組長上傳小組討論圖片
//UID=string&PWD=string&FileName=string&Leader=string&GroupID=string&Pic=string
function UploadGroupDiscussionPicForHtml5() {
    var domain = ReceiveList.HostURL,
        UID = ReceiveList.LoginID,
        Password = ReceiveList.Password,
        BookName = ReceiveList.BookName,
        Leader = GroupList.GroupLeader,
        GroupID = GroupList.GroupId,
        Picture;

    html2canvas($('#HamastarWrapper'), {
        allowTaint: true,
        taintTest: false,
        onrendered: function (canvas) {
            canvas.id = "mycanvas";

            Picture = canvas.toDataURL();

            var data = {
                pic: Picture.split(',')[1],
                groupID: GroupID
            };

            $.ajax({
                type: "POST",
                url: domain + '/api/classHub/GroupDiscussionService/UploadGroupDiscussionPic',
                contentType: "application/json",
                async: false,
                dataType: "json",
                headers: {
                    'Authorization': MainObj.token
                },
                //要傳過去的值
                data: JSON.stringify(data),
                //成功接收的function
                success: function (e) {
                    Html5WirteLog('UploadGroupDiscussionPic: ' + e);
                    Html5WirteLog(data.pic);
                    Html5WirteLog(data.groupID);
                    Html5WirteLog(MainObj.token);
                    var list = JSON.stringify(xml2jsonElementVer(e));
                    Html5WirteLog(list);

                    alert('討論結果上傳成功');

                    $('#UploadDiscussion').dialog('close');

                },
                error: function (e) {
                    Html5WirteLog('UploadGroupDiscussionPicForHtml5 POST Error');
                    Html5WirteLog(JSON.stringify(e));
                }
            });
        }
    });
}

//錄音
//開始錄音
function startMusicRecoding() {
    var fileName = newguid();
    window.external.startMusicRecoding(fileName);
}

//WPF確認找到錄音裝置後
function wpfReallyStart() {
    try {
        // 開始跑時間
        // alert('Recoding Start');

        $('#StartRecordingBtn').attr('class', 'RecordingOn');
        $('#StopRecordingBtn').attr('class', 'RecordingOff');

        RecodingTimer = setInterval(function () {

            var second = Number($('#RecordingS')[0].innerText) + 1;
            var minute = Number($('#RecordingM')[0].innerText);

            if (second < 10) {
                $('#RecordingS')[0].innerText = '0' + second;
            } else if (second >= 10) {
                $('#RecordingS')[0].innerText = second;
            }

            if (second >= 60) {
                $('#RecordingS')[0].innerText = '00';
                minute = minute + 1;
            }

            if (minute < 10 && minute > 0) {
                $('#RecordingM')[0].innerText = '0' + minute;
            }

        }, 1000);

    } catch (e) {
        alert('wpfReallyStart Error');
        // alert(e.message);
    }
}

//結束錄音
function stopMusicRecoding() {
    try {
        window.external.stopMusicRecoding();

        $('#StartRecordingBtn').attr('class', 'RecordingOff');
        $('#StopRecordingBtn').attr('class', 'RecordingOn');

    } catch (e) {
        alert(e.message);
    }
}

//WPF將錄音檔存檔後 isSuccess true=成功 false=失敗
function musicRecodingState(isSuccess, XFileName) {
    try {

        clearInterval(RecodingTimer);

        $('#RecordingM')[0].innerText = '00';
        $('#RecordingS')[0].innerText = '00';

        //成功或失敗皆要顯示訊息(錄製完成/錄製失敗)
        if (isSuccess) {
            BookAlertShow('錄製完成');

            //成功要將錄音物件加到目前頁面上，是註記資料的一部份
            NewCanvas();
            var canvas = $('#canvas')[0];
            var cxt = canvas.getContext('2d');
            resizeCanvas(canvas, cxt);
            canvas.id = XFileName;
            canvas.width = 50;
            canvas.height = 50;

            $(canvas).attr('class', 'RecodingImg');

            //置中
            $(canvas).css({
                'left': $(window).width() / 2 - 25,
                'top': $(window).height() / 2 - 25
            })

            var img = new Image();
            img.onload = function () {
                cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
            }
            img.src = 'ToolBar/recordingObject.png';

            $(canvas).draggable({
                stop: function () {
                    SaveRecording();
                }
            });

            $(canvas).click(function (e) {
                e.preventDefault();
                if ($('#Voice')[0] != undefined) {
                    $('#Voice').remove();
                }

                $('<audio/>', {
                    id: 'Voice',
                    class: 'VoiceClass',
                    src: 'Resource/' + XFileName + '.mp3'
                }).appendTo('#HamastarWrapper');

                $('#Voice')[0].volume = 1;
                $('#Voice')[0].play();

                $("#Voice").on('ended', function () {
                    // done playing
                    $(this).remove();
                });
            })

            SaveRecording();

        } else {
            BookAlertShow('錄製失敗');
        }

    } catch (e) {
        alert(e.message);
    }
}