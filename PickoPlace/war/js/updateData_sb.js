  var sid2img = {};
  var img2url = {};
function updateBookings(append_div,data,future) {
  var shapeCanvases = [];

  for (var s=0;s<data.JSONSIDlinks.length;s++) {
	  sid2img[data.JSONSIDlinks[s].sid] = data.JSONSIDlinks[s].imageID;	  
  }
  for (var s1=0;s1<data.JSONimageID2url.length;s1++) {
	  img2url[data.JSONimageID2url[s1].imageID] = data.JSONimageID2url[s1].gcsUrl;	  
  }

  if(future) {} else {/*var tmp = data.bookings.reverse(); data.bookings = tmp;*/}
   for (var b=0;b < data.bookings.length ; b++) {
	  if(future) {
	      currently_loaded_future +=1;
	  } else {
		  currently_loaded_past +=1;  
	  }
      var bok = data.bookings[b];
	  var bid = bok.bookID;
	  var pid = bok.pid;
      var rated = false;
      var ratlist = [];
	  if(!future) {
		if(bok.rating != undefined) {
			if((bok.rating.fscore + bok.rating.lscore + bok.rating.sscore) > 0) {
				rated = true;
			}
		}
	  }
	  var appendData = "";  
	  if((future && currently_loaded_future == 1) ||(!future && currently_loaded_past==1)) {
         appendData += '		    <div class="acc_single_booking next_b" id="acc_single_booking'+bid+'">';      
	  } else {
		 appendData += '		    <div class="acc_single_booking next_b" id="acc_single_booking'+bid+'" style="border-top:none!important;">';   
	  }
	  appendData += '           <div class="hidden__" style="display:none">';
	  appendData += '				<input style="display:none" name="pl_offcet" id="pl_offcet_'+bid+'" value="'+bok.placeInfo.placeOffcet+'" />';
	  appendData += '				<input style="display:none" name="book_time" id="book_time_'+bid+'" value="'+bok.time+'" />';
	  appendData += '           </div>';
	  appendData += '			  <table class="sb_table" cellspacing="0" cellpadding="0" style="width: 100%;  height: 100%; border-collapse: collapse">';
	  appendData += '		     <tr class="sb_tbl_head_row">';
	  appendData += '				   <td class="sb_place_name">';
	if (bok.placeInfo.placeLogo == "") {
	  appendData += '				     <div class="sb_logo"><img class="sb_logo_img" src="img/pp.png"/></div>';
	} else {
	  appendData += '				     <div class="sb_logo"><img class="sb_logo_img" src="'+bok.placeInfo.placeLogo+'"/></div>';
	}	
	appendData += '					 <div class="sb_name_div">';
	appendData += '						 <table class="sb_place_name_addr_tbl" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '						   <tr class="sb_place_name_row"><td class="sb_place_name_td">';
	appendData += '					<div class="sb_place_name_div" id="sb_place_name_div_'+pid+'">'+bok.placeInfo.userPlace.place+','+bok.placeInfo.userPlace.branch+'</div>';
	appendData += '						  </td></tr>';
	appendData += '						  <tr class="sb_place_addr_row"><td class="sb_place_addr_td">';
	appendData += '								<div class="sb_place_addr_div" id="sb_place_addr_div_'+pid+'">'+bok.placeInfo.userPlace.Address;
	appendData += '								  <input style="display:none" id="sb_lat_'+pid+'" value="'+bok.placeInfo.userPlace.Lat+'" />';
	appendData += '								  <input style="display:none" id="sb_lng_'+pid+'" value="'+bok.placeInfo.userPlace.Lng+'" />';
	appendData += '								</div>';
	appendData += '					      </td></tr>';
	appendData += '						  </table>';
	appendData += '				      </div>';
	appendData += '				      <div class="sb_time">';
	appendData += '					    <table class="sb_time_tbl" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '						   <tr class="sb_time_label_tr"><td class="sb_time_label_td">BOOKING DATE</td></tr>';
	appendData += '						   <tr class="sb_time_val_tr"><td class="sb_time_val_td"><div class="sb_time_val_div" name="sb_time_val_div" id="sb_time_val_'+bid+'"></div></td></tr> ';
	appendData += '						</table>';
	appendData += '					  </div>';
	appendData += '					  <div class="sb_time" style="float:right!important">';
	appendData += '					    <table class="sb_time_tbl" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '						   <tr class="sb_time_label_tr"><td class="sb_time_label_td">TIME LEFT</td></tr>';
	appendData += '						   <tr class="sb_time_val_tr"><td class="sb_time_val_td"><div class="sb_time_val_div" name="sb_time_val_div"  id="sb_left_'+bid+'"></div></td></tr> ';
	appendData += '						</table>';
	appendData += '					  </div>';
	appendData += '				   </td>';
	appendData += '				   <td rowspan="2" class="sb_buttons_td">';
	if(future) {	
	appendData += '					 <div class="sb_change sb_button" id="sb_change-'+bid+'">Change Booking</div>';
	appendData += '					 <div class="sb_printable sb_button" id="sb_print-'+bid+'">Print</div>';
	appendData += '					 <div class="sb_drop_link" id="drop_PID">';
	appendData += '						 <ul id="drop_'+bid+'" class="menu_drop_sb" name="menu_drop_sb">';
	appendData += '						  <li><a href="#" class="menu_drop_sb_a">More actions &#9776;</a>';
	appendData += '							  <ul class="booking-single-submenu">';
	appendData += '								<li class="sb_drop_li"><a  onclick="cancelBooking(this)"  class="sb_drop_a clientCancelBooking" id="sb_cancel_'+bid+'">Cancel booking</a></li>';
	appendData += '								<li class="sb_drop_li"><a  onclick="cancelBooking(this)"  class="sb_drop_a" id="sb_contact_'+pid+'">Contact place</a></li>';
	appendData += '								<li class="sb_drop_li"><a onclick="cancelBooking(this)" class="sb_drop_a" id="sb_notify_'+bid+'">Send notification</a></li>';
	appendData += '							  </ul>';
	appendData += '						  </li>';
	appendData += '						  </ul>';
	appendData += '					  </div>';
	} else {
		if(rated) {
			appendData += '	<div class="ratedb" >';
            appendData += '	  <table cellspacing="0" cellpadding="0" style="border-collapse: collapse;margin-left: auto;margin-right: auto;">';
            if(bok.rating.fscore > 0) {
            	var ratdiv = "RAT_"+randomString(10)+"___"+bok.rating.fscore;
            	ratlist.push(ratdiv);
	            appendData += '    <tr><td colspan="2" class="ratn" >Food</td></tr>';
	            appendData += '    <tr><td><div class="donerating" id="'+ratdiv+'"></div></td><td class="ratval">'+bok.rating.fscore+'</td></tr>';
            }
            if(bok.rating.sscore > 0) {
            	var ratdiv = "RAT_"+randomString(10)+"___"+bok.rating.sscore;
            	ratlist.push(ratdiv);
	            appendData += '	   <tr><td colspan="2" class="ratn">Staff</td></tr>';
	            appendData += '    <tr><td><div class="donerating" id="'+ratdiv+'"></div></td><td class="ratval">'+bok.rating.sscore+'</td></tr>';
            }
            if(bok.rating.lscore > 0) {
            	var ratdiv = "RAT_"+randomString(10)+"___"+bok.rating.lscore;
            	ratlist.push(ratdiv);
               appendData += '     <tr><td colspan="2" class="ratn">Location</td></tr>';
               appendData += '     <tr><td><div class="donerating" id="'+ratdiv+'"></div></td><td class="ratval">'+bok.rating.lscore+'</td></tr>   '; 
            }
            appendData += '   </table>	';	  
            appendData += '</div>	';		
		} else {
			appendData += '	<div class="ratedb" id="ratingInteractive-'+bid+'"></div>'; 
			appendData += '					 <div class="sb_feedback_btn sb_button" id="sb_feedback-'+bid+'"  onclick="openFeedback(\''+bid+'\',\''+pid+'\');">Leave feedback</div>';	
			appendData += '					 <div id="fedback_drop-'+bid+'" name="fedback_drop" class="fedback_drop"></div>';
		}

	}
	appendData += '				   </td>';
	appendData += '				 </tr>';
	appendData += '				 <tr class="sb_info_row">';
	appendData += '				    <td class="sb_info_row_td">';
	appendData += '					  <table class="sb_allinfo_tbl" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '					    <tr >';
	appendData += '						  <td rowspan="2" class="sb_image_td">';
	appendData += '						     <div class="sb_img_div" id="sb_img_div-'+pid+'">';
	appendData += '							  <img class="sb_overview_img" src="'+bok.placeInfo.userPlace.overviewCloudURL+'"/>';
	appendData += '							 </div>';
	appendData += '						  </td>';
	appendData += '						  <td class="sb_listing_properties_td">';
	appendData += '						     <div class="sb_prop sb_prop_num">No.</div>';
	appendData += '						     <div class="sb_prop sb_prop_im">Place</div>';
	appendData += '							 <div class="sb_prop sb_prop_name">Place name</div>';
	appendData += '							 <div class="sb_prop sb_prop_floor">Floor</div>';
	appendData += '							 <div class="sb_prop sb_prop_persons">Persons</div>';
	appendData += '						  </td>';
	appendData += '						  <td class="sb_other_data_td" rowspan="2">';
	appendData += '						     <table class="other_data_sb" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '							   <tr >';
	appendData += '							    <td class="other_data_tbl_head your_booking"><div class="your_booking_div">BOOKING DETAILS</div></td>';
	appendData += '							   </tr>';
	appendData += '							   <tr class="other_data_info_row">';
	appendData += '							    <td class="other_data_info_td">';
	appendData += '								   <table class="sb_od_t" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '								     <tr >';
	appendData += '									   <td class="sb_od_na">Persons</td><td class="sb_od_val">'+bok.totalPersons+'</td></tr>';
	appendData += '									 <tr >';
	appendData += '									   <td class="sb_od_na">Spots</td><td class="sb_od_val">'+bok.shapesList.length+'</td></tr> '; 
	appendData += '									 <tr >';
	appendData += '									   <td class="sb_od_na">Date</td><td class="sb_od_val" id="sb_od_date-'+bid+'"></td></tr> ';
     appendData += '                                     <tr >';
	appendData += '									   <td class="sb_od_na">Period</td><td class="sb_od_val" id="sb_duration-'+bid+'"></td></tr> 		';								   
	appendData += '								   </table>';
	appendData += '								</td>';
	appendData += '							  </tr>';
	appendData += '							  <tr >';
	appendData += '							    <td class="other_data_tbl_head place_info_t"><div class="place_info_t_div">PLACE INFO</div></td>';
	appendData += '							   </tr>';
	appendData += '							   <tr class="other_data_info_row">';
	appendData += '							    <td class="other_data_info_td">';
	appendData += '								   <table class="sb_od_t" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	if (bok.placeInfo.rating != 'undefined') {
		appendData += '								     <tr >';
		appendData += '									   <td class="sb_od_na">Rating</dt><td class="sb_od_val">'+bok.placeInfo.rating+'</dt></tr>';
	}
	if (bok.placeInfo.placeMail != 'undefined' && bok.placeInfo.placeMail != "") {
		appendData += '									 <tr >';
		appendData += '									   <td class="sb_od_na">Mail</dt><td class="sb_od_val">'+bok.placeInfo.placeMail+'</dt></tr>  ';
		}
	if (bok.placeInfo.placePhone != 'undefined' && bok.placeInfo.placePhone != "") {
		appendData += '									 <tr >';
		appendData += '									   <td class="sb_od_na">Phone</dt><td class="sb_od_val">'+bok.placeInfo.placePhone+'</dt></tr>  ';
	}
	if (bok.placeInfo.placeSiteURL != 'undefined' && bok.placeInfo.placeSiteURL != "") {
	appendData += '									 <tr >';
	appendData += '									   <td class="sb_od_na">Site</dt><td class="sb_od_val">'+bok.placeInfo.placeSiteURL+'</dt></tr> '; 
	}
	appendData += '								   </table>';
	appendData += '								</td>';
	appendData += '							  </tr>';
	appendData += '							 </table>';
	appendData += '						  </td>';
	appendData += '						</tr>';
	appendData += '						<tr class="sb_listing_row">';
	appendData += '						  <td class="sb_listing_td">';
if(bok.shapesList.length > 3) {
	appendData += '						     <div class="top_inset_shaddow"></div>';
} 
	appendData += '						     <div class="sb_list_wrap_div">';		
var borders_class="bordings_lr";
if(bok.shapesList.length > 3)	{
	appendData += '							   <div class="sb_list_div" name="sb_list_div" id="sb_list_div-'+bid+'">';
	appendData += '							    <div class="sb_list_shaddow" >';
	borders_class="bordings_lr";
} else {
    appendData += '							   <div class="sb_list_div_no">';
	appendData += '							    <div class="sb_list_shaddow_no" >';
	borders_class="";
}
	appendData += '							     <div class="as_padding_10 '+borders_class+'"></div>';
for (var bs = 0 ; bs < bok.shapesList.length ; bs++) {
    var shape = bok.shapesList[bs];
	var i = bs+1;
	appendData += '								     <div class="sb_single_sid '+borders_class+'">';
	appendData += '									   <table class="sb_single_sid_table" cellspacing="0" cellpadding="0" style="width: 100%;height:100%; border-collapse: collapse">';
	appendData += '									     <tr>';
	appendData += '										   <td class="sb_s_t_num">'+i+'</td>';
	appendData += '										   <td class="sb_s_t_img_td"><div class="sbimgd">';
if(shape.shapeInfo.type == "image") {
	appendData += '										     <img class="sid_ovr_img" src="'+img2url[sid2img[shape.sid]]+'"/></div>';
} else {
    appendData += '										     <canvas  width="50" height="50" class="sid_ovr_canvas" id="sb_canvas-'+bid+'-'+shape.sid+'"></canvas></div>';
	var shape2ID = {};
	shape2ID.id = 'sb_canvas-'+bid+'-'+shape.sid;
	shape2ID.shape = shape;
	shapeCanvases.push(shape2ID);
	
}
	appendData += '										   </td>';
	appendData += '										   <td class="sb_s_t_name_td">';
	appendData += '										      <span class="sb_sid_name">'+shape.shapeInfo.name+'</span>';
	appendData += '										   </td>';
	appendData += '										   <td class="sb_s_t_f_td">';
	appendData += '										      <span class="sb_sid_name">'+shape.shapeInfo.floorname+'</span>';
	appendData += '										   </td>';
	appendData += '										   <td class="sb_s_t_p_td">';
	appendData += '										      <span class="sb_sid_name">'+shape.persons+'</span>';
	appendData += '										   </td>';
	appendData += '										 </tr>';
	appendData += '									   </table>';
	appendData += '									 </div>';
}	
	appendData += '									 <div class="as_padding_10  '+borders_class+'"></div>';
	appendData += '									 </div>';
	appendData += '								   </div>';
	appendData += '								 </div>';
if(bok.shapesList.length > 3) {
	appendData += '								 <div class="bottom_inset_shaddow"></div>';
}
	appendData += '							  </td>';
	appendData += '							</tr>';
	appendData += '						  </table>';
	appendData += '						</td>';
	appendData += '					 </tr>';
	appendData += '				  </table>';
	appendData += '				</div>';
	
	$("#"+append_div).append(appendData);
	  d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var dateID ='sb_time_val_'+bid;
	  var time = bok.time;//UTC
	  var offsetSec = bok.placeInfo.placeOffcet * 3600 + clientOffset * 60;
	  var totalSec = (time + offsetSec)*1000;
	
	  var Date_ = new Date(parseInt(totalSec));
	  var day = Date_.getDate();
	  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	  var mon = monthNames[Date_.getMonth()];
	  var year = Date_.getFullYear();
	  var hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
	  var min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
	  $("#sb_time_val_"+bid).html(day+mon+" "+hour_+":"+min_);
	  $("#sb_od_date-"+bid).html(day+mon+" "+hour_+":"+min_);
	  // Update duration
	  var period = bok.period;
	  var hour = Math.floor(period/3600);
	  var sec  = period - hour * 3600;
	  var minn = sec/60;
	  var htmld = "";
	  if(hour > 0) {
	    htmld = htmld + hour + " hours ";
	  }
	  if (minn > 0) {
	   htmld = htmld + minn + " min";
	  }
	  $("#sb_duration-"+bid).html(htmld);
	  
		// FEEDBACK

		for(var i =  0 ; i < ratlist.length ; i++) {
			var id = ratlist[i];
			var numl = id.split("___");
			var num = parseInt(numl[1]);
			$('#'+id).raty({ score: num ,path:'raty/images',readOnly: true,space: false});
		}	  
	  
	}
	// Update all shape canvases;
  // console.log(shapeCanvases);
	for (ind in shapeCanvases) {
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
	var allmenu =document.getElementsByName("menu_drop_sb");
	for(var x=0; x < allmenu.length; x++) {
	  var id_ = allmenu[x].id;
	   $('#'+id_).dropit();
	}
	


}
function cancelBooking(this_) {
	   setSessionData(function(result) {
		   if(result) {
			    var id = this_.id;
			    var bid = this_.id.replace(/^sb_cancel_/, "");
			    $.ajax({
				    url : "/clientCancelBooking",
				    data: {bid:bid},//
				    success : function(data){
				    	console.log(data);
				    	if(data.status == "removed") {
				    	   window.location.reload(true);
				    	} else if (data.status == "nouser") {
				    	   window.location.href("/");
				    	}
				    },
				    dataType : "JSON",
				    type : "post"
				});
		   } else {
			   updatePageView();
		   }});
}
$(document).ready(function() {
setInterval(function(){
    var allof =document.getElementsByName("pl_offcet");
	for(var x=0; x < allof.length; x++) {
	   var plof = document.getElementById(allof[x].id).value;
	   var bid = allof[x].id.replace(/^pl_offcet_/, "");
	   var time_ = document.getElementById('book_time_'+bid).value;
       document.getElementById('sb_left_'+bid).innerHTML = calcRemainTime(plof,time_);
	}
}, 1000);
});

