<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Toolkit</title>
    <script type="text/javascript" src="//www.gstatic.com/authtoolkit/js/gitkit.js"></script>
   <link type="text/css" rel="stylesheet" href="//www.gstatic.com/authtoolkit/css/gitkit.css" />
	<script type="text/javascript">
	  var config = {
	      apiKey: 'AIzaSyAJW7bVksdm__cs4bmcx3ml4XVJPn7v_MI',
	      signInSuccessUrl: '/',
	      idps: ["facebook"],
	      oobActionUrl: '/',
	      siteName: 'this site'
	  };
	  // The HTTP POST body should be escaped by the server to prevent XSS
	  window.google.identitytoolkit.start(
	      '#gitkitWidgetDiv', // accepts any CSS selector
	      config,
	      'JAVASCRIPT_ESCAPED_POST_BODY');
	</script>
</head>
<body>
<div id="gitkitWidgetDiv"></div>
</body>
</html>