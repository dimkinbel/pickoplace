<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"
         import="com.dimab.pp.dto.*"
         import="com.google.gson.Gson"
         import="java.util.*" %>
<%@ page import="com.dimab.pickoplace.utils.JsonUtils" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>
<!DOCTYPE html>
<html style="height:100%">
<head>
    <common:baseStyles/>
    <common:eachPageStyles/>
    <common:baseScripts/>
    <common:baseSyncScripts/>
    <common:eachPageScripts/>


    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Pickoplace:Booking</title>
    <script type="text/javascript">
        var pagetype = 'place_booking';
    </script>


    <link rel="stylesheet" href="css/slider.css" type="text/css"/>
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/book_approval.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/rating.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="raty/raty.css" media="screen" type="text/css">
    <link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinModern.css" type="text/css"
          media="screen"/>
    <link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen"/>

    <script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
    <script type="text/javascript" src="js/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/moment.min.js"></script>


    <script type="text/javascript" src="js/myUtils/netConnection.js"></script><!---->
    <script type="text/javascript" src="js/bookingBookingsManger.js"></script><!---->
    <script type="text/javascript" src="js/shapes_ub.js"></script><!---->
    <script type="text/javascript" src="js/shapes_timeline.js"></script><!---->
    <script type="text/javascript" src="js/printlog_ub.js"></script><!---->
    <script type="text/javascript" src="js/sitefunctions.js"></script><!---->
    <script type="text/javascript" src="js/updateData_ub.js"></script><!---->
    <script type="text/javascript" src="js/bookingOptions_ub.js"></script><!---->
    <script type="text/javascript" src="js/wl_menu_ub.js"></script><!---->
    <script type="text/javascript" src="js/interactive_ub.js"></script><!---->
    <script type="text/javascript" src="js/userBooking.js"></script><!---->
    <script type="text/javascript" src="js/bookController.js"></script><!---->
    <script type="text/javascript" src="js/bookViewService.js"></script><!---->
    <script type="text/javascript" src="js/shapes_timeline_new.js"></script><!---->


    <script src="raty/raty.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/rating.js"></script>


    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">

    </script> <!-- TODO: Global variable replace  -->

    <script type="text/javascript" src="js/maps_google.js"></script>
    <script type="text/javascript" src="js/updateCanvasData.js"></script>
    <script type="text/javascript" src="js/WindowCanvasEvents.js"></script>
    <script type="text/javascript" src="js/documentEventListeners.js"></script>
    <script type="text/javascript">

        var canvast = [];
        var canvasStateJSON;
        var bookingVars = {};
        var tcanvas_ = {};
        var currentSliderValue;
        var placeUTCOffsetGlobal;
        var positionmanager = {};
        var days_ = 1;
        var bookingsManager = {};
        $(document).ready(function () {
            "use strict";
            // Update canvases background

            updateCanvasData();
            requestBookingAvailability();
            tcanvas_ = new TCanvasState(document.getElementById("tcanvas"));

            updateFloorWrapDimentions();
            ApplyFinalPosition();
            updatePlaceInfo();
            initialTCanvas();


        });
        function openMap() {
            document.getElementById("map_wrapper").style.display = "";
            var lat = document.getElementById("server_Lat").value;
            var lng = document.getElementById("server_Lng").value;
            initialize(lat, lng);
            $(function () {
                var $win = $("#map_wrapper"); // or $box parent container
                var $box = $("#map_popup_content");
                $win.on("click.Bst", function (event) {
                    if ($box.has(event.target).length == 0 //checks if descendants of $box was clicked
                            && !$box.is(event.target) //checks if the $box itself was clicked
                    ) {
                        document.getElementById("map_wrapper").style.display = "none";
                    } else {
                    }
                });
            });
        }
        function closeMap() {
            document.getElementById("map_wrapper").style.display = "none";
        }
        window.addEventListener('mouseup', function (e) {
            if (currentSingleTimeCanvas != null) {
                currentSingleTimeCanvas.canvasMouseUpEvent(e);

            }
        });

    </script>
    <script type="text/javascript">
        //LOGIN SUCCESS UPDATE
        var phonerequired = true;

        $(document).on("click", ".stopclick", function (event) {
            if (event.target.id == "page_login_prompt") {
                if (gconnected == false && fconnected == false && phoneflow == true) {
                    if (auth2.isSignedIn.wc) {
                        // Connected with Google
                        googleSignOut();
                    } else if (FB.getUserID() != "") {
                        // Connected with FB
                        facebookSignOut();
                    }
                }
                phoneflow = false;
                $("#sign_in_table_").show();
                //result.userData.first_name for FB
                $("#user_name_at_phone").html("");
                $("#send_sms_ajax").hide();
                $("#send_sms_complete").hide();
                $("#send_sms").show();
                $("#verification_code").val("").prop("readonly", true);
                $("#verification_submit_inactive").show();
                $("#verification_submit").hide();
                $("#smsa_loader").hide();
                $("#phone_wrap_table").hide();
                $("#page_login_prompt").hide();
            }
        });


        ///
    </script>
