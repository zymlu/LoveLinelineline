//分享

var Share = {
    FbInit: false,
    shareType: null,
    imgList: [],
    imgObj: null
}


function closeShareDiv() {
    $(tempToolBars[0].btns).each(function() {
        if (this.id == 'share') {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
        }
    })

    Share.imgObj = '';
    $('.share_area')[0].value = '';
    Share.imgList = [];
    $('#' + Share.shareType + 'Btn').removeClass('share_btnActive');

    $('#imgListDiv').css('display', 'none');
    $('.shareImg').remove();

    $('#EditDiv').toggle();
}

function imgListShow(type) {
    Share.shareType = type;
    $('#' + type + 'Btn').siblings().removeClass('share_btnActive');
    $('#' + type + 'Btn').addClass('share_btnActive');
    ShareInit();
}

function ShareInit() {
    Share.imgList = [];

    $('#imgListDiv').css('display', 'block');

    // html2canvas($('body'), {
    //     allowTaint: true,
    //     taintTest: false,
    //     onrendered: function(canvas) {

    //         canvas.id = "mycanvas";
    //         //生成Base64图片数据

    //         var newImg = document.createElement("img");

    //         $(newImg).attr({
    //             'class': 'shareImg',
    //             'width': '100%'
    //         });

    //         newImg.src = canvas.toDataURL();
            
    //         $('#imgList').append(newImg);
    //         $('#imgList').click(function() {
    //             choiceImg(this);
    //         })

    //     }
    // });

    // if (MainObj.IsTwoPage) {

    //     if (MainObj.NowPage - 1 >= 0) {
    //         var ImgLeft = MainObj.AllBackground[MainObj.NowPage - 1].img;
    //         $(ImgLeft).attr({
    //             'class': 'shareImg',
    //             'width': '100%'
    //         });
    //         var imgList = document.createElement('div');
    //         imgList.id = 'imgList' + (MainObj.NowPage - 1);
    //         $(imgList).attr('class', 'shareDiv');
    //         $(imgList).click(function() {
    //             choiceImg(this);
    //         })
    //         $('#share_btn_list').before(imgList);
    //         $('#' + imgList.id).append(ImgLeft);

    //         var obj = { img: ImgLeft.src, page: MainObj.NowPage - 1 };
    //         Share.imgList.push(obj);

    //     }


    //     var ImgRight = MainObj.AllBackground[MainObj.NowPage].img;
    //     $(ImgRight).attr({
    //         'class': 'shareImg',
    //         'width': '100%'
    //     });
    //     var imgList2 = document.createElement('div');
    //     imgList2.id = 'imgList' + MainObj.NowPage;
    //     $(imgList2).attr('class', 'shareDiv');
    //     $(imgList2).click(function() {
    //         choiceImg(this);
    //     })
    //     $('#share_btn_list').before(imgList2);
    //     $('#' + imgList2.id).append(ImgRight);

    //     var obj2 = { img: ImgRight.src, page: MainObj.NowPage };
    //     Share.imgList.push(obj2);

    // } else {

    //     var ImgLeft = MainObj.AllBackground[MainObj.NowPage].img;
    //     $(ImgLeft).attr({
    //         'class': 'shareImg',
    //         'width': '100%'
    //     });
    //     var imgList = document.createElement('div');
    //     imgList.id = 'imgList' + MainObj.NowPage;
    //     $(imgList).attr('class', 'shareDiv');
    //     $(imgList).click(function() {
    //         choiceImg(this);
    //     })
    //     $('#share_btn_list').before(imgList);
    //     $('#' + imgList.id).append(ImgLeft);

    //     var obj = { img: ImgLeft.src, page: MainObj.NowPage };
    //     Share.imgList.push(obj);

    // }
}

function choiceImg(obj) {

    // for (var i = 0; i < Share.imgList.length; i++) {
    //     if ($(obj).find('img')[0].src == Share.imgList[i].img) {
    //         Share.imgObj = Share.imgList[i];
    //     }
    // }
    Share.imgObj = { img: $(obj).find('img')[0].src, page: MainObj.NowPage };
    // console.log(obj);

    $(obj).siblings().find('img').removeClass('shareImgActive');
    $(obj).find('img').addClass('shareImgActive');
}

function sharePush() {
    if (Share.imgObj == '' || Share.imgObj == undefined) {
        var i = 0;
        if (Share.imgList[i].img == undefined) {
            i = 1;
        }
        Share.imgObj = Share.imgList[i];
    }

    switch (Share.shareType) {
        case 'facebook':
            facebookPush();
            break;
        case 'line':
            linePush();
            break;
        case 'mail':
            mailPush();
            break;
    }
}

function facebookPush() {
    blockUi('Waiting');

    //因為fb的載入指需要一次，所以用個變數記著
    if (!Share.FbInit) {
        initFB(Share.imgObj, $('.share_area')[0].value);
    } else {
        runFB(Share.imgObj, $('.share_area')[0].value);
    }

    //當分享完時，清掉一些畫面上的東西
    closeShareDiv();
}

function mailPush() {

    var newlink = document.createElement('a');

    var subject = '';
    // if (bookConfig.isMOMO) {
    //     subject = '\nmomo型錄:\n'
    // } else {
        subject = '\nHTML5分享:\n'

    // }

    //做成一個a tag 去點擊
    var urlLink = subject + location.href + '#?gotoPage=' + String(Share.imgObj.page);
    var cont = encodeURIComponent($('.share_area')[0].value + '\n' + urlLink);
    newlink.setAttribute('href', 'mailto:?subject=分享連結!!&body=' + cont);
    newlink.click();

    closeShareDiv();
}

function linePush() {

    var newlink = document.createElement('a');

    var subject = '';

    // if (bookConfig.isMOMO) {
    //     subject = '\nmomo型錄:\n'
    // } else {
        subject = '\nHTML5分享:\n'

    // }

    //做成一個a tag 去點擊
    var urlLink = subject + location.href + '#?gotoPage=' + String(Share.imgObj.page);
    var cont = encodeURIComponent($('.share_area')[0].value + '\n' + urlLink);
    newlink.setAttribute('href', 'http://line.me/R/msg/text/?' + cont);
    newlink.click();

    closeShareDiv();
};
