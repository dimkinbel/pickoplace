/**
 * 
 */
var bookingOrderJSONlist=[];
var bookingOrderJSON = {};
var bookingRequestWrap = {};


function emptyBookingObject() {
	for (var i = 0 ; i < bookingOrderJSONlist.length ; i++) {
		remove_selected_by_SID(bookingOrderJSONlist[i].sid);
	}
	bookingOrderJSONlist=[];
	bookingOrderJSON = {};
	bookingRequestWrap = {};

}
function randomNum(length) {
	var chars = '0123456789'.split('');

	if (! length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}

	return str.replace(/^0/,"1");
}
function createBookingJSON() {
	bookingOrderJSONlist=[];
	bookingOrderJSON = {};
	bookingRequestWrap = {};

	var StartSeconds = parseInt($("#admin_reserve_start_val").val());
	var EndSeconds = parseInt($("#admin_reserve_end_val").val())
	var PeriodSeconds = parseInt(EndSeconds - StartSeconds );
	bookingOrder.start = StartSeconds;
	bookingOrder.period = PeriodSeconds;

	var bookID =  "book_"+randomNum(10);
	var testID = "temp_"+randomString(10);
	var d = new Date();
	var clientOffset = d.getTimezoneOffset();
	var placeUTCoffset = document.getElementById("server_placeUTC").value;

	var TimePeriod = bookingOrder.period;
	var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime()/1000;

	var dayOfweek = +$("#datepicker_ub").datepicker( "getDate" ).getDay();


	// Get selected shapes
	var totalPersons = 0;
	var PID = document.getElementById("server_placeID").value;
	for(var f=0;f < bookingOrder.listOfSids.length;f++) {
		var shape = bookingOrder.listOfSids[f];
		var sid = shape.sid;
		var shamurID = "shamur_adm-"+sid;
		if(document.getElementById(shamurID)!=null) {
			continue;
		}
		var persons = shape.persons;
		totalPersons+=persons;
		bookingOrderJSON = {"pid":PID,
			"sid":sid,
			"floorid":shape.floorid,
			"floor_name":shape.floor_name,
			"name":shape.name,
			"bookID":bookID,
			"testID":testID,
			"dateSeconds":TimeOfTheDatePicker_1970,
			"time":bookingOrder.start,
			"period":TimePeriod,
			"persons":persons,
			"clientOffset":clientOffset,
			"placeOffcet":placeUTCoffset};
		bookingOrderJSONlist.push(bookingOrderJSON);
	}

	// Generate booking request object

	var u = 0;
	for (var i = 0 ; i < bookingOrderJSONlist.length ; i++) {
		if (i==0) {
			bookingRequestWrap.pid = bookingOrderJSONlist[i].pid;
			bookingRequestWrap.bookID = bookingOrderJSONlist[i].bookID;
			bookingRequestWrap.testID = bookingOrderJSONlist[i].testID;
			bookingRequestWrap.dateSeconds = bookingOrderJSONlist[i].dateSeconds;
			bookingRequestWrap.time = bookingOrderJSONlist[i].time;
			bookingRequestWrap.period = bookingOrderJSONlist[i].period;
			bookingRequestWrap.clientOffset = bookingOrderJSONlist[i].clientOffset;
			bookingRequestWrap.placeOffcet = bookingOrderJSONlist[i].placeOffcet;
			bookingRequestWrap.clientid = "temp";
			bookingRequestWrap.loggedby = "temp";
			// $("#booking_shape_num_persons").val();
		}
	}

	var name = $("#admin_re_user_name").val();
	var email = $("#admin_re_user_mail").val();
	var phone = $("#admin_re_user_phone").val();
	var persons = parseInt($("#admin_re_persons").val());



	var user = {};
	user.google = false;
	user.facebook = false;
	user.admin = true;
	user.aduser = {};
	user.aduser.name = name;
	user.aduser.email = email;
	user.aduser.phone = phone;
	bookingRequestWrap.user = user;
	bookingRequestWrap.name = name;
	bookingRequestWrap.email = email;
	bookingRequestWrap.phone = phone;
	bookingRequestWrap.persons = persons;
	bookingRequestWrap.bookingList = bookingOrderJSONlist;
	bookingRequestWrap.textRequest = $("#admin_re_free_text").val();
	bookingRequestWrap.weekday = dayOfweek;
	bookingRequestWrap.type = "admin";
}

