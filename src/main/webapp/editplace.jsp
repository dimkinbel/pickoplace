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
    <title>PickoPlace-Edit</title>
	  <script type="text/javascript">
		  var pagetype = 'editplace';
	  </script>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
	 <script type="text/javascript" src="js/loginlogout.js" ></script>
    <script type="text/javascript" src="js/dropit.js" ></script>
	<script type="text/javascript" src="js/jquery.slimscroll.min.js" ></script>
    
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/colpick.js" ></script>
    <script type="text/javascript" src="js/shapes.js"></script>
	<script type="text/javascript" src="js/shapes_Canvas_draw.js"></script>
	<script type="text/javascript" src="js/printlog.js"></script>
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
	<script type="text/javascript" src="js/bookingOptions.js"></script>
	<script type="text/javascript" src="js/cmenu2.js"></script>
	<script type="text/javascript" src="js/wl_menu_draw.js"></script>	
    <script type="text/javascript" src="js/updateData.js"></script>
	
     <link rel="stylesheet" href="css/browserWrap.css" type="text/css" media="screen" />
     <link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
     <link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	 <link rel="stylesheet" href="css/slider.css" type="text/css"/>
	 <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="css/draw.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="js/jquery-ui-1.11.4.custom/jquery-ui.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	 <link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
	 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

	  <script type="text/javascript" src="js/updateCanvasData.js"></script>
	  <script type="text/javascript" src="js/WindowCanvasEvents.js"></script>
	  <script type="text/javascript" src="js/documentEventListeners.js"></script>
	  <script type="text/javascript">
	var defaultHint = "";
	var defaultHintColor = "black";
	var tempHintUsed = false;
	var globalShowHint = true;

	function SIcreateSaveObjectPre() {
		setSessionData(function(result) {
			   if(result) {
				   createSaveObjectPre();
			   } else {
				   updatePageView();
			   }
	     });		
	}
	function SIPlaceConfiguration(placeID) {
		var plidi = placeID;
		setSessionData(function(result) {
			   if(result) {
				   PlaceConfiguration(plidi);
			   } else {
				   updatePageView();
			   }
	     });
	}	
	//some comment
	function SIupdateSaveObjectPre() {
		setSessionData(function(result) {
			   if(result) {
				   updateSaveObjectPre();
			   } else {
				   updatePageView();
			   }
	     });
	}
	   var gcanvas ;

       $(document).ready(function() {
    	   "use strict";
    	  // canvas_ = new CanvasState(document.getElementById('canvas1'));
    	   gcanvas = new CanvasState(document.getElementById('group_shapes_canvas'));
    	   	$("#rotate_slider").slider({
    	 	   tooltip: 'hide',
    	 	   formatter: function(value) {
    	 	    if (canvas_.selection != null) {
    	           canvas_.rotateSelection(value);
    	 		}
    	 		return  value;
    	 	}
    	     }).on('slideStop', function(ev){

    	     });;
		   updateCanvasData();
       });
       function update_place_cancel() {
    	   $("#updateExistingWarning").hide();
       }
       function update_place_yes() {      
           SIcreateSaveObjectPre();
		   $("#updateExistingWarning").hide();
       }
       function PlaceConfiguration(placeID) {
    	   var formid = placeID + "_config_form";
    	   document.getElementById(formid).submit();
       }
	</script>

  </head>
  	
  <body   style="margin: 0px;">
    <div id="updateExistingWarning" style="display:none;">
	  <div id="updateExistingWarningInner" >
	   <table class="updateExistingWarningInner_table">
	    <tr><td colspan="2"><div class="marto_3">Update existing place ?</div></td></tr>
	    <tr>
	     <td style="width:50%"><div id="sure_yes_div_updatePlace" onclick="update_place_yes()">Yes</div></td>
	     <td style="width:50%"><div id="updatePlace_cancel_div_acc" onclick="update_place_cancel()">Cancel</div></td>
	    </tr>  
	    <tr style="display:none"><td colspan="2">
	     <form id="update_place_form_" name="update_place_form_"  action="/UpdatePlace" method="post">
	       <input id="hidden_form_id_account" name="hidden_form_id_account"/>
	     </form>
	    </td></tr>
	   </table>
	 </div>
	</div>
  		    <div id="message_popup_wrap" style="display:none">
			    <div id="remove_floor_confirmation"  style="display:none">
				   <div class="popup_message_main_text">Are you sure you want to remove next floor ?</div>
				   <div id="popup_message_floor_name"></div>
				   <div class="popup_buttons_">				         
				         <div class="ppb" id="ppup_delete" onclick="DeleteFloor()">DELETE</div>
						 <div class="ppb" id="ppup_cancel" onclick="PopupCancel('floor_delete')">CANCEL</div>
				   </div>
				</div>
			</div>
    <div id="canvas_hint" style="display:none" >Hello</div>
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
		</div>
   </div>


		  
		  
			<div id="header_drawing">
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
			</div>	
<div id="hiden_values_from_edit" style="display:none">
   <%
   AJAXImagesJSON responseJSON = (AJAXImagesJSON)request.getAttribute("canvasEditPlace");
   Gson gson = new Gson();
   List<PPSubmitObject> canvasStateList = responseJSON.getFloors();
   List<JsonSID_2_imgID> sid2imgID = responseJSON.getJSONSIDlinks();
   
   String placeName = responseJSON.getPlace_();
   String placeBranchName = responseJSON.getSnif_();
   String userRandom = responseJSON.getUsernameRandom();
   String placeID = responseJSON.getPlaceID();
   String lat = responseJSON.getLat();
   String lng = responseJSON.getLng();
   String address = responseJSON.getAddress();
   List<JsonImageID_2_GCSurl> imgID2URL = responseJSON.getJSONimageID2url();  

   %>

        	      <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
        	      <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
        	      <input type="text" id="server_placeName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
        	      <input type="text" id="server_placeBranchName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
        	      <input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeID %>' style="display:none"/>
        	      <input type="text" id="server_Address" name="userSetPlaceBName" value='<%=address%>' style="display:none"/>
        	      <input type="text" id="server_Lat" name="userSetPlaceBName" value='<%=lat%>' style="display:none"/>
        	      <input type="text" id="server_Lng" name="userSetPlaceBName" value='<%=lng%>' style="display:none"/>
 
   <% 
      for (PPSubmitObject floor : canvasStateList) {
    	   String backgroundURL = "";
    	   String floorid = floor.getFloorid();
    	   if(floor.getBackground()!=null && !floor.getBackground().isEmpty()) {
    		   backgroundURL = floor.getBackground();
    	   }  	   
    %>
      <input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState" value='<%=gson.toJson(floor) %>'/>
      <img    id="server_background_<%=floorid %>" crossorigin="anonymous" name="server_background" src="<%=backgroundURL%>"/>
      <input type="text" id="server_floor_name_<%=floorid %>" value="<%=floor.getFloor_name() %>"/>
      <canvas id="canvas_tmp_<%=floorid %>"></canvas>
    <% }%>
      <% if (sid2imgID!=null && !sid2imgID.isEmpty()) {%>
      <input type="text" id="server_sid2imgID" value='<%=gson.toJson(sid2imgID)%>'/>
      <%} %>
      <input type="text" id="server_placeName" value='<%=placeName%>'/>
      <input type="text" id="server_placeBranchName" value='<%=placeBranchName%>'/>
      <input type="text" id="server_userRandom" value='<%=userRandom%>'/>
      <input type="text" id="server_placeID" value='<%=placeID%>'/>
      
      
      <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
    	  for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>     
        <img id="server_<%=img2url.getImageID() %>" crossorigin="anonymous" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
      <%} 
      }%>
