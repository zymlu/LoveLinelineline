// AR


var patternUrl;
var is_AR_error = false;

function ARInit(obj) {
	if (!$('#' + obj.Identifier)[0]) {
		NewCanvas(obj);

	    var scale = MainObj.Scale;
	    var Left = obj.Left * scale + MainObj.CanvasL;
	    var Top = obj.Top * scale + MainObj.CanvasT;
	    var Width = obj.Width * scale;
	    var Height = obj.Height * scale;

	    $('#canvas')[0].class = 'canvasObj';
	    $('#canvas')[0].width = Width;
	    $('#canvas')[0].height = Height;
	    $('#canvas').css({ 'left': Left, 'top': Top });

	    var canvas = $('#canvas')[0];
	    var cxt = canvas.getContext('2d');
	    resizeCanvas(canvas, cxt);

	    canvas.id = obj.Identifier;

	    var img = new Image();
	    img.onload = function() {
	        cxt.drawImage(img, 0, 0, Width, Height);
	    }
	    img.src = 'Resource/' + setExt(obj.ARMarkedFileName);

		if (location.protocol != 'https:') {
	    	alert('不支援AR實境功能');
			return;
		}

	    // alert('請點擊圖片並啟用相機，即可開啟AR實境功能');

	    $(canvas).click(function(e) {
			e.preventDefault();
			ARset(obj);
	    })
	}
}


function ARset(obj) {

	if ($('#AR')[0]) {
		return;
	}

	if (navigator.mediaDevices === undefined || navigator.mediaDevices.enumerateDevices === undefined || navigator.mediaDevices.getUserMedia === undefined  ){
		if( navigator.mediaDevices === undefined ) {
			var fctName = 'navigator.mediaDevices';
		} else if( navigator.mediaDevices.enumerateDevices === undefined ){
			var fctName = 'navigator.mediaDevices.enumerateDevices';
		} else if( navigator.mediaDevices.getUserMedia === undefined ) {
			var fctName = 'navigator.mediaDevices.getUserMedia'
		}
	}

	var imgUrl = 'Resource/' + setExt(obj.ARMarkedFileName);

	THREEx.ArPatternFile.encodeImageURL(imgUrl, function onComplete(patternFileString){

		var domElement = window.document.createElement('a');
		domElement.href = window.URL.createObjectURL(new Blob([patternFileString], {type: 'text/plain'}));
		patternUrl = domElement.href;

		var aScene = document.createElement('a-scene');
		aScene.id = 'AR';
	    $('#example').before(aScene);
	    $(aScene).attr({
	    	'arjs': 'trackingMethod: best'
	    })

	    var aAssets = document.createElement('a-assets');
	    $(aScene).append(aAssets);

	    var video = document.createElement('video');
	    video.id = 'ARvideo';
	    $(aAssets).append(video);
	    video.src = 'Resource/' + setExt(obj.ARObjectList.VideoFileName);

	    var aMarker = document.createElement('a-marker');
	    $(aScene).append(aMarker);
	    $(aMarker).attr({
	    	'preset': 'custom'
	    })

	    var aVideo = document.createElement('a-video');
	    $(aMarker).append(aVideo);
	    $(aVideo).attr({
	    	'width': '4',
	    	'height': '3',
	    	'rotation': '-90 0 0',
	    	'src': '#ARvideo'
	    })

	    var aCamera = document.createElement('a-camera-static');
	    $(aScene).append(aCamera);

	    var closeBtn = document.createElement('img');
	    $('body').append(closeBtn);
	    closeBtn.id = 'backButton';
	    closeBtn.src = 'ToolBar/Home-icon.png';
	    $(closeBtn).click(function(e) {
			e.preventDefault();
	    	sessionStorage.setItem('page', MainObj.NowPage);
	    	location.reload();
	    })

	});
}