function updateBookingListRange() {
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var currentDate = $( "#datepicker_wl_bottom" ).datepicker( "getDate" );
	var day = currentDate.getDate();
	var mon = monthNames[currentDate.getMonth()];
	var tomorrow = new Date();
	tomorrow.setDate(currentDate.getDate()+1);
	var nextDay = tomorrow.getDate();
	var nextMon = monthNames[tomorrow.getMonth()];
	$("#list_time_range").html(day+" "+mon+" - "+nextDay+" "+nextMon);
}


function updateReservationSpots(divid,spot_class) {
	var bid_fid = divid.replace(/^notif_ovrv_/, "");
	var json = JSON.parse($("#notify_places_input_"+bid_fid).val());
	var fid = json.fid;
	var bid = json.bid;
	var sids = json.sids;
	var sidsJson = {};
	var canvasLink = {};
	for(var i = 0 ; i <sids.length;i++) {
		var sidobj = {};
		sidobj.sid = sids[i].sid;
		sidobj.x=0;
		sidobj.y=0;
		sidobj.rx = 0;
		sidobj.ry = 0;
		sidobj.name = "";
		sidsJson[sids[i].sid] = sidobj;
	}
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
	if($("#notif_img_"+bid_fid).width() > 0) {
		var paddingLeft = ($("#"+divid).outerWidth(true) - $("#"+divid).width()) / 2;
		var paddingTop = ($("#"+divid).outerHeight(true) - $("#"+divid).height()) / 2;
		console.log(paddingLeft + " " + paddingTop);
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();  //spot_class
				var appendData = '<div class="'+spot_class+'" id="'+id_+'">'+sidsJson[key].name+'</div>';
				$("#"+divid).append(appendData);
				var elemWidth = $("#"+id_).outerWidth();
				var elemHeight = $("#"+id_).outerHeight();
				sidsJson[key].rx = sidsJson[key].x * ($("#notif_img_"+bid_fid).width()/canvasLink.origWidth);
				sidsJson[key].ry = sidsJson[key].y * ($("#notif_img_"+bid_fid).height()/canvasLink.origHeight);

				var cssleft = parseInt(sidsJson[key].rx + paddingLeft - elemWidth / 2);
				var csstop = parseInt(sidsJson[key].ry + paddingTop - elemHeight / 2);
				$("#"+id_).css("left",cssleft+"px");
				$("#"+id_).css("top",csstop+"px");
			}
		}
	} else {
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();
			}
		}
	}
}

function updatePopoverSpots(divid,spot_class,type) {
	var bid_fid;
	if(type == 'popover') {
		bid_fid = divid.replace(/^popover_ovrv_/, "");
	} else if (type == 'modal') {
		bid_fid = divid.replace(/^modal_ovrv_/, "");
	}

	var json = JSON.parse($("#"+type+"_places_input_"+bid_fid).val());
	var fid = json.fid;
	var bid = json.bid;
	var sids = json.sids;
	var sidsJson = {};
	var canvasLink = {};
	for(var i = 0 ; i <sids.length;i++) {
		var sidobj = {};
		sidobj.sid = sids[i].sid;
		sidobj.x=0;
		sidobj.y=0;
		sidobj.rx = 0;
		sidobj.ry = 0;
		sidobj.name = "";
		sidsJson[sids[i].sid] = sidobj;
	}
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
function getRelativeXY(floorID,sid,wrapID,imgID) {
	var paddingLeft = ($("#"+wrapID).outerWidth(true) - $("#"+wrapID).width()) / 2;
	var paddingTop = ($("#"+wrapID).outerHeight(true) - $("#"+wrapID).height()) / 2;

	var returnObj = {};
	returnObj.left = 0;
	returnObj.top = 0;
	returnObj.leftper = 0;
	returnObj.topper = 0

	var origSIDx = 0;
	var origSIDy = 0;

	for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		var floorid = floorCanvases[cf].floorid;
		if(floorID == floorid ) {
			canvasLink = floorCanvases[cf];
			for (var sd = 0 ; sd < floorCanvases[cf].shapes.length ; sd++) {
				if(sid == floorCanvases[cf].shapes[sd].sid) {
					origSIDx = floorCanvases[cf].shapes[sd].x;
					origSIDy = floorCanvases[cf].shapes[sd].y;
					break;
				}
			}
		}
	}
	returnObj.left = origSIDx * ($("#"+imgID).width()/canvasLink.origWidth);
	returnObj.top  = origSIDy * ($("#"+imgID).height()/canvasLink.origHeight);
	returnObj.leftper = 100.0 * returnObj.left / $("#"+imgID).width();
	returnObj.topper = 100.0 * returnObj.top / $("#"+imgID).height();

	returnObj.left  = parseInt(returnObj.left  + paddingLeft );
	returnObj.top = parseInt(returnObj.top + paddingTop );

	return returnObj;
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
function calculateDuration (seconds) {
	  // Update duration
	  var period = seconds;
	  var hour = Math.floor(period/3600);
	  var sec  = period - hour * 3600;
	  var minn = sec/60;
	  var htmld = "";
	  if(hour > 0) {
	    htmld = htmld + hour + " hours ";
	  }
	  if (minn > 0) {
	   htmld = htmld + minn + " minutes";
	  }
	  return htmld;
}
function getCurrentPlaceSeconds(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * offset));
	return nd.getTime()/1000;
}
function getCurrentUTCSeconds() {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = new Date(utc);
	return nd.getTime()/1000;
}

