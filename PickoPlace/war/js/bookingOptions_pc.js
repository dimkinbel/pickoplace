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
	$("#no_image_upload_conf").hide();
	 var image = {};
   	 var imgData = JSON.parse(document.getElementById(imapID).value);
   	 var imgID = imgData.imageID;
   	 var src = imgData.data64;
   	 
     var appendData = "";
	 appendData += '<div class="uploaded_single_image_w" id="uu_wrap_'+imgID+'"><canvas class="uploaded_single_image_can" id="show_'+imgID+'"></canvas>';
	 appendData += '<div class="delete_img_uu" id="delete_uu_'+imgID+'" onclick="removeImageUU(this)">X</div></div>';
	 $("#upload_conf_img_append_show").append(appendData);
	 var appendData = "";
	 appendData += '<img id="'+imgID+'" name="imup_image"/>';
	 $("#hidden_img_uploads").append(appendData);
	 
		  image = new Image();
		  image.crossOrigin = 'anonymous';
		  image.src = src ;
		  image.temp_ = imgID;

		  var canvas_widthApplied = 200;
		  var canvas_heightApplied = 150;					  
		  image.onload = function() {
			 var actualWidth = this.width;
			 var actualHeight = this.height;

			 var imddivID =  this.temp_;
			 uploadedImapImages[imddivID] = 1;
			 uploaded_images_divs.push(imddivID);
			 var wrel = actualWidth/actualHeight;


			document.getElementById(imddivID).src =  image.src ;
            document.getElementById(imddivID).style.width = actualWidth + 'px';
            document.getElementById(imddivID).style.height = actualHeight + 'px';
			 
			var c = document.getElementById("show_"+imddivID);
			document.getElementById("show_"+imddivID).height = canvas_heightApplied;
			document.getElementById("show_"+imddivID).width = canvas_heightApplied * wrel;
		    var ctx = c.getContext("2d");   
            ctx.clearRect( 0 , 0 , canvas_heightApplied * wrel , canvas_heightApplied );
            ctx.drawImage(this,0,0,actualWidth,actualHeight,0,0,canvas_heightApplied * wrel,canvas_heightApplied);
		   };
    
}
function updateWorkingHours() {
  // Working sliders updated after sliders initialization
    var closeDates = JSON.parse(document.getElementById("server_closeDates").value);	
    if (closeDates.length > 0) {
	    for ( var ind = 0 ; ind < closeDates.length ; ind++) { 
	    	var time = closeDates[ind];// In UTC seconds , but we need to display date relative to browser
	    	var date = new Date(time*1000);
	        var day = date.getUTCDate();
	        var mon = date.getUTCMonth()+1;
	        var year = date.getUTCFullYear();
	        var append = "";
	
	        append += '<div class="close_date_div" id="close-'+time+'">'+day+'/'+mon+'/'+year+'<div class="close_day_img" id="c-close-'+time+'"  onclick="removeCloseDate(this)">remove</div></div>';
	        $("#chosen_closed_dates").append(append);
	    }
    }
}
function updateAdminSection() {
	/*var placeEditJson = JSON.parse(document.getElementById("server_placeEditList").value);
	if (placeEditJson.length > 0) {
		for (var ind in placeEditJson) { 
		  var user = placeEditJson[ind];
		  var mail = user.mail;
		  var full_access = user.full_access;
		  var edit_place = user.edit_place;
		  var move_only = user.move_only;
		  var book_admin = user.book_admin;
		  document.getElementById("peat_add_mail").value = mail;
		  document.getElementById("peat_cb_fa_add").checked = full_access;
		  document.getElementById("peat_cb_ep_add").checked = edit_place;
		  document.getElementById("peat_cb_mo_add").checked = move_only;
		  document.getElementById("peat_cb_ba_add").checked = book_admin;
		  peat_add(true);
		}
	}*/
	var auto_approval = JSON.parse(document.getElementById("server_automatic_approval").value);

  if(!auto_approval) {
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
  var auto_recepient = JSON.parse(document.getElementById("server_automaticApprovalList").value);
  for (var i=0 ; i < auto_recepient.length ; i++) {
	  var mail = auto_recepient[i];
	  document.getElementById("auto_mail_input").value = mail;
	  add_auto_recepient(true);
  }
  var admin_recepient = JSON.parse(document.getElementById("server_adminApprovalList").value);
  for (var i=0 ; i < admin_recepient.length ; i++) {
	  var mail = admin_recepient[i];
	  document.getElementById("admin_mail_input").value = mail;
	  add_admin_recepient(true);
  }
}
function add_auto_recepient(quiet) {
 var mail = document.getElementById("auto_mail_input").value;
 if (mail != undefined && mail != null && mail!= "" ) {
   if(!auto_recepients.contains(mail)) {
    var appendData = '<div id="bp_auto_mail_recipient_append_'+mail+'"><input id="bp_auto_mail_recipient_'+mail+'" name="auto_mail_recepient" class="bp_auto_mail_recipient" value="'+mail+'" disabled/><div class="delete_bp_auto_mail" id="delete_bp_auto_mail_'+mail+'" onclick="delete_auto_mail(\''+mail+'\')">X</div></div>';
	$("#bp_auto_mail_recipients").append(appendData);
	auto_recepients.push(mail);
	document.getElementById("auto_mail_input").value = "";
	} else {
		if (!quiet) {
	     alert("User exists");
		};
	};
 }
}
function delete_admin_mail(mail) {
  var id = "bp_admin_mail_recipient_append_"+mail;
  $("#"+id).remove();
  admin_recepients.remove(mail);
}
function add_admin_recepient(quiet) {
 var mail = document.getElementById("admin_mail_input").value;
 if (mail != undefined && mail != null && mail!= "" ) {
   if(!admin_recepients.contains(mail)) {
    var appendData = '<div id="bp_admin_mail_recipient_append_'+mail+'"><input id="bp_admin_mail_recipient_'+mail+'"  name="admin_mail_recepient" class="bp_admin_mail_recipient" value="'+mail+'" disabled/><div class="delete_bp_admin_mail" id="delete_bp_admin_mail_'+mail+'" onclick="delete_admin_mail(\''+mail+'\')">X</div></div>';
	$("#bp_admin_mail_recipients").append(appendData);
	admin_recepients.push(mail);
	document.getElementById("admin_mail_input").value = "";
	} else {
		if(!quiet) {
	     alert("User exists");
		};
	};
 };
}
function delete_auto_mail(mail) {
  var id = "bp_auto_mail_recipient_append_"+mail;
  $("#"+id).remove();
  auto_recepients.remove(mail);
}
function peat_add(quiet) {
 var mail = document.getElementById("peat_add_mail").value;
 var user = {};
 if (mail != undefined && mail != null && mail!= "" ) {
    user.mail = mail;
	var idx = -1;
    for (var i =0 ; i < admin_users.length ; i ++ ) {
      if (admin_users[i].mail == mail) {
	    idx = i;
	  }
	}
	if (idx == -1) {
	var appendData = "";
	appendData+='<table name="table_peat_append" class="peat_single" id="peat_'+mail+'" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;"><tr class="peat_user_row_">'
	appendData+='  <td class="width40p"><div class="peat_val_user" id="peat_mail_'+mail+'">'+mail+'</div></td>';
	  
    if($('#peat_cb_fa_add').attr("checked")){ 
	  user.full_access = true;
	  appendData+='<td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_fa_'+mail+'" class = "peat_checkbox" checked /></td>'
	} else {
	  user.full_access = false;
	  appendData+='<td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_fa_'+mail+'" class = "peat_checkbox"  /></td>'
	}
    if($('#peat_cb_ep_add').attr("checked")){ 
	  user.edit_place = true;
	  appendData+=' <td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ep_'+mail+'" class = "peat_checkbox" checked /></td>'
	} else {
	  user.edit_place = false;
	  appendData+=' <td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ep_'+mail+'" class = "peat_checkbox"  /></td>'
	}
    if($('#peat_cb_mo_add').attr("checked")){ 
	  user.move_only = true;
	  appendData+='<td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_mo_'+mail+'" class = "peat_checkbox" checked /></td>';
	} else {
	  user.move_only = false;
	  appendData+='<td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_mo_'+mail+'" class = "peat_checkbox"  /></td>';
	}
    if($('#peat_cb_ba_add').attr("checked")){ 
	  user.book_admin = true;
	  appendData+='<td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ba_'+mail+'" class = "peat_checkbox" checked /></td>';
	} else {
	  user.book_admin = false;
	  appendData+='<td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ba_'+mail+'" class = "peat_checkbox"  /></td>';
	}
	appendData+='	  <td  class="peat_cb width12p"><div id="peat_delete_'+mail+'" class="peat_delete" onclick="peat_delete(\''+mail+'\')">Delete</div></td>';
	appendData+=' </tr>';
	appendData+=' </table>';
	$("#peat_append").append(appendData);
	admin_users.push(user);
	document.getElementById("peat_add_mail").value = "";
	} else {
		if(!quiet) {
	       alert("User exists");
		}
	}
 } else {
	 if(!quiet) {
        alert("User mail is missing");
	 }
 }
}
function peat_delete(user) {
  $('#peat_'+user).remove();
  var idx = -1;
  for (var i =0 ; i < admin_users.length ; i ++ ) {
    if (admin_users[i].mail == user) {
	  idx = i;
	}
  }
  admin_users.splice(idx, 1);
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
function removeCloseDate(this_) {
	var id=this_.id;
	var divid = id.replace(/^c-/, "");
	$("#"+divid).remove();
	var listval = divid.replace(/^close-/,"");
	var idx = CloseDatesList.indexOf(parseInt(listval));
	if (idx != -1) {
	    return CloseDatesList.splice(idx, 1); // The second parameter is the number of elements to remove.
	}
}
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
			    TimeRangeValues.push(h_+":"+m_+" NextDay");
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
if (document.getElementById("server_workinghours")!= null && document.getElementById("server_workinghours").value!= "") {
	var server_workinghours	= JSON.parse(document.getElementById("server_workinghours").value);
	var sun = server_workinghours.sun;
	var mon = server_workinghours.mon;
	var tue = server_workinghours.tue;
	var wed = server_workinghours.wed;
	var thu = server_workinghours.thu;
	var fri = server_workinghours.fri;
	var sat = server_workinghours.sat;
	
	var slider = $("#open_time_slider_sun").data("ionRangeSlider");
	   var fromInd = sun.from / 15 /60;
	   var toInd = sun.to / 15 /60;		   
	   slider.update({
		    from : fromInd,
			to:toInd
		 });
	  WeekDaysSliderValue['open_time_slider_sun_from'] = fromInd * 15 * 60;
      WeekDaysSliderValue['open_time_slider_sun_to'] = toInd * 15 * 60;
	  $("#config_from_to_sun").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
	  document.getElementById("pbook_sun_cb").checked = sun.open;
	  
		var slider = $("#open_time_slider_mon").data("ionRangeSlider");
		   var fromInd = mon.from / 15 /60;
		   var toInd = mon.to / 15 /60;		   
		   slider.update({
			    from : fromInd,
				to:toInd
			 });
		  WeekDaysSliderValue['open_time_slider_mon_from'] = fromInd * 15 * 60;
	      WeekDaysSliderValue['open_time_slider_mon_to'] = toInd * 15 * 60;
		  $("#config_from_to_mon").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
		  document.getElementById("pbook_mon_cb").checked = mon.open;
		  
          var slider = $("#open_time_slider_tue").data("ionRangeSlider");
          fromInd = tue.from / 15 /60;
          toInd = tue.to / 15 /60;		   
          slider.update({
              from : fromInd,
          	to:toInd
           });
          WeekDaysSliderValue['open_time_slider_tue_from'] = fromInd * 15 * 60;
          WeekDaysSliderValue['open_time_slider_tue_to'] = toInd * 15 * 60;
          $("#config_from_to_tue").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
          document.getElementById("pbook_tue_cb").checked = tue.open;
          
          var slider = $("#open_time_slider_wed").data("ionRangeSlider");
          fromInd = wed.from / 15 /60;
          toInd = wed.to / 15 /60;		   
          slider.update({
              from : fromInd,
          	to:toInd
           });
          WeekDaysSliderValue['open_time_slider_wed_from'] = fromInd * 15 * 60;
          WeekDaysSliderValue['open_time_slider_wed_to'] = toInd * 15 * 60;
          $("#config_from_to_wed").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
          document.getElementById("pbook_wed_cb").checked = wed.open;
          
          var slider = $("#open_time_slider_thu").data("ionRangeSlider");
          fromInd = thu.from / 15 /60;
          toInd = thu.to / 15 /60;		   
          slider.update({
              from : fromInd,
          	to:toInd
           });
          WeekDaysSliderValue['open_time_slider_thu_from'] = fromInd * 15 * 60;
          WeekDaysSliderValue['open_time_slider_thu_to'] = toInd * 15 * 60;
          $("#config_from_to_thu").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
          document.getElementById("pbook_thu_cb").checked = thu.open;
          
          var slider = $("#open_time_slider_fri").data("ionRangeSlider");
          fromInd = fri.from / 15 /60;
          toInd = fri.to / 15 /60;		   
          slider.update({
              from : fromInd,
          	to:toInd
           });
          WeekDaysSliderValue['open_time_slider_fri_from'] = fromInd * 15 * 60;
          WeekDaysSliderValue['open_time_slider_fri_to'] = toInd * 15 * 60;
          $("#config_from_to_fri").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
          document.getElementById("pbook_fri_cb").checked = fri.open;
          
          var slider = $("#open_time_slider_sat").data("ionRangeSlider");
          fromInd = sat.from / 15 /60;
          toInd = sat.to / 15 /60;		   
          slider.update({
              from : fromInd,
          	to:toInd
           });
          WeekDaysSliderValue['open_time_slider_sat_from'] = fromInd * 15 * 60;
          WeekDaysSliderValue['open_time_slider_sat_to'] = toInd * 15 * 60;
          $("#config_from_to_sat").html(TimeRangeValues[fromInd]+"-"+TimeRangeValues[toInd]);
          document.getElementById("pbook_sat_cb").checked = sat.open;
}
$("#close_datepicker").datepicker({
    currentText: "Now",
	defaultDate: +0,
	dateFormat: "dd/mm/yy",
	autoClose:true,
    minDate: "0",         
    onSelect: function(dateText, inst) {
    	var day =  inst.selectedDay;
    	var mon = inst.selectedMonth;
    	var year = inst.selectedYear;
        var append = "";
        var time_=$("#close_datepicker").datepicker( "getDate" ).getTime()/1000;//UTC seconds at browser,12Jan00:00 at israel but 11Jan22:00 at UTC
        // We need to make 12Jan at UTC seconds
        var d = new Date();
        var UTCoffset = d.getTimezoneOffset();
        var time = time_ - UTCoffset*60;
        append += '<div class="close_date_div" id="close-'+time+'">'+day+'/'+mon+'/'+year+'<div class="close_day_img" id="c-close-'+time+'"  onclick="removeCloseDate(this)">remove</div></div>';
        $("#chosen_closed_dates").append(append);
        CloseDatesList.push(time);
    },
    onClose: function(dateText, inst) {
    	}
});
$( "#close_datepicker" ).datepicker("setDate", "+0");

$("#calendar_hide").click(function() {
$("#calendar_show").show();
$("#calendar_hide").hide();
$("#week_cal_table").hide();
});
$("#calendar_show").click(function() {
$("#calendar_show").hide();
$("#calendar_hide").show();
$("#week_cal_table").show();
});
$("#global_params_tab").click(function(){
  $("#global_params_div").show();
  $("#bookable_params_div").hide();
  $("#calendar_params_div").hide();
  $("#admin_params_div").hide();
  $("#global_params_tab").addClass("config_tab_selected");
  $("#bookable_params_tab").removeClass("config_tab_selected");
  $("#calndar_params_tab").removeClass("config_tab_selected");
  $("#admin_params_tab").removeClass("config_tab_selected");
});
$("#bookable_params_tab").click(function(){
  $("#global_params_div").hide();
  $("#bookable_params_div").show();
  $("#admin_params_div").hide();
  $("#calendar_params_div").hide();
  $("#bookable_params_tab").addClass("config_tab_selected");
  $("#global_params_tab").removeClass("config_tab_selected");
  $("#calndar_params_tab").removeClass("config_tab_selected");
  $("#admin_params_tab").removeClass("config_tab_selected");
  for (var i =0 ; i < floorCanvases.length ; i++) {
	  floorCanvases[i].valid=false;
  }
});
$("#calndar_params_tab").click(function(){
  $("#global_params_div").hide();
  $("#admin_params_div").hide();
  $("#bookable_params_div").hide();
  $("#calendar_params_div").show();
  $("#bookable_params_tab").removeClass("config_tab_selected");
  $("#global_params_tab").removeClass("config_tab_selected");
  $("#admin_params_tab").removeClass("config_tab_selected");
  $("#calndar_params_tab").addClass("config_tab_selected");
});
$("#admin_params_tab").click(function(){
  $("#admin_params_div").show();
  $("#global_params_div").hide();
  $("#bookable_params_div").hide();
  $("#calendar_params_div").hide();
  $("#admin_params_tab").addClass("config_tab_selected");
  $("#bookable_params_tab").removeClass("config_tab_selected");
  $("#global_params_tab").removeClass("config_tab_selected");
  $("#calndar_params_tab").removeClass("config_tab_selected");
});
    
	$("#sc_booking_shape_minpersons").spinner({});
	$("#sc_booking_shape_maxpersons").spinner({});
	
	$("#user_logo_upload").on("change", function()
    	    {
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 100;
					  var canvas_heightApplied = 100;					  
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
					    	ctx.drawImage(imgID,0,0,actualHeight,actualHeight,0,0,100,100);
						} else {
							ctx.drawImage(imgID,0,0,actualWidth,actualWidth,0,0,100,100);
						}
						mirror.width = 100+"px";
						mirror.height = 100+"px";
						var dataURL = c.toDataURL('image/png');
						mirror.src = dataURL;
					   }
    	            };
    	        } 
    	    });

	$("#hidden_image_upload").on("change", function()
    	    {
    	        var files = !!this.files ? this.files : [];
    	        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
    	 
    	        if (/^image/.test( files[0].type)){ // only image file
    	            var reader = new FileReader(); // instance of the FileReader
    	            reader.readAsDataURL(files[0]); // read the local file
    	            reader.onloadend = function(){ // set image data as background of div
					  var image = new Image();
					  image.src = this.result ;
					  var widthApplied = 100;
					  var heightApplied = 100;
					  var canvas_widthApplied = 200;
					  var canvas_heightApplied = 150;					  
					  image.onload = function() {
						 var actualWidth = this.width;
						 var actualHeight = this.height;

						 var imddivID =  "imup_"+randomString(10);
						 uploaded_images_divs.push(imddivID);
						 var wrel = actualWidth/actualHeight;
                         var appendData = "";
						 appendData += '<div class="uploaded_single_image_w" id="uu_wrap_'+imddivID+'"><canvas class="uploaded_single_image_can" id="show_'+imddivID+'"></canvas>';
						 appendData += '<div class="delete_img_uu" id="delete_uu_'+imddivID+'" onclick="removeImageUU(this)">X</div></div>';
						 $("#upload_conf_img_append_show").append(appendData);
						 $("#no_image_upload_conf").hide();
						 var appendData = "";
						 appendData += '<img id="'+imddivID+'" name="imup_image"/>';
						 $("#hidden_img_uploads").append(appendData);
	
						 document.getElementById(imddivID).src =  image.src ;
                         document.getElementById(imddivID).style.width = actualWidth + 'px';
                         document.getElementById(imddivID).style.height = actualHeight + 'px';
						 
						var c = document.getElementById("show_"+imddivID);
						document.getElementById("show_"+imddivID).height = canvas_heightApplied;
						document.getElementById("show_"+imddivID).width = canvas_heightApplied * wrel;
					    var ctx = c.getContext("2d");   
                        ctx.clearRect( 0 , 0 , canvas_heightApplied * wrel , canvas_heightApplied );
						var imgID = document.getElementById(imddivID);
                        ctx.drawImage(imgID,0,0,actualWidth,actualHeight,0,0,canvas_heightApplied * wrel,canvas_heightApplied);
					   };
    	            };
    	        } 
    	    });
			
			
