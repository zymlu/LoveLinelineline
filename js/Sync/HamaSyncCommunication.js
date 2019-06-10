//Mainframe get data from index.aspx 
function displayMessage(evt) {
    var message;

   
    //Return the message string to an object
    // var messageObject = JSON.parse(evt);
    var messageObject = evt;


    message = "MainFrame got " + messageObject.data ;
    console.log(message);


    if (messageObject.from == "Index") {

        if (messageObject.command == "screenSyncMessageGetAllUserInfo") {

            // console.log("MainFrame : screenSyncMessageGetAllUserInfo");

            // console.log("HSConnectIndex_screenSyncMessageGetAllUserInfo userIsHost = " + bookSyncInfo.userIsHost + " UserState = " + bookSyncInfo.UserState + " curRoom = " + bookSyncInfo.curRoom + " isConnected = " + bookSyncInfo.isConnected + " bookSyncInfo.UserLocation = " + bookSyncInfo.UserLocation);
            // console.log("HSConnectIndex_screenSyncMessageGetAllUserInfo bookSyncInfo.bookSN = " + bookSyncInfo.bookSN + " bookSyncInfo.isRequestReconnection = " + bookSyncInfo.isRequestReconnection);


            // //Update user's location
            // if ((bookSyncInfo.userIsHost == "false") && (bookSyncInfo.bookSN != "null")) {
            //     //user's location
            //     console.log(" gotoRoom-----bookSyncInfo.UserLocation = openBook  bookSyncInfo.bookSN = " + bookSyncInfo.bookSN);
            //     bookSyncInfo.UserLocation = "openBook";
            // }

            // changeSyncConnectionImg();

            // if (bookSyncInfo.bookSN == "null") {


            //     //for EYMeetingHub
            //     if ((bookSyncInfo.userIsHost == "false") && (bookSyncInfo.UserState == "2") && (bookSyncInfo.curRoom != "null") && (bookSyncInfo.isConnected == "true")) {

            //         console.log("HSConnectIndex_screenSyncMessageGetAllUserInfo : the user isn't host. Show Main");


            //         console.log("0-------MainFrame : screenSyncMessageGetAllUserInfo At Main");
                    

            //         //Close Hall
            //         divHall_hide();

            //         //Close Room
            //         divRoom_hide();

            //         //Close Book
            //         divBook_hide();


            //         //Open Syncdefault.html
            //         var ID = "#guidline";
            //         //var scr = "SyncDefault.htm";
            //         var scr = mainPageSrc;
            //         $(ID).attr("src", scr);


            //         //user's location
            //         bookSyncInfo.UserLocation = "atMain";


            //         //Open Main
            //         divMain_show();


            //         if ((bookSyncInfo.UserState == "2") && (bookSyncInfo.isConnected == "true")) {

            //             console.log("Send screenSyncMessageRequestBookName");
            //             crossframecmd.set("MainFrame", "screenSyncMessageRequestBookName", "none");
            //             sendMessageBack(crossframecmd.intoJSON());

            //             /*
            //             console.log("Send browserSyncMessageRequestURL");
            //             crossframecmd.set("MainFrame", "browserSyncMessageRequestURL", "none");
            //             sendMessageBack(crossframecmd.intoJSON());
            //             */

            //             console.log("Send screenSyncMessageRequestScaleAndScrollMotherBoard ");
            //             crossframecmd.set("MainFrame", "screenSyncMessageRequestScaleAndScrollMotherBoard", "");
            //             sendMessageBack(crossframecmd.intoJSON());

            //             console.log("Send screenSyncMessageRequestPlayedAnimations");
            //             crossframecmd.set("MainFrame", "screenSyncMessageRequestPlayedAnimations", "");
            //             sendMessageBack(crossframecmd.intoJSON());

            //             console.log("Send connectionMessageRequestSyncInfo");
            //             crossframecmd.set("MainFrame", "connectionMessageRequestSyncInfo", "");
            //             sendMessageBack(crossframecmd.intoJSON());



            //         }


            //     } else {


            //         if ((bookSyncInfo.UserLocation == "atRoom") && (bookSyncInfo.userIsHost == "true")) {
            //             //if(bookSyncInfo.userIsHost == "true") {

            //             console.log("HSConnectIndex_screenSyncMessageGetAllUserInfo : the user ist host and location is at room. Show Room");


            //             console.log("1-------MainFrame : screenSyncMessageGetAllUserInfo At Room");
                        
            //             isPassedOpenBookCmd = 0;

            //             //close Meeting Hall
            //             divHall_hide();

            //             $('#halllist h1').html(bookSyncInfo.curRoomName);
            //             $('#userlist').empty();
            //             $('#userlist').append(addRoomTitle() + messageObject.data);

            //             //Open Room
            //             gotoRoom();
            //         } else {

            //             console.log("HSConnectIndex_screenSyncMessageGetAllUserInfo : the user ist host and location is'not at room. Show Main");

            //             console.log("2-------MainFrame : screenSyncMessageGetAllUserInfo At Main");
                        
            //             isPassedOpenBookCmd = 0;


            //             //Close Hall
            //             divHall_hide();

            //             //Close Room
            //             divRoom_hide();

            //             //Close Book
            //             divBook_hide();

            //             var ID = "#guidline";
            //             var scr = "SyncDefault.htm";

            //             if (bookSyncInfo.UserState == "2") {

            //                 //scr = "SyncDefault.htm";
            //                 scr = mainPageSrc;
            //             } else {

            //                 scr = mainPageSrc;
            //             }


            //             $(ID).attr("src", scr);

            //             //Open Main
            //             divMain_show();

            //         }

            //     }
            // } else {

            //     console.log("3-------MainFrame : screenSyncMessageGetAllUserInfo At Room bookSyncInfo.UserState = " + bookSyncInfo.UserState + " isSendChnageControllerCMDatRoom = " + bookSyncInfo.isSendChnageControllerCMDatRoom + " isSendUserInfoCMD = " + bookSyncInfo.isSendUserInfoCMD);



            //     console.log("MainFrame : updateSyncStatusAtBook ");
            //     crossframecmd.set("MainFrame", "updateSyncStatusAtBook", "");
            //     postMessageToBookFrame(crossframecmd);

            //     $('#halllist h1').html(bookSyncInfo.curRoomName);
            //     $('#userlist').empty();
            //     $('#userlist').append(addRoomTitle() + messageObject.data);

            //     if ((bookSyncInfo.UserState == 1) && (bookSyncInfo.isSendChnageControllerCMDatRoom == 1)) {

            //         bookSyncInfo.isSendChnageControllerCMDatRoom = 0;

                    
                    
            //         var bookSN = bookSyncInfo.bookSN;
            //         console.log("Master MainFrame : openBookName = " + bookSN);
            //         crossframecmd.set("MainFrame", "screenSyncMessageOpenBook", bookSN);
            //         sendMessageBack(crossframecmd.intoJSON());
                    

            //         console.log("Master MainFrame : openBookName page number= " + bookSyncInfo.bookpage);
            //         crossframecmd.set("MainFrame", "screenSyncMessageJumpPage", bookSyncInfo.bookpage);
            //         sendMessageBack(crossframecmd.intoJSON());

            //         if (bookSyncInfo.bookScale != -1) {

            //         var scaleScrollData = bookSyncInfo.bookScale + ";{" + bookSyncInfo.bookscrollX + "," + bookSyncInfo.bookscrollY + "}";
            //         console.log("Master MainFrame : openBookName screenSyncMessageScaleAndScrollMotherBoard scaleScrollData = " + scaleScrollData);
            //         crossframecmd.set("MainFrame", "screenSyncMessageScaleAndScrollMotherBoard", scaleScrollData);
            //         sendMessageBack(crossframecmd.intoJSON());

            //         }
                   
                    

            //     }

            //     if (( (bookSyncInfo.UserState == 2) && (bookSyncInfo.userIsHost == "false") ) || (bookSyncInfo.isRequestReconnection == 1))
            //     {

            //         console.log("3 client-------Send browserSyncMessageRequestURL");
            //         crossframecmd.set("MainFrame", "browserSyncMessageRequestURL", "none");
            //         sendMessageBack(crossframecmd.intoJSON());

            //         console.log("3 client-------Send screenSyncMessageRequestBookName");
            //         crossframecmd.set("MainFrame", "screenSyncMessageRequestBookName", "none");
            //         sendMessageBack(crossframecmd.intoJSON());

                    
            //         console.log("3 client-------Send screenSyncMessageRequestPageIndex ");
            //         crossframecmd.set("MainFrame", "screenSyncMessageRequestPageIndex", "");
            //         sendMessageBack(crossframecmd.intoJSON());

            //         console.log("3 client-------Send screenSyncMessageRequestScaleAndScrollMotherBoard ");
            //         crossframecmd.set("MainFrame", "screenSyncMessageRequestScaleAndScrollMotherBoard", "");
            //         sendMessageBack(crossframecmd.intoJSON());

            //         console.log("3 client-------Send screenSyncMessageRequestPlayedAnimations");
            //         crossframecmd.set("MainFrame", "screenSyncMessageRequestPlayedAnimations", "");
            //         sendMessageBack(crossframecmd.intoJSON());


            //         console.log("3 client-------Send connectionMessageRequestSyncInfo");
            //         crossframecmd.set("MainFrame", "connectionMessageRequestSyncInfo", "");
            //         sendMessageBack(crossframecmd.intoJSON());

            //     }



            //     if (bookSyncInfo.isSendUserInfoCMD == 1) {


                   
            //         bookSyncInfo.isSendUserInfoCMD = 0;

            //         if ( (bookSyncInfo.userIsHost == "true") && (bookSyncInfo.isRequestReconnection == 0)) {
            //             //Close Hall
            //             divHall_hide();

            //             //Close Main
            //             divMain_hide();

            //             //Close Book
            //             divBook_hide();

            //             //Open Room
            //             divRoom_show();

            //             //user's sublocation
            //             bookSyncInfo.subUserLocation = "atRoom";

            //         } else {
            //             //Close Hall
            //             divHall_hide();

            //             //Close Main
            //             divMain_hide();

            //             //Close Room
            //             divRoom_hide();

            //             //Open Book
            //             divBook_show();

            //             //user's sublocation
            //             bookSyncInfo.subUserLocation = null;

            //         }
            //     }
            // }


            // console.log('%c' + "Message from server. Code: bookSyncInfo.isRequestReconnection = 0;" + this.type, 'color: #000fff');
            
            // bookSyncInfo.isRequestReconnection = 0;


        //同步註記 培峰
        } else if (messageObject.command == "screenSyncMessageSyncPageNote") {
            console.log("MainFrame : screenSyncMessageSyncPageNote " + messageObject.data);
            // messageObject.data = messageObject.data.replace(/\"/g, '\\"');
            crossframecmd.set("MainFrame", "screenSyncMessageSyncPageNote", messageObject.data);
            postMessageToBookFrame(crossframecmd);
            
        } else if (messageObject.command == "screenSyncMessageGetAllUserInfoAtBook") {  

            // console.log("MainFrame : screenSyncMessageGetAllUserInfoAtBook " + messageObject.data);

            // changeSyncConnectionImgAtBook();

            // console.log("MainFrame : updateSyncStatusAtBook " );
            // crossframecmd.set("MainFrame", "updateSyncStatusAtBook", "");
            // postMessageToBookFrame(crossframecmd);

            
        } else if (messageObject.command == "screenSyncMessageGetRoomInfoWithAccount") {

            // console.log("MainFrame : screenSyncMessageGetRoomInfoWithAccount");

            // divhall_empty();

            // divhall_append(addMeetingHallTitle() + messageObject.data);

            // //Close Room
            // divRoom_hide();

            // //Close Book
            // divBook_hide();

            // //Close Hall
            // divHall_hide();

            // //Show Main
            // divMain_show();


        } else if (messageObject.command == "noSuchRoomAvailableError") {

            // console.log("MainFrame : noSuchRoomAvailableError");
            // console.log("HSConnectionIndex_noSuchRoomAvailableError");
            // gotoError(noSuchRoomAvailable);

        } else if (messageObject.command == "OpendivMain") {

            // console.log("MainFrame : OpendivMain");
            // //1 is to open
            // if (messageObject.data == 1) {
            //     //for EYMeetingHub
            //     changeMainPage();
            //     changeSyncConnectionImg();
            //     divMain_show();
            // } else if (messageObject.data == 0) {
            //     divMain_hide();
            // }
        } else if (messageObject.command == "OpendivHall") {

            // console.log("MainFrame : OpendivHall");
            // //1 is to open
            // if (messageObject.data == 1) {
            //     divHall_show();
            // } else if (messageObject.data == 0) {
            //     divHall_hide();
            // }
        } else if (messageObject.command == "OpendivRoom") {

            // console.log("MainFrame : OpendivRoom");
            // //1 is to open
            // if (messageObject.data == 1) {
            //     divRoom_show();
            // } else if (messageObject.data == 0) {
            //     divRoom_hide();
            // }
        } else if (messageObject.command == "OpendivBook") {

            // console.log("MainFrame : OpendivBook");
            // //1 is to open
            // if (messageObject.data == 1) {
            //     divBook_show();
            // } else if (messageObject.data == 0) {
            //     divBook_hide();
            // }
        } else if (messageObject.command == "screenSyncMessagePrevPage") {

            console.log("MainFrame : screenSyncMessagePrevPage " + messageObject.data);
            crossframecmd.set("MainFrame", "screenSyncMessagePrevPage", messageObject.data);
            postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "bookFrameFullScreenMode") {
            // var data = book_frame.fullScreenMode();

            // crossframecmd.set("MainFrame", "resizeBook", data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "updateGuidlineHeight") {

            // console.log("updateGuidlineHeight : " + messageObject.data);
            
            // var ID = "#guidline";
            // $(ID).css('height', messageObject.data);

        //同步書大部分的功能
        } else if (messageObject.command == "messageDataTypeBookSyncMessage") {

            console.log("MainFrame : messageDataTypeBookSyncMessage " + messageObject.data);
            crossframecmd.set("MainFrame", "messageDataTypeBookSyncMessage", messageObject.data);
            postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "screenSyncMessageScaleMothBoard") {

            // console.log("MainFrame : screenSyncMessageScaleMothBoard " + messageObject.data);
            // crossframecmd.set("MainFrame", "screenSyncMessageScaleMothBoard", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "screenSyncMessageScrollMotherBoard") {

            // console.log("MainFrame : screenSyncMessageScrollMotherBoard " + messageObject.data);
            // crossframecmd.set("MainFrame", "screenSyncMessageScrollMotherBoard", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "screenSyncMessageOpenBook") {

            // console.log("MainFrame : screenSyncMessageOpenBook " + messageObject.data);
            // //get book location from webservice and change bookframe's book on OnSuccessOpenBook

            // isPassedOpenBookCmd = 0;
         
            // var datastring = "{'FileName':'" + messageObject.data + "', 'Device': 'Html5'}";
            

            // console.log("datastring " + datastring);

            // //抓取書本資訊，用不到，所以註解  軒軒
            // //getBookLocation(datastring);


            // //user's location
            // bookSyncInfo.UserLocation = "openBook";


        } else if (messageObject.command == "browserWidthHeight") {

            // console.log("MainFrame : browserWidthHeight " + messageObject.data);
            // crossframecmd.set("MainFrame", "browserWidthHeight", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "scrollWindowXY") {

            // console.log("MainFrame : scrollWindowXY " + messageObject.data);
            // crossframecmd.set("MainFrame", "scrollWindowXY", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "screenSyncMessagePlayAnimation") {

            // console.log("MainFrame : screenSyncMessagePlayAnimation " + messageObject.data);
            // crossframecmd.set("MainFrame", "screenSyncMessagePlayAnimation", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "screenSyncMessageRequestPlayedAnimations") {

            // console.log("MainFrame : screenSyncMessageRequestPlayedAnimations " + messageObject.data);
            // crossframecmd.set("MainFrame", "screenSyncMessageRequestPlayedAnimations", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "screenSyncMessageScaleAndScrollMotherBoard") {

            console.log("MainFrame : screenSyncMessageScaleAndScrollMotherBoard " + messageObject.data);

            // var temp = messageObject.data.split(';');

            crossframecmd.set("MainFrame", "screenSyncMessageScaleMothBoard", messageObject.data);
            postMessageToBookFrame(crossframecmd);


            // if (temp[0] != 1) {
            //     crossframecmd.set("MainFrame", "screenSyncMessageScrollMotherBoard", temp[1]);
            //     postMessageToBookFrame(crossframecmd);
            // }

        } else if (messageObject.command == "enterRoomFlowCmd") {
            // enterRoomFlow();
        } else if (messageObject.command == "leaveShowCmd") {

            // console.log("MainFrame : closeSyncStatusAtBookCMD ");
            // crossframecmd.set("MainFrame", "closeSyncStatusAtBook", "");
            // postMessageToBookFrame(crossframecmd);



            // //Open ConfEnter.aspx
            // var ID = "#guidline";
            // var scr = mainPageSrc;
            // $(ID).attr("src", scr);

            // $('#lbtnSyncConnection img').attr("src", "images/menuicon_syncclose.png"); //Close status
            // $('#lbtnConferenceNews').css("display", "block");


            

        } else if (messageObject.command == "galleryStopMove") {
            
            // console.log("MainFrame : galleryStopMove ");

            // //alert("MainFrame : galleryStopMove ");

            // crossframecmd.set("MainFrame", "galleryStopMove", "");
            // postMessageToBookFrame(crossframecmd);


        } else if (messageObject.command == "galleryRunMove") {

            // console.log("MainFrame : galleryRunMove ");

            // crossframecmd.set("MainFrame", "galleryRunMove", "");
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "reSizeToolBarforIPADAndroid") {

            // console.log("MainFrame : reSizeToolBarforIPADAndroid " + messageObject.data);

            // crossframecmd.set("MainFrame", "reSizeToolBarforIPADAndroid", messageObject.data);
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "updateSyncStatusAtBookCMD") {
            // console.log("MainFrame : updateSyncStatusAtBookCMD ");
            // crossframecmd.set("MainFrame", "updateSyncStatusAtBook", "");
            // postMessageToBookFrame(crossframecmd);
        } else if (messageObject.command == "updateTwoPageCMD") {
            // console.log("MainFrame : updateTwoPageCMD ");
            // crossframecmd.set("MainFrame", "updateTwoPageCMD", "");
            // postMessageToBookFrame(crossframecmd);
        } else if (messageObject.command == "updateSinglePageCMD") {
            // console.log("MainFrame : updateSinglePageCMD ");
            // crossframecmd.set("MainFrame", "updateSinglePageCMD", "");
            // postMessageToBookFrame(crossframecmd);
        } else if (messageObject.command == "screenSyncMessageRetuenBookcase") {

            // console.log("Get screenSyncMessageRetuenBookcase " + messageObject.data);

            // isPassedOpenBookCmd = 1;

            // book_frame.setSrc("white.htm");

            // console.log("MainFrame : closeReLoadVideoIDCMD");
            // crossframecmd.set("MainFrame", "closeReLoadVideoIDCMD", "");
            // postMessageToBookFrame(crossframecmd);

        } else if (messageObject.command == "gotoBookCMD") {

            // //Close Hall
            // divHall_hide();

            // //Close Room
            // divRoom_hide();

            // //Close Main
            // divMain_hide();

            // console.log("MainFrame : updateSyncStatusAtBook ");
            // crossframecmd.set("MainFrame", "updateSyncStatusAtBook", "");
            // postMessageToBookFrame(crossframecmd);

            // //Open Book
            // divBook_show();

            // //user's location
            // bookSyncInfo.UserLocation = "openBook";

        } else if (messageObject.command == "initGuidLine") {
            // console.log("MainFrame : initGuidLine ");
            // var ID = "#guidline";
            // $(ID).css('height', bookSyncInfo.browser_height - 105);
        }
        
        

    } else if (messageObject.from == "BookFrame") {

        // if (messageObject.command == "screenSyncMessagePrevPage") {
        //     crossframecmd.set("MainFrame", "screenSyncMessagePrevPage", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "START") {
        //     crossframecmd.set("MainFrame", "START", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "PAUSE") {
        //     crossframecmd.set("MainFrame", "PAUSE", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "JUMP") {
        //     crossframecmd.set("MainFrame", "JUMP", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "FULLSCREEN_MODE") {
        //     crossframecmd.set("MainFrame", "FULLSCREEN_MODE", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "NORMAL_MODE") {
        //     crossframecmd.set("MainFrame", "NORMAL_MODE", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "screenSyncMessageScaleMothBoard") {
        //     crossframecmd.set("MainFrame", "screenSyncMessageScaleMothBoard", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "screenSyncMessageScrollMotherBoard") {
        //     crossframecmd.set("MainFrame", "screenSyncMessageScrollMotherBoard", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "screenSyncMessageScaleAndScrollMotherBoard") {
        //     crossframecmd.set("MainFrame", "screenSyncMessageScaleAndScrollMotherBoard", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "gotoHallcmd") {
        //     gotoHall();
        // } else if (messageObject.command == "gotoRoomcmd") {
        //     gotoRoom();
        // } else if (messageObject.command == "gotoMaincmd") {
        //     bookSyncInfo.bookSN = null;
        //     //leaveRoomforGotoMaincmd();

        //     book_frame.setSrc("white.htm");

        //     gotoMain();

        // } else if (messageObject.command == "screenSyncMessageRetuenBookcase") {

        //     console.log("MainFrame : screenSyncMessageRetuenBookcase " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessageRetuenBookcase", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        //     book_frame.setSrc("white.htm");

        //     //user's location
        //     bookSyncInfo.UserLocation = "atMain";

        // } else if (messageObject.command == "WEB_OPENBROWSER") {

        //     console.log("MainFrame : WEB_OPENBROWSER " + messageObject.data);
        //     crossframecmd.set("MainFrame", "WEB_OPENBROWSER", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "WEB_CLOSEBROWSER") {

        //     //console.log("MainFrame : WEB_CLOSEBROWSER " + messageObject.data);
        //     crossframecmd.set("MainFrame", "WEB_CLOSEBROWSER", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "WEB_NAVIGATETO") {

        //     console.log("MainFrame : WEB_NAVIGATETO " + messageObject.data);
        //     crossframecmd.set("MainFrame", "WEB_NAVIGATETO", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "screenSyncMessageRequestPageIndex") {

        //     console.log("MainFrame : screenSyncMessageRequestPageIndex " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessageRequestPageIndex", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "screenSyncMessageRequestScaleMothBoard") {

        //     console.log("MainFrame : screenSyncMessageRequestScaleMothBoard " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessageRequestScaleMothBoard", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "screenSyncMessageRequestScaleAndScrollMotherBoard") {

        //     console.log("MainFrame : screenSyncMessageRequestScaleAndScrollMotherBoard " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessageRequestScaleAndScrollMotherBoard", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "screenSyncMessagePlayAnimation") {

        //     console.log("MainFrame : screenSyncMessagePlayAnimation " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessagePlayAnimation", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "screenSyncMessagePlayAnimation") {

        //     console.log("MainFrame : screenSyncMessagePlayAnimation " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessagePlayAnimation", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "screenSyncMessageRequestPlayedAnimations") {

        //     console.log("MainFrame : screenSyncMessageRequestPlayedAnimations " + messageObject.data);
        //     crossframecmd.set("MainFrame", "screenSyncMessageRequestPlayedAnimations", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "syncCmd") {

        //     console.log("MainFrame : syncCmd " + messageObject.data + " SyncFlag = " + bookSyncInfo.SyncFlag);
            
        //     if (window.WebSocket) {
        //         if (bookSyncInfo.SyncFlag == 0) {
        //             console.log("MainFrame : showSyncFlagMsgCMD ");
        //             crossframecmd.set("MainFrame", "showSyncFlagMsgCMD", "");
        //             sendMessageBack(crossframecmd.intoJSON());
        //         } else {
        //             console.log("MainFrame : syncCmd " + messageObject.data);
        //             crossframecmd.set("MainFrame", "syncCmd", messageObject.data);
        //             sendMessageBack(crossframecmd.intoJSON());
        //         }
        //     }



        // } else if (messageObject.command == "eBookStyle") {

        //     console.log("MainFrame : eBookStyle " + messageObject.data);

            
            
        //     var tmp = messageObject.data.split(' ');
        //     bookSyncInfo.eBookStyle = tmp[0];
        //     bookSyncInfo.isTwoPage = tmp[1];


        // } else if (messageObject.command == "closeLoadBookMsgCMD") {

        //     console.log("MainFrame : closeLoadBookMsgCMD " + messageObject.data);
        //     crossframecmd.set("MainFrame", "closeLoadBookMsgCMD", "");
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "goToOriginPageIndexCMD") {

        //     console.log("MainFrame : goToOriginPageIndexCMD " + messageObject.data);
        //     crossframecmd.set("MainFrame", "goToOriginPageIndexCMD", "");
        //     sendMessageBack(crossframecmd.intoJSON());
        // } else if (messageObject.command == "goToOriginScaleScrollCMD") {

        //     console.log("MainFrame : goToOriginScaleScrollCMD " + messageObject.data);
        //     crossframecmd.set("MainFrame", "goToOriginScaleScrollCMD", "");
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "goToOriginAnimationCMD") {

        //     console.log("MainFrame : goToOriginAnimationCMD " + messageObject.data);
        //     crossframecmd.set("MainFrame", "goToOriginAnimationCMD", "");
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "BookSyncMessage") {

        //     console.log("MainFrame : BookSyncMessage " + messageObject.data);
        //     crossframecmd.set("MainFrame", "BookSyncMessage", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "browserSyncMessageRequestURL") {

        //     console.log("Send browserSyncMessageRequestURL");
        //     crossframecmd.set("MainFrame", "browserSyncMessageRequestURL", "none");
        //     sendMessageBack(crossframecmd.intoJSON());

        // }

    } else if (messageObject.from == "GuidLineFrame") {

        // if (messageObject.command == "openBook") {

        //     crossframecmd.set("MainFrame", "showLoadBookMsgCMD", "");
        //     sendMessageBack(crossframecmd.intoJSON());


        //     //get book location from webservice and change bookframe's book on OnSuccessOpenBook.
        //     //抓取書本資訊，用不到，所以註解  軒軒
        //     //getBookLocation(messageObject.data);

        //     //if a user is host, tell others to open the same book
        //     // host = 1 , no host = 2
        //     if (bookSyncInfo.UserState == 1) {

        //         var arr = messageObject.data.split(',');
        //         var arr0 = arr[0].split(':');
        //         var arr1 = arr0[1].split('\'');
        //         crossframecmd.set("MainFrame", "screenSyncMessageOpenBook", arr1[1]);

                
        //         sendMessageBack(crossframecmd.intoJSON());

        //         //user's location
        //         bookSyncInfo.UserLocation = "openBook";
        //     }
        // } else if (messageObject.command == "WEB_NAVIGATETO") {

        //     console.log("MainFrame : WEB_NAVIGATETO " + messageObject.data);
        //     crossframecmd.set("MainFrame", "WEB_NAVIGATETO", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

          

        // } else if (messageObject.command == "WEB_CLOSEBROWSER") {

        //     console.log("MainFrame : WEB_CLOSEBROWSER " + messageObject.data);
        //     crossframecmd.set("MainFrame", "WEB_CLOSEBROWSER", messageObject.data);
        //     sendMessageBack(crossframecmd.intoJSON());

        // } else if (messageObject.command == "updatescrollguidline") {

        // }
    }
}