function calculateLeftTime(offset,from) {
    d = new Date();
    clientOffset = d.getTimezoneOffset();
    utc = d.getTime() + (clientOffset * 60000);
    var placeDate = new Date(utc + 3600000 * offset);
    var BrowserDate_as_BookingDate_seconds = parseInt(from) + parseInt(clientOffset) * 60 + parseInt(offset * 3600);
    var placeBooking = new Date(BrowserDate_as_BookingDate_seconds*1000);

	var remsec = placeBooking.getTime()/1000 - placeDate.getTime()/1000;
	var str = "";
	if (remsec > 0) {
		var rday = Math.floor(remsec / (3600*24));
		var rhour = Math.floor((remsec - rday*(3600*24))/3600);
		var rmin = Math.floor((remsec - rday*(3600*24) - rhour*3600)/60);
		if (rday>0) {str+=rday+'d';} 
		if (rhour>0) {str+=rhour+'h';}  else {str+='0h';}
		if (rmin>9) {str+=rmin+'m';} else if (rmin>0) {str+='0'+rmin+'m';} else {str+='0m';}
		
	} else {
	    str = "0sec";
	}
    return  str;
}
 
 

$(document).ready(function() {
setInterval(function(){
    var allof = document.getElementsByName("pl_offcet");
	for(var x=0; x < allof.length; x++) {
	   var plof = document.getElementById(allof[x].id).value;
	   var bid = allof[x].id.replace(/^pl_offcet_/, "");
	   var time_ = document.getElementById('book_time_'+bid).value;
       document.getElementById('sb_left_'+bid).innerHTML = calcRemainTimeBookingOpen(plof,time_);
	}
}, 1000);
});

