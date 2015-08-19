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

function selectedBackground(id,tablePicker,actualID) {
  var bg_image_id = "default_bg_image_mirror_"+canvas_.floorid;
  if (document.getElementById(bg_image_id)==null) {
     $("#bg_default_img_mirror").prepend('<img id="'+bg_image_id+'"/>');
  }

  imageID = id.id;
  tablePickerID = tablePicker;
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
		  setCanvasSize (actualWidth,actualHeight);
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

function imgPicker(id,tablePicker,actual) {
  imageID = id.id;
  tablePickerID = tablePicker;
  showID = "chosed_image";
  document.getElementById("chosed_image").style.opacity = 1;
  
  imgSource = document.getElementById(actual).src;
  var image = new Image();
  image.src = imgSource;
  document.getElementById("picked_figure_tr").style.display = "none";
  document.getElementById("current_figure_tr").style.display = "none";
  
  document.getElementById("selected_background_tr").style.display = "none";
  document.getElementById("background_options_tr").style.display = "none";
  
  document.getElementById("picked_image_tr").style.display = "";
  document.getElementById("current_image_tr").style.display = "";
  document.getElementById("img_alpha_div").style.display = "";
  $('#img_alpha_slider').slider('setValue', 100);
  var widthApplied = 100;
  var heightApplied = 100;
  
  image.onload = function() {
   //  alert(this.width + " " + this.height);
     actualWidth = this.width;
	 actualHeight = this.height;
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
  // this.width, this.height will be dimensions
    document.getElementById(showID).src = imgSource;
    document.getElementById(showID).style.width = widthApplied + 'px';
    document.getElementById(showID).style.height = heightApplied + 'px';
	currentFigurePicker.type="image";
	currentFigurePicker.imgID = actual;
	currentFigurePicker.width = actualWidth;
	currentFigurePicker.height = actualHeight;
	currentFigurePicker.alpha = 1;
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
 $('#right_col_scroll').perfectScrollbar();
 $('#right_col_scroll').perfectScrollbar('update');
 $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
}

var currentFigurePicker = new Object();

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
  }  else if (type == "line") {
    lineColor = "#000000";
    fillColor = "#BCA9F5" ;
	dbLine(ctx,25,75,125,75,currentFigurePicker.lineWidth,1,lineColor)
	mirror.width = 100+"px";
	mirror.height = 50+"px";
	var dataURL = c.toDataURL('image/png');
    mirror.src = dataURL;
	document.getElementById("line_options").style.display = "";
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
  
  ctx.clearRect( 0 , 0 , 150 , 150 );
  if (type == "round") {
  
	dbRoundRect(ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth,roundRad);

  } else if (type == "circle") {

	dbCircle(ctx , x, y, rad, rad,  startA,  endA ,lineColor,fillColor,alpha,salpha,lineWidth);

  } else if (type == "trapex") {

	dbTrapez (ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth,cutX);

  } else if (type == "rectangle") {

	dbDrawRect(ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth);

  } else if (type == "line") {
    dbLine(ctx,25,75,125,75,lineWidth,salpha,lineColor);

  }  else if (type == "text") {
    dbText(ctx,75,75,currentFigurePicker.text,
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
    	                document.getElementById("chosed_background").src =  image.src ;
                        document.getElementById("chosed_background").style.width = widthApplied + 'px';
                        document.getElementById("chosed_background").style.height = heightApplied + 'px';
                         
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
							
					   }
    	            };
    	        } 
    	    });

    $("#userImageUpload_input").on("change", function()
    	    {
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            //var imgSrc = this.result 
					
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  $('#img_alpha_slider').slider('setValue', 100);
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
                        $('#history_images_wrapper').append('<img id="history_'+ pickImageID +'" class="history_tumb" ondblclick="imgPicker(this,\'tmp\',\''+pickImageID+'\')" />');
					    
					   
					   
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

						var hist_width = 100;
						var hist_height = parseInt(100 * canvas_heightApplied / canvas_widthApplied) ;
    	                document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;
                        document.getElementById("history_"+pickImageID).style.width = hist_width + 'px';
                        document.getElementById("history_"+pickImageID).style.height = hist_height + 'px';
						 $('#history_div_scrollable').perfectScrollbar();
                         $('#history_div_scrollable').perfectScrollbar('update');
					
					 	var all=document.getElementsByName("current_pick_data");
						 for(var x=0; x < all.length; x++) {
						   document.getElementById(all[x].id).style.display = "none";
						 }
    	               $("#chosed_image").css("display", "");
					   document.getElementById("picked_image_tr").style.display = "";
					   document.getElementById("current_image_tr").style.display = "";
                       document.getElementById("img_alpha_div").style.display = "";
					   }
    	            };
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
		  document.getElementById("selected_canvas_options_tr").style.display = "none";
	      document.getElementById("selected_options_tr").style.display = "none";
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

				document.getElementById("selected_canvas_options_tr").style.display = "none";
	            document.getElementById("selected_options_tr").style.display = "none";
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
			//$(el).css('background-color','#'+hex);
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
	
	$("#round_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.alpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
	$("#img_alpha_slider").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.alpha = value / 100;
		document.getElementById("chosed_image").style.opacity = currentFigurePicker.alpha;
		return  value;
	}
    });
	$("#round_line_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.salpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });	
	$("#round_radius").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.roundRad = value;
		redrawPickFigure();
		return  value;
	}
    });	
	
	$("#round_Lwidth").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.lineWidth = value;
		redrawPickFigure();
		return  value;
	}
    });
	$("#circle_Lwidth").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.lineWidth = value;
		redrawPickFigure();
		return  value;
	}
    });
	$("#line_Lwidth").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.lineWidth = value;
		redrawPickFigure();
		return  value;
	}
    });
