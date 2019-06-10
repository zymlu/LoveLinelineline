//超連結

var hyperLink = {
    saveList: []
};


function HyperLinkSet(obj) {

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
        'left': Left,
        'top': Top
    });

    var canvas = $('#' + canvasID)[0];
    var cxt = $('#' + canvasID)[0].getContext('2d');
    resizeCanvas(canvas, cxt);

    drawButtonImage(obj, cxt, Width, Height);

    switch (obj.InteractiveType) {

        //連結跳頁
        case 'Default':
            $('#' + canvasID).click(function (e) {
                e.preventDefault();
                gotoPage(Number(obj.JumpToProcedureSliceIndex));

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('goto' + syncPage);
                rmcall(message);
            })
            break;

            //連結網頁
        case 'PathUrl':
            $('#' + canvasID).click(function (e) {
                e.preventDefault();
                window.open(obj.PathUrl);
            })
            break;

    }
}
