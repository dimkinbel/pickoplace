<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import = "com.dimab.pp.dto.*"
    import = "com.google.gson.Gson"
    import = "com.google.gson.reflect.TypeToken"
    import = "java.util.*"
    import = "java.lang.reflect.Type"%>
<!DOCTYPE html>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>IFrame editor</title>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/jquery-ui.drag.js"></script>
	
		<script type="text/javascript" src="js/loginlogout.js" ></script>
    
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/colpick.js" ></script>    
	
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/jquery.slimscroll.min.js" ></script>
	<script type="text/javascript" src="js/moment.min.js"></script>
	    
	<script type="text/javascript" src="js/shapes_fe.js"></script>
	<script type="text/javascript" src="js/shapes_timeline_fe.js"></script>
	<script type="text/javascript" src="js/printlog_fe.js"></script>
	<script type="text/javascript" src="js/updateData_fe.js"></script>
	<script type="text/javascript" src="js/interactiveUpdate_fe.js" ></script>
	<script type="text/javascript" src="js/wl_menu_fe.js" ></script>
	<script type="text/javascript" src="js/bookingOptions_fe.js" ></script>
	
    <link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>
	
	 <link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.4.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinModern.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
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
	function goToAccountMenu() {
		setSessionData(function(result) {
			   if(result) {
		          document.getElementById("master_account").submit();
			   } else {
				   updatePageView();
			   }
	     });
	}
var tl_canvas = {};
var InitialBookings = {};
var StateFromServer = {};
StateFromServer.floors = [];
var bookingsbysid = {};
var timelinediv={};
var mainOverviewID;       
var gcanvas ;
var floorSelectedIDDim;
var floorCanvases = [];
var floorNames = {};
var initalIntervalUpdates = 10;
var floorid2canvas = {};
var maincanvas;
var proceed_to_edit = 0;
var bookingsManager = {};
var positionmanager = {};
var bookingVars = {};
var tcanvas_ = {};
var currentSliderValue;
var placeUTCOffsetGlobal;
$(document).ready(function() {
   applyTableHeight();
   	  // canvas_ = new CanvasState(document.getElementById('canvas1'));
    	 // Update canvases background
    	 var allfloors =  document.getElementsByName("server_canvasState");  	 
    	 for(var x=0; x < allfloors.length; x++) { 
    		 var canvasfloor = allfloors[x].id;
    		 var floorID = canvasfloor.replace(/^server_canvasState_/, ""); 
    		 canvas_ = new CanvasState(document.getElementById("canvas_"+floorID));		 
    		 canvas_.main = true;
    		 floorCanvases.push(canvas_);
    		 var floorname = document.getElementById("server_floor_name_"+floorID).value;
    		 floorNames[floorname] = canvas_;
    		 canvas_.floor_name = floorname;
    		 floorid2canvas[floorID] = canvas_;
    		 
    	     var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
	    	 if (canvasStateJSON.state.backgroundType != "color") {
	    		 updateBackgroundImageByServer(canvasfloor);
	    	 }
	    	 if (canvasStateJSON.mainfloor) {
	    	   $("#floor__selector").prepend( $('<option value="'+floorname+'">'+floorname+'</option>'));
			   $("#floor__selector [value='"+floorname+"']").attr("selected", "selected");
			   maincanvas = canvas_;
	    	 } else {
	    	   $("#floor__selector").append( $('<option value="'+floorname+'">'+floorname+'</option>')); 	    		 
	    	 }
    	 }
    	// Update all shapes images
    	 var all=document.getElementsByName("shape_images_from_server");
    	 totalImages = all.length+1;
    	 for(var x=0; x < all.length; x++) { 
    		 var serverImageID = all[x].id;
    	    // updateShapeImagesByServerData(serverImageID);   	     
    	 }
    	 // Update all canvases
    	 for(var x=0; x < allfloors.length; x++) { 
    		 var canvasfloor = allfloors[x].id;
    		 var floorID = canvasfloor.replace(/^server_canvasState_/, ""); 
    		 var canvasStateJSON = JSON.parse(document.getElementById(canvasfloor).value);
    	     updateCanvasShapes(floorid2canvas[floorID],canvasStateJSON);
    	 }
    	 // Floor selector update
    	 canvas_ = maincanvas;
        
		
		 ApplyInitialPositionFE()
		 ApplySelectors();
		
		 tcanvas_= new  TCanvasState(document.getElementById("tcanvas"));
		 initialTCanvas();
		 if(document.getElementById("server_iFrameData") != null) {
			   applyIFrameValues();
		 }

});

