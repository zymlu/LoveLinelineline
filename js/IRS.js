//IRS
// 是非題:1、單選題:2、複選題:3、簡答題:4、原畫面答題:5

var IRS = {
    Type: null, //記錄測驗題型
    StuOXAnswer: null, //記錄學生是非題的答案
    StuChoiceAnswer: [false, false, false, false, false, false], //記錄學生選擇題的答案
    Interval: null
}

var Recoding = {
    SaveList: []
}


//IRS註記重置
function IRSinit() {
    //刪除IRS的註記
    $('.IRSpen').remove();
    $('.IRScanvas').remove();
    $('.IRSnote').remove();
    $('.InsertImg').remove();

    colorPen.IRSList = [];
}

//題目送出後顯示選擇答題方式的視窗
function IRStype() {

    $('#IRS_Div').toggle();
    $('#ToolBar').toggle();

    changeIRSBtnToFalse();
    changeAllBtnToFalse();

    $('.IRS_typeBG').css('display', 'block');

}

//答題方式click事件
function IRStypeClick(type) {
    // console.log(type.id);
    $('.IRS_typeBG').css('display', 'none');

    $(IRSexam).each(function() {
        if (this.id == type.id) {
            IRS.Type = Number(type.id);
            IRSlistSet();
        }
    })
}

//IRS關閉按鈕
function IRS_cancel() {
    $('.IRS_exam').css('display', 'none');
    $('.stuBtn').remove();
    $('.stuBtnFocus').remove();
    $('.PrtScrn').remove();
    $('#whiteboard').remove();

    IRSinit();
    GalleryStartMove();

    $('#ToolBar').css('display', 'block');

    IRS.Type = null;
    clearInterval(IRS.Interval);
    IRS.Interval = null;
    StudentList = null;
    StudentImage = null;
    StudentNoAnswer = 0;
    StudentAnswerLength = 0;
    $('#answerYes_count')[0].innerText = 0; //已作答人數
    $('#answerNo_count')[0].innerText = 0;  //未作答人數
}

//IRS收合展開按鈕
function IRS_zoom() {
    if ($('.IRS_exam').css('bottom') == '0px') {
        $('.IRS_exam').css('bottom', '-160px');

        $('.IRS_zoom').css('background', 'url(\"IRS/Expansion.png\") center no-repeat, linear-gradient(dimgray, black, dimgray)');

    } else {
        $('.IRS_exam').css('bottom', '0px');

        $('.IRS_zoom').css('background', 'url(\"IRS/Collapse.png\") center no-repeat, linear-gradient(dimgray, black, dimgray)');
    }
}

//老師公佈答案
function IRS_answer() {
    switch (IRS.Type) {

        //是非
        case 1:
            var btn = [{'text': 'O'}, {'text': 'X'}];
            AnswerBtnSet(btn);
            break;

        //單選、複選
        case 2:
        case 3:
            var btn;
            $(IRSexam).each(function() {
                if (IRS.Type == this.id) {
                    btn = this.answer;
                }
            })
            AnswerBtnSet(btn);
            break;

        //簡答、原畫面作答
        case 4:
        case 5:
            AnswerWatchSet();
            break;
    }
}

//配置答案的按鈕
//是非題(O、X)、單選題(1-6)、複選題(1-6)
function AnswerBtnSet(btn) {

    $('.IRS_exam').css('display', 'none');
    $('.stu_btn').remove();

    $('#IRS_answer').css('display', 'block');
    $(btn).each(function() {
        var that = this;
        var input = document.createElement('input');
        
        $(input).attr({ 'type': 'button', 'value': that.text })
        $(input).css( 'width', (100/btn.length) + '%' )

        //單選
        //按鈕點擊是用focus去改變背景圖
        if (IRS.Type == 2) {
            $(input).addClass('ChoiceBtn');
            $(input).addClass('SingleChoiceBtn' + that.text);
            $(input).focus(function() {
                IRS.StuChoiceAnswer = [false, false, false, false, false, false];
                IRS.StuChoiceAnswer[Number(this.value) - 1] = true;
            });

        //複選
        //是用class(MultipleClickBtn)來換背景圖
        } else if (IRS.Type == 3) {
            $(input).addClass('ChoiceBtn');
            $(input).addClass('MultipleChoiceBtn' + that.text);
            $(input).click(function(e) {
                e.preventDefault();
                if ($('.MultipleClickBtn' + that.text)[0] == undefined) {
                    $(input).addClass('MultipleClickBtn' + that.text);
                    IRS.StuChoiceAnswer[Number(that.text) - 1] = true;
                } else {
                    $(input).removeClass('MultipleClickBtn' + that.text);
                    IRS.StuChoiceAnswer[Number(that.text) - 1] = false;
                }
            })

        //是非
        //按鈕點擊是用focus去改變背景圖
        } else {
            $(input).addClass('OXBtn');
            $(input).focus(function() {
                IRS.StuOXAnswer = this.value;
            });
        }

        $('#IRS_answer_list').append(input);
    })
}

