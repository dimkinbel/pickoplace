/**
 * 
 */
function addCanvas(domID,canvasID) {
	$('#'+domID).append('<canvas id="'+canvasID+'"  width="400" height="30"  tabindex="1" />');
}
var TimeRangeValues = [];
var currentSliderValue = {};
var CanvasStates = [];
var clientBookings = {};
var shapesPrebookedJSON = {};
$(document).ready(function () { 
	
	for (var i =0 ; i < 2 ; i++) {
		for (var h=0 ; h < 24 ; h += 1) {
		   for (var m=0 ; m < 60 ; m +=15 ) {
			  var h_ = ""+h;
			  var m_ = ""+m;
			  if(h<10) {
				 h_ = "0"+h;
			  } 
			  if(m ==0 ) {
				m_  = "0"+m;
			  }
			 
			  if (i==0) {
			    TimeRangeValues.push(h_+":"+m_);
			  } else {
			    TimeRangeValues.push(h_+":"+m_+" NextDay");
			  }
		   }
		}
	}
    var now_plus_15 = moment() ;
	var modulus_15m = now_plus_15 % (15*60*1000);
	var equals15 = now_plus_15 - modulus_15m + 15*60*1000;
	//alert(moment(equals15,"x").format("DDMMM h:mm")+ "  " + modulus_15m + "  " + equals15);
	$("#booking_time_slider_for_canvas").ionRangeSlider({
	    values:TimeRangeValues,
		from:TimeRangeValues.indexOf("08:00"),
		min_interval: 1,
		onStart: function (data) {
           place_slider_value = data.from;
           currentSliderValue['booking_time_slider_for_canvas'] = data.from;
           $("#user_time_from_slider").html(TimeRangeValues[data.from]);
        },
        onChange: function (data) {
        	var current = data.from;
        	currentSliderValue['booking_time_slider_for_canvas'] = data.from;
        	$("#user_time_from_slider").html(TimeRangeValues[data.from]);
        	for (var i = 0 ; i < CanvasStates.length;i++) {
              var tstate = CanvasStates[i];
              var drags = tstate.dragShape;
              drags.x = current * tstate.step;
              tstate.valid = false;              
        	}
            
        },
		onFinish:  function (data) {
			place_slider_value = data.from;
        	var availableCase = checkBookingAvailableClosedPassed();
        	console.log(availableCase);
        	if(availableCase==1 || availableCase==2) {
        		document.getElementById("place_order_button").style.display="none";
        		document.getElementById("place_order_button_invalid").style.display="";
        	} else {
        		document.getElementById("place_order_button_invalid").style.display="none";
        		document.getElementById("place_order_button").style.display="";
        	}
        }
    });
	

$('#book_duration').on('change', function() {
	var availableCase = checkBookingAvailableClosedPassed();
	console.log(availableCase);
	if(availableCase==1 || availableCase==2) {
		document.getElementById("place_order_button").style.display="none";
		document.getElementById("place_order_button_invalid").style.display="";
	} else {
		document.getElementById("place_order_button_invalid").style.display="none";
		document.getElementById("place_order_button").style.display="";
	}
});
$("#datepicker").datepicker({
    currentText: "Now",
	defaultDate: +0,
	autoClose:true,
	dateFormat: "dd/mm/yy",
    minDate: "0",         //Минимальная дата которую можно выбрать, т.е. -30 дней от "сейчас"
    onSelect: function(dateText, inst) {
    	//alert("ONSELECT:"+dateText);
    	requestBookingAvailability();
    	},
    onClose: function(dateText, inst) {
    	}
});
$( "#datepicker" ).datepicker("setDate", "+0");



placeUTCOffsetGlobal = document.getElementById("server_placeUTC").value;
setInterval(function(){
    document.getElementById("local_live_time_div").innerHTML = calcTime(new Date(),placeUTCOffsetGlobal);
}, 1000);

// Update PAssed
setInterval(function(){
	for (var i = 0 ; i < CanvasStates.length;i++) {
        var tstate = CanvasStates[i];
        var passs = tstate.passedShape;
        if (passs!=null) {
			 var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime();
			 var placeOffset = document.getElementById("server_placeUTC").value;
			 var  dndt = TimeOfTheDatePicker_1970/1000;
		
			 var d = new Date();
			 var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
			 var nd = new Date(utc + (3600000 * placeOffset));
			 var ndt = nd.getTime()/1000;
			 
			 var twonextdays = new Date(TimeOfTheDatePicker_1970 + 2 * 24 * 3600 * 1000);
			 var twonextdayst = twonextdays.getTime()/1000;
			 if (dndt < ndt && ndt < twonextdayst) {
				 var diff = ndt - dndt;
				 var steps = diff / 15 /60;

              passs.w = steps * tstate.step;
              tstate.valid = false; 
             } else if (ndt>=twonextdayst){
            	 passs.w = tstate.width;
            	 tstate.valid = false; 
             }
       	}
	 }
}, 60000);
});

