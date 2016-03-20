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

function Shape(state, x, y, w, h,type,options,angle_,sid_) {
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
  
  
  this.bookableShape = true;

  this.booking_options = {};
  this.booking_options.bookable = true;
  this.booking_options.marged = false;
  this.booking_options.mergelist = [];
  this.booking_options.givenName = null;
  this.booking_options.minPersons = 1;
  this.booking_options.maxPersons = 1;
  this.booking_options.description = "";
  // Line angle
   if (type == "line") {
    state.ctx.save();
	state.ctx.translate(this.x , this.y );
	this.angle = toDegrees(getAngle(this.options.x2 - this.x,this.options.y2 - this.y));
             if (this.angle >360) {
				this.angle-=360;
			  } else if (this.angle < 0) {
				this.angle+=360;
			  } 		
	state.ctx.restore();
   }
  if (type == "line" || type == "text") {
    this.booking_options.bookable = false;
	this.bookableShape = false;
  }
  if (type == "text") { 
   var c = document.getElementById("text_width_calculation_canvas");
   var ctx = c.getContext("2d");
   ctx.font = this.options.font_bold + " " + this.options.font_size + "pt " + this.options.font_style;
   var txt = this.options.text;
   this.w = parseInt(ctx.measureText(txt).width + 2);
  }
  if(sid_==undefined) {
    this.sid = randomString(12);
  } else {
    this.sid = sid_;
  }
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx, optionalColor) {
  "use strict";
  var i, cur, half;
  ctx.fillStyle = this.fill;
  var fillX = this.x;
  var fillY = this.y;

  if (this.angle != 0 && this.type!="line") {
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
				  this.options.alpha * this.state.bookingOpacity,
				  this.options.salpha * this.state.bookingOpacity,
				  this.options.sw);
  } else if (this.type == "line" ) {
  //dbText(ctx,x,y,text,font_bold,font_style,font_size,font_color,alpha,shadow,shadow_x,shadow_y,shadow_blur,shadow_color)
      dbLine (ctx,this.options.x1,
				  this.options.y1,
				  this.options.x2,
				  this.options.y2,
				  this.options.sw,
				  this.options.salpha * this.state.bookingOpacity,
				  this.options.lineColor);				  
	  
  } else if (this.type == "text" ) {
    dbText(ctx,fillX,fillY,
	                 this.options.text,
	                 this.options.font_bold,
					 this.options.font_style ,
					 this.options.font_size,
					 this.options.font_color,
					 this.options.alpha * this.state.bookingOpacity,
					 this.options.shadow,
					 this.options.shadow_x,
					 this.options.shadow_y,
					 this.options.shadow_blur,
					 this.options.shadow_color);
  } else if (this.type == "round" ) {
    dbRoundRect (ctx,fillX,fillY,this.w,this.h,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha * this.state.bookingOpacity,
				  this.options.salpha * this.state.bookingOpacity,
				  this.options.sw,
				  this.options.roundRad);
  } else if (this.type == "circle" ) {
    dbCircle (ctx,fillX,fillY,this.w,this.h,
				  this.options.startA,
				  this.options.endA,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha * this.state.bookingOpacity,
				  this.options.salpha * this.state.bookingOpacity,
				  this.options.sw);
  } else if (this.type == "trapex" ) {
    dbTrapez (ctx,fillX,fillY,this.w,this.h,
	              this.options.lineColor,
				  this.options.fillColor,
				  this.options.alpha * this.state.bookingOpacity,
				  this.options.salpha * this.state.bookingOpacity,
				  this.options.sw,
				  this.options.cutX);
  } else if (this.type == "image" ) {
    dbImage (ctx,fillX,fillY,this.w,this.h,
	              this.options.imgID,
				  this.options.alpha * this.state.bookingOpacity);
  }
  if (this.state.selection === this && this.type == "line" && this.state.listSelected.length < 2 ) {
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
		 ctx.globalAlpha = 0.5;
         ctx.fill();
         ctx.stroke();
    }
	ctx.fillStyle = this.state.selectionBoxColor;
  } else if (this.state.selection === this && this.type != "line" && this.state.listSelected.length < 2) {
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
	    if(this.type=="image" && (i==1||i==3||i==4||i==6)  && this.bookableShape == true) {
		  continue;
		}
      cur = this.state.selectionHandles[i];
	  //if (i == 8) {
	     ctx.fillStyle = "white";
		 ctx.strokeStyle = "blue";
		 ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(cur.x, cur.y, 3, 0,  Math.PI*2 , true);
		 ctx.globalAlpha = 0.5;
         ctx.fill();
         ctx.stroke();

    }
	ctx.fillStyle = this.state.selectionBoxColor;
  }
   ctx.restore();
   ctx.globalAlpha = 1;
    if (this.state.selection === this && this.angle != 0 && this.type != "line") {
	  
	  for (i = 0; i < 9; i += 1) {
           cur = this.state.selectionHandles[i];
           var oldAngle = getAngle(cur.x,cur.y);
		   var newAngle = oldAngle + toRadians(this.angle);
		   var radius = Math.sqrt(Math.pow(cur.x,2) + Math.pow(cur.y,2));
		   var newx = radius * Math.cos( newAngle) + this.x  ;
		   var newy = radius * Math.sin( newAngle) + this.y ;
		   cur.x = newx;
		   cur.y = newy;
	  }
      
	}
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

  var centerX = this.x;
  var centerY = this.y;
  var isInside;
  if(this.type=="line") {
          var rectangleW = Math.sqrt( (this.options.x2-this.options.x1)*(this.options.x2-this.options.x1) 
			                 + (this.options.y2-this.options.y1)*(this.options.y2-this.options.y1) );
		  var rectangleH = this.options.sw+4 ;
          var topCornerX = this.x -  0.5 * rectangleW;
          var topCornerY = this.y -  0.5 * rectangleH;
  		  if (this.angle != 0 ) {
		   //Translate line to rectangle dimentions

		   topCornerX = - 0.5 * rectangleW;
		   topCornerY = - 0.5 * rectangleH;
		   var movedX = mx - centerX;
		   var movedY = my - centerY;
		   var radius = Math.sqrt(Math.pow(movedX,2) + Math.pow(movedY,2));
		   var initAngle = Math.atan(movedY/movedX);
		   mxt = radius * Math.cos(initAngle - toRadians(this.angle));
		   myt = radius * Math.sin(initAngle - toRadians(this.angle));
		   }		
   
   isInside =   (topCornerX <= mxt) && (topCornerX + rectangleW >= mxt) &&
                (topCornerY <= myt) && (topCornerY + rectangleH >= myt); 

  } else {
      var topCornerX = this.x - 0.5 * this.w;
      var topCornerY = this.y -  0.5 * this.h;
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
   isInside =   (topCornerX <= mxt) && (topCornerX + this.w >= mxt) &&
                   (topCornerY <= myt) && (topCornerY + this.h >= myt);
  }
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
function linearFunc(a,b,m) {
  this.a = a;
  this.b = b;
  this.m = m;
  this.m1 = m;
  this.n1 = m*a-b;
}
function xypoint(x,y) {
  this.x=x;
  this.y=y;
}
function Intersection(line1,line2) {

   var m1 = line1.m1;
   var n1 = line1.n1;
   var m2 = line2.m1;
   var n2 = line2.n1;
   var X = -1*(n2-n1)/(m1-m2);
   var Y = -1*(m1*n2 - n1*m2)/(m1-m2);
   var xy = new xypoint(X,Y);
   return xy;
}
function CanvasState(canvas) {
  "use strict";
  // **** First some setup! ****
  //console.log(canvas);
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
  
  this.mouseIn = false;

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
  this.dragoffxinit = 0; // See mousedown and mousemove events for explanation
  this.dragoffyinit = 0;
  this.rotateDragging = false;
  this.rotateAngle = 0;
  this.minimumResize = false;
  this.multipleDrag = false;
  this.prepareForSingleSelection = null;
  
  this.startLineX = null;
  this.startLineY = null; 
  this.DrawingLine = null;
  
  this.bgmode = false;
  this.bookshapes = [];
  this.bgshapes = [];
  this.bookingOpacity = 1;
 
  this.startSelectionX = null;
  this.startSelectionY = null; 
  this.SelectonRect = null; 
  this.addedBySelectionBoxList = [];
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
  canvas.addEventListener('rotateShape',function(e) {

  });
  canvas.addEventListener('mousedown', function(e) {
    canvasMouseDown = true;
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
	
	myState.multipleDrag = false;
	myState.prepareForSingleSelection = null;
	
	if(e.ctrlKey) {
	   myState.startSelectionX = mx;
	   myState.startSelectionY = my;
	}
    for (i = l-1; i >= 0; i -= 1) {
      if (shapes[i].contains(myState.ctx ,mx, my)) {
	   if(e.which == 3) //1: left, 2: middle, 3: right
        {
            return;
        }
        mySel = shapes[i]; 
		var regular_behavior = false;
		myState.mousemoveclicked = null;
		if(e.ctrlKey ) {
		  if( myState.selection == null && myState.listSelected.length == 0) {
		    regular_behavior = true;
		  } else if ( myState.selection == mySel && myState.listSelected.length == 1) {
		    
		    // The only selected is already in selection --> remove
			myState.listSelected.remove(mySel);
			myState.selection = null;
	        myState.canvasDrag  = false;
			myState.dragging = false;
		    myState.valid = false;
	      } else {
		 
		     // Add to list or remove from list which is more than 1
			 myState.selection = null;
			 if(myState.listSelected.contains(mySel)) {
			    myState.listSelected.remove(mySel);
			    if(myState.listSelected.length == 1) {
			      myState.selection == myState.listSelected[0];
				  myState.canvasDrag  = false;
			      myState.dragging = false;
		          myState.valid = false;
			    }			 
			 } else {
			      myState.listSelected.push(mySel);	
				  myState.canvasDrag  = false;
			      myState.dragging = false;
		          myState.valid = false;			 
			 }
           }
		} else {
		  regular_behavior = true;
		}
		if (regular_behavior) {
		   if(myState.listSelected.length > 1 && myState.listSelected.contains(mySel)) {
             myState.prepareForSingleSelection = mySel;
			 myState.multipleDrag = false;
			 myState.dragoffx = mx;
			 myState.dragoffy = my;
			 myState.dragoffxinit = mx;
			 myState.dragoffyinit = my;
			 myState.dragging = true;
			 myState.valid = false;
		   } else {
            myState.multipleDrag = false;
			myState.listSelected = [];
			myState.listSelected.push(mySel);
			var prevSelection = myState.selection;
			
			// Keep track of where in the object we clicked
			// so we can move it smoothly (see mousemove)
			myState.dragoffx = mx - mySel.x;
			myState.dragoffy = my - mySel.y;
			myState.dragging = true;
			myState.selection = mySel;
			myState.valid = false;
			if (myState.main) {
				updateSelectedOptions(mySel);
				$('#rotate_slider').slider('value', mySel.angle);

			}
		  }
		}
		if (myState.main) {
			if (myState.listSelected.length > 1) {
			  document.getElementById("mso_relative_div").style.display = "";
			} else {
			  document.getElementById("mso_relative_div").style.display = "none";
			}
		}
        return;
      }
    }
	
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
	if(!e.ctrlKey) {
	   // If "Cntrl" not pushed empty selectedList
		  myState.listSelected = [];
		  if (myState.main) {
		   document.getElementById("mso_relative_div").style.display = "none";
		   }
	}
    if (myState.selection) {
	   if (myState.main) {
	  			//document.getElementById("selected_canvas_options_tr").style.display = "none";
				updateSelectedOptions();
		}
      myState.selection = null;
	  myState.canvasDrag  = true;
	 
	  myState.prevCmx = mox ;
      myState.prevCmy = moy ;
      myState.valid = false; // Need to clear the old selection border
	  if (myState.main) {
		$("#drawing_tab_selector").click();
	  }
    } else {
	  if(currentFigurePicker.type == "line") {
	     
		 myState.startLineX	= mx;
		 myState.startLineY	= my;
	  } else {
		  myState.canvasDrag  = true;
		  
		  myState.prevCmx = mox ;
		  myState.prevCmy = moy ;	
	  }
	}
  }, true);
  canvas.addEventListener("mouseout", function(e) {
     hideHint();
	 myState.mouseOutEvent();
  }, true);

  canvas.addEventListener('mousemove', function(e) {
         myState.mouseMoveEvent(e);

  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.mouseUpEvent();

  }, true);
    canvas.addEventListener('keydown', function(e) {
	 if(e.keyCode=="46") {
	     if(myState.listSelected.length > 1) {
		    myState.dragging = false;
			myState.resizeDragging = false;
			myState.expectResize = -1;
		  for (var i = 0; i< myState.listSelected.length ; i++) {
		     var shape = myState.listSelected[i];
			 myState.shapes.remove(shape);
			 console.log("removed:"+shape.sid);
		  }
		  myState.listSelected = [];
		  //document.getElementById("selected_canvas_options_tr").style.display = "none";
	      updateSelectedOptions();
			myState.selection = null;
			myState.valid = false;
	    } else {
			myState.dragging = false;
			myState.resizeDragging = false;
			myState.expectResize = -1;
			myState.lexpectResize = -1;
			if (myState.selection !== null) {
                var shapeID = myState.selection.sid;
				var shape;
				var idx;
				    for (i = 0; i < myState.shapes.length; i += 1) {
                            shape = myState.shapes[i];
							if(shape.sid  == shapeID) {
							    idx = myState.shapes.indexOf(shape);
							}
				    }
				myState.shapes.splice(idx,1);
				//document.getElementById("selected_canvas_options_tr").style.display = "none";
				updateSelectedOptions();
				myState.selection = null;
				myState.listSelected = [];
				myState.valid = false;
			} else {
			   
			}
		}
    } else if ( e.keyCode=="38") {
	  for (var i = 0; i< myState.listSelected.length ; i++) {
		 var shape = myState.listSelected[i];
	     shape.y -= 1;
		 if (shape.type == "line") {
		    shape.options.y1 -= 1;
			shape.options.y2 -= 1;
		 }
		 myState.valid = false;
		 
	  }
	} else if ( e.keyCode=="40") {
	  for (var i = 0; i< myState.listSelected.length ; i++) {
		 var shape = myState.listSelected[i];
	     shape.y += 1;
		 if (shape.type == "line") {
		    shape.options.y1 += 1;
			shape.options.y2 += 1;
		 }
		 myState.valid = false;
	  }
	} else if ( e.keyCode=="37") {
	  for (var i = 0; i< myState.listSelected.length ; i++) {
		 var shape = myState.listSelected[i];
	     shape.x -= 1;
		 if (shape.type == "line") {
		    shape.options.x1 -= 1;
			shape.options.x2 -= 1;
		 }
		 myState.valid = false;
	  }
	} else if ( e.keyCode=="39") {
	  for (var i = 0; i< myState.listSelected.length ; i++) {
		 var shape = myState.listSelected[i];
	     shape.x += 1;
		 if (shape.type == "line") {
		    shape.options.x1 += 1;
			shape.options.x2 += 1;
		 }
		 myState.valid = false;
	  }
	} else if (e.keyCode == "67" && e.ctrlKey ) {
	 // Ctrl + C
	   if(canvas_.listSelected.length > 1) {
		    myState.copyMultiple();			
	    } else if (myState.selection !== null) {
	      myState.copyShape(myState.selection);
		  
	   }	
	} else if (e.keyCode == "86" && e.ctrlKey ) {
	 // Ctrl + C
	    if(canvas_.pasteMultiple_ == true) {
		   myState.pasteMultiple(parseInt(myState.width / 2 ),parseInt( myState.height / 2));
	    } else if(canvas_.pasteReady != null) {
	       myState.pasteShape(parseInt(myState.width / 2 ),parseInt( myState.height / 2));
	   }	
	}
  }, true);
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
	if(currentFigurePicker != null) {
	  if (currentFigurePicker.type == "rectangle") {
	     var lineColor = currentFigurePicker.lineColor;
		 var fillColor = currentFigurePicker.fillColor;
		 var alpha = currentFigurePicker.alpha;
		 var salpha = currentFigurePicker.salpha;
		 var sw = currentFigurePicker.lineWidth;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw} ;
	     myState.addShape(new Shape(myState, mouse.x , mouse.y , 40, 40, "rectangle" , options ));
	  } else if (currentFigurePicker.type == "line") {
	      var lineColor = currentFigurePicker.lineColor;
		  var salpha = currentFigurePicker.salpha;
		  var sw = currentFigurePicker.lineWidth;
		  var options = {x1:mouse.x-25,y1:mouse.y-25,x2:mouse.x+25,y2:mouse.y+25,lineColor:lineColor , salpha:salpha, sw:sw  } ;
	      myState.addShape(new Shape(myState, mouse.x , mouse.y , 50, 50, "line" , options ));
	  } else if (currentFigurePicker.type == "round") {
	     var lineColor = currentFigurePicker.lineColor;
		 var fillColor = currentFigurePicker.fillColor;
		 var alpha = currentFigurePicker.alpha;
		 var salpha = currentFigurePicker.salpha;
		 var sw = currentFigurePicker.lineWidth;
		 var roundRad = currentFigurePicker.roundRad;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw , roundRad:roundRad } ;
	     myState.addShape(new Shape(myState, mouse.x , mouse.y , 40, 40, "round" , options ));
	  } else  if (currentFigurePicker.type == "circle") {
	     var lineColor = currentFigurePicker.lineColor;
		 var fillColor = currentFigurePicker.fillColor;
		 var alpha = currentFigurePicker.alpha;
		 var salpha = currentFigurePicker.salpha;
		 var sw = currentFigurePicker.lineWidth;
		 var startA =  currentFigurePicker.startA;
         var endA = currentFigurePicker.endA;
         var rad = currentFigurePicker.rad;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw ,startA:startA,endA:endA} ;
	     myState.addShape(new Shape(myState, mouse.x , mouse.y , rad , rad, "circle" , options ));
	  } else  if (currentFigurePicker.type == "trapex") {
	     var lineColor = currentFigurePicker.lineColor;
		 var fillColor = currentFigurePicker.fillColor;
		 var alpha = currentFigurePicker.alpha;
		 var salpha = currentFigurePicker.salpha;
		 var sw = currentFigurePicker.lineWidth;
         var cutX = currentFigurePicker.cutX;
		 var options = {lineColor:lineColor ,fillColor:fillColor , alpha:alpha, salpha:salpha, sw:sw ,cutX:cutX} ;
	     myState.addShape(new Shape(myState, mouse.x , mouse.y , 40 , 30 , "trapex" , options ));
	  } else  if (currentFigurePicker.type == "text") {
		 var alpha = currentFigurePicker.alpha;
		 
		 var options = {text:currentFigurePicker.text ,
		                font_bold:currentFigurePicker.font_bold , 
						font_style:currentFigurePicker.font_style, 
						font_size:currentFigurePicker.font_size, 
						font_color:currentFigurePicker.font_color ,
						alpha:currentFigurePicker.alpha , 
						shadow:currentFigurePicker.shadow, 
						shadow_x:currentFigurePicker.shadow_x, 
						shadow_y:currentFigurePicker.shadow_y ,
						shadow_blur:currentFigurePicker.shadow_blur ,
						shadow_color:currentFigurePicker.shadow_color} ;
	     myState.addShape(new Shape(myState, mouse.x , mouse.y , 30 , 30 , "text" , options ));
	  }  else  if (currentFigurePicker.type == "image") {
		 var alpha = currentFigurePicker.alpha;
		 var imgID = currentFigurePicker.imgID;
		 var width = currentFigurePicker.width;
		 var height = currentFigurePicker.height;
		 var options = {imgID:imgID ,alpha:alpha } ;
	     myState.addShape(new Shape(myState, mouse.x , mouse.y , width , height  , "image" , options ));
	  }
	  //dbText(ctx,x,y,text,font_bold,font_style,font_size,font_color,alpha,shadow,shadow_x,shadow_y,shadow_blur,shadow_color)

	 // myState.addShape(new Shape(myState, mouse.x , mouse.y , 40, 40, 'rgba(0,255,0,.6)',"img"));
	} else {
      
	}
  }, true);
  
  // **** Options! ****
  
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.selectionBoxSize = 6;
  this.selectionBoxColor = 'darkred';
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}
CanvasState.prototype.mouseMoveEvent = function(e) {

        $("#"+this.canvas.id).removeClass("rotateCursor");
        var myState = this;
        var mouse = myState.getMouse(e),
        mx = mouse.x,
        my = mouse.y,
		mox = mouse.orgx,
		moy = mouse.orgy,
		orgx = mouse.orgx , orgy = mouse.orgy ,
        oldx, oldy, oldw, oldh ,i, cur;

		
		if (myState.main) {
		  if(myState.mouseIn == false) {
		      myState.mouseIn == true;
			  showHint();
			  positionHint(orgx,orgy);
		  } else {
		      positionHint(orgx,orgy);
		  }
		 
		}
	var contains = false;	 
	if(!myState.resizeDragging) {
		 for (i = 0; i <  myState.shapes.length ; i ++) {
				  if (myState.shapes[i].contains(myState.ctx ,mx, my)) {
					this.canvas.style.cursor='pointer';
					myState.shapeHover = myState.shapes[i];
					contains = true;
					hideHint();
				  }
		}

		if (!contains) {
		   this.canvas.style.cursor='auto';
		   showHint();
		} else {
		  this.canvas.style.cursor='pointer';
		}
	}
	if(myState.startSelectionX != null) {
	   
	   this.canvas.style.cursor='crosshair';
	   hideHint();
	   if(myState.SelectonRect == null) {
	      myState.SelectonRect = {};
	      myState.SelectonRect.x1 = myState.startSelectionX;
		  myState.SelectonRect.y1 = myState.startSelectionY;
		  myState.SelectonRect.x2 = mx;
		  myState.SelectonRect.y2 = my;
	   } else {
		  myState.SelectonRect.x2 = mx;
		  myState.SelectonRect.y2 = my;	   
	   }
	    var shapes = myState.shapes;
        var l = shapes.length;
		for (var i = l-1; i >= 0; i -= 1) {
		  var mySel = shapes[i];
		  var selW = Math.abs(myState.SelectonRect.x2 - myState.SelectonRect.x1);
		  var selH = Math.abs(myState.SelectonRect.y2 - myState.SelectonRect.y1);
		  if( (( myState.SelectonRect.x1 <= mySel.x &&  mySel.x <= myState.SelectonRect.x2) ||
		       ( myState.SelectonRect.x2 <= mySel.x &&  mySel.x <= myState.SelectonRect.x1) ) &&
			  (( myState.SelectonRect.y1 <= mySel.y &&  mySel.y <= myState.SelectonRect.y2) ||
		       ( myState.SelectonRect.y2 <= mySel.y &&  mySel.y <= myState.SelectonRect.y1) )) {
			   
			     if(myState.listSelected.contains(mySel)) {
					myState.addedBySelectionBoxList.push(	mySel );
				 } else {
				  // Add to the selected list
				  myState.listSelected.push(mySel);	
                  myState.addedBySelectionBoxList.push(	mySel );			  
				}
			} else {
			   if(myState.addedBySelectionBoxList.contains(mySel)) {
			       myState.listSelected.remove(mySel);
				   myState.addedBySelectionBoxList.remove(mySel);
			   }
			}
		}
	   if(myState.listSelected.length==1) {
	     myState.selection = myState.listSelected[0];
	   }
	   myState.valid = false; 
	   return;
	}
	if (myState.canvasDrag) {
       
	    var leftDrag = mox - myState.prevCmx;
		var topDrag = moy - myState.prevCmy;
		
		
       if (myState.main) {
		 document.getElementById("canvas_wrapper").scrollTop -= topDrag;
		 document.getElementById("canvas_wrapper").scrollLeft -= leftDrag;
	   }
		 myState.prevCmx = mox ;
         myState.prevCmy = moy ;	
		 myState.valid = false;
	}
    if (myState.dragging){
	    mouse = myState.getMouse(e);
		this.canvas.style.cursor='move';
	    hideHint();
	  	
	 if(myState.prepareForSingleSelection == null) {
     
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
     } else {
	   //  myState.multipleDrag = true;	  
		 var difx = mouse.x - myState.dragoffx;
	     var dify = mouse.y - myState.dragoffy;
		 myState.dragoffx = mouse.x;
		 myState.dragoffy = mouse.y;
		 if (myState.listSelected.length > 1) {
		     //myState.multipleDrag = true;	
			 for (var i = 0; i < myState.listSelected.length ; i++) {
				var shape = myState.listSelected[i];

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
		  mx = parseInt(radius * Math.cos( mouseAngle - initAngle));
		  my = parseInt(radius * Math.sin( mouseAngle - initAngle));  	  
		  mx = omx;
		  my = omy;  	  
				  
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
			
			// Get line angle
			myState.ctx.save();
	        myState.ctx.translate(myState.selection.x , myState.selection.y );
			myState.selection.angle = toDegrees(getAngle(myState.selection.options.x2 - myState.selection.x,myState.selection.options.y2 - myState.selection.y));
             if (myState.selection.angle >360) {
				myState.selection.angle-=360;
			  } else if (myState.selection.angle < 0) {
				myState.selection.angle+=360;
			  } 			
	        myState.ctx.restore();
			
			myState.valid = false; // Something's dragging so we must redraw
	  } else if(myState.selection.type == "image"  && myState.selection.bookableShape == true){
		  var prevX;
		  var prevY;
		  var prevAngle;
		  var WHrelation = myState.selection.w / myState.selection.h;

		  if ( myState.selection.startX == null) {
			  myState.selection.startX = myState.selection.x;
			  myState.selection.startY = myState.selection.y;
		  }
		  var omx = mx;
		  var omy = my;
		 
		  // Need to convert mx/my on the moving line. 
		 if(myState.expectResize!=8) {
			 var currentSelection = myState.selectionHandles[myState.expectResize];
			 var selectionBoxX = currentSelection.x;
			 var selectionBoxY = currentSelection.y;
			 
			 var M = (selectionBoxY - myState.selection.y) / (selectionBoxX - myState.selection.x);
			 var selectionFunc = new linearFunc(selectionBoxX,selectionBoxY,M);
			 var mouseAngleDegrees = toDegrees(Math.atan(M)) + 90;
			 var mouseMrelativeToSelectionLine = Math.tan(toRadians(mouseAngleDegrees));
			 var mouseFunc = new linearFunc(omx,omy,mouseMrelativeToSelectionLine);
			 var IntersectionXY = Intersection(selectionFunc,mouseFunc);
			 mx = IntersectionXY.x ;
			 my = IntersectionXY.y ;
			 
            // Check if intersection inside selection box
			var mxt = mx;
			var myt = my;
			var centerX = selectionBoxX ;
			var centerY = selectionBoxY ;
			var topCornerX = selectionBoxX - 3;
			var topCornerY = selectionBoxY - 3;

			
			if(myState.minimumResize == true) {
			   if (mxt >= topCornerX && mxt <= topCornerX + myState.selectionBoxSize &&
				   myt >= topCornerY && myt <= topCornerY + myState.selectionBoxSize) {
					myState.minimumResize = false;
				} else {
				    return;
				}			
			}

		 } 
		  var movedX = mx - myState.selection.startX;
		  var movedY = my - myState.selection.startY;

		  var radius = Math.sqrt(Math.pow(movedX,2) + Math.pow(movedY,2));
		//  if(radius < 10) { return;}
		  var initAngle =  toRadians(myState.selection.angle);
		  var mouseAngle = getAngle(movedX,movedY);
		  //var mouseAngle = initAngle;
		  mx = radius * Math.cos(  mouseAngle - initAngle);
		  my = radius * Math.sin(  mouseAngle - initAngle);  	  
		  
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
          var savePrevW = myState.selection.w;
		  var savePrevH = myState.selection.h;
          var savePrevX = myState.selection.x;
		  var savePrevY = myState.selection.y;
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
		    if(myState.selection.w <= 10 && myState.selection.h <=10) {
			    myState.selection.w=savePrevW;
		        myState.selection.h=savePrevH;
                myState.selection.x=savePrevX;
		        myState.selection.y=savePrevY;
				myState.minimumResize = true;
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
    } else if (myState.startLineX != null) {
	   if(myState.DrawingLine == null) {
	      myState.DrawingLine = {};
	      myState.DrawingLine.x1 = myState.startLineX;
		  myState.DrawingLine.y1 = myState.startLineY;
		  myState.DrawingLine.x2 = mx;
		  myState.DrawingLine.y2 = my;
	   } else {
		  myState.DrawingLine.x2 = mx;
		  myState.DrawingLine.y2 = my;	   
	   }
	   myState.valid = false; 
	   return;
	} else if (myState.selection !== null && !myState.resizeDragging && myState.selection.type == "line") {
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
		  this.canvas.style.cursor='pointer';
		  updateHint("Resize","black");
		  return;
		  }
	  }
	        // not over a selection box, return to normal
      myState.resizeDragging = false;
      myState.lexpectResize = -1;
	  restoreDefaultHint();
	} else if (myState.selection !== null && !myState.resizeDragging && myState.selection.type != "line") {

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
  
        if(myState.selection.type=="image" && (i==1||i==3||i==4||i==6) && myState.selection.bookableShape == true) {
		  continue;
		}
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
              this.canvas.style.cursor= nw_resize;
              break;
            case 1:
              this.canvas.style.cursor= n_resize;
              break;
            case 2:
              this.canvas.style.cursor= ne_resize ;
              break;
            case 3:
              this.canvas.style.cursor= w_resize ;
              break;
            case 4:
              this.canvas.style.cursor= e_resize ;
              break;
            case 5:
              this.canvas.style.cursor= sw_resize ;
              break;
            case 6:
              this.canvas.style.cursor= s_resize ;
              break;
            case 7:
              this.canvas.style.cursor= se_resize ;
              break;
			case 8:
              this.canvas.style.cursor='pointer';
              break;
          }
		  if(i==8) {
		  updateHint("Rotate","black");
		  $("#"+this.canvas.id).addClass("rotateCursor");
		  } else {
		  $("#"+this.canvas.id).removeClass("rotateCursor");
		  updateHint("Resize","black");
		  }
          return;
        }
        
      }
      // not over a selection box, return to normal
      myState.resizeDragging = false;
      myState.expectResize = -1;
	  restoreDefaultHint();
    }
}
CanvasState.prototype.mouseOutEvent = function() {
  if(canvasMouseDown) {
     canvasMouseOut = true;
  }
}
CanvasState.prototype.mouseUpEvent = function() {
    updateBookingOptions();
    canvasMouseDown = false;
	this.addedBySelectionBoxList = [];
	if((this.dragoffxinit != this.dragoffx)||(this.dragoffyinit != this.dragoffy)) {
	   this.multipleDrag = true;
	}
	if(this.selection == null || this.listSelected.length > 1){
	   updateSelectedOptions();
	} else if(this.selection != null){
	   updateSelectedOptions(this.selection)
	}
    if(this.DrawingLine!= null ) {
	     var lineColor = currentFigurePicker.lineColor;
		 var salpha = currentFigurePicker.salpha;
		 var sw = currentFigurePicker.lineWidth;
		 var options = {x1:this.DrawingLine.x1,
		                y1:this.DrawingLine.y1,
						x2:this.DrawingLine.x2,
						y2:this.DrawingLine.y2,
						lineColor:lineColor , 
						salpha:salpha, 
						sw:sw  } ;
	     this.addShape(new Shape(this, 
		                         Math.abs((this.DrawingLine.x2 + this.DrawingLine.x1)/2), 
								 Math.abs((this.DrawingLine.y2 + this.DrawingLine.y1)/2), 
								 50, 50, "line" , options ));
		  
		 this.startLineX = null;
		 this.startLineY = null; 
		 this.DrawingLine = null;	
	} else {
		 this.startLineX = null;
		 this.startLineY = null; 
		 this.DrawingLine = null;	
	}
	if(this.SelectonRect!= null ) {
      showHint();
	  this.startSelectionX = null;
	  this.startSelectionY = null; 
	  this.SelectonRect = null; 	
	} else {		 
	  this.startSelectionX = null;
	  this.startSelectionY = null; 
	  this.SelectonRect = null; 
	}
			if (this.listSelected.length > 1) {
			  document.getElementById("mso_relative_div").style.display = "";
			} else {
			  document.getElementById("mso_relative_div").style.display = "none";
			}
	if(this.multipleDrag == false && this.prepareForSingleSelection != null) {

			this.listSelected = [];
			this.listSelected.push(this.prepareForSingleSelection);
			this.selection = this.prepareForSingleSelection;

			if (this.main) {
				updateSelectedOptions(this.selection);	
				$('#rotate_slider').slider('value', this.selection.angle);				
				if (bookingOpen_) {
					 $("#booking_tab_selector").click();
				}
			}	
			this.prepareForSingleSelection = null;
	}
	if(this.dragging) {
	   this.canvas.style.cursor='auto';
	   showHint();	
	}
    this.dragging = false;
    this.resizeDragging = false;
    this.expectResize = -1;
	this.lexpectResize = -1;
	this.minimumResize = false;
    if (this.selection !== null) {
      if (this.selection.w < 0) {
          this.selection.w = -this.selection.w;
          this.selection.x -= this.selection.w;
      }
      if (this.selection.h < 0) {
          this.selection.h = -this.selection.h;
          this.selection.y -= this.selection.h;
      }
	    this.selection.prevMX = null;
        this.selection.prevMY = null;
		this.selection.startX = null;
		this.selection.startY = null;
		this.selection.prevAngle = null;
		if (this.main) {
			$('#rotate_slider').slider('value', this.selection.angle);	
		}

    }
	if (this.canvasDrag) {
	   this.canvasDrag = false;
	}
	this.valid = false;
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
	}
    this.shapes.push(shape);

  this.valid = false;
};
CanvasState.prototype.mode = function(type) {

  
  if(type!= undefined && type == "bg" && this.bgmode == false) {
      this.selection = null;
      this.listSelected = [];
	  
      this.bgmode = true;
      this.bookshapes = this.shapes;
      this.shapes  = this.bgshapes;
	  updateBookingOptions();
	  updateSelectedOptions();
  } else if (type== undefined && this.bgmode == true) {
      this.selection = null;
      this.listSelected = [];
	  
      this.bgmode = false;
	  this.bgshapes = this.shapes;
	  this.shapes = this.bookshapes;
	  updateBookingOptions();
	  updateSelectedOptions();
  }
  this.valid = false;
}

