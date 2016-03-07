<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import="com.dimab.pp.dto.UserAccountData"
    import="com.dimab.pp.dto.UserPlace"
    import = "java.util.*"%>
<!DOCTYPE html>
<html >
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript">
		var pagetype = 'user_account';
	</script>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
    <script type="text/javascript" src="js/loginlogout.js" ></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/sitefunctions.js" ></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
<script type="text/javascript">

function SIDeleteConfirm(){
	setSessionData(function(result) {
		   if(result) {
			   DeleteConfirm();
			} else {
				updatePageView();
			}
		});
}
function SIPlaceConfiguration(placeID){
	setSessionData(function(result) {
		   if(result) {
			   PlaceConfiguration(placeID);
			} else {
				updatePageView();
			}
		});
}
function iframeEdit(placeID_form) {
	   setSessionData(function(result) {
		   if(result) {
				document.getElementById(placeID_form).submit();
		   }
   	 });
  }
function editPlace(placeID_form) {
	document.getElementById(placeID_form).submit();
}
function PlaceConfiguration(placeID) {
	   var formid = placeID + "_config_form";
	   document.getElementById(formid).submit();
}
function DeletePlaceConfirm(placeID) {
	   document.getElementById("delete_place_input").value = placeID;
	   document.getElementById("delete_place_prompt").style.display = "";
}

function DeleteConfirm() {
	var placeid = document.getElementById("delete_place_input").value;
    var json = {placeid:placeid};
    
	document.getElementById("delete_place_input").value = "";
	document.getElementById("delete_place_prompt").style.display = "none";
	  
	  $.ajax({
	      url : "/deletePlace",
	      data: json,//
	      success : function(data){
	    	  if(data.removed=="removed") {
	    		  goToAccountMenu();
	    	  } else if(data.removed=="not_allowed") {
	    		  alert("You're not allowed to remove place data");
	    	  } else if(data.removed=="not_logged_in"){
	    		  location.href = "/";
	    	  } else {
	    		  alert("Server error accured - please try again");
	    	  }
	      },
	      dataType : "JSON",
	      type : "post"
	  });
	 
}
function DeleteCancel() {
	   document.getElementById("delete_place_input").value = "";
	   document.getElementById("delete_place_prompt").style.display = "none";
}

