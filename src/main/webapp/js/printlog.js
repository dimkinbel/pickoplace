var imgIDcreated = {};  // Hash for already created canvas_images 
var bookingOpen_ = false;

function printLog (logid , message , color ) {
  $('#'+logid).append('<br><span style="color:'+color+'">'+message+'</span>');
   document.getElementById(logid).scrollTop = document.getElementById(logid).scrollHeight;
}
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

 if (w != null && w != "" && w >= 400 && isInteger(w)) {
    width = w ;
 } else {
    width = cw;
 }
  if (h != null && h != "" && h >= 400 && isInteger(h)) {
    height =  h ;
 } else {
    height = ch ;
 }
 document.getElementById(idcan).width = width;
 document.getElementById(idcan).height = height
 ucanvas.width = width;
 ucanvas.height = height;
 ucanvas.origWidth = width;
 ucanvas.origHeight = height;
 ucanvas.valid = false;
 $('#canvas_wrapper').perfectScrollbar();
 $('#canvas_wrapper').perfectScrollbar('update');

}

function selectedBackground(id,actualID) {
  var bg_image_id = "default_bg_image_mirror_"+canvas_.floorid;
  if (document.getElementById(bg_image_id)==null) {
     $("#bg_default_img_mirror").prepend('<img  crossOrigin="Anonymous" id="'+bg_image_id+'"/>');
  }

  $(".bg_pick_image_selectable").removeClass("choosed_background_selected");
  $("#"+id.id).addClass("choosed_background_selected");
  
  imageID = id.id;

  imgSource = document.getElementById(actualID).src;
  var image = new Image();
  image.src = imgSource; 
  var actualWidth;
  var actualHeight;
   image.onload = function() {
      actualWidth = this.width;
	  actualHeight = this.height;
	  canvas_.backgroundFill = imgSource;
	  canvas_.backgroundType = "tiling" ;// all , tilling , color
	  canvas_.backgroundImageID = document.getElementById(actualID);
	  canvas_.backgroundActualId = actualID;
	  canvas_.tilew  = actualWidth;
	  canvas_.tileh = actualHeight;
	  canvas_.valid = false;
	  
	  var mirror = document.getElementById(bg_image_id);
	  var c = document.getElementById("default_img_canvas");
	  c.width = actualWidth;
	  c.height = actualHeight;
	  mirror.width = actualWidth;
	  mirror.height = actualHeight;				 
	  var ctx = c.getContext("2d");
	  var imgID =  document.getElementById(actualID);
      ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
	  ctx.drawImage(imgID,0,0,actualWidth,actualHeight);
      var dataURL = c.toDataURL('image/png');
	  mirror.src = dataURL;
  };

}

function userBackground (fillType) {
  if (backgroundUploadReady) {
	  if (backgroundUploadUpdated == false) {
		  // Need to update chosen background
		  var bgidc = "chosed_background_orig_"+canvas_.floorid;
		  if (document.getElementById(bgidc)==null) {
		    $("#chosed_background_orig_wrap").prepend('<img id="'+bgidc+'"/>');
		  }
		  document.getElementById(bgidc).src =  document.getElementById("chosed_background_orig").src ;
		  document.getElementById(bgidc).width = document.getElementById("chosed_background_orig").width;
		  document.getElementById(bgidc).height = document.getElementById("chosed_background_orig").height;
		  backgroundUploadUpdated = true;
	  }
	  
  var imgSource = document.getElementById("chosed_background_orig_"+canvas_.floorid).src; 
  var actualWidth = document.getElementById("chosed_background_orig_"+canvas_.floorid).width;
  var actualHeight = document.getElementById("chosed_background_orig_"+canvas_.floorid).height; 

	  canvas_.backgroundFill = imgSource;
	  canvas_.backgroundImageID = document.getElementById("chosed_background_orig_"+canvas_.floorid);
	  canvas_.backgroundActualId = "chosed_background_orig_"+canvas_.floorid;
	 // alert(canvas_.backgroundActualId);
	  if (fillType == "fill" ) {
          setCanvasSize (canvas_.origWidth,canvas_.origHeight);
		  canvas_.backgroundType = "fill" ;// all , tilling , color  
  
	  } else if (fillType == "repeat" ) {
          setCanvasSize (canvas_.origWidth,canvas_.origHeight);
		  canvas_.backgroundType = "repeat" ;// all , tilling , color
		  canvas_.tilew  = actualWidth;
		  canvas_.tileh = actualHeight;  
	  } else if (fillType == "asimage" ) {
	     var ww;
		 var hh;
	     if(actualWidth > actualHeight ) {
		      if(actualWidth > 1200) {
			     ww = 1200;
				 hh = parseInt(actualHeight/actualWidth*ww);
			  } else {
			     ww = actualWidth;
				 hh = actualHeight;
			  }
		 } else {
		      if(actualHeight > 1200) {
			     hh = actualHeight;
				 ww = parseInt(actualWidth/actualHeight*hh);
			  } else {
			     ww = actualWidth;
				 hh = actualHeight;			  
			  }
		 }
		  setCanvasSize (ww,hh);
		  canvas_.backgroundType = "asimage" ;// all , tilling , color  	     
	  } else if (fillType == "axis" ){
		  setCanvasSize (canvas_.origWidth,canvas_.origHeight);
		  if ( canvas_.width < canvas_.height ) {
		      setCanvasSize (parseInt(canvas_.height * actualWidth / actualHeight),canvas_.height);
		  } else if ( canvas_.width > canvas_.height ){
		      setCanvasSize (canvas_.width,parseInt(canvas_.width * actualHeight / actualWidth) );
		  } else {
		     if ( actualWidth < actualHeight ) {
			      setCanvasSize (canvas_.width,parseInt(canvas_.width * actualHeight / actualWidth) );
			 } else {
			      setCanvasSize (parseInt(canvas_.height * actualWidth / actualHeight),canvas_.height);
			 }
		  }
	     canvas_.backgroundType = "axis" ;
	  }
	  canvas_.valid = false;	
   
      updateBackgroundSliders();
 $('#right_col_scroll').perfectScrollbar();
 $('#right_col_scroll').perfectScrollbar('update');
 $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
  } else {	  
	  alert("Upload your image first");
  }
}
function openBackgroundOptions() {
 	var all=document.getElementsByName("current_pick_data");
     for(var x=0; x < all.length; x++) {
       document.getElementById(all[x].id).style.display = "none";
     }
	 
   document.getElementById("selected_background_tr").style.display = "";
   document.getElementById("background_options_tr").style.display = "";
    $('#right_col_scroll').perfectScrollbar();
    $('#right_col_scroll').perfectScrollbar('update');
	 $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
}

function imgPicker(id,showImage,imageType,bg) {
  if(bg!=undefined && bg == true ) {
     bgshape = true;
  } else {
     bgshape = false;
  }
  var imageID = id.id;
  var actual;
  if(imageType=="user") {
     actual = id.id.replace(/history_/,"");
  } else {
     actual = id.id + "_actual";
  }
 
  if(document.getElementById(actual) == null) {
     uploadActualImageFromServer(imageID,imageType);
  } else {
  
  if(picker_table_initial[imageType]!= undefined && picker_table_initial[imageType] == true) {
     $("#"+imageType+"_picker_w").css("height",$("#dr_center_section").height() - $("#book_select_shapes").height() - 10 - 226 +"px");
	 updateSlimScroll(imageType+"_picker",imageType+"_picker_w");
	 picker_table_initial[imageType]=false;
  }
  
  var showID = showImage;
  document.getElementById(showID).style.opacity = 1;
  imgSource = document.getElementById(actual).src;
  var image = new Image();
  image.src = imgSource;

  $('#'+imageType+'_img_alpha_slider').slider('value', 100);
  var widthApplied = 100;
  var heightApplied = 100;
  
  image.onload = function() {
   //  alert(this.width + " " + this.height);
     actualWidth = this.width;
	 actualHeight = this.height;
	 if (actualWidth > 130 || actualHeight > 130 ) {
	   if ( actualWidth < actualHeight ) {
	      heightApplied = 130;
		  widthApplied = 130.0 * actualWidth / actualHeight;
	   } else {
	      widthApplied = 130;
		  heightApplied = 130.0 * actualHeight / actualWidth
	   }
	 } else {
	    heightApplied = actualHeight;
		widthApplied = actualWidth;
	 } 
  // this.width, this.height will be dimensions
    document.getElementById(showID).src = imgSource;
    document.getElementById(showID).style.width = widthApplied + 'px';
    document.getElementById(showID).style.height = heightApplied + 'px';
	currentFigurePicker.type="image";
	currentFigurePicker.bgshape = bgshape;
	currentFigurePicker.imgID = actual;
	currentFigurePicker.width = actualWidth;
	currentFigurePicker.height = actualHeight;
	currentFigurePicker.alpha = 1;
	var json_ = JSON.stringify(currentFigurePicker);
	$("#json_saved_imgPicker_"+imageType).val(json_);
	$("#hide_on_empty_"+imageType).show();
	// Create (if necessary) byte64 image for sending
    var imgKey="mirror_"+actual;
  
    if(imgKey in imgIDcreated) {
      // Do nothing
	} else {
	   imgIDcreated[imgKey]=1;
	   $('#canvas_shapes_images').append('<img id="'+ imgKey +'"/>');
	   var mirror = document.getElementById(imgKey);
	   
	   var c = document.getElementById("default_img_canvas");   					  
	   c.width = actualWidth;
	   c.height = actualHeight;
	   mirror.width = actualWidth;
	   mirror.height = actualHeight;				 
	   var ctx = c.getContext("2d");
	   var imgID_ = document.getElementById(actual);
		// constant image for pick
	   ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
	   ctx.drawImage(imgID_,0,0,actualWidth,actualHeight);
	   var dataURL = c.toDataURL('image/png');
	   mirror.src = dataURL;
	}
  }
 updateHint("Double-click to add Image","green",true);
 }
}

