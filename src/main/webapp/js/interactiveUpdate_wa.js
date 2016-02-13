/**
 * 
 */
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