function calcRemainTimeBookingOpen(offset,time_) {
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
var  notificationJSON = {};
var  notificationCounter = 0; 
function updateNotification(divid,notificationJSON) {
        var bookwrap = notificationJSON.message; 
		var fromDate = getBookDate(bookwrap.dateSeconds,bookwrap.time,bookwrap.placeOffcet);
		console.log(fromDate)
		var toDate = getBookDate(bookwrap.dateSeconds,parseInt(bookwrap.time+bookwrap.period),bookwrap.placeOffcet);
		var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		var shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	    var mon = monthNames[fromDate.getMonth()];
		var currentDate = new Date();

   var userName = "";
   var imgsrc = ""; 
   
   if(bookwrap.user.facebook == true) {
       userName = bookwrap.user.fbuser.name;
	   imgsrc = "http://graph.facebook.com/" + bookwrap.user.fbuser.id + "/picture"
   } else if (bookwrap.user.google == true) {
        userName = bookwrap.user.gouser.name;
		imgsrc = bookwrap.user.gouser.picture;
   }
	
   var phone = "";
   if(bookwrap.phone != undefined) {
      phone = bookwrap.phone ;
   }   
   var persons = 0;
   var sidsJSON = {};
   sidsJSON.bid = bookwrap.bookID;
   sidsJSON.fid ="";
   sidsJSON.sids = []; 
   for (var s = 0 ; s < bookwrap.bookingList.length ; s++ ) {
	    persons+=bookwrap.bookingList[s].persons;
		var sid = bookwrap.bookingList[s].sid;
		var obj = {};
		obj.sid = sid;
		sidsJSON.sids.push(obj); 
		for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		   var floor = floorCanvases[cf];
		   for (var sd = 0 ; sd < floor.shapes.length ; sd++) {
			 if(floor.shapes[sd].sid == sid) {
			    sidsJSON.fid = floor.floorid;
			 }			 
		  }
		}		
   } 
   
        var appendData = '';
		appendData +='		  <div class="panel panel-default ">';
		appendData +='				<div class="panel-heading collapsed notification_panel_head nnb_unread"  role="tab" id="headingOne_'+bookwrap.bookID+'" data-toggle="collapse" data-parent="#notification_accordion_new_booking" href="#collapseOne_'+bookwrap.bookID+'" aria-expanded="true" aria-controls="collapseOne">';
		appendData +='				     <div class="material-icons mat_nnr">local_dining</div>';
		appendData +='					 <div class="nrr">New reservation request:</div>';
		appendData +='					 <div class="nrr_at">'+fromDate.getDate()+' '+mon+' , from '+getLeadingZero(fromDate.getHours())+':'+getLeadingZero(fromDate.getMinutes())+' to '+getLeadingZero(toDate.getHours())+':'+getLeadingZero(toDate.getMinutes())+' ('+calculateDuration(bookwrap.period)+')</div>';
		appendData +='					 <div class="nrr_made">'+currentDate.getDate()+shortMonthNames[currentDate.getMonth()]+' '+getLeadingZero(currentDate.getHours())+':'+getLeadingZero(currentDate.getMinutes())+'</div>';
		appendData +='				</div>';
		appendData +='				<div id="collapseOne_'+bookwrap.bookID+'" class="panel-collapse collapse notification_collapsed" role="tabpanel" aria-labelledby="headingOne_'+bookwrap.bookID+'">';
		appendData +='				  <div class="panel-body" >';
		appendData +='					<div class="container-fluid">';
		appendData +='					   <div class="row">';
		appendData +='					     <div class="col-sm-7"  >';
		appendData +='					      <div class="row contact_header_notif">';
		appendData +='						    <div class="col-sm-1"  >';
		appendData +='						     <img id="fg_profile_img" src="'+imgsrc+'">';
		appendData +='							</div>';
		appendData +='							<div class="col-sm-11"  >';
		appendData +='							  <span class="notification_name_">'+userName+'</span>';
		appendData +='							  <span class="label label-success notif_phone_label">'+phone+'</span>';
		appendData +='							</div>';
		appendData +='						  </div>';
		appendData +='						  <div class="row">';
		appendData +='							<div class="col-sm-12"  >';
		appendData +='							   <ul class="list-group notif_book_info"> ';
		appendData +='								  <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">event</i>'+fromDate.getDate()+' '+mon+'</li>';
		appendData +='								  <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">schedule</i>'+getLeadingZero(fromDate.getHours())+':'+getLeadingZero(fromDate.getMinutes())+' - '+getLeadingZero(toDate.getHours())+':'+getLeadingZero(toDate.getMinutes())+'</li>';
		appendData +='								  <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">group</i>'+persons+' persons</li>';
		appendData +='								  <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">pin_drop</i>'+bookwrap.bookingList.length+' tables</li>';
		appendData +='							  </ul>';
		appendData +='							</div>     ';                             
		appendData +='						  </div>';

		appendData +='						</div>			';					
		appendData +='						<div class="col-sm-5"  >';
		appendData +='							    <div class="thumbnail notif_ovrv_img" name="notification_overview_tmb" id="notif_ovrv_BID__'+bookwrap.bookID+'_FID__'+sidsJSON.fid+'">';
		appendData +='								  <input type="text" id="notify_places_input_BID__'+bookwrap.bookID+'_FID__'+sidsJSON.fid+'" style="display:none" value=\''+JSON.stringify(sidsJSON)+'\'/>';
		appendData +='								  <img  id="notif_img_BID__'+bookwrap.bookID+'_FID__'+sidsJSON.fid+'" name="notif_ovrv" src="'+$("#server_overview_"+sidsJSON.fid).attr("src")+'">';
		appendData +='								</div>';
		appendData +='						</div>';
		appendData +='					  </div>';
		appendData +='						  <div class="row notif_buttons_row">';
		appendData +='							<div class="col-sm-12 "  >	';	
        appendData +='                              <button class="btn   notif_btn notif_btn btn-success"   ><i class="material-icons notif_btn_mat">done</i><span class="btn_link_text">Accept reservation</span></button>';		
		appendData +='                              <button class="btn   notif_btn  notif_btn btn-danger"  ><i class="material-icons notif_btn_mat">block</i><span class="btn_link_text">Decline</span></button>';		
		appendData +='                              <button class="btn    notif_btn  notif_btn btn-default"   ><i class="material-icons notif_btn_mat">play_circle_outline</i><span class="btn_link_text">Preview on timeline</span></button>';		
		appendData +='							</div>';
		appendData +='						  </div>';		
		appendData +='					</div>';
		appendData +='				  </div>';
		appendData +='				</div>';
		appendData +='			  </div>';
		
		$("#"+divid).prepend(appendData);
		var newNotificationsCnt = parseInt($("#new_note_cnt").html());
		newNotificationsCnt = newNotificationsCnt+1;
		if(newNotificationsCnt > 0) {
		   $("#new_note_cnt").html(newNotificationsCnt);
		   $("#new_note_cnt").show();
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
function updateBidDataOnPopover(popover_hidden_wrap_id,tl_canvas_selection) {
   var bid = tl_canvas_selection.bid;
   var bshape = {};
   for (var i = 0 ; i < bookingsManager.allBookings.length ; i ++ ) {
     if(bookingsManager.allBookings[i].bid == bid ) {
	   bshape = bookingsManager.allBookings[i];
	   break;
	 }
   }
    
   var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
   var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);

   var userName = "";
   var imgsrc = ""; 
  // console.log(bshape);
   if(bshape.user.facebook == true) {
       userName = bshape.user.fbuser.name;
	   imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture"
   } else if (bshape.user.google == true) {
        userName = bshape.user.gouser.name;
		imgsrc = bshape.user.gouser.picture;
   }
	
   var phone = "";
   if(bshape.user.phone != undefined) {
      phone = bshape.user.phone ;
   }   
   var persons = 0;
   var sidsJSON = {};
   sidsJSON.bid = bshape.bid;
   sidsJSON.fid ="";
   sidsJSON.sids = []; 
   for (var s = 0 ; s < bshape.namesList.length ; s++ ) { 
		var sid = bshape.namesList[s].sid;
		var obj = {};
		obj.sid = sid;
		sidsJSON.sids.push(obj); 
		for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		   var floor = floorCanvases[cf];
		   for (var sd = 0 ; sd < floor.shapes.length ; sd++) { 
			 if(floor.shapes[sd].sid == sid) {
			    sidsJSON.fid = floor.floorid;
			 }			 
		  }
		}		
   } 
   	 var appendData = '';
	 appendData+= '<div class="container-fluid">';
	 appendData+= '	  <div class="row popup_tl_top_row">';
	 appendData+= '	    <div class="col-sm-7 "  >';
	 appendData+= '			<div class="panel_bid_name"  >'+userName;
	 appendData+= '			</div>';
	 appendData+= '			<div class="panel_bid_time"  >'+date_;
	 appendData+= '			</div>';
	 appendData+= '		</div>';
	 appendData+= '		<div class="col-sm-5"  >';
	 appendData+= '		   <span class="label label-success panel_phone">'+phone+'</span>';
	 appendData+= '		</div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row popover_floor_img_row">';
	 appendData+= '	      <div class="col-sm-12 popover_floor_img_sm"  >';
	 appendData+= '		    <div class="thumbnail thumbnail_popover_img" name="popover_overview_tmb"  id="popover_ovrv_BID__'+bshape.bid+'_FID__'+sidsJSON.fid+'">';
     appendData +='               <input type="text" id="popover_places_input_BID__'+bshape.bid+'_FID__'+sidsJSON.fid+'" style="display:none" value=\''+JSON.stringify(sidsJSON)+'\'/>';	 
	 	 
	 appendData+= '		        <img class="popover_tl_fl_img" id="popover_img_BID__'+bshape.bid+'_FID__'+sidsJSON.fid+'" src="'+$("#server_overview_"+sidsJSON.fid).attr("src")+'"/>';
	 appendData+= '			</div>';
	 appendData+= '		  </div>';
	 appendData+= '	  </div>';
	 appendData+= '	  <div class="row popover_btns_row">';
	 appendData+= '	    <div class="col-sm-3 text_align_center"> ';	   
	 appendData+= '	    <i class="material-icons mat_bl_hid hover_green"  title="Show on place" onclick="SingleBookingButton(\'show_on_place\',\''+bshape.bid+'\')">location_searching</i></div>';
	 appendData+= '		<div class="col-sm-3 text_align_center"> ';	  
	 appendData+= '	    <i class="material-icons mat_bl_hid hover_blue"   title="Send eMail message" onclick="SingleBookingButton(\'open_message_modal\',\''+bshape.bid+'\')">email</i></div>';
	 appendData+= '		<div class="col-sm-3 text_align_center">		';	  
	 appendData+= '	    <i class="material-icons mat_bl_hid  hover_red"    title="Cancel reservation"  onclick="SingleBookingButton(\'cancel\',\''+bshape.bid+'\')">cancel</i> </div>';	 
	 appendData+= '		<div class="col-sm-3 text_align_center">';
	 appendData+= '	    <i class="material-icons mat_bl_hid hover_black"  title="Details" onclick="SingleBookingButton(\'info\',\''+bshape.bid+'\')" title="Details">info_outline</i></div>';
	 appendData+= '	  </div>';
	 appendData+= '	</div>';
    $("#"+popover_hidden_wrap_id).children().html(appendData);  
}
function updateAdminLinePopover(popover_hidden_wrap_id,sid_shape) {
    var ra_color_class;
	var name = sid_shape.booking_options.givenName;
	var bookable;
	if(sid_shape.booking_options.bookable) {
	   ra_color_class = "grey"; 
	   bookable = "checked";
	} else {
	   ra_color_class = "grey";
	   bookable = "";
	}
    var appendData = '';
	appendData+='    <div class="container-fluid">	';  
	appendData+='	  <div class="row popup_tl_top_row admin_range_popover_head">';	    
	appendData+='	      <div class="col-sm-12 ">		';
 	appendData+='            <button type="button" class="close close_x_popover" onclick="$(&quot;.popover&quot;).popover(&quot;hide&quot;);" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	appendData+='		     <div class="ra_sid_name " style="background-color:'+ra_color_class+'">'+name+'</div><div class="ra_panel_bid_name"></div> 		';
	appendData+='          </div>   ';
	appendData+='     </div>	';  
	appendData+='	 <div class="row ro_range_row">	  ';    

	appendData+='		<div class="col-sm-8 ">';
	appendData+='			<div class="ro_line_book_option">Is bookable</div>';				
	appendData+='		</div>	 			';
	appendData+='		<div class="col-sm-4 ">';
	appendData+='			<input type="checkbox"  id="book-enable-'+sid_shape.sid+'" class="bookable_toggle" data-toggle="toggle" data-onstyle="success" '+bookable+' />';				
	appendData+='		</div>	 			';
	appendData+='	 </div>	  ';
	appendData+='    </div>  ';
	$("#"+popover_hidden_wrap_id).children().html(appendData);  
	

}

