<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%-- meta --%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>PP-Developer</title>

    <%-- css --%>
    <link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="/js/lib/jquery-ui-1.11.4/jquery-ui.css" type="text/css" media="screen">
    <link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="/js/lib/jquery-plugins/raty/raty.css" type="text/css" media="screen">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" >

    <%-- js --%>
    <script type="text/javascript" src="/js/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="/js/jquery-migrate-1.2.1.js"></script>
    <script type="text/javascript" src="/js/lib/jquery-ui-1.11.4/jquery-ui.js"></script>
    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">
    </script>
    <script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
    <script type="text/javascript" src="js/loginlogout.js"></script>
    <script type="text/javascript" src="js/bootstrap-slider.js"></script>
    <script type="text/javascript" src="js/sitefunctions.js"></script>
    <script type="text/javascript" src="js/dropit.js"></script>
    <script type="text/javascript" src="js/interactive_admin.js"></script>
    <script type="text/javascript" src="js/mainPageMap.js"></script>
    <script type="text/javascript" src="js/search.js"></script>
    <script type="text/javascript" src="/js/lib/jquery-plugins/raty/raty.js"></script>
    
    <%-- custom js --%>
<script type="text/javascript">
var geocoder;
var uploadLastcursor = "";
$(document).ready(function() {
	$("#adm_upload_images_btn").click(function(){
		location.href = "/developer/upload_draw_images.jsp";
	});
});


//LOGIN SUCCESS UPDATE
function updatePageView() {
	  if(fconnected==true) {
		  //Connected To Facebook
		  $("#page_login_prompt").hide();
		  $("#login_prop").hide();		  
		  $("#account_drop").show();
		  
		  $("#login_info_resp_d").empty();
		  $("#login_info_resp_d").html(fudata.first_name);
		  $("#login_info_resp").show();
		  
		  $("#fb_logout_div").show();
		  $("#go_logout_div").hide();
		  
		  $('#facebook_img').attr('src',"http://graph.facebook.com/" + fudata.id + "/picture");
		  $("#facebook_image_wrap").show();
		  
	  } else if (gconnected==true) {
		  //Connected To Google
		  $("#page_login_prompt").hide();
		  $("#login_prop").hide();		  
		  $("#account_drop").show();
		  
		  $("#login_info_resp_d").empty();
		  $("#login_info_resp_d").html(gudata.name.givenName);
		  $("#login_info_resp").show();
		  
		  $("#fb_logout_div").hide();
		  $("#go_logout_div").show();
		  $("#facebook_image_wrap").hide();
		  
	  } else {
		  //Not connected
		  
		  $("#login_prop").show();
		  $("#login_info_resp").hide();
		  $("#account_drop").hide();

		  $("#login_info_resp_d").empty();
		  
		  $("#fb_logout_div").hide();
		  $("#go_logout_div").hide();
		  $("#facebook_image_wrap").hide();
	  }
}
$(document).ready(function () { 

    $('#advanced_material_drop').dropit({action: 'click'});
});

 ///
</script>
</head>


<body style="margin: 0px;">

     <div id="page_login_prompt" class="login_prompt stopclick" style="display:none;">
		<div id="login_prompt_wrap" class="stopclick">
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
   </div>

   <div id="header_drawing">
	<div id="header">
		<div id="logo_"><img src="img/pplogomarker.png" id="pplogoo"/><div id="logotext">ickoplace</div></div>

		<div class="login_in_header_wrap">
		   	<table id="login_tbl_a" cellspacing="0" cellpadding="0" style=" border-collapse: collapse">
	             <tr >
				    <td id="login_prop" style="display:none">
					  <div id="login_prop_d">Log In</div>
					</td>
					<td id="login_info_resp" style="display:none">
					  Hello, <div id="login_info_resp_d" class="userNikname"></div>
					</td>
				    <td id="account_drop"  style="display:none">
					 <div id="account_drop_div">
					    <ul id="account_dropit" >
	                       <li class="acc_trig"><a href="#" class="account_dropit" style="text-decoration: none">Account</a>
			                   <ul class="account_dropit_ul">
				                   <li>
								     <div id="acc_head_menu_wrap">
									   <div id="acc_arrow"></div>
									   <div id="gotoaccountmenu" class="topAccOptList" onclick="goToAccountMenu()">Go to Account</div>
									   <div id="gotobookings" class="topAccOptList">My bookings</div>
									   <div id="gotoadminzone" class="topAccOptList">AdminZone</div>
									   <div id="create_new_place_btn"  class="topAccOptList" onclick="goToCreatePlace()">Create New Place</div>
									   <div id="fb_logout_div" class="topAccOptList" onClick="facebookSignOut()">Log out</div>
									   <div id="go_logout_div" class="topAccOptList" onClick="googleSignOut()">Log out</div>
									 </div>
									<div id="all_ac_forms" style="display:none">
									  <form id="master_account" action="gotoaccountmenu" method="post">
									  </form>
									</div>
								   </li>
							   </ul>
							</li>
						</ul>
					  </div>
					</td>
				 </tr>
		   	</table>				
	    </div>
	</div>
</div>	
<div id="adm_upload_images_btn">Upload Draw Images</div>
</body>
</html>