</script>
<title>PickoPlace</title>
</head>
<body style="margin: 0px;" >
   <div  id="delete_place_prompt"  class="save_prompt" style="display:none;">
     <div class="config_save_prompt_inner" >
        <table id="config_save_prompt_tbl" cellspacing="0" cellpadding="0" style="width:100%;height: 100%;min-;border-collapse:collapse">
          <tr><td colspan=2 class="confirm_message">Delete Place ?</td></tr>
          <tr>
            <td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_yes" onclick="SIDeleteConfirm()">Delete</div></td>
            <td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_no" onclick="DeleteCancel()">Cancel</div></td>
          </tr>
        </table>
             <input name="placeIDvalue" id="delete_place_input"  style="display:none">
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
		 <table id="account_content"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
		   <tr>
		    <td class="left_content_td"></td>
			<td id="content_td_ac">
			    <div class="pageContentHeaderText">Account</div>
				<table id="user_account_list_table"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
				   <tr class="ua_table_header"><td>Your objects</td></tr>
				   <%
				      UserAccountData accountObjectToJSP = (UserAccountData) request.getAttribute("userPlaces");
				      List<UserPlace> places = accountObjectToJSP.getPlaces();
				      for (UserPlace userPlace: places) {
				    	 String PlaceID = userPlace.getPlaceID();
				    	 String placeName= userPlace.getPlace();
				    	 String branchName = userPlace.getBranch();
				    	 String Address = userPlace.getAddress();
				    	 Double Lat = userPlace.getLat();
				    	 Double Lng = userPlace.getLng();
				    	 String overviewURL = userPlace.getOverviewCloudURL();
				    	 int objectsCount = userPlace.getShapesCount();
				    	  %>
				    	    <tr class="singlePlaceRow">
				    	      <td>
				    	         <div class="hiddenPlaceData">
				    	           <input id="addressLat_<%=PlaceID%>" name="addressLat" value="<%=Lat %>"/>
				    	           <input id="addressLng_<%=PlaceID%>" name="addressLng" value="<%=Lat %>"/>
				    	         </div>
				    	         <table class="PlaceDetailsTable"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
				    	            <tr class="mainPlaceDetailsTable">
				    	              <td class="overviewImage_td">
				    	                 <img class="overviewAccImage" src="<%=overviewURL %>"/>
				    	              </td>
				    	              <td class="placeDetailsTD">
				    	                <table class="placeValuesTable"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
				    	                  <tr >
				    	                    <td class="PdetailName"><div class="PdetailName_div">Place Name</div></td>
				    	                    <td class="PdetailValue"><div class="PdetailValue_div"><%=placeName %></div></td>
				    	                  </tr>
				    	                  <tr >
				    	                    <td class="PdetailName"><div class="PdetailName_div">Branch Name</div></td>
				    	                    <td class="PdetailValue"><div class="PdetailValue_div"><%=branchName %></div></td>
				    	                  </tr>
				    	                  <tr >
				    	                    <td class="PdetailName"><div class="PdetailName_div">Address</div></td>
				    	                    <td class="PdetailValue"><div class="PdetailValue_div"><%=Address %> (<%=Lat%>,<%=Lng %>)</div></td>
				    	                  </tr>
				    	                  <tr >
				    	                    <td class="PdetailName"><div class="PdetailName_div">Shapes Count</div></td>
				    	                    <td class="PdetailValue"><div class="PdetailValue_div"><%=objectsCount %></div></td>
				    	                  </tr>
				    	                  <tr >
				    	                    <td class="PdetailName"><div class="PdetailName_div">Floors Count</div></td>
				    	                    <td class="PdetailValue"><div class="PdetailValue_div"><%=userPlace.getFloors() %></div></td>
				    	                  </tr>
				    	                  <tr >
				    	                    <td colspan="2">
				    	                      <table class="PlaceButtons"   cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
				    	                        <tr>
                                                  <td><div class="editPlaceButtonUA" style="color:black" onclick="editPlace('<%=PlaceID%>_editform')">Edit Place</div>
                                                  <div class="editPlaceButtonUA" style="color:black"  onclick="SIPlaceConfiguration('<%=PlaceID%>')">Configuration</div>
                                                  <div class="editPlaceButtonUA" style="color:black"  onclick="iframeEdit('<%=PlaceID%>_iframeform')">iFrame Editor</div>
                                                  <div class="editPlaceButtonUA" style="color:red"  onclick="DeletePlaceConfirm('<%=PlaceID%>')">Delete Place</div></td>
                                                </tr>
				    	                       </table>
				    	                       <div class="hiddenPlaceData">
				    	                        <form id="<%=PlaceID%>_editform"  action="editplacefromAccount" method="post">
				    	                          <input name="placeIDvalue" value="<%=PlaceID%>">
				    	                        </form>
				    	                        <form id="<%=PlaceID%>_config_form"  action="placeConfiguration" method="post" style="display:none">
                                                  <input name="placeIDvalue" value="<%=PlaceID%>">
                                                </form>
												<form id="<%=PlaceID%>_iframeform"  action="editIFrame" method="post" style="display:none">
																    	                          <input name="placeIDvalue" id="placeIDvalue" value="<%=PlaceID%>">
																    	                          <input name="iFIDvalue" id="iFIDvalue" value="">
												</form>
				    	                       </div>
				    	                    </td>
				    	                  </tr>
				    	                </table>
				    	              </td>			    	            
				    	            </tr>
				    	         </table>
				    	      </td>
				    	    </tr>
				    	  <%
				      }
				   %>
				</table>
			</td>
		  </tr>
		  </table>
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