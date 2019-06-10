//輔助視窗
//每一個輔助視窗都用div把整個物件包起來

var isMouseInText = false;

function IntroCanvasSet(obj, inside) {
  var scale = MainObj.Scale;
  var Left = obj.Left * scale + MainObj.CanvasL;
  var Top = obj.Top * scale + MainObj.CanvasT;
  var Width = obj.Width * scale;
  var Height = obj.Height * scale;

  $('#canvas')[0].class = 'canvasObj';
  var canvasID = obj.Identifier;

  $('#canvas')[0].id = canvasID;
  $('#' + canvasID)[0].width = Width;
  $('#' + canvasID)[0].height = Height;
  $('#' + canvasID).css({
    left: Left,
    top: Top
  });

  var canvas = $('#' + canvasID)[0];
  var cxt = $('#' + canvasID)[0].getContext('2d');
  resizeCanvas(canvas, cxt);

  drawButtonImage(obj, cxt, Width, Height);

  $('#' + obj.Identifier).click(function () {
    if ($('#IntroDiv' + obj.Identifier)[0] == undefined) {
      if (!inside) {
        $('.IntroDiv').remove();
      } else {
        $('.inside').remove();
      }

      Introduction(obj, inside);
    } else {
      //第二層只存在一個
      // var closeID = $('.IntroDiv')[1].id;
      var closeID = $('.IntroDiv')[0].id;
      if (closeID == 'IntroDiv' + obj.Identifier) {
        $('#IntroDiv' + obj.Identifier).remove();
      }
    }
  });
}

function Introduction(obj, inside) {
  NewCanvas(obj);

  var scale = MainObj.Scale;
  var objList = obj.IntroductionObjectList.IntroductionObject;

  objList = ObjListSet(objList);

  objList.sort(function (a, b) {
    return a.zIndex - b.zIndex;
  });

  var Width = objList[0].Width * scale;
  var Height = objList[0].Height * scale;

  IntroductionCanvasSet(objList[0], inside);
  var canvasID = 'Introduction' + objList[0].Identifier;
  $('#canvas')[0].id = canvasID;
  $('#' + canvasID).addClass('canvasIntro canvasObj');
  $('#' + canvasID).attr('Identifier', objList[0].Identifier);

  NewDiv(obj, canvasID, inside);

  var canvas = $('#' + canvasID)[0];
  var cxt = canvas.getContext('2d');
  resizeCanvas(canvas, cxt);

  //音檔
  if (obj.AudioPathFileName != '') {
    NewAudio(obj, obj.AudioPathFileName, MainObj.NowPage);
  }

  var img = new Image();
  img.onload = function () {
    cxt.drawImage(img, 0, 0, Width, Height);

    for (var i = 1; i < objList.length; i++) {
      NewCanvas(objList[i]);
      $('#canvas').attr('class', 'canvasIntro');
      $('#canvas').addClass('canvasObj');
      $('#IntroDiv' + obj.Identifier).append($('#canvas')[0]);

      objList[i].Left = objList[i].Left + objList[0].Left + objList[0].ShiftPointX;
      objList[i].Top = objList[i].Top + objList[0].Top + objList[0].ShiftPointY;

      switch (objList[i].FormatterType) {
        //動態平移
        case 'ScrollObject':
          ScrollSet(objList[i]);
          break;

          //圖片
        case 'ImageLayer':
          ObjImageSet(objList[i], inside);
          $('#canvas')[0].id = 'Img' + objList[i].Identifier;
          $('#Img' + objList[i].Identifier).css('pointer-events', 'none');
          break;

          //關閉按鈕
        case 'CloseButton':
          ObjImageSet(objList[i], inside);
          $('#canvas')[0].id = 'Btn' + objList[i].Identifier;
          $('#Btn' + objList[i].Identifier).click(function () {
            // ScrollReset();

            //彈跳視窗第一層關閉，全部都要關閉
            var closeID = $('.IntroDiv')[0].id.split('IntroDiv')[1];
            if (closeID == obj.Identifier) {
              $('.IntroDiv').remove();
              $('.introImage').remove();
              $('.videoPosition').remove();
              $('.videoClose').remove();
            } else {
              $('#IntroDiv' + obj.Identifier).remove();
            }

            if (obj.AudioPathFileName != '') {
              $('#Voice').remove();
            }
            $('.introVoice').remove();

            var message = MainObj.NowPage + ',' + obj.Identifier + ',CLOSE';
            rmcallBookSyncMessage(message);
          });
          break;

          //video
        case 'VideoObject':
          IntroVideo(objList[i], obj.Identifier);
          break;

          //連結
        case 'HyperLinkObject':
          HyperLinkSet(objList[i]);
          break;

          //感應區
        case 'AdditionalFile':
          objList[i].Brush = objList[i].Brush;
          objList[i].Position.X =
            Number(objList[i].Position.X) + objList[0].Left;
          objList[i].Position.Y =
            Number(objList[i].Position.Y) + objList[0].Top;
          AdditionalCanvasSet(objList[i], MainObj.NowPage, true);
          break;

          //360
        case 'RotationImage':
          RotationImageSet(objList[i]);
          break;

          //塗抹
        case 'ErasingPicture':
          ErasingPictureSetting(i, objList[i]);

          break;

          //輔助視窗
        case 'Introduction':
          IntroCanvasSet(objList[i], obj);
          // if (inside) {
          //     $('#' + objList[i].Identifier).addClass('inside');
          // }
          break;

          //點選題
        case 'CorrectBox':
        case 'ErrorBox':
          IntroQuizSet(objList[i], objList);
          break;

          //文字框
        case 'TextObject':
          IntroTextSet(objList[i], obj.Identifier);
          break;
      }
      $('#canvas').remove();
    }
  };
  img.src = 'Resource/' + setExt(objList[0].XFileName);

  //是否可拖動視窗
  if (obj.DragEnable == '1') {
    canvas.addEventListener('mousedown', function(e) {
      IntroductionDown(e, canvas, inside);
    }, false);
    canvas.addEventListener('touchstart', function(e) {
      IntroductionDown(e, canvas, inside);
    }, false); //手指點擊事件

    $(canvas).css('cursor', 'move');
  }

  //同步輔助視窗，開啟(TAP)時也要傳初始視窗的位置(MOVETO)
  var message = MainObj.NowPage + ',' + obj.Identifier + ',TAP';
  rmcallBookSyncMessage(message);

  var syncleft = objList[0].Left / 1000;
  var synctop = objList[0].Top / 1000;

  var message =
    MainObj.NowPage +
    ',' +
    obj.Identifier +
    ',MOVETO:' +
    syncleft +
    ';' +
    synctop;
  rmcallBookSyncMessage(message);
}