function updateAdminSelectionPopover(popover_hidden_wrap_id,tl_canvas_selection ) {

    var sid;
	var ra_color_class;
	var type = tl_canvas_selection.type
	var ra_header_text ;
	var buttons ;
    if(type =="adminReserved") {
	    sid = tl_canvas_selection.sid;
		ra_color_class = 'ra_sid_name_reserved'
		ra_header_text = 'Reserved';
		buttons = '<div class="ro_btn_bot ro_btn_bot_reserved" onclick="SingleBookingButton(\'cancel_reserved\',\''+tl_canvas_selection.bid+'_BS_'+sid+'\')">CANCEL RESERVATION</div>'
	} else {
	    sid = tl_canvas.SIDsorted[tl_canvas_selection.line];
		ra_color_class = 'ra_sid_name_selected'
		ra_header_text = 'Range options';
		buttons = '<div class="ro_btn_bot ro_btn_bot_select" onclick="SingleBookingButton(\'set_reserved\',\'TMPBID_BS_'+sid+'\')">RESERVE</div>'
	}
    
	var shape = tl_canvas.pshapes[sid];
	var name = shape.name;
	var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
	var fromDate = getBookDateFrom(tl_canvas_selection.from,placeOffset);
	var toDate = getBookDateFrom(tl_canvas_selection.to,placeOffset);
	
	var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]; 
	var mon = monthNames[fromDate.getMonth()];
		
    var appendData = '';
	appendData+='    <div class="container-fluid">	';  
	appendData+='	  <div class="row popup_tl_top_row admin_range_popover_head">';	    
	appendData+='	      <div class="col-sm-12 ">		';
 	appendData+='            <button type="button" class="close close_x_popover" onclick="$(&quot;.popover&quot;).popover(&quot;hide&quot;);" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	appendData+='		     <div class="ra_sid_name '+ra_color_class+'">'+name+'</div><div class="ra_panel_bid_name">'+ra_header_text+'</div> 		';
	appendData+='          </div>   ';
	appendData+='     </div>	';  
	appendData+='	 <div class="row ro_date_row">	  '; 
	appendData+='	    <div class="col-sm-12 ro_date_col">'+fromDate.getDate()+' '+mon+'</div>';
	appendData+='    </div>	';
	appendData+='	 <div class="row ro_range_row">	  ';    
	appendData+='	    <div class="col-sm-5 ">';
    appendData+='           	<input id="ro_from_time" class="ro_time_input  " value="'+getLeadingZero(fromDate.getHours())+':'+getLeadingZero(fromDate.getMinutes())+'" readonly/>	';    
	appendData+='		</div>	 ';
	appendData+='		<div class="col-sm-2 ">';
    appendData+='           	<div class="pop_range_time_line">-</div>	 ';   
	appendData+='		</div>	 ';
	appendData+='		<div class="col-sm-5 ">';
	appendData+='			<input id="ro_to_time" class="ro_time_input "  value="'+getLeadingZero(toDate.getHours())+':'+getLeadingZero(toDate.getMinutes())+'" readonly/>	';				
	appendData+='		</div>	 			';
	appendData+='	 </div>	  ';
	appendData+='	 <div class="row popover_btns_row ro_pbr">';
    appendData+='';
    appendData+='        <div class="col-sm-6 ">';
    appendData+='            ';
    appendData+='         </div>		';
    appendData+='         <div class="col-sm-6 ">';
    appendData+='            '+buttons+'';
    appendData+='         </div>			';	 
	appendData+='	 </div>	';
	appendData+='    </div>  ';
	$("#"+popover_hidden_wrap_id).children().html(appendData);  
}

 