function calcRemainTime(offset,time_) {
    d = new Date();
    clientOffset = d.getTimezoneOffset();
    utc = d.getTime() + (clientOffset * 60000);
    var placeDate = new Date(utc + 3600000 * offset);
    var BrowserDate_as_BookingDate_seconds = parseInt(time_) + parseInt(clientOffset) * 60 + parseInt(offset * 3600);
    var placeBooking = new Date(BrowserDate_as_BookingDate_seconds*1000);

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
function drawShapeCanvasOnBooking(canvasID , shape) {
  var c = document.getElementById(canvasID);
  var ctx = c.getContext("2d");
  ctx.clearRect( 0 , 0 , 50 , 50 );
    var lineColor = shape.shapeInfo.options.lineColor;
	var fillColor = shape.shapeInfo.options.fillColor ;
	var x = 25;
	var y = 25;
	var width = shape.shapeInfo.w;
	var height = shape.shapeInfo.h;
	var alpha = shape.shapeInfo.options.alpha;
	var salpha = shape.shapeInfo.options.salpha;
	var sw = shape.shapeInfo.options.sw;
	var rel = 1;
	if (width > 44 || height > 44) {
			if (width > height) {
				rel = 44 / width;
			} else {
				rel = 44 / height;
			}
	}
	if (rel*sw < 1) { sw = 1; } else { sw = sw * rel ;} ;
  if (shape.shapeInfo.type == "round") {
  
	var rad = shape.shapeInfo.options.roundRad;	
	dbRoundRect(ctx,x,y,parseInt(width*rel),parseInt(height*rel),lineColor,fillColor,alpha,salpha,sw,rad);
	
  } else if (shape.shapeInfo.type == "circle") {
  
	rad = (width<height)?width:height;
	startA = 0;
	endA = 360;
	dbCircle(ctx , x, y, parseInt(rel*rad) ,parseInt(rel*rad), startA, endA ,lineColor,fillColor,alpha,salpha,sw);
	
  } else if (shape.shapeInfo.type == "trapex") {
   // console.log(width+" " +height + " " + sw + " " + rel);
	dbTrapez (ctx,x,y, parseInt(rel*width), parseInt(rel*height),lineColor,fillColor,alpha,salpha,sw,shape.shapeInfo.options.cutX);

  } else if (shape.shapeInfo.type == "rectangle") {

	dbDrawRect(ctx,x,y, parseInt(rel*width), parseInt(rel*height),lineColor,fillColor,alpha,salpha,sw);

  }  
}


function dbDrawRect(ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw) {
  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }


  ctx.globalAlpha = alpha;
  ctx.fillRect(x-w/2,y-h/2,w,h);
  ctx.globalAlpha = salpha;
  if (sw > 0) {
    ctx.strokeRect(x-w/2,y-h/2,w,h);
  }
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}

