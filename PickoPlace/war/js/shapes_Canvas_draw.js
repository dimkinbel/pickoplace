// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  "use strict";
  var ctx, shapes, l, i, shape, mySel;
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    ctx = this.ctx;
    shapes = this.shapes;
    this.clear();
    if(this.main) {
		// ** Add stuff you want drawn in the background all the time here **
		if (this.backgroundFill == null) {
			var fs = ctx.fillStyle ;
			var ss = ctx.strokeStyle;
			ctx.fillStyle = this.bg_color;
			ctx.strokeStyle = this.line_color;
			
			ctx.fillRect(0,0,this.width/this.zoom,this.height/this.zoom);
			//ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
			ctx.fillStyle = fs;    
			ctx.strokeStyle = ss;
		} else {
		  ctx.fillStyle = "white";
		  ctx.fillRect(0,0,this.width/this.zoom,this.height/this.zoom);
		  if(this.backgroundType == "tiling") {
			 var ss = ctx.strokeStyle;
			 ctx.strokeStyle = this.line_color;
			 var wcnt = Math.ceil(this.width/this.zoom/this.tilew);
			 var hcnt = Math.ceil(this.height/this.zoom/this.tileh);
	  
			 for (var i = 0 ; i < hcnt ; i++ ) {
				 for (var j = 0 ; j < wcnt ; j++ ) {
					  ctx.drawImage(this.backgroundImageID,0 + j*this.tilew,0 + i*this.tileh,this.tilew,this.tileh);
				}	 
			 }
			 //ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
			 ctx.strokeStyle = ss;
		  } else {
			// User Background
			 if (this.backgroundType == "fill") {
				 var ss = ctx.strokeStyle;
				 ctx.strokeStyle = this.line_color;
				 ctx.drawImage(this.backgroundImageID,0,0,this.width/this.zoom,this.height/this.zoom);	
				// ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
				 ctx.strokeStyle = ss;			 
			 } else if (this.backgroundType == "repeat") {
					 var ss = ctx.strokeStyle;
					 ctx.strokeStyle = this.line_color;
					 var wcnt = Math.ceil(this.width/this.zoom/this.tilew);
					 var hcnt = Math.ceil(this.height/this.zoom/this.tileh);
			  
					 for (var i = 0 ; i < hcnt ; i++ ) {
						 for (var j = 0 ; j < wcnt ; j++ ) {
							  ctx.drawImage(this.backgroundImageID,0 + j*this.tilew,0 + i*this.tileh,this.tilew,this.tileh);
						}	 
					 }
					// ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
					 ctx.strokeStyle = ss;		 
			 } else if (this.backgroundType == "asimage") {
				 var ss = ctx.strokeStyle;
				 ctx.strokeStyle = this.line_color;
				 ctx.drawImage(this.backgroundImageID,0,0,this.width/this.zoom,this.height/this.zoom);	
				// ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
				 ctx.strokeStyle = ss;				 
			 }	else if (this.backgroundType == "axis") {
				 var ss = ctx.strokeStyle;
				 ctx.strokeStyle = this.line_color;
				 ctx.drawImage(this.backgroundImageID,0,0,this.width/this.zoom,this.height/this.zoom);	
				// ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
				 ctx.strokeStyle = ss;	
			}		 
		  }
		}
	}

	//ctx.clearRect(0, 0, 200, 200);
   if(this.drawAll == true) {
      if(this.bgmode == true) {
	      l = shapes.length;
		  this.bgshapes = this.shapes;
		  this.bookingOpacity = 1;
		  for (i = 0; i < l; i += 1) {
				  shapes[i].draw(ctx);
		  }  
		  var floorid=this.floorid;
		  var mirrorid = "canavasBgImage_"+floorid;
		  $("#canvas_drawall_images").append('<img  id="canavasBgImage_'+floorid+'" >');
		  var mirror = document.getElementById(mirrorid);
		  var c = document.getElementById(canvas_.canvas.id);  
		  var dataURL = c.toDataURL('image/png');
		  mirror.src = dataURL;
		  mirror.width = this.width;
		  mirror.height = this.height;

			for (i = 0; i < this.bookshapes.length; i += 1) {
				  this.bookshapes[i].draw(ctx);
			}   		  
	  } else {
	        this.bookshapes = this.shapes;
			this.bookingOpacity = 1;
			for (i = 0; i < this.bgshapes.length; i += 1) {
				  this.bgshapes[i].draw(ctx);
			} 
			
			  var floorid=this.floorid;
			  var mirrorid = "canavasBgImage_"+floorid;
			  $("#canvas_drawall_images").append('<img  id="canavasBgImage_'+floorid+'" >');
			  var mirror = document.getElementById(mirrorid);
			  var c = document.getElementById(this.canvas.id);  
			  var dataURL = c.toDataURL('image/png');
			  mirror.src = dataURL;
			  mirror.width = this.width;
			  mirror.height = this.height;

			l = shapes.length;
			for (i = 0; i < l; i += 1) {
				  shapes[i].draw(ctx);
			} 
	  }
   } else {
	   if(this.bgmode == true) {
			l = shapes.length;
			
			var tempOpacity = this.bookingOpacity;
			this.bookingOpacity = 1;
			for (i = 0; i < l; i += 1) {
				  shapes[i].draw(ctx);
			}   
			this.bookingOpacity = tempOpacity;
			for (i = 0; i < this.bookshapes.length; i += 1) {
				  this.bookshapes[i].draw(ctx);
			}   
	   } else {
	        
			var tempOpacity = this.bookingOpacity;
			this.bookingOpacity = 1;
			for (i = 0; i < this.bgshapes.length; i += 1) {
				  this.bgshapes[i].draw(ctx);
			} 
			 l = shapes.length;
			this.bookingOpacity = tempOpacity;
			for (i = 0; i < l; i += 1) {
				  shapes[i].draw(ctx);
			}   		
	   }
   }
    // draw all shapes

    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
	if(this.main) {
	    if(this.DrawingLine != null) {

		     dbLine (ctx,this.DrawingLine.x1,
				  this.DrawingLine.y1,
				  this.DrawingLine.x2,
				  this.DrawingLine.y2,
				  currentFigurePicker.lineWidth,
				  currentFigurePicker.salpha,
				  currentFigurePicker.lineColor);
		}
		if(this.SelectonRect != null) {
		   var w = Math.abs(this.SelectonRect.x2 - this.SelectonRect.x1);
		   var h = Math.abs(this.SelectonRect.y2 - this.SelectonRect.y1);
		   var x = (this.SelectonRect.x2 + this.SelectonRect.x1)/2;
		   var y = (this.SelectonRect.y2 + this.SelectonRect.y1)/2;
		   dbDottedRect (ctx,x,y,w,h,"black","white",1,1);
		}
		if (this.selection !== null && this.selection.type!= "line" && this.listSelected.length == 1) {
		   ctx.save();
		  ctx.strokeStyle = "black";
		  ctx.lineWidth = 1;
		  mySel = this.selection;
		  var fillX = mySel.x - 0.5 * mySel.w;
		  var fillY = mySel.y - 0.5 * mySel.h;
		  
		  if (this.selection.angle != 0) {
			   
			   ctx.translate(this.selection.x , this.selection.y );
			   ctx.rotate(this.selection.angle * Math.PI / 180);
			   fillX =  - 0.5 * this.selection.w;
			   fillY = - 0.5 * this.selection.h;
		  }
		  ctx.globalAlpha = 0.6;
		  ctx.strokeRect(fillX,fillY,mySel.w,mySel.h);
		  ctx.strokeStyle = "white";
		  ctx.strokeRect(fillX+1,fillY+1,mySel.w-2,mySel.h-2);
		  ctx.globalAlpha = 1;
		   if (this.selection.angle != 0) {
			  
		   }
		   ctx.restore();
		} else if (this.listSelected.length > 0) {
		   for (var i = 0 ; i < this.listSelected.length ; i ++) {
				mySel = this.listSelected[i];
				
			  if(mySel.type != "line") {
				  var fillX = mySel.x ;
				  var fillY = mySel.y ;
			      ctx.save();
				  if (mySel.angle != 0) {				   
					   ctx.translate(mySel.x , mySel.y );
					   ctx.rotate(mySel.angle * Math.PI / 180);
					   fillX =  0;
					   fillY = 0;
					}	 
				   dbRoundRect(ctx,fillX,fillY,mySel.w+10,mySel.h+10,"#4d90fe","white",0,1,2,20);	
			       ctx.restore();		   
				
			   } else {		
			      var rectW = Math.sqrt( (mySel.options.x2-mySel.options.x1)*(mySel.options.x2-mySel.options.x1) 
									 + (mySel.options.y2-mySel.options.y1)*(mySel.options.y2-mySel.options.y1) );
				  var rectH = mySel.options.sw;
				  var fillX = mySel.x ;
				  var fillY = mySel.y ;
				  ctx.save();
				  if (mySel.angle != 0 ) {		
				  
					ctx.translate(mySel.x , mySel.y );
					ctx.rotate(mySel.angle * Math.PI / 180);
					fillX =  0;
					fillY = 0;
				  } 
				  dbRoundRect(ctx,fillX,fillY,rectW+10,rectH+10,"#4d90fe","white",0,1,2,20);
				  ctx.restore();
			   }
		   }
		} else {
		  //console.log("not_selected");
		  this.removeOutsideShapes();
		}
		// ** Add stuff you want drawn on top all the time here ** canavasBgImage_
    }
    this.valid = true;
    if (this.drawAll) {
	  this.bookingOpacity = 1;
	  var floorid=this.floorid;
	  var mirrorid = "canavasAllImage_"+floorid;
	  $("#canvas_drawall_images").append('<img  id="canavasAllImage_'+floorid+'" >');
  	  var mirror = document.getElementById(mirrorid);
	  var c = document.getElementById(this.canvas.id);  
	  var dataURL = c.toDataURL('image/png');
	  mirror.src = dataURL;
	  mirror.width = this.width;
	  mirror.height = this.height;				 
	  this.drawAll = false;
	  globalFloorCounter +=1;
	  createSaveObject();
    }
	if (this.createGroupImage) {
	   var random_ = randomString(10);
	   var bgmode;
	   var pickImageID = "";
	   if(this.bgmode) {
	      pickImageID = 'user_img_bg_'+random_;
		  bgmode = true;

	   } else {
	      pickImageID = 'user_img_'+random_;
		  bgmode = false;

	   }
	   
	   $('#user_uploaded_images').append('<img   id="'+ pickImageID +'"/>');
	   var mirror = document.getElementById(pickImageID); 
	   var c = document.getElementById("group_shapes_canvas");
	   var dataURL = c.toDataURL('image/png');
	   mirror.src = dataURL;
	   mirror.width = this.width;
	   mirror.height = this.height;
	   this.createGroupImage = false;
	   groupImageCreate(pickImageID,bgmode);
          
	}
  }
};
