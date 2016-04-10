function drawEventOnList(event) {
  //
  var date_ = new Date(event.start.utc());
  var seconds = parseInt(event.id.replace(/eid_/,""));
  var day = date_.getUTCDate();
  //var mon = date_.getUTCMonth()+1;
  var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]; 
  var mon = monthNames[date_.getMonth()];
  var year = date_.getUTCFullYear();
  var appendData = '';
  appendData += '<div class="close_day_list_line" id="close_line_'+seconds+'">'+day+' '+mon+' '+year+'<div class="material-icons close_day_l_mat" id="close_event_'+seconds+'" onclick="removeCloseDate(this)">close</div></div>';
  $("#list_of_closed_days").append(appendData);
}

function updateCloseDates() {
  // Working sliders updated after sliders initialization
    var closeDates = JSON.parse(document.getElementById("server_closeDates").value);	
    if (closeDates.length > 0) {
	    for ( var ind = 0 ; ind < closeDates.length ; ind++) { 
	    	var time = closeDates[ind];// In UTC seconds , but we need to display date relative to browser
	    	var date = new Date(time*1000);  
			addCalendarEvent(time,0,false);
	    }
    }
}

function removeCloseDate(this_) {
	var id=this_.id;
	var tempid = id.replace(/^close_event_/, "")
	var seconds = parseInt(tempid.replace(/^close_onpop_/, ""));
	$("#close_line_"+seconds).remove();
	var eventID = "eid_"+seconds;
	for(var e = 0 ; e < eventList.length ; e++) {
		if(eventList[e].id == eventID) {
		   $('#fullcalendar').fullCalendar( 'removeEvents' , eventList[e].id);
		   eventList.remove(eventList[e]);
		   break;
		}
	}
	$("#calendar_popover").popover('hide');
}
function updateCalendarPopover(popover_hidden_wrap_id,event) {
  var date_ = new Date(event.start.utc());
  var seconds = parseInt(event.id.replace(/eid_/,""));
  var day = date_.getUTCDate();
  //var mon = date_.getUTCMonth()+1;
  var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]; 
  var mon = monthNames[date_.getMonth()];
  var year = date_.getUTCFullYear();
  var appendData = '';
  appendData+='<div class="container-fluid pc_cal_pop_cont">'
  appendData+='			<div class="row pc_popover_header">'
  appendData+='				<div class="col-md-12">'
  appendData+='				   <div class="pcpop_heb">? להסיר מהרשימה </div>'
  appendData+='				   <div class="pcpop_date">'+day+' '+mon+' '+year+'</div>'
  appendData+='				</div>'
  appendData+='			</div>'
  appendData+='			<div class="row pc_popover_content">'
  appendData+='				<div class="col-md-6">'
  appendData+='				   <button type="button" class="btn btn-primary pc_pop_btn cancel_popover_pc" >לא</button>'
  appendData+='				</div>'
  appendData+='				<div class="col-md-6">'
  appendData+='				   <button type="button" class="btn btn-danger pc_pop_btn"  id="close_onpop_'+seconds+'" onclick="removeCloseDate(this)">כן</button>'
  appendData+='				</div>'
  appendData+='			</div>'
  appendData+='		</div>'
