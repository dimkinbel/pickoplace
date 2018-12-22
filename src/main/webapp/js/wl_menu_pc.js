 

function floorAppend(appendTo_,singleBoth,singleFloorID,temp) {

	var appendToWidth = $("#"+appendTo_).width() ;
	var appendToHeight = $("#"+appendTo_).height() ;
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
			// Move to temp
			$('#'+appendTo_).append( $('#div_wrap-canvas_'+singleFloorID) );
			return;
		} else {
			if(document.getElementById("canvas_appended_wrapper-"+singleFloorID) != null) {
				if(floorid2canvas[singleFloorID].mainfloor) {
					$("#"+appendTo_).show();
				} else {
					$("#"+appendTo_).hide();
				}
				// Element already exists
				$("#"+appendTo_).append($("#canvas_appended_wrapper-"+singleFloorID));
			} else {
				// Create initial

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

				appendData =' <div id="canvas_wrap_not_scroll_conf-'+singleFloorID+'" class="canvas_wrap_not_scroll_conf canvas_border_pc"></div>';
				$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
				canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-"+singleFloorID;
			}
		}
		$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("width",appendToWidth );
		$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("height",appendToHeight );
		$('#canvas_wrap_not_scroll_conf-'+singleFloorID).append( $('#div_wrap-canvas_'+singleFloorID) );
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
				$("#"+appendTo_).append($("#canvas_appended_wrapper-both"));
			} else {
				var appendData ="<div id='canvas_appended_wrapper-both' class='canvas_shown_wrapper pc_appended_canvas_wrapper'></div>";
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
 

				appendData =' <div id="canvas_wrap_not_scroll_conf-both" class="canvas_wrap_not_scroll_conf canvas_border_pc"></div>';
				$("#canvas_appended_wrapper-both").append(appendData);
				for (var f = 0 ;f < floorCanvases.length ; f++) {
					canvas_ref = floorCanvases[f];
					canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-both";
				}
			}
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
			$(".bottom_floors_button").removeClass("selected_f");
			$("#bfb-"+floorID).addClass("selected_f");
			$(".floor_list_btn").removeClass("active");
			$("#floor_list_btn-"+floorID).addClass("active");
	}

 
 
var mainFloor__ = {};
function updateFloorWrapDimentionsPC () {
   var browserHeight =  window.innerHeight;
   var browserWidth =  window.innerWidth; 
   $("#pc_menu_column").css("width",250);
   $("#pc_menu_column,#data_windows_column").css("min-height",browserHeight);
   $("#data_windows_column").css("width",browserWidth - 280);
   
   var bs_wrap_width = $("#canvas_append_wrap_pc").width();
   for (f= 0 ; f < floorCanvases.length ; f++) {
      if(floorCanvases[f].mainfloor == true) {
	     var width2height = floorCanvases[f].origWidth / floorCanvases[f].origHeight;
		 $("#canvas_append_wrap_pc").height(bs_wrap_width / width2height);
	  }
   }
}


function ApplyFinalPosition() {
	       floorAppend("canvas_append_wrap_pc",false);
}

function InitialIframeSettings() {
	var iframeWidth = parseInt($("#pc_iframe_floors_wrap").width());
	var iframeHeight  = parseInt($("#pc_iframe_floors_wrap").height()) + 80
     $('#iframe_width_slider').slider('value', iframeWidth );
	 $("#iframe_width").val(iframeWidth+"x"+iframeHeight);
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

 
$(window).resize(function () {
		waitForFinalEvent(function(){
			updateFloorWrapDimentionsPC();
			//...
		}, 500, "some unique string");
	});
	
	
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


