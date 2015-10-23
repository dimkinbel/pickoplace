  var sid2img = {};
  var img2url = {};
  function waiterAdmin(this_) {
	  setSessionData(function(result) {
		   if(result) {
			    var spid =  this_.id;
			    var pid = spid.replace(/^sw_single-/, "");
			    document.getElementById("sw_form_placeIDvalue").value = pid;
			    var placeOffset = document.getElementById("pl_offcet_"+pid).value;
			    
			    var d = new Date();
			    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
			    var nd = new Date(utc + (3600000 * parseInt(placeOffset)));
			    var addDayOffset = 0;
			    if (d.getDate() != nd.getDate()) {
			    	if(d.getTime() > nd.getTime()) {
			    		// Client timezone is one day higher
			    		addDayOffset = -1 * 3600 * 24;
			    	} else {
			    		addDayOffset = +1 * 3600 * 24;
			    	}
			    }
			    
				var TimeOfTheDatePicker_1970 = +$("#datepicker").datepicker( "getDate" ).getTime()/1000 + addDayOffset; // The time is relative to client browser
				var dayOfweek = +$("#datepicker").datepicker( "getDate" ).getDay();
				var d = new Date();
				var clientOffset = -1*d.getTimezoneOffset()/60;
				
				var placeID = pid;
				var requestJSON = {};		
				requestJSON.date1970 = TimeOfTheDatePicker_1970  ;// - d.getTimezoneOffset()*60 ;
				requestJSON.weekday = dayOfweek;
				requestJSON.period = 2*24*60*60;
				requestJSON.clientOffset = clientOffset;
				requestJSON.placeOffset = placeOffset;
				requestJSON.pid = placeID;
				
				console.log(requestJSON);
				document.getElementById("sw_form_bookrequest").value = JSON.stringify(requestJSON);	
				document.getElementById("waiter_submit_form").submit();
		   } else {
			   updatePageView();
		   }
	  });
	  }
  function updateWList (data) { 
	  var places = data;
	  
	 for (var p=0;p < places.length ; p++) {
		  var place = places[p];
		  var appendData = ""; 
		  appendData += '<div class="single_waiter_div" id="sw_single-'+place.userPlace.PlaceID+'" onclick="waiterAdmin(this)">';
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
	      appendData += '</div>';
	      
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