</head>
<body class="back_whitesmoke">
<div id="canvas_popover_hidden" class="hidden">
    <div id="canvas_popover_wrap" style="position:relative; width:400px;min-height:100px; background-color:white;">

    </div>
</div>
<div id="canvas_popover" style="position:absolute" data-toggle="popover"></div>

<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" id="bookingAcceptedModal">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header" id="bookingAcceptedModal_header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>

            </div>
            <div class="modal-body">
                <h4 class="modal-title" id="bookingAcceptedModal_body"></h4>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="booking_order_modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header hazmana_mh">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="booking_order_modal_title">
                    הזמנה שלי
                </h4>
            </div>
            <div class="modal-body">
                <div id="booking_order_modal_body">
                    <div class="row hz_mt">
                        <div class="col-md-12">זמן</div>
                    </div>
                    <div class="row" id="time_order_row_val">
                        <!--<div class="col-md-12"><span class="hz_date">4 February</span>, 21:30 - 22:00</div>-->
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
            <div class="row hz_mt" style="margin-right: 0px;margin-left: 0px;">
                <div class="col-md-12">בקשות מיוחדות</div>
            </div>
            <div class="input-group" id="user_bakashot">
                <input type="text" class="form-control" id="user_input_hz" placeholder="תקסט חופשי"
                       aria-describedby="basic-addon2">
                <span class="input-group-addon" id="basic-addon2"><i class="material-icons"
                                                                     style="color: white;">edit</i></span>
            </div>
            <div class="modal-footer " id="hz_footer">
                <div id="book_sign_ask"> Login</div>
                <div id="book_logged_in_as" style="display:none">
                    <div class="dsdfs">Logged in as:</div>
                    <div id="login_info_resp_db" Title="LogOut" class="userNikname left_p" onclick="logoutAny()"></div>
                </div>
                <div id="make_booking" class="make_booking" onclick="SIapplyBooking();" style="display:none">
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
<div id="hidden_popups">
    <div id="popup_message_wrap" style="display:none">
        <div id="popup_message">
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
                        <div id="facebook-connect" class="cbtn" onClick="facebookSignIn()">
                            <div id="fpsi_img_d">f</div>
                            <div id="fpsi_text">Sign In with Facebook</div>
                        </div>
                    </td>
                </tr>
            </table>
            <table id="phone_wrap_table" cellspacing="0" cellpadding="0"
                   style=" border-collapse: collapse;display:none">
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
                        <div id="send_sms_complete" style="display:none">
                            Enter verification code below, or
                            <div id="phone_resend_open">resend</div>
                        </div>
                    </td>
                </tr>
                <tr id="phoneInstructions">
                    <td>
                        <div id="phone_instructions">You will receive SMS with verification code</div>
                    </td>
                </tr>
                <tr id="verification_code_line">
                    <td class="ph_pad_top ph_pad_bot"><!-- $("#verification_code").prop("readonly",true); -->
                        <input type="number" id="verification_code" readonly/>

                        <div id="verification_submit" style="display:none">SUBMIT</div>
                        <div id="verification_submit_inactive">SUBMIT
                            <img id="smsa_loader" src="img/gif/fr_load.gif" style="display:none;">
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div id="map_wrapper" style="display:none;">
        <div id="map_popup_content">
            <div id="map-canvas"></div>
            <img id="close_map_icon" src="img/icon-close35.png" onclick="closeMap()"/>
        </div>
    </div>
    <div id="book_confirm_wrap" class="booking_prompt_booking" style="display:none;">

    </div>
