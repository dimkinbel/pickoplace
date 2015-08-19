var map;     
var allMarkers = [];
function initialize(lat_,lng_) {
    	 
        var center_ = new google.maps.LatLng(lat_, lng_);
        var mapOptions = {
          center: center_,
          zoom: 14,
          panControl: true,
          panControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.RIGHT_CENTER
          },
          scaleControl: true,
          streetViewControl: true,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
          }
        };

        map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
    	var marker_ID=0;

        var place_name = $("#server_placeName").val();
        var place_branch_name =  $("#server_placeBranchName").val();
        var place_address =  $("#server_Address").val();
        var place_phone = $("#server_place_phone").val();
        var place_mail = $("#server_place_mail").val();
        
        var overview_src = document.getElementById(document.getElementById("main_overview_url_id").value).src;
        var logo_src;
        if (document.getElementById("server_main_logo") != null) {
        	logo_src = document.getElementById("server_main_logo").src;
        } else if (document.getElementById("uploaded_logo_canvas_source_100") != null && document.getElementById("uploaded_logo_canvas_source_100").src != "") {
        	logo_src = document.getElementById("uploaded_logo_canvas_source_100").src;
        } else {
        	logo_src = "";
        }
        
        var markerInfo = '<table style="border:none">' +
        '<tr><td rowspan=3><img src="'+logo_src+'" width="70" height="70"></td><td>' + place_name + '</td></tr>' +
        '<tr><td>' + place_branch_name + '</td></tr>' +
        '<tr><td>' + place_address + '</td></tr>' +
        '<tr><td rowspan=3><img src="'+overview_src+'" width="70" height="70"></td><td>' + place_phone + '</td></tr>' +
        '<tr><td>' + place_mail + '</td></tr>' +
        '<tr><td> SOMETHING </td></tr>' +
        '</table>';

    	 var infowindow_ = new google.maps.InfoWindow({
    	                         content: markerInfo
    	                  });
    	   var mMarker = new google.maps.Marker({
    	    	position:center_,
    	    	title: place_name
    	    });
    	   mMarker.set("id", "marker_ID_" + marker_ID);
    	   mMarker.setMap(map);
    	   allMarkers.push(mMarker);
    	   map.setCenter(center_);
    	   mMarker.infowindow = infowindow_;
    	   google.maps.event.addListener(mMarker, 'click', function() {
    		    infowindow_.open(map,mMarker);
    		  });
      }
      google.maps.event.addDomListener(window, 'load', function() {
    		var lat = document.getElementById("server_Lat").value;
    		var lng = document.getElementById("server_Lng").value;  
    		initialize(lat,lng);
      });