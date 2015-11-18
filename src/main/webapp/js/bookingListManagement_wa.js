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
	appendData +='							<i class="material-icons mat_bl_hid  hover_black" data-toggle="tooltip" data-container="body" data-placement="top" title="Change places" onclick="SingleBookingButton(\'change_place\',\''+bshape.bidsid+'\')">repeat</i></div>';
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
	console.log(Date_f);
	console.log(totalSec);
	return Date_f;
}
function getBookDate(dateUTC,time,placeOffset) {
	d = new Date();
	clientOffset = d.getTimezoneOffset();
	var offsetSec = placeOffset * 3600 + clientOffset * 60;
	var totalSec = (dateUTC + time + offsetSec)*1000;
	var Date_f = new Date(parseInt(totalSec));
	console.log(Date_f);
	console.log(totalSec);
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
		appendData += '		    <div class="acc_single_booking_ap next_b" id="acc_single_booking'+bid+'">';
		appendData += '               <div id="close_booking_info_ap" >X</div>';
		appendData += '           <div class="hidden__" style="display:none">';
		appendData += '				<input style="display:none" name="pl_offcet" id="pl_offcet_'+bid+'" value="'+bookingsManager.offset+'" />';
		appendData += '				<input style="display:none" name="book_time" id="book_time_'+bid+'" value="'+bshape.from+'" />';
		appendData += '           </div>';
		appendData += '			  <table class="sb_table" cellspacing="0" cellpadding="0" style="width: 100%;  height: 100%; border-collapse: collapse">';
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
		appendData += '						    <td class="ap_time_val_td"><div class="ap_time_val_div" name="sb_time_val_div">'+bshape.num+'</div></td>';
		appendData += '						    <td class="ap_time_val_td"><div class="ap_time_val_div" name="sb_time_val_div" id="sb_time_val_'+bid+'"></div></td> ';
		appendData += '						    <td class="ap_time_val_td"><div class="ap_time_val_div" name="sb_time_val_div"  id="sb_left_'+bid+'"></div></td></tr> ';
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
		appendData += '						  <td class="sb_listing_td_wl">';
		if(bshape.namesList.length > 3) {
			appendData += '						     <div class="top_inset_shaddow"></div>';
		}
		appendData += '						     <div class="ap_list_wrap_div">';
		var borders_class="bordings_lr";
		if(bshape.namesList.length > 3)	{
			appendData += '							   <div class="ap_list_div" name="sb_list_div" id="sb_list_div-'+bid+'">';
			appendData += '							    <div class="ap_list_shaddow" >';
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
			appendData += '										   <td class="ap_s_t_num">'+i+'</td>';
			appendData += '										   <td class="ap_s_t_img_td"><div class="sbimgd">';
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
			appendData += '										   <td class="ap_s_t_name_td">';
			appendData += '										      <span class="sb_sid_name">'+shape.name+'</span>';
			appendData += '										   </td>';
			appendData += '										   <td class="ap_s_t_f_td">';
			appendData += '										      <span class="sb_sid_name">'+sid2floorName[shape.sid]+'</span>';
			appendData += '										   </td>';
			appendData += '										   <td class="ap_s_t_p_td">';
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
		appendData += '							  </div>';
		appendData += '							  </td>';
		appendData += '							</tr>';
		appendData += '						  </table>';
		appendData += '						</td>';
		appendData += '					 </tr>';

		appendData += '		       <tr class="login_bok_conf_tr">';
		appendData += '                   <td>';
		appendData += '                            <table cellspacing="0" cellpadding="0" style="width: 100%;height:100%; border-collapse: collapse">';
		appendData += '							     <tr id="blcon_r" style="display:none">';
		appendData += '								   <td class="loginsa">';
		appendData += '								     <div class="dsdfs">Logged in as: </div><div id="login_info_resp_db" class="userNikname left_p">Dimon</div>';
		appendData += '								   </td>';
		appendData += '								   <td class="tdblo">';
		appendData += '								     <div id="place_order_button_l" class="blue_b_button" >BOOK</div>';
		appendData += '								   </td>';
		appendData += '								 </tr>';
		appendData += '								 <tr id="lpr_b" >';
		appendData += '								   <td colspan="2">';
		appendData += '								     <div id="logpbook">Please login to complete booking</div>';
		appendData += '								   </td>';
		appendData += '								 </tr>';
		appendData += '							  </table>';


		appendData += '                   </td>';
		appendData += '              </tr>';

		appendData += '				  </table>';
		appendData += '				</div>';
		$("#browser_window_wrap").html("");
		$("#browser_window_wrap").append(appendData);
		$("#close_booking_info_ap").click(function(){
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
				console.log(floor.shapes[sd])
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
	console.log("---->"+bid);
	for (var i = 0 ; i < bookingsManager.allBookings.length ; i ++ ) {
		console.log(bookingsManager.allBookings[i].bid)
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
	appendData+= '	    <i class="material-icons mat_bl_hid hover_blue"   title="Send eMail message" onclick="SingleBookingButton(\'send_message\',\''+bshape.bid+'\')">email</i></div>';
	appendData+= '		<div class="col-sm-3 text_align_center">		';
	appendData+= '	    <i class="material-icons mat_bl_hid  hover_red"    title="Cancel reservation"  onclick="SingleBookingButton(\'cancel\',\''+bshape.bid+'\')">cancel</i> </div>';
	appendData+= '		<div class="col-sm-3 text_align_center">';
	appendData+= '	    <i class="material-icons mat_bl_hid hover_black"  title="Details" onclick="SingleBookingButton(\'info\',\''+bshape.bid+'\')" title="Details">info_outline</i></div>';
	appendData+= '	  </div>';
	appendData+= '	</div>';
	$("#"+popover_hidden_wrap_id).children().html(appendData);
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
function showFloorPopover(x,y,bidsid) {
	// update BID information
	updateFloorSidDataOnPopover('canvas_popover_hidden',bidsid);// bookingListManagement_wa.js
	$("#canvas_floors_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
		trigger: 'click',
		placement:'right',
		container: 'body',
		html: true,
		content: function() {
			return $('#canvas_popover_hidden').html();
		}
	}).popover('show');


}
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
function showPopover(x,y,tl_canvas_selection) {
	console.log(tl_canvas_selection);
	// update BID information
	updateBidDataOnPopover('canvas_popover_hidden',tl_canvas_selection);// bookingListManagement_wa.js
	$("#canvas_timeline_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
		trigger: 'click',
		placement:'right',
		container: 'body',
		html: true,
		content: function() {
			return $('#canvas_popover_hidden').html();
		}
	}).popover('show');
}
function InteractiveCancelReservation(bid) {
	// todo(dima): Update interactive cancelation
	console.log("TODO:Update interactive cancelation");
	$('#cancel_reservation_modal').modal('hide');
}
function SingleBookingButton(type,bidsid) {
	console.log("TBD clicked:"+type+","+bidsid);
	$('.hidden_pop_btns').tooltip('destroy');
	$('.mat_bl_hid').tooltip('destroy');
	$('#canvas_floors_popover').popover('hide');
	$('#canvas_timeline_popover').popover('hide');
	var bid = "";
	var sid = "";
	if(bidsid.indexOf('_BS_') > -1) {
		var bidsid = bidsid.replace(/pin_id_/,"").split("_BS_");
		bid = bidsid[0];
		sid = bidsid[1];
	} else {
		bid = bidsid;
	}

	switch (type) {
		case 'change_place':
		case 'info':
			$(".modal").modal('hide');
			updateOnclickModal('booking_info',bid);
			$('#booking_info_modal').modal('show');
			break;
		case 'timeline':
			highlightTimeline(bid);
			break;
		case 'cancel':
			$(".modal").modal('hide');
			updateOnclickModal('cancelation_info',bid);
			$('#cancelation_info_modal').modal('show');
			break;
		case 'finished':

		case 'not_attended':
			$(".modal").modal('hide');
			updateOnclickModal('not_attended',bid);
			$('#not_attended_modal').modal('show');
			break;
		case 'show_on_place':
			highlightSids(bid);
			break;
		case 'notification_add':
		case 'notification_show_on_timeline':
		case 'send_message':
	}
}
