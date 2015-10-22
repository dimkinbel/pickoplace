// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Code from the following pages merged by Andrew Clark (amclark7@gmail.com):
//   http://simonsarris.com/blog/510-making-html5-canvas-useful
//   http://simonsarris.com/blog/225-canvas-selecting-resizing-shape
// Last update June 2013
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
var rotate_Shape = new CustomEvent("rotateShape", {
   detail: {
       angle: 0
    }
});

function Shape(state, x, y, w, h,type,options,angle_) {
  "use strict";
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.state = state;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.rotate = 0;
  if (angle_== "undefined" || angle_ == null || angle_ == "") {
   this.angle = 0;
   } else {
   this.angle = angle_;
   }
  this.type = type;
  this.options = options;
  this.prevMX = null;
  this.prevMY = null;
  
  this.booking_options = {};
  this.booking_options.bookable = true;
  this.booking_options.marged = false;
  this.booking_options.mergelist = [];
  this.booking_options.givenName = null;
  this.booking_options.minPersons = 1;
  this.booking_options.maxPersons = 1;
  this.booking_options.description = null;
  this.booking_options.weekDays = {"sun":true,"mon":true,"tue":true,"wed":true,"thu":true,"fri":true,"sat":true};
  this.booking_options.timeRange = [{"from":"08:00","to":"18:00"}];
  
  if (type == "line" || type == "text") {
    this.booking_options.bookable = false;
  }
  if (type == "text") { 
   var c = document.getElementById("text_width_calculation_canvas");
   var ctx = c.getContext("2d");
   ctx.font = this.options.font_bold + " " + this.options.font_size + "pt " + this.options.font_style;
   var txt = this.options.text;
   this.w = parseInt(ctx.measureText(txt).width + 2);
  }
  
    this.sid = randomString(12);

}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx, optionalColor) {
  "use strict";
  var i, cur, half;
  ctx.fillStyle = this.fill;
  var fillX = this.x;
  var fillY = this.y;

  if (this.angle != 0  && this.type!="line") {
    ctx.save();
	ctx.translate(this.x , this.y );
	ctx.rotate(this.angle * Math.PI / 180);
	fillX =  0;
	fillY = 0
   }
  if (this.type == "rectangle" ) {
    dbDrawRect  (ctx,fillX,fillY,this.w,this.h,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha,
				  this.options.salpha,
				  this.options.sw);
  } else if (this.type == "line" ) {
  //dbText(ctx,x,y,text,font_bold,font_style,font_size,font_color,alpha,shadow,shadow_x,shadow_y,shadow_blur,shadow_color)
      dbLine (ctx,this.options.x1,
				  this.options.y1,
				  this.options.x2,
				  this.options.y2,
				  this.options.sw,
				  this.options.salpha,
				  this.options.lineColor);
  } else if (this.type == "text" ) {
    dbText(ctx,fillX,fillY,
	                 this.options.text,
	                 this.options.font_bold,
					 this.options.font_style ,
					 this.options.font_size,
					 this.options.font_color,
					 this.options.alpha,
					 this.options.shadow,
					 this.options.shadow_x,
					 this.options.shadow_y,
					 this.options.shadow_blur,
					 this.options.shadow_color);
  } else if (this.type == "round" ) {
    dbRoundRect (ctx,fillX,fillY,this.w,this.h,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha,
				  this.options.salpha,
				  this.options.sw,
				  this.options.roundRad);
  } else if (this.type == "circle" ) {
    dbCircle (ctx,fillX,fillY,this.w,this.h,
				  this.options.startA,
				  this.options.endA,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha,
				  this.options.salpha,
				  this.options.sw);
  } else if (this.type == "trapex" ) {
    dbTrapez (ctx,fillX,fillY,this.w,this.h,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha,
				  this.options.salpha,
				  this.options.sw,
				  this.options.cutX);
  } else if (this.type == "image" ) {
    dbImage (ctx,fillX,fillY,this.w,this.h,
	              this.options.imgID,
				  this.options.alpha);
  }
 if(false) {
  if (this.state.selection === this && this.type == "line") {
     ctx.strokeStyle = this.state.selectionColor;
     ctx.lineWidth = this.state.selectionWidth;
	  half = this.state.selectionBoxSize / 2;
	this.state.lineselectionHandles[0].x = this.options.x1;
    this.state.lineselectionHandles[0].y = this.options.y1;
    
    this.state.lineselectionHandles[1].x = this.options.x2;
    this.state.lineselectionHandles[1].y = this.options.y2;
	ctx.fillStyle = this.state.selectionBoxColor;
    for (i = 0; i < 2; i += 1) {
      cur = this.state.lineselectionHandles[i];
	     ctx.fillStyle = "white";
		 ctx.strokeStyle = "blue";
		 ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(cur.x, cur.y, 3, 0,  Math.PI*2 , true);
         ctx.fill();
         ctx.stroke();
    }
	ctx.fillStyle = this.state.selectionBoxColor;
  } else if (this.state.selection === this && this.type != "line") {
    ctx.strokeStyle = this.state.selectionColor;
    ctx.lineWidth = this.state.selectionWidth;
    //ctx.strokeRect(fillX-0.5*this.w,fillY-0.5*this.h,this.w,this.h);
    
    // draw the boxes
    half = this.state.selectionBoxSize / 2;
    
    // 0  1  2   8
    // 3     4
    // 5  6  7
    
    // top left, middle, right
    this.state.selectionHandles[0].x = fillX-0.5*this.w;
    this.state.selectionHandles[0].y = fillY-0.5*this.h;
    
    this.state.selectionHandles[1].x = fillX;
    this.state.selectionHandles[1].y = fillY-0.5*this.h;
    
    this.state.selectionHandles[2].x = fillX+0.5*this.w;
    this.state.selectionHandles[2].y = fillY-0.5*this.h;
    
    //middle left
    this.state.selectionHandles[3].x = fillX-0.5*this.w;
    this.state.selectionHandles[3].y = fillY;
    
    //middle right
    this.state.selectionHandles[4].x = fillX+0.5*this.w;
    this.state.selectionHandles[4].y = fillY;
    
    //bottom left, middle, right
	    
    this.state.selectionHandles[5].x = fillX-0.5*this.w;
    this.state.selectionHandles[5].y = fillY+0.5*this.h;
	
    this.state.selectionHandles[6].x = fillX;
    this.state.selectionHandles[6].y = fillY+0.5*this.h;
    
    this.state.selectionHandles[7].x = fillX+0.5*this.w;
    this.state.selectionHandles[7].y = fillY+0.5*this.h;

	// Rotate
    this.state.selectionHandles[8].x = fillX + 0.5*this.w + 10 ;
    this.state.selectionHandles[8].y = fillY - 0.5*this.h - 14;
 
    ctx.fillStyle = this.state.selectionBoxColor;
    for (i = 0; i < 9; i += 1) {
      cur = this.state.selectionHandles[i];
	  //if (i == 8) {
	     ctx.fillStyle = "white";
		 ctx.strokeStyle = "blue";
		 ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(cur.x, cur.y, 3, 0,  Math.PI*2 , true);
         ctx.fill();
         ctx.stroke();
	 // } else {
	    // ctx.arc(cur.x, cur.y, 3, 0,  Math.PI*2 , true);
         //ctx.fillRect(cur.x-3, cur.y-3, this.state.selectionBoxSize, this.state.selectionBoxSize);
	 // }
    }
	ctx.fillStyle = this.state.selectionBoxColor;
  }
   
    if (this.state.selection === this && this.angle != 0 && this.type != "line") {
	  
	  for (i = 0; i < 9; i += 1) {
           cur = this.state.selectionHandles[i];
           var oldAngle = getAngle(cur.x,cur.y);
		   var newAngle = oldAngle + toRadians(this.angle);
		   var radius = Math.sqrt(Math.pow(cur.x,2) + Math.pow(cur.y,2));
		   var newx = parseInt(radius * Math.cos( newAngle) + this.x ) ;
		   var newy = parseInt(radius * Math.sin( newAngle) + this.y );
		   cur.x = newx;
		   cur.y = newy;
	  }
      
	}
  }; // Enable edit
  ctx.restore();
};
function getAngle(x,y) {
  if( x != 0 ) {
   var angle = Math.atan(y/x);
	   if ( x <= 0 ) {
		  return  angle - toRadians(180);
	   } else {
		  return  angle;
	   }
   } else {
      if (y > 0)
	    return toRadians(90);
	  else 
		return toRadians(-90);
   }
}
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(ctx,mx, my) {
  "use strict";
  var mxt = mx;
  var myt = my;
  var topCornerX = this.x - 0.5 * this.w;
  var topCornerY = this.y -  0.5 * this.h;
  var centerX = this.x;
  var centerY = this.y;
  
  	  if (this.angle != 0) {
		   topCornerX = - 0.5 * this.w;
		   topCornerY = - 0.5 * this.h;
		   var movedX = mx - centerX;
		   var movedY = my - centerY;
		   var radius = Math.sqrt(Math.pow(movedX,2) + Math.pow(movedY,2));
		   var initAngle = Math.atan(movedY/movedX);
		   mxt = radius * Math.cos(initAngle - toRadians(this.angle));
		   myt = radius * Math.sin(initAngle - toRadians(this.angle));
      }
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Height) and its Y and (Y + Height)
  var isInside =   (topCornerX <= mxt) && (topCornerX + this.w >= mxt) &&
                   (topCornerY <= myt) && (topCornerY + this.h >= myt);
 
  return isInside
};
Shape.prototype.getCorners = function () {
  var list = [];
  var returnlist = [];
    var xy1 = {};
  xy1.x =  - 0.5*this.w;
  xy1.y =  - 0.5*this.h;
  list.push(xy1);
    var xy2 = {};
  xy2.x =    0.5*this.w;
  xy2.y =  - 0.5*this.h;
  list.push(xy2);
    var xy3 = {};
  xy3.x =  0.5*this.w;
  xy3.y =  0.5*this.h;
  list.push(xy3);
     var xy4 = {};
  xy4.x =  - 0.5*this.w;
  xy4.y =   0.5*this.h;
  list.push(xy4);
  
  if (this.angle != 0) {
	  for (var i = 0; i < 4 ; i ++ ) {
	    
		 var x = list[i].x;
		 var y = list[i].y;
		  // console.log("OLD:"+x+","+y);
		   var radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
		   var initAngle = getAngle(x,y);
		 //  console.log(toDegrees(initAngle));
		   x = radius * Math.cos(initAngle - toRadians(this.angle));
		   y = radius * Math.sin(initAngle - toRadians(this.angle));
		 //  console.log("NEW:"+x+","+y);
		   var newx = this.x + x;
		   var newy = this.y + y;
		   returnlist[i*2] = newx;
		   returnlist[i*2+1] = newy;
	  }
  } else {
     for (var i = 0; i < 4 ; i ++ ) {
		 var x = list[i].x;
		 var y = list[i].y;
		   var newx = this.x + x;
		   var newy = this.y + y;
		   returnlist[i*2] = newx;
		   returnlist[i*2+1] = newy;
	  }
  }
  return returnlist;
}
function CanvasState(canvas) {
  "use strict";
  // **** First some setup! ****
  
  this.floorid = "floorid_"+randomString(10);
  this.mainfloor = false;
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.origWidth = canvas.width;
  this.origHeight = canvas.height;
  this.zoom = 1.0;
  this.bg_color = "#FFFFFF";
  this.line_color = "#000000";
  this.backgroundFill = null;
  this.pasteReady = null; // Paste shape
  this.backgroundType  = "color";
  this.backgroundImageID = null;
  this.backgroundActualId = null;
  this.tilew = 1;
  this.tileh = 1;
  this.drawAll = false;
  this.createGroupImage = false;
  this.main = false;
  this.floor_name="";

  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop,
      html, myState, i;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingLeft, 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingTop, 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null).borderLeftWidth, 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null).borderTopWidth, 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****
  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.canvasDrag = false; 
  this.shapes = [];  // the collection of things to be drawn
  this.bgshapes = [];
  this.bgmode = false;
  this.dragging = false; // Keep track of when we are dragging
  this.resizeDragging = false; // Keep track of resize
  this.expectResize = -1; // save the # of the selection handle 
  this.lexpectResize = -1; // save the # of the selection handle 
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.listSelected = [];
  this.pasteMultiple_ = false;
  this.pasteList = [];
  this.mousemoveclicked = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  this.rotateDragging = false;
  this.rotateAngle = 0;
  this.shapeHover = null;
  // New, holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0  1  2
  // 3     4
  // 5  6  7
  this.selectionHandles = [];
  this.lineselectionHandles = [];
  for (i = 0; i < 9; i += 1) {
    this.selectionHandles.push(new Shape(this));
  }
  for (i = 0; i < 2; i += 1) {
    this.lineselectionHandles.push(new Shape(this));
  }
  
  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging

  canvas.addEventListener('mousedown', function(e) {
   
    var mouse, mx, my, shapes, l, i, mySel;
	
    if (myState.expectResize !== -1 || myState.lexpectResize !== -1) {
      myState.resizeDragging = true;
      return;
    }
    mouse = myState.getMouse(e);
    mx = mouse.x;
    my = mouse.y;
	var mox = mouse.orgx;
	var moy = mouse.orgy;
	myState.pastex = mx;
	myState.pastey = my;
    shapes = myState.shapes;
    l = shapes.length;
    for (i = l-1; i >= 0; i -= 1) {
      if (shapes[i].contains(myState.ctx ,mx, my)) {
	   if(e.which == 3) //1: left, 2: middle, 3: right
        {
            return;
        }
        mySel = shapes[i];
		
		var regular_behavior = false;
		myState.mousemoveclicked = null;

		  if( myState.selection == null && myState.listSelected.length == 0) {
		    regular_behavior = true;
		  } else {
		    if( myState.listSelected.length == 1) {
			  if(myState.listSelected[0] == mySel) {
			    myState.selection = null;
			    myState.listSelected = [];
				
				myState.mousemoveclicked = mySel;
			  } else {
			    myState.selection = null;
			    myState.listSelected.push(mySel);
                addShapeConfigSelected(mySel);				
			  }
			} else {
			  	if(myState.listSelected.contains(mySel)) {
				  // remove from selected List
				  myState.listSelected.remove(mySel);
				  removeShapeConfigSelected(mySel);
				  if (myState.listSelected.length == 1) {
				     myState.selection = myState.listSelected[0];
				  }
				  //myState.mousemoveclicked = mySel; // For further moving
				} else {
				  // Add to the selected list
				  myState.listSelected.push(mySel);	
                  addShapeConfigSelected(mySel)				  
				}
			}	
			
			if (myState.selection!=null ) {
			  myState.dragoffx = mx - myState.selection.x;
			  myState.dragoffy = my - myState.selection.y;
			 
			  myState.dragging = true;
			  }
			if (myState.mousemoveclicked!=null) {
				  myState.dragoffx = mx - myState.mousemoveclicked.x;
				  myState.dragoffy = my - myState.mousemoveclicked.y;
				 
				  myState.dragging = true;
			}			
		      myState.valid = false;             			
		  }
		  

		if (regular_behavior) {
			myState.listSelected = [];
			myState.listSelected.push(mySel);
			addShapeConfigSelected(mySel)
			var prevSelection = myState.selection;
			
			// Keep track of where in the object we clicked
			// so we can move it smoothly (see mousemove)
			myState.dragoffx = mx - mySel.x;
			myState.dragoffy = my - mySel.y;
			myState.dragging = true;
			myState.selection = mySel;
			myState.valid = false;
		}
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    myState.mousemoveclicked = null;
    if (myState.selection) {

	  myState.canvasDrag  = true;
	 
	  myState.prevCmx = mox ;
      myState.prevCmy = moy ;
      myState.valid = false; // Need to clear the old selection border
    } else {
	  myState.canvasDrag  = true;
	  
	  myState.prevCmx = mox ;
      myState.prevCmy = moy ;	
	}
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    var mouse = myState.getMouse(e),
        mx = mouse.x,
        my = mouse.y,
		mox = mouse.orgx,
		moy = mouse.orgy,
		orgx = mouse.orgx , orgy = mouse.orgy ,
        oldx, oldy, oldw, oldh ,i, cur;

	if (myState.canvasDrag) {
       
	    var leftDrag = mox - myState.prevCmx;
		var topDrag = moy - myState.prevCmy;
		
		
       if (myState.main) {
		 document.getElementById("canvas_wrap_not_scroll_conf").scrollTop -= topDrag;
		 document.getElementById("canvas_wrap_not_scroll_conf").scrollLeft -= leftDrag;
	   }
		 myState.prevCmx = mox ;
         myState.prevCmy = moy ;	
		 myState.valid = false;
	}
    if (myState.dragging){
  	  if (myState.mousemoveclicked != null &&  myState.selection == null) {
 	     myState.listSelected.push(myState.mousemoveclicked);	
 		 myState.selection = myState.mousemoveclicked;
 		// myState.mousemoveclicked = null;
 		// addShapeConfigSelected(myState.selection);
 	  } 
	  mouse = myState.getMouse(e);
	  var difx = mouse.x - myState.dragoffx - myState.selection.x;
	  var dify = mouse.y - myState.dragoffy - myState.selection.y;
		  if (myState.selection.type == "line") {
			 
			  myState.selection.x = mouse.x - myState.dragoffx;
			  myState.selection.y = mouse.y - myState.dragoffy;  
			  myState.selection.options.x1 +=  difx;
			  myState.selection.options.x2 +=  difx;
			  myState.selection.options.y1 +=  dify;
			  myState.selection.options.y2 +=  dify;
			  myState.valid = false; // Something's dragging so we must redraw
		  } else {
			  
			  // We don't want to drag the object by its top-left corner, we want to drag it
			  // from where we clicked. Thats why we saved the offset and use it here
			  myState.selection.x = mouse.x - myState.dragoffx;
			  myState.selection.y = mouse.y - myState.dragoffy;   
			  myState.valid = false; // Something's dragging so we must redraw
		  }

	 if (myState.listSelected.length > 1) {
	     for (var i = 0; i < myState.listSelected.length ; i++) {
		    var shape = myState.listSelected[i];
			if (shape != myState.selection) {
			   	 if (shape.type == "line") {
					  shape.x +=  difx;
					  shape.y +=  dify;  
					  shape.options.x1 +=  difx;
					  shape.options.x2 +=  difx;
					  shape.options.y1 +=  dify;
					  shape.options.y2 +=  dify;
					  myState.valid = false; // Something's dragging so we must redraw
				  } else {
					  
					  // We don't want to drag the object by its top-left corner, we want to drag it
					  // from where we clicked. Thats why we saved the offset and use it here
					  shape.x +=  difx;
					  shape.y +=  dify;   
					  myState.valid = false; // Something's dragging so we must redraw
				  }			
			}
		 }
	  }
    } else if (myState.resizeDragging) {
      // time ro resize!
      if (myState.selection.type == "line") {
	        		  var prevX;
		  var prevY;
		  var prevAngle;
		  
		  if ( myState.selection.startX == null) {
			  myState.selection.startX = myState.selection.x;
			  myState.selection.startY = myState.selection.y;
		  }
		  var omx = mx;
		  var omy = my;
		  var movedX = mx - myState.selection.startX;
		  var movedY = my - myState.selection.startY;
		  var radius = Math.sqrt(Math.pow(movedX,2) + Math.pow(movedY,2));
		  var initAngle =  toRadians(myState.selection.angle);
		  var mouseAngle = getAngle(movedX,movedY);
		  mx = parseInt(radius * Math.cos(  mouseAngle - initAngle));
		  my = parseInt(radius * Math.sin(  mouseAngle - initAngle));  	  
		  
		  if ( myState.selection.prevMX == null) {
			myState.selection.prevMX = mx;
			myState.selection.prevMY = my;
			myState.selection.prevAngle = mouseAngle;
		  } 
			prevX = myState.selection.prevMX;
			prevY = myState.selection.prevMY;
			prevAngle = myState.selection.prevAngle;
		  
		  var difX = mx - prevX;
		  var difY = my - prevY;
		  var difAngle = toDegrees(mouseAngle) - toDegrees(prevAngle);
		  
	    	switch (myState.lexpectResize) {
			case 0:
			  myState.selection.options.x1 += difX;
			  myState.selection.options.y1 += difY;
			  myState.selection.x += 0.5* difX;
			  myState.selection.y += 0.5* difY;
			  myState.selection.w = Math.abs(myState.selection.options.x1 - myState.selection.options.x2);
			  myState.selection.h = Math.abs(myState.selection.options.y1 - myState.selection.options.y2);
			  break;
			case 1:
			  myState.selection.options.x2 += difX;
			  myState.selection.options.y2 += difY;
			  myState.selection.x += 0.5 * difX ;
			  myState.selection.y += 0.5 * difY ;
			  myState.selection.w = Math.abs(myState.selection.options.x1 - myState.selection.options.x2);
			  myState.selection.h = Math.abs(myState.selection.options.y1 - myState.selection.options.y2);
			  break;
			}
			
			myState.selection.prevMX = mx;
			myState.selection.prevMY = my;
			myState.selection.prevAngle = mouseAngle;
			myState.valid = false; // Something's dragging so we must redraw
	  } else {
		  var prevX;
		  var prevY;
		  var prevAngle;
		  
		  if ( myState.selection.startX == null) {
			  myState.selection.startX = myState.selection.x;
			  myState.selection.startY = myState.selection.y;
		  }
		  var omx = mx;
		  var omy = my;
		  var movedX = mx - myState.selection.startX;
		  var movedY = my - myState.selection.startY;
		  var radius = Math.sqrt(Math.pow(movedX,2) + Math.pow(movedY,2));
		  var initAngle =  toRadians(myState.selection.angle);
		  var mouseAngle = getAngle(movedX,movedY);
		  mx = parseInt(radius * Math.cos(  mouseAngle - initAngle));
		  my = parseInt(radius * Math.sin(  mouseAngle - initAngle));  	  
		  
		  if ( myState.selection.prevMX == null) {
			myState.selection.prevMX = mx;
			myState.selection.prevMY = my;
			myState.selection.prevAngle = mouseAngle;
		  } 
			prevX = myState.selection.prevMX;
			prevY = myState.selection.prevMY;
			prevAngle = myState.selection.prevAngle;
		  
		  var difX = mx - prevX;
		  var difY = my - prevY;
		  var difAngle = toDegrees(mouseAngle) - toDegrees(prevAngle);
		  

		  // 0  1  2
		  // 3     4
		  // 5  6  7

		  switch (myState.expectResize) {
			case 0:
			  myState.selection.w -= difX;
			  myState.selection.h -= difY;
			  myState.selection.x += 0.5 * difX* Math.cos(toRadians(myState.selection.angle)) - 0.5 * difY * Math.sin(toRadians(myState.selection.angle));
			  myState.selection.y += 0.5 * difY* Math.cos(toRadians(myState.selection.angle)) + 0.5 * difX * Math.sin(toRadians(myState.selection.angle));
			  
			  break;
			case 1:
			  myState.selection.h -= difY;
			  myState.selection.y += 0.5 * difY * Math.cos(toRadians(myState.selection.angle));
			  myState.selection.x -= 0.5 * difY * Math.sin(toRadians(myState.selection.angle));
			  
			  break;
			case 2:
			  myState.selection.w += difX;
			  myState.selection.h -= difY;
			  myState.selection.x += 0.5 * difX * Math.cos(toRadians(myState.selection.angle)) - 0.5 * difY * Math.sin(toRadians(myState.selection.angle));
			  myState.selection.y += 0.5 * difY * Math.cos(toRadians(myState.selection.angle)) + 0.5 * difX * Math.sin(toRadians(myState.selection.angle));         
			  break;
			case 3:
			  myState.selection.w -= difX;
			  myState.selection.x += 0.5 * difX * Math.cos(toRadians(myState.selection.angle));
			  myState.selection.y += 0.5 * difX * Math.sin(toRadians(myState.selection.angle));
			  break;
			case 4:
			   myState.selection.w += difX;
			   myState.selection.x += 0.5 * difX * Math.cos(toRadians(myState.selection.angle));
			   myState.selection.y += 0.5 * difX * Math.sin(toRadians(myState.selection.angle));
			  break;
			case 5:
			  myState.selection.w -= difX;
			  myState.selection.h += difY;
			  myState.selection.x += 0.5 * difX  * Math.cos(toRadians(myState.selection.angle)) - 0.5 * difY * Math.sin(toRadians(myState.selection.angle));
			  myState.selection.y += 0.5 * difY * Math.cos(toRadians(myState.selection.angle)) + 0.5 * difX * Math.sin(toRadians(myState.selection.angle));

			  break;
			case 6:
			  myState.selection.h += difY;
			  myState.selection.y += 0.5 * difY * Math.cos(toRadians(myState.selection.angle));
			  myState.selection.x -= 0.5 * difY * Math.sin(toRadians(myState.selection.angle));
			  break;
			case 7:
			  myState.selection.w += difX;
			  myState.selection.h += difY;
			  myState.selection.x += 0.5 * difX * Math.cos(toRadians(myState.selection.angle)) - 0.5 * difY * Math.sin(toRadians(myState.selection.angle));
			  myState.selection.y += 0.5 * difY * Math.cos(toRadians(myState.selection.angle)) + 0.5 * difX * Math.sin(toRadians(myState.selection.angle));
			  break;
			case 8:
			  myState.selection.angle += difAngle;
			  if (myState.selection.angle >360) {
				myState.selection.angle-=360;
			  } else if (myState.selection.angle < 0) {
				myState.selection.angle+=360;
			  } 
			//  $('#rotate_slider').slider('setValue', myState.selection.angle)
			  break;
		  }
			myState.selection.prevMX = mx;
			myState.selection.prevMY = my;
			myState.selection.prevAngle = mouseAngle;
			myState.valid = false; // Something's dragging so we must redraw
		}
    }
    // if there's a selection see if we grabbed one of the selection handles
	if (myState.selection !== null && !myState.resizeDragging && myState.selection.type == "line") {
	  for (i = 0; i < 2; i += 1) {
	    cur = myState.lineselectionHandles[i];
		var curX = cur.x;
		var curY = cur.y;
		var mxt = mx;
		var myt = my;
        var centerX = curX ;
        var centerY = curY ;
		var topCornerX = curX - 3;
		var topCornerY = curY - 3;
	    // we dont need to use the ghost context because
        // selection handles will always be rectangles
        if (mxt >= topCornerX && mxt <= topCornerX + myState.selectionBoxSize &&
            myt >= topCornerY && myt <= topCornerY + myState.selectionBoxSize) {
          // we found one!
          myState.lexpectResize = i;
          myState.valid = false;
		  this.style.cursor='pointer';
		  return;
		  }
	  }
	        // not over a selection box, return to normal
      myState.resizeDragging = false;
      myState.lexpectResize = -1;
      this.style.cursor = 'auto';
	}
    if (myState.selection !== null && !myState.resizeDragging && myState.selection.type != "line") {

      for (i = 0; i < 9; i += 1) {
        // 0  1  2
        // 3     4
        // 5  6  7
        
        cur = myState.selectionHandles[i];
		var curX = cur.x;
		var curY = cur.y;
		var mxt = mx;
		var myt = my;
        var centerX = curX ;
        var centerY = curY ;
		var topCornerX = curX - 3;
		var topCornerY = curY - 3;
  

        // we dont need to use the ghost context because
        // selection handles will always be rectangles
        if (mxt >= topCornerX && mxt <= topCornerX + myState.selectionBoxSize &&
            myt >= topCornerY && myt <= topCornerY + myState.selectionBoxSize) {
          // we found one!
          myState.expectResize = i;
          myState.valid = false;
			  var nw_resize = 'nw-resize'; //  
			  var n_resize  = 'n-resize '; //  |
			  var ne_resize = 'ne-resize'; //  /
			  var w_resize  = 'w-resize '; //  ->
			  var e_resize  = 'e-resize '; //  <-
			  var sw_resize = 'sw-resize'; //  /
			  var s_resize  = 's-resize '; //  |
			  var se_resize = 'se-resize'; //  
                 if (337.5 <= myState.selection.angle && myState.selection.angle < 22.5 ) {
  		  
		  } else if (22.5 <= myState.selection.angle && myState.selection.angle < 67.5 ) {
			  var nw_resize = 'n-resize'; //  
			  var n_resize  = 'ne-resize '; //  |
			  var ne_resize = 'w-resize'; //  /
			  var e_resize  = 'se-resize '; //  <-
			  var se_resize = 's-resize'; //	
			  var s_resize  = 'ne-resize '; //  |
			  var sw_resize = 'w-resize'; //  /
			  var w_resize  = 'nw-resize '; //  ->			  	  
		  } else if (67.5 <= myState.selection.angle && myState.selection.angle < 112.5 ) {
			  var nw_resize = 'ne-resize '; //  
			  var n_resize  = 'w-resize  '; //  |
			  var ne_resize = 'se-resize '; //  /
			  var e_resize  = 's-resize  '; //  <-
			  var se_resize = 'ne-resize '; //	
			  var s_resize  = 'w-resize  '; //  |
			  var sw_resize = 'nw-resize '; //  /
			  var w_resize  = 'n-resize '; //  ->		
		  
		  } else if (112.5 <= myState.selection.angle && myState.selection.angle < 157.5 ) {
			  var nw_resize = 'w-resize  '; //  
			  var n_resize  = 'se-resize '; //  |
			  var ne_resize = 's-resize  '; //  /
			  var e_resize  = 'ne-resize '; //  <-
			  var se_resize = 'w-resize  '; //	
			  var s_resize  = 'nw-resize '; //  |
			  var sw_resize = 'n-resize  '; //  /
			  var w_resize  = 'ne-resize '; //  ->			  
		  } else if (157.5 <= myState.selection.angle && myState.selection.angle < 202.5 ) {
			  var nw_resize = 'se-resize '; //  
			  var n_resize  = 's-resize  '; //  |
			  var ne_resize = 'ne-resize '; //  /
			  var e_resize  = 'w-resize  '; //  <-
			  var se_resize = 'nw-resize '; //	
			  var s_resize  = 'n-resize  '; //  |
			  var sw_resize = 'ne-resize '; //  /
			  var w_resize  = 'w-resize '; //  ->			  
		  } else if (202.5 <= myState.selection.angle && myState.selection.angle < 247.5 ) {
			  var nw_resize = 's-resize  '; //  
			  var n_resize  = 'ne-resize '; //  |
			  var ne_resize = 'w-resize  '; //  /
			  var e_resize  = 'nw-resize '; //  <-
			  var se_resize = 'n-resize  '; //	
			  var s_resize  = 'ne-resize '; //  |
			  var sw_resize = 'w-resize  '; //  /
			  var w_resize  = 'se-resize '; //  ->			  
		  } else if (247.5 <= myState.selection.angle && myState.selection.angle < 292.5 ) {
			  var nw_resize = 'ne-resize '; //  
			  var n_resize  = 'w-resize  '; //  |
			  var ne_resize = 'nw-resize '; //  /
			  var e_resize  = 'n-resize  '; //  <-
			  var se_resize = 'ne-resize '; //	
			  var s_resize  = 'w-resize  '; //  |
			  var sw_resize = 'se-resize '; //  /
			  var w_resize  = 's-resize '; //  ->		  
		  } else if (292.5 <= myState.selection.angle && myState.selection.angle < 337.5 ) {
			  var nw_resize = 'w-resize  '; //  
			  var n_resize  = 'nw-resize '; //  |
			  var ne_resize = 'n-resize  '; //  /
			  var e_resize  = 'ne-resize '; //  <-
			  var se_resize = 'w-resize  '; //	
			  var s_resize  = 'se-resize '; //  |
			  var sw_resize = 's-resize  '; //  /
			  var w_resize  = 'ne-resize '; //  ->			  
		  } 
          switch (i) {
            case 0:
              this.style.cursor= nw_resize;
              break;
            case 1:
              this.style.cursor= n_resize;
              break;
            case 2:
              this.style.cursor= ne_resize ;
              break;
            case 3:
              this.style.cursor= w_resize ;
              break;
            case 4:
              this.style.cursor= e_resize ;
              break;
            case 5:
              this.style.cursor= sw_resize ;
              break;
            case 6:
              this.style.cursor= s_resize ;
              break;
            case 7:
              this.style.cursor= se_resize ;
              break;
			case 8:
              this.style.cursor='pointer';
              break;
          }
          return;
        }
        
      }
      // not over a selection box, return to normal
      myState.resizeDragging = false;
      myState.expectResize = -1;
      this.style.cursor = 'auto';
    }
	 var contains = false;	 
	 var prevHover = myState.shapeHover;
     for (i = 0; i <  myState.shapes.length ; i ++) {
    	 if(myState.shapes[i].type!="text" && myState.shapes[i].type!="line" && myState.shapes[i].booking_options.bookable == true) {
    		 // Line And Text not bookable
			  if (myState.shapes[i].contains(myState.ctx ,mx, my)) {
			    this.style.cursor='pointer';
				myState.shapeHover = myState.shapes[i];
				contains = true;
			  }
    	 }
    }

	if (!contains) {
	   this.style.cursor='auto';
	   myState.shapeHover = null;
	} 
	if(myState.shapeHover!=prevHover) {
	    myState.valid = false;
	}
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
    myState.resizeDragging = false;
    myState.expectResize = -1;
	myState.lexpectResize = -1;
	if (myState.mousemoveclicked != null &&  myState.selection == null) {
		// Wasnt mousemoveclick dragged
		removeShapeConfigSelected(myState.mousemoveclicked);
		myState.mousemoveclicked = null;
	}
    if (myState.selection !== null) {
      if (myState.selection.w < 0) {
          myState.selection.w = -myState.selection.w;
          myState.selection.x -= myState.selection.w;
      }
      if (myState.selection.h < 0) {
          myState.selection.h = -myState.selection.h;
          myState.selection.y -= myState.selection.h;
      }
	    myState.selection.prevMX = null;
        myState.selection.prevMY = null;
		myState.selection.startX = null;
		myState.selection.startY = null;
		myState.selection.prevAngle = null;


    }
	if (myState.canvasDrag) {
	   myState.canvasDrag = false;
	}
  }, true);

  
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.selectionBoxSize = 6;
  this.selectionBoxColor = 'darkred';
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.rotateSelection = function(val) {
 if (this.selection != null) {
   this.valid = false;
    this.selection.angle = val;
	}
}

CanvasState.prototype.addShape = function(shape) {
  "use strict";
  if(this.bgmode == true) {
	   shape.bookableShape=false;
	   this.bgshapes.push(shape);
 } else {
     this.shapes.push(shape);
 }
  this.valid = false;
};


CanvasState.prototype.clear = function() {
  "use strict";
  this.ctx.clearRect(0, 0, this.width/this.zoom, this.height/this.zoom);
};
function sizeDown() {
  var newWidth = canvas_.width * 0.9;
  var newHeight  = canvas_.height * 0.9;
  canvas_.width = newWidth;
  canvas_.height = newHeight;
  canvas_.zoom *= 0.9;
  document.getElementById(canvas_.canvas.id).width *= 0.9;
  document.getElementById(canvas_.canvas.id).height *= 0.9;
  canvas_.ctx.scale(canvas_.zoom,canvas_.zoom);
  
  canvas_.valid = false;
   $('#canvas_wrap_not_scroll_conf').perfectScrollbar();
 $('#canvas_wrap_not_scroll_conf').perfectScrollbar('update');
}
function sizeUp() {
  canvas_.valid = false;

  canvas_.zoom *= 1/0.9;
  var newWidth = canvas_.width / 0.9;
  var newHeight  = canvas_.height / 0.9;
  canvas_.width = newWidth;
  canvas_.height = newHeight;
  document.getElementById(canvas_.canvas.id).width *= 1/0.9;
  document.getElementById(canvas_.canvas.id).height *= 1/0.9;
  canvas_.ctx.scale(canvas_.zoom,canvas_.zoom);
  if (canvas_.main) {
     $('#canvas_wrap_not_scroll_conf').perfectScrollbar();
     $('#canvas_wrap_not_scroll_conf').perfectScrollbar('update');
 }
}
function zoomReset(state_) {
  var state;
  if(state_==null || state_==undefined) {
	  state = canvas_;
  } else {
	  state = state_;
  }
  state.valid = false;
  var totalZoom = state.zoom;
  var resetZoom = 1 / totalZoom;
  state.ctx.scale(resetZoom,resetZoom);
  document.getElementById(state.canvas.id).width = state.width * resetZoom;
  document.getElementById(state.canvas.id).height = state.height * resetZoom;
  state.zoom =1 ;
  var newWidth = state.width * resetZoom;
  var newHeight  = state.height * resetZoom;
  state.width = newWidth;
  state.height = newHeight;
  if (state.main) {
     $('#canvas_wrap_not_scroll_conf').perfectScrollbar();
     $('#canvas_wrap_not_scroll_conf').perfectScrollbar('update');
 }
}
function zoomResetWrap(state_,w,h) {
  var ww = w;
  var wh = h;
  
  var state;
  if(state_==null || state_==undefined) {
	  state = canvas_;
  } else {
	  state = state_;
  }
  var required_zoom;
  var required_zoom_w = ww/state.origWidth ;// constant zoom width
  var required_zoom_h = wh/state.origHeight;// constant zoom height
  if (required_zoom_w < required_zoom_h ) {
     required_zoom = required_zoom_w;
  } else {
     required_zoom = required_zoom_h;
  }
  var totalZoom = state.zoom; // current zoom
  var resetZoom = required_zoom / totalZoom; // relative zoom
  
  document.getElementById(state.canvas.id).width = state.origWidth * required_zoom;
  document.getElementById(state.canvas.id).height = state.origHeight * required_zoom;
  state.ctx.scale(required_zoom,required_zoom);
  state.zoom = required_zoom ;
  var newWidth = state.origWidth * required_zoom;
  var newHeight = state.origHeight * required_zoom;
  state.width = newWidth;
  state.height = newHeight;
  
     $('#canvas_wrap_not_scroll_conf').perfectScrollbar();
     $('#canvas_wrap_not_scroll_conf').perfectScrollbar('update');

 state.valid = false;
}
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
			 ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
			 ctx.strokeStyle = ss;
		  } else {
			// User Background
			 if (this.backgroundType == "fill") {
				 var ss = ctx.strokeStyle;
				 ctx.strokeStyle = this.line_color;
				 ctx.drawImage(this.backgroundImageID,0,0,this.width/this.zoom,this.height/this.zoom);	
				 ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
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
					 ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
					 ctx.strokeStyle = ss;		 
			 } else if (this.backgroundType == "asimage") {
				 var ss = ctx.strokeStyle;
				 ctx.strokeStyle = this.line_color;
				 ctx.drawImage(this.backgroundImageID,0,0,this.width/this.zoom,this.height/this.zoom);	
				 ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
				 ctx.strokeStyle = ss;				 
			 }	else if (this.backgroundType == "axis") {
				 var ss = ctx.strokeStyle;
				 ctx.strokeStyle = this.line_color;
				 ctx.drawImage(this.backgroundImageID,0,0,this.width/this.zoom,this.height/this.zoom);	
				 ctx.strokeRect(0,0,this.width/this.zoom,this.height/this.zoom);
				 ctx.strokeStyle = ss;	
			}		 
		  }
		}
	}
    // draw all shapes
    l = shapes.length;
    for (i = 0; i < this.bgshapes.length; i += 1) {
		  this.bgshapes[i].draw(ctx);
	} 
	 l = shapes.length;
	for (i = 0; i < l; i += 1) {
		  shapes[i].draw(ctx);
	}     
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
	if(this.main) {
		if (this.selection !== null && this.selection.type!= "line") {
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
			   fillY = - 0.5 * this.selection.h
		  }
		  ctx.globalAlpha = 0.6;
		  ctx.strokeRect(fillX,fillY,mySel.w,mySel.h);
		  ctx.strokeStyle = "white";
		  ctx.strokeRect(fillX+1,fillY+1,mySel.w-2,mySel.h-2);
		  ctx.globalAlpha = 1;
		   if (this.selection.angle != 0) {
			  
		   }
		   ctx.restore();
		}
		// draw multiple selection
		if(this.listSelected.length > 1) {
		   for (var i = 0 ; i < this.listSelected.length ; i ++) {
				mySel = this.listSelected[i];
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

			   if (mySel.angle != 0) {
				
			   }	
			   ctx.restore();		   
		   }
		}
		// ** Add stuff you want drawn on top all the time here **
		//Draw hover
		if(this.shapeHover!=null) {
			  mySel = this.shapeHover;
			  var fillX = mySel.x ;
			  var fillY = mySel.y ;
			  ctx.save();
			  if (mySel.angle != 0) {
				   
				   ctx.translate(mySel.x , mySel.y );
				   ctx.rotate(mySel.angle * Math.PI / 180);
				   fillX =  0;
				   fillY = 0;
				}	 

                  dbRoundRect(ctx,fillX,fillY,mySel.w+10,mySel.h+10,"#00FF99","white",0,1,2,15);
			   if (mySel.angle != 0) {
				
			   }	
			   ctx.restore();			
		}
    }
    this.valid = true;
    if (this.drawAll) {
	  var floorid=this.floorid;
	  var mirrorid = "canavasAllImage_"+floorid;
	  $("#canvas_drawall_images").append('<img id="canavasAllImage_'+floorid+'" >');
  	  var mirror = document.getElementById(mirrorid);
	  var c = document.getElementById(this.canvas.id);  
	  var dataURL = c.toDataURL('image/png');
	  mirror.src = dataURL;
	  mirror.width = this.width;
	  mirror.height = this.height;				 
	  this.drawAll = false;
	  this.listSelected = this.temp_list_selected;
	  this.valid = false;
	  globalFloorCounter +=1;
	  createSaveObject();
    }
	if (this.createGroupImage) {
	   var random_ = randomString(10);
	   var pickImageID = 'user_img_'+random_;
	   $('#user_uploaded_images').append('<img id="'+ pickImageID +'"/>');
	   var mirror = document.getElementById(pickImageID); 
	   var c = document.getElementById("group_shapes_canvas");
	   var dataURL = c.toDataURL('image/png');
	   mirror.src = dataURL;
	   mirror.width = this.width;
	   mirror.height = this.height;
	   this.createGroupImage = false;
	   groupImageCreate(pickImageID,this.width,this.height);	  
	}
  }
};


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  "use strict";
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  var scrollTop = 0;
  var scrollLeft = 0;
  if (element.offsetParent !== undefined) {
    do {
	   scrollTop = 0;
	   scrollLeft = 0;
	   var leftb = parseInt(getComputedStyle(element,null).getPropertyValue('border-left-width'),10);
	   var topb = parseInt(getComputedStyle(element,null).getPropertyValue('border-top-width'),10);
	   if(element.id == "canvas_wrap_not_scroll_conf") {
	      scrollTop = element.scrollTop;
		  scrollLeft = element.scrollLeft;
       }
      offsetX += element.offsetLeft + leftb - scrollLeft;
      offsetY += element.offsetTop  + topb - scrollTop;
      element = element.offsetParent;
    } while (element);
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  //alert(this.stylePaddingLeft);
  mx = parseInt((e.pageX - offsetX)/this.zoom);
  my = parseInt((e.pageY - offsetY)/this.zoom);

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my , orgx: e.pageX , orgy: e.pageY};
};

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();
var canvas_ = "";