CanvasState.prototype.copyMultiple = function() {
 if(this.listSelected.length > 1) {
    this.pasteList = [];
    for (var i =0; i< this.listSelected.length;i++) {
	    this.pasteList.push(this.listSelected[i]);
	}
    this.pasteMultiple_ = true;
 }
}

CanvasState.prototype.copyShape = function(shape) {
  "use strict";
  var newShape = JSON.parse(JSON.stringify(shape,["x","y","w","h","rotate","angle","type","options","prevMX","prevMY","sid"]));
  var shapeOptions = JSON.parse(JSON.stringify(shape.options));
  var bookingOptions = JSON.parse(JSON.stringify(shape.booking_options))
  newShape.options = shapeOptions;
  newShape.booking_options = bookingOptions;

  if (newShape.type != "line") {
  newShape.x = 10; //default
  newShape.y = 10; //default
  }
  newShape.sid = null; // default
  this.pasteReady = newShape;
  this.pasteMultiple_ = false;
  this.pasteList = [];
};
CanvasState.prototype.pasteMultiple = function(x_,y_) {
	"use strict";
	  var x,y;
	  if (x_ == null || x_=="undefined" || x_ == "") {
	     x = this.pastex;
	     y = this.pastey;
		} else {
		 x = x_;
		 y = y_;
		}
		// Calculate most left
	      var list = this.pasteList;
		  var mostLeft = 1000000;
		  var mostLeftShape = null;
		  var mostRight = -1000000;
		  var mostRightShape = null;
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
			      mostRight = listxy[i]
			   }
			} 
			for (var i = 1 ; i < 8; i+=2) {
			   if(listxy[i]<mostTop) {
				   mostTop = listxy[i];
			   }
			   if(listxy[i]>mostBottom) {
			      mostBottom = listxy[i]
			   }
			} 
		  }
		 
		 var difx = (mostRight + mostLeft)/2 - x;
		 var dify = (mostTop + mostBottom)/2 - y;
		 var sidsadded = [];
	     for (var s = 0 ; s < list.length ; s ++ ) {
		   var shape = list[s];
		   var newShape = JSON.parse(JSON.stringify(shape,["x","y","w","h","rotate","angle","type","options","prevMX","prevMY","sid"]));
	       var shapeOptions = JSON.parse(JSON.stringify(shape.options));
	       newShape.options = shapeOptions;
	       if (newShape.type != "line") {
	          newShape.x = 10; //default
	          newShape.y = 10; //default
	       }
	       newShape.sid = null; // default
	       this.pasteReady = newShape;
		   var newx = shape.x - difx;
		   var newy = shape.y - dify;
		   var sid_  =  randomString(12);
		   this.pasteShape(newx,newy,sid_);
		   sidsadded.push(sid_);
		 }
		 this.selection = null;
		 this.listSelected = [];
		 for (var i =  0 ; i < sidsadded.length ; i++) {
		   for(var s = 0 ; s < this.shapes.length ; s++) {
		     if(sidsadded[i]==this.shapes[s].sid) {
			    this.listSelected.push(this.shapes[s]);
			 }
		   }
		 }
		 if(this.listSelected.length==1) {
		     this.selection = this.listSelected[0];
			 updateSelectedOptions(this.selection)
		 } else {
		     updateSelectedOptions();
		 }

	    updateBookingOptions();
	    this.valid=false;
	}
	CanvasState.prototype.pasteShape = function(x_,y_,sid) {
	  "use strict";
	  var x,y;
	  if (x_ == null || x_=="undefined" || x_ == "") {
	     x = this.pastex;
	     y = this.pastey;
		} else {
		 x = x_;
		 y = y_;
		}

	  var w = this.pasteReady.w;
	  var h = this.pasteReady.h;
	  var type = this.pasteReady.type;
	  var options = JSON.parse(JSON.stringify(this.pasteReady.options));
	  var angle = this.pasteReady.angle;
	 if ( type == "line" ) {
	     var difx1 = this.pasteReady.options.x1 - this.pasteReady.x;
		 var dify1 = this.pasteReady.options.y1 - this.pasteReady.y;
		 var difx2 = this.pasteReady.options.x2 - this.pasteReady.x;
		 var dify2 = this.pasteReady.options.y2 - this.pasteReady.y;
		 options.x1 = x + difx1;
		 options.x2 = x + difx2;
		 options.y1 = y + dify1;
		 options.y2 = y + dify2;

	  } 
	  if(sid!=undefined) {
	    this.addShape(new Shape(this, x , y , w, h, type , options,angle ,sid));
	  } else {
	    this.addShape(new Shape(this, x , y , w, h, type , options,angle ));
	  }
	  this.valid=false;
	};
