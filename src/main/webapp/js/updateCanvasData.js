/**
 * Created by dima on 17-Nov-15.
 */


var floorCanvases = [];
var floorNames = {};
var floorid2canvas = {};
var maincanvas ;
var mainOverviewID;

function updateCanvasData() {
    var allfloors = document.getElementsByName("server_canvasState");
    for (var x = 0; x < allfloors.length; x++) {
        var canvasfloor = allfloors[x].id;
        var floorID = canvasfloor.replace(/^server_canvasState_/, "");
        canvas_ = new CanvasState(document.getElementById("canvas_" + floorID));
        canvas_.main = true;
        floorCanvases.push(canvas_);
        var floorname = document.getElementById("server_floor_name_" + floorID).value;
        floorNames[floorname] = canvas_;
        canvas_.floor_name = floorname;
        floorid2canvas[floorID] = canvas_;

        var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
        if (canvasStateJSON.state.backgroundType != "color") {
            updateBackgroundImageByServer(canvasfloor);
        }
        if (canvasStateJSON.mainfloor) {
            $("#floor__selector").prepend($('<option value="' + floorname + '">' + floorname + '</option>'));
            $("#floor__selector [value='" + floorname + "']").attr("selected", "selected");
            maincanvas = canvas_;
            mainOverviewID = "server_overview_"+ floorID;
        } else {
            $("#floor__selector").append($('<option value="' + floorname + '">' + floorname + '</option>'));
        }
    }

// Update all canvases
    for (var x = 0; x < allfloors.length; x++) {
        var canvasfloor = allfloors[x].id;
        var floorID = canvasfloor.replace(/^server_canvasState_/, "");
        var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
        updateCanvasShapes(floorid2canvas[floorID], canvasStateJSON);
        if(pagetype!=undefined && (pagetype=='editplace')) {
            floorid2canvas[floorID].mode("bg");
        }
    }
// Floor selector update
    canvas_ = maincanvas;

    // Create BAW images
    var all = document.getElementsByName("shape_images_from_server");
    totalImages = all.length + 1;

    for (var x = 0; x < all.length; x++) {
        var serverImageID = all[x].id;
        if($("#baw_images").length == 1) {
            createBAWimage(serverImageID);
        }
    }
}

function createBAWimage(imgID) {
    var images4load = {};
    var img_=  document.getElementById(imgID);
    images4load = new Image();
    images4load.crossOrigin = 'anonymous';
    images4load.src = document.getElementById(imgID).src ;

    images4load.onload = function() {
        actualWidth = this.width;
        actualHeight = this.height;
        document.getElementById("filtered_canvas").width = actualWidth;
        document.getElementById("filtered_canvas").height = actualHeight;
        var canvas = document.getElementById("filtered_canvas");
        var context = canvas.getContext("2d");
        context.drawImage(img_,0,0,actualWidth,actualHeight);

        var imgd = context.getImageData(0, 0, actualWidth, actualHeight);
        var pix = imgd.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
            pix[i] = grayscale;   // red
            pix[i+1] = grayscale;   // green
            pix[i+2] = grayscale;   // blue
        }
        context.putImageData(imgd, 0, 0);
        var appendData = '<img id="'+imgID+'_baw" />';
        $("#baw_images").append(appendData);
        $("#"+imgID+"_baw").attr("src",canvas.toDataURL('image/png'));
    }
}
