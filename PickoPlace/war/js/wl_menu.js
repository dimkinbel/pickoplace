$(document).ready(function() {  
 $(function() {
    $('#timeline_canvas').contextMenu('#wl_menu',{
    // Randomly enable or disable each option
	  constrainToScreen:true,
      beforeShow: function() { 
	      if(tl_canvas.selection != null) {
               if (tl_canvas.listSelected.length == 1) {
				   $(".only_booking_menu").show();
				   $(".wl_menu_option").show();
				   $("#info_menu_line_option").html(""+tl_canvas.hoverSidName);	
				   $("#info_menu_bid_option").html("BookID: "+tl_canvas.bidMouseOver);
				   $("#info_menu_bid_option").css("color","rgb(115, 255, 117)");
			   } else {
			      if(tl_canvas.sameInList == null) {
				     $(".only_booking_menu").hide();
					 $(".wl_menu_option").hide();
					 $("#info_menu_line_option").html(""+tl_canvas.hoverSidName);	
				     $("#info_menu_bid_option").html("BookID: "+tl_canvas.bidMouseOver);
				    $("#info_menu_bid_option").css("color","rgb(115, 255, 117)");
				  } else {
			        $(".only_booking_menu").hide();
					$(".wl_menu_option").hide();
				    $(".only_list_menu").show();
				    $("#info_menu_line_option").html(""+tl_canvas.hoverSidName);	
				    $("#info_menu_bid_option").html("BookID: "+tl_canvas.bidMouseOver);
				    $("#info_menu_bid_option").css("color","rgb(115, 255, 117)");
				   }
			   }
			   $("#wl_select_on_floor").show();
			   $("#wlm_open_details").show();
		 } else {
				$(".only_booking_menu").hide();
				if (tl_canvas.closeSelcted != null) {
				  $("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
				  $("#info_menu_bid_option").html("PLACE CLOSED");
				  $("#info_menu_bid_option").css("color","black");
				} else {
				  $("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
				  $("#info_menu_bid_option").html("NO BOOKINGS");
				  $("#info_menu_bid_option").css("color","red");
				}
				$("#wl_select_on_floor").show();
		 }
	  }
   });
  });
  
  // DATEPICKER -------------------------------------
var placeUTCOffsetGlobal = document.getElementById("server_placeUTC").value;
var d = new Date();
var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
var nd = new Date(utc + (3600000 * parseInt(placeUTCOffsetGlobal)));
var DatepickerSetDate = "+0";
if (d.getDate() != nd.getDate()) {
	if(d.getTime() > nd.getTime()) {
		// Client timezone is one day higher
		DatepickerSetDate = "-1";
	} else {
		DatepickerSetDate = "+1";
	}
}
$("#datepicker_wl_from").datepicker({
    currentText: "Now",
	defaultDate: DatepickerSetDate,
	autoClose:true,
	dateFormat: "dd/mm/yy",
    onSelect: function(dateText, inst) {
    	//alert("ONSELECT:"+dateText);
    	
    	},
    onClose: function(dateText, inst) {
    	}
});
$( "#datepicker_wl_from" ).datepicker("setDate", DatepickerSetDate);

var initial_page_load_update = true;
$("#wl_load_dates_button").click(function(){
	if(initial_page_load_update) {
		initial_page_load_update = false;
	    requestWlBookings();
	} else {
		setSessionData(function(result) {
 		   if(result) {
 			  requestWlBookings();
 			} else {
 				updatePageView();
 			}
 		});
	}
});
  
  //-------------------------------------------------
  $("#wl_up").click(function(){
     tl_canvas.selectedUP();
  });
  $("#wl_down").click(function(){
     tl_canvas.selectedDown();
  });
  $("#wl_top").click(function(){
     tl_canvas.selectedTop();
  });
  $("#wl_bottom").click(function(){
     tl_canvas.selectedBottom();
  });
  $("#wlm_highlight_same_order").click(function(){
     tl_canvas.selectSameBooking();
  });
   $("#wlm_open_details").click(function(){
     tl_canvas.openDetails();
  }); 
  
 $("#wl_select_on_floor").click(function(){
     tl_canvas.selectPlaces();
  }); 
  
    $('#wl_bookings_current').change(function() {
        if($(this).is(":checked")) {
            $("#wl_list_current_list_row").show();
        } else {
		     $("#wl_list_current_list_row").hide();
		}
    });	
     $('#wl_bookings_next').change(function() {
        if($(this).is(":checked")) {
            $("#wl_list_next_list_row").show();
        } else {
		     $("#wl_list_next_list_row").hide();
		}
    }); 
     $('#wl_bookings_past').change(function() {
        if($(this).is(":checked")) {
            $("#wl_list_past_list_row").show();
        } else {
		     $("#wl_list_past_list_row").hide();
		}
    }); 
	$("#open_bookings_list_btn").click(function(){
	   $(this).hide();
	   $("#transition_open").addClass("wl_list_show");
	   $("#transition_open").removeClass("wl_list_hide");
	});
	$("#close_transition_bookings").click(function(){
	   $("#transition_open").addClass("wl_list_hide");
	   $("#transition_open").removeClass("wl_list_show");
	   $("#open_bookings_list_btn").show();
	});
	$(window).resize(function () {
    waitForFinalEvent(function(){
      applyPosition() ;
      //...
    }, 500, "some unique string");
   });
    $('#view_options_btn_dropit').dropit();
	$(".vo_wrap_div").click(function(){
	  
	    var id_ = $(this).attr('id');
		if(id_=="t100x100") {
		  var cp = positionmanager.currentPosition;
			cp.top_perc = 100;
			cp.bot_perc = 0;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 0;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.timeline;
			cp.idtright = null;
			cp.idbleft = null;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="af100x100") {
		  var cp = positionmanager.currentPosition;
			cp.top_perc = 100;
			cp.bot_perc = 0;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 0;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.allfloors;
			cp.idtright = null;
			cp.idbleft = null;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="t50xaf50") {
		  var cp = positionmanager.currentPosition;
			cp.top_perc = 50;
			cp.bot_perc = 50;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 100;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.timeline;
			cp.idtright = null;
			cp.idbleft = positionmanager.allfloors;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="t50xf50f50") {
		    var cp = positionmanager.currentPosition;
		    var proposal = calcfloorssize("horisontal",getAvailable(true,cp.right_width),1)
		    var floorsH = parseInt(proposal.proposed);
			var totalH = getAvailable(false,cp.right_width);
			if(floorsH > 0.6 * totalH) {
				floorsH = 0.6 * totalH;				
			}
			var floorsPerc = 100 * floorsH / totalH;
			var timePerc = 100 - floorsPerc;
			cp.top_perc = timePerc;
			cp.bot_perc = floorsPerc;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			for(var f = 0 ;f < floorCanvases.length ; f++) {
			  if(floorCanvases[f].mainfloor) {
			     var floorID= floorCanvases[f].floorid;
				 for (var v = 0; v < proposal.flist.length ; v++) {
				    if(proposal.flist[v].floorid == floorID) {
					   cp.botleft_perc = parseInt(proposal.flist[v].perc);
					   cp.idbleft = positionmanager.floors[floorID];
					}
				 }
			  } else {
			     var floorID= floorCanvases[f].floorid;
				 for (var v = 0; v < proposal.flist.length ; v++) {
				    if(proposal.flist[v].floorid == floorID) {
					   cp.botright_perc = parseInt(proposal.flist[v].perc);
					   cp.idbright  = positionmanager.floors[floorID];
					}					
				}
			  }
			}
			//cp.botleft_perc = ?;
			//cp.botright_perc = ?;
			cp.idtleft = positionmanager.timeline;
			cp.idtright = null;
			//cp.idbleft = positionmanager.allfloors;
			//cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="af100xt100") {
		  var cp = positionmanager.currentPosition;
			cp.top_perc = 50;
			cp.bot_perc = 50;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 100;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.allfloors;
			cp.idtright = null;
			cp.idbleft = positionmanager.timeline;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="f50f50xt100") {
		    var cp = positionmanager.currentPosition;
		    var proposal = calcfloorssize("horisontal",getAvailable(true,cp.right_width),1)
		    var floorsH = parseInt(proposal.proposed);
			var totalH = getAvailable(false,cp.right_width);
			if(floorsH > 0.6 * totalH) {
				floorsH = 0.6 * totalH;				
			}
			var floorsPerc = 100 * floorsH / totalH;
			var timePerc = 100 - floorsPerc;
			cp.top_perc = floorsPerc;
			cp.bot_perc = timePerc;
			cp.botleft_perc = 100;
			cp.topright_perc = 0;
			for(var f = 0 ;f < floorCanvases.length ; f++) {
			  if(floorCanvases[f].mainfloor) {
			     var floorID= floorCanvases[f].floorid;
				 for (var v = 0; v < proposal.flist.length ; v++) {
				    if(proposal.flist[v].floorid == floorID) {
					   cp.topleft_perc = parseInt(proposal.flist[v].perc);
					   cp.idtleft = positionmanager.floors[floorID];
					}
				 }
			  } else {
			     var floorID= floorCanvases[f].floorid;
				 for (var v = 0; v < proposal.flist.length ; v++) {
				    if(proposal.flist[v].floorid == floorID) {
					   cp.topright_perc = parseInt(proposal.flist[v].perc);
					   cp.idtright  = positionmanager.floors[floorID];
					}					
				}
			  }
			}
			//cp.botleft_perc = ?;
			//cp.botright_perc = ?;
			cp.idbleft = positionmanager.timeline;
			cp.idbright = null;
			//cp.idbleft = positionmanager.allfloors;
			//cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} 
	});
	$("#show_bookins_row_btn").click(function(){
	   if($("#bookings_col_enable").is(":checked")) {
	       positionmanager.currentPosition.right_width = 0;
		   applyPosition() ;
		   $("#transition_open").addClass("wl_list_hide");
	       $("#transition_open").removeClass("wl_list_show");
		   $("#open_bookings_list_btn").show();
		   $("#close_transition_bookings").show();
            $('#bookings_col_enable').prop('checked', false);
		    $('#show_bookins_row_btn').html('Show bookings');
        } else {
		    positionmanager.currentPosition.right_width = 360;
			applyPosition() ;
			$("#open_bookings_list_btn").hide();
		   $("#transition_open").addClass("wl_list_show");
	        $("#transition_open").removeClass("wl_list_hide");
			$("#close_transition_bookings").hide();
		    $('#bookings_col_enable').prop('checked', true);
		    $('#show_bookins_row_btn').html('Hide bookings');
			
		}
	});
});
	function floorAppend(appendTo_,singleBoth,singleFloorID,temp) {
	        var appendToWidth = document.getElementById(appendTo_).offsetWidth;
            var appendToHeight = document.getElementById(appendTo_).offsetHeight;
			var temp_ = false;
			if(temp!= undefined && temp == true) {
			    temp_ = true;
			}
	   if(singleBoth) {
	          var canvas_ref;
			  var floor_ind;
	          for (var f = 0 ;f < floorCanvases.length ; f++) {
                if(singleFloorID == floorCanvases[f].floorid) {
	             canvas_ref = floorCanvases[f];
				 floor_ind = f;
	           }
              }

			if(temp_) {
				$('#'+appendTo_).append( $('#div_wrap-canvas_'+singleFloorID) );
				return;
			} else {
			   if(document.getElementById("canvas_appended_wrapper-"+singleFloorID) != null) {
			     var element = document.getElementById("canvas_appended_wrapper-"+singleFloorID);
			     element.outerHTML = "";
	             delete element;
			   }
			}
	        
	        var appendData ="<div id='canvas_appended_wrapper-"+singleFloorID+"' class='canvas_shown_wrapper'></div>";
			$("#"+appendTo_).append(appendData);
			
			appendData ='<div class="zoom_options_book">';
			appendData +='<div id="plus_minus_wrap">';
			appendData +='   <div id="zoom_plus_div" onclick="sizeUp(floorCanvases['+floor_ind+'])" title="Zoom-In">+</div>';
			appendData +='  <div id="zoom_split"></div>';
			appendData +='  <div id="zoom_minus_div"  onclick="sizeDown(floorCanvases['+floor_ind+'])"  title="Zoom-Out">-</div>';
		    appendData +=' </div>';
		    appendData +='<div id="zoom_reset_div" onclick="zoomResetWrap(floorCanvases['+floor_ind+'],\'canvas_appended_wrapper-'+singleFloorID+'\',\'canvas_wrap_not_scroll_conf-'+singleFloorID+'\')"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>';
 
			appendData +='</div>';
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			appendData ="<div class='floor_single_name'>"+canvas_ref.floor_name+"</div>";
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			
			appendData =' <div id="canvas_wrap_not_scroll_conf-'+singleFloorID+'" class="canvas_wrap_not_scroll_conf"></div>';
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-"+singleFloorID;
			$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("width",appendToWidth );
			$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("height",appendToHeight );
			
			$('#canvas_wrap_not_scroll_conf-'+singleFloorID).append( $('#div_wrap-canvas_'+singleFloorID) );
			$('#div_wrap-canvas_'+singleFloorID).show();
			zoomResetWrap(floorCanvases[floor_ind],'canvas_appended_wrapper-'+singleFloorID,'canvas_wrap_not_scroll_conf-'+singleFloorID);
						
	   } else {
	          var canvas_ref;
			  var floor_ind;
             
			if(temp_) {
			  for (var f = 0 ;f < floorCanvases.length ; f++) {
                 $('#'+appendTo_).append( $('#div_wrap-canvas_'+floorCanvases[f].floorid) );
              }	
			  return;
			} else {
			   if(document.getElementById("canvas_appended_wrapper-both") != null) {
			     var element = document.getElementById("canvas_appended_wrapper-both");
			     element.outerHTML = "";
	             delete element;
			   }
			}
			  
	        var appendData ="<div id='canvas_appended_wrapper-both' class='canvas_shown_wrapper'></div>";
			$("#"+appendTo_).append(appendData);
			
			appendData ='<div class="zoom_options_book">';
			appendData +='<div id="plus_minus_wrap">';
			appendData +='   <div id="zoom_plus_div" onclick="sizeUp(canvas_)" title="Zoom-In">+</div>';
			appendData +='  <div id="zoom_split"></div>';
			appendData +='  <div id="zoom_minus_div"  onclick="sizeDown(canvas_)"  title="Zoom-Out">-</div>';
		    appendData +=' </div>';
		    appendData +='<div id="zoom_reset_div" onclick="zoomResetWrap(canvas_,\'canvas_appended_wrapper-both\',\'canvas_wrap_not_scroll_conf-both\')"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>';

			appendData +='</div>';
			$("#canvas_appended_wrapper-both").append(appendData);
			appendData ="<div class='floor_single_name_wrap' id='floor_buttons_wrap'></div>";
			$("#canvas_appended_wrapper-both").append(appendData);
			for (var f = 0 ;f < floorCanvases.length ; f++) {              
	             canvas_ref = floorCanvases[f];
				 appendData ='<div class="floor_single_name_click" onclick="selectFloorByID(\''+canvas_ref.floorid+'\')">'+canvas_ref.floor_name+'</div>';
				 $("#floor_buttons_wrap").append(appendData);	           
              }
			
			
			
			appendData =' <div id="canvas_wrap_not_scroll_conf-both" class="canvas_wrap_not_scroll_conf"></div>';
			$("#canvas_appended_wrapper-both").append(appendData);
			for (var f = 0 ;f < floorCanvases.length ; f++) {              
	             canvas_ref = floorCanvases[f];
			     canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-both";
			}
			$("#canvas_wrap_not_scroll_conf-both").css("width",appendToWidth );
			$("#canvas_wrap_not_scroll_conf-both").css("height",appendToHeight );
			for (var f = 0 ;f < floorCanvases.length ; f++) {  
			    canvas_ref = floorCanvases[f];
				$('#canvas_wrap_not_scroll_conf-both').append( $('#div_wrap-canvas_'+canvas_ref.floorid) );
			}
			for (var f = 0 ;f < floorCanvases.length ; f++) {  
				canvas_ref = floorCanvases[f];
				if(canvas_ref.mainfloor == true) {
				   $('#div_wrap-canvas_'+canvas_ref.floorid).show();
				   zoomResetWrap(canvas_ref,'canvas_appended_wrapper-both','canvas_wrap_not_scroll_conf-both');
				   canvas_ = canvas_ref;
				} else {
				   $('#div_wrap-canvas_'+canvas_ref.floorid).hide();	
				}
			}					
	   }
	}
	function selectFloorByID(floorID) {
	    for (var f = 0 ;f < floorCanvases.length ; f++) {  
				canvas_ref = floorCanvases[f];
				if(canvas_ref.floorid == floorID) {
				   $('#div_wrap-canvas_'+canvas_ref.floorid).show();
				   zoomResetWrap(canvas_ref,'canvas_appended_wrapper-both','canvas_wrap_not_scroll_conf-both');
				   canvas_ = canvas_ref;
				} else {
					$('#div_wrap-canvas_'+canvas_ref.floorid).hide();
				}
			}
	}

	function appendTimeline(appendTo_) {
	    var appendToWidth = document.getElementById(appendTo_).offsetWidth;
        var appendToHeight = document.getElementById(appendTo_).offsetHeight;
		//var canvasHeight = appendToHeight - document.getElementById("canvas_timeline_div").offsetHeight - document.getElementById("timeline_buttons_wrap").offsetHeight;
		var canvasHeight = appendToHeight - 50 - 26;
		var buttonsWidth =  430 ;
		document.getElementById('timeline_canvas').height = canvasHeight;
		document.getElementById('timeline_canvas').width = appendToWidth  ;
		$("#"+appendTo_).css("position","relative");
		$('#'+appendTo_).append($('#canvas_timeline_div'));
		$('#'+appendTo_).append($('#timeline_buttons_wrap'));
		$('#'+appendTo_).append($('#canvas_slimscroll'));
		

		
		$("#timeline_buttons_wrap").css('width',appendToWidth );

		tl_canvas.width = appendToWidth  ;
		tl_canvas.height = canvasHeight;
		tl_canvas.origHeight = canvasHeight;
		tl_canvas.origHeightReset = canvasHeight;
		tl_canvas.lineReset();	
		var ctw = parseInt(document.getElementById('timeline_canvas').width) ;
		
		$(".slimScrollDiv").remove();
		$('#canvas_slimscroll').slimScroll({
			position: 'right',
			height: canvasHeight + 'px',
			width:ctw,
			railVisible: true,
			size: '10px',
        });
		$('#canvas_slimscroll').css('height',canvasHeight+"px");
		$('#canvas_slimscroll').css('width',appendToWidth +"px");	
        timelinediv.updateNowTime();		
	}

	
	function applyPosition() {
	     var currentPosition = positionmanager.currentPosition;
			organizeViews (currentPosition.top_perc , 
		               currentPosition.bot_perc ,
					   currentPosition.right_width,
					   currentPosition.topleft_perc , 
					   currentPosition.topright_perc , 
					   currentPosition.botleft_perc , 
					   currentPosition.botright_perc , 
					   currentPosition.idtleft , 
					   currentPosition.idtright , 
					   currentPosition.idbleft , 
					   currentPosition.idbright );	
	}
	function ApplyInitialPosition() {
	  // positionmanager
	  // Create view objects
	  positionmanager.floors = {};
	  for (f= 0 ; f < floorCanvases.length ; f++) {
	      var flist_ = {};
		  flist_.floorid = floorCanvases[f].floorid;
		  flist_.single = true;
		  flist_.timeline = false;
		  positionmanager.floors[flist_.floorid] = flist_;		  
		}
		var allfloors = {};
		allfloors.timeline = false;
		allfloors.single = false;
		positionmanager.allfloors = allfloors;
		var timeline = {};
		timeline.timeline = true;
		positionmanager.timeline = timeline;
		var currentPosition = {};
		currentPosition.top_perc = 50;
		currentPosition.bot_perc = 50;
		currentPosition.right_width = 2;
		currentPosition.topleft_perc = 100;
		currentPosition.topright_perc = 0;
		currentPosition.botleft_perc = 100;
		currentPosition.botright_perc = 0;
		currentPosition.idtleft = positionmanager.allfloors;
		currentPosition.idtright = null;
		currentPosition.idbleft = positionmanager.timeline;
		currentPosition.idbright = null;
		positionmanager.currentPosition = currentPosition;
		organizeViews (currentPosition.top_perc , 
		               currentPosition.bot_perc ,
					   currentPosition.right_width,
					   currentPosition.topleft_perc , 
					   currentPosition.topright_perc , 
					   currentPosition.botleft_perc , 
					   currentPosition.botright_perc , 
					   currentPosition.idtleft , 
					   currentPosition.idtright , 
					   currentPosition.idbleft , 
					   currentPosition.idbright );		
	}

	//var currentPosition.timeline = "id"
	//var currentPosition.floorid{fid} = "id";
	//var gridObj = {};
	//gridObj.timeline = true;
	//gridObj.single = true;
	//gridObj.floorid = "floorid";
	function getAvailable(width,right_width) {
	   var browserHeight = window.innerHeight;
	   var browserWidth = window.innerWidth;
	   var leftColumnWidth = document.getElementById("left_column__").offsetWidth;
	   var headerHeight = document.getElementById("header_td").offsetHeight;
	   var buttonsRowHeight = document.getElementById("content_header_row").offsetHeight;
	  // assignments
	   var rightColumnWidth = right_width;
	   if(width) {
	     var availableWidth = browserWidth - leftColumnWidth - rightColumnWidth;
		 return availableWidth;
	   } else {
	      var availableHeight = browserHeight - headerHeight - buttonsRowHeight;
		  return availableHeight;
	   }
	}
	function organizeViews (top_perc , bot_perc ,right_width,topleft_perc , topright_perc , botleft_perc , botright_perc , idtleft , idtright , idbleft , idbright ) {
	  console.log("top_perc="+top_perc+",bot_perc:"+bot_perc+",right_width:"+right_width+",topleft_perc:"+topleft_perc+",topright_perc:"+topright_perc+",botleft_perc:"+botleft_perc+",botright_perc:"+botright_perc);
	  var browserHeight = window.innerHeight;
	  var browserWidth = window.innerWidth;
	  // move to temp
	  appendTimeline("temp_appends"); // timeline
	  floorAppend("temp_appends",false,"",true); // all floors only wrappers
	  $("#content_top_left_cell").html("");
	  $("#content_top_right_cell").html("");
	  $("#content_bottom_left_cell").html("");
	  $("#content_bottom_right_cell").html("");
	  //
	  var leftColumnWidth = document.getElementById("left_column__").offsetWidth;
	  var headerHeight = document.getElementById("header_td").offsetHeight;
	  var buttonsRowHeight = document.getElementById("content_header_row").offsetHeight;
	  // assignments
	  var rightColumnWidth = right_width;
	  document.getElementById("content_td_ac_wl").style.width = browserWidth - leftColumnWidth - 2;
	  document.getElementById("content_td_ac_wl").style.height = browserHeight - headerHeight - buttonsRowHeight;
	  document.getElementById("right_column_like").style.width = right_width + "px";//content_td_ac_wl
	  
	  var availableWidth = browserWidth - leftColumnWidth - rightColumnWidth;
	  var availableHeight = browserHeight - headerHeight - buttonsRowHeight;
	  document.getElementById("center_column_like").style.width = availableWidth;
	  document.getElementById("center_column_like").style.height = availableHeight;
	  document.getElementById("content_top_row").style.height = (top_perc==0)?"0px":parseInt(0.01 * top_perc * availableHeight)    + "px";
	  document.getElementById("content_bottom_row").style.height = (bot_perc==0)?"0px":parseInt(0.01 * bot_perc * availableHeight)    + "px";
	  document.getElementById("content_top_left_cell").style.width = (topleft_perc==0)?"0px":parseInt(0.01 * topleft_perc * availableWidth)    + "px";
	  document.getElementById("content_top_right_cell").style.width = (topright_perc==0)?"0px":parseInt(0.01 * topright_perc * availableWidth)    + "px";
	  document.getElementById("content_bottom_left_cell").style.width = (botleft_perc==0)?"0px":parseInt(0.01 * botleft_perc * availableWidth)  + "px";
	  document.getElementById("content_bottom_right_cell").style.width = (botright_perc==0)?"0px":parseInt(0.01 * botright_perc * availableWidth) + "px";
	  if (bot_perc == 0) {	    
		if(topright_perc == 0) {
		  //ONLY: idtleft
		  if (idtleft.timeline == true) {
		        appendTimeline("content_top_left_cell");

		  } else {
		    if(idtleft.single == true) {
			   floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}
		  }
		} else {
		  if (idtleft.timeline == true) {
		    appendTimeline("content_top_left_cell");
		  } else {
		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}
		  }
		 if (idtright.timeline == true) {
		    appendTimeline("content_top_right_cell");
		  } else {
		    if(idtright.single == true) {
			  floorAppend("content_top_right_cell",true,idtright.floorid);
			} else {
			  floorAppend("content_top_right_cell",false,"");
			}
		  }		  
		}
	  } else {
	    if(topright_perc == 0) {
		//ONLY: idtleft ,
		  if (idtleft.timeline == true) {
		    appendTimeline("content_top_left_cell");
		  } else {
		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}
		  }
		} else {
		  //ONLY: idtleft , idtright , idbleft , [idbright]
		  if (idtleft.timeline == true) {
		    appendTimeline("content_top_left_cell");
		  } else {
		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}
		  }
		 if (idtright.timeline == true) {
		    appendTimeline("content_top_right_cell");
		  } else {
		    if(idtright.single == true) {
			  floorAppend("content_top_right_cell",true,idtright.floorid);
			} else {
			  floorAppend("content_top_right_cell",false,"");
			}
		  }			  
		}
		if(botright_perc == 0) {
		  //ONLY:  idbleft
		  if (idbleft.timeline == true) {
		    appendTimeline("content_bottom_left_cell");
		  } else {
		    if(idbleft.single == true) {
			  floorAppend("content_bottom_left_cell",true,idbleft.floorid);
			} else {
			  floorAppend("content_bottom_left_cell",false,"");
			}
		  }		  
		} else {
          //ONLY: idtleft , [idtright] , idbleft , idbright
		  if (idbleft.timeline == true) {
		    appendTimeline("content_bottom_left_cell");
		  } else {
		    if(idbleft.single == true) {
			  floorAppend("content_bottom_left_cell",true,idbleft.floorid);
			} else {
			  floorAppend("content_bottom_left_cell",false,"");
			}
		  }
		 if (idbright.timeline == true) {
		    appendTimeline("content_bottom_right_cell");
		  } else {
		    if(idbright.single == true) {
			  floorAppend("content_bottom_right_cell",true,idbright.floorid);
			} else {
			  floorAppend("content_bottom_right_cell",false,"");
			}
		  }			  
		}		
	  }
	}
   // fdist = {};
   // fdist.horver = "horisontal"/"vertical"
   // fdist.op = proposed;
   // fdist.flist = [];
   // fdist.flist[i] = {};
   // fdist.flist[i].floorid = floorid;
   // fdist.flist[i].w = width;
   // fdist.flist[i].h = height;
   // fdist.flist[i].wh = width/height;
   // fdist.flist[i].perc = perc;
   // fdist.flist[i].hw = height/width;
	function calcfloorssize (horisontal,available,padding) {
	   fdist = {};
	   fdist.horver = horisontal;
	   fdist.flist = [];
	   var minWidth = 10000;
	   var minHeight = 10000;
	   var maxWidth = 0;
	   var maxHeight = 0;
	   var totalWH = 0;
	   var totalHW = 0;
	   for (f= 0 ; f < floorCanvases.length ; f++) {
	      var flist_ = {};
		  flist_.floorid = floorCanvases[f].floorid;
		  flist_.w = floorCanvases[f].origWidth;
		  flist_.h = floorCanvases[f].origHeight;
		  flist_.wh = flist_.w/flist_.h;
		  totalWH+=flist_.wh;
		  flist_.hw = flist_.h/flist_.w;
		  totalHW+= flist_.hw;
		  if (flist_.w < minWidth) {minWidth = flist_.w;}
		  if (flist_.w > maxWidth) {maxWidth = flist_.w;}
		  if (flist_.h < minWidth) {minHeight = flist_.h;}
		  if (flist_.h > maxWidth) {maxHeight = flist_.h;}
		  fdist.flist.push(flist_);
	   }
	   if (horisontal == "horisontal") {
	     var proposedH = (available - floorCanvases.length * padding )/totalWH;
		 for (var f= 0 ; f < fdist.flist.length ; f++) {
		    fdist.flist[f].perc =100*proposedH*fdist.flist[f].wh/(available  - floorCanvases.length * padding );
		 }
		 fdist.proposed = proposedH ;
	   } else {
	   
	   }
	   return fdist;
	}
	
	
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();