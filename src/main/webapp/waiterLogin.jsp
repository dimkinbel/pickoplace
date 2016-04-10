<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"
         import = "java.util.List" %>
<%@ page import="com.dimab.pickoplace.utils.JsonUtils" %>
<%@ page import="java.util.Set" %>
<%@ page import="com.dimab.pp.dto.*" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>

<!DOCTYPE html >
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript">
        var pagetype = 'waiter_login';
    </script>

    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
    <script type="text/javascript" src="/js/jquery-1.11.1.min.js"></script>
    <common:baseStyles/>
    <common:eachPageStyles/>
    <common:baseSyncScripts/>
    <common:eachPageScripts/>

    <link rel="icon"  type="image/png"  href="img/pplogomarker.png">
    <script type="text/javascript" src="js/sitefunctions.js" ></script>
    <script type="text/javascript" src="/js/bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.11.4.date.autoc.slider/jquery-ui.js"></script>

    <script type="text/javascript">

    </script>
    <title>PickoPlace-WaiterLogin</title>
</head>
<body style="margin: 0px;background-color: #1C232D;">
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
<div id="page_container">
    <div id="header_td_div" class="main_page_header relative_header">
        <div id="header" >
            <div id="logo_"><img src="img/pplogomarker.png" id="pplogoo"/><div id="logotext">ickoplace</div></div>

            <div class="login_in_header_wrap">

                <div id="fg_profile_image_wrap" >
                    <div id="fg_profile_image_inner" >
                        <img class="fg_profile_img" id="fg_profile_img" src="" >
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
                                                    <a href="/gotoaccountmenu"><div id="gotoaccountmenu" class="topAccOptList"  >Go to Account</div></a>
                                                    <a href="/my_bookings.jsp"><div id="gotobookings" class="topAccOptList">My bookings</div></a>
                                                    <a href="/user_waiter_list.jsp"><div id="gotoadminzone" class="topAccOptList">AdminZone</div></a>
                                                    <a href="/create_new_place.jsp"><div id="create_new_place_btn"  class="topAccOptList"  >Create New Place</div></a>
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

    <div id="page_content">
        <div class="container-fluid  ">
            <div class="row  ">

            </div>
            <div class="row  ">
                <div class="col-md-4 "> </div>
                <div class="col-md-4  ">
                    <div class="panel panel-default login_panel">
                        <div class="panel-body">
                            <div class="container-fluid  ">
                                <div class="row  login_panel_separator">
                                    USERNAME
                                </div>
                                <div class="row input_waiter_row">
                                    <input type="text" id="waiter_username_input" class="waiter_login_input"/>

                                </div>
                                <div class="row  login_panel_separator">
                                    PASSWORD
                                </div>
                                <div class="row input_waiter_row">
                                    <input type="text" id="waiter_password_input" class="waiter_login_input"/>
                                </div>
                                <div class="row buttons_row">
                                    <div id="waiter_login_button_submit">LOGIN</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4  "> </div>
            </div>
        </div>
    </div>
</div>


</body>
</html>