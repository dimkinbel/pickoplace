<link rel="stylesheet" href="js/jquery-ui-1.11.2.custom/jquery-ui.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/browserWrap.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.css" type="text/css" media="screen" />
<link rel="stylesheet" href="ion.rangeSlider-2.0.2/css/ion.rangeSlider.skinNice.css" type="text/css" media="screen" />

<link rel="stylesheet" href="js/jquery-ui-1.11.4.Autocomplete/jquery-ui.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/perfect-scrollbar.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/dropit.css" type="text/css" media="screen" />


<script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
<script type="text/javascript" src="js/jquery-ui-1.11.2.custom/jquery-ui.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.11.4.Autocomplete/jquery-ui.js"></script>

<script type="text/javascript"
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaX5Ow6oo_axUKMquFxnPpT6Kd-L7D40k&libraries=places&&sensor=FALSE">
</script>
<script type="text/javascript" src="ion.rangeSlider-2.0.2/js/ion.rangeSlider.js"></script>
<script type="text/javascript" src="js/loginlogout.js" ></script>
<script type="text/javascript" src="js/bootstrap-slider.js" ></script>
<script type="text/javascript" src="js/sitefunctions.js" ></script>
<script type="text/javascript" src="js/dropit.js" ></script>
<script type="text/javascript" src="js/interactive.js" ></script>

<script type="text/javascript" src="js/mainPageMap.js"></script>
<script type="text/javascript" src="js/search.js" ></script>
<script type="text/javascript" src="js/upDownSpinner.js" ></script>
<script type="text/javascript" src="js/searchWizard.js" ></script>


<link href="raty/raty.css" media="screen" rel="stylesheet" type="text/css">
<script src="raty/raty.js" type="text/javascript"></script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script type="text/javascript">
    var geocoder;

    var uploadLastcursor = "";
    var from_={};
    var personsSlider = {};
    var phonerequired = true;
    $(document).ready(function () {
        var dd = new Date()
        var hour = dd.getHours();
        var min = dd.getMinutes();
        if(min >= 30) {
            hour+=1;
            min = 0;
            if(hour==24) {
                hour = 0;
            }
        } else {
            min = 30;
        }
        from_ = new myTimeSpinner('from_h_inp','dp_fh_up','dp_fh_down','from_m_inp','dp_fm_up','dp_fm_down',hour,min,15,false);
        var personsList = [1,2,3,4,5,6,7,8,9,10,15,20];
        var personsSList = [1,2,3,4,5,6,7,8,9,10,15,20];
        personsSlider = new upDownSpinner('w_per_inp','wper_up','wper_don',personsList,personsSList,2,true);
    });
    $(document).ready(function() {
        requestLastPlaces(6);
    });

    $(document).ready(function () {

        $('#advanced_material_drop').dropit({action: 'click'});
    });
    $(document).on("click",".stopclick", function (event) {
        if(event.target.id == "page_login_prompt") {
            if(gconnected==false && fconnected==false && phoneflow==true) {
                if(auth2.isSignedIn.wc) {
                    // Connected with Google
                    googleSignOut();
                } else if(FB.getUserID() != "") {
                    // Connected with FB
                    facebookSignOut();
                }
            }
            phoneflow=false;
            $("#sign_in_table_").show();
            //result.userData.first_name for FB
            $("#user_name_at_phone").html("");
            $("#send_sms_ajax").hide();
            $("#send_sms_complete").hide();
            $("#send_sms").show();
            $("#verification_code").val("");
            $("#verification_code").prop("readonly",true);
            $("#verification_submit_inactive").show();
            $("#verification_submit").hide();
            $("#smsa_loader").hide();
            $("#phone_wrap_table").hide();
            $("#page_login_prompt").hide();
        }
    });
    ///
</script>