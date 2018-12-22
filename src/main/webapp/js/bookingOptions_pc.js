/**
 * 
 */
var auto_recepients = [];
var admin_recepients = [];
var uploadedImapImages = {};
function updatePhotosAndLogo() {
	//server_imap
	if (document.getElementById("server_logosrc")!=null && document.getElementById("server_logosrc").value != "") {
		  var image = new Image();
		  image.crossOrigin = 'anonymous';
		  image.src = document.getElementById("server_logosrc").value ;				  
		  image.onload = function() {
			   var actualWidth = this.width;
			   var actualHeight = this.height;
			   document.getElementById("uploaded_logo_temp").src =  image.src ;
	           document.getElementById("uploaded_logo_temp").style.width = actualWidth + 'px';
	           document.getElementById("uploaded_logo_temp").style.height = actualHeight + 'px';
	           
				var c = document.getElementById("upload_logo_canvas");
			    var ctx = c.getContext("2d");
				// temp img for canvas draw
				var imgID = document.getElementById("uploaded_logo_temp");
				// constant image for pick
			    var mirror = document.getElementById("uploaded_logo_canvas_source_100");    
	            ctx.clearRect( 0 , 0 , 100 , 100 );
				if (actualWidth > actualHeight) {
			    	ctx.drawImage(this,0,0,actualHeight,actualHeight,0,0,100,100);
				} else {
					ctx.drawImage(this,0,0,actualWidth,actualWidth,0,0,100,100);
				}
				mirror.width = 100+"px";
				mirror.height = 100+"px";
				var dataURL = c.toDataURL('image/png');
				mirror.src = dataURL;
		   };
	}
	 var allimup =document.getElementsByName("server_imap");
     for(var x=0; x < allimup.length; x++) {
     	 updatePhotoUnique(allimup[x].id);
    }
}
function updatePhotoUnique (imapID) { 
	 var image = {};
   	 var imgData = JSON.parse(document.getElementById(imapID).value);
   	 var imgID = imgData.imageID;
   	 var src = imgData.data64;
	 
	 uploaded_images_divs.push(imgID);
   	 image = new Image();
		  image.crossOrigin = 'anonymous';
		  image.src = src ;
		  image.temp_ = imgID; 				  
		  image.onload = function() {
			 var appendData = "";
			appendData += '<div class="uploaded_single_image_w" id="uu_wrap_'+imgID+'"><canvas class="uploaded_single_image_can" id="show_'+imgID+'" style="display:none"></canvas>';
			appendData += '<div class="thumbnail">';
			appendData += ' <img src=""  id="'+imgID+'" name="imup_image" class="imap_image_single">';
			appendData += '  <div class="caption">';
			appendData += '	<div class="delete_image_pc"  id="delete_uu_'+imgID+'" onclick="removeImageUU(this)">Remove image</div> ';
			appendData += '  </div>';
			appendData += '</div></div>';
			$("#upload_conf_img_append_show").prepend(appendData); 
			
			document.getElementById(imgID).src =  image.src ; 
		}
    
}



function addCanvas(domID,canvasID) {
	$('#'+domID).append('<canvas id="'+canvasID+'"  width="400" height="30"  tabindex="1" />');
}
var TimeRangeValues = [];
var currentSliderValue = {};
var CanvasStates = [];
var clientBookings = {};
var uploaded_images_divs = [];
var admin_users = [];