function addAdminReservation(sid) {
   var adminSelection = tl_canvas.adminSelection; 
   var from = adminSelection.from;
   var to = adminSelection.to;
   var name = tl_canvas.shapeViews[sid].booking_options.givenName;
   var persons = tl_canvas.shapeViews[sid].booking_options.maxPersons;
   var bshape = new BShape(tl_canvas, from , to , "TEMP" , persons , "adminReserved",name,sid);
   var bshapelist = tl_canvas.pshapes[sid].bookings;
   bshapelist.push(bshape);
   tl_canvas.setPshapeBookings(sid,bshapelist);
    $('#canvas_timeline_admin_popover').popover('hide');
}
function updateFloorSidDataOnPopover(popover_hidden_wrap_id,bidsid_) {
     //$("#canvas_popover_wrap").html(bidsid);
	 var bidsid = bidsid_.replace(/pin_id_/,"").split("_BS_");
	 var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
	 
	 var bid = bidsid[0];
	 var sid = bidsid[1];
	 var nextbshapelist = [];
	 var bshape ;
	 var placeName = "";
	 var requiredFloorName ;
	 var fid;
	 console.log(bid + " " + sid);
	 for(var bl = 0 ; bl < bookingsManager.currentBookings.length ; bl ++) {
	   if(bookingsManager.currentBookings[bl].bid == bid) {
	      bshape = bookingsManager.currentBookings[bl] ;
		  for(var s = 0 ; s < bshape.namesList.length ; s++) {
		     if(bshape.namesList[s].sid == sid ) {
			     placeName = bshape.namesList[s].name;
				 requiredFloorName = bshape.namesList[s].floorname;
			 }
		  }
		  break;
	   }
	 }
	 for(var bl = 0 ; bl < bookingsManager.nextBookings.length ; bl ++) {
	    var nbshape = bookingsManager.nextBookings[bl];
		for(var s = 0 ; s < nbshape.namesList.length ; s++) {
		    if(nbshape.namesList[s].sid == sid ) {
			   if(nbshape.user.facebook == true) {
				   nbshape.user.userName = nbshape.user.fbuser.name;
				   nbshape.user.imgsrc = "http://graph.facebook.com/" + nbshape.user.fbuser.id + "/picture"
			   } else if (nbshape.user.google == true) {
					nbshape.user.userName = nbshape.user.gouser.name;
					nbshape.user.imgsrc = nbshape.user.gouser.picture;
			   }			
			   nbshape.textdate = calculateShowDate(nbshape.from,placeOffset,nbshape.to);
			   nbshape.bidsid = nbshape.bid + "_BS_" + sid;
			   nextbshapelist.push(nbshape);
			}
		}
	 }
	 
     var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);

	   var userName = "";
	   var imgsrc = ""; 
	   
	   if(bshape.user.facebook == true) {
		   userName = bshape.user.fbuser.name;
		   imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture"
	   } else if (bshape.user.google == true) {
			userName = bshape.user.gouser.name;
			imgsrc = bshape.user.gouser.picture;
	   }
		
	   var phone = "";
	   if(bshape.user.phone != undefined) {
		  phone = bshape.user.phone ;
	   }  
	 var shape;
	 for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
	    if(floorCanvases[cf].floor_name == requiredFloorName) {
		   fid = floorCanvases[cf].floorid;
		   for(var s = 0 ; s < floorCanvases[cf].shapes.length;s++) {
		      if(floorCanvases[cf].shapes[s].sid == sid) {
			     shape = floorCanvases[cf].shapes[s];
			  }
		   }
		}
	 }
	 var appendData = '';
	 appendData += ' <div class="container-fluid">';
	 appendData += ' 	  <div class="row popup_floor_top_row">';
	 appendData += '	     <div class="col-sm-8">';
	 appendData += '		   <div class="popover_sid_name">'+placeName+'</div>';
	 appendData += '		 </div>';
	 appendData += '		 <div class="col-sm-4">';
	 appendData += '		     <i class="material-icons popover_sid_persons_mat">people</i> ';
	 if(shape.booking_options.minPersons == shape.booking_options.maxPersons ) {
	         appendData += '			 <div class="popover_sid_persons">'+shape.booking_options.maxPersons+'</div>';
	 } else {
	         appendData += '			 <div class="popover_sid_persons">'+shape.booking_options.minPersons+'..'+shape.booking_options.maxPersons+'</div>';
	 }
	 
	 appendData += '		 </div>';
	 appendData += '	  </div>';
	 appendData += '	  <div class="popup_scroll_wrap" id="popup_scroll-max400">';
	 appendData += '		  <div class="row ">';
	 appendData += '			<div class="col-sm-12 popover_splitter color_green">Current</div>  	';	  
	 appendData += '		  </div>		 '; 
	 appendData += '		  <div class="row ">';
	 if(nextbshapelist.length > 0 ) {
	    appendData += '		   <div class="list-group margin_bottom_0">';
	 } else {
	    appendData += '		   <div class="list-group ">';
	 }
	 
	 appendData += '			 <div class="list-group-item padding_none">';
	 appendData += '			   <div class="single_popover_list_book" id="prapra">';
	 appendData += '				    <div class="container-fluid padding_none">';
	 appendData += '				      <div class="col-sm-2 padding_none single_popover_list_book">';
	 appendData += '					     <img class="pop_usr_img" src="'+imgsrc+'"/>';
	 appendData += '					  </div>';
	 appendData += '					  <div class="col-sm-9 padding_none single_popover_list_book">';
     appendData += '                          <div class="panel_bid_name fontsize14">'+userName+'</div>';
	 appendData += '						   <div class="panel_bid_time fontsize12">'+date_+'  '+bshape.persons+' persons</div> ';
	 appendData += '					  </div>';
	 appendData += '					  <div class="col-sm-1 padding_none single_popover_list_book">';
	 appendData += '					       <div class="material-icons mat_drop_pan hover_black"  id="dropdownMenu_pop_'+bidsid_+'"  data-toggle="collapse"  href="#collapseOne_'+bidsid_+'" aria-expanded="false" aria-controls="collapseOne_'+bidsid_+'"  >expand_more</div>';
	 appendData += '						   <div class="material-icons mat_drop_pan hover_black hidden"  id="dropupMenu_pop_'+bidsid_+'"  data-toggle="collapse"  href="#collapseOne_'+bidsid_+'" aria-expanded="false" aria-controls="collapseOne_'+bidsid_+'"  >expand_less</div>';
	 appendData += '					  </div>';
	 appendData += '				  </div>';
	 appendData += '			   </div>';
	 appendData += '			   <div id="collapseOne_'+bidsid_+'" class="popover_single_hidden_menu panel-collapse collapse "  role="tabpanel" aria-labelledby="prapra">';
	 appendData += '                  <div class="container-fluid padding_none">';
	 appendData += '	                <div class="col-sm-3  single_popover_list_book padding_none">';
	 appendData += '	                    <span class="badge back_success" title="Booking number">'+bshape.num+'</span>';
	 appendData += '	                </div>';
	 appendData += '	                <div class="col-sm-9  single_popover_list_book padding_none ">';
	 appendData += '			         <div class="hidden_pop_btns hover_orange" data-toggle="tooltip" data-container="body" data-placement="top" title="Finished" onclick="SingleBookingButton(\'finished\',\''+bidsid_+'\')"><i class="material-icons mat_indrop" >timelapse</i></div>';
	 appendData += '					 <div class="hidden_pop_btns hover_black" data-toggle="tooltip" data-container="body" data-placement="top" title="Info" onclick="SingleBookingButton(\'info\',\''+bidsid_+'\')"><i class="material-icons mat_indrop">receipt</i></div>';
	 appendData += '					 <div class="hidden_pop_btns hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on timeline" onclick="SingleBookingButton(\'timeline\',\''+bidsid_+'\')"><i class="material-icons mat_indrop">view_list</i></div>';
	 appendData += '			    	 <div class="hidden_pop_btns hover_red" data-toggle="tooltip" data-container="body" data-placement="top" title="Not attended" onclick="SingleBookingButton(\'not_attended\',\''+bidsid_+'\')"><i class="material-icons mat_indrop">mood_bad</i></div>';
	 appendData += '			      </div>';
	 appendData += '			     </div>';	 
	 appendData += '			   </div>';
	 appendData += '			 </div>';
	 appendData += '		   </div>	';	   
	 appendData += '		  </div>';
	 
	// appendData += '<div class="row ">			<div class="col-sm-12 popover_splitter color_blue_grey">Tomorow</div>'; getBookDateFrom(from_,placeOffset)
