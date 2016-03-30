var shapesPrebookedJSON = {};
var min_step = 15 * 60;
function emptyOrder() {
    var list_ = [];
    for (var b = 0; b < bookingOrder.listOfSids.length; b++) {
        list_.push(bookingOrder.listOfSids[b].sid);
    }
    for (var s = 0; s < list_.length; s++) {
        cancelFromOrder(list_[s]);
    }
}
function Hazmana() {
    this.dateSeconds = $("#datepicker_ub").datepicker("getDate").getTime() / 1000;
    this.start = $("#book_start_val_").val();
    this.period = $("#book_period_val_").val();
    this.listOfSids = [];
    var d = new Date();
    this.clientOffset = d.getTimezoneOffset();
    this.placeOffset = document.getElementById("server_placeUTC").value;
}
Hazmana.prototype.addSid = function (sid, persons, iframe_) {
    var singlePlace = {};
    singlePlace.sid = sid;
    singlePlace.persons = persons;
    var floorList;
    if (iframe_ != undefined && iframe_ == true) {
        floorList = if_floorCanvases
    } else {
        floorList = floorCanvases;
    }
    for (var f = 0; f < floorList.length; f++) {
        for (var s = 0; s < floorList[f].shapes.length; s++) {
            if (floorList[f].shapes[s].sid == sid) {
                floorList[f].shapes[s].choosen = true;
                floorList[f].valid = false;
                singlePlace.floor_name = floorList[f].floor_name;
                singlePlace.floorid = floorList[f].floorid;
                singlePlace.name = floorList[f].shapes[s].booking_options.givenName;
                    this.listOfSids.push(singlePlace);
                    return floorList[f].floorid;

            }
        }

    }
}
Hazmana.prototype.removeSid = function (sid, iframe_) {
    for (var i = 0; i < this.listOfSids.length; i++) {
        var single = this.listOfSids[i];
        if (single.sid == sid) {
            this.listOfSids.remove(single);
        }
    }
    var iframe = false;
    var floorList = floorCanvases;
    if (iframe_ != undefined && iframe_ == true) {
        iframe = true;
        floorList = if_floorCanvases
    }
    for (var f = 0; f < floorList.length; f++) {
        for (var s = 0; s < floorList[f].shapes.length; s++) {
            if (floorList[f].shapes[s].sid == sid) {
                floorList[f].shapes[s].choosen = false;
                floorList[f].valid = false;
                return floorList[f].floorid;
            }
        }
    }
}
var bookingOrder = null;
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
function BookingsManager(shapesPrebookedJSON) {
    this.from = shapesPrebookedJSON.date1970;
    this.to = this.from + shapesPrebookedJSON.period;
    this.shapesPrebookedJSON = shapesPrebookedJSON;
    this.sidToBookings = {};
    for (var i = 0; i < shapesPrebookedJSON.shapesBooked.length; i++) {
        var sidObject = {};
        sidObject.orders = shapesPrebookedJSON.shapesBooked[i].ordersList;
        sidObject.sid = shapesPrebookedJSON.shapesBooked[i].sid;
        sidObject.from = this.from;
        sidObject.to = this.to;
        this.sidToBookings[shapesPrebookedJSON.shapesBooked[i].sid] = sidObject;
    }
    for (var f = 0; f < floorCanvases.length; f++) {
        for (var s = 0; s < floorCanvases[f].shapes.length; s++) {
            var sid = floorCanvases[f].shapes[s].sid;
            if (this.sidToBookings[sid] == undefined) {
                var sidObject = {};
                sidObject.orders = [];
                sidObject.sid = sid;
                sidObject.from = this.from;
                sidObject.to = this.to;
                this.sidToBookings[sid] = sidObject;
            }
        }
    }
    this.bookingProperties = shapesPrebookedJSON.bookProperties;
}
BookingsManager.prototype.addSidBooking = function (sid, utc_from, utc_to, bid, persons) {
    var order = {};
    order.bid = bid;
    order.from = utc_from;
    order.to = utc_to;
    order.persons = persons;
    this.sidToBookings[sid].orders.push(order);
}
BookingsManager.prototype.getSidBookings = function (sid, from_, to_) {
    var from;
    var to;
    var bookList = {};
    var returnList = [];
    if (from_ == undefined) {
        returnList = this.sidToBookings[sid].orders;
    } else {
        from = from_;
        to = to_
        var orders = this.sidToBookings[sid].orders;
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].from >= from && to <= orders[i].to) {
                returnList.push(orders[i]);
            }
        }
    }
    return returnList;
}
BookingsManager.prototype.getAvailableSids = function (canvas_link, utc_from, utc_to) {
    var returnObject = {};
    returnObject.open = true;
    returnObject.passed = false;
    returnObject.sidList = {};
    returnObject.orderedList = {};
    returnObject.minmaxPersons = {};
    console.log(new Date(utc_from * 1000))
    console.log(new Date(utc_to * 1000))
    var openStepList = this.getOpenSecondsByDate($("#datepicker_ub").datepicker("getDate").getTime() / 1000);
    console.log("openStepList");
    console.log(openStepList);
    if (openStepList.length == 0) {
        returnObject.open = false;
        returnObject.passed = true;
        return returnObject;
    } else {
        if (this.isOrderAvailableByTime() == false) {
            returnObject.open = true;
            returnObject.passed = true;
            return returnObject;
        } else {
            var CalendarStartDay = $("#datepicker_ub").datepicker("getDate");
            var CalendarStartSeconds = CalendarStartDay.getTime() / 1000;
            var StartPeriod = $("#book_start_val_").val();
            var Period = $("#book_period_val_").val();
            var Persons = parseInt($("#book_persons_val_").val());
            for (var s = 0; s < canvas_link.shapes.length; s++) {
                if (this.isSidEmptyRange(canvas_link.shapes[s].sid, utc_from, utc_to) == true) {
                    if (canvas_link.shapes[s].booking_options.minPersons <= Persons && Persons <= canvas_link.shapes[s].booking_options.maxPersons) {
                        returnObject.sidList[canvas_link.shapes[s].sid] = true;
                    } else {
                        returnObject.minmaxPersons[canvas_link.shapes[s].sid] = true;
                    }
                } else {
                    returnObject.orderedList[canvas_link.shapes[s].sid] = true;
                }
            }
            return returnObject;
        }
    }
}
BookingsManager.prototype.isSidEmptyRange = function (sid, utc_from, utc_to) {
    var orders = this.sidToBookings[sid].orders;
    for (var i = 0; i < orders.length; i++) {
        if ((utc_from < orders[i].from && utc_to <= orders[i].from) ||
            (utc_from >= orders[i].to && utc_to > orders[i].to)) {
        } else {
            return false;
            break;
        }
    }
    return true;
}

