/**
 * Created by dima on 01-Apr-16.
 */
var bookingOrder ;
function addAdminReservationInteractive(sid) {
    emptyAdminReservation();
    if(tl_canvas.adminSelection != null) {
        var fromSec = tl_canvas.adminSelection.from;
        var toSec = tl_canvas.adminSelection.to;
        var fromDate = new Date(tl_canvas.adminSelection.from * 1000);
        var toDate = new Date(tl_canvas.adminSelection.to * 1000);
        $("#datepicker_ub").datepicker("setDate", new Date(fromDate));
        var clientSecTotal = Math.floor(fromDate.getTime() / 1000) - fromDate.getTimezoneOffset() * 60;
        var clientSecStart = clientSecTotal - Math.floor(clientSecTotal / (24 * 3600)) * (24 * 3600);

        var hours = getLeadingZero(((clientSecStart - (clientSecStart % 3600)) % (3600 * 24)) / 3600);
        var minutes = getLeadingZero((clientSecStart % 3600) / 60);
        var SelectText = hours + ':' + minutes;
        $("#admin_reserve_start_text").html(SelectText);
        $("#admin_reserve_start_val").val(clientSecStart);

        clientSecTotal = Math.floor(toDate.getTime() / 1000) - toDate.getTimezoneOffset() * 60;
        var clientSecEnd = clientSecTotal - Math.floor(clientSecTotal / (24 * 3600)) * (24 * 3600);

        hours = getLeadingZero(((clientSecEnd - (clientSecEnd % 3600)) % (3600 * 24)) / 3600);
        minutes = getLeadingZero((clientSecEnd % 3600) / 60);
        SelectText = hours + ':' + minutes
        $("#admin_reserve_end_text").html(SelectText);
        $("#admin_reserve_end_val").val(clientSecEnd);

    } else {
        updateClosestAdminReservation();

    }
    var myShape = {};
    var floorName = "";
    for(var f = 0 ;f < floorCanvases.length ; f++) {
        floorCanvases[f].adminSeatSelect = true;
        floorCanvases[f].valid = false;
        for(var s = 0 ; s <floorCanvases[f].shapes.length ; s++ ) {
            if(floorCanvases[f].shapes[s].sid == sid) {
                myShape = floorCanvases[f].shapes[s];
                floorName = floorCanvases[f].floor_name;
                break;
            }
        }
    }

    $(".canvas_timeline_admin_popover_body").popover('hide')
    $("#add_booking_popup").css("right", "0px");
    appendToAdminReservation(myShape ,floorName);
    updateCloseShapesAdminReservation();

}
function appendToAdminReservation(shape,floorName,FloorID) {
    var sid = shape.sid;

    var appendData = '';
    appendData+='   <div class="admin_seat_line" id="admin_seat_line-'+sid+'">';
    appendData+='       <div class="addm_seat_name_"  >'+shape.booking_options.givenName+'</div>';
    appendData+='       <div class="addm_floor_name_"  >('+floorName+')</div>';
    appendData+='       <div class="material-icons adm_seat_remove" id="adm_seat_remove-'+sid+'">close</div>';
    appendData+='   </div> ';
    if (bookingOrder == null || bookingOrder == undefined) {
        bookingOrder = new Hazmana();
    }
    bookingOrder.addSid(sid,shape.booking_options.minPersons);
    $("#admin_seats_add").append(appendData);
    $("#addm_seats_cnt").html("("+bookingOrder.listOfSids.length+")");
    $("#admin_add_reservation_inactive").hide();
    $("#admin_add_reservation").show();
}
function emptyAdminReservation() {
    if(bookingOrder != null && bookingOrder != undefined) {
        var newArray = bookingOrder.listOfSids.slice();
        for(var s = 0 ; s < newArray.length;s++) {
            removeFromAdminReservation(newArray[s]);
        }
    }
    $("#admin_re_user_name").val("");
    $("#admin_re_user_mail").val("");
    $("#admin_re_user_phone").val("");
    $("#admin_re_persons").val(1);
    $("#admin_re_free_text").val("");
    $("#add_note_info").removeClass("material_add_data_exists");
    $("#add_persons_info").removeClass("material_add_data_exists");
    $("#admin_add_reservation").hide();
    $("#admin_add_reservation_inactive").show();
}
function removeFromAdminReservation(shape,floorName,FloorID) {
    var sid = shape.sid;
    $('#admin_seat_line-'+sid).remove();
    if (bookingOrder == null) {
    }

    bookingOrder.removeSid(sid);
    $("#addm_seats_cnt").html("("+bookingOrder.listOfSids.length+")");
    if( bookingOrder == null ||
        bookingOrder == undefined ||
        bookingOrder.listOfSids.length == 0 ||
        $('.shamur_adm').length == bookingOrder.listOfSids.length) {

            $("#admin_add_reservation").hide();
            $("#admin_add_reservation_inactive").show();
    }
}