if(nextbshapelist.length > 0 ) {
	 appendData += '		  <div class="row ">';
	 appendData += '			<div class="col-sm-12 popover_splitter color_blue_grey">Next</div>  	';	  
	 appendData += '		  </div>';
     var today = new Date();
	 var todayDay = today.getDate();
	 var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	 var currentListDate = todayDay;
	 if(getBookDateFrom(nextbshapelist[0].from,placeOffset).getDate() > todayDay) {
	     var nextBookingDate = getBookDateFrom(nextbshapelist[0].from,placeOffset)
		 appendData += '		  <div class="row ">';
		 appendData += '			<div class="col-sm-12 date_popover_splitter">'+nextBookingDate.getDate()+" " + monthNames[nextBookingDate.getMonth()]+'</div>  	';	  
		 appendData += '		  </div>';
		 currentListDate = nextBookingDate.getDate();
	 }
	 appendData += '		  <div class="row ">';
	 appendData += '			<ul class="list-group">';
  
  for(var n = 0 ; n < nextbshapelist.length ; n++) {
     var   bshape = nextbshapelist[n]; 
	 if(n > 0 && getBookDateFrom(nextbshapelist[n].from,placeOffset).getDate() != currentListDate) {
	 	 appendData += '			</ul>';
	     appendData += '		  </div>';
		 var nextBookingDate = getBookDateFrom(nextbshapelist[n].from,placeOffset)
		 appendData += '		  <div class="row ">';
		 appendData += '			<div class="col-sm-12 date_popover_splitter">'+nextBookingDate.getDate()+" " + monthNames[nextBookingDate.getMonth()]+'</div>  	';	  
		 appendData += '		  </div>';
		 appendData += '		  <div class="row ">';
	     appendData += '			<ul class="list-group">';		 
		 currentListDate = nextBookingDate.getDate();
	 }
	 appendData += '			 <div class="list-group-item padding_none">';
	 appendData += '			   <div class="single_popover_list_book" id="prapra">';
	 appendData += '				    <div class="container-fluid padding_none">';
	 appendData += '				      <div class="col-sm-2 padding_none single_popover_list_book">';
	 appendData += '					     <img class="pop_usr_img" src="'+bshape.user.imgsrc+'"/>';
	 appendData += '					  </div>';
	 appendData += '					  <div class="col-sm-9 padding_none single_popover_list_book">';
     appendData += '                          <div class="panel_bid_name fontsize14">'+bshape.user.userName+'</div>';
	 appendData += '						   <div class="panel_bid_time fontsize12">'+bshape.textdate+'  '+bshape.persons+' persons</div> ';
	 appendData += '					  </div>';
	 appendData += '					  <div class="col-sm-1 padding_none single_popover_list_book">';
	 appendData += '					       <div class="material-icons mat_drop_pan hover_black"  id="dropdownMenu_pop_'+bshape.bidsid+'"  data-toggle="collapse"  href="#collapseOne_'+bshape.bidsid+'" aria-expanded="false" aria-controls="collapseOne_'+bshape.bidsid+'"  >expand_more</div>';
	 appendData += '						   <div class="material-icons mat_drop_pan hover_black hidden"  id="dropupMenu_pop_'+bshape.bidsid+'"  data-toggle="collapse"  href="#collapseOne_'+bshape.bidsid+'" aria-expanded="false" aria-controls="collapseOne_'+bshape.bidsid+'"  >expand_less</div>';
	 appendData += '					  </div>';
	 appendData += '				  </div>';
	 appendData += '			   </div>';
	 appendData += '			   <div id="collapseOne_'+bshape.bidsid+'" class="popover_single_hidden_menu panel-collapse collapse "  role="tabpanel" aria-labelledby="prapra">';
	 appendData += '                  <div class="container-fluid padding_none">';
	 appendData += '	                <div class="col-sm-3  single_popover_list_book padding_none">';
	 appendData += '	                    <span class="badge back_blue_grey" title="Booking number">'+bshape.num+'</span>';
	 appendData += '	                </div>';
	 appendData += '	                <div class="col-sm-9  single_popover_list_book padding_none ">';
	 appendData += '			         <div class="hidden_pop_btns hover_black" data-toggle="tooltip" data-container="body" data-placement="top" title="Change place" onclick="SingleBookingButton(\'change_place\',\''+bshape.bidsid+'\')"><i class="material-icons mat_indrop" >repeat</i></div>';
	 appendData += '					 <div class="hidden_pop_btns hover_black" data-toggle="tooltip" data-container="body" data-placement="top" title="Info" onclick="SingleBookingButton(\'info\',\''+bshape.bidsid+'\')"><i class="material-icons mat_indrop">receipt</i></div>';
	 appendData += '					 <div class="hidden_pop_btns hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on timeline" onclick="SingleBookingButton(\'timeline\',\''+bshape.bidsid+'\')"><i class="material-icons mat_indrop">view_list</i></div>';
	 appendData += '			    	 <div class="hidden_pop_btns hover_red" data-toggle="tooltip" data-container="body" data-placement="top" title="Cancel reservation" onclick="SingleBookingButton(\'cancel\',\''+bshape.bidsid+'\')"><i class="material-icons mat_indrop">cancel</i></div>';
	 appendData += '			      </div>';
	 appendData += '			     </div>';	 
	 appendData += '			   </div>';
	 appendData += '			 </div>';	 
	 
    }	 
	 
	 appendData += '			</ul>';
	 appendData += '		  </div>';
	 
}
	 appendData += '	  </div>';
	 appendData += '	</div>';
	 
	 $("#"+popover_hidden_wrap_id).children().html(appendData); 

}
$(document).ready(function() { 
	$('.pin_ongoing').click(function(e) { 
	    
		showFloorPopover(e.pageX, e.pageY,$(this).attr("id"));
	});
});