placeUTCOffsetGlobal = document.getElementById("server_placeUTC").value;
setInterval(function(){
    document.getElementById("local_live_time_div").innerHTML = calcTime(new Date(),placeUTCOffsetGlobal);
}, 1000);

// Update PAssed
setInterval(function(){
	for (var i = 0 ; i < CanvasStates.length;i++) {
        var tstate = CanvasStates[i];
        var passs = tstate.passedShape;
        if (passs!=null) {
			 var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime();
			 var placeOffset = document.getElementById("server_placeUTC").value;
			 var  dndt = TimeOfTheDatePicker_1970/1000;
		
			 var d = new Date();
			 var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
			 var nd = new Date(utc + (3600000 * placeOffset));
			 var ndt = nd.getTime()/1000;
			 
			 var twonextdays = new Date(TimeOfTheDatePicker_1970 + 2 * 24 * 3600 * 1000);
			 var twonextdayst = twonextdays.getTime()/1000;
			 if (dndt < ndt && ndt < twonextdayst) {
				 var diff = ndt - dndt;
				 var steps = diff / 15 /60;

              passs.w = steps * tstate.step;
              tstate.valid = false; 
             } else if (ndt>=twonextdayst){
            	 passs.w = tstate.width;
            	 tstate.valid = false; 
             }
       	}
	 }
}, 60000);
});
var SelectedShapesHash = {};
function drawSelectedShapeConfig(shape) {
 var sid=shape.sid;
 if (shape.type == "image") {
   document.getElementById('sc_img_'+sid).src = document.getElementById(shape.options.imgID).src;
   if (shape.w > shape.h) {
	   document.getElementById("sc_img_"+sid).style.width=100+"px";
	   document.getElementById("sc_img_"+sid).style.height = parseInt(100 * shape.h / shape.w)+"px" ; 
   } else {
	   document.getElementById("sc_img_"+sid).style.height=100+"px";
	   document.getElementById("sc_img_"+sid).style.width = parseInt(100 * shape.w / shape.h)+"px" ;
   }
   document.getElementById("sc_canvas_"+sid).style.display = "none";
   document.getElementById("sc_img_"+sid).style.display = "";
  } else {
   document.getElementById("sc_canvas_"+sid).style.display = "";
   document.getElementById("sc_img_"+sid).style.display = "none"; 
   var type = shape.type;
   var c = document.getElementById("sc_canvas_"+sid);
   var ctx = c.getContext("2d");
   ctx.clearRect( 0 , 0 , 100 , 100 );
   
	 if (type == "rectangle") {
		dbDrawRect(ctx,50,50,75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw);
	  } else if (type == "round") { 
		dbRoundRect(ctx , 50, 50, 75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw,shape.options.roundRad);
	  } else if (type == "circle") {
		 dbCircle(ctx , 50, 50, 75,75,shape.options.startA,shape.options.endA,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw);
	  } else if (type == "trapex") {
		 dbTrapez(ctx,50,50,75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw,shape.options.cutX);
	  }  
  } 
}
function removeShapeConfigSelected(shape) {
 $('#table_sc_'+shape.sid).remove();
 SelectedShapesHash[shape.sid]=null;
}
function addShapeConfigSelected(shape) {
 var sid = shape.sid;
 SelectedShapesHash[shape.sid] = shape;
 var name = shape.booking_options.givenName;
 var bookable = shape.booking_options.bookable ;
 var description = shape.booking_options.description;
 var minp = shape.booking_options.minPersons;
 var maxp = shape.booking_options.maxPersons;
 
 var appendData = "";
 appendData+= '<table class="shape_configuration_table" id="table_sc_'+sid+'" cellspacing="0" cellpadding="0" >';
 appendData+= ' <tr><td rowspan=4 class="sc_img_canvas_td">';
 appendData+= '    <canvas class="sc_canvas" id="sc_canvas_'+sid+'"></canvas>';
 appendData+= '    <img class="sc_img" id="sc_img_'+sid+'"/>';
 appendData+= ' </td>';
 appendData+= ' <td class="sco_text" >Booking available</td><td  class="sco_text">Shape name</td>';
 appendData+= ' <td class="min_max_td sco_text" colspan=2 >Persons</td>	';
 appendData+= ' </tr>';
 appendData+= ' <tr>';
 if (bookable) {
   appendData += '   <td style="text-align:center;height:33%" ><input type="checkbox" id="sc_book-able_'+sid+'" class="css-checkbox conf_book" checked="checked" name="book-able"/></td><td ><input class=" booking_value_sc" type="text" id="sc_booking_shape_name_'+sid+'" value="'+name+'"/></td>	';
 } else {
   appendData += '   <td style="text-align:center;height:33%" ><input type="checkbox" id="sc_book-able_'+sid+'" class="css-checkbox conf_book"  name="book-able"/></td><td ><input class=" booking_value_sc" type="text" id="sc_booking_shape_name_'+sid+'" value="'+name+'"/></td>	';
 }

 appendData+= '   <td ><div class="mmco"> Min </div><input type="checkbox" id="checkboxMinP_'+sid+'" class="css-checkbox" checked="checked"/></td>';
 appendData+= '   <td ><input class="booking_spinner conf_b_spin"  id="sc_booking_shape_minpersons_'+sid+'"/></td>	';
 appendData+= ' </tr>';
 appendData+= ' <tr>';
 if(description==undefined || description==null || description=="") {
   appendData+= '    <td colspan=2  class="bbgrt"><textarea style="resize:none;padding:0px" class="book_description" id="sc_booking_shape_desc_'+sid+'" placeholder="Optional description..."></textarea></td>';
 } else {
   appendData+= '    <td colspan=2><textarea style="resize:none;padding:0px" class="book_description" id="sc_booking_shape_desc_'+sid+'" value="'+description+'">'+description+'</textarea></td>';
 }
 appendData+= '	 <td class="bbgrt"  class="bbgrt"><div class="mmco "> Max </div><input type="checkbox" id="checkboxMaxP_'+sid+'" class="css-checkbox" checked="checked"/></td>';
 appendData+= '	 <td class="bbgrt"><input class="booking_spinner  conf_b_spin"  id="sc_booking_shape_maxpersons_'+sid+'"/></td>';
 appendData+= ' </tr>	';							
 appendData+= '</table> ';
 $("#shapes_configuration_append_div").append(appendData);
 drawSelectedShapeConfig(shape);
 $( '#sc_booking_shape_minpersons_'+sid ).spinner({
			min: 1,
			stop: function( event, ui ) {		
               console.log(sid);			
			   var val = document.getElementById('sc_booking_shape_minpersons_'+sid).value;
			   if(val >  $( '#sc_booking_shape_maxpersons_'+sid ).spinner( "value" )) {
			     $( '#sc_booking_shape_maxpersons_'+sid ).spinner( "value", val );
				 SelectedShapesHash[sid].booking_options.maxPersons = val;
			   }
			   SelectedShapesHash[sid].booking_options.minPersons = val;

			}
	 });
 $( '#sc_booking_shape_minpersons_'+sid ).spinner( "value", minp );
 $( '#sc_booking_shape_maxpersons_'+sid ).spinner({
			min: 1,
			stop: function( event, ui ) {
			   console.log(sid);	
			   var val = document.getElementById('sc_booking_shape_maxpersons_'+sid).value;
			   if(val <  $( '#sc_booking_shape_minpersons_'+sid ).spinner( "value" )) {
			     $( '#sc_booking_shape_minpersons_'+sid ).spinner( "value", val );
				 SelectedShapesHash[sid].booking_options.minPersons = val;
			   }
               SelectedShapesHash[sid].booking_options.maxPersons = val;
			}
	 });
$( '#sc_booking_shape_maxpersons_'+sid ).spinner( "value", maxp );

$('#sc_booking_shape_name_'+sid).keyup(function() {
    SelectedShapesHash[sid].booking_options.givenName = this.value; 
  });
 $('#sc_booking_shape_desc_'+sid).keyup(function() {
    SelectedShapesHash[sid].booking_options.description = this.value; 
  });
// Listen to checkbox event
 $('#sc_book-able_'+sid).change(function(){ 
  if($('#sc_book-able_'+sid).attr("checked")){ 
      SelectedShapesHash[sid].booking_options.bookable=true;
  }else{ 
      SelectedShapesHash[sid].booking_options.bookable=false;
  } 
});
}
var placeUTCOffsetGlobal ;
function allowBooking(check_elem) {
	var id = check_elem.id;
	var sid_part = id.replace(/book_checkbox_/, "");
	var spinnerID = "booking_shape_num_persons_"+sid_part;
	var confirmID = "single_confirmation_"+sid_part;
	if($("#"+id).attr("checked")){ 
		 $( "#"+ spinnerID).spinner( "enable" );
	}else{ 
	     $( "#"+ spinnerID).spinner( "disable" );
	}
}
function calcTime(date,offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    return  moment(nd).format("DD/MM/YY HH:mm:ss");

}
var bookingOrderJSONlist=[];
var bookingOrderJSON = {};
function displayBookingRequest() {
  bookingOrderJSONlist=[];
  bookingOrderJSON = {};
  for (var i = 0;i < currentInSelection.length ; i ++) {
      var sid = currentInSelection[i];
      if ($("#book_checkbox_"+sid).attr("checked")) {
		  var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime()/1000;
		  var SecondsOfSliderPicker = place_slider_value*15*60;
		  var PlaceName = document.getElementById("up_place_name_val_"+sid).value;
		  var PlaceSID = document.getElementById("up_place_sid_val_"+sid).value;
		  var TimePeriod = document.getElementById("book_duration").value;
		  var PID = document.getElementById("server_placeID").value;
		  var persons = document.getElementById("booking_shape_num_persons_"+sid).value;
		  var bookID =  "book_"+randomString(15);
		  var testID = "temp_"+randomString(10);
		  var d = new Date();
		  var clientOffset = d.getTimezoneOffset();
		  var placeUTCoffset = document.getElementById("server_placeUTC").value;
		  bookingOrderJSON = {"pid":PID,
				              "sid":PlaceSID,
				              "bookID":bookID,
				              "testID":testID,
				              "dateSeconds":TimeOfTheDatePicker_1970,
				              "time":SecondsOfSliderPicker,
				              "period":TimePeriod,
				              "persons":persons,
				              "clientOffset":clientOffset,
				              "placeOffcet":placeUTCoffset};
		  bookingOrderJSONlist.push(bookingOrderJSON)
		  $('#pb_name_'+sid).html(PlaceName + " (" +PlaceSID+")");
		  $('#pb_date_'+sid).html($("#datepicker").datepicker( "getDate" ).toDateString() + "("+TimeOfTheDatePicker_1970+")");
		  $('#pb_time_'+sid).html(TimeRangeValues[place_slider_value] + "(" + SecondsOfSliderPicker + ")");
		  $('#pb_duration_'+sid).html(TimePeriod/60 + " min (" + TimePeriod + ")");
		  $('#pb_persons_'+sid).html(persons);
      }
  }
  document.getElementById("bookingConfirmationPopUp").style.display="";
 
}
function bookingConfirmCancel() {
	document.getElementById("bookingConfirmationPopUp").style.display="none";
}


