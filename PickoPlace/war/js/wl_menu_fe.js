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
    	//requestWlBookings();
    	},
    onClose: function(dateText, inst) {
    	}
});
$( "#datepicker_wl_from" ).datepicker("setDate", DatepickerSetDate);


  
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
      applyTableHeight() ;
      //...
    }, 500, "some unique string");
   });
    $('#view_options_btn_dropit').dropit();
	$(".fe_single_option_main").click(function(){	  
	    var id_ = $(this).attr('id');
		var open = false;
		if( $("#"+id_+"_hidden").is(':visible') )
             {
                 open = true;
             }
		$(".feos_hidden").hide();
		if(!open) {$("#"+id_+"_hidden").show();}
	});
	
	$(".flors_option_main_div").click(function(){	  
	    var id_ = $(this).attr('id');
		$(".flors_option_hidden_div").hide();
		$("#"+id_+"_hidden").show();
		$("#feo_all_flors_checkbox").prop('checked', false);
		$("#feo_separate_flors_checkbox").prop('checked', false);
		$("#feo_single_floor_checkbox").prop('checked', false);
		$("#"+id_+"_checkbox").prop('checked', true);
		//$('#' + id).is(":checked")
	});
	$("#feo_booking_available").click(function(){	
	    if($("#feo_booking_available_checkbox").is(":checked")) {
		
		    $("#feo_booking_available_checkbox").prop('checked', false);
			$("#feo_booking_available_hidden").hide();
			$("#bookings_fe_wrap_main").hide();
		} else {
		
		    $("#feo_booking_available_checkbox").prop('checked', true);
			$("#feo_booking_available_hidden").show();
			$("#bookings_fe_wrap_main").show();
		}
	});
	$("#feo_booking_available_checkbox").click(function(){	
	    if($("#feo_booking_available_checkbox").is(":checked")) {
		
		    $("#feo_booking_available_checkbox").prop('checked', false);
			$("#feo_booking_available_hidden").hide();
			$("#bookings_fe_wrap_main").hide();
		} else {
		
		    $("#feo_booking_available_checkbox").prop('checked', true);
			$("#feo_booking_available_hidden").show();
			$("#bookings_fe_wrap_main").show();
		}
	});
	
	$("#iframe_width_left").mousedown(function(){
	      var curv = $("#iframe_width").slider("value");
		  $("#iframe_set_width").val(curv - 1);
		  $("#set_iframe_width").click();
	   });
		$("#iframe_width_right").mousedown(function(){
	      var curv = $("#iframe_width").slider("value");
		  $("#iframe_set_width").val(curv + 1);
		  $("#set_iframe_width").click();
	   });
		$("#iframe_height_left").mousedown(function(){
	      var curv = $("#iframe_height").slider("value");
		  $("#iframe_set_height").val(curv - 1);
		  $("#set_iframe_height").click();
	   });
		$("#iframe_height_right").mousedown(function(){
	      var curv = $("#iframe_height").slider("value");
		  $("#iframe_set_height").val(curv + 1);
		  $("#set_iframe_height").click();
	   });
	   
		$("#floor_width_left").mousedown(function(){
	      var curv = $("#border_width").slider("value");
		  $("#border_set_width").val(curv - 1);
		  $("#set_border_width").click();
	   });
		$("#floor_width_right").mousedown(function(){
	      var curv = $("#border_width").slider("value");
		  $("#border_set_width").val(curv + 1);
		  $("#set_border_width").click();
	   });
		$("#floor_height_left").mousedown(function(){
	      var curv = $("#border_height").slider("value");
		  $("#border_set_height").val(curv - 1);
		  $("#set_border_height").click();
	   });
		$("#floor_height_right").mousedown(function(){
	      var curv = $("#border_height").slider("value");
		  $("#border_set_height").val(curv + 1);
		  $("#set_border_height").click();
	   });
// Iframe width	
	$("#iframe_width").slider({
	   min:400,
	   max:1200,
	   step:1,
	   stop: function( event, ui ) {
		  $("#iframe_set_width").val(ui.value);
		  $("#iframe_wrap").css("width",ui.value);
	   },
	   slide: function( event, ui ) {
		  $("#iframe_set_width").val(ui.value);
		  $("#iframe_wrap").css("width",ui.value);
	   }
    });
	$("#set_iframe_width").click(function(){
	  var value_ = parseInt($("#iframe_set_width").val());
	  if(value_ >= 400 && value_ <= 1200) {
	    $('#iframe_width').slider('value', value_);
		$("#iframe_wrap").css("width",value_);
	  } else {
	     alert("["+value_+"] Please enter width between next values: 400-1200");
	  }
	});
