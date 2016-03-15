<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import="com.google.appengine.api.users.*"%>
<!DOCTYPE html >
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript">
		var pagetype = 'create_new_place';
	</script>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
    <script type="text/javascript" src="js/loginlogout.js" ></script>
    <script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/sitefunctions.js" ></script>
	<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">
    </script>
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/browserWrap.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
<script type="text/javascript">

function openMoreOptions() {
	var all=document.getElementsByName("moreTableOptions");
    for(var x=0; x < all.length; x++) {
      document.getElementById(all[x].id).style.display = "";
    }
    document.getElementById("moreOptionsSetButton").style.display = "none";
    document.getElementById("moreOptionsSetButton_close").style.display = "";
}
function closeMoreOptions() {
	var all=document.getElementsByName("moreTableOptions");
    for(var x=0; x < all.length; x++) {
      document.getElementById(all[x].id).style.display = "none";
    }
    document.getElementById("moreOptionsSetButton").style.display = "";
    document.getElementById("moreOptionsSetButton_close").style.display = "none";
}
var geocoder;
$(document).ready(function () { 
	geocoder = new google.maps.Geocoder();
    var options = {
  		  types: ['geocode']
  		};
    var place_search = document.getElementById('buisnessAddress');
    var autocomplete = new google.maps.places.Autocomplete(place_search, options);
});
var ongoingCreation = false;
function BuisnessNameNext(debug) {
	if(ongoingCreation==false) {
		ongoingCreation = true;
	setSessionData(function(result) {
		   if(result) {
			 var address = document.getElementById('buisnessAddress').value;
		     geocoder.geocode( { 'address': address}, function(results, status) {
		         if (status == google.maps.GeocoderStatus.OK) {
		
		        	    var lat = results[0].geometry.location.lat();
		        	    var lng = results[0].geometry.location.lng();
		               	document.getElementById("address_hidden_lat").setAttribute("value",lat);
		             	document.getElementById("address_hidden_lng").setAttribute("value",lng);             	
		             	$.ajax({
		             	   url:"https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+lng+"&timestamp="+(Math.round((new Date().getTime())/1000)).toString()+"&sensor=false&key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k",
		             	}).done(function(response){
		             		 //alert(response.rawOffset);
		             		  var offset = response.rawOffset/3600 + response.dstOffset/3600;
		                 	 document.getElementById("UTCoffcet_hidden").setAttribute("value",offset);
		                 	 document.getElementById("timeZoneId").setAttribute("value",response.timeZoneId);
		                     document.getElementById("createPlaceInfo").submit();
		             	});
		         } else {
		           //alert('Geocode was not successful for the following reason: ' + status);
		   		   //   $('#address_validate_message').html('Please enter valid Address');
		 		  //    $('#address_validate_message').slideDown(500);	
		      
		         }
		       }); 
		   } else {
			   updatePageView();
		   }
    });
	}
}


//LOGIN SUCCESS UPDATE

$(document).ready(function () { 

  $("#openLoginPromptIn").click(function(){
  	$("#page_login_prompt").show();
  });

});

///

</script>
<title>PickoPlace</title>
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
	<table id="body_table" cellspacing="0" cellpadding="0"
		style="width: 100%; height: 100%; border-collapse: collapse">
		<tr id="header_tr">
			<td id="header_td">
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
			</td>
		</tr>
		<tr id="content_tr">
			<td id="content_td">
				<div id="container">
				   <form id="createPlaceInfo" name="createPlaceInfo"  action="/createPlaceInfo" method="post">
					<div id="createPLaceMenu">
					    <table id="mainContenttable">
					      <tr class="stagePhrase"><td> Great , Lets Start <br><span class="steps">Step 1:</span>Please set-up your Business information</td></tr>
					      <tr class="setting-row">
					        <td>
					          <div class="SettingsDiv">
					             <table class="buisnessOptionsSet"  cellspacing="1" cellpadding="0"  style="width:100%;">
					              <tr id="buisnessNameTr" class="settingBuisnessVal">
					                <td class="settingPhrase">Buisness Name<span class="required_star">*</span>:</td>
					                <td class="settingValue">
					                   <input  type="text" name="buisnessName" id="buisnessName" class="setValInp"/>
					                </td>
					              </tr>
					              <tr id="buisnessBranchNameTr" class="settingBuisnessVal">
					                <td class="settingPhrase">Branch Name<span class="required_star">*</span>:</td>
					                <td class="settingValue">
					                   <input  type="text" name="branchName" id="branchName" class="setValInp"/>
					                </td>
					              </tr>
					              <tr id="buisnessAddressTr" class="settingBuisnessVal">
					                <td class="settingPhrase">Buisness Address<span class="required_star">*</span>:</td>
					                <td class="settingValue">
					                   <input  type="text" name="buisnessAddress" id="buisnessAddress" class="setValInp"/>
					                    <input  id="address_hidden_lat" name="address_hidden_lat" style="display: none;"> 
					                    <input  id="address_hidden_lng" name="address_hidden_lng" style="display: none;">
					                    <input  id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">
					                    <input  id="timeZoneId" name="timeZoneId" style="display: none;">
									    <p id="address_validate_message" style="display:none;"></p>
					                </td>
					              </tr>
					              <tr class="moreTableDivider" name="moreTableOptions" id="md1" style="display:none"><td colspan="2">more options</td></tr>
					              <tr  name="moreTableOptions" id="pr1" class="moreOptionsClass" style="display:none">
						                <td class="settingPhrase">Phone:</td>
					                <td class="settingValue">
					                   <input  type="text" name="buisnessPhone" id="buisnessPhone" class="setValInp"/>
					                </td>				                
					              </tr>
					              <tr  name="moreTableOptions" id="pr2" class="moreOptionsClass" style="display:none">
						                <td class="settingPhrase">Fax:</td>
					                <td class="settingValue">
					                   <input  type="text" name="buisnessFax" id="buisnessFax" class="setValInp"/>
					                </td>				                
					              </tr>
					              <tr id="bsMoreOptions" >
					                <td colspan="2">
					                  <div id="moreOptionsSetButton" onclick="openMoreOptions()" style="display:">More Options</div>
					                  <div id="moreOptionsSetButton_close" onclick="closeMoreOptions()" style="display:none">Close Options</div>
					                </td>
					              </tr>
					             </table>
					          </div>					        
					        </td>
					      </tr>
					      <tr><td>
					         <div id="bstartNext" class="tourButton" onclick="BuisnessNameNext('true')" style="display:none">Next ...</div>
					         <div class="tourButton" id="openLoginPromptIn"  style="display:none">Please Log in</div>
					       </td>
					       </tr>
					    </table>
					</div>
					</form>
				</div>
			</td>
		</tr>
		<tr id="footer_tr">
			<td id="footer_td">
				<div id="footer" style="display: none">Belousov Dmitry</div>
			</td>
		</tr>
	</table>

</body>
</html>