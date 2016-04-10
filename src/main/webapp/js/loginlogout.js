var auth2 = auth2 || {};
var gcode = {};
var fudata = {};
var gudata = {};
var gconnected = false;
var fconnected = false;
var initialPageLoad = true;
var phoneflow = false;
var phoneloggedby = "";
var mobileInput;
$(document).ready(function () {

    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'js/intl-tel-input-master/build/css/intlTelInput.css'));
    mobileInput = $("#mobile-number");
    $.getScript("js/intl-tel-input-master/build/js/intlTelInput.min.js", function (data, status, jqxhr) {
        mobileInput.intlTelInput({
            nationalMode: true,
            defaultCountry: "il",
            preferredCountries: ["il"],
            onlyCountries: ["il", "us", "de", "ru", "ua"],
            utilsScript: "js/intl-tel-input-master/lib/libphonenumber/build/utils.js"
        });
    });
    $("#book_sign_ask").click(function () {
        $("#page_login_prompt").show();
    });
    $("#send_sms").hover(
        function () {
            $("#phone_instructions").css("opacity", "1");
        }, function () {
            $("#phone_instructions").css("opacity", "0");
        }
    );
    $("#phone_resend_open").click(function () {
        $("#send_sms_ajax").hide();
        $("#send_sms_complete").hide();
        $("#send_sms").show();
        $("#verification_code").val("");
        $("#verification_code").prop("readonly", true);
        $("#verification_submit_inactive").show();
        $("#verification_submit").hide();
        $("#smsa_loader").hide();
    });
    $("#send_sms").click(function () {
        var number = $("#mobile-number").intlTelInput("getNumber");
        var countryData = $("#mobile-number").intlTelInput("getSelectedCountryData");
        var smsrequest = {};
        smsrequest.number = number;
        smsrequest.countryData = countryData;
        var json_ = {jsonObject: JSON.stringify(smsrequest)};
        console.log(json_);
        $.ajax({
            url: "/plivoSMSrequest",
            data: json_,//
            beforeSend: function () {
                $("#send_sms").hide();
                $("#send_sms_ajax").show();
            },
            success: function (data) {
                if (data.status == "OK") {
                    $("#send_sms_ajax").hide();
                    $("#send_sms_complete").show();
                    $("#verification_code").val("");
                    $("#verification_code").prop("readonly", false);
                    $("#verification_submit_inactive").hide();
                    $("#verification_submit").show();
                } else if (data.status == "NOTLOGGED" || data.status == "WAIT") {

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
                    if (data.status == "WAIT") {
                        alert("5 SMS per hour allowed! Contact admin dimkinbel@gmail.com");
                    }
                } else if (data.status == "NULL" || data.status == "ERROR") {
                    $("#send_sms_ajax").hide();
                    $("#send_sms_complete").hide();
                    $("#send_sms").show();
                }
                console.log(data);
            },
            error: function (e) {
                $("#send_sms_ajax").hide();
                console.log(e);
            },
            dataType: "JSON",
            type: "post"
        });
    });
    $("#verification_submit").click(function () {
        var codeinput = $("#verification_code").val();
        var stringlength = codeinput.length;
        var intcode = parseInt(codeinput);
        var intlength = intcode.toString().length;
        if (stringlength != intlength) {
            $("#verification_code").addClass("redborder");
        } else {
            var json_ = {code: codeinput};
            console.log(json_);
            $.ajax({
                url: "/smsVerificationCodeSubmit",
                data: json_,//
                beforeSend: function () {
                    $("#verification_submit").hide();
                    $("#verification_submit_inactive").show();
                    $("#smsa_loader").show();
                },
                success: function (data) {
                    $("#smsa_loader").hide();
                    $("#verification_submit").show();
                    $("#verification_submit_inactive").hide();
                    if (data.status == "OK") {
                        phoneflow = false;
                        if (phoneloggedby == "google") {
                            onSignInCallback(auth2.currentUser.get().getAuthResponse());//phoneloggedby = "google";
                        } else if (phoneloggedby == "FB") {
                            $("#page_login_prompt").hide();
                            fconnected = true;
                        }
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
                        $("#sign_in_table_").show();
                    } else if (data.status == "NOTLOGGED") {
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
                        $("#sign_in_table_").show();
                        $("#page_login_prompt").hide();
                    } else if (data.status == "NOCODE") {
                        $("#phone_resend_open").click();
                    } else if (data.status == "WRONG") {
                        $("#verification_code").addClass("redborder");
                    }
                    console.log(data);
                },
                error: function (e) {
                    $("#send_sms_ajax").hide();
                    console.log(e);
                },
                dataType: "JSON",
                type: "post"
            });
        }
    });
    $("#verification_code").on("keyup change", function () {
        $("#verification_code").removeClass("redborder");
    });
});

//gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js?onload=startApp';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();
// Load the FB SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=953909477967729";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


//INIT VALUES
/**
 * Called after the Google client library has loaded.
 */
function startApp() {
    console.log("GOOGLE: startApp()");
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and setup the client.
        gapi.auth2.init({
            client_id: '542083885391-iqtnhm3jjc6if0sgkstvkfj4oksjg3m5.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            fetch_basic_profile: true,
            scope: 'https://www.googleapis.com/auth/plus.login'
        }).then(function () {
            console.log('GOOGLE: init');
            auth2 = gapi.auth2.getAuthInstance();
            auth2.then(function () {
                onSignInCallback(auth2.currentUser.get().getAuthResponse())
            });
        });
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '953909477967729',
        cookie: true,  // enable cookies to allow the server to access  the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.1' // use version 2.1
    });
    if (!initialPageLoad) {
        FB.getLoginStatus(function (response) {
            console.log("FACEBOOK: FB.getLoginStatus on Init");
            statusChangeCallback(response);
        });
    }
};

function googleSignIn() {
    console.log("GOOGLE: googleSignIn()");
    auth2.grantOfflineAccess().then(
        function (result) {
            console.log(result)
            gcode = result.code;
            helper.connectServer(result.code);
        });

}

var helper = (function () {
    var authResult = undefined;
    return {

        onSignInCallback: function (authResult) {
            console.log("GOOGLE: helper.onSignInCallback");
            for (var field in authResult) {
                // $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
            }
            if (authResult['access_token']) {
                initialPageLoad = false;
                console.log("GOOGLE: helper.onSignInCallback - success");
                // The user is signed in
                this.authResult = authResult;
                gconnected = true;
                fconnected = false;
                gapi.client.load('plus', 'v1', this.renderProfile);
                // Check if FB connected -> disconnect
                FB.getLoginStatus(function (response) {
                    console.log("FACEBOOK: FB.getLoginStatus() on google signed-in");
                    if (response.status === 'connected') {
                        // facebookSignOut();
                    }
                });

            } else if (authResult['error']) {
                console.log("GOOGLE: helper.onSignInCallback - error");
                gconnected = false;
                gudata = {};
                if (initialPageLoad) {
                    initialPageLoad = false;
                    FB.getLoginStatus(function (response) {
                        console.log("FACEBOOK (GOOGLE FAIL): FB.getLoginStatus on Init");
                        statusChangeCallback(response);
                    });
                } else {
                    initialPageLoad = false;
                    updatePageView();
                }
            } else {
                console.log("GOOGLE: helper.onSignInCallback - disconnected");
                gconnected = false;
                gudata = {};
                if (initialPageLoad) {
                    initialPageLoad = false;
                    FB.getLoginStatus(function (response) {
                        console.log("FACEBOOK (GOOGLE FAIL): FB.getLoginStatus on Init");
                        statusChangeCallback(response);
                    });
                } else {
                    initialPageLoad = false;
                    updatePageView();
                }
            }

        },
        /**
         * Retrieves and renders the authenticated user's Google+ profile.
         */
        renderProfile: function () {
            console.log("GOOGLE: helper.renderProfile");
            var request = gapi.client.plus.people.get({'userId': 'me'});
            request.execute(function (profile) {
                if (profile.error) {
                    gudata = {};
                    gconnected = false;
                    googleSignOut();
                    return;
                }
                gudata = profile;
                updatePageView();
            });
        },
        /**
         * Calls the server endpoint to disconnect the app for the user.
         */
        disconnectServer: function () {
            console.log("GOOGLE: helper.disconnectServer");
            // Revoke the server tokens
            var token = auth2.currentUser.get().getAuthResponse().access_token;
            var disconnectData = {access_token: token, provider: "google"};
            $.ajax({
                type: 'POST',
                url: '/disconnectUser',
                async: false,
                dataType: "JSON",
                data: disconnectData,
                success: function (result) {
                    console.log("DISCONNECTED SERVER");
                    console.log(result);
                    auth2.signOut().then(function () {
                        onSignInCallback(auth2.currentUser.get().getAuthResponse());
                    });
                },
                error: function (e) {
                    console.log(e);
                }
            });

        },
        /**
         * Calls the server endpoint to connect the app for the user. The client
         * sends the one-time authorization code to the server and the server
         * exchanges the code for its own tokens to use for offline API access.
         * For more information, see:
         *   https://developers.google.com/+/web/signin/server-side-flow
         */
        connectServer: function (code) {
            console.log("GOOGLE: helper.connectServer");
            console.log(code);

            var token = auth2.currentUser.get().getAuthResponse().access_token;
            var connectData = {access_token: token, provider: "google", code: code};
            console.log(connectData);
            $.ajax({
                type: 'POST',
                url: '/connectUser',
                dataType: "JSON",
                success: function (result) {
                    if (result.valid == false) {
                        auth2.signOut().then(function () {
                            onSignInCallback(auth2.currentUser.get().getAuthResponse());
                        });
                    } else {
                        if (result.phone == true) {
                            onSignInCallback(auth2.currentUser.get().getAuthResponse());
                        } else if (phonerequired != undefined && phonerequired == true) {
                            $("#sign_in_table_").hide();
                            //result.userData.first_name for FB
                            $("#user_name_at_phone").html(result.userData.given_name);
                            $("#send_sms_ajax").hide();
                            $("#send_sms_complete").hide();
                            $("#send_sms").show();
                            $("#phone_wrap_table").show();
                            phoneflow = true;
                            phoneloggedby = "google";
                        }
                    }
                    console.log(result);
                },
                error: function (e) {
                    console.log(e);
                    auth2.signOut().then(function () {
                        onSignInCallback(auth2.currentUser.get().getAuthResponse());
                    });
                },
                data: connectData
            });

        },

    };
})();
/**
 * Perform jQuery initialization and check to ensure that you updated your
 * client ID.
 */
