
<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"
		 import = "com.dimab.pp.dto.*"
		 import = "com.google.gson.Gson"
		 import = "java.util.*"
%>
<%@ page import="com.dimab.pickoplace.utils.JsonUtils" %>
<!DOCTYPE html >

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Waiter Admin</title>
	<script type="text/javascript">
		var pagetype = 'waiter_admin';
	</script>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
	<link rel="stylesheet" href="js/bootstrap-toggle-master/css/bootstrap-toggle.min.css">
	<link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>
	<link rel="stylesheet" href="css/book_approval.css" type="text/css"/>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />

	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.4.datepicker-grey/jquery-ui.theme.min.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/timelineslimscroll.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />


	<!-- jQuery library -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<!-- Latest compiled JavaScript -->
	<script src="js/bootstrap/bootstrap.min.js"></script>
	<script src="js/bootstrap-toggle-master/js/bootstrap-toggle.min.js"></script>




	<script type="text/javascript" src="js/colpick.js" ></script>
	<script type="text/javascript" src="js/loginlogout.js" ></script>

	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
	<script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
	<script type="text/javascript" src="js/myUtils/netConnection.js"></script>

	<script type="text/javascript" src="js/shapes_wa.js"></script>
	<script type="text/javascript" src="js/shapes_timeline_wa_bookings.js"></script>
	<script type="text/javascript" src="js/printlog_wa.js"></script>
	<script type="text/javascript" src="js/updateData_wa.js"></script>
	<script type="text/javascript" src="js/wl_menu.js"></script>
	<script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/jquery.slimscroll.min.js" ></script>
	<script type="text/javascript" src="js/bookingListManagement_wa.js" ></script>
	<script type="text/javascript" src="js/waiterViewService.js" ></script>
	<script type="text/javascript" src="js/waiterController.js" ></script>


	<script type="text/javascript" src="js/interactiveUpdate_wa.js" ></script>
	<script src='/_ah/channel/jsapi'></script>
	<script language="javascript" src='js/chatChannel.js'></script>

	<script type="text/javascript" src="js/updateCanvasData.js"></script>
	<script type="text/javascript" src="js/WindowCanvasEvents.js"></script>
	<script type="text/javascript" src="js/documentEventListeners.js"></script>

	<script type="text/javascript">

		var tl_canvas = {};
		var InitialBookings = {};
		var StateFromServer = {};
		StateFromServer.floors = [];
		var bookingsbysid = {};
		var timelinediv={};
		var gcanvas ;
		var initalIntervalUpdates = 10;
		var proceed_to_edit = 0;
		var bookingsManager = {};
		var positionmanager = {};
		$(document).ready(function() {
			UpdateHeader();
			InitialCanvasTimeline('timeline_canvas');
			updateCanvasData();
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
			updatePageDimentions();
			ApplyInitialPosition();
			InitialBookingList();
		});

	</script>

</head>
<body style="margin: 0 ;overflow:hidden;" >
<div id="canvas_popover_hidden" class="hidden">
	<div id="canvas_popover_wrap" style="position:relative; width:300px;min-height:100px; background-color:white;">

	</div>
</div>
<div id="canvas_timeline_popover" style="position:absolute"  data-toggle="popover"></div>
<div id="canvas_floors_popover" style="position:absolute"  data-toggle="popover"></div>
<div id="canvas_timeline_admin_popover" style="position:absolute"  data-toggle="popover"></div>
<div id="canvas_timeline_menu_popover" style="position:absolute"  data-toggle="popover"></div>

<div class="modal fade" id="booking_info_modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="booking_info_modal_title">
					Reservation details <span class="badge" id="booking_info_modal_id_badge">123</span>
				</h4>
			</div>
			<div class="modal-body">
				<div id="booking_info_modal_body"  class="appended_modal_body">

				</div>
			</div>
			<div class="modal-footer" id="booking_info_modal_buttonons">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->


<div class="modal fade" id="cancelation_info_modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header danger">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="cancelation_info_modal_title">
					Cancel reservation  <span class="badge" id="cancelation_info_modal_id_badge">123</span>
				</h4>
			</div>
			<div class="modal-body">
				<div id="cancelation_info_modal_body" class="appended_modal_body">

				</div>
			</div>
			<div class="modal-footer" id="cancelation_info_modal_buttonons">

			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<div class="modal fade" id="contact_email_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="exampleModalLabel">New message:</h4>
				<div id="modal_email_name" >Belousov Dmitry</div>
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group">
						<label for="contact_email_modal_text" class="control-label">Message:</label>
						<textarea class="form-control" id="contact_email_modal_text" placeholder="message"></textarea>
					</div>
				</form>
			</div>
			<div class="modal-footer" id="send_message_modal_buttonons">
				<!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" >Send message</button>-->
			</div>
		</div>
	</div>
