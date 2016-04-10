/**
 * 
 */


	



setInterval(function(){
    $("#local_live_time_div").html(calcTime(new Date(),placeUTCOffsetGlobal));
}, 1000);


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
					bookingsManager = new BookingsManager(shapesPrebookedJSON);
					updateSelectOptions("dropdown_start_floors","dropdown",'datepicker_ub');
					initialTCanvas();
					updateCloseShapes();


				},
				dataType : "JSON",
				type : "post"
			});
		} else {
			shapesPrebookedJSON =  generateTestValues() ;
			bookingsManager = new BookingsManager(shapesPrebookedJSON);
			updateSelectOptions("dropdown_start_floors","dropdown",'datepicker_ub');
			initialTCanvas();
			updateCloseShapes();
		}
	});
}


function calcTime(date,offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    return  moment(nd).format("DD/MM/YY HH:mm:ss");

}
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
	  var bookID =  "book_"+randomNum(10);
	  var testID = "temp_"+randomString(10);
	  var d = new Date();
	  var clientOffset = d.getTimezoneOffset();
	  var placeUTCoffset = document.getElementById("server_placeUTC").value;

	  var TimePeriod = bookingOrder.period;
	  var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime()/1000;
	  
	  var dayOfweek = +$("#datepicker_ub").datepicker( "getDate" ).getDay();
		
	  
	  // Get selected shapes
	  for(var f=0;f < bookingOrder.listOfSids.length;f++) {
		    	  var shape = bookingOrder.listOfSids[f];
		    	  var sid = shape.sid;		    	  
		    	  var PID = document.getElementById("server_placeID").value;
		    	  var persons = shape.persons;
		    	  
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
	  bookingRequestWrap.bookingList = bookingOrderJSONlist;
	  bookingRequestWrap.textRequest = $("#user_input_hz").val();
	  bookingRequestWrap.weekday = dayOfweek;
	bookingRequestWrap.type = "user";
}


var place_slider_value;
var slider_value;
function drawShapeCanvasOnBooking(canvasID , shape) {
	  var c = document.getElementById(canvasID);
	  var ctx = c.getContext("2d");
	  ctx.clearRect( 0 , 0 , 50 , 50 );
	    var lineColor = shape.options.lineColor;
		var fillColor = shape.options.fillColor ;
		var x = 25;
		var y = 25;
		var width = shape.w;
		var height = shape.h;
		var alpha = shape.options.alpha;
		var salpha = shape.options.salpha;
		var sw = shape.options.sw;
		var rel = 1;
		if (width > 44 || height > 44) {
				if (width > height) {
					rel = 44 / width;
				} else {
					rel = 44 / height;
				}
		}
		if (rel*sw < 1) { sw = 1; } else { sw = sw * rel ;} ;
	  if (shape.type == "round") {
	  
		var rad = shape.options.roundRad;	
		dbRoundRect(ctx,x,y,parseInt(width*rel),parseInt(height*rel),lineColor,fillColor,alpha,salpha,sw,rad);
		
	  } else if (shape.type == "circle") {
	  
		rad = (width<height)?width:height;
		startA = 0;
		endA = 360;
		dbCircle(ctx , x, y, parseInt(rel*rad) ,parseInt(rel*rad), startA, endA ,lineColor,fillColor,alpha,salpha,sw);
		
	  } else if (shape.type == "trapex") {
		dbTrapez (ctx,x,y, parseInt(rel*width), parseInt(rel*height),lineColor,fillColor,alpha,salpha,sw,shape.options.cutX);

	  } else if (shape.type == "rectangle") {

		dbDrawRect(ctx,x,y, parseInt(rel*width), parseInt(rel*height),lineColor,fillColor,alpha,salpha,sw);

	  }  
	}