function googleSignOut() {
    console.log("GOOGLE: googleSignOut()");
    helper.disconnectServer();
}

/**
 * Calls the helper method that handles the authentication flow.
 *
 * @param {Object} authResult An Object which contains the access token and
 *   other authentication information.
 */
function onSignInCallback(authResult) {
    console.log("GOOGLE: onSignInCallback()");
    helper.onSignInCallback(authResult);
}



// This is called with the results from from FB.getLoginStatus().
function facebookSignOut() {
    console.log("FACEBOOK: facebookSignOut()");
    var token = FB.getAuthResponse().accessToken;

    FB.logout(function (response) {
        // Person is now logged out
        statusChangeCallback(response);
        // DISCONNECT SERVER
        var disconnectData = {access_token: token, provider: "facebook"};
        $.ajax({
            type: 'POST',
            url: '/disconnectUser',
            dataType: "JSON",
            async: true,
            data: disconnectData,
            success: function (result) {
                console.log("DISCONNECTED SERVER");
                console.log(result);
            },
            error: function (e) {
                console.log(e);
            }
        });
    });
}
var onlyonlogin = false;
function facebookSignIn() {
    console.log("FACEBOOK: facebookSignIn()");
    onlyonlogin = true;
    FB.login(function (response) {
        // Person is now logged out
        statusChangeCallback(response);
    }, {scope: 'public_profile,email'});
}
function checkLoginState() {
    console.log("FACEBOOK: checkLoginState()");
    FB.getLoginStatus(function (response) {
        console.log(response)
       statusChangeCallback(response);
    });
}
function statusChangeCallback(response) {
    console.log("FACEBOOK: statusChangeCallback()");
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log("FACEBOOK: statusChangeCallback() - SUCCESS");
        FB.api('/me', function (response) {
            console.log('Successful FB login for: ' + response.name);
            fudata = response;
            fconnected = true;
            gconnected = false;
            updatePageView();
        });
        // IF Google connected -> disconnect
        if (auth2.isSignedIn.get() == true) {
            auth2.signOut().then(function () {
                onSignInCallback(auth2.currentUser.get().getAuthResponse());
            });
        }
        // CONNECT TO SERVER
        if (onlyonlogin) {
            onlyonlogin = false;
            var token = FB.getAuthResponse().accessToken;
            var connectData = {access_token: token, provider: "facebook", code: ""};
            $.ajax({
                type: 'POST',
                url: '/connectUser',
                dataType: "JSON",
                success: function (result) {
                    if (result.valid == false) {
                        FB.logout(function (response) {
                            statusChangeCallback(response);
                        });
                    } else {
                        if (result.phone == false && phonerequired != undefined && phonerequired == true) {
                            $("#sign_in_table_").hide();
                            //result.userData.first_name for FB
                            $("#user_name_at_phone").html(result.userData.first_name);
                            $("#send_sms_ajax").hide();
                            $("#send_sms_complete").hide();
                            $("#send_sms").show();
                            $("#phone_wrap_table").show();
                            $("#page_login_prompt").show();
                            fconnected = false;
                            phoneflow = true;
                            phoneloggedby = "FB";
                        }
                    }
                    console.log(result);
                },
                error: function (e) {
                    console.log(e);
                    FB.logout(function (response) {
                        statusChangeCallback(response);
                    });
                },
                data: connectData
            });
        }

    } else if (response.status === 'not_authorized') {
        console.log("FACEBOOK: statusChangeCallback() - NOT_AUTORIZED");
        // The person is logged into Facebook, but not your app.
        //  'into this app.';
        fudata = {};
        fconnected = false;
        updatePageView();
    } else {
        console.log("FACEBOOK: statusChangeCallback() - FAIL");
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        //  document.getElementById('status').innerHTML = 'Please log ' +
        //   'into Facebook.';
        fudata = {};
        fconnected = false;
        updatePageView();

    }
}

