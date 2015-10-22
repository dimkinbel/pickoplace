/**
 * 
 */
var totalImages = 0;
var currentUploaded = 0;
function updateCanvasShapes(canvas,canvasStateJSON) {

	canvas.width = canvasStateJSON.state.width;	
	canvas.height = canvasStateJSON.state.height;
	canvas.origWidth = canvasStateJSON.state.width;
	canvas.origHeight = canvasStateJSON.state.height;
	canvas.mainfloor = canvasStateJSON.state.mainfloor;
	canvas.floorid = canvasStateJSON.floorid;
	canvas.floor_name = canvasStateJSON.floor_name;
	if(canvas.mainfloor) {
		document.getElementById("canvas_w").value=Math.round(canvasStateJSON.state.width);
		document.getElementById("canvas_h").value=Math.round(canvasStateJSON.state.height);
	}
	setCanvasSize (canvas.origWidth,canvas.origHeight,canvas);
	canvas.bg_color = canvasStateJSON.state.bg_color;
	canvas.line_color = canvasStateJSON.state.line_color;
	var itype = canvasStateJSON.state.backgroundType;
	canvas.backgroundType = canvasStateJSON.state.backgroundType;
	//alert(canvas.backgroundType);
	if (itype == "tiling") {
		canvas.backgroundActualId = "default_bg_image_mirror_"+canvas.floorid;
		canvas.backgroundImageID = document.getElementById("default_bg_image_mirror_"+canvas.floorid);
		canvas.backgroundFill="default_bg_image_mirror_"+canvas.floorid;
	} else if (itype != "color") {
		canvas.backgroundActualId = "chosed_background_orig_"+canvas.floorid;
		canvas.backgroundImageID = document.getElementById("chosed_background_orig_"+canvas.floorid);
		canvas.backgroundFill="chosed_background_orig_"+canvas.floorid;
	}
	canvas.tilew = canvasStateJSON.state.tilew;
	canvas.tileh = canvasStateJSON.state.tileh;
	canvas.valid = false;
	var shapes = canvasStateJSON.shapes;
	var bgshapes = canvasStateJSON.bgshapes;

	canvas.bgmode=false;
	for (var ind in shapes) {
		var shape = shapes[ind];
		var booking_options;

		 if (shape.type == "rectangle") {
			 var options = JSON.parse(JSON.stringify(shape.options));
			 var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "rectangle" , options );
			 Sshape.rotate = shape.rotate;
			 Sshape.angle = shape.angle;
			 Sshape.sid=shape.sid;
			 if(!!shape.booking_options) {
					booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
					Sshape.booking_options = booking_options;
			 }
			 
			 canvas.addShape(Sshape);
		     canvas.valid = false;
		  } else if (shape.type == "round") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "round" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
				 if(!!shape.booking_options) {
						booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
						Sshape.booking_options = booking_options;
				 }
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  } else  if (shape.type == "circle") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "circle" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
				 if(!!shape.booking_options) {
						booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
						Sshape.booking_options = booking_options;
				 }
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  } else  if (shape.type == "trapex") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "trapex" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
				 if(!!shape.booking_options) {
						booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
						Sshape.booking_options = booking_options;
				 }
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }  else  if (shape.type == "text") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "text" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
				 if(!!shape.booking_options) {
						booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
						Sshape.booking_options = booking_options;
				 }
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }  else  if (shape.type == "line") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "line" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
				 if(!!shape.booking_options) {
						booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
						Sshape.booking_options = booking_options;
				 }
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }  else  if (shape.type == "image") {
			  var options = JSON.parse(JSON.stringify(shape.options));
			  var origImageID = "";
			  if(options.imgID.match(/^server_/)) {
				  origImageID = options.imgID;
			  } else {
			      origImageID = "server_"+options.imgID;
			  }
			  if (origImageID.match(/^user_img_/)) {    		  
	    		  // If user image - it get already created user_img_RAND img element
			  } else {
				 // if (document.getElementById(origImageID)==null) {
					  // If no such ID already exists , we'll create it and src to uploaded image by server					  
					  var mirrorID = origImageID;
					  options.imgID = mirrorID;
				 // } else {
					  // such image ID exists in a drawing tool
				 // }
			  }
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "image" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
				 if(!!shape.booking_options) {
						booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));	
						Sshape.booking_options = booking_options;
				 }
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }
	}
	canvas.bgmode=true;
	for (var ind in bgshapes) {
		var shape = bgshapes[ind];
		var booking_options;

		 if (shape.type == "rectangle") {
			 var options = JSON.parse(JSON.stringify(shape.options));
			 var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "rectangle" , options );
			 Sshape.rotate = shape.rotate;
			 Sshape.angle = shape.angle;
			 Sshape.sid=shape.sid;
			 
			 canvas.addShape(Sshape);
		     canvas.valid = false;
		  } else if (shape.type == "round") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "round" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
		      
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  } else  if (shape.type == "circle") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "circle" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;
		      
		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  } else  if (shape.type == "trapex") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "trapex" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;

		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }  else  if (shape.type == "text") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "text" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;

		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }  else  if (shape.type == "line") {
			  var options = JSON.parse(JSON.stringify(shape.options));
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "line" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;

		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }  else  if (shape.type == "image") {
			  var options = JSON.parse(JSON.stringify(shape.options));
			  var origImageID = "";
			  if(options.imgID.match(/^server_/)) {
				  origImageID = options.imgID;
			  } else {
			      origImageID = "server_"+options.imgID;
			  }

			  if (origImageID.match(/^user_img_/)) {    		  
	    		  // If user image - it get already created user_img_RAND img element
			  } else {
				 // if (document.getElementById(origImageID)==null) {
					  // If no such ID already exists , we'll create it and src to uploaded image by server					  
					  var mirrorID = "mirror_"+origImageID;
					  options.imgID = mirrorID;
				 // } else {
					  // such image ID exists in a drawing tool
				 // }
			  }
			  options.imgID = origImageID;
		      var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "image" , options );
		      Sshape.rotate = shape.rotate;
		      Sshape.angle = shape.angle;
		      Sshape.sid=shape.sid;

		      canvas.addShape(Sshape);
		      canvas.valid = false;
		  }
	}
	canvas.bgmode=false;
	canvas.valid = false;
	
}
function updateBackgroundImageByServer(stateid) {
	var canvasStateJSON = JSON.parse(document.getElementById(stateid).value);
	var floorID = stateid.replace(/^server_canvasState_/, "");
	var bg_image_id = "default_bg_image_mirror_"+floorID;
	if (document.getElementById(bg_image_id)==null) {
	     $("#bg_default_img_mirror").prepend('<img id="'+bg_image_id+'"/>');
	 }
	if (canvasStateJSON.state.backgroundType == "tiling" &&
			document.getElementById("server_background_"+floorID).value != "") {
		// Default background image
		//  imgSource = document.getElementById("server_background").src;
		  var image = new Image();
		  image.crossOrigin = 'anonymous';
		  image.src = document.getElementById("server_background_"+floorID).src; 
		  var actualWidth;
		  var actualHeight;
		  
		   image.onload = function() {
		      actualWidth = this.width;
			  actualHeight = this.height;			  
			  var mirror = document.getElementById(bg_image_id);
			  var c = document.getElementById("default_img_canvas");
			  c.width = actualWidth;
			  c.height = actualHeight;
			  mirror.width = actualWidth;
			  mirror.height = actualHeight;				 
			  var ctx = c.getContext("2d");
			//  var imgID =  document.getElementById("server_background");
		      ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
			  ctx.drawImage(image,0,0,actualWidth,actualHeight);
		      var dataURL = c.toDataURL('image/png');
			  mirror.src = dataURL;
			  floorid2canvas[floorID].valid = false;
		  };
	} else if ( (canvasStateJSON.state.backgroundType == "axis" ||
			     canvasStateJSON.state.backgroundType == "fill" ||
			     canvasStateJSON.state.backgroundType == "repeat" ||
			     canvasStateJSON.state.backgroundType == "asimage" ) &&
			     document.getElementById("server_background_"+floorID).value != "") {
		
		// User image
		 var bgidc = "chosed_background_orig_"+floorID;
         if (document.getElementById(bgidc)==null) {
		      $("#chosed_background_orig_wrap").prepend('<img id="'+bgidc+'"/>');
		 }
		  var image = new Image();
		  image.crossOrigin = 'anonymous';
		  image.src = document.getElementById("server_background_"+floorID).src ;
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
			  var c = document.getElementById("canvas_tmp_"+floorID);
			  c.width = actualWidth;
			  c.height = actualHeight;
			  var ctx = c.getContext("2d");
			  ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
		      ctx.drawImage(image,0,0,actualWidth,actualHeight);
			  var dataURL = c.toDataURL('image/png');
			 			
			 actualWidth = this.width;
			 actualHeight = this.height;
		     canvas_heightApplied = actualHeight;
			 canvas_widthApplied = actualWidth;

            document.getElementById("chosed_background_orig_"+floorID).src =   dataURL ;
            document.getElementById("chosed_background_orig_"+floorID).style.width = canvas_widthApplied + 'px';
            document.getElementById("chosed_background_orig_"+floorID).style.height = canvas_heightApplied + 'px';
            floorid2canvas[floorID].valid = false;
		  };	
		
	}	
}
function updateShapeImagesByServerData(imgID) {

  	      var actualWidth;
  	      var actualHeight;
  	      var images4load = {};
    	  var serverImageID = imgID;
    	  var ImageID = serverImageID.replace(/^server_/, "");
    	  
    	  if (ImageID.match(/^user_img_/)) {    		  
    		  // Image previously Uploaded by User
    		  var random_ = ImageID.replace(/^user_img_/,"");
    		  var pickImageID = 'user_img_'+random_
			  $('#user_uploaded_images').append('<img id="'+ pickImageID +'"/>');
    		  $('#user_uploaded_images').append('<canvas id="tmp_canvas_'+ pickImageID +'"></canvas>');
               images4load = new Image();
              images4load.crossOrigin = 'anonymous';
              images4load.src = document.getElementById(serverImageID).src ;
              
              images4load.onload = function() {
    		     actualWidth = this.width;
    			 actualHeight = this.height; 
    			 var c = document.getElementById("tmp_canvas_"+pickImageID);
				 c.width = actualWidth;
				 c.height = actualHeight;
				 var ctx = c.getContext("2d");
				 var mirror = document.getElementById(pickImageID);    
                 ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
				 ctx.drawImage(this,0,0,actualWidth , actualHeight);
			     mirror.width = actualWidth+"px";
				 mirror.height = actualHeight+"px";
				 var dataURL = c.toDataURL('image/png');
				 mirror.src = dataURL;
				 
				 var hist_width = 100;
				 var hist_height = parseInt(100 * actualHeight / actualWidth) ;

                 currentUploaded +=1;
                 for (var i = 0; i < floorCanvases.length ; i++ ) {
                	 floorCanvases[i].valid = false;
                 }
    		  };
  
    	  } else {
    		  var imgKey= ImageID; // Shouldnt use "mirror_" prefix in configuration stage
    		  if(imgKey in imgIDcreated) {
    		      // Do nothing
    			  for (var i = 0; i < floorCanvases.length ; i++ ) {
                 	 floorCanvases[i].valid = false;
                  }
    			} else {
    			  $('#canvas_shapes_images').append('<img id="'+ imgKey +'"/>');
	    		  $('#prev_used_images').append('<canvas id="tmp_canvas_'+ imgKey +'" width="60" height="60"></canvas>');	    		  

	    		  // Default image
	    		  images4load = new Image();
	    		  images4load.crossOrigin = 'anonymous';
	    		  images4load.src = document.getElementById(serverImageID).src ;
	    		  
	    		  images4load.onload = function() {
	    		     actualWidth = this.width;
	    			 actualHeight = this.height;    			 	    		  
	    			   imgIDcreated[imgKey]=1;
	    			  
	    			 //  alert(x+") imagKey="+imgKey+",ImageID="+ImageID)
	    			   var mirror = document.getElementById(imgKey);
	    			   var c = document.getElementById("tmp_canvas_"+imgKey);   					  
	    			   c.width = actualWidth;
	    			   c.height = actualHeight;
	    			   mirror.width = actualWidth;
	    			   mirror.height = actualHeight;				 
	    			   var ctx = c.getContext("2d");
	    				// constant image for pick
	    			   ctx.clearRect( 0 , 0 , actualWidth , actualHeight );
	    			   ctx.drawImage(this,0,0,actualWidth,actualHeight);
	    			   var dataURL = c.toDataURL('image/png');
	    			   mirror.src = dataURL;
	    			   
	    			    var hist_width = 100;
					   var hist_height = parseInt(100 * actualHeight / actualWidth) ;

	                   currentUploaded +=1;

	                  // zoomReset();
	    		       
	    		  }; 
    		  }
    	  }

}