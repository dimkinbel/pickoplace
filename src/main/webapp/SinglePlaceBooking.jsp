<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import = "com.dimab.pp.dto.*"
    import="com.google.appengine.api.users.*"
    import = "com.google.gson.Gson"
    import = "com.google.gson.reflect.TypeToken"
    import = "java.util.*"
    import = "java.lang.reflect.Type"%>
<!DOCTYPE html>

<html style="height:100%">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Booking</title>
	  <script type="text/javascript">
		  var pagetype = 'place_booking';
	  </script>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/loginlogout.js" ></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/colpick.js" ></script>
    <script type="text/javascript" src="js/shapes_ub.js"></script>
    <script type="text/javascript" src="js/shapes_timeline.js"></script>
	<script type="text/javascript" src="js/printlog_ub.js"></script>
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
    <script type="text/javascript" src="js/updateData_ub.js"></script>
    <script type="text/javascript" src="js/bookingOptions_ub.js"></script>
    <script type="text/javascript" src="js/wl_menu_ub.js"></script>
    <script type="text/javascript" src="js/interactive_ub.js"></script>
    
	<script type="text/javascript" src="js/userBooking.js"></script>
	<script type="text/javascript" src="js/moment.min.js"></script>
	<script type="text/javascript" src="js/jquery.slimscroll.min.js" ></script>
	
    <link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/book_approval.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	
	<link href="raty/raty.css" media="screen" rel="stylesheet" type="text/css">
    <script src="raty/raty.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/rating.js" ></script>
	<link rel="stylesheet" href="css/rating.css" type="text/css" media="screen" />
	
	<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinModern.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">
    </script>
    <script type="text/javascript" src="js/maps_google.js"></script>
	<script type="text/javascript" src="js/updateCanvasData.js"></script>
	<script type="text/javascript">
	
		var canvasMouseOut = false;
		var canvasMouseDown = false;
	
		window.addEventListener('mouseup', function(e) {
		   if(canvasMouseOut==true) {
		     canvas_.mouseUpEvent();
			 canvasMouseOut = false;
		   }
		});
		window.addEventListener('mousemove', function(e) {
		  if(canvasMouseOut==true) {
		     canvas_.mouseMoveEvent(e);
		   }
		});
		
       if(typeof document.onselectstart!="undefined") {
	       document.onselectstart = new Function ("return false");
	   } else {
	       document.onmousedown = new Function ("return false");
		   document.onmouseup = new Function ("return true");
	   }

       var canvast=[];
       var canvasStateJSON;
	   var bookingVars = {};
	   var tcanvas_ = {};
	   var currentSliderValue;
	   var placeUTCOffsetGlobal;     
       var positionmanager = {};
       var days_ = 1;
       $(document).ready(function() {
    	   "use strict";
    	 // Update canvases background

		updateCanvasData();
     	requestBookingAvailability();
 		tcanvas_= new  TCanvasState(document.getElementById("tcanvas"));
 		
 		updatePageDimentions();
 		updatePlaceInfo();
 		initialTCanvas();
       });
       function openMap() {
    	   document.getElementById("map_wrapper").style.display="";
    	   var lat = document.getElementById("server_Lat").value;
   		   var lng = document.getElementById("server_Lng").value;  
   		   initialize(lat,lng);
    	   $(function(){							
				var $win = $("#map_wrapper"); // or $box parent container
				var $box = $("#map_popup_content");
				 $win.on("click.Bst", function(event){		
					if ( $box.has(event.target).length == 0 //checks if descendants of $box was clicked
	                           &&
	                    !$box.is(event.target) //checks if the $box itself was clicked
	                 ){
						document.getElementById("map_wrapper").style.display="none"; 
					} else {}
				});
	       });
       }
       function closeMap(){
    	   document.getElementById("map_wrapper").style.display="none";
       }

	</script>
<script type="text/javascript">
//LOGIN SUCCESS UPDATE
var phonerequired = true;

