<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"
         import="com.dimab.pickoplace.utils.JsonUtils"
         import="com.dimab.pp.dto.*" %>
<%@ page import="java.util.List" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>

<!DOCTYPE html>
<%
    // todo(egor): push logic to controller
    AJAXImagesJSON responseJSON = (AJAXImagesJSON) request.getAttribute("canvasState");
    String ifid = (String) request.getAttribute("ifid");
    iFrameObj ifresp = (iFrameObj) request.getAttribute("iframedata");
    boolean showonly = (boolean) request.getAttribute("showonly");
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
    double placeUTSoffset = responseJSON.getUTCoffset();

    Integer addedHeight = 80;
    if (ifresp.getBooking() == true) {
        addedHeight = 80;
    } else {
        addedHeight = 40;
    }
%>
<html style="overflow:hidden;width:<%=ifresp.getWidth()%>px;height:<%=ifresp.getHeight()+addedHeight%>px;">
<head>
    <%-- meta --%>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>IFrame</title>
    <script type="text/javascript">
        var pagetype = 'iframepage';
    </script>

    <%-- css --%>
    <common:baseStyles/>
    <common:eachPageStyles/>
    <link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/CSS_checkbox_full/custom-checkbox.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen"/>

    <%-- js --%>
    <script type="text/javascript" src="/js/lib/jquery-1.11.1.min.js"></script>
    <common:baseSyncScripts/>
    <common:eachPageScripts/>

    <script type="text/javascript" src="/js/lib/jquery-ui-1.11.4/jquery-ui.js"></script>
    <script type="text/javascript" src="/js/bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/lib/jquery-plugins/perfect-scrollbar.js"></script>
    <script type="text/javascript" src="js/sitefunctions.js"></script>
    <script type="text/javascript" src="js/updateData_pc.js"></script>


    <!-- IFRAME -->
    <script type="text/javascript" src="js/lib/shapes_fe.js"></script>
    <script type="text/javascript" src="js/wl_menu_if.js"></script>
    <script type="text/javascript" src="js/iframe_Controller.js"></script>
    <script type="text/javascript" src="js/iframe_viewService.js"></script>

    <%if (ifresp.getBooking() == true) { %>
    <script type="text/javascript" src="js/bookingBookingsManger.js"></script>
    <script type="text/javascript" src="js/interactiveUpdate_if.js"></script>
    <%}%>
    <!-- IFRAME -->

    <script type="text/javascript" src="js/updateCanvasData.js"></script>
    <script type="text/javascript" src="js/WindowCanvasEvents.js"></script>
    <script type="text/javascript">

        var tl_canvas = {};
        var InitialBookings = {};
        var StateFromServer = {};
        StateFromServer.floors = [];
        var bookingsbysid = {};
        var timelinediv = {};
        var gcanvas;
        var floorSelectedIDDim;
        var initalIntervalUpdates = 10;
        var proceed_to_edit = 0;
        var bookingsManager;
        var positionmanager = {};
        var bookingVars = {};
        var tcanvas_ = {};
        var currentSliderValue;
        var placeUTCOffsetGlobal;
        var phonerequired = true;

        var if_floorCanvases = [];
        var if_canvas_ = {};
        var if_canvas_main = {};
        var currentIframeSettings = {};
        $(document).ready(function () {
            currentIframeSettings = JSON.parse($("#server_iFrameData").val());
            updateCanvasDataForIFrame(true);
            ApplyFloorsToIframe();
        });

    </script>
    <script type="text/javascript">

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
                $("#verification_code").val("");
                $("#verification_code").prop("readonly", true);
                $("#verification_submit_inactive").show();
                $("#verification_submit").hide();
                $("#smsa_loader").hide();
                $("#phone_wrap_table").hide();
                $("#page_login_prompt").hide();
            }
        });
        ///

        function applyBookingPre() {
            createBookingObject();
            if (bookingRequestWrap.bookingList.length > 0) {
                $("#book_confirm_wrap").show();
            } else {
                $("#book_confirm_wrap").html("");
                $("#book_confirm_wrap").hide();
            }
        }
        function SIapplyBooking() {
            setSessionData(function (result) {
                if (result) {
                    applyBooking();
                    $("#page_login_prompt").hide();
                } else {
                    updatePageView();
                }
            });
        }
    </script>
</head>

