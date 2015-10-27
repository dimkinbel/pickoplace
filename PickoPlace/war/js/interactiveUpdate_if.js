var bookingOrderJSONlist=[];
var bookingOrderJSON = {};
var bookingRequestWrap = {};
var tmpShapes = {};
var sid2floor = {};
function createBookingObject() {
	createBookingJSON(); // bookingRequestWrap
	if(bookingRequestWrap.bookingList.length > 0) {
	  drawConfirmation();
	  updatePageView();
	} else {
		alert("Please choose any place");
	}
}

function drawConfirmation() {
	  var num_of_bookings = bookingRequestWrap.bookingList.length;
	  var bookTime = bookingRequestWrap.dateSeconds + bookingRequestWrap.time;
	  tmpShapes = {};
	  sid2floor = {};
	  for (var bs = 0 ; bs < bookingRequestWrap.bookingList.length ; bs++) {
		  var sid = bookingRequestWrap.bookingList[bs].sid;
		  for(var f = 0 ; f < floorCanvases.length ; f++) {
			  for (var s = 0 ; s < floorCanvases[f].shapes.length ; s++) {
				  if(floorCanvases[f].shapes[s].sid == sid) {
					  tmpShapes[sid] = floorCanvases[f].shapes[s];
					  sid2floor[sid] = floorCanvases[f].floor_name;
				  }
			  }
		  }
	  }
      var shapeCanvases = {};
		
	  if (1) {

		  
		  var appendData = "";  
	      appendData += '		    <div class="acc_single_booking_ap next_b" id="acc_single_booking'+bookingRequestWrap.bookID+'">'; 
		  appendData += '               <div id="close_booking_info_ap" >X</div>';
		  appendData += '           <div class="hidden__" style="display:none">';
		  appendData += '				<input style="display:none" name="pl_offcet" id="pl_offcet_'+bookingRequestWrap.bookID+'" value="'+bookingRequestWrap.placeOffcet+'" />';
		  appendData += '				<input style="display:none" name="book_time" id="book_time_'+bookingRequestWrap.bookID+'" value="'+bookTime+'" />';
		  appendData += '           </div>';
		  appendData += '			  <table class="sb_table" cellspacing="0" cellpadding="0" style="width: 100%;  height: 310px; border-collapse: collapse">';
		  appendData += '		       <tr class="ap_tbl_head_row">';
		  appendData += '                         <td><div class="confirm_head_ap">Review and Confirm</div></td>';
		  appendData += '              </tr>';
		  appendData += '		       <tr class="sb_tbl_head_row">';
		  appendData += '				 <td class="ap_place_name">';
		appendData += '					    <table  cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">';
		appendData += '						   <tr >';
		appendData += '						     <td class="ap_time_label_td"  style="width:33%">BOOKING ID</td>';
		appendData += '						     <td class="ap_time_label_td"  style="width:33%">BOOKING DATE</td>';	
		appendData += '						     <td class="ap_time_label_td"  style="width:33%;border-right:none!important;">TIME LEFT</td></tr>';	
		appendData += '						  <tr >';
		appendData += '						    <td class="ap_time_val_td"><div class="ap_time_val_div" name="sb_time_val_div">'+bookingRequestWrap.bookID+'</div></td>';
		appendData += '						    <td class="ap_time_val_td"><div class="ap_time_val_div" name="sb_time_val_div" id="sb_time_val_"></div></td> ';
	 	appendData += '						    <td class="ap_time_val_td"><div class="ap_time_val_div" name="sb_time_val_div"  id="sb_left_"></div></td></tr> ';
		appendData += '						</table>';
		appendData += '				     </td>';
		appendData += '				 </tr>';
		appendData += '				 <tr class="ap_info_row">';
		appendData += '				    <td class="sb_info_row_td">';
		appendData += '					  <table class="ap_allinfo_tbl" cellspacing="0" cellpadding="0" style="border-collapse: collapse">';
		appendData += '					    <tr >';
		appendData += '						  <td class="sb_listing_properties_td_wl">';
		appendData += '						     <div class="ap_prop ap_prop_num">No.</div>';
		appendData += '						     <div class="ap_prop ap_prop_im">Place</div>';
		appendData += '							 <div class="ap_prop ap_prop_name">Place name</div>';
		appendData += '							 <div class="ap_prop ap_prop_floor">Floor</div>';
		appendData += '							 <div class="ap_prop ap_prop_persons">Persons</div>';
		appendData += '						  </td>';
		appendData += '						</tr>';
		appendData += '						<tr class="sb_listing_row">';
		
	if(num_of_bookings > 3) {
		appendData += '						  <td class="sb_listing_td_wl">';
		appendData += '						     <div class="top_inset_shaddow"></div>';
		appendData += '						     <div class="ap_list_wrap_div">';	
	} else {
		appendData += '						  <td class="sb_listing_td_wl_none">';		
		appendData += '						     <div class="ap_list_wrap_div_none">';	
	}
			
	var borders_class="bordings_lr";
	if(num_of_bookings > 3)	{
		appendData += '							   <div class="ap_list_div" name="sb_list_div" id="sb_list_div-'+bookingRequestWrap.bookID+'">';
		appendData += '							    <div class="ap_list_shaddow" >';
		borders_class="bordings_lr";
		appendData += '							     <div class="as_padding_10 '+borders_class+'"></div>';
	} else {
	    appendData += '							   <div class="sb_list_div_no">';
		appendData += '							    <div class="sb_list_shaddow_no" >';
		appendData += '							     <div class="as_padding_10_none '+borders_class+'"></div>';
		borders_class="";
	}
		
	for (var bs = 0 ; bs < num_of_bookings ; bs++) {
	    var sid = bookingRequestWrap.bookingList[bs].sid;
	    var shape = tmpShapes[sid];
		var i = bs+1;
		appendData += '								     <div class="sb_single_sid '+borders_class+'">';
		appendData += '									   <table class="sb_single_sid_table" cellspacing="0" cellpadding="0" style="width: 100%;height:100%; border-collapse: collapse">';
		appendData += '									     <tr>';
		appendData += '										   <td class="ap_s_t_num">'+i+'</td>';
		appendData += '										   <td class="ap_s_t_img_td"><div class="sbimgd">';
		if(shape.type=="image") {
		     var src=document.getElementById(shape.options.imgID).src;
		     appendData += '										     <img class="sid_ovr_img" src="'+src+'=s50"/></div>';										  
		} else {
	        appendData += '										     <canvas  width="50" height="50" class="sid_ovr_canvas" id="sb_canvas-'+shape.sid+'"></canvas></div>';
		    var shape2ID = {};
		
		     shape2ID.id = 'sb_canvas-'+shape.sid;
		     shape2ID.shape = shape;
		     shapeCanvases.push(shape2ID);	
	    }
		appendData += '										   </td>';
		appendData += '										   <td class="ap_s_t_name_td">';
		appendData += '										      <span class="sb_sid_name">'+shape.booking_options.givenName+'</span>';
		appendData += '										   </td>';
		appendData += '										   <td class="ap_s_t_f_td">';
		appendData += '										      <span class="sb_sid_name">'+sid2floor[shape.sid]+'</span>';
		appendData += '										   </td>';
		appendData += '										   <td class="ap_s_t_p_td">';
		appendData += '										      <span class="sb_sid_name">'+shape.booking_options.minPersons+'</span>';
		appendData += '										   </td>';
		appendData += '										 </tr>';
		appendData += '									   </table>';
		appendData += '									 </div>';
	}	
	if(num_of_bookings > 3) {
		appendData += '									 <div class="as_padding_10  '+borders_class+'"></div>';
	} else {
		appendData += '									 <div class="as_padding_10_none  '+borders_class+'"></div>';
	}
		appendData += '									 </div>';
		appendData += '								   </div>';
		appendData += '								 </div>';
	if(num_of_bookings > 3) {
		appendData += '								 <div class="bottom_inset_shaddow"></div>';
	}
		appendData += '							  </div>';
		appendData += '							  </td>';
		appendData += '							</tr>';
		appendData += '						  </table>';
		appendData += '						</td>';
		appendData += '					 </tr>';
		appendData += '				  </table>';
		appendData += '		       <div class="login_bok_conf_tr">';
		appendData += '                            <table cellspacing="0" cellpadding="0" style="width: 100%;height:100%; border-collapse: collapse;margin-top: 6px;">';
		appendData += '							     <tr id="blcon_r" style="display:none">';
		appendData += '								   <td class="loginsa">';
		appendData += '								     <div class="dsdfs">Logged in as: </div><div id="login_info_resp_db" Title="LogOut" class="userNikname left_p" onclick="logoutAny()"></div>';
		appendData += '								   </td>';
		appendData += '								   <td class="tdblo">';
		appendData += '								     <div id="place_order_button_l" class="blue_b_button" onclick="SIapplyBooking()">BOOK</div>';
		appendData += '								   </td>';
		appendData += '								 </tr>';
		appendData += '								 <tr id="lpr_b"  style="display:none">';
		appendData += '								   <td colspan="2">';
		appendData += '								     <div id="logpbook">Please login to complete booking</div>';
		appendData += '								   </td>';
		appendData += '								 </tr>';
		appendData += '							  </table>';
		appendData += '              </div>';
		appendData += '				</div>';		

		$("#book_confirm_wrap").html("");
		$("#book_confirm_wrap").append(appendData);
		$("#close_booking_info_ap").click(function(){
	      $("#book_confirm_wrap").html("");
	      $("#book_confirm_wrap").hide();
	    });
		$("#logpbook").click(function(){
			  	$("#page_login_prompt").show();
		});
		  
		  d = new Date();
	      clientOffset = d.getTimezoneOffset();
		  var dateID ='sb_time_val_';
		  var time = bookTime;//UTC
		  var offsetSec = bookingRequestWrap.placeOffcet * 3600 + clientOffset * 60;
		  var totalSec = (time + offsetSec)*1000;
		  
		  var Date_ = new Date(bookTime*1000);
		  var day = Date_.getDate();
		  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		  var mon = monthNames[Date_.getMonth()];
		  var year = Date_.getFullYear();
		  var hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
		  var min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
		  $("#sb_time_val_").html(day+mon+" "+hour_+":"+min_);
		

		}
		// Update all shape canvases;
		for (var ind = 0 ; ind < shapeCanvases.length ; ind++) {
		  var id_ = shapeCanvases[ind].id;
		  var shape_ = shapeCanvases[ind].shape;
		  drawShapeCanvasOnBooking(id_,shape_);
		}
		var alllists =document.getElementsByName("sb_list_div");
	     for(var x=0; x < alllists.length; x++) {
		  var id_ = alllists[x].id;
		  $('#'+id_).slimScroll({
	        position: 'right',
	        height: '200px',
		    size: '10px',
	      });
		}
}
function createBookingJSON() {
	  bookingOrderJSONlist=[];
	  bookingOrderJSON = {};
	  bookingRequestWrap = {};
	  var bookID =  "book_"+randomString(15);
	  var testID = "temp_"+randomString(10);
	  var d = new Date();
	  var clientOffset = d.getTimezoneOffset();
	  var placeUTCoffset = document.getElementById("server_placeUTC").value;
	  var SecondsOfSliderPicker = place_slider_from*15*60;
	  var SecondsOfSliderPickerTo = place_slider_to*15*60;
	  
	  var TimePeriod = (SecondsOfSliderPickerTo - SecondsOfSliderPicker);
	  var TimeOfTheDatePicker_1970 = +$("#datepicker_fe").datepicker( "getDate" ).getTime()/1000;
	  
	  var dayOfweek = +$("#datepicker_fe").datepicker( "getDate" ).getDay();
		
	  
	  // Get selected shapes
	  for(var f=0;f < floorCanvases.length;f++) {
		     for(var s= 0 ; s < floorCanvases[f].listSelected.length;s++) {
		    	  var shape = floorCanvases[f].listSelected[s];
		    	  var sid = shape.sid;		    	  
		    	  var PID = document.getElementById("server_placeID").value;
		    	  var persons = shape.booking_options.minPersons;
		    	  
				  bookingOrderJSON = {"pid":PID,
			              "sid":sid,
			              "bookID":bookID,
			              "testID":testID,
			              "dateSeconds":TimeOfTheDatePicker_1970,
			              "time":SecondsOfSliderPicker,
			              "period":TimePeriod,
			              "persons":persons,
			              "clientOffset":clientOffset,
			              "placeOffcet":placeUTCoffset};
				  bookingOrderJSONlist.push(bookingOrderJSON);
		     }
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
	   }
	  }
	  bookingRequestWrap.bookingList = bookingOrderJSONlist;
	  bookingRequestWrap.weekday = dayOfweek;
}
function applyBooking() {
	

	  var bookingjson = {booking:JSON.stringify(bookingRequestWrap)};
	  
	  $.ajax({
	      url : "/clientBookingRequest",
	      data: bookingjson,//
	      beforeSend: function () { 
		      $("#book_confirm_wrap").html("");
		      $("#book_confirm_wrap").hide();
	    	   $("#place_order_button").hide();
	    	   $("#frame_book_ajax_gif").show(); 
	      },
	      success : function(data){	    
		      $("#book_confirm_wrap").html("");
		      $("#book_confirm_wrap").hide();
	    	  $("#frame_book_ajax_gif").hide();
	    	  $("#place_order_button").show();
	    	  console.log(data);
	    	 /* <div id="popup_message_wrap" style="display:none">
	    	    <div id="popup_message" >
	    	        <div id="message_data"></div>
	    	        <div id="close_popup_message" class="material-icons popup_close" id="close_pop_icon">clear</div>
	    	    </div>
	    	 </div>*/

	    	  if(data.added==true) {
	    		  popupMessage("Your booking accepted!","pop_green");
	    		  requestBookingAvailability();
	    	  } else {
	    		  popupMessage("Booking not accepted - Please try another time.","pop_red");
	    	  }
	    	 
	      },
	      dataType : "JSON",
	      type : "post"
	  });
	  console.log(bookingRequestWrap);
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
	    d = new Date();
	    clientOffset = d.getTimezoneOffset();
	    utc = d.getTime() + (clientOffset * 60000);
	    var placeDate = new Date(utc + 3600000 * offset);
	    var placeBooking = new Date(time_*1000);

		var remsec = placeBooking.getTime()/1000 - placeDate.getTime()/1000;
		var str = "";
		if (remsec > 0) {
			str +=  "<span style='color:rgb(255, 56, 56);'>";
			var rday = Math.floor(remsec / (3600*24));
			var rhour = Math.floor((remsec - rday*(3600*24))/3600);
			var rmin = Math.floor((remsec - rday*(3600*24) - rhour*3600)/60);
			var rsec = Math.floor(remsec - rday*(3600*24) - rhour*3600 - rmin *60 );
			if (rday>0) {str+=rday+'<span style="font-size:11px;">days</span> ';} 
			if (rhour>0) {str+=rhour+':';}  else {str+='0:';}
			if (rmin>9) {str+=rmin+':';} else if (rmin>0) {str+='0'+rmin+':';} else {str+='00:';}
			if (rsec>9) {str+=rsec+"</span>";} else {str+="0"+rsec+"</span>";};
			
		} else {
		    str = "<span style='color:rgb(0, 199, 33);'>0 sec</span>";
		}
	    return  str;
	}