function updateOnclickModal(type,bid_) { 
   var bshape = {};
   for (var i = 0 ; i < bookingsManager.allBookings.length ; i ++ ) {
     if(bookingsManager.allBookings[i].bid == bid_ ) {
	   bshape = bookingsManager.allBookings[i];
	   break;
	 }
   }
    
   var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
   var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);

   var userName = "";
   var imgsrc = ""; 
   
   if(bshape.user.facebook == true) {
       userName = bshape.user.fbuser.name;
	   imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture"
   } else if (bshape.user.google == true) {
        userName = bshape.user.gouser.name;
		imgsrc = bshape.user.gouser.picture;
   }
	
   var phone = "";
   if(bshape.user.phone != undefined) {
      phone = bshape.user.phone ;
   }   
   var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
   var BookingDate = getBookDateFrom(bshape.from,placeOffset)

   var sidsJSON = {};
   sidsJSON.bid = bshape.bid;
   sidsJSON.fid ="";
   sidsJSON.sids = []; 
   for (var s = 0 ; s < bshape.namesList.length ; s++ ) { 
		var sid = bshape.namesList[s].sid;
		var obj = {};
		obj.sid = sid;
		sidsJSON.sids.push(obj); 
		for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		   var floor = floorCanvases[cf];
		   for (var sd = 0 ; sd < floor.shapes.length ; sd++) { 
			 if(floor.shapes[sd].sid == sid) {
			    sidsJSON.fid = floor.floorid;
			 }			 
		  }
		}		
   } 
   
   $("#"+type+"_modal_id_badge").html(bshape.num);
   
	var appendData = '';
    appendData+='	 <div class="row">';
	appendData+='	    <div class="col-md-1 ">';
	appendData+='		   <img class="pop_usr_img" src="'+imgsrc+'">';
	appendData+='		</div>';
	appendData+='		<div class="col-md-7 ">';
	appendData+='		    <span class="modal_in_name">'+userName+'</span><span class="modal_inf_pers"> ('+bshape.persons+' persons)</span><br>';
	appendData+='		    <div class="modal_in_time left" >'+date_+' , '+BookingDate.getDate()+" " + monthNames[BookingDate.getMonth()]+'</div>';
	appendData+='		</div> ';
	appendData+='		<div class="col-md-4">';
	appendData+='		    <div class="phnwrap  ">	';	    
	appendData+='			     <div class="material-icons upicn left">phone</div>		';    
	appendData+='				 <div class="phoneuserwl left label label-success">'+phone+'</div>	';	  
	appendData+='		    </div>';
	appendData+='		</div>';
	appendData+='	  </div>';
	appendData+='	  <div class="row">';
	appendData+='	     <div class="col-md-12 ">';
	appendData+='		   <div class="panel panel-default margin_bottom_0 margin_top_15">';
	appendData+='			  <div class="panel-heading">Places details</div>';
	appendData+='			  <div class="panel-body">';
	appendData+='				<div class="row">';
	appendData+='				   <div class="col-md-6 ">';
	for(var t = 0 ; t < bshape.namesList.length ; t++ ) {
	    var nn = parseInt(t+1);
		appendData+='		               <div class="row">';
		appendData+='					      <div class="col-md-2 ">'+nn+'</div>';
		appendData+='						  <div class="col-md-2 padding_none table_list_text">'+bshape.namesList[t].name+'</div>';
		appendData+='						  <div class="col-md-4 padding_none text_right table_list_text">'+bshape.namesList[t].floorname+'</div>';
		appendData+='						  <div class="col-md-4 padding_none text_right table_list_text">'+bshape.namesList[t].persons+' persons</div>';
		appendData+='					   </div>';
	}
	appendData+='		           </div>';
	appendData+='				   <div class="col-md-6 ">';
	appendData+='				     <div class="thumbnail thumbnail_popover_img" name="modal_overview_tmb" id="modal_ovrv_BID__'+bshape.bid+'_FID__'+sidsJSON.fid+'">   ';	
	appendData +='                      <input type="text" id="modal_places_input_BID__'+bshape.bid+'_FID__'+sidsJSON.fid+'" style="display:none" value=\''+JSON.stringify(sidsJSON)+'\'/>';	 
	appendData+= '		                <img class="popover_tl_fl_img" id="modal_img_BID__'+bshape.bid+'_FID__'+sidsJSON.fid+'" src="'+$("#server_overview_"+sidsJSON.fid).attr("src")+'"/>';

	appendData+='					 </div>';
	appendData+='		           </div>';
	appendData+='				</div>';
	appendData+='			  </div>';
	appendData+='			</div>';
	appendData+='		 </div>';
	appendData+='	  </div>';
	
	if(type=="cancelation_info") {
	  appendData+='    <div class="alert  well-sm alert-warning alert-dismissible fade in margin_top_10 margin_bottom_0" role="alert"> ';
	  appendData+='		  <strong>Note:</strong> Cancelation eMail will be sent to client.';
	  appendData+='	  </div>';
	}
	$("#"+type+"_modal_body").html(appendData);
	
	if(type=="cancelation_info") {
	   appendData = "";
	   appendData+=' <button type="button" class="btn btn-default-custom" data-dismiss="modal">Close</button>';
	   appendData+=' <button type="button" class="btn  btn-danger-custom" onclick="InteractiveCancelReservation(\''+bshape.bid+'\')">Cancel reservation</button> ';
	   $("#"+type+"_modal_buttonons").html(appendData);
	}
	
	
	
}
function updateMessageModal(bid_) {
   var bshape = {};
   for (var i = 0 ; i < bookingsManager.allBookings.length ; i ++ ) {
     if(bookingsManager.allBookings[i].bid == bid_ ) {
	   bshape = bookingsManager.allBookings[i];
	   break;
	 }
   }
 
   var email ;
   if(bshape.user.facebook == true) {
       bshape.userName = bshape.user.fbuser.name;
	   bshape.imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture";
	   email = bshape.user.fbuser.email;
   } else if (bshape.user.google == true) {
        bshape.userName = bshape.user.gouser.name;
		bshape.imgsrc = bshape.user.gouser.picture;
		email = bshape.user.gouser.email;
   }
   $("#modal_email_name").html(bshape.userName);
   
   var appendData = ''
   appendData+='   <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
   appendData+='   <button type="button" class="btn btn-primary" onclick="SingleBookingButton(\'send_message\',\''+bid_+'\',\''+email+'\')">Send message</button>';
   $("#send_message_modal_buttonons").html(appendData);
   $("#contact_email_modal_text").val('');
   
}

function highlightSids(bid_) {
   var bshape = {};
   for (var i = 0 ; i < bookingsManager.allBookings.length ; i ++ ) {
     if(bookingsManager.allBookings[i].bid == bid_ ) {
	   bshape = bookingsManager.allBookings[i];
	   break;
	 }
   }
   var floor = floorNames[bshape.namesList[0].floorname];
 
   $("#floors_open").click();
   $("#floor_tab_mv_"+floor.floorid).click();
   canvas_.listSelected = [];
   for(var nl = 0 ; nl < bshape.namesList.length ; nl ++ ) {
      for(var s = 0 ; s < canvas_.shapes.length; s++ ) {
	     if(canvas_.shapes[s].sid == bshape.namesList[nl].sid) {
		    canvas_.listSelected.push(canvas_.shapes[s]);
		 }
	  }
   }
   canvas_.valid = false;
}
function highlightTimeline(bid_) { 
   tl_canvas.selectSameBookingByBid(bid_);
   $("#timeline_open").click();
}



 