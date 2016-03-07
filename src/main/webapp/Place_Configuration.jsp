<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"
		 import = "com.dimab.pp.dto.ConfigurationObject"
		 import = "com.dimab.pp.dto.PPSubmitObject"
		 import = "com.dimab.pp.dto.JsonSID_2_imgID"
		 import = "com.dimab.pp.dto.JsonImageID_2_GCSurl"
		 import = "com.dimab.pp.dto.CanvasState"
		 import = "com.dimab.pp.dto.JsonimgID_2_data"
		 import = "java.util.List"%>
<%@ page import="com.dimab.pickoplace.utils.JsonUtils" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>


<!DOCTYPE html>

<html >
<head>
	<script type="text/javascript" src="/js/jquery-1.11.1.min.js"></script>
	<common:baseStyles/>
	<common:eachPageStyles/>
	<common:baseSyncScripts/>
	<common:eachPageScripts/>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Place Configuration</title>
	<script type="text/javascript">
		var pagetype = 'place_config';
	</script>

	<link rel="stylesheet" href="js/bootstrap-toggle-master/css/bootstrap-toggle.min.css">
	<link rel='stylesheet' href='js/fullcalendar-2.6.0/fullcalendar.min.css' />
	<link rel='stylesheet' href='js/intl-tel-input-master/build/css/intlTelInput.css' />

	<link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>

	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />


	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />


	<script type="text/javascript" src="/js/bootstrap/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.4.date.autoc.slider/jquery-ui.js"></script>

	<!--<script type="text/javascript" src="js/jquery-ui-1.11.4.custom/jquery-ui.js"></script>-->
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/colpick.js" ></script>
	<script src="js/bootstrap-toggle-master/js/bootstrap-toggle.min.js"></script>
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>



	<script type="text/javascript" src="js/moment.min.js"></script>
	<script type="text/javascript" src='js/fullcalendar-2.6.0/fullcalendar.min.js'></script>
	<script type="text/javascript" src="js/intl-tel-input-master/build/js/intlTelInput.min.js"></script>



	<script type="text/javascript" src="js/shapes_pc.js"></script>
	<script type="text/javascript" src="js/pcController.js"></script>
	<script type="text/javascript" src="js/pcDrawService.js"></script>
	<script type="text/javascript" src="js/wl_menu_pc.js"></script>
	<script type="text/javascript" src="js/printlog_pc.js"></script>
	<script type="text/javascript" src="js/updateData_pc.js"></script>
	<script type="text/javascript" src="js/bookingOptions_pc.js"></script>
	<script type="text/javascript" src="js/interactiveUpdate_pc.js"></script>


	<!-- IFRAME -->
	<script type="text/javascript" src="js/shapes_fe.js"></script>
	<script type="text/javascript" src="js/wl_menu_if.js"></script>
	<script type="text/javascript" src="js/iframe_Controller.js"></script>
	<script type="text/javascript" src="js/iframe_viewService.js"></script>
	<script type="text/javascript" src="js/bookingBookingsManger.js"></script>
	<script type="text/javascript" src="js/interactiveUpdate_if.js"></script>
	<!-- IFRAME -->

	<script type="text/javascript"
			src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">
	</script>
	<script type="text/javascript" src="js/maps_google.js"></script>

	<script type="text/javascript" src="js/updateCanvasData.js"></script>
	<script type="text/javascript" src="js/documentEventListeners.js"></script>
	<script type="text/javascript">



		function editPlace(placeID_form) {
			setSessionData(function(result) {
				if(result) {
					document.getElementById(placeID_form).submit();
				}
			});
		}
		var mainOverviewID;
		var gcanvas ;

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

			updateFloorWrapDimentionsPC();
			updateCanvasData();
			updateCanvasDataForIFrame();
			// Update Place General Info
			updatePhotosAndLogo();
			updateCloseDates();
			updateWorkingHours();
			updateTopViewList();

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

	</script>
</head>
<%
	ConfigurationObject configuration = (ConfigurationObject)request.getAttribute("configuration");
	List<PPSubmitObject> canvasStateList = configuration.getFloors();
	List<JsonSID_2_imgID> sid2imgID = configuration.getJSONSIDlinks();
	List<JsonImageID_2_GCSurl> imgID2URL = configuration.getJSONimageID2url();
	String placeName = configuration.getPlaceDetails().getGeneral().getPlaceName();
	String placeBranchName = configuration.getPlaceDetails().getGeneral().getBranchName();
	String userRandom = configuration.getUsernameRandom();
	String placeID = configuration.getPlaceID();
	String placePhone = configuration.getPlaceDetails().getGeneral().getPlacePhone();
	String placeFax = configuration.getPlaceDetails().getGeneral().getPlaceFax();
	String placeMail = configuration.getPlaceDetails().getGeneral().getPlaceMail();
	String placeDescription = configuration.getPlaceDetails().getGeneral().getPlaceDescription();
	String placeSiteUrl = configuration.getPlaceDetails().getGeneral().getPlaceURL();
	String placeAddress = configuration.getPlaceDetails().getGeneral().getAddress();
	String placeLat = configuration.getPlaceDetails().getGeneral().getLat();
	String placeLng = configuration.getPlaceDetails().getGeneral().getLng();
	double    placeUTSoffset = configuration.getPlaceDetails().getGeneral().getUTCoffset();
%>
<body  style="margin: 0px; ">

<div id="frame_prev_wrap" style="display:none" >
	<div id="frame_prev_wrap_popup_content" >
		<table id="iframe_loader" cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse;display:none"><tr><td><img  style="width: 100px;" src="img/gif/ajaxSpinner.gif" /></td></tr></table>
		<div id="frame-canvas" ></div>
		<img class="close_map_icon" src="img/icon-close35.png" onclick="closeIframe()"/>
	</div>
</div>

<div id="calendar_popover_hidden" class="hidden">
	<div id="calendar_popover_wrap" style="position:relative; width:300px;min-height:100px; background-color:white;">

	</div>
</div>
<div id="canvas_popover_hidden" class="hidden">
	<div id="canvas_popover_wrap" style="position:relative; width:300px;min-height:100px; background-color:white;">

	</div>
</div>
<div id="iframe_popover_hidden" class="hidden">
	<div id="iframe_popover_wrap" style="position:relative; width:300px;min-height:100px; background-color:white;">

	</div>
</div>
<div id="calendar_popover" style="position:absolute"  data-toggle="popover"></div>
<div id="list_popover" style="position:absolute"  data-toggle="popover"></div>
<div id="iframe_popover" style="position:absolute"  data-toggle="popover"></div>