function removeImageUU(this_) {
  var id=this_.id;
  var imgid = id.replace(/^delete_uu_/,"");
  var divid = "uu_wrap_"+imgid;
  $("#"+divid).remove();
  $("#"+imgid).remove();
 	var idx = uploaded_images_divs.indexOf(parseInt(imgid));
	if (idx != -1) {
	    return uploaded_images_divs.splice(idx, 1); // The second parameter is the number of elements to remove.
	} 
}
var CloseDatesList = [];
var WeekDaysSliderValue = {};
$(document).ready(function () { 
$("input:radio[name=book_policy]").click(function() {
var t = $(this)[0].id;
  if(t == "bp_admin") {
    $("#bp_admin_wrap").show();
	$("#bp_auto_wrap").hide();
	$("#bp_auto_text").removeClass("bp_t_selected");
	$("#bp_admin_text").addClass("bp_t_selected");
  } else {
     $("#bp_admin_wrap").hide();
	 $("#bp_auto_wrap").show();
	 $("#bp_admin_text").removeClass("bp_t_selected");
	 $("#bp_auto_text").addClass("bp_t_selected");
  }
});
});
$(document).ready(function () { 
	$( "#map_div_config" ).hover(
			  function() {
				  $("#open_map_tag").addClass( "map_thumb_hover" );

			  }, function() {
					  $('#open_map_tag').removeClass( "map_thumb_hover" );			  
				  
			  }
	);	
	for (var i =0 ; i < 2 ; i++) {
		for (var h=0 ; h < 24 ; h += 1) {
		   for (var m=0 ; m < 60 ; m +=15 ) {
			  var h_ = ""+h;
			  var m_ = ""+m;
			  if(h<10) {
				 h_ = "0"+h;
			  } 
			  if(m ==0 ) {
				m_  = "0"+m;
			  }
			 
			  if (i==0) {
			    TimeRangeValues.push(h_+":"+m_);
			  } else {
			    TimeRangeValues.push(h_+":"+m_+" <span class='nextdayslider'>NextDay</span>");
			  }
		   }
		}
	}
    var now_plus_15 = moment() ;
	var modulus_15m = now_plus_15 % (15*60*1000);
	var equals15 = now_plus_15 - modulus_15m + 15*60*1000;



		$("#open_time_slider_sun").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval:2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_sun_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_sun_to'] = data.to * 15 * 60;
	           $("#config_from_to_sun").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_sun_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_sun_to'] = data.to * 15 * 60;

		        $("#config_from_to_sun").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_mon").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_mon").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_mon").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_mon_from'] = fromInd  * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_mon_to'] = toInd  * 15 * 60;
					 $("#config_from_to_mon").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_sat").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_sat").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_sat").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_sat_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_sat_to'] = toInd * 15 * 60;
					 $("#config_from_to_sat").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_sun_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_sun_to'] = data.to * 15 * 60;
		        $("#config_from_to_sun").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
		$("#open_time_slider_mon").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval: 2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_mon_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_mon_to'] = data.to * 15 * 60;
	           $("#config_from_to_mon").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_mon_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_mon_to'] = data.to * 15 * 60;
		        $("#config_from_to_mon").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_tue").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_tue").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_tue").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_tue_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_tue_to'] = toInd * 15 * 60;
					 $("#config_from_to_tue").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_sun").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_sun").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_sun").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_sun_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_sun_to'] = toInd * 15 * 60;
					 $("#config_from_to_sun").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}				
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_mon_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_mon_to'] = data.to * 15 * 60;
		        $("#config_from_to_mon").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
		$("#open_time_slider_tue").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval: 2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_tue_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_tue_to'] = data.to * 15 * 60;
	           $("#config_from_to_tue").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_tue_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_tue_to'] = data.to * 15 * 60;
		        $("#config_from_to_tue").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_wed").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_wed").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_wed").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_wed_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_wed_to'] = toInd * 15 * 60;
					 $("#config_from_to_wed").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_mon").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_mon").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_mon").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_mon_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_mon_to'] = toInd * 15 * 60;
					 $("#config_from_to_mon").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}				
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_tue_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_tue_to'] = data.to * 15 * 60;
		        $("#config_from_to_tue").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
		$("#open_time_slider_wed").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval: 2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_wed_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_wed_to'] = data.to * 15 * 60;
	           $("#config_from_to_wed").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_wed_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_wed_to'] = data.to * 15 * 60;
		        $("#config_from_to_wed").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_thu").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_thu").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_thu").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_thu_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_thu_to'] = toInd * 15 * 60;
					 $("#config_from_to_thu").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_tue").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_tue").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_tue").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_tue_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_tue_to'] = toInd * 15 * 60;
					 $("#config_from_to_tue").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_wed_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_wed_to'] = data.to * 15 * 60;
		        $("#config_from_to_wed").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
		$("#open_time_slider_thu").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval: 2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_thu_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_thu_to'] = data.to * 15 * 60;
	           $("#config_from_to_thu").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_thu_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_thu_to'] = data.to * 15 * 60;
		        $("#config_from_to_thu").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_fri").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_fri").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_fri").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_fri_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_fri_to'] = toInd * 15 * 60;
					 $("#config_from_to_fri").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_wed").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_wed").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_wed").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_wed_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_wed_to'] = toInd * 15 * 60;
					 $("#config_from_to_wed").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_thu_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_thu_to'] = data.to * 15 * 60;
		        $("#config_from_to_thu").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
		$("#open_time_slider_fri").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval: 2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_fri_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_fri_to'] = data.to * 15 * 60;
	           $("#config_from_to_fri").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_fri_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_fri_to'] = data.to * 15 * 60;
		        $("#config_from_to_fri").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_sat").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_sat").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_sat").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_sat_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_sat_to'] = toInd * 15 * 60;
					 $("#config_from_to_sat").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_thu").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_thu").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_thu").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_thu_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_thu_to'] = toInd * 15 * 60;
					 $("#config_from_to_thu").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}				
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_fri_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_fri_to'] = data.to * 15 * 60;
		        $("#config_from_to_fri").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
		$("#open_time_slider_sat").ionRangeSlider({
			type:"double",
		    values:TimeRangeValues,
			from:TimeRangeValues.indexOf("08:00"),
			to:TimeRangeValues.indexOf("20:00"),
			from_max:95,
			min_interval: 2,
			onStart: function (data) {
	           WeekDaysSliderValue['open_time_slider_sat_from'] = data.from * 15 * 60;
	           WeekDaysSliderValue['open_time_slider_sat_to'] = data.to * 15 * 60;
	           $("#config_from_to_sat").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        },
	        onChange: function (data) {
	        	WeekDaysSliderValue['open_time_slider_sat_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_sat_to'] = data.to * 15 * 60;
		        $("#config_from_to_sat").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
				var nextRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_sun").data("from"));
				var nextRangeTo= TimeRangeValues.indexOf($("#open_time_slider_sun").data("to"));
				if(data.to - 96 > nextRangeFrom) {
				   var slider = $("#open_time_slider_sun").data("ionRangeSlider");
				   var diff = nextRangeTo - nextRangeFrom;
				   var fromInd = data.to - 96;
				   var toInd = nextRangeTo;
				   if(diff<2) {
				      toInd = fromInd + diff;
				   } 				   
					 slider.update({
					    from : fromInd,
						to:toInd
					 });
					 WeekDaysSliderValue['open_time_slider_sun_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_sun_to'] = toInd * 15 * 60;
					 $("#config_from_to_sun").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}
				var prevRangeFrom = TimeRangeValues.indexOf($("#open_time_slider_fri").data("from"));
				var prevRangeTo = TimeRangeValues.indexOf($("#open_time_slider_fri").data("to"));
				if(data.from + 96 < prevRangeTo) {
				   var slider = $("#open_time_slider_fri").data("ionRangeSlider");
				   var diff = prevRangeTo - prevRangeFrom;
				   var toInd = data.from + 96;
				   var fromInd = prevRangeFrom;
				   if(diff<2) {
				      fromInd = toInd - diff;		
				   }				   		   
					 slider.update({
					    to : toInd,
						from:fromInd
					 });
					 WeekDaysSliderValue['open_time_slider_fri_from'] = fromInd * 15 * 60;
		             WeekDaysSliderValue['open_time_slider_fri_to'] = toInd * 15 * 60;
					 $("#config_from_to_fri").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
				}				
	        },
			onFinish:  function (data) {
				WeekDaysSliderValue['open_time_slider_sat_from'] = data.from * 15 * 60;
		        WeekDaysSliderValue['open_time_slider_sat_to'] = data.to * 15 * 60;
		        $("#config_from_to_sat").html(TimeRangeValues[data.from]+"-"+TimeRangeValues[data.to]);
	        }
	    });
 

	
placeUTCOffsetGlobal = document.getElementById("server_placeUTC").value;
 

 
});
var SelectedShapesHash = {};
 
var placeUTCOffsetGlobal ;

function calcTime(date,offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    return  moment(nd).format("DD/MM/YY HH:mm:ss");

}



var place_slider_value;
var slider_value;
 
var currentInSelection=[];
 