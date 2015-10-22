var map;     
var allMarkers = [];
var gmap;   
var geocoder;
var searchCircle = new google.maps.Circle();
var searchObj = {};
var autocomplete;
var timer = null;
var accurateAddress = true;
$(document).ready(function () { 
	// SET MAP DIMENTIONS
	updateMapWrapper();
	//
	MapInitialize();
	geocoder = new google.maps.Geocoder();
    var options = {
  		  types: ['geocode']
  		};
    var place_search = document.getElementById('placeAddressAuto');
    autocomplete = new google.maps.places.Autocomplete(place_search, options);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
    	if(map!=undefined) {
    		accurateAddress = false;
           updateMapRadius('placeAddressAuto');
    	}
    });
    google.maps.event.addListener(searchCircle, 'radius_changed', function() {
	    var rad = Math.floor(searchCircle.getRadius()) ;
	    
	    if(rad<=10000) {
	     var slider = $("#range_distanse_slider").data("ionRangeSlider");
		 var fromInd = rad;
		 slider.update({
		     from : fromInd
		  });
		 updateDistance('distanceval',rad);
         searchObj.radius = rad;
	    }
 });
  google.maps.event.addListener(searchCircle, 'center_changed', function() {
	  if(accurateAddress) {
	    var clat =  searchCircle.getCenter().lat();
	    var clng =  searchCircle.getCenter().lng();
	    var latlng = {lat: parseFloat(clat), lng: parseFloat(clng)};
	    geocoder.geocode({'location': latlng}, function(results, status) {
	        if (status === google.maps.GeocoderStatus.OK) {
	          if (results[0]) {
	            console.log(results);
	            $("#placeAddressAuto").val(results[0].formatted_address);
	          } else {
	        	  console.log('No results found');
	          }
	        } else {
	          console.log('Geocoder failed due to: ' + status);
	        }
	    });
	  } else {
		  accurateAddress = true;
	  }
	  // Update Cursor
	  cursor_ = "init";
	  $("#search-load-more").hide();
   });
 //   google.maps.event.addListener(map, 'zoom_changed', function() {
 //
   // 	var lat = map.getCenter().lat();
   //	    var lng = map.getCenter().lng();
   //	    var pos = new google.maps.LatLng(lat,lng);
  //  	map.setCenter(pos);
  //  	updateCenterOffset();
  //  });
    
	$(window).resize(function () {
	    waitForFinalEvent(function(){
	    	updateMapWrapper() ;
	    	google.maps.event.trigger(map, 'resize');
	      //...
	    }, 500, "some unique string");
	   });
});

function updateMapWrapper(){
	  var browserHeight = window.innerHeight;
	  var browserWidth = window.innerWidth;
	  var map_width = browserWidth - 100 - 50 - 30 - document.getElementById("mainLastResults").offsetWidth;
	  if(map_width < 200 || map_width < 0.2 * browserWidth) {
		  $("#map_absolute").hide();
		  $("#mainLastResults").css("margin","auto");
		  $("#mainLastResults_wrap").css("margin","auto");
	  } else {
		  $("#mainLastResults").css("margin","");
		  $("#mainLastResults_wrap").css("margin","");
		  $("#map_absolute").css("top",15 + document.getElementById("header_td_div").offsetHeight + "px");
		  $("#main_map_wrap_").css("width",map_width +"px");
		  $("#main_map_wrap_").css("height",browserHeight-document.getElementById("header_td_div").offsetHeight -30 - 24 +"px");
		  $("#map_absolute").css("width",map_width +"px");
		  $("#map_absolute").css("height",browserHeight-document.getElementById("header_td_div").offsetHeight -30 - 24 +"px");
		  $("#map_absolute").show();
	  }
}

function updateCenterOffset() {
	 var browserWidth = window.innerWidth;
	 if(browserWidth > 800) {
		 var leftDiv = 700;
		 var rightWidth = browserWidth - leftDiv;
		 var offset = leftDiv + rightWidth/2;
		 var currentCenter = browserWidth / 2;
		 var relativeOffset = currentCenter - offset;
		 map.panBy(relativeOffset,0);
	 }	 
}
function updateSearchCircle(center_) {
    var populationOptions = {
  	      strokeColor: 'green',
  	      strokeOpacity: 0.8,
  	      strokeWeight: 1,
  	      fillColor: 'white',
  	      fillOpacity: 0.05,
  	      editable:true,
  	      dragable:false,
  	      map: map,
  	      center: center_,
  	      radius: searchObj.radius
      };
  	    // Add the circle for this city to the map.

  searchCircle.setOptions(populationOptions);
  

}