// https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}
// Get access token expiration
/*
 {
 "issued_to": "542083885391-iqtnhm3jjc6if0sgkstvkfj4oksjg3m5.apps.googleusercontent.com",
 "audience": "542083885391-iqtnhm3jjc6if0sgkstvkfj4oksjg3m5.apps.googleusercontent.com",
 "user_id": "100527707859876973934",
 "scope": "https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.moments.write https://www.googleapis.com/auth/plus.profile.agerange.read https://www.googleapis.com/auth/plus.profile.language.read https://www.googleapis.com/auth/plus.circles.members.read",
 "expires_in": 3409,
 "email": "dimkinbel@gmail.com",
 "verified_email": true,
 "access_type": "offline"
 }
 */
function verifyGoogleTokenExpired(callback) {
    var curTime = new Date();
    var curTimeMill  = curTime.getTime();
    var accessExpire = auth2.currentUser.get().getAuthResponse().expires_at;
    if(curTimeMill + 1000*60 < accessExpire) {
        callback(auth2.currentUser.get().getAuthResponse().access_token);
    } else {
        // Generate new access_token
        auth2.grantOfflineAccess().then(callback(auth2.currentUser.get().getAuthResponse().access_token));
    }
}
function setSessionData(callback) {
    if (gconnected) {
        if (auth2.isSignedIn.get()) {
            callback(true);


        } else {
            gconnected = false;
            updatePageView();
            callback(false);
        }

    } else if (fconnected) {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                var token = FB.getAuthResponse().accessToken;
                var data_ = {provider: "facebook", access_token: token};

                callback(true);
            } else {
                fconnected = false;
                updatePageView();
                callback(false);
            }
        });


    } else {
        updatePageView();
        callback(false);
    }
}

function logoutAny() {
    if (fconnected == true) {
        facebookSignOut();
        fconnected = false;
        updatePageView();
    } else if (gconnected == true) {
        googleSignOut();
        gconnected = false;
        updatePageView();
    }
}