function dbRoundRect (ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,R) {
//
//    (cx,cy)   (cx+r,cy)   (cx+w/2,cy)      (cx+w-r,cy)  (cx+w,cy)      
//    (cx,cy+r)                                           (cx+w,cy+r)
//    (cx,cy+h/2)                                         (cx+w,cy+h/2)
//    (cx,cy+h-r)                                         (cx+w,cy+h-r)
//    (cx,cy+h) (cx+r,cy+h) (cx+w/2,cy+h)   (cx+w-r,cy+h) (cx+w,cy+h)
//
//
//
 ctx.save();
  var r = R;
  var cx = x-w/2;
  var cy = y-h/2;
  ctx.lineWidth = sw;
  
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }
  if (w<h) {
     
         r = R * (w / 2)  / 100;
     
  } else {
         r = R * (h / 2) / 100;  
  }
	ctx.globalAlpha = salpha;
    ctx.beginPath();
    ctx.moveTo(cx+w/2,cy);
    ctx.lineTo(cx+w-r,cy);
    ctx.quadraticCurveTo(cx+w,cy,cx+w,cy+r);
    ctx.lineTo(cx+w,cy+h-r);
    ctx.quadraticCurveTo(cx+w,cy+h,cx+w-r,cy+h);
    ctx.lineTo(cx+r,cy+h);
    ctx.quadraticCurveTo(cx,cy+h,cx,cy+h-r);
    ctx.lineTo(cx,cy+r);
    ctx.quadraticCurveTo(cx,cy,cx+r,cy);
    ctx.lineTo(cx+w/2,cy);
	ctx.globalAlpha = alpha;
    ctx.fill();
	if (sw > 0) {
	  ctx.globalAlpha = salpha;
      ctx.stroke();
	  }
	ctx.globalAlpha = 1; 
    ctx.lineWidth = 1;
	ctx.restore();
}

