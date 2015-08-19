/**
 * 
 */
var onmenu = true;
var onhidden = false;
$(document).ready(function () { 
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
    $("#dotoadminzone").click(function(){
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
function updatePlaceInfo() {
		$('#donerating').raty({ score: parseFloat($("#ratingVal").val()) ,path:'raty/images',readOnly: true,space: false});	  
}