BookingsManager.prototype.isOrderAvailableByTime = function () {
    var openStepList = this.getOpenSecondsByDate($("#datepicker_ub").datepicker("getDate").getTime() / 1000);
    //console.log(openStepList)
    if (openStepList.length == 0) {
        return false;
    } else {
        if(document.getElementById("alldaybooking")== null) {
            var StartPeriod = parseInt($("#book_start_val_").val());
            var Period = parseInt($("#book_period_val_").val());
            var endOfBooking = StartPeriod + Period;
            var endOfAvailable = openStepList[openStepList.length - 1] + bookingsManager.bookingProperties.bookLength.sort(function(a, b){return a-b})[0]*60;
            //console.log(endOfBooking + " " + endOfAvailable);
            if (endOfBooking > endOfAvailable) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }

    }
}
BookingsManager.prototype.getOpenSecondsByDate = function (clientStartDateSeconds) {
    var returnList = [];
    var clientDate = new Date();
    var placeDate = new Date(clientStartDateSeconds * 1000 + (this.shapesPrebookedJSON.placeOffset * 3600 + clientDate.getTimezoneOffset() * 60) * 1000);
    console.log(placeDate.getDay());
    var day_ = this.shapesPrebookedJSON.weekObject[placeDate.getDay()];
    console.log(day_)
    for (var cd = 0; cd < this.shapesPrebookedJSON.closeDays.length; cd++) {
        if (this.shapesPrebookedJSON.closeDays[cd] == parseInt(placeDate.getTime() / 1000 + this.shapesPrebookedJSON.placeOffset * 3600)) {
            day_.open = false;
        }
    }
    if (day_.open == true) {
        if(document.getElementById("alldaybooking")== null) {
            for (var r = 0; r < day_.openList.length; r++) {
                for (var i = day_.openList[r].from; i <= day_.openList[r].to - bookingsManager.bookingProperties.bookLength.sort(function(a, b){return a-b})[0] * 60; i += this.bookingProperties.bookStartStep * 60) {
                    returnList.push(i)
                }
            }
        } else {
            for (var r = 0; r < day_.openList.length; r++) {
                returnList.push(day_.openList[r].from);
            }

        }
    } else {
    }
    return returnList;
}

