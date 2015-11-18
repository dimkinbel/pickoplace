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
// Update all shapes images
    var all = document.getElementsByName("shape_images_from_server");
    totalImages = all.length + 1;
    for (var x = 0; x < all.length; x++) {
        var serverImageID = all[x].id;
        //   updateShapeImagesByServerData(serverImageID);
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
}