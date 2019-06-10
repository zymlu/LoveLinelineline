//同步

var messageDataTypeConnectionMessage = 10000; //消息數據類型連接消息
var messageDataTypeScreenSyncMessage = 0; //消息數據類型屏幕同步消息
var messageDataTypeErrorCode = 3; //消息數據類型錯誤代碼
var messageDataTypeBrowserSyncMessage = 9; //消息數據類型瀏覽器同步消息

var bookSyncInfo = {};



function getPackage(vtmp) {

    var str = '',
        total = 0,
        c;
    var tmp = vtmp;

    var packageList = [];
    var onePackage = [];
    var indexLength = 0;


    do {
        var intString = tmp.substr(indexLength, 4);
        removedSize = getInt(intString);
        onePackage = new SyncPackage(tmp.substr(indexLength + 4, removedSize - 4), removedSize - 4);
        packageList.push(onePackage);

        total = total + removedSize;
        indexLength = total;

        onePackage.parse();

    } while (total < tmp.length);

}

//抓取數字
function getInt(intString) {
    var intStringCopy = intString;
    var length = intStringCopy.length;
    var value = 0;

    for (var i = 0; i < length; i++) {
        value = value + Math.pow(256, 3 - i) * intStringCopy.charCodeAt(i);
    }

    return value;
}

//設定封包data
var SyncPackage = function(packageData, packageLength) {
    this.data = packageData; //Package data.
    this.packageLength = packageLength; //Length of package.
    this.messageList = []; //Array of messages.
};

//封包data去做轉換  軒軒
//Extracts the length, type and subpackages of a package received by the server.
SyncPackage.prototype.parse = function() {
    var dataLength = this.packageLength;
    var total = 0;
    var removedSize = 0;
    var indexLength = 0;


    do {
        var stringLength = this.data.substr(indexLength, 4);
        removedSize = getInt(stringLength);

        //console.log('%c' + "parse() stringLength = " + removedSize + " " + indexLength + " --> 4", 'color: #0000ff');


        var stringType = this.data.substr(indexLength + 4, 4);
        var type = getInt(stringType);

        //console.log('%c' + "parse() stringType = " + type + " " + (indexLength + 4) + " --> 4", 'color: #0000ff');


        var dataString = this.data.substr(indexLength + 8, removedSize - 8);

        //console.log('%c' + "parse() dataString size = " + dataString.length + " " + (indexLength + 8) + " --> " + (removedSize - 8), 'color: #0000ff');

        //var message = new MessageItem(removedSize, type);
        var message = new MessageItem(removedSize, type, dataString);
        //var message = new MessageItem(removedSize, type, type);



        message.dataMsg = type;
        message.reparsePackage(dataLength);
        message.reparse();

        this.messageList.push(message);

        total = total + removedSize;
        indexLength = total;

    } while (total < dataLength);


};

//把封包做成message往下傳
var MessageItem = function(length, type, data) {
    this.length = length; //Length of message.
    this.type = type; //Message type.
    this.data = data; //Message data.
    this.dataMsg = 0;
};

//Extracts the length, type and data from a subpackage.
MessageItem.prototype.reparsePackage = function(packageLength) {

    if ((this.type === messageDataTypeConnectionMessage) || (this.type === messageDataTypeScreenSyncMessage) || (this.type === messageDataTypeBrowserSyncMessage)) {

        //messageDataTypeScreenSyncMessage = 0
        //messageDataTypeConnectionMessage = 10000

        var dataLength = this.data.length;
        var total = 0;
        var removedSize = 0;
        var indexLength = 0;

        //console.log("---------------dataLength = " + dataLength);
        //console.log("---------------this.data = " + this.data);


        do {
            var stringLength = this.data.substr(indexLength, 4);
            removedSize = getInt(stringLength);

            //console.log("---------------stringLength = " + indexLength + " to 4");


            var stringType = this.data.substr(indexLength + 4, 4);
            var type = getInt(stringType);

            //console.log("---------------stringType = " + (indexLength+4) + " to 4");



            var dataString = this.data.substr(indexLength + 8, removedSize - 8);


            //console.log("---------------dataString = " + (indexLength + 8) + " to " + (removedSize - 8));
            //console.log("---------------dataString = " + dataString + " len = " + dataString.length);


            // 當sync server已紀錄bookname和其他資料,但回覆的封包對於connectionMessageRequestSyncInfo = 13沒帶任何資料,故由client自行判斷是有帶資料
            if ((type == 13) && (this.type === messageDataTypeConnectionMessage) && (packageLength != 16)) {
                dataString = "have data";
            }
            this.length = removedSize;
            this.type = type;
            this.data = dataString;

            total = total + removedSize;
            indexLength = total;

        } while (total < dataLength);

    } else if (this.type === messageDataTypeErrorCode) {
        //messageDataTypeErrorCode = 3
        var type = getInt(this.data);
        this.type = type;
    }


};

