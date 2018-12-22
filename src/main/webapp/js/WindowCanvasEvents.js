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
    $( ".scroll_right_tp_canvas" ).trigger( "mouseup" );
    $( ".scroll_left_tp_canvas" ).trigger( "mouseup" );
});
window.addEventListener('mousemove', function(e) {
    if(canvasMouseOut==true) {
        canvas_.mouseMoveEvent(e);
    }
});