function updateMapRadius(id) {
	
	 var address = document.getElementById(id).value;
     geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        	console.log("updateMapRadius()");
        	console.log(results);
        	console.log("------------------");
       	    var lat = results[0].geometry.location.lat();
       	    var lng = results[0].geometry.location.lng();
       	    var pos = new google.maps.LatLng(lat,lng);
        	map.setCenter(pos);
        	map.setZoom(14);
        	updateSearchCircle(pos);
        	//updateCenterOffset();
        } else {
          alert("Address not valid") ;  	      
        }
      }); 
}

function MapInitialize() {
	geocoder = new google.maps.Geocoder();
	var center_ = new google.maps.LatLng(32,32);	
    var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
    var mapOptions = {
      mapTypeControlOptions: {
    		      mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'map_style']
    		    },
      scrollwheel:true,
      zoom: 14,
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    };
    
	  if(navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function(position) {
			    center_ = new google.maps.LatLng(position.coords.latitude,
			                                       position.coords.longitude);
		        map = new google.maps.Map(document.getElementById("main_map"),mapOptions);
		        //Associate the styled map with the MapTypeId and set it to display.
		        map.mapTypes.set('map_style', styledMap);
		        map.setMapTypeId('map_style');
		        map.setCenter(center_);
		        updateSearchCircle(center_);
		        //updateCenterOffset();
		    }, function() {
		    	var address = "New York";
		    	geocoder.geocode( { 'address': address}, function(results, status) {
		    	    if (status == google.maps.GeocoderStatus.OK) {
		    	    	center_ = results[0].geometry.location;
				        map = new google.maps.Map(document.getElementById("main_map"),mapOptions);
				        //Associate the styled map with the MapTypeId and set it to display.
				        map.mapTypes.set('map_style', styledMap);
				        map.setMapTypeId('map_style');
				        map.setCenter(center_);
				        updateSearchCircle(center_);
				        //updateCenterOffset();
		    	    } else {
		    	    	console.log('Geocode was not successful for the following reason: ' + status);
				        map = new google.maps.Map(document.getElementById("main_map"),mapOptions);
				        //Associate the styled map with the MapTypeId and set it to display.
				        map.mapTypes.set('map_style', styledMap);
				        map.setMapTypeId('map_style');
				        updateSearchCircle(center_);
				        map.setCenter(center_);
				        //updateCenterOffset();
		    	    }
		    	  });
		    });
		  } else {
		    // Browser doesn't support Geolocation
			    var address = "New York";
		    	geocoder.geocode( { 'address': address}, function(results, status) {
		    	    if (status == google.maps.GeocoderStatus.OK) {
		    	    	center_ = results[0].geometry.location;
				        map = new google.maps.Map(document.getElementById("main_map"),mapOptions);
				        //Associate the styled map with the MapTypeId and set it to display.
				        map.mapTypes.set('map_style', styledMap);
				        map.setMapTypeId('map_style');
				        map.setCenter(center_);
				        updateSearchCircle(center_);
				       // updateCenterOffset();
		    	    } else {
		    	       console.log('Geocode was not successful for the following reason: ' + status);
				        map = new google.maps.Map(document.getElementById("main_map"),mapOptions);
				        //Associate the styled map with the MapTypeId and set it to display.
				        map.mapTypes.set('map_style', styledMap);
				        map.setMapTypeId('map_style');
				        map.setCenter(center_);
				        updateSearchCircle(center_);
				       // updateCenterOffset();
		    	    }
		    	  });
		  }
	  
}

