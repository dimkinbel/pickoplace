/**
 * 
 */

function generateIF() {
// var iframe = {};
// iframe.floors; both/single/split
// iframe.singleid = floorid;
// iframe.horisontal = true;
// iframe.iw;
// iframe.ih;
// iframe.color;
// iframe.dimentions = {};
// iframe.dimentions[floorid] = {w:111,g:222};
// iframe.book = true/false;
// tframe.booktop = true/false;
// iframe.bookfill = true/false;
var iframe = {};
	if($("#feo_all_flors_checkbox").is(":checked")) {
		  iframe.floors = "both";
		  iframe.singleid = "";
		  iframe.horisontal = true;
	} else if ($("#feo_separate_flors_checkbox").is(":checked")) {
		  iframe.floors = "split";
		  iframe.singleid = "";
		  if ($("#floor_both_chk-horizontal").is(":checked")) {
			 iframe.horisontal = true;
		  } else {
			 iframe.horisontal = false;
		  }
	} else if ($("#feo_single_floor_checkbox").is(":checked")) {
			 iframe.floors = "single";
			   var allfloors =  document.getElementsByName("floor_single_");  	
			   for(var x=0; x < allfloors.length; x++) { 
					var selectorID = allfloors[x].id;
					flooridSelected = selectorID.replace(/^floor_single_button-/, ""); 
					if($('#'+selectorID).is(":checked")) {
						iframe.singleid = flooridSelected;
						iframe.horisontal = true;
					}
					
				}
         
	}
	
	// DIMENTIONS
	iframe.iw =  document.getElementById("iframe_set_width").value;
	iframe.ih =  document.getElementById("iframe_set_height").value;
	iframe.dimentions = [];
	
	if ($("#feo_separate_flors_checkbox").is(":checked")) {		 
		for(var f=0;f < floorCanvases.length;f++) {	
			  var dim = {};
			  dim.floorid = floorCanvases[f].floorid;
			  dim.w =  document.getElementById("canvas_appended_wrapper-"+floorCanvases[f].floorid).offsetWidth;
			  dim.h =  document.getElementById("canvas_appended_wrapper-"+floorCanvases[f].floorid).offsetHeight;
			  iframe.dimentions.push(dim);
		}  
	} else {
		  
	      var w =  document.getElementById("content_top_left_cell").offsetWidth;
		  var h =  document.getElementById("content_top_left_cell").offsetHeight;
		  
		   for(var f=0;f < floorCanvases.length;f++) {
			   var dim = {};
			   dim.floorid = floorCanvases[f].floorid;
			   dim.w = w;
			   dim.h = h;
			   iframe.dimentions.push(dim);		  
		   }
	}
		
	if ($("#feo_booking_available_checkbox").is(":checked")) {
	  iframe.book = true;
	  if ($("#book_frame_ontop-yes").is(":checked")) {
	   iframe.booktop = true;
	  } else {
	   iframe.booktop = false;
	  }
	  if ($("#book_frame_wraps-yes").is(":checked")) {
	   iframe.bookfill = true;
	  } else {
	   iframe.bookfill = false;
	  }	
	} else {
	   iframe.book = false;
	   iframe.booktop = false;
	   iframe.bookfill = false;
	}
    var x = $("#iframe_wrap").css('backgroundColor');
 
    iframe.color=hexc(x);
	return iframe;
}