</div>


<div class="modal fade "  id="alert_modal">
	<div class="modal-dialog  modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="alert_modal_title">Modal title</h4>
			</div>
			<div class="modal-body" id="alert_modal_body">
				<p>One fine body&hellip;</p>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<div id="browser_window_wrap">

</div>
<div id="temp_appends" style="height:400px;width:400px;position:absolute!important;left:-2000px;top:-300px;"></div>

<%

	WaiterInitialDTO waiterResponse = (WaiterInitialDTO)request.getAttribute("waiterResponse");
	String WaiterBookings = (String)request.getAttribute("waiterBookings");
	String imgid2link50 = (String)request.getAttribute("imgid2link50");
	OrderedResponse bookingsInitial = waiterResponse.getOrderedResponse();
	String bookingsInitialJSON = JsonUtils.serialize(bookingsInitial);
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
	<input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState" value='<%=JsonUtils.serialize(floor)%>'/>
	<img    id="server_background_<%=floorid %>" name="server_background" src="<%=backgroundURL%>"/>
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
	<input type="text" id="server_automaticApprovalList" value='<%=JsonUtils.serialize(responseJSON.getAdminApprovalList())%>'/>
	<input type="text" id="server_adminApprovalList" value='<%=JsonUtils.serialize(responseJSON.getAdminApprovalList())%>'/>
	<input type="text" id="server_workinghours" value='<%=JsonUtils.serialize(responseJSON.getWorkinghours())%>'/>
	<input type="text" id="server_placeEditList" value='<%=JsonUtils.serialize(responseJSON.getPlaceEditList())%>'/>
	<input type="text" id="server_closeDates" value='<%=JsonUtils.serialize(responseJSON.getCloseDates())%>'/>
	<input type="text" id="server_logosrc" value='<%=responseJSON.getLogosrc()%>'/>
	<input type="text" id="server_bookingsInitial" value='<%=bookingsInitialJSON%>'/>
	<input type="text" id="server_bookings" value='<%=WaiterBookings%>'/>
	<input type="text" id="server_imgID2link50" value='<%=imgid2link50%>'/>

	<%for ( JsonimgID_2_data imgID2byte64 : responseJSON.getPlacePhotos()) {
		String imgID = imgID2byte64.getImageID();
	%>
	<input type="text" id="server_imap_<%=imgID %>" name="server_imap" value='<%=JsonUtils.serialize(imgID2byte64)%>'/>
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
	<img id="temp_image_for_canvas_creation" style="display:none"/>
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
			<div class="chosed_canvas chosed_img" ><canvas id="show_canvas" width="150" height="150" ></canvas></div>
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
			<div id="canvas_wrap_not_scroll_conf" >
				<%
					for (PPSubmitObject floor : canvasStateList) {
						String floorid = floor.getFloorid();
						String display="";
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

		<div class="zoom_options_book" id="timeline_buttons_wrap">
			<div id="plus_minus_wrap_tl">
				<div id="zoom_plus_div_tl" onclick="c_zoomBig()" title="Zoom-In">+</div>
				<div id="zoom_split_tl"></div>
				<div id="zoom_minus_div_tl" onclick="c_zoomSmall()" title="Zoom-Out">-</div>
			</div>
			<div id="zoom_reset_div_tl" onclick="c_zoomLineReset()">
				<div class="material-icons zoom_reset_mat" title="Zoom-Reset">fullscreen</div>
			</div>
		</div>
		<div id="canvas_slimscroll" style="height:800px"  >
			<div id="canvas_grid_wrap" style="position:relative;display: flex;">
				<canvas id="timeline_canvas" width="800" height="300"></canvas>
				<div id="timegridwrap" style="position:absolute;z-index:3;width:100%;height:100%;pointer-events:none;top:0px;left:0px;">

				</div>
			</div>
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
</div>
<!-- <div style="position:fixed;background-color:red;width:100px;height:100px;pointer-events:none"></div> -->
<table id="body_table" cellspacing="0" cellpadding="0" style="width: 100%;  border-collapse: collapse">
	<tr id="header_tr" style="display:none">
		<td id="header_td" colspan="2">
			<div id="header">
				<div id="logo_">PickoPlace</div>
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

					<input id="loggedBy_" style="display:none" value="Google"/>
					<table style="border-collapse: collapse;" cellspacing="0" cellpadding="0"  >
						<tr><td>
							<div class="oneline">Welcome, <span class="userNikname">dimkinbel</span>.</div>
						</td>
							<td class="fbgatab">
								<div id="loginAccountOptions" class="oneline"><span class="acctoplinks">Account</span>
									<div id="accountHiddenOptions" style="display:none;">
										<table id="topOptionsTable"  cellspacing="0" cellpadding="0"  style="width:100%;">
											<tr><td>
												<div id="gotoaccountmenu" class="topAccOptList" onclick="goToAccountMenu()">Go to Account</div>
												<form id="master_account" action="gotoaccountmenu" method="post"></form>
											</td></tr>
											<tr><td>
												<div id="gotobookings" class="topAccOptList">My bookings</div>
											</td></tr>
											<tr><td>
												<div id="gotoadminzone" class="topAccOptList">AdminZone</div>
											</td></tr>
											<tr><td>
												<div id="logoutmenu" class="topAccOptList">
													<a  class="loginLink loginlogout" href="http://pickoplace.com/_ah/logout?continue=https://www.google.com/accounts/Logout%3Fcontinue%3Dhttps://appengine.google.com/_ah/logout%253Fcontinue%253Dhttp://pickoplace.com/userLogin%26service%3Dah">Logout</a>
												</div>
											</td></tr>
										</table>
									</div>
								</div>
							</td></tr>
					</table>

				</div>
			</div>
		</td>
	</tr>

	<tr id="content_tr">
		<td id="wa_left_column" style="background-color:#555"  >
			<div class="dropdown" id="wl_pp_dd">
				<div id="pp_left_wl_logo" class=" dropdown-toggle" type="button" data-toggle="dropdown">
					<img id="pplm_img" src="img/pplogomarker.png">
				</div>
				<ul class="dropdown-menu  " id="wl_pp_ddmenu">
					<li><a href="#">HTML</a></li>
					<li><a href="#">CSS</a></li>
					<li><a href="#">JavaScript</a></li>
				</ul>
			</div>
			<div class="wl_left_menu_button_w wll_selected" id="floors_open">
				<div class="material-icons wlmb_mat">layers</div>
				<div class="wlmb_text">Floors</div>
			</div>
			<div class="wl_left_menu_button_w" id="timeline_open">
				<div class="material-icons wlmb_mat">access_time</div>
				<div class="wlmb_text">Timeline</div>
			</div>
			<div class="wl_left_menu_button_w" id="settings_open">
				<div class="material-icons wlmb_mat">settings</div>
				<div class="wlmb_text">Settings</div>
			</div>
		</td>
		<td id="content_td_wl">
			<div id="content_td_inner_div" style="width:100%;height:100%">
				<div id="main_views_div">
					<div id="floors_page" class="data_pages_">
						<div id="mv_top_tabs" class="top_main_tabs">
							<%
								for (PPSubmitObject floor : canvasStateList) {
									String floorid = floor.getFloorid();
									if(floor.isMainfloor()) {
							%> <div class="mv_top_tab mv_top_selected" id="floor_tab_mv_<%=floorid%>"><%=floor.getFloor_name()%></div>
							<%     }
							}
							%>
							<%
								for (PPSubmitObject floor : canvasStateList) {
									String floorid = floor.getFloorid();
									if(!floor.isMainfloor()) {
							%> <div class="mv_top_tab " id="floor_tab_mv_<%=floorid%>"><%=floor.getFloor_name()%></div>
							<%     }
							}
							%>
						</div>
						<div  class="show_pages">
							<%
								for (PPSubmitObject floor : canvasStateList) {
									String floorid = floor.getFloorid();

							%> <div class="floor_page" id="floor_wrap_view_<%=floorid%>"></div>
							<%
								}
							%>
						</div>
					</div>
					<div id="timeline_page"  style="display:none"  class="data_pages_">
						<div id="timeline_top_tabs" class="top_main_tabs">
							<div class="timeline_top_tab mv_top_selected" id="timeline_horisontal_tab">Horisontal</div>
							<div class="timeline_navigation">
								<div class="tn_button" onclick="c_zoomLeft()" data-toggle="tooltip" data-placement="bottom" title="TIME LEFT" ><div class="material-icons tnm">navigate_before</div></div>
								<div class="tnz_group">
									<div class="tn_button" onclick="c_zoomOUT()" data-toggle="tooltip" data-placement="bottom" title="ZOOM-OUT (horisontal)" ><div class="material-icons tnm tnmsmall">remove</div></div>
									<div class="tn_button"  onclick="c_zoomRESET()"  >
										<div class="material-icons  tnm tnmsmall"  data-toggle="tooltip" data-placement="bottom" title="ZOOM-RESET (horisontal)">swap_horiz</div>
									</div>
									<div class="tn_button"  onclick="c_zoomIN()" data-toggle="tooltip" data-placement="bottom" title="ZOOM-IN (horisontal)"><div class="material-icons tnm tnmsmall">add</div></div>
								</div>
								<div class="tn_button" onclick="c_zoomRight()" data-toggle="tooltip" data-placement="bottom" title="TIME RIGHT"><div class="material-icons tnm">navigate_next</div></div>
							</div>
						</div>
						<div  class="show_pages">
							<div class="timeline_page" id="timeline_horisontal_">
								<div id="timeline_horisontal_inner"></div>
							</div>
							<div class="timeline_page" id="timeline_vertical_" style="display:none">

							</div>
						</div>
					</div>
					<div id="settings_page" style="display:none"  class="data_pages_">
						<div id="settings_top_tabs" class="top_main_tabs">
							<div class="settings_top_tabs mv_top_selected" id="settings_main_tab">Settings</div>
						</div>
						<div  class="show_pages">
							<div class="timeline_page" id="settings_main_page"  >
								<div class="container settings_container">
									<div class="row">
										<div class="col-sm-4 settings_text_line"  >
											<span class="settings_font_wl">Enable movement</span>
										</div>
										<div class="col-sm-2"  >
											<input type="checkbox" id="moving-enable" data-toggle="toggle" data-onstyle="success">
										</div>
										<div class="col-sm-6"  >

										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div id="notifications_page" style="display:none"  class="data_pages_">
						<div id="notifications_top_tabs" class="top_main_tabs">
							<div class="notifications_top_tabs mv_top_selected" id="new_booking_notification_tab">New reservations</div>
						</div>
						<div  class="show_pages">
							<div class="timeline_page" id="notifications_page_data_new_booking"  >
								<div class="panel-group" id="notification_accordion_new_booking" role="tablist" aria-multiselectable="true">

								</div>
							</div>
						</div>
					</div>

				</div>
				<div id="bookings_right_div">
					<div id="bk_top_tabs">
						<div class="booking_top_tab booking_top_tab_selected">Reservations</div>
						<div class="booking_top_tab ">WaitList</div>
					</div>
					<div id="book_tabs_wrap">
						<div id="bookings_list_page" >
							<div id="bookings_list_page_head">
								<div class="bookings_buttons_ bookings_buttons_left selected_bb"  id="bokbtn_current">Current</div>
								<div class="bookings_buttons_ " id="bokbtn_next">Next</div>
								<div class="bookings_buttons_ bookings_buttons_right" id="bokbtn_past">Past</div>
							</div>
							<div id="list_time_range"></div>
							<div class="book_list_" id="book_list_current" name="book_list_scroll" >

							</div>
							<div class="book_list_" id="book_list_next" name="book_list_scroll" style="display:none">

							</div>
							<div class="book_list_" id="book_list_past"  name="book_list_scroll" style="display:none">

							</div>
						</div>
					</div>
				</div>
			</div>
		</td>
	</tr>
	<tr id="bottom_buttons_tr">
		<td id="left_bottom_corner_td" class="btn-success" >
			<div class="material-icons wa_fullscreen "    data-toggle="tooltip" data-placement="right" title="FULL SCREEN"  onclick="toggleFullScreen()">fullscreen</div>
		</td>
		<td id="bottom_buttons_td" style="background-color:#555">
			<div id="bottom_buttons_wrap" >
				<div class="row">
					<div class="col-md-4 bottom_row_buttons" id="button_left_btns">
						<div class="wl_bottom_menu_button_w" id="new_reservations">
							<div class="material-icons wlmbot_mat">chat</div>
							<div class="wlmbot_text">Notifications</div>
							<div id="new_note_cnt" style="display:none">0</div>
						</div>
					</div>
					<div class="col-md-4 bottom_row_buttons" id="button_center_btns">
						<div id="bottom_date">
							<div style="position:relative;display: inline-block;text-align: center;">
								<input id="datepicker_wl_bottom" type="text" readonly>
								<img id="wl_date_loader" src="img/gif/712.GIF"  style="display:none">
							</div>
						</div>
					</div>
					<div class="col-md-4 bottom_row_buttons" id="button_rigt_btns"></div>
				</div>
			</div>
		</td>
	</tr>
</table>
</body>
</html>