CanvasState.prototype.removeOutsideShapes  = function() {
    var shapesToRemove = [];
    for (var s = 0 ; s < this.shapes.length ; s ++ ) {
		var shape = this.shapes[s];
		var listxy = shape.getCorners();
		var anyInside = false;
         if((shape.x >= 0 && shape.x <= this.origWidth) && (shape.y >= 0 && shape.y <= this.origHeight)) {
		     
		 } else {

		    // Check all x's on outside (same side) OR all y's on outside (same side)
			if((listxy[0] <= 0 && listxy[2] <= 0 && listxy[4] <= 0  && listxy[6] <= 0) || 
		       (listxy[0] >= this.origWidth && listxy[2] >= this.origWidth && listxy[4] >= this.origWidth && listxy[6] >= this.origWidth) ||
			   (listxy[1] <= 0 && listxy[3] <= 0 && listxy[5] <= 0  && listxy[7] <= 0) || 
		       (listxy[1] >= this.origHeight && listxy[3] >= this.origHeight && listxy[5] >= this.origHeight && listxy[7] >= this.origHeight)) {
			   
		         shapesToRemove.push(shape);
			}
		 }
	  }
	 for (var s = 0 ; s < shapesToRemove.length ; s ++ ) { 
	    this.removeShape(shapesToRemove[s]);
	 }
}
CanvasState.prototype.removeShape = function(shape_) {
  "use strict";
  if(this.listSelected.length > 1 && this.listSelected.contains(shape_)) {
      this.listSelected.remove(shape_);
	  this.shapes.remove(shape);
	  if(this.listSelected.length==1) {
	      this.selection= this.listSelected[0];
		  updateSelectedOptions(this.selection);
		  updateBookingOptions();
	  }
	  this.valid = false;
  } else if (this.listSelected.length==1 && this.listSelected[0] == shape_) {
     this.listSelected = [];
	 this.selection = null;
	 this.shapes.remove(shape_);
	 this.valid = false;
 	 updateSelectedOptions();
	 updateBookingOptions();
  } else {
     this.shapes.remove(shape_);
	 this.valid = false;
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
   $('#canvas_wrapper').perfectScrollbar();
 $('#canvas_wrapper').perfectScrollbar('update');
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
     $('#canvas_wrapper').perfectScrollbar();
     $('#canvas_wrapper').perfectScrollbar('update');
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
  document.getElementById(state.canvas.id).height =state.height * resetZoom;
  state.zoom =1 ;
  var newWidth = state.width * resetZoom;
  var newHeight  = state.height * resetZoom;
  state.width = newWidth;
  state.height = newHeight;
  if (state.main) {
     $('#canvas_wrapper').perfectScrollbar();
     $('#canvas_wrapper').perfectScrollbar('update');
 }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders

CanvasState.prototype.getMouse = function(e) {
        "use strict";
        var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
        var parentOffset = $(this.canvas).parent().offset();

        mx = parseInt((e.pageX - parentOffset.left)/this.zoom);
        my = parseInt((e.pageY -  parentOffset.top)/this.zoom);

        // We return a simple javascript object (a hash) with x and y defined
        console.log(mx+" "+my)
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
function dbDottedRect (ctx,x,y,w,h,dotColor1,dotColor2,salpha,sw) {
  ctx.save();
 // ctx.lineWidth = sw;
 // ctx.strokeStyle = dotColor1;
 // ctx.globalAlpha = salpha;
  ctx.setLineDash([5,5]);
  dbDrawRect (ctx,x,y,w,h,dotColor1,"white",0,1,sw);
  ctx.lineDashOffset = -5;
  dbDrawRect (ctx,x,y,w,h,dotColor2,"white",0,1,sw);
  ctx.restore();
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
function allShapesSpreadVertical() {
  if(canvas_.listSelected.length > 2) {
      var list = canvas_.listSelected;
	  var sortedList = [];
	  var mostTop = 1000000;
	  var stop = {};
	  var mostBottom = -1000000;
	  var sbottom = {};
	  for (var s = 0 ; s < list.length ; s ++ ) {
	     var shp = list[s];
	     if(s==0) {
		    sortedList.push(shp);
		 } else {
		    var ind = 0;
		    for(var sl = 0 ; sl < sortedList.length ; sl++ ) {
			   if(shp.y > sortedList[sl].y) {
			       ind = sl+1;
			   } else {
			       break;
			   }
			}
			sortedList.splice(ind,0,shp);
		 }		 
	  }

	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
        if(shape.y < mostTop) {
		   mostTop = shape.y;
		   stop = shape;
		}
	  }
	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
        if(shape.y > mostBottom) {
		   mostBottom = shape.y;
		   sbottom = shape;
		}
	  }
	  var distance = sbottom.y - stop.y;
	  var step = distance / (list.length - 1);
	  var currentStep = stop.y;
	  for(var i = 1 ; i < sortedList.length-1 ; i++) {
	     currentStep += step;
		 var shape = sortedList[i];
		
		 if (shape.type=="line") {
		      var diff = currentStep - shape.y;
			  shape.options.y1 += diff;
			  shape.options.y2 += diff;
		 }
		 shape.y = currentStep;
		 shape.state.valid = false;
	  }
  }
}
function allShapesSpreadHorisontal() {
  if(canvas_.listSelected.length > 2) {
      var list = canvas_.listSelected;
	  var sortedList = [];
	  var mostLeft = 1000000;
	  var sleft = {};
	  var mostRight = -1000000;
	  var sright = {};
	  for (var s = 0 ; s < list.length ; s ++ ) {
	     var shp = list[s];
	     if(s==0) {
		    sortedList.push(shp);
		 } else {
		    var ind = 0;
		    for(var sl = 0 ; sl < sortedList.length ; sl++ ) {
			   if(shp.x > sortedList[sl].x) {
			       ind = sl+1;
			   } else {
			       break;
			   }
			}
			sortedList.splice(ind,0,shp);
		 }		 
	  }

	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
        if(shape.x < mostLeft) {
		   mostLeft = shape.x;
		   sleft = shape;
		}
	  }
	  for (var s = 0 ; s < list.length ; s ++ ) {
		var shape = list[s];
        if(shape.x > mostRight) {
		   mostRight = shape.x;
		   sright = shape;
		}
	  }
	  var distance = sright.x - sleft.x;
	  var step = distance / (list.length - 1);
	  var currentStep = sleft.x;
	  for(var i = 1 ; i < sortedList.length-1 ; i++) {
	     currentStep += step;
		 var shape = sortedList[i];
		
		 if (shape.type=="line") {
		      var diff = currentStep - shape.x;
			  shape.options.x1 += diff;
			  shape.options.x2 += diff;
		 }
		 shape.x = currentStep;
		 shape.state.valid = false;
	  }
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
		var mostLefts = 1000000;
		var listxy = shape.getCorners();
		
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
	  }
	  
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


function positionHint(orgx,orgy) {
  $("#canvas_hint").css("left",orgx+15+"px");
  $("#canvas_hint").css("top",orgy+20+"px");
}
function updateHint(text,color,save) {
  $("#canvas_hint").html(text);
  $("#canvas_hint").css("color",color)
  if(save!=undefined && save == true) {
     defaultHint = text;
	 defaultHintColor = color;
  } else {
    tempHintUsed = true;
  }
}
function restoreDefaultHint() {
  if(tempHintUsed) {
     updateHint(defaultHint,defaultHintColor)
	 tempHintUsed = false;
  }
}
function showHint(){
if(globalShowHint) {
  $("#canvas_hint").show();
}
}
function hideHint(){
$("#canvas_hint").hide();
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