//Function for dynamically check booking availability in terms of "place_closed" OR "time_passed"
function checkBookingAvailableClosedPassed () {
	 var sliderSeconds = 15*60*parseInt(currentSliderValue['booking_time_slider_for_canvas']); // 15 minutes * slider steps

	 var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime();
	 var placeOffset = document.getElementById("server_placeUTC").value;
	 var  dndt = TimeOfTheDatePicker_1970/1000;
	 var d = new Date();
	 var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	 var nd = new Date(utc + (3600000 * placeOffset));
	 var ndt = nd.getTime()/1000;
     var diff = ndt - dndt; // seconds passed from the start of the selected date
     if (diff - 60 > sliderSeconds) {
    	 // If less than minute to book return "place_passed"
    	 return 1;
     }
     // Else slider is after the place time passed , check if place closed on selected range
     var TimePeriod = document.getElementById("book_duration").value; // Chosen period of booking
     var endOfBooking = parseInt(sliderSeconds) + parseInt(TimePeriod);
	 var placeOpen = shapesPrebookedJSON.placeOpen;
	 var anyOpenRangeValid = false;
	 for (var ind in placeOpen) { 		 
			  var from = placeOpen[ind].from;
			  var to  = placeOpen[ind].to;
			  if (from <= sliderSeconds &&  endOfBooking  <= to) {
				  anyOpenRangeValid = true;
			  }
	 }
	if(anyOpenRangeValid) {
	  //Some range valid
	   return 0;
	} else {
	   // No valid open range	
	   return 2;
	}
}
var placeUTCOffsetGlobal ;
function allowBooking(check_elem) {
	var id = check_elem.id;
	var sid_part = id.replace(/book_checkbox_/, "");
	var spinnerID = "booking_shape_num_persons_"+sid_part;
	var confirmID = "single_confirmation_"+sid_part;
	if($("#"+id).attr("checked")){ 
		 $( "#"+ spinnerID).spinner( "enable" );
		 $("#"+confirmID).show();
	}else{ 
	     $( "#"+ spinnerID).spinner( "disable" );
	     $("#"+confirmID).hide();
	}
}
function calcTime(date,offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    return  moment(nd).format("DD/MM/YY HH:mm:ss");

}
var bookingOrderJSONlist=[];
var bookingOrderJSON = {};
function displayBookingRequest() {
  bookingOrderJSONlist=[];
  bookingOrderJSON = {};
  var bookID =  "book_"+randomString(15);
  var testID = "temp_"+randomString(10);
  for (var i = 0;i < currentInSelection.length ; i ++) {
      var sid = currentInSelection[i];
      if ($("#book_checkbox_"+sid).attr("checked")) {
		  var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime()/1000;
		  var SecondsOfSliderPicker = place_slider_value*15*60;
		  var PlaceName = document.getElementById("up_place_name_val_"+sid).value;
		  var PlaceSID = document.getElementById("up_place_sid_val_"+sid).value;
		  var TimePeriod = document.getElementById("book_duration").value;
		  var PID = document.getElementById("server_placeID").value;
		  var persons = document.getElementById("booking_shape_num_persons_"+sid).value;

		  var d = new Date();
		  var clientOffset = d.getTimezoneOffset();
		  var placeUTCoffset = document.getElementById("server_placeUTC").value;
		  bookingOrderJSON = {"pid":PID,
				              "sid":PlaceSID,
				              "bookID":bookID,
				              "testID":testID,
				              "dateSeconds":TimeOfTheDatePicker_1970,
				              "time":SecondsOfSliderPicker,
				              "period":TimePeriod,
				              "persons":persons,
				              "clientOffset":clientOffset,
				              "placeOffcet":placeUTCoffset};
		  bookingOrderJSONlist.push(bookingOrderJSON);
		  $('#pb_name_'+sid).html(PlaceName + " (" +PlaceSID+")");
		  $('#pb_date_'+sid).html($("#datepicker").datepicker( "getDate" ).toDateString() + "("+TimeOfTheDatePicker_1970+")");
		  $('#pb_time_'+sid).html(TimeRangeValues[place_slider_value] + "(" + SecondsOfSliderPicker + ")");
		  $('#pb_duration_'+sid).html(TimePeriod/60 + " min (" + TimePeriod + ")");
		  $('#pb_persons_'+sid).html(persons);
      }
  }
  document.getElementById("bookingConfirmationPopUp").style.display="";
 
}
function bookingConfirmCancel() {
	document.getElementById("bookingConfirmationPopUp").style.display="none";
}