$("#"+popover_hidden_wrap_id).children().html(appendData);  


}
function updateWorkingHours() {
	if (document.getElementById("server_workinghours")!= null && document.getElementById("server_workinghours").value!= "") {
		var server_workinghours	= JSON.parse(document.getElementById("server_workinghours").value);
		var sun = server_workinghours.sun;
		var mon = server_workinghours.mon;
		var tue = server_workinghours.tue;
		var wed = server_workinghours.wed;
		var thu = server_workinghours.thu;
		var fri = server_workinghours.fri;
		var sat = server_workinghours.sat;
		
		var slider = $("#open_time_slider_sun").data("ionRangeSlider");
		   var fromInd = sun.from / 15 /60;
		   var toInd = sun.to / 15 /60;		   
		   slider.update({
				from : fromInd,
				to:toInd
			 });
		  WeekDaysSliderValue['open_time_slider_sun_from'] = fromInd * 15 * 60;
		  WeekDaysSliderValue['open_time_slider_sun_to'] = toInd * 15 * 60;
		  $("#config_from_to_sun").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
		  if(sun.open == true) {
			$('#pbook_sun_cb').bootstrapToggle('on');
			calWeek.setDay(0,true);
		  } else {
			$('#pbook_sun_cb').bootstrapToggle('off');
			calWeek.setDay(0,false);
		  }
		  document.getElementById("pbook_sun_cb").checked = sun.open;
		  
			var slider = $("#open_time_slider_mon").data("ionRangeSlider");
			   var fromInd = mon.from / 15 /60;
			   var toInd = mon.to / 15 /60;		   
			   slider.update({
					from : fromInd,
					to:toInd
				 });
			  WeekDaysSliderValue['open_time_slider_mon_from'] = fromInd * 15 * 60;
			  WeekDaysSliderValue['open_time_slider_mon_to'] = toInd * 15 * 60;
			  $("#config_from_to_mon").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
			  if(mon.open == true) {
				$('#pbook_mon_cb').bootstrapToggle('on');
				calWeek.setDay(1,true);
			  } else {
				$('#pbook_mon_cb').bootstrapToggle('off');
				calWeek.setDay(1,false);
			  }
			  document.getElementById("pbook_mon_cb").checked = mon.open;
			  
			  var slider = $("#open_time_slider_tue").data("ionRangeSlider");
			  fromInd = tue.from / 15 /60;
			  toInd = tue.to / 15 /60;		   
			  slider.update({
				  from : fromInd,
				to:toInd
			   });
			  WeekDaysSliderValue['open_time_slider_tue_from'] = fromInd * 15 * 60;
			  WeekDaysSliderValue['open_time_slider_tue_to'] = toInd * 15 * 60;
			  $("#config_from_to_tue").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
			  if(tue.open == true) {
				$('#pbook_tue_cb').bootstrapToggle('on');
				calWeek.setDay(2,true);
			  } else {
				$('#pbook_tue_cb').bootstrapToggle('off');
				calWeek.setDay(2,false);
			  }
			  document.getElementById("pbook_tue_cb").checked = tue.open;
			  
			  var slider = $("#open_time_slider_wed").data("ionRangeSlider");
			  fromInd = wed.from / 15 /60;
			  toInd = wed.to / 15 /60;		   
			  slider.update({
				  from : fromInd,
				to:toInd
			   });
			  WeekDaysSliderValue['open_time_slider_wed_from'] = fromInd * 15 * 60;
			  WeekDaysSliderValue['open_time_slider_wed_to'] = toInd * 15 * 60;
			  $("#config_from_to_wed").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
			  if(wed.open == true) {
				$('#pbook_wed_cb').bootstrapToggle('on');
				calWeek.setDay(3,true);
			  } else {
				$('#pbook_wed_cb').bootstrapToggle('off');
				calWeek.setDay(3,false);
			  }
			  document.getElementById("pbook_wed_cb").checked = wed.open;
			  
			  var slider = $("#open_time_slider_thu").data("ionRangeSlider");
			  fromInd = thu.from / 15 /60;
			  toInd = thu.to / 15 /60;		   
			  slider.update({
				  from : fromInd,
				to:toInd
			   });
			  WeekDaysSliderValue['open_time_slider_thu_from'] = fromInd * 15 * 60;
			  WeekDaysSliderValue['open_time_slider_thu_to'] = toInd * 15 * 60;
			  $("#config_from_to_thu").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
			  if(thu.open == true) {
				$('#pbook_thu_cb').bootstrapToggle('on');
				calWeek.setDay(4,true);
			  } else {
				$('#pbook_thu_cb').bootstrapToggle('off');
				calWeek.setDay(4,false);
			  }
			  document.getElementById("pbook_thu_cb").checked = thu.open;
			  
			  var slider = $("#open_time_slider_fri").data("ionRangeSlider");
			  fromInd = fri.from / 15 /60;
			  toInd = fri.to / 15 /60;		   
			  slider.update({
				  from : fromInd,
				to:toInd
			   });
			  WeekDaysSliderValue['open_time_slider_fri_from'] = fromInd * 15 * 60;
			  WeekDaysSliderValue['open_time_slider_fri_to'] = toInd * 15 * 60;
			  $("#config_from_to_fri").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
			  if(fri.open == true) {
				$('#pbook_fri_cb').bootstrapToggle('on');
				calWeek.setDay(5,true);
			  } else {
				$('#pbook_fri_cb').bootstrapToggle('off');
				calWeek.setDay(5,false);
			  }
			  document.getElementById("pbook_fri_cb").checked = fri.open;
			  
			  var slider = $("#open_time_slider_sat").data("ionRangeSlider");
			  fromInd = sat.from / 15 /60;
			  toInd = sat.to / 15 /60;		   
			  slider.update({
				  from : fromInd,
				to:toInd
			   });
			  WeekDaysSliderValue['open_time_slider_sat_from'] = fromInd * 15 * 60;
			  WeekDaysSliderValue['open_time_slider_sat_to'] = toInd * 15 * 60;
			  $("#config_from_to_sat").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
			  if(sat.open == true) {
				$('#pbook_sat_cb').bootstrapToggle('on');
				calWeek.setDay(6,true);
			  } else {
				$('#pbook_sat_cb').bootstrapToggle('off');
				calWeek.setDay(6,false);
			  }
			  document.getElementById("pbook_sat_cb").checked = sat.open;
	}
}
function updateTopViewList() {
   for(var f = 0 ; f < floorCanvases.length ; f++) {
     if(floorCanvases[f] == maincanvas) {
	        drawTableFloorList(floorCanvases[f] );
	 }
   }
   for(var f = 0 ; f < floorCanvases.length ; f++) {
     if(floorCanvases[f] != maincanvas) {
	        drawTableFloorList(floorCanvases[f] );
	 }
   }
}
function drawTableFloorList(floorc) {
        var floor_name = floorc.floor_name;
		var appendData = '';
		appendData+= '';
		appendData+= '  <div class="row">';
		appendData+= '    <div class="col-sm-2">';
		appendData+= '	     <div class="list_floor_cell">'+floor_name+'</div>';
		appendData+= '	 </div>';
		appendData+= '	 <div class="col-sm-10">';
		appendData+= '	    <table   cellspacing="0" cellpadding="0" style="width: 90%;   border-collapse: collapse">';
		appendData+= '		  <tr class="floors_table_head">';
		appendData+= '		      <td><span class="top_table_list_var">אינדקס/שם</span>     </td>';
		appendData+= '		      <td><span class="top_table_list_var">? ניתן להזמנה </span></td>';
		appendData+= '			  <td><span class="top_table_list_var">מינימום אנשים</span> </td>';
		appendData+= '			  <td><span class="top_table_list_var">מקסימום אנשים</span> </td>';
		appendData+= '			  <td><span class="top_table_list_var">טקסט חופשי</span>    </td>';
		appendData+= '		   </tr>';
		for(var s=0;s<floorc.shapes.length ; s++) {
		     var shape = floorc.shapes[s];
			 var name = shape.booking_options.givenName;
			 var bookable = shape.booking_options.bookable ;
			 var description = shape.booking_options.description;
			 var minp = shape.booking_options.minPersons;
			 var maxp = shape.booking_options.maxPersons;
				appendData+= '   <tr class="val_row_" >';
				appendData+= '      <td style="position:relative"><div class="material-icons mat_pc_show_loc" id="pc_location_p-'+shape.sid+'"  >place</div><input type="text" class="pc_text_val_sid"  id="sc_booking_shape_name_'+shape.sid+'" value="'+name+'"/></td>';
				if (bookable) {
				   appendData+= '	  <td><input type="checkbox" class="is_bkb_chk"  id="is_bkb_chk-'+shape.sid+'"  checked="checked" /></td>';
				} else {
				   appendData+= '	  <td><input type="checkbox" class="is_bkb_chk"  id="is_bkb_chk-'+shape.sid+'" /></td>';
				}
				appendData+= '	  <td>';
				appendData+= '	    <div class="persons_counter_div">';
				appendData+= '		  <div class="material-icons persons_mat_remove persons_mat_hide persons_mat_remove_min" id="pc_min_minus_persons-'+shape.sid+'">remove</div>';
				appendData+= '		  <input type="num"  class="persons_input__" id="pc_min_persons_val-'+shape.sid+'" readonly value="'+minp+'"/>';
				appendData+= '		  <div class="material-icons persons_mat_add persons_mat_hide persons_mat_add_min"  id="pc_min_plus_persons-'+shape.sid+'">add</div>';
				appendData+= '		</div>';
				appendData+= '	  </td>';
				appendData+= '	  <td>';
				appendData+= '	    <div class="persons_counter_div">';
				appendData+= '		  <div class="material-icons persons_mat_remove persons_mat_hide persons_mat_remove_max"  id="pc_max_minus_persons-'+shape.sid+'">remove</div>';
				appendData+= '		  <input type="num"  class="persons_input__"  id="pc_max_persons_val-'+shape.sid+'" readonly value="'+maxp+'"/>';
				appendData+= '		  <div class="material-icons persons_mat_add persons_mat_hide persons_mat_add_max"  id="pc_max_plus_persons-'+shape.sid+'">add</div>';
				appendData+= '		</div>';
				appendData+= '	  </td>';
				appendData+= '	  <td>';
				 if(description==undefined || description==null || description=="") {
				    appendData+= '	    <input type="text" class="free_text_pc_sid" id="free_text_pc_sid-'+shape.sid+'" value=""/> ';
				} else {
				    appendData+= '	    <input type="text" class="free_text_pc_sid" id="free_text_pc_sid-'+shape.sid+'"  value="'+description+'"/> ';
				}
				appendData+= '	  </td>';
				appendData+= '   </tr>';
		}
		appendData+= '		</table> ';
		appendData+= '	 </div>';
		appendData+= '  </div>';
        
        $("#floors_tables_list").append(appendData);
}


