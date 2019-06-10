function initFB(obj, text) {

	//必須先載入fb sdk
    window.fbAsyncInit = function() {
        FB.init({
            appId: '1733245003467793',
            xfbml: true,
            autoLogAppEvents: true,
            version: 'v3.1'
        });

        FB.login(function(response) {

            if (response.authResponse) {

                //之前用blob push給fb，但因為授權一直都不過，所以改用feed
                /* if (response.authResponse) {
                        window.authToken = response.authResponse.accessToken;
                        var fd = new FormData();
                        fd.append("access_token", authToken);
                        fd.append("source", blob);
                        fd.append("message", '123');
                        try {
                            JQ.ajax({
                                url: "https://graph.facebook.com/me/photos?access_token=" + authToken,
                                type: "POST",
                                data: fd,
                                processData: false,
                                contentType: false,
                                cache: false,
                                success: function(data) {
                                    console.log("success " + data);
                                    //alert("success");
                                },
                                error: function(shr, status, data) {
                                    console.log("error " + data + " Status " + shr.status);
                                    //alert("error");
                                },
                                complete: function() {
                                    console.log("Posted to facebook");
                                    //alert("complete");
                                }
                            });

                        } catch (e) {
                            console.log(e);
                        }
                    } else {

                    }
                }, {
                    scope: 'publish_actions'
                }*/


                /*var params = {};
                params['name'] = "Social Demo";
                params['caption'] = "ddd";
                params['message'] = 'asd';
                params['description'] = "123";
                params['link'] = "http://sellingcloud.hamastar.com.tw/html5/index.html";
                params['picture'] = "http://sellingcloud.hamastar.com.tw/html5/Resource/001_a6bd9bc1-9d10-4bbc-b350-120e23a77059.jpg";

                FB.api('/me/feed', 'post', params, function(response) {
                    if (!response || response.error) {
                        alert('Error occured');
                    } else {
                        //回傳貼文的ID，之後可經由此ID刪除貼文  
                        alert('Post ID: ' + response.id);
                    }
                });*/


                runFB(obj, text);

            } else {
                alert('FB登入失敗!');

                unblockUi();
            }

        });
    };

    Share.FbInit = true;

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}

function runFB(obj, text) {

	//判斷fb的狀態
    FB.getLoginStatus(function(response) {

        if (response.status === 'connected') {

            var urlLink = location.origin + location.pathname + '#?gotoPage=' + String(obj.page);
            var subject = '';

            // if (bookConfig.isMOMO) {
            //     subject = '\nmomo型錄:\n'
            // } else {
                subject = '\nHTML5分享:\n'

            // }

            FB.ui({
                    // method: 'feed',
                    // picture: obj.img,
                    // link: urlLink,
                    // name: subject,
                    // description: text,
                    // caption: location.origin
                    method: 'share_open_graph',
                    action_type: 'og.likes',
                    action_properties: JSON.stringify({
                        object:'https://developers.facebook.com/docs/',
                    })
                },
                function(response) {
                    if (response && response.post_id) {
                        alert('已成功分享!');
                    } else if (response.error_code == 4201) {
                    	//使用者直接關掉fb的dialog
                        alert('FB分享失敗!');
                    } else if (response.error_code == 190) {
                    	//如果畫面沒有重新整理，但使用者登出fb的話，這裡還是會是登入狀態
                    	//但會有這樣的錯誤code，重新整理頁面在按時，會在抓一次狀態
                        alert('FB連線與分享失敗!將重新整裡頁面');
                        location.href = urlLink;
                        location.reload();
                    }
                    unblockUi();
                }
            );
        } else if (response.status === 'not_authorized') {
            //尚未通過第一階段授權
        } else {
            //沒登入FB使用者
            alert("請先登入Facebook網站");
        }
    });

}