function dbDrawRect(ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw) {
  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }


  ctx.globalAlpha = alpha;
  ctx.fillRect(x-w/2,y-h/2,w,h);
  ctx.globalAlpha = salpha;
  if (sw > 0) {
    ctx.strokeRect(x-w/2,y-h/2,w,h);
  }
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}

function dbRoundRect (ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,R) {
//
//    (cx,cy)   (cx+r,cy)   (cx+w/2,cy)      (cx+w-r,cy)  (cx+w,cy)      
//    (cx,cy+r)                                           (cx+w,cy+r)
//    (cx,cy+h/2)                                         (cx+w,cy+h/2)
//    (cx,cy+h-r)                                         (cx+w,cy+h-r)
//    (cx,cy+h) (cx+r,cy+h) (cx+w/2,cy+h)   (cx+w-r,cy+h) (cx+w,cy+h)
//
//
//
 ctx.save();
  var r = R;
  var cx = x-w/2;
  var cy = y-h/2;
  ctx.lineWidth = sw;
  
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }
  if (w<h) {
     
         r = R * (w / 2)  / 100;
     
  } else {
         r = R * (h / 2) / 100;  
  }
	ctx.globalAlpha = salpha;
    ctx.beginPath();
    ctx.moveTo(cx+w/2,cy);
    ctx.lineTo(cx+w-r,cy);
    ctx.quadraticCurveTo(cx+w,cy,cx+w,cy+r);
    ctx.lineTo(cx+w,cy+h-r);
    ctx.quadraticCurveTo(cx+w,cy+h,cx+w-r,cy+h);
    ctx.lineTo(cx+r,cy+h);
    ctx.quadraticCurveTo(cx,cy+h,cx,cy+h-r);
    ctx.lineTo(cx,cy+r);
    ctx.quadraticCurveTo(cx,cy,cx+r,cy);
    ctx.lineTo(cx+w/2,cy);
	ctx.globalAlpha = alpha;
    ctx.fill();
	if (sw > 0) {
	  ctx.globalAlpha = salpha;
      ctx.stroke();
	  }
	ctx.globalAlpha = 1; 
    ctx.lineWidth = 1;
	ctx.restore();
}

