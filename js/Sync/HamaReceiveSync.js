//同步



//接收封包
function RcvCPac2(msg) {
    try {
        //if (sessionStorage.isConnected == "true") {
        if (msg.length > 0) {

            msg = Base64.decode(msg);

            Html5WirteLog("==>" + stringToHex(msg));
            Html5WirteLog("-->" + msg);

            getPackage(msg);

        } else {
            alert("==> No Response");
        }
        //}

    } catch (err) {

        alert("connectWS Error = " + err);

    }
}

//接受封包 目前使用在 主控 同步後要求註記跟發送目前的頁數
// function RcvCPac(msg) {
//     try {
        
//     } catch (e) {

//     }
// }

//傳送封包
function rmcallBookSyncMessage(dm) {
    try {
        window.external.effBookSyncMessage(dm);
        return true;
    } catch (e) {
        return false;
    }
}

//傳送封包
function rmcall(dm) {
    try {
        window.external.eff(dm);
    } catch (e) {
        // alert('rmcall Error');
    }
}

//跟pc app要一次主被控
function callSLcomplete() {
    try {
        window.external.slc();
    } catch (e) {}
}


//將封包轉成byte
function stringToHex(tmp) {
    var str = '';
    var tmpLength = tmp.length;
    var c;

    for (var i = 0; i < tmpLength; i += 1) {
        c = tmp.charCodeAt(i);


        if (i === tmpLength - 1) {
            str += '0x' + d2h(c);
        } else {
            str += '0x' + d2h(c) + ' ';
        }
    }

    return str;
}


function h2d(h) {
    return parseInt(h, 16);
}

function d2h(d) {
    return d.toString(16);
}

function postMessageToMainFrame(msg) {
    try {
        displayMessage(msg);
    } catch (err) {
        // alert(err);
    }

};


function postMessageToBookFrame(mesg) {
    try {
        actionMessage(mesg);
    } catch (err) {
        // alert(err);
    }
}