function updateClosestAdminReservation() {
    $("#admin_reserve_start_dropdown").html('');
    var offset = bookingsManager.simpleList.shapesPrebookedJSON.placeOffset;
    // Update Select ----
    var clientDay = new Date();
    var clientSecTotal  = Math.floor(clientDay.getTime()/1000) - clientDay.getTimezoneOffset()*60;
    var clientSec = clientSecTotal   -  Math.floor(clientSecTotal/(24*3600)) * (24*3600)

    var placeTime = new Date(clientDay.getTime() + clientDay.getTimezoneOffset() * 60 * 1000 + offset * 3600 * 1000);
    var placeHours = placeTime.getHours();
    var placeMinutes = placeTime.getMinutes();
    var placeSecondsTotal = placeHours * 3600 + placeMinutes * 60;
    var selected = false;

    var todayAvailable = true;
    var openStepList = [];
    var daysToCheck  = 30;

    openStepList = bookingsManager.simpleList.getOpenSecondsByDate($("#datepicker_ub").datepicker("getDate").getTime() / 1000,true);
    if(daysToCheck == 0) {
        alert("Place closed at least next 30 days");
        return;
    }
    if(todayAvailable == true) {

    } else {

    }
    var selectedTime = "";
    var stillOpen = false;
      $("#admin_reserve_start_val").parent().addClass("dropdown-toggle");
      $("#admin_reserve_start_val").removeClass('dropdown_disabled');
      $("#admin_reserve_end_val").parent().addClass("dropdown-toggle");
      $("#admin_reserve_end_val").removeClass('dropdown_disabled');

    var SelectVal = openStepList[0];
    var hours = getLeadingZero(((SelectVal - (SelectVal % 3600)) % (3600 * 24)) / 3600);
    var minutes = getLeadingZero((SelectVal % 3600) / 60);
    var SelectText =  hours + ':' + minutes;
    for (var sl = 0; sl < openStepList.length; sl += 1) {
            var s = openStepList[sl];
            hours = getLeadingZero(((s - (s % 3600)) % (3600 * 24)) / 3600);
            minutes = getLeadingZero((s % 3600) / 60);
            var selectedTime = hours + ':' + minutes;
            var selectTime = new Date($("#datepicker_ub").datepicker("getDate").getTime() + clientDay.getTimezoneOffset() * 60 * 1000 + offset * 3600 * 1000 + s * 1000);

            if (placeTime.getTime() < selectTime.getTime() && selected == false) {
                selected = true;
                SelectVal = s;
                SelectText = selectedTime;
                $("#admin_reserve_start_val").val(s);
                stillOpen = true;
            }
            var nextDaySign = "";
            if(s > 24*3600) {
                nextDaySign = '<div class="plus_day"> +1</div>';
            }
            $("#admin_reserve_start_dropdown").append('<li  ><a href="#" data-period="' + s + '">' + hours + ':' + minutes + nextDaySign+'</a></li>');
     }
     $("#admin_reserve_start_text").html(SelectText);
     $("#admin_reserve_start_val").val(SelectVal);
     $("#admin_reserve_start_val").parent().attr("data-toggle", "dropdown");
     $("#admin_reserve_start_val").parent().attr("aria-haspopup", "true");
     $("#admin_reserve_start_val").parent().attr("aria-expanded", "true");


    updateAvailableEndPeriods();
    // -----------------
}
function updateAvailableEndPeriods() {
    var selectedPeriod = parseInt($("#from_period_val").val());
    var startVal = parseInt($("#admin_reserve_start_val").val());
    openStepList = bookingsManager.simpleList.getOpenSecondsByDate($("#datepicker_ub").datepicker("getDate").getTime() / 1000,true,true);
    $("#admin_reserve_end_dropdown").html('');


    $("#admin_reserve_end_val").parent().addClass("dropdown-toggle");
    $("#admin_reserve_end_val").removeClass('dropdown_disabled');

    var SelectVal = startVal + selectedPeriod;
    var hours = getLeadingZero(((SelectVal - (SelectVal % 3600)) % (3600 * 24)) / 3600);
    var minutes = getLeadingZero((SelectVal % 3600) / 60);
    var SelectText =  hours + ':' + minutes;
    if(openStepList[openStepList.length - 1] < SelectVal) {
        SelectVal = openStepList[openStepList.length - 1];
        hours = getLeadingZero(((SelectVal - (SelectVal % 3600)) % (3600 * 24)) / 3600);
        minutes = getLeadingZero((SelectVal % 3600) / 60);
        SelectText = hours + ':' + minutes;
    }
    for (var sl = 0; sl < openStepList.length; sl += 1) {
        if(openStepList[sl] < SelectVal) {continue;}
        var s = openStepList[sl];
        hours = getLeadingZero(((s - (s % 3600)) % (3600 * 24)) / 3600);
        minutes = getLeadingZero((s % 3600) / 60);
        var selectedTime = hours + ':' + minutes;

        if (openStepList[sl] == SelectVal) {
            SelectVal = s;
            SelectText = selectedTime;
            $("#admin_reserve_end_val").val(s);
            stillOpen = true;
        }
        var nextDaySign = "";
        if(s > 24*3600) {
            nextDaySign = '<div class="plus_day"> +1</div>';
        }
        $("#admin_reserve_end_dropdown").append('<li  ><a href="#" data-period="' + s + '">' + hours + ':' + minutes + nextDaySign+'</a></li>');
    }
    $("#admin_reserve_end_text").html(SelectText);
    $("#admin_reserve_end_val").val(SelectVal);
    $("#admin_reserve_end_val").parent().attr("data-toggle", "dropdown");
    $("#admin_reserve_end_val").parent().attr("aria-haspopup", "true");
    $("#admin_reserve_end_val").parent().attr("aria-expanded", "true");

}