var place_slider_value;
var slider_value;
function updateShapeOnBookingValue(shape) {
  var shapeName = shape.booking_options.givenName;
  var shapeSID = shape.sid;
  document.getElementById("up_place_name_val_"+shapeSID).value = shapeName;
  document.getElementById("up_place_sid_val_"+shapeSID).value = shapeSID;
  
  for(var fc = 0; fc < floorCanvases.length ; fc ++) {
	  if(floorCanvases[fc].shapes.indexOf(shape) != -1) {
		  document.getElementById("up_floor_name_val_"+shapeSID).value = floorCanvases[fc].floor_name;
	  }
  }
  $( "#booking_shape_num_persons_"+shapeSID ).spinner( "option", "min", shape.booking_options.minPersons );
  $( "#booking_shape_num_persons_"+shapeSID ).spinner( "option", "max", shape.booking_options.maxPersons );
  $( "#booking_shape_num_persons_"+shapeSID ).spinner( "value",  shape.booking_options.minPersons );
  $( "#booking_shape_num_persons_"+shapeSID ).spinner("widget").addClass("marginright10_");

  //up_place_ovr_canvas
  if (shape.type == "image") {
   document.getElementById("up_place_ovr_image_"+shapeSID).src = document.getElementById(shape.options.imgID).src;
   document.getElementById("PlaceImageConfirm_img_"+shapeSID).src = document.getElementById(shape.options.imgID).src;
   if (shape.w > shape.h) {
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.width=100+"px";
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.height = parseInt(100 * shape.h / shape.w)+"px" ; 
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.width=100+"px";
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.height = parseInt(100 * shape.h / shape.w)+"px" ; 
   } else {
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.height=100+"px";
	   document.getElementById("up_place_ovr_image_"+shapeSID).style.width = parseInt(100 * shape.w / shape.h)+"px" ;
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.height=100+"px";
	   document.getElementById("PlaceImageConfirm_img_"+shapeSID).style.width = parseInt(100 * shape.w / shape.h)+"px" ;
   }
   document.getElementById("up_place_ovr_canvas_"+shapeSID).style.display = "none";
   document.getElementById("up_place_ovr_image_"+shapeSID).style.display = "";
  } else {
   document.getElementById("up_place_ovr_canvas_"+shapeSID).style.display = "";
   document.getElementById("up_place_ovr_image_"+shapeSID).style.display = "none"; 
   var type = shape.type;
   var c = document.getElementById("up_place_ovr_canvas_"+shapeSID);
   var ctx = c.getContext("2d");
   ctx.clearRect( 0 , 0 , 100 , 100 );
   
	 if (type == "rectangle") {
		dbDrawRect(ctx,50,50,75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw);
	  } else if (type == "round") { 
		dbRoundRect(ctx , 50, 50, 75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw,shape.options.roundRad);
	  } else if (type == "circle") {
		 dbCircle(ctx , 50, 50, 75,75,shape.options.startA,shape.options.endA,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw);
	  } else if (type == "trapex") {
		 dbTrapez(ctx,50,50,75,50,shape.options.lineColor,shape.options.fillColor,shape.options.alpha,shape.options.salpha,shape.options.sw,shape.options.cutX);
	  }  
	 document.getElementById("PlaceImageConfirm_img_"+shapeSID).src =  c.toDataURL('image/png');
  }
  
  drawBookingTimeCanvas('booking_slider_canvas',shapeSID,15,400,30,2);
  document.getElementById("single_shape_order_0").style.display="";
}
var currentInSelection=[];
function removeUnselectedShape(sid,ID) {
	// Book table
	var elementID = 'single_place_booking_picture_'+sid;
	var element = document.getElementById(elementID);
	element.outerHTML = "";
	delete element;
	// Book confirm
	var elementIDc = 'single_confirmation_'+sid;
	var elementc = document.getElementById(elementIDc);
	elementc.outerHTML = "";
	delete element;
	var idx = currentInSelection.indexOf(sid);
	if (idx!=-1) {
		currentInSelection.splice(idx, 1);
	}
}
function appendSelctedShape(sid,appendToID,shape,floor) {
	var alreadySelected = false;
	for (var i = 0;i < currentInSelection.length ; i ++) {
		if (currentInSelection[i]==sid)
			alreadySelected = true;
	}
	if(!alreadySelected) {
		 var appendData = "";
		 appendData +=  '<table class="single_place_booking_picture" id = "single_place_booking_picture_'+sid+'" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%;">';
		 appendData +=  '   <tr >';
		 appendData +=  '	   <td class="pick_image_overview" rowspan="2"  style="width:100px;height:100px" >';
		 appendData +=  '        <div id="up_place_ovr_div_'+sid+'"  style="width:100px;height:100px" >';
		 appendData +=  '		    <canvas id="up_place_ovr_canvas_'+sid+'" width="100" height="100" tabindex="1"  style="display:"></canvas>';
		 appendData +=  '			<img id="up_place_ovr_image_'+sid+'" width="100px" height="100px" style="display:none"/>';
		 appendData +=  '	    </div>';
		 appendData +=	'   </td>';
		 appendData +=	'   <td class="pick_place_cnavas_single" id="brbr_'+sid+'"><!--FOR_CANVAS--></td>	';			
		 appendData +=	'   <td class="book_checkbox_td"><input type="checkbox" checked="checked" id="book_checkbox_'+sid+'" class="css-checkbox booking_single_checkbox" onchange="allowBooking(this)"/></td>';
		 appendData +=	'  '; 
		 appendData +=	' </tr>';
		 appendData +=	' <tr>';
		 appendData +=	'   <td class="place_ub_pick_info">';
		 appendData +=	'      <div id="up_floor_name"  style="float:left">Floor: <input class="invisible_input" id="up_floor_name_val_'+sid+'" disabled/></div>';
		 appendData +=	'      <div id="up_place_name"  style="float:left">Place name: <input class="invisible_input" id="up_place_name_val_'+sid+'" disabled/></div>';
		 appendData +=	'	   <div id="up_place_sid"  style="float:left">Place SID: <input class="invisible_input" id="up_place_sid_val_'+sid+'" disabled/></div>';
		 appendData +=	'   </td>';
		 appendData +=	'   <td class="for_persons">Persons<br/><input class="booking_spinner"  id="booking_shape_num_persons_'+sid+'"/></td>	';							   
		 appendData +=  '  </tr>';
		 appendData +=  '  </table>	';
	     
		 var confirmationAppend = "";
		 confirmationAppend +=  '  <table id="single_confirmation_'+sid+'" cellpadding="0" style="width:100%;height:100%;border:1px solid;">';
	     confirmationAppend +=  ' <tr>';
		 confirmationAppend +=  '    <td rowspan="5"><div class="PlaceImageConfirm"><img id="PlaceImageConfirm_img_'+sid+'" width=100 height=100/></div></td>';
		 confirmationAppend +=  '   <td class="confirm_text">Place Name (ID):</td>';
	     confirmationAppend +=  '	         <td><div class="confirm_value" id="pb_name_'+sid+'"></div></td>';
		 confirmationAppend +=  '	       </tr>';
         confirmationAppend +=  '	       <tr>';
	     confirmationAppend +=  '   <td class="confirm_text">Date:</td>';
		 confirmationAppend +=  '    <td><div class="confirm_value" id="pb_date_'+sid+'"></div></td>';
		 confirmationAppend +=  '  </tr>';
		 confirmationAppend +=  '   <tr>';
		 confirmationAppend +=  '  <td class="confirm_text">Time:</td>';
		 confirmationAppend +=  '       <td><div class="confirm_value" id="pb_time_'+sid+'"></div></td>';
		 confirmationAppend +=  '     </tr>';
		 confirmationAppend +=  '      <tr>';
		 confirmationAppend +=  '        <td class="confirm_text">Persons:</td>';
		 confirmationAppend +=  '         <td><div class="confirm_value" id="pb_persons_'+sid+'"></div></td>';
		 confirmationAppend +=  '       </tr>';
		 confirmationAppend +=  '      <tr>';
		 confirmationAppend +=  '        <td class="confirm_text">Duration:</td>';
	     confirmationAppend +=  '        <td><div class="confirm_value" id="pb_duration_'+sid+'"></div></td>';
		 confirmationAppend +=  '      </tr>';
		 confirmationAppend +=  '   </table>';
		 $("#"+appendToID).append(appendData);
		 $("#booking_confirmation_append").append(confirmationAppend);
		 currentInSelection.push(sid);
		 $( "#booking_shape_num_persons_"+sid ).spinner({});	 
		 updateShapeOnBookingValue(shape);
		 
	}
}



