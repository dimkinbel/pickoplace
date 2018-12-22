 
function iFfloorAppend(appendTo_,singleBoth,singleFloorID,temp) {

	var appendToWidth = $("#"+appendTo_).width() ;
	var appendToHeight = $("#"+appendTo_).height() ;
	var temp_ = false;
	if(temp!= undefined && temp == true) {
		temp_ = true;
	}
 
		var canvas_ref;
		var floor_ind;

		if(temp_) {
			for (var f = 0 ;f < if_floorCanvases.length ; f++) {
				$('#'+appendTo_).append( $('#if_div_wrap-canvas_'+if_floorCanvases[f].floorid) );
			}
			return;
		} else {
			if(document.getElementById("if_canvas_appended_wrapper-both") != null) {
				$("#"+appendTo_).append($("#if_canvas_appended_wrapper-both"));
			} else {
				var appendData ="<div id='if_canvas_appended_wrapper-both' class='canvas_shown_wrapper'></div>";
				$("#"+appendTo_).append(appendData);

				appendData ='<div class="zoom_options_book">';
				appendData +='<div id="if_plus_minus_wrap">';
				appendData +='   <div id="if_zoom_plus_div" onclick="iFsizeUp(if_canvas_)" title="Zoom-In">+</div>';
				appendData +='  <div id="if_zoom_split"></div>';
				appendData +='  <div id="if_zoom_minus_div"  onclick="iFsizeDown(if_canvas_)"  title="Zoom-Out">-</div>';
				appendData +=' </div>';
				appendData +='<div id="if_zoom_reset_div" onclick="iFzoomResetWrap(if_canvas_,\'if_canvas_appended_wrapper-both\',\'if_canvas_wrap_not_scroll_conf-both\')"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>';

				appendData +='</div>';
				$("#if_canvas_appended_wrapper-both").append(appendData);
 

				appendData =' <div id="if_canvas_wrap_not_scroll_conf-both" class="canvas_wrap_not_scroll_conf canvas_border_if"></div>';
				$("#if_canvas_appended_wrapper-both").append(appendData);
				for (var f = 0 ;f < if_floorCanvases.length ; f++) {
					canvas_ref = if_floorCanvases[f];
					canvas_ref.scrollID = "if_canvas_wrap_not_scroll_conf-both";
				}
			}
		}


		$("#if_canvas_wrap_not_scroll_conf-both").css("width",appendToWidth );
		$("#if_canvas_wrap_not_scroll_conf-both").css("height",appendToHeight );
		for (var f = 0 ;f < if_floorCanvases.length ; f++) {
			canvas_ref = if_floorCanvases[f];
			$('#if_canvas_wrap_not_scroll_conf-both').append( $('#if_div_wrap-canvas_'+canvas_ref.floorid) );
			console.log(canvas_ref.floorid);
		}
		for (var f = 0 ;f < if_floorCanvases.length ; f++) {
			canvas_ref = if_floorCanvases[f];
			if(canvas_ref.mainfloor == true) {
				$('#if_div_wrap-canvas_'+canvas_ref.floorid).show();
				iFzoomResetWrap(canvas_ref,'if_canvas_appended_wrapper-both','if_canvas_wrap_not_scroll_conf-both');
				if_canvas_ = canvas_ref;
			} else {
				$('#if_div_wrap-canvas_'+canvas_ref.floorid).hide();
			}
		} 
}
 
 
	
 
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
function iFselectFloorByID(floorID) {
	    for (var f = 0 ;f < if_floorCanvases.length ; f++) {  
				canvas_ref = if_floorCanvases[f];
				if(canvas_ref.floorid == floorID) {
				   $('#if_div_wrap-canvas_'+canvas_ref.floorid).show();
				   iFzoomResetWrap(canvas_ref,'if_canvas_appended_wrapper-both','if_canvas_wrap_not_scroll_conf-both');
				   if_canvas_ = canvas_ref;
				} else {
					$('#if_div_wrap-canvas_'+canvas_ref.floorid).hide();
				}
			}
			 $(".iframe_floor_selector").removeClass("iframe_floor_selector_selected");
			 $("#floor_if_btn-"+floorID).addClass("iframe_floor_selector_selected"); 
	}
var width2height;
function ApplyFloorsToIframe() {
	var bs_wrap_width = $("#pc_iframe_floors_wrap").width();
	for (f= 0 ; f < if_floorCanvases.length ; f++) {
		if(if_floorCanvases[f].mainfloor == true) {
			width2height = if_floorCanvases[f].origWidth / if_floorCanvases[f].origHeight;
			$("#pc_iframe_floors_wrap").height(Math.round(bs_wrap_width / width2height));
		}
	}
	iFfloorAppend("pc_iframe_floors_wrap",false);
}


function setCanvasSize (idw,idh,canvas__) {
	var ucanvas;
	if(canvas__==""||canvas__==undefined||canvas__==null) {
		ucanvas = canvas_;
	} else {
		ucanvas = canvas__;
	}
	var idcan = ucanvas.canvas.id;
	zoomReset(ucanvas);
	var w,h;
	if ($.isNumeric(idw) && $.isNumeric(idh)) {
		w = idw;
		h = idh;
	} else {
		w = document.getElementById(idw).value;
		h = document.getElementById(idh).value;
		ucanvas.origWidth = w;
		ucanvas.origHeight = h;
	}
	var cw = document.getElementById(idcan).width;
	var ch = document.getElementById(idcan).height;
	var width,height;

	if (w != null && w != "" && w > 50 && isInteger(w)) {
		width = w ;
	} else {
		width = cw;
	}
	if (h != null && h != "" && h > 50 && isInteger(h)) {
		height =  h ;
	} else {
		height = ch ;
	}
	document.getElementById(idcan).width = width;
	document.getElementById(idcan).height = height
	ucanvas.width = width;
	ucanvas.height = height;
	ucanvas.valid = false;
	$('#canvas_wrap_not_scroll_conf').perfectScrollbar();
	$('#canvas_wrap_not_scroll_conf').perfectScrollbar('update');

}
function isInteger(x) {
	return x % 1 === 0;
}

