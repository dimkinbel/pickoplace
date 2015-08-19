  //   pshape.sid = SID
  //   pshape.name = NAME
  //   pshape.floorID = FLOORID
  //   pshape.x = X
  //   pshape.y = Y
  //   pshape.bookings = [];
function TimelineDiv(state,id) {
  this.id=id;
  this.state = state;
}
TimelineDiv.prototype.redraw = function() {
   var height = 50;

   var shapeLineHeight = this.state.shapeLineHeight  ;

	var width = this.state.width - shapeLineHeight;
	var canvasPeriod = this.state.drawPeriodto - this.state.drawPeriodfrom ; // total seconds in canvas

	var oneSecondInPixels = width / canvasPeriod;
   var leftOffset = shapeLineHeight;
   document.getElementById(this.id).innerHTML = "";
   document.getElementById(this.id).style.width=width+"px";
   document.getElementById(this.id).style.height=height+"px";
   var withborder_left = shapeLineHeight - 1.5;
   $("#"+this.id).css("left",withborder_left + "px");
   var appendData = "<div id='timeline_bottom' class='timeline_bottom'></div>";
    $("#"+this.id).append(appendData);
	var ttop = parseInt(height-1);
   $("#timeline_bottom").css("top",ttop);
   var periodwidth = width ;
   $("#timeline_bottom").css("width",periodwidth + shapeLineHeight+"px");
   $("#timeline_bottom").css("left",-1*shapeLineHeight+"px");
   var tline_hours_px=[];
   var tline_hours_sec = [];
   var start_tline = parseFloat(0);
   var startSeconds = 0;
   var startSecondsGlobal = this.state.drawPeriodfrom ;
   while( startSecondsGlobal <= this.state.drawPeriodto ) {
     tline_hours_px.push(start_tline);
	 tline_hours_sec.push(startSecondsGlobal);
	 startSecondsGlobal+=3600;
	 startSeconds= startSecondsGlobal - this.state.drawPeriodfrom;
	 
	 var startSecondspx = startSeconds*oneSecondInPixels;
	 start_tline = parseFloat(startSecondspx.toFixed(2));
   }

   for (var i = 0; i < tline_hours_px.length ; i++) {
     var hours_px = tline_hours_px[i];
	 var hoursString = hours_px.toString();
	 var divid = "div_hours_"+hoursString.replace(/\./, "-");
	 var appendData = "<div id='"+divid+"' class='timeline_line'></div>";
	 $("#"+this.id).append(appendData);
	 $("#"+divid).css("left",hours_px+"px");
	 if (tline_hours_sec[i]/3600/24 % 1 == 0) {
		 var top_ = 0;
		 $("#"+divid).css("top",top_+"px");
		 $("#"+divid).css("height","50px"); 
	 } else {
		 var top_ = height - 5;
		 $("#"+divid).css("top",top_+"px");
		 $("#"+divid).css("height","5px");	 
	 }
   }
   var started = false;
   var dcount = 0;
   var Date_;
   var left_ = 0;
   var d = new Date();
   var clientOffset = d.getTimezoneOffset();
   var appendData = "<div id='canvas_timeline_dates'></div>"
   $("#"+this.id).append(appendData);
   $("#canvas_timeline_dates").css("width",width + "px");
   for (var i = 0; i < tline_hours_px.length ; i++) {
      if ((tline_hours_sec[i]/3600/24 % 1 == 0) || (i == tline_hours_px.length - 1) || (i==0)) {
	   if(!started) {
	     started = true;
	     dcount ++ ;
	     var appendData = " <div class='day_div' id='day_div_"+dcount+"'><div class='inner_day_div_left' id='inner_day_div_left_"+dcount+"'></div><div class='inner_day_div_right' id='inner_day_div_right_"+dcount+"'></div></div>";
		  Date_ = new Date(parseInt(tline_hours_sec[i] * 1000 + clientOffset * 60* 1000));

		} else {
		  $("#canvas_timeline_dates").append(appendData);
		  var day = Date_.getDate();
	      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	      var mon = monthNames[Date_.getMonth()];
		  document.getElementById("inner_day_div_left_"+dcount).innerHTML = day+""+mon;
		  document.getElementById("inner_day_div_right_"+dcount).innerHTML = day+""+mon;
		  $("#day_div_"+dcount).css("left",left_+"px");
		  var width_ = tline_hours_px[i] - left_;
		  left_ += width_;
		  $("#day_div_"+dcount).css("width",width_+"px");
		  if(i < tline_hours_px.length - 1) {
		      dcount ++ ;
	          var appendData = " <div class='day_div' id='day_div_"+dcount+"'><div class='inner_day_div_left' id='inner_day_div_left_"+dcount+"'></div><div class='inner_day_div_right' id='inner_day_div_right_"+dcount+"'></div></div>";
		      Date_ = new Date(parseInt(tline_hours_sec[i] * 1000 + clientOffset * 60* 1000));
		  }
		}
	  }
   }
   
   appendData = "<div id='start_time' class='canvas_times_div'></div>"
   $("#"+this.id).append(appendData);
   appendData = "<div id='end_time' class='canvas_times_div'></div>"
   $("#"+this.id).append(appendData);
   Date_ = new Date(parseInt(this.state.drawPeriodfrom * 1000 + clientOffset * 60 * 1000));
   var hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
   var min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
   document.getElementById("start_time").innerHTML = hour_+":"+min_;
   Date_ = new Date(parseInt(this.state.drawPeriodto * 1000 + clientOffset * 60* 1000));
   hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
   min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
   document.getElementById("end_time").innerHTML = hour_+":"+min_;
   $("#start_time").css("left","0px");
   $("#start_time").css("top","18px");
   $("#end_time").css("right","0px");
   $("#end_time").css("top","18px");
   
   appendData = "<div id='current_time_line' ><div id='current_time_value' class='canvas_times_div_current'></div></div>"
   $("#"+this.id).append(appendData);
   this.updateCurrent(0);
   
   appendData = "<div id='now_time_line'  title='Current Time'><div id='now_time_value' title='Current Time'></div></div>"
   $("#"+this.id).append(appendData);
   this.updateNowTime();
   
}
TimelineDiv.prototype.updateNowTime = function() {
    var offset = this.state.offset;
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * offset));
	var hour_ = nd.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
    var min_ = nd.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
	document.getElementById("now_time_value").innerHTML = hour_+":"+min_;
	
	var placeSeconds = nd.getTime()/1000;
	var secondsOfset = placeSeconds - d.getTimezoneOffset() * 60 - this.state.drawPeriodfrom;
	var fromPerD = new Date(this.state.drawPeriodfrom * 1000);
	var pixels = secondsOfset * this.state.oneSecondInPixels;
	if(pixels>=0 && (pixels <= this.state.width - this.state.shapeLineHeight)) {
	    $("#now_time_line").css("display","");
		$("#now_time_line").css("left",pixels+"px");
		var scrollH = document.getElementById(tl_canvas.scrollID).style.height;
		var scrH = parseInt(scrollH.replace(/px/,''));
		var stateH = this.state.height;
		var lessH = scrH <= stateH ? scrH : stateH;
		var height__ = lessH + 10;
		$("#now_time_line").css("height",height__ + "px");
	} else {
	    $("#now_time_line").css("display","none");
	}
}
TimelineDiv.prototype.updateCurrent = function(mx) {
    var sec = mx/this.state.oneSecondInPixels;
	var left__ = mx - 1;
	$("#current_time_line").css("left",left__+"px");
	var d = new Date();
    var clientOffset = d.getTimezoneOffset();
	var Date_ = new Date(parseInt((this.state.drawPeriodfrom + sec) * 1000 + clientOffset * 60 * 1000));
    var hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
    var min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
	document.getElementById("current_time_value").innerHTML = hour_+":"+min_;
}
function PShape(state , sid , name , floorID , x , y , bookings) {
   this.state = state;
   this.sid = sid;
   this.name = name;
   this.floorID = floorID;
   this.x = x;
   this.y = y;
   this.bookings = [];
   if (bookings != null && bookings != undefined) {
     this.bookings = bookings;
   }
}
PShape.prototype.addBooking = function(bshape) {
   this.bookings.push(bshape);
   this.state.addShape(bshape);
  // this.state.organizeShapes();
}