function updateSidLocationPopover(popover_hidden_wrap_id,sid) {
    console.log(popover_hidden_wrap_id + " " +sid);
    var floorCanvas ;
	var shape ; 
    for(var f = 0 ; f < floorCanvases.length ; f++) {
	  for(var s = 0 ; s < floorCanvases[f].shapes.length ; s++) {
	     if(floorCanvases[f].shapes[s].sid == sid ) {
		     floorCanvas = floorCanvases[f];
			 shape = floorCanvases[f].shapes[s];
		 }
	  }
	} 
   	 var appendData = '';
	 appendData+= '<div class="container-fluid">';
	 appendData+= '	  <div class="row popup_tl_top_row">';
	 appendData+= '	    <div class="col-sm-7 "  >';
	 appendData+= '			<div class="panel_bid_name"  >'+shape.booking_options.givenName;
	 appendData+= '			</div>'; 
	 appendData+= '		</div>';
	 appendData+= '		<div class="col-sm-5"  >'; 
	 appendData+= '		<button type="button" class="close" onclick="ClosePopoverAll()" aria-label="Close"><span aria-hidden="true">&times;</span></button>'; 
	 appendData+= '		</div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row popover_floor_img_row">';
	 appendData+= '	      <div class="col-sm-12 popover_floor_img_sm"  >';
	 appendData+= '		    <div class="thumbnail thumbnail_popover_img" name="popover_overview_tmb"  id="popover_ovrv_FID__'+floorCanvas.floorid+'">';
     appendData +='               <input type="text" id="popover_places_input_FID__'+floorCanvas.floorid+'" style="display:none" value=\''+shape.sid+'\'/>';	 
	 	 
	 appendData+= '		        <img class="popover_tl_fl_img" id="popover_img_FID__'+floorCanvas.floorid+'" src="'+$("#server_overview_"+floorCanvas.floorid).attr("src")+'"/>';
	 appendData+= '			</div>';
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	</div>';
    $("#"+popover_hidden_wrap_id).children().html(appendData);  
}
function updateBookingSidPopover(popover_hidden_wrap_id,shape) {

    var floorCanvas ; 
    for(var f = 0 ; f < floorCanvases.length ; f++) {
	  for(var s = 0 ; s < floorCanvases[f].shapes.length ; s++) {
	     if(floorCanvases[f].shapes[s].sid == shape.sid ) {
		     floorCanvas = floorCanvases[f]; 
		 }
	  }
	}
    var checked_string = "";	
	if (shape.booking_options.bookable == true) {
	   checked_string = 'checked="checked"';	
	}
   	 var appendData = '';
	 appendData+= '<div class="container-fluid pcpop_container">';
	 appendData+= '	  <div class="row popup_tl_top_row">';
	 appendData+= '	    <div class="col-sm-12 "  >';
	 appendData+= '			<div class="panel_bid_name pc_pop_sid_top"  >מאפייני מקום</div>'; 
	 appendData+= '		    <button type="button" class="close popclose_pc" onclick="ClosePopoverAll()" aria-label="Close" ><span aria-hidden="true">&times;</span></button>'; 
	 appendData+= '		</div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row pc_pop_val_row">';
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row"  >';
     appendData+= '		     שם המקום ';                           
	 appendData+= '		  </div>'
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row_val"  >';
              appendData+= '<input type="text" class="pc_text_val_sid_pop" id="pop_booking_shape_name_'+shape.sid+'" value="'+shape.booking_options.givenName+'"/>';                  
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row pc_pop_val_row">';
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row"  >';
     appendData+= '		     ? ניתן להזמנה  ';                           
	 appendData+= '		  </div>'
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row_val"  >';
              appendData+= '<input type="checkbox" class="is_bkb_chk is_bkb_chk_pop" id="is_bkb_chk_pop-'+shape.sid+'" '+checked_string+'>';                  
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row pc_pop_val_row">';
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row"  >';
     appendData+= '		     מינימום אנשים	 ';                           
	 appendData+= '		  </div>'
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row_val"  >';
     appendData+= '          <div class="persons_counter_div">		  ';
     appendData+= '            <div class="material-icons persons_mat_remove pop_persons_mat_remove_min" id="pop_min_minus_persons-'+shape.sid+'">remove</div>';
     appendData+= '            <input type="num" class="persons_input__ persons_input__pop" id="pop_min_persons_val-'+shape.sid+'" readonly="" value="'+shape.booking_options.minPersons+'">';
     appendData+= '            <div class="material-icons persons_mat_add pop_persons_mat_add_min" id="pop_min_plus_persons-'+shape.sid+'">add</div>';
     appendData+= '          </div>';                  
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row pc_pop_val_row">';
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row"  >';
     appendData+= '		    מקסימום אנשים ';                           
	 appendData+= '		  </div>'
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row_val"  >';
     appendData+= '          <div class="persons_counter_div">		  ';
     appendData+= '            <div class="material-icons persons_mat_remove pop_persons_mat_remove_max" id="pop_max_minus_persons-'+shape.sid+'">remove</div>';
     appendData+= '            <input type="num" class="persons_input__ persons_input__pop" id="pop_max_persons_val-'+shape.sid+'" readonly="" value="'+shape.booking_options.maxPersons+'">';
     appendData+= '            <div class="material-icons persons_mat_add pop_persons_mat_add_max" id="pop_max_plus_persons-'+shape.sid+'">add</div>';
     appendData+= '          </div>';                  
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row pc_pop_val_row">';
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row"  >';
     appendData+= '		     טקסט חופשי ';                           
	 appendData+= '		  </div>'
	 appendData+= '	      <div class="col-sm-6 pc_pop_var_row_val"  >'; 
     appendData+= '            <input type="text" class="free_text_pc_sid free_text_pc_pop" id="free_text_pc_pop_sid-'+shape.sid+'" value="'+shape.booking_options.description+'">'; 
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	</div>';
$("#"+popover_hidden_wrap_id).children().html(appendData);  
}
function updatePopoverSpots(divid,spot_class,type) {
	var bid_fid;
	if(type == 'popover') {
		bid_fid = divid.replace(/^popover_ovrv_/, "");
	} else if (type == 'modal') {
		bid_fid = divid.replace(/^modal_ovrv_/, "");
	}
    
	var sid =  $("#popover_places_input_FID__"+divid.replace(/popover_ovrv_FID__/,"")).val();		
	var fid = divid.replace(/popover_ovrv_FID__/,"");  
	var canvasLink = {};
        
		var sidsJson = {};
		var sidobj = {};
		sidobj.sid = sid;
		sidobj.x=0;
		sidobj.y=0;
		sidobj.rx = 0;
		sidobj.ry = 0;
		sidobj.name = "";
		sidsJson[sid] = sidobj;
	 
	for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		var floorid = floorCanvases[cf].floorid;
		if(fid == floorid ) {
			canvasLink = floorCanvases[cf];
			for (var sd = 0 ; sd < floorCanvases[cf].shapes.length ; sd++) {
				if(sidsJson.hasOwnProperty(floorCanvases[cf].shapes[sd].sid)) {
					sidsJson[floorCanvases[cf].shapes[sd].sid].x = floorCanvases[cf].shapes[sd].x;
					sidsJson[floorCanvases[cf].shapes[sd].sid].y = floorCanvases[cf].shapes[sd].y;
					sidsJson[floorCanvases[cf].shapes[sd].sid].name = floorCanvases[cf].shapes[sd].booking_options.givenName;
				}
			}
		}
	}
	if($("#"+type+"_img_"+bid_fid).width() > 0) {
		var paddingLeft = ($("#"+divid).outerWidth(true) - $("#"+divid).width()) / 2;
		var paddingTop = ($("#"+divid).outerHeight(true) - $("#"+divid).height()) / 2;
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_"+type+"_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();  //spot_class
				var appendData = '<div class="'+spot_class+'" id="'+id_+'"  title="'+sidsJson[key].name+'"><i class="material-icons place_point_popover_mat">place</i></div>';
				$("#"+divid).append(appendData);
				var elemWidth = $("#"+id_).outerWidth();
				var elemHeight = $("#"+id_).outerHeight();
				sidsJson[key].rx = sidsJson[key].x * ($("#"+type+"_img_"+bid_fid).width()/canvasLink.origWidth);
				sidsJson[key].ry = sidsJson[key].y * ($("#"+type+"_img_"+bid_fid).height()/canvasLink.origHeight);

				var cssleft = parseInt(sidsJson[key].rx + paddingLeft - elemWidth/2 );
				var csstop = parseInt(sidsJson[key].ry + paddingTop - elemHeight -2 );
				$("#"+id_).css("left",cssleft+"px");
				$("#"+id_).css("top",csstop+"px");
			}
		}
	} else {
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_"+type+"_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();
			}
		}
	}
}