function dbCircle (ctx , x, y, w , h, startAngle, endAngle,strokeColor,fillColor,alpha,salpha,sw) {

  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  startAngle = Math.radians(startAngle);
  endAngle = Math.radians(endAngle);
  var radius;
  if (w <=h ) {
     radius = w / 2;
  } else {
     radius = h / 2;
  }
    if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, true);
  ctx.globalAlpha = alpha;
  ctx.fill();
  if(sw>0) {
    ctx.globalAlpha = salpha;
    ctx.stroke();
	}
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}

function dbTrapez (ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,cutx) {
//
//    (cx,cy)  (cx+cutX,y)___________(cx+w-cutX,y)  (cx+w,cy)      
//           /                                 \
//          /                                   \
//         /                                     \
//    (cx,cy+h)----------------------------------(cx+w,cy+h)
//
//
//

  var cx = x-w/2;
  var cy = y-h/2;
  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
    if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }
  var cutX = w / 2 * cutx  / 100; // cutx in percentage

     if (w/2 <= cutX) {
         cutX = w/2;
     }
  ctx.globalAlpha = salpha;
    ctx.beginPath();
    ctx.moveTo(cx+cutX,cy);
    ctx.lineTo(cx+w-cutX,cy);
    ctx.lineTo(cx+w,cy+h);
    ctx.lineTo(cx,cy+h);
    ctx.lineTo(cx+cutX,cy);
	ctx.closePath();
  ctx.globalAlpha = alpha;
  ctx.fill();
  if (sw > 0) {
    ctx.globalAlpha = salpha;
    ctx.stroke();
  }
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}
function dbLine(ctx,x1,y1,x2,y2,width,alpha,color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.restore();
}
function dbText(ctx,x,y,text,font_bold,font_stle,font_size,font_color,alpha,shadow,shadow_x,shadow_y,shadow_blur,shadow_color) {
  ctx.save();
  ctx.fillStyle = font_color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (shadow!='undefined' && shadow == true) {
    ctx.shadowColor = shadow_color;
    ctx.shadowOffsetX = shadow_x;
    ctx.shadowOffsetY = shadow_y;
    ctx.shadowBlur = shadow_blur;
  }
  ctx.globalAlpha = alpha;
  ctx.font = font_bold + " " + font_size + "pt " + font_stle;
  ctx.fillText(text, x, y);
  ctx.restore();
}
function dbImage(ctx,x,y,w,h,imgID,alpha) {
   ctx.globalAlpha = alpha;
   var img_=  document.getElementById(imgID);
   ctx.drawImage(img_,x-0.5*w,y-0.5*h,w,h);
   ctx.globalAlpha = 1;
}
function allShapesSpreadHorisontal() {
  if(canvas_.listSelected.length > 1) {
      //TBD
  }
}
function allShapesSpreadVertical() {
  if(canvas_.listSelected.length > 1) {
      //TBD
  }
}
function allShapesLeft() {
  if(canvas_.listSelected.length > 1) {
      var list = canvas_.listSelected;
	  var mostLeft = 1000000;
	  var mostLeftShape = null;
	  var sleft = {};
	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
		console.log(shape.sid + ":x = " + shape.x);
		var mostLefts = 1000000;
		var listxy = shape.getCorners();
		console.log(listxy);
		for (var i = 0 ; i < 8; i+=2) {
		   if(listxy[i]<mostLeft) {
			mostLeft = listxy[i];
			mostLeftShape = shape;
		   }
		   if(listxy[i]<mostLefts) {
			  mostLefts = listxy[i];
			  sleft[shape.sid] = mostLefts;
		   }
		} 
		console.log("Shape left= "+mostLefts);
	  }
	  console.log("Most left: "+mostLeft);
	  for (var s = 0 ; s < list.length ; s ++ ) {
		 if (list[s] != mostLeftShape) {
			var shape = list[s];
			var left = sleft[shape.sid];
			var diff = left - mostLeft;
			shape.x -= diff;
			if (shape.type=="line") {
			  shape.options.x1 -= diff;
			  shape.options.x2 -= diff;
			}
			shape.state.valid = false;
		 }
	  }
  }
}