function updateCloseShapesAdminReservation() {
    $(".adm_free_seat").remove();
    $(".adm_closed_seat").remove();
    $(".adm_saved_seat").remove();
    var DateSeconds = parseInt($("#datepicker_ub").datepicker( "getDate" ).getTime()/1000);
    var StartSeconds = parseInt($("#admin_reserve_start_val").val());
    var EndSeconds = parseInt($("#admin_reserve_end_val").val())
    var PeriodSeconds = parseInt(EndSeconds - StartSeconds );

    for (var f = 0 ;f < floorCanvases.length ; f++) {
        var openObject = bookingsManager.simpleList.getAvailableSids(floorCanvases[f],DateSeconds + StartSeconds,DateSeconds + StartSeconds + PeriodSeconds ,false);

        var fwidth = floorCanvases[f].origWidth;
        var fheight = floorCanvases[f].origHeight;
        var floorid = floorCanvases[f].floorid;

        if(openObject.open == true && openObject.passed == false) {
            for(var s=0; s <floorCanvases[f].shapes.length ;s++) {
                floorCanvases[f].shapes[s].isAvailable = true;
                if(openObject.sidList[floorCanvases[f].shapes[s].sid] == undefined) {
                    floorCanvases[f].shapes[s].isAvailable = false;
                    $("#div_wrap-canvas_"+floorid).append('<div class="adm_saved_seat" style="left:'+parseFloat(100*floorCanvases[f].shapes[s].x/fwidth)+'%;top:'+parseFloat(100*floorCanvases[f].shapes[s].y/fheight)+'%;">שמור</div>');
                    var shamur_str = "<div class='shamur_adm' id='shamur_adm-"+floorCanvases[f].shapes[s].sid+"'>"+"שמור"+"</div>";
                    $("#admin_seat_line-"+floorCanvases[f].shapes[s].sid).append(shamur_str);
                } else {
                    $("#div_wrap-canvas_"+floorid).append('<div class="adm_free_seat" style="left:'+parseFloat(100*floorCanvases[f].shapes[s].x/fwidth)+'%;top:'+parseFloat(100*floorCanvases[f].shapes[s].y/fheight)+'%;">פנוי</div>');
                    $("#shamur_adm-"+floorCanvases[f].shapes[s].sid).remove();
                }
               /* floorCanvases[f].shapes[s].isAvailable = true;
                floorCanvases[f].shapes[s].ordered = false;
                floorCanvases[f].shapes[s].placeClosed = false;
                if(openObject.sidList[floorCanvases[f].shapes[s].sid] == undefined) {
                    floorCanvases[f].shapes[s].isAvailable = false;
                    if(openObject.orderedList[floorCanvases[f].shapes[s].sid] != undefined) {
                        floorCanvases[f].shapes[s].ordered = true;
                    }
                }*/
            }

        } else {
            for(var s=0; s <floorCanvases[f].shapes.length ;s++) {
                floorCanvases[f].shapes[s].isAvailable = false;
                floorCanvases[f].shapes[s].placeClosed = true;
                $("#div_wrap-canvas_"+floorid).append('<div class="adm_closed_seat" style="left:'+parseFloat(100*floorCanvases[f].shapes[s].x/fwidth)+'%;top:'+parseFloat(100*floorCanvases[f].shapes[s].y/fheight)+'%;">סגור</div>');
            }
        }
        floorCanvases[f].valid = false;
    }
    if(bookingOrder == null || bookingOrder == undefined) {
        $("#admin_add_reservation").hide();
        $("#admin_add_reservation_inactive").show();
    } else {
        if (bookingOrder.listOfSids.length == 0 || $('.shamur_adm').length == bookingOrder.listOfSids.length) {
            $("#admin_add_reservation").hide();
            $("#admin_add_reservation_inactive").show();
        } else {
            $("#admin_add_reservation_inactive").hide();
            $("#admin_add_reservation").show();

        }
    }
}