function requestBookingAvailability() {
	var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var dayOfweek = +$("#datepicker_ub").datepicker( "getDate" ).getDay();
	var d = new Date();
	var clientOffset = -1*d.getTimezoneOffset()/60;
	var placeOffset = document.getElementById("server_placeUTC").value;
	var placeID = document.getElementById("server_placeID").value;
	var requestJSON = {};
	var listOfSids = [];
	for (var f = 0 ;f < floorCanvases.length ; f++) {
		for(var s=0; s <floorCanvases[f].shapes.length ;s++) {
			listOfSids.push(floorCanvases[f].shapes[s].sid);
		}
	}
	requestJSON.date1970 = TimeOfTheDatePicker_1970  ;// - d.getTimezoneOffset()*60 ;
	requestJSON.weekday = dayOfweek;
	requestJSON.period = 2*24*60*60;
	requestJSON.clientOffset = clientOffset;
	requestJSON.placeOffset = placeOffset;
	requestJSON.pid = placeID;
	requestJSON.listOfSids = listOfSids;
	var jsonData = {bookrequest:JSON.stringify(requestJSON)};
	isOrigin(function(result) {
		if(result) {
			$.ajax({
				url : "/checkPidAvailable",
				data: jsonData,
				beforeSend: function () {  },
				success : function(data){
					// alert(data);
					document.getElementById("server_shapes_prebooked").value=JSON.stringify(data);
					shapesPrebookedJSON = JSON.parse(document.getElementById("server_shapes_prebooked").value);
					bookingsManager.simpleList = new BookingsManager(shapesPrebookedJSON);

				},
				dataType : "JSON",
				type : "post"
			});
		} else {
		}
	});
}
function SIapplyBooking() {
	$("#adm_add_loader").show();
	$("#admin_add_reservation").hide();
	$("#admin_add_reservation_inactive").show();



	setSessionData(function (result) {
		if (result) {
			createBookingJSON();
			applyBooking();
			//$("#page_login_prompt").hide();
		} else {
			updatePageView();
		}
	});
}
var tk;
function applyBooking() {

	var bookingjson = {booking:JSON.stringify(bookingRequestWrap)};

	$.ajax({
		url : "/adminBookingRequest",
		data: bookingjson,//
		beforeSend: function () {
		},
		success : function(data){
			$("#adm_add_loader").hide();
			$("#admin_add_reservation").show();
			$("#admin_add_reservation_inactive").hide();

			if(data.added==true) {

				$("#bookingAcceptedModal_header").removeClass("book_modal_fail").addClass("book_modal_success");
				$("#bookingAcceptedModal_body").removeClass("book_modal_fail").addClass("book_modal_success");
				$("#bookingAcceptedModal_body").html("הזמנה נרשמה");
				$("#bookingAcceptedModal").modal("show");
				tk = bookingOrder;
				for(var s = 0; s < tk.listOfSids.length;s++) {
					bookingsManager.simpleList.addSidBooking(tk.listOfSids[s].sid,
							parseInt(tk.dateSeconds) + parseInt(tk.start),
							parseInt(tk.dateSeconds) + parseInt(tk.start) + parseInt(tk.period),
							bookingRequestWrap.bookID);
				}
				bookingRequestWrap.num = data.num;
				bookingRequestWrap.time = data.time;
				console.log(bookingRequestWrap)
				bookingsManager.addBookingWrapBooking(bookingRequestWrap);
				tl_canvas.addBooking(bookingRequestWrap);
				tl_canvas.adminSelection = null;
				tl_canvas.valid = false;
				emptyAdminReservation();
				updateCloseShapesAdminReservation();
			} else {
				$("#bookingAcceptedModal_header").removeClass("book_modal_success").addClass("book_modal_fail");
				$("#bookingAcceptedModal_body").removeClass("book_modal_success").addClass("book_modal_fail");
				$("#bookingAcceptedModal_body").html(data.reason);
				$("#bookingAcceptedModal").modal("show");
				updateCloseShapesAdminReservation();
			}

		},
		dataType : "JSON",
		type : "post"
	});

}
/*
function addAdminReservationInteractive(sid) {
	var pid = $("#server_placeID").val();
	var from = tl_canvas.adminSelection.from;
	var to = tl_canvas.adminSelection.to;
	isOrigin(function(result) {
		if(result) {
			// Connected to server
			console.log("TODO:Update Interactive admin selection");
			$.ajax({
				url : "/adminRequest/addReservation",
				data: {sid:sid,pid:pid,from:from,to:to},//
				success : function(data){
					if(data.status == "added") {
						addAdminReservation(sid)
					} else {
						$('#canvas_timeline_admin_popover').popover('hide');
						$("#alert_modal_title").html("Server request fail");
						$("#alert_modal_body").html("Reservation fail");
						$("#alert_modal_body").modal("show");
					}
				},
				dataType : "JSON",
				type : "post"
			});
		} else {
			// Not connected to server
			addAdminReservation(sid)
		}
	});

}
*/
function interactiveUpdateShapeBookable(sid,bookable) {
	var fid;
	var canvas_floor;
	for(var f = 0 ;f < floorCanvases.length ; f++) {
		for(var s =  0; s < floorCanvases[f].shapes.length;s++) {
			if(floorCanvases[f].shapes[s].sid == sid) {
				canvas_floor = floorCanvases[f];
				floorCanvases[f].shapes[s].booking_options.bookable = bookable;
				fid = floorCanvases[f].floorid;
				break;
			}
		}
	}
	isOrigin(function(result) {
		if(result) {
			// Connected to server
			console.log("TODO:Update interactive mail send");
			$.ajax({
				url : "/adminUpdateShapeBookable",
				data: {sid:sid,fid:fid,bookable:bookable},//
				success : function(data){
					if(data.status == "success") {
						canvas_floor.valid = false;
						tl_canvas.valid=false;
						$('#canvas_timeline_admin_popover').popover('hide');
					} else {
						$(".modal").modal('hide');
						$("#alert_modal_title").html("Server request fail");
						$("#alert_modal_body").html("Shape bookable not updated");
						$("#alert_modal_body").modal("show");
						$('#canvas_timeline_admin_popover').popover('hide');
					}
				},
				dataType : "JSON",
				type : "post"
			});
		} else {
			// Not connected to server
			canvas_floor.valid = false;
			tl_canvas.valid=false;
			$('#canvas_timeline_admin_popover').popover('hide');
		}
	});
}
function removeAdminReservationInteractive(bid,sid) {
	var placeName = $("#server_placeName").val();
	var branch = $("#server_placeBranchName").val();
	var pid = $("#server_placeID").val();

	isOrigin(function(result) {
		if(result) {
			// Connected to server
			console.log("TODO:Update Interactive admin cancel reservation");
			$.ajax({
				url : "/adminRequest/cancelReservation",
				data: {pid:pid,bid:bid,sid:sid,placeName:placeName,branch:branch},//
				success : function(data){
					if(data.status == "cancelled") {
						tl_canvas.removeBookingByBid(bid);
						$('#canvas_timeline_admin_popover').popover('hide');
					} else {
						$('#canvas_timeline_admin_popover').popover('hide');
						$("#alert_modal_title").html("Server request fail");
						$("#alert_modal_body").html("Cancelling reservation fail");
						$("#alert_modal").modal("show");
					}
				},
				dataType : "JSON",
				type : "post"
			});
		} else {
			tl_canvas.removeBookingByBid(bid);
			$('#canvas_timeline_admin_popover').popover('hide');
		}
	});
}
function sendMessageFromModal(recepientEmail) {
	var text =  $("#contact_email_modal_text").val();
	isOrigin(function(result) {
		if(result) {
			// Connected to server
			console.log("TODO:Update interactive mail send");
			$.ajax({
				url : "/adminRequest/sendMessage",
				data: {email:recepientEmail,text:text},//
				success : function(data){
					if(data.status == "sent") {
					} else {
						$(".modal").modal('hide');
						$("#alert_modal_title").html("Server request fail");
						$("#alert_modal_body").html("Email could not be sent.Please try later");
						$("#alert_modal_body").modal("show");
					}
				},
				dataType : "JSON",
				type : "post"
			});
		} else {
			// Not connected to server
			$(".modal").modal('hide');
		}
	});
}
function InteractiveCancelReservation(bid) {
	var placeName = $("#server_placeName").val();
	var branch = $("#server_placeBranchName").val();
	var pid = $("#server_placeID").val();
	var address = $("#server_Address").val();
	isOrigin(function(result) {
		if(result) {
			// Connected to server
			console.log("TODO:Update interactive cancelation");
			$.ajax({
				url : "/adminRequest/cancelUserBooking",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify({pid:pid,bid:bid,placeName:placeName,branch:branch,address:address}),//
				success : function(data){
					console.log(data);
					if(data.removed == true) {
						tl_canvas.removeBookingByBid(bid);
						bookingsManager.removeBooking(bid);

					} else {
						$(".modal").modal('hide');
						$("#alert_modal_title").html("Server request fail");
						$("#alert_modal_body").html("Cancellation fail. Please try later on contact admin");
						$("#alert_modal").modal("show");
					}
				},
				dataType : "JSON",
				type : "post"
			});
		} else {
			// Not connected to server

			tl_canvas.removeBookingByBid(bid);
			bookingsManager.removeBooking(bid);

		}
	});
	$('#cancelation_info_modal').modal('hide');
}
function requestWlBookings() {
    var pid = document.getElementById("server_placeID").value;
    var placeOffset = document.getElementById("server_placeUTC").value;
    
	var TimeOfTheDatePicker_1970 = +$("#datepicker_wl_bottom").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var dayOfweek = +$("#datepicker_wl_bottom").datepicker( "getDate" ).getDay();
	var d = new Date();
	var clientOffset = -1*d.getTimezoneOffset()/60;
	
	var placeID = pid;
	var requestJSON = {};		
	requestJSON.date1970 = TimeOfTheDatePicker_1970  ;// - d.getTimezoneOffset()*60 ;
	requestJSON.weekday = dayOfweek;
	requestJSON.period = 2*24*60*60;
	requestJSON.clientOffset = clientOffset;
	requestJSON.placeOffset = placeOffset;
	requestJSON.pid = placeID;
	
	console.log(requestJSON);
	var jsonData = {bookrequest:JSON.stringify(requestJSON)};
	$.ajax({
	      url : "/WaUpdateDateBookings",
	      data: jsonData,
	      beforeSend: function () { $("#wl_date_loader").show(); },
	      success : function(data){
	    	 // alert(data);
	    	  $("#wl_date_loader").hide();
	    	  console.log(data);
	    	  updateLoadedTimeline(data.orderedResponse);
	    	  InitialBookingList(data.bookings);
	      },
	      dataType : "JSON",
	      type : "post"
	  });

}