//var eventSource = new EventSource("/alertBookingEvent");
//eventSource.onmessage = function(event) {
//    console.log(event.data); 
//};
function SIapplyBooking() {
	$("#make_booking").hide();
	$("#loading_text_w").show();
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
		      url : "/clientBookingRequest",
		      data: bookingjson,//
		      beforeSend: function () {
		      },
		      success : function(data){
				  $("#make_booking").show();
				  $("#loading_text_w").hide();
				  $('#booking_order_modal').modal('hide');
			    	  if(data.added==true) {

			    		  $("#bookingAcceptedModal_header").removeClass("book_modal_fail").addClass("book_modal_success");
						  $("#bookingAcceptedModal_body").removeClass("book_modal_fail").addClass("book_modal_success");
						  $("#bookingAcceptedModal_body").html("הזמנתך התקבלה בהצלחה");
						  $("#bookingAcceptedModal").modal("show");
						  tk = bookingOrder;
						  for(var s = 0; s < tk.listOfSids.length;s++) {
							  bookingsManager.addSidBooking(tk.listOfSids[s].sid,
									  parseInt(tk.dateSeconds) + parseInt(tk.start),
									  parseInt(tk.dateSeconds) + parseInt(tk.start) + parseInt(tk.period),
									  bookingRequestWrap.bookID);
						  }
						  updateCloseShapes();
						  emptyOrder();
			    	  } else {
						  $("#bookingAcceptedModal_header").removeClass("book_modal_success").addClass("book_modal_fail");
						  $("#bookingAcceptedModal_body").removeClass("book_modal_success").addClass("book_modal_fail");
						  $("#bookingAcceptedModal_body").html(data.reason);
						  $("#bookingAcceptedModal").modal("show");
			    	  }
			    	  
		      },
		      dataType : "JSON",
		      type : "post"
		  });				  

	}

setInterval(function(){
	 if(close_popup_request == true) {
	    if(close_popup_sec >= 3) {
	    	close_popup_request = false;
	    	close_popup_sec = 0;
	    	$("#popup_message_wrap").hide();
	    } else {
	    	close_popup_sec+=0.1;
	    }
	 }
	}, 100);
var close_popup_request = false;
var close_popup_sec = 0;
function popupMessage(message,class_color) {
	 $("#popup_message_wrap").removeClass("close_popup_message_delay");
	 $("#popup_message").removeClass("pop_red");
	 $("#popup_message").removeClass("pop_green");
	 $("#message_data").html(message);
	 $("#popup_message").addClass(class_color);
	 $("#popup_message_wrap").show();
	 $("#close_popup_message").click(function(){$("#popup_message_wrap").hide();});
	 close_popup_request = true;
}


	$(document).ready(function() {
	setInterval(function(){
	    var allof = document.getElementsByName("pl_offcet");
		for(var x=0; x < allof.length; x++) {
		   var plof = document.getElementById(allof[x].id).value;
		   var bid = allof[x].id.replace(/^pl_offcet_/, "");
		   var time_ = document.getElementById('book_time_'+bid).value;
	       document.getElementById('sb_left_').innerHTML = calcRemainTimeBookingOpen(plof,time_);
		}
	}, 1000);
	});

	function calcRemainTimeBookingOpen(offset,time_) {
	    var d = new Date();
	    var clientOffset = d.getTimezoneOffset();
	    var utc = d.getTime() + (clientOffset * 60000);
	    var placeDate = new Date(utc + 3600000 * offset);
	    var placeBooking = new Date(time_*1000);

		var remsec = placeBooking.getTime()/1000 - placeDate.getTime()/1000;
		var str = "";
		if (remsec > 0) {
			str +=  "<span style='color:rgb(255, 56, 56);'>";
			var rday  = Math.floor(remsec / (3600*24));
			var rhour = Math.floor((remsec - rday*(3600*24))/3600);
			var rmin  = Math.floor((remsec - rday*(3600*24) - rhour*3600)/60);
			var rsec  = Math.floor(remsec - rday*(3600*24) - rhour*3600 - rmin *60 );
			if (rday>0)  {str+=rday+'<span style="font-size:11px;">days</span> ';} 
			if (rhour>0) {str+=rhour+':';}  else {str+='0:';}
			if (rmin>9)  {str+=rmin+':';} else if (rmin>0) {str+='0'+rmin+':';} else {str+='00:';}
			if (rsec>9)  {str+=rsec+"</span>";} else {str+="0"+rsec+"</span>";};
			
		} else {
		    str = "<span style='color:rgb(0, 199, 33);'>0 sec</span>";
		}
	    return  str;
	}
	
	