var currentFigurePicker = new Object();
function ShapePickerNew(type,bg) {
  var bgshape;
  if(bg!=undefined && bg == true ) {
     bgshape = true;
  } else {
     bgshape = false;
  }
  var c = document.getElementById("show_canvas");
  if(type=="text") {
      c = document.getElementById("show_text_canvas");
  }
  var ctx = c.getContext("2d");
  var mirror = document.getElementById('mirror');
  
  currentFigurePicker.type = type;
  currentFigurePicker.bgshape = bgshape;
  var fillColor = "";
  var lineColor = "";
  var x = 0;
  var y = 0;
  var width = 100;
  var height = 50;
  var rad = 50;
  var startA = 0;
  var endA = 360;
  var cutX = 20;
  var font_color , text , font_bold , font_style , font_size , alpha , shadow_x , shadow_y , shadow_blur  , shadow_color;
  currentFigurePicker.lineWidth = 3;
  currentFigurePicker.alpha = 1;
  currentFigurePicker.circleRadius = 50;
  currentFigurePicker.roundRad = 10;
  
  ctx.clearRect( 0 , 0 , 300 , 300 );

  if (type == "round") {
    lineColor = currentFigurePicker.lineColor;
    fillColor = currentFigurePicker.fillColor ;
	x = 60;
	y = 60;
	width = 100;
	height = 50;
	
	currentFigurePicker.alpha = $("#round_opacity").slider("value")/100;
	currentFigurePicker.salpha = $("#round_line_opacity").slider("value")/100;
	currentFigurePicker.roundRad = $("#round_radius").slider("value")
	currentFigurePicker.lineWidth = $("#round_Lwidth").slider("value")
	
	dbRoundRect(ctx,x,y,width,height,lineColor,fillColor,
	              currentFigurePicker.alpha,
				  currentFigurePicker.salpha,
				  currentFigurePicker.lineWidth,
				  currentFigurePicker.roundRad);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	updateHint("Double-click to add shape","green",true);
  } else if (type == "circle") {
    lineColor = currentFigurePicker.lineColor;
    fillColor = currentFigurePicker.fillColor ;
	x = 60;
	y = 60;
	rad = 50;
	startA = 0;
	endA = 360;
	currentFigurePicker.alpha = $("#circle_opacity").slider("value")/100;
	currentFigurePicker.salpha = $("#circle_line_opacity").slider("value")/100;
	currentFigurePicker.lineWidth = $("#circle_Lwidth").slider("value")
	
	dbCircle(ctx , x, y, rad ,rad, startA, endA ,lineColor,fillColor,
	              currentFigurePicker.alpha,
				  currentFigurePicker.salpha,
				  currentFigurePicker.lineWidth);
	mirror.width = 100+"px";
	mirror.height = 100+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	updateHint("Double-click to add shape","green",true);
  } else if (type == "trapex") {
    lineColor = currentFigurePicker.lineColor;
    fillColor = currentFigurePicker.fillColor ;
	x = 60;
	y = 60;
	width = 100;
	height = 50;
	currentFigurePicker.alpha = $("#trapex_opacity").slider("value")/100;
	currentFigurePicker.salpha = $("#trapex_line_opacity").slider("value")/100;
	currentFigurePicker.cutX = $("#trapex_radius").slider("value")
	currentFigurePicker.lineWidth = $("#trapex_Lwidth").slider("value")
	
	dbTrapez (ctx,x,y,width,height,lineColor,fillColor,
	              currentFigurePicker.alpha,
				  currentFigurePicker.salpha,
				  currentFigurePicker.lineWidth,
				  currentFigurePicker.cutX);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	updateHint("Double-click to add shape","green",true);
  } else if (type == "rectangle") {
    lineColor = currentFigurePicker.lineColor;
    fillColor = currentFigurePicker.fillColor ;
	x = 60;
	y = 60;
	width = 100;
	height = 50;
	currentFigurePicker.alpha = $("#rectangle_opacity").slider("value")/100;
	currentFigurePicker.salpha = $("#rectangle_line_opacity").slider("value")/100;
	currentFigurePicker.lineWidth = $("#rectangle_Lwidth").slider("value")
	
	dbDrawRect(ctx,x,y,width,height,lineColor,fillColor,
	              currentFigurePicker.alpha,
				  currentFigurePicker.salpha,
				  currentFigurePicker.lineWidth);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	updateHint("Double-click to add shape","green",true);
  }  else if (type == "line") {
    lineColor = currentFigurePicker.lineColor;
    fillColor = "#BCA9F5" ;
	dbLine(ctx,12,12,105,105,currentFigurePicker.lineWidth,currentFigurePicker.salpha,lineColor)
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	updateHint("Push-and-drag to draw line","green",true);
  } else if (type == "text") {
    var font_color = currentFigurePicker.font_color;
	var text = currentFigurePicker.text;
	var font_bold = currentFigurePicker.font_bold;
	var font_style = currentFigurePicker.font_style;
	var font_size = currentFigurePicker.font_size;
	var alpha =  $("#text__opacity").slider("value")/100;
	var shadow_x  = currentFigurePicker.shadow_x;
	var shadow_y  = currentFigurePicker.shadow_y;
	var shadow_blur  = currentFigurePicker.shadow_blur;
	var shadow_color =  currentFigurePicker.shadow_color;
	dbText(ctx,125,35,text,font_bold,font_style,font_size,font_color,alpha,currentFigurePicker.shadow,shadow_x,shadow_y,shadow_blur,shadow_color);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;
	updateHint("Double-click to add TEXT","green",true);
  }
    currentFigurePicker.font_color = font_color;
	currentFigurePicker.text = text;
	currentFigurePicker.font_bold = font_bold;
	currentFigurePicker.font_style = font_style;
	currentFigurePicker.font_size = font_size;
	currentFigurePicker.shadow = $('#checkboxTextShadow').prop("checked");
	currentFigurePicker.shadow_x  = shadow_x;
	currentFigurePicker.shadow_y  = shadow_y;
	currentFigurePicker.shadow_blur  = shadow_blur;
	currentFigurePicker.shadow_color =  shadow_color; 
	
  currentFigurePicker.lineColor = lineColor;
  currentFigurePicker.fillColor = fillColor;
  currentFigurePicker.x = x;
  currentFigurePicker.y = y;
  currentFigurePicker.width = width;
  currentFigurePicker.height = height;
  currentFigurePicker.startA = startA;
  currentFigurePicker.endA = endA;
  currentFigurePicker.rad = rad;
  currentFigurePicker.cutX = cutX;
  if (type == "line") {
    currentFigurePicker.salpha = 1;
  }

}
function ShapePicker(id,tablePicker,type) {

  var c = document.getElementById("show_canvas");
  var ctx = c.getContext("2d");
  var mirror = document.getElementById('mirror');
  
  currentFigurePicker.type = type;
  var fillColor = "";
  var lineColor = "";
  var x = 0;
  var y = 0;
  var width = 100;
  var height = 50;
  var rad = 50;
  var startA = 0;
  var endA = 360;
  var cutX = 20;
  var font_color , text , font_bold , font_style , font_size , alpha , shadow_x , shadow_y , shadow_blur  , shadow_color;
  currentFigurePicker.lineWidth = 3;
  currentFigurePicker.alpha = 1;
  currentFigurePicker.circleRadius = 50;
  currentFigurePicker.roundRad = 10;
  
  ctx.clearRect( 0 , 0 , 150 , 150 );
 	var all=document.getElementsByName("canvas_figure_options");
     for(var x=0; x < all.length; x++) {
       document.getElementById(all[x].id).style.display = "none";
     }
	 document.getElementById("picked_figure_tr").style.display = "";
     document.getElementById("current_figure_tr").style.display = "";
	
	document.getElementById("picked_image_tr").style.display = "none";
	document.getElementById("current_image_tr").style.display = "none";
	
	document.getElementById("selected_background_tr").style.display = "none";
    document.getElementById("background_options_tr").style.display = "none";
  if (type == "round") {
    lineColor = "#013ADF";
    fillColor = "#81BEF7" ;
	x = 75;
	y = 75;
	width = 100;
	height = 50;
	dbRoundRect(ctx,x,y,width,height,lineColor,fillColor,1,1,currentFigurePicker.lineWidth,30);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	document.getElementById("round_options").style.display = "";
	updateHint("Double-click to add shape","green",true);
  } else if (type == "circle") {
    lineColor = "#DF0101";
    fillColor = "#F5A9A9" ;
	x = 75;
	y = 75;
	rad = 50;
	startA = 0;
	endA = 360;
	dbCircle(ctx , x, y, rad ,rad, startA, endA ,lineColor,fillColor,1,1,currentFigurePicker.lineWidth);
	mirror.width = 100+"px";
	mirror.height = 100+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	document.getElementById("circle_options").style.display = "";
	updateHint("Double-click to add shape","green",true);
  } else if (type == "trapex") {
    lineColor = "#088A4B";
    fillColor = "#81F7BE" ;
	x = 75;
	y = 75;
	width = 100;
	height = 50;
	dbTrapez (ctx,x,y,width,height,lineColor,fillColor,1,1,currentFigurePicker.lineWidth,cutX);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;

	document.getElementById("trapex_options").style.display = "";
	updateHint("Double-click to add shape","green",true);
  } else if (type == "rectangle") {
    lineColor = "#4B088A";
    fillColor = "#BCA9F5" ;
	x = 75;
	y = 75;
	width = 100;
	height = 50;
	dbDrawRect(ctx,x,y,width,height,lineColor,fillColor,1,1,currentFigurePicker.lineWidth);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;
	document.getElementById("rectangle_options").style.display = "";
	updateHint("Double-click to add shape","green",true);
  }  else if (type == "line") {
    lineColor = "#000000";
    fillColor = "#BCA9F5" ;
	dbLine(ctx,25,75,125,75,currentFigurePicker.lineWidth,1,lineColor)
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;
	document.getElementById("line_options").style.display = "";
	updateHint("Push-and-drag to draw line","green",true);
  } else if (type == "text") {
    var font_color = "#000000";
	var text = document.getElementById("text_shape_value").value;
	var font_bold = document.getElementById("font_style_selector").value;
	var font_style = document.getElementById("font__selector").value;
	var font_size = document.getElementById("font_size_selector").value;
	var alpha = currentFigurePicker.alpha;
	var shadow_x  = 0;
	var shadow_y  = 0;
	var shadow_blur  = 0;
	var shadow_color =  "#000000";
	dbText(ctx,75,75,text,font_bold,font_style,font_size,font_color,alpha,true,shadow_x,shadow_y,shadow_blur,shadow_color);
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;
	document.getElementById("text_options").style.display = "";
	updateHint("Double-click to add TEXT","green",true);
  }
    currentFigurePicker.font_color = font_color;
	currentFigurePicker.text = text;
	currentFigurePicker.font_bold = font_bold;
	currentFigurePicker.font_style = font_style;
	currentFigurePicker.font_size = font_size;
	currentFigurePicker.shadow = true;
	currentFigurePicker.shadow_x  = shadow_x;
	currentFigurePicker.shadow_y  = shadow_y;
	currentFigurePicker.shadow_blur  = shadow_blur;
	currentFigurePicker.shadow_color =  shadow_color; 
	
  currentFigurePicker.lineColor = lineColor;
  currentFigurePicker.fillColor = fillColor;
  currentFigurePicker.x = x;
  currentFigurePicker.y = y;
  currentFigurePicker.width = width;
  currentFigurePicker.height = height;
  currentFigurePicker.startA = startA;
  currentFigurePicker.endA = endA;
  currentFigurePicker.rad = rad;
  currentFigurePicker.cutX = cutX;
  if (type == "line") {
    currentFigurePicker.salpha = 1;
  }
 $('#right_col_scroll').perfectScrollbar();
 $('#right_col_scroll').perfectScrollbar('update');
  $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
}

