var transactionCode = "0";
function updateWaiterPassword() {
	var pid = document.getElementById("server_placeID").value;
	var waiterusername = $("#waiter_username_change_input").val();
	var waiterPassword = $("#waiter_password_change_input").val();
	if(waiterusername!=undefined && waiterusername != "" && waiterPassword!=undefined && waiterPassword != "") {
		isOrigin(function (resultOrigin) {
			if (resultOrigin) {
				// server connection
				setSessionData(function (result) {
					if (result) {
						var userMail ;
						if (fconnected == true) {
							userMail = fudata.email;
						} else if(gconnected == true) {
							userMail = gudata.emails[0].value;
						}
						$.ajax({
							url : "/configurationUpdate/updatePassword",
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({pid:pid,user:userMail,waiterUsername:waiterusername,waiterPassword:waiterPassword}),//
							success : function(data){
								console.log(data);
								if(data.valid == true) {
									alert("Username/Password updated");
								} else {
									console.log(data.reason)
								}
							},
							error:function (){
								alert("Server Error. Please try later")
							},
							dataType : "JSON",
							type : "post"
						});

					} else {

					}
				});
			} else {
			}
		});
	} else {
		alert("Username & Password should not be empty")
	}
}
function removeMailConfirmationContact(admin_mail){
	var mail = $("#single_mail_value-"+admin_mail).html();

	console.log("#single_mail_value-"+admin_mail)
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function (result) {
				if (result) {
					var pid = document.getElementById("server_placeID").value;
					var userMail ;
					if (fconnected == true) {
						userMail = fudata.email;
					} else if(gconnected == true) {
						userMail = gudata.emails[0].value;
					}
					console.log(JSON.stringify({pid:pid,user:userMail,newAdmin:mail}))
					$.ajax({
						url : "/configurationUpdate/removeConfirmationMail",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({pid:pid,user:userMail,newAdmin:mail}),//
						success : function(data){
							console.log(data);
							if(data.valid == true) {
								removeConfirmationLine(admin_mail);
							} else {
								console.log(data.reason)
							}
						},
						error:function (){
							alert("Server Error. Please try later")
						},
						dataType : "JSON",
						type : "post"
					});
				} else {

				}
			});
		} else {

		}
	});
}
function removeSiteAdmin(admin_mail) {
	var mail = $("#admin_mails-"+admin_mail).html();
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function (result) {
				if (result) {
					var pid = document.getElementById("server_placeID").value;
					var userMail ;
					if (fconnected == true) {
						userMail = fudata.email;
					} else if(gconnected == true) {
						userMail = gudata.emails[0].value;
					}
					$.ajax({
						url : "/configurationUpdate/removeAdminMail",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({pid:pid,user:userMail,newAdmin:mail}),//
						success : function(data){
							console.log(data);
							if(data.valid == true) {
								removeAdminLine(admin_mail);
							} else {
								console.log(data.reason)
							}
						},
						error:function (){
							alert("Server Error. Please try later")
						},
						dataType : "JSON",
						type : "post"
					});
				} else {

				}
			});
		} else {

		}
	});
}
function VerifyMailCode() {
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function(result) {
				if (result) {
					var pid =  document.getElementById("server_placeID").value;
					var token  = transactionCode;
					var code = $("#verification_admin_mail_sms").val();
					var adminMail = $("#manual_mail_provided").html();
					var userMail ;
					if (fconnected == true) {
						userMail = fudata.email;
					} else if(gconnected == true) {
						userMail = gudata.emails[0].value;
					}
						$.ajax({
							url : "/configurationUpdate/verifyMailCode",
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({pid:pid,user:userMail,token:token,code:code,newAdmin:adminMail}),//
							success : function(data){
								console.log(data);
								if(data.valid == true) {
									var mail__ = data.admin;
									$("#manual_mail_provided").html("");
									transactionCode = "0";
									$("#test_mail_test_tr1").hide();
									$("#manual_mail_provided").hide();
									$("#test_mail_test_tr2").hide();
									appendNewConfirmationAdmin(mail__);
								} else {
									console.log(data.reason);
									switch(data.reason) {
										case "admin_exists":
											alert("This admin has already been registered")	;
											$("#manual_mail_provided").html("");
											transactionCode = "0";
											$("#test_mail_test_tr1").hide();
											$("#manual_mail_provided").hide();
											$("#test_mail_test_tr2").hide();
											break;
										case "wrong_code":
											alert("Wrong verification code.Please re-try")
											break;
										case "time_pass":
											alert("10 Minutes passed, Please re-submit eMail");
											$("#manual_mail_provided").html("");
											transactionCode = "0";
											$("#test_mail_test_tr1").hide();
											$("#manual_mail_provided").hide();
											$("#test_mail_test_tr2").hide();
										break;
										case "no_stored_request":
											alert("No eMail request exists. PLease re-send");
											$("#manual_mail_provided").html("");
											transactionCode = "0";
											$("#test_mail_test_tr1").hide();
											$("#manual_mail_provided").hide();
											$("#test_mail_test_tr2").hide();
											break;
										case "Not allowed user":
											alert("Unfortunately you not allowed to edit those settings");
											$("#manual_mail_provided").html("");
											transactionCode = "0";
											$("#test_mail_test_tr1").hide();
											$("#manual_mail_provided").hide();
											$("#test_mail_test_tr2").hide();
											break;
										case "No PID Exists":
											alert("Server Error - Please try again later");
											$("#manual_mail_provided").html("");
											transactionCode = "0";
											$("#test_mail_test_tr1").hide();
											$("#manual_mail_provided").hide();
											$("#test_mail_test_tr2").hide();
											break;
									}
								}
							},
							error:function (){
								alert("Server Error. Please try later")
							},
							dataType : "JSON",
							type : "post"
						});


				} else {
					alert("Not allowed")
				}

			});
		} else {

		}
	});
}
function checkLoginAndSendEmail(email,code) {
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function(result) {
				if (result) {
					var pid =  document.getElementById("server_placeID").value;
					var userMail ;
					if (fconnected == true) {
						userMail = fudata.email;
					} else if(gconnected == true) {
						userMail = gudata.emails[0].value;
					}
					if(code != undefined && code == true) {
						$.ajax({
							url : "/configurationUpdate/requestAdminCodeByMail",
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({pid:pid,user:userMail,newAdmin:email}),//
							success : function(data){
								console.log(data);
								if(data.valid == true) {
									$("#manual_mail_provided").html(data.admin);
									transactionCode = data.token;
									$("#test_mail_test_tr1").show();
									$("#manual_mail_provided").show();
									$("#test_mail_test_tr2").show();
								} else {
									console.log(data.reason)
								}
							},
							error:function (){
								alert("Server Error. Please try later")
							},
							dataType : "JSON",
							type : "post"
						});
					} else {
						$.ajax({
							url : "/configurationUpdate/updateAdminMail",
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({pid:pid,user:userMail,newAdmin:email}),//
							success : function(data){
								console.log(data);
								if(data.valid == true) {
									appendNewAdmin(data);
								} else {
									console.log(data.reason)
								}
							},
							error:function (){
								alert("Server Error. Please try later")
							},
							dataType : "JSON",
							type : "post"
						});
					}

				} else {
					alert("Not allowed")
				}

			});
		} else {

		}
	});
}
$(document).ready(function() {
  
	$("#iframe_save_btn").click(function() {
	    $(this).hide();
	    $("#iframe_save_btn_disabled").show();
	    isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
			   // server connection
			    setSessionData(function(result) {
			       if(result) {
				      // User autenticated
				     var pid = document.getElementById("server_placeID").value;
					var ifid = document.getElementById("server_iFrameID").value;
					if(ifid==null || ifid==undefined ||ifid=="") {
						 ifid = "ifid_"+randomString(20);
						 document.getElementById("server_iFrameID").value = ifid; // Next saves will be to existing ifid
					}
					var ifsave = currentIframeSettings;
					
					var jsonData = {ifsave:JSON.stringify(ifsave),pid:pid,ifid:ifid};
					$.ajax({
					      url : "/saveIframe",
					      data: jsonData,
					      beforeSend: function () { },
					      success : function(data){
					    	 $("#iframe_save_btn_disabled").hide();
	                         $("#iframe_save_btn").show();
			                 if(data.newifid == true) {
			                	 console.log("New iFrame added:" + data.ifid);
			                 } else {
			                	 console.log("iFrame updated:" + data.ifid);
								 $("#existing_iframe-"+ifid).remove();
			                 }
							  updateIFlist(data,true);
							  // local testing
							  $("#iframe_save_btn_disabled").hide();
							  $("#iframe_save_btn").show();

						  },
						   error:function () {
							   alert("Server error occured- please try again later");
							   $("#iframe_save_btn_disabled").hide();
							   $("#iframe_save_btn").show();
						   },
					      dataType : "JSON",
					      type : "post"
					  });
				   } else {
				      // Unknown user/Session expired
				      updatePageView();
				   }
				});
		      } else {
			    var data = {};
			    data.list = [];
			    var iframe = {};
			    iframe.width = currentIframeSettings.width;
			    iframe.height = currentIframeSettings.height;
				iframe.booking = currentIframeSettings.booking;
				iframe.theme = currentIframeSettings.theme;
				iframe.date = "31Dec";
			    iframe.ifid = "ifid_"+randomString(20); 
				data.list.push(iframe);
				updateIFlist(data,true);
			     // local testing
			    $("#iframe_save_btn_disabled").hide();
	            $("#iframe_save_btn").show();    
			  }
		})
	}); 

	$(document).on("click", ".ef_edit", function() {
		var this__ = $(this);
		var ifid = $(this).attr("id").replace(/if_edit-/,"");
		var pid = document.getElementById("server_placeID").value;
		isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
			   // server connection
				setSessionData(function(result) {
					   if(result) {
						   var jsonData = {pid:pid,ifid:ifid};
						   $.ajax({
							   url : "/editIframe",
							   data: jsonData,
							   beforeSend: function () { },
							   success : function(data){

								   if(data.valid == true) {
									   console.log("Get iframe response:");
									   console.log(data);
									   $("#iframe_settings_pill").click();
									   $("#server_iFrameID").val(data.iframe.ifid);
									   $("#edit_existing_iframe").show();
									   $("#edit_iframe_ifid").html(data.iframe.ifid);
									   updateIframeSelectors(data.iframe);
									   iFfloorAppend("pc_iframe_floors_wrap",false);
								   } else {
									   alert(data.reason)
								   }
							   },
							   error:function () {
								   alert("Server error occured- please try again later");

							   },
							   dataType : "JSON",
							   type : "post"
						   });
					   } else {
						   updatePageView();
					   }
				});
			} else {
			     // local testing
			}
		});
	});
	$(document).on("click","#disable_iframe_edit",function (){
		$("#server_iFrameID").val("");
		$("#edit_existing_iframe").hide();
		$("#edit_iframe_ifid").html("");
	});
	$(document).on("click", ".ef_show", function() {
		var id_ = $(this).attr('id');
		var ifid = id_.replace(/^if_show-/, "");
		var width_  = document.getElementById("width_fe_-"+ifid).value;
		var height_  = document.getElementById("height_fe_-"+ifid).value;
		var pid_  = document.getElementById("pid_fe_-"+ifid).value;
        var iframe_json = JSON.parse($("#iframe_json-"+ifid).val());
		var add_height = 40;
		if(iframe_json.booking == true) {
			add_height = 80;
		}
		var height_  = parseInt(height_) + add_height;
	    isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
			   // server connection

				   $("#frame-canvas").html("");
				   document.getElementById("frame_prev_wrap_popup_content").style.width=width_+"px";
				   document.getElementById("frame_prev_wrap_popup_content").style.height=height_+"px";
				   $("#frame-canvas").hide();
				   var hostName = window.location.host;
				   var appendData = '<iframe id="shown_iframe" src="https://'+hostName+'/getiframe?pid='+pid_+'&ifid='+ifid+'&show=true"  width="'+width_+'" height="'+height_+'" style="border:none"></iframe>';
				   $("#frame-canvas").append(appendData);
				   var iframe__ = document.getElementById('shown_iframe');
				   $("#iframe_loader").show();
				   $("#frame_prev_wrap").show();
				   iframe__.onload = function() {
					   $("#iframe_loader").hide();
					   $("#frame-canvas").show();
				   }; 
            } else {

			}
        });			
	});
	$(document).on("click", ".ef_remove", function() {
		var this__ = $(this);
		var ifid = $(this).attr("id").replace(/ef_edit-/,"");
		var pid = document.getElementById("server_placeID").value;
		isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
				setSessionData(function(result) {
					   if(result) {
						   var id_ = this__.attr('id');
						   var ifid = id_.replace(/^if_delete-/, "");
						   var pid = document.getElementById("server_placeID").value;
						   var jsonData = {pid:pid,ifid:ifid};
							
							$.ajax({
								  url : "/deleteIframe",
								  data: jsonData,
								  beforeSend: function () {},
								  success : function(data){
									  if(data.status == "removed") {
										  console.log("Iframe removed:" + ifid)
										  $("#server_iFrameID").val("");
										  $("#edit_existing_iframe").hide();
										  $("#edit_iframe_ifid").val("");
										  $("#existing_iframe-"+ifid).remove();
									  } else {
										  console.log(data);
									  }
								  },
								  dataType : "JSON",
								  type : "post"
							  });
					   } else {
						   updatePageView();
					   }
				});
			} else {
			
			}
		});
	});
	
});
	
	function updateIframeListTable() {
	    isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
			   // server connection
				var pid = document.getElementById("server_placeID").value;
				var jsonData = {pid:pid};
				   $.ajax({
							  url : "/getiframeslist",
							  data: jsonData,
							  beforeSend: function () { $("#list_loading").show(); },
							  success : function(data){
								 $("#list_loading").hide();
								 updateIFlist(data,false);
							  },
							  dataType : "JSON",
							  type : "post"
						  });
		   } else {
		      var data = {};
			  data.list = [];
			  var iframe1 = {};
			  iframe1.width = 400;
			  iframe1.height = 600;
			  iframe1.booking = true;
			  iframe1.theme = "white";
			  iframe1.date = "31Dec";
			  iframe1.ifid = "ifid_"+randomString(20);
			  data.list.push(iframe1);
			  var iframe2 = {};
			  iframe2.width = 800;
			  iframe2.height = 300;
			  iframe2.booking = true;
			  iframe2.theme = "white";
			  iframe2.date = "31Dec";
			  iframe2.ifid = "ifid_"+randomString(20);
			  data.list.push(iframe2);
			  updateIFlist(data,false);
		   }
		 });	
	}
	function SIsaveState() {
	    isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
			   // server connection
				setSessionData(function(result) {
					if(result) {
						saveState();
					}
				});
			} else {
			
			}
			});
     }
	 function saveState() {
            var address = document.getElementById('config_address').value;
            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    document.getElementById("address_hidden_lat").setAttribute("value",lat);
                    document.getElementById("address_hidden_lng").setAttribute("value",lng);
                    $.ajax({
                        url:"https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+lng+"&timestamp="+(Math.round((new Date().getTime())/1000)).toString()+"&sensor=false&key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k",
                    }).done(function(response){
                        //alert(response.rawOffset);
                        var zoneID = response.timeZoneId;
                        // var c = moment.tz(Math.round(new Date().getTime()), zoneID);
                        var offset = response.rawOffset/3600 + response.dstOffset/3600;
                        document.getElementById("UTCoffcet_hidden").setAttribute("value",offset);
                        // console.log(c.format());
                        console.log(response.rawOffset/3600 + "  " + response.dstOffset/3600 + "= " + offset);
                        createSaveObject();
                    });
                } else {
                    alert("Address not valid") ;
                }
            });
        }