//開啟作答觀摩視窗
function AnswerWatchSet() {
    if ($('.clickBorder').length > 0) {

        var list = [];

        $('#IRS_watch').css({
            'display': 'block',
            'width': $(window).width(),
            'height': $(window).height()
        })

        $($('.clickBorder')).each(function() {
            var UserID = $(this).attr('id');
            list.push(UserID);
        })

        list = list.join(';');

        GetAnswerChoiceList(list);
        
    } else {
        BookAlertShow('尚未選擇任何學生');
    }
}

//四分割畫面左上角button
function WatchBtnSet(span, canvas, list) {
    var btn = document.createElement('input');
    $(span).append(btn);

    $(btn).attr({
        'id': list.UserName,
        'class': 'watch4canvas_btn',
        'type': 'button',
        'value': list.UserName,
    })

    $(btn).click(function(e) {
        e.preventDefault();
        if ($(canvas).attr('class') == 'stuAnswerCanvas') {
            $(canvas).attr('class', 'stuAnswerCanvasZoomIn');
            $('.stuAnswerCanvas').css('display', 'none');
        } else {
            $('.stuAnswerCanvas').css('display', 'inline-block');
            $(canvas).attr('class', 'stuAnswerCanvas');
            $(canvas).css('position', 'relative');
        }
    })
}

//作答觀摩返回
function AnswerWatchClose() {
    $('#IRS_watch').css('display', 'none');
    $('.stuAnswerCanvas').remove();
    $('.watch4canvas_btn').remove();
}

//設置學生清單
function IRSlistSet() {

    //IRS畫面截圖
    html2canvas($('#HamastarWrapper'), {
        allowTaint: true,
        taintTest: false,
        onrendered: function(canvas) {
            canvas.id = "mycanvas";

            NewCanvas();
            var canvasAns = $('#canvas')[0];
            var cxtAns = canvasAns.getContext('2d');
            canvasAns.width = $(window).width();
            canvasAns.height = $(window).height();
            $(canvasAns).attr('class', 'PrtScrn');

            UploadTeacherQuestionForHtml5(canvas.toDataURL());
            GetQuestionImageQAType();

            var imgAns = new Image();
            imgAns.onload = function() {
                cxtAns.drawImage(imgAns, 0, 0);
            }
            imgAns.src = StudentImage[2];

        }
    });

    $('.IRS_exam').css('display', 'block');

    //從後臺接收到的學生存在StudentList
    StudentList = null;
    GetStudent();

    var list = StudentList;

    $('#answerAll_count')[0].innerText = list ? list.length : 0; //應答人數

    //簡答題和原畫面作答是 '作答觀摩'
    if (IRS.Type == 4 || IRS.Type == 5) {
        $('.IRS_Answer')[0].value = '作答觀摩';
    } else {
        $('.IRS_Answer')[0].value = '公佈答案';
    }

    $(list).each(function() {
        
        var btn = document.createElement('input');
        $('.IRS_student').append(btn);

        $(btn).attr({
            'id': this.UserID,
            'class': 'stuBtn',
            'type': 'button',
            'value': this.UserName
        })

        //簡答題和原畫面作答選擇要觀摩的學生
        //觀摩視窗是四分割，所以最多選四個學生
        if (IRS.Type == 4 || IRS.Type == 5) {
            $(btn).click(function(e) {
                e.preventDefault();
                if ($(this).attr('class') == 'stuBtnFocus' && $('.clickBorder').length < 4) {
                    $(this).addClass('clickBorder');
                } else {
                    $(this).removeClass('clickBorder');
                }
            })
        }
    })

    //取得答題及未答題的學生
    // GetStudentNoAnswerList();
}

//學生開啟隨堂測驗視窗
function dialogQuizOpen() {
    $('#dialogStudentQuiz').css('display', 'block');
}