function BShape(state, from , to , bid , persons , type , name , sid) {
  "use strict";
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.state = state;
  this.x = 0;
  this.w = 0;
  this.h = 0;
  this.y = 0;
  
  if (type=="booked") {
     this.color=state.type_book_color;
	 this.colorto=state.type_book_color;
  } 
  if (type=="closed") {
     this.color="grey";
	 this.colorto="grey";
  } 
  this.sfillAlpha = state.sfillAlpha;

  this.from = from;
  this.to = to;
  this.type = type;
  this.bid = bid;
  this.persons = persons;
  this.name = name;
  this.sid = sid;
  this.bsid = "TB_"+randomString(12);
}

// Draws this shape to a given context
BShape.prototype.draw = function(ctx, optionalColor) {
  "use strict";

  ctx.fillStyle = this.state.type_book_color;
  if(this.type == "booked") {
    this.color = this.state.type_book_color;
    this.colorto = this.state.type_book_colorto;
  } else if (this.type == "closed" ) {
    this.color = this.state.type_closed_color;
    this.colorto = this.state.type_closed_colorto;
  }
  
  var grd=ctx.createLinearGradient(this.x,this.y,this.x,this.y + this.h);
  grd.addColorStop(0,this.color);
  grd.addColorStop(1,this.colorto);
  
  var canvasPeriod = this.state.drawPeriodto - this.state.drawPeriodfrom; // total seconds in canvas
  var oneSecondInPixels = this.state.width / canvasPeriod;
  var pixelsOffset = this.state.offset * 3600 * oneSecondInPixels;

    dbDrawRectT  (ctx,this.x,this.y,this.w,this.h,
	              "white",
				  grd,
				  this.sfillAlpha,
				  1,
				  0);

	//dbLine(ctx,this.x + 2 ,this.y+2,this.x + 2,this.y + this.h - 2 ,2,1,"white");
	//dbLine(ctx,this.x + 2 ,this.y + this.h - 2,this.x + this.w -2,this.y + this.h - 2 ,2,1,"white");
};

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
// Determine if a point is inside the shape's bounds
BShape.prototype.contains = function(ctx,mx, my) {
  "use strict";
  var mxt = mx;
  var myt = my;
  var canvasPeriod = this.state.drawPeriodto - this.state.drawPeriodfrom; // total seconds in canvas
  var oneSecondInPixels = this.state.width / canvasPeriod;
  //var pixelsOffset = this.state.offset * 3600 * oneSecondInPixels;
  var topCornerX = this.x ;
  var topCornerY = this.y;

  var isInside =   (topCornerX <= mxt) && (mxt <= topCornerX + this.w ) &&
                   (topCornerY <= myt) && (myt <= topCornerY + this.h );

  return isInside
};

