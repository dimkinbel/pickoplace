var tcanvases = {};
var timelines = {};
function updateBookingSidPopover(popover_hidden_wrap_id,sid_shape) {
    currentSelection = sid_shape;
    var ra_color_class;
	var name = sid_shape.booking_options.givenName;
	var sid = sid_shape.sid; 
	var bookable;
	if(sid_shape.booking_options.bookable) {
	   ra_color_class = "grey"; 
	   bookable = "checked";
	}  
    var appendData = '';
	 appendData+= '    <div class="container-fluid"> ';
	appendData+= '	  <div class="row popup_tl_top_row admin_range_popover_head">  ';
	appendData+= '	      <div class="col-sm-12 ">	';
 	appendData+= '           <button type="button" class="close close_x_popover" onclick="$(&quot;.popover&quot;).popover(&quot;hide&quot;);"  aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	appendData+= '		     <div class="ra_sid_name ra_sid_name_selected" >'+name+'</div><div class="ra_panel_bid_name"></div> ';		
	appendData+= '          </div>  ';
	appendData+= '     </div>	 ';
	appendData+= '	 <div class="row margin_top_8">	 '; 
    appendData+= '          <div class="col-sm-12 pos_relative h38" id="popup_show_selected_time">';
	appendData+= '		    <span id="pop_date"></span><span id="pop_range"></span>';
	appendData+= '		  </div>		      			  ';
	appendData+= '	 </div>	  ';
	appendData+= '	 <div class="row " id="tcanvas_pop_row">';
	appendData+= '	    <div class="col-sm-12">';
	appendData+= '		    <table class="tcanvas_pop_row_tbl" cellspacing="0" cellpadding="0" style="width:100%;height: 60px; border-collapse:collapse">';
	appendData+= '			   <tr><td style="position:relative;vertical-align: bottom;">';
	appendData+= '			      <div id="scroll_left_tp_canvas_SID" class="material-icons tp_can_nav scroll_left_tp_canvas">chevron_left</div>';
	appendData+= '			   </td><td class="tp_canvas_td">';
	appendData+= '			       <div id="canvas_popup_timing_'+sid+'" class="popup_timing_div"></div>';
	appendData+= '			      <div class="tp_canvas_wrap" >	';
    appendData+= '                    <div class="tp_canvas_shad_top"></div>	';			  
	appendData+= '				    <canvas id="tp_canvas_'+sid+'" class="tp_canvas" ></canvas>';
	appendData+= '					<div class="tp_canvas_shad_bot"></div>';
	appendData+= '				  </div>';
	appendData+= '			   </td><td  style="position:relative;vertical-align: bottom;">';
	appendData+= '			      <div id="scroll_right_tp_canvas-'+sid+'" class="material-icons tp_can_nav scroll_right_tp_canvas">chevron_right</div>';
	appendData+= '			   </td></tr>';
	appendData+= '			</table>';
	appendData+= '		</div>';
	appendData+= '	 </div>';
	appendData+= '	 <div class="row book_pop_footer" > ';
	appendData+= '	 <div id="expand_timeline_wrap" ><div class="material-icons" id="expand_tl_more" data-toggle="tooltip" data-container="body" data-placement="bottom" title="הראה זמינות">expand_more</div><div class="material-icons" id="expand_tl_less"  data-toggle="tooltip" data-container="body" data-placement="bottom" title="סגור">expand_less</div></div>';
	
	if(sid_shape.isAvailable == false) {
	   appendData+= ' <div id="lonitan_text">לא ניתן להזמין בתנאים שנבחרו</div>';
	} else {
		if(sid_shape.choosen == false) {
			appendData+= '       <div class="popup_persons_selector_wrap pos_relative"> ';		        
			appendData+= '		    <div class="my_bs_selector_wrap">';
			appendData+= '			   <select class="my_bs_selector" id="persons_bs_select-'+sid+'"  >';
			for (var p = sid_shape.booking_options.minPersons ; p <= sid_shape.booking_options.maxPersons ; p++) {
			   if(p==parseInt($("#book_persons_val_").val())) {
				 appendData+= '				  <option selected>'+p+'</option>';
			   } else {
				 appendData+= '				  <option >'+p+'</option>';
			   }
			} 
			appendData+= '				</select>';
			appendData+= '			</div>';
			appendData+= '			<i class="material-icons book_pop_mat">group</i>';
			appendData+= '	   </div>';
			
			appendData+= '	   <div   id="add_to_booking_popup-'+sid+'" class="add_to_booking_popup" onclick="Booking_addToOrder(\''+sid+'\')">';
			appendData+= '	      <div class="heb_btn_mat material-icons ">add</div>';	
			appendData+= '	      <div class="heb_btn_text heb_btn_text_add">הוסף להזמנה</div>	';	     	       
			appendData+= '	   </div>';
		} else {
			appendData+= '	   <div   id="remove_to_booking_popup-'+sid+'" class="remove_from_booking_popup" onclick="Booking_removeFromOrder(\''+sid+'\')">';
			appendData+= '	      <div class="heb_btn_mat_clear material-icons ">clear</div>';	
			appendData+= '	      <div class="heb_btn_text heb_btn_text_clear">מחק מהזמנה</div>	';	     	       
			appendData+= '	   </div>';
		
		}
	}
	appendData+= '	 </div>';
	appendData+= '    </div> '; 
	
	$("#"+popover_hidden_wrap_id).children().html(appendData);  
	 $('[data-toggle="tooltip"]').tooltip();

}
var currentSingleTimeCanvas = null;
var currentSelection = null;
function updateShapeTimeline(canvas_id,shape,from,to) {
    var from = from;
	var to = to;
	var offset = bookingsManager.shapesPrebookedJSON.placeOffset;
    var sid = shape.sid;
	var fid = shape.state.floorid;
	var name = shape.booking_options.givenName;
	var x = shape.x;
	var y = shape.y; 
	
	document.getElementById(canvas_id).width = $("#"+canvas_id).width();
	document.getElementById(canvas_id).height = $("#"+canvas_id).height(); 
	$("#"+canvas_id).css("width",$("#"+canvas_id).width());
	$("#"+canvas_id).parent().css("width",$("#"+canvas_id).width()+2);// Take borders into consideration
	tcanvases[sid] = null;
	tcanvases[sid] = new BCanvasState(document.getElementById(canvas_id),from,to,offset);
    var bookings = [];
	var sidOrders = bookingsManager.getSidBookings(sid);
		for (var t=0 ; t < sidOrders.length ; t++ ) {
			var from = sidOrders[t].from;
			var to = sidOrders[t].to; 
			var bshape = new BShape(tcanvases[sid], from , to , "__" , 1 , "booked","sid",sid);
			bookings.push(bshape);
		}
	
	var pshape = new PShape(tcanvases[sid] , sid , name , fid , x , y , bookings); 
	tcanvases[sid].addPShape(pshape);
	tcanvases[sid].shapeViews[sid]=shape;
	tcanvases[sid].weekObject = bookingsManager.shapesPrebookedJSON.weekObject;
	tcanvases[sid].closeDays = bookingsManager.shapesPrebookedJSON.closeDays;
	tcanvases[sid].valid=false;
	currentSingleTimeCanvas = tcanvases[sid];
	currentSingleTimeCanvas.adminMoveAble = false;
}
function updateSelectOptions(selid,type,datepickerId,minPeriodSeconds) {
    console.log(type)
    $("#"+selid).html('');
	
    var offset = bookingsManager.shapesPrebookedJSON.placeOffset;
	// Update Select ----
	var clientDay = new Date();
	var placeTime = new Date(clientDay.getTime() + clientDay.getTimezoneOffset()*60*1000 + offset * 3600 * 1000);
	var placeHours = placeTime.getHours();
	var placeMinutes = placeTime.getMinutes();
	var placeSecondsTotal = placeHours*3600 + placeMinutes*60;
	var selected = false;
	console.log("ddd " + minPeriodSeconds);
	var openStepList = bookingsManager.getOpenSecondsByDate($("#"+datepickerId).datepicker( "getDate" ).getTime()/1000,minPeriodSeconds);
	console.log(openStepList);
	
	var selectedTime = "";
	var stillOpen = false;
	if(openStepList.length == 0) {
	  if(type == "select") {
	    $("#"+selid).append('<option selected disabled>Closed</option>');
	  } else if(type=="dropdown") {
	    selectedTime = "CLOSED";
		$("#book_top_start").html(selectedTime);
		$("#book_top_start").parent().removeClass("dropdown-toggle");
		$("#book_top_start").parent().removeAttr("data-toggle");
		$("#book_top_start").parent().removeAttr("aria-haspopup");
		$("#book_top_start").parent().removeAttr("aria-expanded"); 
		$("#book_top_start").addClass('dropdown_disabled');
		$("#book_start_val_").val("-1");
	  }
	} else {
	    if(type=="dropdown") {
		  $("#book_top_start").parent().addClass("dropdown-toggle");
		  $("#book_top_start").removeClass('dropdown_disabled');
		}
		for(var sl = 0 ; sl < openStepList.length ; sl+= 1) {
		   var s = openStepList[sl];
		   var selectedString = "";
		   var disabledString = "";
		   var hours = getLeadingZero((s-(s%3600))/3600);
		   var minutes = getLeadingZero((s%3600)/60); 
		   
		   var selectTime = new Date($("#"+datepickerId).datepicker( "getDate" ).getTime() + clientDay.getTimezoneOffset()*60*1000 + offset * 3600 * 1000 + s*1000);
			
		   if(placeTime.getTime() < selectTime.getTime() && selected == false) {
			  selectedString = " selected ";
			  selected = true;
			  selectedTime = hours+':'+minutes;
			  $("#book_start_val_").val(s);
			  stillOpen = true;
		   } else {
			
		
			 if(placeTime.getTime() >  selectTime.getTime()) {
				disabledString = "disabled";
			 }
		   }
		   
		   if(type == "select") {
				$("#"+selid).append('<option value='+s+' '+selectedString+' '+disabledString+'>'+hours+':'+minutes+'</option>');
		   } else if(type=="dropdown") {
		        if(stillOpen == true) {
		            $("#"+selid).append('<li class="'+disabledString+'"><a href="#" data-period="'+s+'">'+hours+':'+minutes+'</a></li>');
				}  	
		   }
		}	   
	}
    if(type == "select") {
		$( "#"+selid ).change(function () { 
			timelines[currentSingleTimeCanvas.canvas.id].redraw();
		 })
	 } else if(type=="dropdown" && openStepList.length > 0) {
	         if(stillOpen == true) {
		           $("#book_top_start").html(selectedTime);
					 $("#book_top_start").parent().attr("data-toggle","dropdown");
					 $("#book_top_start").parent().attr("aria-haspopup","true");
					 $("#book_top_start").parent().attr("aria-expanded","true");
			  } else {
			    	selectedTime = "מקום סגור להיום";
					$("#book_top_start").html(selectedTime);
					$("#book_top_start").parent().removeClass("dropdown-toggle");
					$("#book_top_start").parent().removeAttr("data-toggle");
					$("#book_top_start").parent().removeAttr("aria-haspopup");
					$("#book_top_start").parent().removeAttr("aria-expanded"); 
					$("#book_top_start").addClass('dropdown_disabled');
					$("#book_start_val_").val("-1");
			 }	
	      
	 }
	// -----------------
}
function UpdateModal() {
        $("#modal_sid_lines").html('');
			 $("#time_order_row_val").html('');
			 var fromDate = getBookDate(parseInt(bookingOrder.dateSeconds),parseInt(bookingOrder.start),parseInt(bookingOrder.placeOffset));
			 var toDate = getBookDate(parseInt(bookingOrder.dateSeconds),parseInt(bookingOrder.start + bookingOrder.period),parseInt(bookingOrder.placeOffset));
			 var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]; 
	         var mon = monthNames[fromDate.getMonth()];
			 
	
			 $("#time_order_row_val").html('<div class="col-md-12"><span class="hz_date">'+fromDate.getDate()+' '+mon+',</span> '+getLeadingZero(fromDate.getHours())+':'+getLeadingZero(fromDate.getMinutes())+' - '+getLeadingZero(toDate.getHours())+':'+getLeadingZero(toDate.getMinutes())+'</div>');
			 
		     //modal_sid_lines
			 for(var s=0 ; s < bookingOrder.listOfSids.length ; s++) {
			    var singleSid = bookingOrder.listOfSids[s];
				var appendData = '';
				appendData+='   <div class="row hz_mt_val" id="hz_sid_line-'+singleSid.sid+'">';
				appendData+='	  <div class="col-md-2">';
				appendData+='	      <div class="modal_hz_val_btn material-icons" id="hz_cancel-'+singleSid.sid+'" onclick="cancelFromOrder(\''+singleSid.sid+'\');"  data-toggle="tooltip" data-placement="top" title="מחק מהרשימה">clear</div>';
				appendData+='	  </div>';
				appendData+='	  <div class="col-md-3">'+singleSid.floor_name+'</div>';
				appendData+='	  <div class="col-md-3">'+singleSid.persons+'</div>';
				appendData+='	  <div class="col-md-3">'+singleSid.name+'</div>';
				appendData+='	  <div class="col-md-1">'+parseInt(s+1)+'</div>';
				appendData+='	</div>';
				$("#modal_sid_lines").append(appendData);
			 }
			 $("#booking_order_modal").modal('show');
}
function updateShowDateDatepickerFe() {
    var date_ub = $("#datepicker_ub").datepicker( "getDate" );
	var day = date_ub.getDate();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var mon = monthNames[date_ub.getMonth()];
	$("#csdos_day").html(date_ub.getDate());
	$("#csdos_mon").html(mon);
}
function getLeadingZero(val) {
  if(parseInt(val) < 10) {
     var s = "0"+val;
	 return s;
  } else {
     return val;
  }
}