function NewDiv(obj, canvasID, inside) {
  var IntroDiv = document.createElement('div');
  IntroDiv.id = 'IntroDiv' + obj.Identifier;
  $('#HamastarWrapper').append(IntroDiv);
  $('#' + IntroDiv.id).attr('class', 'IntroDiv');
  $('#' + IntroDiv.id).append($('#' + canvasID)[0]);
  if (inside) {
    $('#' + IntroDiv.id).addClass('inside');
  }
  $('#' + IntroDiv.id).css({
    position: 'absolute',
    'z-index': 1
  });
}

function IntroductionCanvasSet(obj, inside) {
  var scale = MainObj.Scale;
  var Left = obj.ShiftPointX ? (obj.Left * scale + obj.ShiftPointX * scale + MainObj.CanvasL) : (obj.Left * scale + MainObj.CanvasL);
  var Top = obj.ShiftPointY ? (obj.Top * scale + obj.ShiftPointY * scale + MainObj.CanvasT) : (obj.Top * scale + MainObj.CanvasT);
  var Width = obj.Width * scale;
  var Height = obj.Height * scale;

  if (inside) {
    Left = $('#IntroDiv' + inside.Identifier).offset().left + Left;
    Top = $('#IntroDiv' + inside.Identifier).offset().top + Top;
  }

  $('#canvas')[0].class = 'canvasObj';
  $('#canvas')[0].width = Width;
  $('#canvas')[0].height = Height;
  $('#canvas').css({
    left: Left,
    top: Top
  });
}

function ObjImageSet(obj, inside) {
  IntroductionCanvasSet(obj, inside);
  var scale = MainObj.Scale;
  var Width = obj.Width * scale;
  var Height = obj.Height * scale;

  var canvas = $('#canvas')[0];
  var cxt = canvas.getContext('2d');
  resizeCanvas(canvas, cxt);

  var ObjImg = new Image();
  ObjImg.onload = function () {
    cxt.drawImage(ObjImg, 0, 0, Width, Height);
  };
  ObjImg.src = 'Resource/' + setExt(obj.XFileName);
}