function findClosestsStep(cur_seconds, step_seconds) {
    if (cur_seconds % step_seconds == 0) {
        return cur_seconds;
    } else {
        var prevStep = cur_seconds - (cur_seconds % step_seconds);
        return parseInt(prevStep + step_seconds);
    }
}
$(document).ready(function () {

});
function generateTestValues() {
    var testData = {};
    var d = new Date();
    var clientOffset = -1 * d.getTimezoneOffset() / 60;
    testData.pid = document.getElementById("server_placeID").value;
    var sec = parseInt(d.getTime() / 1000)
    testData.date1970 = +$("#datepicker_ub").datepicker("getDate").getTime() / 1000;// start of today
    testData.period = 172800 * 7; // 2 days
    testData.clientOffset = clientOffset;
    testData.placeOffset = document.getElementById("server_placeUTC").value;
    testData.placeOpen = [];
    testData.weekObject = {};
    testData.minPeriod = minPeriodSeconds;
    for (var d = 0; d < 7; d++) {
        var weekDay = {};
        if (d != 7) {
            weekDay.open = true;
        } else {
            weekDay.open = false;
        }
        weekDay.openList = [];
        var openObj = {};
        openObj.from = 28800;
        openObj.to = 86400;
        weekDay.openList.push(openObj);
        testData.weekObject[d] = weekDay;
    }
    var closeDay = ($("#datepicker_ub").datepicker("getDate").getTime() - (new Date()).getTimezoneOffset() * 60 * 1000) / 1000 + 24 * 3600;
    testData.closeDays = [];
    testData.closeDays.push(closeDay);// By UTC
    var open1 = {};
    open1.from = 28800;
    open1.to = 72000;
    testData.placeOpen.push(open1);
    var open2 = {};
    open2.from = 115200;
    open2.to = 158400;
    testData.placeOpen.push(open2);
    testData.shapesBooked = [];
    for (var f = 0; f < floorCanvases.length; f++) {
        for (var s = 0; s < floorCanvases[f].shapes.length; s++) {
            var shapeBook = {};
            shapeBook.sid = floorCanvases[f].shapes[s].sid;
            shapeBook.ordersList = [];
            var startTime = 0;
            for (var d = 0; d < 14; d++) {
                startTime = 0;
                while (startTime < 86400) {
                    var endTime = startTime + 3600;
                    if (28800 <= startTime && startTime <= 72000 && 28800 <= endTime && endTime <= 72000) {
                        if (getRandomInt(0, 2) == 1) {
                            var singleOrder = {};
                            singleOrder.from = startTime + testData.date1970 + clientOffset * 60 * 60 - testData.placeOffset * 60 * 60 + d * 86400;
                            singleOrder.to = endTime + testData.date1970 + clientOffset * 60 * 60 - testData.placeOffset * 60 * 60 + d * 86400;
                            shapeBook.ordersList.push(singleOrder);
                        }
                    }
                    startTime += 3600;
                }
            }
            testData.shapesBooked.push(shapeBook);
        }
    }
    return testData;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}