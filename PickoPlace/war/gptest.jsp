<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="google-signin-clientid" content="542083885391-iqtnhm3jjc6if0sgkstvkfj4oksjg3m5.apps.googleusercontent.com" />
<meta name="google-signin-scope" content="https://www.googleapis.com/auth/plus.login  https://www.googleapis.com/auth/userinfo.email" />
<meta name="google-signin-requestvisibleactions" content="http://schema.org/AddAction" />
<meta name="google-signin-cookiepolicy" content="http://pickoplace.com" />
<meta name="google-signin-callback" content="signinCallback" />
<script src="https://apis.google.com/js/client:platform.js?onload=render" async defer>
/* Executed when the APIs finish loading */


</script>
<script type="text/javascript">
function render() {

	  // Additional params
	  var additionalParams = {
	    'theme' : 'dark'
	  };

	  gapi.signin.render('myButton', additionalParams);
	}
function signinCallback(authResult) { 
	  if (authResult['status']['signed_in']) {
	    // Update the app to reflect a signed in user
	    // Hide the sign-in button now that the user is authorized, for example:
	    console.log('Sign in: ' + JSON.stringify(authResult));
	    document.getElementById('signinButton').setAttribute('style', 'display: none');
	  } else {
	    // Update the app to reflect a signed out user
	    // Possible error values:
	    //   "user_signed_out" - User is signed-out
	    //   "access_denied" - User denied access to your app
	    //   "immediate_failed" - Could not automatically log in the user
	    console.log('else state: ' + JSON.stringify(authResult));
	  }
	}
</script>

<title>Insert title here</title>
</head>
<body>

<div id="gSignInWrapper">
  <div id="myButton" class="classesToStyleWith">
    Sign in with Google
  </div>
</div>
</body>
</html>