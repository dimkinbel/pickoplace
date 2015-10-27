
var auth2 = auth2 || {};
var gcode = {};
var fudata = {};
var gudata = {};
var gconnected = false;
var fconnected = false;
var initialPageLoad = true;
var phoneflow = false;
var phoneloggedby = "";
var mobileInput;
$(document).ready(function () { 
  
  $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'js/intl-tel-input-master/build/css/intlTelInput.css') );
  mobileInput = $("#mobile-number");
  $.getScript("js/intl-tel-input-master/build/js/intlTelInput.min.js", function(data, status, jqxhr) {
	       mobileInput.intlTelInput({
		   nationalMode: true ,
		   defaultCountry:"il",
		   preferredCountries:["il"],
		   onlyCountries:["il","us","de","ru","ua"],
		   utilsScript: "js/intl-tel-input-master/lib/libphonenumber/build/utils.js"
		  });
		  
	});
 
  $("#send_sms").hover(     
		  function() {
		      $("#phone_instructions").css("opacity","1");
		  }, function() {
			  $("#phone_instructions").css("opacity","0");
		  }
  );
  $("#phone_resend_open").click(function(){
	  $("#send_sms_ajax").hide(); 
	  $("#send_sms_complete").hide();
	  $("#send_sms").show(); 
	  $("#verification_code").val("");
	  $("#verification_code").prop("readonly",true);
	  $("#verification_submit_inactive").show();
	  $("#verification_submit").hide();
	  $("#smsa_loader").hide(); 
  });
  $("#send_sms").click(function(){
	  var number = $("#mobile-number").intlTelInput("getNumber");
	  var countryData = $("#mobile-number").intlTelInput("getSelectedCountryData");
	  var smsrequest = {};
	  smsrequest.number = number;
	  smsrequest.countryData = countryData;
	  var json_ = {jsonObject:JSON.stringify(smsrequest)};
		console.log(json_);
		$.ajax({
		  url : "/plivoSMSrequest",
		  data: json_,//
		  beforeSend: function () { 
			  $("#send_sms").hide(); 
			  $("#send_sms_ajax").show(); 
		  },
		  success : function(data){	
			  if(data.status=="OK") {
				  $("#send_sms_ajax").hide();
				  $("#send_sms_complete").show();
				  $("#verification_code").val("");
				  $("#verification_code").prop("readonly",false);
				  $("#verification_submit_inactive").hide();
				  $("#verification_submit").show();
			  } else if (data.status=="NOTLOGGED" || data.status=="WAIT") {
				  
				  if(gconnected==false && fconnected==false && phoneflow==true) {
			    		if(auth2.isSignedIn.wc) {
			    			// Connected with Google
			    			googleSignOut();
			    		} else if(FB.getUserID() != "") {
			    			// Connected with FB
			    			facebookSignOut();
			    		}
			    	}
			    	phoneflow=false;
			    	$("#sign_in_table_").show();
					//result.userData.first_name for FB
					$("#user_name_at_phone").html("");
					$("#send_sms_ajax").hide(); 
					$("#send_sms_complete").hide();
					$("#send_sms").show(); 
					$("#verification_code").val("");
					$("#verification_code").prop("readonly",true);
					$("#verification_submit_inactive").show();
					$("#verification_submit").hide();
					$("#smsa_loader").hide(); 
					$("#phone_wrap_table").hide();
				    $("#page_login_prompt").hide();
				    if(data.status=="WAIT") {
						  alert("5 SMS per hour allowed! Contact admin dimkinbel@gmail.com");
					}
			  } else if(data.status=="NULL" || data.status=="ERROR" ) {
				  $("#send_sms_ajax").hide();
				  $("#send_sms_complete").hide();
				  $("#send_sms").show(); 
			  }
			  console.log(data);
		  },
	      error: function(e) {
	    	  $("#send_sms_ajax").hide();
		         console.log(e);
		  },
		  dataType : "JSON",
		  type : "post"
		  });
    });
  $("#verification_submit").click(function(){
	  var codeinput = $("#verification_code").val();
	  var stringlength = codeinput.length;
	  var intcode = parseInt(codeinput);
	  var intlength = intcode.toString().length;
	  if(stringlength != intlength) {
		  $("#verification_code").addClass("redborder");
	  } else {
		    var json_ = {code:codeinput};
			console.log(json_);
			$.ajax({
			  url : "/smsVerificationCodeSubmit",
			  data: json_,//
			  beforeSend: function () { 
				  $("#verification_submit").hide();
				  $("#verification_submit_inactive").show(); 
				  $("#smsa_loader").show(); 
			  },
			  success : function(data){	
				  $("#smsa_loader").hide();
				  $("#verification_submit").show();
				  $("#verification_submit_inactive").hide();
				  if(data.status=="OK") {
					  phoneflow=false;
					  if(phoneloggedby == "google") {
					      onSignInCallback(auth2.currentUser.get().getAuthResponse());//phoneloggedby = "google";
					  } else if(phoneloggedby == "FB") {
						  $("#page_login_prompt").hide();
		        		  fconnected = true;
					  }
					    $("#user_name_at_phone").html("");
						$("#send_sms_ajax").hide(); 
						$("#send_sms_complete").hide();
						$("#send_sms").show(); 
						$("#verification_code").val("");
						$("#verification_code").prop("readonly",true);
						$("#verification_submit_inactive").show();
						$("#verification_submit").hide();
						$("#smsa_loader").hide(); 
						$("#phone_wrap_table").hide();
						$("#sign_in_table_").show();
				  } else if (data.status=="NOTLOGGED") {
					  if(gconnected==false && fconnected==false && phoneflow==true) {
				    		if(auth2.isSignedIn.wc) {
				    			// Connected with Google
				    			googleSignOut();
				    		} else if(FB.getUserID() != "") {
				    			// Connected with FB
				    			facebookSignOut();
				    		}
				    	}
				    	phoneflow=false;
				    	
						//result.userData.first_name for FB
						$("#user_name_at_phone").html("");
						$("#send_sms_ajax").hide(); 
						$("#send_sms_complete").hide();
						$("#send_sms").show(); 
						$("#verification_code").val("");
						$("#verification_code").prop("readonly",true);
						$("#verification_submit_inactive").show();
						$("#verification_submit").hide();
						$("#smsa_loader").hide(); 
						$("#phone_wrap_table").hide();
						$("#sign_in_table_").show();
					    $("#page_login_prompt").hide();
				   } else if(data.status=="NOCODE" ) {
					   $("#phone_resend_open").click();
				   }  else if(data.status=="WRONG" ) {
					   $("#verification_code").addClass("redborder");
				   }
				  console.log(data);
			  },
		      error: function(e) {
		    	  $("#send_sms_ajax").hide();
			      console.log(e);
			  },
			  dataType : "JSON",
			  type : "post"
			  });		  
	  }
  });
  $("#verification_code").on("keyup change", function() {
	  $("#verification_code").removeClass("redborder");
  });
});

//gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
(function() {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js?onload=startApp';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  })();
// Load the FB SDK asynchronously
(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=953909477967729";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	

//INIT VALUES
	/**
	 * Called after the Google client library has loaded.
	 */
 function startApp() {
	  console.log("GOOGLE: startApp()" );
	  gapi.load('auth2', function(){
	    // Retrieve the singleton for the GoogleAuth library and setup the client.
	    gapi.auth2.init({
	        client_id: '542083885391-iqtnhm3jjc6if0sgkstvkfj4oksjg3m5.apps.googleusercontent.com',
	        cookiepolicy: 'single_host_origin',
	        fetch_basic_profile: true,
	        scope : 'https://www.googleapis.com/auth/plus.login'	     
	      }).then(function (){
	            console.log('GOOGLE: init');
	            auth2 = gapi.auth2.getAuthInstance();
	            auth2.then(function() {
	                  onSignInCallback(auth2.currentUser.get().getAuthResponse())
	              });
	          });
	  });
	}
	
  window.fbAsyncInit = function() {
	  FB.init({
	    appId      : '953909477967729',
	    cookie     : true,  // enable cookies to allow the server to access  the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.1' // use version 2.1
	  });
	  if(!initialPageLoad) {
		  FB.getLoginStatus(function(response) {
			  console.log("FACEBOOK: FB.getLoginStatus on Init" );
			    statusChangeCallback(response);
		  });
	  }
  };

function googleSignIn() {
	console.log("GOOGLE: googleSignIn()" );
	      auth2.grantOfflineAccess().then(
	        function(result){
	          gcode = result.code;
	          helper.connectServer(result.code);
	        });
	 
	}
	
var helper = (function() {
	  var authResult = undefined;
	  return {

	    onSignInCallback: function(authResult) {
	    	console.log("GOOGLE: helper.onSignInCallback" );
	      for (var field in authResult) {
	       // $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
	      }
	      if (authResult['access_token']) {
	    	  initialPageLoad = false;
	    	console.log("GOOGLE: helper.onSignInCallback - success" );
	        // The user is signed in
	        this.authResult = authResult;
	        gconnected = true;
	        fconnected = false;
	        gapi.client.load('plus','v1',this.renderProfile);
	        // Check if FB connected -> disconnect
	        FB.getLoginStatus(function(response) {
	        	console.log("FACEBOOK: FB.getLoginStatus() on google signed-in" );
	        	if (response.status === 'connected') {
	        		 facebookSignOut();
	        	}
	  	    });
	        
	      } else if (authResult['error']) {
	    	  console.log("GOOGLE: helper.onSignInCallback - error" );
	    	  gconnected = false;
	    	  gudata = {};
	    	  if(initialPageLoad) {
	    		  initialPageLoad = false;
	    		  FB.getLoginStatus(function(response) {
	    			  console.log("FACEBOOK (GOOGLE FAIL): FB.getLoginStatus on Init" );
	    			    statusChangeCallback(response);
	    		  });
	    	  } else {
	    		  initialPageLoad = false;
	    	     updatePageView();
	    	  }
	      } else {
	    	  console.log("GOOGLE: helper.onSignInCallback - disconnected" );
	    	  gconnected = false;
	    	  gudata = {};
	    	  if(initialPageLoad) {
	    		  initialPageLoad = false;
	    		  FB.getLoginStatus(function(response) {
	    			  console.log("FACEBOOK (GOOGLE FAIL): FB.getLoginStatus on Init" );
	    			    statusChangeCallback(response);
	    		  });
	    	  } else {
	    		  initialPageLoad = false;
	    	     updatePageView();
	    	  }
	      }
	     
	    },
	    /**
	     * Retrieves and renders the authenticated user's Google+ profile.
	     */
	    renderProfile: function() {
	    	console.log("GOOGLE: helper.renderProfile" );
	      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
	      request.execute(function(profile) {
	          if (profile.error) {
	        	  gudata = {};
	        	  gconnected=false;
	        	  googleSignOut();
	              return;
	          }
	          gudata = profile;
	          updatePageView();
	        });
	    },
	    /**
	     * Calls the server endpoint to disconnect the app for the user.
	     */
	    disconnectServer: function() {
	    	console.log("GOOGLE: helper.disconnectServer" );
	      // Revoke the server tokens
	      var token  = auth2.currentUser.get().getAuthResponse().access_token;
	      var disconnectData = {access_token:token,provider:"google"};
	      $.ajax({
	        type: 'POST',
	        url: '/disconnectUser',
	        async: false,
	        dataType : "JSON",
	        data: disconnectData,
	        success: function(result) {
	           console.log("DISCONNECTED SERVER");
	           console.log(result);
		       auth2.signOut().then(function () {
		     	  onSignInCallback(auth2.currentUser.get().getAuthResponse());
	            });
	       },
	       error: function(e) {
	         console.log(e);
	       }
	     });

	    },
	    /**
	     * Calls the server endpoint to connect the app for the user. The client
	     * sends the one-time authorization code to the server and the server
	     * exchanges the code for its own tokens to use for offline API access.
	     * For more information, see:
	     *   https://developers.google.com/+/web/signin/server-side-flow
	     */
	    connectServer: function(code) {
	      console.log("GOOGLE: helper.connectServer" );
	      console.log(code);
	    
	      var token  = auth2.currentUser.get().getAuthResponse().access_token;
	      var connectData = {access_token:token,provider:"google",code:code};
	      console.log(connectData);
	      $.ajax({
	        type: 'POST',
	        url: '/connectUser',
	        dataType : "JSON",
	        success: function(result) {
	        	if(result.valid == false) {
	        		auth2.signOut().then(function () {
				     	  onSignInCallback(auth2.currentUser.get().getAuthResponse());
			      });
	        	} else {
	        		if(result.phone==true) {
	        			onSignInCallback(auth2.currentUser.get().getAuthResponse());
	        		} else if(phonerequired != undefined && phonerequired == true){
	        			$("#sign_in_table_").hide();
	        			//result.userData.first_name for FB
	        			$("#user_name_at_phone").html(result.userData.given_name);
	        			$("#send_sms_ajax").hide(); 
	        			$("#send_sms_complete").hide();
	        			$("#send_sms").show(); 
	        			$("#phone_wrap_table").show();
	        			phoneflow = true;
	        			phoneloggedby = "google";
	        		}
	        	}
	          console.log(result);
	        },
	        error: function(e) {
		         console.log(e);
			     auth2.signOut().then(function () {
				     	  onSignInCallback(auth2.currentUser.get().getAuthResponse());
			      });
		       },
	        data: connectData
	      });

	    },

	  };
	})();
	/**
	 * Perform jQuery initialization and check to ensure that you updated your
	 * client ID.
	 */
	function googleSignOut() {
		console.log("GOOGLE: googleSignOut()" );
		helper.disconnectServer();
	}

	/**
	 * Calls the helper method that handles the authentication flow.
	 *
	 * @param {Object} authResult An Object which contains the access token and
	 *   other authentication information.
	 */
	function onSignInCallback(authResult) {
		 console.log("GOOGLE: onSignInCallback()" );
	  helper.onSignInCallback(authResult);
	}
	
	 function checkGoogleStatus() {
		 console.log("GOOGLE: checkGoogleStatus()" );
		 var at = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
		 if(at != undefined) {
			 var data_ = {at:at};
			 console.log(data_);
			 $.ajax({
			        url: '/checkGoogleToken',
				    dataType : "JSON",
				    type : "post",
			        success: function(result) {
			          console.log(result);
			        },
			        data: data_
			      });
		 } else {
			 console.log("GOOGLE NOT SIGNED IN");
		 }
	 }

  // This is called with the results from from FB.getLoginStatus().
  function facebookSignOut(){
	  console.log("FACEBOOK: facebookSignOut()" );
	  var token  = FB.getAuthResponse().accessToken;
	  
	  FB.logout(function(response) {
	        // Person is now logged out
		  statusChangeCallback(response);
	        // DISCONNECT SERVER
	      var disconnectData = {access_token:token,provider:"facebook"};
	      $.ajax({
	        type: 'POST',
	        url: '/disconnectUser',
	        dataType : "JSON",
	        async: true,
	        data: disconnectData,
	        success: function(result) {
	           console.log("DISCONNECTED SERVER");
	           console.log(result);
	       },
	       error: function(e) {
	         console.log(e);
	       }
	     });
	    });
  }
  var onlyonlogin = false;
  function facebookSignIn(){
	  console.log("FACEBOOK: facebookSignIn()" );
	  onlyonlogin = true;
	  FB.login(function(response) {
	        // Person is now logged out
		  statusChangeCallback(response);
	    }, {scope: 'public_profile,email'});
  }
  function checkLoginState() {
	  console.log("FACEBOOK: checkLoginState()" );
	    FB.getLoginStatus(function(response) {
	      statusChangeCallback(response);
	    });
	  }
  function statusChangeCallback(response) {
	   console.log("FACEBOOK: statusChangeCallback()" );
	    console.log(response);
	    // The response object is returned with a status field that lets the
	    // app know the current login status of the person.
	    // Full docs on the response object can be found in the documentation
	    // for FB.getLoginStatus().
	    if (response.status === 'connected') {
	      // Logged into your app and Facebook.
	      console.log("FACEBOOK: statusChangeCallback() - SUCCESS" );
	      FB.api('/me', function(response) {
	          console.log('Successful FB login for: ' + response.name);
	          fudata=response;
	          fconnected = true;
	          gconnected = false;
	          updatePageView();
	        });
	       // IF Google connected -> disconnect
	       if(auth2.isSignedIn.get()==true) {
	    	   auth2.signOut().then(function () {
		        	  onSignInCallback(auth2.currentUser.get().getAuthResponse());
	           });
	       }
	       // CONNECT TO SERVER
	       if(onlyonlogin) {
	    	  onlyonlogin = false;
		      var token  = FB.getAuthResponse().accessToken;
		      var connectData = {access_token:token,provider:"facebook",code:""};
		      $.ajax({
		        type: 'POST',
		        url: '/connectUser',
		        dataType : "JSON",
		        success: function(result) {
		          if(result.valid == false) {
		        	  FB.logout(function(response) {
				 		  statusChangeCallback(response);
				         });
		          } else {		        	   
		        	  if(result.phone==false && phonerequired != undefined && phonerequired == true) {		        			 
		        			$("#sign_in_table_").hide();
		        			//result.userData.first_name for FB
		        			$("#user_name_at_phone").html(result.userData.first_name);
		        			$("#send_sms_ajax").hide(); 
		        			$("#send_sms_complete").hide();
		        			$("#send_sms").show(); 
		        			$("#phone_wrap_table").show();
		        			 $("#page_login_prompt").show();
		        			fconnected = false;
		        			phoneflow = true;
		        			phoneloggedby = "FB";
		        		}
		          }
		          console.log(result);
		        },
		        error: function(e) {
			         console.log(e);
			         FB.logout(function(response) {
			 		  statusChangeCallback(response);
			         });
			       },
		        data: connectData
		      });
	       }
		      
	    } else if (response.status === 'not_authorized') {
	    	console.log("FACEBOOK: statusChangeCallback() - NOT_AUTORIZED" );
	      // The person is logged into Facebook, but not your app.
	      //  'into this app.';
	        fudata = {};
	    	fconnected = false;
	    	updatePageView();
	    } else {
	    	console.log("FACEBOOK: statusChangeCallback() - FAIL" );
	      // The person is not logged into Facebook, so we're not sure if
	      // they are logged into this app or not.
	      //  document.getElementById('status').innerHTML = 'Please log ' +
	      //   'into Facebook.';
	        fudata={};
	    	fconnected = false;
	    	updatePageView();

	    }
	  }
  function checkFBStatus() {
	  console.log("FACEBOOK: checkFBStatus()" );
	    if(FB.getAuthResponse()!= null) {
	     var bftoken = FB.getAuthResponse().accessToken;
		 var data_ = {at:bftoken};
		 $.ajax({
		        url: '/checkFBToken',
			    dataType : "JSON",
			    type : "post",
		        success: function(result) {
		          console.log(result);
		        },
		        data: data_
		      });
     } else {
    	 console.log("NOT SIGNED IN FACEBOOK");
     }
  }
  
  function setSessionData(callback) {
		if(gconnected) {
			if(auth2.isSignedIn.get()) {
			     var token  = auth2.currentUser.get().getAuthResponse().access_token;
				 var data_ = {provider:"google",access_token:token};
				 $.ajax({
				        url: '/setsessiontoken',
					    dataType : "JSON",
					    type : "post",
				        success: function(result) {
				        	console.log(result);
				        	callback(result.valid);
				        },
				        error: function(e) {
				        	console.log(e);
				        	callback(false);
					    },
				        data: data_
				      });
			} else {
				gconnected = false;
				updatePageView();
				callback(false);
			}
            
		} else if(fconnected) {
			FB.getLoginStatus(function(response) {
				 if (response.status === 'connected') {
					 var token  = FB.getAuthResponse().accessToken;
					 var data_ = {provider:"facebook",access_token:token};
					 $.ajax({
					        url: '/setsessiontoken',
						    dataType : "JSON",
						    type : "post",
					        success: function(result) {
					        	console.log(result);
					        	callback(result.valid);
					        },
					        error: function(e) {
					        	console.log(e);
					        	callback(false);
						    },
					        data: data_
					      });
				 } else {
					    fconnected = false;
						updatePageView();
						callback(false);
				 }
			});
			

		} else {
			updatePageView();
			callback(false);
		}
  }
  
  function logoutAny() {
	  if(fconnected==true) {
		  facebookSignOut();
		  fconnected = false;
		  updatePageView();
	  } else if (gconnected==true) {
		  googleSignOut();
		  gconnected = false;
		  updatePageView();
	  }
  }