var place_slider_value;
var slider_value;
function updateShapeOnBookingValue(shape) {
  var shapeName = shape.booking_options.givenName;
  var shapeSID = shape.sid;
  document.getElementById("up_place_name_val_"+shapeSID).value = shapeName;
  document.getElementById("up_place_sid_val_"+shapeSID).value = shapeSID;
  
  for(var fc = 0; fc < floorCanvases.length ; fc ++) {
	  if(floorCanvases[fc].shapes.indexOf(shape) != -1) {
		  document.getElementById("up_floor_name_val_"+shapeSID).value = floorCanvases[fc].floor_name;
	  }
  }
  $( "#booking_shape_num_persons_"+shapeSID ).spinner( "option", "min", shape.booking_options.minPersons );
  $( "#booking_shape_num_persons_"+shapeSID ).spinner( "option", "max", shape.booking_options.maxPersons );
  $( "#booking_shape_num_persons_"+shapeSID ).spinner( "value",  shape.booking_options.minPersons );
  $( "#booking_shape_num_persons_"+shapeSID ).spinner("widget").addClass("marginright10_");

  //up_place_ovr_canvas
  if (shape.type == "image") {
   document.getElementById("up_place_ovr_image_"+shapeSID).src = document.getElementById(shape.options.imgID).src;
   document.getElementById("PlaceImageConfirm_img_"+shapeSID).src = document.getElementById(shape.options.imgID).src;
   if (shape.w > shape.h) {
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.width=100+"px";
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.height = parseInt(100 * shape.h / shape.w)+"px" ; 
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.width=100+"px";
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.height = parseInt(100 * shape.h / shape.w)+"px" ; 
   } else {
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.height=100+"px";
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.width = parseInt(100 * shape.w / shape.h)+"px" ;
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.height=100+"px";
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.width = parseInt(100 * shape.w / shape.h)+"px" ;
   }
   document.getElementById("up_place_ovr_canvas_"+shapeSID).style.display = "none";
   document.getElementById("up_place_ovr_image_"+shapeSID).style.display = "";
  } else {
   document.getElementById("up_place_ovr_canvas_"+shapeSID).style.display = "";
   document.getElementById("up_place_ovr_image_"+shapeSID).style.display = "none"; 
   var type = shape.type;
   var c = document.getElementById("up_place_ovr_canvas_"+shapeSID);
   var ctx = c.getContext("2d");
   ctx.clearRect( 0 , 0 , 100 , 100 );
   
	 if (type == "rectangle") {
		dbDrawRect(ctx,50,50,75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw);
	  } else if (type == "round") { 
		dbRoundRect(ctx , 50, 50, 75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw,shape.options.roundRad);
	  } else if (type == "circle") {
		 dbCircle(ctx , 50, 50, 75,75,shape.options.startA,shape.options.endA,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw);
	  } else if (type == "trapex") {
		 dbTrapez(ctx,50,50,75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw,shape.options.cutX);
	  }  
	 document.getElementById("PlaceImageConfirm_img_"+shapeSID).src =  c.toDataURL('image/png');
  }
  
  drawBookingTimeCanvas('booking_slider_canvas',shapeSID,15,400,30,2);
  document.getElementById("single_shape_order_0").style.display="";
}
var currentInSelection=[];
function removeUnselectedShape(sid,ID) {
	// Book table
	var elementID = 'single_place_booking_picture_'+sid;
	var element = document.getElementById(elementID);
	element.outerHTML = "";
	delete element;
	// Book confirm
	var elementIDc = 'single_confirmation_'+sid;
	var elementc = document.getElementById(elementIDc);
	elementc.outerHTML = "";
	delete element;
	var idx = currentInSelection.indexOf(sid);
	if (idx!=-1) {
		currentInSelection.splice(idx, 1);
	}
}
function appendSelctedShape(sid,appendToID,shape,floor) {
	var alreadySelected = false;
	for (var i = 0;i < currentInSelection.length ; i ++) {
		if (currentInSelection[i]==sid)
			alreadySelected = true;
	}
	if(!alreadySelected) {
		 var appendData = "";
		 appendData +=  '<table class="single_place_booking_picture" id = "single_place_booking_picture_'+sid+'" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%;">';
		 appendData +=  '   <tr >';
		 appendData +=  '	   <td class="pick_image_overview" rowspan="2"  style="width:100px;height:100px" >';
		 appendData +=  '        <div id="up_place_ovr_div_'+sid+'"  style="width:100px;height:100px" >';
		 appendData +=  '		    <canvas id="up_place_ovr_canvas_'+sid+'" width="100" height="100" tabindex="1"  style="display:"></canvas>';
		 appendData +=  '			<img id="up_place_ovr_image_'+sid+'" width="100px" height="100px" style="display:none"/>';
		 appendData +=  '	    </div>';
		 appendData +=	'   </td>';
		 appendData +=	'   <td class="pick_place_cnavas_single" id="brbr_'+sid+'"><!--FOR_CANVAS--></td>	';			
		 appendData +=	'   <td class="book_checkbox_td"><input type="checkbox" checked="checked" id="book_checkbox_'+sid+'" class="css-checkbox booking_single_checkbox" onchange="allowBooking(this)"/></td>';
		 appendData +=	'  '; 
		 appendData +=	' </tr>';
		 appendData +=	' <tr>';
		 appendData +=	'   <td class="place_ub_pick_info">';
		 appendData +=	'      <div id="up_floor_name"  style="float:left">Floor: <input class="invisible_input" id="up_floor_name_val_'+sid+'" disabled/></div>';
		 appendData +=	'      <div id="up_place_name"  style="float:left">Place name: <input class="invisible_input" id="up_place_name_val_'+sid+'" disabled/></div>';
		 appendData +=	'	   <div id="up_place_sid"  style="float:left">Place SID: <input class="invisible_input" id="up_place_sid_val_'+sid+'" disabled/></div>';
		 appendData +=	'   </td>';
		 appendData +=	'   <td class="for_persons">Persons<br/><input class="booking_spinner"  id="booking_shape_num_persons_'+sid+'"/></td>	';							   
		 appendData +=  '  </tr>';
		 appendData +=  '  </table>	';
	     
		 var confirmationAppend = "";
		 confirmationAppend +=  '  <table id="single_confirmation_'+sid+'" cellpadding="0" style="width:100%;height:100%;border:1px solid;">';
	     confirmationAppend +=  ' <tr>';
		 confirmationAppend +=  '    <td rowspan="5"><div class="PlaceImageConfirm"><img id="PlaceImageConfirm_img_'+sid+'" width=100 height=100/></div></td>';
		 confirmationAppend +=  '   <td class="confirm_text">Place Name (ID):</td>';
	     confirmationAppend +=  '	         <td><div class="confirm_value" id="pb_name_'+sid+'"></div></td>';
		 confirmationAppend +=  '	       </tr>';
         confirmationAppend +=  '	       <tr>';
	     confirmationAppend +=  '   <td class="confirm_text">Date:</td>';
		 confirmationAppend +=  '    <td><div class="confirm_value" id="pb_date_'+sid+'"></div></td>';
		 confirmationAppend +=  '  </tr>';
		 confirmationAppend +=  '   <tr>';
		 confirmationAppend +=  '  <td class="confirm_text">Time:</td>';
		 confirmationAppend +=  '       <td><div class="confirm_value" id="pb_time_'+sid+'"></div></td>';
		 confirmationAppend +=  '     </tr>';
		 confirmationAppend +=  '      <tr>';
		 confirmationAppend +=  '        <td class="confirm_text">Persons:</td>';
		 confirmationAppend +=  '         <td><div class="confirm_value" id="pb_persons_'+sid+'"></div></td>';
		 confirmationAppend +=  '       </tr>';
		 confirmationAppend +=  '      <tr>';
		 confirmationAppend +=  '        <td class="confirm_text">Duration:</td>';
	     confirmationAppend +=  '        <td><div class="confirm_value" id="pb_duration_'+sid+'"></div></td>';
		 confirmationAppend +=  '      </tr>';
		 confirmationAppend +=  '   </table>';
		 $("#"+appendToID).append(appendData);
		 $("#booking_confirmation_append").append(confirmationAppend);
		 currentInSelection.push(sid);
		 $( "#booking_shape_num_persons_"+sid ).spinner({});	 
		 updateShapeOnBookingValue(shape);
		 
	}
}
function bookingConfirmConfirm() {
	 // alert(JSON.stringify(bookingOrderJSON));
	 var clientid=document.getElementById('booking_user_cred').value;
	 var loggedby=document.getElementById('loggedBy_').value;
	 var dayOfweek = +$("#datepicker").datepicker( "getDate" ).getDay();
	 var bookingRequestWrap = {};
	 var u = 0;
	  for (var i = 0 ; i < bookingOrderJSONlist.length ; i++) {
	   var testID = bookingOrderJSONlist[i].testID;
	   bookingOrderJSONlist[i].clientid = clientid;
	   bookingOrderJSONlist[i].loggedby = loggedby;
	   clientBookings[testID]=true;
	   if (i==0) {
		   bookingRequestWrap.pid = bookingOrderJSONlist[i].pid;
		   bookingRequestWrap.bookID = bookingOrderJSONlist[i].bookID;
		   bookingRequestWrap.testID = bookingOrderJSONlist[i].testID;
		   bookingRequestWrap.dateSeconds = bookingOrderJSONlist[i].dateSeconds;
		   bookingRequestWrap.time = bookingOrderJSONlist[i].time;
		   bookingRequestWrap.period = bookingOrderJSONlist[i].period;
		   bookingRequestWrap.clientOffset = bookingOrderJSONlist[i].clientOffset;
		   bookingRequestWrap.placeOffcet = bookingOrderJSONlist[i].placeOffcet;
		   bookingRequestWrap.clientid = clientid;
		   bookingRequestWrap.loggedby = loggedby;
	   }
	  }
	  bookingRequestWrap.bookingList = bookingOrderJSONlist;
	  bookingRequestWrap.weekday = dayOfweek;
	  var bookingjson = {booking:JSON.stringify(bookingRequestWrap)};
	  
	  document.getElementById("bookingConfirmationPopUp").style.display="none";
	  $.ajax({
	      url : "/clientBookingRequest",
	      data: bookingjson,//
	      success : function(data){
	    	  if(data.added) {
	    	      displayMessage("green","Order placed");
	    	      requestBookingAvailability();
	    	  } else {
	    		  displayMessage("red","Not added. Try another time");  
	    	  }
	      },
	      dataType : "JSON",
	      type : "post"
	  });
}
//var eventSource = new EventSource("/alertBookingEvent");
//eventSource.onmessage = function(event) {
//    console.log(event.data); 
//};
function sendBookEventServlet() {
	var pid = document.getElementById("server_placeID");
	var json = {pid:pid};
	  $.ajax({
	      url : "/alertBookingEvent",
	      data: json,
	      dataType : "JSON",
	      type : "get"
	  });
}

