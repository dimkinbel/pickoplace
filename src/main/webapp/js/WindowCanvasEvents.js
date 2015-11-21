/**
 * Created by dima on 19-Nov-15.
 */
var canvasMouseOut = false;
var canvasMouseDown = false;

window.addEventListener('mouseup', function(e) {
    if(canvasMouseOut==true) {
        canvas_.mouseUpEvent();
        canvasMouseOut = false;
    }
});
window.addEventListener('mousemove', function(e) {
    if(canvasMouseOut==true) {
        canvas_.mouseMoveEvent(e);
    }
});

