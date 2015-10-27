
function TShape(state,sid, x, w,h, type,options) {
  "use strict";
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.state = state;
  this.x = x || 0;
  this.w = w || 0;
  this.h = h || 0;
  this.y=  0;
  this.image = null;
  this.clockimg = null;
  this.sid = sid;
  if (type=="drag") {
     this.color=state.type_drag_color;
  } else if(type=="opened") {
     this.color=state.type_opened_color;
  } else if(type=="ordered") {
     this.color=state.type_ordered_color;
  } else if(type=="book") {
     this.color=state.type_book_color;
  } else if(type=="passed") {
     this.color=state.type_passed_color;
     this.image = document.getElementById("server_passed_back");
     this.clockimg =  document.getElementById("server_clock20");
  } else  {
     this.color="white";
  }
  this.sfillAlpha = state.sfillAlpha;
  if (type=="opened" ) {
     this.sfillAlpha = 1;
  }
  this.type = type;// place_closed , ordered , free , book , drag ...
  this.options = options;
  this.tsid = "T_"+randomString(12);
}

// Draws this shape to a given context
TShape.prototype.draw = function(ctx, optionalColor) {
  "use strict";
  ctx.fillStyle = this.color;
  var fillX = this.x;
  if (this.type == "drag") {
	//var tmp = ctx.strokeStyle;
	//ctx.strokeStyle = this.color;
   // ctx.strokeRect(this.x-1,0,2,this.h);  
   // ctx.strokeStyle = tmp;
  } else if (this.type == "passed") {
	var tmp  = ctx.globalAlpha  ;
	ctx.globalAlpha = 0.5;
	ctx.drawImage(this.image,this.x,0,this.w,this.h,this.x,0,this.w,this.h);
	dbLine(ctx,this.w,0,this.w,this.h,1,1,"#993333")
	ctx.globalAlpha = 0.9;
	ctx.drawImage(this.clockimg,this.w-25,5);
	ctx.globalAlpha = tmp;
  } else {
    dbDrawRectT  (ctx,fillX,0,this.w,this.h,
	              this.color,
				  this.color,
				  this.sfillAlpha,
				  1,
				  0);
  }
};
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
// Determine if a point is inside the shape's bounds
TShape.prototype.contains = function(ctx,mx, my) {
  "use strict";
  var mxt = mx;
  var myt = my;
  var topCornerX = this.x;
  var topCornerY = 0;

  var isInside =   (topCornerX <= mxt) && (mxt <= topCornerX + this.w ) &&
                   (topCornerY <= myt) && (myt <= topCornerY + this.h );

  return isInside
};