function requestBookingAvailability() {
	var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime()/1000; // The time is relative to client browser
	var d = new Date();
	var clientOffset = -1*d.getTimezoneOffset()/60;
	var placeOffset = document.getElementById("server_placeUTC").value;
	var placeID = document.getElementById("server_placeID").value;
	var requestJSON = {};
	
	requestJSON.date1970 = TimeOfTheDatePicker_1970  ;// - d.getTimezoneOffset()*60 ;
	requestJSON.period = 2*24*60*60;
	requestJSON.clientOffset = clientOffset;
	requestJSON.placeOffset = placeOffset;
	requestJSON.pid = placeID;
	var jsonData = {bookrequest:JSON.stringify(requestJSON)};
	$.ajax({
	      url : "/checkPidAvailable",
	      data: jsonData,
	      beforeSend: function () { $("#datepicker_ajax_gif").show(); },
	      success : function(data){
	    	 // alert(data);
	    	 $("#datepicker_ajax_gif").hide();
	    	 document.getElementById("server_shapes_prebooked").value=JSON.stringify(data);
	    	  $("#for_debug").html(JSON.stringify(data));
	    	  for(var c = 0 ; c < floorCanvases.length;c++) {
	    		  var canvas__ = floorCanvases[c];
		    	  if(canvas__.listSelcted.length > 0) {
		    		  for (var s = 0; s < canvas__.listSelcted.length;s++) {
		    		    var sid = canvas__.listSelcted[s].sid;
		    		    drawBookingTimeCanvas('booking_slider_canvas',sid,15,400,30,2);
		    		  }
		    	  }
	    	  }
	    	 // d = new Date(data.date1970 * 1000);
	    	 // $("#for_debug").append('<br/>'+d);
	    	  
	    	 
	      },
	      dataType : "JSON",
	      type : "post"
	  });
}



