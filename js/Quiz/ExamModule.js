//測驗模式

var Exam = {
    ErrorList: [],
    Finish: false,
    TotalCount: 0,
    ErrorCount: 0,
    TotalScore: 0,
    QuizScore: 0,
    PassWord: null,
    LoginID: null,
    FileName: null,
    Record_C: [],

    Choose: 0
}







//測驗題組送出試卷按鈕
function ExamCanvasSet(obj) {
    var scale = MainObj.Scale;
    var Left = obj.Left * scale + MainObj.CanvasL;
    var Top = obj.Top * scale + MainObj.CanvasT;
    var Width = obj.Width * scale;
    var Height = obj.Height * scale;

    $('#canvas')[0].class = 'canvasObj';
    var canvasQuizID = obj.Identifier;

    $('#canvas')[0].id = canvasQuizID;
    $('#' + canvasQuizID)[0].width = Width;
    $('#' + canvasQuizID)[0].height = Height;
    $('#' + canvasQuizID).css({ 'left': Left, 'top': Top });

    var canvas = $('#' + canvasQuizID)[0];
    var cxt = $('#' + canvasQuizID)[0].getContext('2d');
    // resizeCanvas(canvas, cxt);

    drawButtonImage(obj, cxt, Width, Height);

    $('#' + canvasQuizID).click(function(e) {
        e.preventDefault();
        ExamFinish();
    })

}