function allShapesRight() {
  if(canvas_.listSelected.length > 1) {
      var list = canvas_.listSelected;
	  var mostRight = -1000000;
	  var mostRightShape = null;
	  var sright = {};
	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
		//console.log(shape.sid + ":x = " + shape.x);
		var mostRights = -1000000;
		var listxy = shape.getCorners();
		//console.log(listxy);
		for (var i = 0 ; i < 8; i+=2) {
		   if(listxy[i]>mostRight) {
			mostRight = listxy[i];
			mostRightShape = shape;
		   }
		   if(listxy[i]>mostRights) {
			  mostRights = listxy[i];
			  sright[shape.sid] = mostRights;
		   }
		} 
		//console.log("Shape left= "+mostLefts);
	  }
	  //console.log("Most left: "+mostLeft);
	  for (var s = 0 ; s < list.length ; s ++ ) {
		 if (list[s] != mostRightShape) {
			var shape = list[s];
			var right = sright[shape.sid];
			var diff = mostRight - right;
			shape.x += diff;
			if (shape.type=="line") {
			  shape.options.x1 += diff;
			  shape.options.x2 += diff;
			}
			shape.state.valid = false;
		 }
	  }
  }
}
function allShapesCenter() {
  if(canvas_.listSelected.length > 1) {
     var list = canvas_.listSelected;
     if(canvas_.selection != null) {
	    var xs = canvas_.selection.x;
		for (var s = 0 ; s < list.length ; s ++ ) {
		  var shape = list[s];
		  if (shape!= canvas_.selection) {
		    var diff = shape.x - xs;
		    shape.x = xs;
		    if (shape.type=="line") {
			  shape.options.x1 -= diff;
			  shape.options.x2 -= diff;
			}
			canvas_.valid = false;
		  }
		}
	 } 
  }
}
function allShapesBottom() {
  if(canvas_.listSelected.length > 1) {
      var list = canvas_.listSelected;
	  var mostBottom = -1000000;
	  var mostBottomShape = null;
	  var sright = {};
	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
		//console.log(shape.sid + ":x = " + shape.x);
		var mostBottoms = -1000000;
		var listxy = shape.getCorners();
		//console.log(listxy);
		for (var i = 1 ; i < 8; i+=2) {
		   if(listxy[i]>mostBottom) {
			mostBottom = listxy[i];
			mostBottomShape = shape;
		   }
		   if(listxy[i]>mostBottoms) {
			  mostBottoms = listxy[i];
			  sright[shape.sid] = mostBottoms;
		   }
		} 
		//console.log("Shape left= "+mostLefts);
	  }
	  //console.log("Most left: "+mostLeft);
	  for (var s = 0 ; s < list.length ; s ++ ) {
		 if (list[s] != mostBottomShape) {
			var shape = list[s];
			var bottom = sright[shape.sid];
			var diff = mostBottom - bottom;
			shape.y += diff;
			if (shape.type=="line") {
			  shape.options.y1 += diff;
			  shape.options.y2 += diff;
			}
			shape.state.valid = false;
		 }
	  }
  }
}

