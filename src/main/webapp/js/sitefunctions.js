/**
 * 
 */
var onmenu = true;
var onhidden = false;
$(document).ready(function () {
    $("#login_prop_d").click(function(){
        $("#page_login_prompt").show();
    });

    $(".close_messages").click(function(){
    	var all=document.getElementsByName("info_messages");
        for(var x=0; x < all.length; x++) {
          document.getElementById(all[x].id).style.display = "none";
        }
        document.getElementById("messages_wrapper").style.display = "none";
    });
    $("#gotobookings").click(function(){
    	location.href = "/my_bookings.jsp";
    });
    $("#gotoadminzone").click(function(){
    	location.href = "/user_waiter_list.jsp";
    });
 // GOOGLE

// FACEBOOK

	$("#logo_").click(
			function(){
				location.href = "/";
				}	
	);
	
 $('#account_dropit').dropit({action: 'click'});
 $(".topAccOptList").hover(
    function(){
	  $( this ).addClass('marhov10');
	  $( this ).removeClass('marhov0');
	},
	function(){
	  $( this ).addClass('marhov0');
	  $( this ).removeClass('marhov10');
	}
 );
 $("#header_place_name_").html($("#server_placeName").val() + "," + $("#server_placeBranchName").val());
 $("#header_place_address_").html("("+$("#server_Address").val()+")");
});
$(document).on("click",".stopclick", function (event) {
    if(event.target.id == "page_login_prompt") {
        $("#page_login_prompt").hide();
    }
});
function displayMessage(color,message) {
	var id = color + "_messages";
	var all=document.getElementsByName("info_messages");
    for(var x=0; x < all.length; x++) {
      document.getElementById(all[x].id).style.display = "none";
      var tmpid = all[x].id + "-t";
      $('#'+tmpid).html("");
    }
    var idt = id + "-t";
    $("#"+idt).html(message);
    document.getElementById(id).style.display = "";        
    document.getElementById("messages_wrapper").style.display = "";  	
};
function accountMenuNav(target) {
    if(target=="go_to_account") {
        goToAccountMenu();
    } else if(target=="go_to_draw") {
        goToDraw();
    } else if(target=="admin_zone") {
        $("#gotoadminzone").click();
    } else if(target=="create_place") {
        goToCreatePlace()
    } else if(target=="my_bookings") {
        $("#gotobookings").click();
    }
}
function updatePlaceInfo() {
		$('#donerating').raty({ score: parseFloat($("#ratingVal").val()) ,path:'raty/images',readOnly: true,space: false});	  
}
function goToCreatePlace() {
	location.href = "/create_new_place.jsp";
}
function goToAccountMenu() {
    //create_new_place , my_bookings , place_config
    setSessionData(function(result) {
        if(result) {
            document.getElementById("master_account").submit();
        } else {
            if(pagetype!= undefined &&
                         (pagetype =='place_booking' ||
                          pagetype =='waiter_admin' ||
                          pagetype == 'iframeeditor' ||
                          pagetype == 'welcome')) {
                updatePageView();
            }
            location.href = "/";
        }
    });

}
function goToDraw(){
    location.href = "/drawing.jsp";
}