function IntroVideo(obj, divID) {
  var scale = MainObj.Scale;
  var NewVideo = document.createElement('video');
  NewVideo.id = obj.Identifier;
  NewVideo.width = obj.Width * scale;
  NewVideo.height = obj.Height * scale;
  var Left = obj.Left * scale;
  var Top = obj.Top * scale;
  $('#IntroDiv' + divID).append(NewVideo);

  $('#' + NewVideo.id).css({
    position: 'absolute',
    left: Left + MainObj.CanvasL,
    top: Top + MainObj.CanvasT
  });

  NewVideo.src = 'Resource/' + setExt(obj.VideoFileName);

  //是否有控制列
  if (obj.SliderBar == 'true') {
    $('#' + NewVideo.id).attr('controls', true);
  }

  //是否自動撥放
  if (obj.AutoPlay == '1') {
    $('#' + NewVideo.id).attr('autoplay', true);
  }

  //是否結束後淡出
  if (obj.Fadeout == 'true') {
    $('#' + NewVideo.id).on('ended', function () {
      // done playing
      $(this).fadeOut(400, function () {
        $(this).remove();
      });
    });
  }

  $('#' + NewVideo.id).click(function () {
    if (NewVideo.paused) {
      NewVideo.play();
    } else {
      NewVideo.pause();
    }
  });

  $('#' + NewVideo.id).on('play', function () {
    // playing
    if ($('#Narration')[0]) {
      $('#Narration')[0].pause();
    }
  });

  $('#' + NewVideo.id).on('pause ended', function () {
    // pause
    if ($('#Narration')[0]) {
      $('#Narration')[0].play();
    }
  });

  SyncVideoSet(NewVideo.id);
}

function ObjListSet(obj) {
  var objList = [];

  if (obj.length == undefined) {
    obj = [obj];
  }

  for (var i = 0; i < obj.length; i++) {
    var objsAttributes = {
      FormatterType: TypeNameSet(obj[i].FormatterType),
      Identifier: obj[i].Identifier,
      XFileName: obj[i].XFileName,
      zIndex: obj[i].LayerIndex,
      Width: Number(obj[i]['BoundaryPoint.Bounds.Size.Width']),
      Height: Number(obj[i]['BoundaryPoint.Bounds.Size.Height']),
      Left: Number(obj[i]['BoundaryPoint.Bounds.Location.X']),
      Top: Number(obj[i]['BoundaryPoint.Bounds.Location.Y']),
      Rotate: Number(obj[i].Rotate),
      BorderColor: argbToRGB(obj[i].BorderColor),
      Brush: argbToRGB(obj[i].Brush),
      BorderWidth: obj[i].BorderWidth,
      BackgroundXFileName: obj[i].BackgroundXFileName, //背景圖

      //動態平移屬性
      MoveDirection: obj[i].MoveDirection,
      Orientation: obj[i].Orientation,
      Paging: obj[i].Paging,
      PlayingInterval: obj[i].PlayingInterval,
      Size: obj[i].Size,
      Looping: obj[i].Looping,
      ShiftPointX: Number(obj[i]['ShiftPoint.X']),
      ShiftPointY: Number(obj[i]['ShiftPoint.Y']),

      //影片屬性
      AutoPlay: obj[i].AutoPlay, //影片自動撥放
      Fadeout: obj[i].Fadeout, //影片淡出
      SliderBar: obj[i].SliderBar, //影片淡出
      VideoFileName: obj[i].VideoFileName, //影片src

      //超連結屬性
      InteractiveType: obj[i].InteractiveType, //超連結類型
      JumpToProcedureSliceIndex: obj[i].JumpToProcedureSliceIndex, //連結跳頁
      PathUrl: obj[i].PathUrl, //超連結網址

      //感應區屬性
      PathFileName: obj[i].PathFileName, //另開附件
      PlayingStateShow: obj[i].PlayingStateShow,

      //圖影定位屬性
      Position: {
        X: obj[i].X,
        Y: obj[i].Y,
        W: obj[i].W,
        H: obj[i].H
      }, //圖影定位位置及大小
      AudioPathFileName: obj[i].AudioPathFileName, //圖影定位音效
      Background: obj[i].Background, //圖影定位bg frame
      SingleSelect: obj[i].SingleSelect, //圖影定位是否單張顯示

      //360屬性
      ImageList: obj[i].ImageList, //圖片清單(360、動態平移、幻燈片)
      AutoplayInterval: obj[i].AutoplayInterval, //360播放每張圖片的時間間隔，單位是毫秒
      PinchZoom: obj[i].PinchZoom, //360物件可否放大至全螢幕
      Autoplay: obj[i].Autoplay, //360物件是否自動撥放
      Looping: obj[i].Looping, //360物件是否循環

      //輔助視窗屬性
      IntroductionObjectList: obj[i].IntroductionObjectList, //輔助視窗物件
      DragEnable: obj[i].DragEnable,

      //點選題
      CorrectOrder: obj[i].RectangleOrderIndex, //點選題順序
      Selected: false,

      //文字框
      CharSetImg: obj[i].CharSetImg,
      TextFontColor: argbToRGB(obj[i].TextFontColor),
      TextFontSize: obj[i].TextFontSize,
      TextString: obj[i].TextString
    };
    objList[i] = objsAttributes;
  }
  return objList;
}