</div>
 <div id="drawing_wrap_content">
   <div id="drawing_tool_content">
      <div id="dr_top_section">
	    <div id="main_menu_section">
		   <div id="main_dr_menu" >
		     <div id="left_dr_menu_wrap">
			  <div class="left_nav_dr_name left_nav_tab " id="background_tab_dimentions">
			         <span id="background_tab_fill_m"  class="material-icons dr_l2_tabs dr_l2_tabs_back"  name="tab_m" >wallpaper</span>
					 Background
			  </div>
			  <div class="left_nav_dr_name_r left_nav_tab left_nav_tab_hover_disabled" id="draw_tab_shapes" >
			          <span  id="background_tab_shapes_m" class="material-icons dr_l2_tabs dr_l2_tabs_back"  name="tab_m" >query_builder</span>
					  Book shapes
			  </div>
			</div>
		   </div>
		</div>
		<div id="other_top">
		  <input type="checkbox" id="addbgshape" style="display:none" />
		  <input type="checkbox" id="bookingopacity"  style="display:none"  />
		  <div id="save_buttons_wrap">
		     <div id="drawingSaveButton" class="save_buttons" onclick="SIcreateSaveObjectPre()"> 
			      <div class="material-icons material_save">save</div>UPDATE
			 </div>
			 <div id="savingPH"  class="save_buttons" style="display:none"> 
				  <img class="sfdcvsadd" src="img/gif/saving.GIF">
			 </div>
			 <div id="drawingConfigButton_disabled"  class="save_buttons" style="display:none">ADMIN</div>
			 <div id="drawingConfigButton" class="save_buttons"  onclick="SIPlaceConfiguration('<%=placeID%>')"><div class="material-icons material_config">tune</div>ADMIN</div>
		  	<form id="<%=placeID%>_config_form"  action="placeConfiguration" method="post" style="display:none">
                 <input name="placeIDvalue" value="<%=placeID%>">
            </form>
		  </div>
		</div>
	  </div>
	  <div id="dr_center_section">
		  <div id="dr_left_column_wrap">


			<div id="submenus" >
			  <div class="submenu" id="background_tab_dimentions_submenu" name="submenu" >
			   <div class="top_explain_sub" ></div>
			   
			   <div class="menu_itself" id="background_accordion_w">
			     <div id="background_accordion_scroll">
			      <div class="bg_accordion" id="bg_acc_dimentions">
				     <div class="bgacc_mat material-icons">aspect_ratio</div>
					 <div class="bgacc_topic">Background dimentions</div>
				  </div>
				  <div class="bg_accordion_sub" id="bg_acc_dimentions_sub" >
					  <div id="bg_dimentions_sliders">
						   <div class="param_name_head"> Width
							 <div class="wh_input" ><input type="number" id="width_c_input" ><div class="material-icons" id="c_width_set" >check_box</div></div>
						   </div>
						   <div class="slider_wrap_dr">
							  <div class="material-icons left_right_arrow_w left" id="left_width_dr">navigate_before</div>
							  <div class="slider_wrap_dr_inner left"><div id="width_dr_slider" ></div></div>
							  <div class="material-icons left_right_arrow_w left" id="right_width_dr">navigate_next</div>
						   </div>
						   <div class="param_name_head"> Height
							 <div class="wh_input" ><input type="number" id="height_c_input" ><div class="material-icons" id="c_height_set" >check_box</div></div>
						   </div>
						   <div class="slider_wrap_dr">
							  <div class="material-icons left_right_arrow_h left" id="left_height_dr">navigate_before</div>
							  <div class="slider_wrap_dr_inner left"><div id="height_dr_slider" ></div></div>
							  <div class="material-icons left_right_arrow_h left" id="right_height_dr">navigate_next</div>
						   </div>
					   </div>
					   <div class="submenu_bottom_border"></div>					  
				  </div>
				  <div class="bg_accordion" id="bg_acc_fill">
				     <div class="bgacc_mat material-icons">format_color_fill</div>
					 <div class="bgacc_topic">Background fill (color/image)</div>
				  </div>
				  <div class="bg_accordion_sub" id="bg_acc_fill_sub"  >
				     <div class="bg_submenu" id="bg_submenu_fill">
					    <div id="fill_type_selectors">
						   <div id="fill_type_color" class="fill_type_selectors fill_type_selectors_selected">
						      <div class="material-icons material_selector_out" id="material_color_out"  style="display:none">check_box_outline_blank</div>
							  <div class="material-icons material_selector_v" id="material_color_v">check_box</div>
							  <div class="fill_type_text">Color</div>
						   </div>
						    <div id="fill_type_bgimage" class="fill_type_selectors">
						      <div class="material-icons material_selector_out" id="material_bgimage_out">check_box_outline_blank</div>
							  <div class="material-icons material_selector_v" id="material_bgimage_v" style="display:none">check_box</div>
							  <div class="fill_type_text">Background Image</div>
						   </div>
						    <div id="fill_type_bguser" class="fill_type_selectors">
						      <div class="material-icons material_selector_out" id="material_bguser_out" >check_box_outline_blank</div>
							  <div class="material-icons material_selector_v" id="material_bguser_v" style="display:none">check_box</div>
							  <div class="fill_type_text">User image</div>
						   </div>
						</div>
						<div class="bg_fill_submenus" id="bg_fill_color_sm">
						    
							<div id="back_color_pick" class="pick_color"></div>			
							<div id="bcptw"><span class="material-icons bcptw">color_lens</span><span id="bcptw_text">Choose background color</span></div>							
						</div>
						<div class="bg_fill_submenus" id="bg_fill_image_sm" style="display:none">
							<div class="picker_table" name="picker_table" id="background_picker_w" >
								<div class="internal_picker " id="background_picker">
								  <img class="bg_pick_image left bg_pick_image_selectable"  src="img/background/pick/b_p_1_60.png" id="b_p_1" onclick="selectedBackground(this,'b_p_1_actual');"/>
					              <img class="bg_pick_image left bg_pick_image_selectable" src="img/background/pick/b_p_2_60.png" id="b_p_2" onclick="selectedBackground(this,'b_p_2_actual');"/>
					              <img class="bg_pick_image left bg_pick_image_selectable" src="img/background/pick/b_p_3_60.png" id="b_p_3" onclick="selectedBackground(this,'b_p_3_actual');"/>
					              <img class="bg_pick_image left bg_pick_image_selectable" src="img/background/pick/b_p_4_60.png" id="b_p_4" onclick="selectedBackground(this,'b_p_4_actual');"/> 
								</div>
							  </div>
							  <div style="display:none">
							    <img id="b_p_1_actual"  src="img/background/b_p_1.png" style="display:none"/>
								<img id="b_p_2_actual"  src="img/background/b_p_2.png" style="display:none"/>
								<img id="b_p_3_actual"  src="img/background/b_p_3.png" style="display:none"/>
								<img id="b_p_4_actual"  src="img/background/b_p_4.png" style="display:none"/>
							  </div>
						</div>
						<div class="bg_fill_submenus" id="bg_fill_user_sm" style="display:none">
							  <div id="for_upload_user_bg_button" class="margin_top_20">
								 <div id="uploadBGbutton" onclick="fileUpload('userBGUpload_input')"><span class="material-icons file_upload_mat">file_upload</span>Upload Image</div>
								 <div id="uploadBGbutton_small" style="display:none" onclick="fileUpload('userBGUpload_input')" title="Upload image"><span class="material-icons file_upload_mat">file_upload</span></div>
								  <input type="file" id="userBGUpload_input" style="display:none;"/>
							  </div>
							  <div id="show_on_upload_bg_user" style="display:none"  class="margin_top_20">
									<div id="for_move_user_bgimage">
										<div class="chosed_img " >
											<img id="chosed_bgimage"/>
										</div>
									</div>
							   <table id="bg_options_table" cellspacing="1" cellpadding="0"  style="width:100%;">
								 <tr id="bg_fill_tr"><td>
								   <div id="bg_fill_div" class="bg_option bg_option_fill option_font bg_opt_button" onclick="userBackground('fill')">Fill board</div></td>
								 </tr>
								 <tr id="bg_repeat_tr"><td>
								   <div id="bg_repeat_div" class="bg_option bg_option_repeat option_font bg_opt_button" onclick="userBackground('repeat')">Repeat background</div></td>
								 </tr>
								 <tr id="bg_asimage_tr"><td>
								   <div id="bg_asimage_div" class="bg_option bg_option_asimage option_font bg_opt_button" onclick="userBackground('asimage')">Board as image size</div></td>
								 </tr>
								 <tr id="bg_axis_tr"><td>
								   <div id="bg_axis_div" class="bg_option bg_option_axis option_font bg_opt_button" onclick="userBackground('axis')">Set as image axis</div></td>
								 </tr>			 
							   </table>										
                              </div>
						  
						</div>
					 </div>	
					 <div class="submenu_bottom_border"></div>				  
				  </div>
				  <div class="bg_accordion" id="bg_acc_draw">
				     <div class="bgacc_mat material-icons">edit</div>
					 <div class="bgacc_topic">Draw background shapes</div>
				  </div>
				  <div class="bg_accordion_sub" id="bg_acc_draw_sub"  >
					 <div class="bg_submenu" id="bg_submenu_shapes" >
					   <div id="bg_select_shapes">
						<div class="circles_wrap" style="width:290px">
						  <div class="display_table_fixed">
							  <div class="single_shape_select_div_bg" id="sssbg_round">
									 <img class="smbg_img_img sss_baw"  id="sssbg_round_baw"  src="img/transparent.png"/>
									 <img class="smbg_img_img sss_col"  id="sssbg_round_col"  src="img/transparent.png" style="display:none"/>
							  </div>
							  <div class="single_shape_select_div_bg" id="sssbg_circle">
								 <img class="smbg_img_img sss_baw"  id="sssbg_circle_baw"  src="img/transparent.png"/>
								 <img class="smbg_img_img sss_col"  id="sssbg_circle_col"  src="img/transparent.png" style="display:none"/>
							  </div>
							  <div class="single_shape_select_div_bg" id="sssbg_trapex">
								 <img class="smbg_img_img sss_baw"  id="sssbg_trapex_baw"  src="img/transparent.png"/>
								  <img class="smbg_img_img sss_col" id="sssbg_trapex_col"  src="img/transparent.png" style="display:none"/>
							  </div>
							  <div class="single_shape_select_div_bg" id="sssbg_rect">
								 <img class="smbg_img_img sss_baw"  id="sssbg_rect_baw"  src="img/transparent.png"/>
								 <img class="smbg_img_img sss_col"  id="sssbg_rect_col"  src="img/transparent.png" style="display:none"/>
							  </div>
							  <div class="single_shape_select_div_bg" id="sssbg_line">
								 <img class="smbg_img_img  sss_baw"  id="sssbg_line_baw" src="img/transparent.png"/>
								 <img class="smbg_img_img  sss_col"  id="sssbg_line_col" src="img/transparent.png" style="display:none"/>
							  </div>
							  <div class="single_shape_select_div_bg" id="sssbg_text">
								 <img class="smbg_img_img sss_baw"  id="sssbg_text_baw"  src="img/transparent.png"/>
								 <img class="smbg_img_img sss_col"  id="sssbg_text_col"  src="img/transparent.png" style="display:none"/>
							  </div>
							  <div class="single_shape_select_div_bg" id="sssbg_user">
							   <img class="smbg_img_img sss_baw" id="sssbg_user_baw"  src="img/transparent.png"/>
							   <img class="smbg_img_img sss_col" id="sssbg_user_col"  src="img/transparent.png" style="display:none"/>
							</div>
						  </div>
						</div>
					   </div>
                       <div id="bg_shapes_sliders">
                          <div id="sssbg_round_options" class="bg_shapes_options" style="display:none">
						     <div id="bg_round_append_"></div>
						  </div>
						  <div id="sssbg_circle_options" class="bg_shapes_options" style="display:none">
						     <div id="bg_circle_append_"></div>
						  </div>
						  <div id="sssbg_trapex_options" class="bg_shapes_options" style="display:none">
						      <div id="bg_trapex_append_"></div>
						  </div>
						  <div id="sssbg_rect_options" class="bg_shapes_options" style="display:none">
						     <div id="bg_rect_append_"></div>
						  </div>
						  <div id="sssbg_line_options" class="bg_shapes_options" style="display:none">
						     <div id="bg_line_append_"></div>
						  </div>
						  <div id="sssbg_text_options" class="bg_shapes_options" style="display:none">
						     <div id="bg_text_append_"></div>
						  </div>
						  <div id="sssbg_user_options" class="bg_shapes_options" style="display:none">
						     <div id="for_upload_bg_user_button" class="margin_top_35">
								 <div id="upload_bguser_image_button" onclick="fileUpload('userBgImageUpload_input')"><span class="material-icons file_upload_mat">file_upload</span>Upload Image</div>
							  </div>
							  <div style="display:none">
								 <input type="file" id="userBgImageUpload_input" style='display:none;position:absolute;top:-1000px'>
								 <img id="temp_image_for_canvas_creation_bg" style="display:none">
								 <input id="json_saved_imgPicker_user_bg" style="display:none" type="text" />
								 <canvas  width="1200" height="1200" id="translated_user_images_canvas_bg" style="display:none"></canvas>
							  </div>
							  <div id="show_on_upload_user_bg" style="display:none"  class="margin_top_35">
							  <div id="for_move_user_image_bg">
									<div class="chosed_img " >
										<img id="chosed_image_bg"/>
									</div>
							  </div>
								  <div id="user_sliders_bg">
									 <div class="canvas_figure_options" name="canvas_figure_options"  id="user_sliders_bg_options" >
									 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
										   <tr   class="option_name_tool_single slider_row_" >
											   <td class="option_font"> Image opacity </td>
												<td>					   
												   <div class="for_slider"  id="user_oacity_slider_move_bg" >
													   <div id="user_img_alpha_slider_bg" style="width:150px;"></div>
												   </div>
											  </td>
										   </tr>
									</table>
									</div>
								  </div>
								<div class="picker_table" name="picker_table" id="user_picker_w_bg" >
								   <div class="internal_picker " id="user_picker_bg">
								   
								   </div>
								</div>
							  </div>
						  </div>
						  
                       </div>					   
					 </div>	
					 <div class="submenu_bottom_border"></div>				  
				  </div>
                 </div>
			   </div>
			 </div>

			 
			 <div class="submenu" id="draw_tab_shapes_submenu" name="submenu" >
			   <div id="book_select_shapes">
			    <div class="circles_wrap" style="width:190px">
			      <div class="top_explain_sub_c" >Geometric shapes</div>
				  <div class="display_table_fixed">
					  <div class="single_shape_select_div" id="sss_round">
					         <img class="smb_img_img sss_baw"  id="sss_round_baw"  src="img/material_icons/64x64/80perc/round.png"/>
							 <img class="smb_img_img sss_col"  id="sss_round_col"  src="img/material_icons/64x64/round.png" style="display:none"/>
					  </div>
					  <div class="single_shape_select_div" id="sss_circle">
					     <img class="smb_img_img sss_baw"  id="sss_circle_baw"  src="img/material_icons/64x64/80perc/circle.png"/>
						 <img class="smb_img_img sss_col"  id="sss_circle_col"  src="img/material_icons/64x64/circle.png" style="display:none"/>
					  </div>
					  <div class="single_shape_select_div" id="sss_trapex">
					     <img class="smb_img_img sss_baw"  id="sss_trapex_baw"  src="img/material_icons/64x64/80perc/trapex.png"/>
						  <img class="smb_img_img sss_col" id="sss_trapex_col"  src="img/material_icons/64x64/trapex.png" style="display:none"/>
					  </div>
					  <div class="single_shape_select_div" id="sss_rect">
					     <img class="smb_img_img sss_baw"  id="sss_rect_baw"  src="img/material_icons/64x64/80perc/rectangle.png"/>
						 <img class="smb_img_img sss_col"  id="sss_rect_col"  src="img/material_icons/64x64/rectangle.png" style="display:none"/>
					  </div>
				  </div>
				</div>
				<div class="circles_wrap"  style="width:90px">
				  <div class="top_explain_sub_c"  >Special shapes</div>
				  <div class="display_table_fixed">
					  <div class="single_shape_select_div" id="sss_line">
					     <img class="smb_img_img  sss_baw"  id="sss_line_baw" src="img/material_icons/64x64/80perc/line.png"/>
						 <img class="smb_img_img  sss_col"  id="sss_line_col" src="img/material_icons/64x64/line.png" style="display:none"/>
					  </div>
					  <div class="single_shape_select_div" id="sss_text">
					     <img class="smb_img_img sss_baw"  id="sss_text_baw"  src="img/material_icons/64x64/80perc/code.png"/>
						 <img class="smb_img_img sss_col"  id="sss_text_col"  src="img/material_icons/64x64/code.png" style="display:none"/>
					  </div>
				  </div>
				</div>
				<div class="circles_wrap"  style="width:190px">
				  <div class="top_explain_sub_c" >Images</div>
				  <div class="display_table_fixed">
					  <div class="single_shape_select_div" id="sss_table">
					     <img class="smb_img_img sss_baw" id="sss_table_baw" src="img/material_icons/64x64/80perc/table.png"/>
						 <img class="smb_img_img sss_col" id="sss_table_col" src="img/material_icons/64x64/table.png" style="display:none"/>
					  </div>
					  <div class="single_shape_select_div" id="sss_chair">
					     <img class="smb_img_img sss_baw" id="sss_chair_baw" src="img/material_icons/64x64/80perc/chair.png"/>
						 <img class="smb_img_img sss_col" id="sss_chair_col" src="img/material_icons/64x64/chair.png"  style="display:none"/>
					  </div>
					  <div class="single_shape_select_div" id="sss_combo">
					      <img class="smb_img_img sss_baw" id="sss_combo_baw" src="img/material_icons/64x64/80perc/combo.png"/>
						  <img class="smb_img_img sss_col" id="sss_combo_col" src="img/material_icons/64x64/combo.png" style="display:none"/>
					  </div>
				  </div>
				</div>
				<div class="circles_wrap"  style="width:90px">
				  <div class="top_explain_sub_c" >User image</div>
				  <div class="display_table_fixed">
					<div class="single_shape_select_div" id="sss_user">
					   <img class="smb_img_img sss_baw" id="sss_user_baw"  src="img/material_icons/64x64/80perc/photos.png"/>
					   <img class="smb_img_img sss_col" id="sss_user_col"  src="img/material_icons/64x64/photos.png" style="display:none"/>
					</div>
				  </div>
				</div>
			   </div>
			   <div class="menu_itself">
			      <div class="single_shape_options_menu" id="sss_round_sso" style="display:none">
				      
					  <div id="book_round_append_"><div id="_round_append_">
					  <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Round-corner rectangle</span></div></div>
					  <div id="for_move_canvas_round" class="margin_top_15"></div>
					  <div id="round_sliders">
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="round_options" >
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Line color </td>
										 <td><div id="round_line_color" class="pick_color"></div></td>						   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Fill color </td>
										 <td><div id="round_fill_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
                                   <td class="option_font"> Fill opacity </td>
								    <td>					   
										   <div class="for_slider"   >
												<div id="round_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td class="option_font"> Line opacity </td>       
								  <td>					   
										   <div class="for_slider"  >
												<div id="round_line_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								 <td class="option_font"> Corner radius </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="round_radius"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
                                 <td class="option_font"> Line width </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="round_Lwidth"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
						 </table>
					   </div>					  
					  </div></div>
					  </div>
				  </div>
			      <div class="single_shape_options_menu" id="sss_circle_sso" style="display:none">
				      
					  <div id="book_circle_append_"><div id="_circle_append_">
					  <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Circle</span></div></div>
					  <div id="for_move_canvas_circle" class="margin_top_15"></div>
					  <div id="circle_sliders">	
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="circle_options" >
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Fill color </td>
										 <td><div id="circle_fill_color" class="pick_color"></div></td>						   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Line color </td>
										 <td><div id="circle_line_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
                                   <td class="option_font"> Fill opacity </td>
								    <td>					   
										   <div class="for_slider"   >
												<div id="circle_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td class="option_font"> Line opacity </td>       
								  <td>					   
										   <div class="for_slider"  >
												<div id="circle_line_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								 <td class="option_font"> Line width </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="circle_Lwidth"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
						 </table>
					   </div>			
					  </div>	
                      </div></div>					  
				  </div>
			      <div class="single_shape_options_menu" id="sss_trapex_sso" style="display:none">
				      
					  <div id="book_trapex_append_"><div id="_trapex_append_">
					  <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Trapex</span></div></div>
					  <div id="for_move_canvas_trapex" class="margin_top_15"></div>
					  <div id="trapex_sliders">
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="trapex_options" >
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Fill color </td>
										 <td><div id="trapex_fill_color" class="pick_color"></div></td>						   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Line color </td>
										 <td><div id="trapex_line_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
                                   <td class="option_font"> Fill opacity </td>
								    <td>					   
										   <div class="for_slider"   >
												<div id="trapex_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td class="option_font"> Line opacity </td>       
								  <td>					   
										   <div class="for_slider"  >
												<div id="trapex_line_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								 <td class="option_font"> Line width </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="trapex_Lwidth"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								 <td class="option_font"> Cut side </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="trapex_radius"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
						 </table>
					   </div>						  
					  </div>
					  </div></div>
				  </div>
			      <div class="single_shape_options_menu" id="sss_rect_sso" style="display:none">
				      
					  <div id="book_rect_append_"><div id="_rect_append_">
					  <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Rectangle</span></div></div>
					  <div id="for_move_canvas_rectangle" class="margin_top_15"></div>
					  <div id="rectangle_sliders">
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="rectangle_options" >
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Fill color </td>
										 <td><div id="rectangle_fill_color" class="pick_color"></div></td>						   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Line color </td>
										 <td><div id="rectangle_line_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
                                   <td class="option_font"> Fill opacity </td>
								    <td>					   
										   <div class="for_slider"   >
												<div id="rectangle_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td class="option_font"> Line opacity </td>       
								  <td>					   
										   <div class="for_slider"  >
												<div id="rectangle_line_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								 <td class="option_font"> Line width </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="rectangle_Lwidth"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
						 </table>
					   </div>	
					  </div>
					  </div></div>
				  </div>
			      <div class="single_shape_options_menu" id="sss_line_sso" style="display:none">
				      
					  <div id="book_line_append_"><div id="_line_append_">
					  <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Line</span></div></div>
					  <div id="for_move_canvas_line" class="margin_top_15"></div>
					  <div id="line_sliders">
						<div class="canvas_figure_options" name="canvas_figure_options"  id="line_options" >
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Line color </td>
										 <td><div id="line_line_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td class="option_font"> Line opacity </td>       
								  <td>					   
										   <div class="for_slider"  >
												<div id="line_line_opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								 <td class="option_font"> Line width </td>
								 <td>					   
										   <div class="for_slider"  >
												<div id="line_Lwidth"   style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
						 </table>
					   </div>	
					  </div>
					  </div></div>
				  </div>
			      <div class="single_shape_options_menu" id="sss_text_sso" style="display:none">
					  
					  <div id="book_text_append_"><div id="_text_append_">
					  <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Text</span></div></div>
					  <div id="for_move_canvas_text" class="margin_top_15"></div>
					  <div id="text_sliders">
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="text_options" >
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
						     <tr  class="option_name_tool_single color_tool_row" >
								 <td class="option_font"> Text </td>
								  <td>
										 <div class="booking_value_div">					
										   <input class="booking_text_input booking_value" type="text" id="text_shape_value" value="Default"/>
										</div>
								  </td>						   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Text color </td>
										 <td><div id="text_line_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td class="option_font"> Opacity </td>       
								  <td>					   
										   <div class="for_slider"  >
												<div id="text__opacity" style="width:150px;"></div>
										   </div>
								  </td>
							   </tr>
                               <tr   class="option_name_tool_single color_tool_row" >
								  <td class="option_font"> Font family </td>
									       <td>
												<select  class="font_selectors"  id="font__selector">
												  <option value="Varela, sans-serif"  selected><span style="font-family:Varela, sans-serif;">Varela</span></option>
												  <option value="cursive"><span  style="font-family:cursive">cursive</span></option>
												  <option value="monospace" style="font-family:monospace">monospace</option>
												  <option value="sans-serif" style="font-family:sans-serif">sans-serif</option>
												  <option value="'Josefin Sans', sans-serif" style="font-family:'Josefin Sans', sans-serif">Josefin</option>
												  <option value="PT Sans Caption" style="font-family:PT Sans Caption">PT Sans</option>
												  <option value="Montserrat" style="font-family:Montserrat">Montserrat</option>
												  <option value="Open Sans" style="font-family:Open Sans">Open Sans</option>
												  <option value="'Arimo', sans-serif;" style="font-family: 'Arimo', sans-serif;">Arimo</option>
												  <option value="'Dancing Script', cursive" style="font-family:'Dancing Script', cursive">Dancing</option>
											   </select>
										   </td>
							  </tr>
                              <tr   class="option_name_tool_single color_tool_row" >
									 <td class="option_font"> Font size </td>
									 <td>
												<select  class="font_selectors"  id="font_size_selector">
												  <option value="5">5px</option>
												  <option value="6">6px</option>
												  <option value="7">7px</option>
												  <option value="8">8px</option>
												  <option value="10" >10px</option>
												  <option value="11" selected>11px</option>
												  <option value="12">12px</option>
												  <option value="14">14px</option>
										          <option value="16">16px</option>
												  <option value="18">18px</option>
												  <option value="20">20px</option>
										          <option value="24">24px</option>
												  <option value="28">28px</option>
												  <option value="36">36px</option>
										          <option value="48">48px</option>
											   </select>
										   </td>
							  </tr>
							  <tr   class="option_name_tool_single color_tool_row" >
                                  <td class="option_font"> Font style </td>
								  <td>
												<select class="font_selectors"  id="font_style_selector">
												  <option value="normal" selected>normal</option>
												  <option value="italic">italic</option>
												  <option value="bold">bold</option>
											   </select>
								  </td>
							  </tr>
							  <tr   class="option_name_tool_single color_tool_row optional_row_" >
								 <td class="option_font">  Text Shadow </td>
								 <td>
												<input type="checkbox" id="checkboxTextShadow" class="css-checkbox" checked="checked"/>
								 </td>
							  </tr>
							 <tr   class="option_name_tool_single color_tool_row" >
								  <td colspan="2">	
									 <table class="text_shadow_options_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
                                                <tr class="text_shadow_text">
												    <td>x-offset</td>
                                                    <td>y-offset</td>
                                                    <td>blur</td>
                                                    <td>color</td>
                                                </tr>
                                                <tr  class="text_shadow_selectors">												
												  <td><input class="booking_spinner shadow_spinner"  id="shadow_x_spinner"/></td>
                                                  <td><input class="booking_spinner shadow_spinner"  id="shadow_y_spinner"/></td>
                                                  <td><input class="booking_spinner shadow_spinner"  id="shadow_blur_spinner"/></td>
                                                  <td style="width:28%;"><div id="text_shadow_color" class="pick_color small_pick"></div></td>
												</tr>
									</table>
								  </td>
							  </tr>  
						 </table>
					   </div>	
					  </div>
					  </div></div>
				  </div>
			      <div class="single_shape_options_menu" id="sss_table_sso" style="display:none">
				      <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Tables</span></div></div>
					  <div id="hide_on_empty_table" style="display:none"  class="margin_top_15">
					  <div id="for_move_table_image">
							<div class="chosed_img_right " >
							  <div class="shadow_on_top">
								<img id="show_table_image" class="show_image_in_menu"/>
							  </div>
							</div>
							<input id="json_saved_imgPicker_table" style="display:none" type="text" />
					  </div>
						  <div id="table_sliders">
						   <div class="canvas_figure_options" name="canvas_figure_options"  >
							 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
								<tr   class="option_name_tool_single slider_row_" >
										   <td class="option_font"> Image opacity </td>
											<td>					   
											   <div class="for_slider" >
												   <div id="table_img_alpha_slider" style="width:150px;"></div>
											   </div>
										  </td>
									   </tr>
								</table>
						  </div>
						  </div>
					  </div>
					  <div class="picker_table" name="picker_table" id="table_picker_w" >
						<div class="internal_picker " id="table_picker">
				   	      <img class="bg_pick_image left" src="img/tables/pick/t_p_1_60.png" id="t_p_1" onclick="imgPicker(this,'show_table_image','table');" >
					      <img class="bg_pick_image left" src="img/tables/pick/t_p_2_60.png" id="t_p_2" onclick="imgPicker(this,'show_table_image','table');" > 
					      <img class="bg_pick_image left" src="img/tables/pick/t_p_3_60.png" id="t_p_3" onclick="imgPicker(this,'show_table_image','table');" > 
					      <img class="bg_pick_image left" src="img/tables/pick/t_p_4_60.png" id="t_p_4" onclick="imgPicker(this,'show_table_image','table');" >
					      <img class="bg_pick_image left" src="img/tables/pick/t_p_5_60.png" id="t_p_5" onclick="imgPicker(this,'show_table_image','table');" >
					      <img class="bg_pick_image left" src="img/tables/pick/t_p_6_60.png" id="t_p_6" onclick="imgPicker(this,'show_table_image','table');" >
						</div>
					  </div>	
                      <div id="actual_uploads_table" style="display:none">
                        <div id="actual_uploads_table_server">
					     <img  src="img/tables/t_p_1_200.png" id="t_p_1_actual"  >
					     <img  src="img/tables/t_p_2_188.png" id="t_p_2_actual"  >
					     <img  src="img/tables/t_p_3_175.png" id="t_p_3_actual"  >
					     <img  src="img/tables/t_p_4_200.png" id="t_p_4_actual"  >
					     <img  src="img/tables/t_p_5_200.png" id="t_p_5_actual"  >
					     <img  src="img/tables/t_p_6_200.png" id="t_p_6_actual"  >					 
						</div>
                      </div>	
                    				  
				  </div>
			      <div class="single_shape_options_menu" id="sss_chair_sso" style="display:none">
				      <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Chairs</span></div></div>
					  <div id="hide_on_empty_chair" style="display:none"  class="margin_top_15">
					  <div id="for_move_chair_image">
							<div class="chosed_img_right " >
							  <div class="shadow_on_top">
								<img id="show_chair_image" class="show_image_in_menu"/>
							  </div>
							</div>
							<input id="json_saved_imgPicker_chair" style="display:none" type="text" />
					  </div>
					  <div id="chair_sliders">
						   <div class="canvas_figure_options" name="canvas_figure_options"  >
							 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
								<tr   class="option_name_tool_single slider_row_" >
										   <td class="option_font"> Image opacity </td>
											<td>					   
											   <div class="for_slider" >
												   <div id="chair_img_alpha_slider" style="width:150px;"></div>
											   </div>
										  </td>
									   </tr>
								</table>
						  </div>
					  </div>
					  </div>
					  <div class="picker_table" name="picker_table" id="chair_picker_w" >
						<div class="internal_picker " id="chair_picker">
						  <img class="bg_pick_image left" src="img/chairs/pick/c_p_1_60.png" id="c_p_1" onclick="imgPicker(this,'show_chair_image','chair');">
						  <img class="bg_pick_image left" src="img/chairs/pick/c_p_2_60.png" id="c_p_2" onclick="imgPicker(this,'show_chair_image','chair');" >
						  <img class="bg_pick_image left" src="img/chairs/pick/c_p_3_60.png" id="c_p_3" onclick="imgPicker(this,'show_chair_image','chair');" >
						  <img class="bg_pick_image left" src="img/chairs/pick/c_p_4_60.png" id="c_p_4" onclick="imgPicker(this,'show_chair_image','chair');" >
						  <img class="bg_pick_image left" src="img/chairs/pick/c_p_5_60.png" id="c_p_5" onclick="imgPicker(this,'show_chair_image','chair');" >
						  <img class="bg_pick_image left" src="img/chairs/pick/c_p_6_60.png" id="c_p_6" onclick="imgPicker(this,'show_chair_image','chair');" >
						</div>
					  </div>	
                      <div id="actual_uploads_chair" style="display:none">
                        <div id="actual_uploads_chair_server">	
                         <img  src="img/chairs/c_p_1_60.png" id="c_p_1_actual" >
					     <img  src="img/chairs/c_p_2_60.png" id="c_p_2_actual" >
					     <img  src="img/chairs/c_p_3_60.png" id="c_p_3_actual" >
					     <img  src="img/chairs/c_p_4_60.png" id="c_p_4_actual" >
					     <img  src="img/chairs/c_p_5_60.png" id="c_p_5_actual" >
					     <img  src="img/chairs/c_p_6_60.png" id="c_p_6_actual" >						 
						</div>
                      </div>					  
				  </div>
			      <div class="single_shape_options_menu" id="sss_combo_sso" style="display:none">
                     <div class="sso_header "><div class="sso_head_line"><span class="sso_head_span">Combinations</span></div></div>
					  <div id="hide_on_empty_combo" style="display:none" class="margin_top_15">
					  <div id="for_move_combo_image">
							<div class="chosed_img_right " >
							  <div class="shadow_on_top">
								<img id="show_combo_image" class="show_image_in_menu"/>
							  </div>
							</div>
							<input id="json_saved_imgPicker_combo" style="display:none" type="text" />
					  </div>
						  <div id="combo_sliders">
						   <div class="canvas_figure_options" name="canvas_figure_options"  >
							 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
								<tr   class="option_name_tool_single slider_row_" >
										   <td class="option_font"> Image opacity </td>
											<td>					   
											   <div class="for_slider" >
												   <div id="combo_img_alpha_slider" style="width:150px;"></div>
											   </div>
										  </td>
									   </tr>
								</table>
						   </div>
						  </div>
					  </div>
					  <div class="picker_table" name="picker_table" id="combo_picker_w" >
						<div class="internal_picker " id="combo_picker">						
						 <img class="bg_pick_image left" src="img/combo/pick/com_p_1_100.png" id="com_p_1"  onclick="imgPicker(this,'show_combo_image','combo');">
					     <img class="bg_pick_image left" src="img/combo/pick/com_p_2_100.png" id="com_p_2"  onclick="imgPicker(this,'show_combo_image','combo');">
					     <img class="bg_pick_image left" src="img/combo/pick/com_p_3_100.png" id="com_p_3"  onclick="imgPicker(this,'show_combo_image','combo');">
					     <img class="bg_pick_image left " src="img/combo/pick/com_p_4_100.png" id="com_p_4" onclick="imgPicker(this,'show_combo_image','combo');">
					     <img class="bg_pick_image left" src="img/combo/pick/com_p_5_100.png" id="com_p_5"  onclick="imgPicker(this,'show_combo_image','combo');">
					     <img class="bg_pick_image left" src="img/combo/pick/com_p_6_100.png" id="com_p_6"  onclick="imgPicker(this,'show_combo_image','combo');">
						</div>
					  </div>	
                      <div id="actual_uploads_combo" style="display:none">
                        <div id="actual_uploads_combo_server">	
                         <img  src="img/combo/com_p_1_200.png" id="com_p_1_actual"  style="display:none">
					     <img  src="img/combo/com_p_2_200.png" id="com_p_2_actual"  style="display:none">
					     <img  src="img/combo/com_p_3_200.png" id="com_p_3_actual"  style="display:none">
					     <img  src="img/combo/com_p_4_200.png" id="com_p_4_actual"  style="display:none">
					     <img  src="img/combo/com_p_5_200.png" id="com_p_5_actual"  style="display:none">
					      <img  src="img/combo/com_p_6_200.png" id="com_p_6_actual"  style="display:none">						 
						</div>
                      </div>									  
				  </div>
			      <div class="single_shape_options_menu" id="sss_user_sso" style="display:none">				      
					  <div id="for_upload_user_button" class="margin_top_35">
					     <div id="upload_user_image_button" onclick="fileUpload('userImageUpload_input')"><span class="material-icons file_upload_mat">file_upload</span>Upload Image</div>
					  </div>
					  <div style="display:none">
					  	 <input type="file" id="userImageUpload_input" style='display:none;position:absolute;top:-1000px'>
						 <div id="user_uploaded_images" style="display:none">
						   <!-- Here uploaded images will be added -->
						 </div>
						 <img id="temp_image_for_canvas_creation" style="display:none">
						 <input id="json_saved_imgPicker_user" style="display:none" type="text" />
						 <canvas  width="200" height="200" id="translated_user_images_canvas" style="display:none"></canvas>
					  </div>
					  <div id="show_on_upload_user" style="display:none"  class="margin_top_35">
					  <div id="for_move_user_image">
							<div class="chosed_img " >
								<img id="chosed_image"/>
							</div>
					  </div>
						  <div id="user_sliders">
							 <div class="canvas_figure_options" name="canvas_figure_options"  id="image__options" >
							 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
								   <tr   class="option_name_tool_single slider_row_" >
									   <td class="option_font"> Image opacity </td>
										<td>					   
										   <div class="for_slider"  id="user_oacity_slider_move" >
									           <div id="user_img_alpha_slider" style="width:150px;"></div>
										   </div>
									  </td>
								   </tr>
							</table>
							</div>
						  </div>
						<div class="picker_table" name="picker_table" id="user_picker_w" >
						   <div class="internal_picker " id="user_picker">
						   
						   </div>
						</div>
					  </div>
				  </div>
			   </div>
			 </div>
			 
			</div>
		  </div>
		  <div id="dr_center_column_wrap">
		   <div id="canvas_td">

		   	<div id="floor_options" style="z-index:1000">
			<span class="floor_options_text">Floor options:</span>
		    <table id="floor_options_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
			  <tr >
			    <td id="floor_selector_td">
				  <select    id="floor__selector">
				  </select>												 
				</td>
				<td id="add_floor_td">
				  <div id="add_floor_div_btn"><div class="material-icons floors_material_buttons"  onclick="AddFloor()">add</div></div>
				</td>
				<td id="rename_floor_btn_td">
				  <div id="rename_floor_div_cbtn"  ><div class="material-icons floors_material_buttons floors_material_buttons_tf"  onclick="RenameFloor()">text_format</div></div>
				</td>
				<td class="rename_floor_input_td" style="display:none">
				  <input id="rename_floor_input"/>
				</td>
				<td class="rename_floor_input_td" style="display:none">
				  <div id="rename_floor_div_done" onclick="RenameFloorDone()">Done</div>
				</td>
				<td class="add_floor_input_td" style="display:none">
				  <input id="add_floor_input"/>
				</td>
				<td class="add_floor_input_td" style="display:none">
				  <div id="add_floor_div_done"  onclick="AddFloorAdd()">Add</div>
				</td>
				<td id="cancel_floor_td" style="display:none">
				  <div id="cancel_floor"  onclick="CancelFloor()">Cancel</div>
				</td>
				<td id="remove_floor_td"  style="display:none">
				  <div id="clear_floor_div_cbtn"><div class="material-icons floors_material_buttons floors_material_buttons_clear"  onclick="DeleteFloorPre()">clear</div></div>
				</td>
			  </tr>
			</table>
		  </div>	
		  <div id="mso_relative_div" style="display:none">
			  <div id="multiple_selection_options" >
				<table id="multiple_selection_options_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
				   <tr >
					 <td id="mst_par" ><div class="mst_par">Multiple selection options:</div></td>
					 <td class="msotd" onclick="allShapesLeft();"            ><img src="img/transparent.png"  id="left_all_mso" class="multiple_sel_img"      > </td>
					 <td class="msotd" onclick="allShapesRight()"            ><img src="img/transparent.png"  id="right_all_mso" class="multiple_sel_img"     > </td>
					 <td class="msotd" onclick="allShapesBottom()"           ><img src="img/transparent.png"  id="bottom_all_mso" class="multiple_sel_img"    > </td>
					 <td class="msotd" onclick="allShapesTop()"              ><img src="img/transparent.png"  id="top_all_mso" class="multiple_sel_img"       ></td>
					 <td class="msotd" onclick="allShapesSpreadHorisontal()" ><img src="img/transparent.png"  id="hor_all_mso" class="multiple_sel_img" ></td>
					 <td class="msotd" onclick="allShapesSpreadVertical()"   ><img src="img/transparent.png"  id="ver_all_mso" class="multiple_sel_img" ></td>
				   </tr>
				</table>
			  </div>
		  </div> 
			  <div id="zoom_options">
					<div id="plus_minus_wrap">
						   <div id="zoom_plus_div" onclick="sizeUp()" title="Zoom-In">+</div>
                           <div id="zoom_split"></div>
						   <div id="zoom_minus_div"  onclick="sizeDown()"  title="Zoom-Out">-</div>
				    </div>
				    <div id="zoom_reset_div" onclick="zoomReset()"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>
			  </div>
		   <div id="canvas_wrapper" name="canvas_not_scroll" class="canvas_floor_wrap"> 
	         <div class="canvas_floor_wrap" id="canvas_append">
	         