function allShapesTop() {
  if(canvas_.listSelected.length > 1) {
      var list = canvas_.listSelected;
	  var mostTop = 1000000;
	  var mostTopShape = null;
	  var sright = {};
	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
		//console.log(shape.sid + ":x = " + shape.x);
		var mostTops = 1000000;
		var listxy = shape.getCorners();
		//console.log(listxy);
		for (var i = 1 ; i < 8; i+=2) {
		   if(listxy[i]<mostTop) {
			mostTop = listxy[i];
			mostTopShape = shape;
		   }
		   if(listxy[i]<mostTops) {
			  mostTops = listxy[i];
			  sright[shape.sid] = mostTops;
		   }
		} 
		//console.log("Shape left= "+mostLefts);
	  }
	  //console.log("Most left: "+mostLeft);
	  for (var s = 0 ; s < list.length ; s ++ ) {
		 if (list[s] != mostTopShape) {
			var shape = list[s];
			var top = sright[shape.sid];
			var diff = top - mostTop;
			shape.y -= diff;
			if (shape.type=="line") {
			  shape.options.y1 -= diff;
			  shape.options.y2 -= diff;
			}
			shape.state.valid = false;
		 }
	  }
  }
}
function allShapesMiddle() {
  if(canvas_.listSelected.length > 1) {
     var list = canvas_.listSelected;
     if(canvas_.selection != null) {
	    var ys = canvas_.selection.y;
		for (var s = 0 ; s < list.length ; s ++ ) {
		  var shape = list[s];
		  if (shape!= canvas_.selection) {
		    var diff = shape.y - ys;
		    shape.y = ys;
		    if (shape.type=="line") {
			  shape.options.y1 -= diff;
			  shape.options.y2 -= diff;
			}
			canvas_.valid = false;
		  }
		}
	 } 
  }
}
Array.prototype.remove = function(value) {
var idx = this.indexOf(value);
if (idx != -1) {
    return this.splice(idx, 1); // The second parameter is the number of elements to remove.
}
return false;
}
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}