<body style="margin: 0px;position:relative;overflow:hidden;width:<%=ifresp.getWidth()%>px;height:<%=ifresp.getHeight()+addedHeight%>px">
<%
    if (ifresp.getBooking() == true) {%>
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
                <div id="book_sign_ask">
                    Login
                </div>
                <div id="book_logged_in_as">
                    <div class="dsdfs">Logged in as:</div>
                    <div id="login_info_resp_db" Title="LogOut" class="userNikname left_p" onclick="logoutAny()">
                        Dmitry
                    </div>
                </div>
                <div id="make_booking" class="make_booking" onclick="makeBooking();" style="display:none">
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
<%}%>
<div id="iframe_popover_hidden" class="hidden">
    <div id="iframe_popover_wrap" style="position:relative; width:300px;min-height:100px; background-color:white;">

    </div>
</div>
<div id="iframe_popover" style="position:absolute" data-toggle="popover"></div>

<div id="temp_appends" style="height:400px;width:400px;position:absolute;left:-2000px;top:-300px;"></div>

<div id="browser_window_wrap">

</div>
<div id="hiden_values_from_edit" style="display:none">
    <canvas id="filtered_canvas"></canvas>
    <img id="filtered_img"/>

    <div id="baw_images">

    </div>
    <%
        for (PPSubmitObject floor : canvasStateList) {
            String backgroundURL = "";
            String overviewURL = "";
            String floorid = floor.getFloorid();
            if (floor.getBackground() != null && !floor.getBackground().isEmpty()) {
                backgroundURL = floor.getBackground();
            }
            if (floor.getAllImageSrc() != null && !floor.getAllImageSrc().isEmpty()) {
                overviewURL = floor.getAllImageSrc();
            }

    %>
    <input type="text" id="server_canvasState_<%=floorid %>" name="server_canvasState"
           value='<%=JsonUtils.serialize(floor)%>'/>
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
    <input type="text" id="server_automaticApprovalList"
           value='<%=JsonUtils.serialize(responseJSON.getAdminApprovalList())%>'/>
    <input type="text" id="server_adminApprovalList"
           value='<%=JsonUtils.serialize(responseJSON.getAdminApprovalList())%>'/>
    <input type="text" id="server_workinghours" value='<%=JsonUtils.serialize(responseJSON.getWorkinghours())%>'/>
    <input type="text" id="server_placeEditList" value='<%=JsonUtils.serialize(responseJSON.getPlaceEditList())%>'/>
    <input type="text" id="server_closeDates" value='<%=JsonUtils.serialize(responseJSON.getCloseDates())%>'/>
    <input type="text" id="server_logosrc" value='<%=responseJSON.getLogosrc()%>'/>
    <input type="text" id="server_iFrameID" value='<%=ifid%>'/>
    <%if (!showonly) {%>
    <div id="showonly_div"></div>
    <%} %>
    <%if (ifid != null && !ifid.isEmpty()) {%>
    <input type="text" id="server_iFrameData" value='<%=JsonUtils.serialize(ifresp)%>'/>
    <%} %>

    <img id="server_main_logo" src="img/pp.png"/>
    <img id="server_v_logo" src="img/vlogo2.png"/>HELLO
    <img id="server_passed_back" src="img/back_passed.png"/>
    <img id="server_clock20" src="img/clock20.png"/>
    <%
        for (JsonimgID_2_data imgID2byte64 : responseJSON.getPlacePhotos()) {
            String imgID = imgID2byte64.getImageID();
    %>
    <input type="text" id="server_imap_<%=imgID %>" name="server_imap" value='<%=JsonUtils.serialize(imgID2byte64)%>'/>
    <% }%>

    <% if (imgID2URL != null && !imgID2URL.isEmpty()) {
        for (JsonImageID_2_GCSurl img2url : imgID2URL) {%>
    <img id="server_<%=img2url.getImageID() %>" crossorigin="anonymous" name="shape_images_from_server"
         src="<%=img2url.getGcsUrl() %>"/>
    <%
            }
        }
    %>
    <input id="address_hidden_lat" name="address_hidden_lat">
    <input id="address_hidden_lng" name="address_hidden_lng">
    <input id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">

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
    <div id="canvas_drawall_images_wrap" style="display:none;">
        <div id="canvas_drawall_images" style="display:none;"></div>
    </div>
    <div class="size_value"><input id="canvas_w" type="text" value="400"/></div>
    <div class="size_value"><input id="canvas_h" type="text" value="400"/></div>
    <div id="history_images_wrapper"></div>
    <canvas id="text_width_calculation_canvas" width="10" height="10" style="display:none"></canvas>
    <input type="text" id="userSetPlaceName" name="userSetPlaceName" value='<%=placeName %>' style="display:none"/>
    <input type="text" id="userSetPlaceBName" name="userSetPlaceBName" value='<%=placeBranchName %>'
           style="display:none"/>
    <input type="text" id="userSetPlaceID" name="userSetPlaceBName" value='<%=placeID %>' style="display:none"/>


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
            <div id="canvas_wrap_not_scroll_conf_if">

                <%
                    for (PPSubmitObject floor : canvasStateList) {
                        String floorid = floor.getFloorid();
                %>
                <div id="if_div_wrap-canvas_<%=floorid%>" class="canvas_floor_wrap">
                    <canvas id="if_canvas_<%=floorid%>" width="400" height="400" tabindex='1' class="cmenu2 main_conf">
                        This text is displayed if your browser does not support HTML5 Canvas.
                    </canvas>
                </div>
                <%} %>

            </div>
        </div>

    </div>
</div>
<div id="iframe_wrap" class="iframe_exact"
     style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">


    <div id="page_login_prompt" class="login_prompt_iframe stopclick" style="display:none;">
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

    <div id="pc_iframe_wrap" style="width:<%=ifresp.getWidth()%>px">
        <% if (ifresp.getBooking() == true) {%>
        <div id="pc_iframe_top">
            <div id="please_select_date_">
                <div class="material-icons">content_paste</div>
                <div id="please_select_date_text">נא לבחור תאריך ההזמנה</div>
                <div id="iframe_date_selection" style="display:none">

                    <div class="modal_value_column">
                        <div class="iframe_top_value_mat material-icons">today</div>
                        <input id="datepicker_ub" class="datepicker_if" type="text" data-toggle="tooltip"
                               data-placement="bottom" title="תאריך"/>
                    </div>

                    <div class="modal_value_column">
                        <div class="iframe_top_value_mat material-icons">schedule</div>
                        <div class="dropdown" data-toggle="tooltip" data-placement="right" title="שעת הזמנה">
                            <div class="dropdown-toggle" id="select_time_modal_start" data-toggle="dropdown"
                                 aria-haspopup="true" aria-expanded="true">
                                <div id="book_top_start" class="book_top_start_if">
                                    <div class="default_dropdown_text">זמן התחלה</div>
                                </div>
                                <input type="text" id="book_start_val_" style="display:none" value=""/>
                            </div>
                            <ul class="dropdown-menu select_time_dropdown" id="dropdown_start_floors"
                                aria-labelledby="select_time_modal_start">
                            </ul>
                        </div>
                    </div>

                    <div class="modal_value_column">
                        <div class="iframe_top_value_mat material-icons">timelapse</div>
                        <div class="dropdown" data-toggle="tooltip" data-placement="right" title="משך ההזמנה">
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
                        <div class="dropdown" data-toggle="tooltip" data-placement="right" title="מספר אורחים">
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

            <div id="hazmana_iframe_button_empty" data-toggle="tooltip" data-placement="bottom" title="הזמנה רקה">
                <div class="material-icons">shopping_cart</div>
                <div id="hazmana_badge_empty">0</div>
            </div>
            <div id="hazmana_iframe_button" style="display:none" data-toggle="tooltip" data-placement="bottom"
                 title="הזמנה שלי">
                <div class="material-icons">shopping_cart</div>
                <div id="hazmana_badge">0</div>
            </div>
        </div>
        <%}%>
        <div id="pc_iframe_floors_wrap" style="width:<%=ifresp.getWidth()%>px;height:<%=ifresp.getHeight()%>px">

        </div>
        <div id="pc_iframe_bottom">
            <%
                for (PPSubmitObject floor : canvasStateList) {
                    String floorid = floor.getFloorid();
                    String display = "none";
                    if (floor.isMainfloor()) { %>
            `
            <div class="iframe_floor_selector iframe_floor_selector_selected" id="floor_if_btn-<%=floorid%>"
                 onclick="iFselectFloorByID('<%=floorid%>')"><%=floor.getFloor_name()%>
            </div>
            <%
                    }
                }
            %>
            <%
                for (PPSubmitObject floor : canvasStateList) {
                    String floorid = floor.getFloorid();
                    if (!floor.isMainfloor()) { %>
            <div class="iframe_floor_selector" id="floor_if_btn-<%=floorid%>"
                 onclick="iFselectFloorByID('<%=floorid%>')"><%=floor.getFloor_name()%>
            </div>
            <%
                    }
                }
            %>


        </div>
    </div>
</div>

</body>
</html>