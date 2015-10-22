<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import="com.google.appengine.api.users.*"
    import = "java.util.*"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
     <script type="text/javascript" src="js/loginlogout.js" ></script>
     
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/sitefunctions.js" ></script>
	<script type="text/javascript" src="js/jquery.slimscroll.min.js" ></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/updateData_sb.js" ></script>
	
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	
	<link href="raty/raty.css" media="screen" rel="stylesheet" type="text/css">
    <script src="raty/raty.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/rating.js" ></script>
	<link rel="stylesheet" href="css/rating.css" type="text/css" media="screen" />
<script type="text/javascript">

function goToAccountMenu() {
	setSessionData(function(result) {
		   if(result) {
	          document.getElementById("master_account").submit();
		   }
     });
}
var currently_loaded_future = 0;
var currently_loaded_past = 0;
function goToCreatePlace() {
	location.href = "/create_new_place.jsp";
}
function loadFuture(num) {
	var ClientBookingHistoryRequestDTOfuture = {};
	ClientBookingHistoryRequestDTOfuture.clientID = "";
	ClientBookingHistoryRequestDTOfuture.fromNum = currently_loaded_future;
	ClientBookingHistoryRequestDTOfuture.maxBookings = num;
	ClientBookingHistoryRequestDTOfuture.future = true;
	var bookingjson = {bookingHistory:JSON.stringify(ClientBookingHistoryRequestDTOfuture)};
	$.ajax({
	    url : "/clientBookingHistory",
	    data: bookingjson,//
	    beforeSend: function () { $("#sb_ajax_gif_future").show(); },
	    success : function(data){
	    	if(data.logged==true) {
		      $("#sb_ajax_gif_future").hide();
		  	  console.log("Future Success");
		  	  console.log(data);
			  updateBookings("next_bookings_div",data,true);
		    } else {
		    	location.href = "/";
		    }
	    },
	    dataType : "JSON",
	    type : "post"
	});
}
function loadPast(num) {
	var ClientBookingHistoryRequestDTOpast = {};
	ClientBookingHistoryRequestDTOpast.clientID = "";
	ClientBookingHistoryRequestDTOpast.fromNum = currently_loaded_past;
	ClientBookingHistoryRequestDTOpast.maxBookings = num;
	ClientBookingHistoryRequestDTOpast.future = false;
	var bookingjson = {bookingHistory:JSON.stringify(ClientBookingHistoryRequestDTOpast)};
	$.ajax({
	    url : "/clientBookingHistory",
	    data: bookingjson,//
	    beforeSend: function () { $("#sb_ajax_gif_past").show(); },
	    success : function(data){
	      if(data.logged==true) {
	    	 $("#sb_ajax_gif_past").hide();
	    	console.log("Past Success");
	    	console.log(data);
			updateBookings("past_bookings_div",data,false);
	      } else {
		    	location.href = "/";
		    }
	    },
	    dataType : "JSON",
	    type : "post"
	});
}
$(document).ready(function() {
    //$('.menu_drop_sb').dropit();
	//loadFuture(10);
	//loadPast(10);

});
//LOGIN SUCCESS UPDATE
function updatePageView() {
	  if(fconnected==true) {
		  //Connected To Facebook
		  $("#page_login_prompt").hide();
		  $("#login_prop_d").hide();		  
		  $("#account_drop").show();
		  
		  $("#login_info_resp_d").empty();
		  $("#login_info_resp_d").html(fudata.first_name);
		  $("#login_info_resp").show();
		  
		  $("#fb_logout_div").show();
		  $("#go_logout_div").hide();
		  $('#facebook_img').attr('src',"http://graph.facebook.com/" + fudata.id + "/picture");
		  $("#facebook_image_wrap").show();
		  setSessionData(function(result) {
			   if(result) {
				  loadFuture(10);
				  loadPast(10);
			   }
		  });
	  } else if (gconnected==true) {
		  //Connected To Google
		  $("#page_login_prompt").hide();
		  $("#login_prop_d").hide();		  
		  $("#account_drop").show();
		  
		  $("#login_info_resp_d").empty();
		  $("#login_info_resp_d").html(gudata.name.givenName);
		  $("#login_info_resp").show();
		  
		  $("#fb_logout_div").hide();
		  $("#go_logout_div").show();
		  $("#facebook_image_wrap").hide();
		  setSessionData(function(result) {
			   if(result) {
				  loadFuture(10);
				  loadPast(10);	
			  }
		  });
	  } else {
		  //Not connected
		  console.log("update_no_connected");
		  location.href = "/welcome.jsp";
		  
	  }
}
</script>
<title>My Bookings</title>
</head>
<body style="margin: 0px;" >
	<table id="body_table" cellspacing="0" cellpadding="0"
		style="width: 100%; height: 100%; border-collapse: collapse">
		<tr id="header_tr">
			<td id="header_td">
				<div id="header">
					<div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
					<div class="login_in_header_wrap">
						<div id="facebook_image_wrap" >
	                         <div id="facebook_image_inner" >
	                            <img id="facebook_img" src="" >
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
			</td>
		</tr>
		<tr id="content_tr">
		 <td id="content_td">
		 <table id="account_content"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
		   <tr>
		    <td class="left_content_td"></td>
			<td id="content_td_ac">
			  <div class="fp_head" >Next bookings</div>
			  <div class="sb_loading" style="display:none" id="sb_ajax_gif_future"><img class="sb_ajax_gif" src="/js/299.GIF" /></div>
              <div id="next_bookings_div"></div>
              <div class="fp_head" >Past bookings</div>
              <div class="sb_loading" style="display:none" id="sb_ajax_gif_past"><img class="sb_ajax_gif" src="/js/299.GIF" /></div>
              <div id="past_bookings_div">
              </div>
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