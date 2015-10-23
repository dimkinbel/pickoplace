<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import = "com.dimab.pp.dto.*"
    import = "com.google.gson.Gson"
    import = "com.google.gson.reflect.TypeToken"
    import = "java.util.*"
    import = "java.lang.reflect.Type"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Place Configuration</title>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/loginlogout.js" ></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/colpick.js" ></script>    
	
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
    
	<script type="text/javascript" src="js/moment.min.js"></script>
	<script type="text/javascript" src="js/moment-timezone.js"></script>
	<script type="text/javascript" src="js/moment.zones2010-2020.js"></script>

	<script type="text/javascript" src="js/shapes_pc.js"></script>
	<script type="text/javascript" src="js/printlog_pc.js"></script>
	<script type="text/javascript" src="js/updateData_pc.js"></script>
    <script type="text/javascript" src="js/bookingOptions_pc.js"></script>
	<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">
    </script>
	
    <link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
    <script type="text/javascript" src="js/maps_google.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
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
    			   }
    	     });
    	}
       function SIsaveState() {
    	   setSessionData(function(result) {
			   if(result) {
				   saveState();
			   }
	     });
	}
       function editPlace(placeID_form) {
    	   setSessionData(function(result) {
			   if(result) {
      				document.getElementById(placeID_form).submit();
			   }
  	    	 });
         }
       var mainOverviewID;       
	   var gcanvas ;
	   var floorCanvases = [];
	   var floorNames = {};
       var floorid2canvas = {};
       var maincanvas;
       var proceed_to_edit = 0;
       var proceed_to_iframe = 0;
		
       var geocoder;		
       $(document).ready(function() {
    	   "use strict";
  		 geocoder = new google.maps.Geocoder();
         var options = {
  		  types: ['geocode']
  		 };
        var place_search = document.getElementById('config_address');
        var autocomplete = new google.maps.places.Autocomplete(place_search, options);
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

		 // Update Place General Info
		 console.log("photos");
		 updatePhotosAndLogo();
		 console.log("working");
		 updateWorkingHours();
		 console.log("admin");
		 updateAdminSection();
		 		 
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
       $(document).ready(function () { 
	      //
       });
       function saveState() {
    		 var address = document.getElementById('config_address').value;
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
    	             		 var zoneID = response.timeZoneId;
    	             		// var c = moment.tz(Math.round(new Date().getTime()), zoneID);
    	             		 var offset = response.rawOffset/3600 + response.dstOffset/3600;
    	                 	 document.getElementById("UTCoffcet_hidden").setAttribute("value",offset);
    	                 	// console.log(c.format());
    	                 	 console.log(response.rawOffset/3600 + "  " + response.dstOffset/3600 + "= " + offset);
    	                 	 createSaveObjectPre();
    	             	});
    	         } else {
    	           alert("Address not valid") ;  	      
    	         }
    	       }); 
       }
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
       function editPlaceAndSave(placeID_form) {
    	    
    		document.getElementById("config_save_prompt").style.display="";
       }
       function SaveAndIFrame(placeID_form) {
   	    
   		document.getElementById("config_save_prompt_iframe").style.display="";
      }

       function promptCancel(id) {
    	   document.getElementById(id).style.display="none";
       }
       function editPlaceWithoutSave() {
    	   var pid = document.getElementById("placeIDvalue").value;
    	   editPlace(pid+"_editform");
       }
       function IFrameWithoutSave() {
    	   var pid = document.getElementById("placeIDvalue").value;
    	   editPlace(pid+"_iframeform");
       }
       function saveBeforeEdit() {
    	   proceed_to_edit = 1;
    	   proceed_to_iframe = 0;
    	   SIsaveState();    	   
       }
       function saveBeforeIFrame() {
    	   proceed_to_iframe = 1;
    	   proceed_to_edit = 0;
    	   SIsaveState();    	   
       }
	</script>
