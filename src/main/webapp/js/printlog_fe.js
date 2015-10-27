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

function selectedBackground(id,tablePicker,actualID) {
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
	  
	  var mirror = document.getElementById("default_bg_image_mirror");
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
  }

}
function userBackground (fillType , imageID ) {
  imgSource = document.getElementById(imageID).src;
  var image = new Image();
  image.src = imgSource;  
  var actualWidth;
  var actualHeight;  
   image.onload = function() {
      actualWidth = this.width;
	  actualHeight = this.height;
	  canvas_.backgroundFill = imgSource;
	  canvas_.backgroundImageID = document.getElementById(imageID);
	  canvas_.backgroundActualId = imageID;
	 // alert(canvas_.backgroundActualId);
	  if (fillType == "fill" ) {
          setCanvasSize (canvas_.origWidth,canvas_.origHeight);
		  canvas_.backgroundType = "fill" ;// all , tilling , color  
  
	  } else if (fillType == "repeat" ) {
          setCanvasSize (canvas_.origWidth,canvas_.origHeight);
		  actualWidth = this.width;
		  actualHeight = this.height;
		  canvas_.backgroundType = "repeat" ;// all , tilling , color
		  canvas_.tilew  = actualWidth;
		  canvas_.tileh = actualHeight;  
	  } else if (fillType == "asimage" ) {
		  actualWidth = this.width;
		  actualHeight = this.height;
		  setCanvasSize (actualWidth,actualHeight);
		  canvas_.backgroundType = "asimage" ;// all , tilling , color  	     
	  } else if (fillType == "axis" ){
		  setCanvasSize (canvas_.origWidth,canvas_.origHeight);
		  actualWidth = this.width;
		  actualHeight = this.height;
		  if ( canvas_.width < canvas_.height ) {
		      setCanvasSize (parseInt(canvas_.height * actualWidth / actualHeight),canvas_.height);
		  } else if ( canvas_.width > canvas_.height ){
		      setCanvasSize (canvas_.width,parseInt(canvas_.width * actualHeight / actualWidth) );
		  } else {
		     if ( actualWidth < actualHeight ) {
			      setCanvasSize (canvas_.width,parseInt(canvas_.width * actualHeight / actualWidth));
			 } else {
			      setCanvasSize (parseInt(canvas_.height * actualWidth / actualHeight),canvas_.height);
			 }
		  }
	     canvas_.backgroundType = "axis" ;
	  }
	  canvas_.valid = false;	
  } 
  
 $('#right_col_scroll').perfectScrollbar();
 $('#right_col_scroll').perfectScrollbar('update');
 $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
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
  } 
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

  }    
}

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
						
						 actualWidth = this.width;
						 actualHeight = this.height;
					     canvas_heightApplied = actualHeight;
						 canvas_widthApplied = actualWidth;

    	                document.getElementById("chosed_background_orig").src =  image.src ;
                        document.getElementById("chosed_background_orig").style.width = canvas_widthApplied + 'px';
                        document.getElementById("chosed_background_orig").style.height = canvas_heightApplied + 'px';
							
					   }
    	            };
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
		 });
});

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
function createSaveObjectPre() {
	  var state = canvas_;
	  // Create image from all canvas
 
	  state.selection = null;
	  state.drawAll = true;
	  zoomReset(state);
	  $("#drawing_tab_selector").click();
	  
}

function createSaveObject() {
  var state = canvas_;
  // shapes , canvas , zoom ,
  SaveObject.state =  JSON.parse(JSON.stringify(state,[
                  "width",
				  "height",
				  "origWidth",
				  "origHeight",
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
  SaveObject.shapes=shapes;
  var SID2GCSimage = {};
  var user_ = "testing1";
  var place_ = "testingPlace1";
  var snif_ = "testingSnif1";
  SaveObject.username = user_;
  SaveObject.place = document.getElementById("userSetPlaceName").value;
  SaveObject.snif = document.getElementById("userSetPlaceBName").value;
  SaveObject.placeID = document.getElementById("userSetPlaceID").value;
  SID2GCSimage.user_ = user_;
  SID2GCSimage.place_ = document.getElementById("userSetPlaceName").value;
  SID2GCSimage.snif_ = document.getElementById("userSetPlaceBName").value;
  SID2GCSimage.placeID = document.getElementById("userSetPlaceID").value;
  
  SID2GCSimage.allImageSrc  = document.getElementById("canavasAllImage").src;
  
  if(SaveObject.state.backgroundType != "color" && SaveObject.state.backgroundType != "tiling") {
	  SaveObject.state.backgroundGCSimage = user_+"/"+place_+"/"+snif_+"/"+"backgroundImage";
	  SID2GCSimage.background = document.getElementById("chosed_background_orig").src;
  } else if (SaveObject.state.backgroundType == "tiling") {
	  // Image preload while user chooses background from menu
	  SID2GCSimage.background =  document.getElementById("default_bg_image_mirror").src;
  }
  var JSONbyte64files=[]; // { "imageID" : data64 }
  var JSONSIDlinks = [];  // { "sid" : "ImageID" }
  var ImageMirrorUsed = {};
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
    		  var imgKey="mirror_"+imgID;
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
  SID2GCSimage.JSONbyte64files = JSONbyte64files;
  SID2GCSimage.JSONSIDlinks = JSONSIDlinks;
  SID2GCSimage.CanvasJSON = SaveObject;
  
  var postImagesData = {jsonObject:JSON.stringify(SID2GCSimage)};
  sendAJAX(postImagesData,"uploadCanvasImages");
 // alert(JSON.stringify(SaveObject, "", 4));
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
	      success : function(data){
	    	  displayMessage("green","Place Added");
	      },
	      dataType : "json",
	      type : "post"
	  });  	
	
}
