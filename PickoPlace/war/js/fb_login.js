  // This is called with the results from from FB.getLoginStatus().
  function FB_logout(){
	  FB.logout(function(response) {
	        // Person is now logged out
		  statusChangeCallback(response);
		  $("#account_menu_for_facebook_td").hide();
		  $("#account_menu_for_facebook_div").html("");
		  document.getElementById('loggedBy_').value = "";
	    });
  }
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
      hideGoogleLogin();
      document.getElementById('loggedBy_').value = "FB";
      document.getElementById('FB_name_wrap').style.display="inline-block";
      $("#account_menu_for_facebook_td").show();
      FB.api('/me', function(response) {
          console.log('Successful login for: ' + response.name);
          document.getElementById('FB_name_value').innerHTML = response.name;
          document.getElementById('facebook_email_on_login').value = response.email;
          
          var fb_login = {login:'login',response:response};
          var ajax_data = {fb_login:JSON.stringify(fb_login)};
          $.ajax({
    	      url : "/userLoginFacebook",
    	      data: ajax_data,//
    	      success : function(data){
    	    	 if(document.getElementById('facebook_login_append_book_confirm')!=null) {
    	    		 //Append confirmation buttons for Client booking after signin
    	    		 var appendData = "";
    	    		 appendData +=  '<div style="width:100%" id="welcome_booking_row"><span class="userNikname">'+response.email+'</span></div>';
    	    		 appendData +=  '<table id="brc_buttons" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">';
    	    		 appendData +=  '  <tr>';
    	    	     appendData +=  '   <td><div id="bookingConfirmCancel" onclick="bookingConfirmCancel()">Cancel</div></td>';
    	    		 appendData +=  '   <td><div id="bookingConfirmConfirm" onclick="bookingConfirmConfirm()">Book</div></td>';
    	    		 appendData +=  '  </tr>';
    	    		 appendData +=  ' </table>';
    	    		 appendData +=  ' <input style="display:none" id="booking_user_cred" value="'+response.email+'"/>';
    	    		 $('#login_book_table_google').hide();
    	    		 $("#facebook_login_append_book_confirm").append(appendData);
    	    	 }
    	      },
    	      dataType : "JSON",
    	      type : "post"
    	  });
        });
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
     // document.getElementById('status').innerHTML = 'Please log ' +
      //  'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
    //  document.getElementById('status').innerHTML = 'Please log ' +
     //   'into Facebook.';
    	showGooglelogin();
    	$("#FB_name_wrap").hide();
    	document.getElementById('loggedBy_').value = "";
    	$("#account_menu_for_facebook_td").hide();
    	$("#account_menu_for_facebook_div").html("");
    	 document.getElementById('FB_name_value').innerHTML = "";
    	 var email = document.getElementById('facebook_email_on_login').value;
    	 if(email=="" || email== null) {
    	 } else {
	    	 var response_={};
	    	 response_.email = email;
	    	 var fb_login = {login:'logout',response:response_};
	    	 var ajax_data = {fb_login:JSON.stringify(fb_login)}
	    	 $.ajax({
	   	      url : "/userLoginFacebook",
	   	      data: ajax_data,//
	   	      success : function(data){
	   	    	if(document.getElementById('facebook_login_append_book_confirm')!=null) {
   	    		  $('#login_book_table_google').show();
   	    		  $('#facebook_login_append_book_confirm').html("");
	   	    	} else {
	   	    	  window.location.href = '/welcome.jsp';
	   	    	}
	   	      },
	   	      dataType : "JSON",
	   	      type : "post"
	   	     });
        }
    }
  }
function goToAccountMenuFB() {
	FB.getLoginStatus(function(response) {
	    if (response.status === 'connected') {
	        // Logged into your app and Facebook.
	        hideGoogleLogin();
	        document.getElementById('FB_name_wrap').style.display="inline-block";
	        FB.api('/me', function(response) {
	            document.getElementById('fbemail').value = response.email;
	            document.getElementById("master_accountFB").submit();
	          });
	      } else if (response.status === 'not_authorized') {
	        // The person is logged into Facebook, but not your app.
	       // document.getElementById('status').innerHTML = 'Please log ' +
	        //  'into this app.';
	      } else {
	        // The person is not logged into Facebook, so we're not sure if
	        // they are logged into this app or not.
	      //  document.getElementById('status').innerHTML = 'Please log ' +
	       //   'into Facebook.';
	      	showGooglelogin();
	      	$("#FB_name_wrap").hide();
	      	$("#account_menu_for_facebook_div").html("");
	      	$("#account_menu_for_facebook_td").hide();
	      	 document.getElementById('FB_name_value').innerHTML = "";
	      	 var email = document.getElementById('facebook_email_on_login').value;
	      	 if(email=="" || email== null) {
	      	 } else {
	  	    	 var response_={};
	  	    	 response_.email = email;
	  	    	 var fb_login = {login:'logout',response:response_};
	  	    	 var ajax_data = {fb_login:JSON.stringify(fb_login)}
	  	    	 $.ajax({
	  	   	      url : "/userLoginFacebook",
	  	   	      data: ajax_data,//
	  	   	      success : function(data){
	  	   	    	 
	  	   	      },
	  	   	      dataType : "JSON",
	  	   	      type : "post"
	  	   	     });
	          }
	      }
	    });
}

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '953909477967729',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);

    });
  }
  function hideGoogleLogin(){
	  var all=document.getElementsByName("only_google_login");
	     for(var x=0; x < all.length; x++) {
	       $('#'+all[x].id).hide();
	     }
  }
  function showGooglelogin(){
	  var all=document.getElementsByName("only_google_login");
	     for(var x=0; x < all.length; x++) {
	       $('#'+all[x].id).show();
	     }
  }
$("#loginAccountOptionsFB").on('mouseenter', '.oneline', function() {
	    $('#accountHiddenOptionsFB').slideDown(500);
	    $(this).addClass( "loginAccountOptionsFocus" );
});
$("#accountHiddenOptionsFB").on('mouseenter', '.hoverload', function() {
	  $('#accountHiddenOptionsFB').css("display","");	
	  $('#loginAccountOptionsFB').addClass( "loginAccountOptionsFocus" );
});
$("#accountHiddenOptionsFB").on('mouseleave', '.hoverload', function() {
	$("#accountHiddenOptionsFB").hide();
	$('#loginAccountOptionsFB').removeClass( "loginAccountOptionsFocus" );
});