function TypeNameSet(type) {
  switch (type) {
    //背景
    case 'Hamastar.AddIns.Introduction.IntroductionBackgroundFormatter':
      return 'Background';
      break;

      //動態平移
    case 'Hamastar.AddIns.Introduction.IntroductionPictureScrollObjectFormatter':
      return 'ScrollObject';
      break;

      //圖片
    case 'Hamastar.AddIns.Introduction.IntroductionPictureObjectFormatter':
      return 'ImageLayer';
      break;

      //關閉按鈕
    case 'Hamastar.AddIns.Introduction.IntroductionCloseButtonFormatter':
      return 'CloseButton';
      break;

      //超連結
    case 'Hamastar.AddIns.Introduction.IntroductionHyperLinkObjectFormatter':
      return 'HyperLinkObject';
      break;

      //圖影定位(感應區)
    case 'Hamastar.AddIns.Introduction.IntroductionSetLocationObjectFormatter':
      return 'AdditionalFile';
      break;

      //感應區
    case 'Hamastar.AddIns.Introduction.IntroductionAdditionalFileObjectFormatter':
      return 'AdditionalFile';
      break;

      //360
    case 'Hamastar.AddIns.Introduction.IntroductionRotationImageObjectFormatter':
      return 'RotationImage';
      break;

      //影片
    case 'Hamastar.AddIns.Introduction.IntroductionVideoObjectFormatter':
      return 'VideoObject';
      break;

      //輔助視窗
    case 'Hamastar.AddIns.Introduction.IntroductionIntroductionObjectFormatter':
      return 'Introduction';
      break;

      //塗抹
    case 'Hamastar.AddIns.Introduction.IntroductionErasingPictureObjectFormatter':
      return 'ErasingPicture';
      break;

      //點選題(正確)
    case 'Hamastar.AddIns.Introduction.IntroductionTouchRectangleObjectFormatter':
      return 'CorrectBox';
      break;

      //點選題(錯誤)
    case 'Hamastar.AddIns.Introduction.IntroductionLimitedRangeObjectFormatter':
      return 'ErrorBox';
      break;

      //文字框
    case 'Hamastar.AddIns.Introduction.IntroductionTextObjectFormatter':
      return 'TextObject';
  }
}

//點選題canvas設置
function IntroQuizSet(obj, objlist) {
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
  $('#' + canvasQuizID).css({
    left: Left,
    top: Top
  });

  var canvas = $('#' + canvasQuizID)[0];
  var cxt = $('#' + canvasQuizID)[0].getContext('2d');
  resizeCanvas(canvas, cxt);

  drawButtonImage(obj, cxt, Width, Height);

  $('#' + canvasQuizID).click(function () {
    TouchModule(obj.FormatterType, this, MainObj.NowPage, objlist);
  });
}

//輔助彈跳視窗文字框設置
function IntroTextSet(obj, divId) {
  var text = document.createElement('textarea');
  $('#IntroDiv' + divId).append(text);
  text.id = obj.Identifier;
  $(text).addClass('canvasObj');
  var scale = MainObj.Scale;
  var Left = obj.Left * scale + MainObj.CanvasL;
  var Top = obj.Top * scale + MainObj.CanvasT;
  var Width = obj.Width * scale;
  var Height = obj.Height * scale;
  $(text).css({
    'left': Left,
    'top': Top,
    'width': Width,
    'height': Height,
    'position': 'absolute',
    // 'z-index': 1,
    'resize': 'none',
    'border': '1px solid',
    'outline': 0,
    'font-family': 'microsoft jhenghei ui',
    'font-size': obj.TextFontSize + 'px',
    'color': obj.TextFontColor,
    'overflow-y': 'scroll'
  });
  $(text).attr('readonly', true);
  $(text).val(obj.TextString);
  $(text).on('mousemove', function (e) {
    isMouseInText = true;
  })
  $(text).on('mouseout', function (e) {
    isMouseInText = false;
  })
}