// Iframe height	
	$("#iframe_height").slider({
	   min:400,
	   max:1200,
	   step:1,
	   stop: function( event, ui ) {
		  $("#iframe_set_height").val(ui.value);
		  $("#iframe_wrap").css("height",ui.value);
	   },
	   slide: function( event, ui ) {
		  $("#iframe_set_height").val(ui.value);
		  $("#iframe_wrap").css("height",ui.value);
	   }
    });
	$("#set_iframe_height").click(function(){
	  var value_ = parseInt($("#iframe_set_height").val());
	  if(value_ >= 400 && value_ <= 1200) {
	    $('#iframe_height').slider('value', value_);
		$("#iframe_wrap").css("height",value_);
	  } else {
	     alert("["+value_+"] Please enter height between next values: 400-1200");
	  }
	});
   
	// Border width	
	$("#border_width").slider({
	   min:100,
	   max:1000,
	   step:1,
	   stop: function( event, ui ) {
		  $("#border_set_width").val(ui.value);
		  if($("#feo_separate_flors_checkbox").is(":checked")) {
		       var flooridSelected;
		       var selectorID;
		       var allfloors =  document.getElementsByName("floor_single_dim");  	
               for(var x=0; x < allfloors.length; x++) { 
		          var selectorID = allfloors[x].id;
    		      flooridSelected = selectorID.replace(/^floor_single_dimensions-/, ""); 
				  if($("#"+selectorID).is(":checked")) {
				      if(positionmanager.currentPosition.idbleft == null) {
					   // horisontal
					     if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
			                 var right_h = document.getElementById("content_top_right_cell").offsetHeight;
							 var right_w = document.getElementById("content_top_right_cell").offsetWidth;
							 organizeViewsPx ( ui.value , 
											   left_h ,
											   right_w , 
											   right_h , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 } else {
						   // top right cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var right_h = document.getElementById("content_top_right_cell").offsetHeight;
							 organizeViewsPx ( left_w , 
											   left_h ,
											   ui.value , 
											   right_h , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 }
					  } else {
					  // vertical
					      if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
			                 var bot_h = document.getElementById("content_bottom_left_cell").offsetHeight;
							 var bot_w = document.getElementById("content_bottom_left_cell").offsetWidth;
							 organizeViewsPx ( ui.value , 
											   left_h ,
											   0 , 
											   0 , 
											   bot_w , 
											   bot_h , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 } else {
						   // bot left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var bot_h = document.getElementById("content_bottom_left_cell").offsetHeight;
							 organizeViewsPx ( left_w , 
											   left_h ,
											   0 , 
											   0 , 
											   ui.value , 
											   bot_h , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 }
					  }
				  }
				}
		  } else {
		       var iframeHeight = document.getElementById("content_top_left_cell").offsetHeight;
	           var iframeWidth = document.getElementById("content_top_left_cell").offsetWidth;
			   var currentPosition = positionmanager.currentPosition;
			    organizeViewsPx ( ui.value , 
							   iframeHeight ,
							   0 , 
							   0 , 
							   0 , 
							   0 , 
							   currentPosition.idtleft , 
							   currentPosition.idtright , 
							   currentPosition.idbleft , 
							   currentPosition.idbright );
				if($("#feo_single_floor_checkbox").is(":checked")) {
				  $("#canvas_wrap_not_scroll_conf-"+currentPosition.idtleft.floorid).removeClass("red_class");
				} else {
				 $("#canvas_wrap_not_scroll_conf-both").removeClass("red_class");				 
				}
		  }
		 // $("#iframe_wrap").css("width",ui.value);
	   },
	   slide: function( event, ui ) {
		  $("#border_set_width").val(ui.value);
		  
		  if($("#feo_separate_flors_checkbox").is(":checked")) {
		       document.getElementById("canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).style.width = ui.value + "px";
		       $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).addClass("red_class");
		  } else if ($("#feo_single_floor_checkbox").is(":checked")) {
		       var currentPosition = positionmanager.currentPosition;
		       document.getElementById("canvas_wrap_not_scroll_conf-"+currentPosition.idtleft.floorid).style.width = ui.value + "px";
			  $("#canvas_wrap_not_scroll_conf-"+currentPosition.idtleft.floorid).addClass("red_class");
		  } else {
		      document.getElementById("canvas_wrap_not_scroll_conf-both").style.width = ui.value + "px";
			  $("#canvas_wrap_not_scroll_conf-both").addClass("red_class");
		  }
		 // $("#iframe_wrap").css("width",ui.value);
	   }
    });
	$("#set_border_width").click(function(){
	  var value_ = parseInt($("#border_set_width").val());
	  if(value_ >= 100 && value_ <= 1000) {
	    $('#border_width').slider('value', value_);
		if($("#feo_separate_flors_checkbox").is(":checked")) {
		       var flooridSelected;
		       var selectorID;
		       var allfloors =  document.getElementsByName("floor_single_dim");  	
               for(var x=0; x < allfloors.length; x++) { 
		          var selectorID = allfloors[x].id;
    		      flooridSelected = selectorID.replace(/^floor_single_dimensions-/, ""); 
				  if($("#"+selectorID).is(":checked")) {
				      if(positionmanager.currentPosition.idbleft == null) {
					   // horisontal
					     if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
			                 var right_h = document.getElementById("content_top_right_cell").offsetHeight;
							 var right_w = document.getElementById("content_top_right_cell").offsetWidth;
							 organizeViewsPx ( value_ , 
											   left_h ,
											   right_w , 
											   right_h , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
						 } else {
						   // top right cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var right_h = document.getElementById("content_top_right_cell").offsetHeight;
							 organizeViewsPx ( left_w , 
											   left_h ,
											   value_ , 
											   right_h , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
						 }
					  } else {
					  // vertical
					      if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
			                 var bot_h = document.getElementById("content_bottom_left_cell").offsetHeight;
							 var bot_w = document.getElementById("content_bottom_left_cell").offsetWidth;
							 organizeViewsPx ( value_ , 
											   left_h ,
											   0 , 
											   0 , 
											   bot_w , 
											   bot_h , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
						 } else {
						   // bot left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var bot_h = document.getElementById("content_bottom_left_cell").offsetHeight;
							 organizeViewsPx ( left_w , 
											   left_h ,
											   0 , 
											   0 , 
											   value_ , 
											   bot_h , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
						 }
					  }
				  }
				}
		  } else {
		       var iframeHeight = document.getElementById("content_top_left_cell").offsetHeight;
	           var iframeWidth = document.getElementById("content_top_left_cell").offsetWidth;
			   var currentPosition = positionmanager.currentPosition;
			    organizeViewsPx ( value_ , 
							   iframeHeight ,
							   0 , 
							   0 , 
							   0 , 
							   0 , 
							   currentPosition.idtleft , 
							   currentPosition.idtright , 
							   currentPosition.idbleft , 
							   currentPosition.idbright );
		  }
	  } else {
	     alert("["+value_+"] Please enter width between next values: 100-1000");
	  }
	});
// Border height	
	$("#border_height").slider({
	   min:100,
	   max:1000,
	   step:1,
	   stop: function( event, ui ) {
		  $("#border_set_height").val(ui.value);
		  if($("#feo_separate_flors_checkbox").is(":checked")) {
		       var flooridSelected;
		       var selectorID;
		       var allfloors =  document.getElementsByName("floor_single_dim");  	
               for(var x=0; x < allfloors.length; x++) { 
		          var selectorID = allfloors[x].id;
    		      flooridSelected = selectorID.replace(/^floor_single_dimensions-/, ""); 
				  if($("#"+selectorID).is(":checked")) {
				      if(positionmanager.currentPosition.idbleft == null) {
					   // horisontal
					     if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var right_h = document.getElementById("content_top_right_cell").offsetHeight;
							 var right_w = document.getElementById("content_top_right_cell").offsetWidth;
							 organizeViewsPx ( left_w , 
											   ui.value ,
											   right_w , 
											   right_h , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 } else {
						   // top right cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var right_w = document.getElementById("content_top_right_cell").offsetWidth;
							 organizeViewsPx ( left_w , 
											   left_h ,
											    right_w, 
											   ui.value , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 }
					  } else {
					  // vertical
					      if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var bot_h = document.getElementById("content_bottom_left_cell").offsetHeight;
							 var bot_w = document.getElementById("content_bottom_left_cell").offsetWidth;
							 organizeViewsPx ( left_w, 
											   ui.value  ,
											   0 , 
											   0 , 
											   bot_w , 
											   bot_h , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 } else {
						   // bot left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var bot_w = document.getElementById("content_bottom_left_cell").offsetWidth;
							 organizeViewsPx ( left_w , 
											   left_h ,
											   0 , 
											   0 , 
											    bot_w, 
											    ui.value , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 }
					  }
				  }
				}
		  } else {
		       var iframeHeight = document.getElementById("content_top_left_cell").offsetHeight;
	           var iframeWidth = document.getElementById("content_top_left_cell").offsetWidth;
			   var currentPosition = positionmanager.currentPosition;
			    organizeViewsPx (  iframeWidth, 
							    ui.value,
							   0 , 
							   0 , 
							   0 , 
							   0 , 
							   currentPosition.idtleft , 
							   currentPosition.idtright , 
							   currentPosition.idbleft , 
							   currentPosition.idbright );
				if($("#feo_single_floor_checkbox").is(":checked")) {
				  $("#canvas_wrap_not_scroll_conf-"+currentPosition.idtleft.floorid).removeClass("red_class");
				} else {
				 $("#canvas_wrap_not_scroll_conf-both").removeClass("red_class");				 
				}
		  }
	   },
	   slide: function( event, ui ) {
		  $("#border_set_height").val(ui.value);
		  if($("#feo_separate_flors_checkbox").is(":checked")) {
		       document.getElementById("canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).style.height = ui.value + "px";
		       $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).addClass("red_class");
		  }  else if ($("#feo_single_floor_checkbox").is(":checked")) {
		       var currentPosition = positionmanager.currentPosition;
		       document.getElementById("canvas_wrap_not_scroll_conf-"+currentPosition.idtleft.floorid).style.height = ui.value + "px";
			  $("#canvas_wrap_not_scroll_conf-"+currentPosition.idtleft.floorid).addClass("red_class");
		  } else {
		      document.getElementById("canvas_wrap_not_scroll_conf-both").style.height = ui.value + "px";
			  $("#canvas_wrap_not_scroll_conf-both").addClass("red_class");
		  }
	   }
    });
	$("#set_border_height").click(function(){
	  var value_ = parseInt($("#border_set_height").val());
	  if(value_ >= 100 && value_ <= 1000) {
	    $('#border_height').slider('value', value_);
		if($("#feo_separate_flors_checkbox").is(":checked")) {
		       var flooridSelected;
		       var selectorID;
		       var allfloors =  document.getElementsByName("floor_single_dim");  	
               for(var x=0; x < allfloors.length; x++) { 
		          var selectorID = allfloors[x].id;
    		      flooridSelected = selectorID.replace(/^floor_single_dimensions-/, ""); 
				  if($("#"+selectorID).is(":checked")) {
				      if(positionmanager.currentPosition.idbleft == null) {
					   // horisontal
					     if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var right_h = document.getElementById("content_top_right_cell").offsetHeight;
							 var right_w = document.getElementById("content_top_right_cell").offsetWidth;
							 organizeViewsPx ( left_w , 
											   value_ ,
											   right_w , 
											   right_h , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 } else {
						   // top right cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var right_w = document.getElementById("content_top_right_cell").offsetWidth;
							 organizeViewsPx ( left_w , 
											   left_h ,
											    right_w, 
											   value_ , 
											   0 , 
											   0 , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 }
					  } else {
					  // vertical
					      if(positionmanager.currentPosition.idtleft.floorid == flooridSelected) {
						   // top left cell
						     var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var bot_h = document.getElementById("content_bottom_left_cell").offsetHeight;
							 var bot_w = document.getElementById("content_bottom_left_cell").offsetWidth;
							 organizeViewsPx ( left_w, 
											   value_ ,
											   0 , 
											   0 , 
											   bot_w , 
											   bot_h , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 } else {
						   // bot left cell
						     var left_h = document.getElementById("content_top_left_cell").offsetHeight;
							 var left_w = document.getElementById("content_top_left_cell").offsetWidth;
			                 var bot_w = document.getElementById("content_bottom_left_cell").offsetWidth;
							 organizeViewsPx ( left_w , 
											   left_h ,
											   0 , 
											   0 , 
											    bot_w, 
											    value_ , 
											   positionmanager.currentPosition.idtleft , 
											   positionmanager.currentPosition.idtright , 
											   positionmanager.currentPosition.idbleft , 
											   positionmanager.currentPosition.idbright );
				            $("#canvas_wrap_not_scroll_conf-"+floorSelectedIDDim).removeClass("red_class");
						 }
					  }
				  }
				}
		  } else {
		       var iframeHeight = document.getElementById("content_top_left_cell").offsetHeight;
	           var iframeWidth = document.getElementById("content_top_left_cell").offsetWidth;
			   var currentPosition = positionmanager.currentPosition;
			    organizeViewsPx (  iframeWidth, 
							   value_,
							   0 , 
							   0 , 
							   0 , 
							   0 , 
							   currentPosition.idtleft , 
							   currentPosition.idtright , 
							   currentPosition.idbleft , 
							   currentPosition.idbright );
				 $("#canvas_wrap_not_scroll_conf-both").removeClass("red_class");
		  }
	  } else {
	     alert("["+value_+"] Please enter height between next values: 100-1000");
	  }
	});
	
	$("#feo_all_flors").click(function(){
	        $("#floors_dimensions_selector_tr").hide();
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
	});
	$("#feo_separate_flors").click(function(){
	        $("#floors_dimensions_selector_tr").show();
	       var cp = positionmanager.currentPosition;
		   var iframeHeight = document.getElementById("iframe_wrap").offsetHeight;
	       var iframeWidth = document.getElementById("iframe_wrap").offsetWidth;
			if($('#floor_both_chk-horizontal').is(":checked")) {
				var proposal = calcfloorssize("horisontal",iframeWidth,0)
				var floorsH = parseInt(proposal.proposed);
				var totalH = iframeHeight;

				var floorsPerc = 100 * floorsH / totalH;
				if(floorsPerc>100) {
				  floorsPerc = 100;
				}
				var timePerc = 100 - floorsPerc;
				cp.top_perc = floorsPerc;
				cp.bot_perc = timePerc;
				cp.botleft_perc = 100;
				cp.botright_perc = 0;
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

				cp.idbleft = null;
				cp.idbright = null;
				positionmanager.currentPosition = cp;
				applyPosition() ;			   
			} else {
			    var proposal = calcfloorssize("vertical",iframeHeight,0)
				var floorsW = parseInt(proposal.proposed);
				var totalW = iframeWidth;

				var leftPerc = 100 * floorsW / totalW;
				if(leftPerc > 100) {
				  leftPerc = 100;
				}
				var rightPerc = 100 - leftPerc;
				cp.topleft_perc = leftPerc;
				cp.topright_perc = rightPerc;
				cp.botleft_perc = leftPerc;
				cp.botright_perc = rightPerc;
				for(var f = 0 ;f < floorCanvases.length ; f++) {
				  if(floorCanvases[f].mainfloor) {
					 var floorID= floorCanvases[f].floorid;
					 for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
						   cp.top_perc = parseInt(proposal.flist[v].perc);
						   cp.idtleft = positionmanager.floors[floorID];
						}
					 }
				  } else {
					 var floorID= floorCanvases[f].floorid;
					 for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
						   cp.bot_perc = parseInt(proposal.flist[v].perc);
						   cp.idbleft  = positionmanager.floors[floorID];
						}					
					}
				  }
				}

				cp.idtright = null;
				cp.idbright = null;
				positionmanager.currentPosition = cp;
				applyPosition() ;				   
			}			
	});
	$(".book_frame_wraps").click(function(){
	  if($('#book_frame_wraps-yes').is(":checked")) {
	    bookingFullWidth();
	  } else {
	    booking400Width();
	  }
	});
	$(".book_frame_ontop").click(function(){
	  if($('#book_frame_ontop-yes').is(":checked")) {
	     $("#bookings_fe_wrap_main").css("bottom","0px");
		 $("#booking_tag").hide();
		 $("#booking_hide_tag").hide();
	  } else {
		 $("#booking_hide_tag").show();	  
	  }
	});
	$('#selected_fill_color').colpick({	   
		layout:'rgbhex',
		submit:0,
		color:'ffffff',
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {

			$(el).css('background-color','#'+hex);
			$("#iframe_wrap").css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   $("#iframe_wrap").val(hex);
			 } else {
			 
			 }

		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});	
	$(".floor_both_chk").click(function(){
	       var cp = positionmanager.currentPosition;
		   var iframeHeight = document.getElementById("iframe_wrap").offsetHeight;
	       var iframeWidth = document.getElementById("iframe_wrap").offsetWidth;
			if($('#floor_both_chk-horizontal').is(":checked")) {
				var proposal = calcfloorssize("horisontal",iframeWidth,0)
				var floorsH = parseInt(proposal.proposed);
				var totalH = iframeHeight;

				var floorsPerc = 100 * floorsH / totalH;
				if(floorsPerc>100) {
				  floorsPerc = 100;
				}
				var timePerc = 100 - floorsPerc;
				cp.top_perc = floorsPerc;
				cp.bot_perc = timePerc;
				cp.botleft_perc = 100;
				cp.botright_perc = 0;
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

				cp.idbleft = null;
				cp.idbright = null;
				positionmanager.currentPosition = cp;
				applyPosition() ;			   
			} else {
			    var proposal = calcfloorssize("vertical",iframeHeight,0)
				var floorsW = parseInt(proposal.proposed);
				var totalW = iframeWidth;

				var leftPerc = 100 * floorsW / totalW;
				if(leftPerc > 100) {
				  leftPerc = 100;
				}
				var rightPerc = 100 - leftPerc;
				cp.topleft_perc = leftPerc;
				cp.topright_perc = rightPerc;
				cp.botleft_perc = leftPerc;
				cp.botright_perc = rightPerc;
				for(var f = 0 ;f < floorCanvases.length ; f++) {
				  if(floorCanvases[f].mainfloor) {
					 var floorID= floorCanvases[f].floorid;
					 for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
						   cp.top_perc = parseInt(proposal.flist[v].perc);
						   cp.idtleft = positionmanager.floors[floorID];
						}
					 }
				  } else {
					 var floorID= floorCanvases[f].floorid;
					 for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
						   cp.bot_perc = parseInt(proposal.flist[v].perc);
						   cp.idbleft  = positionmanager.floors[floorID];
						}					
					}
				  }
				}

				cp.idtright = null;
				cp.idbright = null;
				positionmanager.currentPosition = cp;
				applyPosition() ;			   
			}			
	});
	$("#feo_single_floor").click(function(){
	       $("#floors_dimensions_selector_tr").hide();
	       var cp = positionmanager.currentPosition;
		   var iframeHeight = document.getElementById("iframe_wrap").offsetHeight;
	       var iframeWidth = document.getElementById("iframe_wrap").offsetWidth;
		   var flooridSelected;
		   var selectorID;
		   var allfloors =  document.getElementsByName("floor_single_");  	
           for(var x=0; x < allfloors.length; x++) { 
		        var selectorID = allfloors[x].id;
    		    flooridSelected = selectorID.replace(/^floor_single_button-/, ""); 
				if($('#'+selectorID).is(":checked")) {
			        cp.top_perc = 100;
					cp.bot_perc = 0;
					cp.topleft_perc = 100;
					cp.topright_perc = 0;
					cp.botleft_perc = 0;
					cp.botright_perc = 0;
					cp.idtleft = positionmanager.floors[flooridSelected];
					cp.idtright = null;
					cp.idbleft = null;
					cp.idbright = null;
					positionmanager.currentPosition = cp;
					applyPosition() ;
			    } 
		   }
			
	});
	$("#floors_dimensions_selector_div").on("click", ".floor_top_button_dim", function() {
	       var id_ = $(this).attr('id');
		   var flooridSelected = id_.replace(/^floor_single_dimensions-/, "");
		   floorSelectedIDDim = flooridSelected;	
		    var cp = positionmanager.currentPosition;
           if($("#"+id_).is(":checked")) {
				    if(cp.idbleft == null) {
					   // horisontal
					   if(cp.idtleft.floorid == flooridSelected) {
							$("#border_set_height").val(document.getElementById("content_top_left_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_top_left_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_top_left_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_top_left_cell").offsetWidth);						      
					   } else if (cp.idtright.floorid == flooridSelected) {
					        $("#border_set_height").val(document.getElementById("content_top_right_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_top_right_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_top_right_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_top_right_cell").offsetWidth);
					   }
					} else {
					   // vertical
					   if(cp.idtleft.floorid == flooridSelected) {
							$("#border_set_height").val(document.getElementById("content_top_left_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_top_left_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_top_left_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_top_left_cell").offsetWidth);						      
					   } else if (cp.idbleft.floorid == flooridSelected) {
					        $("#border_set_height").val(document.getElementById("content_bottom_left_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_bottom_left_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_bottom_left_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_bottom_left_cell").offsetWidth);
					   }
					}
		 }		   
	});
	$("#floors_single_radio_form").on("click", ".floor_top_button", function() {
	       var id_ = $(this).attr('id');
		   var flooridSelected = id_.replace(/^floor_single_button-/, "");
	       var cp = positionmanager.currentPosition;
		   var iframeHeight = document.getElementById("iframe_wrap").offsetHeight;
	       var iframeWidth = document.getElementById("iframe_wrap").offsetWidth;
		   console.log(id_);
			if($('#'+id_).is(":checked")) {
			        cp.top_perc = 100;
					cp.bot_perc = 0;
					cp.topleft_perc = 100;
					cp.topright_perc = 0;
					cp.botleft_perc = 0;
					cp.botright_perc = 0;
					cp.idtleft = positionmanager.floors[flooridSelected];
					cp.idtright = null;
					cp.idbleft = null;
					cp.idbright = null;
					positionmanager.currentPosition = cp;
					applyPosition() ;			
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
			appendData +='			<table  cellspacing="0" cellpadding="0" style="border-collapse:collapse">';
			appendData +='			   <tr class="zoom_plus_tr">';
			appendData +='				 <td>';
			appendData +='				   <div class="zoom_plus_div" onclick="sizeUp(floorCanvases['+floor_ind+'])">+</div>';
			appendData +='				 </td>';
			appendData +='			   </tr>';
			appendData +='			   <tr class="zoom_minus_tr">';
			appendData +='				 <td>';
			appendData +='				   <div class="zoom_minus_div"  onclick="sizeDown(floorCanvases['+floor_ind+'])">-</div>';
			appendData +='				 </td>';
			appendData +='			   </tr>';
			appendData +='			   <tr class="zoom_reset_tr">';
			appendData +='				 <td>';
			appendData +='<div class="zoom_reset_div" onclick="zoomResetWrap(floorCanvases['+floor_ind+'],\'canvas_appended_wrapper-'+singleFloorID+'\',\'canvas_wrap_not_scroll_conf-'+singleFloorID+'\')">reset</div>';
			appendData +='				 </td>';
			appendData +='			   </tr>	';			   
			appendData +='			</table>';
			appendData +='</div>';
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			appendData ="<div class='floor_single_name_fe'>"+canvas_ref.floor_name+"</div>";
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			
			appendData =' <div id="canvas_wrap_not_scroll_conf-'+singleFloorID+'" class="canvas_wrap_not_scroll_conf"></div>';
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-"+singleFloorID;
			$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("width",appendToWidth);
			$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("height",appendToHeight);
			
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
			appendData +='			<table  cellspacing="0" cellpadding="0" style="border-collapse:collapse">';
			appendData +='			   <tr class="zoom_plus_tr">';
			appendData +='				 <td>';
			appendData +='				   <div class="zoom_plus_div" onclick="sizeUp(canvas_)">+</div>';
			appendData +='				 </td>';
			appendData +='			   </tr>';
			appendData +='			   <tr class="zoom_minus_tr">';
			appendData +='				 <td>';
			appendData +='				   <div class="zoom_minus_div"  onclick="sizeDown(canvas_)">-</div>';
			appendData +='				 </td>';
			appendData +='			   </tr>';
			appendData +='			   <tr class="zoom_reset_tr">';
			appendData +='				 <td>';
			appendData +='   <div class="zoom_reset_div" onclick="zoomResetWrap(canvas_,\'canvas_appended_wrapper-both\',\'canvas_wrap_not_scroll_conf-both\')">reset</div>';
			appendData +='				 </td>';
			appendData +='			   </tr>	';			   
			appendData +='			</table>';
			appendData +='</div>';
			$("#canvas_appended_wrapper-both").append(appendData);
			appendData ="<div class='floor_single_name_wrap_fe' id='floor_buttons_wrap'></div>";
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
			$("#canvas_wrap_not_scroll_conf-both").css("width",appendToWidth);
			$("#canvas_wrap_not_scroll_conf-both").css("height",appendToHeight);
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

	function applyTableHeight() {
	   document.getElementById("body_table").style.height = window.innerHeight + "px";
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
	function applyPositionPX() {
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
	function ApplyInitialPositionFE() {
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
		currentPosition.top_perc = 100;
		currentPosition.bot_perc = 0;
		currentPosition.right_width = 350;
		currentPosition.topleft_perc = 100;
		currentPosition.topright_perc = 0;
		currentPosition.botleft_perc = 100;
		currentPosition.botright_perc = 0;
		currentPosition.idtleft = positionmanager.allfloors;
		currentPosition.idtright = null;
		currentPosition.idbleft = null;
		currentPosition.idbright = null;
		positionmanager.currentPosition = currentPosition;
		
		var browserHeight = window.innerHeight;
	    var browserWidth = window.innerWidth;
		var leftColumnWidth = document.getElementById("left_column__").offsetWidth;
	    var headerHeight = document.getElementById("header_td").offsetHeight;
	    var buttonsRowHeight = document.getElementById("content_header_row").offsetHeight;
		var rightColumnWidth = document.getElementById("right_column_like_fe").offsetWidth;

	    document.getElementById("iframe_wrap").style.width = browserWidth - leftColumnWidth -  rightColumnWidth - 20 + "px";
	    document.getElementById("iframe_wrap").style.height = browserHeight - headerHeight - buttonsRowHeight - 20 + "px";

		
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

	function organizeViewsPx (topleft_pxw , topleft_px , topright_pxw , topright_px , botleft_pxw , botleft_px , idtleft , idtright , idbleft , idbright ) {
	  // move to temp

	  floorAppend("temp_appends",false,"",true); // all floors only wrappers
	  $("#content_top_left_cell").html("");
	  $("#content_top_right_cell").html("");
	  $("#content_bottom_left_cell").html("");
	  $("#content_bottom_right_cell").html("");

	  document.getElementById("content_top_row").style.height = (topleft_px > topright_px)? topleft_px : topright_px + "px";
	  document.getElementById("content_bottom_row").style.height = botleft_px  + "px";
	  document.getElementById("content_top_left_cell").style.width = topleft_pxw + "px";
	  document.getElementById("content_top_left_cell").style.height = topleft_px + "px";
	  document.getElementById("content_top_right_cell").style.width = topright_pxw  + "px";
	  document.getElementById("content_top_right_cell").style.height = topright_px  + "px";
	  document.getElementById("content_bottom_left_cell").style.width = botleft_pxw  + "px";
	  document.getElementById("content_bottom_left_cell").style.height = botleft_px  + "px";
	  if (botleft_px == 0) {	    
		if(topright_pxw == 0) {
		  //ONLY: idtleft

		    if(idtleft.single == true) {
			   floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}

		} else {

		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}


		    if(idtright.single == true) {
			  floorAppend("content_top_right_cell",true,idtright.floorid);
			} else {
			  floorAppend("content_top_right_cell",false,"");
			}
		}
	  } else {
	    if(topright_pxw == 0) {

		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}
		  
		} else {

		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
            }

		    if(idtright.single == true) {
			  floorAppend("content_top_right_cell",true,idtright.floorid);
			} else {
			  floorAppend("content_top_right_cell",false,"");
			}	  
		}

		  //ONLY:  idbleft

		    if(idbleft.single == true) {
			  floorAppend("content_bottom_left_cell",true,idbleft.floorid);
			} else {
			  floorAppend("content_bottom_left_cell",false,"");
			}	
	  }
	}
	
	function organizeViews (top_perc , bot_perc ,right_width,topleft_perc , topright_perc , botleft_perc , botright_perc , idtleft , idtright , idbleft , idbright ) {
	  console.log("top_perc="+top_perc+",bot_perc:"+bot_perc+",right_width:"+right_width+",topleft_perc:"+topleft_perc+",topright_perc:"+topright_perc+",botleft_perc:"+botleft_perc+",botright_perc:"+botright_perc);
	  
	  var iframeHeight = document.getElementById("iframe_wrap").offsetHeight;
	  var iframeWidth = document.getElementById("iframe_wrap").offsetWidth;

	  // move to temp

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

	  document.getElementById("content_td_ac_wl").style.width = iframeWidth ;
	  document.getElementById("content_td_ac_wl").style.height = iframeHeight ;
 
	  var availableWidth = iframeWidth;
	  var availableHeight = iframeHeight ;
	  document.getElementById("center_column_like_fe").style.width = availableWidth;
	  document.getElementById("center_column_like_fe").style.height = availableHeight;
	  document.getElementById("content_top_row").style.height = (top_perc==0)?"0px":parseInt(0.01 * top_perc * availableHeight) + "px";
	  document.getElementById("content_bottom_row").style.height = (bot_perc==0)?"0px":parseInt(0.01 * bot_perc * availableHeight)  + "px";
	  document.getElementById("content_top_left_cell").style.width = (topleft_perc==0)?"0px":parseInt(0.01 * topleft_perc * availableWidth)  + "px";
	  document.getElementById("content_top_right_cell").style.width = (topright_perc==0)?"0px":parseInt(0.01 * topright_perc * availableWidth) + "px";
	  document.getElementById("content_bottom_left_cell").style.width = (botleft_perc==0)?"0px":parseInt(0.01 * botleft_perc * availableWidth)  + "px";
	  document.getElementById("content_bottom_right_cell").style.width = (botright_perc==0)?"0px":parseInt(0.01 * botright_perc * availableWidth) + "px";
	  $("#content_top_left_cell").css("height","100%");
	  $("#content_top_right_cell").css("height","100%");
	  $("#content_bottom_left_cell").css("height","100%");
	  $("#content_bottom_right_cell").css("height","100%");
	  if($("#feo_separate_flors_checkbox").is(":checked")) {
		   var flooridSelected;
		   var selectorID;
		   var allfloors =  document.getElementsByName("floor_single_dim");  	
           for(var x=0; x < allfloors.length; x++) { 
		        var selectorID = allfloors[x].id;
    		    flooridSelected = selectorID.replace(/^floor_single_dimensions-/, ""); 
				if($("#"+selectorID).is(":checked")) {
				    if(idbleft == null) {
					   // horisontal
					   if(idtleft.floorid == flooridSelected) {
							$("#border_set_height").val(document.getElementById("content_top_left_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_top_left_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_top_left_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_top_left_cell").offsetWidth);						      
					   } else if (idtright.floorid == flooridSelected) {
					        $("#border_set_height").val(document.getElementById("content_top_right_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_top_right_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_top_right_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_top_right_cell").offsetWidth);
					   }
					} else {
					   // vertical
					   if(idtleft.floorid == flooridSelected) {
							$("#border_set_height").val(document.getElementById("content_top_left_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_top_left_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_top_left_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_top_left_cell").offsetWidth);						      
					   } else if (idbleft.floorid == flooridSelected) {
					        $("#border_set_height").val(document.getElementById("content_bottom_left_cell").offsetHeight);
							$('#border_height').slider('value', document.getElementById("content_bottom_left_cell").offsetHeight);
							$("#border_set_width").val(document.getElementById("content_bottom_left_cell").offsetWidth);
							$('#border_width').slider('value', document.getElementById("content_bottom_left_cell").offsetWidth);
					   }
					}
				}
		  }
	  } else {
	    $("#border_set_height").val(document.getElementById("content_top_left_cell").offsetHeight);
	    $('#border_height').slider('value', document.getElementById("content_top_left_cell").offsetHeight);
		$("#border_set_width").val(document.getElementById("content_top_left_cell").offsetWidth);
	    $('#border_width').slider('value', document.getElementById("content_top_left_cell").offsetWidth);
	  }
	  if (bot_perc == 0) {	    
		if(topright_perc == 0) {
		  //ONLY: idtleft

		    if(idtleft.single == true) {
			   floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}

		} else {

		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}

           if(idtright!=null) {
		    if(idtright.single == true) {
			  floorAppend("content_top_right_cell",true,idtright.floorid);
			} else {
			  floorAppend("content_top_right_cell",false,"");
			}
		  }
		}
	  } else {
	    if(topright_perc == 0) {

		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
			}
		  
		} else {

		    if(idtleft.single == true) {
			  floorAppend("content_top_left_cell",true,idtleft.floorid);
			} else {
			  floorAppend("content_top_left_cell",false,"");
            }
           if(idtright!=null) {
		    if(idtright.single == true) {
			  floorAppend("content_top_right_cell",true,idtright.floorid);
			} else {
			  floorAppend("content_top_right_cell",false,"");
			}	  
		  }
		}
		if(botright_perc == 0) {
		  //ONLY:  idbleft
           if(idbleft!=null) {
		    if(idbleft.single == true) {
			  floorAppend("content_bottom_left_cell",true,idbleft.floorid);
			} else {
			  floorAppend("content_bottom_left_cell",false,"");
			}
		  }
		} else {
          //ONLY: idtleft , [idtright] , idbleft , idbright

		    if(idbleft.single == true) {
			  floorAppend("content_bottom_left_cell",true,idbleft.floorid);
			} else {
			  floorAppend("content_bottom_left_cell",false,"");
			}
          if(idbright!=null) {
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
	     var proposedH = (available )/totalWH;
		 for (f= 0 ; f < fdist.flist.length ; f++) {
		    fdist.flist[f].perc =100*proposedH*fdist.flist[f].wh/(available  );
		 }
		 fdist.proposed = proposedH ;
	   } else {
	     var proposedW = (available - floorCanvases.length * padding )/totalHW;
		 for (f= 0 ; f < fdist.flist.length ; f++) {
		    fdist.flist[f].perc =100*proposedW*fdist.flist[f].hw/(available  - floorCanvases.length * padding );
		 }
		 fdist.proposed = proposedW ;
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

function hexc(colorval) {
    var color = '';
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    color = '#' + parts.join('');
	return color;
}