//Handles messages from the server.
MessageItem.prototype.reparse = function() {
    if (this.dataMsg === messageDataTypeConnectionMessage) {
        switch (this.type) {

            case 112: //screenSyncMessageSetSyncState = 112 TODO
                console.log('%c' + "Message from server. Code: " + this.type + " " + getInt(this.data), 'color: #000fff');

                //screenSyncStateNone = 0,//沒有連線            
                //screenSyncStateSender = 1,//發送端(主控)
                //screenSyncStateReceiver = 2,//被控端
                //screenSyncStateNonHost = 3,//沒有主控權
                //screenSyncStateHost = 4,//有主控權

                var value = getInt(this.data.substring(0, 4));

                switch (value) {
                    case 1:
                        bookSyncInfo.UserState = value;
                        break;

                    case 2:
                        bookSyncInfo.UserState = value;
                        break;

                    case 3:
                        bookSyncInfo.userIsHost = false;
                        break;

                    case 4:
                        bookSyncInfo.userIsHost = true;
                        break;

                    case 0:
                        bookSyncInfo.UserState = value;
                        break;
                }

                switch (bookSyncInfo.UserState) {

                    case 0:
                        //換圖
                        checkBtnStatusFroSync('SyncButton');
                        break;

                    case 1:

                        if (bookSyncInfo.userIsHost) {
                            checkBtnStatusFroSync('SenderHost');
                        } else {
                            checkBtnStatusFroSync('Sender');
                        }
                        break;

                    case 2:

                        if (bookSyncInfo.userIsHost) {
                            checkBtnStatusFroSync('ReceiverHost');
                        } else {
                            checkBtnStatusFroSync('Receiver');
                        }

                        break;

                }
                break;

            default:
                console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
                break;
        }
    } else if (this.dataMsg === messageDataTypeScreenSyncMessage) {
        switch (this.type) {
            // case 1001: //screenSyncMessageRetuenBookcase = 1001 TODO
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');


            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         console.log('%c' + "Message from server. Code: bookSyncInfo.bookSN = null" + this.type + " data = " + this.data, 'color: #000fff');
            //         bookSyncInfo.bookSN = null;

            //         //user's sublocation
            //         bookSyncInfo.subUserLocation = null;

            //         //Goto Main
            //         OpendivHall(0);
            //         OpendivRoom(0);
            //         OpendivBook(0);
            //         OpendivMain(1);

            //         //user's location
            //         bookSyncInfo.UserLocation = "atMain";

            //         closeLoadBookMsg();

            //         crossframecmd.set("Index", "screenSyncMessageRetuenBookcase", "");
            //         postMessageToMainFrame(crossframecmd);
            //     }


            //     break;
            // case 1010: //screenSyncMessagePrevPage = 1010   
            // case 1011: //screenSyncMessageNextPage = 1011         
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data + " openBookIsFinished = " + openBookIsFinished, 'color: #ff0fff');

            //     //上下頁

            //     // if (openBookIsFinished == 0) {
            //     //     originpageindex = this.data;
            //     // }

            //     // if (bookSyncInfo.UserLocation != "atRoom") {
            //     //     //closeLoadBookMsg();
            //     //     if ((bookSyncInfo.eBookStyle == 525740) && (bookSyncInfo.isTwoPage == 1)) {

            //     //         var temp = this.data;
            //     //         if ((temp % 2) == 1) {
            //     //             temp++;
            //     //         }

            //     //         pageindex = temp / 2;
            //     //     } else {
            //     //         pageindex = Number(this.data);
            //     //     }
            //     // }

            //     break;

            // case 1012: //screenSyncMessageJumpPage = 1012
            //     console.log('%c' + "Message from server. Code: " + this.type + "data = " + this.data + " openBookIsFinished = " + openBookIsFinished, 'color: #ff0fff');

            //     //跳頁

            //     // if (openBookIsFinished == 0) {
            //     //     originpageindex = this.data;
            //     // }

            //     // if (bookSyncInfo.UserLocation != "atRoom") {
            //     //     //closeLoadBookMsg();
            //     //     if ((bookSyncInfo.eBookStyle == 525740) && (bookSyncInfo.isTwoPage == 1)) {

            //     //         var temp = this.data;

            //     //         if ((temp % 2) == 1) {
            //     //             temp++;
            //     //         }

            //     //         var number = (temp / 2);
            //     //         pageindex = Number(number);
            //     //     } else {
            //     //         pageindex = Number(this.data);
            //     //     }
            //     // }

            //     break;
            // case 1013: //screenSyncMessageScaleMothBoard = 1013
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #ff0fff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         console.log("Index : screenSyncMessageScaleMothBoard " + this.data);
            //         crossframecmd.set("Index", "screenSyncMessageScaleMothBoard", this.data);
            //         postMessageToMainFrame(crossframecmd);
            //     }
            //     break;
            // case 1014: //screenSyncMessageScrollMotherBoard = 1014
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         console.log("Index : screenSyncMessageScrollMotherBoard " + this.data);
            //         crossframecmd.set("Index", "screenSyncMessageScrollMotherBoard", this.data);
            //         postMessageToMainFrame(crossframecmd);
            //     }

            //     break;            
            // case 1000: //screenSyncMessageOpenBook = 1000
            //     console.log('%c' + "Message from server. Code: " + this.type + " " + this.data, 'color: #000fff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         console.log("Index : screenSyncMessageOpenBook " + this.data);

            //         openBookIsFinished = 0;

            //         var comingbooksn = this.data;
            //         if (comingbooksn == bookSyncInfo.bookSN) {
            //             console.log('%c' + "Message from server. Code: " + this.type + " This book has been opened ", 'color: #000fff');

            //             //crossframecmd.set("Index", "screenSyncMessageOpenBook", this.data);
            //             //postMessageToMainFrame(crossframecmd.intoJSON());

            //             //crossframecmd.set("Index", "gotoBookCMD", "");
            //             //postMessageToMainFrame(crossframecmd.intoJSON());


            //         } else {

            //             console.log('%c' + "Message from server. Code: " + this.type + " Open the book " + this.data, 'color: #000fff');

            //             crossframecmd.set("Index", "screenSyncMessageOpenBook", this.data);
            //             postMessageToMainFrame(crossframecmd);
            //         }
            //     }
            //     break;
            // case 200: //screenSyncMessageRequestBookName = 200
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #0f00ff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         var comingbooksn = this.data;
            //         if (comingbooksn == bookSyncInfo.bookSN) {
            //             console.log('%c' + "Message from server. Code: " + this.type + " This book has been opened ", 'color: #000fff');

            //             //crossframecmd.set("Index", "screenSyncMessageOpenBook", this.data);
            //             //postMessageToMainFrame(crossframecmd);

            //             //crossframecmd.set("Index", "gotoBookCMD", "");
            //             //postMessageToMainFrame(crossframecmd);


            //         } else {

            //             console.log('%c' + "Message from server. Code: " + this.type + " Open the book " + this.data, 'color: #000fff');

            //             console.log("Index : screenSyncMessageOpenBook " + this.data);
            //             crossframecmd.set("Index", "screenSyncMessageOpenBook", this.data);
            //             postMessageToMainFrame(crossframecmd);
            //         }
            //     }
            //     break;
            // case 201: // screenSyncMessageRequestPageIndex = 201   
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data + " openBookIsFinished = " + openBookIsFinished, 'color: #0f00ff');

            //     if (openBookIsFinished == 0) {
            //         originpageindex = this.data;
            //     }

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         var temp = Number(this.data);

            //         if (isTwoPages == 1) {

            //             if ((temp % 2) == 1) {
            //                 temp++;
            //             }

            //             temp = temp / 2;
            //         }


            //         if (temp != getPageIndex() + 1) {
            //             console.log("Index : screenSyncMessagePrevPage " + temp);
            //             crossframecmd.set("Index", "screenSyncMessagePrevPage", temp);
            //             postMessageToMainFrame(crossframecmd);

            //             bookSyncInfo.bookpage = temp;
            //         }
            //     }
            //     break;
            // case 203: //screenSyncMessageRequestScaleMothBoard = 203
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #0f00ff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {

            //         requestscale = this.data;

            //         console.log("Index : screenSyncMessageScaleMothBoard " + this.data + " scale = " + requestscale);
            //         crossframecmd.set("Index", "screenSyncMessageScaleMothBoard", this.data);
            //         postMessageToMainFrame(crossframecmd);
            //     }
            //     break;
            // case 204: //screenSyncMessageRequestScrollMotherBoard = 204
            //     console.log('%c' + "Message from server. Code: " + this.type + " scale = " + requestscale + " data = " + this.data, 'color: #0f00ff');


            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         if (requestscale == 1) {
            //             console.log("Index : Since scale =1, don't run screenSyncMessageScrollMotherBoard " + this.data);
            //         } else {
            //             console.log("Index : screenSyncMessageScrollMotherBoard " + this.data);
            //             crossframecmd.set("Index", "screenSyncMessageScrollMotherBoard", this.data);
            //             postMessageToMainFrame(crossframecmd);
            //         }
            //         requestscale = 1;
            //     }

            //     break;
            // case 1016: //screenSyncMessagePlayAnimation = 1016

            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         console.log("Index : screenSyncMessagePlayAnimation " + this.data);
            //         crossframecmd.set("Index", "screenSyncMessagePlayAnimation", this.data);
            //         postMessageToMainFrame(crossframecmd);
            //     }
            //     break;
            // case 206: //screenSyncMessageRequestPlayedAnimations = 206
            //     console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');

            //     if (bookSyncInfo.UserLocation != "atRoom") {
            //         console.log("Index : screenSyncMessageRequestPlayedAnimations " + this.data);
            //         crossframecmd.set("Index", "screenSyncMessageRequestPlayedAnimations", this.data);
            //         postMessageToMainFrame(crossframecmd);
            //     }
            //     break;
            // case 205: //screenSyncMessageRequestScaleAndScrollMotherBoard = 205
            case 1015: //screenSyncMessageScaleAndScrollMotherBoard = 1015
                console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');

                // if (bookSyncInfo.UserLocation != "atRoom") {
                    console.log("Index : screenSyncMessageScaleAndScrollMotherBoard " + this.data);
                    crossframecmd.set("Index", "screenSyncMessageScaleAndScrollMotherBoard", this.data);
                    postMessageToMainFrame(crossframecmd);
                // }
                break;
            case 1101: //screenSyncMessageSyncPageNote = 1101
                //註記
                console.log('%c' + "------Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');
                //console.log('%c' + "------Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');
                // console.log("Index : screenSyncMessageSyncPageNote " + this.data);
                // this.data = this.data.replace(/\n/g, ''); //for iOS change line character
                // this.data = this.data.replace(/\"/g, '\\"');
                crossframecmd.set("Index", "screenSyncMessageSyncPageNote", this.data);
                postMessageToMainFrame(crossframecmd);
                break;
            default:
                console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
                break;
        }
    } else if (this.dataMsg === 5) {
        //messageDataTypeBookSyncMessage = 5
        switch (this.type) {
            case 5:
                //messageDataTypeBookSyncMessage = 5
                console.log('%c' + "Message from server. Code: messageDataTypeBookSyncMessage " + this.type + " data = " + this.data, 'color: #000fff');

                // if (bookSyncInfo.UserLocation != "atRoom") {

                    var tmp = this.data.split(',');

                    if (!((tmp[0] != MainObj.NowPage) && (tmp[2] == "PAUSE"))) {
                        //Adroid app翻頁時會把前一頁的video關閉,若遇到情況不處理

                        console.log("Index : messageDataTypeBookSyncMessage " + this.data);
                        crossframecmd.set("Index", "messageDataTypeBookSyncMessage", this.data);
                        postMessageToMainFrame(crossframecmd);

                    }
                // }

                break;
            default:
                console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
                break;
        }
    } else if (this.dataMsg === 9) {
        //messageDataTypeBrowserSyncMessage = 9
        console.log('%c' + "Message from server. Code: messageDataTypeBrowserSyncMessage " + this.type + " " + this.data, 'color: #000fff');


        // try {


        //     switch (this.type) {
        //         case 1450: //browserSyncMessageOpenBrowser = 1450   
        //             console.log('%c' + "Message from server. Code: browserSyncMessageOpenBrowser ", 'color: #000fff');

        //             if (bookSyncInfo.UserLocation != "atRoom") {
        //                 if (myWindow) {
        //                     myWindow.close();
        //                     myWindow = undefined;
        //                 }

        //                 myWindow = window.open("http://www.ey.gov.tw/");

        //                 if ((myWindow == undefined) || (myWindow == null)) {

        //                     if (IsNetworkfirst == 1) {
        //                         alert("瀏覽器已封鎖另開視窗，請更改瀏覽器設定，允許瀏覽器開新視窗。");
        //                         IsNetworkfirst = 0;
        //                     }
        //                 }

        //                 URL = "http://www.ey.gov.tw/";
        //             }
        //             break;
        //         case 1451: //browserSyncMessageCloseBrowser = 1451

        //             console.log('%c' + "Message from server. Code: browserSyncMessageCloseBrowser ", 'color: #000fff');

        //             if (bookSyncInfo.UserLocation != "atRoom") {

        //                 if (myWindow) {
        //                     myWindow.close();
        //                     myWindow = undefined;
        //                     URL = "undefined";
        //                 }
        //             }
        //             break;

        //         case 1452: //browserSyncMessageNavigateToURL = 1452


        //             if (bookSyncInfo.UserLocation != "atRoom") {

        //                 if (this.data.indexOf('http') != -1) {

        //                     if (myWindow == undefined) {
        //                         myWindow = window.open(this.data);
        //                     } else {
        //                         if ((myWindow.closed === "false") || (!myWindow.closed) || (myWindow.closed == "false")) {
        //                             var urlName = this.data;

        //                             if (URL != this.data) {

        //                                 myWindow.location.replace(urlName);


        //                             }

        //                         } else {

        //                             myWindow = window.open(this.data);

        //                         }

        //                         URL = this.data;
        //                     }
        //                 } else {
        //                     console.log('%c' + "Message from server. Code: browserSyncMessageNavigateToURL Error = " + this.data, 'color: #000fff');
        //                 }
        //             }

        //             break;
        //         case 1400: //browserSyncMessageRequestURL = 1400

        //             console.log('%c' + "Message from server. Code: browserSyncMessageRequestURL ", 'color: #000fff');

        //             if (bookSyncInfo.UserLocation != "atRoom") {

        //                 if (this.data.indexOf('http') != -1) {
        //                     if (myWindow) {
        //                         myWindow.close();
        //                         myWindow = undefined;
        //                     }

        //                     myWindow = window.open(this.data);
        //                 } else {
        //                     console.log('%c' + "Message from server. Code: browserSyncMessageRequestURL Error" + this.data, 'color: #000fff');
        //                 }

        //             }
        //             break;
        //         default:
        //             console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type);
        //             break;
        //     }

        // } catch (err) {


        //     if (IsNetworkfirst == 1) {
        //         alert("瀏覽器已封鎖另開視窗，請更改瀏覽器設定，允許瀏覽器開新視窗。");
        //         IsNetworkfirst = 0;
        //     }
        // }


    } else if (this.dataMsg === 2) {
        //messageDataTypeSetUID = 2
        // switch (this.type) {
        //     case 2:
        //         console.log('%c' + "Message from server. Code: messageDataTypeSetUID  " + this.type + " " + this.data, 'color: #000fff');

        //         //alert("Message from server. Code: messageDataTypeSetUID  " + this.type + " " + this.data);

        //         var userID = this.data;
        //         //Set clientWebsocket.user.UID

        //         if (userID.length == 18) {
        //             var uid1 = userID.slice(0, userID.length / 2);
        //             var uid2 = userID.slice(userID.length / 2, userID.length);
        //             //clientWebsocket.user.setUID(uid1, uid2);
        //         } else {
        //             var uid1 = -1;
        //             var uid2 = userID;
        //             clientWebsocket.user.setUID(uid1, uid2);
        //         }
        //         break;
        //     default:
        //         console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type);
        //         break;
        // }

    } else if (this.dataMsg === 3) {
        //messageDataTypeErrorCode = 3
        //Set system is error
        // bookSyncInfo.isSystemError = 1;

        // switch (this.type) {
        //     case 7:
        //         console.log('%c' + "Message from server. noSuchRoomAvailable " + this.type + " " + this.data, 'color: #000fff');

        //         console.log("Index : noSuchRoomAvailableError ");
        //         crossframecmd.set("Index", "noSuchRoomAvailableError", "");
        //         postMessageToMainFrame(crossframecmd);




        //         break;
        //     default:
        //         console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type);
        //         break;
        // }

        // bookSyncInfo.isRunBtnSyncConnection = 0;


    } else if (this.dataMsg === 11) {
        //messageDataTypeScalAndScrollMotherBoard = 11
        // switch (this.type) {
        //     case 11: //messageDataTypeScalAndScrollMotherBoard = 11
        //         console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data + " openBookIsFinished = " + openBookIsFinished, 'color: #000fff');


        //         if (openBookIsFinished == 0) {
        //             originscalescrolldata = this.data;
        //         }

        //         console.log("Index : screenSyncMessageScaleAndScrollMotherBoard " + this.data);
        //         crossframecmd.set("Index", "screenSyncMessageScaleAndScrollMotherBoard", this.data);
        //         postMessageToMainFrame(crossframecmd);


        //         break;
        //     default:
        //         console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
        //         break;
        // }
    } else if (this.dataMsg === 8) {
        //messageDataTypeBookPageIndex 8
        //跳頁
        switch (this.type) {
            case 8: //messageDataTypeBookPageIndex = 8
                // console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data + " openBookIsFinished = " + openBookIsFinished, 'color: #000fff');

                // if (openBookIsFinished == 0) {
                //     originpageindex = this.data;
                // }

                var temp = Number(this.data);

                // if (MainObj.IsTwoPage) {

                //     if ((temp % 2) == 1) {
                //         temp++;
                //     }

                //     temp = temp / 2;
                // }

                if (temp != MainObj.NowPage) {
                    console.log("Index : screenSyncMessagePrevPage " + temp);
                    crossframecmd.set("Index", "screenSyncMessagePrevPage", temp);
                    postMessageToMainFrame(crossframecmd);

                    // bookSyncInfo.bookpage = temp;

                }

                break;
            default:
                console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
                break;
        }
    } else if (this.dataMsg === 10) {
        //messageDataTypePlayedAnimations = 10
        // switch (this.type) {
        //     case 10: //messageDataTypePlayedAnimations = 10
        //         console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');

        //         if (openBookIsFinished == 0) {
        //             originanimation = this.data;
        //         }

        //         console.log("Index : screenSyncMessageRequestPlayedAnimations " + this.data);
        //         crossframecmd.set("Index", "screenSyncMessageRequestPlayedAnimations", this.data);
        //         postMessageToMainFrame(crossframecmd);


        //         break;
        //     default:
        //         console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
        //         break;
        // }
    } else if (this.dataMsg === 14) {
        //messageDataTypeBrowserURL = 14


        // try {

        //     switch (this.type) {
        //         case 14: //messageDataTypeBrowserURL = 14,
        //             console.log('%c' + "Message from server. Code: " + this.type + " data = " + this.data, 'color: #000fff');

        //             if (this.data.indexOf('http') != -1) {

        //                 if (myWindow == undefined) {

        //                     myWindow = window.open(this.data);

        //                     if ((myWindow == undefined) || (myWindow == null)) {

        //                         if (IsNetworkfirst == 1) {
        //                             alert("瀏覽器已封鎖另開視窗，請更改瀏覽器設定，允許瀏覽器開新視窗。");
        //                             IsNetworkfirst = 0;
        //                         }
        //                     }

        //                 } else {
        //                     if ((myWindow.closed === "false") || (!myWindow.closed) || (myWindow.closed == "false")) {
        //                         var urlName = this.data;

        //                         if (URL != this.data) {
        //                             myWindow.location.replace(urlName);
        //                         }
        //                     } else {
        //                         myWindow = window.open(this.data);
        //                     }

        //                     URL = this.data;
        //                 }

        //             } else {
        //                 console.log('%c' + "Message from server. Code: " + this.type + " Error data = " + this.data, 'color: #000fff');

        //             }

        //             break;
        //         default:
        //             console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
        //             break;
        //     }


        // } catch (err) {


        //     if (IsNetworkfirst == 1) {
        //         alert("瀏覽器已封鎖另開視窗，請更改瀏覽器設定，允許瀏覽器開新視窗。");
        //         IsNetworkfirst = 0;
        //     }
        // }

    } else if (this.dataMsg === 1) {
        //messageDataTypeBookName = 1
        switch (this.type) {
            case 1:
                // console.log('%c' + "Message from server. Code: messageDataTypeBookName  " + this.type + " " + this.data + " " + pageindex, 'color: #000fff');

                // if (bookSyncInfo.UserLocation != "atRoom") {
                //     if (pageindex != -1) {

                //         var comingbooksn = this.data;
                //         if (comingbooksn == bookSyncInfo.bookSN) {
                //             console.log('%c' + "Message from server. Code: " + this.type + " This book has been opened ", 'color: #000fff');



                //             if (pageindex != getPageIndex() + 1) {

                //                 console.log("Index : screenSyncMessagePrevPage " + pageindex);
                //                 crossframecmd.set("Index", "screenSyncMessagePrevPage", pageindex);
                //                 postMessageToMainFrame(crossframecmd);
                //             }



                //         } else {

                //             console.log('%c' + "Message from server. Code: " + this.type + " Open the book " + this.data, 'color: #000fff');

                //             openBookIsFinished = 0;

                //             // console.log("Index : screenSyncMessageOpenBook " + this.data);
                //             crossframecmd.set("Index", "screenSyncMessageOpenBook", this.data);
                //             postMessageToMainFrame(crossframecmd);


                //         }




                //         pageindex = -1;

                //     } else {
                //         var comingbooksn = this.data;
                //         if (comingbooksn != bookSyncInfo.bookSN) {

                //             console.log('%c' + "Message from server. Code: " + this.type + " Open the book " + this.data, 'color: #000fff');


                //             openBookIsFinished = 0;

                //             console.log("Index : screenSyncMessageOpenBook " + this.data);
                //             crossframecmd.set("Index", "screenSyncMessageOpenBook", this.data);
                //             postMessageToMainFrame(crossframecmd);
                //         }
                //     }
                // }

                break;
            default:
                console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
                break;
        }

    } else {
        console.log("Unhandled message from server. Code: dataMsg = " + this.dataMsg + " type = " + this.type + " data = " + this.data);
    }
};