function redrawPickFigure() {
  var c = document.getElementById("show_canvas");
  if(currentFigurePicker.type=="text") {
      c = document.getElementById("show_text_canvas");
  }
  var ctx = c.getContext("2d");
  
  var type = currentFigurePicker.type;
  var fillColor = currentFigurePicker.fillColor;
  var lineColor = currentFigurePicker.lineColor;
  var x = currentFigurePicker.x;
  var y = currentFigurePicker.y;
  var width = currentFigurePicker.width;
  var height = currentFigurePicker.height;
  var rad = currentFigurePicker.rad;
  if (rad > 60) {
    rad = 60;
  }
  var startA = currentFigurePicker.startA;
  var endA = currentFigurePicker.endA;
  var cutX = currentFigurePicker.cutX;
  var lineWidth = currentFigurePicker.lineWidth ;
  var alpha = currentFigurePicker.alpha;
  var salpha = currentFigurePicker.salpha;
  var circleRadius = currentFigurePicker.circleRadius;
  var roundRad = currentFigurePicker.roundRad ;
  
  ctx.clearRect( 0 , 0 , 300 , 300 );
  if (type == "round") {
  
	dbRoundRect(ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth,roundRad);

  } else if (type == "circle") {

	dbCircle(ctx , x, y, rad, rad,  startA,  endA ,lineColor,fillColor,alpha,salpha,lineWidth);

  } else if (type == "trapex") {

	dbTrapez (ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth,cutX);

  } else if (type == "rectangle") {

	dbDrawRect(ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth);

  } else if (type == "line") {
    dbLine(ctx,12,12,105,105,lineWidth,salpha,lineColor);

  }  else if (type == "text") {
    dbText(ctx,125,35,currentFigurePicker.text,
	                 currentFigurePicker.font_bold,
					 currentFigurePicker.font_style ,
					 currentFigurePicker.font_size,
					 currentFigurePicker.font_color,
					 currentFigurePicker.alpha,
					 currentFigurePicker.shadow,
					 currentFigurePicker.shadow_x,
					 currentFigurePicker.shadow_y,
					 currentFigurePicker.shadow_blur,
					 currentFigurePicker.shadow_color);

  }  
}
var backgroundUploadUpdated = false;
var backgroundUploadReady = false;
$(document).ready(function() {
    

    $("#userBGUpload_input").on("change", function()
    	    {
			    $('#show_on_upload_bg_user').show();
			    $("#bg_acc_fill_sub").css("height",400 + "px");
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            //var imgSrc = this.result 
					
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 100;
					  var canvas_heightApplied = 100;					  
					  image.onload = function() {
						 var actualWidth = this.width;
						 var actualHeight = this.height;
						 if (actualWidth > 140 || actualHeight > 140 ) {
						   if ( actualWidth < actualHeight ) {
							  heightApplied = 140;
							  widthApplied = 140.0 * actualWidth / actualHeight;
						   } else {
							  widthApplied = 140;
							  heightApplied = 140.0 * actualHeight / actualWidth
						   }
						 } else {
							heightApplied = actualHeight;
							widthApplied = actualWidth;
						 } 
    	                document.getElementById("chosed_bgimage").src =  image.src ;
                        document.getElementById("chosed_bgimage").style.width = widthApplied + 'px';
                        document.getElementById("chosed_bgimage").style.height = heightApplied + 'px';
                         
                         backgroundUploadUpdated = false; // Still using previous image
                         backgroundUploadReady = true;
						 actualWidth = this.width;
						 actualHeight = this.height;
					     canvas_heightApplied = actualHeight;
						 canvas_widthApplied = actualWidth;
				//		 var bgidc = "chosed_background_orig_"+canvas_.floorid;
                //       if (document.getElementById(bgidc)==null) {
				//	      $("#chosed_background_orig_wrap").prepend('<img id="'+bgidc+'"/>');
				//	   }
    	                document.getElementById("chosed_background_orig").src =  image.src ;
                        document.getElementById("chosed_background_orig").style.width = canvas_widthApplied + 'px';
                        document.getElementById("chosed_background_orig").style.height = canvas_heightApplied + 'px';
							
							
							if($("#bg_fill_user_sm").height()- $("#chosed_bgimage").height() - 60 < 145) {
							   $("#for_upload_user_bg_button").css("position","absolute");
							   $("#for_upload_user_bg_button").css("right","10px");
							   $("#for_upload_user_bg_button").css("top","-20px");
							   $("#uploadBGbutton").hide();
							   $("#uploadBGbutton_small").show();
							} else {
							   $("#for_upload_user_bg_button").css("position","relative");
							   $("#for_upload_user_bg_button").css("right","initial");
							   $("#for_upload_user_bg_button").css("top","initial");
							   $("#uploadBGbutton").show();
							   $("#uploadBGbutton_small").hide();							
							}
					   }
    	            };
    	        } 
    	    });

    $("#userImageUpload_input").on("change", function()
    	    {
				$('#show_on_upload_user').show();
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            //var imgSrc = this.result 
					
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  $('#user_img_alpha_slider').slider('value', 100);
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 100;
					  var canvas_heightApplied = 100;					  
					  image.onload = function() {
					   //  alert(this.width + " " + this.height);
						 var actualWidth = this.width;
						 var actualHeight = this.height;
						 if (actualWidth > 140 || actualHeight > 140 ) {
						   if ( actualWidth < actualHeight ) {
							  heightApplied = 140;
							  widthApplied = 140.0 * actualWidth / actualHeight;
						   } else {
							  widthApplied = 140;
							  heightApplied = 140.0 * actualHeight / actualWidth
						   }
						 } else {
							heightApplied = actualHeight;
							widthApplied = actualWidth;
						 } 
    	                document.getElementById("chosed_image").src =  image.src ;
                        document.getElementById("chosed_image").style.width = widthApplied + 'px';
                        document.getElementById("chosed_image").style.height = heightApplied + 'px';
						
						 actualWidth = this.width;
						 actualHeight = this.height;
						 if (actualWidth > 200 || actualHeight > 200 ) {
						   if ( actualWidth < actualHeight ) {
							  canvas_heightApplied = 200;
							  canvas_widthApplied = 200.0 * actualWidth / actualHeight;
						   } else {
							  canvas_widthApplied = 200;
							  canvas_heightApplied = 200.0 * actualHeight / actualWidth
						   }
						 } else {
							canvas_heightApplied = actualHeight;
							canvas_widthApplied = actualWidth;
						 } 		
	
    	                document.getElementById("temp_image_for_canvas_creation").src =  image.src ;
                        document.getElementById("temp_image_for_canvas_creation").style.width = canvas_widthApplied + 'px';
                        document.getElementById("temp_image_for_canvas_creation").style.height = canvas_heightApplied + 'px';
							
						var random_ = randomString(10);
						var pickImageID = 'user_img_'+random_
					    $('#user_uploaded_images').append('<img id="'+ pickImageID +'"/>');
                        $('#user_picker').prepend('<img id="history_'+ pickImageID +'" class="bg_pick_image left" onclick="imgPicker(this,\'chosed_image\',\'user\')" />');
					    
					   
					   
					    var c = document.getElementById("translated_user_images_canvas");
						c.width = canvas_widthApplied;
						c.height = canvas_heightApplied;
					    var ctx = c.getContext("2d");
						// temp img for canvas draw
						var imgID = document.getElementById("temp_image_for_canvas_creation");
						// constant image for pick
					    var mirror = document.getElementById(pickImageID);    
                        ctx.clearRect( 0 , 0 , canvas_widthApplied , canvas_heightApplied );
						ctx.drawImage(imgID,0,0,canvas_widthApplied,canvas_heightApplied);
						mirror.width = canvas_widthApplied+"px";
						mirror.height = canvas_heightApplied+"px";
						var dataURL = c.toDataURL('image/png');
						mirror.src = dataURL;

						currentFigurePicker.type="image";
						currentFigurePicker.imgID = pickImageID;
						currentFigurePicker.width = canvas_widthApplied;
						currentFigurePicker.height = canvas_heightApplied;
						currentFigurePicker.alpha = 1;

						var json_ = JSON.stringify(currentFigurePicker);
						$("#json_saved_imgPicker_user").val(json_);
						
						var hist_width = 100;
						var hist_height = parseInt(100 * canvas_heightApplied / canvas_widthApplied) ;
    	                document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;
						 $('#history_div_scrollable').perfectScrollbar();
                         $('#history_div_scrollable').perfectScrollbar('update');
					   }
					   updateHint("Double-click to add Image","green",true);
    	            };
    	        } 
    });
    $("#userBgImageUpload_input").on("change", function()
    	    {
				$('#show_on_upload_user_bg').show();
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            //var imgSrc = this.result 
					
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  $('#user_img_alpha_slider_bg').slider('value', 100);
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 100;
					  var canvas_heightApplied = 100;					  
					  image.onload = function() {
					   //  alert(this.width + " " + this.height);
						 var actualWidth = this.width;
						 var actualHeight = this.height;
						 if (actualWidth > 140 || actualHeight > 140 ) {
						   if ( actualWidth < actualHeight ) {
							  heightApplied = 140;
							  widthApplied = 140.0 * actualWidth / actualHeight;
						   } else {
							  widthApplied = 140;
							  heightApplied = 140.0 * actualHeight / actualWidth;
						   }
						 } else {
							heightApplied = actualHeight;
							widthApplied = actualWidth;
						 } 
    	                document.getElementById("chosed_image_bg").src =  image.src ;
                        document.getElementById("chosed_image_bg").style.width = widthApplied + 'px';
                        document.getElementById("chosed_image_bg").style.height = heightApplied + 'px';
						
						 actualWidth = this.width;
						 actualHeight = this.height;
						 if (actualWidth > 1000 || actualHeight > 1000 ) {
						   if ( actualWidth < actualHeight ) {
							  canvas_heightApplied = 1000;
							  canvas_widthApplied = 1000.0 * actualWidth / actualHeight;
						   } else {
							  canvas_widthApplied = 1000;
							  canvas_heightApplied = 1000.0 * actualHeight / actualWidth;
						   }
						 } else {
							canvas_heightApplied = actualHeight;
							canvas_widthApplied = actualWidth;
						 } 		
	
    	                document.getElementById("temp_image_for_canvas_creation_bg").src =  image.src ;
                        document.getElementById("temp_image_for_canvas_creation_bg").style.width = canvas_widthApplied + 'px';
                        document.getElementById("temp_image_for_canvas_creation_bg").style.height = canvas_heightApplied + 'px';
							
						var random_ = randomString(10);
						var pickImageID = 'user_img_bg_'+random_;
					    $('#user_uploaded_images').append('<img id="'+ pickImageID +'"/>');
                        $('#user_picker_bg').prepend('<img id="history_'+ pickImageID +'" class="bg_pick_image left" onclick="imgPicker(this,\'chosed_image_bg\',\'user\')" />');
					    
					   
					   
					    var c = document.getElementById("translated_user_images_canvas_bg");
						c.width = canvas_widthApplied;
						c.height = canvas_heightApplied;
					    var ctx = c.getContext("2d");
						// temp img for canvas draw
						var imgID = document.getElementById("temp_image_for_canvas_creation_bg");
						// constant image for pick
					    var mirror = document.getElementById(pickImageID);    
                        ctx.clearRect( 0 , 0 , canvas_widthApplied , canvas_heightApplied );
						ctx.drawImage(imgID,0,0,canvas_widthApplied,canvas_heightApplied);
						mirror.width = canvas_widthApplied+"px";
						mirror.height = canvas_heightApplied+"px";
						var dataURL = c.toDataURL('image/png');
						mirror.src = dataURL;

						currentFigurePicker.type="image";
						currentFigurePicker.imgID = pickImageID;
						currentFigurePicker.width = canvas_widthApplied;
						currentFigurePicker.height = canvas_heightApplied;
						currentFigurePicker.alpha = 1;

						var json_ = JSON.stringify(currentFigurePicker);
						$("#json_saved_imgPicker_user_bg").val(json_);
						

    	                document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;

					   };
					   updateHint("Double-click to add Image","green",true);
    	            };
    	        } 
    });
	$('#addbgshape').change(function(){ 
		if($(this).attr("checked")){ 
           canvas_.mode("bg");
		} else { 
           canvas_.mode();
		} 
	
	});
	$('#bookingopacity').change(function(){ 
		if($(this).attr("checked")){ 
           for (var i = 0 ; i < floorCanvases.length ; i ++) {
		     floorCanvases[i].bookingOpacity = 0.2;
			 floorCanvases[i].valid = false;
		   }
		} else { 
           for (var i = 0 ; i < floorCanvases.length ; i ++) {
		     floorCanvases[i].bookingOpacity = 1;
			 floorCanvases[i].valid = false;
		   }
		} 
	
	});

 $(".menu_option").click(function(){
     id = this.id;
	 if(id=="delete_menu") {
	    if(canvas_.listSelected.length > 1) {
		    canvas_.dragging = false;
			canvas_.resizeDragging = false;
			canvas_.expectResize = -1;
		  for (var i = 0; i< canvas_.listSelected.length ; i++) {
		     var shape = canvas_.listSelected[i];
			 canvas_.shapes.remove(shape);
			 console.log("removed:"+shape.sid);
		  }
		  canvas_.listSelected = [];
		  //document.getElementById("selected_canvas_options_tr").style.display = "none";
	      $("#selected_options_tr").hide();
		  $("#selected_on_canvas_wrap").css("opacity",0.5);
			canvas_.selection = null;
			canvas_.valid = false;
	    } else if(canvas_.selection!= null ) {
			canvas_.dragging = false;
			canvas_.resizeDragging = false;
			canvas_.expectResize = -1;

            var shapeID = canvas_.selection.sid;
			var shape;
			var idx;
			    for (i = 0; i < canvas_.shapes.length; i += 1) {
                       shape = canvas_.shapes[i];
						if(shape.sid  == shapeID) {
						    idx = canvas_.shapes.indexOf(shape);
						}
			    }
			canvas_.shapes.splice(idx,1);

				//document.getElementById("selected_canvas_options_tr").style.display = "none";
	        $("#selected_options_tr").hide();
			$("#selected_on_canvas_wrap").css("opacity",0.5);
			canvas_.selection = null;
			canvas_.valid = false;		 			
		}
	 } else if (id == "copy_menu") {
	    if(canvas_.listSelected.length > 1) {
		    canvas_.copyMultiple();
			
	    } else if(canvas_.selection!= null) {
            canvas_.copyShape(canvas_.selection);
         }		
	 }  else if (id == "paste_menu") {
	    if(canvas_.pasteMultiple_ == true) {
		   canvas_.pasteMultiple();
	    } else if(canvas_.pasteReady != null) {
            canvas_.pasteShape();
         }		
	   } else if (id == "Group_menu") {
	     	  if(canvas_.listSelected.length > 1) {
			     groupSelected();
			  }
	   }   else if (id == "bringForward_menu") {
	    if(canvas_.selection!= null) {
                var shapeID = canvas_.selection.sid;
				var shape;
				var idx;
				for (i = 0; i < canvas_.shapes.length; i += 1) {
                            shape = canvas_.shapes[i];
							if(shape.sid  == shapeID) {
							    idx = canvas_.shapes.indexOf(shape);
							}
				    }
                if (idx < canvas_.shapes.length-1){			    
				    var downShape = canvas_.shapes[idx+1];
					canvas_.shapes[idx+1] = canvas_.selection;
					canvas_.shapes[idx] = downShape;
				    canvas_.valid = false;
				}
         }		
	 }   else if (id == "bringBack_menu") {
	    if(canvas_.selection!= null) {
                var shapeID = canvas_.selection.sid;
				var shape;
				var idx;
				for (i = 0; i < canvas_.shapes.length; i += 1) {
                            shape = canvas_.shapes[i];
							if(shape.sid  == shapeID) {
							    idx = canvas_.shapes.indexOf(shape);
							}
				    }
                if (idx > 0){			    
				    var downShape = canvas_.shapes[idx-1];
					canvas_.shapes[idx-1] = canvas_.selection;
					canvas_.shapes[idx] = downShape;
				    canvas_.valid = false;
				}
         }		
	 } else if (id == "bringToTop_menu") {
	    if(canvas_.selection!= null) {
                var shapeID = canvas_.selection.sid;
				var shape;
				var idx;
				 for (i = 0; i < canvas_.shapes.length; i += 1) {
                            shape = canvas_.shapes[i];
							if(shape.sid  == shapeID) {
							    idx = canvas_.shapes.indexOf(shape);
							}
				    }
			    canvas_.shapes.splice(idx,1);
				canvas_.shapes.push(canvas_.selection);
				canvas_.valid = false;
         }		
	 } else if (id == "bringToBottom_menu") {
	    if(canvas_.selection!= null) {
                var shapeID = canvas_.selection.sid;
				var shape;
				var idx;
				 for (i = 0; i < canvas_.shapes.length; i += 1) {
                            shape = canvas_.shapes[i];
							if(shape.sid  == shapeID) {
							    idx = canvas_.shapes.indexOf(shape);
							}
				    }
			    canvas_.shapes.splice(idx,1);
				canvas_.shapes.unshift(canvas_.selection);
				canvas_.valid = false;
         }		
	 }  else if (id == "orderBehav_menu") {
	    $("#booking_tab_selector").click();
	 }
 });