function addMapMarkers(data) {
	 var hostName = window.location.host; 
	for (var i=0; i < data.places.length; i++) {
		var placeInfo =  data.places[i];
		var userPlace = placeInfo.userPlace;
		var placeLogo = "";
		if(placeInfo.placeLogo=="") {
			placeLogo =  "/img/pp.png";
		} else {
			placeLogo = placeInfo.placeLogo;
		}
		var pos = new google.maps.LatLng(userPlace.Lat,userPlace.Lng);
        var markerInfo = '<table  cellspacing="0" cellpadding="0" style="border-collapse: collapse" class="marker-table">' +
        '<tr><td >'+
        '   <div class="marker_logo_"><img src="'+placeLogo+'" class="marker_logo_img"></div>'+
        '   <div class="m_ovrv"><img src="'+userPlace.overviewCloudURL+'" class="m_ovrv_img"/></div>'+
        '</td>' +
        ' <td style="vertical-align: top"><div title="book" onclick="goToBooking(\''+ userPlace.PlaceID +'\')" class="m_info m_p_name">' + userPlace.place + ','+userPlace.branch+'</div>' +
        '     <div class="m_info address">' + userPlace.Address + '</div>' +
        '     <div class="m_info m_regular">' + userPlace.floors + ' floors,'+userPlace.shapesCount+' places</div>' +
        '     <div class="m_info m_regular">' + placeInfo.placePhone + '</div>' +
        '     <div class="m_info m_regular">' + placeInfo.placeMail + '</div>' +
        '     <div class="m_info m_site">' + placeInfo.placeSiteURL + '</div>' +
        '</td></tr>' +
        '</table>';

    	   var infowindow_ = new google.maps.InfoWindow({
    	                         content: markerInfo
    	                  });
    	   var title = userPlace.place + ',' + userPlace.branch;
    	 
    	   var markerImage = new google.maps.MarkerImage('http://'+hostName+'/img/pplogomarker_shaddow.png',
                   null,
                   new google.maps.Point(0, 0),
                   new google.maps.Point(0, 30),
                   new google.maps.Size(30, 30));
    	   var mMarker = new google.maps.Marker({
    	    	position:pos,
    	    	title: title,
    	    	map:map,
    	    	icon:markerImage,
    	    	infowindow:infowindow_
    	    });
    	   mMarker.set("id", "marker_ID_" + userPlace.PlaceID);
    	   allMarkers.push(mMarker);
    	   google.maps.event.addListener(mMarker, 'click', function() {
    		   this.infowindow.open(map,this);
    	});
	}
}
function goToBooking(PID) {
	location.href = "/placebooking?placeID="+PID;
}

//Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < allMarkers.length; i++) {
	  allMarkers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  allMarkers = [];
}


var waitForFinalEvent = (function () {
	  var timers = {};
	  return function (callback, ms, uniqueId) {
	    if (!uniqueId) {
	      uniqueId = "Don't call this twice without a uniqueId";
	    }
	    if (timers[uniqueId]) {
	      clearTimeout (timers[uniqueId]);
	    }
	    timers[uniqueId] = setTimeout(callback, ms);
	  };
	})();
var styles =[
             {
                 "featureType": "landscape.man_made",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "color": "#f7f1df"
                     }
                 ]
             },
             {
                 "featureType": "landscape.natural",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "color": "#d0e3b4"
                     }
                 ]
             },
             {
                 "featureType": "landscape.natural.terrain",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "visibility": "off"
                     }
                 ]
             },
             {
                 "featureType": "poi",
                 "elementType": "labels",
                 "stylers": [
                     {
                         "visibility": "off"
                     }
                 ]
             },
             {
                 "featureType": "poi.business",
                 "elementType": "all",
                 "stylers": [
                     {
                         "visibility": "off"
                     }
                 ]
             },
             {
                 "featureType": "poi.medical",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "color": "#fbd3da"
                     }
                 ]
             },
             {
                 "featureType": "poi.park",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "color": "#bde6ab"
                     }
                 ]
             },
             {
                 "featureType": "road",
                 "elementType": "geometry.stroke",
                 "stylers": [
                     {
                         "visibility": "off"
                     }
                 ]
             },
             {
                 "featureType": "road",
                 "elementType": "labels",
                 "stylers": [
                     {
                         "visibility": "off"
                     }
                 ]
             },
             {
                 "featureType": "road.highway",
                 "elementType": "geometry.fill",
                 "stylers": [
                     {
                         "color": "#ffe15f"
                     }
                 ]
             },
             {
                 "featureType": "road.highway",
                 "elementType": "geometry.stroke",
                 "stylers": [
                     {
                         "color": "#efd151"
                     }
                 ]
             },
             {
                 "featureType": "road.arterial",
                 "elementType": "geometry.fill",
                 "stylers": [
                     {
                         "color": "#ffffff"
                     }
                 ]
             },
             {
                 "featureType": "road.arterial",
                 "elementType": "geometry.stroke",
                 "stylers": [
                     {
                         "color": "#9ad6b0"
                     },
                     {
                         "visibility": "on"
                     },
                     {
                         "weight": "0.36"
                     }
                 ]
             },
             {
                 "featureType": "road.local",
                 "elementType": "geometry.fill",
                 "stylers": [
                     {
                         "color": "black"
                     }
                 ]
             },
             {
                 "featureType": "transit.station.airport",
                 "elementType": "geometry.fill",
                 "stylers": [
                     {
                         "color": "#cfb2db"
                     }
                 ]
             },
             {
                 "featureType": "water",
                 "elementType": "geometry",
                 "stylers": [
                     {
                         "color": "#a2daf2"
                     }
                 ]
             }
         ];