function TCanvasState(canvas) {
  "use strict";
  // **** First some setup! ****
  
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.zoom = 1.0;
   this.bg_color_from = "#eee";
    this.bg_color_to = "#bec8d2";
  this.line_color = "black";
  this.type_drag_color="#00509D";
  this.type_opened_color="white";
  this.type_ordered_color="red";
  this.type_book_color="rgb(83, 124, 180)";
  this.type_passed_color="rgb(55, 55, 55)";
  this.sfillAlpha = 0.65;
  this.step=15;
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
  this.sidsIncluded = {};
  this.highlightSid = "";
  this.tlist = {};
  this.dragging = false; // Keep track of when we are dragging
  this.resizeDragging = false; // Keep track of resize
  this.expectResize = -1; // save the # of the selection handle 
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
 
  
  
  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

  canvas.addEventListener('mousedown', function(e) {
  
    var mouse, mx, my, shapes, l, i, mySel;

    mouse = myState.getMouse(e);
    mx = mouse.x;
    my = mouse.y;
	var mox = mouse.orgx;
	var moy = mouse.orgy;
    shapes = myState.shapes;
    l = shapes.length;
    for (i = l-1; i >= 0; i -= 1) {
      if (shapes[i].contains(myState.ctx ,mx, my) && shapes[i].type != "opened") {
	    if(myState.selection != null) {
		  if (myState.selection.type=="closed" || myState.selection.type=="passed" ) {
		      myState.selection.sfillAlpha=1;
		  } else {
		      myState.selection.sfillAlpha=myState.sfillAlpha;
		   }
		}
        mySel = shapes[i];
		mySel.sfillAlpha=1;
        myState.dragoffx = mx - mySel.x;
		if(mySel.type=="drag") {
          myState.dragging = true;
		  }
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it

    if (myState.selection) {
	  if (myState.selection.type=="closed" || myState.selection.type=="passed") {}
	  else {
	    myState.selection.sfillAlpha=myState.sfillAlpha;
		}
      myState.selection = null;
	  myState.canvasDrag  = true;
	//  myState.dragging = true;
	  myState.prevCmx = mox ;
      myState.prevCmy = moy ;
      myState.valid = false; // Need to clear the old selection border
    } else {
	  myState.canvasDrag  = true;
	//  myState.dragging = true;
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
		//document.getElementById('mouse_pos').value = "X = "+mx+" Y="+my + "OX="+orgx+" OY="+orgy;
		if (myState.dragging){
			  mouse = myState.getMouse(e);
			  // We don't want to drag the object by its top-left corner, we want to drag it
			  // from where we clicked. Thats why we saved the offset and use it here
			  var tempx = mouse.x - myState.dragoffx;
			  if(Math.abs(tempx - myState.selection.x) >= myState.step) {
			    myState.selection.x = mouse.x - myState.dragoffx;  
			    myState.valid = false; // Something's dragging so we must redraw
			  }
      }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
    myState.resizeDragging = false;
    myState.expectResize = -1;
    if (myState.selection !== null) {

    }
  }, true);


  // **** Options! ****

  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}
TCanvasState.prototype.addShape = function(shape) {
	// Bottom --> Top : opened ,  ordered|book , passed , drag
  "use strict";
  var added_at = -1;
  if(shape.type == "passed") {
    this.passedShape = shape;
  }
  if(shape.type == "drag") {
    this.shapes.push(shape);
    this.dragShape = shape;
  } else if (shape.type == "opened") {
	  this.shapes.unshift(shape);
	  added_at = this.shapes.length;
  } else {
	 // ordered|book , passed
	if (this.shapes.length == 0 ) {
		this.shapes.unshift(shape);
		 added_at = 0;
	} else {
		var idx = -1;
		for (var i = 0;i<this.shapes.length;i++) {
			var listShapeType= this.shapes[i].type;
			if (shape.type=="ordered" || shape.type=="book") {
				if(i == this.shapes.length-1) {
					// last and still not found
					 this.shapes.push(shape);
					 added_at = this.shapes.length;
					 break;
				} else {
					if (listShapeType == "opened") {
						// next
					} else {
						idx = i;
						break;
					}
				}
			} else {
				// passed
				if(i == this.shapes.length-1) {
					// last and still not found
					 this.shapes.push(shape);
					 added_at = this.shapes.length;
					 break;
				} else {
					if (listShapeType == "opened" || listShapeType == "ordered" || listShapeType == "book") {
						// next
					} else {
						idx = i;
						break;
					}
				}
			}
		}
		if (idx > -1) {
			this.shapes.splice(idx, 0, shape);
			 added_at = idx;
		}
	}
  }
   if(shape.type == "book"){
		if(this.tlist[shape.sid]==undefined) {
		  this.tlist[shape.sid] = [];
		  this.tlist[shape.sid].push(shape);
		} else {
		  this.tlist[shape.sid].push(shape);
		}
	} 
  this.valid = false;
};


TCanvasState.prototype.removeTshapeList = function(sid) {
  if(this.tlist[sid]!= undefined) {
    var tlist__ = this.tlist[sid];
	for (var t = 0 ; t < tlist__.length ; t++) {
	  var tshape = tlist__[t];
	  this.removeShape(tshape.tsid);
	}
	this.tlist[sid] = [];
	this.sidsIncluded[sid] = 0;
	this.highlightSid = "";
  }
}
TCanvasState.prototype.addTshapeList = function(sid) {
		  var requestFromDate = bookingVars.date1970; 
		  var clientOffset = bookingVars.clientOffset;
		  var placeOffset = bookingVars.placeOffset;
		  var requestPeriod = bookingVars.period;
		  var placeOpen = bookingVars.placeOpen;
		  var shapesList = bookingVars.shapesBooked;
          var minRange = 15;
		  var requestFromDateUTC = requestFromDate + clientOffset*60*60;  
          var shapeBookList  = [];
          for (var sl = 0 ; sl < bookingVars.shapesBooked.length ; sl++) {
		    if(bookingVars.shapesBooked[sl].sid == sid) {
			  shapeBookList = bookingVars.shapesBooked[sl].ordersList;
			  break;
			}
		  }
		  
		  for (var ind2 = 0 ; ind2 < shapeBookList.length ; ind2++) {
			  var from = shapeBookList[ind2].from;        // In UTC seconds from 1970
			  var to  = shapeBookList[ind2].to;           // In UTC seconds from 1970
			  var UTCsecFrom = from -  requestFromDateUTC;// In UTC seconds from 1970 
			  var UTCsecTo = to -  requestFromDateUTC;    // In UTC seconds from 1970
			  var PlaceRelativeFrom = UTCsecFrom + placeOffset*60*60;
			  var PlaceRelativeTo = UTCsecTo + placeOffset*60*60;
			  var fromSteps = PlaceRelativeFrom/minRange/60;
			  var toSteps = PlaceRelativeTo/minRange/60;
			  var rangeSteps = toSteps - fromSteps;
			  fromc = fromSteps * this.step ;
			  toc = rangeSteps * this.step;

			  this.addShape( new TShape(tcanvas_,sid, fromc , toc ,tcanvas_.height, 'book' , 1 ));
		      
		  }
		  this.sidsIncluded[sid] = 1;
		  this.highlightSid = sid;
}
TCanvasState.prototype.setList = function(list) {
  "use strict";
  this.shapes = list; 
  this.valid = false;
};
TCanvasState.prototype.removeShape = function(tsid) {
  "use strict";
    var shape;
	var idx;
  for (var i = 0; i < this.shapes.length; i += 1) {
        shape = this.shapes[i];
		if(shape.tsid  == tsid) {
		    idx = this.shapes.indexOf(shape);
		}
	}
  this.shapes.splice(idx,1); 
  this.valid = false;
};
TCanvasState.prototype.empty = function() {
  "use strict";  
  this.shapes = []; 
  this.valid = false;
};
TCanvasState.prototype.clear = function() {
  "use strict";
  this.ctx.clearRect(0, 0, this.width, this.height);
  var tmp = this.ctx.fillStyle;
  var grd=this.ctx.createLinearGradient(0,0,0,this.height);
  grd.addColorStop(0,this.bg_color_from);
  grd.addColorStop(1,this.bg_color_to);
  this.ctx.fillStyle = grd;
  this.ctx.fillRect(0, 0, this.width, this.height);
  this.ctx.fillStyle = tmp;
};

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
TCanvasState.prototype.draw = function() {
  "use strict";
  var ctx, shapes, l, i, shape, mySel;
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    ctx = this.ctx;
    shapes = this.shapes;
    this.clear();
    

    // draw all shapes
    l = shapes.length;

    for (i = 0; i < l; i += 1) {
      shapes[i].draw(ctx);
      if (shapes[i].type == "passed") {
    	 // ctx.strokeStyle = "grey";
    	 // ctx.strokeRect(0,0,shapes[i].w,shapes[i].h);
      }
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection !== null) {
      if (this.selection.type != "passed" && this.selection.type != "opened"  && this.selection.type != "drag") {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      mySel = this.selection;
	  var fillX = mySel.x;
	  var fillY = mySel.y;
	  
	  ctx.globalAlpha = 1;
      ctx.strokeRect(fillX,fillY,mySel.w,mySel.h);
	  ctx.strokeStyle = "white";
	  ctx.globalAlpha = 1;
      }
    }

    // ** Add stuff you want drawn on top all the time here ** 
    ctx.lineWidth = 1;
    ctx.strokeStyle = "grey";
    //ctx.strokeRect(0,0,this.width,this.height);   
//	dbRoundRect (ctx,0,0,this.width,this.height,ctx.strokeStyle,"white",0,1,1,5)
    this.valid = true;
  }
};


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
TCanvasState.prototype.getMouse = function(e) {
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


function dbDrawRectT(ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw) {
  ctx.lineWidth = sw;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  if (sw == 0) {
    ctx.strokeStyle = ctx.fillStyle;
  }


  ctx.globalAlpha = alpha;
  ctx.fillRect(x,y,w,h);
  ctx.globalAlpha = salpha;
  if (sw > 0) {
    ctx.strokeRect(x,y,w,h);
  }
  ctx.globalAlpha = 1; 
  ctx.lineWidth = 1;
}