<div class="modal fade" id="booking_order_modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header hazmana_mh" >
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="booking_order_modal_title">
					הזמנה שלי
				</h4>
			</div>
			<div class="modal-body">
				<div id="booking_order_modal_body"   >
					<div class="row hz_mt"  >
						<div class="col-md-12">זמן</div>
					</div>
					<div class="row" id="time_order_row_val">
						<div class="col-md-12"><span class="hz_date">4 February</span>, 21:30 - 22:00</div>
					</div>
					<div class="row hz_mt" id="hz_mt">
						<div class="col-md-12">מקומות שנבחרו</div>
					</div>
					<div class="row" id="hz_mt_top">
						<div class="col-md-2"></div>
						<div class="col-md-3">קומה</div>
						<div class="col-md-3">אנשים</div>
						<div class="col-md-3">מקום</div>
						<div class="col-md-1"></div>
					</div>
					<div id="modal_sid_lines">

					</div>
				</div>
			</div>
			<div class="row hz_mt" style="margin-right: 0px;margin-left: 0px;" >
				<div class="col-md-12">בקשות מיוחדות</div>
			</div>
			<div class="input-group" id="user_bakashot" >
				<input type="text" class="form-control" id="user_input_hz" placeholder="תקסט חופשי" aria-describedby="basic-addon2">
				<span class="input-group-addon" id="basic-addon2"><i class="material-icons" style="color: white;">edit</i></span>
			</div>
			<div class="modal-footer "  id="hz_footer">
				<div id="book_sign_ask">
					Login
				</div>
				<div id="book_logged_in_as"><div class="dsdfs">Logged in as: </div><div id="login_info_resp_db" Title="LogOut" class="userNikname left_p" onclick="logoutAny()">Dmitry</div></div>
				<div   id="make_booking" class="make_booking" onclick="makeBooking();" style="display:none">
					<div class="heb_btn_mat material-icons ">done</div>
					<div class="heb_btn_text">הזמן</div>
				</div>
				<div id="loading_text_w" style="display: none">
					<div id="loading_text_">הזמנה בביצוע</div>
					<img id="booking_ajax_preloader" src="img/gif/preloader2.gif"/>
				</div>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="map_wrapper"  style="display:none;">
	<div id="map_popup_content">
		<div id="map-canvas"></div>
		<img class="close_map_icon" src="img/icon-close35.png" onclick="closeMap()"/>
	</div>
</div>
<div id="config_save_prompt" class="save_prompt" style="display:none;">
	<div class="config_save_prompt_inner" >
		<table class="config_save_prompt_tbl" cellspacing="0" cellpadding="0" style="width:100%;height: 100%; border-collapse:collapse">
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
		<table class="config_save_prompt_tbl" cellspacing="0" cellpadding="0" style="width:100%;height: 100%; border-collapse:collapse">
			<tr><td colspan=3 class="confirm_message">Save configuration ?</td></tr>
			<tr>
				<td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_yes" onclick="saveBeforeIFrame()">Save</div></td>
				<td class="confirm_message_btn_td"><div title="Proceed to editing without configuration saving" class="confirm_message_btn confirm_message_no" onclick="IFrameWithoutSave()">No</div></td>
				<td class="confirm_message_btn_td"><div class="confirm_message_btn confirm_message_cancel" onclick="promptCancel('config_save_prompt_iframe')">Cancel</div></td>
			</tr>
		</table>
	</div>
