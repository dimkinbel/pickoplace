/**
 *
 */
function BShapeAll( from , to , bid , persons , type , namesList , places , num , user) {
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
	this.user = user;
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
	setInterval(function() { myState.monitorePin(); }, 5000);
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

BookingListManager.prototype.monitorePin = function() {
	for(var b = 0 ; b < this.pastBookings.length ; b++ ) {
		var bshape = this.pastBookings[b];
		for(var i = 0 ; i < bshape.namesList.length ; i++ ) {
			$('.pin_ongoing').tooltip('destroy');
			$('#floor_pin_'+bshape.bid+'_BS_'+bshape.namesList[i].sid).remove();
		}
	}
	for(var b = 0 ; b < this.currentBookings.length ; b++ ) {
		var bshape = this.currentBookings[b];
		for(var i = 0 ; i < bshape.namesList.length ; i++ ) {
			$('.pin_ongoing').tooltip('destroy');
			$('#floor_pin_'+bshape.bid+'_BS_'+bshape.namesList[i].sid).remove();
			if(  $('#floor_pin_'+bshape.bid+'_BS_'+bshape.namesList[i].sid).length )  {

			} else {
				var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
				var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);
				var appendPinData = '';
				appendPinData += '<div class="floor_pin_wrap" name="floor_pin_wrap" id="floor_pin_'+bshape.bid+'_BS_'+bshape.namesList[i].sid+'" >';
				appendPinData += ' <div class="pin_ongoing" data-toggle="tooltip" id="pin_id_'+bshape.bid+'_BS_'+bshape.namesList[i].sid+'" data-container="body" data-placement="top" title="('+bshape.num+') '+date_+'">';
				appendPinData += '    <i class="material-icons pin_ongoing_mat">restaurant_menu</i>';
				appendPinData += ' </div>';
				appendPinData += '</div>';
				for(var f = 0 ;f < floorCanvases.length ; f++) {
					if(floorCanvases[f].floor_name == bshape.namesList[i].floorname) {
						$("#div_wrap-canvas_"+floorCanvases[f].floorid).append(appendPinData);
						var relativeData = getRelativeXY(floorCanvases[f].floorid,bshape.namesList[i].sid,"div_wrap-canvas_"+floorCanvases[f].floorid,'canvas_'+floorCanvases[f].floorid);
						$('#floor_pin_'+bshape.bid+'_BS_'+bshape.namesList[i].sid).css("left",relativeData.leftper+"%");
						$('#floor_pin_'+bshape.bid+'_BS_'+bshape.namesList[i].sid).css("top",relativeData.topper+"%");


					}
				}
			}
		}
	}
	$('[data-toggle="tooltip"]').tooltip();
	$('.pin_ongoing').click(function(e) {
		showFloorPopover(e.pageX, e.pageY,$(this).attr("id"));
	});
}
BookingListManager.prototype.monitore = function() {
	if(this.newBookings.length > 0 ) {
		for (var nb = 0 ; nb < this.newBookings.length ; nb++ ) {
			var bshape = this.newBookings[nb];
			if(bshape.to < (new Date()).getTime()/1000) {
				this.addToPast(bshape);
				this.DrawToPast(bshape.bid);
			} else if (bshape.from > (new Date()).getTime()/1000) {
				this.addToNext(bshape);
				this.DrawToNext(bshape.bid);
			} else {
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
	this.monitore();
}
BookingListManager.prototype.DrawToCurrent = function(bid) {
	var appendID = "book_list_current";
	var afterName = "wa_current_list";
	var bshape = this.currentBookingsHash[bid];
	var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
	var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);
	var userName = "";
	var imgsrc = "";
	var persons = bshape.persons;

	if(bshape.user.facebook == true) {
		userName = bshape.user.fbuser.name;
		imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture"
	} else if (bshape.user.google == true) {
		userName = bshape.user.gouser.name;
		imgsrc = bshape.user.gouser.picture;
	}
	var appendData = "";
	appendData += "<div class='single_book_list_wrap' id='wl_list_bid-"+bshape.bid+"'  name='wa_current_list'>";
	appendData += "   <div class='shown_user_book_data' id='shown-"+bshape.bid+"' data-toggle='collapse' data-parent='#book_list_current' href='#hidden-"+bshape.bid+"' aria-expanded='false' aria-controls='hidden-"+bshape.bid+"'>";
	appendData += "    <table cellspacing='0' cellpadding='0'  style='width:100%;'>";
	appendData += "	  <tr >";
	appendData += "	   <td class='bls_name_td'>";
	appendData += "	     <div class='bls_name'>"+userName+"</div>";
	appendData += "        </td>";
	appendData += "		<td class='bls_tags' rowspan=2>";
	appendData += "		  <div class='loggedbyfg'>";
	appendData += "		     <img src='"+imgsrc+"'/>";
	appendData += "		   </div>";
	appendData += "		</td>";
	appendData += "        	<td class='bls_tnumb' rowspan=2>";
	appendData += "		   <div class='tnum'>"+bshape.num+"</div>";
	appendData += "		</td>				";
	appendData += "	  </tr>";
	appendData += "	  <tr>";
	appendData += "          <td class='bls_time_td' >";
	appendData += "		  <div class='bls_time left' id='timeperiod-"+bshape.bid+"'>"+date_+"</div>";
	appendData += "		  <div class='bls_persons  left'><div class='numbls left'>"+persons+"</div><div class='material-icons bls_person_m  left'>person</div></div>";
	appendData += "		  <div class='bls_persons  left'><div class='numbls  left'>"+bshape.places+"</div><div class='material-icons bls_places_m  left'>store_mall_directory</div></div>";
	appendData += "		</td>";
	appendData += "	  </tr>";
	appendData += "	</table>";
	appendData += " </div>";
	appendData += "  <div id='hidden-"+bshape.bid+"' class='hidden_user_book_data panel-collapse collapse ' role='tabpanel' aria-labelledby='headingOne'>";
	appendData += "      <div class='hidden_inner_wrap'>";
	appendData += "	  <div class='tbluserdatatr'>";

	if(bshape.user.phone != undefined && bshape.user.phone != "") {
		appendData += "		   <div class='phnwrap  '>";
		appendData += "		    <div class='material-icons upicn left'>phone</div>";
		appendData += "		    <div class='phoneuserwl left label label-success'>"+bshape.user.phone+"</div>";
		appendData += "		  </div>";
	}

	appendData += "	  </div>";
	appendData += "	  <div class='tbltbls'>";
	appendData += "		<table class='table table-striped table-condensed'>";
	for(var i = 0 ; i < bshape.namesList.length ; i++ ) {
		appendData += "         <tr>";
		appendData += "		       <td>"+bshape.namesList[i].name+"</td>";
		appendData += "			   <td>"+bshape.namesList[i].floorname+"</td>";
		appendData += "			   <td>"+bshape.namesList[i].persons+" persons</td>";
		appendData += "		  </tr>";
	}

	appendData += "		</table>";
	appendData += "	  </div>";
	appendData += "	  <div class='tblbtns'>";
	appendData +='					<div class="container-fluid">';
	appendData +='						  <div class="row ">';
	appendData +='							<div class="col-sm-2 "  >	';
	appendData +='							<i class="material-icons mat_bl_hid hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on place"  onclick="SingleBookingButton(\'show_on_place\',\''+bshape.bid+'\')">location_searching</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons mat_bl_hid hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on timeline" onclick="SingleBookingButton(\'timeline\',\''+bshape.bid+'\')">view_list</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							 </div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							</div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons  mat_bl_hid hover_red" data-toggle="tooltip" data-container="body" data-placement="top" title="Not attended"  onclick="SingleBookingButton(\'not_attended\',\''+bshape.bid+'\')">mood_bad</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons  mat_bl_hid hover_orange" data-toggle="tooltip" data-container="body" data-placement="top" title="Finished" onclick="SingleBookingButton(\'finished\',\''+bshape.bid+'\')">timelapse</i></div>';
	appendData +='						  </div>';
	appendData +='						  </div>';
	appendData += "	  </div>";
	appendData += "	 </div>";
	appendData += "</div>";
	appendData += "</div>";

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
	$('[data-toggle="tooltip"]').tooltip();
}
BookingListManager.prototype.DrawToNext = function(bid) {
	var appendID = "book_list_next";
	var afterName = "wa_next_list";
	var bshape = this.nextBookingsHash[bid];
	var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
	var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);
	var userName = "";
	var imgsrc = "";
	var persons = bshape.persons;

	if(bshape.user.facebook == true) {
		userName = bshape.user.fbuser.name;
		imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture"
	} else if (bshape.user.google == true) {
		userName = bshape.user.gouser.name;
		imgsrc = bshape.user.gouser.picture;
	}
	var appendData = "";
	appendData += "<div class='single_book_list_wrap' id='wl_list_bid-"+bshape.bid+"'  name='wa_next_list'>";
	appendData += "   <div class='shown_user_book_data' id='shown-"+bshape.bid+"' data-toggle='collapse' data-parent='#book_list_next' href='#hidden-"+bshape.bid+"' aria-expanded='false' aria-controls='hidden-"+bshape.bid+"'>";
	appendData += "    <table cellspacing='0' cellpadding='0'  style='width:100%;'>";
	appendData += "	  <tr >";
	appendData += "	   <td class='bls_name_td'>";
	appendData += "	     <div class='bls_name'>"+userName+"</div>";
	appendData += "        </td>";
	appendData += "		<td class='bls_tags' rowspan=2>";
	appendData += "		  <div class='loggedbyfg'>";
	appendData += "		     <img src='"+imgsrc+"'/>";
	appendData += "		   </div>";
	appendData += "		</td>";
	appendData += "        	<td class='bls_tnumb' rowspan=2>";
	appendData += "		   <div class='tnum'>"+bshape.num+"</div>";
	appendData += "		</td>				";
	appendData += "	  </tr>";
	appendData += "	  <tr>";
	appendData += "          <td class='bls_time_td' >";
	appendData += "		  <div class='bls_time left' id='timeperiod-"+bshape.bid+"'>"+date_+"</div>";
	appendData += "		  <div class='bls_persons  left'><div class='numbls left'>"+persons+"</div><div class='material-icons bls_person_m  left'>person</div></div>";
	appendData += "		  <div class='bls_persons  left'><div class='numbls  left'>"+bshape.places+"</div><div class='material-icons bls_places_m  left'>store_mall_directory</div></div>";
	appendData += "		</td>";
	appendData += "	  </tr>";
	appendData += "	</table>";
	appendData += " </div>";
	appendData += "  <div id='hidden-"+bshape.bid+"' class='hidden_user_book_data panel-collapse collapse ' role='tabpanel' aria-labelledby='headingOne'>";
	appendData += "      <div class='hidden_inner_wrap'>";
	appendData += "	  <div class='tbluserdatatr'>";

	if(bshape.user.phone != undefined && bshape.user.phone != "") {
		appendData += "		   <div class='phnwrap  '>";
		appendData += "		    <div class='material-icons upicn left'>phone</div>";
		appendData += "		    <div class='phoneuserwl left label label-success'>"+bshape.user.phone+"</div>";
		appendData += "		  </div>";
	}

	appendData += "	  </div>";
	appendData += "	  <div class='tbltbls'>";
	appendData += "		<table class='table table-striped table-condensed'>";
	for(var i = 0 ; i < bshape.namesList.length ; i++ ) {
		appendData += "         <tr>";
		appendData += "		       <td>"+bshape.namesList[i].name+"</td>";
		appendData += "			   <td>"+bshape.namesList[i].floorname+"</td>";
		appendData += "			   <td>"+bshape.namesList[i].persons+" persons</td>";
		appendData += "		  </tr>";
	}

	appendData += "		</table>";
	appendData += "	  </div>";
	appendData += "	  <div class='tblbtns'>";
	appendData +='					<div class="container-fluid">';
	appendData +='						  <div class="row ">';
	appendData +='							<div class="col-sm-2 "  >	';
	appendData +='							<i class="material-icons mat_bl_hid hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on place"  onclick="SingleBookingButton(\'show_on_place\',\''+bshape.bid+'\')">location_searching</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons mat_bl_hid hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on timeline" onclick="SingleBookingButton(\'timeline\',\''+bshape.bid+'\')">view_list</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							 </div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							</div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons mat_bl_hid  hover_black" data-toggle="tooltip" data-container="body" data-placement="top" title="Change places" onclick="SingleBookingButton(\'change_place\',\''+bshape.bid+'\')">repeat</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons mat_bl_hid  hover_red"  data-toggle="tooltip" data-container="body" data-placement="top" title="Cancel reservation"  onclick="SingleBookingButton(\'cancel\',\''+bshape.bid+'\')">cancel</i></div>';
	appendData +='						  </div>';
	appendData +='						  </div>';
	appendData += "	  </div>";
	appendData += "	 </div>";
	appendData += "</div>";
	appendData += "</div>";

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
	$('[data-toggle="tooltip"]').tooltip();
}
BookingListManager.prototype.DrawToPast = function(bid) {
	var appendID = "book_list_past";
	var afterName = "wa_past_list";
	var bshape = this.pastBookingsHash[bid];
	var placeOffset = parseFloat(document.getElementById("server_placeUTC").value);
	var date_ = calculateShowDate(bshape.from,placeOffset,bshape.to);
	var userName = "";
	var imgsrc = "";
	var persons = bshape.persons;

	if(bshape.user.facebook == true) {
		userName = bshape.user.fbuser.name;
		imgsrc = "http://graph.facebook.com/" + bshape.user.fbuser.id + "/picture"
	} else if (bshape.user.google == true) {
		userName = bshape.user.gouser.name;
		imgsrc = bshape.user.gouser.picture;
	}
	var appendData = "";
	appendData += "<div class='single_book_list_wrap' id='wl_list_bid-"+bshape.bid+"'  name='wa_past_list'>";
	appendData += "   <div class='shown_user_book_data' id='shown-"+bshape.bid+"' data-toggle='collapse' data-parent='#book_list_past' href='#hidden-"+bshape.bid+"' aria-expanded='false' aria-controls='hidden-"+bshape.bid+"'>";
	appendData += "    <table cellspacing='0' cellpadding='0'  style='width:100%;'>";
	appendData += "	  <tr >";
	appendData += "	   <td class='bls_name_td'>";
	appendData += "	     <div class='bls_name'>"+userName+"</div>";
	appendData += "        </td>";
	appendData += "		<td class='bls_tags' rowspan=2>";
	appendData += "		  <div class='loggedbyfg'>";
	appendData += "		     <img src='"+imgsrc+"'/>";
	appendData += "		   </div>";
	appendData += "		</td>";
	appendData += "        	<td class='bls_tnumb' rowspan=2>";
	appendData += "		   <div class='tnum'>"+bshape.num+"</div>";
	appendData += "		</td>				";
	appendData += "	  </tr>";
	appendData += "	  <tr>";
	appendData += "          <td class='bls_time_td' >";
	appendData += "		  <div class='bls_time left' id='timeperiod-"+bshape.bid+"'>"+date_+"</div>";
	appendData += "		  <div class='bls_persons  left'><div class='numbls left'>"+persons+"</div><div class='material-icons bls_person_m  left'>person</div></div>";
	appendData += "		  <div class='bls_persons  left'><div class='numbls  left'>"+bshape.places+"</div><div class='material-icons bls_places_m  left'>store_mall_directory</div></div>";
	appendData += "		</td>";
	appendData += "	  </tr>";
	appendData += "	</table>";
	appendData += " </div>";
	appendData += "  <div id='hidden-"+bshape.bid+"' class='hidden_user_book_data panel-collapse collapse ' role='tabpanel' aria-labelledby='headingOne'>";
	appendData += "      <div class='hidden_inner_wrap'>";
	appendData += "	  <div class='tbluserdatatr'>";

	if(bshape.user.phone != undefined && bshape.user.phone != "") {
		appendData += "		   <div class='phnwrap  '>";
		appendData += "		    <div class='material-icons upicn left'>phone</div>";
		appendData += "		    <div class='phoneuserwl left label label-success'>"+bshape.user.phone+"</div>";
		appendData += "		  </div>";
	}

	appendData += "	  </div>";
	appendData += "	  <div class='tbltbls'>";
	appendData += "		<table class='table table-striped table-condensed'>";
	for(var i = 0 ; i < bshape.namesList.length ; i++ ) {
		appendData += "         <tr>";
		appendData += "		       <td>"+bshape.namesList[i].name+"</td>";
		appendData += "			   <td>"+bshape.namesList[i].floorname+"</td>";
		appendData += "			   <td>"+bshape.namesList[i].persons+" persons</td>";
		appendData += "		  </tr>";
	}

	appendData += "		</table>";
	appendData += "	  </div>";
	appendData += "	  <div class='tblbtns'>";
	appendData +='					<div class="container-fluid">';
	appendData +='						  <div class="row ">';
	appendData +='							<div class="col-sm-2 "  >	';
	appendData +='							<i class="material-icons mat_bl_hid hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on place" onclick="SingleBookingButton(\'show_on_place\',\''+bshape.bid+'\')">location_searching</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							<i class="material-icons mat_bl_hid hover_blue" data-toggle="tooltip" data-container="body" data-placement="top" title="Show on timeline" onclick="SingleBookingButton(\'timeline\',\''+bshape.bid+'\')">view_list</i></div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							 </div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							</div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							</div>';
	appendData +='							<div class="col-sm-2"  >';
	appendData +='							 <i class="material-icons  mat_bl_hid hover_red" data-toggle="tooltip" data-container="body" data-placement="top" title="Not attended" onclick="SingleBookingButton(\'not_attended\',\''+bshape.bid+'\')">mood_bad</i></div>';
	appendData +='						  </div>';
	appendData +='						  </div>';
	appendData += "	  </div>";
	appendData += "	 </div>";
	appendData += "</div>";
	appendData += "</div>";

	var drawn = document.getElementsByName(afterName);
	if (drawn.length > 0) {
		var idx = this.pastBookings.indexOf(bshape);
		var added = false;
		for(var d = idx-1 ; d >= 0; d--) {
			if(document.getElementById("wl_list_bid-"+this.pastBookings[d].bid) != null) {
				$("#wl_list_bid-"+this.pastBookings[d].bid).after(appendData);
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
	$('[data-toggle="tooltip"]').tooltip();
}