$(document).on("click",".stopclick", function (event) {
    if(event.target.id == "page_login_prompt") {
    	if(gconnected==false && fconnected==false && phoneflow==true) {
    		if(auth2.isSignedIn.wc) {
    			// Connected with Google
    			googleSignOut();
    		} else if(FB.getUserID() != "") {
    			// Connected with FB
    			facebookSignOut();
    		}
    	}
    	phoneflow=false;
    	$("#sign_in_table_").show();
		//result.userData.first_name for FB
		$("#user_name_at_phone").html("");
		$("#send_sms_ajax").hide(); 
		$("#send_sms_complete").hide();
		$("#send_sms").show(); 
		$("#verification_code").val("");
		$("#verification_code").prop("readonly",true);
		$("#verification_submit_inactive").show();
		$("#verification_submit").hide();
		$("#smsa_loader").hide(); 
		$("#phone_wrap_table").hide();
	    $("#page_login_prompt").hide();
	}
});

function applyBookingPre() {
	displayBookingRequest();
	if(bookingRequestWrap.bookingList.length > 0) {
		$("#book_confirm_wrap").show();
	} else {
	      $("#book_confirm_wrap").html("");
	      $("#book_confirm_wrap").hide();
	}
}
function SIapplyBooking() {
	setSessionData(function(result) {
		   if(result) {
			   applyBooking();
			   $("#page_login_prompt").hide();
		   } else {
			   updatePageView();
		   }
  });
}
 ///
</script>
  </head>