function requestBookingAvailability() {
	var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var dayOfweek = +$("#datepicker").datepicker( "getDate" ).getDay();
	var d = new Date();
	var clientOffset = -1*d.getTimezoneOffset()/60;
	var placeOffset = document.getElementById("server_placeUTC").value;
	var placeID = document.getElementById("server_placeID").value;
	var requestJSON = {};
	
	requestJSON.date1970 = TimeOfTheDatePicker_1970  ;// - d.getTimezoneOffset()*60 ;
	requestJSON.weekday = dayOfweek;
	requestJSON.period = 2*24*60*60;
	requestJSON.clientOffset = clientOffset;
	requestJSON.placeOffset = placeOffset;
	requestJSON.pid = placeID;
	var jsonData = {bookrequest:JSON.stringify(requestJSON)};
	$.ajax({
	      url : "/checkPidAvailable",
	      data: jsonData,
	      beforeSend: function () { $("#datepicker_ajax_gif").show(); },
	      success : function(data){
	    	 // alert(data);
	    	 $("#datepicker_ajax_gif").hide();
	    	 document.getElementById("server_shapes_prebooked").value=JSON.stringify(data);
	    	 shapesPrebookedJSON = JSON.parse(document.getElementById("server_shapes_prebooked").value);
	    	  $("#for_debug").html(JSON.stringify(data));
	    	  for(var c = 0 ; c < floorCanvases.length;c++) {
	    		  var canvas__ = floorCanvases[c];
		    	  if(canvas__.listSelcted.length > 0) {
		    		  for (var s = 0; s < canvas__.listSelcted.length;s++) {
		    		    var sid = canvas__.listSelcted[s].sid;
		    		    drawBookingTimeCanvas('booking_slider_canvas',sid,15,400,30,2);
		    		  }
		    	  }
	    	  }
	    	 // d = new Date(data.date1970 * 1000);
	    	 // $("#for_debug").append('<br/>'+d);
	    	    var availableCase = checkBookingAvailableClosedPassed();
	        	console.log(availableCase);
	        	if(availableCase==1 || availableCase==2) {
	        		document.getElementById("place_order_button").style.display="none";
	        		document.getElementById("place_order_button_invalid").style.display="";
	        	} else {
	        		document.getElementById("place_order_button_invalid").style.display="none";
	        		document.getElementById("place_order_button").style.display="";
	        	} 
	    	 
	      },
	      dataType : "JSON",
	      type : "post"
	  });
}



