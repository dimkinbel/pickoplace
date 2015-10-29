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
    <title>Book Place</title>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
	<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
	<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
	<script type="text/javascript" src="js/colpick.js" ></script>
    <script type="text/javascript" src="js/shapes.js"></script>
	<script type="text/javascript" src="js/printlog.js"></script>
	<script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
	<script type="text/javascript" src="js/sitefunctions.js"></script>
    <script type="text/javascript" src="js/updateData.js"></script>
    <script type="text/javascript" src="js/bookingOptions.js"></script>
	
    <link rel="stylesheet" href="css/browserWrap.css" type="text/css" media="screen" />
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
       if(typeof document.onselectstart!="undefined") {
	       document.onselectstart = new Function ("return false");
	   } else {
	       document.onmousedown = new Function ("return false");
		   document.onmouseup = new Function ("return true");
	   }
       function alertCS() {
    	   
    	   var state = JSON.parse(JSON.stringify(canvas_,[
    	                                                "width",
    	                              				  "height",
    	                              				  "origWidth",
    	                              				  "origHeight",
    	                              				  "bg_color",
    	                              				  "line_color",
    	                              				  "backgroundType", /* color, tiling, fill, repeat, asimage , axis*/
    	                              				  "backgroundActualId", /* ID of the background img */
    	                              				  "backgroundImageID",
    	                              				  "tilew", /* user background image height */
    	                              				  "tileh"
    	                              				  ]));
    	   var canvasStateJSON = JSON.parse(document.getElementById("server_cnavasState").value);
    	   alert(JSON.stringify(canvasStateJSON, "", 4));
       }
       $(document).ready(function() {
    	   "use strict";
    	   canvas_ = new CanvasState(document.getElementById('canvas1'));
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
    	      	   
    	 var canvasStateJSON = JSON.parse(document.getElementById("server_canvasState").value);
    	 if (canvasStateJSON.state.backgroundType != "color") {
    		 updateBackgroundImageByServer();
    	 }
    	 var all=document.getElementsByName("shape_images_from_server");
    	 for(var x=0; x < all.length; x++) { 
    		 var serverImageID = all[x].id;
    	     updateShapeImagesByServerData(serverImageID);   	     
    	 }
    	 updateCanvasShapes(canvas_,canvasStateJSON);
       });

	</script>
  </head>
  	
  <body  style="margin: 0px;">

  <table id="body_table"  cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
   <tr id="header_tr"><td id="header_td">
    <div id="header"><div id="logo_">PickoPlace</div></div>
   </td></tr>
   <tr id="content_tr"><td id="content_td">
   <%
   AJAXImagesJSON responseJSON = (AJAXImagesJSON)  request.getAttribute("canvasEditPlace");
   Gson gson = new Gson();
   List<PPSubmitObject> canvasStateList = responseJSON.getFloors();
    // String canvasState_toJson = gson.toJson(canvasState);
   List<JsonSID_2_imgID> sid2imgID = responseJSON.getJSONSIDlinks();
    // String sid2imgID_toJson = gson.toJson(sid2imgID);
   String placeName = responseJSON.getPlace_();
   String placeBranchName = responseJSON.getSnif_();
   String userRandom = responseJSON.getUsernameRandom();
   String placeID = responseJSON.getPlaceID();
   List<JsonImageID_2_GCSurl> imgID2URL = responseJSON.getJSONimageID2url();
      

   %>
    <div id="hiden_values_from_edit" style="display:none">
 <% 
      for (PPSubmitObject floor : canvasStateList) {
    	   String backgroundURL = "";
    	   String floorid = floor.getFloorid();
    	   CanvasState canvasState = floor.getState();
    	   if(floor.getBackground()!=null && !floor.getBackground().isEmpty()) {
    		   backgroundURL = floor.getBackground();
    	   }  	   
    %>
      <input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState" value='<%=gson.toJson(canvasState) %>'/>
      <img    id="server_background_<%=floorid %>" name="server_background" src="<%=backgroundURL%>"/>
      
    <% }%>
      <% if (sid2imgID!=null && !sid2imgID.isEmpty()) {%>
      <input type="text" id="server_sid2imgID" value='<%=gson.toJson(sid2imgID)%>'/>
      <%} %>
      <input type="text" id="server_placeName" value='<%=placeName%>'/>
      <input type="text" id="server_placeBranchName" value='<%=placeBranchName%>'/>
      <input type="text" id="server_userRandom" value='<%=userRandom%>'/>
      <input type="text" id="server_placeID" value='<%=placeID%>'/>
      <canvas id="canvas_tmp"></canvas>
      <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
    	  for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>     
        <img id="server_<%=img2url.getImageID() %>" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
      <%} 
      }%>
    </div>
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
        <div class="outer_width100" >
              <div id="layers_wrapper" style="display:none">
			    <div class="place_layers choosed_layer" name="place_layers_tab" id="pl-1-tab"><span id="pl-1" class="layer_name" style="display:">Floor 1</span><input type="text"  style="display:none" id="pl-1-i" class="change_name_layer_input" value="Floor 1"/></div>
			    <div class="place_layers"  name="place_layers_tab"  id="pl-2-tab"><span id="pl-2" class="layer_name" style="display:">Floor 2</span><input type="text"  style="display:none" id="pl-2-i" class="change_name_layer_input" value="Floor 2"/></div>
			    <div class="add_layer_button" id="add_layer_button" >+</div>
			  </div>

       	 <div class="creatingTourText">
        	  <span class="steps"></span> Booking : <span class="placeNamespan">       	          
        	      '<%=placeName %>' ,<%=placeBranchName %>'
        	   </span>       	      
         </div>
             <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
        	 <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>' style="display:none"/>
        	 <input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeID %>' style="display:none"/>
        	      
        </div>

		<div id="updateDataImagesDiv" style="display:none">
		  	<div id="bg_default_img_mirror" style="display:none">
				<canvas id="default_img_canvas"></canvas>
				<img id="default_bg_image_mirror"/>
		   </div>
		   <div id="canvas_shapes_images" style="display:none;">
				   
	       </div>
		   <div id="user_uploaded_images" style="display:none">
				   <!-- Here uploaded images will be added -->
		   </div>
		   <div id="prev_used_images" style="display:none">
				   <!-- Here uploaded images will be added -->
		   </div>
		   <img id="temp_image_for_canvas_creation" style="display:none"></img>
		   <canvas  width="200" height="200" id="translated_user_images_canvas" style="display:none"></canvas>
		   <div class="chosed_img " >
				 <div class="dummy"></div>
				 <div class="img-container">
						<img id="chosed_background">
				  </div>
		   </div>
		   <img id="chosed_background_orig" style="display:none"/>
		</div>
		  <div id="zoom_options">
			    <div id="plus_minus_wrap">
										   <div id="zoom_plus_div" onclick="sizeUp()" title="Zoom-In">+</div>
				                           <div id="zoom_split"></div>
										   <div id="zoom_minus_div"  onclick="sizeDown()"  title="Zoom-Out">-</div>
			    </div>
				<div id="zoom_reset_div" onclick="zoomReset()"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>
										
		  </div>
		<div id="canvas_td">
			 <div id="canvas_wrapper">
			  			  <canvas id="canvas1" width="400" height="400"  tabindex='1' class="cmenu2" >
				This text is displayed if your browser does not support HTML5 Canvas.
			  </canvas>
			  <img id="canavasAllImage" style="display:none"/>
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
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  src="img/manipulate/onefront30.png" ></img></td><td>
					    <div id="bringForward_menu" class="menu_option ">Bring Forward</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  src="img/manipulate/oneback30.png"></img></td><td>
					    <div id="bringBack_menu" class="menu_option">Bring Backward</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img" src="img/manipulate/tofront30.png"></img></td><td>
					    <div id="bringToTop_menu" class="menu_option ">Bring to Top</div>
					  </td></tr>
				      <tr >
					  <td class="menu_img_td"><img class="menu_img"  src="img/manipulate/toback30.png"></img></td><td>
					    <div id="bringToBottom_menu" class="menu_option ">Bring to Back</div>
					  </td></tr>
                      <tr>
					  <td class="menu_img_td"><img class="menu_img"  src="img/manipulate/booking130.png"></img></td><td>
					    <div id="orderBehav_menu" class="menu_option ">Set Booking options</div>
					  </td></tr>
				   </table>
              </div>
			 </div>
		</div>
		
		
		<div id = "right_col">
		 <div id="right_col_scroll">
		 <table id="booking_options_table"  cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;display:none" >
		   <tr class="menu_name" >
		    <td> Basic booking options </td>
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
				 <table class="shape_booking_single_option" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
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
				 <table class="shape_booking_single_option" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
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
				 <table class="shape_booking_single_option" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
		            <tr>
					  <td class="option_font_book"> Mininum persons </td></tr>
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
				 <table class="shape_booking_single_option" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
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
				 <table class="shape_booking_single_option" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
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
				 <table class="shape_booking_single_option" cellspacing="0" cellpadding="0" style="width:100%;height:100%;border-collapse:collapse">
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

		  <img id="mirror" style="display:none"/>

		</div>
	  </div>
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