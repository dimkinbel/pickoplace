var DatepickerSetDate = "+0";
var wiz_autocomplete;
var searchObjWiz = {};
$(document).ready(function () {
	
      var options = {
    		  types: ['geocode']
    		};
      var place_search = document.getElementById('wiz_address_input');
      wiz_autocomplete = new google.maps.places.Autocomplete(place_search, options);
      google.maps.event.addListener(wiz_autocomplete, 'place_changed', function() {
      	if(map!=undefined) {
      		 accurateAddress = false;
             updateMapRadius('wiz_address_input');
      	}
      });
  	$( "input#wiz_name_input" ).autocomplete({
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
	    	  $("#autocompleteWizAjax").hide();
	      },
	      open: function() {

	      },
	      search:function() {
	    	  $("#autocompleteWizAjax").show();
	      },
	      close: function() {

	      },
	      focus:function(event,ui) {

	      },
	      select: function( event, ui ) {
	    	  $("#wiz_name_input").val(ui.item.name + " "+ ui.item.branch);
	    	 // $("#placeAddressAuto").val(ui.item.address);
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
$("#wiz_date_picker_input").datepicker({
    currentText: "Now",
	defaultDate: DatepickerSetDate,
	autoClose:true,
	minDate :-1,
	dateFormat: "dd M",
    onSelect: function(dateText, inst) {
    	 updateCalendar();
    	},
    onClose: function(dateText, inst) {
    	}
});
$( "#wiz_date_picker_input" ).datepicker("setDate", DatepickerSetDate);
var weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY","SATURDAY"];
var dayOfweek = +$("#wiz_date_picker_input").datepicker( "getDate" ).getDay();
$("#wiz_week_day").html(weekDays[dayOfweek]); 


   $( "#wiz_search_btn" ).hover(     
	  function() {
	      $(".search_wiz_ ").css("color","rgb(0, 159, 60)");
		  $(".schedule_wiz_ ").css("color","rgb(0, 124, 255)");
	  }, function() {
	      $(".search_wiz_ ").css("color","#B1B1B1");
		  $(".schedule_wiz_ ").css("color","black");
	  }
	);
	$( "#wiz_address_input" ).focusin(function() {
        $( ".mat_room" ).css( "color", "#4387F7");
        $("#wiz_address_input").removeClass("red_input_border");
    });
	$( "#wiz_address_input" ).focusout(function() {
        $( ".mat_room" ).css( "color", "#BBBBBB");
    });
	$( "#datepicker_from_wrap").hover(     
	  function() {
	      $(".wiz_arr_d ").css("color","#E2E2E2  ");
	  }, function() {
	      $(".wiz_arr_d ").css("color","transparent ");
	  }
	);
	$( "#dp_pers_wrap").hover(     
	  function() {
	      $(".wiz_arr_p ").css("color","#E2E2E2 ");
	  }, function() {
	      $(".wiz_arr_p ").css("color","transparent");
	  }
	);
	$( "#searchWizardBtn").click(  function() {
		findFreePlaces();			  
	});
	$( "#wiz-load-more").click(  function() {
		WizLoadMore();
	});
});

function updateCalendar() {
   var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   var weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY","SATURDAY"];
   var Month = +$("#wiz_date_picker_input").datepicker( "getDate" ).getMonth();
   var dayOfweek = +$("#wiz_date_picker_input").datepicker( "getDate" ).getDay();
   $("#wiz_week_day").html(weekDays[dayOfweek]);   
}
var cursor_wiz = "";
searchObjWiz.placeType = "";
searchObjWiz.placeSubType = "";
searchObjWiz.rating = 0;
searchObjWiz.radius = 1000;
searchObjWiz.period = 2 * 60 * 60;

var loadMoreObject = {};
function WizLoadMore() {
	if(loadMoreObject.cursor != undefined && loadMoreObject.cursor != "") {
	    $.ajax({
		      url : "/wizSearch",
		      data: loadMoreObject,//
		      beforeSend: function () { 
		    	 $("#wiz_more-text").hide();
		    	 $("#wiz_loader").show(); 
		      },
		      success : function(data){	 
		    	  $("#wiz_loader").hide();
			      $("#wiz_more-text").show(); 
			      
		   	      console.log(data);
		   	      loadMoreObject.cursor= data.freePlaces.cursor;
				   	if(data.status=="OK") {
				   		WizUpdateLastPlaces(data.freePlaces,false,false);
				   		
				   		if(data.freePlaces.cursor=="last") {
				   			$("#wiz-load-more").hide();
				   			cursor_wiz = "";
				   			loadMoreObject = {};
				   		} else {
				   			$("#wiz-load-more").show();
				   			cursor_wiz = data.freePlaces.cursor;
				   			
				   		}
	            	} else if (data.status=="NO_EMPTY_FOUND") {
	            		if(data.freePlaces.cursor=="last") {
	            			$("#wiz-load-more").hide();
				   			cursor_wiz = "";
				   			loadMoreObject = {};
	            		} else {
		            		var HeaderAppend = '<div class="wiz_results_header" ><div class="material-icons wiz_failure" ">access_alarms</div>No seats available</div>';
		            		$("#mainLastResults").html(HeaderAppend);
	            		}
	            	} else if (data.status=="NO_SEARCH_FOUND") {
	            		if(data.freePlaces.cursor=="last") {
	            			$("#wiz-load-more").hide();
				   			cursor_wiz = "";
				   			loadMoreObject = {};
	            		} else {
		            		var HeaderAppend = '<div class="wiz_results_header" ><div class="material-icons wiz_failure" ">gps_off</div>No places found</div>';
		            		$("#mainLastResults").html(HeaderAppend);
	            		}
	            	}
		      },
		      dataType : "JSON",
		      type : "post"
		    });		
	} else {
		    $("#wiz-load-more").hide();
			cursor_wiz = "";
			loadMoreObject = {};
	}
}
function findFreePlaces() {
	SearchGeoWizard(function(valid){
		if(valid==true) {
			var value_ = $("#wiz_name_input").val();				
			if( value_.length < 3) {
				searchObjWiz.name="";
			} else {
				searchObjWiz.name = value_; 			
			}
			cursor_wiz = "";
			
				var d = new Date();
				var clientOffsetMin = d.getTimezoneOffset();
				var clientOffsetSec = -1 * 60 * clientOffsetMin;
				var dateClientSeconds = +$("#wiz_date_picker_input").datepicker( "getDate" ).getTime()/1000;
				var dayOfweek = +$("#wiz_date_picker_input").datepicker( "getDate" ).getDay();
				var dateUTCSeconds = dateClientSeconds + clientOffsetSec;
				var timeSeconds = from_.getTime();
				var persons = personsSlider.getVal();
				
				searchObjWiz.radius = parseInt(searchCircle.getRadius());
				
			    var json_ = { name:searchObjWiz.name,
			    		      lat:searchObjWiz.lat,
			    		      lng:searchObjWiz.lng,
			    		      rad:searchObjWiz.radius, 
			    		      dateUTCseconds:dateUTCSeconds,
			    		      timeSeconds:timeSeconds,
			    		      period:searchObjWiz.period,
			    		      persons:persons,
			    		      type:searchObjWiz.placeType,
			    		      subType:searchObjWiz.placeSubType,
			    		      rating:searchObjWiz.rating,
			    		      weekDay:dayOfweek,
			    		      amount:3,
			    		      cursor:cursor_wiz};
			    loadMoreObject = json_;
			    console.log(json_);
			    $.ajax({
			      url : "/wizSearch",
			      data: json_,//
			      beforeSend: function () { 
			    	 $("#wiz_search_btn").hide();
			    	 $("#wiz_search_btn_ajax").show();
			    	 $("#searchWizardBtnAjax").removeClass("search_wiz_ajax_animation").addClass("search_wiz_ajax_animation");
			      },
			      success : function(data){	
			    	  deleteMarkers();
			    	  $("#wiz_search_btn_ajax").hide();
				      $("#wiz_search_btn").show(); 
				      
				      $("#welcome-load-more").hide();
				      $("#search-load-more").hide();
			   	      console.log(data);
			   	      loadMoreObject.cursor= data.freePlaces.cursor;
					   	if(data.status=="OK") {
					   		WizUpdateLastPlaces(data.freePlaces,true,true);
					   		
					   		if(data.freePlaces.cursor=="last") {
					   			$("#wiz-load-more").hide();
					   			cursor_wiz = "";
					   			loadMoreObject = {};
					   		} else {
					   			$("#wiz-load-more").show();
					   			cursor_wiz = data.freePlaces.cursor;
					   			
					   		}
		            	} else if (data.status=="NO_EMPTY_FOUND") {
		            		if(data.freePlaces.cursor=="last") {
		            			$("#wiz-load-more").hide();
					   			cursor_wiz = "";
					   			loadMoreObject = {};
		            		} else {
			            		var HeaderAppend = '<div class="wiz_results_header" ><div class="material-icons wiz_failure" ">access_alarms</div>No seats available</div>';
			            		$("#mainLastResults").html(HeaderAppend);
		            		}
		            	} else if (data.status=="NO_SEARCH_FOUND") {
		            		if(data.freePlaces.cursor=="last") {
		            			$("#wiz-load-more").hide();
					   			cursor_wiz = "";
					   			loadMoreObject = {};
		            		} else {
			            		var HeaderAppend = '<div class="wiz_results_header" ><div class="material-icons wiz_failure" ">gps_off</div>No places found</div>';
			            		$("#mainLastResults").html(HeaderAppend);
		            		}
		            	}
					   	console.log(loadMoreObject);
			      },
			      dataType : "JSON",
			      type : "post"
			    });
	
		} else {
			$("#wiz_address_input").addClass("red_input_border");
			$("#wiz_address_input").focus();
		}
	});

}
function WizUpdateLastPlaces(data,cleanBefore,updateMap) {
	if(cleanBefore!=undefined && cleanBefore == true) {
		$("#mainLastResults").empty();
		var HeaderAppend = '<div class="wiz_results_header" ><div class="material-icons wiz_success" ">done</div>Free places found <span class="wiz_results_cnt">(<span id="wiz_count_result">'+data.places.length+'</span> results)</span></div>';
		$("#mainLastResults").append(HeaderAppend);
	} else {
		var currentVal = parseInt($("#wiz_count_result").html());
		var newVal = currentVal + data.places.length;
		$("#wiz_count_result").html(newVal);
	}
	
	console.log(data);
	var dataForMarkers = {};
	dataForMarkers.places = [];
	for (var i=0; i < data.places.length; i++) {
		var placeInfo =  data.places[i].placeInfo;
		dataForMarkers.places.push(placeInfo);
		var freeOptions = data.places[i].freeOptions;
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
        appendData+='	<div class="mrsimg-td-wiz">';
        appendData+='	  <a > ';     
        appendData+='	     <div class="mrsimg-div"><img class="overviewAccImage" src="' + userPlace.overviewCloudURL + '"/></div>';
        appendData+='	  </a>';  
        appendData+='	</div>';  
        appendData+='   <div class="mrdtbl">';   
        appendData+='     <div class="info_name_" id="info_name-'+pid+'">'+userPlace.place+',&nbsp'+userPlace.branch+'</div>';   
	    appendData+='   </div>';
	    
	    appendData+='   <div class="free_result_wrap">'; 
	    appendData+='   <div class="frht" ></div>'; 
	    for(var f=0;f < freeOptions.length ; f++) {
	    	var places = freeOptions[f].count;
	    	var pers = freeOptions[f].persons;
		    appendData+='     <div class="single_comb" title="'+places+' places available for '+pers+' persons each">'; 
		    appendData+='       <span class="scomfpl" >'+places+'</span>'; 
		    appendData+='          <span class="freex" >X</span> '; 
		    appendData+='        <span class="scomfpl" >'+pers+'</span>'; 
		    appendData+='        <span class="material-icons freeperson"  >person</span>'; 
		    appendData+='      </div>'; 
	    }
	    appendData+='     </div> '; 
	    
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
		addMapMarkers(dataForMarkers);
	}
}
function SearchGeoWizard(callback) {
	var address = document.getElementById('wiz_address_input').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
             console.log( results);
            if(results.length==1  ) {
            	// Use address 
	       	        var lat = results[0].geometry.location.lat();
	       	        var lng = results[0].geometry.location.lng(); 
	            	searchObjWiz.lat = lat;
	            	searchObjWiz.lng = lng;
	            	callback(true);
            } else {
            	callback(false);
            }
        } else {
        	callback(false);
        }
      }); 
}