function updateLoadedTimeline(data) {
	// Clear previous data
	 tl_canvas.emptyBookings();
	 bookingsManager.clear();
	 bookingsbysid = {};
	
	 InitialBookings = data;
	 var from = InitialBookings.date1970;
	 var to = InitialBookings.date1970 + InitialBookings.period;
	 var offset = InitialBookings.placeOffset;
	 
	 tl_canvas.drawPeriodfrom = from;
	 tl_canvas.fromOrig = from;
	 tl_canvas.drawPeriodto = to;
	 tl_canvas.toOrig = to;
	
	 var shapesBooked = InitialBookings.shapesBooked;

	 for (var b=0 ; b < shapesBooked.length ; b++) {
	   var sid = shapesBooked[b].sid;
	   bookingsbysid[sid] = shapesBooked[b].ordersList;
	 }
	 
		for(var f = 0 ; f < StateFromServer.floors.length ; f++ ) {
			   var shapes = StateFromServer.floors[f].shapes;
			   var floorid = StateFromServer.floors[f].floorid;
			   for (var s=0 ; s < shapes.length ; s++) {
			     if(shapes[s].type != "line" && shapes[s].type != "text" ) {
			     var sid = shapes[s].sid;
				 var x = shapes[s].x;
				 var y = shapes[s].y;
				 var fid = floorid;
				 var name  = shapes[s].booking_options.givenName;
				 var bookings = [];
				 if (bookingsbysid[sid] != undefined) {
				    var booklist = bookingsbysid[sid];
				      for (var t=0 ; t < booklist.length ; t++ ) {
					     var bid = booklist[t].bid;
						 var from = booklist[t].from;
						 var to = booklist[t].to;
						 var persons = booklist[t].persons;
						 var bshape = new BShape(tl_canvas, from , to , bid , persons , "booked",name,sid);

						 bookings.push(bshape);
						 console.log("BShape booking added:");
						 console.log(bshape);
					  }
				 }

				 tl_canvas.setPshapeBookings(sid,bookings);
				 console.log("PShape Bookings added ("+sid+"):");
				 console.log(bookings);
				 }
			   }
	          		   
			}
		
		var placeOpen = InitialBookings.placeOpen;
		
		var array = ['sun','mon','tue','wed','thu','fri','sat'];
		var placeClosedArray = [];
		var placeFromSave = 0;
		for (var i = 0 ; i < placeOpen.length ; i ++ ) {
		    var singleClosed = {};
		   if (placeOpen[i].from > 0) {
		       singleClosed.from = placeFromSave;
			   singleClosed.to = placeOpen[i].from;
			   placeClosedArray.push(singleClosed);
		   } else {
		      
		   }
           placeFromSave = placeOpen[i].to;		   
		}
		if (placeFromSave < (tl_canvas.drawPeriodto - tl_canvas.drawPeriodfrom)) {
		   //add close shape at the end;
		   		    var singleClosed = {};
					singleClosed.from = placeFromSave;
					singleClosed.to=(tl_canvas.drawPeriodto - tl_canvas.drawPeriodfrom);
					placeClosedArray.push(singleClosed);
		}
		for (var c = 0; c < placeClosedArray.length ; c++) {
		   var bshape = new BShape(tl_canvas, tl_canvas.drawPeriodfrom + placeClosedArray[c].from - offset * 3600 , tl_canvas.drawPeriodfrom + placeClosedArray[c].to - offset * 3600, "" , 0 , "closed");
		   tl_canvas.closeShapes.push(bshape);
		   console.log("BShape closed added:");
		   console.log(bshape);
		}
        tl_canvas.organizeShapes();
		tl_canvas.valid = false;
		timelinediv.redraw();
		timegrid.redraw();
}