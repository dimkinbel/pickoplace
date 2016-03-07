 

function requestBookingAvailability() {
	var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var dayOfweek = +$("#datepicker_ub").datepicker( "getDate" ).getDay();
	var d = new Date();
	var clientOffset = -1*d.getTimezoneOffset()/60;
	var placeOffset = document.getElementById("server_placeUTC").value;
	var placeID = document.getElementById("server_placeID").value;
	var requestJSON = {};
	var listOfSids = [];
	for (var f = 0 ;f < if_floorCanvases.length ; f++) {
		for(var s=0; s <if_floorCanvases[f].shapes.length ;s++) {
			listOfSids.push(if_floorCanvases[f].shapes[s].sid);
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
			if(document.getElementById("showonly_div") == null) {
				$.ajax({
					url: "/checkPidAvailable",
					data: jsonData,
					beforeSend: function () {
					},
					success: function (data) {
						// alert(data);
						document.getElementById("server_shapes_prebooked").value = JSON.stringify(data);
						shapesPrebookedJSON = JSON.parse(document.getElementById("server_shapes_prebooked").value);
						bookingsManager = new BookingsManager(shapesPrebookedJSON);
						updateSelectOptions("dropdown_start_floors", "dropdown", 'datepicker_ub', minPeriodSeconds);
						updateCloseShapes();


					},
					dataType: "JSON",
					type: "post"
				});
			} else {
				shapesPrebookedJSON =  generateTestValues() ;
				bookingsManager = new BookingsManager(shapesPrebookedJSON);
				updateSelectOptions("dropdown_start_floors","dropdown",'datepicker_ub',minPeriodSeconds);
				updateCloseShapes();
			}
		} else {
			shapesPrebookedJSON =  generateTestValues() ;
			bookingsManager = new BookingsManager(shapesPrebookedJSON);
			updateSelectOptions("dropdown_start_floors","dropdown",'datepicker_ub',minPeriodSeconds); 
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
}


var place_slider_value;
var slider_value;
 

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

				  $("#loading_text_w").hide();

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
 
 
 
 
	
	