//   pshape.sid = SID
//   pshape.name = NAME
//   pshape.floorID = FLOORID
//   pshape.x = X
//   pshape.y = Y
//   pshape.bookings = [];
function TimeGrid(state,id) {
    this.id=id;
    this.state = state;
}
TimeGrid.prototype.redraw = function() {
    var shapeLineHeight = this.state.shapeLineHeight  ;
    var width = this.state.width - shapeLineHeight-1;
    var canvasPeriod = this.state.drawPeriodto - this.state.drawPeriodfrom ; // total seconds in canvas
    var oneSecondInPixels = width / canvasPeriod;
    document.getElementById(this.id).innerHTML = "";
    document.getElementById(this.id).style.width=this.state.width+"px";
    document.getElementById(this.id).style.height=this.state.height+"px";

    var appendData = "<div id='gridborderleft' style='position:absolute;left:0px;height:100%;border-left: 1px solid black;'></div>";
    // $("#"+this.id).append(appendData);
    var appendData = "<div id='gridborderRight' style='position:absolute;right:0px;height:100%;border-left: 1px solid black;'></div>";
    //$("#"+this.id).append(appendData);
    var appendData = "<div id='gridimageright' style='position:absolute;left:"+parseInt(shapeLineHeight-0.5)+"px;height:100%;border-left: 1px solid black;'></div>";
    $("#"+this.id).append(appendData);

    for (var p = shapeLineHeight ; p <  this.state.height ; p+=shapeLineHeight) {
        var appendData = "<div class='gridlinediv' style='top:"+p +"px; width:"+width+"px;left:"+parseInt(shapeLineHeight)+"px'></div>";
        $("#"+this.id).append(appendData);
    }

    //	  <div class="gridlinediv" style="position:absolute;top:14px;width:100%;border-bottom: 1px solid darkgrey;"></div>

}
function TimelineDiv(state,id,left_margin) {
    this.id=id;
    this.state = state;
	this.left_margin = left_margin;
}
TimelineDiv.prototype.redraw = function() {
    var height = 30;

    var left_margin = this.left_margin  ;

    var width = this.state.width - left_margin ;
    var canvasPeriod = this.state.drawPeriodto - this.state.drawPeriodfrom ; // total seconds in canvas

    var oneSecondInPixels = width / canvasPeriod;
    var leftOffset = left_margin;
    $("#"+this.id).html("");
    $("#"+this.id).css("width",width +"px")
	$("#"+this.id).css("height",height +"px") 
	$("#"+this.id).css("margin","auto") 
    var appendData = "<div id='timeline_bottom' class='timeline_bottom_pop'></div>";
    $("#"+this.id).append(appendData);
    var ttop = parseInt(height-1);
    $("#timeline_bottom").css("top",ttop);
    var periodwidth = width ;
    $("#timeline_bottom").css("width",periodwidth + left_margin+"px"); 
    var tline_hours_px=[];
    var tline_hours_sec = [];
    
    
    var startSecondsGlobal = findClosestsStep(this.state.drawPeriodfrom,3600) ;
	var startSeconds = startSecondsGlobal - this.state.drawPeriodfrom;
	var startSecondspx = startSeconds*oneSecondInPixels;
	var start_tline = startSecondspx.toFixed(2);
	
    while( startSecondsGlobal <= this.state.drawPeriodto ) {
        tline_hours_px.push(start_tline);
        tline_hours_sec.push(startSecondsGlobal);
        startSecondsGlobal+=3600;
        startSeconds= startSecondsGlobal - this.state.drawPeriodfrom;

        var startSecondspx = startSeconds*oneSecondInPixels;
        start_tline =  startSecondspx.toFixed(2);
    }
 
    for (var i = 0; i < tline_hours_px.length ; i++) {
        var hours_px = tline_hours_px[i];
        var hoursString = hours_px.toString();
        var divid = "div_hours_"+hoursString.replace(/\./, "-");
        var appendData = "<div id='"+divid+"' class='timeline_line'></div>";
        $("#"+this.id).append(appendData);
        $("#"+divid).css("left",hours_px+"px");
 
        if ((tline_hours_sec[i] - (new Date()).getTimezoneOffset()*60)/3600/24 % 1 == 0) {
            var top_ = 0;
            $("#"+divid).css("top",top_+"px");
            $("#"+divid).css("height",height+"px");
        } else {
            var top_ = height - 5;
            $("#"+divid).css("top",top_+"px");
            $("#"+divid).css("height",0 +"px");
			
			
			appendData = "<div id='tl_time_show-"+hoursString.replace(/\./, "-")+"' class='canvas_times_div'></div>"
			$("#"+divid).append(appendData);
			var Date_ = new Date(parseInt(tline_hours_sec[i] * 1000  ));
			var hour_ = Date_.getHours(); if(hour_ < 10) {hour_ = "0"+hour_;}
			var min_ = Date_.getMinutes();if(min_ < 10) {min_ = "0"+min_;}
			$("#tl_time_show-"+hoursString.replace(/\./, "-")).html(hour_+":"+min_);
			$("#tl_time_show-"+hoursString.replace(/\./, "-")).css("left","-19px");
			$("#tl_time_show-"+hoursString.replace(/\./, "-")).css("top","-12px");	
 
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
	var fromDate_ =  new Date(parseInt(this.state.drawPeriodfrom*1000 + (this.state.offset*3600 + clientOffset*60)*1000)); 
	var toDate_ =  new Date(parseInt(this.state.drawPeriodto*1000 + (this.state.offset*3600 + clientOffset*60)*1000));
	var dcount = 1;
	var dateObjects = {};
	if(fromDate_.getDate() == toDate_.getDate() || (((new Date(this.state.drawPeriodto*1000)).getTime()/1000 - clientOffset*60)/3600/24 % 1 == 0) ) { 
	        var appendData = " <div class='day_div' id='day_div_1'>";
				appendData +=    "    <div class='inner_day_div_left' id='inner_day_div_left_1'></div>";
				appendData +=    "    <div class='inner_day_div_right' id='inner_day_div_right_1'></div>";
				appendData +=    " </div>";
	       $("#canvas_timeline_dates").append(appendData);
	       dateObjects[1] = fromDate_;
		   $("#day_div_1").css("width",$("#canvas_timeline_dates").width() )
	} else {
 
	        dcount = 2;
	        var appendData = " <div class='day_div' id='day_div_1'>";
				appendData +=    "    <div class='inner_day_div_left' id='inner_day_div_left_1'></div>";
				appendData +=    "    <div class='inner_day_div_right' id='inner_day_div_right_1'></div>";
				appendData +=    " </div>";
				 $("#canvas_timeline_dates").append(appendData);
 
			var appendData = " <div class='day_div' id='day_div_2'>";
				appendData +=    "    <div class='inner_day_div_left' id='inner_day_div_left_2'></div>";
				appendData +=    "    <div class='inner_day_div_right' id='inner_day_div_right_2'></div>";
				appendData +=    " </div>";
				 $("#canvas_timeline_dates").append(appendData);
			dateObjects[1] = fromDate_;
			dateObjects[2] = toDate_;
			for (var i = 0; i < tline_hours_px.length ; i++) {
			   if (((tline_hours_sec[i] - (new Date()).getTimezoneOffset()*60)/3600/24 % 1 == 0)) {
			      $("#day_div_1").css("width",tline_hours_px[i] ); 
			   }
			}
			$("#day_div_2").css("left",$("#day_div_1").width());
			$("#day_div_2").css("width",$("#canvas_timeline_dates").width() - $("#day_div_1").width() +"px");
	   
	}
	for(var i=1;i<=dcount;i++) {
	     var day = dateObjects[i].getDate();
         var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
         var mon = monthNames[Date_.getMonth()];
		 if(i==1) {
		   $("#inner_day_div_right_"+i).html(day+""+mon);         
		   if($("#inner_day_div_right_"+i).outerWidth()*2 < $("#day_div_1").width()) {
		      $("#inner_day_div_left_"+i).html(day+""+mon);
		   }
		 } else {
		      $("#inner_day_div_left_"+i).html(day+""+mon);
			  if($("#inner_day_div_left_"+i).outerWidth()*2 < $("#day_div_2").width()) {
		      $("#inner_day_div_right_"+i).html(day+""+mon);
		   }
		 }
         
	}



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
    if(pixels>=0 && (pixels <= this.state.width - this.left_margin) && false) {
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
    var left__ = mx ;
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
    if (type=="adminSelected") {
        this.color="#08DE58";
        this.colorto="#08DE58";
    }
    if (type=="adminReserved") {
        this.color="red";
        this.colorto="red";
    }
    if (type=="closed") {
        this.color="grey";
        this.colorto="grey";
    }
	if (type=="userResize") {
        this.color="transparent";
        this.colorto="transparent";
    }
    if(type=="closed") {
        this.sfillAlpha = state.sfillAlpha;
    } else {
        this.sfillAlpha = state.sfillAlpha;
    }

    this.from = from;
    this.to = to;
    this.type = type;
    this.bid = bid;
    this.persons = persons;
    this.name = name;
    this.sid = sid;
    this.bsid = "TB_"+randomString(12);
    if(type=="adminReserved") {
        this.bid = "ar_"+randomString(12);
    }
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

    if(this.type == "booked") {
        //(ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,R) {
        dbRoundRectT  (ctx,this.x,this.y,this.w,this.h,
            "#7195c4",
            grd,
            1,
            1,
            0,
            0);
    } else if(this.type == "adminSelected") {
        //(ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,R) {
		   var from_inside = false;
		   if( this.state.drawPeriodfrom <= this.from    &&  this.from    <= this.state.drawPeriodto) {
		      from_inside = true;
		   }
		   var to_inside = false;
		   if( this.state.drawPeriodfrom <= this.to  &&  this.to  <= this.state.drawPeriodto) {
		     var to_inside = true;
		   }
		   if(from_inside == true || to_inside == true) {
			   dbRoundRectT  (ctx,this.x+1,this.y,this.w-1,this.h,
				"transparent",
				grd,
				0.5,
				0,
				0,
				0);
			}
			if( from_inside == true ) {
			  ctx.drawImage(document.getElementById("2px_green"),this.x,0);
			}
			if( to_inside == true) {
			  ctx.drawImage(document.getElementById("2px_red"),this.x + this.w-2,0);
			}
    } else if(this.type == "adminReserved") {
        //(ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,R) {
        dbRoundRectT  (ctx,this.x,this.y ,this.w,this.h,
            grd,
            grd,
            0.3,
            0,
            0,
            0);
		
    } else  {
        dbDrawRectT  (ctx,this.x,this.y,this.w,this.h,
            "white",
            grd,
            0.3,
            0,
            0);
    }
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
    this.adminMoveAble = true;
    this.canvas = canvas;
    this.width = $(canvas).width();
    this.height = $(canvas).height();
    this.origHeight = $(canvas).height();
    this.origHeightReset = $(canvas).height();
    this.scrollID = "canvas_slimscroll";
    this.zoom = 1.0;
    this.bg_color = "white";
    this.line_color = "black";
    this.type_drag_color="blue";
    this.type_closed_color="#8C8C8C";
    this.type_closed_colorto="#8C8C8C";
    this.type_ordered_color="red";
    this.type_book_color="#B39DDB";
    this.type_book_colorto="#B39DDB";
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
	this.closeDays = [];
    this.closeSelected = null;
	this.inrangeClosed = [];
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
    this.lineHoverIdx = -1;

    this.mousedown_ = false;
    this.mousedownOnEmpty_ = false;
    this.mouseup_ = true;
    this.mousedown_x = 0;
    this.mousedown_y = 0;
    this.mouseup_x = 0;
    this.mouseup_y = 0;

    this.adminSelection = null;
    this.adminSelectionStarted = false;
	this.adminSelectionMove = false;
	this.adminSelectionLeftResize = null;
	this.adminSelectionLeftMove = false;
	this.adminSelectionRightResize = null;
	this.adminSelectionRightMove = false;
	
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
       

        if(e.which == 3 || e.which == 2) //1: left, 2: middle, 3: right
        {
            return;
        }
        myState.mousedown_ = true;
        myState.mousedown_x = mx;
        myState.mousedown_y = my;
        myState.mouseup_ = false;

        shapes = myState.shapes;
        l = shapes.length;
		if(myState.adminSelection != null && myState.adminMoveAble == true) {
		   if(myState.adminSelectionLeftResize.contains(myState.ctx ,mx, my)) {
		       myState.adminSelectionLeftMove = true;
			   myState.adminSelectionRightMove = false;
			   myState.adminSelectionMove = false;
			   myState.dragoffx = mx - myState.adminSelectionLeftResize.x;
			   return;
		   }
		   if(myState.adminSelectionRightResize.contains(myState.ctx ,mx, my)) {
		        myState.adminSelectionRightMove = true;
			    myState.adminSelectionLeftMove = false;
				myState.adminSelectionMove = false;
			    myState.dragoffx = mx - myState.adminSelectionRightResize.x;
			   return;
		   }
		   if(myState.adminSelection.contains(myState.ctx ,mx, my)) {
		        myState.adminSelectionRightMove = false;
			    myState.adminSelectionLeftMove = false;
				myState.adminSelectionMove = true;
			    myState.dragoffx = mx - myState.adminSelection.x;
			    return;
		   }
		}
    
        if(myState.isMouseOnClose(myState.ctx ,mx, my)==true) { return }
		 
        myState.mousedownOnEmpty_ = true;
		if(myState.adminMoveAble == true) {
			myState.adminSelection = null;
			myState.adminSelectionRightResize = null;
			myState.adminSelectionLeftResize = null;
		}
		myState.valid = false;
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        myState.sameInList = null;


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
            //timelinediv.updateCurrent(mx - myState.shapeLineHeight);
        }
        if(myState.mousedownOnEmpty_ == true && myState.adminMoveAble == true) {
		    if(myState.isMouseOnClose(myState.ctx ,mx, my)==true) { return }
   
            if(myState.adminSelectionStarted == false) {
                myState.adminSelectionStarted = true;
				myState.adminSelectionLeftResize = null;
				myState.adminSelectionRightResize = null;
                var started = myState.getLeftTopTimingArea(myState.step,myState.mousedown_x,myState.mousedown_y );

                myState.adminSelection   = new BShape(myState, parseInt( started.fromSec) ,
                    parseInt( started.fromSec + myState.step * 60), "" , 0 ,
                    "adminSelected");
                myState.adminSelection.line = started.line;
                myState.adminSelection.beganAt =  started.fromSec;
            } else {
                var onmove = myState.getLeftTopTimingArea(myState.step,mx,my);
                if(onmove.fromSec  != myState.adminSelection.beganAt) {
                    if(onmove.fromSec  > myState.adminSelection.beganAt) {
                        myState.adminSelection.from = myState.adminSelection.beganAt ;
                        myState.adminSelection.to = onmove.fromSec  + myState.step * 60
                    } else {
                        myState.adminSelection.from = onmove.fromSec ;
                        myState.adminSelection.to = myState.adminSelection.beganAt;
                    }
                } else {
				  ////console.log(onmove.fromSec)
				   myState.adminSelection.from = myState.adminSelection.beganAt ;
                   myState.adminSelection.to = onmove.fromSec  + myState.step * 60
				}
            }
            myState.calculateAdminSelectionXY();
            myState.valid = false;
        }
 
        //document.getElementById('mouse_pos').value = "X = "+mx+" Y="+my + "OX="+orgx+" OY="+orgy;
        var shapes = myState.shapes;
        var l = shapes.length;
        var contains = false;
        var prevMouseOver = myState.bidMouseOver;
		
		var userSelctionMove = false;
        if(myState.adminMoveAble == true) {
			if(myState.adminSelectionMove == true) {
			   userSelctionMove = true;
			   contains = true;
			   this.style.cursor='-webkit-grabbing';
			}
			if(userSelctionMove == false && (myState.adminSelectionRightMove == true || myState.adminSelectionLeftMove ==true)) {
				userSelctionMove = true;
			   contains = true;
			   this.style.cursor='col-resize';
			}
			if( userSelctionMove == false && (myState.adminSelectionLeftResize!= null && myState.adminSelectionLeftResize.contains(myState.ctx ,mx, my) )|| 
				(myState.adminSelectionRightResize!= null && myState.adminSelectionRightResize.contains(myState.ctx ,mx, my) )) {
			   userSelctionMove = true;
			   contains = true;
			   this.style.cursor='col-resize';
			}
			if(userSelctionMove == false && myState.adminSelection!=null && myState.adminSelectionStarted == false && myState.adminSelection.contains(myState.ctx ,mx, my) ) {
			   userSelctionMove = true;
			   contains = true;
			   this.style.cursor='-webkit-grab';
			   if(myState.adminSelectionMove == true) {
				   this.style.cursor='-webkit-grabbing';
			   }
			}
			
			// Resize selection (Left)
			if(myState.adminSelection!=null && myState.adminSelectionStarted == false && myState.adminSelectionLeftMove == true) {
				if(myState.isMouseOnClose(myState.ctx ,mx, my)==true) { return }
			
				myState.adminSelectionLeftResize.x = mouse.x - myState.dragoffx;
				var onmove = myState.getLeftTopTimingArea(myState.step,myState.adminSelectionLeftResize.x,mouse.y);
				if(onmove.fromSec  != myState.adminSelection.beganAt) {
				   if(onmove.fromSec  > myState.adminSelection.from ) {
					   if(onmove.fromSec  < myState.adminSelection.to) {
							myState.adminSelection.from = onmove.fromSec ;
					   } 
				   } else {
							myState.adminSelection.from = onmove.fromSec ;
				   }
				} else {
				
				}
				myState.calculateAdminSelectionXY();
				myState.valid = false; // Something's dragging so we must redraw
			}
			// Resize selection (Right)
			if(myState.adminSelection!=null && myState.adminSelectionStarted == false && myState.adminSelectionRightMove == true) {
				if(myState.isMouseOnClose(myState.ctx ,mx, my)==true) { return }
				
				myState.adminSelectionRightResize.x = mouse.x - myState.dragoffx;
				var onmove = myState.getLeftTopTimingArea(myState.step,myState.adminSelectionRightResize.x,mouse.y);
				onmove.fromSec += myState.step * 60;
				if(onmove.fromSec  != myState.adminSelection.to) {
					if(onmove.fromSec  < myState.adminSelection.to ) {
						if(onmove.fromSec  > myState.adminSelection.from ) {
							 myState.adminSelection.to = onmove.fromSec ;
						} 
					} else {
							 myState.adminSelection.to = onmove.fromSec ;
					}
				}
				myState.calculateAdminSelectionXY();
				myState.valid = false; // Something's dragging so we must redraw
			} 
			if(myState.adminSelection!=null && myState.adminSelectionStarted == false && myState.adminSelectionMove == true) {
			   var diffX =  mouse.x - myState.dragoffx;		   
			   if(myState.isMouseOnClose(myState.ctx ,mx - myState.dragoffx - 1, my)==true) { return }
			   if(myState.isMouseOnClose(myState.ctx ,mx + (myState.adminSelection.w - myState.dragoffx)-2, my)==true) { return }
			   
			   var onmove = myState.getLeftTopTimingArea(myState.step,diffX,mouse.y);
			   if(onmove.fromSec  != myState.adminSelection.from) {
					var fromtodiff = myState.adminSelection.to - myState.adminSelection.from;
					myState.adminSelection.from = onmove.fromSec;
					myState.adminSelection.to =  onmove.fromSec + fromtodiff;
				} else {
				
				}
				myState.calculateAdminSelectionXY();
				myState.valid = false; // Something's dragging so we must redraw
			}
		}
		if(!userSelctionMove) {
			for (i = l-1; i >= 0; i -= 1) {
				if (shapes[i].contains(myState.ctx ,mx, my)) {
					this.style.cursor='pointer';
					myState.bidMouseOver = shapes[i].bid;
					contains = true;
					break;

				}
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
            if(prevMouseOver != null) {
                myState.valid = false;
            }
        } else {
            myState.valid = false;
        }
        if(linehover > -1) {
            myState.hoverSidName = myState.shapeViews[myState.SIDsorted[linehover]].booking_options.givenName;
            myState.hoverSid = myState.SIDsorted[linehover];
        } else {
            myState.hoverSidName = null;
            myState.hoverSid = null;
        }

        var curlineidx = myState.getCurrentSidLine(mouse);
        if(curlineidx != -1 && curlineidx != myState.lineHoverIdx) {
            myState.lineHoverIdx  = curlineidx;
            myState.valid = false;
        }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
         myState.canvasMouseUpEvent(e);
    }, true);


    // **** Options! ****

    this.interval = 30;
    setInterval(function() { myState.draw(); }, myState.interval);
}
BCanvasState.prototype.isMouseOnClose = function(ctx ,mx, my) {
           var cshapes = this.closeShapes;
			l = cshapes.length;
			var onClose = false;
			for (i = l-1; i >= 0; i -= 1) {
				if (cshapes[i].contains( ctx ,mx, my)) {
					onClose = true;
				}
			}
			return onClose;
}
   

BCanvasState.prototype.canvasMouseUpEvent = function(e) {
        this.mousedownOnEmpty_ = false;
        this.mousedown_ = false;
        this.mouseup_ = true;
        
		
		
		if(this.adminSelectionStarted == true && this.adminSelection != null) { 
		
		  this.adminSelectionLeftResize =  new BShape(this,0 , 1, "" , 0 , "userResize");
		  this.adminSelectionLeftResize.x = this.adminSelection.x - 1;
		  this.adminSelectionLeftResize.y = 0;
		  this.adminSelectionLeftResize.h = this.adminSelection.h;
		  this.adminSelectionLeftResize.w = 4;
		  
		  this.adminSelectionRightResize =   new BShape(this,0 , 1, "" , 0 , "userResize");
		  this.adminSelectionRightResize.x = this.adminSelection.x + this.adminSelection.w - 2;
		  this.adminSelectionRightResize.y = 0;
		  this.adminSelectionRightResize.h = this.adminSelection.h;
		  this.adminSelectionRightResize.w = 4;
		  
		  
		}
		if(this.adminSelection == null) {
		   this.adminSelectionLeftResize = null;
		   this.adminSelectionRightResize = null;
		}
		if((this.adminSelectionLeftMove == true && this.adminSelectionLeftResize!=null) || this.adminSelectionMove == true) {
			  this.adminSelectionLeftResize.x = this.adminSelection.x - 1;
			  this.adminSelectionLeftResize.y = 0;
			  this.adminSelectionLeftResize.h = this.adminSelection.h;
			  this.adminSelectionLeftResize.w = 4;
		}
		if((this.adminSelectionRightMove == true && this.adminSelectionRightResize!=null) || this.adminSelectionMove == true) {
			  this.adminSelectionRightResize.x = this.adminSelection.x + this.adminSelection.w - 2;
			  this.adminSelectionRightResize.y = 0;
			  this.adminSelectionRightResize.h = this.adminSelection.h;
			  this.adminSelectionRightResize.w = 4;
		}
		this.adminSelectionLeftMove = false;
		this.adminSelectionRightMove = false;
		this.adminSelectionMove = false;
		this.adminSelectionStarted = false;
		
        this.dragging = false;
        this.resizeDragging = false;
        this.expectResize = -1;
        var mouse = this.getMouse(e);


        if (this.selection !== null) {
            if(e.which != 3 && e.which != 2) //1: left, 2: middle, 3: right
            {
                if(this.selection.type == "booked") {
                 //   showPopover(mouse.orgx,mouse.orgy,this.selection,'booking_selection')
                } else {
                 //   showPopover(mouse.orgx,mouse.orgy,this.selection,'admin_reserved')
                }
            }
        }
        if (this.adminSelection !== null) {
            if(e.which != 3 && e.which != 2) //1: left, 2: middle, 3: right
            {
             //   showPopover(mouse.orgx,mouse.orgy,this.adminSelection,'admin_selection')
            }
        }
        if(this.adminSelection === null && this.selection === null && this.lineHoverIdx != -1) {
            if(e.which != 3 && e.which != 2) //1: left, 2: middle, 3: right
            {
                var sidSelected = this.shapeViews[this.SIDsorted[this.lineHoverIdx]];
              //  showPopover(mouse.orgx,mouse.orgy,sidSelected,'line_popover')
            }
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

BCanvasState.prototype.getCurrentSidLine = function(mouse) {
    mx = mouse.x;
    my = mouse.y;
    for (p = 0 ; p < this.SIDsorted.length ; p++) {
        var pshape = this.pshapes[this.SIDsorted[p]]
        var lineTop  = parseInt(p*this.shapeLineHeight + 1);
        var lineBottom = parseInt(p*this.shapeLineHeight + this.shapeLineHeight -1);
        if(lineTop <= my && my <= lineBottom ) {
            return p;
            break;
        }
    }
    return -1;
}

BCanvasState.prototype.getLeftTopTimingArea = function(minMinutes,x,y) {
    var returnObject = {};

    var xy = new xypoint();
    for (p = 0 ; p < this.SIDsorted.length ; p++) {
        var lineTop  = parseInt(p*this.shapeLineHeight );
        var lineBottom = parseInt(p*this.shapeLineHeight + this.shapeLineHeight );
        if(lineTop <= y && y <= lineBottom ) {
            xy.y = lineTop;
            returnObject.line = p;
            break;
        }
    }
    if(x <= 0) {
        xy.x = 0;
        returnObject.fromSec  = this.drawPeriodfrom  ;
    } else if (x >= this.width){
        xy.x = this.width;
        returnObject.fromSec  = this.drawPeriodto ;
    } else {
        for(var m = 0 ;  m <= this.width - this.oneSecondInPixels * minMinutes * 60 ; m += this.oneSecondInPixels * minMinutes * 60) {
            var leftRange = m;
            var rightRange = m + this.oneSecondInPixels * minMinutes * 60;
            if(leftRange <= x && x < rightRange) {
                xy.x = leftRange;
                returnObject.fromSec =   Math.round((leftRange )/this.oneSecondInPixels*1000)/1000 + this.drawPeriodfrom  ;
		 
                break
            }
        }
    }

    returnObject.xy = xy;
    return returnObject;
}
BCanvasState.prototype.setAdminSelectionMiddle = function(fromSeconds_,toSeconds_) {
 
	if(this.adminSelection == null) {
	    this.adminSelection   = new BShape(this, 0,0, "" , 0 ,  "adminSelected");
	} 
	
	this.adminSelection.from = parseInt(fromSeconds_);
	this.adminSelection.to = parseInt(toSeconds_);
 
	this.adminSelectionStarted = true;
	this.calculateAdminSelectionXY();
	this.valid = false;
	this.organizeShapes();
	
}
BCanvasState.prototype.calculateAdminSelectionXY = function() {
    if(this.adminSelection != null) {
        //var pixelsOffset = this.offset * 3600 * this.oneSecondInPixels;
        var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
        var pixelsOffset = this.offset * 3600 * this.oneSecondInPixels;

        var bfrom = this.adminSelection.from; // In seconds from the start of the timeline day
        var bto = this.adminSelection.to;
        
        var startB = bfrom - this.drawPeriodfrom;
        var endB = bto - this.drawPeriodfrom;

        var startX = startB * this.oneSecondInPixels ;
        var endX = endB * this.oneSecondInPixels ;
        if(startX  <= 0) { startX  = 0 }
        if(endX   >= this.width) { endX  = this.width  }

        this.adminSelection.x = startX  ;
        this.adminSelection.w = endX - startX;
        this.adminSelection.y = 0;
        this.adminSelection.h = this.shapeLineHeight;
		
		if(this.adminSelectionLeftResize!=null) {
			  this.adminSelectionLeftResize.x = this.adminSelection.x - 1;
			  this.adminSelectionLeftResize.y = 0;
			  this.adminSelectionLeftResize.h = this.adminSelection.h;
			  this.adminSelectionLeftResize.w = 4;
		}
		if(this.adminSelectionRightResize!=null) {
			  this.adminSelectionRightResize.x = this.adminSelection.x + this.adminSelection.w - 2;
			  this.adminSelectionRightResize.y = 0;
			  this.adminSelectionRightResize.h = this.adminSelection.h;
			  this.adminSelectionRightResize.w = 4;
		}
    }
}
BCanvasState.prototype.organizeShapes = function() {
    var shapeLineHeight = (this.origHeight - 0) / this.SIDsorted.length  ;
 
    this.shapeLineHeight = shapeLineHeight;
    this.height = this.SIDsorted.length * shapeLineHeight
 
    ////console.log(shapeLineHeight);
    var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
    var oneSecondInPixels = (this.width  )/ canvasPeriod;
    this.oneSecondInPixels = oneSecondInPixels;
    var currentY = 0;
    var pixelsOffset = this.offset * 3600 * oneSecondInPixels;
    for (p = 0 ; p < this.SIDsorted.length ; p++) {

        // //console.log(currentY + " " + this.SIDsorted[p])
        var pshape = this.pshapes[this.SIDsorted[p]]
        var books = pshape.bookings;
        for (var b = 0 ; b < books.length ; b++) {
            var bfrom = books[b].from;
            var bto = books[b].to;

            var startB = bfrom - this.drawPeriodfrom; 
            var endB = bto - this.drawPeriodfrom;
            if (startB   < 0 ) { startB =0}
            if (endB  > canvasPeriod ) {endB = canvasPeriod }
            var startX = startB * oneSecondInPixels  ;
            var endX = endB * oneSecondInPixels  ;

            books[b].x = startX  ;
            books[b].y = currentY;
            books[b].w = endX - startX;
            books[b].h = shapeLineHeight;

        }
        currentY = currentY +  shapeLineHeight;
    }
	var d = new Date();
    var clientOffset = d.getTimezoneOffset();
	this.closeShapes = [];
	var mergedRanges = [];
	if(this.weekObject != undefined) {
		var firstDay = new Date(this.drawPeriodfrom*1000  + (this.offset*3600 + clientOffset*60)*1000); 
		var nextDay  = new Date(this.drawPeriodto*1000  + (this.offset*3600 + clientOffset*60)*1000);
        ////console.log("FirstDay"); //console.log(firstDay);
        ////console.log("Next"); //console.log(nextDay);

		this.closeShapes = [];
		var dcount = 1;
		var daysObj = {};
		daysObj[dcount] = firstDay;
		if(firstDay.getDay() != nextDay.getDay()) {
		   dcount = 2;
		   daysObj[dcount] = nextDay;
		}
 
		var allOpenRanges = [];
        //console.log(this.weekObject)
		for(var d = 1; d <= dcount ; d++) {
          //console.log("d="+d)
		  var day_ = this.weekObject[daysObj[d].getDay()];  
		  ////console.log(parseInt(daysObj[d].getTime()/1000 - (daysObj[d].getHours()*3600 + daysObj[d].getMinutes()*60) + this.offset * 3600));
		  for(var cd = 0 ; cd < this.closeDays.length ; cd ++ ) { 
			   if(this.closeDays[cd] == parseInt(daysObj[d].getTime()/1000 - (daysObj[d].getHours()*3600 + daysObj[d].getMinutes()*60) + this.offset * 3600)) {
				   day_.open = false;
			   }
		  } 
		  
		  if(day_.open==true) {
			  for( var r = 0 ; r < day_.openList.length ; r++ ) {
				 var range = {};
				 range.from = (d-1)*24*3600 +  day_.openList[r].from;
				 range.to = (d-1)*24*3600 +  day_.openList[r].to;
				 allOpenRanges.push(range);			 
			  }	  	  
		  } else { 
			 // Closed all day
		  }
		}
 
		var allClosedRanges = [];
		var range = {};
		range.from = 0;
		allClosedRanges[0] = {};
		allClosedRanges[0].from = 0;
		var indexCreated = 0;
		for(var r = 0 ; r < allOpenRanges.length ; r ++) {
			  allClosedRanges[r].to = allOpenRanges[r].from; 
              allClosedRanges[r+1] = {};
              allClosedRanges[r+1].from = allOpenRanges[r].to;
			  indexCreated = r+1;
 		   
		}
        allClosedRanges[indexCreated].to = dcount*24*3600;
		
		var dpfDate = new Date(this.drawPeriodfrom*1000);
                
		for(var r = 0 ; r < allClosedRanges.length ; r ++) {
		   if((allClosedRanges[r].to - allClosedRanges[r].from) > 0) {
			  mergedRanges.push(allClosedRanges[r]);
		   }
		}
 
		
		for(var c = 0 ; c < mergedRanges.length ; c ++) {
			var closeShape_ = {};
			closeShape_.from = this.drawPeriodfrom - dpfDate.getHours()*3600 - dpfDate.getMinutes()*60 + mergedRanges[c].from;
			closeShape_.to = this.drawPeriodfrom - dpfDate.getHours()*3600 - dpfDate.getMinutes()*60 + mergedRanges[c].to;
			var bshape = new BShape(this, closeShape_.from , closeShape_.to , "__" , 1 , "closed","sid","nana");
			this.closeShapes.push(bshape);
		}
         
	} 
    for (var c = 0 ; c <  this.closeShapes.length ; c++ ) {
	   
        var bfrom = this.closeShapes[c].from;
        var bto = this.closeShapes[c].to;
        var startB = bfrom - this.drawPeriodfrom;
        var endB = bto - this.drawPeriodfrom;
        if (startB   < 0 ) { startB = 0 }
        if (endB   > canvasPeriod ) {endB = canvasPeriod }
        var startX = startB * oneSecondInPixels  ;
        var endX = endB * oneSecondInPixels  ;

        this.closeShapes[c].x = startX  ;
        this.closeShapes[c].y = 0;
        this.closeShapes[c].w = endX - startX;
        this.closeShapes[c].h = this.height;
    }
 
    this.calculateAdminSelectionXY();
}
var hj = 0;
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
        var bshape = this.pshapes[sid].bookings[i];
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
    } else  {
        this.shapes.unshift(bshape);
    }
    this.valid = false;
};
BCanvasState.prototype.setList = function(list) {
    "use strict";
    this.shapes = list;
    this.valid = false;
};
BCanvasState.prototype.removeBookingByBid = function(bid) {
    var sid;
    for (sid in this.pshapes) {
        if (this.pshapes.hasOwnProperty(sid)){
            this.removeSingleBookingShape(sid,bid);
        }
    }
    this.organizeShapes();
    this.valid = false;
}
BCanvasState.prototype.removeSingleBookingShape = function(sid,bid) {
    "use strict";
    this.selection = null;
    this.listSelected = [];
    var shape;
    var idx;
    var pshape = this.pshapes[sid];
    var tempBshapeList = pshape.bookings;
    for (var i = 0; i <  pshape.bookings.length; i += 1) {
        if( pshape.bookings[i].bid == bid) {
            var bshape =  pshape.bookings[i];
            idx = tempBshapeList.indexOf(bshape);
            tempBshapeList.splice(idx,1);

            idx	= this.shapes.indexOf(bshape);
            this.shapes.splice(idx,1);
        }
    }
    this.pshapes[sid].bookings = tempBshapeList;
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
  //  if (this.drawPeriodfrom - sec >= this.fromOrig) {
        this.drawPeriodfrom -= sec;
        this.drawPeriodto -=sec;
        this.organizeShapes();
        this.valid = false; 
   // }
}
BCanvasState.prototype.zoomRight = function(sec) {
   // if (this.drawPeriodto + sec <= this.toOrig) {
        this.drawPeriodfrom += sec;
        this.drawPeriodto +=sec;
        this.organizeShapes();
        this.valid = false; 
  //  }
}
BCanvasState.prototype.zoomIn = function() {
    var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
    this.drawPeriodfrom += 3600;
    this.drawPeriodto -=3600;
    this.organizeShapes();
    this.valid = false; 
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
}
BCanvasState.prototype.zoomReset = function(from,to) {
    this.drawPeriodfrom = from;
    this.drawPeriodto = to;
	
	this.mousedown_ = false;
    this.mousedownOnEmpty_ = false;
    this.mouseup_ = true;
    this.mousedown_x = 0;
    this.mousedown_y = 0;
    this.mouseup_x = 0;
    this.mouseup_y = 0;

    this.adminSelection = null;
    this.adminSelectionStarted = false;
	this.adminSelectionMove = false;
	this.adminSelectionLeftResize = null;
	this.adminSelectionLeftMove = false;
	this.adminSelectionRightResize = null;
	this.adminSelectionRightMove = false;
    this.organizeShapes();
    this.valid = false; 
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
        dbDrawRectT(ctx,0,0,this.width,this.height,"transparent","white",0.3,0,0)
        // draw all shapes
        l = shapes.length;


        var canvasPeriod = this.drawPeriodto - this.drawPeriodfrom ; // total seconds in canvas
        var oneSecondInPixels = (this.width  )/ canvasPeriod;
        var secOffset = this.offset * 3600;
        var pixelsOffset = secOffset * oneSecondInPixels;
        var currentY = 0;

        //var column_line_sec = this.drawPeriodfrom;
		var seconds_to_next_hour = 3600 - this.drawPeriodfrom%3600;
		var column_line_sec  = seconds_to_next_hour;
		var range = this.drawPeriodto - this.drawPeriodfrom;
        while (column_line_sec <= range) {
           
			ctx.drawImage(document.getElementById("1px_grey"),(column_line_sec*oneSecondInPixels).toFixed(2),0); 
            column_line_sec += 3600;
        }
 
        // Draw admin selection
       
 
        //printLog('logs_window','Shapes'+ l,'blue');
        for (i = 0; i < l; i += 1) {
            var bfrom = shapes[i].from;
            var bto = shapes[i].to;
            if ( ( bfrom   >= this.drawPeriodfrom && bfrom   <= this.drawPeriodto ||
                bto   >= this.drawPeriodfrom   && bto  <= this.drawPeriodto  &&
                shapes[i].type!=="adminReserved" ) ) {
                shapes[i].draw(ctx);  
            }
        }
 
        for (var c = 0 ; c < this.closeShapes.length ; c++ ) {
                this.closeShapes[c].draw(ctx);
        }
		 if(this.adminSelection != null) {
            this.adminSelection.draw(ctx);
        }
        ctx.globalAlpha = 1;

        // hover border : #673AB7
        ctx.strokeStyle = "white";
        //ctx.strokeRect(0,0,this.width,this.height);


        var tline = 0;
        var ind = 0;


        // ** Add stuff you want drawn on top all the time here **
        // ** Draw place shapes on timeline
 
        this.valid = true;
    }
};
 
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
 
    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
    //alert(this.stylePaddingLeft);
    mx = parseInt((e.pageX - offsetX)/this.zoom);
    my = parseInt((e.pageY - offsetY)/this.zoom);

    if(mx < 0) { mx = 0 };
    if(mx > this.origWidth) { mx = this.origWidth };
    if(my < 0) { my = 0 };
    if(my > this.origHeight) { my = this.origHeight };
    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my , orgx: e.pageX , orgy: e.pageY};
};

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();
var canvas_ = "";

function dbRoundRectT (ctx,x,y,w,h,strokeColor,fillColor,alpha,salpha,sw,R) {
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
    var cx = x ;
    var cy = y ;
    ctx.lineWidth = sw;

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    if (sw == 0) {
        ctx.strokeStyle = ctx.fillStyle;
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
function xypoint(x,y) {
    if(x == undefined) {
        this.x=0;
    } else {
        this.x=x;
    }
    if(y == undefined) {
        this.y=0;
    } else {
        this.y=y;
    }
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

 

