function updateIframePopover(popover_hidden_wrap_id, shape) {

    var floorCanvas;
    for (var f = 0; f < if_floorCanvases.length; f++) {
        for (var s = 0; s < if_floorCanvases[f].shapes.length; s++) {
            if (if_floorCanvases[f].shapes[s].sid == shape.sid) {
                floorCanvas = if_floorCanvases[f];
            }
        }
    }
    if (iframeDateSelected == false) {
        var appendData = '';
        appendData += '<div class="container-fluid ">';
        appendData += '		<div class="row iframe_place_popover_top">';
        appendData += '			<div class="col-md-12 iframe_popover_sid_name">';
        appendData += '			    ' + shape.booking_options.givenName;
        appendData += '			</div>';
        appendData += '		</div>';
        appendData += '		<div class="row iframe_place_popover_content"   data-toggle="tooltip"   data-placement="top" title="כמות אורחים אפשריים">';
        appendData += '			<div class="col-xs-6 iframe_popover_val">';

        if (bookingsManager != undefined && shape.isAvailable == true) {
            appendData += '		    <div class="iframe_popup_bs_selector_wrap">';
            appendData += '		    <div class="my_bs_selector_wrap">';
            appendData += '			   <select class="my_bs_selector" id="persons_bs_select-' + shape.sid + '"  >';
            for (var p = shape.booking_options.minPersons; p <= shape.booking_options.maxPersons; p++) {
                if (p == parseInt($("#book_persons_val_").val())) {
                    appendData += '				  <option selected>' + p + '</option>';
                } else {
                    appendData += '				  <option >' + p + '</option>';
                }
            }
            appendData += '				</select>';
            appendData += '			</div>';
            appendData += '			</div>';
        } else {
            if (shape.booking_options.minPersons == shape.booking_options.maxPersons) {
                appendData += '			   ' + shape.booking_options.minPersons;
            } else {
                appendData += '			   ' + shape.booking_options.minPersons + '-' + shape.booking_options.maxPersons + '';
            }
        }
        appendData += '			</div> ';
        appendData += '			<div class="col-xs-6 iframe_popover_text">';
        appendData += '			   <div class="material-icons">people</div>';
        appendData += '			</div> ';
        appendData += '		</div>';
        if (currentIframeSettings.booking == true) {
            appendData += '		<div class="row iframe_place_popover_footer">';
            if (bookingsManager == undefined) {
                appendData += '			 <div id="missing_date_notice"> ';
                appendData += '			     <div class="material-icons missing_date_notice_mat">schedule</div> ';
                appendData += '				 <div class="md_heb notice_text" >בחר תאריך ההזמנה</div> ';
                appendData += '			</div> ';
            } else if (shape.isAvailable == false) {
                if(shape.placeClosed == true) {
                    appendData += '<div class="iframe_popup_not_available" >מקום סגור</div>';
                } else if(shape.ordered == true) {
                    appendData += '<div class="iframe_popup_not_available" >מקום שמור</div>';
                } else if(shape.booking_options.minPersons < parseInt($("#book_persons_val_").val()) ||
                    shape.booking_options.maxPersons > parseInt($("#book_persons_val_").val())) {
                    appendData += '<div class="iframe_popup_not_available" >לא תואם כמות אנשים</div>';
                }

            } else if (shape.choosen == false) {
                appendData += '			 <div id="iframe_popup_sid_book-' + shape.sid + '" class="iframe_popup_sid_book" onclick="Booking_addToOrder(\'' + shape.sid + '\',true)"> ';
                appendData += '			     <div class="material-icons missing_date_notice_mat">schedule</div> ';
                appendData += '				 <div class="md_heb notice_text" >הוסף להזמנה</div> ';
                appendData += '			</div> ';
            } else {
                appendData += '			 <div id="iframe_popup_sid_book_remove-' + shape.sid + '" class="iframe_popup_sid_remove" onclick="Booking_removeFromOrder(\'' + shape.sid + '\',true)"> ';
                appendData += '			     <div class="material-icons missing_date_notice_mat">schedule</div> ';
                appendData += '				 <div class="md_heb notice_text" >הסר מהזמנה</div> ';
                appendData += '			</div> ';
            }

            appendData += '		</div>';
        } else {

        }
        appendData += '	</div>';
    } else {

    }

    $("#" + popover_hidden_wrap_id).children().html(appendData);
}