//	$("#circle_radius").slider({
//	   formatter: function(value) {
//	    currentFigurePicker.rad = value;
//		redrawPickFigure();
//		return  value;
//	}
//    });
	$("#circle_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.alpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
	$("#line_line_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.salpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
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
			 redrawPickFigure();
			 currentFigurePicker.shadow = false;
		}else{ 
             $( "#shadow_x_spinner" ).spinner( "disable" );
			 $( "#shadow_y_spinner" ).spinner( "disable" );
			 $( "#shadow_blur_spinner" ).spinner( "disable" );
			 $('#text_shadow_color').hide();
			 redrawPickFigure();
			 currentFigurePicker.shadow = true;
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
	$( "#shadow_x_spinner" ).spinner( "value", 0 );
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
	$( "#shadow_y_spinner" ).spinner( "value", 0 );
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
	$( "#shadow_blur_spinner" ).spinner( "value", 0 );
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
	
	$("#text__opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.alpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
	$("#circle_line_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.salpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });	
	$("#trapex_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.alpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
	$("#trapex_line_opacity").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.salpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });	
	$("#trapex_radius").slider({
	    tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.cutX = value ;
		redrawPickFigure();
		return  value;
	}
    });
	$("#trapex_Lwidth").slider({
	tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.lineWidth = value;
		redrawPickFigure();
		return  value;
	}
    });
	$("#rectangle_opacity").slider({
	   tooltip: 'hide',
	   reversed : true,
	   formatter: function(value) {
	    currentFigurePicker.alpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
	$("#rectangle_line_opacity").slider({
	   tooltip: 'hide',
	   reversed : true,
	   formatter: function(value) {
	    currentFigurePicker.salpha = value / 100;
		redrawPickFigure();
		return  value;
	}
    });
	$("#rectangle_Lwidth").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	    currentFigurePicker.lineWidth = value;
		redrawPickFigure();
		return  value;
	}
    });
	
// SELECTED OPTIONS
	$("#selected_figure_line_opacity_slider").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {	   
	     if (canvas_.selection != null) {   
			canvas_.selection.options.salpha = value / 100;
			canvas_.valid=false;
			return  value;
		}
	  }
    });	
	$("#selected_figure_opacity_slider").slider({
	   reversed : true,
	   tooltip: 'hide',
	   formatter: function(value) {	   
	     if (canvas_.selection != null) {   
			canvas_.selection.options.alpha = value / 100;
			canvas_.valid=false;
			return  value;
		}
	  }
    });	
	$("#selected_Lwidth_slider").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.sw = value ;
			canvas_.valid=false;
			return  value;
		}
	}
    });
	$("#selected_round_radius_slider").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.roundRad = value ;
			canvas_.valid=false;
			return  value;
		}
	}
    });
	$("#selected_trapex_cutX_slider").slider({
	   tooltip: 'hide',
	   formatter: function(value) {
	     if (canvas_.selection != null) {   
			canvas_.selection.options.cutX = value ;
			canvas_.valid=false;
			return  value;
		}
	}
    });
	


});
function updateSelectedOptions(shape) {
  var type = shape.type;
  var all=document.getElementsByName("selected_options");
  for(var x=0; x < all.length; x++) {
       document.getElementById(all[x].id).style.display = "none";
  }  
   	document.getElementById("selected_canvas_options_tr").style.display = "";
	document.getElementById("selected_options_tr").style.display = "";
  // Angle
  if (type != "line") {
   document.getElementById("selected_rotation_tr").style.display = "";
   $('#rotate_slider').slider('setValue', shape.angle);
   // Opacity
   document.getElementById("selected_figure_opacity_tr").style.display = "";
   $('#selected_figure_opacity_slider').slider('setValue', parseInt(shape.options.alpha * 100));
  }
   
  if(type == "image") {

  } else if (type=="text") {
      // Show text selected block of options
	  document.getElementById("selected_text_area").style.display = "";
	  // update text
      document.getElementById("selected_text_shape_value").value = shape.options.text;
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
 	document.getElementById("sel_line_col_tr").style.display = "";
	var lineColorN = shape.options.lineColor.replace(/#/,"");
	$("#selected_line_color").colpickSetColor(lineColorN,false);
	// line opacity
    document.getElementById("selected_figure_line_opacity_tr").style.display = "";
	$('#selected_figure_line_opacity_slider').slider('setValue', parseInt(shape.options.salpha * 100));
	// Line width
    document.getElementById("selected_line_width_tr").style.display = "";
	$('#selected_Lwidth_slider').slider('setValue', shape.options.sw);
	if (type != "line") {
		// fill color
	    document.getElementById("sel_fill_col_tr").style.display = "";
	    var fillColorN = shape.options.fillColor.replace(/#/,"");
	    $("#selected_fill_color").colpickSetColor(fillColorN,false); 
	}
	if (type == "rectangle") {
 
	} else if (type == "round") {
	    document.getElementById("selected_round_radius_tr").style.display = "";
	    $('#selected_round_radius_slider').slider('setValue', shape.options.roundRad);
	} else if (type == "circle") {
	
	} else if (type == "trapex") {
	    document.getElementById("selected_trapex_cutX_tr").style.display = "";
	    $('#selected_trapex_cutX_slider').slider('setValue', shape.options.cutX);
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
    globalFloorCounter = 0;
    for (var i = 0 ; i < floorCanvases.length ; i ++) {
	  var state = floorCanvases[i];
	  // Create image from all canvas
 
	  state.selection = null;
	  state.drawAll = true;
	  zoomReset(state);
	  $("#drawing_tab_selector").click();	
  }	  
}
function updateSaveObjectPre() {
	  var state = canvas_;
	  // Create image from all canvas
	  state.selection = null;
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
	  if (state.shapes.length != "undefined") {
		for (var i = 0; i < state.shapes.length; i += 1) {
		   var Shape = JSON.parse(JSON.stringify(state.shapes[i],["x","y","w","h","rotate","angle","type","options","prevMX","prevMY","sid"]));
		   var shapeOptions = JSON.parse(JSON.stringify(state.shapes[i].options));
		   var bookingOptions = JSON.parse(JSON.stringify(state.shapes[i].booking_options));
		   Shape.options = shapeOptions;
		   Shape.booking_options = bookingOptions;
		   shapes.push(Shape);
		}
	  }
	  CanvasFloor.shapes=shapes;

	  CanvasFloor.username = user_;
	  CanvasFloor.place = document.getElementById("userSetPlaceName").value;
	  CanvasFloor.snif = document.getElementById("userSetPlaceBName").value;
	  CanvasFloor.placeID = document.getElementById("userSetPlaceID").value;
  var floorid =  state.floorid;
  CanvasFloor.floor_name = state.floor_name;
  CanvasFloor.floorid = state.floorid;
  CanvasFloor.mainfloor = CanvasFloor.state.mainfloor;
  CanvasFloor.allImageSrc  = document.getElementById("canavasAllImage_"+floorid).src;
  
  if(CanvasFloor.state.backgroundType != "color" && CanvasFloor.state.backgroundType != "tiling") {
	//  SaveObject.state.backgroundGCSimage = user_+"/"+place_+"/"+snif_+"/"+"backgroundImage";
	  CanvasFloor.background = document.getElementById("chosed_background_orig_"+floorid).src;
  } else if (CanvasFloor.state.backgroundType == "tiling") {
	  // Image preload while user chooses background from menu
	  CanvasFloor.background =  document.getElementById("default_bg_image_mirror_"+floorid).src;
  }

  for (var i = 0; i < state.shapes.length; i += 1) {
      if (state.shapes[i].type == "image") {
    	  var imgID = state.shapes[i].options.imgID;
    	  var sid = state.shapes[i].sid;
    	  var myRegExp = /user_img/;
    	  if(imgID.match(myRegExp)) {
 			  var jsonimgID_2_data = {"imageID":imgID ,"data64": document.getElementById(imgID).src};
			  JSONbyte64files.push(jsonimgID_2_data);
			  var jsonSID_2_imgID = {"sid":sid,"imageID":imgID};
			  JSONSIDlinks.push(jsonSID_2_imgID);    		  
    	  } else {
    		  myregexp = /mirror/;
    		  var imgKey;
    		  if (imgID.match(myregexp)) {
    			  imgKey = imgID;
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
	      beforeSend: function () { $("#saveplase_ajax_gif").show(); },
	      success : function(data){
	    	  $("#saveplase_ajax_gif").hide();
	    	  displayMessage("green","Place Added");
	    	  $("#drawingSaveButton").css("width","100px");
	    	  $("#drawingConfigButton").show();
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
	gcanvas.valid = false;
	
  }
}
function groupImageCreate(pickImageID,g_width,g_height) {
	
    $('#history_images_wrapper').prepend('<img id="history_'+ pickImageID +'" class="history_tumb" ondblclick="imgPicker(this,\'tmp\',\''+pickImageID+'\')" />');
	var hist_height;
	var hist_width;
	if (g_width > g_height) {
	 hist_width = 100;
	 hist_height = parseInt(100 * g_height/ g_width ) ;
	} else {
	  hist_height = 100;
	 hist_width = parseInt(100 * g_width/g_height ) ;
	}
    document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;
    document.getElementById("history_"+pickImageID).style.width = hist_width + 'px';
    document.getElementById("history_"+pickImageID).style.height = hist_height + 'px';
	$('#history_div_scrollable').perfectScrollbar();
    $('#history_div_scrollable').perfectScrollbar('update');
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
  $("#add_floor_div_btn").hide();
  $("#rename_floor_btn_td").hide();
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
	  $("#add_floor_div_btn").show();
      $("#rename_floor_btn_td").show();
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
        zoomReset(canvas_);
		document.getElementById("canvas_w").value = Math.round(canvas_.width);
        document.getElementById("canvas_h").value = Math.round(canvas_.height);
        		
	 });
});
function CancelFloor() {
  document.getElementById("rename_floor_input").value = "";
  document.getElementById("add_floor_input").value="";
  $("#add_floor_div_btn").show();
  $("#rename_floor_btn_td").show();
  $(".add_floor_input_td").hide();
  $(".rename_floor_input_td").hide();
  $("#cancel_floor_td").hide();
}
function AddFloor() {
  $("#add_floor_div_btn").hide();
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
		 $("#canvas_wrapper").prepend('<canvas id="'+newcanvasid+'" width="400" height="400"  tabindex="1" class="main_canvas" ></canvas>');
		 $("#"+newcanvasid).toggleClass("cmenu2");
         var currentOpenCanvas = canvas_;
         var currentOpenID = currentOpenCanvas.canvas.id;	
         $("#"+currentOpenID).hide();	 
		 canvas_ = new CanvasState(document.getElementById(newcanvasid));		 
		 canvas_.main = true;
		 canvas_.floor_name = newFloorName;
		 floorCanvases.push(canvas_);
		 floorNames[newFloorName] = canvas_;
		 setCanvasSize (400,400); 
		 document.getElementById("canvas_w").value = 400;
         document.getElementById("canvas_h").value = 400;
		 $.getScript( "js/cmenu2.js");
		  $("#add_floor_div_btn").show();
		  $("#rename_floor_btn_td").show();
		  $(".add_floor_input_td").hide();
		  $(".rename_floor_input_td").hide();
		  $("#cancel_floor_td").hide();		 
	  } else {
	   alert("Current Floor name exists");
	  }
}

 