var TimeRangeValues = [];
var currentSliderValue = {};
var clientBookings = {};

var rangeSliderInitial = false;
var place_slider_from;
var place_slider_to;
var startShowTime;
var endShowTime;
var sliderData;
var prevSliderLeft = 0;
var prevSliderRight = 0;
var place_slider_value;
var DatepickerSetDate = "+0";
$(document).ready(function () {
	updateTimeRangeValues();



	$("#left_triangle_btn").click(function(){
		var curleft = $("#selected_append").position().left;
		var newleft = curleft - 10;
		$("#selected_append").css({left:newleft});
		checkLeftRightArrows();
	});
	$("#fe_iflist").click(function(){
		$("#center_column_like").hide();
		$("#right_column_like_fe").hide();
		$("#list_iframes").show();
	});
	$("#fe_back_").click(function(){
		$("#list_iframes").hide();
		$("#center_column_like").show();
		$("#right_column_like_fe").show();
	});


	$("#right_triangle_btn").click(function(){
		var curleft = $("#selected_append").position().left;
		var newleft = curleft + 10;
		$("#selected_append").css({left:newleft});
		checkLeftRightArrows();
	});


	$("#booking_tag").click(function(){
		bookingShow();
	});
	$("#booking_hide_tag").click(function(){
		bookingHide();
	});
	setInterval(function(){
		if(rangeSliderInitial == true) {

			$("#from_margin_div").css("left",$("#irs_slider_from_").position().left+$("#irs_slider_from_").width()/2+"px");
			$("#inner_margin_div").css("left",$("#irs_slider_from_").position().left+$("#irs_slider_from_").width()/2+1+"px");
			$("#inner_margin_div").css("width",$(".irs-bar").width()-1+"px");
			$("#to_margin_div").css("left",$("#irs_slider_to_").position().left+$("#irs_slider_to_").width()/2+"px");
			$("#from_margin_div").show();
			$("#inner_margin_div").show();
			$("#to_margin_div").show();
			rangeSliderInitial = false;
		}
	}, 100);
// Update PAssed
	setInterval(function(){

		var tstate = tcanvas_;
		var passs = tstate.passedShape;
		if (passs!=null) {
			var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime();
			var placeOffset = document.getElementById("server_placeUTC").value;
			var  dndt = TimeOfTheDatePicker_1970/1000;

			var d = new Date();
			var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
			var nd = new Date(utc + (3600000 * placeOffset));
			var ndt = nd.getTime()/1000;

			var twonextdays = new Date(TimeOfTheDatePicker_1970 + days_ * 24 * 3600 * 1000);
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

	}, 60000);

});
function  updateTimeRangeValues() {
	TimeRangeValues=[];
	for (var i =0 ; i < days_ ; i++) {
		var h_;
		var m_;
		for (var h=0 ; h < 24 ; h += 1) {
			for (var m=0 ; m < 60 ; m +=15 ) {
				h_ = ""+h;
				m_ = ""+m;
				if(h<10) {
					h_ = "0"+h;
				}
				if(m ==0 ) {
					m_  = "0"+m;
				}

				if (i==0) {
					TimeRangeValues.push(h_+":"+m_);
				} else {
					TimeRangeValues.push(h_+":"+m_+"*");
				}
			}
		}
		if(i==days_-1) {
			var H = parseInt(h_)+1;
			var M =  (parseInt(m_)+15)%60;
			if(M==0) {M=M+"0"};
			TimeRangeValues.push(H+":"+M+"*");
		}
	}
}
function updateBookingSlider() {


	$("#booking_time_slider_for_canvas_fe").ionRangeSlider({
		values:TimeRangeValues,
		type: "double",
		force_edges:false,
		hide_min_max:true,
		hide_from_to:false,
		from:TimeRangeValues.indexOf("08:00"),
		to:TimeRangeValues.indexOf("12:00"),
		min_interval: 2,
		onStart: function (data) {
			currentSliderValue = data.from;
			place_slider_from = data.from;
			place_slider_to = data.to;
			updateBookingTimeVisible();

			rangeSliderInitial = true;
			var availableCase = checkBookingAvailableClosedPassed();
			//console.log(availableCase);
			if(availableCase==1 ) {
				$("#place_order_button_invalid").html("PASSED");
				document.getElementById("place_order_button").style.display="none";
				document.getElementById("place_order_button_invalid").style.display="";
			} else if(availableCase==2) {
				$("#place_order_button_invalid").html("CLOSED");
				document.getElementById("place_order_button").style.display="none";
				document.getElementById("place_order_button_invalid").style.display="";
			} else {
				document.getElementById("place_order_button_invalid").style.display="none";
				document.getElementById("place_order_button").style.display="";
			}
			updateTimeSteps();
			sliderData = data;
		},
		onChange: function (data) {
			var current = data.from;
			currentSliderValue = data.from;
			place_slider_from = data.from;
			place_slider_to = data.to;
			updateBookingTimeVisible();
			$("#from_margin_div").css("left",$(".irs-bar").position().left-1+"px");
			$("#inner_margin_div").css("left",$(".irs-bar").position().left+"px");
			$("#inner_margin_div").css("width",$(".irs-bar").width()-1+"px");
			$("#to_margin_div").css("left",$(".irs-bar").position().left+$(".irs-bar").width()-1+"px");
			sliderData = data;
		},
		onFinish:  function (data) {
			place_slider_from = data.from;
			place_slider_to = data.to;
			var availableCase = checkBookingAvailableClosedPassed();
			//console.log(availableCase);
			if(availableCase==1 ) {
				$("#place_order_button_invalid").html("PASSED");
				document.getElementById("place_order_button").style.display="none";
				document.getElementById("place_order_button_invalid").style.display="";
			} else if(availableCase==2) {
				$("#place_order_button_invalid").html("CLOSED");
				document.getElementById("place_order_button").style.display="none";
				document.getElementById("place_order_button_invalid").style.display="";
			} else {
				document.getElementById("place_order_button_invalid").style.display="none";
				document.getElementById("place_order_button").style.display="";
			}
			sliderData = data;
		}
	});
}
function updateTimeSteps() {

	$("#book_timeline_wrap").remove();

	var period = endShowTime - startShowTime;
	var hours = period/1000/3600;
	var canvasWidth = $("#tcanvas").width();
	$("#tcanvas_div").append('<div id="book_timeline_wrap" style="position:absolute;width:'+canvasWidth+'px"></div>');
	var singleHourPixels = canvasWidth/hours;
	$("#book_timeline_wrap").empty();
	var totalLeft = 0;
	var modulus = 1;
	if(days_==2) {
		modulus = 6;
	} else if (days_==1) {
		modulus = 3;
	}
	if(hours < 10) {
		modulus = 1;
	}
	for(var i = 0 ; i<=hours ; i++) {
		var timeString = TimeRangeValues[i*4];
		timeString = timeString.replace("*","");
		var appendData = "";
		var appendDataIn = "";
		if(i%3==0) {
			appendData = '<div class="btimestep" id="btimestep-'+i+'"></div>';
		} else {
			appendData = '<div class="btimestep_small" id="btimestep-'+i+'"></div>';
		}
		$("#book_timeline_wrap").append(appendData);
		$("#btimestep-"+i).css("left",totalLeft+"px");
		if(i==0 ) {
			appendDataIn = '<div class="left_time_graph">'+timeString+'</div>';
			$("#btimestep-"+i).append(appendDataIn);
		} else if (i==hours) {
			appendDataIn = '<div class="right_time_graph">'+timeString+'</div>';
			$("#btimestep-"+i).append(appendDataIn);
		} else if(i%modulus==0) {
			var onlyHour =  timeString.replace(/:.*/,"");
			if(onlyHour=="00") {
				var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime();
				var newSec = parseInt(TimeOfTheDatePicker_1970)+24*3600*1000;
				var d=new Date(newSec);
				var DayTomorrow = d.getDate();
				var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				var MonTomorrow = monthNames[d.getMonth()];

				var curd = new Date(TimeOfTheDatePicker_1970);
				var DayNow = curd.getDate();
				var MonNow = monthNames[curd.getMonth()];


				if(i > 1) {
					appendDataIn = '<div class="right_day_graph">'+DayNow+MonNow+'</div>';
					$("#btimestep-"+i).append(appendDataIn);

				}
				if(i< hours - 1) {
					appendDataIn = '<div class="left_day_graph">'+DayTomorrow+MonTomorrow+'</div>';
					$("#btimestep-"+i).append(appendDataIn);
				}
				$("#btimestep-"+i).css("height","11px");
			} else {
				appendDataIn = '<div class="tshowtimemarker">'+onlyHour+'</div>';
				$("#btimestep-"+i).append(appendDataIn);
			}
		}
		totalLeft+=singleHourPixels;
	}
}
function openTooltip(x,y){
	var x_;
	var y_;
	if(x==undefined || y==undefined) {
		x_=0;
		y_=0;
	} else {
		x_=x;
		y_=y;
	}
	$("#canvas_tooltip").tooltipster({
		content: 'My first tooltip',
		position: 'right',
		offsetX:x_,
		offsetY:-y_
	});
	$('#canvas_tooltip').tooltipster('show');
}

function updateBookingTimeVisible() {
	var StringFrom = TimeRangeValues[place_slider_from];
	var StringTo = TimeRangeValues[place_slider_to];
	var DateFromOpt = "";
	var DateToOpt = "";
	var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime();
	var newSec = parseInt(TimeOfTheDatePicker_1970)+24*3600*1000;
	var d=new Date(newSec);
	var DayTomorrow = d.getDate();
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var MonTomorrow = monthNames[d.getMonth()];

	var curd = new Date(TimeOfTheDatePicker_1970);
	var DayNow = curd.getDate();
	var MonNow = monthNames[curd.getMonth()];

	if(StringFrom.indexOf("*") > -1) {
		StringFrom = StringFrom.replace("*","");
		DateFromOpt=DayTomorrow+" "+MonTomorrow;
		$("#opt_from_date_norm").removeClass("normdate");
		$("#opt_from_date_norm").addClass("reddate");
	} else {
		DateFromOpt = DayNow + " " +MonNow;
		$("#opt_from_date_norm").removeClass("reddate");
		$("#opt_from_date_norm").addClass("normdate");
	}
	if(StringTo.indexOf("*") > -1) {
		StringTo = StringTo.replace("*","");
		DateToOpt = DayTomorrow+" "+MonTomorrow;
		$("#opt_to_date_norm").removeClass("normdate");
		$("#opt_to_date_norm").addClass("reddate");
	} else {
		DateToOpt = DayNow + " " +MonNow;
		$("#opt_to_date_norm").removeClass("reddate");
		$("#opt_to_date_norm").addClass("normdate");
	}
	$("#main_from_").html(StringFrom);
	$("#main_to_").html(StringTo);
	$("#opt_from_date_norm").html(DateFromOpt);
	$("#opt_to_date_norm").html(DateToOpt);
}
function checkLeftRightArrows(){
	var curleft = $("#selected_append").position().left;
	var outerw = document.getElementById("selected_outer").offsetWidth;
	var innerw = document.getElementById("selected_append").offsetWidth;
	if(innerw + curleft + 10 > outerw) {
		$("#left_triangle_btn").show();
	} else {
		$("#left_triangle_btn").hide();
	}
	if(curleft>=0) {
		$("#right_triangle_btn").hide();
	}  else {
		$("#right_triangle_btn").show();
	}
}

function updatePersonsSpinner() {
	var min = 0;
	var max = 0;
	var count = 0;

	for(var f=0;f < floorCanvases.length;f++) {
		for(var s= 0 ; s < floorCanvases[f].listSelected.length;s++) {
			min+=floorCanvases[f].listSelected[s].booking_options.minPersons;
			max+=floorCanvases[f].listSelected[s].booking_options.maxPersons;
			count+=1;
		}
	}

	$("#selected_num").html(count);
}
//Function for dynamically check booking availability in terms of "place_closed" OR "time_passed"
function checkBookingAvailableClosedPassed () {
	var sliderSeconds = 15*60*parseInt(place_slider_from); // 15 minutes * slider steps
	var sliderSecondsTo = 15*60*parseInt(place_slider_to); // 15 minutes * slider steps

	var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime();
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
	var TimePeriod = sliderSecondsTo - sliderSeconds; // Chosen period of booking
	var endOfBooking = parseInt(sliderSeconds) + parseInt(TimePeriod);
	var placeOpen = bookingVars.placeOpen;
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
var testData = {};




function removeSelectedImage(shape) {
	var sid = shape.sid;
	var elementID = 'fe_selected-'+sid;
	var element = document.getElementById(elementID);
	element.outerHTML = "";
	delete element;
	checkLeftRightArrows();
}
function remove_selected_by_SID(sid) {
	for(var f=0;f < floorCanvases.length;f++) {
		for(var s= 0 ; s < floorCanvases[f].listSelected.length;s++) {
			if(floorCanvases[f].listSelected[s].sid == sid) {
				var mySel = floorCanvases[f].listSelected[s];
				floorCanvases[f].listSelected.remove(mySel);
				tcanvas_.removeTshapeList(mySel.sid);
				if(floorCanvases[f].listSelected.length == 0) {
					floorCanvases[f].selection = null;
				} else {
					floorCanvases[f].selection = floorCanvases[f].listSelected[0];
				}
				removeSelectedImage(mySel);
				floorCanvases[f].shapeHover=null;
				floorCanvases[f].valid=false;
				updatePersonsSpinner();
			}
		}
	}
}
function appendSelectedImage(shape) {
	var sid = shape.sid;
	var appendData = "";
	appendData+='<table class="fe_selected" id="fe_selected-'+sid+'" cellspacing="0" cellpadding="0" ; border-collapse: collapse"><tr><td>';
	appendData+='    <div class="selected_wrap_div">';
	appendData+='    <div class="close_selected_" title="Remove from selection" style="display:none" onclick="remove_selected_by_SID(\''+sid+'\')" id="for_close-'+sid+'"><div class="material-icons clear_g_icon">clear</div></div> ';

	if(shape.type=="image") {
		var src=document.getElementById(shape.options.imgID).src;
		appendData+='     <img class="fe_selected_img" src="'+src+'"/>';
	} else {
		appendData+='    <canvas  width="50" height="50" class="fe_selected_canvas" id="feb_canvas-'+sid+'"></canvas>';
	}
	appendData+='   </div>';
	appendData+='</td></tr></table>';
	$("#selected_append").append(appendData);
	if(shape.type!="image") {
		drawShapeCanvasOnBooking('feb_canvas-'+shape.sid , shape);
	}
	checkLeftRightArrows();
	$( "#fe_selected-"+sid).hover(
			function() {
				$("#for_close-"+sid).show();
				for(var f = 0 ; f < floorCanvases.length; f++) {
					for(var s=0 ; s<floorCanvases[f].shapes.length;s++) {
						if(floorCanvases[f].shapes[s].sid==sid) {
							floorCanvases[f].shapeHover = floorCanvases[f].shapes[s];
							floorCanvases[f].valid=false;
							break;
						}
					}
				}
			}, function() {
				$("#for_close-"+sid).hide();
				for(var f = 0 ; f < floorCanvases.length; f++) {
					for(var s=0 ; s<floorCanvases[f].shapes.length;s++) {
						if(floorCanvases[f].shapes[s].sid==sid) {
							floorCanvases[f].shapeHover = null;
							floorCanvases[f].valid=false;
							break;
						}
					}
				}
			}
	);
}
var GlobalHover = null;
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
		console.log(width+" " +height + " " + sw + " " + rel);
		dbTrapez (ctx,x,y, parseInt(rel*width), parseInt(rel*height),lineColor,fillColor,alpha,salpha,sw,shape.options.cutX);

	} else if (shape.type == "rectangle") {

		dbDrawRect(ctx,x,y, parseInt(rel*width), parseInt(rel*height),lineColor,fillColor,alpha,salpha,sw);

	}
}
function setDays(days) {
	if(days==1 || days==2) {
		days_ = days;
		startShowTime = $("#datepicker_ub").datepicker( "getDate" ).getTime();
		endShowTime = $("#datepicker_ub").datepicker( "getDate" ).getTime()+days_*24*3600*1000;
		updateTimeRangeValues();
		var slider = $("#booking_time_slider_for_canvas_fe").data("ionRangeSlider");
		slider.destroy();
		updateBookingSlider();
		initialTCanvas();
		if(days==1) {
			$("#two_days").removeClass("days_count_selected");
			$("#single_days").addClass("days_count_selected");
		} else {
			$("#single_days").removeClass("days_count_selected");
			$("#two_days").addClass("days_count_selected");
		}
	}
}
function initialTCanvas() {
	var minRange = 15;
	//bookingVars = testData;
	var days = days_;

	bookingVars = shapesPrebookedJSON;

	console.log("initialTCanvas() CALLED");
	console.log(bookingVars);
	tcanvas_.empty();
	// tcanvas_.width = document.getElementById("tcanvas_div").offsetWidth;
	var canvasStep=tcanvas_.width/(days*(24*60/minRange)+0.5);
	tcanvas_.step = canvasStep; // minRange minutes in canvas pixels
	var pid = bookingVars.pid;
	var requestFromDate = bookingVars.date1970;
	var clientOffset = bookingVars.clientOffset;
	var placeOffset = bookingVars.placeOffset;
	var requestPeriod = bookingVars.period;
	var placeOpen = bookingVars.placeOpen;
	var shapesList = bookingVars.shapesBooked;

	var fromc = 0;
	var toc = 0;

	for (var ind in placeOpen) {
		var from = placeOpen[ind].from;
		var to  = placeOpen[ind].to;
		if(from != to) {
			var fromSteps = from/minRange/60;
			var toSteps = to/minRange/60;
			var rangeSteps = toSteps - fromSteps;
			fromc = fromSteps * canvasStep;// + days * tcanvas_.width/daysCount;
			toc = rangeSteps * canvasStep;
			tcanvas_.addShape( new TShape(tcanvas_,"", fromc , toc ,tcanvas_.height, 'opened' , 1 ));
		}
	}
	var current_idx = currentSliderValue;
	var from_drag = parseInt(current_idx * canvasStep);
// tcanvas_.addShape( new TShape(tcanvas_, "", from_drag , 1 ,tcanvas_.height, 'drag' , 1 ));

	var TimeOfTheDatePicker_1970 = +$("#datepicker_ub").datepicker( "getDate" ).getTime();
	var  dndt = TimeOfTheDatePicker_1970/1000;

	var d = new Date();
	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = new Date(utc + (3600000 * placeOffset));
	var ndt = nd.getTime()/1000;

	var twonextdays = new Date(TimeOfTheDatePicker_1970 + days * 24 * 3600 * 1000);
	var twonextdayst = twonextdays.getTime()/1000;
	console.log("dndt="+dndt+",ndt="+ndt+",twodays="+twonextdayst);
	if (dndt < ndt && ndt < twonextdayst) {
		var diff = ndt - dndt;
		var steps = diff / minRange/60;
		tcanvas_.addShape( new TShape(tcanvas_,"", 0 , steps*canvasStep ,tcanvas_.height, 'passed' , 1 ));
	} else if (ndt >= twonextdayst) {
		tcanvas_.addShape( new TShape(tcanvas_,"", 0 , tcanvas_.width ,tcanvas_.height, 'passed' , 1 ));
	}

	for(var f = 0 ; f < floorCanvases.length; f++) {
		for(var l = 0;l < floorCanvases[f].listSelected.length;l++) {
			tcanvas_.addTshapeList(floorCanvases[f].listSelected[l].sid);
		}
	}
	tcanvas_.valid = false;

}


function calcTime(date,offset) {
	d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	nd = new Date(utc + (3600000 * offset));
	return  moment(nd).format("DDMMM HH:mm");
}

