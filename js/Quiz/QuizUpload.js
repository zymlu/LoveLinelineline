//測驗上傳





//取得密碼(站台)
function getUserPW() {

    if ((location.href).indexOf("file://") == -1) {

        var domain = document.location.protocol + '//' + document.domain;
        var sessionURL = '/webservice/SessionService.asmx/GetPwd';

        $.ajax({
            type: "GET",
            url: domain + sessionURL,
            dataType: "xml",
            async: false,
            //成功接收的function
            success: function(xml) {
                
                //IE不吃innerHTML這個參數
                // Exam.PassWord = xml.documentElement.innerHTML;
                Exam.PassWord = xml.documentElement.textContent;

                console.log("=====Login success=====");

            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log("=====Login error=====");
                // IsLogin = false;

            }
        });
    }
}

//送出答案
function sendQuizLogin() {

    (function ($) {
      $.UrlParam = function (name) {
        //宣告正規表達式
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        /*
         * window.location.href 獲取URL ?之後的參數(包含問號)
         * substr(1) 獲取第一個字以後的字串(就是去除掉?號)
         * match(reg) 用正規表達式檢查是否符合要查詢的參數
        */
        var r = window.location.href.substr(1).match(reg);
        //如果取出的參數存在則取出參數的值否則回傳null
        if (r != null) return unescape(r[2]); return null;
      }
    })(jQuery);
    /*
     *UrlParam取得網址參數需帶入參數名稱
     *UrlParam(參數名稱)
     */
    Exam.LoginID = $.UrlParam('LoginID'); //登入帳號
    console.log('LoginID: ' + Exam.LoginID);

    Exam.FileName = $.UrlParam('FileName'); //書名
    console.log('FileName: ' + Exam.FileName);

    if (Exam.LoginID == null || Exam.PassWord == null) {

        alert('上傳失敗');
        return;
    }

    var data = "<UserData><LoginID>" + Exam.LoginID + "</LoginID><PassWord>" + Exam.PassWord + "</PassWord><Token></Token></UserData>";
    // console.log(data);

    var domain = document.location.protocol + '//' + document.domain;
    var accountURL = '/webservice/AccountService.asmx/MobileLoginByString';

    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: domain + accountURL,
        //要傳過去的值
        data: "doc=" + data,
        dataType: "xml",
        //成功接收的function
        success: function(oXml, xhr) {
            // IE不吃innerHTML這個參數
            // var successType = oXml.documentElement.innerHTML;
            var successType = oXml.documentElement.textContent;

            console.log("=====QuizLogin success=====");
            console.log("Login ? " + successType);

            // IE不吃innerHTML這個參數
            // if (oXml.documentElement.innerHTML == "1") {
            if (oXml.documentElement.textContent == '1') {

                // IsLogin = true;
                QuizUpload();


            } else {
                // IsLogin = false;

                console.log("oXml log: " + successType);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("=====QuizLogin error=====");
            IsLogin = false;

        }
    });

}

//測驗上傳
function QuizUpload() {

    var serverURL = document.location.protocol + '//' + document.domain;
    var examURL = '/webservice/EbookExamServiceH5.asmx/insertMobileEbookExamByString';

    console.log("serverURL: " + serverURL);
    var data = Record_parseXMLq();
    // var loginInfo = document.getElementById("QuizState");

    // loginInfo.style.color = "#3498DB";
    // loginInfo.innerText = "紀錄上傳中...";

    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: serverURL + examURL,
        //要傳過去的值
        data: "doc=" + data,
        dataType: "xml",
        //成功接收的function
        success: function(oXml, xhr) {
            // IE不吃innerHTML這個參數
            // var successType = oXml.documentElement.innerHTML;
            var successType = oXml.documentElement.textContent;

            if (successType == "true") {
                console.log("successType == true");
                alert('上傳成功!!!');
                // IsUpload = true;


            } else {
                // loginInfo.style.color = "#e74c3c";
                // loginInfo.innerText = "上傳失敗 1!!";
                alert('上傳失敗!!!');
                console.log("oXml log: " + successType);

            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("=====QuizUpload error=====");


        }

    });
}

