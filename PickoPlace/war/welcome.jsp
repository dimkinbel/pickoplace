<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import="com.google.appengine.api.users.*"
    import = "com.dimab.pp.dto.UserPlace"
    import = "com.dimab.pp.dto.WelcomePageData"
    import = "java.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
    <script type="text/javascript" src="js/jquery-ui-1.11.4.Autocomplete/jquery-ui.js"></script>
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAcwoHVd5eaZfzTdu3Sto_QkSr9TlmvXYk&libraries=places&&sensor=FALSE">
    </script>
    <script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
    <script type="text/javascript" src="js/loginlogout.js" ></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/sitefunctions.js" ></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/search.js" ></script>
	<script type="text/javascript" src="js/interactive.js" ></script>
	

    <script type="text/javascript" src="js/mainPageMap.js"></script>
    
	<link rel="stylesheet" href="css/browserWrap.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />	
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.4.Autocomplete/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	
	
	<link href="raty/raty.css" media="screen" rel="stylesheet" type="text/css">
    <script src="raty/raty.js" type="text/javascript"></script>
    
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script type="text/javascript">
var geocoder;

function goToDraw(){
	
	location.href = "/drawing.jsp";
}

function goToAccountMenu() {
   setSessionData(function(result) {
	   if(result) {
			  document.getElementById("master_account").submit();
		}
	});
}
var uploadLastcursor = "";
$(document).ready(function() {
	requestLastPlaces(9);
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
		  
	  } else {
		  //Not connected
		  
		  $("#login_prop").show();
		  $("#login_info_resp").hide();
		  $("#account_drop").hide();

		  $("#login_info_resp_d").empty();
		  
		  $("#fb_logout_div").hide();
		  $("#go_logout_div").hide();
		  
	  }
}
$(document).ready(function () { 
    $("#login_prop_d").click(function(){
    	$("#page_login_prompt").show();
    });
    $('#advanced_material_drop').dropit({action: 'click'});
});
$(document).on("click",".stopclick", function (event) {
	    if(event.target.id == "page_login_prompt") {
		  $("#page_login_prompt").hide();
		}
});
 ///
</script>
<title>PickoPlace</title>
</head>

<body style="margin: 0px;" class="main_body">

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

			<div id="header_td_div">
				<div id="header">
					<div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
					<div id="search_header" >
					 <div class="left search_header_text">
					   Place search
					 </div>
         			 <div class="left">

			                 <input  type="text" name="buisnessAddress" id="placeAddressAuto" />
					         <input  id="address_hidden_lat" name="address_hidden_lat" style="display: none;"> 
					         <input  id="address_hidden_lng" name="address_hidden_lng" style="display: none;">
					         <input  id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">

                      </div>
                      <div class="left" style="position:relative">

			                  <input  type="text" name="buisnessName" id="placeSearchName"  placeholder="place name (opt.)"/>
			                  <img id="autocompleteSearchAjax" src="/js/ajax-loader-round.gif" style="display:none"/>

                      </div>
            
                      <div class="left">
                             <div id="search_button">
                                 <div class="material-icons" id="search_material">search</div>
                                 <img id="frame_book_ajax_gif_welcome" src="/js/ajax-loader-round.gif" style="display:none"/>
                             </div>
						     
                      </div>
                      <div class="left" id="advanced_proposal">
                          <ul id="advanced_material_drop" >
				              <li class="same_height"><a href="#" class="material-icons advanced_material" style="text-decoration: none">keyboard_arrow_down</a>
						        <ul class="advanced_material_dropit">
							        <li>
										<div id="advanced_button">Serach options</div>
									</li>
								</ul>
							 </li>
						  </ul>
                      </div>
                    </div>
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
												   <div id="dotoadminzone" class="topAccOptList">AdminZone</div>
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
				<div id="additional_search_wrap" style=" height:0px;">
				  <div id="additional_search_inner" style="display:none">
				   <div class="add_search_close material-icons" id="asc_left">keyboard_arrow_up</div>
				   <div id="radius_wrap" >
				     <div class="sesed">Search radius</div>
				     <div id="slider_wrap_acom" class="left" style="height:24px;" >
							      <div id="range_distanse_slider"  ></div>
					 </div>
					 <div id="distanceval" class=""></div>
				   </div>
				   <div class="add_search_close material-icons" id="asc_right">keyboard_arrow_up</div>	
				  </div>			   
				</div>
			</div>
            <div id="main_wrap_">
			  <div id="main_container" class="main_container"> 

			         <div id="mainLastResults" >
			           
			           
			         </div>
			
				</div>
			<div id="map_absolute">
				<div id="main_map_wrap_" >
					       <div id="main_map" style="width:100%;height:100%;"></div>
				</div>
				
			</div>
			<div id="welcome-load-more"><div id="load_more-text">LOAD MORE</div>
			    <img id="welcome_loader" src="js/fr_load.gif" style="position: relative; margin-top: 5px;display:none"/>
			</div>

           </div>

</body>
</html>