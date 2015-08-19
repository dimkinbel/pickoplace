<%@ page language="java" contentType="text/html; charset=UTF-8"
    import="java.net.URLEncoder"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="google-signin-client_id">
    <script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
    <script src="https://apis.google.com/js/platform.js" async defer onload="initClient()"></script>
<script type=text/javascript>
function initClient() {
	gapi.auth2.init({
	    client_id: '542083885391-iqtnhm3jjc6if0sgkstvkfj4oksjg3m5.apps.googleusercontent.com',
	    cookiepolicy: 'single_host_origin',
	    fetch_basic_profile: true,
	    approvalprompt:'force',
	    scope : 'profile'	     
	  });
}
</script>
<script type=text/javascript>

</script>
<title>Insert title here</title>
</head>

<body>
<div class="g-signin2" data-longtitle="true" data-onsuccess="Google_signIn" data-theme="light" data-width="200"></div>

</body>
</html>