  var sid2img = {};
  var img2url = {};

  function updateWList (data) { 
	  var places = data;
	  
	 for (var p=0;p < places.length ; p++) {
		  var place = places[p];
		  var appendData = "";
		  var placeNameCoded1 = place.userPlace.place+','+place.userPlace.branch;
		  var  placeNameCoded = encodeURIComponent(placeNameCoded1);
		  appendData += '<a href="/waiter-login-request?pid='+place.userPlace.PlaceID+'&placeName='+placeNameCoded+'&placeAddress='+encodeURIComponent(place.userPlace.Address)+'&offset='+place.placeOffcet+'"><div class="single_waiter_div" id="sw_single-'+place.userPlace.PlaceID+'"  >';
		  appendData += '<input style="display:none" name="pl_offcet" id="pl_offcet_'+place.userPlace.PlaceID+'" value="'+place.placeOffcet+'" />';
		  appendData += '<table class="single_waiter_tbl cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">';
	      appendData += '<tr><td class="sw_img_td">';
	      appendData += '    <div class="sw_img_div" >';
	      appendData += '		   <img src="'+place.userPlace.overviewCloudURL+'" />';
	      appendData += '		 </div>';
	      appendData += '	  </td>';
	      appendData += '	  <td  class="sw_data_td">';
	      appendData += '	    <div class="sw_place_name" >'+place.userPlace.place+','+place.userPlace.branch+'</div>';
	      appendData += '		<div class="sw_place_address" >'+place.userPlace.Address+'</div>';
	      appendData += '		<div class="sw_place_time" name="wl_place_time" id="wl_place_time-'+place.userPlace.PlaceID+'"></div>	';					  
	      appendData += '	  </td>';
	      appendData += '	  </tr>';
	      appendData += '	</table>';
	      appendData += '</div></a>';
	      
	      $("#waiter_wrap_list").append(appendData);
	 };

  }

  
  function calcTime(offset) {
	    d = new Date();
	    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	    nd = new Date(utc + (3600000 * offset));
	    return  moment(nd).format("DD/MM/YY HH:mm:ss");

	}
  

$(document).ready(function() {
	
	  setInterval(function(){
		    var allof =document.getElementsByName("pl_offcet");
			for(var x=0; x < allof.length; x++) {
			   var plof = document.getElementById(allof[x].id).value;
			   var pid = allof[x].id.replace(/^pl_offcet_/, "");
		       document.getElementById('wl_place_time-'+pid).innerHTML = calcTime(plof);
			};
		}, 1000);

$("#datepicker").datepicker({
    currentText: "Now",
	defaultDate: +0,
	autoClose:true,
	dateFormat: "dd/mm/yy",
});
$( "#datepicker" ).datepicker("setDate", "+0");
});


