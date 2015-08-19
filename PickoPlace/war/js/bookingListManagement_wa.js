/**
 * 
 */
function BShapeAll( from , to , bid , persons , type , namesList , places , num) {
  "use strict";
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 

  this.from = from;
  this.to = to;
  this.type = type;
  this.bid = bid;
  this.persons = persons;
  this.namesList = namesList;
  this.places = places;
  this.num = num;
}

function BookingListManager () {
   this.allBookings = [];
   this.newBookings = [];
   
   this.currentBookingsHash = {};
   this.currentBookings = [];
   
   this.pastBookingsHash = {};
   this.pastBookings = [];
   
   this.nextBookingsHash = {};
   this.nextBookings = [];
   
   this.offset = parseFloat(document.getElementById("server_placeUTC").value);
   myState = this;
   setInterval(function() { myState.monitore(); }, 10000);
}
BookingListManager.prototype.clear = function() {
	   for (var b = 0 ; b < this.allBookings.length ; b++) {
	      var bid = this.allBookings[b].bid;
		  this.removeBookingDraw(bid);
	   }
	   this.allBookings = [];
	   this.newBookings = [];
	   
	   this.currentBookingsHash = {};
	   this.currentBookings = [];
	   
	   this.pastBookingsHash = {};
	   this.pastBookings = [];
	   
	   this.nextBookingsHash = {};
	   this.nextBookings = [];
}
BookingListManager.prototype.monitore = function() {   
   if(this.newBookings.length > 0 ) {
      for (var nb = 0 ; nb < this.newBookings.length ; nb++ ) {
	     var bshape = this.newBookings[nb];
	     if(bshape.to < (new Date()).getTime()/1000) {
		    console.log(bshape.bid + " " + bshape.to + " " + (new Date()).getTime()/1000);
		    this.addToPast(bshape);
			this.DrawToPast(bshape.bid);
		 } else if (bshape.from > (new Date()).getTime()/1000) {
		    this.addToNext(bshape);
			this.DrawToNext(bshape.bid);
		 } else {
		 console.log(bshape.bid + " " + bshape.to + " " + (new Date()).getTime()/1000);
		    this.addToCurrent(bshape);
			this.DrawToCurrent(bshape.bid);
		 }
	  }
	  this.newBookings = [];
   }
   // Move from Next to Current
   var tmpNextBookings = [];
   var bookingsRemovedFromNext = [];
   for (var nb = 0 ; nb < this.nextBookings.length ; nb++) {
      var bshape = this.nextBookings[nb];
      if(bshape.from <= (new Date()).getTime()/1000) {
	     bookingsRemovedFromNext.push(bshape);
		 this.nextBookingsHash[bid] = null;
		 this.removeBookingDraw(bshape.bid);
	  } else {
	     tmpNextBookings.push(bshape);
	  }
   }
   this.nextBookings  = tmpNextBookings;
   for ( var tc = 0 ; tc < bookingsRemovedFromNext.length ; tc ++) {
		var bshape = bookingsRemovedFromNext[tc];
		this.addToCurrent(bshape);
		this.DrawToCurrent(bshape.bid);
   }
   // Move from Current to Past 
   var tmpCurrentBookings = [];
   var bookingsRemovedFromCurrent = [];
   for (var cb = 0 ; cb < this.currentBookings.length ; cb++) {
      var bshape = this.currentBookings[cb];
      if(bshape.to < (new Date()).getTime()/1000) {
	     bookingsRemovedFromCurrent.push(bshape);
		 this.currentBookingsHash[bid] = null;
		 this.removeBookingDraw(bshape.bid);
	  } else {
	     tmpCurrentBookings.push(bshape);
	  }
   }
   this.currentBookings  = tmpCurrentBookings;
   for ( var tc = 0 ; tc < bookingsRemovedFromCurrent.length ; tc ++) {
		var bshape = bookingsRemovedFromCurrent[tc];
		this.addToPast(bshape);
		this.DrawToPast(bshape.bid);
   }
   // Update Time Left for Next Bookings
    var allof =document.getElementsByName("wl_list_nwxt_lwft");
	for(var x=0; x < allof.length; x++) {
	   var from = parseInt(document.getElementById(allof[x].id).value);
	   var bid = allof[x].id.replace(/^book_wa_from_input_/, "");
       document.getElementById('wl_list_next_sh_left-'+bid).innerHTML = calculateLeftTime(this.offset,from);
	}
}
BookingListManager.prototype.addToCurrent = function(bshape) {
  var idx = this.currentBookings.length;
  for (var i  = 0 ; i <  this.currentBookings.length ; i++ )
  {
     if(i==0) {
	   if(bshape.to <= this.currentBookings[i].to) {
	     idx=0;
		 break;
	   }
	 } else {
	    if(this.currentBookings[i-1].to < bshape.to && bshape.to <= this.currentBookings[i].to) {
		    idx=i;
			break;
		}
	 }
  }
   this.currentBookings.splice(idx,0,bshape);
   this.currentBookingsHash[bshape.bid]=bshape;
}
BookingListManager.prototype.addToNext= function(bshape) {
  var idx = this.nextBookings.length;
  for (var i  = 0 ; i <  this.nextBookings.length ; i++ )
  {
     if(i==0) {
	   if(bshape.from <= this.nextBookings[i].from) {
	     idx=0;
		 break;
	   }
	 } else {
	    if(this.nextBookings[i-1].from < bshape.from && bshape.from <= this.nextBookings[i].from) {
		    idx=i;
			break;
		}
	 }
  }
   this.nextBookings.splice(idx,0,bshape);
   this.nextBookingsHash[bshape.bid]=bshape;
}
BookingListManager.prototype.addToPast= function(bshape) {
  var idx = this.pastBookings.length;
  for (var i  = 0 ; i <  this.pastBookings.length ; i++ )
  {
     if(i==0) {
	   if(bshape.to <= this.pastBookings[i].to) {
	     idx=0;
		 break;
	   }
	 } else {
	    if(this.pastBookings[i-1].to < bshape.to && bshape.to <= this.pastBookings[i].to) {
		    idx=i;
			break;
		}
	 }
  }
   this.pastBookings.splice(idx,0,bshape);
   this.pastBookingsHash[bshape.bid]=bshape;
}
BookingListManager.prototype.addBooking = function(bshape) {
   this.allBookings.push(bshape);
   this.newBookings.push(bshape);
   this.monitore();
}