function drawBookingTimeCanvas(canvasID,shapeID,minRange,width,height,daysCount) {

 //  var c = document.getElementById(canvasID); 
	$('#brbr_'+shapeID).html('');
	$('#brbr_'+shapeID).append('<canvas id="'+canvasID+'_'+shapeID+'"  width="400" height="30"  tabindex="1" />');
	
  var  tcanvas_; 

	  tcanvas_= new  TCanvasState(document.getElementById(canvasID+'_'+shapeID));
	  tcanvas_.forsid = shapeID;
	  CanvasStates.push(tcanvas_);
   
   tcanvas_.width = width;
   tcanvas_.height = height;
   var canvasStep=width/daysCount/(24*60/minRange);
   tcanvas_.step = canvasStep; // minRange minutes in canvas pixels

 
   
   var pid = shapesPrebookedJSON.pid;
   var requestFromDate = shapesPrebookedJSON.date1970; 
   var clientOffset = shapesPrebookedJSON.clientOffset;
   var placeOffset = shapesPrebookedJSON.placeOffset;
   var requestPeriod = shapesPrebookedJSON.period;
   var placeOpen = shapesPrebookedJSON.placeOpen;
   var shapesList = shapesPrebookedJSON.shapesBooked;
 
   var fromc = 0;
   var toc = 0;

  
   for (var ind in placeOpen) { 
	 //  for (var days = 0 ; days < daysCount ; days++) {
		  var from = placeOpen[ind].from;
		  var to  = placeOpen[ind].to;
		  if(from != to) {
		  var fromSteps = from/minRange/60;
		  var toSteps = to/minRange/60;
		  var rangeSteps = toSteps - fromSteps;
		  fromc = fromSteps * canvasStep;// + days * tcanvas_.width/daysCount;
		  toc = rangeSteps * canvasStep;
		  //alert(fromc+" "+toc);
		  //ctx.fillStyle = "white";
	      //ctx.fillRect(fromc,0,toc,30);
		  tcanvas_.addShape( new TShape(tcanvas_, fromc , toc ,tcanvas_.height, 'opened' , 1 ));
		  }
	  // }
   }
 
 var requestFromDateUTC = requestFromDate + clientOffset*60*60;  
 if (shapeID!=null) {
   for (var ind in shapesList) {     
	 var shapeSID = shapesList[ind].sid;
	 if(shapeSID == shapeID) {
	      var shapeBookList = shapesList[ind].ordersList;
		  for (var ind2 in shapeBookList) {
			  var testID = shapeBookList[ind2].testID;
			  var from = shapeBookList[ind2].from;        // In UTC seconds from 1970
			  var to  = shapeBookList[ind2].to;           // In UTC seconds from 1970
			  var UTCsecFrom = from -  requestFromDateUTC;// In UTC seconds from 1970 
			  var UTCsecTo = to -  requestFromDateUTC;    // In UTC seconds from 1970
			  var PlaceRelativeFrom = UTCsecFrom + placeOffset*60*60;
			  var PlaceRelativeTo = UTCsecTo + placeOffset*60*60;
			  var fromSteps = PlaceRelativeFrom/minRange/60;
			  var toSteps = PlaceRelativeTo/minRange/60;
			  var rangeSteps = toSteps - fromSteps;
			  fromc = fromSteps * canvasStep ;
			  toc = rangeSteps * canvasStep;
			  if (testID!= null && testID!= "" && clientBookings[testID]!== undefined) {
				//  alert(clientBookings[testID]);
				  tcanvas_.addShape( new TShape(tcanvas_, fromc , toc ,tcanvas_.height, 'book' , 1 ));
			  } else {
			      tcanvas_.addShape( new TShape(tcanvas_, fromc , toc ,tcanvas_.height, 'ordered' , 1 ));
			  }
			  //ctx.fillStyle = "red";
		      //ctx.fillRect(fromc,0,toc,30);
		      //ctx.strokeStyle = "rgb(189, 1, 1)";
		      //ctx.strokeRect(fromc,0,toc,30);
		      
		  }
	   }
	 }
  // }
 }

 var current_idx = currentSliderValue['booking_time_slider_for_canvas'];
 var from_drag = parseInt(current_idx * canvasStep);
 tcanvas_.addShape( new TShape(tcanvas_, from_drag , 1 ,tcanvas_.height, 'drag' , 1 ));
 // TBD BOOK
 // TBD PASSED
;

var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime();
var  dndt = TimeOfTheDatePicker_1970/1000;

 var d = new Date();
 var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
 var nd = new Date(utc + (3600000 * placeOffset));
 var ndt = nd.getTime()/1000;
 
 var twonextdays = new Date(TimeOfTheDatePicker_1970 + 2 * 24 * 3600 * 1000);
 var twonextdayst = twonextdays.getTime()/1000;
 console.log("dndt="+dndt+",ndt="+ndt+",twodays="+twonextdayst);
 if (dndt < ndt && ndt < twonextdayst) {
	 var diff = ndt - dndt;
	 var steps = diff / minRange/60;
	 tcanvas_.addShape( new TShape(tcanvas_, 0 , steps*canvasStep ,tcanvas_.height, 'passed' , 1 ));
	 console.log("width="+steps*canvasStep);
 } else if (ndt >= twonextdayst) {
	 tcanvas_.addShape( new TShape(tcanvas_, 0 , tcanvas_.width ,tcanvas_.height, 'passed' , 1 ));
 }


 tcanvas_.valid = false;
}