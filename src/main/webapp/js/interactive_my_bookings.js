/**
 * Created by dima on 20-Nov-15.
 */
function cancelBooking(this_) {
    setSessionData(function(result) {
        if(result) {
            var id = this_.id;
            var bid = this_.id.replace(/^sb_cancel_/, "");
            $.ajax({
                url : "/clientCancelBooking",
                data: {bid:bid},//
                success : function(data){
                    console.log(data);
                    if(data.status == "removed") {
                        window.location.reload(true);
                    } else if (data.status == "nouser") {
                        window.location.href("/");
                    }
                },
                dataType : "JSON",
                type : "post"
            });
        } else {
            updatePageView();
        }});
}

var currently_loaded_future = 0;
var currently_loaded_past = 0;

function loadFuture(num) {
    var ClientBookingHistoryRequestDTOfuture = {};
    ClientBookingHistoryRequestDTOfuture.clientID = "";
    ClientBookingHistoryRequestDTOfuture.fromNum = currently_loaded_future;
    ClientBookingHistoryRequestDTOfuture.maxBookings = num;
    ClientBookingHistoryRequestDTOfuture.future = true;
    var bookingjson = {bookingHistory:JSON.stringify(ClientBookingHistoryRequestDTOfuture)};
    $.ajax({
        url : "/clientBookingHistory",
        data: bookingjson,//
        beforeSend: function () { $("#sb_ajax_gif_future").show(); },
        success : function(data){
            if(data.logged==true) {
                $("#sb_ajax_gif_future").hide();
                console.log("Future Success");
                console.log(data);
                updateBookings("next_bookings_div",data,true);
            } else {
                location.href = "/";
            }
        },
        dataType : "JSON",
        type : "post"
    });
}
function loadPast(num) {
    var ClientBookingHistoryRequestDTOpast = {};
    ClientBookingHistoryRequestDTOpast.clientID = "";
    ClientBookingHistoryRequestDTOpast.fromNum = currently_loaded_past;
    ClientBookingHistoryRequestDTOpast.maxBookings = num;
    ClientBookingHistoryRequestDTOpast.future = false;
    var bookingjson = {bookingHistory:JSON.stringify(ClientBookingHistoryRequestDTOpast)};
    $.ajax({
        url : "/clientBookingHistory",
        data: bookingjson,//
        beforeSend: function () { $("#sb_ajax_gif_past").show(); },
        success : function(data){
            if(data.logged==true) {
                $("#sb_ajax_gif_past").hide();
                console.log("Past Success");
                console.log(data);
                updateBookings("past_bookings_div",data,false);
            } else {
                location.href = "/";
            }
        },
        dataType : "JSON",
        type : "post"
    });
}