function updateSelectOptions(selid, type, datepickerId, minPeriodSeconds) {
    console.log(type)
    $("#" + selid).html('');

    var offset = bookingsManager.shapesPrebookedJSON.placeOffset;
    // Update Select ----
    var clientDay = new Date();
    var placeTime = new Date(clientDay.getTime() + clientDay.getTimezoneOffset() * 60 * 1000 + offset * 3600 * 1000);
    var placeHours = placeTime.getHours();
    var placeMinutes = placeTime.getMinutes();
    var placeSecondsTotal = placeHours * 3600 + placeMinutes * 60;
    var selected = false;
    //console.log("ddd " + minPeriodSeconds);
    var openStepList = bookingsManager.getOpenSecondsByDate($("#" + datepickerId).datepicker("getDate").getTime() / 1000, minPeriodSeconds);
    console.log(openStepList);

    var selectedTime = "";
    var stillOpen = false;
    if (openStepList.length == 0) {
        if (type == "select") {
            $("#" + selid).append('<option selected disabled>Closed</option>');
        } else if (type == "dropdown") {
            selectedTime = "סגור";
            $("#book_top_start").html(selectedTime);
            $("#book_top_start").parent().removeClass("dropdown-toggle");
            $("#book_top_start").parent().removeAttr("data-toggle");
            $("#book_top_start").parent().removeAttr("aria-haspopup");
            $("#book_top_start").parent().removeAttr("aria-expanded");
            $("#book_top_start").addClass('dropdown_disabled');
            $("#book_start_val_").val("-1");
        }
    } else {
        if (type == "dropdown") {
            $("#book_top_start").parent().addClass("dropdown-toggle");
            $("#book_top_start").removeClass('dropdown_disabled');
        }
        for (var sl = 0; sl < openStepList.length; sl += 1) {
            var s = openStepList[sl];
            var selectedString = "";
            var disabledString = "";
            var hours = getLeadingZero(((s - (s % 3600)) % (3600 * 24)) / 3600);
            var minutes = getLeadingZero((s % 3600) / 60);

            var selectTime = new Date($("#" + datepickerId).datepicker("getDate").getTime() + clientDay.getTimezoneOffset() * 60 * 1000 + offset * 3600 * 1000 + s * 1000);

            if (placeTime.getTime() < selectTime.getTime() && selected == false) {
                selectedString = " selected ";
                selected = true;
                selectedTime = hours + ':' + minutes;
                $("#book_start_val_").val(s);
                stillOpen = true;
            } else {


                if (placeTime.getTime() > selectTime.getTime()) {
                    disabledString = "disabled";
                }
            }

            if (type == "select") {
                $("#" + selid).append('<option value=' + s + ' ' + selectedString + ' ' + disabledString + '>' + hours + ':' + minutes + '</option>');
            } else if (type == "dropdown") {
                if (stillOpen == true) {
                    $("#" + selid).append('<li class="' + disabledString + '"><a href="#" data-period="' + s + '">' + hours + ':' + minutes + '</a></li>');
                }
            }
        }
    }
    if (type == "select") {
        $("#" + selid).change(function () {
            timelines[currentSingleTimeCanvas.canvas.id].redraw();
        })
    } else if (type == "dropdown" && openStepList.length > 0) {
        if (stillOpen == true) {
            $("#book_top_start").html(selectedTime);
            $("#book_top_start").parent().attr("data-toggle", "dropdown");
            $("#book_top_start").parent().attr("aria-haspopup", "true");
            $("#book_top_start").parent().attr("aria-expanded", "true");
        } else {
            selectedTime = "סגור";
            $("#book_top_start").html(selectedTime);
            $("#book_top_start").parent().removeClass("dropdown-toggle");
            $("#book_top_start").parent().removeAttr("data-toggle");
            $("#book_top_start").parent().removeAttr("aria-haspopup");
            $("#book_top_start").parent().removeAttr("aria-expanded");
            $("#book_top_start").addClass('dropdown_disabled');
            $("#book_start_val_").val("-1");
        }

    }

    updateAvailableEndPeriods(openStepList, false);
    // -----------------
}
function updateAvailableEndPeriods(openStepList, onStartSelect) {
    if (onStartSelect == true) {
        openStepList = bookingsManager.getOpenSecondsByDate($("#datepicker_ub").datepicker("getDate").getTime() / 1000, minPeriodSeconds);
    }
    var StartVal = parseInt($("#book_start_val_").val());
    if (StartVal == -1) {
        $("#book_top_period").parent().removeClass("dropdown-toggle");
        $("#book_top_period").parent().removeAttr("data-toggle");
        $("#book_top_period").parent().removeAttr("aria-haspopup");
        $("#book_top_period").parent().removeAttr("aria-expanded");
        $("#book_top_period").addClass('dropdown_disabled');
    } else {
        var periodSelected = parseInt($("#book_period_val_").val());
        var bookLengthListInner = bookingsManager.bookingProperties.bookLength;

        if (bookLengthListInner.length == 1 && bookingsManager.bookingProperties.allDay == false) {

            var EndVal = StartVal + bookLengthListInner[0] * 60;
            var hours = getLeadingZero(((EndVal - (EndVal % 3600)) % (3600 * 24)) / 3600);
            var minutes = getLeadingZero((EndVal % 3600) / 60);
            $("#book_top_period").html(hours + ":" + minutes);
            $("#book_period_val_").val(bookLengthListInner[0] *60);


            $("#book_top_period").parent().removeClass("dropdown-toggle");
            $("#book_top_period").parent().removeAttr("data-toggle");
            $("#book_top_period").parent().removeAttr("aria-haspopup");
            $("#book_top_period").parent().removeAttr("aria-expanded");
            $("#book_top_period").addClass('dropdown_disabled');

        } else {

            $("#book_top_period").parent().addClass("dropdown-toggle");
            $("#book_top_period").removeClass('dropdown_disabled');
            $("#dropdown_period_floors").html("");


            var addedPeriods = 0;
            var lastVal = 0;
            var hours;
            var minutes;

            if(bookingsManager.bookingProperties.allDay == false) {
                for (var e = 0; e < bookLengthListInner.length; e++) {

                    var EndVal = StartVal + bookLengthListInner[e]*60;
                    if (EndVal <= openStepList[openStepList.length - 1] + bookLengthListInner[0]*60) {
                        addedPeriods += 1;
                        lastVal = bookLengthListInner[e]*60;
                        hours = getLeadingZero(((EndVal - (EndVal % 3600)) % (3600 * 24)) / 3600);
                        minutes = getLeadingZero((EndVal % 3600) / 60);
                        $("#dropdown_period_floors").append('<li  ><a href="#" data-period="' + parseInt(bookLengthListInner[e]*60) + '">' + hours + ':' + minutes + '</a></li>');
                        if (bookLengthListInner[e]*60 == periodSelected) {
                            $("#book_top_period").html(hours + ":" + minutes);
                        }
                    }
                }
                if (lastVal != periodSelected) {
                    $("#book_top_period").html(hours + ":" + minutes);
                    $("#book_period_val_").val(lastVal);
                }
                $("#book_top_period").parent().attr("data-toggle", "dropdown");
                $("#book_top_period").parent().attr("aria-haspopup", "true");
                $("#book_top_period").parent().attr("aria-expanded", "true");
            } else {

                var day_ = bookingsManager.shapesPrebookedJSON.weekObject[$("#datepicker_ub").datepicker("getDate").getDay()];
                if (day_.open == true) {
                    for (var r = 0; r < day_.openList.length; r++) {
                        var startSelection = parseInt($("#book_start_val_").val());
                        if(day_.openList[r].from == startSelection) {
                            var endSeconds = day_.openList[r].to;
                            var period =  endSeconds - startSelection;
                            hours = getLeadingZero(((endSeconds - (endSeconds % 3600)) % (3600 * 24)) / 3600);
                            minutes = getLeadingZero((endSeconds % 3600) / 60);
                            $("#dropdown_period_floors").append('<li  ><a href="#" data-period="' + period + '">' + hours + ':' + minutes + '</a></li>');
                            $("#book_top_period").html(hours + ":" + minutes);
                            $("#book_period_val_").val(period);

                        }
                    }
                    $("#book_top_period").parent().attr("data-toggle", "dropdown");
                    $("#book_top_period").parent().attr("aria-haspopup", "true");
                    $("#book_top_period").parent().attr("aria-expanded", "true");
                } else {
                    $("#book_top_period").html("");
                    $("#book_period_val_").val(-1);

                }
            }
        }
    }
}