<% 
      for (PPSubmitObject floor : canvasStateList) {
    	   String floorid = floor.getFloorid();
    	   String display="none";
    	   if(floor.isMainfloor()) {display="";}
    	   %>
			  <canvas id="canvas_<%=floorid%>" style="display:<%=display%>"width="400" height="400"  tabindex='1' class="cmenu2 main_canvas" >
				This text is displayed if your browser does not support HTML5 Canvas.
			  </canvas>
   <%} %>	

		     </div>
			  <div id="canvas_drawall_images"  style="display:none" >
			   
			  </div>
			  <div id="menu2" style="display:none;">
	               <table id="menu_table" cellspacing="0" cellpadding="0">
				      <tr >
					  <td class="menu_img_td"><img class="menu_img" id="menu_img_copy" src="img/transparent.png"> </td>
					  <td>
					    <div id="copy_menu" class="menu_option" >Copy</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  id="menu_img_paste"  src="img/transparent.png"> </td><td>
					    <div id="paste_menu" class="menu_option">Paste</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  id="menu_img_delete"  src="img/transparent.png"> </td><td>
					    <div id="delete_menu" class="menu_option">Delete</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  id="menu_img_forward"  src="img/transparent.png" > </td><td>
					    <div id="bringForward_menu" class="menu_option ">Bring Forward</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  id="menu_img_backward"  src="img/transparent.png"> </td><td>
					    <div id="bringBack_menu" class="menu_option">Bring Backward</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img" id="menu_img_top"  src="img/transparent.png"> </td><td>
					    <div id="bringToTop_menu" class="menu_option ">Bring to Top</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  id="menu_img_back"  src="img/transparent.png"> </td><td>
					    <div id="bringToBottom_menu" class="menu_option ">Bring to Back</div>
					  </td></tr>
					  <tr class ="only_multi">
					  <td class="menu_img_td "><img class="menu_img"  id="menu_img_group"  src="img/transparent.png"> </td><td>
					    <div id="Group_menu" class="menu_option ">Group</div>
					  </td></tr>
				   </table>
              </div>
			 </div>
		</div>
		  </div>	  
		  <div id="dr_right_column_wrap">
		    <div id="selected_on_canvas_wrap">
			  <div class="info_box_header">Selected on place</div>
			  <div id="selected_info_main_block">
			     <div id="selected_img_canvas_wrap">
				 
				 </div>
				 <div id="selected_sliders">
				    	<table class="canvas_options_table" id="selected_options_tr"  cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							   <tr   class="option_name_tool_single slider_row_" id="selected_rotation_tr"   name="selected_options">
								  <td class="option_font"> Rotation </td>       
								  <td>					   
										   <div class="for_slider_selected"  >
												<div id="rotate_slider" style="width:120px;"></div>
										   </div>
								  </td>
							   </tr>
							  <tr  class="option_name_tool_single color_tool_row" id="sel_line_col_tr"  name="selected_options">
										 <td class="option_font"> Line color </td>
										 <td><div id="selected_line_color" class="pick_color"></div></td>						   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" id="sel_fill_col_tr"   name="selected_options">
										 <td class="option_font"> Fill color </td>
										 <td><div id="selected_fill_color" class="pick_color"></div></td>					   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" id="selected_figure_opacity_tr"  name="selected_options">
                                   <td class="option_font"> Opacity </td>
								    <td>					   
										   <div class="for_slider_selected"   >
												<div id="selected_figure_opacity_slider" style="width:120px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" id="selected_figure_line_opacity_tr"   name="selected_options">
								  <td class="option_font"> Line opacity </td>       
								  <td>					   
										   <div class="for_slider_selected"  >
												<div id="selected_figure_line_opacity_slider" style="width:120px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" id="selected_line_width_tr"  name="selected_options" >
                                 <td class="option_font"> Line width </td>
								 <td>					   
										   <div class="for_slider_selected"  >
												<div id="selected_Lwidth_slider"   style="width:120px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" id="selected_round_radius_tr"  name="selected_options">
								 <td class="option_font"> Corner radius </td>
								 <td>					   
										   <div class="for_slider_selected"  >
												<div id="selected_round_radius_slider"   style="width:120px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" id="selected_trapex_cutX_tr"  name="selected_options" >
								 <td class="option_font"> Cut side </td>
								 <td>					   
										   <div class="for_slider_selected"  >
												<div id="selected_trapex_cutX_slider"   style="width:120px;"></div>
										   </div>
								  </td>
							   </tr>
							   <tr   id="selected_text_area"  name="selected_options" >
								 <td colspan="2">
								  <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
									 <tr  class="option_name_tool_single color_tool_row" >
										 <td class="option_font"> Text </td>
										  <td>
												 <div class="booking_value_div">					
												   <input class="booking_text_input_selected booking_value" type="text" id="selected_text_shape_value" />
												</div>
										  </td>						   
									  </tr>
									  <tr  class="option_name_tool_single color_tool_row" >
												 <td class="option_font"> Color </td>
												 <td><div id="selected_text_line_color" class="pick_color"></div></td>					   
									  </tr>
									<tr   class="option_name_tool_single slider_row_" >
									  <td class="option_font"> Rotation </td>       
									  <td>					   
											   <div class="for_slider_selected"  >
													<div id="text_rotate_slider" style="width:120px;"></div>
											   </div>
									  </td>
								   </tr>
									   <tr   class="option_name_tool_single slider_row_" >
										  <td class="option_font"> Opacity </td>       
										  <td>					   
												   <div class="for_slider_selected"  >
														<div id="selected_text__opacity" style="width:120px;"></div>
												   </div>
										  </td>
									   </tr>
									   <tr   class="option_name_tool_single color_tool_row" >
										  <td class="option_font"> Family </td>
												   <td>
														<select  class="font_selectors"  id="selected_font__selector">
														  <option value="Varela, sans-serif"  selected><span style="font-family:Varela, sans-serif;">Varela</span></option>
														  <option value="cursive"><span  style="font-family:cursive">cursive</span></option>
														  <option value="monospace" style="font-family:monospace">monospace</option>
														  <option value="sans-serif" style="font-family:sans-serif">sans-serif</option>
														  <option value="'Josefin Sans', sans-serif" style="font-family:'Josefin Sans', sans-serif">Josefin</option>
														  <option value="PT Sans Caption" style="font-family:PT Sans Caption">PT Sans</option>
														  <option value="Montserrat" style="font-family:Montserrat">Montserrat</option>
														  <option value="Open Sans" style="font-family:Open Sans">Open Sans</option>
														  <option value="'Arimo', sans-serif;" style="font-family: 'Arimo', sans-serif;">Arimo</option>
														  <option value="'Dancing Script', cursive" style="font-family:'Dancing Script', cursive">Dancing</option>
													   </select>
												   </td>
									  </tr>
									  <tr   class="option_name_tool_single color_tool_row" >
											 <td class="option_font"> Size </td>
											 <td>
														<select  class="font_selectors"  id="selected_font_size_selector">
														  <option value="5">5px</option>
														  <option value="6">6px</option>
														  <option value="7">7px</option>
														  <option value="8">8px</option>
														  <option value="10" >10px</option>
														  <option value="11" selected>11px</option>
														  <option value="12">12px</option>
														  <option value="14">14px</option>
														  <option value="16">16px</option>
														  <option value="18">18px</option>
														  <option value="20">20px</option>
														  <option value="24">24px</option>
														  <option value="28">28px</option>
														  <option value="36">36px</option>
														  <option value="48">48px</option>
													   </select>
												   </td>
									  </tr>
									  <tr   class="option_name_tool_single color_tool_row" >
										  <td class="option_font"> Style </td>
										  <td>
														<select class="font_selectors"  id="selected_font_style_selector">
														  <option value="normal" selected>normal</option>
														  <option value="italic">italic</option>
														  <option value="bold">bold</option>
													   </select>
										  </td>
									  </tr>
									  <tr   class="option_name_tool_single color_tool_row optional_row_" >
										 <td class="option_font">  Shadow </td>
										 <td>
														<input type="checkbox" id="selected_checkboxTextShadow" class="css-checkbox" checked="checked"/>
										 </td>
									  </tr>
									 <tr   class="option_name_tool_single color_tool_row" >
										  <td colspan="2">	
											 <table class="text_shadow_options_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
														<tr class="text_shadow_text">
															<td>x-offset</td>
															<td>y-offset</td>
															<td>blur</td>
															<td>color</td>
														</tr>
														<tr  class="text_shadow_selectors">												
														  <td><input class="booking_spinner shadow_spinner"  id="selected_shadow_x_spinner"/></td>
														  <td><input class="booking_spinner shadow_spinner"  id="selected_shadow_y_spinner"/></td>
														  <td><input class="booking_spinner shadow_spinner"  id="selected_shadow_blur_spinner"/></td>
														  <td style="width:28%;"><div id="selected_text_shadow_color" class="pick_color small_pick"></div></td>
														</tr>
											</table>
										  </td>
									  </tr>  
								 </table>
								  </td>
							   </tr>
						 </table>
				 </div>
			  </div>
			</div>
		    <div id="used_images_wrap">
			  <div class="info_box_header" id="hist_header">Booking options</div>
              <div class="top_explain_sub border_bottom_grey" style="display:none">Set booking options for selected shape</div>
			  <div id="booking_options_wrap_" style="display:none">
			    <div class="booking_name_var border_bottom_grey">
				  <div class="booking_name_">Booking available</div>
				  <div class="booking_var_ custom_bokable_position"><input type="checkbox" id="book-able" class="css-checkbox " checked="checked" name="book-able"></div>
				</div>
			    <div class="booking_name_var border_bottom_grey">
				  <div class="booking_name_">Name</div>
				  <div class="booking_var_ for_input_custom">
				     <input class="booking_text_input booking_value" type="text" id="booking_shape_name" maxlength="4"/>
				     <div id="name_Error_bottom" style="display:none">SUCH NAME EXISTS</div>
				  </div>
				</div>

			    <div class="booking_name_var border_bottom_grey">
				  <div class="booking_name_">Min persons</div>
				  <div class="booking_var_ custom_spinner_position">
				     <div class="my_p_spinner">
					    <div id="min_p_minus" class="my_p_spinner_btn my_p_spinner_btn_left material-icons">remove</div>
                        <input type="number" id="min_p_value" class="my_p_spinner_input" value="1" readonly>
						<div id="min_p_plus" class="my_p_spinner_btn my_p_spinner_btn_right material-icons">add</div>
					 </div>
				  </div>
				</div>	
			    <div class="booking_name_var border_bottom_grey">
				  <div class="booking_name_">Max persons</div>
				  <div class="booking_var_ custom_spinner_position">
				     <div class="my_p_spinner">
					    <div id="max_p_minus" class="my_p_spinner_btn my_p_spinner_btn_left material-icons">remove</div>
                        <input type="number" id="max_p_value"  class="my_p_spinner_input" value="1" readonly/>
						<div id="max_p_plus" class="my_p_spinner_btn my_p_spinner_btn_right material-icons">add</div>
					 </div>
				  </div>
				</div>				
			  </div>
			</div>
		  </div>
	  </div>
	  <div id="dr_bottom_section">
	  
	  </div>
	  <div id="hidden_values" style="display:none">
	    <canvas id = "group_shapes_canvas"  width="400" height="400"  style="display:none"></canvas>
		<canvas id = "text_width_calculation_canvas"  width="10" height="10"  style="display:none"></canvas>
		  <img id="mirror" style="display:none"/>
	    <div class="chosed_canvas chosed_img" id="move_show_canvas"><canvas id="show_canvas" width="120" height="120" ></canvas></div>
		<div class="chosed_canvas chosed_img" id="move_text_canvas"><canvas id="show_text_canvas" width="250" height="70" ></canvas></div>
		<div id="history_div_scrollable" ><div id="history_images_wrapper"></div></div>
				  <div id="canvas_shapes_images" style="display:none;">
				   
				  </div>
		<canvas id="default_img_canvas"></canvas>	
		<div id="bg_default_img_mirror" style="display:none">
		    <img  crossOrigin="Anonymous"  id="default_bg_image_mirror"/>
		</div>
		<div id="chosed_background_orig_wrap" style="display:none">
			<img id="chosed_background_orig" />
		</div>
	  </div>
   </div>
</div> 
    </body>
</html>