<script type="text/javascript">	
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

	  } else {
		  //Not connected
		  console.log("update_no_connected");
		  location.href = "/welcome.jsp";
		  
	  }
}
</script>
  </head>

  <body  style="margin: 0px;background-image: url(img/background/download.jpg);">
   <div id="map_wrapper"  style="display:none;">
      <div id="map_popup_content">
        <div id="map-canvas"></div>
        <img id="close_map_icon" src="/img/icon-close35.png" onclick="closeMap()"/>
      </div>
   </div>
   <div id="config_save_prompt" class="save_prompt" style="display:none;">
     <div class="config_save_prompt_inner" >
        <table class="config_save_prompt_tbl" cellspacing="0" cellpadding="0" style="width:100%;height: 100%;min-;border-collapse:collapse">
          <tr><td colspan=3 class="confirm_message">Save configuration ?</td></tr>
          <tr>
            <td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_yes" onclick="saveBeforeEdit()">Save</div></td>
            <td class="confirm_message_btn_td"><div title="Proceed to editing without configuration saving" class="confirm_message_btn confirm_message_no" onclick="editPlaceWithoutSave()">No</div></td>
            <td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_cancel" onclick="promptCancel('config_save_prompt')">Cancel</div></td>
          </tr>
        </table>
     </div>
   </div>
     <div id="config_save_prompt_iframe" class="save_prompt" style="display:none;">
     <div class="config_save_prompt_inner" >
        <table class="config_save_prompt_tbl" cellspacing="0" cellpadding="0" style="width:100%;height: 100%;min-;border-collapse:collapse">
          <tr><td colspan=3 class="confirm_message">Save configuration ?</td></tr>
          <tr>
            <td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_yes" onclick="saveBeforeIFrame()">Save</div></td>
            <td class="confirm_message_btn_td"><div title="Proceed to editing without configuration saving" class="confirm_message_btn confirm_message_no" onclick="IFrameWithoutSave()">No</div></td>
            <td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_cancel" onclick="promptCancel('config_save_prompt_iframe')">Cancel</div></td>
          </tr>
        </table>
     </div>
   </div>
  <table id="body_table"  cellspacing="0" cellpadding="0" style="width:100%;min-;border-collapse:collapse">
   <tr id="header_tr"><td id="header_td">
    <div id="header">
       <div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
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
   </td></tr>
   <%
   AJAXImagesJSON responseJSON = (AJAXImagesJSON)request.getAttribute("canvasEditPlace");
   Gson gson = new Gson();
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
      <img    id="server_background_<%=floorid %>" crossorigin="anonymous" name="server_background" src="<%=backgroundURL%>"/>
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
      
      <%for ( JsonimgID_2_data imgID2byte64 : responseJSON.getPlacePhotos()) {
    	  String imgID = imgID2byte64.getImageID();   	  
      %>
      <input type="text" id="server_imap_<%=imgID %>" name="server_imap" value='<%=gson.toJson(imgID2byte64)%>'/>
      <% }%>

       <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
    	  for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>    
        <img id="server_<%=img2url.getImageID() %>" crossorigin="anonymous" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
      <%} 
      }%>
     <input  id="address_hidden_lat" name="address_hidden_lat" style="display: none;"> 
     <input  id="address_hidden_lng" name="address_hidden_lng" style="display: none;">
     <input  id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">
    </div>

    <div id="container_ub">
	 <div id="from_server_data" style="display:none">
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
     <div id="messages_wrapper" style="display:none">
      <div id="messagesInner">
        <div id="red_messages" class="info_messages" name="info_messages"  style="display:none"><div id="red_messages-t"></div>
          <div class="close_messages" >X</div>
        </div>
        <div id="blue_messages" class="info_messages" name="info_messages"  style="display:none"><div id="blue_messages-t"></div>
          <div class="close_messages" >X</div>
        </div>
        <div id="green_messages" class="info_messages" name="info_messages"  style="display:none"><div id="green_messages-t"></div>
          <div class="close_messages" >X</div>
        </div>
        <div id="black_messages" class="info_messages" name="info_messages"  style="display:none"><div id="black_messages-t"></div>
          <div class="close_messages" >X</div>
        </div>
      </div>
     </div>
	 <table class="threecolumncontent" cellspacing="0" cellpadding="0" style="width: 95%;  border-collapse: collapse">
	    <tr>
		  <td id="left_column_content" style="width:50px">
			   <div id="logs_div_left"></div>
		  </td>
			<td class="middle_column_content">
			<div id="show_canvas_place_btn">
			</div>
			<div id="tour_buttons_wrap_">
			  <div class="tour_menu_button" id="save_configuration" onclick="SIsaveState()">
			     <span id="ajax_save_hide">Save</span>			     
			     <img class="sfdcvsadd" id="ajax_save_img_conf" style="display:none" src="js/saving.GIF">
			  </div>
			  <div class="tour_menu_button" id="back_drawing" onclick="editPlaceAndSave('<%=placeID%>_editform')">Edit Place</div>
			  <div class="tour_menu_button" id="goto_frame" onclick="SaveAndIFrame('<%=placeID%>_iframeform')">iFrame Editor</div>
			  <div class="tour_menu_button" id="publish">Publish</div>
			</div>
			<form id="<%=placeID%>_editform"  action="editplacefromAccount" method="post" style="display:none">
				    	                          <input name="placeIDvalue" id="placeIDvalue" value="<%=placeID%>">
			</form>
			<form id="<%=placeID%>_iframeform"  action="editIFrame" method="post" style="display:none">
				    	                          <input name="placeIDvalue" id="placeIDvalue" value="<%=placeID%>">
				    	                          <input name="iFIDvalue" id="iFIDvalue" value="">
			</form>
            <table id="middle_column_table"  cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">

			  <tr id="configuration_options_tr_wrap" >
			     <td>
				   <div id="local_live_time_div" style="display:none"></div>
			       <table id="config_tabs_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width: 100%;">
			         <tr id="config_tabs_tr"><td>
			           <div id="global_params_tab" class="config_tab config_tab_selected">Global Buisness Info</div>
			           <div id="bookable_params_tab" class="config_tab">Bookable Objects</div>
					   <div id="calndar_params_tab" class="config_tab">Working hours</div>
					   <div id="admin_params_tab" class="config_tab">Administration</div>
			         </td></tr>
			         <tr id="config_values_tr"><td>
			           <div id="global_params_div" class="params_div_wrap">
			            <table id="global_params_2_col_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width: 100%;">
			              <tr>
			               <td id="params_innner_table_tdw">
				            <div class="params_innner_table_header_div">Please update your buisness information</div>			               
				            <table class="params_innner_table"  cellspacing="0" cellpadding="0" style="border-collapse:collapse">
				               <tr style="height:0px;overflow-y:visible"><td></td><td></td>
				                  <td rowspan=9 class="row7">
				                        <div id="upload_logo_btn" onclick="fileUpload('user_logo_upload')">Upload logo (100px)</div>
										<div id="canvas_logo_w" title="Upload LOGO" onclick="fileUpload('user_logo_upload')" style="cursor:pointer">
										  <canvas id="upload_logo_canvas" width="100" height="100"></canvas>
										</div>
										<div id="map_div_config">
										  <div id="open_map_tag"  onclick="openMap()">show map</div>
										  <img width="140" height="140" src="/img/map_tumb.png" class="map_thumpb_config" onclick="openMap()"/>
						                 </div>
						                <input type="file" id="user_logo_upload" style="display:none;"/>
				                        <img id="uploaded_logo_canvas_source_100" style="display:none"/>
										<img id="uploaded_logo_temp" style="display:none"/>
				                  </td>
				               </tr>
				               
				               <tr><td class="conf_param_name">Place Name<span class="necessarily_star">&nbsp;*</span></td>
				                   <td><input id="config_place_name" class="conf_param_input" value="<%=placeName%>"/></td></tr>
				               <tr><td class="conf_param_name">Branch Name<span class="necessarily_star">&nbsp;*</span></td>
				                   <td><input id="config_branch_name" class="conf_param_input" value="<%=placeBranchName%>"/></td></tr>
				               <tr><td class="conf_param_name">Address<span class="necessarily_star">&nbsp;*</span></td>
				                   <td><input id="config_address" class="conf_param_input" value="<%=placeAddress%>"/></td></tr>
				               <tr><td class="conf_param_name">Phone<span class="necessarily_star">&nbsp;*</span></td>
				                   <td><input id="config_phone" class="conf_param_input" value="<%=placePhone%>"/></td></tr>
				               <tr><td class="conf_param_name">Fax</td>
				                   <td><input id="config_fax" class="conf_param_input" value="<%=placeFax%>"/></td></tr>
							   <tr><td class="conf_param_name">Mail</td>
				                   <td><input id="config_mail" class="conf_param_input" value="<%=placeMail%>"/></td></tr>
				               <tr><td class="conf_param_name">Site url</td>
				                   <td><input id="config_siteurl" class="conf_param_input" value="<%=placeSiteUrl%>"/></td></tr>
				               <tr><td class="conf_param_name">Brief description</td>
				                   <td><textarea  id="config_brief_text" value="'<%=placeDescription%>"><%=placeDescription%></textarea></td></tr>			             
				            </table>
			            </td>
			            <td style="width:10px!important"></td>
			            <td id="image_innner_table_tdw">
							<div class="params_innner_table_header_div">Upload images of your buisness</div>
							 <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
							   <tr ><td><div id="upload_image_conf_btn" onclick="fileUpload('hidden_image_upload')">Upload Image (Max 1Mb)</div></td></tr>
							   <tr><td>
							      <div id="upload_conf_img_append_show"  >
							         <div id="no_image_upload_conf" onclick="fileUpload('hidden_image_upload')">
							            <div id="image_upload_btn_config">
							                <div class="material-icons image_upload_btn_config_mat">cloud_upload</div>
							                <div class="uptext_">UPLOAD IMAGE</div>
							            </div>
							         </div>
								  </div>
								  <div id="hidden_img_uploads" style="display:none"></div>
								  <img id="uploaded_image_temp" style="display:none"/>
				                  <input type="file"  id="hidden_image_upload" style="display:none"></input>
							   </td></tr>
							 </table>
						  </td>
						  </tr>
						 </table>
			           </div>
			           <div id="bookable_params_div"  class="params_div_wrap" style="display:none">
					    <div class="params_innner_table_header_div">Review and update "bookable" objects</div>
						 <table id="conf_bookable_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
						   <tr style="vertical-align:top">
						     <td id="canvas_view_td_b" rowspan="2">
						
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
								    <div id="zoom_reset_div" onclick="zoomReset()"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>
								 </div>
							   <div id="canvas_wrap_not_scroll_conf" >							    
								    <% 
								      for (PPSubmitObject floor : canvasStateList) {
								    	   String floorid = floor.getFloorid();
								    	   String display="none";
								    	   if(floor.isMainfloor()) {display="";}
								    	   %>
											  <canvas id="canvas_<%=floorid%>" style="display:<%=display%>"width="400" height="400"  tabindex='1' class="cmenu2 main_conf" >
												This text is displayed if your browser does not support HTML5 Canvas.
											  </canvas>
								   <%} %>								
							   </div>
							</div>
							</td>
							<td id="selected_shapes_td_b"><div id="selected_shapes_div_b">Select shape(s) to configure</div></td>
						  </tr>
						  <tr >
						    <td style="display: block;">
							<div id="shapes_configuration_append_div" >

							</div>
						  </td>
						  </tr>
						 </table>
			           </div>
					   <div id="calendar_params_div"  class="params_div_wrap" style="display:none">
					     <div class="params_innner_table_header_div">Please set week days & time your place open
							 <div class="conf_show_hide" id="calendar_hide">hide</div>
							 <div class="conf_show_hide" id="calendar_show" style="display:none">open</div>
						 </div>
					   		<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;" id="week_cal_table">
			                  <tr><td class="cal_top left_ct" width="100">Week day</td>
							      <td class="cal_top left_ct" width="70">Open?</td>
								  <td class="cal_top left_ct" width="200">From-To</td>
								  <td class="cal_top left_ct" width="450">Open hours</td>
								  <td class="cal_top left_ct" width="140">Place view</td>
							  </tr>
			                  <tr class="row_g_odd"><td>Sunday</td> 
                                  <td><input type="checkbox" id="pbook_sun_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
							      <td><div id="config_from_to_sun"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_sun"  style="width:400px;"></div></td>
							      <td ><select  id="view_selector_sun"></select></td></tr>
							  <tr class="row_g_even"><td>Monday</td> 
                                  <td><input type="checkbox" id="pbook_mon_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
							      <td><div id="config_from_to_mon"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_mon"  style="width:400px;"></div></td>
							      <td><select  id="view_selector_mon"></select></td></tr>
							  <tr class="row_g_odd"><td>Tuesday</td> 
                                  <td><input type="checkbox" id="pbook_tue_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
							      <td><div id="config_from_to_tue"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_tue"  style="width:400px;"></div></td>
							      <td><select  id="view_selector_tue"></select></td></tr>
							  <tr class="row_g_even"><td>Wednesday</td> 
                                  <td><input type="checkbox" id="pbook_wed_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
							      <td><div id="config_from_to_wed"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_wed"  style="width:400px;"></div></td>
							      <td><select  id="view_selector_wed"></select></td></tr>
							  <tr class="row_g_odd"><td>Thursday</td> 
                                  <td><input type="checkbox" id="pbook_thu_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
							      <td><div id="config_from_to_thu"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_thu"  style="width:400px;"></div></td>
							      <td><select  id="view_selector_thu"></select></td></tr>
							  <tr class="row_g_even"><td>Friday</td> 
                                  <td><input type="checkbox" id="pbook_fri_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
							      <td><div id="config_from_to_fri"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_fri"  style="width:400px;"></div></td>
							      <td><select  id="view_selector_fri"></select></td></tr>
							  <tr class="row_g_odd"><td>Saturday</td> 
                                  <td><input type="checkbox" id="pbook_sat_cb" class="css-checkbox config_checkbox_place" checked="checked" name="week_checkbox_place"/></td>
			                      <td><div id="config_from_to_sat"></div></td>
							      <td class="configuration_irs"><div id="open_time_slider_sat"  style="width:400px;"></div></td>
							      <td><select  id="view_selector_sat"></select></td></tr>
			                </table>
							<div class="params_innner_table_header_div">Set Dates your place will be closed</div>
							<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
			                  <tr><td style=" width: 200px; vertical-align: top;">
							      Select date: <input id="close_datepicker" type="text" />
								 </td>
								 <td>
								   <div id="chosen_closed_dates">
								   </div>
								 </td>
							   </tr>
							</table>
					   </div>
					   <div id="admin_params_div" class="params_div_wrap" style="display:none">
					     <table id="admin_param_top_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
						   <tr>
						    <td style="width:50%;vertical-align: top;">
			                  <div class="params_innner_table_header_div">Place Edit Administration</div>
							  <div class="param_text_parag">Next users have admin access to place Configuration :</div>
							  <!-- SERVLET RESPONSE -->
							  <table id="pea_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
							    <tr  class="pea_top_row">
								   <td class="peat_ pe width40p" >User mail</td>
								   <td class="peat_ pe width12p" >Full Access</td>
								   <td class="peat_ pe width12p" >Edit place</td>
								   <td class="peat_ pe width12p" >Move only</td>
								   <td class="peat_ pe width12p" >Book</td>
                                   <td class="peat_  width12p" >Delete</td>								   
								</tr>
								<tr class="pea_user_row"><td colspan=6>
