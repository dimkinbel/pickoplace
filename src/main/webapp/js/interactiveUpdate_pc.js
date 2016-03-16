var transactionCode = {};
var transactionSMSCode = "0";
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
function removePhoneConfirmationContact(phone_){
	var phone = $("#single_phone_value-"+phone_).html();

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
						url : "/configurationUpdate/removeConfirmationPhone",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({pid:pid,user:userMail,phone:phone}),//
						success : function(data){
							console.log(data);
							if(data.valid == true) {
								removeConfirmationPhoneLine(phone_);
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
function removeMailConfirmationContact(admin_mail,type){
	var mail = $("#single_"+type+"_mail_value-"+admin_mail).html();

	console.log("#single_"+type+"_mail_value-"+admin_mail)
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
					var manual_;
					if(type=="manual") {
						manual_ = true;
					} else {
						manual_ = false;
					}
					console.log(JSON.stringify({pid:pid,user:userMail,newAdmin:mail,manual:manual_}))
					$.ajax({
						url : "/configurationUpdate/removeConfirmationMail",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({pid:pid,user:userMail,newAdmin:mail,manual:manual_}),//
						success : function(data){
							console.log(data);
							if(data.valid == true) {
								removeConfirmationLine(admin_mail,type);
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
function VerifyMailCode(type) {
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function(result) {
				if (result) {
					var pid =  document.getElementById("server_placeID").value;
					var token  = transactionCode[type];
					var code , adminMail;
					var manual_;
					code = $("#verification_"+type+"_mail").val();
					adminMail = $("#"+type+"_mail_provided").html();
					if(type == "manual") {
						  manual_ = true;
					} else {
						  manual_ = false;
					}
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
							data: JSON.stringify({pid:pid,user:userMail,token:token,code:code,newAdmin:adminMail,manual:manual_}),//
							success : function(data){
								console.log(data);
									$("#verification_"+type+"_mail").val("");
									if (data.valid == true) {
										var mail__ = data.admin;
										$("#"+type+"_mail_provided").html("");
										transactionCode[type] = 0;
										$("#"+type+"_mail_test_tr1").hide();
										$("#"+type+"_mail_provided").hide();
										$("#"+type+"_mail_test_tr2").hide();
										appendNewConfirmationAdmin(mail__,type);
									} else {
										console.log(data.reason);
										switch (data.reason) {
											case "admin_exists":
												alert("This admin has already been registered");

												$("#"+type+"_mail_provided").html("");
												transactionCode[type] = 0;
												$("#"+type+"_mail_test_tr1").hide();
												$("#"+type+"_mail_provided_tr").hide();
												$("#"+type+"_mail_test_tr2").hide();
												break;
											case "wrong_code":
												alert("Wrong verification code.Please re-try")
												break;
											case "time_pass":
												alert("10 Minutes passed, Please re-submit eMail");
												$("#"+type+"_mail_provided").html("");
												transactionCode[type] = 0;
												$("#"+type+"_mail_test_tr1").hide();
												$("#"+type+"_mail_provided_tr").hide();
												$("#"+type+"_mail_test_tr2").hide();
												break;
											case "no_stored_request":
												alert("No eMail request exists. PLease re-send");
												$("#"+type+"_mail_provided").html("");
												transactionCode[type] = 0;
												$("#"+type+"_mail_test_tr1").hide();
												$("#"+type+"_mail_provided_tr").hide();
												$("#"+type+"_mail_test_tr2").hide();
												break;
											case "Not allowed user":
												alert("Unfortunately you not allowed to edit those settings");
												$("#"+type+"_mail_provided").html("");
												transactionCode[type] = 0;
												$("#"+type+"_mail_test_tr1").hide();
												$("#"+type+"_mail_provided_tr").hide();
												$("#"+type+"_mail_test_tr2").hide();
												break;
											case "No PID Exists":
												alert("Server Error - Please try again later");
												$("#"+type+"_mail_provided").html("");
												transactionCode[type] = 0;
												$("#"+type+"_mail_test_tr1").hide();
												$("#"+type+"_mail_provided_tr").hide();
												$("#"+type+"_mail_test_tr2").hide();
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
function VerifySMSCode() {
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function(result) {
				if (result) {
					var pid =  document.getElementById("server_placeID").value;
					var token  = transactionSMSCode;
					var code = $("#verification_admin_contact_sms").val();
					var phone = $("#manual_sms_provided").html();
					var userMail ;
					if (fconnected == true) {
						userMail = fudata.email;
					} else if(gconnected == true) {
						userMail = gudata.emails[0].value;
					}
					$.ajax({
						url : "/configurationUpdate/verifySMSCode",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({pid:pid,user:userMail,token:token,code:code,phone:phone}),//
						success : function(data){
							console.log(data);
							$("#verification_admin_contact_sms").val("");
							if(data.valid == true) {
								var phone = data.phone;
								transactionSMSCode = "0";
								$("#manual_sms_provided").html("");
								$("#manual_sms_provided_tr").hide();
								$("#test_code_test_tr1").hide();
								$("#test_code_test_tr2").hide();
								appendNewConfirmationAdminPhone(phone);
							} else {
								console.log(data.reason);
								switch(data.reason) {
									case "admin_exists":
										alert("This phone has already been registered")	;
										transactionSMSCode = "0";
										$("#manual_sms_provided").html("");
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr1").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "wrong_code":
										alert("Wrong verification code.Please re-try")
										break;
									case "time_pass":
										alert("1 hour passed, Please re-submit eMail");
										transactionSMSCode = "0";
										$("#manual_sms_provided").html("");
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr1").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "no_stored_request":
										alert("No eMail request exists. PLease re-send");
										transactionSMSCode = "0";
										$("#manual_sms_provided").html("");
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr1").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "Not allowed user":
										alert("Unfortunately you not allowed to edit those settings");
										transactionSMSCode = "0";
										$("#manual_sms_provided").html("");
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr1").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "No PID Exists":
										alert("Server Error - Please try again later");
										transactionSMSCode = "0";
										$("#manual_sms_provided").html("");
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr1").hide();
										$("#test_code_test_tr2").hide();
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
function sendSMSVerification() {
	var number = $("#contact_man_phone-1").intlTelInput("getNumber");
	var countryData = $("#contact_man_phone-1").intlTelInput("getSelectedCountryData");
	var smsrequest = {};
	smsrequest.number = number;
	smsrequest.countryData = countryData;
	isOrigin(function(resultOrigin) {
		if(resultOrigin) {
			// server connection
			setSessionData(function (result) {
				if (result) {
					var pid =  document.getElementById("server_placeID").value;
					var userMail ;
					if (fconnected == true) {
						userMail = fudata.email;
					} else if(gconnected == true) {
						userMail = gudata.emails[0].value;
					}
					$.ajax({
						url : "/configurationUpdate/requestAdminCodeBySMS",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({pid:pid,user:userMail,smsrequest:JSON.stringify(smsrequest)}),//
						success : function(data){
							console.log(data);
							if(data.valid == true) {

								transactionSMSCode = data.token;
								$("#manual_sms_provided").html(data.phone);
								$("#manual_sms_provided_tr").show();
								$("#test_code_test_tr1").show();
								$("#test_code_test_tr2").show();
								if(data.max5 == true) {
									alert("Same number can be verified maximum 3 times in one hour.Please use last code sent");
								}
							} else {
								console.log(data.reason)
								switch(data.reason) {
									case "exists":
										alert("Such phone number already exists in database");
										break;
									case "datastore_error":
										alert("Datastore Error. Please try again later");
										$("#manual_sms_provided").html("");
										transactionSMSCode = "0";
										$("#test_code_test_tr1").hide();
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "max_5_phones_not_approved":
										alert("Maximum amount of unapproved phones is 5. Please verify previous numbers or contact Pickoplace")
										$("#manual_sms_provided").html("");
										transactionSMSCode = "0";
										$("#test_code_test_tr1").hide();
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "sms_error_null":
										alert("SMS Error occured. Please try again")
										$("#manual_sms_provided").html("");
										transactionSMSCode = "0";
										$("#test_code_test_tr1").hide();
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr2").hide();
										break;
									case "sms_error_null":
										alert("SMS Error occured. Please try again")
										$("#manual_sms_provided").html("");
										transactionSMSCode = "0";
										$("#test_code_test_tr1").hide();
										$("#manual_sms_provided_tr").hide();
										$("#test_code_test_tr2").hide();
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

				}
			});
		} else {
		}
	});
}
function checkLoginAndSendEmail(email,code,type) {
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
					var manual_ = false;
					if(type == "manual") {
						manual_ = true;
					} else {
						manual_ = false;
					}
					if(code != undefined && code == true) {
						$.ajax({
							url : "/configurationUpdate/requestAdminCodeByMail",
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({pid:pid,user:userMail,newAdmin:email,manual:manual_}),//
							success : function(data){
								console.log(data);
									if(data.valid == true) {
										$("#"+type+"_mail_provided").html(data.admin);
										transactionCode[type] = data.token;
										$("#"+type+"_mail_test_tr1").show();
										$("#"+type+"_mail_provided_tr").show();
										$("#"+type+"_mail_test_tr2").show();
									} else {
										if(data.reason == "exists") {
											alert("Such confirmation eMail already exists.");
										}
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
							  document.getElementById("server_iFrameID").value = "";
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
		var add_height = 80;
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
	function SIsaveState(goto) {
		$("#save_pc").hide();
		$("#config_save_btn_ajax").show();
	    isOrigin(function(resultOrigin) {
		    if(resultOrigin) {
			   // server connection
				setSessionData(function(result) {
					if(result) {
						saveState(goto);
						$("#save_pc").show();
						$("#config_save_btn_ajax").hide();
					}
				});
			} else {
				$("#save_pc").show();
				$("#config_save_btn_ajax").hide();
			}
		});
     }
	 function saveState(goto) {
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
                        createSaveObject(goto);
                    });
                } else {
                    alert("Address not valid") ;
                }
            });
        }
var SaveObject = {};
function createSaveObject(goto) {
   
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
  if($("#pc_placeBookable").attr("checked") == "checked") {
	  SaveObject.BookingAvailable = true;
  } else {
	  SaveObject.BookingAvailable = false;
  }
  if($("#pc_order_type_").attr("checked") != "checked") {
     SaveObject.bookingProperties.allDay = false;
	 SaveObject.bookingProperties.bookLength = [];
	 var allLeng =  document.getElementsByName("order_leng");   
     for(var x=0; x < allLeng.length; x++) { 
		if(document.getElementById(allLeng[x].id).checked == true) {
			   var Minutes = parseInt($("#"+allLeng[x].id).val());
			   var Seconds = Minutes ;
			   SaveObject.bookingProperties.bookLength.push(Seconds);
		 }
	 }
	 SaveObject.bookingProperties.bookStartStep = parseInt($('input[name=start_steps]:checked').val()) ;
	 SaveObject.bookingProperties.bookStartWait = parseInt($('input[name=start_wait]:checked').val()) ;
  } else {
     SaveObject.bookingProperties.allDay = true;
	 SaveObject.bookingProperties.bookLength = [];
	 SaveObject.bookingProperties.bookStartStep = 15 ;
	 SaveObject.bookingProperties.bookStartWait = 0;
  }
  SaveObject.bookingProperties.automatic = document.getElementById("pc_auto_confirm").checked;
  SaveObject.bookingProperties.approvalPhones = [];
  SaveObject.bookingProperties.approvalMails = [];  
      $( ".single_phone_contact" ).each(function() {
		  var phone_coded =  $( this ).attr( "id" ).replace(/single_phone_contact-/,"");
		  var phone = $("#single_phone_value-"+phone_coded).html();
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
  sendAJAX(postImagesData,"saveConfiguration",goto);
  
}
function sendAJAX(JSON_,url_,goto) {
	$.ajax({
		url : url_,
		data: JSON_,
		success : function(data){
			if(goto!=undefined) {
				console.log(goto)
				switch (goto) {
					case "edit":
						editPlace('form_editform');
						break;
				}
			}
		},
		dataType : "json",
		type : "post"
	});
}
function SaveConfigAndGo(goto) {
	$("#go_to_edit_pc").hide();
	$("#save_pc").hide();

	SIsaveState(goto);
	$("#save_modal").modal('hide');
}
function editPlace(placeID_form) {
	setSessionData(function(result) {
		if(result) {
			document.getElementById(placeID_form).submit();
		}
	});
}
	