//將Record A、B、C 轉成 XML 字串
function Record_parseXMLq() {
    var temp = '';

    var x2js = new X2JS();

    var jsonObj = {
        AllRecord: {
            '_Type': 'SimMAGIC ACRecFiles',
            Record_A: RecordA_toXML_Quiz(),
            Record_B: RecordB_toXML_Quiz(),
            Record_C: RecordC_toXML_Quiz(),
            InteractionObjectGroupList: Group_toXML()
        }
    };

    var xmlAsStr = x2js.json2xml_str(jsonObj).replace(/'/g, '"');

    return xmlAsStr; //站台改為讀String
}

//將Record_A組成JSON
function RecordA_toXML_Quiz() {

    var jsonObj = {
        DocumentElement: {
            'LoginID': Exam.LoginID,
            'PassWord': Exam.PassWord,
            'LoginName': '',
            'MaterialID': Exam.FileName + '.html5',
            'StartTime': Quiz.StartTime,
            'EndTime': Quiz.EndTime,
            'Status': 'Y',
            'CourseID': '5256',
            'TotalCount': Exam.TotalCount,
            'ErrorCount': Exam.ErrorCount,
            'TotalScore': Exam.TotalScore,
            'Score': Exam.QuizScore
        }
    };

    return jsonObj;
}

//將Record_B組成JSON
function RecordB_toXML_Quiz() {

    var jsonObj = {
        DocumentElement: {
            SimMAGIC: []
        }
    };

    for (var page = 0; page < HamaList.length; page++) {

        if (HamaList[page].ExamType == 'Connector') { //連連看

            var count = 0;
            $(Quiz.Choose).each(function() {

                if (this.Type == 'Connector' && this.Page == page) {

                    var list = {
                        '_OperationID': newguid(),
                        '_StepSequenceNumber': count,
                        StepID: page,
                        StepName: HamaList[page].PageTitle,
                        KeyName: '',
                        InputAns: '',
                        Answer: this.Answer,
                        StepTime: '1',
                        LoginID: Exam.LoginID,
                        RecordTime: Quiz.EndTime,
                        HasActionItem: '',
                        FromIdentifier: this.fromID,
                        ToIdentifier: this.toID,
                        ConnectorIdentifier: '',
                        Direction: ''
                    }

                    jsonObj.DocumentElement.SimMAGIC.push(list);
                }
            })

        } else if (HamaList[page].ExamType != undefined) {

            for (var i = 0; i < HamaList[page].Objects.length; i++) {

                var obj = HamaList[page].Objects[i];

                if (obj.ExamType != undefined) {
                    var list = {
                        '_OperationID': newguid(),
                        '_StepSequenceNumber' : i,
                        StepID: page,
                        StepName: HamaList[page].PageTitle,
                        KeyName: '',
                        InputAns: '',
                        Answer: obj.ExamAnswer,
                        StepTime: '1',
                        LoginID: Exam.LoginID,
                        RecordTime: Quiz.EndTime,
                        HasActionItem: '',
                        FromIdentifier: '',
                        ToIdentifier: '',
                        ConnectorIdentifier: '',
                        Direction: ''
                    }

                    jsonObj.DocumentElement.SimMAGIC.push(list);
                }
            }
        }
    }

    return jsonObj;
}

//將Record_C組成JSON
function RecordC_toXML_Quiz() {

    var jsonObj = {
        DocumentElement: {
            SimMAGIC: []
        }
    };

    var quizNum = 0;

    $(Quiz.Choose).each(function() {

        if (this != undefined) {
            quizNum++;

            var list = {
                '_OperationID': this.ID,
                '_StepSequenceNumber': quizNum,
                StepID: this.Page, //頁數
                StepName: '一個輸入程序描述',
                KeyName: '',
                InputAns: '',
                Answer: this.Answer,
                StepTime: '1',
                LoginID: Exam.LoginID,
                RecordTime: this.RecordTime,
                HasActionItem: ''
            }
        }

        jsonObj.DocumentElement.SimMAGIC.push(list);
    })

    return jsonObj;
}

//將測驗計分群組組成JSON
function Group_toXML() {

    var jsonObj = {
        Group: []
    };

    for (var page = 0; page < HamaList.length; page++) {

        if (HamaList[page].GroupList != undefined) {

            var list = {
                '_StepID': page,
                '_Name': HamaList[page].GroupList.Name,
                '_Identifier': HamaList[page].GroupList.Identifier,
                '_Point': HamaList[page].GroupList.Point,
                '_Record': HamaList[page].GroupList.Record,
                '_FormatterType': HamaList[page].GroupList.GroupType,
                GroupObject: []
            }

            if (HamaList[page].ExamType == 'Touch' || HamaList[page].ExamType == 'Input') {

                if (!HamaList[page].GroupList.length) {
                    HamaList[page].GroupList = [HamaList[page].GroupList];
                }
                HamaList[page].GroupList.map(function(res) {
                    if (res.GroupObject.length == undefined) {
                        res.GroupObject = [res.GroupObject];
                    }
    
                    for (var i = 0; i < res.GroupObject.length; i++) {
    
                        var groupObj = {
                            '_Identifier': res.Identifier
                        }
    
                        list.GroupObject.push(groupObj);
                    }
                });
            }

            jsonObj.Group.push(list);
        }
    }

    return jsonObj;
}