//介面用於接收來自MainFrame的指令
function actionMessage(evt) {
      var message;
      var messageObject = evt;
      message = "BookFrame got " + messageObject.data;
      // console.log(message);

      if (messageObject.from == "MainFrame") {

            console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

            switch (messageObject.command) {

                  //跳頁、翻頁
                  case 'screenSyncMessagePrevPage':
                  case 'screenSyncMessageNextPage':
                  case 'screenSyncMessageJumpPage':
                        gotoPage(Number(messageObject.data));

                        break;

                  //同步註記
                  case 'screenSyncMessageSyncPageNote':
                        SyncNotes(messageObject.data);

                        break;

                  //同步書的功能
                  case 'messageDataTypeBookSyncMessage':
                        SyncBook(messageObject.data);

                        break;

                  //同步縮放平移
                  case 'screenSyncMessageScaleMothBoard':

                        var data = messageObject.data.split(';');
                        SyncZoomAndScroll(data);

                        break;
            }

        // //跳頁、翻頁
        // if ((messageObject.command == "screenSyncMessagePrevPage") ||
        //     (messageObject.command == "screenSyncMessageNextPage") ||
        //     (messageObject.command == "screenSyncMessageJumpPage")) {

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     gotoPage(Number(messageObject.data));

        //     //不知道在幹麼的，會出錯   軒軒
        //     //upDateAnimationActionMap(Number(messageObject.data) + 1);
        //     //syncBrushChangePage(Number(messageObject.data));
        // } else if (messageObject.command == "screenSyncMessageSyncPageNote") {
        //     //同步註記

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     SyncNotes(messageObject.data);

        // } else if (messageObject.command == "messageDataTypeBookSyncMessage") {
        //     //同步書的其他功能

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     // alert(messageObject.command + ', ' + messageObject.data);

        //     SyncBook(messageObject.data);

        // } else if (messageObject.command == 'screenSyncMessageScaleMothBoard') {
        //     //縮放平移

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     var data = messageObject.data.split(';');

        //     SyncZoomAndScroll(data);

        // }
        //  else if (messageObject.command == "changeController") {

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     UserState = bookSyncInfo.UserState;

        // } else if (messageObject.command == "screenSyncMessageScaleMothBoard") {
        //     //Scale
            
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     if (Number(messageObject.data) == 1) {

        //         if (isTwoPages == 0) {
        //             SinglePageSetting();
        //         } else if (isTwoPages == 1) {
        //             TwoPageSetting();
        //         }
        //     } else {

        //         if (isScaleUp == 1) {
        //             if (isTwoPages == 0) {
        //                 SinglePageSetting();
        //             } else if (isTwoPages == 1) {
        //                 TwoPageSetting();
        //             }

        //             isScaleUp = 0;
        //         }

        //         scaleEBooK(Number(messageObject.data));
        //     }
        // } else if (messageObject.command == "screenSyncMessageScrollMotherBoard") {
        //     //Scale

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     var arr = messageObject.data.split(',');
        //     var tmp1 = arr[0].split('{');
        //     var tmp2 = arr[1].split('}');

        //     //alert(tmp1.length + " " + tmp2.length + " " + tmp1[1] + " " + tmp2[0]);

        //     //scaleEBooK(Number(messageObject.data));

        //     //alert("-------------------0");

        //     scrollEBooK(Number(tmp1[1]), Number(tmp2[0]));

        //     //alert("-------------------1");

        // } else if (messageObject.command == "browserWidthHeight") {
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     //alert("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     var hasTouch = 'ontouchstart' in window;

        //     //for ipod Safari resize
        //     if (hasTouch) {
        //         var arr = messageObject.data.split(' ');

        //         if ((recordWidth != Number(arr[0])) || (recordHeight != Number(arr[1]))) {

        //             resizeSafari(Number(arr[0]), Number(arr[1]));

        //             recordWidth = Number(arr[0]);
        //             recordHeight = Number(arr[1]);

        //         }
        //     }
        // } else if (messageObject.command == "resizeBook") {
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     //alert("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     var hasTouch = 'ontouchstart' in window;

        //     //for ipod Safari/Android resize
        //     if (hasTouch) {
        //         var arr = messageObject.data.split(' ');

        //         if ((recordWidth != Number(arr[0])) || (recordHeight != Number(arr[1]))) {

        //             resizeSafari(Number(arr[0]), Number(arr[1]));

        //             recordWidth = Number(arr[0]);
        //             recordHeight = Number(arr[1]);

        //         }
        //     }
        // } else if (messageObject.command == "screenSyncMessagePlayAnimation") {
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     var id = messageObject.data;
        //     runSlideAnimation(id.toString());
        // } else if (messageObject.command == "screenSyncMessageRequestPlayedAnimations") {
        //     //不知道在幹麼  軒軒
        //     /*console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     var data = messageObject.data.split(';');
        //     var count = data.length;
        //     for (var i = 0; i < count; i++) {

               
        //         if (i == 0) {
        //             runBeforeAnimationAction(bookSyncInfo.bookpage, data[i]);
        //         }

        //         var value = getAnimationIsAction(data[i]);

        //         console.log(data[i] + " = " + value);

        //         if (value == 0) {
        //             recordPPT(data[i]);
        //             setAnimationHasAction(data[i], 1);
        //         }
        //         runSlideAnimationEnd(data[i]);
        //     }*/
        // } else if (messageObject.command == "updateSyncStatusAtBook") {
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     changeSyncConnectionImgforBook();

        // } else if (messageObject.command == "galleryStopMove") {

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     gallery.stopMove();
        //     JQ("#Hamastarwrapper").css('-ms-touch-action', "auto");

        // } else if (messageObject.command == "galleryRunMove") {

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);
        //     gallery.runMove();
        //     JQ("#Hamastarwrapper").css('-ms-touch-action', "none");

        // } else if (messageObject.command == "reSizeToolBarforIPADAndroid") {

        //     console.log("reSizeToolBarforIPADAndroid : " + messageObject.command + " " + messageObject.data);


        //     //alert("reSizeToolBarforIPADAndroid : " + messageObject.command + " " + messageObject.data);


        //     var hasTouch = 'ontouchstart' in window;

        //     //for ipod Safari/Android/MS tablet resize
        //     if ((hasTouch) || (window.navigator.msPointerEnabled)) {
        //         var arr = messageObject.data.split(' ');

        //         reSizeToolBarforIPADAndroid(Number(arr[0]), Number(arr[1]), Number(arr[2]), Number(arr[3]), Number(arr[4]), Number(arr[5]));
        //     }



        // } else if (messageObject.command == "updateSinglePageCMD") {

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data + " EbookStyle = " + EbookStyle);

        //     //alert("BookFrame : " + messageObject.command + " " + messageObject.data + " EbookStyle = " + EbookStyle);


        //     if (EbookStyle == 525740) {
        //         isChangedPageMode = 1;
        //         updateSinglePage();
        //     }

        // } else if (messageObject.command == "updateTwoPageCMD") {

        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data + " EbookStyle = " + EbookStyle);

        //     //alert("BookFrame : " + messageObject.command + " " + messageObject.data + " EbookStyle = " + EbookStyle);


        //     if (EbookStyle == 525740) {
        //         isChangedPageMode = 1;
        //         updateTwoPage();
        //     }

        // } else if (messageObject.command == "closeSyncStatusAtBook") {
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     closeSyncConnectionImgforBook();

        // } else if (messageObject.command == "closeReLoadVideoIDCMD") {
        //     console.log("BookFrame : " + messageObject.command + " " + messageObject.data);

        //     closeReLoadVideoID();

        // }

      }
}