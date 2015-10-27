/**
 * 
 */
function requestWlBookings() {
    var pid = document.getElementById("server_placeID").value;
    var placeOffset = document.getElementById("server_placeUTC").value;
    
	var TimeOfTheDatePicker_1970 = +$("#datepicker_wl_from").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var dayOfweek = +$("#datepicker_wl_from").datepicker( "getDate" ).getDay();
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
	      beforeSend: function () { $("#wa_load_ajax").show(); $("#wl_load_dates_button").hide();},
	      success : function(data){
	    	 // alert(data);
	    	  $("#wa_load_ajax").hide(); $("#wl_load_dates_button").show();
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
}