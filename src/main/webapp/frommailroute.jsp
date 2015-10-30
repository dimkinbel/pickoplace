<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
  <script type="text/javascript" src="js/loginlogout.js" ></script>
  <link href='https://fonts.googleapis.com/css?family=Roboto|Muli' rel='stylesheet' type='text/css'>
  <script type="text/javascript">
 var getUrlParameter = function getUrlParameter(sParam) {
	    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	}; 
	$(document).ready(function() {
		
	});
	
	   
	
	function continueToServlet() {
		var requestType = getUrlParameter("type");
		var servleturl = getUrlParameter("servlet");
		var userId = getUrlParameter("umail");
		var entitykey = getUrlParameter("uekey");
		if(servleturl=="userbookings") {
			setSessionData(function(result) {
				   if(result) {
					   location.href = "/userbookings";
					}
			});
		}
	}
	//LOGIN SUCCESS UPDATE
	function updatePageView() {
		  if(fconnected==true || gconnected==true) {
			  //Connected To Facebook
			  continueToServlet();
			  
		  } else {
			  //Not connected			  
			  $("#loginbuttonsflow").show();
			  $("#flow_ajax_spinner").hide();
		  }
	}
 </script>
 
<title></title>
</head>
<style>

.cbtn {
cursor:pointer;
border:1px solid grey;
width:245px;
height:42px;
border-radius: 2px;
}
.cbtn:hover {
border:1px solid black;
}

#google-connect {
  border-color: #c4c4c4;
  background: white;
  color: #565a5c;
  position:relative;
  margin-bottom: 10px;
}

#google-connect:hover {
  border-color: #aaa;
  color: #565a5c;
}

#facebook-connect {
  border-color: #3B5998;
  border-bottom-color: #263a63;
  background-color: #3B5998;
  color: #fff;
  position:relative;
}
#facebook-connect:hover {
  border-color: #4568b2;
  border-bottom-color: #2d4575;
  background-color: #4568b2;
  color: #fff;
}
#gpsi_img_d {
  position: relative;
  float: left;
  left: 10px;
  top: 6px;
}
#gpsi_text {
  position: relative;
  float: left;
  font-family: Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: bold;
  left: 30px;
  top: 12px;
}
#fpsi_text {
  position: relative;
  float: left;
  font-family: Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: bold;
  left: 49px;
  top: 12px;
}
#fpsi_img_d {
  position: relative;
  float: left;
  left: 17px;
  top: 4px;
  font-size: 31px;
  font-family: sans-serif;
}
#login_prompt_wrap {
  width: 247px;
  padding: 15px;
  border: 1px solid rgb(223, 223, 223);
  border-radius: 3px;
}
#ppwelcomeflow {
    text-align: center;
    margin-top: 30px;
    font-family: Muli;
    font-size: 20px;
    color: #676767;
}
#flow_ajax_spinner{
width: 200px;
    padding-top: 30px;
    margin: auto;
    text-align: center;
}
#sign_in_table_ {
width: 245px;
    margin: auto;
}
#loginbuttonsflow {
    margin: auto;
    width: 300px;
    margin-top: 30px;
    height: 150px;
    display: flex;
}
</style>
<body>
<div id="flowpagewrap" style="width:100%;height:100%">
  <div id="ppwelcomeflow">PickoPlace authorization request</div>
  <div id="flow_ajax_spinner" style="width:200px;padding-top:100px;margin:auto">
    <img  style="width: 100px;" src="img/gif/ajaxSpinner.gif" />
  </div>
  <div id="loginbuttonsflow" style="margin:auto;display:none;">
  		<table id="sign_in_table_" cellspacing="0" cellpadding="0" style="border-collapse: collapse">
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
</div>
</body>
</html>