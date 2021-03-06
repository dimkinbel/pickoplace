<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
<!DOCTYPE html >
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript">
		var pagetype = 'create_new_place';
	</script>
	<script type="text/javascript" src="/js/jquery-1.11.1.min.js"></script>
	<link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css" type="text/css">
	<script type="text/javascript" src="/js/bootstrap/bootstrap.min.js"></script>
	<link rel="icon"  type="image/png"  href="img/pplogomarker.png">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
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
	$("#buisnessName,#branchName").keyup(function() {
		validateName();
	});
});
function validateName() {
	var name = $("#buisnessName").val();
	var branch = $("#branchName").val();
	if(name != "" && branch != "") {
		$("#bstartNext").removeClass("disabled_next_button");
		$("#bstartNext").addClass("tourButton");
		$("#bstartNext").attr("onclick","ContinueToEdit();");
		return true;
	} else {
		$("#bstartNext").removeClass("tourButton");
		$("#bstartNext").addClass("disabled_next_button");
		$("#bstartNext").removeAttr("onclick");
		return false;
	}
}
var ongoingCreation = false;
function ContinueToEdit() {
	if(validateName() == true) {
		if (ongoingCreation == false) {
			ongoingCreation = true;
			setSessionData(function (result) {
				if (result) {
					var address = document.getElementById('buisnessAddress').value;
					geocoder.geocode({'address': address}, function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {

							var lat = results[0].geometry.location.lat();
							var lng = results[0].geometry.location.lng();
							document.getElementById("address_hidden_lat").setAttribute("value", lat);
							document.getElementById("address_hidden_lng").setAttribute("value", lng);
							$.ajax({
								url: "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + lng + "&timestamp=" + (Math.round((new Date().getTime()) / 1000)).toString() + "&sensor=false&key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k",
							}).done(function (response) {
								//alert(response.rawOffset);
								var offset = response.rawOffset / 3600 + response.dstOffset / 3600;
								document.getElementById("UTCoffcet_hidden").setAttribute("value", offset);
								document.getElementById("timeZoneId").setAttribute("value", response.timeZoneId);
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
<div class="modal fade" id="signup_modal">
	<div class="modal-dialog modal-sm">
		<div class="modal-content signup_modal_content">
			<button type="button" class="close" data-dismiss="modal" id="signup_close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<div id="login_modal_head">Sign up</div>
			<div class="input_with_material"  >
				<input type="text" id="signup_name" class="waiter_login_input login_input_field" placeholder="First Name"  >
				<div class="material-icons login_mat_icon"  >perm_identity</div>
			</div>
			<div class="input_with_material"  >
				<input type="text" id="signup_last_name" class="waiter_login_input login_input_field" placeholder="Last Name"  >
				<div class="material-icons login_mat_icon"  >perm_identity</div>
			</div>
			<div class="input_with_material"  >
				<input type="text" id="signup_email" class="waiter_login_input login_input_field" placeholder="Email"  >
				<div class="material-icons login_mat_icon"  >mail_outline</div>
			</div>
			<div class="input_with_material"  >
				<input type="text" id="signup_password" class="waiter_login_input login_input_field" placeholder="Password"  >
				<div class="material-icons login_mat_icon"  >lock_outline</div>
			</div>
			<div id="terms_of_service_line">
				By signing up, you agree to Pickoplace’s <a href="/policies/Privacy-policy.html" class="policy_href"  target="_blank">Privacy policy</a>,  <a href="/policies/Terms-of-service-policy.html" class="policy_href"  target="_blank">Terms of service</a>, and <a href="/policies/Refund-policy.html" class="policy_href"  target="_blank">Refund policy</a>.
			</div>
			<div id="sign_up_button_wrap">
				<div id="sign_up_request">Sign Up</div>
				<div id="signing_up_request" style="display:none" >Signing...<img src="/img/gif/ajax-loader2.gif" ></div>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
   <div id="page_login_prompt" class="login_prompt stopclick" style="display:none;">
		<div id="login_prompt_wrap" class="stopclick">
		<table id="sign_in_table_" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
		  <tr>
			<td>
			  <div id="google-connect" class="cbtn" onClick="googleSignIn()">
				<div id="gpsi_img_d"><img id="gpsi_img" src="img/new_google_icon.png"/></div>
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
			<tr><td><div class="login_separator"  ><span class="login_separator_or"  >or</span></div></td></tr>
			<tr><td><div class="input_with_material"  >
				<input type="text" id="login_email" class="waiter_login_input login_input_field" placeholder="Email"  >
				<div class="material-icons login_mat_icon"  >mail_outline</div></div></td></tr>
			<tr><td><div class="input_with_material"  >
				<input type="password" id="login_password" class="waiter_login_input login_input_field" placeholder="Password"  >
				<div class="material-icons login_mat_icon"  >lock_outline</div></div></td></tr>
			<tr><td><div class="input_with_material"  >
				<div id="ppuser_login"  >Log In</div>
				<div id="ppuser_login_request" style="display:none" >Log In...<img src="/img/gif/ajax-loader2.gif"  ></div>
			</div></td></tr>
			<tr><td><div class="login_separator"  ></div></td></tr>
			<tr><td>
				<div class="no_account" >Dont have an account ?</div>
				<div id="sign_up_button"  >Sign up</div></td></tr>
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
						<div id="fg_profile_image_wrap">
							<div id="fg_profile_image_inner">
								<img class="fg_profile_img" id="fg_profile_img" src="">
							</div>
						</div>
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
													 <a href="/gotoaccountmenu"><div id="gotoaccountmenu" class="topAccOptList"  >Go to Account</div></a>
													 <a href="/my_bookings.jsp"><div id="gotobookings" class="topAccOptList">My bookings</div></a>
													 <a href="/user_waiter_list.jsp"><div id="gotoadminzone" class="topAccOptList">AdminZone</div></a>
													 <a href="/create_new_place.jsp"><div id="create_new_place_btn"  class="topAccOptList"  >Create New Place</div></a>
												   <div id="fb_logout_div" class="topAccOptList" onClick="facebookSignOut()">Log out</div>
												   <div id="go_logout_div" class="topAccOptList" onClick="googleSignOut()">Log out</div>
													 <div id="pp_logout_div" class="topAccOptList" onClick="logoutAny()">Log out</div>
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
					             </table>
					          </div>					        
					        </td>
					      </tr>
					      <tr><td>

					         <div id="bstartNext" class=" disabled_next_button"  style="display:none">Next ...</div>
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