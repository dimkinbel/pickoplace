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
        <table id="phone_wrap_table" cellspacing="0" cellpadding="0" style=" border-collapse: collapse;display:none">
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
                    <div id="send_sms_complete"  style="display:none">
                        Enter verification code below, or <div id="phone_resend_open">resend</div>
                    </div>
                </td>
            </tr>
            <tr id="phoneInstructions">
                <td>
                    <div id="phone_instructions" >You will receive SMS with verification code</div>
                </td>
            </tr>
            <tr id="verification_code_line">
                <td class="ph_pad_top ph_pad_bot"><!-- $("#verification_code").prop("readonly",true); -->
                    <input type="number" id="verification_code" readonly/><div id="verification_submit" style="display:none">SUBMIT</div>
                    <div id="verification_submit_inactive">SUBMIT
                        <img id="smsa_loader" src="img/gif/fr_load.gif" style="display:none;">
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>

<div id="header_td_div" class="main_page_header">
<div id="header">
    <div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
    <div id="search_header" >
        <div class="left search_header_text">
            Place search
        </div>
        <div class="left">

            <input  type="text" name="buisnessAddress" id="placeAddressAuto" />
            <input  id="address_hidden_lat" name="address_hidden_lat" style="display: none;">
            <input  id="address_hidden_lng" name="address_hidden_lng" style="display: none;">
            <input  id="UTCoffcet_hidden" name="UTCoffcet_hidden" style="display: none;">

        </div>
        <div class="left" style="position:relative">

            <input  type="text" name="buisnessName" id="placeSearchName"  placeholder="place name (opt.)"/>
            <img id="autocompleteSearchAjax" src="img/gif/ajax-loader-round.gif" style="display:none"/>

        </div>

        <div class="left">
            <div id="search_button">
                <div class="material-icons" id="search_material">search</div>
                <img id="frame_book_ajax_gif_welcome" src="img/gif/ajax-loader-round.gif" style="display:none"/>
            </div>

        </div>
        <div class="left" id="advanced_proposal">
            <ul id="advanced_material_drop" >
                <li class="same_height"><a href="#" class="material-icons advanced_material" style="text-decoration: none">keyboard_arrow_down</a>
                    <ul class="advanced_material_dropit">
                        <li>
                            <div id="advanced_button">Search options</div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>

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

    <div style="float: right; margin-right: 100px;">
        <common:languageSelector/>
    </div>
</div>

<div id="additional_search_wrap" style=" height:0px;">
    <div id="additional_search_inner" style="display:none">
        <div class="add_search_close material-icons" id="asc_left">keyboard_arrow_up</div>
        <div id="radius_wrap" >
            <div class="sesed">Search radius</div>
            <div id="slider_wrap_acom" class="left" style="height:24px;" >
                <div id="range_distanse_slider"  ></div>
            </div>
            <div id="distanceval" class=""></div>
        </div>
        <div class="add_search_close material-icons" id="asc_right">keyboard_arrow_up</div>
    </div>
</div>
</div>

<div id="main_wrap_">
<div id="main_container" class="main_container">
    <div id="mainLastResults_wrap">
        <div id="free_place_finder_wrap"  >
            <div id="wiz_table_wrap">
                <table id="wiz_table" cellspacing="0" cellpadding="0" style=" border-collapse: collapse">
                    <tr >
                        <td id="address_tr_wiz">
                            <div id="wiz_header_" >Free place wizard</div>
                            <div style="position:relative"><input type="text" id="wiz_address_input" class="wiz_address" placeholder="Address" /><i class="material-icons mat_room">room</i></div>
                        </td>
                        <td rowspan="2" id="time_persons_wiz_td">
                            <div id="time_persons_wiz_div">
                                <table id="wiz_table_date" cellspacing="0" cellpadding="0" style="width: 100%;height:100%; border-collapse: collapse">
                                    <tr >
                                        <td class="wiz_p_top">Date</td>
                                        <td class="wiz_p_top">Time</td>
                                        <td class="wiz_p_top safvaebawf">Persons</td>
                                    </tr>
                                    <tr >
                                        <td id="wiz_date_picker_td">
                                            <div id="wiz_date_picker">
                                                <div id="wiz_week_day" ></div>
                                                <input id="wiz_date_picker_input" type="text"/>
                                            </div>
                                        </td>
                                        <td id="time_picker_td">
                                            <div id="datepicker_from_wrap">
                                                <div id="dp_fh_wrap" class="left">
                                                    <div id="dp_fh_up" class="dflex"><i class="material-icons wiz_arr wiz_arr_top wiz_arr_d">expand_less</i></div>
                                                    <input type="text" id="from_h_inp" class="dp_wiz_time" readonly />
                                                    <div id="dp_fh_down"  class="dflex"><i class="material-icons wiz_arr wiz_arr_bot  wiz_arr_d">expand_more</i></div>
                                                </div>
                                                <div id="h_dots">:</div>
                                                <div id="dp_fm_wrap" class="left">
                                                    <div id="dp_fm_up"  class="dflex"><i class="material-icons wiz_arr wiz_arr_top  wiz_arr_d">expand_less</i></div>
                                                    <input type="text" id="from_m_inp" class="dp_wiz_time" readonly />
                                                    <div id="dp_fm_down"  class="dflex"><i class="material-icons wiz_arr wiz_arr_bot  wiz_arr_d">expand_more</i></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td id="persons_picker_td">
                                            <div id="dp_pers_wrap" class="left">
                                                <div id="wper_up"  class="dflex"><i class="material-icons wiz_arr wiz_arr_top  wiz_arr_p">expand_less</i></div>
                                                <input type="text" id="w_per_inp" class="dp_wiz_pers" readonly />
                                                <div id="wper_don"  class="dflex"><i class="material-icons wiz_arr wiz_arr_bot wiz_arr_p">expand_more</i></div>
                                            </div>
                                            <div class="material-icons pers_material" style="display:none">supervisor_account</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr >
                        <td id="name_tr_wiz">
                            <div style="position:relative"><input type="text" id="wiz_name_input" class="wiz_address"  placeholder="Place name (opt.)"/>
                                <img id="autocompleteWizAjax" src="img/gif/ajax-loader-round.gif" style="display:none"/>
                            </div>
                        </td>
                    </tr>
                </table>
                <div id="wiz_search_btn">
                    <i class="material-icons search_wiz_" id="searchWizardBtn">search</i>
                </div>
                <div id="wiz_search_btn_ajax" style="display:none">
                    <i class="material-icons search_wiz_ajax search_wiz_ajax_animation" id="searchWizardBtnAjax">search</i>
                </div>
            </div>
        </div>

        <div id="mainLastResults" >
        </div>

        <div id="welcome-load-more" class="welcome_load_more"><div id="load_more-text">LOAD MORE</div>
            <img id="welcome_loader" src="img/gif/fr_load.gif" style="position: relative; margin-top: 5px;display:none"/>
        </div>

        <div id="search-load-more"  class="welcome_load_more" style="display:none"><div id="search_more-text">LOAD MORE</div>
            <img id="search_loader" src="img/gif/fr_load.gif" style="position: relative; margin-top: 5px;display:none"/>
        </div>

        <div id="wiz-load-more"  class="welcome_load_more" style="display:none"><div id="wiz_more-text">LOAD MORE</div>
            <img id="wiz_loader" src="img/gif/fr_load.gif" style="position: relative; margin-top: 5px;display:none"/>
        </div>
    </div>
</div>

<div id="map_absolute">
    <div id="main_map_wrap_" >
        <div id="main_map" style="width:100%;height:100%;"></div>
    </div>
</div>
</div>