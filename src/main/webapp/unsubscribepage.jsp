<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html >
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
  <link href='https://fonts.googleapis.com/css?family=Roboto|Muli' rel='stylesheet' type='text/css'>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
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
		$("#mailinp").html(getUrlParameter("umail"));
		
		$("#unsubscribeButton").click(function (){
			var email = getUrlParameter("umail");
			var ukey = getUrlParameter("uekey");
			var json_ = {email:email,ukey:ukey};
			$.ajax({
			  url : "/unsubscribe",
			  data: json_,//
			  beforeSend: function () { 
				  $("#unsubscribeButton").hide(); 
				  $("#flow_ajax_spinner").show(); 
			  },
			  success : function(data){	
				  console.log(data);
				  if(data.status=="OK") {
					  $("#flow_ajax_spinner").hide();
					  $("#unsubscribeOK").show();
				  } else {
					  $("#flow_ajax_spinner").hide();
				  }
			  },
		      error: function(e) {
		    	  $("#flow_ajax_spinner").hide();
			      console.log(e);
			  },
			  dataType : "JSON",
			  type : "post"
			  });
		});
	});
	
	   
	
	function unsubscribeServlet() {
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
    left: 12px;
    top: 10px;
}
#gpsi_text {
    position: relative;
    float: left;
    font-family: Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 15px;
    font-weight: bold;
    left: 40px;
    top: 12px;
}
#gpsi_img {
    width: 17px;
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
    margin-top: 20px;
    font-family: Muli;
    font-size: 17px;
    color: #676767;
}
#mailinp {
margin-top: 10px;
    color: black;
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
#unsubscribeButton:hover {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    color: red !important;
    border-color: #888787 !important;
}
#unsubscribeButton {
position: relative;
    bottom: 0px;
    color: #FF5757;
    border: 1px solid;
    border-color: #9A9A9A;
    padding-top: 8px;
    padding-bottom: 8px;
    width: 200px;
    height: 30px;
    background-color: #FBFBFB;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
    font-family: Muli;
    line-height: 30px;
    border-radius: 3px;
    font-size: 16px;
    box-shadow: 0 4px 2px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 1;
}
#loginbuttonsflow {
    margin: auto;
    width: 300px;
    margin-top: 30px;
    height: 150px;
    display: flex;
}
#unsubscribeOK {
    text-align: center;
    color: green;
    font-family: Roboto;
    margin-top: 20px;
}
</style>
<body>
<div id="flowpagewrap" style="width:100%;height:100%">
  <div id="ppwelcomeflow">Are you sure you want to unsubscribe from order-confirmation eMails sent you by PickoPlace ?<br><div id="mailinp">dimkinbel@gmail.com</div></div>
  <div id="unsubscribeButton">Unsubscribe</div>
  <div id="flow_ajax_spinner" style="width:200px;padding-top:100px;margin:auto;display:none">
    <img  style="width: 100px;" src="img/gif/ajaxSpinner.gif" />
  </div>
 <div id="unsubscribeOK" style="display:none;"><div class="materialOK material-icons">done</div>You have been successfully unsubscribed.</div>
</div>
</body>
</html>