$(document).ready(function () { 
	$("#welcome-load-more").click(function(){
		requestLastPlaces(3);
    });

	$(document).on("mouseover", ".welcome_shadow", function(e) {
		var id_ = $(this).attr("id");
		var pid = id_.replace(/welcome-/,"");
		$("#hover_down-"+pid).css("margin-top","25px");
		$("#info_name-"+pid).css("color","rgb(0, 178, 45)");
	});

	$(document).on("mouseleave", ".welcome_shadow", function(e) {
		var id_ = $(this).attr("id");
		var pid = id_.replace(/welcome-/,"");
		$("#hover_down-"+pid).css("margin-top","0px");
		$("#info_name-"+pid).css("color","initial");
	});
	$(document).on("click", ".place_address", function(e) {
		var id_ = $(this).attr("id");
		var pid = id_.replace(/show_on_map-/,"");
		center_ = new google.maps.LatLng(parseFloat($("#lat-"+pid).val()),parseFloat($("#lng-"+pid).val()));
        map.setCenter(center_);
        updateSearchCircle(center_);
	});
	

});
function requestLastPlaces(num){
	  $.ajax({
	      url : "/welcomeUpdate",
	      data: {cursor:uploadLastcursor,num:num},
	      beforeSend: function () { 
	    	  $("#load_more-text").hide(); 
	    	  $("#welcome_loader").show();
	      },
	      success : function(data){
	    	  $("#welcome_loader").hide(); 
	    	  $("#load_more-text").show();

	    	  uploadLastcursor = data.cursor;
	    	  
	    	  updateLastPlaces(data);
	    	  addMapMarkers(data);
	    	  if(data.places.length < num) {
	    		  uploadLastcursor = "";
	    		  $("#welcome-load-more").hide();
	    	  }
	      },
	      dataType : "JSON",
	      type : "post"
	  });
}
function updateLastPlaces(data,cleanBefore,updateMap) {
	if(cleanBefore!=undefined && cleanBefore == true) {
		$("#mainLastResults").empty();
	}
	console.log(data);
	for (var i=0; i < data.places.length; i++) {
		var placeInfo =  data.places[i];
		var userPlace = placeInfo.userPlace;
		var pid = userPlace.PlaceID;
		//mainLastResults
		var appendData = '';
				
		appendData+='<div class="welcome_shadow" id="welcome-'+pid+'">';			   
        appendData+='  <div class="mainResultSingle"  id="mrs-'+pid+'"">';  
        appendData+='  <div class="hover_hidden">';
        appendData+='    <div class="material-icons welcaddress">location_on</div>';
        appendData+='    <div class="place_address left" title="Show on map" id="show_on_map-'+pid+'">'+userPlace.Address+'</div>';
        appendData+='	 <input id="lat-'+pid+'" type="text" value="'+userPlace.Lat+'" style="display:none"/>';
        appendData+='	 <input id="lng-'+pid+'" type="text" value="'+userPlace.Lng+'" style="display:none"/>';
       	appendData+='  </div>';
        appendData+='  <div class="hover_down" title="Go to place booking page" id="hover_down-'+pid+'"  onclick="location.href=\'/placebooking?placeID='+pid+'\'";> ';
        appendData+='	<div class="mrsimg-td">';
        appendData+='	  <a > ';     
        appendData+='	     <div class="mrsimg-div"><img class="overviewAccImage" src="' + userPlace.overviewCloudURL + '"/></div>';
        appendData+='	  </a>';  
        appendData+='	</div>';  
        appendData+='   <div class="mrdtbl">';   
        appendData+='     <div class="info_name_" id="info_name-'+pid+'">'+userPlace.place+',&nbsp'+userPlace.branch+'</div>';   
	    appendData+='   </div>';
   	    appendData+='  </div>';
	    appendData+='  </div>';
	    appendData+='  <div class="rating_bookable">';
	    appendData+='    <div class="bookable_num left" >';
	    appendData+='	   <div class="material-icons material_places_welcome">event_seat</div><div class="bookable_val_">'+userPlace.shapesCount+'</div>';
	    appendData+='	 </div>';
	    appendData+='    <div class="floors_num left" >';
	    appendData+='	   <div class="material-icons material_places_welcome">location_city</div><div class="bookable_val_">'+userPlace.floors+'</div>';
	    appendData+='	 </div>';
	    appendData+='	 <div class="welcome_rating" id="welcome_rating-'+pid+'">';				    
	    appendData+='	 </div>';
	    if(placeInfo.ratingSummary!=undefined) {
	       appendData+='	 <input id="raty-'+pid+'" type="text" value="'+placeInfo.ratingSummary.average+'" style="display:none"/>';
	    }
	    appendData+='   </div>';			  
	    appendData+=' </div>';

		$("#mainLastResults").append(appendData);
		// Update Rating
		 var ratval;
		if(placeInfo.ratingSummary!=undefined) {
	        ratval = parseFloat(placeInfo.ratingSummary.average);
		} else {
			ratval = 0;
		}
	   	$('#welcome_rating-'+pid).raty({
		  score      : ratval,
		  path       : 'raty/images',
		  starHalf   : 'circle_small-half.png',
		  starOff    : 'circle_small-off.png',
		  starOn     : 'circle_small-on.png',
		  readOnly   : true,
		  space: false
		});
	   	
	} 
	if(updateMap==true) {
		addMapMarkers(data);
	}
}