// ROUND
	$('#round_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.lineColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	$('#round_fill_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.fillColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	$('#back_color_pick').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.fillColor = "#"+hex;
			   canvas_.bg_color="#"+hex;
			   canvas_.backgroundFill = null;
			   canvas_.backgroundType = "color";
			   canvas_.valid=false;
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});	
// Selected color picker
	$('#selected_line_color').colpick({	   
		layout:'rgbhex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
		  if(canvas_.selection!=null) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   canvas_.selection.options.lineColor = "#"+hex;
			   canvas_.valid = false;
			 } else {
			 
			 }
		  }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	
	$('#selected_fill_color').colpick({	   
		layout:'rgbhex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
		  if(canvas_.selection!=null) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   canvas_.selection.options.fillColor = "#"+hex;
			   canvas_.valid = false;
			 } else {
			 
			 }
		  }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});	
// TEXT

	$('#text_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.font_color = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});

	$('#selected_text_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
		  if(canvas_.selection!=null) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   canvas_.selection.options.font_color = "#"+hex;
			   canvas_.valid = false;
			 } else {
			 
			 }
		  }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	$('#text_shadow_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.shadow_color = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});

	$('#selected_text_shadow_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
		  if(canvas_.selection!=null) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   canvas_.selection.options.shadow_color = "#"+hex;
			   canvas_.valid = false;
			 } else {
			 
			 }
		  }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
$('#selected_text_shape_value').keyup(function() {
  if(canvas_.selection!=null && canvas_.selection.type == "text") {
      canvas_.selection.options.text = this.value;
      canvas_.valid = false;
  }
});
$('#selected_font__selector').change(function() {
    if(canvas_.selection!=null && canvas_.selection.type == "text") {
        canvas_.selection.options.font_style = this.value;
        canvas_.valid = false;
  }
});
$('#selected_font_size_selector').change(function() {
  if(canvas_.selection!=null && canvas_.selection.type == "text") {
        canvas_.selection.options.font_size = this.value;
        canvas_.valid = false;
  }
});

