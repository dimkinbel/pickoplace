/**
 * Created by dima on 31-Mar-16.
 */
var bookingOrder = null;
function emptyOrder() {
    var list_ = [];
    for (var b = 0; b < bookingOrder.listOfSids.length; b++) {
        list_.push(bookingOrder.listOfSids[b].sid);
    }
    for (var s = 0; s < list_.length; s++) {
        cancelFromOrder(list_[s]);
    }
}
function Booking_addToOrder(sid, iframe_) {
    var iframe = false;
    if (bookingOrder != null) {
        if (bookingsManager.bookingProperties.SidUnlimited == false && bookingsManager.bookingProperties.maxSids == bookingOrder.listOfSids.length) {
            var firstAdded = bookingOrder.listOfSids[0];
            Booking_removeFromOrder(firstAdded.sid, iframe_);
        }
    }
    if (bookingOrder == null) {
        bookingOrder = new Hazmana();
        if (iframe_ != undefined && iframe_ == true) {
            $("#hazmana_iframe_button_empty").hide();
            $("#hazmana_iframe_button").show();
        } else {
            $("#hz_text_o").html('הזמנה');
            $("#booking_top_button").removeClass("disabled");
        }
    }
    if (iframe_ == undefined || iframe_ == false) {

    } else {
        iframe = true;
    }
    var persons = $("#persons_bs_select-" + sid).val();
    var floorID = bookingOrder.addSid(sid, persons, iframe);

    $("#book_bnt_count").html(bookingOrder.listOfSids.length);
    $("#hazmana_badge").html(bookingOrder.listOfSids.length);
    $("#book_bnt_count").show();
    $('#canvas_popover').popover('hide');
    $("#iframe_popover").popover('hide');


    var floorList = floorCanvases;
    if (iframe_ != undefined && iframe_ == true) {
        iframe = true;
        floorList = if_floorCanvases
    }
    for (var f = 0; f < floorList.length; f++) {
        var count = 0;
        for (var s = 0; s < floorList[f].shapes.length; s++) {
            if (floorList[f].shapes[s].choosen == true) {
                count++;
            }
        }
        if (count > 0) {
            $("#fbadge-" + floorList[f].floorid).html(count);
            $("#fbadge-" + floorList[f].floorid).show();
        } else {
            $("#fbadge-" + floorList[f].floorid).hide();
        }
    }
}
function Booking_removeFromOrder(sid, iframe_) {
    if (bookingOrder == null) {
        //bookingOrder = new Hazmana();
        //$("#booking_top_button").removeClass("disabled");
    }
    var iframe = false;
    var floorList = floorCanvases;
    if (iframe_ != undefined && iframe_ == true) {
        iframe = true;
        floorList = if_floorCanvases
    }
    bookingOrder.removeSid(sid, iframe_);
    $("#book_bnt_count").html(bookingOrder.listOfSids.length);
    $("#hazmana_badge").html(bookingOrder.listOfSids.length);
    if (bookingOrder.listOfSids.length == 0) {
        $("#book_bnt_count").hide();
        $("#hz_text_o").html('הזמנה ריקה');
        $("#booking_top_button").addClass("disabled");

        $("#hazmana_iframe_button").hide();
        $("#hazmana_iframe_button_empty").show();
        bookingOrder = null;
    }
    $('#canvas_popover').popover('hide');
    $("#iframe_popover").popover('hide');

    for (var f = 0; f < floorList.length; f++) {
        var count = 0;
        for (var s = 0; s < floorList[f].shapes.length; s++) {
            if (floorList[f].shapes[s].choosen == true) {
                count++;
            }
        }
        if (count > 0) {
            $("#fbadge-" + floorList[f].floorid).html(count);
            $("#fbadge-" + floorList[f].floorid).show();
        } else {
            $("#fbadge-" + floorList[f].floorid).hide();
        }
    }
}
function cancelFromOrder(sid, iframe_) {
    var iframe = false;
    if (iframe_ != undefined && iframe_ == true) {
        iframe = true;
    }
    Booking_removeFromOrder(sid, iframe);
    if (bookingOrder == null) {
        $('#booking_order_modal').modal('hide');
    } else {
        $('#hz_sid_line-' + sid).remove();
    }
}