$(document).ready(function() {  
  
	$("#fe_save").click(function() {
		setSessionData(function(result) {
			   if(result) {
					var pid = document.getElementById("server_placeID").value;
					var ifid = document.getElementById("server_iFrameID").value;
					if(ifid==null || ifid==undefined ||ifid=="") {
						 ifid = "ifid_"+randomString(20);
						 document.getElementById("server_iFrameID").value = ifid; // Next saves will be to existing ifid
					}
					var ifsave = generateIF();
					
					var jsonData = {ifsave:JSON.stringify(ifsave),pid:pid,ifid:ifid};
					
					$.ajax({
					      url : "/saveIframe",
					      data: jsonData,
					      beforeSend: function () { $("#fe_save").hide(); $("#fe_save_ajax").show(); },
					      success : function(data){
					    	  $("#fe_save").show(); $("#fe_save_ajax").hide();
			                 if(data.newifid == true) {
			                	 console.log("New iFrame added:" + data.ifid);
			                 } else {
			                	 console.log("iFrame updated:" + data.ifid);
			                 }
					      },
					      dataType : "JSON",
					      type : "post"
					  });
			   } else {
				   updatePageView();
			   }
	     });
	});
	
	
	$("#fe_iflist").click(function(){
		  $("#fe_list_append").html('');
		   $("#center_column_like").hide();
		   $("#center_column_like_fe").hide();
		   $("#right_column_like_fe").hide();
		   $("#left_column__").hide();
		   $("#list_iframes").show();
		   var pid = document.getElementById("server_placeID").value;
		   var jsonData = {pid:pid};
			
			$.ajax({
			      url : "/getiframeslist",
			      data: jsonData,
			      beforeSend: function () { $("#list_loading").show(); },
			      success : function(data){
			    	 $("#list_loading").hide();
			    	 updateIFlist(data);
			      },
			      dataType : "JSON",
			      type : "post"
			  });
					   
		});
	
	$("#fe_back_").click(function(){
		   $("#list_iframes").hide();
		   $("#left_column__").show();
		   $("#center_column_like").show();
		   $("#center_column_like_fe").show();
		   $("#right_column_like_fe").show();   
		});

	$("#fe_list_append").on("click", ".edit_iframe_btn_edit", function() {
		var this__ = $(this);
		setSessionData(function(result) {
			   if(result) {
			       var id_ = this__.attr('id');
			       var ifid = id_.replace(/^if_edit-/, "");
			       document.getElementById("iFIDvalue").value = ifid;
			       document.getElementById("_iframeform").submit();
			   } else {
				   updatePageView();
		       }
		});
	});
	$("#fe_list_append").on("click", ".edit_iframe_btn_show", function() {
	       var id_ = $(this).attr('id');
	       var ifid = id_.replace(/^if_show-/, "");
	       var width_  = document.getElementById("width_fe_-"+ifid).value;
	       var height_  = document.getElementById("height_fe_-"+ifid).value;
	       var pid_  = document.getElementById("pid_fe_-"+ifid).value;
	       $("#frame-canvas").html("");
	       document.getElementById("frame_prev_wrap_popup_content").style.width=width_+"px";
	       document.getElementById("frame_prev_wrap_popup_content").style.height=height_+"px";
	       $("#frame-canvas").hide();
	       var hostName = window.location.host;
	       var appendData = '<iframe id="shown_iframe" src="https://'+hostName+'/getiframe?pid='+pid_+'&ifid='+ifid+'"  width="'+width_+'" height="'+height_+'" style="border:none"></iframe>';
	       $("#frame-canvas").append(appendData);
	       var iframe__ = document.getElementById('shown_iframe');
	       $("#iframe_loader").show();
	       $("#frame_prev_wrap").show();
	       iframe__.onload = function() {
	    	   $("#iframe_loader").hide();
	    	   $("#frame-canvas").show();
	       };
    
	});
	$("#fe_list_append").on("click", ".edit_iframe_btn_delete", function() {
		var this__ = $(this);
		setSessionData(function(result) {
			   if(result) {
			       var id_ = this__.attr('id');
			       var ifid = id_.replace(/^if_delete-/, "");
			       var pid = document.getElementById("server_placeID").value;
				   var jsonData = {pid:pid,ifid:ifid};
					
					$.ajax({
					      url : "/deleteIframe",
					      data: jsonData,
					      beforeSend: function () {$("#fe_list_append").html(''); $("#list_loading").show(); },
					      success : function(data){
					    	 $("#list_loading").hide();
					    	 updateIFlist(data);
					      },
					      dataType : "JSON",
					      type : "post"
					  });
			   } else {
				   updatePageView();
		       }
		});
	});
});
function closeIframe() {
	$("#frame_prev_wrap").hide();
	$("#frame-canvas").html("");
}
function updateIFlist(data) {
	 if(data.size == 0) {
		 var appendData = "<div class='no_list_'>NO SAVED IFRAMES EXIST</div>";
		 $("#fe_list_append").append(appendData);
		 
	 } else {
		 console.log(data.list);
		 var pid = document.getElementById("server_placeID").value;
		 for (var i = 0 ; i < data.list.length;i++) {
			 var iframe = data.list[i];
			 var ifid = iframe.ifid;
			 var date_  = iframe.date;
			 var sb = iframe.savedby;
			 var bookable = iframe.iframedata.book;
	         var appendData = '';
	         appendData+='  <div class="fe_list_single" id="FE_ID-'+ifid+'">';
	         appendData+='  <input type="text" style="display:none" id="width_fe_-'+ifid+'" value="'+iframe.iframedata.iw+'"/>';
	         appendData+='  <input type="text" style="display:none" id="height_fe_-'+ifid+'" value="'+iframe.iframedata.ih+'">';
	         appendData+='  <input type="text" style="display:none" id="pid_fe_-'+ifid+'" value="'+pid+'">';
	         appendData+='   <table class="fe_list_table_" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">';
	         appendData+='    <tr class="fe_list_table_head">';
	         appendData+='     <td style="width:100px">Date saved (UTC)</td>';
	         appendData+='	   <td style="width:50px">Book</td>';
	         appendData+='	   <td style="width:150px">Saved by...</td>';
	         appendData+='     <td >iFrame code</td>';
	         appendData+='     <td ></td>';
	         appendData+='    </tr>';
	         appendData+='     <tr  class="fe_list_table_val">';
	         appendData+='         <td style="width:100px">'+date_+'</td>';
	         if(bookable) {
	          appendData+='	       <td style="width:50px">yes</td>';
	         } else {
	          appendData+='	       <td style="width:50px">no</td>'; 
	         }
	         appendData+='         <td style="width:150px">'+sb+'</td>';
	         var hostName = window.location.host;
	         appendData+='         <td >&lt;iframe src="https://'+hostName+'/getiframe?pid='+pid+'&ifid='+ifid+'"  width="'+iframe.iframedata.iw+'" height="'+iframe.iframedata.ih+'" style="border:none"&gt;&lt;/iframe&gt;</td>';
	         appendData+='         <td style="display: flex;">';
	         appendData+='           <div class="edit_iframe_btn_edit " id="if_edit-'+ifid+'">Edit</div>';
	         appendData+='           <div class="edit_iframe_btn_show" id="if_show-'+ifid+'">Show</div>';
	         appendData+='           <div class="edit_iframe_btn_delete" id="if_delete-'+ifid+'">Delete</div>';
	         appendData+='         </td>';
	         appendData+='       </tr>';
	         appendData+='    </table>';
	         appendData+='</div>';
	         
	         $("#fe_list_append").append(appendData);
	    }
	 }
}
function requestWlBookings() {
    var pid = document.getElementById("server_placeID").value;
    var placeOffset = document.getElementById("server_placeUTC").value;
    
	var TimeOfTheDatePicker_1970 = +$("#datepicker_wl_from").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var dayOfweek = +$("#datepicker_wl_from").datepicker( "getDate" ).getDay();
	var d = new Date();
	var clientOffset = -1*d.getTimezoneOffset()/60;
	
	var placeID = pid;
	var requestJSON = {};		
	requestJSON.date1970 = TimeOfTheDatePicker_1970  ;// - d.getTimezoneOffset()*60 ;
	requestJSON.weekday = dayOfweek;
	requestJSON.period = 2*24*60*60;
	requestJSON.clientOffset = clientOffset;
	requestJSON.placeOffset = placeOffset;
	requestJSON.pid = placeID;
	
	console.log(requestJSON);
	var jsonData = {bookrequest:JSON.stringify(requestJSON)};
	$.ajax({
	      url : "/WaUpdateDateBookings",
	      data: jsonData,
	      beforeSend: function () { $("#wa_load_ajax").show(); $("#wl_load_dates_button").hide();},
	      success : function(data){
	    	 // alert(data);
	    	  $("#wa_load_ajax").hide(); $("#wl_load_dates_button").show();
	    	  console.log(data);
	    	  updateLoadedTimeline(data.orderedResponse);
	    	  InitialBookingList(data.bookings);
	      },
	      dataType : "JSON",
	      type : "post"
	  });

}