<%
String sessionEmail = (String) request.getSession().getAttribute("userEmail"); 
List<AdminUser> adminList = responseJSON.getPlaceEditList();
%>
								 <div id="peat_append" style="width:100%">
<% for(AdminUser user : adminList)  {
	    if(user.getMail().equals(sessionEmail)) {%>							 
								  <table name="table_peat_append"  class="peat_single" id="peat_<%=sessionEmail%>" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
								   <tr class="peat_user_row_">
								   <td class="width40p"><div class="peat_val_user" id="peat_mail_<%=sessionEmail%>"><%=sessionEmail%></div></td>
								   <td  class="peat_cb width12p"><img src="img/vlogo2.png" width=20 height=20/></td>
								   <td  class="peat_cb width12p"><img src="img/vlogo2.png" width=20 height=20/></td>
								   <td  class="peat_cb width12p"><img src="img/vlogo2.png" width=20 height=20/></td>
								   <td  class="peat_cb width12p"><img src="img/vlogo2.png" width=20 height=20/></td>
								   <td  class="peat_cb width12p">You</td>
								  </tr>								  
								  </table>
								  <div style="display:none">
									  <div class="peat_val_user" id="peat_mail_<%=user.getMail()%>"><%=user.getMail()%></div>
								      <input name="peat_cb" type="checkbox" id="peat_cb_fa_<%=user.getMail()%>"   checked />
							          <input name="peat_cb" type="checkbox" id="peat_cb_ep_<%=user.getMail()%>"   checked />
							          <input name="peat_cb" type="checkbox" id="peat_cb_mo_<%=user.getMail()%>"   checked />
							          <input name="peat_cb" type="checkbox" id="peat_cb_ba_<%=user.getMail()%>"   checked />						  
								  </div>
	<%} else { 
		 String fa = user.isFull_access()?"checked":"";
	     String ep = user.isEdit_place()?"checked":"";
	     String mo = user.isMove_only()?"checked":"";
	     String ba = user.isBook_admin()?"checked":"";	
	%>
	     
		 <table name="table_peat_append" class="peat_single" id="peat_<%=user.getMail()%>" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
		   <tr class="peat_user_row_">
	         <td class="width40p"><div class="peat_val_user" id="peat_mail_<%=user.getMail()%>"><%=user.getMail()%></div></td>
	         <td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_fa_<%=user.getMail()%>" class = "peat_checkbox" <%=fa %> /></td>
             <td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ep_<%=user.getMail()%>" class = "peat_checkbox" <%=ep %> /></td>
             <td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_mo_<%=user.getMail()%>" class = "peat_checkbox" <%=mo %> /></td>
             <td  class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ba_<%=user.getMail()%>" class = "peat_checkbox" <%=ba %> /></td>
             <td  class="peat_cb width12p"><div id="peat_delete_'+mail+'" class="peat_delete" onclick="peat_delete(\'<%=user.getMail()%>\')">Delete</div></td>
           </tr>
       </table>
	
	<%}
	    
   }%>
								 </div>
								</td></tr>
								<tr><td colspan=6 class="add_user_peat_td_text">Add new user</td></tr>
								<tr><td  colspan=6 >
								 <div id="peat_add" style="width:100%">
								  <table  id="peat_peat_add" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;"><tr>
								   <td class="width40p"><input type="text" id="peat_add_mail" placeholder="User mail"/></td>
								   <td class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_fa_add" class = "peat_checkbox" checked /></td>
								   <td class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ep_add" class = "peat_checkbox"  /></td>
								   <td class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_mo_add" class = "peat_checkbox"  /></td>
								   <td class="peat_cb width12p"><input name="peat_cb" type="checkbox" id="peat_cb_ba_add" class = "peat_checkbox"  /></td>
								   <td class="peat_cb width12p"><div id="peat_add_btn" class="peat_add" onclick="peat_add(false)">Add</div></td>
								  </tr>
								  </table>
								 </div>                                  
                                </td></tr>								
							  </table>
							</td>
							<td style="width:20px!important;display: inline-block;"></td>
							<td style="width:50%;vertical-align: top;">
						      <div class="params_innner_table_header_div">Booking approval policy</div>
							  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
							    <tr><td class="bp_radio_td"><input type="radio" class="book_policy" name="book_policy" id="bp_auto" checked/><label for="bp_auto"><span class="outer"></span><span class="inner"></span></td>
								    <td id="bp_auto_text" class="bp_t_selected">Automatic approval</td>
							         <td class="bp_radio_td"><input type="radio" class="book_policy" name="book_policy" id="bp_admin" /><label for="bp_admin"><span class="outer"></span><span class="inner"></span></td>
								    <td id="bp_admin_text">Admin approval <span class="small_bp"></span></td></tr>
								<tr><td colspan=4>
								  <div id="bp_auto_wrap" >
                                     <div class="bp_text" > Mail notification on place booking will be sent to the next recepient(s)</div>
									 <div id="bp_auto_mail_recipients">

									 </div>
									 <div id="add_auto_mail_">
									  <input id="auto_mail_input"/>
									  <div id="add_auto_mail_btn" onclick="add_auto_recepient(false)">Add recipient</div>
									 </div>
								  </div>								    
								  <div id="bp_admin_wrap" style="display:none">
                                     <div class="bp_text" > Approval request will be sent to the next recepient(s)</div>
									 <div id="bp_admin_mail_recipients">

									 </div>
									 <div id="add_admin_mail_">
									  <input id="admin_mail_input"/>
									  <div id="add_admin_mail_btn" onclick="add_admin_recepient(false)">Add recipient</div>
									 </div>
								  </div>
								</td></tr>
							  </table>
						    </td>
							</tr>
						 </table>
					   </div>
			         </td></tr>
			       </table>			      
			     </td>
			   </tr>			  
			  </table>
	        </td>
		</tr>
		</table>		  
	  <div id="logs_row" style="display:none;">
	      <div id = "logs_window" > </div>
	  </div>
    </div>
   </td>
   </tr>
   <tr id="footer_tr" style="display:none">
     <td id="footer_td">
	  <div id = "footer"  style="display:none"> Belousov Dmitry</div>
     </td>
   </tr>
  </table>
  </body>
</html>