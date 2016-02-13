var imgIDcreated = {};  // Hash for already created canvas_images 
var bookingOpen_ = false;

document.onkeydown = function(ev) {
	var key;
	ev = ev || event;
	key = ev.keyCode;
//alert (key)
	if(key == 37 || key == 38 || key == 39 || key == 40) {
//e.cancelBubble is supported by IE - this will kill the bubbling process.
		ev.cancelBubble = true;
		ev.returnValue = false;
	}
}
Math.degrees = function(rad)
{
	return rad*(180/Math.PI);
}

Math.radians = function(deg)
{
	return deg * (Math.PI/180);
}
function fileUpload(id) {
	$("#"+id).click();
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
	$('#canvas_wrapper').perfectScrollbar();
	$('#canvas_wrapper').perfectScrollbar('update');

}

$(document).ready(function() {



	$("#floor__selector").change(function () {
		var currentCanvasID = canvas_.canvas.id;
		var selectedCanvasFloorName = $("#floor__selector option:selected").val();
		var choosedCanvas ;
		$.each( floorNames, function( key, value ) {
			if ( value.floor_name == selectedCanvasFloorName) {
				choosedCanvas = value;
			}
		});
		canvas_ = choosedCanvas;
		$("#"+currentCanvasID).hide();
		$("#"+canvas_.canvas.id).show();
		zoomReset(canvas_);
	});
});


function isInteger(x) {
	return x % 1 === 0;
}

function randomString(length) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

	if (! length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}


function sendAJAX(JSON_,url_) {
	$.ajax({
		url : url_,
		data: JSON_,
		success : function(data){
			displayMessage("green","Place Added");
		},
		dataType : "json",
		type : "post"
	});

}