//測驗模式送出按鈕事件
function ExamFinish() {
    var quizScore = 0;
    if (!Exam.Finish) {

        $('.allTimer').css("display", "none");

        $.blockUI({ message: $('#endQuiz'), certerX: true, centerY: true, allowBodyStretch: true });

        Quiz.EndTime = getRecordTime();

        var showTime = getTime();
        var groupCount = BookList.BookInfoList.ExamInfo.GroupCount;
        var totalScore = 0;

        if (groupCount != '0') {

            if (!Quiz.IsRandomQuiz) {            
                totalScore = BookList.BookInfoList.ExamInfo.TotalScore;
            } else {
                //如有設定隨機頁數，總分要重算
                $(HamaList).each(function() {
                    if (this.GroupList != undefined) {
                        totalScore += Number(this.GroupList.Point);
                    }
                })
            }

            //有設定群組配分
            $("#QuizTime")[0].innerText = "測驗時間:" + showTime;
            quizScore = getGroupScore();
            $("#QuizScroe")[0].innerText = "總分:" + totalScore + '        ' + "得分:" + quizScore;

            Exam.TotalScore = totalScore;
        } else if (groupCount == '0') {
            //無設定群組配分
            $("#QuizTime")[0].innerText = "測驗時間:" + showTime;
            quizScore = getScore();
            $("#QuizScroe")[0].innerText = "總分: 100%" + '        ' + "得分:" + quizScore + "%";

            Exam.TotalScore = 100;
        }

        Exam.QuizScore = quizScore;
        if (BookList.BookInfoList.ExamInfo.UploadPlatform == 'true') {
            // QuizEndTime = getRecordTime();
            // getUserPW();
            // sendQuizLogin();
        }

        
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
        if (domain) {
            var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/examLog?token=' + token[0][1];
            $.ajax({
                type: "POST",
                contentType: "text/xml",//"application/x-www-form-urlencoded; charset=UTF-8",
                url: url,
                async: false,
                data: Record_parseXMLq(),
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

        Exam.Finish = true;
    }
}

//取得測驗時間
function getTime() {
    var start = new Date(Quiz.StartTime.split(' ')[0] + ' ' + Quiz.StartTime.split(' ')[2]);
    var end = new Date(Quiz.EndTime.split(' ')[0] + ' ' + Quiz.EndTime.split(' ')[2]);
    var quizTime = (end - start) / 1000;
    //console.log('quizTime:'+quizTime);
    var hh = Math.floor((quizTime / 3600));
    // console.log('hh:'+hh);
    quizTime = quizTime - (hh * 3600);

    var mm = Math.floor((quizTime / 60));
    //  console.log('mm:'+mm);
    quizTime = quizTime - (mm * 60);

    var ss = (quizTime).toFixed(0);
    //  console.log('ss:'+ss);
    var showTime = '';
    if (hh > 0) {
        showTime += hh + "時 ";
    }
    if (mm > 0) {
        showTime += mm + "分 ";
    }
    if (ss > 0) {
        showTime += ss + "秒 ";
    }

    return showTime;
}

//產生 操作時間紀錄格式
function getRecordTime() {
    var today = new Date();

    var Y = today.getFullYear().toString();
    var M = (today.getMonth() + 1).toString();
    M = M[1] ? M : "0" + M[0];
    var D = today.getDate().toString();
    D = D[1] ? D : "0" + D[0];
    var Hour = today.getHours() > 12 ? " 下午 " : " 上午 ";
    var H = (today.getHours() % 12).toString();
    H = H[1] ? H : "0" + H[0];
    var mm = today.getMinutes().toString();
    mm = mm[1] ? mm : "0" + mm[0];
    var S = today.getSeconds().toString();
    S = S[1] ? S : "0" + S[0];

    return Y + "/" + M + "/" + D + Hour + H + ":" + mm + ":" + S;
}

//取得測驗得分(有群組)
function getGroupScore() {

    var quizScore = 0;

    for (var page = 0; page < HamaList.length; page++) {

        var touchError = false,
            connectError = false,
            inputError = false;

        if (HamaList[page].GroupList != undefined) {

            var groupObj = HamaList[page].GroupList.GroupObject;

            if (groupObj == undefined) {
                groupObj = HamaList[page].GroupList[0].GroupObject;
            }

            if (groupObj.length == undefined) {
                groupObj = [groupObj];
            }

            for (var i = 0; i < groupObj.length; i++) {

                $(HamaList[page].Objects).each(function() {

                    // if (this.Identifier == groupObj[i].Identifier) {

                        switch (this.ExamType) {

                            case 'Touch':
                                var touchCount = 0,
                                    correctCount = 0;

                                //回答(數量)
                                $(Quiz.Choose).each(function() {
                                    if (this.Type == 'Touch') {
                                        touchCount++;
                                    }
                                })

                                //正確答案(數量)
                                $(HamaList[page].Objects).each(function() {
                                    if (this.FormatterType == 'CorrectBox') {
                                        correctCount++;
                                    }
                                })

                                //數量一樣且答案(ExamAnswer)都要為Y，才得分
                                if (touchCount != correctCount || this.ExamAnswer == 'N') {
                                    if (this.FormatterType == 'CorrectBox' && this.ExamAnswer == 'N') {
                                        touchError = true;
                                        return;
                                    } else if (this.FormatterType == 'ErrorBox') {
                                        var that = this;
                                        var choosed = false;
                                        $(Quiz.Choose).each(function() {
                                            if (this.ID == that.Identifier) {
                                                choosed = true;
                                            }
                                        })

                                        if (choosed) {
                                            touchError = true;
                                            return;
                                        }

                                    }
                                }

                                break;

                            case 'Connector':
                                var lineCount = 0,
                                    connectorCount = 0;

                                //回答的線(數量)
                                $(Quiz.Choose).each(function() {
                                    if (this.Type == 'Connector' && this.Page == page) {
                                        lineCount++;
                                    }
                                })

                                //正確答案的線(數量)
                                $(HamaList[page].Objects).each(function() {
                                    if (this.ExamType == 'Connector') {
                                        connectorCount++;
                                    }
                                })

                                //線的數量一樣且答案(ExamAnswer)都要為Y，才得分
                                if (lineCount != connectorCount || this.ExamAnswer == 'N') {
                                    connectError = true;
                                    return;
                                }

                                break;

                            case 'Input':

                                if (!this.ExamAnswer) {
                                    inputError = true;
                                    return;
                                }

                                break;

                        }
                    // }
                })
            }

            switch (HamaList[page].ExamType) {
                case 'Touch':

                    Exam.TotalCount++;

                    if (!HamaList[page].GroupList.length) {
                        if (!touchError) { //正確 給分
                            quizScore += Number(HamaList[page].GroupList.Point);
                        } else {
                            Exam.ErrorCount++;
                            pushErrorList(page, HamaList[page].GroupList.Name);
                        }
                    } else {
                        for (var i = 0; i < HamaList[page].GroupList.length; i++) {
                            var tmp = HamaList[page].GroupList[i];
                            for (var j = 0; j < Quiz.Choose.length; j++) {
                                if (Quiz.Choose[j]) {
                                    if (Quiz.Choose[j].Type == 'Touch' && Quiz.Choose[j].Answer == 'Y') {
                                        if (!tmp.GroupObject.length) tmp.GroupObject = [tmp.GroupObject];
                                        tmp.GroupObject.map(function(res) {
                                            if (Quiz.Choose[j].ID == res.Identifier) {
                                                tmp.checked = true;
                                                quizScore += Number(tmp.Point);
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        var errors = HamaList[page].GroupList.filter(function(x) {
                            if (!x.checked) {
                                return x;
                            }
                        });
                        errors.map(function(x) {
                            pushErrorList(page, x.Name);
                        });
                    }

                    break;

                case 'Connector':

                    Exam.TotalCount++;

                    if (!HamaList[page].GroupList.length) {
                        if (!connectError) { //正確 給分
                            $(HamaList[page].GroupList).each(function() {
                                quizScore += Number(this.Point);
                            })
                        } else {
                            Exam.ErrorCount++;
                            if (HamaList[page].GroupList.length > 0) {
                                pushErrorList(page, HamaList[page].GroupList[0].Name);
                            } else {
                                pushErrorList(page, HamaList[page].GroupList.Name);
                            }
                        }
                    } else {
                        for (var i = 0; i < HamaList[page].GroupList.length; i++) {
                            var tmp = HamaList[page].GroupList[i];
                            for (var j = 0; j < Quiz.Choose.length; j++) {
                                if (Quiz.Choose[j]) {
                                    if (Quiz.Choose[j].Type == 'Connector') {
                                        var case1 = false, case2 = false;
                                        tmp.GroupObject.forEach(function(x) {
                                            if (x.Identifier == Quiz.Choose[j].fromID) {
                                                case1 = true;
                                            }
                                        });
                                        tmp.GroupObject.forEach(function(x) {
                                            if (x.Identifier == Quiz.Choose[j].toID) {
                                                case2 = true;
                                            }
                                        });
                                        if (case1 && case2) {
                                            tmp.checked = true;
                                            quizScore += Number(tmp.Point);
                                        }
                                    }
                                }
                            }
                        }

                        var errors = HamaList[page].GroupList.filter(function(x) {
                            if (!x.checked) {
                                return x;
                            }
                        });
                        errors.map(function(x) {
                            pushErrorList(page, x.Name);
                        });
                    }

                    break;

                case 'Input':

                    Exam.TotalCount++;

                    if (!HamaList[page].GroupList.length) {
                        if (!inputError) { //正確 給分
                            quizScore += Number(HamaList[page].GroupList.Point);
                        } else {
                            Exam.ErrorCount++;
                            pushErrorList(page, HamaList[page].GroupList.Name);
                        }
                    } else {
                        for (var i = 0; i < HamaList[page].GroupList.length; i++) {
                            var tmp = HamaList[page].GroupList[i];
                            for (var j = 0; j < Quiz.Choose.length; j++) {
                                if (Quiz.Choose[j]) {
                                    if (Quiz.Choose[j].Type == 'Input') {
                                        if (Quiz.Choose[j].ID.split('Input')[1] == tmp.GroupObject.Identifier) {
                                            tmp.checked = true;
                                            quizScore += Number(tmp.Point);
                                        }
                                    }
                                }
                            }
                        }

                        var errors = HamaList[page].GroupList.filter(function(x) {
                            if (!x.checked) {
                                return x;
                            }
                        });
                        errors.map(function(x) {
                            pushErrorList(page, x.Name);
                        });
                    }

                    break;
            }
        }
    }

    return quizScore;
}

//取得測驗得分(無群組)
function getScore() {

    var examAll = 0, //有測驗的頁數
        examTotle = 0, //回答正確的頁數
        quizScore = 0; //得分

    for (var page = 0; page < HamaList.length; page++) {

        var isError = false;

        if (HamaList[page].ExamType != undefined) {
            examAll++;

            $(HamaList[page].Objects).each(function() {

                switch (this.ExamType) {

                    case 'Touch':
                        var touchCount = 0,
                            correctCount = 0;

                        //回答(數量)
                        $(Quiz.Choose).each(function() {
                            if (this.Type == 'Touch' && this.Page == page) {
                                touchCount++;
                            }
                        })

                        //正確答案(數量)
                        $(HamaList[page].Objects).each(function() {
                            if (this.FormatterType == 'CorrectBox') {
                                correctCount++;
                            }
                        })

                        //答案數量不一樣
                        if (touchCount != correctCount) {
                            isError = true;
                            return;
                        }

                        if (this.FormatterType == 'CorrectBox' && this.ExamAnswer == 'N') {
                            isError = true;
                            return;
                        }

                        break;

                    case 'Connector':

                        var lineCount = 0,
                            connectorCount = 0;

                        //回答的線(數量)
                        $(Quiz.Choose).each(function() {
                            if (this.Type == 'Connector' && this.Page == page) {
                                lineCount++;
                            }
                        })

                        //正確答案的線(數量)
                        $(HamaList[page].Objects).each(function() {
                            if (this.ExamType == 'Connector') {
                                connectorCount++;
                            }
                        })

                        //答案數量不一樣
                        if (lineCount != connectorCount) {
                            isError = true;
                            return;
                        }

                        if (this.ExamAnswer == 'N') {
                            isError = true;
                            return;
                        }

                        break;

                    case 'Input':

                        if (!this.ExamAnswer) {
                            isError = true;
                            return;
                        }

                        break;
                }
            })

            if (!isError) {
                if (page != HamaList.length - 1) { //最後一頁不算
                    examTotle++;
                }
            } else {
                pushErrorList(page, HamaList[page].PageTitle);
            }
        }

        
    }

    Exam.TotalCount = examAll;
    Exam.ErrorCount = examAll - examTotle;
    quizScore = (examTotle / examAll * 100);
    quizScore = quizScore.toFixed(2);

    return quizScore;

}

//push錯誤清單到Exam.ErrorList裡
function pushErrorList(page, name) {
    var list = {
        page: page,
        title: 'P ' + (page + 1) + ' ,' + name
    }

    Exam.ErrorList.push(list);

}

//測驗模式，答錯題目列表顯示
function errorList() {
    $('.windows_list_box').show().draggable({
        //多拖動或是click判斷
        start: function(event, ui) {
            $('.windows_list_box').addClass('noclick');
        }
    });

    if ($('.centent_box >ul>li').length > 0) {
        $('.centent_box >ul').empty() //列表清空
    }

    //建立答錯的清單
    if (Exam.ErrorList.length > 0) {
        for (var i = 0; i < Exam.ErrorList.length; i++) {
            
            var li = document.createElement('li');
            li.id = Exam.ErrorList[i].page;
            li.innerText = Exam.ErrorList[i].title;
            $(li).click(function(e) {
                e.preventDefault();
                gotoPage(Number(this.id));
                showQuizAnswer(Number(this.id));
            })

            $("#errUL").append(li);
        }
    }

    $('.windows_list_box').css({ 'height': $('.centent_box').height() + $('.errorbtndiv').height() + 30 })
}

function stopDrag() {
    $('.windows_list_box').draggable({ disabled: true });
}

function startDrag() {
    $('.windows_list_box').draggable({ disabled: false });
}

//錯誤錯誤列表縮小
function errornarrow() {

    $('.errorbtndiv').hide();
    $('.errorimgDiv').show();

    $('.windows_list_box').css({ 'height': '' });
    $('.windows_list_box').css({ 'width': 0 });
    $('.windows_list_box').css("background-color", "transparent");

}

//錯誤錯誤列表放大
function errorzoom() {
    //多拖動或是click判斷
    if ($('.windows_list_box').hasClass('noclick')) {
        $('.windows_list_box').removeClass('noclick');
    } else {
        $('.errorbtndiv').show();
        $('.errorimgDiv').hide();
        $('.windows_list_box').css({ 'width': 300 });
        $('.windows_list_box').css({ 'height': $('.centent_box').height() + $('.errorbtndiv').height() + 30 });

        $('.windows_list_box').css("background-color", "#F1C40F");
    }
}

//計時器縮小
function narrow() {
    $('.timerbtndiv').hide();
    $('.timerimgDiv').show();
}

//計時器放大
function zoom() {
    //多拖動或是click判斷
    if ($('.allTimer').hasClass('noclick')) {
        $('.allTimer').removeClass('noclick');
    } else {
        $('.timerbtndiv').show();
        $('.timerimgDiv').hide();
    }
}

//測驗模式，答案訂正
function showQuizAnswer(page) {

    var scale = MainObj.Scale;

    switch (HamaList[page].ExamType) {

        case 'Touch':
            $(HamaList[page].Objects).each(function() {

                if (this.FormatterType == 'CorrectBox' && this.ExamAnswer == 'N') {

                    var Canvas = $('#' + this.Identifier)[0];
                    var Cxt = Canvas.getContext('2d');
                    // resizeCanvas(Canvas, Cxt);

                    var Width = this.Width * scale - 6;
                    var Height = this.Height * scale - 6;

                    //點選題提示答案為黃色框框及黃色數字
                    borderstyle(this.Identifier, 'Solid', 'yellow', 3);
                    Cxt.strokeRect(3, 3, Width, Height);

                    var Msg = this.CorrectOrder;
                    var Padding = 20 * scale;
                    Cxt.font = Padding + 'px Arial';
                    Cxt.fillStyle = "yellow";
                    Cxt.fillText(Msg, Width - Padding + 6, Padding);

                }

                //測驗完將click事件取消
                var obj = $('#' + this.Identifier)[0];
                $(obj).off('click');

            })

            $(Quiz.Choose).each(function() {

                if (this.Type == 'Touch' && this.Answer == 'N' && this.Page == page) {

                    drawErrorAnswer(this.ID);
                }
            })

            break;

        case 'Connector':
            $(HamaList[page].Objects).each(function() {

                if (this.ExamType == 'Connector' && this.ExamAnswer == 'N') {

                    if($('#' + this.Identifier)[0] == undefined) {
                        ErrorCanvas();

                        var Canvas = $('#ErrorCanvas')[0];
                        var Cxt = Canvas.getContext('2d');
                        // resizeCanvas(Canvas, Cxt);
                        
                        var PointFrom = getErrorPoint(this.From);
                        var PointTo = getErrorPoint(this.To);

                        //連連看提示答案為綠色線
                        borderstyle('ErrorCanvas', 'Solid', 'yellow', 3);

                        Cxt.moveTo(PointFrom.X, PointFrom.Y);
                        Cxt.lineTo(PointTo.X, PointTo.Y);
                        Cxt.stroke();

                        Canvas.id = this.Identifier;

                        var that = this;
                        var imgDrag = false;
                        $(HamaList[page].Objects).each(function() {
                            if (this.Identifier == that.From && this.FormatterType == 'ImageLayer') {

                                imgDrag = true;
                                
                                var oldcanvas = $('#' + that.From);

                                NewCanvas(this);
                                var canvas = $('#canvas')[0];
                                var cxt = canvas.getContext('2d');

                                canvas.id = 'Error' + that.From;

                                canvas.width = this.Width * MainObj.Scale;
                                canvas.height = this.Height * MainObj.Scale;

                                cxt.drawImage(oldcanvas[0], 0, 0);

                                $(canvas).css({
                                    'left': oldcanvas.offset().left,
                                    'top': oldcanvas.offset().top,
                                    'opacity': 0.5
                                })
                            }
                        })

                        if (!imgDrag) {
                            //畫叉叉
                            drawErrorAnswer(this.From);
                            drawErrorAnswer(this.To);
                        }

                    }

                } else if (this.FormatterType == 'CorrectBox' || this.FormatterType == 'ErrorBox') {

                    //測驗完將mousedown事件取消
                    var canvas = $('#' + this.Identifier)[0];
                    canvas.removeEventListener( "mousedown", ConnectorDown, false );

                } else if (this.FormatterType == 'ImageLayer') {

                    var canvas = $('#' + this.Identifier)[0];
                    canvas.removeEventListener('mousedown', imgDragDown, false ); //滑鼠點擊事件

                }
            })

            break;

        case 'Input':

            $(HamaList[page].Objects).each(function() {

                if (this.ExamType == 'Input' && this.ExamAnswer == false) {

                    var input = $('#Input' + this.Identifier);

                    //畫叉叉
                    if ($('#' + this.Identifier)[0] == undefined) {
                        NewCanvas();
                        var canvas = $('#canvas')[0];
                        var cxt = canvas.getContext('2d');
                        // resizeCanvas(canvas, cxt);
                        canvas.id = this.Identifier;
                        canvas.width = 50 * MainObj.Scale;
                        canvas.height = 50 * MainObj.Scale;
                        $(canvas).css({
                            'left': input.offset().left,
                            'top': input.offset().top
                        })
                        drawErrorAnswer(this.Identifier);
                        $(input).after(canvas);
                    }

                    //undefined表示沒有輸入過
                    if (this.ExamValue == undefined) {
                        this.ExamValue = '';
                    }

                    input[0].value = this.ExamValue + '  Ans:' + this.Answer;

                }

            })

            break;

    }
}

//測驗模式，畫叉叉(X)
function drawErrorAnswer(id) {

    var scale = MainObj.Scale;

    var canvas = $('#' + id)[0];
    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    var img = new Image();
    img.onload = function() {

        img.width = 50 * scale;
        img.height = 50 * scale;

        cxt.drawImage(img, 0, 0, img.width, img.height);
    }
    img.src = 'Resource/errorAnswer.png';

}

//隨機頁數
function getRandomQuiz() {

    var quizRange = BookList.BookInfoList.ExamInfo.RandomQuizRange.split(',');
    var quizCount = quizRange.length - Number(BookList.BookInfoList.ExamInfo.RandomQuizCount);

    //索引直減1
    for (var i = 0; i < quizRange.length; i++) {
        quizRange[i] = Number(quizRange[i]) - 1;
    }

    Quiz.RandomQuizRange = quizRange;
    Quiz.RandomQuizCount = quizCount;

    //取出隨機頁數
    if (quizCount > 0) {
        var number;
        var index;
        for (var j = 0; j < quizCount; j++) {
            number = quizRange[Math.floor(Math.random() * quizRange.length)];
            index = quizRange.indexOf(number);
            quizRange.splice(index, 1);
        }
        quizRange.push(HamaList.length - 1);
    }

    var newList = [];
    for (var page = 0; page < quizRange.length; page++) {
        newList.push(HamaList[quizRange[page]]);
    }

    HamaList = newList;

}