<body  style="margin: 0px;height:100%;position:relative;">
	<div id="popup_message_wrap" style="display:none">
	    <div id="popup_message" >
	        <div id="message_data"></div>
	        <div id="close_popup_message" class="material-icons popup_close" id="close_pop_icon">clear</div>
	    </div>
	</div>
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
		<table id="phone_wrap_table" cellspacing="0" cellpadding="0" style=" border-collapse: collapse;display:none">
		    <tr>
			    <td>
			      <span class="login_phone_top">Hello, <span id="user_name_at_phone">User</span>. This is your first login.<br> Please provide phone number</span>
			    </td>
		    </tr>
		    <tr>
			    <td class="ph_pad_top">
			         <div id="phoneinputwrap">
	                    <input id="mobile-number" type="tel" autocomplete="off" placeholder="050-123-4567">
	                  </div>
			    </td>		    
		   </tr>
		    <tr id="send_sms_tr">
			    <td id="send_sms_td" class="ph_pad_top">
			      <div id="send_sms">
	                  <i class="material-icons textsms">textsms</i><span class="sendsmstext">Send SMS</span>
	              </div>
	              <div id="send_sms_ajax" style="display:none">
	                  <i class="material-icons textsms">textsms</i><span class="sendsmstext">SENDING...</span>
	              </div>
	              <div id="send_sms_complete"  style="display:none">
	                  Enter verification code below, or <div id="phone_resend_open">resend</div>
	              </div>
			    </td>		    
		   </tr>
		   <tr id="phoneInstructions">
		     <td>
		       <div id="phone_instructions" >You will receive SMS with verification code</div>
		     </td>
		   </tr>
		   <tr id="verification_code_line">
		     <td class="ph_pad_top ph_pad_bot"><!-- $("#verification_code").prop("readonly",true); -->
		       <input type="number" id="verification_code" readonly/><div id="verification_submit" style="display:none">SUBMIT</div>
		       <div id="verification_submit_inactive">SUBMIT
		         <img id="smsa_loader" src="img/gif/fr_load.gif" style="display:none;">
		       </div>
		     </td>
		   </tr>
		</table>  
		</div>
   </div>
   <div id="map_wrapper"  style="display:none;">
      <div id="map_popup_content">
        <div id="map-canvas"></div>
        <img id="close_map_icon" src="/img/icon-close35.png" onclick="closeMap()"/>
      </div>
   </div>

  <div id="book_confirm_wrap" class="booking_prompt_booking" style="display:none;">
     
  </div>

  <table id="body_table"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
   <tr id="header_tr"><td id="header_td">
    <div id="header">
       <div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
       <div id="header_info_wrap" style="width:100%">
		 <div id="header_info">
		   <table style="border-collapse: collapse;" cellspacing="0" cellpadding="0"  >
			   <tr><td>
				  <div id="header_place_name_"></div>
				  <div id="header_place_address_"></div>
			   </td>
			  </tr>
		   </table>
		</div>
	  </div>
       <div class="login_in_header_wrap">
            <div id="fg_profile_image_wrap" >
                <div id="fg_profile_image_inner" >
                   <img id="fg_profile_img" src="" >
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
   </td></tr>
   <%
   AJAXImagesJSON responseJSON = (AJAXImagesJSON)  request.getAttribute("canvasEditPlace");
   PlaceInfo placeInfo = (PlaceInfo)  request.getAttribute("placeInfo");
   Gson gson = new Gson();
   List<PPSubmitObject> canvasStateList = responseJSON.getFloors();
   List<JsonSID_2_imgID> sid2imgID = responseJSON.getJSONSIDlinks();
   List<JsonImageID_2_GCSurl> imgID2URL = responseJSON.getJSONimageID2url();
   String placeName = responseJSON.getPlace_();
   String placeBranchName = responseJSON.getSnif_();
   String userRandom = responseJSON.getUsernameRandom();
   String placeID = responseJSON.getPlaceID();
   double    placeUTSoffset = responseJSON.getUTCoffset();   
   %>
   <tr id="content_tr"><td id="content_td">
   
    <div id="hiden_values_from_edit" style="display:none">
    <% 
      for (PPSubmitObject floor : canvasStateList) {
    	   String backgroundURL = "";
    	   String overviewURL = "";
    	   String floorid = floor.getFloorid();
    	   CanvasState canvasState = floor.getState();
    	   if(floor.getBackground()!=null && !floor.getBackground().isEmpty()) {
    		   backgroundURL = floor.getBackground();
    	   }  
    	   if(floor.getAllImageSrc()!=null && !floor.getAllImageSrc().isEmpty()) {
    		   overviewURL = floor.getAllImageSrc();
    	   }
    	   
    %>
      <input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState" value='<%=gson.toJson(floor)%>'/>
      <img    id="server_background_<%=floorid %>" name="server_background" src="<%=backgroundURL%>"/>
      <img  id="server_overview_<%=floorid %>" name="server_overview" src="<%=overviewURL%>"/>
      <input type="text" id="server_floor_name_<%=floorid %>" value="<%=floor.getFloor_name() %>"/>
      <canvas id="canvas_tmp_<%=floorid %>"></canvas>
      <%if (floor.isMainfloor()) { %>
      <input type="text" id="main_overview_url_id" value="server_overview_<%=floorid %>"/>
      <%} %>
    <% }%>
          
      <% if (sid2imgID!=null && !sid2imgID.isEmpty()) {%>
      <input type="text" id="server_sid2imgID" value='<%=gson.toJson(sid2imgID)%>'/>
      <%} %>
      <input type="text" id="server_shapes_prebooked" />
      <div id="for_debug"></div>
      <input type="text" id="server_placeName" value='<%=placeName%>'/>
      <input type="text" id="server_placeBranchName" value='<%=placeBranchName%>'/>
      <input type="text" id="server_userRandom" value='<%=userRandom%>'/>
      <input type="text" id="server_placeID" value='<%=placeID%>'/>
      <%if(placeInfo.getPlaceSiteURL()!=null && !placeInfo.getPlaceSiteURL().isEmpty()) {%>
      <input type="text" id="server_place_siteurl" value='<%=placeInfo.getPlaceSiteURL()%>'/>
      <%} %>
      <%if(placeInfo.getPlacePhone()!=null && !placeInfo.getPlacePhone().isEmpty()) {%>
      <input type="text" id="server_place_phone" value='<%=placeInfo.getPlacePhone()%>'/>
      <%} %>
      <%if(placeInfo.getPlaceMail()!=null && !placeInfo.getPlaceMail().isEmpty()) {%>
      <input type="text" id="server_place_mail" value='<%=placeInfo.getPlaceMail()%>'/>
      <%} %>
      <%if(placeInfo.getRating()!=null) {%>
      <input type="text" id="server_place_rating" value='<%=placeInfo.getRating()%>'/>
      <%} %>
      <input type="text" id="server_placeUTC" value='<%=placeUTSoffset%>'/>
      <input type="text" id="server_Address" value='<%= request.getAttribute("placeAddress")%>'/>
      <input type="text" id="server_Lat" value='<%=request.getAttribute("placeLat")%>'/>
      <input type="text" id="server_Lng" value='<%=request.getAttribute("placeLng")%>'/>

      <img  id="server_main_logo" src="/img/pp.png"/>
      <img  id="server_v_logo" src="/img/vlogo2.png"/>
      <img  id="server_passed_back" src="/img/back_passed.png"/>
      <img  id="server_clock20" src="/img/clock20.png"/>
       <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
    	  for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>    
        <img id="server_<%=img2url.getImageID() %>" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
      <%} 
      }%>
      
      
   	 <div id="hidden_views" style="display:none">
			 <div id="top_view_div" style="display:none" >
							<div id="canvas_td" class="mr10">
							   <div id="floor_selector_div">
							      <select    id="floor__selector">			   					 
							      </select>												 
							  </div>
							   <div id="zoom_options_book">

									<div id="plus_minus_wrap">
										   <div id="zoom_plus_div" onclick="sizeUp()" title="Zoom-In">+</div>
				                           <div id="zoom_split"></div>
										   <div id="zoom_minus_div"  onclick="sizeDown()"  title="Zoom-Out">-</div>
						            </div>
						            <div id="zoom_reset_div" onclick="zoomResetWrap(canvas_,600,400)"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>
										
								 </div>
							   <div id="canvas_wrap_not_scroll_conf" >							    
								    <% 
								      for (PPSubmitObject floor : canvasStateList) {
								    	   String floorid = floor.getFloorid();
								    	   String display="none";
								    	   if(floor.isMainfloor()) {display="";}
								    	   %>
								    	     <div id="div_wrap-canvas_<%=floorid%>" style="display:<%=display%>"  class="canvas_floor_wrap">
											  <canvas id="canvas_<%=floorid%>" width="400" height="400"  tabindex='1' class="cmenu2 main_conf" >
												This text is displayed if your browser does not support HTML5 Canvas.
											  </canvas>
											 </div>
								   <%} %>								
							   </div>
							</div>

			 </div>		   
		</div>
	  <div id="from_server_data" style="display:none">
	 	 <div id="user_uploaded_images" style="display:none">
		    <!-- Here uploaded images will be added -->
		  </div>
		  <div id="prev_used_images" style="display:none">
		    <!-- Here uploaded images will be added -->
		  </div>
		  <img id="temp_image_for_canvas_creation" style="display:none">
		  <canvas  width="200" height="200" id="translated_user_images_canvas" style="display:none"></canvas>
		  <div id="bg_default_img_mirror" style="display:none">
		    <canvas id="default_img_canvas"></canvas>
		    <img id="default_bg_image_mirror"/>
		 </div>
		 <div id="canvas_shapes_images" style="display:none;"></div>
	 	 <div class="size_value"><input id="canvas_w" type="text"  value="400"/></div>
		 <div class="size_value"><input id="canvas_h" type="text"  value="400"/></div>
		 <div id="history_images_wrapper"></div>
		 <canvas id = "text_width_calculation_canvas"  width="10" height="10"  style="display:none"></canvas>
	 </div>
	<div class="outer_width100" >
				   <div class="creatingTourText" style="display:none">
	        	      <span class="steps"></span> Booking : <span class="placeNamespan">       	          
	        	        '<%=placeName %>' ,<%=placeBranchName %>'
	        	      </span>       	      
	               </div>
	                <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
	        	    <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
	        	    <input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeID %>' style="display:none"/>       	  
		</div>
		<div id = "right_col_ub" style="display:none">
				 <div id="right_col_scroll">
					<div class="chosed_img " >
						<div class="dummy"></div>
							<div class="img-container">
								 <img id="chosed_background">
						</div>
					</div>
					<div id="chosed_background_orig_wrap" style="display:none">
							       <img id="chosed_background_orig" style="display:none"/>
					</div>
					<div class="chosed_img " >
						<div class="dummy"></div>
						<div class="img-container">
							  <img id="chosed_image"/>
						</div>
					</div>
					<img id="mirror" style="display:none"/>
					<div class="chosed_canvas chosed_img" ><canvas id="show_canvas" width="150" height="150" ></canvas></div>
				</div>
		 </div>
    </div>
    <div id="container_ub">
         <div id="temp_appends" style="height:400px;width:400px;position:absolute;left:-2000px;top:-300px;"></div>
		 <div id="booking_header">
		   <div class="page_topic">Booking:</div>
		   <div id="topic_place_name"></div>
		   <div id="topic_address" onclick="openMap()"></div>
		 </div>	 

	 <table class="threecolumncontent" cellspacing="0" cellpadding="0" style="width: 100%;  border-collapse: collapse">
	    <tr>
	        <td id="left_column_content" style="width:0%">
	        
	        </td>
			<td id="center_column_content" style="width:50%">
			  
			   <div id="content_top_left_cell"  class="canvas_append_wrap_ub"></div>
             
             
              <div id="local_live_time_div" style="display:none"></div>
			</td>
            <td id="right_column_content"  style="width:50%;position:relative;vertical-align:top;">	
			  <div id="bookings_ub_wrap_main" style="position:relative;">
			    <div class="booking_pr_header">ORDER FORM</div>
				    <div id="bookings_fe_wrap"  class="bookings_ub_wrap">
					  <table id="main_fe_book_tbl" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
					   <tr style="height:48px;">
					     <td>
						 <div class="orange_color__">
						    <table id="booking_data_table" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
							  <tr id="top_names_feb">
							     	 <td rowspan="2" style="vertical-align: top;">
                                         <div id="dateshaddow"><div class="material-icons" id="calendar_book_icon">event</div><input id="datepicker_fe" type="text" />
	                                        <div id="ot_days_wrap" >
											  <div id="days_text">Days to show:</div>
											  <div id="single_days" class="days_count_selected" onclick="setDays(1)">1</div>
											  <div id="two_days" onclick="setDays(2)">2</div>  
											</div>
                                         </div>                             
                                      </td>
									<td class="fe_top_v"  ><div class="book_request_text_fe" > Book time </div></td>
																 
									<td class="book_btn_td" rowspan="2" id="buttons_book_col">
									 	<div id="place_order_button" class="blue_e_button marginhor2" onclick="applyBookingPre()" style="display:initial">BOOK</div>
							            <div id="place_order_button_invalid" class="blue_e_button_invalid marginhor2" style="display:none"></div>
							            <img id="frame_book_ajax_gif" src="img/gif/ajax-loader-round.gif" style="display:none"/>
									</td>
							  </tr>
							  <tr id="book_fe_values">
                                      
                                      <td id="book_time_selected">
                                         <div id="user_time_from_slider">
										   <table class="uservisibletimet" cellspacing="0" cellpadding="0" style="border-collapse: collapse">
										     <tr>
											   <td id="main_from_"></td>
											   <td id="main_dilim_">-</td>
											   <td id="main_to_"></td>
											 </tr>
											 <tr>
											   <td id="opt_from_date_"><div id="opt_from_date_norm"></div></td>
											   <td></td>
											   <td id="opt_to_date_"><div id="opt_to_date_norm"></div></td>
											 </tr>
										   </table>
										 </div>
                                      </td>							  
							  </tr>
							 </table>
							</div>
						  </td>
						  </tr>
							  <tr >
							    <td id="feb_slider_column" >
								  <table cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">

									 <tr id="feb_tcanvas_row">
									   <td  id="tcanvas_wrap_append">
									     <div id="tcanvas_div" style="width:384px;height:30px">
									       <canvas id="tcanvas" width="384" height="30" ></canvas>
										   
										 </div>
										 
									   </td>
									 </tr>
									<tr  >
									   <td>
									     <div id="slider_wrap_fe" style="height:10px;" >
							                <div id="booking_time_slider_for_canvas_fe"  ></div>
											 <div id="from_margin_div" style="display:none"></div>
											 <div id="inner_margin_div"  style="display:none"></div>
											 <div id="to_margin_div"  style="display:none"></div>
											
										  </div>
									   </td>
									 </tr>
								  </table>
								</td> 
							  </tr>
							  <tr><td>
							   
							   <div class="selected_count">
							         <div id="places_count_wrap" class="fleft">
								       <div class="material-icons place_icon_book fleft" title="Places selected">store</div>
									   <div id="selected_num" class="fleft">0</div></div>
							        <div id="persons_wrap" title="Persons" class="fleft"><div class="material-icons person_icon_book fleft">person</div>
							           <input class="booking_spinner fleft"  id="booking_shape_num_persons"/></div>
							    </div>
							  </td></tr>
							  <tr id="selected_s_row">
							    <td id="selected_s_td" >		
                                    <div id="left_triangle_btn" style="display:none">&#9664;</div>								
									  <div id="selected_outer">
									   
									    <div id="selected_left_tops" ></div>
										<div id="selected_left_bots" ></div>
									    <div id="selected_append_wrap" > 
										    <div id="selected_append" > 
										   
										    </div>
										</div>
										<div id="selected_right_tops" ></div>
										<div id="selected_right_bots" ></div>
										
									 </div>
									 <div id="right_triangle_btn" style="display:none">&#9654;</div>
								</td>
							  </tr>
							</table>
					
					   </div>
					</div>
		<%if(placeInfo.getPlaceImageThumbnails().size() > 0) { %>
			<div class="place_info_ub" id="place_images_block">
			  <div class="place_info_block_head">Images</div>
			  <div class="place_info_block_content">
			  <% for (JsonimgID_2_data imageObj : placeInfo.getPlaceImageThumbnails()) {%>
			    <div class="ub_img_div">
			      <img class="ub_img_thumb" src="<%=imageObj.getData64()%>" id="ub_img_thumb-<%=imageObj.getImageID() %>"/>
			    </div>
			  <%} %>
			  </div>
			</div>
	   <%} %>
			<div class="place_info_ub_i" id="place_info_block">
			  <div class="place_info_block_head_i">Place info</div>
			  <div class="place_info_block_content_i">
			   <div class="pvwrap">
			     <div class="pv_name">Place name</div>
				 <div class="pv_value" id="pv_value_name"><%=placeInfo.getUserPlace().getPlace()%>,<%=placeInfo.getUserPlace().getBranch() %></div>
			   </div>
			   <div class="pvwrap">
			     <div class="pv_name">Address</div>
				 <div class="pv_value"  id="pv_value_address"><%=placeInfo.getUserPlace().getAddress()%></div>
			    </div>
			   <%if(placeInfo.getRating()!=null) { %>
			   <div class="pvwrap">
			     <div class="pv_name">Rating</div>
				 <div class="pv_value"  id="pv_value_rating">
				    <div class="donerating" name="donerating" id="donerating"></div>
				    <input id="ratingVal" type="text" value="<%=placeInfo.getRating().getAverage()%>" style="display:none"/>
				 </div>
			    </div>
			    <%} %>
				<div class="pvwrap">
			     <div class="pv_name">Floors</div>
				 <div class="pv_value" id="pv_value_floors"><%=placeInfo.getUserPlace().getFloors()%></div>
			    </div>
				<div class="pvwrap">
			     <div class="pv_name">Bookable places</div>
				 <div class="pv_value" id="pv_value_places"><%=placeInfo.getUserPlace().getShapesCount()%></div>
			    </div>
			    <%if(placeInfo.getPlacePhone()!=null && !placeInfo.getPlacePhone().isEmpty()) {%>
				<div class="pvwrap">
			     <div class="pv_name">Phone</div>
				 <div class="pv_value" id="pv_value_phone"><%=placeInfo.getPlacePhone()%></div>
			    </div>
			    <%} %>
			     <%if(placeInfo.getPlaceSiteURL()!=null && !placeInfo.getPlaceSiteURL().isEmpty()) {%>
				<div class="pvwrap">
			     <div class="pv_name">Site</div>
				 <div class="pv_value" id="pv_value_site"><%=placeInfo.getPlaceSiteURL()%></div>
			    </div>
			    <%} %>
			  </div>
			</div>					
			</td>
		</tr>
		</table>		  
    </div>
  </td></tr>

  </table>
  </body>
</html>