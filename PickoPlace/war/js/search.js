/**
 * 
 */

function updateDistance(divid,meter) {
	$("#"+divid).html(meter+"m");
}

var cursor_ = "init";

$(document).ready(function () { 


	
	$("#range_distanse_slider").ionRangeSlider({
	    type:"single",
		force_edges:true,
		hide_from_to:true,
		hide_min_max:true,
		hide_from_to:true,
		min:100,
		max:10000,
		from:1000,
		min_interval: 10,
		onStart: function (data) {
			updateDistance('distanceval',data.from);
			searchObj.radius = data.from;
			
        },
        onChange: function (data) {
        	updateDistance('distanceval',data.from);
        	searchObj.radius = data.from;
        	
        },
		onFinish:  function (data) {
			if(searchCircle != undefined) {
        		searchCircle.setRadius(data.from);
        	}
			cursor_ = "init";
			$("#search-load-more").hide();
        },
        prettify: function (num) {
            if(num < 1000) {
            	var st = num+"m";
                return st;
            } else {
            	var st = num+"m";
                return st;
            }
        }
    });
	$( "#placeSearchName" ).change(function() {
		 console.log("Name Input changed");
		 cursor_ = "init";
		 $("#search-load-more").hide();
	 });
	$( "#placeAddressAuto" ).change(function() {
		 console.log("Address Input changed");
		 cursor_ = "init";
		 $("#search-load-more").hide();
	 });
	$("#search_button").click(function(){
		cursor_="init";
		$("#search-load-more").hide();
		SearchGeo(function(valid){
			if(valid==true) {
				var value_ = $("#placeSearchName").val();				
				if(searchByNameOnly==true && value_.length < 3) {
					alert("Place name too short. Sorry");
				} else {
					searchObj.name = value_;
					
				    var json_ = {name:searchObj.name,
				    		      lat:searchObj.lat,
				    		      lng:searchObj.lng,
				    		      rad:searchObj.radius, 
				    		      nameOnly:searchObj.byName,
				    		      cursor:cursor_};
				    console.log(json_);
				    $.ajax({
				      url : "/globalSearch",
				      data: json_,//
				      beforeSend: function () { 
				    	  $("#search_material").hide(); 
				    	  $("#frame_book_ajax_gif_welcome").show();
				    	  deleteMarkers();
				      },
				      success : function(data){	
				    	  $("#frame_book_ajax_gif_welcome").hide();
				    	  $("#search_material").show();
				   	   console.log(data);
						   	if(data.status=="OK") {
						   		$("#welcome-load-more").hide();
						   		$("#wiz-load-more").hide();
						   		
							   	if(searchObj.byName=="false") {
							   		center_ = new google.maps.LatLng(searchObj.lat,searchObj.lng);
							        map.setCenter(center_);
							        accurateAddress = false;
							        updateSearchCircle(center_);
							   	}
						        cursor_ = data.cursor;
						   		updateLastPlaces(data,true,true);
						   		if(data.cursor!="null") {
						   			$("#search-load-more").show();
						   		} else {
						   			$("#search-load-more").hide();
						   		}
			            	} else if (data.status=="zero") {
			            		$("#mainLastResults").empty();
			            		$("#mainLastResults").append('<div class="no_search_results">Sorry.No places found...</div>');
			            	}
				      },
				      dataType : "JSON",
				      type : "post"
				    });
				}
			}
		});


	});
	$("#search-load-more").click(function(){
		    var json_ = {name:searchObj.name,
		    		     lat:searchObj.lat,
		    		     lng:searchObj.lng,
		    		     rad:searchObj.radius, 
		    		     nameOnly:searchObj.byName,
		    		     cursor:cursor_};
		    console.log(json_);
		    $.ajax({
		      url : "/globalSearch",
		      data: json_,//
		      beforeSend: function () { 
		    	  $("#search_more-text").hide(); 
		    	  $("#search_loader").show();
		      },
		      success : function(data){	
		    	  $("#search_loader").hide();
		    	  $("#search_more-text").show();
		   	   console.log(data);
				   	if(data.status=="OK") {
				   		$("#welcome-load-more").hide();
				   		$("#wiz-load-more").hide();
				        cursor_ = data.cursor;
				   		updateLastPlaces(data,false,true);
				   		if(data.cursor!="null") {
				   			$("#search-load-more").show();
				   		} else {
				   			$("#search-load-more").hide();
				   		}
	         	} else if (data.status=="zero") {
	         		console.log("No more results");
	         	}
		      },
		      dataType : "JSON",
		      type : "post"
		    });


	});

	$("#advanced_button").click(function() {
		$("#additional_search_wrap").addClass("header_border_bottom");
		$("#additional_search_wrap").height(50);
	});
	$(".add_search_close").click(function() {
		$("#additional_search_inner").hide();
		$("#additional_search_wrap").height(0);
	});
	$("#additional_search_wrap").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
		if($("#header_td_div").height() > 50) {
			$("#additional_search_inner").show();
		} else {
			$("#additional_search_wrap").removeClass("header_border_bottom");
		}		
		updateMapWrapper();
	});
	
