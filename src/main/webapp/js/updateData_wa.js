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
	$('#canvas_wrap_not_scroll_ub').perfectScrollbar();
	$('#canvas_wrap_not_scroll_ub').perfectScrollbar('update');
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
			tl_canvas.shapeViews[Sshape.sid]=Sshape;
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
			tl_canvas.shapeViews[Sshape.sid]=Sshape;
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
			tl_canvas.shapeViews[Sshape.sid]=Sshape;
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
			tl_canvas.shapeViews[Sshape.sid]=Sshape;
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
			tl_canvas.shapeViews[Sshape.sid]=Sshape;
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

			}
			options.imgID = origImageID;
			var Sshape = new Shape(canvas, shape.x , shape.y , shape.w, shape.h, "image" , options );
			Sshape.rotate = shape.rotate;
			Sshape.angle = shape.angle;
			Sshape.sid=shape.sid;
			if(!!shape.booking_options) {
				booking_options	 = JSON.parse(JSON.stringify(shape.booking_options));
				Sshape.booking_options = booking_options;
			}
			canvas.addShape(Sshape);
			tl_canvas.shapeViews[Sshape.sid]=Sshape;
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
		$('#history_images_wrapper').append('<img id="history_'+ pickImageID +'" class="history_tumb" ondblclick="imgPicker(this,\'tmp\',\''+pickImageID+'\')" />');
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
			document.getElementById("history_"+pickImageID).src =  document.getElementById(pickImageID).src ;
			document.getElementById("history_"+pickImageID).style.width = hist_width + 'px';
			document.getElementById("history_"+pickImageID).style.height = hist_height + 'px';
			$('#history_div_scrollable').perfectScrollbar();
			$('#history_div_scrollable').perfectScrollbar('update');
			currentUploaded +=1;
			for (var i = 0; i < floorCanvases.length ; i++ ) {
				floorCanvases[i].valid = false;
			}
		};

	} else {
		var imgKey = ImageID;
		if(imgKey in imgIDcreated) {
			for (var i = 0; i < floorCanvases.length ; i++ ) {
				floorCanvases[i].valid = false;
			}
		} else {
			$('#prev_used_images').append('<canvas id="tmp_canvas_'+ imgKey +'" width="60" height="60"></canvas>');
			$('#canvas_shapes_images').append('<img id="'+ imgKey +'"/>');
			$('#history_images_wrapper').append('<img id="history_'+ imgKey +'" class="history_tumb" ondblclick="imgPicker(this,\'tmp\',\''+imgKey+'\')" />');

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
				document.getElementById("history_"+imgKey).src =  document.getElementById(imgKey).src ;
				document.getElementById("history_"+imgKey).style.width = hist_width + 'px';
				document.getElementById("history_"+imgKey).style.height = hist_height + 'px';
				$('#history_div_scrollable').perfectScrollbar();
				$('#history_div_scrollable').perfectScrollbar('update');

				currentUploaded +=1;
			};
		}
	}

}
var timegrid;
function UpdateHeader() {
	document.getElementById("header_place_name_").innerHTML  = document.getElementById("server_placeName").value + "," + document.getElementById("server_placeBranchName").value;
	document.getElementById("header_place_address_").innerHTML  = "("+document.getElementById("server_Address").value+")";
}
function InitialCanvasTimeline(cid) {
	InitialBookings = JSON.parse(document.getElementById("server_bookingsInitial").value);
	var BookingProperties = JSON.parse(document.getElementById("server_bookingProperties").value)
	var from = InitialBookings.date1970;
	var to = InitialBookings.date1970 + InitialBookings.period;
	var offset = InitialBookings.placeOffset;

	tl_canvas = new BCanvasState(document.getElementById(cid),from,to,offset);
	tl_canvas.bookingProperties = BookingProperties;
	tl_canvas.step = BookingProperties.bookStartStep;
	timelinediv = new TimelineDiv(tl_canvas,"canvas_timeline_div");
	timegrid = new TimeGrid(tl_canvas,"timegridwrap");
	bookingsManager = new BookingListManager();
	bookingsManager.bookingProperties = BookingProperties;

	var shapesBooked = InitialBookings.shapesBooked;

	for (var b=0 ; b < shapesBooked.length ; b++) {
		var sid = shapesBooked[b].sid;
		bookingsbysid[sid] = shapesBooked[b].ordersList;
	}

	var allfloors =  document.getElementsByName("server_canvasState");

	for(var x=0; x < allfloors.length; x++) {
		var canvasfloor = allfloors[x].id;
		var floorID = canvasfloor.replace(/^server_canvasState_/, "");
		var floor = JSON.parse(document.getElementById(canvasfloor).value);
		StateFromServer.floors.push(floor);
	}

	for(var f = 0 ; f < StateFromServer.floors.length ; f++ ) {
		var shapes = StateFromServer.floors[f].shapes;
		var floorid = StateFromServer.floors[f].floorid;
		for (var s=0 ; s < shapes.length ; s++) {
			if(shapes[s].type != "line" && shapes[s].type != "text" ) {
				var sid = shapes[s].sid;
				var x = shapes[s].x;
				var y = shapes[s].y;
				var fid = floorid;
				var name  = shapes[s].booking_options.givenName;
				var bookings = [];
				if (bookingsbysid[sid] != undefined) {
					var booklist = bookingsbysid[sid];
					for (var t=0 ; t < booklist.length ; t++ ) {
						var booktype = "booked";
						if(booklist[t].type != undefined  ) {
							if(booklist[t].type == "user") {
								booktype = "booked";
							} else if (booklist[t].type == "admin") {
								booktype = "adminReserved";
							}

						}
						var bid = booklist[t].bid;
						var from = booklist[t].from;
						var to = booklist[t].to;
						var persons = booklist[t].persons;
						var bshape = new BShape(tl_canvas, from , to , bid , persons , booktype ,name,sid);

						bookings.push(bshape);
					}
				}
				var pshape = new PShape(tl_canvas , sid , name , fid , x , y , bookings);
				tl_canvas.addPShape(pshape);
			}
		}

	}

	var placeOpen = InitialBookings.placeOpen;

	var array = ['sun','mon','tue','wed','thu','fri','sat'];
	var placeClosedArray = [];
	var placeFromSave = 0
	for (var i = 0 ; i < placeOpen.length ; i ++ ) {
		var singleClosed = {};
		if (placeOpen[i].from > 0) {
			singleClosed.from = placeFromSave;
			singleClosed.to = placeOpen[i].from;
			placeClosedArray.push(singleClosed);
		} else {

		}
		placeFromSave = placeOpen[i].to;
	}
	if (placeFromSave < (tl_canvas.drawPeriodto - tl_canvas.drawPeriodfrom)) {
		//add close shape at the end;
		var singleClosed = {};
		singleClosed.from = placeFromSave;
		singleClosed.to=(tl_canvas.drawPeriodto - tl_canvas.drawPeriodfrom);
		placeClosedArray.push(singleClosed);
	}
	for (var c = 0; c < placeClosedArray.length ; c++) {
		var bshape = new BShape(tl_canvas, tl_canvas.drawPeriodfrom + placeClosedArray[c].from - offset * 3600 , tl_canvas.drawPeriodfrom + placeClosedArray[c].to - offset * 3600, "" , 0 , "closed");
		tl_canvas.closeShapes.push(bshape);
	}
	tl_canvas.organizeShapes();
	tl_canvas.valid = false;
	timelinediv.redraw();
	timegrid.redraw();
}
function InitialBookingList(data) {
	// Update Bookings List
	var Bookings = {};
	if(data!=undefined) {
		Bookings = data;
	} else {
		Bookings = JSON.parse(document.getElementById("server_bookings").value);
	}
	for (var b =0 ; b < Bookings.length ; b++ ) {
		var from = Bookings[b].time;
		var to = Bookings[b].time + Bookings[b].period;
		var bid = Bookings[b].bookID;
		var num = Bookings[b].num;
		var user = Bookings[b].user;
		var type = "approved";
		var booktype = Bookings[b].type;
		var places = Bookings[b].bookingList.length;
		if(Bookings[b].phone!=undefined) {
			user.phone = Bookings[b].phone;
		}
		var names = [];
		var persons = 0;
		//myState.shapeViews[myState.SIDsorted[linehover]].booking_options.givenName;
		for (var s = 0 ; s < Bookings[b].bookingList.length ; s++ ) {
			persons+=Bookings[b].bookingList[s].persons;
			var name_={};
			name_.name = tl_canvas.shapeViews[Bookings[b].bookingList[s].sid].booking_options.givenName;
			for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
				var floor = floorCanvases[cf];
				for (var sd = 0 ; sd < floor.shapes.length ; sd++) {
					if(floor.shapes[sd].sid == Bookings[b].bookingList[s].sid) {
						name_.floorname = floor.floor_name;
						break;
					}
				}
			}
			name_.sid= Bookings[b].bookingList[s].sid;
			name_.persons = Bookings[b].bookingList[s].persons;
			names.push(name_);
		}
		var bshapeAll = new BShapeAll( from , to , bid , persons , type , names , places,num,user,booktype);
		bookingsManager.addBooking(bshapeAll);
	}
}