//學生開始作答
function StudentQuizStart() {
    isIRS = true;

    $('#dialogStudentQuiz').css('display', 'none');
    $('#ToolBar').css('display', 'none');

    //接收後台考卷畫上canvas
    NewCanvas();
    var canvas = $('#canvas')[0];
    canvas.id = 'answerCanvas';
    canvas.width = $(window).width();
    canvas.height = $(window).height() - 50;
    $(canvas).attr('class', 'answerCanvas');
    // $('#Gallery').before(canvas);
    $(canvas).css('pointer-events', 'none');

    //取得題型跟圖片
    GetQuestionImageQAType();
    // alert(StudentImage);

    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', StudentImage[2], true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e) {
        try {
            var uInt8Array = new Uint8Array(this.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--) {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');

            var dataURL = "data:image/png;base64," + btoa(data);
            Html5WirteLog(dataURL);
        } catch(e) {
            Html5WirteLog(e);
        }

        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous')  //跨域圖片屬性設置
        img.onload = function() {
            cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
        }
        img.src = dataURL;
    
        IRS.Type = Number(StudentImage[1]);
    
        GalleryStopMove();
    
        switch (StudentImage[1]) {
    
            //是非
            case '1':
                var btn = [{'text': 'O'}, {'text': 'X'}];
                AnswerBtnSet(btn);
                break;
    
            //單選、複選
            case '2':
            case '3':
                var btn;
                $(IRSexam).each(function() {
                    if (IRS.Type == this.id) {
                        btn = this.answer;
                    }
                })
                AnswerBtnSet(btn);
                break;
    
            //簡答
            case '4':
                ShortAnswerOpen(canvas);
                break;
    
            //原畫面作答
            case '5':
                $('#IRS_OriginalQuiz').css('display', 'block');
    
                break;
    
        }
    };
    xmlHTTP.send();
    
}

//學生開啟簡答題視窗
function ShortAnswerOpen(canvas) {
    $('#DivShortAnswer').css({
        'display': 'block',
        'position': 'absolute',
        'width': $('#CanvasGallery').width(),
        'height': $('#CanvasGallery').height(),
        'left': MainObj.CanvasL,
        'top': MainObj.CanvasT
    });

    $(canvas).attr('class', 'ShortAnswerCanvas');
    $('#DivShortAnswer span').append(canvas);
}

//學生回答簡答題
function StudentShortAnswer() {
    var ans = $('#ShortAnswer')[0].value;
    UploadStudentAnswer(ans);

    $('#DivShortAnswer').css('display', 'none');
    $('.ShortAnswerCanvas').remove();
    $('#ShortAnswer')[0].value = '';
    $('#ToolBar').css('display', 'block');
}

//答題確定(是非、單選、複選)
function StudentAnswer() {

    $('#ToolBar').css('display', 'block');
    $('#IRS_answer').css('display', 'none');
    $('.answerCanvas').remove();
    $('.PrtScrn').remove();
    $('#whiteboard').remove();

    IRSinit();
    GalleryStartMove();

    var ans;

    switch (IRS.Type) {
        case 1:
            ans = IRS.StuOXAnswer;
            $('.OXBtn').remove();
            break;

        case 2:
        case 3:
            var list = [];
            for (var i = 0; i < IRS.StuChoiceAnswer.length; i++) {
                if(IRS.StuChoiceAnswer[i]) {
                    list.push(i + 1);
                }
            }
            ans = list;
            $('.ChoiceBtn').remove();
            break;
    }

    if (ReceiveList.UserRole == 1) {
        UploadStudentAnswer(ans);
    } else {
        UploadCorrectAnswer(ans);
    }
}

// 取得學生答題答案  (單選：1 : 若複選用逗點區隔 ：1,2,3 ; O,X以7,8取代)
function GetAnswerNumber(ans) {
    if (ans != null) {
        var ansNum = '';
        switch (ans) {
            case 'O':
                ansNum = '7';
                break;

            case 'X':
                ansNum = '8';
                break;

            default:
                ansNum = ans.join();
        }
        return ansNum;
    } else {
        //未選擇答案，回傳空字串
        return '';
    }
}

//儲存錄音的資訊於Recording.SaveList
function SaveRecording() {

    var list = {};
    var note = $('.RecodingImg');

    if (Recoding.SaveList.length > 0) {
        for (var x = 0; x < Recoding.SaveList.length; x++) {
            if (Recoding.SaveList[x] != undefined) {
                if (Recoding.SaveList[x].page == MainObj.NowPage) {
                    delete Recoding.SaveList[x];
                }
            }
        }
    }

    for (var i = 0; i < note.length; i++) {
        list = {
            page: MainObj.NowPage,
            id: note[i].id,
            type: 'Recoding',
            width: 50,
            height: 50,
            top: $(note[i]).css('top'),
            left: $(note[i]).css('left')
        }
            
        Recoding.SaveList.push(list);
    }
}