</div>
<div id="hiden_values_from_edit" style="display:none">
	<canvas id="filtered_canvas"></canvas>
	<img id="filtered_img"/>
	<input type="text" id="server_shapes_prebooked"/>
	<input type="file" id="user_logo_upload" style="display:none;"/>
	<img id="uploaded_logo_canvas_source_100" style="display:none"/>
	<img id="uploaded_logo_temp" style="display:none"/>
	<div id="baw_images">

	</div>
	<img id="2px_grey" src='img/2px_line_grey.png'>
	<img id="2px_green" src='img/2px_line_green.png'>
	<img id="2px_red" src='img/2px_line_red.png'>
	<img id="1px_grey" src='img/1px_line_grey.png'>
	<img  id="server_v_logo" src="img/vlogo2.png"/>

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
	<input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState" value='<%=JsonUtils.serialize(floor)%>'/>
	<img    id="server_background_<%=floorid %>" crossorigin="anonymous" name="server_background" src="<%=backgroundURL%>"/>
	<img  id="server_overview_<%=floorid %>" name="server_overview" src="<%=overviewURL%>"/>
	<input type="text" id="server_floor_name_<%=floorid %>" value="<%=floor.getFloor_name() %>"/>
	<canvas id="canvas_tmp_<%=floorid %>"></canvas>
	<%if (floor.isMainfloor()) { %>
	<input type="text" id="main_overview_url_id" value="server_overview_<%=floorid %>"/>
	<%} %>
	<% }%>




	<% if (sid2imgID!=null && !sid2imgID.isEmpty()) {%>
	<input type="text" id="server_sid2imgID" value='<%=JsonUtils.serialize(sid2imgID)%>'/>
	<%} %>


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
	<input type="text" id="server_iFrameID" value=""/>

	<input type="text" id="server_workinghours" value='<%=JsonUtils.serialize(configuration.getWorkinghours().getWorkingWeek())%>'/>
	<input type="text" id="server_closeDates" value='<%=JsonUtils.serialize(configuration.getWorkinghours().getCloseDates())%>'/>
	<input type="text" id="server_logosrc" value='<%=configuration.getPlaceDetails().getPhotos().getLogosrc()%>'/>


	<%for ( JsonimgID_2_data imgID2byte64 : configuration.getPlaceDetails().getPhotos().getPlacePhotos()) {
		String imgID = imgID2byte64.getImageID();
	%>
	<input type="text" id="server_imap_<%=imgID %>" name="server_imap" value='<%=JsonUtils.serialize(imgID2byte64)%>'/>
	<% }%>

	<% if (imgID2URL != null && !imgID2URL.isEmpty()) {
		for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>
	<img id="server_<%=img2url.getImageID() %>" crossorigin="anonymous" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
	<%      }
	}%>

	<input  id="address_hidden_lat" name="address_hidden_lat" style="display: none;">
	<input  id="address_hidden_lng" name="address_hidden_lng" style="display: none;">
	<input  id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">

	<div id="hidden_views" style="display:none">
		<div id="top_view_div" style="display:none">
			<div id="canvas_td" class="mr10">
				<div id="floor_selector_div">
					<select id="floor__selector">
					</select>
				</div>
				<div id="zoom_options_book">

					<div id="plus_minus_wrap">
						<div id="zoom_plus_div" onclick="sizeUp()" title="Zoom-In">+</div>
						<div id="zoom_split"></div>
						<div id="zoom_minus_div" onclick="sizeDown()" title="Zoom-Out">-</div>
					</div>
					<div id="zoom_reset_div" onclick="zoomResetWrap(canvas_,600,400)">
						<div class="material-icons zoom_reset_mat" title="Zoom-Reset">fullscreen</div>
					</div>

				</div>
				<div id="canvas_wrap_not_scroll_conf">

					<%
						for (PPSubmitObject floor : canvasStateList) {
							String floorid = floor.getFloorid();
							String display="";
					%>
					<div id="div_wrap-canvas_<%=floorid%>"    class="canvas_floor_wrap">
						<canvas id="canvas_<%=floorid%>" width="400" height="400"  tabindex='1' class="cmenu2 main_conf" >
							This text is displayed if your browser does not support HTML5 Canvas.
						</canvas>
					</div>
					<%} %>

				</div>
				<div id="canvas_wrap_not_scroll_conf_if">

					<%
						for (PPSubmitObject floor : canvasStateList) {
							String floorid = floor.getFloorid();
							String display="";
					%>
					<div id="if_div_wrap-canvas_<%=floorid%>"    class="canvas_floor_wrap">
						<canvas id="if_canvas_<%=floorid%>" width="400" height="400"  tabindex='1' class="cmenu2 main_conf" >
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
		<canvas width="200" height="200" id="translated_user_images_canvas" style="display:none"></canvas>
		<div id="bg_default_img_mirror" style="display:none">
			<canvas id="default_img_canvas"></canvas>
			<img id="default_bg_image_mirror"/>
		</div>
		<div id="canvas_shapes_images" style="display:none;"></div>
		<div class="size_value"><input id="canvas_w" type="text" value="400"/></div>
		<div class="size_value"><input id="canvas_h" type="text" value="400"/></div>
		<div id="history_images_wrapper"></div>
		<canvas id="text_width_calculation_canvas" width="10" height="10" style="display:none"></canvas>
		<canvas id="tcanvas" width="384" height="30"></canvas>
	</div>
	<div class="outer_width100">
		<div class="creatingTourText" style="display:none">
			<span class="steps"></span> Booking : <span class="placeNamespan">
	        	        'test' ,Booking'
	        	      </span>
		</div>
		<input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
		<input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
		<input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeID %>' style="display:none"/>

	</div>
	<div id="right_col_ub" style="display:none">
		<div id="right_col_scroll">
			<div class="chosed_img ">
				<div class="dummy"></div>
				<div class="img-container">
					<img id="chosed_background">
				</div>
			</div>
			<div id="chosed_background_orig_wrap" style="display:none">
				<img id="chosed_background_orig" style="display:none"/>
			</div>
			<div class="chosed_img ">
				<div class="dummy"></div>
				<div class="img-container">
					<img id="chosed_image"/>
				</div>
			</div>
			<img id="mirror" style="display:none"/>

			<div class="chosed_canvas chosed_img">
				<canvas id="show_canvas" width="150" height="150"></canvas>
			</div>
		</div>
	</div>
</div>
<div id="page_container">
	<div id="header_td_div" class="main_page_header relative_header">
		<div id="header" >
			<div id="logo_"><img src="img/pplogomarker.png" id="pplogoo"/><div id="logotext">ickoplace</div></div>

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

			<div class="languageSelectorTag">
				<common:languageSelector/>
			</div>
		</div>

	</div>
	<div id="page_content">
		<div id="pc_buttons">
			<div id="save_pc" class="material-icons" data-toggle="tooltip"   data-placement="bottom" title="שמור הגדרות"  onclick="SIsaveState()">save</div>
			<div id="go_to_edit_pc" class="material-icons"  data-toggle="tooltip"   data-placement="bottom" title="צייר">create</div>
		</div>
		<div id="pc_menu_column">
			<div id="pc_menu_header">
				<div class="material-icons pc_mat_menu">menu</div><div class="menu_pc_text">תפריט הגדרות</div>
			</div>
			<div id="pc_vertical_nav">
				<div class="pc_vertical_nav pc_vertical_nav_selected" id="pcnav_main">
					<div class="material-icons pcnav_mat">home</div>
					<div class="pc_nav_text pc_nav_text_heb">פרטי מקום</div>
				</div>
				<div class="pc_vertical_nav " id="pcnav_hours">
					<div class="material-icons pcnav_mat">alarm</div>
					<div class="pc_nav_text pc_nav_text_heb">שעות פעילות</div>
				</div>
				<div class="pc_vertical_nav" id="pcnav_seat">
					<div class="material-icons pcnav_mat">event_seat</div>
					<div class="pc_nav_text pc_nav_text_heb">מקומות ישיבה</div>
				</div>
				<div class="pc_vertical_nav" id="pcnav_orders">
					<div class="material-icons pcnav_mat">exit_to_app</div>
					<div class="pc_nav_text pc_nav_text_heb">הזמנות</div>
				</div>
				<div class="pc_vertical_nav" id="pcnav_admin">
					<div class="material-icons pcnav_mat">person</div>
					<div class="pc_nav_text pc_nav_text_heb">אדמיניסטרציה</div>
				</div>
				<div class="pc_vertical_nav" id="pcnav_iframe">
					<div class="material-icons pcnav_mat">settings_overscan</div>
					<div class="pc_nav_text pc_nav_text_heb"><span class="enginheb">iFrame</span> הגדרת</div>
				</div>
				<!-- <div class="pc_vertical_nav" id="pcnav_pictures">
                   <div class="material-icons pcnav_mat">camera_alt</div>
                   <div class="pc_nav_text pc_nav_text_heb">תמונות</div>
                 </div>-->
				<div id="iframe_nav_explain" >
					בעזרת טכנולוגיית
					&nbsp;iFrames&nbsp;
					ניתן להגדיר תצוגה רצוייה של העסק ולהוסיף קישור לכל אתר אחר (שונה מ
					&nbsp;pickoplace.com&nbsp;
					.
					לדוגמה להוסיף מערכת הזמנות לאתר הבית או עמוד פייסבוק
					.
				</div>
			</div>
		</div>
		<div id="data_windows_column">
			<!-- MAIN -->
			<div class="pc_data_page" id="pcdata_main">
				<div class="container-fluid">
					<div class="pc_data_page_header">
						<div class="material-icons pcdata_mat">home</div>
						<div class="pcdata_text ">פרטי מקום</div>
						<div class="data_nav_wrap">
							<ul class="nav nav-pills ">
								<li class="active floatright"><a href="#main_clali">כללי</a></li>
								<li class="floatright"><a href="#main_images_">תמונות</a></li>
							</ul>
						</div>
					</div>
					<div class="tab-content">
						<div id="main_clali" class="tab-pane fade in active">
							<div class="data_content_header">הגדר כאן את פרטי המקום</div>
							<div class="container-fluid inputs_container">

								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"><span class="necessarily_star">&nbsp;*</span><div class="pc_param_name pc_param_heb">שם העסק</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_place_name" class="conf_param_input"  value="<%=placeName%>" /></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"><span class="necessarily_star">&nbsp;*</span><div class="pc_param_name pc_param_heb">שם הסניף</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_branch_name" class="conf_param_input"   value="<%=placeBranchName%>"/></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"><span class="necessarily_star">&nbsp;*</span><div class="pc_param_name pc_param_heb">כתובת</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_address" class="conf_param_input"   value="<%=placeAddress%>"/></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"><span class="necessarily_star">&nbsp;*</span><div class="pc_param_name pc_param_heb">טלפון</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_phone" class="conf_param_input"  value="<%=placePhone%>"/></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"> <div class="pc_param_name pc_param_heb">פקס</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_fax" class="conf_param_input" value="<%=placeFax%>" /></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"><span class="necessarily_star">&nbsp;*</span><div class="pc_param_name pc_param_heb">דואר אלקטרוני</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_mail" class="conf_param_input"  value="<%=placeMail%>" /></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"> <div class="pc_param_name pc_param_heb">אתר העסק</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><input id="config_siteurl" class="conf_param_input" value="<%=placeSiteUrl%>"/></div>
								</div>
								<div class="row input_pc_row">
									<div class="col-md-3 col-md-push-9 pc_var_name"> <div class="pc_param_name pc_param_heb">הסבר קצר על המקום</div></div>
									<div class="col-md-3 col-md-push-3 pc_var_val"><textarea id="config_brief_text" class="conf_param_input"  value="<%=placeDescription%>"><%=placeDescription%></textarea></div>
								</div>
							</div>

						</div>
						<div id="main_images_" class="tab-pane fade">
							<div class="container-fluid">
								<div class="row">
									<div class="data_content_header">לוגו של העסק</div>
								</div>
								<div class="row">
									<div id="logo_upload_wrapper">
										<div id="canvas_logo_w" title="Upload LOGO" onclick="fileUpload('user_logo_upload')" style="cursor:pointer">
											<div class="material-icons adlogo_mat">add_a_photo</div>
											<canvas id="upload_logo_canvas" width="100" height="100"></canvas>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="data_content_header">תמונות של העסק</div>
								</div>
								<div class="row">
									<div id="upload_conf_img_append_show"  >
										<div id="no_image_upload_conf" onclick="fileUpload('hidden_image_upload')">
											<div class="material-icons image_upload_btn_config_mat">add_a_photo</div>
										</div>
										<div id="hidden_img_uploads" style="display:none"></div>
										<img id="uploaded_image_temp" style="display:none"/>
										<input type="file"  id="hidden_image_upload" style="display:none">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- HOURS -->
			<div class="pc_data_page" id="pcdata_hours" style="display:none">
				<div class="container-fluid">
					<div class="pc_data_page_header">
						<div class="material-icons pcdata_mat">alarm</div>
						<div class="pcdata_text ">שעות פעילות</div>
						<div class="data_nav_wrap">
							<ul class="nav nav-pills ">
								<li class="active floatright"><a href="#hours_hours">שעות עבודה</a></li>
								<li class="floatright"><a href="#hours_close_days" id="calendar_tab_a" data-toggle="tab">ימים סגורים</a></li>
							</ul>
						</div>
					</div>
					<div class="tab-content">
						<div id="hours_hours" class="tab-pane fade in active">
							<div class="container-fluid">
								<div class="row">
									<div class="data_content_header" style=" margin-top: 20px; margin-bottom: 20px;">בחר ימים ושעות בהם המקום פתוח להזמנות</div>
								</div>
								<div class="row"><div class="col-md-12">
									<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;" id="week_cal_table">
										<tr id="week_table_header">
											<td class="cal_top left_ct" width="100">יום בשבוע</td>
											<td class="cal_top left_ct" width="70">פתוח/סגור</td>
											<td class="cal_top left_ct" width="150">שעות</td>
											<td class="cal_top left_ct" width="350">שעות פתוחות</td>
										</tr>
										<tr class="row_g_odd"><td>Sunday</td>
											<td>
												<input type="checkbox" id="pbook_sun_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_sun" class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_sun"  style="width:400px;"></div></td>
										</tr>
										<tr class="row_g_even"><td>Monday</td>
											<td><input type="checkbox" id="pbook_mon_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_mon"  class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_mon"  style="width:400px;"></div></td>
										</tr>
										<tr class="row_g_odd"><td>Tuesday</td>
											<td><input type="checkbox" id="pbook_tue_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_tue"  class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_tue"  style="width:400px;"></div></td>
										</tr>
										<tr class="row_g_even"><td>Wednesday</td>
											<td><input type="checkbox" id="pbook_wed_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_wed"  class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_wed"  style="width:400px;"></div></td>
										</tr>
										<tr class="row_g_odd"><td>Thursday</td>
											<td><input type="checkbox" id="pbook_thu_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_thu"  class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_thu"  style="width:400px;"></div></td>
										</tr>
										<tr class="row_g_even"><td>Friday</td>
											<td><input type="checkbox" id="pbook_fri_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_fri"  class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_fri"  style="width:400px;"></div></td>
										</tr>
										<tr class="row_g_odd"><td>Saturday</td>
											<td><input type="checkbox" id="pbook_sat_cb" class="day_open_close_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="danger"  data-size="small"  data-on="פתוח" data-off="סגור" data-width="75"></td>
											<td><div id="config_from_to_sat"  class="config_from_to_val"></div></td>
											<td class="configuration_irs"><div id="open_time_slider_sat"  style="width:400px;"></div></td>
										</tr>
									</table>
								</div></div>
							</div>
						</div>
						<div id="hours_close_days" class="tab-pane fade">
							<div class="container-fluid">
								<div class="row">

									<div class="col-md-4"><div class="data_content_header" style=" margin-top: 20px; margin-bottom: 20px;">ימים שנבחרו</div></div>
									<div class="col-md-8"><div class="data_content_header" style=" margin-top: 20px; margin-bottom: 20px;">בחר את הימים בהם המקום סגור</div></div>
								</div>
								<div class="row">

									<div class="col-md-4">
										<div id="list_of_closed_days"></div>
									</div>
									<div class="col-md-8"><div id="fullcalendar"> </div></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pc_data_page" id="pcdata_seat"  style="display:none">
				<div class="container-fluid">
					<div class="pc_data_page_header">
						<div class="material-icons pcdata_mat">event_seat</div>
						<div class="pcdata_text ">מקומות ישיבה</div>
						<div class="data_nav_wrap">
							<ul class="nav nav-pills ">
								<li class="active floatright"><a href="#seat_topview"  data-toggle="tab" id="seat_topview_tab">מבט מלמלה</a></li>
								<li class="floatright"><a href="#seat_list" >טבלה</a></li>
							</ul>
						</div>
					</div>

					<div class="tab-content">
						<div id="seat_topview" class="tab-pane fade in active">
							<div class="container-fluid">
								<div class="row">
									<div class="data_content_header" >ניתן לשנות הגדרות של כל מקום בלחיצה עליו</div>
								</div>
								<div class="row">
									<div class="col-md-2">
										<div id="floor_buttons_pc">
											<div class="list-group">
												<%
													for (PPSubmitObject floor : canvasStateList) {
														String floorid = floor.getFloorid();
														String display = "none";
														if (floor.isMainfloor()) { %>
												           <a href="#" class="list-group-item active floor_list_btn" id="floor_list_btn-<%=floorid%>" onclick="selectFloorByID('<%=floorid%>')" ><%=floor.getFloor_name()%></a>

												<%}
												}
												%>
												<%
													for (PPSubmitObject floor : canvasStateList) {
														String floorid = floor.getFloorid();
														if (!floor.isMainfloor()) { %>
												<a href="#" class="list-group-item floor_list_btn"  id="floor_list_btn-<%=floorid%>"  onclick="selectFloorByID('<%=floorid%>')"   ><%=floor.getFloor_name()%></a>
												<%}
												}
												%>


											</div>
										</div>
									</div>
									<div class="col-md-8">
										<div id="canvas_append_wrap_pc"  class="canvas_append_wrap_ub">
											<a href="http://www.pickoplace.com" class="powered_by_logo"><img  src="img/powered_by_logo.png"></a>
										</div>
									</div>
									<div class="col-md-2">

									</div>
								</div>
							</div>
						</div>
						<div id="seat_list" class="tab-pane fade">
							<div class="container-fluid" id="floors_tables_list">
								<div class="row">
									<div class="data_content_header" >רשימה של כל מקומות הישיבה</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pc_data_page" id="pcdata_orders"  style="display:none">
				<div class="container-fluid">
					<div class="pc_data_page_header">
						<div class="material-icons pcdata_mat">exit_to_app</div>
						<div class="pcdata_text ">הזמנות</div>
						<div class="data_nav_wrap">
							<ul class="nav nav-pills ">
								<li class="active floatright"><a href="#booking_settings"  data-toggle="tab" id="booking_definition_tab">מאפייני הזמנות</a></li>
							</ul>
						</div>
					</div>

					<div class="tab-content">
						<div id="booking_settings" class="tab-pane fade in active">
							<div class="container-fluid">
								<div class="row">
									<div class="data_content_header" >ערוך את מאפייני הזמנות דרך האתר</div>
								</div>
								<div class="row pc_option_row">
									<div class="col-sm-3 col-sm-push-9 pco_text">
										<div class=" pco_heb">אופן ההזמנה</div>
									</div>
									<div class="col-sm-9 col-sm-pull-3">
										<div id="pc_order_type_wrap">
											<% String allDay = "";
												if(configuration.getBookingProperties().getAllDay()) {
													allDay = "checked";
												}
											%>
											<input type="checkbox" id="pc_order_type_" class="pc_order_type_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="primary"  data-size="small"  data-on="יומי" data-off="שעתי" data-width="75" <%=allDay%>>
										</div>
										<div class="order_explain_wrap">
											<span class="order_type_text " id="hourly_tip" >הזמנת מקום לפי שעה</span>
											<span class="order_type_text"  id="daily_tip" style="display:none">מקום מוזמן ליום/ערב שלם. לדוגמא:קולנוע, עולם אירועים, מסיבה</span>
										</div>
									</div>
								</div>
								<div  id="hourly_options_content">
									<div class="row pc_option_row">
										<div class="col-sm-3 col-sm-push-9 pco_text">
											<div class=" pco_heb">משך ההזמנה</div>
										</div>
										<div class="col-sm-9 col-sm-pull-3">
											<%
												List<Integer> bookLength = configuration.getBookingProperties().getBookLength();
												String len15 = bookLength.contains(15)?"checked":"";
												String len15Selected =  bookLength.contains(15)?"input_radio_wrap_selected":"";
												String len30 = bookLength.contains(30)?"checked":"";
												String len30Selected =  bookLength.contains(30)?"input_radio_wrap_selected":"";
												String len60 = bookLength.contains(60)?"checked":"";
												String len60Selected =  bookLength.contains(60)?"input_radio_wrap_selected":"";
												String len90 = bookLength.contains(90)?"checked":"";
												String len90Selected =  bookLength.contains(90)?"input_radio_wrap_selected":"";
												String len120 = bookLength.contains(120)?"checked":"";
												String len120Selected =  bookLength.contains(120)?"input_radio_wrap_selected":"";

											%>
											<div class="input_radio_wrap order_leng_wrap <%=len15Selected%> "   id="input_leng_div15"><input id="input_leng15" type="checkbox" name="order_leng" value="15" class="pointer_none" <%=len15 %>><span class="input_radio_text_val">רבע שעה</span></div>
											<div class="input_radio_wrap order_leng_wrap <%=len30Selected%> "   id="input_leng_div30"><input id="input_leng30" type="checkbox" name="order_leng" value="30"  class="pointer_none" <%=len30 %>><span class="input_radio_text_val">חצי שעה</span></div>
											<div class="input_radio_wrap order_leng_wrap <%=len60Selected%> "   id="input_leng_div60"><input id="input_leng60" type="checkbox" name="order_leng" value="60"  class="pointer_none" <%=len60 %>><span class="input_radio_text_val">שעה</span></div>
											<div class="input_radio_wrap order_leng_wrap <%=len90Selected%> "   id="input_leng_div90"><input id="input_leng90" type="checkbox" name="order_leng" value="90"  class="pointer_none" <%=len90 %>><span class="input_radio_text_val">שעה וחצי</span></div>
											<div class="input_radio_wrap order_leng_wrap <%=len120Selected%>"  id="input_leng_div120"><input id="input_leng120" type="checkbox" name="order_leng" value="120"  class="pointer_none" <%=len120 %>><span class="input_radio_text_val">שעתיים</span></div>
										</div>
									</div>
									<div class="row pc_option_row">
										<div class="col-sm-3 col-sm-push-9 pco_text">
											<div class=" pco_heb">אפשרויות תחילת ההזמנה</div>
										</div>
										<div class="col-sm-9 col-sm-pull-3">
											<%
												String step15 = "";
												String step15Selected = "";
												String step30 = "";
												String step30Selected = "";
												String step60 = "";
												String step60Selected = "";
												  if (configuration.getBookingProperties().getBookStartStep() == 15) {
													  step15 = "checked";
													  step15Selected = "input_radio_wrap_selected";
												} else if (configuration.getBookingProperties().getBookStartStep() == 30) {
													  step30 = "checked";
													  step30Selected = "input_radio_wrap_selected";
												} else if (configuration.getBookingProperties().getBookStartStep() == 60) {
													  step60 = "checked";
													  step60Selected = "input_radio_wrap_selected";
												}

											%>
											<form action="">
												<div class="input_radio_wrap step_wrap <%=step15Selected%>" id="input_step_div15"><input id="input_step15" type="radio" name="start_steps" value="15"  class="pointer_none" <%=step15%>><span class="input_radio_text_val">כל 15 דקות</span></div>
												<div class="input_radio_wrap step_wrap <%=step30Selected%>" id="input_step_div30"><input id="input_step30" type="radio" name="start_steps"  class="pointer_none" value="30" <%=step30%>><span class="input_radio_text_val">כל 30 דקות</span></div>
												<div class="input_radio_wrap step_wrap <%=step60Selected%>"  id="input_step_div60"><input id="input_step60" type="radio" name="start_steps"  class="pointer_none" value="60" <%=step60%>><span class="input_radio_text_val">כל שעה</span></div>
											</form>
										</div>
									</div>
									<div class="row pc_option_row">
										<div class="col-sm-3 col-sm-push-9 pco_text">
											<div class=" pco_heb">פרק זמן מינימלי בין ההזמנות</div>
										</div>
										<div class="col-sm-9 col-sm-pull-3">
											<form action="">
												<%
													String wait0 = "";
													String wait0selected = "";
													String wait15 = "";
													String wait15selected = "";
													String wait30 = "";
													String wait30selected = "";
													String wait60 = "";
													String wait60selected = "";
													if(configuration.getBookingProperties().getBookStartWait() == 0) {
														wait0 = "checked";
														wait0selected = "input_radio_wrap_selected";
													} else if (configuration.getBookingProperties().getBookStartWait() == 15) {
														wait15 = "checked";
														wait15selected = "input_radio_wrap_selected";
													} else if (configuration.getBookingProperties().getBookStartWait() == 30) {
														wait30 = "checked";
														wait30selected = "input_radio_wrap_selected";
													} else if (configuration.getBookingProperties().getBookStartWait() == 60) {
														wait60 = "checked";
														wait60selected = "input_radio_wrap_selected";
													}

												%>
												<div class="input_radio_wrap wait_wrap <%=wait0selected%>" id="input_wait_div0"><input id="input_wait0" type="radio" name="start_wait" value="0" class="pointer_none"  <%=wait0%>><span class="input_radio_text_val">מיד</span></div>
												<div class="input_radio_wrap wait_wrap  <%=wait15selected%>" id="input_wait_div15"><input id="input_wait15"  class="pointer_none" type="radio" name="start_wait" value="15" <%=wait15%>><span class="input_radio_text_val">רבע שעה</span></div>
												<div class="input_radio_wrap wait_wrap <%=wait30selected%>" id="input_wait_div30"><input id="input_wait30"  class="pointer_none" type="radio" name="start_wait" value="30" <%=wait30%>><span class="input_radio_text_val">חצי שעה</span></div>
												<div class="input_radio_wrap wait_wrap <%=wait60selected%>"  id="input_wait_div60"><input id="input_wait60"  class="pointer_none" type="radio" name="start_wait" value="60" <%=wait60%>><span class="input_radio_text_val">שעה</span></div>
											</form>
										</div>
									</div>
								</div>

								<div  id="daily_options_content" style="display:none">

								</div>

								<div class="row pc_option_row pc_option_row_top">
									<div class="col-sm-3 col-sm-push-9 pco_text">
										<div class=" pco_heb">? אישור הזמנה אוטומטי </div>
									</div>
									<div class="col-sm-9 col-sm-pull-3" style=" height: 60px;    line-height: 60px;">
										<div id="pc_auto_confirm_wrap">
											<%  String checked = "";
												if(configuration.getBookingProperties().getAutomatic()) {
													checked = "checked";
												}
											%>
											<input type="checkbox" id="pc_auto_confirm" class="pc_auto_confirm_toggle"
												   name="week_checkbox_place" data-toggle="toggle"
												   data-onstyle="success" data-offstyle="default"
												   data-size="small"  data-on="אוטומטי"
												   data-off="ידני" data-width="100" <%=checked%>>
										</div>
									</div>
								</div>
								<div class="row   " id="manual_approval_contacts_form" style="display:none">
									<div class="col-sm-3 col-sm-push-9">
										<div class="heb_explain_text">
											במקרה והאישור מותנה ידנית , יש להזין כתובות מייל או מספרי טלפון אליהם יישלח בקשת הזמנה לצורך אישור סופי. לאחר האישור , הודעה תישלח ללקוח
											<br/><div class="warnexplain">
											כתובות מייל ומספרי טלפון יירשמו במערכת רק לאחר בדיקת אימות
										</div>
										</div>
									</div>
									<div class="col-sm-9 col-md-pull-3" >
										<div class="container-fluid">
											<div class="row" id="contacts_head_row_">
												<div class="col-sm-6">
													<div class="material-icons cont_mat">phone</div>
													<div class="cont_head_text">לאחר הזנת מספר טלפון , יש ללחוץ על הכפתור בדיקה  - קוד אימות יישלח  בסמס</div>
												</div>
												<div class="col-sm-6">
													<div class="material-icons cont_mat">mail_outline</div>
													<div class="cont_head_text">לאחר הזנת כתובת מייל , יש ללחוץ על הכפתור בדיקה- מייל אימות יישלח לכתובת המבוקשת</div>
												</div>
											</div>
											<div class="row contact_row_"  >
												<div class="col-sm-6" >
													<div class="contact_phone_manual_wrap">
														<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;" class="contact_phone_manual_table">
															<tr>
																<td>
																	<input id="contact_man_phone-1" class="mobile-number" type="tel" autocomplete="off" placeholder="050-123-4567">
																</td>
																<td>
																	<div class="confirm_contact_button confirm_contact_button_inactive" id="confirm_phone_button-1" onclick="testManualPhone(this)">שלח סמס</div>
																</td>
															</tr>
															<tr id="test_code_test_tr1"  style="display:none"><td colspan="2" class="test_code_text">
																הזן קוד שהתקבל בסמס
															</td>
															</tr>
															<tr id="test_code_test_tr2" style="display:none">
																<td>
																	<input type="number" id="verification_admin_contact_sms">
																</td>
																<td>
																	<button type="button" id="verification_admin_contact_button" class="btn btn-success">בדוק</button>
																</td>
															</tr>
														</table>
													</div>
												</div>
												<div class="col-sm-6"  >

													<div class="contact_phone_manual_wrap">
														<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;" class="contact_phone_manual_table">
															<tr>
																<td>
																	<div class="input-group">
																		<span class="input-group-addon" id="basic-addon1">@</span>
																		<input type="text" id="manual_email-1" class="form-control" placeholder="eMail-1" aria-describedby="basic-addon1">
																	</div>
																</td>
																<td>
																	<div class="confirm_contact_button confirm_contact_button_inactive" id="confirm_mail_button-1" onclick="testManualEmail()">שלח מייל</div>
																</td>
															</tr>
															<tr id="test_mail_test_tr1" style="display:none"><td colspan="2" class="test_code_text">
																הזן קוד שקיבלת במייל
															</td>
															</tr>
															<tr id="manual_mail_provided_tr">
																<td colspan="2">
																	<div id="manual_mail_provided"></div>
																</td>
															</tr>
															<tr id="test_mail_test_tr2"  style="display:none">
																<td>
																	<input type="number" id="verification_admin_mail_sms">
																</td>
																<td>
																	<button type="button" id="verification_admin_mail_button" onclick="VerifyMailCode()" class="btn btn-success">בדוק</button>
																</td>
															</tr>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="row  " id="manual_approval_contacts_exists" style="display:none">
									<div class="col-sm-3 col-sm-push-9 pco_text pco_text_normal">
										<div class=" pco_heb">אנשי קשר קיימים </div>
									</div>
									<div class="col-sm-9 col-sm-pull-3"  >
										<div class="container-fluid">
											<div class="row" class="contact_row_">
												<div class="col-sm-6" >
													<div id="manual_phones_column_append">
														<% for(String phone : configuration.getBookingProperties().getApprovalPhones()) {%>
														<div class="single_phone_contact" id="single_phone_contact-<%=phone%>">
															<div name="single_phone_contact"   class="single_phone_contact_val"><%=phone%></div>
															<div class="remove_single_phone_contact material-icons" id="remove_single_phone-<%=phone%>">clear</div>
														</div>
														<%}%>
													</div>
												</div>
												<div class="col-sm-6" >
													<div id="manual_mails_column">
														<% for(String mail : configuration.getBookingProperties().getApprovalMails()) {%>
														<div class="single_mail_contact" id="single_mail_contact-<%=mail.replace("@","_").replace(".","_")%>">
															<div name="single_mail_contact" id="single_mail_value-<%=mail.replace("@","_").replace(".","_")%>" class="single_phone_contact_val"><%=mail%></div>
															<div class="remove_single_mail_contact material-icons"  onclick="removeMailConfirmationContact('<%=mail.replace("@","_").replace(".","_")%>')" id="remove_single_mail-<%=mail.replace("@","_").replace(".","_")%>">clear</div>
														</div>
														<%}%>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="row pc_option_row pc_option_row_top">
									<div class="col-sm-3 col-sm-push-9 pco_text">
										<div class=" pco_heb">מקסימום מקומות להזמנה בודדת</div>
									</div>
									<div class="col-sm-9 col-sm-pull-3" style=" height: 60px;    line-height: 60px;">
										<div id="pc_max_tables_toggle_wrap">
											<% if(configuration.getBookingProperties().getSidUnlimited()) {%>
											<input type="checkbox" id="pc_max_tables" class="pc_max_tables_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="default"  data-size="small"  data-on="בלי הגבלה" data-off="מוגבל ל" data-width="100" checked>
										   <% } else { %>
											<input type="checkbox" id="pc_max_tables" class="pc_max_tables_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="default"  data-size="small"  data-on="בלי הגבלה" data-off="מוגבל ל" data-width="100" >
											<%}%>
										</div>
										<div id="pc_max_tables_input_wrap" style="display:none">

											<input id="pc_max_tables_input" type="number" value="<%=configuration.getBookingProperties().getMaxSids()%>"/>
											<div class="order_type_text_not_hide ">הזן מספר מקסימלי</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pc_data_page" id="pcdata_admin"  style="display:none">
				<div class="container-fluid">
					<div class="pc_data_page_header">
						<div class="material-icons pcdata_mat">person</div>
						<div class="pcdata_text ">אדמיניסטרציה</div>

					</div>

					<div class="tab-content">
						<div id="admin_tab_settings" class="tab-pane fade in active">
							<div class="container-fluid">
								<div class="row">
									<div class="data_content_header" >ערוך את הרשאות גישה ועריכה של האתר</div>
								</div>
								<div class="row ">
									<div class="col-sm-6 two_column_admin">
										<div class="two_column_admin_single_head"  data-toggle="tooltip"   data-placement="top" title="ערוך שם משתמש וסיסמה">
											כניסה למערכת ההזמנות
										</div>
										<div class="waiter_user_password_change_form">
											<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;" class="waiter_user_password_change_table">
												<tr>
													<td class="pas_text">
														Username:
													</td><td class="up_input">
													<input type="text" id="waiter_username_change_input"  value="<%=configuration.getAdministration().getAdminUsername()%>">
												</td>
												</tr>
												<tr>
													<td class="pas_text">
														Password:
													</td><td class="up_input">
													<input type="text" id="waiter_password_change_input"  value="<%=configuration.getAdministration().getAdminPassword()%>">
												</td>
												</tr>
											</table>
											<div id="submit_waiter_access_password" onclick="updateWaiterPassword()">שמור<div class="material-icons" id="save_waiter_pass_mat">save</div></div>
										</div>
									</div>
									<div class="col-sm-6 two_column_admin">
										<div class="two_column_admin_single_head">
											(admin) משתמשים עם הרשאות עריכה
										</div>
										<div id="appended_admins">
											<%
												String sessionEmail = (String) request.getSession().getAttribute("userEmail");
												List<String> adminList = configuration.getAdministration().getAdmins();
											%>
                                            <% for(String userMail : adminList)  {%>
											<div class="single_admin_contact" id="single_admin_contact-<%=userMail.replace("@","_").replace(".","_")%>">
												<div name="admin_mails" id="admin_mails-<%=userMail.replace("@","_").replace(".","_")%>" class="single_phone_contact_val"><%=userMail%></div>
												<div class="remove_single_mail_contact material-icons"  onclick="removeSiteAdmin('<%=userMail.replace("@","_").replace(".","_")%>')" id="remove_admin_mail<%=userMail.replace("@","_").replace(".","_")%>">clear</div>
											</div>
											<%}%>
										</div>
										<div id="add_admin_mail_form">
											<div class="cont_head_text">הזן את כתובת המייל של משתמש נוסף. קוד אימות יישלח למייל אותו יש להזין בהמשך</div>
											<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;" class="contact_phone_manual_table">
												<tr>
													<td>
														<div class="input-group padding_right_10" >
															<span class="input-group-addon" id="basic-addon3">@</span>
															<input type="text" id="admin_email-1" class="form-control" placeholder="add admin email" aria-describedby="basic-addon2">
														</div>
													</td>
													<td>
														<div class="confirm_contact_button" id="add_admin_mail_button" onclick="addAdminEmail()">שלח מייל</div>
													</td>
												</tr>
												<tr id="test_mail_test_tr3" style="display:none"><td colspan="2" class="test_code_text">
													הזן קוד שקיבלת במייל
												</td>
												</tr>
												<tr id="test_mail_test_tr4"  style="display:none">
													<td>
														<input type="number" id="verification_admin_admin_mail_sms">
													</td>
													<td>
														<button type="button" id="verification_admin_admin_mail_button" class="btn btn-success">בדוק</button>
													</td>
												</tr>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pc_data_page" id="pcdata_iframe"  style="display:none">
				<div class="container-fluid">
					<div class="pc_data_page_header">
						<div class="material-icons pcdata_mat">settings_overscan</div>
						<div class="pcdata_text "><span class="enginheb">iFrame</span> הגדרות</div>
						<div class="data_nav_wrap">
							<ul class="nav nav-pills ">
								<li class="active floatright"><a href="#iframe_settings"  data-toggle="tab" id="iframe_settings_pill">iFrame עריכת </a></li>
								<li class="floatright"><a href="#iframe_list"  id="iframe_list_pill">רשימה</a></li>
							</ul>
						</div>
					</div>

					<div class="tab-content">
						<div id="iframe_settings" class="tab-pane fade in active">
							<div class="container-fluid">
								<div class="row" id="edit_existing_iframe" style="display:none">
									<div id="edit_iframe_ifid" ></div>
									<div class="material-icons" id="disable_iframe_edit" >close</div></div>
								<div class="row">
									<div class="col-sm-12" >
										<table id="iframe_settings_table"  cellspacing="0" cellpadding="0" style="width:100%; border-collapse:collapse;">
											<tr id="iframe_settings_table_head">
												<td style="width:15%">
													הזמנה
												</td>
												<td style="width:35%;position:relative;">
													גודל

												</td>
												<td style="width:25%">
													סגנון
												</td>
												<td style="width:25%">
													שמירה
												</td>
											</tr>
											<tr  id="iframe_settings_table_content">
												<td>
													<input type="checkbox" id="iframe_bookable" class="pc_auto_confirm_toggle"  name="week_checkbox_place" data-toggle="toggle"  data-onstyle="success" data-offstyle="default"  data-size="small"  data-on="כולל" data-off="ללא" data-width="100" checked>
												</td>
												<td>
													<table id="iframe_width_table"  cellspacing="0" cellpadding="0" style="width:100%; border-collapse:collapse;">
														<tr id="iframe_width_table_row">
															<td style="width:24px"><div id="if_width_minus" class="material-icons">keyboard_arrow_left</div></td>
															<td style="position:relative">
																<div id="iframe_width_slider"  ></div>
																<input type="text" id="iframe_width" readonly value="700x300"/>
															</td>
															<td style="width:24px"><div id="if_width_plus" class="material-icons">keyboard_arrow_right</div></td>
														</tr>
													</table>
												</td>
												<td>
													<div class="dropdown" id="iframe_theme_dropdown" >
														<div class="dropdown-toggle" id="iframe_theme_dropdown_toggle" data-toggle="dropdown"
															 aria-haspopup="true" aria-expanded="true">
															<div id="iframe_theme_dropdown_val" class="book_top_period_if">לבן</div>
														</div>
														<ul class="dropdown-menu " id="iframe_theme_dropdown_ul"
															aria-labelledby="iframe_theme_dropdown_toggle">
															<li><a href="#" data-theme="white">לבן</a></li>
														</ul>
													</div>
												</td>
												<td>
													<div id="iframe_save_btn">
														<div class="md_heb notice_text">iFrame שמור</div>
													</div>
													<div id="iframe_save_btn_disabled" style="display:none">
														<div class="md_heb notice_text">שומר קונפיגורציה</div>
														<img id="iframe_save_btn_ajax" src="img/gif/ajax-loader-round.gif" />
													</div>
												</td>
											</tr>
										</table>
									</div>
								</div>
								<div class="row">
									<div id="pc_iframe_wrap" style="width:700px">
										<div id="pc_iframe_top">
											<div id="please_select_date_">
												<div class="material-icons">content_paste</div>
												<div id="please_select_date_text">נא לבחור תאריך ההזמנה</div>
												<div id="iframe_date_selection" style="display:none">

													<div class="modal_value_column" >
														<div class="iframe_top_value_mat material-icons">today</div>
														<input id="datepicker_ub" class="datepicker_if" type="text" data-toggle="tooltip"   data-placement="right" title="תאריך"/>
													</div>

													<div class="modal_value_column" >
														<div class="iframe_top_value_mat material-icons">schedule</div>
														<div class="dropdown" data-toggle="tooltip"   data-placement="right" title="שעת הזמנה">
															<div class="dropdown-toggle" id="select_time_modal_start" data-toggle="dropdown"
																 aria-haspopup="true" aria-expanded="true">
																<div id="book_top_start" class="book_top_start_if"><div class="default_dropdown_text">זמן התחלה</div></div>
																<input type="text" id="book_start_val_" style="display:none" value=""/>
															</div>
															<ul class="dropdown-menu select_time_dropdown" id="dropdown_start_floors"
																aria-labelledby="select_time_modal_start">
															</ul>
														</div>
													</div>

													<div class="modal_value_column" >
														<div class="iframe_top_value_mat material-icons">timelapse</div>
														<div class="dropdown" data-toggle="tooltip"   data-placement="right" title="משך ההזמנה">
															<div class="dropdown-toggle" id="select_time_modal_period" data-toggle="dropdown"
																 aria-haspopup="true" aria-expanded="true">
																<div id="book_top_period" class="book_top_period_if">שעתיים</div>
																<input type="text" id="book_period_val_" style="display:none"
																	   value="7200"/>
															</div>
															<ul class="dropdown-menu select_time_dropdown" id="dropdown_period_floors"
																aria-labelledby="select_time_modal_period">
																<li><a href="#" data-period="1800">חצי-שעה</a></li>
																<li><a href="#" data-period="3600">שעה</a></li>
																<li><a href="#" data-period="7200">שעתיים</a></li>
															</ul>
														</div>
													</div>

													<div class="modal_value_column">
														<div class="iframe_top_value_mat material-icons">group</div>
														<div class="dropdown"  data-toggle="tooltip"   data-placement="right" title="מספר אורחים">
															<div class="dropdown-toggle" id="select_time_modal_persons"
																 data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
																<div id="book_top_persons" class="book_top_persons_if">2</div>
																<input type="text" id="book_persons_val_" style="display:none"
																	   value="2"/>
															</div>

															<ul class="dropdown-menu  select_time_dropdown"
																id="dropdown_persons_floors" aria-labelledby="select_time_modal_persons">
																<li><a href="#" data-period="1">1</a></li>
																<li><a href="#" data-period="2">2</a></li>
																<li><a href="#" data-period="3">3</a></li>
																<li><a href="#" data-period="4">4</a></li>
																<li><a href="#" data-period="5">5</a></li>
																<li><a href="#" data-period="6">6</a></li>
															</ul>
														</div>
													</div>
												</div>
											</div>

											<div id="hazmana_iframe_button_empty" data-toggle="tooltip"   data-placement="bottom" title="הזמנה רקה">
												<div class="material-icons">shopping_cart</div>
												<div id="hazmana_badge_empty">0</div>
											</div>
											<div id="hazmana_iframe_button" style="display:none" data-toggle="tooltip"   data-placement="bottom" title="הזמנה שלי">
												<div class="material-icons">shopping_cart</div>
												<div id="hazmana_badge">0</div>
											</div>
										</div>
										<div id="pc_iframe_floors_wrap"   style="width:700px">

										</div>
										<div id="pc_iframe_bottom">
											<%
												for (PPSubmitObject floor : canvasStateList) {
													String floorid = floor.getFloorid();
													String display = "none";
													if (floor.isMainfloor()) { %>
											`			<div class="iframe_floor_selector iframe_floor_selector_selected" id="floor_if_btn-<%=floorid%>" onclick="iFselectFloorByID('<%=floorid%>')"><%=floor.getFloor_name()%></div>
													 <%}
												}
											%>
											<%
												for (PPSubmitObject floor : canvasStateList) {
													String floorid = floor.getFloorid();
													if (!floor.isMainfloor()) { %>
														<div class="iframe_floor_selector" id="floor_if_btn-<%=floorid%>"  onclick="iFselectFloorByID('<%=floorid%>')"><%=floor.getFloor_name()%></div>
													<%}
												}
											%>


										</div>
									</div>
								</div>
							</div>
						</div>
						<div id="iframe_list" class="tab-pane fade">
							<div class="container-fluid" >
								<div class="row">
									<div class="data_content_header" >שמורים<span class="ltr_text_in_rtl">&nbsp;iFrames&nbsp;</span>רשימה של </div>
								</div>
								<div class="row ef_single_line_head">
									<div class="col-sm-1" >Date</div>
									<div class="col-sm-1" >Book</div>
									<div class="col-sm-1" >Theme</div>
									<div class="col-sm-7" >Code</div>
									<div class="col-sm-2" >Actions</div>
								</div>
								<div  id="existing_iframes_append">

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container-fluid" style="height:100%;display:none">
			<div id="temp_appends" style="height:400px;width:400px;position:absolute;left:-2000px;top:-300px;"></div>
			<div class="row" id="pc_main_row"  style="height:100%">
				<div class="col-md-2 col-sm-12 col-md-offset-10 col-sm-offset-0"  style="height:100%">

				</div>
				<div class="col-md-10 col-sm-12"  style="height:100%">

				</div>
			</div>
		</div>

	</div>
</div>
<footer class="container-fluid text-center" style="height:50px;">

</footer>
</body>
</html>