$('#selected_font_style_selector').change(function() {
  if(canvas_.selection!=null && canvas_.selection.type == "text") {
        canvas_.selection.options.font_bold = this.value;
        canvas_.valid = false;
  }
});
$('#text_shape_value').keyup(function() {
  currentFigurePicker.text=this.value;
  redrawPickFigure();
});
$('#font__selector').change(function() {
  currentFigurePicker.font_style=this.value;
  redrawPickFigure();
});
$('#font_size_selector').change(function() {
  currentFigurePicker.font_size=this.value;
  redrawPickFigure();
});
$('#font_style_selector').change(function() {
  currentFigurePicker.font_bold=this.value;
  redrawPickFigure();
});
// selected text options
$('.msotd').mousedown(function(){
	 $(this).css({"background-color":" rgb(199, 222, 255)"});
});
$('.msotd').mouseup(function(){
	 $(this).css({"background-color":"transparent"});
});
// LINE 
	$('#line_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.lineColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
// CIRCLE
	$('#circle_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.lineColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	$('#circle_fill_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.fillColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
// TRAPEX
		$('#trapex_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.lineColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	$('#trapex_fill_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.fillColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
// RECTANGLE
		$('#rectangle_line_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.lineColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	$('#rectangle_fill_color').colpick({	   
		layout:'hex',
		submit:0,
		colorScheme:'light',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('background-color','#'+hex);
			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if(!bySetColor) {
			   $(el).val(hex);
			   currentFigurePicker.fillColor = "#"+hex;
			   redrawPickFigure();
			 }
		}
	}).keyup(function(){
		//$(this).colpickSetColor(this.value);	
	});
	
	// $("#round_opacity").slider({
	   // reversed : true,
	   // tooltip: 'hide',
	   // formatter: function(value) {
	    // currentFigurePicker.alpha = value / 100;
		// redrawPickFigure();
		// return  value;
	// }
    // });
	// $("#round_line_opacity").slider({
	   // reversed : true,
	   // tooltip: 'hide',
	   // formatter: function(value) {
	    // currentFigurePicker.salpha = value / 100;
		// redrawPickFigure();
		// return  value;
	// }
    // });	
	// $("#round_radius").slider({
	   // tooltip: 'hide',
	   // formatter: function(value) {
	    // currentFigurePicker.roundRad = value;
		// redrawPickFigure();
		// return  value;
	// }
    // });	
	// $("#round_Lwidth").slider({
	   // tooltip: 'hide',
	   // formatter: function(value) {
	    // currentFigurePicker.lineWidth = value;
		// redrawPickFigure();
		// return  value;
	// }
    // });
	$("#text_rotate_slider").slider({
	   min:0,
	   max:360,
	   step:5,
	   value:0,
	   slide: function( event, ui ) {
    	 if (canvas_.selection != null) {
    	     canvas_.rotateSelection(ui.value);
    	 }
	   }
    });
	$("#rotate_slider").slider({
	   min:0,
	   max:360,
	   step:5,
	   value:0,
	   slide: function( event, ui ) {
    	 if (canvas_.selection != null) {
    	     canvas_.rotateSelection(ui.value);
    	 }
	   }
    });
	$("#round_Lwidth").slider({
	   min:0,
	   max:20,
	   step:1,
	   value:3,
	   slide: function( event, ui ) {
	    currentFigurePicker.lineWidth = ui.value;
		redrawPickFigure();
	   }
    });
	$("#round_radius").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:30,
	   slide: function( event, ui ) {
	    currentFigurePicker.roundRad = ui.value;
		redrawPickFigure(); 
	   }
    });
	$("#round_line_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.salpha = ui.value / 100;
		redrawPickFigure();    
	   }
    });
	$("#round_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:90,
	   slide: function( event, ui ) {
			currentFigurePicker.alpha = ui.value / 100;
			redrawPickFigure();	      
	   }
    });
	
	$("#circle_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:90,
	   slide: function( event, ui ) {
			currentFigurePicker.alpha = ui.value / 100;
			redrawPickFigure();	      
	   }
    });	
	$("#circle_line_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.salpha = ui.value / 100;
		redrawPickFigure();    
	   }
    });		

	$("#circle_Lwidth").slider({
	   min:0,
	   max:20,
	   step:1,
	   value:3,
	   slide: function( event, ui ) {
	    currentFigurePicker.lineWidth = ui.value;
		redrawPickFigure();
	   }
    });
	
	$("#trapex_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:90,
	   slide: function( event, ui ) {
			currentFigurePicker.alpha = ui.value / 100;
			redrawPickFigure();	      
	   }
    });
	$("#trapex_line_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.salpha = ui.value / 100;
		redrawPickFigure();    
	   }
    });	
	$("#trapex_Lwidth").slider({
	   min:0,
	   max:20,
	   step:1,
	   value:3,
	   slide: function( event, ui ) {
	    currentFigurePicker.lineWidth = ui.value;
		redrawPickFigure();
	   }
    });
	$("#trapex_radius").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:20,
	   slide: function( event, ui ) {
	    currentFigurePicker.cutX = ui.value ;
		redrawPickFigure();
	   }
    });

	$("#rectangle_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:90,
	   slide: function( event, ui ) {
			currentFigurePicker.alpha = ui.value / 100;
			redrawPickFigure();	      
	   }
    });
	$("#rectangle_line_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.salpha = ui.value / 100;
		redrawPickFigure();    
	   }
    });
	$("#rectangle_Lwidth").slider({
	   min:0,
	   max:20,
	   step:1,
	   value:3,
	   slide: function( event, ui ) {
	    currentFigurePicker.lineWidth = ui.value;
		redrawPickFigure();
	   }
    });	
	$("#line_Lwidth").slider({
	   min:0,
	   max:20,
	   step:1,
	   value:3,
	   slide: function( event, ui ) {
	    currentFigurePicker.lineWidth = ui.value;
		redrawPickFigure();
	   }
    });
	$("#line_line_opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.salpha = ui.value / 100;
		redrawPickFigure();    
	   }
    });	
	$("#text__opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.alpha = ui.value / 100;
		redrawPickFigure();    
	   }
    });
	$("#user_img_alpha_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.alpha = ui.value / 100;
		document.getElementById("chosed_image").style.opacity = currentFigurePicker.alpha; 
	   }
    });
	$("#user_img_alpha_slider_bg").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.alpha = ui.value / 100;
		document.getElementById("chosed_image_bg").style.opacity = currentFigurePicker.alpha; 
	   }
    });
	$("#table_img_alpha_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.alpha = ui.value / 100;
		document.getElementById("show_table_image").style.opacity = currentFigurePicker.alpha; 
	   }
    });
	$("#chair_img_alpha_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.alpha = ui.value / 100;
		document.getElementById("show_chair_image").style.opacity = currentFigurePicker.alpha; 
	   }
    });
	$("#combo_img_alpha_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	    currentFigurePicker.alpha = ui.value / 100;
		document.getElementById("show_combo_image").style.opacity = currentFigurePicker.alpha; 
	   }
    });

	


//	$("#circle_radius").slider({
//	   formatter: function(value) {
//	    currentFigurePicker.rad = value;
//		redrawPickFigure();
//		return  value;
//	}
//    });


//	currentFigurePicker.shadow = true;
//	currentFigurePicker.shadow_x  = shadow_x;
//	currentFigurePicker.shadow_y  = shadow_y;
//	currentFigurePicker.shadow_blur  = shadow_blur;
//	currentFigurePicker.shadow_color =  shadow_color; 
	$('#checkboxTextShadow').change(function(){ 
		if($(this).attr("checked")){ 
			 $( "#shadow_x_spinner" ).spinner( "enable" );
			 $( "#shadow_y_spinner" ).spinner( "enable" );
			 $( "#shadow_blur_spinner" ).spinner( "enable" );
			 $('#text_shadow_color').show();
			 currentFigurePicker.shadow = true;
			 redrawPickFigure();
			 
		}else{ 
             $( "#shadow_x_spinner" ).spinner( "disable" );
			 $( "#shadow_y_spinner" ).spinner( "disable" );
			 $( "#shadow_blur_spinner" ).spinner( "disable" );
			 $('#text_shadow_color').hide();
			 currentFigurePicker.shadow = false;
			 redrawPickFigure();
			 
		} 
	});
	$('#selected_checkboxTextShadow').change(function(){ 
		if($(this).attr("checked")){ 
			 $( "#selected_shadow_x_spinner" ).spinner( "enable" );
			 $( "#selected_shadow_y_spinner" ).spinner( "enable" );
			 $( "#selected_shadow_blur_spinner" ).spinner( "enable" );
			 $('#selected_text_shadow_color').show();
			 if(canvas_.selection!=null && canvas_.selection.type == "text") {
					canvas_.selection.options.shadow = true;
					canvas_.valid = false;
			  }
		}else{ 
             $( "#selected_shadow_x_spinner" ).spinner( "disable" );
			 $( "#selected_shadow_y_spinner" ).spinner( "disable" );
			 $( "#selected_shadow_blur_spinner" ).spinner( "disable" );
			 $('#selected_text_shadow_color').hide();
			 if(canvas_.selection!=null && canvas_.selection.type == "text") {
					canvas_.selection.options.shadow = false;
					canvas_.valid = false;
			  }
		} 
	});
   $( "#shadow_x_spinner" ).spinner({
			min: -10,
			max:10,
			stop: function( event, ui ) {
			   var val = document.getElementById("shadow_x_spinner").value;
			   currentFigurePicker.shadow_x = val;
			   redrawPickFigure();
			}
	 });
	$( "#shadow_x_spinner" ).spinner("widget").addClass("marginright_shadow");
	$( "#shadow_x_spinner" ).spinner( "value", 1 );
   $( "#selected_shadow_x_spinner" ).spinner({
			min: -10,
			max:10,
			stop: function( event, ui ) {
			   var val = document.getElementById("selected_shadow_x_spinner").value;
			   if(canvas_.selection!=null && canvas_.selection.type == "text") {
					canvas_.selection.options.shadow_x = val;
					canvas_.valid = false;
			  }
			}
	 });
	$( "#selected_shadow_x_spinner" ).spinner("widget").addClass("marginright_shadow");
	
    $( "#shadow_y_spinner" ).spinner({
			min: -10,
			max:10,
			stop: function( event, ui ) {
			   var val = document.getElementById("shadow_y_spinner").value;
			   currentFigurePicker.shadow_y = val;
			   redrawPickFigure();
			}
	 });
	$( "#shadow_y_spinner" ).spinner("widget").addClass("marginright_shadow");
	$( "#shadow_y_spinner" ).spinner( "value", 1 );
  $( "#selected_shadow_y_spinner" ).spinner({
			min: -10,
			max:10,
			stop: function( event, ui ) {
			   var val = document.getElementById("selected_shadow_y_spinner").value;
			   if(canvas_.selection!=null && canvas_.selection.type == "text") {
					canvas_.selection.options.shadow_y = val;
					canvas_.valid = false;
			  }
			}
	 });
	$( "#selected_shadow_y_spinner" ).spinner("widget").addClass("marginright_shadow");	
	 $( "#shadow_blur_spinner" ).spinner({
			min: 0,
			max:10,
			stop: function( event, ui ) {
			   var val = document.getElementById("shadow_blur_spinner").value;
			   currentFigurePicker.shadow_blur = val;
			   redrawPickFigure();
			}
	 });
	$( "#shadow_blur_spinner" ).spinner("widget").addClass("marginright_shadow");
	$( "#shadow_blur_spinner" ).spinner( "value", 1 );
  $( "#selected_shadow_blur_spinner" ).spinner({
			min: -10,
			max:10,
			stop: function( event, ui ) {
			   var val = document.getElementById("selected_shadow_blur_spinner").value;
			   if(canvas_.selection!=null && canvas_.selection.type == "text") {
					canvas_.selection.options.shadow_blur = val;
					canvas_.valid = false;
			  }
			}
	 });
	$( "#selected_shadow_blur_spinner" ).spinner("widget").addClass("marginright_shadow");	
	




	