</div>
<%
    AJAXImagesJSON responseJSON = (AJAXImagesJSON) request.getAttribute("canvasEditPlace");
    PlaceInfo placeInfo = (PlaceInfo) request.getAttribute("placeInfo");

    List<PPSubmitObject> canvasStateList = responseJSON.getFloors();
    List<JsonSID_2_imgID> sid2imgID = responseJSON.getJSONSIDlinks();
    List<JsonImageID_2_GCSurl> imgID2URL = responseJSON.getJSONimageID2url();
    String placeName = responseJSON.getPlace_();
    String placeBranchName = responseJSON.getSnif_();
    String userRandom = responseJSON.getUsernameRandom();
    String placeID = responseJSON.getPlaceID();
    double placeUTSoffset = responseJSON.getUTCoffset();
%>
<div id="hiden_values_from_edit" style="display:none">
    <canvas id="filtered_canvas"></canvas>
    <img id="filtered_img"/>

    <div id="baw_images">

    </div>
    <img id="2px_grey" src='img/2px_line_grey.png'>
    <img id="2px_green" src='img/2px_line_green.png'>
    <img id="2px_red" src='img/2px_line_red.png'>
    <img id="1px_grey" src='img/1px_line_grey.png'>
    <%
        for (PPSubmitObject floor : canvasStateList) {
            String backgroundURL = "";
            String overviewURL = "";
            String floorid = floor.getFloorid();
            CanvasState canvasState = floor.getState();
            if (floor.getBackground() != null && !floor.getBackground().isEmpty()) {
                backgroundURL = floor.getBackground();
            }
            if (floor.getAllImageSrc() != null && !floor.getAllImageSrc().isEmpty()) {
                overviewURL = floor.getAllImageSrc();
            }

    %>
    <input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState" value='<%=JsonUtils.serialize(floor)%>'/>
    <img id="server_background_<%=floorid %>" name="server_background" src="<%=backgroundURL%>"/>
    <img id="server_overview_<%=floorid %>" name="server_overview" src="<%=overviewURL%>"/>
    <input type="text" id="server_floor_name_<%=floorid %>" value="<%=floor.getFloor_name() %>"/>
    <canvas id="canvas_tmp_<%=floorid %>"></canvas>
    <%if (floor.isMainfloor()) { %>
    <input type="text" id="main_overview_url_id" value="server_overview_<%=floorid %>"/>
    <%} %>
    <% }%>

    <% if (sid2imgID != null && !sid2imgID.isEmpty()) {%>
    <input type="text" id="server_sid2imgID" value='<%=JsonUtils.serialize(sid2imgID)%>'/>
    <%} %>
    <input type="text" id="server_shapes_prebooked"/>

    <div id="for_debug"></div>
    <input type="text" id="server_placeName" value='<%=placeName%>'/>
    <input type="text" id="server_placeBranchName" value='<%=placeBranchName%>'/>
    <input type="text" id="server_userRandom" value='<%=userRandom%>'/>
    <input type="text" id="server_placeID" value='<%=placeID%>'/>
    <%if (placeInfo.getPlaceSiteURL() != null && !placeInfo.getPlaceSiteURL().isEmpty()) {%>
    <input type="text" id="server_place_siteurl" value='<%=placeInfo.getPlaceSiteURL()%>'/>
    <%} %>
    <%if (placeInfo.getPlacePhone() != null && !placeInfo.getPlacePhone().isEmpty()) {%>
    <input type="text" id="server_place_phone" value='<%=placeInfo.getPlacePhone()%>'/>
    <%} %>
    <%if (placeInfo.getPlaceMail() != null && !placeInfo.getPlaceMail().isEmpty()) {%>
    <input type="text" id="server_place_mail" value='<%=placeInfo.getPlaceMail()%>'/>
    <%} %>
    <%if (placeInfo.getRating() != null) {%>
    <input type="text" id="server_place_rating" value='<%=placeInfo.getRating().getAverage()%>'/>
    <%} %>
    <input type="text" id="server_placeUTC" value='<%=placeUTSoffset%>'/>
    <input type="text" id="server_Address" value='<%= request.getAttribute("placeAddress")%>'/>
    <input type="text" id="server_Lat" value='<%=request.getAttribute("placeLat")%>'/>
    <input type="text" id="server_Lng" value='<%=request.getAttribute("placeLng")%>'/>

    <img id="server_main_logo" src="img/pp.png"/>
    <img id="server_v_logo" src="img/vlogo2.png"/>
    <img id="server_passed_back" src="img/back_passed.png"/>
    <img id="server_clock20" src="img/clock20.png"/>
    <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
        for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>
    <img id="server_<%=img2url.getImageID() %>" crossorigin="Anonymous" name="shape_images_from_server" src="<%=img2url.getGcsUrl() %>"/>
    <%
            }
        }
    %>


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
                            String display = "none";
                            if (floor.isMainfloor()) {
                                display = "";
                            }
                    %>
                    <div id="div_wrap-canvas_<%=floorid%>" style="display:<%=display%>" class="canvas_floor_wrap">
                        <canvas id="canvas_<%=floorid%>" width="400" height="400" tabindex='1' class="cmenu2 main_conf">
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
	        	        '<%=placeName %>' ,<%=placeBranchName %>'
	        	      </span>
        </div>
        <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
        <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>'
               style="display:none"/>
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
<div class="bs_content_ub">

    <div class="bs_container_fluid">
        <div class="container-fluid booking_page_container">
            <div id="temp_appends" style="height:400px;width:400px;position:absolute;left:-2000px;top:-300px;"></div>
            <div class="row wsa_header_row">
                <div class="col-sm-12 ">
                    <div class="container-fluid header_nav_row">
                        <div class="row ">
                            <div class="col-sm-12 ">
                                <div id="header_td_div_wsa" class="main_page_header_wsa">
                                    <div id="header_bbok">
                                        <div id="logo_"><img src="img/pplogomarker.png" id="pplogoo"/><div id="logotext">ickoplace</div></div>
                                        <div class="login_in_header_wrap">
                                            <div id="fg_profile_image_wrap">
                                                <div id="fg_profile_image_inner">
                                                    <img id="fg_profile_img" src="">
                                                </div>
                                            </div>
                                            <table id="login_tbl_a" cellspacing="0" cellpadding="0"
                                                   style=" border-collapse: collapse">
                                                <tr>
                                                    <td id="login_prop" style="display:none">
                                                        <div id="login_prop_d">Log In</div>
                                                    </td>
                                                    <td id="login_info_resp" style="display:none">
                                                        Hello,
                                                        <div id="login_info_resp_d" class="userNikname"></div>
                                                    </td>
                                                    <td id="account_drop" style="display:none">
                                                        <div id="account_drop_div">
                                                            <ul id="account_dropit">
                                                                <li class="acc_trig"><a href="#" class="account_dropit"
                                                                                        style="text-decoration: none">Account</a>
                                                                    <ul class="account_dropit_ul">
                                                                        <li>
                                                                            <div id="acc_head_menu_wrap">
                                                                                <div id="acc_arrow"></div>
                                                                                <div id="gotoaccountmenu"
                                                                                     class="topAccOptList"
                                                                                     onclick="goToAccountMenu()">Go to
                                                                                    Account
                                                                                </div>
                                                                                <div id="gotobookings"
                                                                                     class="topAccOptList">My bookings
                                                                                </div>
                                                                                <div id="gotoadminzone"
                                                                                     class="topAccOptList">AdminZone
                                                                                </div>
                                                                                <div id="create_new_place_btn"
                                                                                     class="topAccOptList"
                                                                                     onclick="goToCreatePlace()">Create
                                                                                    New Place
                                                                                </div>
                                                                                <div id="fb_logout_div"
                                                                                     class="topAccOptList"
                                                                                     onClick="facebookSignOut()">Log out
                                                                                </div>
                                                                                <div id="go_logout_div"
                                                                                     class="topAccOptList"
                                                                                     onClick="googleSignOut()">Log out
                                                                                </div>
                                                                            </div>
                                                                            <div id="all_ac_forms" style="display:none">
                                                                                <form id="master_account"
                                                                                      action="gotoaccountmenu"
                                                                                      method="post">
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
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col-md-1 col-sm-0"></div>
                            <div class="col-md-7 col-sm-12 booking_top_nav">
                                <div class="row booking_top_nav_innner">
                                    <div class="col-sm-2 floors_col_sel top_boot_but" data-toggle="tooltip"
                                         data-container="body" data-placement="top" title="יום">
                                        <div class="material-icons mat_book_top">event</div>
                                        <div id="main_book_calendar_tab">
                                            <input id="datepicker_ub" class="datepicker_ub" type="text"/>

                                            <div id="calendar_show_date_on_select">
                                                <div id="csdos_day"></div>
                                                <div id="csdos_mon"></div>
                                            </div>
                                        </div>
                                        <!--						   <div class="dropdown">
                                                                      <div class="dropdown-toggle"  id="floorsDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                        <div id="dd_floor_name">Floor-1</div>
                                                                        <span class="caret floors_carret"></span>
                                                                      </div>
                                                                      <ul class="dropdown-menu floors_dd_ul dropdown_floors"  aria-labelledby="floorsDropDown">
                                                                        <li><a href="#" onclick="selectFloorByID('floorid_H8qF0ZvL0W')">Floor-1</a></li>
                                                                        <li><a href="#" onclick="selectFloorByID('floorid_iTwJZO27Ll')">Floor-2</a></li>
                                                                      </ul>
                                                                   </div>-->

                                    </div>
                                    <div class="col-sm-2 padding_0 top_boot_but" data-toggle="tooltip"
                                         data-container="body" data-placement="top" title="זמן התחלה">
                                        <div class="material-icons mat_book_top">access_time</div>
                                        <div class="dropdown">
                                            <div class="dropdown-toggle" id="floorsTimeDropDown" data-toggle="dropdown"
                                                 aria-haspopup="true" aria-expanded="true">
                                                <div id="book_top_start" class="book_top_start_ub">12:30</div>
                                                <input type="text" id="book_start_val_" style="display:none" value=""/>
                                            </div>
                                            <ul class="dropdown-menu  dropdown_start_floors" id="dropdown_start_floors"
                                                aria-labelledby="floorsTimeDropDown">
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-sm-2 padding_0 top_boot_but" data-toggle="tooltip"
                                         data-container="body" data-placement="top" title="שהות במקום">
                                        <div class="material-icons mat_book_top">timelapse</div>
                                        <div class="dropdown">
                                            <div class="dropdown-toggle" id="floorsPeriodDropDown"
                                                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                <div id="book_top_period" class="book_top_period_ub">שעתיים</div>
                                                <input type="text" id="book_period_val_" style="display:none"
                                                       value="7200"/>
                                            </div>
                                            <ul class="dropdown-menu  dropdown_start_floors" id="dropdown_period_floors"
                                                aria-labelledby="floorsPeriodDropDown">
                                                <li><a href="#" data-period="1800">חצי-שעה</a></li>
                                                <li><a href="#" data-period="3600">שעה</a></li>
                                                <li><a href="#" data-period="7200">שעתיים</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-sm-1 padding_0 top_boot_but" data-toggle="tooltip"
                                         data-container="body" data-placement="top" title="כמות אנשים">
                                        <div class="material-icons mat_book_top">person_outline</div>
                                        <div class="dropdown">
                                            <div class="dropdown-toggle" id="floorsPersonsDropDown"
                                                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                <div id="book_top_persons" class="book_top_persons_ub">2</div>
                                                <input type="text" id="book_persons_val_" style="display:none"
                                                       value="2"/>
                                            </div>

                                            <ul class="dropdown-menu  dropdown_start_floors"
                                                id="dropdown_persons_floors" aria-labelledby="floorsPersonsDropDown">
                                                <li><a href="#" data-period="1">1</a></li>
                                                <li><a href="#" data-period="2">2</a></li>
                                                <li><a href="#" data-period="3">3</a></li>
                                                <li><a href="#" data-period="4">4</a></li>
                                                <li><a href="#" data-period="5">5</a></li>
                                                <li><a href="#" data-period="6">6</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-sm-3 padding_0">

                                    </div>
                                    <div class="col-sm-2 padding_0">
                                        <div id="booking_top_button" class="btn btn-success disabled">
                                            <div id="book_bnt_count" style="display:none;">0</div>
                                            <div class="book_heb_text" id="hz_text_o">הזמנה ריקה</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-0"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row content content_bottom">
                <div class="col-sm-12 ">
                    <div class="container-fluid content_bottom_inner">
                        <div class="row ">
                            <div class="col-md-1  col-sm-0 padding_0">

                            </div>
                            <div class="col-md-7 col-sm-12 text-left content_middle_column">
                                <div id="floors_wrap_menu">

                                    <div id="canvas_append_wrap_ub" class="canvas_append_wrap_ub">

                                    </div>
                                </div>
                                <div id="floor_bottom_buttons">
                                    <%
                                        for (PPSubmitObject floor : canvasStateList) {
                                            String floorid = floor.getFloorid();
                                            String display = "none";
                                            if (floor.isMainfloor()) { %>
                                                <div class="bottom_floors_button bottom_floors_button_left selected_f"
                                                onclick="selectFloorByID('<%=floorid%>')" id="bfb-<%=floorid%>">
                                                        <%=floor.getFloor_name()%>
                                                        <div class="floor_book_badge" id="fbadge-<%=floorid%>"></div>
                                                </div>
                                            <%}
                                         }
                                    %>
                                    <%
                                        for (PPSubmitObject floor : canvasStateList) {
                                            String floorid = floor.getFloorid();
                                            if (!floor.isMainfloor()) { %>
                                            <div class="bottom_floors_button "
                                                 onclick="selectFloorByID('<%=floorid%>')" id="bfb-<%=floorid%>">
                                                <%=floor.getFloor_name()%>
                                                <div class="floor_book_badge" id="fbadge-<%=floorid%>"></div>
                                            </div>
                                            <%}
                                         }
                                    %>
                                    <div id="map_open_mat" class="material-icons" onclick="openMap()"  data-toggle="tooltip"
                                    data-container="body" data-placement="bottom" title="מפה">location_on</div>
                                </div>
                            </div>
                            <div class="col-md-4  col-sm-12" id="right_row_md_bottom_sm">
                                <div class="place_info_ub_i" id="place_info_block">
                                    <div class="place_info_block_head_i">Place info</div>
                                    <div class="place_info_block_content_i">
                                        <div class="pvwrap">
                                            <div class="pv_name">Place name</div>
                                            <div class="pv_value"
                                                 id="pv_value_name"><%=placeInfo.getUserPlace().getPlace()%>
                                                ,<%=placeInfo.getUserPlace().getBranch() %>
                                            </div>
                                        </div>
                                        <div class="pvwrap">
                                            <div class="pv_name">Address</div>
                                            <div class="pv_value"
                                                 id="pv_value_address"><%=placeInfo.getUserPlace().getAddress()%>
                                            </div>
                                        </div>
                                        <%if (placeInfo.getRating() != null) { %>
                                        <div class="pvwrap">
                                            <div class="pv_name">Rating</div>
                                            <div class="pv_value" id="pv_value_rating">
                                                <div class="donerating" name="donerating" id="donerating"></div>
                                                <input id="ratingVal" type="text"
                                                       value="<%=placeInfo.getRating().getAverage()%>"
                                                       style="display:none"/>
                                            </div>
                                        </div>
                                        <%} %>
                                        <div class="pvwrap">
                                            <div class="pv_name">Floors</div>
                                            <div class="pv_value"
                                                 id="pv_value_floors"><%=placeInfo.getUserPlace().getFloors()%>
                                            </div>
                                        </div>
                                        <div class="pvwrap">
                                            <div class="pv_name">Bookable places</div>
                                            <div class="pv_value"
                                                 id="pv_value_places"><%=placeInfo.getUserPlace().getShapesCount()%>
                                            </div>
                                        </div>
                                        <%if (placeInfo.getPlacePhone() != null && !placeInfo.getPlacePhone().isEmpty()) {%>
                                        <div class="pvwrap">
                                            <div class="pv_name">Phone</div>
                                            <div class="pv_value" id="pv_value_phone"><%=placeInfo.getPlacePhone()%>
                                            </div>
                                        </div>
                                        <%} %>
                                        <%if (placeInfo.getPlaceSiteURL() != null && !placeInfo.getPlaceSiteURL().isEmpty()) {%>
                                        <div class="pvwrap">
                                            <div class="pv_name">Site</div>
                                            <div class="pv_value" id="pv_value_site"><%=placeInfo.getPlaceSiteURL()%>
                                            </div>
                                        </div>
                                        <%} %>
                                    </div>
                                </div>
                                <%if (placeInfo.getPlaceImageThumbnails().size() > 0) { %>
                                <div class="place_info_ub" id="place_images_block">
                                    <div class="place_info_block_head">Images</div>
                                    <div class="place_info_block_content">
                                        <% for (JsonimgID_2_data imageObj : placeInfo.getPlaceImageThumbnails()) {%>
                                        <div class="ub_img_div">
                                            <img class="ub_img_thumb" src="<%=imageObj.getData64()%>"
                                                 id="ub_img_thumb-<%=imageObj.getImageID() %>"/>
                                        </div>
                                        <%} %>
                                    </div>
                                </div>
                                <%} %>
                            </div>
                        </div>
                        <div class="row " style="margin-top:50px">
                            <div class="col-md-1  col-sm-0"></div>
                            <div class="col-md-7 col-sm-12  ">

                            </div>
                            <div class="col-md-4  col-sm-12">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <footer class="container-fluid text-center">

    </footer>
</div>
</body>
</html>
