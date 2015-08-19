<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import = "com.dimab.pp.dto.*"
    import="com.google.appengine.api.users.*"
    import = "com.google.gson.Gson"
    import = "com.google.gson.reflect.TypeToken"
    import = "java.util.*"
    import = "java.lang.reflect.Type"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Waiter Admin</title>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/loginlogout.js" ></script>
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/colpick.js" ></script>    
	
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
    
	<script type="text/javascript" src="js/shapes_wa.js"></script>
	<script type="text/javascript" src="js/shapes_timeline_wa.js"></script>
	<script type="text/javascript" src="js/shapes_timeline_wa_bookings.js"></script>
	<script type="text/javascript" src="js/printlog_wa.js"></script>
	<script type="text/javascript" src="js/updateData_wa.js"></script>
    <script type="text/javascript" src="js/wl_menu.js"></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/jquery.slimscroll.min.js" ></script>
	<script type="text/javascript" src="js/bookingListManagement_wa.js" ></script>
	<script type="text/javascript" src="js/interactiveUpdate_wa.js" ></script>
	<script src='/_ah/channel/jsapi'></script>
    <script language="javascript" src='js/chatChannel.js'></script>
    
    <link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	
<script type="text/javascript">
       if(typeof document.onselectstart!="undefined") {
	       document.onselectstart = new Function ("return false");
	   } else {
	       document.onmousedown = new Function ("return false");
		   document.onmouseup = new Function ("return true");
	   }
	   
       function goToAccountMenu() {
    	   setSessionData(function(result) {
    		   if(result) {
    				  document.getElementById("master_account").submit();
    			} else {
    				updatePageView()
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
var floorCanvases = [];
var floorNames = {};
var initalIntervalUpdates = 10;
var floorid2canvas = {};
var maincanvas;
var proceed_to_edit = 0;
var bookingsManager = {};
var positionmanager = {};
$(document).ready(function() {  
   UpdateHeader();
   InitialCanvasTimeline('timeline_canvas');
 
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
    	     updateShapeImagesByServerData(serverImageID);   	     
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

 
   setInterval(function(){
    timelinediv.updateNowTime();
    }, 60000);
   setInterval(function(){
     if(initalIntervalUpdates > 0) {
       tl_canvas.valid = false;
	   initalIntervalUpdates--;
	 }
    }, 1000);

   // UpdateInitialBookingList();
	var ctw = parseInt(document.getElementById('timeline_canvas').width)+10;
	$('#canvas_slimscroll').slimScroll({
        position: 'right',
        height: '250px',
		width:'400px',
		railVisible: true,
	    size: '10px',
    });
	ApplyInitialPosition();
	InitialBookingList();
});
function c_zoomSmall() {
 tl_canvas.lineSmaller();
}
function c_zoomBig() {
 tl_canvas.lineBigger();
}
function c_zoomIN() {
 tl_canvas.zoomIn();
}
function c_zoomLineReset() {
 tl_canvas.lineReset();
}
function c_zoomOUT() {
 tl_canvas.zoomOut();
}
function c_zoomRESET() {
 tl_canvas.zoomReset();
}
function c_zoomLeft() {
 tl_canvas.zoomLeft(3600);
}
function c_zoomRight() {
 tl_canvas.zoomRight(3600);
}
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
		  
		  var pid = $("#server_placeID").val();
		  requestChannelToken(fudata.id+"___"+fudata.email+"_PPID_"+pid+"_PPID_"+randomString(5));
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
		  var pid = $("#server_placeID").val();
		  requestChannelToken(gudata.id+"___"+gudata.name.givenName+"_PPID_"+pid+"_PPID_"+randomString(5));
	  } else {
		  //Not connected
		  
		  $("#login_prop").show();
		  $("#login_info_resp").hide();
		  $("#account_drop").hide();

		  $("#login_info_resp_d").empty();
		  
		  $("#fb_logout_div").hide();
		  $("#go_logout_div").hide();
		  if(channel__!=undefined && channel__!=null) {
			  channel__.close();
		  }
		  
	  }
}
$(document).ready(function () { 
    $("#login_prop_d").click(function(){
    	$("#page_login_prompt").show();
    });

});
$(document).on("click",".stopclick", function (event) {
	    if(event.target.id == "page_login_prompt") {
		  $("#page_login_prompt").hide();
		}
});
 ///
</script>
</head>
<body style="margin: 0px;overflow:hidden;" >
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
   WaiterInitialDTO waiterResponse = (WaiterInitialDTO)request.getAttribute("waiterResponse");
   String WaiterBookings = (String)request.getAttribute("waiterBookings");
   String imgid2link50 = (String)request.getAttribute("imgid2link50");
   OrderedResponse bookingsInitial = waiterResponse.getOrderedResponse();
   String bookingsInitialJSON = gson.toJson(bookingsInitial);
   AJAXImagesJSON responseJSON = waiterResponse.getPlaceJSON();

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
      <input type="text" id="server_bookingsInitial" value='<%=bookingsInitialJSON%>'/>
      <input type="text" id="server_bookings" value='<%=WaiterBookings%>'/>
      <input type="text" id="server_imgID2link50" value='<%=imgid2link50%>'/>
      
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
											<table  cellspacing="0" cellpadding="0" style="border-collapse:collapse">
											   <tr id="zoom_plus_tr">
												 <td>
												   <div id="zoom_plus_div" onclick="sizeUp()">+</div>
												 </td>
											   </tr>
											   <tr id="zoom_minus_tr">
												 <td>
												   <div id="zoom_minus_div"  onclick="sizeDown()">-</div>
												 </td>
											   </tr>
											   <tr id="zoom_reset_tr">
												 <td>
												   <div id="zoom_reset_div" onclick="zoomResetWrap(canvas_,600,400)">reset</div>
												 </td>
											   </tr>				   
											</table>
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

			 <div id="canvas_relative_div" style="position:relative">
				  <div id="canvas_timeline_div">	
					
				  </div>
				  <div id="timeline_buttons_wrap">
				   <div class="centered__" style="display: inline-block;">
					  <div id="div_zoom_left" class="zoom_button_wl" onclick="c_zoomLeft()"  title="Step 1-hour left"><img class="zoom_img_wl" src="img/zoom-left2.png"/></div>
					  <div id="div_zoom_vertical_in" class="zoom_button_wl" onclick="c_zoomBig()" title="Zoom-IN Vertical"><img class="zoom_img_wl" src="img/zoom-vert-in2.png"/></div>
					  <div id="div_zoom_vertical_out" class="zoom_button_wl"  onclick="c_zoomSmall()" title="Zoom-OUT Vertical"><img class="zoom_img_wl" src="img/zoom-vert-out2.png"/></div>
					  <div id="div_zoom_vertical_reset" class="zoom_button_wl"  onclick="c_zoomLineReset()" title="Reset Vertical">reset</div>
					  <div id="div_zoom_horizontal_in" class="zoom_button_wl" onclick="c_zoomIN()"  title="Zoom-IN Horisontal (less time)"><img class="zoom_img_wl" src="img/zoom-hor-in2.png"/></div>
					  <div id="div_zoom_horizontal_out" class="zoom_button_wl" onclick="c_zoomOUT()"   title="Zoom-OUT Horisontal (more time)"><img class="zoom_img_wl" src="img/zoom-hor-out2.png"/></div>					  
					  <div id="div_zoom_horizontal_in" class="zoom_button_wl" onclick="c_zoomRESET()"  title="Reset horizontal (2days)">reset</div>
					  <div id="div_zoom_right" class="zoom_button_wl" onclick="c_zoomRight()" title="Step 1-hour right"><img class="zoom_img_wl" src="img/zoom-right2.png"/></div>
					 </div>
				  </div>

				  <div id="canvas_slimscroll" style="height:800px"  >
					<canvas id="timeline_canvas" width="800" height="300"></canvas>
				  </div>
			 </div> 
			
			  <div id="wl_menu" style="display:none;">
	               <table id="menu_table" cellspacing="0" cellpadding="0">
				      <tr  class="info_menu_option">
					   <td>
					    <div  id="info_menu_line_option" class="wl_menu_option_info"></div>
					  </td>
					  <td>
					    <div  id="info_menu_bid_option" class="wl_menu_option_info"></div>
					  </td>
					  </tr>
				      <tr class="booking_selected_menu_option only_booking_menu">
					  <td colspan="2">
					    <div id="wlm_highlight_same_order" class="wl_menu_option" >Highlight bookings from the same order</div>
					  </td></tr>
					  <tr class="booking_selected_menu_option ">
					  <td colspan="2">
					    <div id="wlm_open_details" class="wl_menu_option" >Open order details</div>
					  </td></tr>
					 <tr class="booking_selected_menu_option" >
					   <td colspan="2">
					    <div  id="wl_select_on_floor" class="wl_menu_option" >Show on place</div>
					  </td>
					 </tr>
				     <tr class="booking_selected_menu_option" >
					   <td colspan="2">
					    <div  id="wl_up" class="wl_menu_option" >Up</div>
					  </td>
					 </tr>
				     <tr  class="booking_selected_menu_option">
					   <td colspan="2">
					    <div  id="wl_down" class="wl_menu_option">Down</div>
					  </td>
					  </tr>
					  <tr  class="booking_selected_menu_option">
					   <td colspan="2">
					    <div  id="wl_top" class="wl_menu_option only_list_menu">Top</div>
					  </td></tr>
					  <tr  class="booking_selected_menu_option">
					   <td colspan="2">
					    <div  id="wl_bottom" class="wl_menu_option only_list_menu">Bottom</div>
					  </td></tr>
					  
				   </table>
              </div>		   
		   </div>	 
		 <table id="account_content"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
		   <tr>
		    <td class="left_content_td" id="left_column__"> 
               <div id="wl_left_buttons_div">
               		<div id="daypiskers_wl">
					<table id="daypiskers_wl_tbl">
					 <tr>
					   <td><div><input id="datepicker_wl_from" type="text" /></div></td>
					 </tr>
					 <tr>
					   <td><div id="wl_load_dates_button">update</div>
					       <div id="wa_load_ajax" style="display:none;height: 20px;"><img class="sb_ajax_gif_small" src="/js/299.GIF" /></div>
					   </td>
					 </tr>
					</table>
				   </div>
			       <div id="view_options_btn" class="left_wl_button top_left_wl_button">
				       <ul id="view_options_btn_dropit" >
				          <li><a href="#" class="left_mwnu_dropit">View options</a>
						     <ul class="left-submenu">
							   <li><div class="sub_left_menu">
							      <div class="top-submenu-row"></div>
								  <table id="view_op_table" cellspacing="0" cellpadding="0" style=" border-collapse: collapse">
								    <tr>
									 <td class="top_row_p" colspan="2">
								      
									 </td></tr>
									 <tr>
									  <td class="view_option_">
									    <div class="vo_wrap_div" id="t100x100">
										  <div class="wlm_h100">
										    <div class="wlm_w100 wlm_time">Timeline</div>
										 </div>
										</div>
									  </td>
									  <td class="view_option_">
									     <div class="vo_wrap_div"  id="af100x100">
											 <div class="wlm_h100">
												<div class="wlm_w100 wlm_flr">all-floors</div>
											 </div>
										 </div>
									  </td> 
									  </tr>
									 <tr>
									  <td class="view_option_">
									    <div class="vo_wrap_div"  id="t50xaf50">
										  <div class="wlm_h50">
										    <div class="wlm_w100 wlm_time">Timeline</div>
											<div ></div>
										 </div>
										 <div class="wlm_h50">
										    <div class="wlm_w100 wlm_flr">all-floors</div>
											<div></div>
										 </div>
										</div>
									  </td>
									  <td class="view_option_">
									     <div class="vo_wrap_div"  id="t50xf50f50">
									      <div class="wlm_h50">
										    <div class="wlm_w100 wlm_time">Timeline</div>
											<div ></div>
										 </div>
										 <div class="wlm_h50">
										    <div class="wlm_w50l wlm_flr">floor</div>
											<div class="wlm_w50r wlm_flr">floor</div>
										 </div>
										 </div>
									  </td>
									  
									  </tr>
									   <tr>
									  <td class="view_option_">
									    <div class="vo_wrap_div"  id="af100xt100">
											<div class="wlm_h50">
												<div class="wlm_w100 wlm_flr">all-floors</div>
												<div></div>
											 </div>
											  <div class="wlm_h50">
												<div class="wlm_w100 wlm_time">Timeline</div>
												<div ></div>
											 </div>
										</div>
									  </td>
									  <td class="view_option_">
									     <div class="vo_wrap_div"  id="f50f50xt100">
										 <div class="wlm_h50">
										    <div class="wlm_w50l wlm_flr">floor</div>
											<div class="wlm_w50r wlm_flr">floor</div>
										 </div>
									      <div class="wlm_h50">
										    <div class="wlm_w100 wlm_time">Timeline</div>
											<div ></div>
										 </div>
										 </div>
									  </td>
									  
									  </tr>
								  </table>
							   </div></li>
							 </ul>
						  </li>
						</ul>
				   </div>
				   <div id="show_bookins_row_btn" class="left_wl_button">
	                     Show bookings
				   </div>
				   <input type="checkbox" class="menu_chekc"  id="bookings_col_enable" style="display:none"/>
			   </div>
			</td>
		    <td id="content_td_ac_wl">
		      <div id="content_header_row"></div>
			  <div id="center_column_like">
			       
				   <div id="content_top_row" >
					  <div id="content_top_left_cell"></div>
					  <div id="content_top_right_cell"></div>
				   </div>
				   <div id="content_bottom_row" >
					  <div id="content_bottom_left_cell"></div>
					  <div id="content_bottom_right_cell"></div>
				   </div>
			   </div>
               <div id="right_column_like">

			   </div>
			   <div id="temp_appends" style="height:400px;width:400px;position:absolute;left:-2000px;top:-300px;"></div>
			   <div id="open_bookings_list_btn">BOOKINGS</div>
			   <div id="transition_open"><div id="close_transition_bookings">hide >></div>
			   <div id="wl_list_bookings_wrap">
			      <table id="wl_list_bookings_table"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
				    <tr >
					   <td id="wl_list_bookings_table_head">
					     <div id="wl_list_bookings_table_head_div">Orders</div>
						    <table id="wl_list_bookings_head_table"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">
							  <tr>
							    <td class="wl_list_head_ch_box"><input type="checkbox" class="wl_list_checkbox" checked="checked" id="wl_bookings_current" /></td>
							    <td class="wl_list_head_ch_name">Ongoing</td>
								<td class="wl_list_head_ch_box"><input type="checkbox"  class="wl_list_checkbox"  checked="checked"  id="wl_bookings_next" /></td>
								<td class="wl_list_head_ch_name">Next</td>
								<td class="wl_list_head_ch_box"><input type="checkbox"  class="wl_list_checkbox"  checked="checked"  id="wl_bookings_past" /></td>
								<td class="wl_list_head_ch_name">Past</td>
							   </tr>
							</table>				 
					   </td>
					</tr>
					<tr id="wl_list_current_list_row">
					  <td >
					     <div class="wl_list_section_head"> Ongoing orders
				         </div>
						 <div class="wl_list_section_head_tbl_cols">
						   <div class="wl_list_section_head_tbl_col_bid" >BookID</div>
						   <div class="wl_list_section_head_tbl_col_time" >Began</div>
						   <div class="wl_list_section_head_tbl_col_period" >Period</div>
						   <div class="wl_list_section_head_tbl_col_pers" >Persons</div>
						   <div class="wl_list_section_head_tbl_col_place" >Places</div>						   
						 </div>
						 <div id="append_current_wl_list">

						 </div>
					  </td>
					</tr>
                    <tr id="wl_list_next_list_row">
					  <td >
					     <div class="wl_list_section_head"> Next orders
				         </div>
						 <div class="wl_list_section_head_tbl_cols">
						   <div class="wl_list_section_head_tbl_col_next_bid" >BookID</div>
						   <div class="wl_list_section_head_tbl_col_next_time" >Time</div>
						   <div class="wl_list_section_head_tbl_col_next_period" >Period</div>
						   <div class="wl_list_section_head_tbl_col_next_pers" >Persons</div>
						   <div class="wl_list_section_head_tbl_col_next_place" >Places</div>
						   <div class="wl_list_section_head_tbl_col_next_left" >Left</div>
						 </div>
						 <div id="append_next_wl_list">
	
						 </div>
					  </td>
					</tr>
                    <tr id="wl_list_past_list_row">
					  <td >
					     <div class="wl_list_section_head"> Past orders
				         </div>
						 <div class="wl_list_section_head_tbl_cols">
						   <div class="wl_list_section_head_tbl_col_past_bid" >BookID</div>
						   <div class="wl_list_section_head_tbl_col_past_time" >Time</div>
						   <div class="wl_list_section_head_tbl_col_past_period" >Period</div>
						   <div class="wl_list_section_head_tbl_col_past_pers" >Persons</div>
						   <div class="wl_list_section_head_tbl_col_past_place" >Places</div>
						 </div>
						 <div id="append_past_wl_list">

						 </div>
					  </td>
					</tr>
				  </table>
			  </div>
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