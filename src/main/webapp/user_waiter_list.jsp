<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
%>
<!DOCTYPE html>
<html >
<head>
    <%-- meta --%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>PP waiter List</title>
    <script type="text/javascript">
        var pagetype = 'waiter_list';
    </script>

    <%-- css --%>
    <link rel="stylesheet" href="/css/style.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="/css/style2.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="/css/login.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="/css/dropit.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="/js/lib/jquery-ui-1.11.4/jquery-ui.css" type="text/css" media="screen">

    <%-- js --%>
    <script type="text/javascript" src="/js/lib/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="/js/lib/jquery-plugins/jquery-migrate-1.2.1.js"></script>
    <script type="text/javascript" src="/js/loginlogout.js"></script>
    <script type="text/javascript" src="/js/lib/bootstrap-plugins/bootstrap-slider.js"></script>
    <script type="text/javascript" src="/js/sitefunctions.js"></script>

    <script type="text/javascript" src="/js/lib/jquery-plugins/jquery.slimscroll.min.js"></script>
    <script type="text/javascript" src="/js/lib/jquery-plugins/dropit.js"></script>
    <script type="text/javascript" src="/js/updateData_wl.js"></script>
    <script type="text/javascript" src="/js/lib/moment/moment.min.js"></script>
    <script type="text/javascript" src="/js/lib/jquery-ui-1.11.4/jquery-ui.js"></script>

    <%-- custom js--%>
<script type="text/javascript">
function updateWaiterList(){
	$.ajax({
	    url : "/loadWaiterList",
	    beforeSend: function () { $("#sb_ajax_gif_future").show(); },
	    success : function(data){
	    	 $("#sb_ajax_gif_future").hide();
	    	
	    	if(data.status=="success") {
	    		console.log("Waiter Success");
		    	console.log(data.waiterPlaces);
		    	updateWList(data.waiterPlaces);
	    	  } else if(data.status=="no_places") {
	    		  alert("You have no available places for booking admin");
	    	  } else if(data.status=="not_logged") {
	    		  location.href = "/";
	    	  } else {
	    		  alert("Server error accured - please try again");
	    	  }
	    },
	    dataType : "JSON",
	    type : "post"
	}); 
}
</script>
</head>

<body style="margin: 0px;" >
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
			  <div class="fp_head" >Places available</div>
			  <div class="sb_loading" style="display:none" id="sb_ajax_gif_future"><img class="sb_ajax_gif" src="img/gif/299.GIF" /></div>
              
              <div id="waiter_wrap_list">
              
              </div>
              <form id="waiter_submit_form"  action="waiterAccess" method="post" style="display:none">
                 <input name="placeIDvalue" id="sw_form_placeIDvalue" value="">
                 <input name="bookrequest" id="sw_form_bookrequest" value="">
              </form>
             <div style="display:none">
                 <input id="datepicker" type="text" />
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