function BCanvasState(canvas,pfrom,pto,offset) {
  "use strict";
  // **** First some setup! ****
  
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.origHeight = canvas.height;
  this.origHeightReset = canvas.height;
  this.scrollID = "canvas_slimscroll";
  this.zoom = 1.0;
  this.bg_color = "white";
  this.line_color = "black";
  this.type_drag_color="blue";
  this.type_closed_color="rgba(187, 187, 187, 0.47)";
  this.type_closed_colorto="rgba(187, 187, 187, 0.47)";
  this.type_ordered_color="red";
  this.type_book_color="rgb(0, 134, 191)";
  this.type_book_colorto="rgb(0, 83, 143)";
  this.sortType = "time"; // nameabc , custom , xy , time ,bid
  this.bidSort = "";
  this.drawPeriodfrom = pfrom;
  this.shapeLineHeight = 80;
  this.oneSecondInPixels = 1;
  this.fromOrig = pfrom;
  this.toOrig = pto;
  this.drawPeriodto = pto;
  this.offset = offset;
  this.type_passed_color="rgb(55, 55, 55)"
  this.sfillAlpha = 1;
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
  this.SIDsorted = [];
  this.pshapes = {};
  
  //   pshape.sid = SID
  //   pshape.name = NAME
  //   pshape.floorID = FLOORID
  //   pshape.x = X
  //   pshape.y = Y
  //   pshape.bookings = [];
  //   pshape.bookings[i].bid = BID
  //   pshape.bookings[i].from = FROM;
  //   pshape.bookings[i].to = TO;
  //   pshape.bookings[i].persons = PERSONS;
 
  this.shapes = [];  // the collection of things to be drawn
  this.listSelected = [];
  this.sameInList = null;
  this.closeShapes = [];
  this.closeSelected = null;
  this.shapeViews = {};
  this.hoverSidName = null;
  this.hoverSid = null;
  this.bidMouseOver = null;
  this.timeline = 40;
  this.dragging = false; // Keep track of when we are dragging
  this.resizeDragging = false; // Keep track of resize
  this.expectResize = -1; // save the # of the selection handle 
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
 
  this.tooltipShape = null;
  this.tooltipmx = 0;
  this.tooltipmy = 0;
  this.tooltipStart = 0;
  this.tooltipText = ""
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
      if (shapes[i].contains(myState.ctx ,mx, my)) {
			mySel = shapes[i];
            if(e.ctrlKey ) {
			   if(myState.listSelected.length == 0 ) {		        
					mySel.sfillAlpha=1;
					myState.dragoffx = mx - mySel.x;
					myState.selection = mySel;
					myState.listSelected = [];
					myState.listSelected.push(mySel);
					myState.closeSelected = null;
					myState.valid = false;
					myState.sameInList = null;
					return; 
			   } else {
			        if(myState.listSelected.contains(shapes[i])) {
						if(myState.listSelected.length > 1 && e.which != 3) {
                            myState.listSelected.remove(shapes[i]);
						}
					} else {
					   myState.selection = mySel;
					   myState.listSelected.push(mySel)
					}
					
					var same = true;
					var tmp_ = null;
					if (myState.listSelected.length > 1) {
						for (var b = 0 ; b < myState.listSelected.length ; b++) {
						   var bid = myState.listSelected[b].bid;					   
						   if (tmp_ == null) {
							 tmp_ = bid;
						   } else {
							 if(tmp_!=bid) {
							   
							    same = false;
								break;
							 }
						   }
						}
					  if(same) {
					     myState.sameInList = tmp_;
					  } else {
					      myState.sameInList = null;
					  }
					} else {
					  myState.sameInList = null;
					}
					myState.closeSelected = null;
					myState.valid = false;
					return;					
			   }		
			} else {
			    if (myState.listSelected.length != null && myState.listSelected.contains(mySel) && e.which == 3 ) {
				   // Not ctrl pushed but right clicked on already selected shape - do nothing
				   return;
				}
				mySel.sfillAlpha=1;
				myState.dragoffx = mx - mySel.x;
				myState.selection = mySel;
				myState.listSelected = [];
				myState.listSelected.push(mySel);
				myState.closeSelected = null;
				myState.valid = false;
				this.sameInList = null;
				return;
			}
		  }
	  
    }
	
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    myState.sameInList = null;
    if (myState.selection || myState.listSelected.length > 0) {
	  myState.selection.sfillAlpha=myState.sfillAlpha;
      myState.selection = null;
	  myState.listSelected = [];
	  myState.canvasDrag  = true;
	//  myState.dragging = true;
	  myState.prevCmx = mox ;
      myState.prevCmy = moy ;
      myState.valid = false; // Need to clear the old selection border
    } else {
	  myState.canvasDrag  = true;
	  myState.prevCmx = mox ;
      myState.prevCmy = moy ;	
	}
	var cshapes = myState.closeShapes;
    l = cshapes.length;
    for (i = l-1; i >= 0; i -= 1) {
      if (cshapes[i].contains(myState.ctx ,mx, my)) {
	     myState.closeSelected = cshapes[i];
	     return;
	  }
	}
	myState.closeSelected = null;
	
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    var mouse = myState.getMouse(e),
        mx = mouse.x,
        my = mouse.y,

		mox = mouse.orgx,
		moy = mouse.orgy,
		orgx = mouse.orgx , orgy = mouse.orgy ,
        oldx, oldy, oldw, oldh ,i, cur;
		if (mx >= myState.shapeLineHeight) {
		    timelinediv.updateCurrent(mx - myState.shapeLineHeight);
		}
		//document.getElementById('mouse_pos').value = "X = "+mx+" Y="+my + "OX="+orgx+" OY="+orgy;
		 var shapes = myState.shapes;
         var l = shapes.length;
		 var contains = false;
         for (i = l-1; i >= 0; i -= 1) {
		  if (shapes[i].contains(myState.ctx ,mx, my)) {
		    this.style.cursor='pointer';
			myState.bidMouseOver = shapes[i].bid;
			contains = true;
		  }
	    }
		var linehover = -1;
		for (var l = 0 ; l < myState.SIDsorted.length ; l++) {
		  var from_ = l*myState.shapeLineHeight+2;
		  var to_  = (l+1)*myState.shapeLineHeight+2;
		   if (from_ < my && my <= to_) {
		       linehover = l;
		   }
		}
		if (!contains) {
		   this.style.cursor='auto';
		   myState.bidMouseOver = null;
		}
		if(linehover > -1) {
		   myState.hoverSidName = myState.shapeViews[myState.SIDsorted[linehover]].booking_options.givenName;
		   myState.hoverSid = myState.SIDsorted[linehover];
		} else {
		   myState.hoverSidName = null;
		   myState.hoverSid = null;
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
BCanvasState.prototype.sort = function() {
  //this.sortType = "sidabc"; // nameabc , custom , xy , time 
  //this.bidSort = "";
    if (this.sortType == "sidabc") {
        this.SIDsorted.sort();
    }
	if (this.sortType == "nameabc" ) {
	    var nameSorted = [];
		var SortObject;
		for (p = 0 ; p < this.SIDsorted.length ; p++) {
		   var pshape = this.pshapes[this.SIDsorted[p]]
		      SortObject[pshape.name] = pshape.sid;
		}
        var keys = [], k, i, len;
		for (k in SortObject) {
			if (SortObject.hasOwnProperty(k)){
				keys.push(k);
			}
		}
        keys.sort();
		len = keys.length;
        for (i = 0; i < len; i++) {
            nameSorted.push(keys[i]);             
        }
		this.SIDsorted = nameSorted;
    }
	if (this.sortType == "time" ) {
	        var offset = this.offset;
            var d = new Date();
            var utc = d.getTime() ;
            var nd = new Date(utc);
	        var currentUTCseconds = nd.getTime()/1000;
	        var timeSorted = [];

		for (p = 0 ; p < this.SIDsorted.length ; p++) {
		    var bookings = this.pshapes[this.SIDsorted[p]].bookings;
			var any_next = false;
			var mindistance = 10000000000;
			var sid = this.SIDsorted[p] ;
			
			for (var b = 0 ; b < bookings.length ; b++ ) {
			   var from = bookings[b].from ; // UTC from seconds;			   
			   if ( from - currentUTCseconds < mindistance && from - currentUTCseconds > 0) {
			       mindistance = from - currentUTCseconds;
				   
			   }
			}
			var SortObject = {} ;
			SortObject.from = mindistance;
			SortObject.sid = sid;
			
			if (mindistance < 10000000000) {
			   if (timeSorted.length == 0) { timeSorted.push(SortObject);} else {
			      var ind = -1;
			      for (var i = 0 ; i < timeSorted.length ; i++) {
				     if(mindistance >= timeSorted[i].from) { }
					 else {
					    ind = i;
						break;
					 }
				  }
				  if (ind == -1) {
				     timeSorted.push(SortObject);
				  } else {
				     timeSorted.splice(ind, 0, SortObject);
				  } 
			   }
			} else {
			  timeSorted.push(SortObject);
			}
		}
		var timesortedArray = [];
		for (var i = 0 ; i < timeSorted.length ; i++) {
		   timesortedArray.push(timeSorted[i].sid);
		}
		this.SIDsorted = timesortedArray;
	}
}
BCanvasState.prototype.selectPlaces = function() {
   var list_ = this.listSelected;
   if (list_.length > 0) {
	   for (var f = 0 ; f < floorCanvases.length ; f++ ) {
		  floorCanvases[f].listSelected = [];
	   }
	   for (var b = 0 ; b < list_.length ; b++) {
		 var sid = list_[b].sid;
		 var shape = this.shapeViews[sid];
		 for (var f = 0 ; f < floorCanvases.length ; f++ ) {
		   if (floorCanvases[f].shapes.contains(shape)) {
			 floorCanvases[f].listSelected.push(shape);
		   }
		 }
	   }
	   for (var f = 0 ; f < floorCanvases.length ; f++ ) {
		  floorCanvases[f].valid=false;
	   }
   } else {
      var sid = this.hoverSid;
	  if(sid != null) {
	     var shape = this.shapeViews[sid];
	     for (var f = 0 ; f < floorCanvases.length ; f++ ) {
		      floorCanvases[f].listSelected = [];
			  if (floorCanvases[f].shapes.contains(shape)) {
			    floorCanvases[f].listSelected.push(shape);
				floorCanvases[f].valid=false;
		      }
	      }
	  }
   }
}
BCanvasState.prototype.openDetails = function() {
   var shape = this.selection;
   if (shape != null) {
      var bid = shape.bid;
      this.selectSameBooking();
	  this.selectPlaces();
	  DisplayBooking(bid)
   }
}
BCanvasState.prototype.selectSameBooking = function() {
   var shape = this.selection;
   if (shape != null) {
      var sbid = shape.bid;
	  var list_ = []
	  for (var s = 0 ; s < this.shapes.length ; s++) {
	     if ( this.shapes[s].bid == sbid) {
			list_.push(this.shapes[s]);
		 }
	  }
	  this.sameInList = sbid;
	  this.listSelected = list_;
	  this.valid=false;
   }
}
BCanvasState.prototype.selectedUP = function() {
   var sid = this.hoverSid ;
   if(sid != null) {
    this.sortType = "custom";
	var sidCurrent = -1;
	  for (p = 0 ; p < this.SIDsorted.length ; p++) {
	    if(this.SIDsorted[p]==sid) {
		   sidCurrent = p;		
		}
	  }
	  if(sidCurrent > 0) {
	     var sidPrevIdx = this.SIDsorted[sidCurrent-1];
		 this.SIDsorted[sidCurrent-1] = sid;
		 this.SIDsorted[sidCurrent]=sidPrevIdx;
	  }
	  this.organizeShapes();
	  this.valid=false;
   }
}
BCanvasState.prototype.selectedDown = function() {
   var sid = this.hoverSid ;
   if(sid != null) {
    this.sortType = "custom";
	var sidCurrent = -1;
	  for (p = 0 ; p < this.SIDsorted.length ; p++) {
	    if(this.SIDsorted[p]==sid) {
		   sidCurrent = p;		
		}
	  }
	  if(sidCurrent < this.SIDsorted.length - 1) {
	     var sidPrevIdx = this.SIDsorted[sidCurrent+1];
		 this.SIDsorted[sidCurrent+1] = sid;
		 this.SIDsorted[sidCurrent]=sidPrevIdx;
	  }
	  this.organizeShapes();
	  this.valid=false;
   }
}
BCanvasState.prototype.lineSmaller  = function() {
  this.origHeight *= 0.9;
  this.organizeShapes();
  this.valid=false;
  timelinediv.redraw();
}
BCanvasState.prototype.lineBigger  = function() {
  this.origHeight *= 1.1;
  this.organizeShapes();
  this.valid=false;
  timelinediv.redraw();
}
BCanvasState.prototype.lineReset  = function() {
  this.origHeight = this.origHeightReset;
  this.organizeShapes();
  this.valid=false;
  timelinediv.redraw();
}
BCanvasState.prototype.selectedTop = function() {
   if(this.listSelected.length > 1) {
       for (var l = 0 ; l < this.listSelected.length ; l++) {
		   var sid = this.listSelected[l].sid; ;
		   if(sid != null) {
			this.sortType = "custom";
			var sidCurrent = -1;
			  for (p = 0 ; p < this.SIDsorted.length ; p++) {
				if(this.SIDsorted[p]==sid) {
				   sidCurrent = p;	
                   break;				   
				}
			  }
			  var sidPrevIdx = this.SIDsorted[0];
			  this.SIDsorted[0] = sid;				 
			  for (p = 1 ; p <= sidCurrent ; p++) {
				   var sidReplace = this.SIDsorted[p];
				   this.SIDsorted[p] = sidPrevIdx;
				   sidPrevIdx = sidReplace;
			  }
		   }	      
	   }
	   this.organizeShapes();
	   this.valid=false;
   } else {
	   var sid = this.hoverSid ;
	   if(sid != null) {
		this.sortType = "custom";
		var sidCurrent = -1;
		  for (p = 0 ; p < this.SIDsorted.length ; p++) {
			if(this.SIDsorted[p]==sid) {
			   sidCurrent = p;		
			}
		  }
			 var sidPrevIdx = this.SIDsorted[0];
			 this.SIDsorted[0] = sid;
			 
		  for (p = 1 ; p <= sidCurrent ; p++) {
			   var sidReplace = this.SIDsorted[p];
			   this.SIDsorted[p] = sidPrevIdx;
			   sidPrevIdx = sidReplace;
		  }
		  this.organizeShapes();
		  this.valid=false;
	   }
   }
}
BCanvasState.prototype.selectedBottom = function() {
   if(this.listSelected.length > 1) {
     for (var l = 0 ; l < this.listSelected.length ; l++) {
		   var sid = this.listSelected[l].sid ;
		   if(sid != null) {
			this.sortType = "custom";
			var sidCurrent = -1;
			  for (p = 0 ; p < this.SIDsorted.length ; p++) {
				if(this.SIDsorted[p]==sid) {
				   sidCurrent = p;		
				}
			  } 
				 
			   var sidPrevIdx = this.SIDsorted[this.SIDsorted.length-1];
			   this.SIDsorted[this.SIDsorted.length-1] = sid;
				 
			  for (p = this.SIDsorted.length-2 ; p >= sidCurrent ; p--) {
				   var sidReplace = this.SIDsorted[p];
				   this.SIDsorted[p] = sidPrevIdx;
				   sidPrevIdx = sidReplace;
			  }
			  this.organizeShapes();
			  this.valid=false;
		   }	     
	 }
   } else {
	   var sid = this.hoverSid ;
	   if(sid != null) {
		this.sortType = "custom";
		var sidCurrent = -1;
		  for (p = 0 ; p < this.SIDsorted.length ; p++) {
			if(this.SIDsorted[p]==sid) {
			   sidCurrent = p;		
			}
		  } 
			 
		   var sidPrevIdx = this.SIDsorted[this.SIDsorted.length-1];
		   this.SIDsorted[this.SIDsorted.length-1] = sid;
			 
		  for (p = this.SIDsorted.length-2 ; p >= sidCurrent ; p--) {
			   var sidReplace = this.SIDsorted[p];
			   this.SIDsorted[p] = sidPrevIdx;
			   sidPrevIdx = sidReplace;
		  }
		  this.organizeShapes();
		  this.valid=false;
	   }
   }
}

BCanvasState.prototype.organizeShapes = function() { 
    this.sort();
    var shapeLineHeight = (this.origHeight - 0) / this.SIDsorted.length  ;
	if (shapeLineHeight > 100 ) {
	  shapeLineHeight = 100;
	} 

	this.shapeLineHeight = shapeLineHeight;
	this.height = this.SIDsorted.length * shapeLineHeight
	document.getElementById('timeline_canvas').height = this.height;
	//console.log(shapeLineHeight);
	var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
	var oneSecondInPixels = (this.width - shapeLineHeight)/ canvasPeriod;
	this.oneSecondInPixels = oneSecondInPixels;
	var currentY = 0;
	var pixelsOffset = this.offset * 3600 * oneSecondInPixels;
	for (p = 0 ; p < this.SIDsorted.length ; p++) {
	   
	  // console.log(currentY + " " + this.SIDsorted[p])
	   var pshape = this.pshapes[this.SIDsorted[p]]
	   var books = pshape.bookings;
	   for (var b = 0 ; b < books.length ; b++) {
	      var bfrom = books[b].from;
		  var bto = books[b].to;
          
		  var startB = bfrom - this.drawPeriodfrom;
		  var endB = bto - this.drawPeriodfrom;
		    if (startB + this.offset * 3600 < 0 ) { startB = -this.offset * 3600 }
		    if (endB + this.offset * 3600 > canvasPeriod ) {endB = canvasPeriod-this.offset * 3600}
		  var startX = startB * oneSecondInPixels + shapeLineHeight;
		  var endX = endB * oneSecondInPixels + shapeLineHeight;
		  
		  books[b].x = startX + pixelsOffset;
		  books[b].y = currentY;
		  books[b].w = endX - startX;
		  books[b].h = shapeLineHeight;

	   }
	   currentY = currentY +  shapeLineHeight;
	}
	for (var c = 0 ; c < this.closeShapes.length ; c++ ) {
	      var bfrom = this.closeShapes[c].from;
		  var bto = this.closeShapes[c].to;
		  var startB = bfrom - this.drawPeriodfrom;
		  var endB = bto - this.drawPeriodfrom;
		    if (startB + this.offset * 3600 < 0 ) { startB = -this.offset * 3600 }
		    if (endB + this.offset * 3600 > canvasPeriod ) {endB = canvasPeriod-this.offset * 3600}
		  var startX = startB * oneSecondInPixels + shapeLineHeight;
		  var endX = endB * oneSecondInPixels + shapeLineHeight;
		  
		  this.closeShapes[c].x = startX + pixelsOffset;
		  this.closeShapes[c].y = 0;
		  this.closeShapes[c].w = endX - startX;
		  this.closeShapes[c].h = this.height;
	}
	
}
BCanvasState.prototype.addPShape = function(pshape) {
   var sid = pshape.sid;
   this.SIDsorted.push(sid);
   this.pshapes[sid] = pshape;
   for (var i = 0 ; i < pshape.bookings.length ; i++ ) {
      var bshape = pshape.bookings[i];
	  this.addShape(bshape);
   }
   this.organizeShapes();
}
BCanvasState.prototype.setPshapeBookings = function(sid,bshapeList) {
	// Remove existing BShapes related to given Pshape(sid)
	for (var i = 0 ; i < this.pshapes[sid].bookings.length ; i++ ) {
	      var bshape = pshape.bookings[i];
	      this.shapes.remove(bshape);	      
	}
	this.pshapes[sid].bookings = bshapeList;
	for (var i = 0 ; i < this.pshapes[sid].bookings.length ; i++ ) {
		      var bshape = this.pshapes[sid].bookings[i];
			  this.addShape(bshape);
	}
	this.organizeShapes();
};
BCanvasState.prototype.addShape = function(bshape) {
  "use strict";
  if(bshape.type == "drag") {
    this.shapes.push(bshape);
	} else {
	this.shapes.unshift(bshape);
	}
  
  this.valid = false;
};
BCanvasState.prototype.setList = function(list) {
  "use strict";
  this.shapes = list; 
  this.valid = false;
};
BCanvasState.prototype.removeShape = function(tsid) {
  "use strict";
    var shape;
	var idx;
  for (i = 0; i < this.shapes.length; i += 1) {
                            shape = canvas_.shapes[i];
							if(shape.tsid  == tsid) {
							    idx = this.shapes.indexOf(shape);
							}
	}
 this.shapes.splice(idx,1); 
  this.valid = false;
};
BCanvasState.prototype.emptyBookings = function() {
  "use strict";  
  this.shapes = []; 
  this.listSelected = [];
  this.sameInList = null;
  this.closeShapes = [];
  this.closeSelected = null;
  //this.shapeViews = {};
  //this.SIDsorted = [];
  //this.pshapes = {};
  var sid;
  for (sid in this.pshapes) {
		if (this.pshapes.hasOwnProperty(sid)){
			this.pshapes[sid].bookings = [];
		}
  }
  this.valid = false;
};
BCanvasState.prototype.zoomLeft = function(sec) {
	if (this.drawPeriodfrom - sec >= this.fromOrig) {
	this.drawPeriodfrom -= sec;
	this.drawPeriodto -=sec;
	this.organizeShapes();
	this.valid = false;
	timelinediv.redraw();
	}
}
BCanvasState.prototype.zoomRight = function(sec) {
	if (this.drawPeriodto + sec <= this.toOrig) {
	this.drawPeriodfrom += sec;
	this.drawPeriodto +=sec;
	this.organizeShapes();
	this.valid = false;
	timelinediv.redraw();
	}
}
BCanvasState.prototype.zoomIn = function() {
  	var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
	this.drawPeriodfrom += 3600;
	this.drawPeriodto -=3600;
	this.organizeShapes();
	this.valid = false;
	timelinediv.redraw();
}
BCanvasState.prototype.zoomOut = function() {
  	var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
	if(this.drawPeriodfrom - 3600 < this.fromOrig) {
	   this.drawPeriodfrom = this.fromOrig;
   } else {
		  this.drawPeriodfrom -= 3600;
   }		  
	if(this.drawPeriodto + 3600 > this.toOrig ) {
	   this.drawPeriodto = this.toOrig;
	} else {
	   this.drawPeriodto += 3600;
	}
	this.organizeShapes();
	this.valid = false;
	timelinediv.redraw();
}
BCanvasState.prototype.zoomReset = function() {
    this.drawPeriodfrom = this.fromOrig;
	this.drawPeriodto = this.toOrig;
	this.organizeShapes();
	this.valid = false;
	timelinediv.redraw();
}
BCanvasState.prototype.clear = function() {
  "use strict";
  this.ctx.clearRect(0, 0, this.width, this.height);
};

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
BCanvasState.prototype.draw = function() {
  "use strict";
  var ctx, shapes, l, i, shape, mySel , p;
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    ctx = this.ctx;
    shapes = this.shapes;
    this.clear();
	
	//ctx.drawImage(document.getElementById("canvas_timeline_div_background"),0,0,this.width,this.height);
    dbDrawRectT(ctx,0,0,this.width,this.height,"white","white",1,0.3,0)
    // draw all shapes
    l = shapes.length;
	

	var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
	var oneSecondInPixels = (this.width - this.shapeLineHeight)/ canvasPeriod;
	var secOffset = this.offset * 3600;
	var pixelsOffset = secOffset * oneSecondInPixels;
	 var currentY = 0;
	
	for (p = 0 ; p < this.SIDsorted.length ; p++) {   
       dbLine(ctx,this.shapeLineHeight,currentY,this.width,currentY,0.2,1,'black');
	   //dbDrawRectT(ctx,0,currentY,this.shapeLineHeight,this.shapeLineHeight,"grey","white",1,0.3,1)
	   currentY = currentY +  this.shapeLineHeight;
     }
     for (var c = 0 ; c < this.closeShapes.length ; c++ ) {
	     var bfrom = this.closeShapes[c].from;
		 var bto = this.closeShapes[c].to;
		 if ( bfrom + secOffset >= this.drawPeriodfrom && bfrom + secOffset <= this.drawPeriodto ||
		      bto + secOffset >= this.drawPeriodfrom   && bto + secOffset <= this.drawPeriodto    ) {
				this.closeShapes[c].draw(ctx);
			 }	 
	 }
	 var column_line_sec = this.drawPeriodfrom;
	 while (column_line_sec < this.drawPeriodto) {
	    column_line_sec += 3600;
	    dbLine(ctx,(column_line_sec - this.drawPeriodfrom)*oneSecondInPixels + this.shapeLineHeight,0,(column_line_sec - this.drawPeriodfrom)*oneSecondInPixels + this.shapeLineHeight,this.height,0.2,0.3,'grey');
		
	 }

    for (i = 0; i < l; i += 1) {
	     var bfrom = shapes[i].from;
		 var bto = shapes[i].to;
		 if ( bfrom + secOffset >= this.drawPeriodfrom && bfrom + secOffset <= this.drawPeriodto ||
		      bto + secOffset >= this.drawPeriodfrom   && bto + secOffset <= this.drawPeriodto    ) {
				shapes[i].draw(ctx);
			 }	       
    }
    // draw lines ;


    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.listSelected.length > 0) {
      for(var l = 0 ; l < this.listSelected.length ; l++) {
	      
		  ctx.strokeStyle = "black";
		  ctx.lineWidth = 1;
		  mySel = this.listSelected[l];
		  var fillX = mySel.x;
		  var fillY = mySel.y;
		  
		  ctx.globalAlpha = 1;
		  ctx.strokeRect(fillX+0.5,fillY+0.5,mySel.w-1,mySel.h-1);
		  ctx.lineWidth = 2;
		  ctx.strokeStyle = "#FF8080";
		  ctx.strokeRect(fillX+2,fillY+2,mySel.w-4,mySel.h-4);
		  ctx.strokeStyle = "white";
		  ctx.globalAlpha = 1;
		  }
    }
	ctx.strokeStyle = "white";
	ctx.strokeRect(0,0,this.width,this.height);
	

	var tline = 0;
	var ind = 0;

	ctx.globalAlpha = 1;
	var currentY = 0;
	
	for (p = 0 ; p < this.SIDsorted.length ; p++) {	   
	   dbDrawRectT(ctx,0,parseInt(currentY),this.shapeLineHeight+1,parseInt(this.shapeLineHeight+4),"black","white",1,1,1)
	   currentY = currentY +  this.shapeLineHeight;
     }	   	
    // ** Add stuff you want drawn on top all the time here **    
	// ** Draw place shapes on timeline
	for (p = 0 ; p < this.SIDsorted.length ; p++) {	  
	    this.drawSshape(p,this.shapeViews[this.SIDsorted[p]]);
	}
    this.valid = true;
  }
};

