$(document).ready(function() {  

 document.getElementById("topic_place_name").innerHTML  = document.getElementById("server_placeName").value + "," + document.getElementById("server_placeBranchName").value;
 document.getElementById("topic_address").innerHTML  = "("+document.getElementById("server_Address").value+")"; 



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
	        
	        var appendData ="<div id='canvas_appended_wrapper-"+singleFloorID+"' class='canvas_shown_wrapper canvas_shown_wrapper_ub'></div>";
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
			appendData ="<div class='floor_single_name_fe'>"+canvas_ref.floor_name+"</div>";
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			
			appendData =' <div id="canvas_wrap_not_scroll_conf-'+singleFloorID+'" class="canvas_wrap_not_scroll_conf"></div>';
			$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
			canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-"+singleFloorID;
			$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("width",appendToWidth-10+"px");
			$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("height",appendToHeight-10+"px");
			
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
			  
	        var appendData ="<div id='canvas_appended_wrapper-both' class='canvas_shown_wrapper canvas_shown_wrapper_ub'></div>";
			$("#"+appendTo_).append(appendData);
			appendData ='<img width="50" height="50" src="img/google-map-icon.png" class="map_thumpb_ub" onclick="openMap()"/>';
			$("#canvas_appended_wrapper-both").append(appendData);
			appendData ='<div class="zoom_options_book">';
			appendData +='<div id="plus_minus_wrap">';
			appendData +='   <div id="zoom_plus_div" onclick="sizeUp(canvas_)" title="Zoom-In">+</div>';
			appendData +='  <div id="zoom_split"></div>';
			appendData +='  <div id="zoom_minus_div"  onclick="sizeDown(canvas_)"  title="Zoom-Out">-</div>';
		    appendData +=' </div>';
		    appendData +='<div id="zoom_reset_div" onclick="zoomResetWrap(canvas_,\'canvas_appended_wrapper-both\',\'canvas_wrap_not_scroll_conf-both\')"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>';

			appendData +='</div>';
			$("#canvas_appended_wrapper-both").append(appendData);
			
		if(floorCanvases.length > 1)	{
			appendData ="<div class='floor_single_name_wrap_fe' id='floor_buttons_wrap'></div>";
			$("#canvas_appended_wrapper-both").append(appendData);
			for (var f = 0 ;f < floorCanvases.length ; f++) {              
	             canvas_ref = floorCanvases[f];
				 appendData ='<div class="floor_single_name_click" onclick="selectFloorByID(\''+canvas_ref.floorid+'\')">'+canvas_ref.floor_name+'</div>';
				 $("#floor_buttons_wrap").append(appendData);	           
              }
			
		}	
			
			appendData =' <div id="canvas_wrap_not_scroll_conf-both" class="canvas_wrap_not_scroll_conf canvas_wrap_not_scroll_conf_ub"></div>';
			$("#canvas_appended_wrapper-both").append(appendData);
			for (var f = 0 ;f < floorCanvases.length ; f++) {              
	             canvas_ref = floorCanvases[f];
			     canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-both";
			}
			$("#canvas_wrap_not_scroll_conf-both").css("width",appendToWidth-10+"px");
			$("#canvas_wrap_not_scroll_conf-both").css("height",appendToHeight-10+"px");
			
			$("#canvas_appended_wrapper-both").css("width",appendToWidth-6+"px");
			$("#canvas_appended_wrapper-both").css("height",appendToHeight-6+"px");
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
	function ApplyInitialPositionUB() {
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
		currentPosition.right_width = 0;
		currentPosition.topleft_perc = 100;
		currentPosition.topright_perc = 0;
		currentPosition.botleft_perc = 0;
		currentPosition.botright_perc = 0;
		currentPosition.idtleft = positionmanager.allfloors;
		currentPosition.idtright = null;
		currentPosition.idbleft = null;
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
var mainFloor__ = {};
function updatePageDimentions() {
   var browserHeight =  window.innerHeight;
   var browserWidth =  window.innerWidth;
   $("#center_column_content").css("width",browserWidth * 0.6-10+"px");
   
   var frameWidth = browserWidth * 0.6-60;
   if (frameWidth > 600) {
	   $("#content_top_left_cell").css("width",frameWidth+"px");
	   $("#content_top_left_cell").css("height",frameWidth*2/3+"px");
	   $("#right_column_content").css("width",browserWidth*0.4-10+"px");
	   $("#bookings_ub_wrap_main").css("width",browserWidth*0.4-20+"px");
	   ApplyInitialPositionUB();
	   ApplyFinalPosition();
	   bookingFullWidth();
	   if(browserHeight > frameWidth*2/3 + 40 + $("#bookings_fe_wrap").height() + 50 ) {
		  $("#center_column_content").append($("#bookings_ub_wrap_main"));
		  $("#left_column_content").css("width","25%");
		  $("#right_column_content").css("width","25%");
		  $("#bookings_ub_wrap_main").css("width",frameWidth+"px");
		  bookingFullWidth();
		  if(browserWidth >= frameWidth + 540) {
		   $("#left_column_content").append($("#place_info_block"));
			 
		  } else if (browserWidth >= frameWidth + 260) {
			
		  } else {
			  $("#center_column_content").append($("#place_info_block"));
			  $("#center_column_content").append($("#place_images_block"));
		  }
	   }
   } else {
       frameWidth = browserWidth -20;
	   $("#content_top_left_cell").css("width",frameWidth+"px");
	   $("#content_top_left_cell").css("height",frameWidth*2/3+"px");
	   ApplyInitialPositionUB();
	   ApplyFinalPosition();
	   $("#center_column_content").append($("#bookings_ub_wrap_main"));
		  $("#left_column_content").css("width","25%");
		  $("#right_column_content").css("width","25%");
		  $("#bookings_ub_wrap_main").css("width",frameWidth+"px");
		  bookingFullWidth();
		   $("#center_column_content").append($("#place_info_block"));
			  $("#center_column_content").append($("#place_images_block"));
   }
}
function ApplyFinalPosition() {
	       var cp = positionmanager.currentPosition;
		   var iframeHeight = document.getElementById("content_top_left_cell").offsetHeight;
	       var iframeWidth = document.getElementById("content_top_left_cell").offsetWidth;
		   var proposal = calcfloorssize("horisontal",iframeWidth,0);
		   var floorsH = parseInt(maincanvas.origHeight/maincanvas.origWidth * iframeWidth);
		   //$("#content_top_left_cell").css("height",floorsH+"px");
		   

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
}

	//var currentPosition.timeline = "id"
	//var currentPosition.floorid{fid} = "id";
	//var gridObj = {};
	//gridObj.timeline = true;
	//gridObj.single = true;
	//gridObj.floorid = "floorid";
	function getAvailable(width,right_width) {
		var browserHeight =  document.body.offsetHeight;
	    var browserWidth =  document.body.offsetWidth;

	  // assignments
	   var rightColumnWidth = right_width;
	   if(width) {
	     var availableWidth = browserWidth;
		 return availableWidth;
	   } else {
	      var availableHeight = browserHeight;
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
	  console.log("PX:"+document.getElementById("content_top_row").style.height);
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

	  var iframeHeight = document.getElementById("content_top_left_cell").offsetHeight;
	  var iframeWidth = document.getElementById("content_top_left_cell").offsetWidth;

	  // move to temp

	  floorAppend("temp_appends",false,"",true); // all floors only wrappers
	  $("#content_top_left_cell").html("");
	  //

 
	  var availableWidth = iframeWidth;
	  var availableHeight = iframeHeight ;


	  document.getElementById("content_top_left_cell").style.width = (topleft_perc==0)?"0px":parseInt(0.01 * topleft_perc * availableWidth)  + "px";
      floorAppend("content_top_left_cell",false,"");
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

function applyIFrameValues() {
 var iframev = JSON.parse(document.getElementById("server_iFrameData").value);
 var iframe = iframev.iframedata;
 console.log(iframe);
 // Set iFrame dimentions

$("#iframe_wrap").css("width",iframe.iw);
$("#iframe_wrap").css("height",iframe.ih);
		
 if(iframe.floors == "both") {
    $("#feo_all_flors").click();
 } else if (iframe.floors == "split") {
    $("#feo_separate_flors").click();
	if(iframe.horisontal == true) {
	   $('#floor_both_chk-horizontal').click();
	} else {
	   $('#floor_both_chk-vertical').click();
	}
	$("#feo_separate_flors").click();

 } else if (iframe.floors == "single") {
    $("#floor_single_button-"+iframe.singleid).click();
    $("#feo_single_floor").click();
 }
 
 if(iframe.floors == "both") {
    for(var f = 0 ; f < iframe.dimentions.length ; f++ ) {
	  var fid = iframe.dimentions[f].floorid;
	  var w = iframe.dimentions[f].w;
	  var h = iframe.dimentions[f].h;
	}
	  $("#border_set_width").val(parseInt(w));
	  $("#border_set_height").val(parseInt(h));
	  $("#set_border_width").click();
	  $("#set_border_height").click();
 } else if (iframe.floors == "split") {
     for(var f = 0 ; f < iframe.dimentions.length ; f++ ) {
	  var fid = iframe.dimentions[f].floorid;
	  var w = iframe.dimentions[f].w;
	  var h = iframe.dimentions[f].h;
	  $("#floor_single_dimensions-"+fid).prop('checked', true);
	  $("#border_set_width").val(parseInt(w));
	  $("#border_set_height").val(parseInt(h));
	  $("#set_border_width").click();
	  $("#set_border_height").click();
	}
 } else if (iframe.floors == "single") {
    for(var f = 0 ; f < iframe.dimentions.length ; f++ ) {
	  var fid = iframe.dimentions[f].floorid;
	  var w = iframe.dimentions[f].w;
	  var h = iframe.dimentions[f].h;
	}
	  $("#border_set_width").val(parseInt(w));
	  $("#border_set_height").val(parseInt(h));
	  $("#set_border_width").click();
	  $("#set_border_height").click(); 
 }
 
 bookingFullWidth();
}