/*	$('input#placeSearchName').keyup(function() {
	    if (timer) {
	        clearTimeout(timer);
	    }
	    var myLength = $("input#placeSearchName").val().length;
	    if(myLength >= 3){
	    timer = setTimeout(function() {
	    	var name_ = $("#placeSearchName").val();
		    var json_ = {name:name_};
		    
		    $.ajax({
		      url : "/nameAutocomplete",
		      data: json_,//
		      beforeSend: function () { 
		    	  $("#autocompleteSearchAjax").show();
		    	 
		      },
		      success : function(data){	
		    	  $("#autocompleteSearchAjax").hide();
		   	      console.log(data);
		      },
		      dataType : "JSON",
		      type : "post"
		    });
	      }, 1500);
	    }
	});*/
	
	$( "input#placeSearchName" ).autocomplete({
	      source: function( request, response ) {
	    	  var name_ = request.term;
			  var json_ = {name:name_};
	        $.ajax({
	            dataType: "json",
	            type : 'post',
	            data: json_,
	            url: '/nameAutocomplete',
	            success: function(data) {
	            	
	             // $('input.suggest-user').removeClass('ui-autocomplete-loading');  // hide loading image

	            response(data.places);
	          },
	          error: function(data) {
	             // $('input.suggest-user').removeClass('ui-autocomplete-loading');  
	          }
	        });
	      },
	      delay: 500,
	      minLength: 3,
	      response:function() {
	    	  $("#autocompleteSearchAjax").hide();
	      },
	      open: function() {

	      },
	      search:function() {
	    	  $("#autocompleteSearchAjax").show();
	      },
	      close: function() {

	      },
	      focus:function(event,ui) {

	      },
	      select: function( event, ui ) {
	    	  $("#placeSearchName").val(ui.item.name + " "+ ui.item.branch);
	    	  $("#placeAddressAuto").val(ui.item.address);
	           return false;
	      }
	    }).data("ui-autocomplete")._renderItem = function (ul, item) {
		    var appendData = "";
		    appendData+='<div class="autocomdiv"><table class="autocomtbl" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse">';
		    appendData+='<tr class="aut_top"><td class="aut_top_td"><span class="itemname">' + item.name +'</span>,' + item.branch +'</td></tr>';
		    appendData+='<tr class="aut_addr"><td class="aut_addr_td">' + item.address +'</td></tr>';
		    appendData+='</table></div>';
	        return $("<li></li>")
	        .data("item.autocomplete", item)
	        .append(appendData)
	        .appendTo(ul);
	    };;
});
var searchByNameOnly = true;

function SearchGeo(callback) {
	var address = document.getElementById('placeAddressAuto').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
             console.log( results)
            if(results.length==1  ) {
            	// Use address
            	searchByNameOnly = false;
	       	    var lat = results[0].geometry.location.lat();
	       	    var lng = results[0].geometry.location.lng();
	              	document.getElementById("address_hidden_lat").setAttribute("value",lat);
	            	document.getElementById("address_hidden_lng").setAttribute("value",lng);   
	            	searchObj.lat = lat;
	            	searchObj.lng = lng;
	            	searchObj.byName = "false";
	            	callback(true);
            } else {
            	// Use name only (Search relative to current Position)
            	searchByNameOnly = true;
            	searchObj.lat =  searchCircle.getCenter().lat();
            	searchObj.lng = searchCircle.getCenter().lng();
            	searchObj.byName = "true";
            	callback(true);
            }
        } else {
        	searchByNameOnly = true;
        	searchObj.lat =  searchCircle.getCenter().lat();
        	searchObj.lng = searchCircle.getCenter().lng();
        	searchObj.byName = "true";
        	callback(true);
        }
      }); 
}