<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import = "com.dimab.pp.dto.UserPlace"
    import = "com.dimab.pp.dto.WelcomePageData"
    import = "java.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Draw Tool</title>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="js/loginlogout.js" ></script>
    <script type="text/javascript" src="js/dropit.js" ></script>
    
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/colpick.js" ></script>
    <script type="text/javascript" src="js/shapes.js"></script>
	<script type="text/javascript" src="js/printlog.js"></script>
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
	<script type="text/javascript" src="js/bookingOptions.js"></script>
	<script type="text/javascript" src="js/cmenu2.js"></script>
	
    <link rel="stylesheet" href="css/browserWrap.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/colpick.css" type="text/css"/>
	<link rel="stylesheet" href="css/slider.css" type="text/css"/>
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen" />
	<script type="text/javascript">
	function goToAccountMenu() {
		setSessionData(function(result) {
			   if(result) {
		          document.getElementById("master_account").submit();
			   } else {
				   updatePageView();
			   }
	     });
	}
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
	function PlaceConfiguration(placeID) {
	 	   var formid = placeID + "_config_form";
	 	   document.getElementById(formid).submit();
	}
	
       if(typeof document.onselectstart!="undefined") {
	       document.onselectstart = new Function ("return false");
	   } else {
	       document.onmousedown = new Function ("return false");
		   document.onmouseup = new Function ("return true");
	   }
	   var gcanvas ;
	   var floorCanvases = [];
	   var floorNames = {};
       function init() {
    	   "use strict";
    	   canvas_ = new CanvasState(document.getElementById('canvas1'));
		   gcanvas = new CanvasState(document.getElementById('group_shapes_canvas'));
		   canvas_.main = true;
		   canvas_.mainfloor = true;
		   canvas_.floor_name = "Floor-1";
		   floorCanvases.push(canvas_);
		   floorNames["Floor-1"] = canvas_;
		   
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
	  
		  $("#login_prop").show();
		  $("#login_info_resp").hide();
		  $("#account_drop").hide();

		  $("#login_info_resp_d").empty();
		  
		  $("#fb_logout_div").hide();
		  $("#go_logout_div").hide();
		  
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
  	
  <body onload="init()" style="margin: 0px;">
  
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

          <div id="mso_relative_div" style="display:none">
			  <div id="multiple_selection_options" >
				<table id="multiple_selection_options_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
				   <tr >
					 <td id="mst_par" ><div class="mst_par">Multiple selection options:</div></td>
					 <td class="msotd" onclick="allShapesLeft();"            ><img src="img/manipulate/left100.png" class="multiple_sel_img"      ></img></td>
					 <td class="msotd" onclick="allShapesRight()"            ><img src="img/manipulate/right100.png" class="multiple_sel_img"     ></img></td>
					 <td class="msotd" onclick="allShapesCenter()"           ><img src="img/manipulate/middle100.png" class="multiple_sel_img"    ></img></td>
					 <td class="msotd" onclick="allShapesBottom()"           ><img src="img/manipulate/bottom100.png" class="multiple_sel_img"    ></img></td>
					 <td class="msotd" onclick="allShapesTop()"              ><img src="img/manipulate/top100.png" class="multiple_sel_img"       ></img></td>
					 <td class="msotd" onclick="allShapesMiddle()"           ><img src="img/manipulate/center100.png" class="multiple_sel_img"    ></img></td>
					 <td class="msotd" onclick="allShapesSpreadHorisontal()" ><img src="img/manipulate/spreadhor100.png" class="multiple_sel_img" ></img></td>
					 <td class="msotd" onclick="allShapesSpreadVertical()"   ><img src="img/manipulate/spreadver100.png" class="multiple_sel_img" ></img></td>
				   </tr>
				</table>
			  </div>
		  </div> 
  
  <table id="body_table"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
   <tr id="header_tr"><td id="header_td">
    <div id="header"><div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
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
   <tr id="content_tr"><td id="content_td">
    <div id="container">
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
        <% 
        String creatingFlow = (String)request.getAttribute("creatingFlow");
        
        if (creatingFlow!=null && creatingFlow.equals("true")) {
        	String placeName = (String)request.getAttribute("placeName");
        	String placeBranchName =(String)request.getAttribute("placeBranchName");
        	String placeAddress =(String)request.getAttribute("placeAddress");
        	String placeUniqID =(String)request.getAttribute("placeUniqID");
        	%>
        	<div class="outer_width100" >


       	  <div class="creatingTourText">
        	  <span class="steps">Step 2: </span> Draw your "<span class="placeNamespan">
        	          <%=placeName %> (<%=placeBranchName %>)</span>"
        	          <% if (placeAddress!= null && !placeAddress.isEmpty()) {%>
        	          , located at "<span class="placeAddress_"><%=placeAddress %></span>"
        	          <% } %>
        	      <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
        	      <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
        	      <input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeUniqID %>' style="display:none"/>
        	      <input type="text" id="server_Address" name="userSetPlaceBName" value='<%=(String)request.getAttribute("placeAddress") %>' style="display:none"/>
        	      <input type="text" id="server_Lat" name="userSetPlaceBName" value='<%=(Double)request.getAttribute("placeLat") %>' style="display:none"/>
        	      <input type="text" id="server_Lng" name="userSetPlaceBName" value='<%=(Double)request.getAttribute("placeLng") %>' style="display:none"/>
        	      
        	</div>
        	</div>
        	<% 
          }
        %>
	    <div id="tool_options_tr">
		  <table id="draw_buttons_tbl"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		    <tr><td colspan="2"><div class="text_head">Border size</div></td></tr>			
		    <tr  style="height: 22px;">
			  <td style="width: 49%;">
			    <div class="text" >Width:</div>
			  </td>
			  <td style="width: 49%;">
			    <div class="text" >Height:</div>
			  </td>			  
			</tr>
		    <tr style="height: 22px;">
			  <td>
			    <div class="size_value"><input id="canvas_w" type="text" onchange="setCanvasSize('canvas_w','canvas_h')" value="400"/></div>
			  </td>
			  <td>
			    <div class="size_value"><input id="canvas_h" type="text"  onchange="setCanvasSize('canvas_w','canvas_h')"  value="400"/></div>
			  </td>			  
			</tr>	
		   <tr style="height:5px"><td></td></tr>
		   <tr><td colspan="2"><div class="text_head">Draw objects</div></td></tr>
           <tr style="height:5px"><td></td></tr>
           <tr >
			  <td class="draw_btn_left draw_btn">
			    <div class=" button_text" id="canvas_background_btn" onclick="showPicker('background_picker_w','background_picker');">Background
				  <div class="picker_table" name="picker_table" id="background_picker_w" style="display:none">
				    <div class="internal_picker" id="background_picker">
					  <img class="bg_pick_image left" src="img/background/pick/b_p_1_60.png" id="b_p_1" onclick="selectedBackground(this,'background_picker_w','b_p_1_actual');"/>
					  <img id="b_p_1_actual"  src="img/background/b_p_1.png" style="display:none"/>
					  <img class="bg_pick_image right" src="img/background/pick/b_p_2_60.png" id="b_p_2" onclick="selectedBackground(this,'background_picker_w','b_p_2_actual');"/>
					  <img id="b_p_2_actual"  src="img/background/b_p_2.png" style="display:none"/>
					  <img class="bg_pick_image left" src="img/background/pick/b_p_3_60.png" id="b_p_3" onclick="selectedBackground(this,'background_picker_w','b_p_3_actual');"/>
					  <img id="b_p_3_actual"  src="img/background/b_p_3.png" style="display:none"/>
					  <img class="bg_pick_image right" src="img/background/pick/b_p_4_60.png" id="b_p_4" onclick="selectedBackground(this,'background_picker_w','b_p_4_actual');"/>
					  <img id="b_p_4_actual"  src="img/background/b_p_4.png" style="display:none"/>
					</div>
				  </div>
				  <div id="bg_default_img_mirror" style="display:none">
				   <canvas id="default_img_canvas"></canvas>
				   <img id="default_bg_image_mirror"/>
				  </div>
				  <div id="canvas_shapes_images" style="display:none;">
				   
				  </div>
				  
				</div>
			  </td>
			  <td class="draw_btn_right draw_btn">
			    <div class=" button_text" id="custom_bg" onclick="openBackgroundOptions();">Custom background</div>
			  </td>			  
			</tr>  
            <tr >
			  <td  class="draw_btn_left draw_btn">
			    <div class=" button_text" id="back_color_pick">Background Color</div>
			  </td>
			  <td class="draw_btn_right draw_btn">
			   <div class=" button_text" id="text_shape_btn"  onclick="ShapePicker(this,'figures_picker_w','text');">Text</div>
			  </td>			  
			</tr>
 		    <tr >
			  <td  class="draw_btn_left draw_btn">
			    <div class="button_text" id="chairs_btn"  onclick="showPicker('chairs_picker_w','chairs_picker');">Chairs
                  <div class="picker_table" name="picker_table" id="chairs_picker_w" style="display:none">
				    <div class="internal_picker " id="chairs_picker">
					  <img class="bg_pick_image left" src="img/chairs/pick/c_p_1_60.png" id="c_p_1" onclick="imgPicker(this,'chairs_picker_w','c_p_1_actual');">
					  <img  src="img/chairs/c_p_1_60.png" id="c_p_1_actual"  style="display:none">
					  <img class="bg_pick_image right" src="img/chairs/pick/c_p_2_60.png" id="c_p_2" onclick="imgPicker(this,'chairs_picker_w','c_p_2_actual');">
					  <img  src="img/chairs/c_p_2_60.png" id="c_p_2_actual"  style="display:none">
					  <img class="bg_pick_image left" src="img/chairs/pick/c_p_3_60.png" id="c_p_3" onclick="imgPicker(this,'chairs_picker_w','c_p_3_actual');">
					  <img  src="img/chairs/c_p_3_60.png" id="c_p_3_actual"  style="display:none">
					  <img class="bg_pick_image right" src="img/chairs/pick/c_p_4_60.png" id="c_p_4" onclick="imgPicker(this,'chairs_picker_w','c_p_4_actual');">
					  <img  src="img/chairs/c_p_4_60.png" id="c_p_4_actual"  style="display:none">
					  <img class="bg_pick_image left" src="img/chairs/pick/c_p_5_60.png" id="c_p_5" onclick="imgPicker(this,'chairs_picker_w','c_p_5_actual');">
					  <img  src="img/chairs/c_p_5_60.png" id="c_p_5_actual"  style="display:none">
					  <img class="bg_pick_image right" src="img/chairs/pick/c_p_6_60.png" id="c_p_6" onclick="imgPicker(this,'chairs_picker_w','c_p_6_actual');">
					  <img  src="img/chairs/c_p_6_60.png" id="c_p_6_actual"  style="display:none">
					</div>
				  </div>				
				</div>
			  </td>
			  <td class="draw_btn_right draw_btn">
			    <div class="button_text" id="tables_btn"  onclick="showPicker('tables_picker_w','tables_picker');">Tables
                  <div class="picker_table" name="picker_table" id="tables_picker_w" style="display:none">
				    <div class="internal_picker" id="tables_picker">
					 <table class="picker_table_table">
					  <tr><td>
					   <div class="table_pick_image" >
					     <img class=" middle" src="img/tables/pick/t_p_1_60.png" id="t_p_1" onclick="imgPicker(this,'tables_picker_w','t_p_1_actual');">
					     <img  src="img/tables/t_p_1_200.png" id="t_p_1_actual"  style="display:none">
						</div>
					  </td><td>
					   <div class="table_pick_image" >
					     <img class=" middle" src="img/tables/pick/t_p_2_60.png" id="t_p_2" onclick="imgPicker(this,'tables_picker_w','t_p_2_actual');">
					     <img  src="img/tables/t_p_2_188.png" id="t_p_2_actual"  style="display:none">
						 </div>
					  </td></tr>
					  <tr><td>
					   <div class="table_pick_image" >
					     <img class=" middle" src="img/tables/pick/t_p_3_60.png" id="t_p_3" onclick="imgPicker(this,'tables_picker_w','t_p_3_actual');">
					     <img  src="img/tables/t_p_3_175.png" id="t_p_3_actual"  style="display:none">
						 </div>
					  </td><td> 
					   <div class="table_pick_image" >
					     <img class="middle " src="img/tables/pick/t_p_4_60.png" id="t_p_4" onclick="imgPicker(this,'tables_picker_w','t_p_4_actual');">
					     <img  src="img/tables/t_p_4_200.png" id="t_p_4_actual"  style="display:none">
						 </div>
					  </td></tr>
					  <tr><td>
					   <div class="table_pick_image" >
					     <img class=" middle" src="img/tables/pick/t_p_5_60.png" id="t_p_5" onclick="imgPicker(this,'tables_picker_w','t_p_5_actual');">
					      <img  src="img/tables/t_p_5_200.png" id="t_p_5_actual"  style="display:none">
						  </div>
					  </td><td>
					   <div class="table_pick_image" >
					     <img class=" middle" src="img/tables/pick/t_p_6_60.png" id="t_p_6" onclick="imgPicker(this,'tables_picker_w','t_p_6_actual');">
					     <img  src="img/tables/t_p_6_200.png" id="t_p_6_actual"  style="display:none">
						 </div>
					  </td></tr></table>
					</div>
				  </div>					
				
				</div>
			  </td>			  
			</tr>	
            <tr >
			  <td  class="draw_btn_left draw_btn">
			    <div class="button_text" id="figures_btn"  onclick="showPicker('figures_picker_w','figures_picker');">Figures
                  <div class="picker_table figures_picker_table" name="picker_table" id="figures_picker_w" style="display:none">
				    <div class="internal_picker internal_figures_picker" id="figures_picker">
					 <table class="figures_table_table ">
					  <tr><td>
					   <div class="figures_pick_image" >
					     <img class=" middle figures_image" src="img/figures/pick/s_p_1_100.png" id="s_p_1" onclick="ShapePicker(this,'figures_picker_w','round');">
						</div>
					  </td><td>
					   <div class="figures_pick_image" >
					     <img class=" middle figures_image" src="img/figures/pick/s_p_2_100.png" id="s_p_2" onclick="ShapePicker(this,'figures_picker_w','circle');">
						 </div>
					  </td></tr>
					  <tr><td>
					   <div class="figures_pick_image" >
					     <img class=" middle figures_image" src="img/figures/pick/s_p_3_100.png" id="s_p_3" onclick="ShapePicker(this,'figures_picker_w','trapex');">
						 </div>
					  </td><td> 
					   <div class="figures_pick_image" >
					     <img class="middle figures_image" src="img/figures/pick/s_p_4_100.png" id="s_p_4" onclick="ShapePicker(this,'figures_picker_w','rectangle');">
						 </div>
					  </td></tr>
                      </table>
					</div>
				  </div>								
				</div>
			  </td>
			  <td class="draw_btn_right draw_btn">
			    <div class=" button_text" id="lines_btn" onclick="ShapePicker(this,'figures_picker_w','line');">Line</div>
			  </td>			  
			</tr>	
            <tr >
			  <td  class="draw_btn_left draw_btn">
			    <div class="button_text" id="combo_btn"   onclick="showPicker('combo_picker_w','combo_picker');">Combo
                  <div class="picker_table combo_picker_table" name="picker_table" id="combo_picker_w" style="display:none">
				    <div class="internal_picker" id="combo_picker">
					 <table class="combo_table_table ">
					  <tr><td>
					   <div class="combo_pick_image" >
					     <img class=" middle" src="img/combo/pick/com_p_1_100.png" id="com_p_1" onclick="imgPicker(this,'combo_picker_w','com_p_1_actual');">
					     <img  src="img/combo/com_p_1_200.png" id="com_p_1_actual"  style="display:none">
						</div>
					  </td><td>
					   <div class="combo_pick_image" >
					     <img class=" middle" src="img/combo/pick/com_p_2_100.png" id="com_p_2" onclick="imgPicker(this,'combo_picker_w','com_p_2_actual');">
					     <img  src="img/combo/com_p_2_200.png" id="com_p_2_actual"  style="display:none">
						 </div>
					  </td></tr>
					  <tr><td>
					   <div class="combo_pick_image" >
					     <img class=" middle" src="img/combo/pick/com_p_3_100.png" id="com_p_3" onclick="imgPicker(this,'combo_picker_w','com_p_3_actual');">
					     <img  src="img/combo/com_p_3_200.png" id="com_p_3_actual"  style="display:none">
						 </div>
					  </td><td> 
					   <div class="combo_pick_image" >
					     <img class="middle " src="img/combo/pick/com_p_4_100.png" id="com_p_4" onclick="imgPicker(this,'combo_picker_w','com_p_4_actual');">
					     <img  src="img/combo/com_p_4_200.png" id="com_p_4_actual"  style="display:none">
						 </div>
					  </td></tr>
					  <tr><td>
					   <div class="combo_pick_image" >
					     <img class=" middle" src="img/combo/pick/com_p_5_100.png" id="com_p_5" onclick="imgPicker(this,'combo_picker_w','com_p_5_actual');">
					      <img  src="img/combo/com_p_5_200.png" id="com_p_5_actual"  style="display:none">
						  </div>
					  </td><td>
					   <div class="combo_pick_image" >
					     <img class=" middle" src="img/combo/pick/com_p_6_100.png" id="com_p_6" onclick="imgPicker(this,'combo_picker_w','com_p_6_actual');">
					     <img  src="img/combo/com_p_6_200.png" id="com_p_6_actual"  style="display:none">
						 </div>
					  </td></tr></table>
					</div>
				  </div>					
				
				</div>				
			  </td>
			  <td  class="draw_btn_right draw_btn">
			    <div class="button_text" id="userimage_pick" onclick="fileUpload('userImageUpload_input')">User Image
                  
				</div>
				 <input type="file" id="userImageUpload_input" style='display:none;position:absolute;top:-1000px'>
				 <div id="user_uploaded_images" style="display:none">
				   <!-- Here uploaded images will be added -->
				 </div>
				 <img id="temp_image_for_canvas_creation" style="display:none"></img>
				 <canvas  width="200" height="200" id="translated_user_images_canvas" style="display:none"></canvas>
			  </td>			  
			</tr>
            <tr style="height:5px"><td></td></tr>			
            <tr><td colspan="2"><div class="text_head history_text">History</div></td></tr>
			<tr style="height:5px"><td></td></tr>
            <tr>
			   <td colspan="2" id="history_td_scrollable" >
			    <div id="history_div_scrollable" >
			      <div id="history_images_wrapper">
			     
				  </div>
				 </div>
			   </td>
			</tr> 			
		  </table> 

		  <div id="floor_options">
		    <table id="floor_options_table" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
			  <tr >
			    <td id="floor_selector_td">
				  <select    id="floor__selector">
					 <option value="Floor-1" selected>Floor-1</option>
				  <select>												 
				</td>
				<td id="add_floor_td">
				  <div id="add_floor_div_btn" onclick="AddFloor()">Add floor</div>
				</td>
				<td id="rename_floor_btn_td">
				  <div id="rename_floor_div_btn"  onclick="RenameFloor()">Rename floor</div>
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
			  </tr>
			</table>
		  </div>		  
		  <div id="zoom_options">
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
					   <div id="zoom_reset_div" onclick="zoomReset()">reset</div>
					 </td>
                   </tr>				   
				</table>
		  </div>
		</div>

		<div id="canvas_td">
			 <div id="canvas_wrapper">
			  
			  <canvas id="canvas1" width="400" height="400"  tabindex='1' class="cmenu2 main_canvas" >
				This text is displayed if your browser does not support HTML5 Canvas.
			  </canvas>
			  <div id="canvas_drawall_images"  style="display:none" >
			   
			  </div>
			  <div id="menu2" style="display:none;">
	               <table id="menu_table" cellspacing="0" cellpadding="0">
				      <tr >
					  <td class="menu_img_td"><img class="menu_img" src="img/manipulate/copy30.png"></img></td>
					  <td>
					    <div id="copy_menu" class="menu_option" >Copy</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  src="img/manipulate/paste30.png"></img></td><td>
					    <div id="paste_menu" class="menu_option">Paste</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  src="img/manipulate/delete30.png"></img></td><td>
					    <div id="delete_menu" class="menu_option">Delete</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  src="img/manipulate/onefront30.png" ></img></td><td>
					    <div id="bringForward_menu" class="menu_option ">Bring Forward</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  src="img/manipulate/oneback30.png"></img></td><td>
					    <div id="bringBack_menu" class="menu_option">Bring Backward</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img" src="img/manipulate/tofront30.png"></img></td><td>
					    <div id="bringToTop_menu" class="menu_option ">Bring to Top</div>
					  </td></tr>
				      <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  src="img/manipulate/toback30.png"></img></td><td>
					    <div id="bringToBottom_menu" class="menu_option ">Bring to Back</div>
					  </td></tr>
					  <tr class ="only_multi">
					  <td class="menu_img_td "><img class="menu_img"  src="img/manipulate/merge30.png"></img></td><td>
					    <div id="Group_menu" class="menu_option ">Group</div>
					  </td></tr>
					  <tr class ="only_singe">
					  <td class="menu_img_td "><img class="menu_img"  src="img/manipulate/booking130.png"></img></td><td>
					    <div id="orderBehav_menu" class="menu_option ">Set Booking options</div>
					  </td></tr>
				   </table>
              </div>
			 </div>
		</div>
		<table id="tour_buttons_table">
		 <tr>
		  <td>
		    <div id="drawingSaveButton"  onclick="SIcreateSaveObjectPre()">Save		       
		    </div>
		    <img id="saveplase_ajax_gif" src="/js/728.GIF" style="display:none"/>
		  </td>
		  <td>
		    <div id="drawingConfigButton" style="display:none" onclick="SIPlaceConfiguration('<%=(String)request.getAttribute("placeUniqID")%>')">Continue</div>
		  	<form id="<%=(String)request.getAttribute("placeUniqID")%>_config_form"  action="placeConfiguration" method="post" style="display:none">
                 <input name="placeIDvalue" value="<%=(String)request.getAttribute("placeUniqID")%>">
            </form>
		  </td>
		  </tr>
		</table>
		
		<div id="other_options" style="display:none">
			 Mouse: <input type="text" id="mouse_pos"/>
			 <br>
			 <button onclick="createSaveObjectPre()">Save State</button>
			 </div>
		
		<div id = "right_col">
		 <div id="right_col_tabs">
		  <div id="drawing_tab_selector" class="right_col_tab rt_selected">Draw options</div>
		  <div id="booking_tab_selector" class="right_col_tab rt_not_selected">Book options</div>
		 </div>
		 <div id="right_col_scroll">
		 <table id="booking_options_table"  cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;display:none" >
		   <tr class="menu_name" >
		    <td> <input type="checkbox" id="book-able" class="css-checkbox " checked="checked" name="book-able"/> 
		      Book available </td>
		  </tr>
		  <tr id="booking_image_tr" class="option_name_tool_single image_options_row"  >
				  <td>		   
				    <div class="chosed_img " id="booking_image_view" style="display:none">
				       <div class="dummy"></div>
				        <div class="img-container">
				          <img id="chosed_image_booking"/>
				        </div>				    
				    </div>
					<div class="chosed_canvas chosed_img" id="booking_canvas_view" style="display:none"><canvas id="show_canvas_book" width="150" height="150" ></div>
				   </td>
		   </tr>
		   <tr   class="option_name_tool_single slider_row_" >
			  <td>	
				 <table class="shape_booking_single_option" name="bokabledata" id="boka_id" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr><td class="option_font_book"> Shape uniq ID </td></tr>
		            <tr><td>					   
			           <div  class="given_shape_ID_div" >
					     <span id="given_shape_ID"></span>
			           </div>
		            </td></tr>
			    </table>
			  </td>
			</tr>
		   <tr   class="option_name_tool_single slider_row_" >
			  <td>	
				 <table class="shape_booking_single_option" name="bokabledata" id="boka_name"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr><td class="option_font_book"> Name </td></tr>
		            <tr><td>
                      <div class="booking_value_div">					
			           <input class="booking_text_input booking_value" type="text" id="booking_shape_name"/>
					  </div>
		            </td></tr>
			    </table>
			  </td>
			</tr>
		   <tr   class="option_name_tool_single  slider_row_20" >
			  <td>	
				 <table class="shape_booking_single_option" name="bokabledata" id="boka_min"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr>
					  <td class="option_font_book"> Minimum persons </td></tr>
		            <tr>
					  <td>
                        <div class="booking_value_div">					
			                <input type="checkbox" id="checkboxMinP" class="css-checkbox" checked="checked"/>
							<input class="booking_spinner"  id="booking_shape_minpersons"/>
					    </div>
		              </td>
					</tr>
			    </table>
			  </td>
			</tr>
		   <tr   class="option_name_tool_single  slider_row_20" >
			  <td>	
				 <table class="shape_booking_single_option" name="bokabledata" id="boka_max"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr>
					  <td class="option_font_book"> Maximum persons </td>
					</tr>
					<tr>
		              <td>
                        <div class="booking_value_div">
                            <input type="checkbox" id="checkboxMaxP" class="css-checkbox" checked="checked"/>						
			                <input class="booking_spinner"  id="booking_shape_maxpersons"/>
					    </div>
		              </td>
					</tr>
			    </table>
			  </td>
			</tr>
		   <tr   class="option_name_tool_single slider_row_" >
			  <td>	
				 <table class="shape_booking_single_option" name="bokabledata" id="boka_wd"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr><td class="option_font_book"> Week Days </td></tr>
		            <tr><td>
                      <div class="booking_value_div">					
			            <table id="week_days_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
						  <tr>
						    <td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td><td></td>
						  </tr>
						  <tr>
						    <td><input type="checkbox" id="book_sun_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td><input type="checkbox" id="book_mon_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td><input type="checkbox" id="book_tue_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td><input type="checkbox" id="book_wed_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td><input type="checkbox" id="book_thu_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td><input type="checkbox" id="book_fri_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td><input type="checkbox" id="book_sat_cb" class="css-checkbox week_checkbox" checked="checked" name="week_checkbox"/></td>
							<td></td>
						  </tr>
						</table>
					  </div>
		            </td></tr>
			    </table>
			  </td>
			</tr>
		   <tr   class="option_name_tool_single  slider_row_20" >
			  <td>	
				 <table class="shape_booking_single_option"  name="bokabledata" id="boka_list" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr>
					  <td class="option_font_book"> Available Day Time </td>
					</tr>
					<tr>
					
					</tr>
					<tr>
		              <td>
					    <table  cellspacing="0" cellpadding="0" style="width:95%;height:100%;border-collapse:collapse;margin-left: 5px;">
						 <tr><td colspan="2">
                           <div class="for_slider"   >
							<input id="booking_time_slider1"  style="width:160px;"/>
						  </div>
						 </td></tr>
						 <tr>
						  <td class="cdnd-td"><div id="cd-label">current day</td>
						  <td class="cdnd-td"><div id="nd-label">next day</td>
						 </tr>
						</table>						
		              </td>
					</tr>
			    </table>
			  </td>
			</tr>
		 </table>
		 <table id="selected_options_table_main"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;display:">
		  <tr class="menu_name" id="selected_canvas_options_tr"  style="display:none">
		    <td> Selected object options </td>
		  </tr>
		  <tr id="selected_options_tr"  style="display:none">
		   <td class="available_options_td">
		     <table id="selected_options_lines_table"    cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
			   <tr id="sel_line_col_tr" class="option_name_tool_single color_tool_row" name="selected_options"  style="display:none">
				  <td>
				     <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
					   <tr >
					     <td class="option_font"> Line color </td>
					     <td><div id="selected_line_color" class="pick_color"></div></td>
					   </tr>
					 </table>
				  </td>
			    </tr>
			   <tr id="sel_fill_col_tr"  class="option_name_tool_single color_tool_row" name="selected_options"  style="display:none">
				  <td>		
                    <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
					   <tr >
					     <td class="option_font"> Fill color </td>				  
					     <td><div id="selected_fill_color" class="pick_color"></div></td>
					  </tr>
					 </table>
				  </td>
			   </tr>
			   <tr id="selected_figure_line_opacity_tr"  class="option_name_tool_single slider_row_" name="selected_options"  style="display:none">
				  <td>	
                     <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Line opacity </td></tr>
                       <tr><td>					   
						   <div class="for_slider"  id="selected_figure_line_opacity" >
								<input id="selected_figure_line_opacity_slider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px"/>
						   </div>
						</td></tr>
					 </table>
				  </td>
			   </tr>
			   <tr id="selected_figure_opacity_tr"  class="option_name_tool_single slider_row_" name="selected_options"  style="display:none">
				  <td>	
				  <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Fill opacity </td></tr>
                       <tr><td>
					   <div class="for_slider"  id="selected_figure_opacity" >
							<input id="selected_figure_opacity_slider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="90"  style="width:160px"/>
					   </div>
					   </td></tr>
					 </table>
				  </td>
			   </tr>
			   <tr id="selected_rotation_tr"  class="option_name_tool_single slider_row_" name="selected_options"  style="display:none">
				  <td>
				  <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Rotation </td></tr>
                       <tr><td>
					   <div id="selected_rotation"   class="for_slider">
							<input id="rotate_slider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="360" data-slider-step="5" data-slider-value="0" data-placement="left"  style="width:160px"/>
					   </div>
					   </td></tr>
					 </table>
				  </td>
			  </tr>
			   <tr id="selected_line_width_tr"  class="option_name_tool_single slider_row_" name="selected_options"  style="display:none">
				  <td>
				  <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Line width </td></tr>
                       <tr><td>
					   <div class="for_slider"  id="selected_line_width">
							<input id="selected_Lwidth_slider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3"  style="width:160px"/>
					   </div>
					   </td></tr>
					 </table>
				  </td>
			   </tr>
			   <tr id="selected_round_radius_tr"  class="option_name_tool_single slider_row_" name="selected_options"  style="display:none">
				  <td>
				  <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Border radius </td></tr>
                       <tr><td>
					   <div class="for_slider"   id="selected_round_radius"  >
							<input id="selected_round_radius_slider"  data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="30"  style="width:160px"/>
					   </div>
					   </td></tr>
					 </table>
				  </td>
			   </tr>
			   <tr id="selected_trapex_cutX_tr"  class="option_name_tool_single slider_row_" name="selected_options"  style="display:none">
				  <td>
				  <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Cut side percentage </td></tr>
                       <tr><td>
					   <div class="for_slider"   id="selected_trapex_cutX" >
							<input id="selected_trapex_cutX_slider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="20"  style="width:160px"/>
					   </div>
					   </td></tr>
					 </table>
				  </td>
				</tr>
				<tr id="selected_text_area"  name="selected_options"  style="display:none">
				  <td>
				  	  <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
						     <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Text </td>
									   </tr><tr>
										 <td>
										 <div class="booking_value_div">					
										    <input class="booking_text_input booking_value" type="text" id="selected_text_shape_value"/>
										</div>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Text color </td>
										 <td><div id="selected_text_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Font family </td>
									       <td>
												<select  class="font_selectors"  id="selected_font__selector">
												  <option value="Varela, sans-serif" ><span style="font-family:Varela, sans-serif;">Varela</span></option>
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
								     </table>
								  </td>
							  </tr>
                              <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Font size </td>
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
								     </table>
								  </td>
							  </tr>
							  <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Font style </td>
									       <td>
												<select class="font_selectors"  id="selected_font_style_selector">
												  <option value="normal" selected>normal</option>
												  <option value="italic">italic</option>
												  <option value="bold">bold</option>
											   </select>
										   </td>
										</tr>
								     </table>
								  </td>
							  </tr>
							   <tr   class="option_name_tool_single color_tool_row optional_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font">  Text Shadow </td>
									       <td>
												<input type="checkbox" id="selected_checkboxTextShadow" class="css-checkbox" />
										   </td>
										</tr>
								     </table>
								  </td>
							  </tr>
							 <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
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
           </td>
		   </tr>
		  <tr class="menu_name" id="selected_background_tr"  name="current_pick_data"  style="display:none">
		    <td> Background options </td>
		  </tr>	   
		  <tr id="background_options_tr"  name="current_pick_data"  style="display:none">
		   <td  class="available_options_td">
		      <table id="user_back_lines_table"    cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">		   
			     <tr id="user_bg_col_tr" class="option_name_tool_single"  >
				    <td>
					  <div id="uploadBGbutton" onclick="fileUpload('userBGUpload_input')" class="option_font">Upload Background</div>
					  <input type="file" id="userBGUpload_input" style="display:none;"/>
					</td>
				  </tr>
				  <tr>
				    <td>
				     <div id="uploadBGoptions" >
					   <table  cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
					     <tr  class="option_name_tool_single image_options_row"  >
						   <td>
							   <div class="chosed_img " >
							     <div class="dummy"></div>
				                      <div class="img-container">
							              <img id="chosed_background">
							          </div>
							    </div>
							   <div id="chosed_background_orig_wrap" style="display:none">
							     <img id="chosed_background_orig" style="display:none"/>
							   </div>
						   </td>
						 </tr>
						 <tr  class="option_name_tool_single "  >
						   <td>					 
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
							 </td>
						   </tr>
						 </table>
					  </div>
					</td>
				  </tr>
			  </table>
			</td>
		  </tr>
		  <tr class="menu_name" id="picked_image_tr" name="current_pick_data"  style="display:none">
		    <td> Current image </td>
		  </tr>	   
		  <tr id="current_image_tr" name="current_pick_data"  style="display:none">
		   <td  class="available_options_td">	
              <table id="pick_image_lines_table"    cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
			    <tr id="pick_img_col_tr" class="option_name_tool_single image_options_row"  >
				  <td>		   
				    <div class="chosed_img " >
				       <div class="dummy"></div>
				        <div class="img-container">
				          <img id="chosed_image"/>
				        </div>
				    
				    </div>
				   </td>
				</tr>
				<tr id="picked_image_alpha_tr"  class="option_name_tool_single slider_row_" >
				   <td>
				   <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
                       <tr><td class="option_font"> Image opacity </td></tr>
                       <tr><td>
				    <div class="for_slider" id="img_alpha_div" style="display:none"><input id="img_alpha_slider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" data-placement="left"  style="width:170px;"/></div>
		              </td>
					 </tr>
					</table>
				  </td>
				</tr>
		     </table>
		   </td>
		  </tr>
		  <tr class="menu_name" id="picked_figure_tr"  name="current_pick_data"  style="display:none">
		    <td> Current figure options </td>
		  </tr>	   
		  <tr id="current_figure_tr"  name="current_pick_data"  style="display:none">
		   <td  class="available_options_td">	
              <table id="canvas_pick_lines_table"    cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">		   
			     <tr id="pick_fig_col_tr" class="option_name_tool_single image_options_row"  >
				    <td>	
			           <div class="chosed_canvas chosed_img" ><canvas id="show_canvas" width="150" height="150" ></div>
					</td>
				 </tr>
				 <tr>
				   <td>
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="round_options" style="display:none">
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Line color </td>
										 <td><div id="round_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Fill color </td>
										 <td><div id="round_fill_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Fill opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"   >
												<input id="round_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="90" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="round_line_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Corner radius </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="round_radius" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="30" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line width </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="round_Lwidth" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
						 </table>
					   </div>
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="circle_options" style="display:none">
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Line color </td>
										 <td><div id="circle_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Fill color </td>
										 <td><div id="circle_fill_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Fill opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="circle_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="90" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="circle_line_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line width </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="circle_Lwidth" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
						 </table>
					   </div>
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="trapex_options" style="display:none">
						 <table class="canvas_options_table"  cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Line color </td>
										 <td><div id="trapex_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Fill color </td>
										 <td><div id="trapex_fill_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Fill Opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="trapex_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="90" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line Opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="trapex_line_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Cut side percentage </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="trapex_radius" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="20" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line width </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="trapex_Lwidth" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
						 </table>
					   </div>
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="rectangle_options" style="display:none">
						 <table class="canvas_options_table"  cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Line color </td>
										 <td><div id="rectangle_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Fill color </td>
										 <td><div id="rectangle_fill_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Fill opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="rectangle_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="90" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="rectangle_line_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line width </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="rectangle_Lwidth" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
						 </table>
					   </div>
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="line_options" style="display:none">
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Line color </td>
										 <td><div id="line_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="line_line_opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Line width </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="line_Lwidth" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
						 </table>
					   </div>
					   <div class="canvas_figure_options" name="canvas_figure_options"  id="text_options" style="display:none">
						 <table class="canvas_options_table"   cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">
						     <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Text </td>
									   </tr><tr>
										 <td>
										 <div class="booking_value_div">					
										   <input class="booking_text_input booking_value" type="text" id="text_shape_value" value="text"/>
										</div>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							  <tr  class="option_name_tool_single color_tool_row" >
								  <td>
									 <table  class="color_pick_tbl" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
									   <tr >
										 <td class="option_font"> Text color </td>
										 <td><div id="text_line_color" class="pick_color"></div></td>
									   </tr>
									 </table>
								  </td>							   
							  </tr>
							   <tr   class="option_name_tool_single slider_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Text opacity </td></tr>
									   <tr><td>					   
										   <div class="for_slider"  >
												<input id="text__opacity" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="100" style="width:160px;"/>
										   </div>
										</td></tr>
									 </table>
								  </td>
							   </tr>
							   <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Font family </td>
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
								     </table>
								  </td>
							  </tr>
                              <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Font size </td>
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
								     </table>
								  </td>
							  </tr>
							  <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font"> Font style </td>
									       <td>
												<select class="font_selectors"  id="font_style_selector">
												  <option value="normal" selected>normal</option>
												  <option value="italic">italic</option>
												  <option value="bold">bold</option>
											   </select>
										   </td>
										</tr>
								     </table>
								  </td>
							  </tr>
							   <tr   class="option_name_tool_single color_tool_row optional_row_" >
								  <td>	
									 <table class="slider_pick_table" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">	
									   <tr><td class="option_font">  Text Shadow </td>
									       <td>
												<input type="checkbox" id="checkboxTextShadow" class="css-checkbox" checked="checked"/>
										   </td>
										</tr>
								     </table>
								  </td>
							  </tr>
							 <tr   class="option_name_tool_single color_tool_row" >
								  <td>	
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
						 <canvas id = "text_width_calculation_canvas"  width="10" height="10"  style="display:none"></canvas>
						 
					   </div>
					</td>
				  </tr>
			  </table>
			 </td>
			</tr>
			</table>
		  <img id="mirror" style="display:none"/>

		</div>
	  </div>
	  <canvas id = "group_shapes_canvas"  width="400" height="400"  style="display:none"></canvas>
	  <div id="logs_row" style="display:none;">
	      <div id = "logs_window" > </div>
	     </div>
    </div>
  </td></tr>
   <tr id="footer_tr"><td id="footer_td">
	<div id = "footer"  style="display:none"> Belousov Dmitry</div>
  </td></tr>
  </table>
  </body>
</html>