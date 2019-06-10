// google drive


// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
var developerKey = 'AIzaSyDtipnr0BdJxC7qacd2wnuo_bkLXIuwX8Y';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = "306593026363-4l8g551ntd5591t7q77lg1p6vcrv7g7i.apps.googleusercontent.com"

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = "306593026363";

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive'];

var pickerApiLoaded = false;
var oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
    gapi.load('client', function () {
        gapi.load('auth', function () {
            window.gapi.auth.authorize({
                    'client_id': clientId,
                    'scope': scope,
                    'immediate': false
                },
                handleAuthResult);
        });
    });
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        gapi.load('picker', function () {
            pickerApiLoaded = true;
            createPicker();
        });
    }
}

// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        var docsView = new google.picker.DocsView()
            .setIncludeFolders(true);
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(docsView)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

// A simple callback implementation.
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        gapi.client.load('drive', 'v2', function () {
            printFile(data.docs[0].id)
        });
    }
}


/**
 * Print a file's metadata.
 *
 * @param {String} fileId ID of the file to print metadata for.
 */
function printFile(fileId) {

    var request = gapi.client.drive.files.get({
        'fileId': fileId
    });
    request.execute(function (resp) {
        console.log('Title: ' + resp.title);
        console.log('MIME type: ' + resp.mimeType);
        if (resp.title.split('.').pop() != 'xml') {
            BookAlertShow('請選擇正確編修檔!');
            return;
        }
        downloadFile(resp, selectedFile);
    });
}

/**
 * Download a file's content.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(file, callback) {
    if (file.downloadUrl) {
        var accessToken = gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file.downloadUrl + '&access_token=' + accessToken);
        //xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);        
        xhr.onload = function () {
            callback(xhr.responseText);
        };
        xhr.onerror = function () {
            BookAlertShow('Google Drive連線失敗, 請重試!');
        };
        xhr.send();
    }
}

function selectedFile(xml) {
    confirmShow('現有備課資料將會移除，是否匯入', function (res) {
        if (res) {
            noteSwitch(xml);
        }
    })
}

function uploadNoteLoad() {
    gapi.load('client', function () {
        gapi.load('auth', function () {
            window.gapi.auth.authorize({
                    'client_id': clientId,
                    'scope': scope,
                    'immediate': false
                },
                handleAuthResultUpload);
        });
    });
}

function handleAuthResultUpload(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        gapi.load('picker', function () {
            pickerApiLoaded = true;
            createUploadPicker();
        });
    }
}

function createUploadPicker() {
    if (pickerApiLoaded && oauthToken) {
        var docsView = new google.picker.DocsView()
            .setIncludeFolders(true)
            .setMimeTypes('application/vnd.google-apps.folder')
            .setSelectFolderEnabled(true);
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(docsView)
            .setCallback(uploadPickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function uploadPickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        gapi.client.load('drive', 'v2', function () {
            $('.editor-layout').css('display', 'block');
            $('.editor-input')[0].value = formatDate(new Date());

            $('.editor_submit').click(function() {
                uploadNoteFile(data.docs[0].id);
                $('.editor-layout').css('display', 'none');
            });

        });
    }
}

function uploadNoteFile(folderId) {
    var fileContent = toSyncXML(true); // As a sample, upload a text file.
    var file = new Blob([fileContent], {
        type: 'text/plain'
    });
    var metadata = {
        // 'name': $('.editor-input')[0].value + "." + BookList.EBookID.replace(/\-/g, ''), // Filename at Google Drive
        'name': $('.editor-input')[0].value + ".xml", // Filename at Google Drive
        'mimeType': 'text/plain', // mimeType at Google Drive
        'parents': [folderId]
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {
        type: 'application/json'
    }));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = function () {
        BookAlertShow('編修檔上傳成功！');
        resetUndo();
    };
    xhr.onerror = function () {
        BookAlertShow('Google Drive連線失敗, 請重試!');
    };
    xhr.send(form);
}

