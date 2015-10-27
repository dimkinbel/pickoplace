<%@ page language="java" contentType="text/html; charset=UTF-8"
    import="java.net.URLEncoder"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
    <link rel="stylesheet" href="css/login.css" type="text/css"/>
<script type=text/javascript>
var auth2 = auth2 || {};
var gcode = {};
var fudata = {};
var gudata = {};
var gconnected = false;
var fconnected = false;
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
	
</script>
<script type=text/javascript>
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
	  FB.getLoginStatus(function(response) {
		  console.log("FACEBOOK: FB.getLoginStatus on Init" );
		    statusChangeCallback(response);
	  });
  };
</script>
<script type=text/javascript>
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
	    	  updatePageView();
	      } else {
	    	  console.log("GOOGLE: helper.onSignInCallback - disconnected" );
	    	  gconnected = false;
	    	  gudata = {};
	    	  updatePageView();
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
	  	          onSignInCallback(auth2.currentUser.get().getAuthResponse());
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
</script>
<script type=text/javascript>
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
  function facebookSignIn(){
	  console.log("FACEBOOK: facebookSignIn()" );
	  FB.login(function(response) {
	        // Person is now logged out
		  statusChangeCallback(response);
	    });
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
  
  function updatePageView() {
	  if(fconnected==true) {
		  //Connected To Facebook
		  $("#login_prompt_wrap").hide();
		  $("#facebook-disconnect").show();
		  $("#checkFBStatus").show();	  
		  $("#google-disconnect").hide();
		  $("#checkGoogleStatus").hide();
		  $("#login_name_result").empty();
		  $("#login_name_result").html(JSON.stringify(fudata));
		  
	  } else if (gconnected==true) {
		  //Connected To Google
		  $("#login_prompt_wrap").hide();
		  $("#google-disconnect").show();
		  $("#checkGoogleStatus").show();
		  $("#facebook-disconnect").hide();
		  $("#checkFBStatus").hide();	 
		  $("#login_name_result").empty();
		  $("#login_name_result").html(JSON.stringify(gudata));
		  
		  
	  } else {
		  //Not connected
		  $("#login_prompt_wrap").show();
		  $("#google-disconnect").hide();
		  $("#checkGoogleStatus").hide();
		  $("#facebook-disconnect").hide();
		  $("#checkFBStatus").hide();
		  $("#login_name_result").empty();
		  
	  }
  }
</script>
<title>Insert title here</title>
</head>
<style>

</style>
<body>
<div id="login_prompt_wrap">
<table id="sign_in_table_" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
  <tr>
    <td>
      <div id="google-connect" class="cbtn" onClick="googleSignIn()">
	    <div id="gpsi_img_d"><img id="gpsi_img" src="img/gplus30.png"/></div>
	    <div id="gpsi_text">Sign In with Google</div>
	  </div>   
    </td>
  </tr>
  <tr>
	  <td>
		<div id="facebook-connect"  class="cbtn" onClick="facebookSignIn()">
			<div id="fpsi_img_d">f</div>
	        <div id="fpsi_text">Sign In with Facebook</div>
		</div>
	  </td>
  </tr>
</table>  
</div>
<div id="communication_login">
    <div id="google-disconnect"  onClick="googleSignOut()">Sign Out with Google</div>
    <div id="facebook-disconnect"  onClick="facebookSignOut()">Sign Out with Facebook</div>  
	<div id="checkGoogleStatus" onClick="checkGoogleStatus()">CheckGoogleStatus</div>
	<div id="checkFBStatus" onClick="checkFBStatus()">CheckFacebookStatus</div>
	
	RESULT NAME:
    <div id="login_name_result"></div>	
</div>

    
    <pre id="authResult"></pre>

<div id="fb-root"></div>

</body>
</html>