function updateCloseShapes() {
    if (currentIframeSettings.booking == false) {
        for (var f = 0; f < if_floorCanvases.length; f++) {
            for (var s = 0; s < if_floorCanvases[f].shapes.length; s++) {
                if_floorCanvases[f].shapes[s].isAvailable = true;
                if_floorCanvases[f].shapes[s].choosen = false;
            }
            if_floorCanvases[f].valid = false;
        }
    } else {
        var DateSeconds = parseInt($("#datepicker_ub").datepicker("getDate").getTime() / 1000);
        var StartSeconds = parseInt($("#book_start_val_").val());
        var PeriodSeconds = parseInt($("#book_period_val_").val());
        if (StartSeconds == -1) {
            for (var f = 0; f < if_floorCanvases.length; f++) {
                for (var s = 0; s < if_floorCanvases[f].shapes.length; s++) {
                    if_floorCanvases[f].shapes[s].isAvailable = false;
                }
                if_floorCanvases[f].valid = false;
            }

            return;
        }
        for (var f = 0; f < if_floorCanvases.length; f++) {
            var openObject = bookingsManager.getAvailableSids(if_floorCanvases[f], DateSeconds + StartSeconds, DateSeconds + StartSeconds + PeriodSeconds);
            console.log("openObject");
            console.log(openObject.open)
            if (openObject.open == true && openObject.passed == false) {
                for (var s = 0; s < if_floorCanvases[f].shapes.length; s++) {
                    if_floorCanvases[f].shapes[s].isAvailable = true;
                    if_floorCanvases[f].shapes[s].ordered = false;
                    if_floorCanvases[f].shapes[s].placeClosed = false;
                    if (openObject.sidList[if_floorCanvases[f].shapes[s].sid] == undefined) {
                        if_floorCanvases[f].shapes[s].isAvailable = false;
                        if (openObject.orderedListt[if_floorCanvases[f].shapes[s].sid] != undefined) {
                            if_floorCanvases[f].shapes[s].ordered = true;
                        }
                    }
                }

            } else {
                for (var s = 0; s < if_floorCanvases[f].shapes.length; s++) {
                    if_floorCanvases[f].shapes[s].isAvailable = false;
                    if_floorCanvases[f].shapes[s].placeClosed = true;
                }
            }
            if_floorCanvases[f].valid = false;
        }
    }
}
function applyIframe(iframe, real) {
    if (real == false) {
        // Iframe editor
    } else {

    }
}
function UpdateBookingModal() {
    $("#modal_sid_lines").html('');
    $("#time_order_row_val").html('');
    var fromDate = getBookDate(parseInt(bookingOrder.dateSeconds), parseInt(bookingOrder.start), parseInt(bookingOrder.placeOffset));
    var toDate = getBookDate(parseInt(bookingOrder.dateSeconds), parseInt(bookingOrder.start) + parseInt(bookingOrder.period), parseInt(bookingOrder.placeOffset));
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var mon = monthNames[fromDate.getMonth()];


    $("#time_order_row_val").html('<div class="col-md-12"><span class="hz_date">' + fromDate.getDate() + ' ' + mon + ',</span> ' + getLeadingZero(fromDate.getHours()) + ':' + getLeadingZero(fromDate.getMinutes()) + ' - ' + getLeadingZero(toDate.getHours()) + ':' + getLeadingZero(toDate.getMinutes()) + '</div>');

    //modal_sid_lines
    for (var s = 0; s < bookingOrder.listOfSids.length; s++) {
        var singleSid = bookingOrder.listOfSids[s];
        var appendData = '';
        appendData += '   <div class="row hz_mt_val" id="hz_sid_line-' + singleSid.sid + '">';
        appendData += '	  <div class="col-xs-2">';
        appendData += '	      <div class="modal_hz_val_btn material-icons" id="hz_cancel-' + singleSid.sid + '" onclick="cancelFromOrder(\'' + singleSid.sid + '\',true);"  data-toggle="tooltip" data-placement="top" title="מחק מהרשימה">clear</div>';
        appendData += '	  </div>';
        appendData += '	  <div class="col-xs-3">' + singleSid.floor_name + '</div>';
        appendData += '	  <div class="col-xs-3">' + singleSid.persons + '</div>';
        appendData += '	  <div class="col-xs-3">' + singleSid.name + '</div>';
        appendData += '	  <div class="col-xs-1">' + parseInt(s + 1) + '</div>';
        appendData += '	</div>';
        $("#modal_sid_lines").append(appendData);
    }
    $("#booking_order_modal").modal('show');
}
var if_floorCanvases = [];
var if_canvas_ = {};
var if_canvas_main = {};