</script>
<script type="text/javascript">	
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
		  console.log("update_no_connected");
		  location.href = "/welcome.jsp";
		  
	  }
}
</script>
</head>
<body style="margin: 0px;" >
    <div id="frame_prev_wrap" style="display:none" >
      <div id="frame_prev_wrap_popup_content" >
        <table id="iframe_loader" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse;display:none"><tr><td><img  style="width: 100px;" src="js/ajaxSpinner.gif" /></td></tr></table>
        <div id="frame-canvas" ></div>
        <img id="close_map_icon" src="img/icon-close35.png" onclick="closeIframe()"/>
      </div>
   </div>
    <div id="browser_window_wrap">
	
	</div>
	<table id="body_table" cellspacing="0" cellpadding="0"
		style="width: 100%; height: 100%; border-collapse: collapse">
		<tr id="header_tr">
			<td id="header_td">
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
   <%
   Gson gson = new Gson();
   
   AJAXImagesJSON responseJSON = (AJAXImagesJSON)request.getAttribute("canvasState");
   String ifid = (String)request.getAttribute("ifid");	
   IFresponse ifresp = (IFresponse)request.getAttribute("iframedata");

   List<PPSubmitObject> canvasStateList = responseJSON.getFloors();
   List<JsonSID_2_imgID> sid2imgID = responseJSON.getJSONSIDlinks();
   List<JsonImageID_2_GCSurl> imgID2URL = responseJSON.getJSONimageID2url();
   String placeName = responseJSON.getPlace_();
   String placeBranchName = responseJSON.getSnif_();
   String userRandom = responseJSON.getUsernameRandom();
   String placeID = responseJSON.getPlaceID();
   String placePhone = responseJSON.getPlacePhone();
   String placeFax = responseJSON.getPlaceFax();
   String placeMail = responseJSON.getPlaceMail();
   String placeDescription = responseJSON.getPlaceDescription();
   String placeSiteUrl = responseJSON.getPlaceURL();
   String placeAddress = responseJSON.getAddress();
   String placeLat = responseJSON.getLat();
   String placeLng = responseJSON.getLng();
   double    placeUTSoffset = responseJSON.getUTCoffset();
   %>
		<tr id="content_tr">
		 <td id="content_td">
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
      <input type="text" id="server_place_phone" value='<%=placePhone%>'/>
      <input type="text" id="server_place_mail" value='<%=placeMail%>'/>
      <input type="text" id="server_placeUTC" value='<%=placeUTSoffset%>'/>
      <input type="text" id="server_place_fax" value='<%=placeFax%>'/>
	  <input type="text" id="server_place_description" value='<%=placeDescription%>'/>
	  <input type="text" id="server_place_url" value='<%=placeSiteUrl%>'/>
      <input type="text" id="server_Address" value='<%= placeAddress%>'/>
      <input type="text" id="server_Lat" value='<%=placeLat%>'/>
      <input type="text" id="server_Lng" value='<%=placeLng%>'/>
      <input type="text" id="server_automatic_approval" value='<%=responseJSON.isAutomatic_approval()%>'/>
      <input type="text" id="server_automaticApprovalList" value='<%=gson.toJson(responseJSON.getAdminApprovalList())%>'/>
      <input type="text" id="server_adminApprovalList" value='<%=gson.toJson(responseJSON.getAdminApprovalList())%>'/>
      <input type="text" id="server_workinghours" value='<%=gson.toJson(responseJSON.getWorkinghours())%>'/>
      <input type="text" id="server_placeEditList" value='<%=gson.toJson(responseJSON.getPlaceEditList())%>'/>
      <input type="text" id="server_closeDates" value='<%=gson.toJson(responseJSON.getCloseDates())%>'/>
      <input type="text" id="server_logosrc" value='<%=responseJSON.getLogosrc()%>'/>
      <input type="text" id="server_iFrameID" value='<%=ifid%>'/>
      <%if(ifid!= null && !ifid.isEmpty()) {%>
       <input type="text" id="server_iFrameData" value='<%=gson.toJson(ifresp)%>'/>
      <%} %>
            
      <img  id="server_main_logo" src="img/pp.png"/>
      <img  id="server_v_logo" src="img/vlogo2.png"/>
      <img  id="server_passed_back" src="img/back_passed.png"/>
      <img  id="server_clock20" src="img/clock20.png"/>
      <%for ( JsonimgID_2_data imgID2byte64 : responseJSON.getPlacePhotos()) {
    	  String imgID = imgID2byte64.getImageID();   	  
      %>
      <input type="text" id="server_imap_<%=imgID %>" name="server_imap" value='<%=gson.toJson(imgID2byte64)%>'/>
      <% }%>

       <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
    	  for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>    
        <img id="server_<%=img2url.getImageID() %>" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
      <%} 
      }%>
     <input  id="address_hidden_lat" name="address_hidden_lat" style="display: none;"> 
     <input  id="address_hidden_lng" name="address_hidden_lng" style="display: none;">
     <input  id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">
	 	 <div id="user_uploaded_images" style="display:none">
		    <!-- Here uploaded images will be added -->
		  </div>
		  <div id="prev_used_images" style="display:none">
		    <!-- Here uploaded images will be added -->
		  </div>
		  <img id="temp_image_for_canvas_creation" style="display:none"></img>
		  <canvas  width="200" height="200" id="translated_user_images_canvas" style="display:none"></canvas>
		 <div id="bg_default_img_mirror" style="display:none">
		    <canvas id="default_img_canvas"></canvas>
		    <img id="default_bg_image_mirror"/>
		 </div>
		 <div id="canvas_shapes_images" style="display:none;"></div>
		 <div id="canvas_drawall_images_wrap" style="display:none;">
		  <div id="canvas_drawall_images" style="display:none;"></div>
		 </div>
	 	 <div class="size_value"><input id="canvas_w" type="text"  value="400"/></div>
		 <div class="size_value"><input id="canvas_h" type="text"  value="400"/></div>
		 <div id="history_images_wrapper"></div>
		  <canvas id = "text_width_calculation_canvas"  width="10" height="10"  style="display:none"></canvas>
	     <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
	     <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
	     <input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeID %>' style="display:none"/>
	    <form id="_iframeform"  action="editIFrame" method="post" style="display:none">
				  <input name="placeIDvalue" id="placeIDvalue" value="<%=placeID%>">
				  <input name="iFIDvalue" id="iFIDvalue" value="">
		</form>

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
					<div class="chosed_canvas chosed_img" ><canvas id="show_canvas" width="150" height="150" ></div>
				</div>
			  </div>       	  
	 </div>	
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
							   <div id="canvas_wrap_not_scroll_if" >							    
								    <% 
								      for (PPSubmitObject floor : canvasStateList) {
								    	   String floorid = floor.getFloorid();
								    	   String display="none";
								    	   if(floor.isMainfloor()) {display="";}
								    	   %>
								    	     <div id="div_wrap-canvas_<%=floorid%>" style="display:<%=display%>;margin: auto;">
											  <canvas id="canvas_<%=floorid%>" width="400" height="400"  tabindex='1' class="cmenu2 main_conf" >
												This text is displayed if your browser does not support HTML5 Canvas.
											  </canvas>
											 </div>
								   <%} %>								
							   </div>
							</div>

			 </div>
		   
		   </div>	 
		 <table id="account_content_fe" class="account_content_fe" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
		   <tr>
		    <td class="left_content_td" id="left_column__"> 

			</td>
		    <td id="content_td_ac_wl">
		      <div id="content_header_row"></div>
		    <div id="list_iframes" style="display:none">
			    <div id="list_buttons">
				  <div id="fe_back_" class="fe_list_buttons">&#8592; Back</div>
				</div>
			    <div id="list_loading"  class="sb_loading" style="display:none"> <img class="sb_ajax_gif" src="js/299.GIF" /></div>
			    <div id="fe_list_append">

				</div>
			  </div>
			  <div id="center_column_like_fe">
			    <div id="iframe_wrap"> 
					   <div id="content_top_row" style="display: -webkit-inline-box;">
						  <div id="content_top_left_cell">
						  
						  </div>
						  <div id="content_top_right_cell"></div>
					   </div>
					   <div id="content_bottom_row" style="display: -webkit-inline-box;">
						  <div id="content_bottom_left_cell"></div>
						  <div id="content_bottom_right_cell"></div>
					   </div>
				   <div id="bookings_fe_wrap_main" style="position:absolute;bottom:0px;right:0px;">
				    <div id="booking_tag" style="display:none">Booking</div>
					<div id="booking_hide_tag" >Hide &#9660;</div>

				    <div id="bookings_fe_wrap" >
					  <table id="main_fe_book_tbl" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
					   <tr>
					     <td>
						 <div class="orange_color__">
						    <table id="booking_data_table" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
							  <tr id="top_names_feb">
							     	 <td rowspan="2" style="vertical-align: top;">
                                         <div id="dateshaddow"><div class="material-icons" id="calendar_book_icon">event</div><input id="datepicker_fe" type="text" /></div>
                                      </td>
									<td class="fe_top_v"  ><div class="book_request_text_fe" > Book time </div></td>
									
									<td class="book_btn_td" rowspan="2" id="buttons_book_col">
									 	<div id="place_order_button" class="blue_e_button marginhor2" onclick="displayBookingRequest()" style="display:''">BOOK</div>
							            <div id="place_order_button_invalid" class="blue_e_button_invalid marginhor2" style="display:none"></div>
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
							  <tr id="feb_slider_row">
							    <td id="feb_slider_column" >
								  <table cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">

									 <tr id="feb_tcanvas_row">
									   <td  id="tcanvas_wrap_append">
									     <div id="tcanvas_div" style="width:384px;height:30px">
									       <canvas id="tcanvas" width="384" height="30" ></canvas>
										   
										 </div>
										 
									   </td>
									 </tr>
									<tr id="feb_slider_row">
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
				 </div>
			   </div>
			</td>
			<td  id="right_column_like_fe" style="width:355px;position:relative">
               <div id="right_column_like" style="width:350px;">
                  <div id="fe_options_wrap">
                  <div id="fe_menu_div_">
				     <div class="fe_menu_btn" id="fe_save">Save</div>
				     <div class="fe_menu_btn" id="fe_save_ajax" style="display:none"><img class="sfdcvsad" src="js/saving.GIF" /></div>
					 <div class="fe_menu_btn" id="fe_iflist">List saved</div>
				   </div>
				   <div class="fe_single_option_main effect2" id="feos_floors" >Select floors</div>
				   <div class="feos_hidden" id="feos_floors_hidden" style="display:none">
						 <div class="flors_option_main_div" id="feo_all_flors">
						   <input type="checkbox" class="wl_list_checkbox" checked="checked" id="feo_all_flors_checkbox" />
						   <div class="option_fe_text">All floors in single frame</div>
						 </div>
						 <div class="flors_option_main_div" id="feo_separate_flors">
						   <input type="checkbox" class="wl_list_checkbox" id="feo_separate_flors_checkbox" />
						   <div class="option_fe_text">All floors in separate frames</div>
						 </div>
						 <div class="flors_option_hidden_div" id="feo_separate_flors_hidden" style="display:none">
						   <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
							 <tr>
							  <td>
								<input type="radio" class="floor_both_chk" id="floor_both_chk-horizontal" name="floor_both_chk" value="floor_both_chk-horizontal" checked="checked">Horisontal 
							  </td>
							  <td>
								 <input type="radio" class="floor_both_chk" id="floor_both_chk-vertical" name="floor_both_chk" value="floor_both_chk-vertical">Vertical
							  </td>
							 </tr>
							</table> 
						 </div>
						 <div class="flors_option_main_div" id="feo_single_floor">
						   <input type="checkbox" class="wl_list_checkbox" id="feo_single_floor_checkbox" />
						   <div class="option_fe_text">Single floor</div>
						 </div>
						 <div class="flors_option_hidden_div" id="feo_single_floor_hidden"  style="display:none">
						   <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
							 <tr>
							  <td>
								 Floor name:
							  </td>
							  <td>
							     <div class="floors_radios"  id="floors_single_radio_form">

								 </div>
							  </td>
							 </tr>
							</table> 
						 </div>
				   </div>
				   <div class="fe_single_option_main" id="feos_dimensions" >iFrame & Floors dimensions</div>
				   <div class="feos_hidden" id="feos_dimensions_hidden" style="display:none">
				     <table class="options_fe_innner_table"  cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
					  <tr>
					   <td colspan="5" class="par_name">
					     iFrame dimensions
					   </td>
					  </tr>
					  <tr>
						  <td>Width</td>
						  <td><div id="iframe_width_left" class="dim_triangle">&#9664;</div></td>
						  <td class="for_slider_td">
						  <div class="for_slider_fe"  >
								<div id="iframe_width" style="width:170px;"></div>
						   </div>
						   </td>
						   <td><div id="iframe_width_right" class="dim_triangle">&#9654;</div></td>
						   <td>
							 <input id="iframe_set_width" type="text" value="400"/><div id="set_iframe_width">set</div>
						   </td>
					   </tr>
					  <tr>
						  <td>Height</td>
						   <td><div id="iframe_height_left" class="dim_triangle">&#9664;</div></td>
						  <td class="for_slider_td">						 
						  <div class="for_slider_fe"  >
								<div id="iframe_height" style="width:170px;"></div>
						   </div>
						   </td>
						   <td><div id="iframe_height_right" class="dim_triangle">&#9654;</div></td>
						   <td>
							 <input id="iframe_set_height" type="text" value="400"/><div id="set_iframe_height">set</div>
						   </td>
					   </tr>
					  <tr>
					   <td colspan="5"  class="par_name">
					     Floors dimensions
					   </td>
					  </tr>
					  <tr id="floors_dimensions_selector_tr" style="display:none">
					   <td colspan="5">
					    <div id="floors_dimensions_selector_div">
						
						</div>
						</td>
					  </tr>
					  <tr>
						  <td>Width</td>
						   <td><div id="floor_width_left" class="dim_triangle">&#9664;</div></td>
						  <td class="for_slider_td">
						  <div class="for_slider_fe"  >
								<div id="border_width" style="width:170px;"></div>
						   </div>
						   </td>
						    <td><div id="floor_width_right" class="dim_triangle">&#9654;</div></td>
						   <td>
							 <input id="border_set_width" type="text" value="400"/><div id="set_border_width">set</div>
						   </td>
					   </tr>
					  <tr>
						  <td>Height</td>
						   <td><div id="floor_height_left" class="dim_triangle">&#9664;</div></td>
						  <td class="for_slider_td">
						  <div class="for_slider_fe"  >
								<div id="border_height" style="width:170px;"></div>
						   </div>
						   </td>
						   <td><div id="floor_height_right" class="dim_triangle">&#9654;</div></td>
						   <td>
							 <input id="border_set_height" type="text" value="400"/><div id="set_border_height">set</div>
						   </td>
					   </tr>
					  </table>
				   </div>
				   <div class="fe_single_option_main" id="feos_booking">Booking location</div>
				   <div class="feos_hidden" id="feos_booking_hidden" style="display:none">
				      <div class="flors_option_booking_pos" id="feo_booking_available">
						   <input type="checkbox" class="wl_list_checkbox" id="feo_booking_available_checkbox"  checked="checked" />
						   <div class="option_fe_text">Booking available</div>
					  </div>
					 <div class="flors_option_hidden_div_b" id="feo_booking_available_hidden" >
						 <table class="options_fe_innner_table"  cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
						  <tr>
						   <td colspan="2" class="par_name">
							 Always on top ?
						   </td>
						  </tr>
						 <tr>
							  <td>
								<input type="radio" class="book_frame_ontop" id="book_frame_ontop-yes" name="book_frame_ontop" value="book_frame_ontop-yes">Yes 
							  </td>
							  <td>
								 <input type="radio" class="book_frame_ontop" id="book_frame_ontop-no" name="book_frame_ontop" value="book_frame_ontop-no"  checked="checked">No
							  </td>
						  </tr>
						   <tr>
						   <td colspan="2" class="par_name">
							 Width
						   </td>
						  </tr>
						 <tr>
							  <td>
								<input type="radio" class="book_frame_wraps" id="book_frame_wraps-yes" name="book_frame_wraps" value="book_frame_wraps-yes">Fill iFrame 
							  </td>
							  <td>
								 <input type="radio" class="book_frame_wraps" id="book_frame_wraps-no" name="book_frame_wraps" value="book_frame_wraps-no"  checked="checked">Small
							  </td>
						  </tr>
							</table> 
						 </div>
				   </div>
				   <div class="fe_single_option_main" id="feos_colors">Colors</div>
				   <div class="feos_hidden" id="feos_colors_hidden" style="display:none">
				      <table id="colors_table_fe" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">
					    <tr>
						  <td>iFrame background color</td>
						  <td><div id="selected_fill_color" class="pick_color"></div></td>
						</tr>
					  </table>
				   </div>
				  </div>
			   </div>
			   <div id="temp_appends" style="height:400px;width:400px;position:absolute;left:-2000px;top:-300px;"></div>

			</td>
		  </tr>
		  </table>
		  </td>
		</tr>

	</table>
</body>
</html>