var SaveObject = {};
function createSaveObject() {
   
     SaveObject = {};
	 globalFloorCounter = 0;
	 SaveObject.stage = "Configuration";
	 SaveObject.placeDetails = {};
	 SaveObject.placeDetails.general = {};
	 SaveObject.placeDetails.general.UTCoffset = document.getElementById("UTCoffcet_hidden").value; 
	 SaveObject.placeDetails.general.placeName = document.getElementById("config_place_name").value;
	 SaveObject.placeDetails.general.branchName = document.getElementById("config_branch_name").value;
	 SaveObject.placeDetails.general.address = document.getElementById("config_address").value;
	 SaveObject.placeDetails.general.lat = document.getElementById("server_Lat").value;
	 SaveObject.placeDetails.general.lng = document.getElementById("server_Lng").value;
	 SaveObject.placeDetails.general.placePhone = document.getElementById("config_phone").value;
	 SaveObject.placeDetails.general.placeFax = document.getElementById("config_fax").value;
	 SaveObject.placeDetails.general.placeMail = document.getElementById("config_mail").value;
	 SaveObject.placeDetails.general.placeURL = document.getElementById("config_siteurl").value;
	 SaveObject.placeDetails.general.placeDescription = document.getElementById("config_brief_text").value;
	 
	 SaveObject.placeDetails.photos = {};
	 var logo = document.getElementById("uploaded_logo_canvas_source_100").src;
	 if(logo!=undefined && logo != null && logo!="") {
	  SaveObject.placeDetails.photos.logosrc = logo;
	 } else {
	  SaveObject.placeDetails.photos.logosrc = "";
	 }
	 var placePhotos = [];
	 var allimup =document.getElementsByName("imup_image");
     for(var x=0; x < allimup.length; x++) {
	   var imageSrc = document.getElementById(allimup[x].id).src; 
	   var imageObject = {};
	   imageObject.imageID = allimup[x].id;
	   imageObject.data64 = imageSrc; 
	   placePhotos.push(imageObject);
     }
	 SaveObject.placeDetails.photos.placePhotos = placePhotos;
	 // Week days
	 SaveObject.workinghours = {};
	 SaveObject.workinghours.workingWeek = {};
	 var sun = {};
	 sun.open = document.getElementById("pbook_sun_cb").checked;
	 sun.from = WeekDaysSliderValue['open_time_slider_sun_from'];
	 sun.to = WeekDaysSliderValue['open_time_slider_sun_to']; 
	 SaveObject.workinghours.workingWeek.sun =  sun;
	 var mon = {};
	 mon.open = document.getElementById("pbook_mon_cb").checked;
	 mon.from = WeekDaysSliderValue['open_time_slider_mon_from'];
	 mon.to = WeekDaysSliderValue['open_time_slider_mon_to'];
	 SaveObject.workinghours.workingWeek.mon = mon;
	 var tue = {};
	 tue.open = document.getElementById("pbook_tue_cb").checked;
	 tue.from = WeekDaysSliderValue['open_time_slider_tue_from'];
	 tue.to = WeekDaysSliderValue['open_time_slider_tue_to'];
	 SaveObject.workinghours.workingWeek.tue = tue;
	 var wed = {};
	 wed.open = document.getElementById("pbook_wed_cb").checked;
	 wed.from = WeekDaysSliderValue['open_time_slider_wed_from'];
	 wed.to = WeekDaysSliderValue['open_time_slider_wed_to'];
	 SaveObject.workinghours.workingWeek.wed = wed;
	 var thu = {};
	 thu.open = document.getElementById("pbook_thu_cb").checked;
	 thu.from = WeekDaysSliderValue['open_time_slider_thu_from'];
	 thu.to = WeekDaysSliderValue['open_time_slider_thu_to'];
	 SaveObject.workinghours.workingWeek.thu = thu ;
	 var fri = {};
	 fri.open = document.getElementById("pbook_fri_cb").checked;
	 fri.from = WeekDaysSliderValue['open_time_slider_fri_from'];
	 fri.to = WeekDaysSliderValue['open_time_slider_fri_to'];
	 SaveObject.workinghours.workingWeek.fri = fri;
	 var sat = {};
	 sat.open = document.getElementById("pbook_sat_cb").checked;
	 sat.from = WeekDaysSliderValue['open_time_slider_sat_from'];
	 sat.to = WeekDaysSliderValue['open_time_slider_sat_to'];
	 SaveObject.workinghours.workingWeek.sat = sat ;
	 
	 var CloseDatesList = [];
	 for (var e = 0; e < eventList.length; e++) {
	    var utcSeconds = parseInt(eventList[e].id.replace(/eid_/,""));
		CloseDatesList.push(utcSeconds);
	 }
	 SaveObject.workinghours.closeDates = CloseDatesList;
	 
	
 
	 
 
	 var JSONbyte64files=[]; // { "imageID" : data64 }
     var JSONSIDlinks = [];  // { "sid" : "ImageID" }
     var ImageMirrorUsed = {};  
	 SaveObject.placeID = document.getElementById("server_placeID").value;	 
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
     
  CanvasFloor.place = document.getElementById("userSetPlaceName").value;
  CanvasFloor.snif = document.getElementById("userSetPlaceBName").value;
  CanvasFloor.placeID = document.getElementById("userSetPlaceID").value;
  var floorid =  state.floorid;
  CanvasFloor.floor_name = state.floor_name;
  CanvasFloor.floorid = state.floorid;
  CanvasFloor.mainfloor = CanvasFloor.state.mainfloor;
  CanvasFloor.allImageSrc  = "";
  
  if(CanvasFloor.state.backgroundType != "color" && CanvasFloor.state.backgroundType != "tiling") {
	  CanvasFloor.background = "";
  } else if (CanvasFloor.state.backgroundType == "tiling") {
	  // Image preload while user chooses background from menu
	  CanvasFloor.background =  "";
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
  
  
  SaveObject.bookingProperties = {};
  if($("#pc_order_type_").attr("checked") != "checked") {
     SaveObject.bookingProperties.allDay = false;
	 SaveObject.bookingProperties.bookLength = [];
	 var allLeng =  document.getElementsByName("order_leng");   
     for(var x=0; x < allLeng.length; x++) { 
		if(document.getElementById(allLeng[x].id).checked == true) {
			   var Minutes = parseInt($("#"+allLeng[x].id).val());
			   var Seconds = Minutes*60;
			   SaveObject.bookingProperties.bookLength.push(Seconds);
		 }
	 }
	 SaveObject.bookingProperties.bookStartStep = parseInt($('input[name=start_steps]:checked').val())*60;
	 SaveObject.bookingProperties.bookStartWait = parseInt($('input[name=start_wait]:checked').val())*60;
  } else {
     SaveObject.bookingProperties.allDay = true;
	 SaveObject.bookingProperties.bookLength = [];
	 SaveObject.bookingProperties.bookStartStep = 15*60;
	 SaveObject.bookingProperties.bookStartWait = 0;
  }
  SaveObject.bookingProperties.automatic = document.getElementById("pc_auto_confirm").checked;
  SaveObject.bookingProperties.approvalPhones = [];
  SaveObject.bookingProperties.approvalMails = [];  
      $( ".single_phone_contact" ).each(function() {
		  var phone = $( this ).attr( "id" ).replace(/single_phone_contact-/,"");
		   SaveObject.bookingProperties.approvalPhones.push(phone);
		});	
       $( ".single_mail_contact" ).each(function() {
		  var mail = $("#"+$( this ).attr( "id" ).replace(/single_mail_contact-/,"single_mail_value-")).html();
		   SaveObject.bookingProperties.approvalMails.push(mail);
		}); 
  SaveObject.bookingProperties.SidUnlimited =  document.getElementById("pc_max_tables").checked;
  SaveObject.bookingProperties.maxSids = parseInt($("#pc_max_tables_input").val());
  
  // Administration
  SaveObject.administration = {};
  SaveObject.administration.admins = [];
  var allAdmins =  document.getElementsByName("admin_mails");   
   for(var x=0; x < allAdmins.length; x++) { 
		var mail = $("#"+allAdmins[x].id).html(); 
		SaveObject.administration.admins.push(mail);
   }
   SaveObject.administration.adminUsername = $("#waiter_username_change_input").val();
   SaveObject.administration.adminPassword = $("#waiter_password_change_input").val();
  
  SaveObject.iframeList = []; 
  var iframeJSONs =  document.getElementsByName("iframe_json");   
  for(var x=0; x < iframeJSONs.length; x++) { 
		var iframeJSON = $("#"+iframeJSONs[x].id).val(); 
		 SaveObject.iframeList.push(iframeJSON);
   }
  
  console.log(SaveObject);
  var postImagesData = {jsonObject:JSON.stringify(SaveObject)};
  //sendAJAX(postImagesData,"uploadCanvasImages");
  
}	 
	
