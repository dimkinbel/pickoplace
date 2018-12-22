var shapesPrebookedJSON = {};

function Hazmana() {
    this.dateSeconds = $("#datepicker_ub").datepicker("getDate").getTime() / 1000;
    if(document.getElementById("book_start_val_") == null) {
        // Waiter
        var StartSeconds = parseInt($("#admin_reserve_start_val").val());
        var EndSeconds = parseInt($("#admin_reserve_end_val").val())
        var PeriodSeconds = parseInt(EndSeconds - StartSeconds );
        this.start = StartSeconds;
        this.period = PeriodSeconds;
    } else {
        // User | Iframe
        this.start = $("#book_start_val_").val();
        this.period = $("#book_period_val_").val();
    }

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
BookingsManager.prototype.getAvailableSids = function (canvas_link, utc_from, utc_to , considerPersons) {
    if(considerPersons == undefined) {
        considerPersons = true;
    }
    var returnObject = {};
    returnObject.open = true;
    returnObject.passed = false;
    returnObject.sidList = {};
    returnObject.orderedList = {};
    returnObject.minmaxPersons = {};
    var openStepList = this.getOpenSecondsByDate($("#datepicker_ub").datepicker("getDate").getTime() / 1000);
    //console.log(openStepList)
    if (openStepList.length == 0) {
        returnObject.open = false;
        returnObject.passed = true;
        return returnObject;
    } else {
        //console.log(this.isOrderAvailableByTime());
        //console.log(utc_from+","+ utc_to);
        if (this.isOrderAvailableByTime() == false) {
            returnObject.open = true;
            returnObject.passed = true;
            return returnObject;
        } else {
            var Persons = 1;
            if(considerPersons == true) {
                 Persons = parseInt($("#book_persons_val_").val());
            }
            for (var s = 0; s < canvas_link.shapes.length; s++) {
                if (this.isSidEmptyRange(canvas_link.shapes[s].sid, utc_from, utc_to) == true) {
//                    console.log(canvas_link.shapes[s].sid+": AVAILABLE")
                    if(considerPersons == true) {
                        if (canvas_link.shapes[s].booking_options.minPersons <= Persons && Persons <= canvas_link.shapes[s].booking_options.maxPersons) {
                            returnObject.sidList[canvas_link.shapes[s].sid] = true;
                        } else {
                            returnObject.minmaxPersons[canvas_link.shapes[s].sid] = true;
                        }
                    } else {
                        returnObject.sidList[canvas_link.shapes[s].sid] = true;
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
            var endOfAvailable = openStepList[openStepList.length - 1] + this.bookingProperties.bookLength.sort(function(a, b){return a-b})[0]*60;
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
BookingsManager.prototype.getOpenSecondsByDate = function (clientStartDateSeconds,ignoreClosed,tillEnd) {
    if(ignoreClosed == undefined) {
        ignoreClosed = false;
    }
    if(tillEnd == undefined) {
        tillEnd = false;
    }
    var returnList = [];
    var clientDate = new Date();
    var placeDate = new Date(clientStartDateSeconds * 1000 + (this.shapesPrebookedJSON.placeOffset * 3600 + clientDate.getTimezoneOffset() * 60) * 1000);

    var day_ = this.shapesPrebookedJSON.weekObject[placeDate.getDay()];

    for (var cd = 0; cd < this.shapesPrebookedJSON.closeDays.length; cd++) {
        if (this.shapesPrebookedJSON.closeDays[cd] == parseInt(placeDate.getTime() / 1000 + this.shapesPrebookedJSON.placeOffset * 3600)) {
            day_.open = false;
        }
    }
    var minBookingPeriod = this.bookingProperties.bookLength.sort(function(a, b){return a-b})[0] * 60;
    if(tillEnd == true) {
        minBookingPeriod = 0;
    }
    if (day_.open == true || ignoreClosed == true) {
        if(document.getElementById("alldaybooking")== null) {
            for (var r = 0; r < day_.openList.length; r++) {
                for (var i = day_.openList[r].from; i <= day_.openList[r].to - minBookingPeriod; i += this.bookingProperties.bookStartStep * 60) {
                    returnList.push(i)
                }
            }
        } else {
            for (var r = 0; r < day_.openList.length; r++) {
                if(tillEnd == true) {
                    returnList.push(day_.openList[r].from);
                } else {
                    returnList.push(day_.openList[r].to);
                }
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}