function dbCircle (ctx , x, y, w , h, startAngle, endAngle,strokeColor,fillColor,alpha,salpha,sw) {

  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  startAngle = Math.radians(startAngle);
  endAngle = Math.radians(endAngle);
  var radius;
  if (w <=h ) {
     radius = w / 2;
  } else {
     radius = h / 2;
  }
    if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, true);
  ctx.globalAlpha = alpha;
  ctx.fill();
  if(sw>0) {
    ctx.globalAlpha = salpha;
    ctx.stroke();
	}
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}

function dbTrapez (ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,cutx) {
//
//    (cx,cy)  (cx+cutX,y)___________(cx+w-cutX,y)  (cx+w,cy)      
//           /                                 \
//          /                                   \
//         /                                     \
//    (cx,cy+h)----------------------------------(cx+w,cy+h)
//
//
//

  var cx = x-w/2;
  var cy = y-h/2;
  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
    if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }
  var cutX = w / 2 * cutx  / 100; // cutx in percentage

     if (w/2 <= cutX) {
         cutX = w/2;
     }
  ctx.globalAlpha = salpha;
    ctx.beginPath();
    ctx.moveTo(cx+cutX,cy);
    ctx.lineTo(cx+w-cutX,cy);
    ctx.lineTo(cx+w,cy+h);
    ctx.lineTo(cx,cy+h);
    ctx.lineTo(cx+cutX,cy);
	ctx.closePath();
  ctx.globalAlpha = alpha;
  ctx.fill();
  if (sw > 0) {
    ctx.globalAlpha = salpha;
    ctx.stroke();
  }
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}
function dbLine(ctx,x1,y1,x2,y2,width,alpha,color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.restore();
}
function dbText(ctx,x,y,text,font_bold,font_stle,font_size,font_color,alpha,shadow,shadow_x,shadow_y,shadow_blur,shadow_color) {
  ctx.save();
  ctx.fillStyle = font_color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (shadow!='undefined' && shadow == true) {
    ctx.shadowColor = shadow_color;
    ctx.shadowOffsetX = shadow_x;
    ctx.shadowOffsetY = shadow_y;
    ctx.shadowBlur = shadow_blur;
  }
  ctx.globalAlpha = alpha;
  ctx.font = font_bold + " " + font_size + "pt " + font_stle;
  ctx.fillText(text, x, y);
  ctx.restore();
}
Math.degrees = function(rad)
{
return rad*(180/Math.PI);
}

Math.radians = function(deg)
{
return deg * (Math.PI/180);
}
function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}