function updatePageView() {
    if (fconnected == true) {
        //Connected To Facebook
        $("#bstartNext").show(); // create_new_place
        $("#openLoginPromptIn").hide();// create_new_place
        $("#page_login_prompt").hide();
        if (pagetype != undefined &&
            (pagetype == 'editplace' ||
            pagetype == 'iframeeditor' ||
            pagetype == 'my_bookings' ||
            pagetype == 'place_config' ||
            pagetype == 'user_account' ||
            pagetype == 'waiter_login' ||
            pagetype == 'waiter_list')) {
            $("#login_prop_d").hide();
        } else {
            $("#login_prop").hide();
        }
        $("#account_drop").show();

        $("#login_info_resp_d").empty();
        $("#login_info_resp_d").html(fudata.first_name);
        $("#login_info_resp").show();
        if (pagetype != undefined &&
            (pagetype == 'iframepage' ||
             pagetype == 'place_booking')) {
            $("#book_sign_ask").hide();
            $("#login_info_resp_db").empty();
            $("#login_info_resp_db").html(fudata.first_name);
            $("#blcon_r,#book_logged_in_as").show();
            $("#lpr_b").hide();
            $("#make_booking").show();
        }
        $("#fb_logout_div").show();
        $("#go_logout_div").hide();
        $('#fg_profile_img').attr('src', "http://graph.facebook.com/" + fudata.id + "/picture");
        $("#fg_profile_image_wrap").show();
        if (pagetype != undefined && pagetype == 'waiter_admin') {
            var pid = $("#server_placeID").val();
            requestChannelToken(fudata.id + "___" + fudata.email + "_PPID_" + pid + "_PPID_" + randomString(5));
        }
        if (pagetype != undefined && pagetype == 'my_bookings') {
            setSessionData(function (result) {
                if (result) {
                    loadFuture(10);
                    loadPast(10);
                }
            });
        } else if (pagetype != undefined && pagetype == 'waiter_list') {
            setSessionData(function (result) {
                if (result) {
                    updateWaiterList();
                }
            });
        }
    } else if (gconnected == true) {
        //Connected To Google
        $("#bstartNext").show();// create_new_place
        $("#openLoginPromptIn").hide();// create_new_place
        $("#page_login_prompt").hide();
        if (pagetype != undefined &&
            (pagetype == 'editplace' ||
            pagetype == 'iframeeditor' ||
            pagetype == 'my_bookings' ||
            pagetype == 'place_config' ||
            pagetype == 'user_account' ||
            pagetype == 'waiter_login' ||
            pagetype == 'waiter_list')) {
            $("#login_prop_d").hide();
        } else {
            $("#login_prop").hide();
        }
        $("#account_drop").show();

        $("#login_info_resp_d").empty();
        $("#login_info_resp_d").html(gudata.name.givenName);
        $("#login_info_resp").show();
        if (pagetype != undefined &&
            (pagetype == 'iframepage' ||
            pagetype == 'place_booking')) {
            $("#book_sign_ask").hide();
            $("#login_info_resp_db").empty();
            $("#login_info_resp_db").html(gudata.name.givenName);
            $("#blcon_r,#book_logged_in_as").show();
            $("#lpr_b").hide();
            $("#make_booking").show();
        }

        $("#fb_logout_div").hide();
        $("#go_logout_div").show();
        $('#fg_profile_img').attr('src', gudata.image.url);
        $("#fg_profile_image_wrap").show();
        if (pagetype != undefined && pagetype == 'waiter_admin') {
            var pid = $("#server_placeID").val();
            requestChannelToken(gudata.id + "___" + gudata.name.givenName + "_PPID_" + pid + "_PPID_" + randomString(5));
        }
        if (pagetype != undefined && pagetype == 'my_bookings') {
            setSessionData(function (result) {
                if (result) {
                    loadFuture(10);
                    loadPast(10);
                }
            });
        } else if (pagetype != undefined && pagetype == 'waiter_list') {
            setSessionData(function (result) {
                if (result) {
                    updateWaiterList();
                }
            });
        }
    } else {
        //Not connected
        if (pagetype != undefined &&
            (pagetype == 'editplace' ||
            pagetype == 'iframeeditor' ||
            pagetype == 'my_bookings' ||
            pagetype == 'place_config' ||
            pagetype == 'user_account' ||
            pagetype == 'waiter_login' ||
            pagetype == 'waiter_list')) {
            console.log("update_no_connected");
            location.href = "/welcome.jsp";
        } else {
            $("#bstartNext").hide();// create_new_place
            $("#openLoginPromptIn").show();// create_new_place

            $("#login_prop").show();
            $("#login_info_resp").hide();
            $("#account_drop").hide();
            $("#fg_profile_image_wrap").hide();
            if (pagetype != undefined &&
                (pagetype == 'iframepage' ||
                pagetype == 'place_booking')) {
                $("#make_booking,#book_logged_in_as").hide();
                $("#book_sign_ask").show();
                $("#login_info_resp_db").empty();
                $("#blcon_r").hide();
                $("#lpr_b").show();
            }
            $("#login_info_resp_d").empty();

            $("#fb_logout_div").hide();
            $("#go_logout_div").hide();
            if (pagetype != undefined && pagetype == 'waiter_admin' && channel__ != undefined && channel__ != null) {
                channel__.close();
            }
        }
    }
}
