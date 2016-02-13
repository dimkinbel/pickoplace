var floorPopoverOpened = false;
var floorPopoverOpening = false;
var leftMouseDown = 0;  
var rightMouseDown = 0; 
var minPeriodSeconds = 30*60;// Set by configuration
$(document).ready(function() {
   $('[data-toggle="tooltip"]').tooltip()
   $('#canvas_popover').on('shown.bs.popover', function () {
			floorPopoverOpened = true;
			floorPopoverOpening = false;
			
	}); 
placeUTCOffsetGlobal = document.getElementById("server_placeUTC").value;
var d = new Date();
var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
var nd = new Date(utc + (3600000 * parseInt(placeUTCOffsetGlobal)));
 
if (d.getDate() != nd.getDate()) {
	if(d.getTime() > nd.getTime()) {
		// Client timezone is one day higher
		DatepickerSetDate = "-1";
	} else {
		DatepickerSetDate = "+1";
	}
}
 $(".dropdown_floors li a").click(function(){
   $("#dd_floor_name").text($(this).text()); 
 });
 $("#dropdown_start_floors").on('click', 'li a', function(){
   $("#book_top_start").text($(this).text()); 
   $("#book_start_val_").val($(this).attr("data-period"));
   updateCloseShapes();
 });
 $("#dropdown_period_floors").on('click', 'li a', function(){
   $("#book_top_period").text($(this).text()); 
   $("#book_period_val_").val($(this).attr("data-period"));
   updateCloseShapes();
 });
  $("#dropdown_persons_floors").on('click', 'li a', function(){
   $("#book_top_persons").text($(this).text()); 
   $("#book_persons_val_").val($(this).attr("data-period"));
   updateCloseShapes();
 });
 
$("#datepicker_ub").datepicker({
    currentText: "Now",
	defaultDate: DatepickerSetDate,
	autoClose:true,
	minDate: "0d",
	showOptions: { direction: "up" },
	dateFormat: "dd M yyyy",
    onSelect: function(dateText, inst) {
         $( "#datepicker_single_main" ).datepicker("setDate", dateText);
		 console.log(dateText);
    	 //requestBookingAvailability();
         updateShowDateDatepickerFe();
		 updateSelectOptions("dropdown_start_floors","dropdown",'datepicker_ub',minPeriodSeconds);
		 updateCloseShapes();
    },
    onClose: function(dateText, inst) {
    	}
});
$( "#datepicker_ub" ).datepicker("setDate", DatepickerSetDate);
updateShowDateDatepickerFe();			
 
startShowTime = $("#datepicker_ub").datepicker( "getDate" ).getTime();
endShowTime = $("#datepicker_ub").datepicker( "getDate" ).getTime()+days_*24*3600*1000;

updateBookingSlider();

    $("#datepicker_single_main").datepicker({
				currentText: "Now",
				defaultDate: DatepickerSetDate,
				autoClose:true,
				minDate: "0d",
				showOptions: { direction: "up" },
				dateFormat: "dd M yyyy",
				onSelect: function(dateText, inst) {
                      $( "#datepicker_ub" ).datepicker("setDate", dateText);	
                      updateShowDateDatepickerFe();					  
				},
				onClose: function(dateText, inst) {
					}
			});
	$( "#datepicker_single_main" ).datepicker("setDate", DatepickerSetDate);
 
	    $('#canvas_popover').on('show.bs.popover', function () {
			floorPopoverOpening = true;

		})
		$('#canvas_popover').on('shown.bs.popover', function () {
			floorPopoverOpened = true;
			floorPopoverOpening = false;
			$('[data-toggle="tooltip"]').tooltip();
			$('#canvas_popover_hidden').children().html('');// remove same block copied to the popover
			var CalendarStartDay = $("#datepicker_ub").datepicker( "getDate" );
			var CalendarStartSeconds = CalendarStartDay.getTime()/1000;
			var StartPeriod = parseInt($("#book_start_val_").val());
			var Period = parseInt($("#book_period_val_").val());
			var Persons  = parseInt($("#book_persons_val_").val());
			
 
			var day = CalendarStartDay.getDate();
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var mon = monthNames[CalendarStartDay.getMonth()];
			$("#pop_date").html(CalendarStartDay.getDate()+" "+mon+" , "); 
			var fromDate = getBookDate(CalendarStartSeconds,StartPeriod,document.getElementById("server_placeUTC").value); 
		    var toDate = getBookDate(CalendarStartSeconds,parseInt(StartPeriod+Period),document.getElementById("server_placeUTC").value);
			$("#pop_range").html(getLeadingZero(fromDate.getHours())+':'+getLeadingZero(fromDate.getMinutes())+' - '+getLeadingZero(toDate.getHours())+':'+getLeadingZero(toDate.getMinutes()));
			
            // Update booking data on popover
            var sid = currentSelection.sid;
            updateShapeTimeline("tp_canvas_"+sid,canvas_.selection,CalendarStartSeconds + StartPeriod - 2*3600, CalendarStartSeconds + StartPeriod + 4*3600);
			currentSingleTimeCanvas.zoomReset(CalendarStartSeconds + StartPeriod - 2*3600,
					                          CalendarStartSeconds + StartPeriod + 4*3600);
			timelines[currentSingleTimeCanvas.canvas.id] =  new TimelineDiv(currentSingleTimeCanvas,"canvas_popup_timing_"+sid,0); 
			timelines[currentSingleTimeCanvas.canvas.id].redraw();
			currentSingleTimeCanvas.setAdminSelectionMiddle(CalendarStartSeconds + StartPeriod , CalendarStartSeconds + StartPeriod + Period);
			currentSingleTimeCanvas.organizeShapes(); 
			
		})
		$('#canvas_popover').on('hidden.bs.popover', function () {
			floorPopoverOpened = false;
			floorPopoverOpening = false;
			for(var f = 0 ; f < floorCanvases.length ; f++) {
			  var myState = floorCanvases[f]; 
			   myState.selection = null; 
	          myState.listSelected = [];
			  myState.valid = false;
			}

		})
        $('#booking_order_modal').on('shown.bs.modal', function (e) {
			$('[data-toggle="tooltip"]').tooltip();
		})
		$(document).on('mousedown','.scroll_left_tp_canvas', function(e){
		   var id = $(this).attr("id");
		   currentSingleTimeCanvas.zoomLeft(15*60);
		   currentSingleTimeCanvas.valid = false;
		   timelines[currentSingleTimeCanvas.canvas.id].redraw();
		   leftMouseDown =  (new Date()).getTime()/1000;
		});
		$(document).on('mouseup','.scroll_left_tp_canvas', function(e){
		   leftMouseDown = 0;
		});
		$(document).on('mousedown','.scroll_right_tp_canvas', function(e){
		   var id = $(this).attr("id");
		   currentSingleTimeCanvas.zoomRight(15*60);
		   currentSingleTimeCanvas.valid = false;
		   timelines[currentSingleTimeCanvas.canvas.id].redraw();
		   rightMouseDown =  (new Date()).getTime()/1000;
		});
		$(document).on('mouseup','.scroll_right_tp_canvas', function(e){
		   rightMouseDown = 0;
		});
		 
		$(document).on('click', 'body', function(e){
			if(floorPopoverOpened && !floorPopoverOpening) {
				$('.floor_popover_template').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.floor_popover_template').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			}
		});
		$("#booking_top_button").click(function(){
		  if(bookingOrder!=null) {
             UpdateModal();		  // bookViewService
		     
		  }
		});
		$(document).on('click', '#expand_tl_more', function(e){
		     $("#tcanvas_pop_row").css("height","100px");
			 $("#expand_tl_more").hide();
			 $("#expand_tl_less").show();
		});
		$(document).on('click', '#expand_tl_less', function(e){
		     $("#tcanvas_pop_row").css("height","0px");
			 $("#expand_tl_less").hide();
			 $("#expand_tl_more").show();
		});
});
var test ;
setInterval(function() { detectLongClick(); },100);
function detectLongClick() {
   if(leftMouseDown > 0) {
      var currentSec =  (new Date()).getTime()/1000;
	  if(currentSec - 0.5 > leftMouseDown) {
	       currentSingleTimeCanvas.zoomLeft(15*60);
		   currentSingleTimeCanvas.valid = false;
		   timelines[currentSingleTimeCanvas.canvas.id].redraw();
	  }
   }
   if(rightMouseDown > 0) {
      var currentSec =  (new Date()).getTime()/1000;
	  if(currentSec - 0.5 > rightMouseDown) {
	       currentSingleTimeCanvas.zoomRight(15*60);
		   currentSingleTimeCanvas.valid = false;
		   timelines[currentSingleTimeCanvas.canvas.id].redraw();
	  }
   }
}
function updateCloseShapes() {
  var DateSeconds = parseInt($("#datepicker_ub").datepicker( "getDate" ).getTime()/1000);
  var StartSeconds = parseInt($("#book_start_val_").val());
  var PeriodSeconds = parseInt($("#book_period_val_").val());
  if(StartSeconds == -1 ) {
    console.log("StartSeconds = -1");
    for (var f = 0 ;f < floorCanvases.length ; f++) {
	   for(var s=0; s <floorCanvases[f].shapes.length ;s++) {
	      floorCanvases[f].shapes[s].isAvailable = false;
	   }
	   floorCanvases[f].valid = false;
	}
	
	return;
  }
  for (var f = 0 ;f < floorCanvases.length ; f++) {
     var openObject = bookingsManager.getAvailableSids(floorCanvases[f],DateSeconds + StartSeconds,DateSeconds + StartSeconds + PeriodSeconds ,minPeriodSeconds);
	 console.log("openObject");
	 console.log(openObject.open)
	 if(openObject.open == true && openObject.passed == false) {
	   for(var s=0; s <floorCanvases[f].shapes.length ;s++) {
	     floorCanvases[f].shapes[s].isAvailable = true;
	     if(openObject.sidList[floorCanvases[f].shapes[s].sid] == undefined) {
		   floorCanvases[f].shapes[s].isAvailable = false;
		 }
	   }
	 
	 } else {
	    for(var s=0; s <floorCanvases[f].shapes.length ;s++) {
	     floorCanvases[f].shapes[s].isAvailable = false;
	   }
	 }
	 floorCanvases[f].valid = false;
  }  
}
function getLeadingZero(val) {
  if(parseInt(val) < 10) {
     var s = "0"+val;
	 return s;
  } else {
     return val;
  }
}
function getBookDate(dateUTC,time,placeOffset) {
      d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var offsetSec = placeOffset * 3600 + clientOffset * 60;
	  var totalSec = (dateUTC + time + offsetSec)*1000;
	  var Date_f = new Date(parseInt(totalSec));
	  return Date_f;
}
function calculateShowDate(from,placeOffset,to) {
      d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var time = from;//UTC
	  var offsetSec = placeOffset * 3600 + clientOffset * 60;
	  var totalSec = (time + offsetSec)*1000;
	  var Date_f = new Date(parseInt(totalSec));
	  totalSec = (to + offsetSec)*1000;
      var Date_t = new Date(parseInt(totalSec));
 
	  var hour_f = Date_f.getHours(); if(hour_f < 10) {hour_f = "0"+hour_f;}
	  var min_f = Date_f.getMinutes();if(min_f < 10) {min_f = "0"+min_f;}
	  var hour_t = Date_t.getHours(); if(hour_t < 10) {hour_t = "0"+hour_t;}
	  var min_t = Date_t.getMinutes();if(min_t < 10) {min_t = "0"+min_t;}
	  var string =  hour_f+":"+min_f+" - "+hour_t+":"+min_t;	  
      return string;
}
function getBookDateFrom(from_,placeOffset) {
      d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var offsetSec = placeOffset * 3600 + clientOffset * 60;
	  var totalSec = (from_ + offsetSec)*1000;
	  var Date_f = new Date(parseInt(totalSec));
	  return Date_f;
}
function getBookDate(dateUTC,time,placeOffset) {
      d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var offsetSec = placeOffset * 3600 + clientOffset * 60;
	  var totalSec = (dateUTC + time + offsetSec)*1000;
	  var Date_f = new Date(parseInt(totalSec));
	  return Date_f;
}
function showFloorPopover(x,y,sel) {
      // update BID information
	  updateBookingSidPopover('canvas_popover_hidden',sel);//
      $("#canvas_popover").css({'position':'absolute','top':y,'left':x+10}).popover({
            trigger: 'click',
            placement:'right',
			container: 'body',
			template:'<div class="popover floor_popover_template"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');	   		
}