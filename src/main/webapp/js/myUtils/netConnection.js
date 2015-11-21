/**
 * Created by dima on 19-Nov-15.
 */
function hasNetConnection() {
    var img = $("<img />").attr('src', 'https://storage.googleapis.com/pickoplace.appspot.com/onepixel.gif').on('load', function() {
        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
            return false;
        } else {
            return true;
        }
    });
}
function isOrigin(callback) {
    $.ajax({
        url : "http://www.pickoplace.com/isorigin",
        success : function(data){
            return callback(true);
        },
        error : function(e) {
            return callback(false);
        }
    });
}