BCanvasState.prototype.drawSshape = function(p,shape) {
    var ctx = this.ctx;
	var x_  = this.shapeLineHeight / 2;
	var y_  = (p * this.shapeLineHeight) + this.shapeLineHeight / 2;
	var w_;
	var h_;
	var relative = 1;
	if (shape.w > this.shapeLineHeight  || shape.h > this.shapeLineHeight){
	   if(shape.w > shape.h) {
	     relative = this.shapeLineHeight / shape.w;
	   } else {
	     relative = this.shapeLineHeight / shape.h;
	   }
	}
	if (shape.angle != 0) {
     ctx.save();
	 ctx.translate(x_ , y_ );
	 ctx.rotate(shape.angle * Math.PI / 180);
	 x_ =  0;
	 y_ = 0
   }
	if (shape.type == "rectangle" ) {
    dbDrawRect  (ctx,x_,y_,(shape.w)*relative - 6,(shape.h)*relative - 6,
	              shape.options.lineColor,
				  shape.options.fillColor,
				  shape.options.alpha,
				  shape.options.salpha,
				  (shape.options.sw)*relative);
  } else if (shape.type == "round" ) {
    dbRoundRect (ctx,x_,y_,(shape.w)*relative - 6,(shape.h)*relative - 6,
	              shape.options.lineColor,
				  shape.options.fillColor,
				  shape.options.alpha,
				  shape.options.salpha,
				  (shape.options.sw)*relative,
				  shape.options.roundRad);
  } else if (shape.type == "circle" ) {
    dbCircle (ctx,x_,y_,(shape.w)*relative - 6,(shape.h)*relative - 6,
				  shape.options.startA,
				  shape.options.endA,
	              shape.options.lineColor,
				  shape.options.fillColor,
				  shape.options.alpha,
				  shape.options.salpha,
				  (shape.options.sw)*relative);
  } else if (shape.type == "trapex" ) {
    dbTrapez (ctx,x_,y_,(shape.w)*relative - 6,(shape.h)*relative - 6,
	              shape.options.lineColor,
				  shape.options.fillColor,
				  shape.options.alpha,
				  shape.options.salpha,
				  (shape.options.sw)*relative,
				  shape.options.cutX);
  } else if (shape.type == "image" ) {
    dbImage (ctx,x_,y_,(shape.w)*relative - 6,(shape.h)*relative - 6,
	              shape.options.imgID,
				  shape.options.alpha);
  }
   ctx.restore();
}
// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
BCanvasState.prototype.getMouse = function(e) {
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
    offsetX -=  document.getElementById(this.scrollID).scrollLeft;
    offsetY -=  document.getElementById(this.scrollID).scrollTop;  
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