function updateIFlist(data,append) {
    if(append == false) {
	    $("#existing_iframes_append").html("");
	}
     var all=document.getElementsByName("existing_iframes");
 
	 if(data.size == 0 && append == false) {
		 var appendData = "<div id='no_list_'>NO SAVED IFRAMES EXIST</div>";
		 $("#existing_iframes_append").append(appendData);
		 
	 } else {
		 $("#no_list_").remove();
		 console.log(data.list);
		 var pid = document.getElementById("server_placeID").value;
		 for (var i = 0 ; i < data.list.length;i++) {
			 var iframe = data.list[i];
			 var ifid = iframe.ifid;
			 var date_  = iframe.date; 
	         var appendData = '';
			 var hostName = window.location.host;
			 appendData+='<div class="ef_single_line" id="existing_iframe-'+ifid+'" name="existing_iframes"  >';
			 appendData+=' <ul class="list-group " >';
			 appendData+='  <li class="list-group-item if_list_head">';
			 appendData+='    <div class="row if_list_head_row" >';
			 appendData+='    	<div class="col-sm-2 if_list_date" >'+date_+'</div>';
			 if(iframe.booking == true) {
				 appendData += '    	<div class="col-sm-8" ><span class="if_book_text">Include booking</span>,<div class="if_theme_text_' + iframe.theme + '">' + iframe.theme + '</div></div>';
			 } else {
				 appendData += '    	<div class="col-sm-8" ><span class="if_no_book_text">Not include booking</span>,<div class="if_theme_text_' + iframe.theme + '">' + iframe.theme + '</div></div>';
			 }
			 appendData+='    	<div class="col-sm-2 ef_buttons">';
			 appendData+='    	   <div class="material-icons iframe_list_mat ef_remove"  id="if_delete-'+ifid+'" style="display:none"  data-toggle="tooltip"   data-placement="top" title="מחק">close</div>';
			 appendData+='    	   <div class="material-icons iframe_list_mat ef_show"   id="if_show-'+ifid+'" style="display:none"  data-toggle="tooltip"   data-placement="top" title="הצג">slideshow</div>';
			 appendData+='     	   <div class="material-icons iframe_list_mat ef_edit" id="if_edit-'+ifid+'"  style="display:none"   data-toggle="tooltip"   data-placement="top" title="עריכה">mode_edit</div>';
			 appendData+='    	</div>	';
			 appendData+='    </div >' +
					     '  </li>' +
					     '  <li class="list-group-item if_list_bottom">';
			 appendData+='    	<div class="ef_url">&lt;iframe src="https://'+hostName+'/getiframe?pid='+pid+'&ifid='+ifid+'"  width="'+iframe.width+'" height="'+parseInt(iframe.height+80)+'" style="border:none"&gt;&lt;/iframe&gt;</div>' +
					     '  </li>' +
					     ' </ul>';
             appendData+='    <input type="text" style="display:none" id="width_fe_-'+ifid+'" value="'+iframe.width+'"/>';
	         appendData+='    <input type="text" style="display:none" id="height_fe_-'+ifid+'" value="'+iframe.height+'">';
	         appendData+='    <input type="text" style="display:none" id="pid_fe_-'+ifid+'" value="'+pid+'">';
             appendData+='    <input type="text" name="iframe_json" id="iframe_json-'+ifid+'" style="display:none"   value=\''+JSON.stringify(iframe)+'\'>';
			 appendData+='   </div>';
			 
 
	         
	         $("#existing_iframes_append").append(appendData);
	    }
	 }
}
function appendNewAdmin(data) {

	var appendData = '';
	appendData+=' <div class="single_admin_contact" id="single_admin_contact-'+data.admin.replace(/\@/,"_").replace(/\./,"_")+'">';
	appendData+=' <div name="admin_mails" id="admin_mails-'+data.admin.replace(/\@/,"_").replace(/\./,"_")+'" class="single_phone_contact_val">'+data.admin+'</div>';
	appendData+=' 		<div class="remove_single_mail_contact material-icons" id="remove_admin_mail'+data.admin.replace(/\@/,"_").replace(/\./,"_")+'" onclick="removeSiteAdmin(\''+data.admin.replace(/\@/,"_").replace(/\./,"_")+'\')">clear</div>';
	appendData+=' </div>';
	$("#appended_admins").append(appendData);
}
function appendNewWaiter(data) {

	var appendData = '';
	appendData+=' <div class="single_admin_contact" id="single_waiter_contact-'+data.admin.replace(/\@/,"_").replace(/\./,"_")+'">';
	appendData+=' <div name="waiter_mails" id="waiter_mails-'+data.admin.replace(/\@/,"_").replace(/\./,"_")+'" class="single_phone_contact_val">'+data.admin+'</div>';
	appendData+=' 		<div class="remove_single_mail_contact material-icons" id="remove_waiter_mail'+data.admin.replace(/\@/,"_").replace(/\./,"_")+'" onclick="removeSiteWaiter(\''+data.admin.replace(/\@/,"_").replace(/\./,"_")+'\')">clear</div>';
	appendData+=' </div>';
	$("#appended_waiter_admins").append(appendData);
}
function removeWaiterLine(mail_coded) {
	$("#single_waiter_contact-"+mail_coded).remove();
}
function removeAdminLine(mail_coded) {
	$("#single_admin_contact-"+mail_coded).remove();
}
function removeConfirmationLine(mail_coded,type){
	$("#single_"+type+"_mail_contact-"+mail_coded).remove();
}
function removeConfirmationPhoneLine(phone){
	$("#single_phone_contact-"+phone).remove();
}
function updateIframeSelectors(iframe) {
	if(iframe.booking == true) {
		$('#iframe_bookable').bootstrapToggle('on');
		currentIframeSettings.booking = true;
	} else {
		$('#iframe_bookable').bootstrapToggle('off');
		currentIframeSettings.booking = false;
	}
	if(iframe.theme == "white") {
		$("#iframe_theme_dropdown_val").html("לבן");
		currentIframeSettings.theme = "white";
	}


	$("#pc_iframe_wrap").width(iframe.width);
	$("#pc_iframe_floors_wrap").width(iframe.width);
	$("#pc_iframe_floors_wrap").height(Math.round(iframe.width / width2height));
	$("#iframe_width").val(iframe.width+"x"+Math.round(iframe.width / width2height));
	$('#iframe_width_slider').slider('value', iframe.width);
	currentIframeSettings.width = iframe.width;
	currentIframeSettings.height = Math.round(iframe.width / width2height);

}
function appendNewConfirmationAdmin(mail,type) {
	var appendData = '';
	appendData+='<div class="single_'+type+'_mail_contact" id="single_'+type+'_mail_contact-'+mail.replace(/\@/,"_").replace(/\./,"_")+'">';
	appendData+='   <div name="single_'+type+'_mail_contact" id="single_'+type+'_mail_value-'+mail.replace(/\@/,"_").replace(/\./,"_")+'" class="single_phone_contact_val">'+mail+'</div>';
	appendData+='   <div class="remove_single_mail_contact material-icons" onclick="removeMailConfirmationContact(\''+mail.replace(/\@/,"_").replace(/\./,"_")+'\',\''+type+'\')" id="remove_single_'+type+'_mail-'+mail.replace(/\@/,"_").replace(/\./,"_")+'">clear</div>';
	appendData+='</div>';
	$("#"+type+"_mails_column").append(appendData);
}
function appendNewConfirmationAdminPhone(phone) {
	var appendData = '';
	appendData+='<div class="single_phone_contact" id="single_phone_contact-'+phone.replace(/\+/,"_")+'">';
	appendData+='   <div name="single_phone_contact" id="single_phone_value-'+phone.replace(/\+/,"_")+'" class="single_phone_contact_val">'+phone+'</div>';
	appendData+='   <div class="remove_single_phone_contact material-icons" onclick="removePhoneConfirmationContact(\''+phone.replace(/\+/,"_")+'\')" id="remove_single_phone-'+phone.replace(/\+/,"_")+'">clear</div>';
	appendData+='</div>';
	$("#manual_phones_column_append").append(appendData);
}