function drawBookingTimeCanvas(canvasID,shapeID,minRange,width,height,daysCount) {

 //  var c = document.getElementById(canvasID); 
	$('#brbr_'+shapeID).html('');
	$('#brbr_'+shapeID).append('<canvas id="'+canvasID+'_'+shapeID+'"  width="400" height="30"  tabindex="1" />');
	
  var  tcanvas_; 

	  tcanvas_= new  TCanvasState(document.getElementById(canvasID+'_'+shapeID));
	  tcanvas_.forsid = shapeID;
	  CanvasStates.push(tcanvas_);
   
   tcanvas_.width = width;
   tcanvas_.height = height;
   var canvasStep=width/daysCount/(24*60/minRange);
   tcanvas_.step = canvasStep; // minRange minutes in canvas pixels

 
   var shapesPrebookedJSON = JSON.parse(document.getElementById("server_shapes_prebooked").value);
   var pid = shapesPrebookedJSON.pid;
   var requestFromDate = shapesPrebookedJSON.date1970; 
   var clientOffset = shapesPrebookedJSON.clientOffset;
   var placeOffset = shapesPrebookedJSON.placeOffset;
   var requestPeriod = shapesPrebookedJSON.period;
   var placeOpen = shapesPrebookedJSON.placeOpen;
   var shapesList = shapesPrebookedJSON.shapesBooked;
 
   var fromc = 0;
   var toc = 0;

  
   for (var ind in placeOpen) { 
	   for (var days = 0 ; days < daysCount ; days++) {
		  var from = placeOpen[ind].from;
		  var to  = placeOpen[ind].to;
		  var fromSteps = from/minRange/60;
		  var toSteps = to/minRange/60;
		  var rangeSteps = toSteps - fromSteps;
		  fromc = fromSteps * canvasStep + days * tcanvas_.width/daysCount;
		  toc = rangeSteps * canvasStep;
		  //alert(fromc+" "+toc);
		  //ctx.fillStyle = "white";
	      //ctx.fillRect(fromc,0,toc,30);
		  tcanvas_.addShape( new TShape(tcanvas_, fromc , toc ,tcanvas_.height, 'opened' , 1 ));
	   }
   }
 
 var requestFromDateUTC = requestFromDate + clientOffset*60*60;  
 if (shapeID!=null) {
   for (var ind in shapesList) {     
	 var shapeSID = shapesList[ind].sid;
	 if(shapeSID == shapeID) {
	      var shapeBookList = shapesList[ind].ordersList;
		  for (var ind2 in shapeBookList) {
			  var testID = shapeBookList[ind2].testID;
			  var from = shapeBookList[ind2].from;        // In UTC seconds from 1970
			  var to  = shapeBookList[ind2].to;           // In UTC seconds from 1970
			  var UTCsecFrom = from -  requestFromDateUTC;// In UTC seconds from 1970 
			  var UTCsecTo = to -  requestFromDateUTC;    // In UTC seconds from 1970
			  var PlaceRelativeFrom = UTCsecFrom + placeOffset*60*60;
			  var PlaceRelativeTo = UTCsecTo + placeOffset*60*60;
			  var fromSteps = PlaceRelativeFrom/minRange/60;
			  var toSteps = PlaceRelativeTo/minRange/60;
			  var rangeSteps = toSteps - fromSteps;
			  fromc = fromSteps * canvasStep ;
			  toc = rangeSteps * canvasStep;
			  if (testID!= null && testID!= "" && clientBookings[testID]!== undefined) {
				//  alert(clientBookings[testID]);
				  tcanvas_.addShape( new TShape(tcanvas_, fromc , toc ,tcanvas_.height, 'book' , 1 ));
			  } else {
			      tcanvas_.addShape( new TShape(tcanvas_, fromc , toc ,tcanvas_.height, 'ordered' , 1 ));
			  }
			  //ctx.fillStyle = "red";
		      //ctx.fillRect(fromc,0,toc,30);
		      //ctx.strokeStyle = "rgb(189, 1, 1)";
		      //ctx.strokeRect(fromc,0,toc,30);
		      
		  }
	   }
	 }
  // }
 }

 var current_idx = currentSliderValue['booking_time_slider_for_canvas'];
 var from_drag = parseInt(current_idx * canvasStep);
 tcanvas_.addShape( new TShape(tcanvas_, from_drag , 1 ,tcanvas_.height, 'drag' , 1 ));
 // TBD BOOK
 // TBD PASSED
;

var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime();
var  dndt = TimeOfTheDatePicker_1970/1000;

 var d = new Date();
 var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
 var nd = new Date(utc + (3600000 * placeOffset));
 var ndt = nd.getTime()/1000;
 
 var twonextdays = new Date(TimeOfTheDatePicker_1970 + 2 * 24 * 3600 * 1000);
 var twonextdayst = twonextdays.getTime()/1000;
 console.log("dndt="+dndt+",ndt="+ndt+",twodays="+twonextdayst);
 if (dndt < ndt && ndt < twonextdayst) {
	 var diff = ndt - dndt;
	 var steps = diff / minRange/60;
	 tcanvas_.addShape( new TShape(tcanvas_, 0 , steps*canvasStep ,tcanvas_.height, 'passed' , 1 ));
	 console.log("width="+steps*canvasStep);
 } else if (ndt >= twonextdayst) {
	 tcanvas_.addShape( new TShape(tcanvas_, 0 , tcanvas_.width ,tcanvas_.height, 'passed' , 1 ));
 }

 

 tcanvas_.valid = false;
}