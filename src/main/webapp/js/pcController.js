var floorPopoverOpened = false;
var floorPopoverOpening = false;
var CanvasPopoverOpened = false;
var CanvasPopoverOpening = false;

var calendarOpenDaysList = [];
var calendarOpenDaysObject = {};
var tempNames = {};
var current_username_value;
var current_password_value;

var currentIframeSettings = {};
currentIframeSettings.booking = true;
currentIframeSettings.width = 400;
currentIframeSettings.height = 400;
currentIframeSettings.theme = "white";

var AllIframes = [];
function CalWeek(){ 
  this.obj = {};
  this.obj[0]=true;
  this.obj[1]=true;
  this.obj[2]=true;
  this.obj[3]=true;
  this.obj[4]=true;
  this.obj[5]=true;
  this.obj[6]=true;
  this.week = [0,1,2,3,4,5,6];
}
var calWeek = new CalWeek();
CalWeek.prototype.setDay = function(day,open) {
   this.obj[day]=open;
   this.updateWeek();
}
CalWeek.prototype.updateWeek = function() {
 var weekArray = [];
 if(this.obj[0]==true) {
    weekArray.push(0);
 }
 if(this.obj[1]==true) {
    weekArray.push(1);
 }
 if(this.obj[2]==true) {
    weekArray.push(2);
 }
 if(this.obj[3]==true) {
    weekArray.push(3);
 }
 if(this.obj[4]==true) {
    weekArray.push(4);
 }
 if(this.obj[5]==true) {
    weekArray.push(5);
 }
 if(this.obj[6]==true) {
    weekArray.push(6);
 }
 this.week = weekArray;
 calendarWeekList = this.week;
}
function addCalendarEvent(start,end,ismoment) {
    var newEvents = [];
    var eventData; 
	var tempEvents = [];
	if(ismoment == true) {
		var utcDaySeconds = start.utc()/1000;
		var utcEndSeconds = end.utc()/1000;
		var offset = parseFloat(document.getElementById("server_placeUTC").value)*3600;
		var dayStartOnPlace_seenAtUTC = utcDaySeconds - offset;
		for (var i = utcDaySeconds; i < utcEndSeconds ; i+=24*3600) {
		   var start_moment = moment(i*1000);
		   var end_moment = moment((i+24*3600)*1000);
		   var eventID = "eid_"+i;
		   var title = 'סגור';
		   eventData = {
			id: eventID,
			title: 'סגור',
			start: start_moment,
			end: end_moment
		   };
		   tempEvents.push(eventData);
		}
		
		
	} else {
	   var momentStart = moment(start*1000); 
	   var momentEnd = moment((start+24*3600)*1000); 
	   var utcDaySeconds = start;
	   var eventID = "eid_"+utcDaySeconds;
	   eventData = {
			id: eventID,
			title: 'סגור',
			start: momentStart,
			end: momentEnd
		};
		tempEvents.push(eventData);
	}
	var exists = false;
	for (var newEind = 0 ; newEind<=tempEvents.length ; newEind++) {
		for(var e=0;e < eventList.length ; e++) {
		  if(eventList[e].id == eventData.id) {
			 exists = true;
		  }
		}
		if(!exists) {
		   eventList.push(tempEvents[newEind]);
		   newEvents.push(tempEvents[newEind]);
		   drawEventOnList(tempEvents[newEind]);
		   $('#fullcalendar').fullCalendar('renderEvent', tempEvents[newEind], true); 
		}
	}
	if(newEvents.length >0) { 	
	    //<div class="close_day_list_line" >25 January 2016<div class="material-icons close_day_l_mat" >close</div></div>
		
	   // $('#fullcalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
		
	}
	return newEvents;
}
var eventList = [];
//$('#fullcalendar').fullCalendar( 'addEventSource',[{title:'eqwe',start:moment(1456358400*1000).toISOString().replace(/T.*/,"")}])
function resetCalendar() {
    $('#fullcalendar').fullCalendar('destroy');
	$('#fullcalendar').fullCalendar({
        header: {
				left: 'prev,today,next',
				center: 'title',
				right:''
			}, 
			selectable: true,
			selectHelper: true,
			businessHours : {
				start: '8:00', // a start time (10am in this example)
				end: '20:00', // an end time (6pm in this example)
				dow: calWeek.week
				// days of week. an array of zero-based day of week integers (0=Sunday)
				// (Monday-Thursday in this example)
			},
			 eventClick: function(calEvent, jsEvent, view) {

				console.log('Event: ' + calEvent.title);
				console.log('Event: ' + calEvent.id);
				console.log('Start: ' + calEvent.start.utc());
				console.log('End: ' + calEvent.end.utc());
				console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
				console.log('View: ' + view.name);
                showCalendarPopover(jsEvent.pageX,jsEvent.pageY,calEvent)
				// change the border color just for fun
				//$(this).css('border-color', 'red');

			},
			dayNamesShort:['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
			select: function(start, end) {				
				addCalendarEvent(start,end,true);
				$('#fullcalendar').fullCalendar('unselect');
			}, 
			eventColor: '#FF7A70',
			editable: true,
			eventLimit: true,
			height: 450,
		    width:500
    });
	for(var e=0;e < eventList.length ; e++) {
	   $('#fullcalendar').fullCalendar('renderEvent', eventList[e], true); 
	} 
	$('#fullcalendar').fullCalendar('render');
}
var mobileInput1;
$(document).ready(function() {
	$.getScript("js/intl-tel-input-master/build/js/intlTelInput.min.js", function (data, status, jqxhr) {
		mobileInput1 = $("#contact_man_phone-1");
			   mobileInput1.intlTelInput({
			   nationalMode: true ,
			   defaultCountry:"il",
			   preferredCountries:["il"],
			   onlyCountries:["il","us","de","ru","ua"],
			   utilsScript: "js/intl-tel-input-master/lib/libphonenumber/build/utils.js"
			  });
	});

   $('[data-toggle="tooltip"]').tooltip();
   $('#calendar_popover').on('show.bs.popover', function () {
			floorPopoverOpening = true;

		})
   $('#calendar_popover').on('shown.bs.popover', function () {
			floorPopoverOpened = true;
			floorPopoverOpening = false;
			$('#calendar_popover_hidden').children().html('');// remove same block copied to the popover
			
	}); 
   $('#calendar_popover').on('hidden.bs.popover', function () {
			floorPopoverOpened = false;
			floorPopoverOpening = false;
	})
	$(document).on('click', '.cancel_popover_pc', function(e){
	 
	   $("#calendar_popover").popover('hide');
	});
	// IFRAME

	$('#iframe_bookable').change(function () { 
			if ($(this).is(':checked')) {
			   // Daily
			   $("#pc_iframe_top").show(); 
			   currentIframeSettings.booking = true;
			   updateCloseShapes();
			} else {
			   // Hourly
			   $("#pc_iframe_top").hide(); 
			   currentIframeSettings.booking = false;
			   updateCloseShapes();
			}
	});
	
	 $("#iframe_width_slider").slider({
	    min:400,
	    max:1200,
	   step:1,
	   stop: function( event, ui ) { 
	      $("#pc_iframe_wrap").width(ui.value);
	      $("#pc_iframe_floors_wrap").width(ui.value);
		  $("#pc_iframe_floors_wrap").height(Math.round(ui.value / width2height));
		  $("#iframe_width").val(ui.value+"x"+Math.round(ui.value / width2height));
		  
		  
		  iFfloorAppend("pc_iframe_floors_wrap",false);
	   },
	   slide: function( event, ui ) { 
	      $("#pc_iframe_wrap").width(ui.value);
	      $("#pc_iframe_floors_wrap").width(ui.value);
		  $("#pc_iframe_floors_wrap").height(Math.round(ui.value / width2height));
		  $("#iframe_width").val(ui.value+"x"+Math.round(ui.value / width2height));
		  currentIframeSettings.width = ui.value;
		  currentIframeSettings.height = Math.round(ui.value / width2height);
	      
	   }
    });
	$("#if_width_minus").mousedown(function(){
	      var width = $("#iframe_width_slider").slider("value");
		   if(width > 400 && width < 1200) {
		       width -=1;
			  $("#pc_iframe_wrap").width(width);
			  $("#pc_iframe_floors_wrap").width(width);
			  $("#pc_iframe_floors_wrap").height(Math.round(width / width2height));
			  $("#iframe_width").val(width+"x"+Math.round(width / width2height));
              $('#iframe_width_slider').slider('value', width);	
			  currentIframeSettings.width = width;
		      currentIframeSettings.height = Math.round(width / width2height);
              iFfloorAppend("pc_iframe_floors_wrap",false);			  
		  } 
	   });
	   $("#if_width_plus").mousedown(function(){
	      var width = $("#iframe_width_slider").slider("value");
		   if(width > 400 && width < 1200) {
		       width +=1;
			  $("#pc_iframe_wrap").width(width);
			  $("#pc_iframe_floors_wrap").width(width);
			  $("#pc_iframe_floors_wrap").height(Math.round(width / width2height));
			  $("#iframe_width").val(width+"x"+Math.round(width / width2height));
              $('#iframe_width_slider').slider('value', width);	
			  currentIframeSettings.width = width;
		      currentIframeSettings.height = Math.round(width / width2height);
              iFfloorAppend("pc_iframe_floors_wrap",false);			  
		  } 
	   });
   $(document).on('click', 'body', function(e){
			if(floorPopoverOpened && !floorPopoverOpening) {
				$('.calendar_popover_template').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.calendar_popover_template').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			}
		});

   $('#list_popover').on('show.bs.popover', function () {
			CanvasPopoverOpening = true;

		})
   $('#list_popover').on('shown.bs.popover', function () {
			CanvasPopoverOpened = true;
			CanvasPopoverOpening = false;
			$('[data-toggle="tooltip"]').tooltip();
			$('#canvas_popover_hidden').children().html('');// remove same block copied to the popover
			var all=document.getElementsByName("popover_overview_tmb");
			for(var x=0; x < all.length; x++) {
			    		
				updatePopoverSpots(all[x].id,'place_point_popover','popover');
			}
			
	}); 
   $('#list_popover').on('hidden.bs.popover', function () {
			CanvasPopoverOpened = false;
			CanvasPopoverOpening = false;
	})
	$(document).on('click', '.cancel_popover_pc', function(e){
	 
	   $("#list_popover").popover('hide');
	});
	
   $(document).on('click', 'body', function(e){
			if(CanvasPopoverOpened && !CanvasPopoverOpening) {
				$('.canvas_popover_template_list').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.canvas_popover_template_list').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			}
		});
		

   $(".pc_vertical_nav").click(function(){
      /*for (var f = 0 ;f < if_floorCanvases.length ; f++) {  
	     clearInterval(if_floorCanvases[f].intervalID);
	  };
	  for (var f = 0 ;f <  floorCanvases.length ; f++) {  
	     clearInterval( floorCanvases[f].intervalID);
	  };*/
      $("#iframe_nav_explain").css("opacity",0);
      $(".pc_vertical_nav").removeClass("pc_vertical_nav_selected");
	  $(this).addClass("pc_vertical_nav_selected");
	  var id_ = $(this).attr("id");
	  var data_id = id_.replace(/pcnav_/,"pcdata_");
	  $(".pc_data_page").hide();
	  $("#"+data_id).show();
	  if(data_id == "pcdata_seat") {
			updateFloorWrapDimentionsPC();
			ApplyFinalPosition();
			/*for (var f = 0 ;f <  floorCanvases.length ; f++) { 
			   floorCanvases[f].resetInterval();
			   console.log(floorCanvases[f].intervalID);
			}*/
	  }
	  if(data_id == "pcdata_iframe") {
			ApplyFloorsToIframe();
			InitialIframeSettings();
			$("#iframe_nav_explain").css("opacity",1);
			updateIframeListTable(); 
			/*for (var f = 0 ;f < if_floorCanvases.length ; f++) {  
				  if_floorCanvases[f].resetInterval();
			};*/
	  }
   });
   // Table list
   $(document).on('click', '.persons_mat_remove_min', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pc_min_minus_persons-/,"");
	  var min_value_id = "pc_min_persons_val-"+SID;
	  var max_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  if(min_value > 1) {
	     min_value-=1;
		 $("#"+min_value_id).val(min_value);
	  }
	  sid2shape[SID].booking_options.minPersons = min_value;
   });
   $(document).on('click', '.persons_mat_add_min', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pc_min_plus_persons-/,"");
	  var min_value_id = "pc_min_persons_val-"+SID;
	  var max_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  min_value+=1;
	  if(min_value > max_value) {
	     max_value = min_value;
	  }
	  $("#"+min_value_id).val(min_value);
	  $("#"+max_value_id).val(max_value);
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
    $(document).on('click', '.persons_mat_remove_max', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pc_max_minus_persons-/,"");
	  var min_value_id = "pc_min_persons_val-"+SID;
	  var max_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  if(max_value > 1) {
		  max_value-=1;
		  if(min_value > max_value) {
			 min_value = max_value;
		  }
	  }
	  $("#"+min_value_id).val(min_value);
	  $("#"+max_value_id).val(max_value);
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
   $(document).on('click', '.persons_mat_add_max', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pc_max_plus_persons-/,"");
	  var min_value_id = "pc_min_persons_val-"+SID;
	  var max_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  
	  max_value+=1;
      $("#"+max_value_id).val(max_value);
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
   // Table popover
    $(document).on('click', '.pop_persons_mat_remove_min', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pop_min_minus_persons-/,"");
	  var min_value_id = "pop_min_persons_val-"+SID;
	  var max_value_id = "pop_max_persons_val-"+SID;
	  var min_table_value_id = "pc_min_persons_val-"+SID;
	  var max_table_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  if(min_value > 1) {
	     min_value-=1;
		 $("#"+min_value_id).val(min_value);
		 $("#"+min_table_value_id).val(min_value);
	  }
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
   $(document).on('click', '.pop_persons_mat_add_min', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pop_min_plus_persons-/,"");
	  var min_value_id = "pop_min_persons_val-"+SID;
	  var max_value_id = "pop_max_persons_val-"+SID;
	  var min_table_value_id = "pc_min_persons_val-"+SID;
	  var max_table_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  min_value+=1;
	  if(min_value > max_value) {
	     max_value = min_value;
	  }
	  $("#"+min_value_id).val(min_value);
	  $("#"+max_value_id).val(max_value);
	  $("#"+min_table_value_id).val(min_value);
	  $("#"+max_table_value_id).val(max_value);
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
    $(document).on('click', '.pop_persons_mat_remove_max', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pop_max_minus_persons-/,"");
	  var min_value_id = "pop_min_persons_val-"+SID;
	  var max_value_id = "pop_max_persons_val-"+SID;
	  var min_table_value_id = "pc_min_persons_val-"+SID;
	  var max_table_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  if(max_value > 1) {
		  max_value-=1;
		  if(min_value > max_value) {
			 min_value = max_value;
		  }
	  }
	  $("#"+min_value_id).val(min_value);
	  $("#"+max_value_id).val(max_value);
	  $("#"+min_table_value_id).val(min_value);
	  $("#"+max_table_value_id).val(max_value);
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
   $(document).on('click', '.pop_persons_mat_add_max', function(e){
      var id_ = $(this).attr("id");
	  var SID = id_.replace(/pop_max_plus_persons-/,"");
	  var min_value_id = "pop_min_persons_val-"+SID;
	  var max_value_id = "pop_max_persons_val-"+SID;
	  var min_table_value_id = "pc_min_persons_val-"+SID;
	  var max_table_value_id = "pc_max_persons_val-"+SID;
	  var min_value = parseInt($("#"+min_value_id).val());
	  var max_value = parseInt($("#"+max_value_id).val());
	  
	  max_value+=1;
      $("#"+max_value_id).val(max_value);
	  $("#"+max_table_value_id).val(max_value);
	  sid2shape[SID].booking_options.minPersons = min_value;
	  sid2shape[SID].booking_options.maxPersons = max_value;
   });
	$(document).on('focusin', '#admin_email-1', function(e){
		$("#admin_email-1").removeClass("admin_email_warn");
	});
   $(document).on('focusin', '.pc_text_val_sid', function(e){
       var sid = $(this).attr("id").replace(/sc_booking_shape_name_/,"");
	   $(this).removeClass("pc_text_val_sid_red_border");
	   tempNames[sid] = $(this).val();
	   
   });
   $(document).on('focusout', '.pc_text_val_sid', function(e){
       var sid = $(this).attr("id").replace(/sc_booking_shape_name_/,"");
	   var newName = $(this).val();
	   for(var f = 0 ; f < floorCanvases.length ; f++) {
	     for (var s = 0 ; s<floorCanvases[f].shapes.length ; s++) {
		   if(floorCanvases[f].shapes[s].sid != sid ) {
		      if(newName == floorCanvases[f].shapes[s].booking_options.givenName) {
			     $(this).addClass("pc_text_val_sid_red_border");
				 $(this).val(tempNames[sid]);
				 return;
			  }
		   }
		 }
	   }
	   sid2shape[SID].booking_options.givenName = newName;
   });
   $(document).on('focusout', '.free_text_pc_sid', function(e){
      var sid = $(this).attr("id").replace(/free_text_pc_sid-/,"");
	  var SID = sid.replace(/free_text_pc_pop_sid-/,"");
	  sid2shape[SID].booking_options.description = $(this).val();
	  if($(this).attr("id").indexOf("free_text_pc_pop_sid-") > -1) {
	      $("#free_text_pc_sid-"+SID).val($(this).val());
	  }
	  
   });
   
    $(document).on('change', '.is_bkb_chk', function(e){
	   var sid_ = $(this).attr("id").replace(/is_bkb_chk_pop-/,"");
	   var SID = sid_.replace(/is_bkb_chk-/,""); 
       if($(this).attr("checked")){ 
          sid2shape[SID].booking_options.bookable=true;
		  if($(this).attr("id").indexOf("is_bkb_chk_pop-") > -1) {
		     $("#is_bkb_chk-"+SID).prop("checked",true);
		  }
       }else{ 
          sid2shape[SID].booking_options.bookable=false;
		  if($(this).attr("id").indexOf("is_bkb_chk_pop-") > -1) {
		     $("#is_bkb_chk-"+SID).prop("checked",false);
		  }
       } 
    });
   
    $(document).on('click', '.mat_pc_show_loc', function(e){
	    var sid = $(this).attr("id").replace(/pc_location_p-/,"");
		console.log(e.pageX+","+e.pageY);
		showFloorPositionPopover(sid,e.pageX,e.pageY);
	});
   $(".nav-pills a").click(function(){
        $(this).tab('show');
		//console.log($(this));
    });
	
	$('.pc_order_type_toggle,#pc_max_tables').bootstrapToggle({
	});
	$('#pc_max_tables').change(function () { 
			if ($(this).is(':checked')) {
			   // Daily
			   $("#pc_max_tables_input_wrap").hide(); 
			} else {
			   // Hourly
			    $("#pc_max_tables_input_wrap").show(); 
			}
	});
	$(document).on('focusout', '#pc_max_tables_input', function(e){
	    var max = 0;
	    for (f= 0 ; f < floorCanvases.length ; f++) {
		  max+=floorCanvases[f].shapes.length;
		}
		if($(this).val() > max) {
		   $(this).val(max);
		}
		if($(this).val() < 1) {
		  $(this).val(1);
		}
	});
	$('.pc_order_type_toggle').change(function () {
	        $(".order_type_text").hide();
			if ($(this).is(':checked')) {
			   // Daily
			   $("#daily_tip").show();
			   $("#hourly_options_content").hide(); 
			   $("#daily_options_content").show(); 
			} else {
			   // Hourly
			    $("#hourly_tip").show();
				$("#daily_options_content").hide(); 
			    $("#hourly_options_content").show(); 
			}
	});
	$("#waiter_username_change_input").keydown(function() {
	    var temp_val = $(this).val();
	   if(/^[a-zA-Z0-9\_\-]*$/.test(temp_val) == true && temp_val.length < 12) {
	      current_username_value = $(this).val();
	   }
	});
	$("#waiter_username_change_input").keyup(function() {
	   var temp_val = $(this).val();
	   if(/^[a-zA-Z0-9\_\-]*$/.test(temp_val) == false) {
	      $(this).val(current_username_value);
	   } 
	});
	$("#waiter_password_change_input").keydown(function() {
	    var temp_val = $(this).val();
	   if(/^[a-zA-Z0-9\_\-]*$/.test(temp_val) == true  && temp_val.length < 12) {
	     current_password_value = $(this).val();
	   }
	});
	$("#waiter_password_change_input").keyup(function() {
	   var temp_val = $(this).val();
	   if(/^[a-zA-Z0-9\_\-]*$/.test(temp_val) == false) {
	      $(this).val(current_password_value);
	   } 
	});
	$(".step_wrap").click(function(){
	   var input_id = $(this).attr("id").replace(/_div/,"");
	   $("#"+input_id).prop("checked", true);
	   $(".step_wrap").removeClass("input_radio_wrap_selected");
	   $(this).addClass("input_radio_wrap_selected");
	});
	$(".wait_wrap").click(function(){
	   var input_id = $(this).attr("id").replace(/_div/,"");
	   $("#"+input_id).prop("checked", true);
	   $(".wait_wrap").removeClass("input_radio_wrap_selected");
	   $(this).addClass("input_radio_wrap_selected");
	});
	$(".order_leng_wrap").click(function(){
	   var input_id = $(this).attr("id").replace(/_div/,"");
	   if ($("#"+input_id).is(':checked')) {
	      var allLeng =  document.getElementsByName("start_wait");  
          var checkCount = 0;		  
          for(var x=0; x < allLeng.length; x++) { 
		     if(document.getElementById(allLeng[x].id).checked == true) {
			    checkCount+=1;
			 }
		  }
		  if(checkCount > 1) {
	         $("#"+input_id).prop("checked", false);
		     $(this).removeClass("input_radio_wrap_selected");
		  }
	   } else {
	      $("#"+input_id).prop("checked", true);
		  $(this).addClass("input_radio_wrap_selected");
	   }
	   
	});
	$('#pc_auto_confirm').bootstrapToggle({
	});
	$('#pc_auto_confirm').change(function () {
			if ($(this).is(':checked')) {
			   $("#manual_approval_contacts_form").hide(); 
			   $("#manual_approval_contacts_exists").hide(); 
			} else {
			   
			     $("#manual_approval_contacts_form").show(); 
				 $("#manual_approval_contacts_exists").show();
			}
	});
	$('.day_open_close_toggle').bootstrapToggle({
	});
	
	$('.day_open_close_toggle').change(function () {
			if ($(this).is(':checked')) {
			    switch($(this).attr("id")) {
					case "pbook_sun_cb":
						calWeek.setDay(0,true);
						break;
					case "pbook_mon_cb":
						calWeek.setDay(1,true);
						break;
					case "pbook_tue_cb":
						calWeek.setDay(2,true);
						break;
					case "pbook_wed_cb":
						calWeek.setDay(3,true);
						break;
					case "pbook_thu_cb":
						calWeek.setDay(4,true);
						break;
					case "pbook_fri_cb":
						calWeek.setDay(5,true);
						break;
					case "pbook_sat_cb":
						calWeek.setDay(6,true);
						break;
				}
				
			} else { 
			    switch($(this).attr("id")) {
					case "pbook_sun_cb":
						calWeek.setDay(0,false);
						break;
					case "pbook_mon_cb":
						calWeek.setDay(1,false);
						break;
					case "pbook_tue_cb":
						calWeek.setDay(2,false);
						break;
					case "pbook_wed_cb":
						calWeek.setDay(3,false);
						break;
					case "pbook_thu_cb":
						calWeek.setDay(4,false);
						break;
					case "pbook_fri_cb":
						calWeek.setDay(5,false);
						break;
					case "pbook_sat_cb":
						calWeek.setDay(6,false);
						break;
				}	
			}
		});
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	    if($(this).attr("id")=="calendar_tab_a") {
			//console.log(  e.target) // newly activated tab
			//console.log(  e.relatedTarget )// previous active tab
			resetCalendar();
		} 
		if($(this).attr("id")=="seat_topview_tab") {
			//console.log(  e.target) // newly activated tab
			//console.log(  e.relatedTarget )// previous active tab
			updateFloorWrapDimentionsPC();
			ApplyFinalPosition();
		} 
		if($(this).attr("id")=="iframe_list_pill") {
			//console.log(  e.target) // newly activated tab
			//console.log(  e.relatedTarget )// previous active tab
			
		} 
	})


	$("#user_logo_upload").on("change", function()
    	    {
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 100;
					  var canvas_heightApplied = 100;					  
					  image.onload = function() {
						 var actualWidth = this.width;
						 var actualHeight = this.height;
						 document.getElementById("uploaded_logo_temp").src =  image.src ;
                         document.getElementById("uploaded_logo_temp").style.width = actualWidth + 'px';
                         document.getElementById("uploaded_logo_temp").style.height = actualHeight + 'px';
                         
						var c = document.getElementById("upload_logo_canvas");
					    var ctx = c.getContext("2d");
						// temp img for canvas draw
						var imgID = document.getElementById("uploaded_logo_temp");
						// constant image for pick
					    var mirror = document.getElementById("uploaded_logo_canvas_source_100");    
                        ctx.clearRect( 0 , 0 , 100 , 100 );
						if (actualWidth > actualHeight) {
					    	ctx.drawImage(imgID,0,0,actualHeight,actualHeight,0,0,100,100);
						} else {
							ctx.drawImage(imgID,0,0,actualWidth,actualWidth,0,0,100,100);
						}
						mirror.width = 100+"px";
						mirror.height = 100+"px";
						var dataURL = c.toDataURL('image/png');
						mirror.src = dataURL;
					   }
    	            };
    	        } 
    	    });

	$("#hidden_image_upload").on("change", function()
    	    {
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 200;
					  var canvas_heightApplied = 150;
                      var maxWidth = 1000;
                      var maxHeight = 600;					  
					  image.onload = function() {
						 var actualWidth = this.width;
						 var actualHeight = this.height;
                         if(actualWidth <= maxWidth && actualHeight <= maxHeight) {
						    canvas_widthApplied = actualWidth;
							canvas_heightApplied = actualHeight;
						 } else {
						      if(actualWidth/maxWidth >= actualHeight/maxHeight) {
							     canvas_widthApplied = maxWidth;
								 canvas_heightApplied = actualHeight * maxWidth / actualWidth
							  
							  } else {
							     canvas_heightApplied = maxHeight;
								 canvas_widthApplied  = actualWidth * maxHeight / actualHeight;
							  }
						 }
						 var imddivID =  "imup_"+randomString(20);
						 uploaded_images_divs.push(imddivID);
						 var wrel = actualWidth/actualHeight;
                         var appendData = "";
						 appendData += '<div class="uploaded_single_image_w" id="uu_wrap_'+imddivID+'"><canvas class="uploaded_single_image_can" id="show_'+imddivID+'" style="display:none"></canvas>';
						 appendData += '<div class="thumbnail">';
						 appendData += ' <img src=""  id="'+imddivID+'" name="imup_image" class="imap_image_single" imageOrigWidth="'+actualWidth+'" imageOrigHeight="'+actualHeight+'">';
						 appendData += '  <div class="caption">';
						 appendData += '	<div class="delete_image_pc"  id="delete_uu_'+imddivID+'" onclick="removeImageUU(this)">Remove image</div> ';
						 appendData += '  </div>';
						 appendData += '</div></div>';
						 $("#upload_conf_img_append_show").prepend(appendData); 
						 
						 document.getElementById("temp_image_for_canvas_creation").src = image.src;
						 var c = document.getElementById("show_"+imddivID);
						 document.getElementById("show_"+imddivID).height = canvas_heightApplied;
						 document.getElementById("show_"+imddivID).width = canvas_widthApplied;
	                     var ctx = c.getContext("2d");    
						 var imgID = document.getElementById("temp_image_for_canvas_creation");
                         ctx.drawImage(imgID,0,0,actualWidth,actualHeight,0,0,canvas_widthApplied,canvas_heightApplied);
						 var dataURL = c.toDataURL('image/jpeg');
						 						 
						 document.getElementById(imddivID).src =  dataURL ;  
					   };
    	            };
    	        } 
    	    });

	$("#manual_email-1").keyup(function() {
		var temp_val = $(this).val();
		if(isEmail(temp_val)==true) {
			$("#confirm_mail_button-1").removeClass("confirm_contact_button_inactive");
		} else {
			$("#confirm_mail_button-1").addClass("confirm_contact_button_inactive");
		}
	});

 });
   

 function showCalendarPopover(x,y,event) {
      // update BID information
	  updateCalendarPopover('calendar_popover_hidden',event);//
      $("#calendar_popover").css({'position':'absolute','top':y-10,'left':x}).popover({
            trigger: 'click',
            placement:'top',
			container: 'body',
			template:'<div class="popover calendar_popover_template"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#calendar_popover_hidden').html();
            }
        }).popover('show');	   		
}
function showFloorPositionPopover(sid,x,y) {
     updateSidLocationPopover('canvas_popover_hidden',sid);// waiterViewService.js
      $("#list_popover").css({'position':'absolute','top':y-10,'left':x}).popover({
            trigger: 'click',
            placement:'top',
			container: 'body',
			template:'<div class="popover canvas_popover_template_list"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');
		
}
  function showFloorPopover(x,y,sel) {
      // update BID information
	  updateBookingSidPopover('canvas_popover_hidden',sel);//
      $("#list_popover").css({'position':'absolute','top':y,'left':x}).popover({
            trigger: 'click',
            placement:'auto',
			container: 'body',
			template:'<div class="popover canvas_popover_template_list"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');	  		
} 
function ClosePopoverAll() {
$("#list_popover").popover('hide');
}
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function addAdminEmail() {
	var mail = $("#admin_email-1").val();
	if(isEmail(mail)) {
        checkLoginAndSendEmail(mail);//interactiveUpdae_pc.js
	} else {
		$("#admin_email-1").addClass("admin_email_warn");
	}
}
function testManualEmail() {
	var mail = $("#manual_email-1").val();
	if(isEmail(mail)==true) {
		checkLoginAndSendEmail(mail,true);//interactiveUpdae_pc.js
	} else {

	}
}

function closeIframe() {
	$("#frame_prev_wrap").hide();
	$("#frame-canvas").html("");
}