function updateCanvasDataForIFrame(full) {
    if (full != undefined && full == true) {
        var allfloors = document.getElementsByName("server_canvasState");
        for (var x = 0; x < allfloors.length; x++) {
            var canvasfloor = allfloors[x].id;
            var floorID = canvasfloor.replace(/^server_canvasState_/, "");
            if_canvas_ = new ifCanvasState(document.getElementById("if_canvas_" + floorID));
            if_canvas_.main = true;
            if_floorCanvases.push(if_canvas_);
            var floorname = document.getElementById("server_floor_name_" + floorID).value;
            floorNames[floorname] = if_canvas_;
            if_canvas_.floor_name = floorname;
            floorid2canvas[floorID] = if_canvas_;

            var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
            if (canvasStateJSON.mainfloor) {
                if_canvas_main = if_canvas_;
            }
            if (canvasStateJSON.state.backgroundType != "color") {
                updateBackgroundImageByServer(canvasfloor);
            }
        }

// Update all canvases
        for (var x = 0; x < allfloors.length; x++) {
            var canvasfloor = allfloors[x].id;
            var floorID = canvasfloor.replace(/^server_canvasState_/, "");
            var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
            updateCanvasShapes(floorid2canvas[floorID], canvasStateJSON, true);
            if (pagetype != undefined && (pagetype == 'editplace')) {
                floorid2canvas[floorID].mode("bg");
            }
        }
// Floor selector update
        if_canvas_ = if_canvas_main;

        // Create BAW images
        var all = document.getElementsByName("shape_images_from_server");
        totalImages = all.length + 1;

        for (var x = 0; x < all.length; x++) {
            var serverImageID = all[x].id;
            if ($("#baw_images").length == 1) {
                createBAWimage(serverImageID);
            }
        }
    } else {
        var allfloors = document.getElementsByName("server_canvasState");
        for (var x = 0; x < allfloors.length; x++) {
            var canvasfloor = allfloors[x].id;
            var floorID = canvasfloor.replace(/^server_canvasState_/, "");
            if_canvas_ = new ifCanvasState(document.getElementById("if_canvas_" + floorID));
            if_canvas_.main = true;

            var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
            if (canvasStateJSON.mainfloor) {
                if_canvas_main = if_canvas_;
            }
            if_floorCanvases.push(if_canvas_);
            var floorname = document.getElementById("server_floor_name_" + floorID).value;
            if_canvas_.floor_name = floorname;

            updateCanvasShapes(if_canvas_, canvasStateJSON, true);
        }


// Floor selector update
        if_canvas_ = if_canvas_main;
    }
}
function getLeadingZero(val) {
    if (parseInt(val) < 10) {
        var s = "0" + val;
        return s;
    } else {
        return val;
    }
}
function getBookDate(dateUTC, time, placeOffset) {
    d = new Date();
    clientOffset = d.getTimezoneOffset();
    var offsetSec = placeOffset * 3600 + clientOffset * 60;
    var totalSec = (dateUTC + time + offsetSec) * 1000;
    var Date_f = new Date(parseInt(totalSec));
    return Date_f;
}
 