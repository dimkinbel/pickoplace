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
	$('#canvas_wrap_not_scroll_conf').perfectScrollbar();
	$('#canvas_wrap_not_scroll_conf').perfectScrollbar('update');

}


$(document).ready(function() {

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


});


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


var globalFloorCounter = 0;

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
var SID2GCSimage;
var SaveObject = {};
function createSaveObject() {
  
  if (globalFloorCounter == floorCanvases.length) {
     SaveObject = {};
	 globalFloorCounter = 0;
	 SaveObject.stage = "Configuration";
	 SaveObject.UTCoffset = document.getElementById("UTCoffcet_hidden").value; 
	 SaveObject.placeName = document.getElementById("config_place_name").value;
	 SaveObject.branchName = document.getElementById("config_branch_name").value;
	 SaveObject.address = document.getElementById("config_address").value;
	 SaveObject.lat = document.getElementById("server_Lat").value;
	 SaveObject.lng = document.getElementById("server_Lng").value;
	 SaveObject.placePhone = document.getElementById("config_phone").value;
	 SaveObject.placeFax = document.getElementById("config_fax").value;
	 SaveObject.placeMail = document.getElementById("config_mail").value;
	 SaveObject.placeURL = document.getElementById("config_siteurl").value;
	 SaveObject.placeDescription = document.getElementById("config_brief_text").value;
	 
	 var logo = document.getElementById("uploaded_logo_canvas_source_100").src;
	 if(logo!=undefined && logo != null && logo!="") {
	  SaveObject.logosrc = logo;
	 } else {
	  SaveObject.logosrc = "";
	 }
	 var placePhotos = [];
	 var allimup =document.getElementsByName("imup_image");
     for(var x=0; x < allimup.length; x++) {
	   var imageSrc = document.getElementById(allimup[x].id).src;
	   var width = document.getElementById(allimup[x].id).width;
	   var height = document.getElementById(allimup[x].id).height;
	   var imageObject = {};
	   imageObject.imageID = allimup[x].id;
	   imageObject.data64 = imageSrc;
	   imageObject.width = width;
	   imageObject.height = height;
	   placePhotos.push(imageObject);
     }
	 SaveObject.placePhotos = placePhotos;
	 // Week days
	 SaveObject.workinghours = {};
	 var sun = {};
	 sun.open = document.getElementById("pbook_sun_cb").checked;
	 sun.from = WeekDaysSliderValue['open_time_slider_sun_from'];
	 sun.to = WeekDaysSliderValue['open_time_slider_sun_to']; 
	 SaveObject.workinghours.sun =  sun;
	 var mon = {};
	 mon.open = document.getElementById("pbook_mon_cb").checked;
	 mon.from = WeekDaysSliderValue['open_time_slider_mon_from'];
	 mon.to = WeekDaysSliderValue['open_time_slider_mon_to'];
	 SaveObject.workinghours.mon = mon;
	 var tue = {};
	 tue.open = document.getElementById("pbook_tue_cb").checked;
	 tue.from = WeekDaysSliderValue['open_time_slider_tue_from'];
	 tue.to = WeekDaysSliderValue['open_time_slider_tue_to'];
	 SaveObject.workinghours.tue = tue;
	 var wed = {};
	 wed.open = document.getElementById("pbook_wed_cb").checked;
	 wed.from = WeekDaysSliderValue['open_time_slider_wed_from'];
	 wed.to = WeekDaysSliderValue['open_time_slider_wed_to'];
	 SaveObject.workinghours.wed = wed;
	 var thu = {};
	 thu.open = document.getElementById("pbook_thu_cb").checked;
	 thu.from = WeekDaysSliderValue['open_time_slider_thu_from'];
	 thu.to = WeekDaysSliderValue['open_time_slider_thu_to'];
	 SaveObject.workinghours.thu = thu ;
	 var fri = {};
	 fri.open = document.getElementById("pbook_fri_cb").checked;
	 fri.from = WeekDaysSliderValue['open_time_slider_fri_from'];
	 fri.to = WeekDaysSliderValue['open_time_slider_fri_to'];
	 SaveObject.workinghours.fri = fri;
	 var sat = {};
	 sat.open = document.getElementById("pbook_sat_cb").checked;
	 sat.from = WeekDaysSliderValue['open_time_slider_sat_from'];
	 sat.to = WeekDaysSliderValue['open_time_slider_sat_to'];
	 SaveObject.workinghours.sat = sat ;
	 
	 SaveObject.closeDates = CloseDatesList;
	 var placeEditList = [];
	 var allpeat =document.getElementsByName("table_peat_append");
     for(var x=0; x < allpeat.length; x++) {
	   var id = allpeat[x].id;
	   console.log(id);
	   var mail = id.replace(/peat_/,"");
	   var user = {};
	   user.mail = mail;
	   user.full_access = document.getElementById('peat_cb_fa_'+mail).checked;
	   user.edit_place = document.getElementById('peat_cb_ep_'+mail).checked;
	   user.move_only = document.getElementById('peat_cb_mo_'+mail).checked;
	   user.book_admin = document.getElementById('peat_cb_ba_'+mail).checked;	   
	   placeEditList.push(user);
     }	 
	 SaveObject.placeEditList = placeEditList;
	 var automaticApprovalList = [];
	 var adminApprovalList = [];
	 SaveObject.automatic_approval = document.getElementById('bp_auto').checked;
	 if (SaveObject.automatic_approval) {
	   var all = document.getElementsByName("auto_mail_recepient");
	   for(var x=0; x < all.length; x++) {
	      var id = all[x].id;
		  var mail = document.getElementById(id).value;
		  automaticApprovalList.push(mail);
	   }
	 } else {
	   var all = document.getElementsByName("admin_mail_recepient");
	   for(var x=0; x < all.length; x++) {
	      var id = all[x].id;
		  var mail = document.getElementById(id).value;
		  adminApprovalList.push(mail);
	   }	 
	 }
	 SaveObject.automaticApprovalList = automaticApprovalList;
	 SaveObject.adminApprovalList = adminApprovalList;
	 
 
	 var JSONbyte64files=[]; // { "imageID" : data64 }
     var JSONSIDlinks = [];  // { "sid" : "ImageID" }
     var ImageMirrorUsed = {};
     var user_ = "testing1";
     var place_ = "testingPlace1";
     var snif_ = "testingSnif1";
	 SaveObject.user_ = user_;
	 SaveObject.place_ = document.getElementById("config_place_name").value;
	 SaveObject.snif_ =  document.getElementById("config_branch_name").value;
	 SaveObject.placeID = document.getElementById("userSetPlaceID").value;	 
	 SaveObject.floors = [];
   for (var c=0;c < floorCanvases.length; c++ ) {   
      var state = floorCanvases[c];
      console.log("Saving State:"+state);
	  // shapes , canvas , zoom ,
      var CanvasFloor = {};
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
	  var bgshapes = [];
	  if (state.shapes.length != "undefined") {
		for (var i = 0; i < state.shapes.length; i += 1) {
		   var Shape = JSON.parse(JSON.stringify(state.shapes[i],["x","y","w","h","rotate","angle","type","options","prevMX","prevMY","sid"]));
		   var intAngle = parseInt(Shape.angle);
		   Shape.angle = intAngle;
		   var shapeOptions = JSON.parse(JSON.stringify(state.shapes[i].options));
		   if(shapeOptions.imgID!=undefined) {
			   var replace_server_prefix = shapeOptions.imgID.replace(/^server_/,"");
			   shapeOptions.imgID = replace_server_prefix;
		   }
		   var bookingOptions = JSON.parse(JSON.stringify(state.shapes[i].booking_options));
		   Shape.options = shapeOptions;
		   Shape.booking_options = bookingOptions;
		   shapes.push(Shape);
		}
	  }
	  if (state.bgshapes.length != "undefined") {
			for (var i = 0; i < state.bgshapes.length; i += 1) {
			   var Shape = JSON.parse(JSON.stringify(state.bgshapes[i],["x","y","w","h","rotate","angle","type","options","prevMX","prevMY","sid"]));
			   var intAngle = parseInt(Shape.angle);
			   Shape.angle = intAngle;
			   var shapeOptions = JSON.parse(JSON.stringify(state.bgshapes[i].options));
			   if(shapeOptions.imgID!=undefined) {
				   var replace_server_prefix = shapeOptions.imgID.replace(/^server_/,"");
				   shapeOptions.imgID = replace_server_prefix;
			   }
			   Shape.options = shapeOptions;
			   bgshapes.push(Shape);
			}
		  }
    CanvasFloor.shapes=shapes;
    CanvasFloor.bgshapes=bgshapes;
    
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
	  CanvasFloor.background = document.getElementById("chosed_background_orig_"+floorid).src;
  } else if (CanvasFloor.state.backgroundType == "tiling") {
	  // Image preload while user chooses background from menu
	  CanvasFloor.background =  document.getElementById("default_bg_image_mirror_"+floorid).src;
  }

  var allshapes = [];
  allshapes = allshapes.concat(state.shapes);
  allshapes = allshapes.concat(state.bgshapes);
  
  for (var i = 0; i < allshapes.length; i += 1) {
      if (allshapes[i].type == "image") {
    	  var imgID = allshapes[i].options.imgID;
    	  var sid = allshapes[i].sid;
    	  var myRegExp = /^user_img/;
    	  if(imgID.match(myRegExp)) {
 			  var jsonimgID_2_data = {"imageID":imgID ,"data64": document.getElementById(imgID).src};
			  JSONbyte64files.push(jsonimgID_2_data);
			  var jsonSID_2_imgID = {"sid":sid,"imageID":imgID};
			  JSONSIDlinks.push(jsonSID_2_imgID);    		  
    	  } else {
    		  myregexp = /mirror/;
    		  var myregexp2 = /^server_/;
    		  var imgKey;
    		  if (imgID.match(myregexp)) {
    			  imgKey = imgID;
    		  } else if(imgID.match(myregexp2)) {
    			  imgKey = imgID;
    			  imgID = imgID.replace(/^server_/,"");
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
	      beforeSend: function () { $("#ajax_save_hide").hide(); $("#ajax_save_img_conf").show(); },
	      success : function(data){
	    	  $("#ajax_save_img_conf").hide();
	    	  $("#ajax_save_hide").show();
	    	  
	    	  if(proceed_to_edit == 1) {
	    		  var pid = document.getElementById("placeIDvalue").value;
	       	      editPlace(pid+"_editform");
	    	  } else if (proceed_to_iframe == 1) {
	    		  var pid = document.getElementById("placeIDvalue").value;
	       	      editPlace(pid+"_iframeform");	    		  
	    	  }
	      },
	      dataType : "json",
	      type : "post"
	  });  	
	
}