function updateLoadedTimeline(data) {
	// Clear previous data
	 tl_canvas.emptyBookings();
	 bookingsManager.clear();
	 bookingsbysid = {};
	
	 InitialBookings = data;
	 var from = InitialBookings.date1970;
	 var to = InitialBookings.date1970 + InitialBookings.period;
	 var offset = InitialBookings.placeOffset;
	 
	 tl_canvas.drawPeriodfrom = from;
	 tl_canvas.fromOrig = from;
	 tl_canvas.drawPeriodto = to;
	 tl_canvas.toOrig = to;
	
	 var shapesBooked = InitialBookings.shapesBooked;

	 for (var b=0 ; b < shapesBooked.length ; b++) {
	   var sid = shapesBooked[b].sid;
	   bookingsbysid[sid] = shapesBooked[b].ordersList;
	 }
	 
		for(var f = 0 ; f < StateFromServer.floors.length ; f++ ) {
			   var shapes = StateFromServer.floors[f].shapes;
			   var floorid = StateFromServer.floors[f].floorid;
			   for (var s=0 ; s < shapes.length ; s++) {
			     if(shapes[s].type != "line" && shapes[s].type != "text" ) {
			     var sid = shapes[s].sid;
				 var x = shapes[s].x;
				 var y = shapes[s].y;
				 var fid = floorid;
				 var name  = shapes[s].booking_options.givenName;
				 var bookings = [];
				 if (bookingsbysid[sid] != undefined) {
				    var booklist = bookingsbysid[sid];
				      for (var t=0 ; t < booklist.length ; t++ ) {
					     var bid = booklist[t].bid;
						 var from = booklist[t].from;
						 var to = booklist[t].to;
						 var persons = booklist[t].persons;
						 var bshape = new BShape(tl_canvas, from , to , bid , persons , "booked",name,sid);

						 bookings.push(bshape);
						 console.log("BShape booking added:");
						 console.log(bshape);
					  }
				 }

				 tl_canvas.setPshapeBookings(sid,bookings);
				 console.log("PShape Bookings added ("+sid+"):");
				 console.log(bookings);
				 }
			   }
	          		   
			}
		
		var placeOpen = InitialBookings.placeOpen;
		
		var array = ['sun','mon','tue','wed','thu','fri','sat'];
		var placeClosedArray = [];
		var placeFromSave = 0;
		for (var i = 0 ; i < placeOpen.length ; i ++ ) {
		    var singleClosed = {};
		   if (placeOpen[i].from > 0) {
		       singleClosed.from = placeFromSave;
			   singleClosed.to = placeOpen[i].from;
			   placeClosedArray.push(singleClosed);
		   } else {
		      
		   }
           placeFromSave = placeOpen[i].to;		   
		}
		if (placeFromSave < (tl_canvas.drawPeriodto - tl_canvas.drawPeriodfrom)) {
		   //add close shape at the end;
		   		    var singleClosed = {};
					singleClosed.from = placeFromSave;
					singleClosed.to=(tl_canvas.drawPeriodto - tl_canvas.drawPeriodfrom);
					placeClosedArray.push(singleClosed);
		}
		for (var c = 0; c < placeClosedArray.length ; c++) {
		   var bshape = new BShape(tl_canvas, tl_canvas.drawPeriodfrom + placeClosedArray[c].from - offset * 3600 , tl_canvas.drawPeriodfrom + placeClosedArray[c].to - offset * 3600, "" , 0 , "closed");
		   tl_canvas.closeShapes.push(bshape);
		   console.log("BShape closed added:");
		   console.log(bshape);
		}
        tl_canvas.organizeShapes();
		tl_canvas.valid = false;
		timelinediv.redraw();
}