BookingListManager.prototype.removeBookingDraw = function(bid) {
    var elementID  = 'wl_list_bid-'+bid;
	var element = document.getElementById(elementID);
	if (element != null) {
		element.outerHTML = "";
		delete element;
	}
}
BookingListManager.prototype.removeBooking = function(bid) {
   this.removeBookingDraw(bid);
   if (this.currentBookingsHash[bid] != null ) {
      var bshape = this.currentBookingsHash[bid];
      this.currentBookingsHash[bid] = null;
	  this.currentBookings.remove(bshape);
	  this.allBookings.remove(bshape);
   } else if (this.pastBookingsHash[bid] != null ) {
      var bshape = this.pastBookingsHash[bid];
      this.pastBookingsHash[bid] = null;
	  this.pastBookings.remove(bshape);
	  this.allBookings.remove(bshape);
   } else if (this.nextBookingsHash[bid] != null ) {
      var bshape = this.nextBookingsHash[bid];
      this.nextBookingsHash[bid] = null;
	  this.nextBookings.remove(bshape);
	  this.allBookings.remove(bshape);
   } 
}
BookingListManager.prototype.DrawToCurrent = function(bid) {
   var appendID = "append_current_wl_list";
   var afterName = "wa_current_list";
   var bshape = this.currentBookingsHash[bid];
   var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
   var date_ = calculateShowDate(bshape.from,placeOffset);
   var period_ = calculateDuration(bshape.to - bshape.from);
	  
   var appendData = "";
    appendData += '<div class="wl_list_booking wl_current_" id="wl_list_bid-'+bshape.bid+'" name="wa_current_list" onclick="DisplayBooking(\''+bshape.bid+'\')">';
	appendData += '  <div class="hidden__" style="display:none">';
	appendData += '		<input style="display:none" id="book_wa_from_input_'+bshape.bid+'" value="'+bshape.from+'" />';
	appendData += '		<input style="display:none" id="book_wa_to_input_'+bshape.bid+'" value="'+bshape.to+'" />';
	appendData += '  </div>';
	appendData += '	 <table class="append_current_wl_list_tbl" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">';
	appendData += '		<tr class="wl_list_book_show_current" id="show_data_wl-'+bshape.bid+'" title="Click to Expand">';
	appendData += '			<td class="wl_list_section_head_tbl_col_bid wl_val_" id="wl_list_current_sh_bid-'+bshape.bid+'">'+bshape.num+'</td>';
	appendData += '			<td class="wl_list_section_head_tbl_col_time wl_val_" id="wl_list_current_sh_time-'+bshape.bid+'">'+date_+'</td>';
	appendData += '			<td class="wl_list_section_head_tbl_col_period wl_val_" id="wl_list_current_sh_period-'+bshape.bid+'">'+period_+'</td>	';
	appendData += '			<td class="wl_list_section_head_tbl_col_pers wl_val_" id="wl_list_current_sh_persons-'+bshape.bid+'">'+bshape.persons+'</td>';
	appendData += '		    <td class="wl_list_section_head_tbl_col_place wl_val_" id="wl_list_current_sh_places-'+bshape.bid+'">'+bshape.places+'</td>	';						   						    
	appendData += '		</tr>';
	appendData += '	 </table>';
	appendData += '</div>';
   
   var drawn = document.getElementsByName(afterName);  
   if (drawn.length > 0) {
     var idx = this.currentBookings.indexOf(bshape);
	 var added = false;
     for(var d = idx-1 ; d >= 0; d--) {
	    if(document.getElementById("wl_list_bid-"+this.currentBookings[d].bid) != null) {
		   $("#wl_list_bid-"+this.currentBookings[d].bid).after(appendData);
		   added = true;
		   break
		}
	 }
	 if(!added) {
	   $("#"+appendID).prepend(appendData);
	 }
   } else {
      $("#"+appendID).prepend(appendData);
   }
}
BookingListManager.prototype.DrawToNext = function(bid) {
   var appendID = "append_next_wl_list";
   var afterName = "wa_next_list";
   var bshape = this.nextBookingsHash[bid];
   var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
   var date_ = calculateShowDate(bshape.from,placeOffset);
   var period_ = calculateDuration(bshape.to - bshape.from);
	  
   var appendData = "";
	appendData += '	<div class="wl_list_booking wl_next_" id="wl_list_bid-'+bshape.bid+'" name="wa_next_list" onclick="DisplayBooking(\''+bshape.bid+'\')">';
	appendData += '  <div class="hidden__" style="display:none">';
	appendData += '		<input style="display:none" name="wl_list_nwxt_lwft" id="book_wa_from_input_'+bshape.bid+'" value="'+bshape.from+'" />';
	appendData += '		<input style="display:none" id="book_wa_to_input_'+bshape.bid+'" value="'+bshape.to+'" />';
	appendData += '  </div>';	
	appendData += '	  <table class="append_current_wl_list_tbl" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">';
	appendData += '	  <tr class="wl_list_book_show_current" id="show_data_wl-'+bshape.bid+'" title="Click to Expand">';
	appendData += '	   <td class="wl_list_section_head_tbl_col_next_bid" id="wl_list_next_sh_bid-'+bshape.bid+'">'+bshape.num+'</td>';
	appendData += '	   <td class="wl_list_section_head_tbl_col_next_time" id="wl_list_next_sh_time-'+bshape.bid+'">'+date_+'</td>';
	appendData += '	   <td class="wl_list_section_head_tbl_col_next_period" id="wl_list_next_sh_period-'+bshape.bid+'">'+period_+'</td>	';
	appendData += '	   <td class="wl_list_section_head_tbl_col_next_pers" id="wl_list_next_sh_persons-'+bshape.bid+'">'+bshape.persons+'</td>';
	appendData += '	   <td class="wl_list_section_head_tbl_col_next_place" id="wl_list_next_sh_places-'+bshape.bid+'">'+bshape.places+'</td>';
	appendData += '	   <td class="wl_list_section_head_tbl_col_next_left" id="wl_list_next_sh_left-'+bshape.bid+'"></td>	';						    
	appendData += '	  </tr>';
	appendData += '	 </table>';
	appendData += '	</div>';
		
   
   var drawn = document.getElementsByName(afterName);  
   if (drawn.length > 0) {
     var idx = this.nextBookings.indexOf(bshape);
	 var added = false;
     for(var d = idx-1 ; d >= 0; d--) {
	    console.log("wl_list_bid-"+this.nextBookings[d].bid);
	    if(document.getElementById("wl_list_bid-"+this.nextBookings[d].bid) != null) {
		   $("#wl_list_bid-"+this.nextBookings[d].bid).after(appendData);
		   added = true;
		   break
		}
	 }
	 if(!added) {
	   $("#"+appendID).prepend(appendData);
	 } 
   } else {
      $("#"+appendID).prepend(appendData);
   }
}
BookingListManager.prototype.DrawToPast = function(bid) {
   var appendID = "append_past_wl_list";
   var afterName = "wa_past_list";
   var bshape = this.pastBookingsHash[bid];
   var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
   var date_ = calculateShowDate(bshape.from,placeOffset);
   var period_ = calculateDuration(bshape.to - bshape.from);
	  
   var appendData = "";
   appendData += '<div class="wl_list_booking wl_past_" id="wl_list_bid-'+bshape.bid+'"  name="wa_past_list" onclick="DisplayBooking(\''+bshape.bid+'\')">';
	appendData += '  <div class="hidden__" style="display:none">';
	appendData += '		<input style="display:none" id="book_wa_from_input_'+bshape.bid+'" value="'+bshape.from+'" />';
	appendData += '		<input style="display:none" id="book_wa_to_input_'+bshape.bid+'" value="'+bshape.to+'" />';
	appendData += '  </div>';	
   appendData += '  <table class="append_current_wl_list_tbl" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">';
	appendData += '  <tr class="wl_list_book_show_current" id="show_data_wl-'+bshape.bid+'" title="Click to Expand">';
	appendData += '   <td class="wl_list_section_head_tbl_col_past_bid" id="wl_list_past_sh_bid-'+bshape.bid+'">'+bshape.num+'</td>';
	appendData += '   <td class="wl_list_section_head_tbl_col_past_time" id="wl_list_past_sh_time-'+bshape.bid+'">'+date_+'</td>';
	appendData += '   <td class="wl_list_section_head_tbl_col_past_period" id="wl_list_past_sh_period-'+bshape.bid+'">'+period_+'</td>	';
	appendData += '   <td class="wl_list_section_head_tbl_col_past_pers" id="wl_list_past_sh_persons-'+bshape.bid+'">'+bshape.persons+'</td>';
	appendData += '   <td class="wl_list_section_head_tbl_col_past_place" id="wl_list_past_sh_places-'+bshape.bid+'">'+bshape.places+'</td>		';				    
	appendData += '  </tr>';
	appendData += ' </table>';
   appendData += ' </div>   ';
   
   
   var drawn = document.getElementsByName(afterName);  
   if (drawn.length > 0) {
     var idx = this.nextBookings.indexOf(bshape);
	 var added = false;
     for(var d = idx-1 ; d >= 0; d--) {
	    if(document.getElementById("wl_list_bid-"+this.nextBookings[d].bid) != null) {
		   $("#wl_list_bid-"+this.nextBookings[d].bid).after(appendData);
		   added = true;
		   break
		}
	 }
	 if(!added) {
	   $("#"+appendID).prepend(appendData);
	 }
   } else {
      $("#"+appendID).prepend(appendData);
   }
}
function calculateShowDate(from,placeOffset) {
      d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var time = from;//UTC
	  var offsetSec = placeOffset * 3600 + clientOffset * 60;
	  var totalSec = (time + offsetSec)*1000;
	  var Date_ = new Date(parseInt(totalSec));
	  var day = Date_.getDate();
	  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	  var mon = monthNames[Date_.getMonth()];
	  var year = Date_.getFullYear();
	  var hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
	  var min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
	  var string = "<span class='date_color_'>"+day+mon+"</span> "+hour_+":"+min_;
      return string;
}
function calculateDuration (seconds) {
	  // Update duration
	  var period = seconds;
	  var hour = Math.floor(period/3600);
	  var sec  = period - hour * 3600;
	  var minn = sec/60;
	  var htmld = "";
	  if(hour > 0) {
	    htmld = htmld + hour + "h";
	  }
	  if (minn > 0) {
	   htmld = htmld + minn + "m";
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


function DisplayBooking(bid) {
  var shapeCanvases = [];
  var bshape = {};
  var sid2img = {};
  var img2url = {};
  console.log("HI");
  for (var b = 0 ; b < bookingsManager.allBookings.length; b++) {
     var bshape_  = bookingsManager.allBookings[b];
	 if(bshape_.bid == bid) {
	    bshape = bshape_;
		break;
	 }
  }
  var sid2url = {};
  var sid2floorName = {};
  var sid2urlJSON = JSON.parse(document.getElementById('server_imgID2link50').value)
  for (var c = 0 ; c < bshape.namesList.length ; c++) {
    if(tl_canvas.shapeViews[bshape.namesList[c].sid].type == "image") {
	   for(var j =  0; j < sid2urlJSON.length ; j++) {
	      if(sid2urlJSON[j].imageID == tl_canvas.shapeViews[bshape.namesList[c].sid].options.imgID) {
		     sid2url[bshape.namesList[c].sid] = sid2urlJSON[j].gcsUrl;
		  }
	   }
	  }
  }

  
  	for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
	   var floor = floorCanvases[cf];
	   for (var sd = 0 ; sd < floor.shapes.length ; sd++) {
	     sid2floorName[floor.shapes[sd].sid] = floor.floor_name;
	   }
	}
	
  if (1) {

	  
	  var appendData = "";  
      appendData += '		    <div class="acc_single_booking_wl next_b" id="acc_single_booking'+bid+'">'; 
	  appendData += '               <div id="close_booking_info_wl" >X</div>';
	  appendData += '           <div class="hidden__" style="display:none">';
	  appendData += '				<input style="display:none" name="pl_offcet" id="pl_offcet_'+bid+'" value="'+bookingsManager.offset+'" />';
	  appendData += '				<input style="display:none" name="book_time" id="book_time_'+bid+'" value="'+bshape.from+'" />';
	  appendData += '           </div>';
	  appendData += '			  <table class="sb_table" cellspacing="0" cellpadding="0" style="width: 100%;  height: 100%; border-collapse: collapse">';
	  appendData += '		       <tr class="sb_tbl_head_row">';
	  appendData += '				   <td class="sb_place_name">';
     appendData += '				  <div class="booking_counter">'+bshape.num+'.</div>';
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

	appendData += '					 <div class="sb_change sb_button" id="wl_confirm-'+bid+'">Confirm arrival</div>';
	appendData += '					 <div class="sb_printable sb_button" id="wl_print-'+bid+'">Highlight on place</div>';
	appendData += '					 <div class="sb_drop_link" id="drop_PID">';
	appendData += '						 <ul id="drop_'+bid+'" class="menu_drop_sb" name="menu_drop_sb">';
	appendData += '						  <li><a href="#" class="menu_drop_sb_a">More actions &#9776;</a>';
	appendData += '							  <ul class="booking-single-submenu">';
	appendData += '								<li class="sb_drop_li"><a  onclick="something(this)"  class="sb_drop_a clientCancelBooking" id="sb_cancel_'+bid+'">Cancel booking</a></li>';
	appendData += '								<li class="sb_drop_li"><a  onclick="something(this)"  class="sb_drop_a" id="sb_contact_'+bshape.pid+'">Contact client</a></li>';
	appendData += '								<li class="sb_drop_li"><a onclick="something(this)" class="sb_drop_a" id="sb_notify_'+bid+'">Print</a></li>';
	appendData += '							  </ul>';
	appendData += '						  </li>';
	appendData += '						  </ul>';
	appendData += '					  </div>';

	appendData += '				   </td>';
	appendData += '				 </tr>';
	appendData += '				 <tr class="sb_info_row">';
	appendData += '				    <td class="sb_info_row_td">';
	appendData += '					  <table class="sb_allinfo_tbl" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '					    <tr >';
	appendData += '						  <td class="sb_listing_properties_td_wl">';
	appendData += '						     <div class="sb_prop sb_prop_num">No.</div>';
	appendData += '						     <div class="sb_prop sb_prop_im">Place</div>';
	appendData += '							 <div class="sb_prop sb_prop_name">Place name</div>';
	appendData += '							 <div class="sb_prop sb_prop_floor">Floor</div>';
	appendData += '							 <div class="sb_prop sb_prop_persons">Persons</div>';
	appendData += '						  </td>';
	appendData += '						  <td class="sb_other_data_td_wl" rowspan="2">';
	appendData += '						     <table class="other_data_sb" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '							   <tr >';
	appendData += '							    <td class="other_data_tbl_head your_booking"><div class="your_booking_div">BOOKING DETAILS</div></td>';
	appendData += '							   </tr>';
	appendData += '							   <tr class="other_data_info_row">';
	appendData += '							    <td class="other_data_info_td">';
	appendData += '								   <table class="sb_od_t" cellspacing="0" cellpadding="0" style="width: 100%;height: 100%; border-collapse: collapse">';
	appendData += '								     <tr >';
	appendData += '									   <td class="sb_od_na">Persons</td><td class="sb_od_val">'+bshape.persons+'</td></tr>';
	appendData += '									 <tr >';
	appendData += '									   <td class="sb_od_na">Spots</td><td class="sb_od_val">'+bshape.places+'</td></tr> '; 
	appendData += '									 <tr >';
	appendData += '									   <td class="sb_od_na">Date</td><td class="sb_od_val" id="sb_od_date-'+bid+'"></td></tr> ';
     appendData += '                                     <tr >';
	appendData += '									   <td class="sb_od_na">Period</td><td class="sb_od_val" id="sb_duration-'+bid+'"></td></tr> 		';								   
	appendData += '								   </table>';
	appendData += '								</td>';
	appendData += '							  </tr>';
	appendData += '							  <tr >';
	appendData += '							    <td class="other_data_tbl_head place_info_t"><div class="place_info_t_div">CLIENT INFO</div></td>';
	appendData += '							   </tr>';
	appendData += '							   <tr class="other_data_info_row">';
	appendData += '							    <td class="other_data_info_td">';
	appendData += '								</td>';
	appendData += '							  </tr>';
	appendData += '							 </table>';
	appendData += '						  </td>';
	appendData += '						</tr>';
	appendData += '						<tr class="sb_listing_row">';
	appendData += '						  <td class="sb_listing_td_wl">';
if(bshape.namesList.length > 3) {
	appendData += '						     <div class="top_inset_shaddow"></div>';
} 
	appendData += '						     <div class="sb_list_wrap_div">';		
var borders_class="bordings_lr";
if(bshape.namesList.length > 3)	{
	appendData += '							   <div class="sb_list_div" name="sb_list_div" id="sb_list_div-'+bid+'">';
	appendData += '							    <div class="sb_list_shaddow" >';
	borders_class="bordings_lr";
} else {
    appendData += '							   <div class="sb_list_div_no">';
	appendData += '							    <div class="sb_list_shaddow_no" >';
	borders_class="";
}
	appendData += '							     <div class="as_padding_10 '+borders_class+'"></div>';
for (var bs = 0 ; bs < bshape.namesList.length ; bs++) {
    var shape = bshape.namesList[bs];
	var i = bs+1;
	appendData += '								     <div class="sb_single_sid '+borders_class+'">';
	appendData += '									   <table class="sb_single_sid_table" cellspacing="0" cellpadding="0" style="width: 100%;height:100%; border-collapse: collapse">';
	appendData += '									     <tr>';
	appendData += '										   <td class="sb_s_t_num">'+i+'</td>';
	appendData += '										   <td class="sb_s_t_img_td"><div class="sbimgd">';
if(sid2url[shape.sid] != undefined ) {
	appendData += '										     <img class="sid_ovr_img" src="'+sid2url[shape.sid]+'"/></div>';
} else {
    appendData += '										     <canvas  width="50" height="50" class="sid_ovr_canvas" id="sb_canvas-'+bid+'-'+shape.sid+'"></canvas></div>';
	var shape2ID = {};
	
	shape2ID.id = 'sb_canvas-'+bid+'-'+shape.sid;
	shape2ID.shape = tl_canvas.shapeViews[shape.sid];
	shapeCanvases.push(shape2ID);	
}
	appendData += '										   </td>';
	appendData += '										   <td class="sb_s_t_name_td">';
	appendData += '										      <span class="sb_sid_name">'+shape.name+'</span>';
	appendData += '										   </td>';
	appendData += '										   <td class="sb_s_t_f_td">';
	appendData += '										      <span class="sb_sid_name">'+sid2floorName[shape.sid]+'</span>';
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
if(bshape.namesList.length > 3) {
	appendData += '								 <div class="bottom_inset_shaddow"></div>';
}
	appendData += '							  </td>';
	appendData += '							</tr>';
	appendData += '						  </table>';
	appendData += '						</td>';
	appendData += '					 </tr>';
	appendData += '				  </table>';
	appendData += '				</div>';
	$("#browser_window_wrap").html("");
	$("#browser_window_wrap").append(appendData);
	$("#close_booking_info_wl").click(function(){
     $("#browser_window_wrap").html("");
    });
	  d = new Date();
      clientOffset = d.getTimezoneOffset();
	  var dateID ='sb_time_val_'+bid;
	  var time = bshape.from;//UTC
	  var offsetSec = bookingsManager.offset * 3600 + clientOffset * 60;
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
	  var period = bshape.to - bshape.from;
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
	var allmenu =document.getElementsByName("menu_drop_sb");
	for(var x=0; x < allmenu.length; x++) {
	  var id_ = allmenu[x].id;
	   $('#'+id_).dropit();
	}
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