// SELECTED OPTIONS
	$("#selected_figure_line_opacity_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.salpha = ui.value / 100;
			canvas_.valid=false;
		}
	   }
    });	
	$("#selected_figure_opacity_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.alpha = ui.value / 100;
			canvas_.valid=false;
		}
	   }
    });

	$("#selected_Lwidth_slider").slider({
	   min:0,
	   max:20,
	   step:1,
	   value:0,
	   slide: function( event, ui ) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.sw = ui.value ;
			canvas_.valid=false;
		}
	   }	
    });
	
	$("#selected_round_radius_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:30,
	   slide: function( event, ui ) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.roundRad = ui.value ;
			canvas_.valid=false;
		}
	   }
    });
	$("#selected_trapex_cutX_slider").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:20,
	   slide: function( event, ui ) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.cutX = ui.value ;
			canvas_.valid=false;
		}
	   }	
    });

	$("#selected_text__opacity").slider({
	   min:0,
	   max:100,
	   step:1,
	   value:100,
	   slide: function( event, ui ) {
	   	  if (canvas_.selection != null) {   
			canvas_.selection.options.alpha = ui.value / 100;
			canvas_.valid=false;
		  }   
	   }
    });

});
function updateSelectedOptions(shape) {
  if(shape==undefined) {
     $("#selected_options_tr").hide();
	 $("#selected_on_canvas_wrap").css("opacity",0.5);
	 return;
  } else {
     $("#selected_options_tr").show();
	 $("#selected_on_canvas_wrap").css("opacity",1);
  }
  var all=document.getElementsByName("selected_options");
  for(var x=0; x < all.length; x++) {
       document.getElementById(all[x].id).style.display = "none";
  }  
  var type = shape.type;
   	//document.getElementById("selected_canvas_options_tr").style.display = "";
	
  // Angle
  if (type != "line") {
   $("#selected_rotation_tr").show();
   $('#rotate_slider').slider('value', shape.angle);	
   // Opacity
   $("#selected_figure_opacity_tr").show();
   $('#selected_figure_opacity_slider').slider('value', parseInt(shape.options.alpha * 100));
  }
   
  if(type == "image") {

  } else if (type=="text") {
      $("#selected_figure_opacity_tr").hide();
	  $("#selected_rotation_tr").hide();
      // Show text selected block of options
	  $("#selected_text_area").show();
	  // Update opacity
	  $("#selected_text__opacity").slider('value',parseInt(shape.options.alpha * 100));
	  // update text
      $("#selected_text_shape_value").val(shape.options.text);
	  // update color
	  $("#selected_text_line_color").colpickSetColor(shape.options.font_color,false);
	  // set family value
	  $( "#selected_font__selector" ).val( shape.options.font_style );
	  // set font size
	  $( "#selected_font_size_selector" ).val( shape.options.font_size );
	  // set font bold
	  $( "#selected_font_style_selector" ).val( shape.options.font_bold );
	  if (shape.options.shadow == true) {
	    $('#selected_checkboxTextShadow').prop('checked', true);
		$( "#selected_shadow_x_spinner" ).spinner( "value", shape.options.shadow_x );
		$( "#selected_shadow_y_spinner" ).spinner( "value", shape.options.shadow_y );
		$( "#selected_shadow_blur_spinner" ).spinner( "value", shape.options.shadow_blur );
		$("#selected_text_shadow_color").colpickSetColor(shape.options.shadow_color,false);
	  } else {
	    $('#selected_checkboxTextShadow').prop('checked', false);
		
	  }  
  } else {
    // line color
 	$("#sel_line_col_tr").show();
	var lineColorN = shape.options.lineColor.replace(/#/,"");
	$("#selected_line_color").colpickSetColor(lineColorN,false);
	// line opacity
    $("#selected_figure_line_opacity_tr").show();
	$('#selected_figure_line_opacity_slider').slider('value', parseInt(shape.options.salpha * 100));
	// Line width
    $("#selected_line_width_tr").show();
	$('#selected_Lwidth_slider').slider('value', shape.options.sw);
	if (type != "line") {
		// fill color
	    $("#sel_fill_col_tr").show();
	    var fillColorN = shape.options.fillColor.replace(/#/,"");
	    $("#selected_fill_color").colpickSetColor(fillColorN,false); 
	}
	if (type == "rectangle") {
 
	} else if (type == "round") {
	    $("#selected_round_radius_tr").show();
	    $('#selected_round_radius_slider').slider('value', shape.options.roundRad);
	} else if (type == "circle") {
	
	} else if (type == "trapex") {
	    $("#selected_trapex_cutX_tr").show();
	    $('#selected_trapex_cutX_slider').slider('value', shape.options.cutX);
	}
  }
}
function showPicker(tablePicker,scrolledID) {
  tablePickerID = tablePicker;
  //alert(tablePickerID + " " + document.getElementById(tablePickerID).style.display);
  if(document.getElementById(tablePickerID).style.display == "") {
     //alert(tablePickerID+ "toNone");
     document.getElementById(tablePickerID).style.display = "none";
	 return;
  } else {
     var all=document.getElementsByName("picker_table");
     for(var x=0; x < all.length; x++) {
       document.getElementById(all[x].id).style.display = "none";
     }
	 //alert(tablePickerID+"toShow");
	 document.getElementById(tablePickerID).style.display = "";
	   $('#'+scrolledID).perfectScrollbar();
       $('#'+scrolledID).perfectScrollbar('update');
  }

}
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

var SaveObject = {};
var globalFloorCounter = 0;
function createSaveObjectPre() {
	$("#drawingSaveButton").hide(); 
	$("#savingPH").show();
    globalFloorCounter = 0;
    for (var i = 0 ; i < floorCanvases.length ; i ++) {
	  var state = floorCanvases[i];
	  // Create image from all canvas
 
	  state.selection = null;
	  state.listSelected = [];
	  state.drawAll = true;
	  zoomReset(state);
	  
  }	  
}
function updateSaveObjectPre() {
	  var state = canvas_;
	  // Create image from all canvas
	  state.selection = null;
	  state.listSelected = [];
	  zoomReset(state);
	  var placeName = document.getElementById("server_placeName").value;
	  var branchName = document.getElementById("server_placeBranchName").value;
	  var placeID = document.getElementById("server_placeID").value;
	  var sendJSON ={"placeName":placeName,"branchName":branchName,"placeID":placeID};
	  var postImagesData = {jsonObject:JSON.stringify(sendJSON)};
	  $.ajax({
	      url : "/checkPlaceUpdate",
	      data: postImagesData,
	      success : function(data) {
				if(data.exists){
					document.getElementById("updateExistingWarning").style.display="";
				} else {
					alert('New Place');
				}
			},
	      dataType : "json",
	      type : "post"
	  }); 
	  
}

function createSaveObject() {
  if (globalFloorCounter == floorCanvases.length) {
	 globalFloorCounter = 0;
     SaveObject = {};
     SaveObject.stage = "Draw";
	 var JSONbyte64files=[]; // { "imageID" : data64 }
     var JSONSIDlinks = [];  // { "sid" : "ImageID" }
     var ImageMirrorUsed = {};
     var user_ = "testing1";
     var place_ = "testingPlace1";
     var snif_ = "testingSnif1";
	 SaveObject.user_ = user_;
	 SaveObject.place_ = document.getElementById("userSetPlaceName").value;
	 SaveObject.snif_ = document.getElementById("userSetPlaceBName").value;
	 SaveObject.placeID = document.getElementById("userSetPlaceID").value;
	 SaveObject.address = document.getElementById("server_Address").value;
	 SaveObject.lat = document.getElementById("server_Lat").value;
	 SaveObject.lng = document.getElementById("server_Lng").value;

	 SaveObject.floors = [];
   for (var c=0;c < floorCanvases.length; c++ ) {   
      var state = floorCanvases[c];
      console.log("Saving State:"+state);
	  // shapes , canvas , zoom ,
      CanvasFloor = {};
      CanvasFloor.state =  JSON.parse(JSON.stringify(state,[
					  "width",
					  "height",
					  "origWidth",
					  "origHeight",
					  "floorid",
					  "mainfloor",
					  "bg_color",
					  "line_color",
					  "backgroundType", /* color, tiling, fill, repeat, asimage , axis*/
					  "backgroundActualId", /* ID of the background img */
					  "tilew", /* user background image height */
					  "tileh"
					  ]));
	  var shapes = [];
	  if (state.bookshapes.length != "undefined") {
		for (var i = 0; i < state.bookshapes.length; i += 1) {
		   var Shape = JSON.parse(JSON.stringify(state.bookshapes[i],["x","y","w","h","bookableShape","rotate","angle","type","options","prevMX","prevMY","sid"]));
		   var intAngle = parseInt(Shape.angle);
		   Shape.angle = intAngle;
		   var shapeOptions = JSON.parse(JSON.stringify(state.bookshapes[i].options));
		   if(shapeOptions.imgID!=undefined) {
			   var replace_server_prefix = shapeOptions.imgID.replace(/^server_/,"");
			   shapeOptions.imgID = replace_server_prefix;
		   }
		   var bookingOptions = JSON.parse(JSON.stringify(state.bookshapes[i].booking_options));
		   Shape.options = shapeOptions;
		   Shape.booking_options = bookingOptions;
		   shapes.push(Shape);
		}
	  }
	  CanvasFloor.shapes=shapes;
	  var bgshapes = [];
	  if (state.bgshapes.length != "undefined") {
		for (var i = 0; i < state.bgshapes.length; i += 1) {
		   var Shape = JSON.parse(JSON.stringify(state.bgshapes[i],["x","y","w","h","bookableShape","rotate","angle","type","options","prevMX","prevMY","sid"]));
		   var intAngle = parseInt(Shape.angle);
		   Shape.angle = intAngle;
		   var shapeOptions = JSON.parse(JSON.stringify(state.bgshapes[i].options));
		   if(shapeOptions.imgID!=undefined) {
			   var replace_server_prefix = shapeOptions.imgID.replace(/^server_/,"");
			   shapeOptions.imgID = replace_server_prefix;
		   }
		   Shape.options = shapeOptions;
		   bgshapes.push(Shape);
		}
	  }
	  CanvasFloor.bgshapes=bgshapes;
	  CanvasFloor.username = user_;
	  CanvasFloor.place = document.getElementById("userSetPlaceName").value;
	  CanvasFloor.snif = document.getElementById("userSetPlaceBName").value;
	  CanvasFloor.placeID = document.getElementById("userSetPlaceID").value;
  var floorid =  state.floorid;
  CanvasFloor.floor_name = state.floor_name;
  CanvasFloor.floorid = state.floorid;
  CanvasFloor.mainfloor = CanvasFloor.state.mainfloor;
  CanvasFloor.allImageSrc  = document.getElementById("canavasAllImage_"+floorid).src;
  CanvasFloor.bgImageSrc  = document.getElementById("canavasBgImage_"+floorid).src;
  
  if(CanvasFloor.state.backgroundType != "color" && CanvasFloor.state.backgroundType != "tiling") {
	//  SaveObject.state.backgroundGCSimage = user_+"/"+place_+"/"+snif_+"/"+"backgroundImage";
	  CanvasFloor.background = document.getElementById("chosed_background_orig_"+floorid).src;
  } else if (CanvasFloor.state.backgroundType == "tiling") {
	  // Image preload while user chooses background from menu
	  CanvasFloor.background =  document.getElementById("default_bg_image_mirror_"+floorid).src;
  }
  var allshapes = [];
  allshapes = allshapes.concat(state.bookshapes);
  allshapes = allshapes.concat(state.bgshapes);
  
  for (var i = 0; i < allshapes.length; i += 1) {
      if (allshapes[i].type == "image") {
    	  var imgID = allshapes[i].options.imgID;
    	  var sid = allshapes[i].sid;
    	  var myRegExp = /^user_img/;
    	  if(imgID.match(myRegExp)) {
 			  var jsonimgID_2_data = {"imageID":imgID ,"data64": document.getElementById(imgID).src};
			  JSONbyte64files.push(jsonimgID_2_data);
			  var jsonSID_2_imgID = {"sid":sid,"imageID":imgID};
			  JSONSIDlinks.push(jsonSID_2_imgID);    		  
    	  } else {
    		  myregexp = /mirror/;
    		  var myregexp2 = /^server_/;
    		  var imgKey;
    		  if (imgID.match(myregexp)) {
    			  imgKey = imgID;
    		  } else if(imgID.match(myregexp2)) {
    			  imgKey = imgID;
    			  imgID = imgID.replace(/^server_/,"");
    		  } else {
    			  imgKey="mirror_"+imgID;
    		  }
    		  
    		  var mirror = document.getElementById(imgKey);
    		  if (imgKey in ImageMirrorUsed) {
    			  // No need to add additional image to JSON object
    		  } else {
    			  ImageMirrorUsed[imgKey] =1;
	    		  var jsonimgID_2_data = {"imageID":imgID ,"data64": mirror.src};
	    		  JSONbyte64files.push(jsonimgID_2_data);
    		  }
   			  var jsonSID_2_imgID = {"sid":sid,"imageID":imgID};
   			  JSONSIDlinks.push(jsonSID_2_imgID);	  
    	  }  	  
      }
   }
   SaveObject.floors.push(CanvasFloor);
  }
  SaveObject.JSONbyte64files = JSONbyte64files;
  SaveObject.JSONSIDlinks = JSONSIDlinks;
  
  console.log(SaveObject);
  var postImagesData = {jsonObject:JSON.stringify(SaveObject)};
 sendAJAX(postImagesData,"uploadCanvasImages");
 }
}
var globalLoading = false;
function loadImageByCanvas(fromID,toID,canvasID) {
	  var image = new Image();
	  image.src = document.getElementById(fromID).src ;
	  var mirror = document.getElementById(toID);
	  globalLoading = true;
	  image.onload = function() {
		   //  alert(this.width + " " + this.height);
			 var actualWidth = this.width;
			 var actualHeight = this.height;
			 var c = document.getElementById(canvasID);
			  
		     c.width = actualWidth;
			 c.height = actualHeight;
			 mirror.width = actualWidth;
			 mirror.height = actualHeight;				 
			 var ctx = c.getContext("2d");
			 var imgID =  document.getElementById(fromID);
				// constant image for pick
             ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
		     ctx.drawImage(imgID,0,0,actualWidth,actualHeight);
			 var dataURL = c.toDataURL('image/png');
			 mirror.src = dataURL;
			  globalLoading = false;
	       };		
}
function sendAJAX(JSON_,url_) {
	  $.ajax({
	      url : url_,
	      data: JSON_,
	      beforeSend: function () { $("#drawingSaveButton").hide(); $("#savingPH").show(); },
	      success : function(data){
	    	  if(data.status=="OK") {
		    	  $("#savingPH").hide();
				  $("#drawingSaveButton").show();
		    	  //displayMessage("green","Place Added");
		    	  $("#drawingConfigButton_disabled").hide();
		    	  $("#drawingConfigButton").show();
	    	  } else {
	    		  $("#savingPH").hide();
				  $("#drawingSaveButton").show();
				  console.log(data.status);
				  alert("Server Error Occured. Send log to administrator");
	    	  }
	      },
	      error: function(e) {
		         console.log(e);
		         $("#savingPH").hide();
				 $("#drawingSaveButton").show();
				 alert("Error occured. Please try again later")
		       },
	      dataType : "json",
	      type : "post"
	  });  	
	
}
function groupSelected() {
  // Calculate width , heigth & x,y for the new object
   if(canvas_.listSelected.length > 1) {
      var canvas_shapes = canvas_.shapes;
	  var origlist = canvas_.listSelected;
	  var list = []
	  for (var s = 0 ; s < canvas_shapes.length ; s ++ ) {
	    var cshape = canvas_shapes[s];
		for (var z = 0 ; z < origlist.length ; z++ ) {
		  var mshape = origlist[z];
		  if (cshape.sid == mshape.sid) {
		    list.push(mshape);
			break;
		  }
		}
	  }
	  
	  var mostLeft = 1000000;
	  var mostRight = -1000000;
	  var mostTop = 1000000;
	  var mostBottom = -1000000;

	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
		if(shape.type == "line") {
		   var left;
		   var right;
		   var top;
		   var bottom;
		   if(shape.options.x1 < shape.options.x2) {
		      left = shape.options.x1;
			  right = shape.options.x2;
		   } else {
		      left = shape.options.x2;
			  right = shape.options.x1;
		   }
		   if(shape.options.y1 < shape.options.y2) {
		      top = shape.options.y1;
			  bottom = shape.options.y2;
		   } else {
		      top = shape.options.y2;
			  bottom = shape.options.y1;
		   }
			   if(left<mostLeft) {
				mostLeft = left;
			   }
			   if(right>mostRight) {
				mostRight = right;
			   }
			   if(top<mostTop) {
				mostTop = top;
			   }
			   if(bottom>mostBottom) {
				mostBottom = bottom;
			   }			   
		} else {
			var listxy = shape.getCorners();
			for (var i = 0 ; i < 8; i+=2) {
			   if(listxy[i]<mostLeft) {
				mostLeft = listxy[i];
			   }
			   if(listxy[i]>mostRight) {
				mostRight = listxy[i];
			   }
			} 
			for (var i = 1 ; i < 8; i+=2) {
			   if(listxy[i]<mostTop) {
				mostTop = listxy[i];
			   }
			   if(listxy[i]>mostBottom) {
				mostBottom = listxy[i];
			   }
			}
		}
	  }
	  console.log("("+mostLeft+","+mostTop+")  ("+mostRight+","+mostBottom+")");
	  var g_width = mostRight - mostLeft + 4;
	  var g_height = mostBottom - mostTop + 4;
	  var g_x = g_width/2;
	  var g_y = g_height/2;
	 document.getElementById("group_shapes_canvas").width = g_width  ;
     document.getElementById("group_shapes_canvas").height = g_height ;
	  
	
	 gcanvas.width = g_width;
	 gcanvas.height = g_height;
     gcanvas.shapes=[];
	for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
		
	  if (shape.type == "rectangle") {
	     var lineColor = shape.options.lineColor;
		 var fillColor = shape.options.fillColor;
		 var alpha = shape.options.alpha;
		 var salpha = shape.options.salpha;
		 var sw = shape.options.sw;
		 var x = shape.x - mostLeft +2 ;
		 var y = shape.y - mostTop+2 ;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw} ;
	     gcanvas.addShape(new Shape(gcanvas, x , x , shape.w, shape.h, "rectangle" , options ,shape.angle));
	  } else if (shape.type == "line") {
	     var lineColor = shape.options.lineColor;
		 var salpha = shape.options.salpha;
		 var sw = shape.options.sw;
		 var x = shape.x - mostLeft+2 ;
		 var y = shape.y - mostTop+2 ;
		 var x1 = shape.options.x1 - mostLeft+2 ;
		 var y1 = shape.options.y1 - mostTop+2 ;
		 var x2 = shape.options.x2 - mostLeft+2 ;
		 var y2 = shape.options.y2 - mostTop+2 ;
		 var options = {x1:x1,y1:y1,x2:x2,y2:y2,lineColor:lineColor , salpha:salpha, sw:sw  } ;
	     gcanvas.addShape(new Shape(gcanvas, x , y , shape.w, shape.h, "line" , options ));
	  } else if (shape.type == "round") {
	     var lineColor = shape.options.lineColor;
		 var fillColor = shape.options.fillColor;
		 var alpha = shape.options.alpha;
		 var salpha = shape.options.salpha;
		 var sw = shape.options.sw;
		 var roundRad = shape.options.roundRad;
		 var x = shape.x - mostLeft+2 ;
		 var y = shape.y - mostTop+2 ;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw , roundRad:roundRad } ;
	     gcanvas.addShape(new Shape(gcanvas, x , y , shape.w, shape.h, "round" , options ,shape.angle));
	  } else  if (shape.type == "circle") {
	     var lineColor = shape.options.lineColor;
		 var fillColor = shape.options.fillColor;
		 var alpha = shape.options.alpha;
		 var salpha = shape.options.salpha;
		 var sw = shape.options.sw;
		 var startA =  shape.options.startA;
         var endA = shape.options.endA;
         var rad = shape.w;
		 var x = shape.x - mostLeft+2 ;
		 var y = shape.y - mostTop+2 ;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw ,startA:startA,endA:endA} ;
	     gcanvas.addShape(new Shape(gcanvas, x , y , shape.w, shape.h, "circle" , options ,shape.angle));
	  } else  if (shape.type == "trapex") {
	     var lineColor = shape.options.lineColor;
		 var fillColor = shape.options.fillColor;
		 var alpha = shape.options.alpha;
		 var salpha = shape.options.salpha;
		 var sw = shape.options.sw;
         var cutX = shape.options.cutX;
		 var x = shape.x - mostLeft+2 ;
		 var y = shape.y - mostTop+2 ;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw ,cutX:cutX} ;
	     gcanvas.addShape(new Shape(gcanvas, x , y , shape.w, shape.h , "trapex" , options ,shape.angle));
	  } else  if (shape.type == "text") {
		 var alpha = shape.alpha;
		 
		 var options = {text:shape.options.text ,
		                font_bold:shape.options.font_bold , 
						font_style:shape.options.font_style, 
						font_size:shape.options.font_size, 
						font_color:shape.options.font_color ,
						alpha:shape.options.alpha , 
						shadow:shape.options.shadow, 
						shadow_x:shape.options.shadow_x, 
						shadow_y:shape.options.shadow_y ,
						shadow_blur:shape.options.shadow_blur ,
						shadow_color:shape.options.shadow_color} ;
		 var x = shape.x - mostLeft+2 ;
		 var y = shape.y - mostTop+2 ;
	     gcanvas.addShape(new Shape(gcanvas, x , y , shape.w, shape.h , "text" , options ,shape.angle));
	  }  else  if (shape.type == "image") {
		 var alpha = shape.options.alpha;
		 var imgID = shape.options.imgID;
		 var width = shape.w;
		 var height = shape.h ;
		 var options = {imgID:imgID ,alpha:alpha } ;
		 var x = shape.x - mostLeft+2 ;
		 var y = shape.y - mostTop+2 ;
	     gcanvas.addShape(new Shape(gcanvas, x , y , width , height  , "image" , options ,shape.angle));
	  }
	}
	gcanvas.createGroupImage = true;
	gcanvas.bgmode = canvas_.bgmode;
	gcanvas.valid = false;
	
  }
}
var globalIgnoreSRC = false;
function groupImageCreate(pickImageID,bg) {

	if(bg==false) {
		$('#user_picker').prepend('<img id="history_'+ pickImageID +'" class="bg_pick_image left" onclick="imgPicker(this,\'chosed_image\',\'user\')" />');
		document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;
		imgPicker(document.getElementById("history_"+pickImageID),'chosed_image','user');
		globalIgnoreSRC = true;
		$("#sss_user").click();	
	} else {
		$('#user_picker_bg').prepend('<img id="history_'+ pickImageID +'" class="bg_pick_image left" onclick="imgPicker(this,\'chosed_image_bg\',\'user\')" />');
		document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;
		imgPicker(document.getElementById("history_"+pickImageID),'chosed_image_bg','user');
		globalIgnoreSRC = true;
		$("#sssbg_user").click();
	}
}

/////////////////
// Floor
//////////////////
function RenameFloor() {
  var selectedFloorName = $("#floor__selector option:selected").val();
  var selectedCanvas ;
  for (var i = 0; i < floorCanvases.length ; i++ ) {
    if (floorCanvases[i].floor_name == selectedFloorName) {
	  selectedCanvas = floorCanvases[i];
	}
  }
  $("#add_floor_td").hide();
  $("#rename_floor_btn_td").hide();
  $("#remove_floor_td").hide();

  $(".add_floor_input_td").hide();
  $(".rename_floor_input_td").show();
  $("#cancel_floor_td").show();
  document.getElementById("rename_floor_input").value=selectedFloorName;
}
function RenameFloorDone() {
  var selectedFloorName = $("#floor__selector option:selected").val();
  var newFloorName = document.getElementById("rename_floor_input").value;
  if (newFloorName == "") {
     alert("Floor name must not be empty");
	 $("#rename_floor_input").css("border-color","red");
	 $("#rename_floor_input").css("background-color","rgb(255, 231, 231)");
	 return;
  }
  var selectedCanvas ;
  var namevalid = false;
  for (var i = 0; i < floorCanvases.length ; i++ ) {
    if (floorCanvases[i].floor_name == selectedFloorName) {
	  selectedCanvas = floorCanvases[i];
	}
  }
  
  if (floorNames[newFloorName] === undefined || floorNames[newFloorName] == selectedCanvas) {
    namevalid = true;   
	console.log("true");
  } else {
	alert("Floor name exists");
	return;
  }
  if (namevalid) {
	  delete floorNames[selectedCanvas.floor_name]; 
      selectedCanvas.floor_name = newFloorName;
	  floorNames[newFloorName] = selectedCanvas;
	  $("#floor__selector option:selected").val(newFloorName);
	  $("#floor__selector option:selected").text(newFloorName);
	  $("#add_floor_td").show();
      $("#rename_floor_btn_td").show();
		if(canvas_.mainfloor) {
		   $("#remove_floor_td").hide();
		} else {
		   $("#remove_floor_td").show();
		}
      $(".add_floor_input_td").hide();
      $(".rename_floor_input_td").hide();
	  $("#cancel_floor_td").hide();
  }
}
$(document).ready(function() {
	$('#rename_floor_input').keyup(function() {
		var selectedFloorName = $("#floor__selector option:selected").val();
		var newFloorName = document.getElementById("rename_floor_input").value;
		var selectedCanvas ;
		for (i = 0; i < floorCanvases.length ; i++ ) {
		if (floorCanvases[i].floor_name == selectedFloorName) {
		  selectedCanvas = floorCanvases[i];
		}
	   }
	  if (floorNames[newFloorName] === undefined || floorNames[newFloorName] == selectedCanvas) {
		$("#rename_floor_input").css("border-color","rgb(92, 153, 252)");
		$("#rename_floor_input").css("background-color","rgb(255, 252, 231)");
	  } else {
		$("#rename_floor_input").css("border-color","red");
		$("#rename_floor_input").css("background-color","rgb(255, 231, 231)");

	  } 
	});

	$('#add_floor_input').keyup(function() {		
	  var newFloorName = document.getElementById("add_floor_input").value;
	  if (floorNames[newFloorName] === undefined ) {
		$("#add_floor_input").css("border-color","rgb(92, 153, 252)");
		$("#add_floor_input").css("background-color","rgb(255, 252, 231)");
	  } else {
		$("#add_floor_input").css("border-color","red");
		$("#add_floor_input").css("background-color","rgb(255, 231, 231)");

	  } 
	});
	
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
		if(canvas_.mainfloor) {
		   $("#remove_floor_td").hide();
		} else {
		   $("#remove_floor_td").show();
		}
        zoomReset(canvas_);
		updateBackgroundSliders();  
		for(var f=0 ; f <  floorCanvases.length ; f++) {
		     floorCanvases[f].mode("bg");
		}
		$(".bg_shapes_options").hide();
		updateBackgroundFillOptions();
		$("#background_tab_dimentions").click();   
	 });
});
function CancelFloor() {
  document.getElementById("rename_floor_input").value = "";
  document.getElementById("add_floor_input").value="";
  $("#add_floor_td").show();
  $("#rename_floor_btn_td").show();
  		if(canvas_.mainfloor) {
		   $("#remove_floor_td").hide();
		} else {
		   $("#remove_floor_td").show();
		}
  $(".add_floor_input_td").hide();
  $(".rename_floor_input_td").hide();
  $("#cancel_floor_td").hide();
}
function DeleteFloorPre() {
   $("#popup_message_floor_name").html(canvas_.floor_name);
   $("#message_popup_wrap").show();
   $("#remove_floor_confirmation").show();
}
function PopupCancel(type) {
    $("#message_popup_wrap").hide();
	if(type=="floor_delete") {
	   $("#popup_message_floor_name").html("");
	   $("#remove_floor_confirmation").hide();
	}
}
function DeleteFloor() {
  var floorName = canvas_.floor_name;
  
  var canvasToRemove = canvas_;
  
  var mainCanvas;
  for (var f = 0 ; f < floorCanvases.length ; f++ ) {
     if(floorCanvases[f].mainfloor) {
	    mainCanvas = floorCanvases[f];
	 }
  }
  // Change selector to main floor canvas
  document.getElementById('floor__selector').value=mainCanvas.floor_name;
  
  // Show main canvas and zoom reset
  $("#"+canvas_.canvas.id).hide();
  $("#"+mainCanvas.canvas.id).show(); 
  canvas_ = mainCanvas;
  zoomReset(canvas_);
  updateBackgroundSliders();  
  
  // Update "Floor Options"
  CancelFloor();
  
  // Remove canvas from floor list
  floorCanvases.remove(canvasToRemove); 
  
  // Remove floor_name selector option
  $("#floor__selector option[value='"+floorName+"']").remove();
  
  // Close Pop-up message
  PopupCancel("floor_delete")
  // Set floors to BG stage
  for(var f=0 ; f <  floorCanvases.length ; f++) {
	     floorCanvases[f].mode("bg");
	}
   $(".bg_shapes_options").hide();
   updateBackgroundFillOptions();
   $("#background_tab_dimentions").click();   
}
function AddFloor() {
  $("#add_floor_td").hide();
  $("#rename_floor_btn_td").hide();
  $(".add_floor_input_td").show();
  $(".rename_floor_input_td").hide();
  $("#cancel_floor_td").show();
  var defaultName = "NewFloor"
  var ind = 1;
  while (floorNames[defaultName] !== undefined) {
    defaultName = defaultName +"-"+ind;
	ind ++;
  }
  document.getElementById("add_floor_input").value=defaultName;
}
function AddFloorAdd() {
      var newFloorName = document.getElementById("add_floor_input").value;
	  if (floorNames[newFloorName] === undefined ) {
	     $("#floor__selector").append( $('<option value="'+newFloorName+'">'+newFloorName+'</option>'));
		 $("#floor__selector [value='"+newFloorName+"']").attr("selected", "selected");
		 var newcanvasid= "canvas_"+randomString(10);
		 $("#canvas_append").prepend('<canvas id="'+newcanvasid+'" width="400" height="400"  tabindex="1" class="main_canvas" ></canvas>');
		 $("#"+newcanvasid).toggleClass("cmenu2");
		 applyCmenu(newcanvasid);
         var currentOpenCanvas = canvas_;
         var currentOpenID = currentOpenCanvas.canvas.id;	
         $("#"+currentOpenID).hide();	 
		 canvas_ = new CanvasState(document.getElementById(newcanvasid));		 
		 canvas_.main = true;
		 canvas_.floor_name = newFloorName;
		 floorCanvases.push(canvas_);
		 floorNames[newFloorName] = canvas_;
		 setCanvasSize (400,400); 
		 updateBackgroundSliders();
		 //$.getScript( "js/cmenu2.js");
		  $("#add_floor_td").show();
		  $("#rename_floor_btn_td").show();
		  	if(canvas_.mainfloor) {
			   $("#remove_floor_td").hide();
			} else {
			   $("#remove_floor_td").show();
			}
		  $(".add_floor_input_td").hide();
		  $(".rename_floor_input_td").hide();
		  $("#cancel_floor_td").hide();	
		  
		  for(var f=0 ; f <  floorCanvases.length ; f++) {
			     floorCanvases[f].mode("bg");
		   }
		  $(".bg_shapes_options").hide();
		  updateBackgroundFillOptions();
		   $("#background_tab_dimentions").click();   
	  } else {
	   alert("Such Floor name exists.Try another one");
	  }
}


 