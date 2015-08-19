/**
 * 
 */
$(document).ready(function () { 
	var TimeRangeValues = [];
	for (var i =0 ; i < 2 ; i++) {
		for (var h=0 ; h < 24 ; h += 1) {
		   for (var m=0 ; m < 60 ; m +=15 ) {
			  var h_ = ""+h;
			  var m_ = ""+m;
			  if(h<10) {
				 h_ = "0"+h;
			  } 
			  if(m ==0 ) {
				m_  = "0"+m;
			  }
			 
			  if (i==0) {
			    TimeRangeValues.push(h_+":"+m_);
			  } else {
			    TimeRangeValues.push(h_+":"+m_+"ND");
			  }
		   }
		}
	}
	$(".place_layers").click(
			function(){
				 var all=document.getElementsByName("place_layers_tab");
				 for(var x=0; x < all.length; x++) {			   
				   $('#'+all[x].id).removeClass( "choosed_layer" );
				 }
                $(this).addClass( "choosed_layer" ); 
			}	
	);
    $( ".layer_name" ).dblclick(function() {
	     var inputID = this.id + "-i";
		 document.getElementById(inputID).style.display = "";
		 document.getElementById(this.id).style.display = "none";
		 document.getElementById(inputID).focus();
    });
	$('.change_name_layer_input').focusout(function(){
        var newName = this.value;
		var id = this.id;
		var spanID = id.replace(/-i/,"");
		$('#'+spanID).html(newName);
		document.getElementById(spanID).style.display = "";
		document.getElementById(this.id).style.display = "none";
     });
	 $("#drawing_tab_selector").click(
			function(){
			  bookingOpen_ = false;
			  $('#drawing_tab_selector').addClass( "rt_selected" );
			  $('#booking_tab_selector').removeClass( "rt_selected" );
			  document.getElementById("booking_options_table").style.display = "none";
	          document.getElementById("selected_options_table_main").style.display = "";	
	        }			
	 );
	 $("#booking_tab_selector").click(
			function(){

			  if(canvas_.selection!= null && canvas_.listSelected.length < 2 && canvas_.selection.type!="text" && canvas_.selection.type!="line") {
				//  alert(JSON.stringify(canvas_.selection, ["x","y","w","h","rotate","angle","type","options","booking_options","prevMX","prevMY","sid"]) +
				//			 JSON.stringify(canvas_.selection.options) +   JSON.stringify(canvas_.selection.booking_options));

			        bookingOpen_ = true;
					var shapeID = canvas_.selection.sid;
					$('#given_shape_ID').html(shapeID);
					$('#booking_tab_selector').addClass( "rt_selected" );
			        $('#drawing_tab_selector').removeClass( "rt_selected" );
					document.getElementById("booking_options_table").style.display = "";
					document.getElementById("selected_options_table_main").style.display = "none";
					if (canvas_.selection.type == "image") {
						var imgSource = document.getElementById(canvas_.selection.options.imgID).src;
						
						var image = new Image();
						image.src = imgSource;
						var widthApplied = 100;
						var heightApplied = 100;
						
						image.onload = function() {
						   //  alert(this.width + " " + this.height);
							 actualWidth = this.width;
							 actualHeight = this.height;
							 if (actualWidth > 140 || actualHeight > 140 ) {
							   if ( actualWidth < actualHeight ) {
								  heightApplied = 140;
								  widthApplied = 140.0 * actualWidth / actualHeight;
							   } else {
								  widthApplied = 140;
								  heightApplied = 140.0 * actualHeight / actualWidth
							   }
							 } else {
								heightApplied = actualHeight;
								widthApplied = actualWidth;
							 } 
						  // this.width, this.height will be dimensions
							document.getElementById("chosed_image_booking").src = imgSource;
							document.getElementById("chosed_image_booking").style.width = widthApplied + 'px';
							document.getElementById("chosed_image_booking").style.height = heightApplied + 'px';
							$('#right_col_scroll').perfectScrollbar();
							$('#right_col_scroll').perfectScrollbar('update');
							$("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
						}
						document.getElementById("booking_image_view").style.display = "";
						document.getElementById("booking_canvas_view").style.display = "none";
					 } else {
						 	  var c = document.getElementById("show_canvas_book");
							  var ctx = c.getContext("2d");
							  ctx.clearRect( 0 , 0 , 150 , 150 );
							  var type = canvas_.selection.type;
							  var x = 75;
							  var y = 75;
							  var alpha = canvas_.selection.options.alpha;
							  var salpha = canvas_.selection.options.salpha;
							  var lineColor = canvas_.selection.options.lineColor;
							  var fillColor = canvas_.selection.options.fillColor;
							  var lineWidth = canvas_.selection.options.sw;
							  var width_ = canvas_.selection.w;
							  var height_ = canvas_.selection.h;
							  var width = width_;
							  var height = height_;
							  if (width_ >= height_ ) {
								 if ( width_ > 120 ) {
								   width = 120;
								   height = parseInt (height_/width_ * 120);
								 }
							  } else {
								 if ( height_ > 120 ) {
								   height = 120;
								   width = parseInt (width_/height_ * 120);
								 }
							  } 
							  if (type == "round") {	
								var roundRad  = canvas_.selection.options.roundRad;
								dbRoundRect(ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth,roundRad);
							  } else if (type == "circle") {
								var radw = canvas_.selection.w ;
								var radh = canvas_.selection.h ;
								var rad = (radw < radh) ? radh : radw;
								if (rad > 65) {
								  rad = 65;
								}
								var startA = canvas_.selection.options.startA;
								var endA = canvas_.selection.options.endA;
								dbCircle(ctx , x, y, rad, rad,  startA,  endA ,lineColor,fillColor,alpha,salpha,lineWidth);
							  } else if (type == "trapex") {
								var cutX = canvas_.selection.options.cutX;
								dbTrapez (ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth,cutX);
							  } else if (type == "rectangle") {
								dbDrawRect(ctx,x,y,width,height,lineColor,fillColor,alpha,salpha,lineWidth);
							  } 
						document.getElementById("booking_image_view").style.display = "none";
						document.getElementById("booking_canvas_view").style.display = "";
					 }
					 // Update Existing values

				     if(!!canvas_.selection.booking_options.bookable && canvas_.selection.booking_options.bookable == false ) {	
				    		 document.getElementById("book-able").checked = canvas_.selection.booking_options.bookable;
				    		 BookingOptionsAble(false);
					 } else {
						     document.getElementById("book-able").checked = true;
						     BookingOptionsAble(true);
					 }
					 if(!!canvas_.selection.booking_options.givenName && canvas_.selection.booking_options.givenName != "") {
					    
					    document.getElementById("booking_shape_name").value = canvas_.selection.booking_options.givenName;
					 } else {
					    document.getElementById("booking_shape_name").value = "";
					 }
					 if(!!canvas_.selection.booking_options.minPersons && canvas_.selection.booking_options.minPersons != "") {		
					    $( "#booking_shape_minpersons" ).spinner( "value", canvas_.selection.booking_options.minPersons );
				     } else {
					    $( "#booking_shape_minpersons" ).spinner( "value", 1 );
				     }
					 if(!!canvas_.selection.booking_options.maxPersons && canvas_.selection.booking_options.maxPersons != "") {		
					    $( "#booking_shape_maxpersons" ).spinner( "value", canvas_.selection.booking_options.maxPersons );
				     } else {
					    $( "#booking_shape_maxpersons" ).spinner( "value", 1 );
				     }
					 if(!!canvas_.selection.booking_options.weekDays && Object.getOwnPropertyNames(canvas_.selection.booking_options.weekDays).length !== 0 ) {		
					    document.getElementById("book_sun_cb").checked = canvas_.selection.booking_options.weekDays.sun;
						document.getElementById("book_mon_cb").checked = canvas_.selection.booking_options.weekDays.mon;
						document.getElementById("book_tue_cb").checked = canvas_.selection.booking_options.weekDays.tue;
						document.getElementById("book_wed_cb").checked = canvas_.selection.booking_options.weekDays.wed;
						document.getElementById("book_thu_cb").checked = canvas_.selection.booking_options.weekDays.thu;
						document.getElementById("book_fri_cb").checked = canvas_.selection.booking_options.weekDays.fri;
						document.getElementById("book_sat_cb").checked = canvas_.selection.booking_options.weekDays.sat;
				     } else {
					    var all=document.getElementsByName("week_checkbox");
				        for(var x=0; x < all.length; x++) {		
                            document.getElementById(all[x].id).checked = true;	
				        }
						canvas_.selection.booking_options.weekDays = {};
						canvas_.selection.booking_options.weekDays.sun=true;
						canvas_.selection.booking_options.weekDays.mon=true;
						canvas_.selection.booking_options.weekDays.tue=true;
						canvas_.selection.booking_options.weekDays.wed=true;
						canvas_.selection.booking_options.weekDays.thu=true;
						canvas_.selection.booking_options.weekDays.fri=true;
						canvas_.selection.booking_options.weekDays.sat=true;
				     }
					 if(!!canvas_.selection.booking_options.timeRange && Object.getOwnPropertyNames(canvas_.selection.booking_options.timeRange).length !== 0 ) {
					      var slider = $("#booking_time_slider1").data("ionRangeSlider");
						  var fromInd = TimeRangeValues.indexOf(canvas_.selection.booking_options.timeRange[0].from);
						  var toInd = TimeRangeValues.indexOf(canvas_.selection.booking_options.timeRange[0].to);
						  slider.update({
						     from : fromInd,
							 to : toInd
						  });
					 } else {
					    canvas_.selection.booking_options.timeRange[0] = {"from":"08:00","to":"18:00"}                        						 
					 }
                }	
				 $('#right_col_scroll').perfectScrollbar();
				 $('#right_col_scroll').perfectScrollbar('update');
				 $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
			}

	 );
	 $('#booking_shape_name').focusout(function(){
	      if(canvas_.selection!= null) {
		     canvas_.selection.booking_options.givenName = $(this).val();
		  }
	 });
	 $( "#booking_shape_minpersons" ).spinner({
			min: 1,
			stop: function( event, ui ) {
			   var val = document.getElementById("booking_shape_minpersons").value;
			   canvas_.selection.booking_options.minPersons = val;
			   $( "#booking_shape_maxpersons" ).spinner( "option", "min", val );
			   if ( $( "#booking_shape_maxpersons" ).spinner( "value" ) < val ) {
			        $( "#booking_shape_maxpersons" ).spinner( "value", val );
				}
			}
	 });	 
	 $( "#booking_shape_minpersons" ).spinner("widget").addClass("marginright10");
	 $( "#booking_shape_maxpersons" ).spinner({
			min: 1,
			stop: function( event, ui ) {
			   canvas_.selection.booking_options.maxPersons = document.getElementById("booking_shape_maxpersons").value;
			   
			}
	 });	 
	 $( "#booking_shape_maxpersons" ).spinner("widget").addClass("marginright10");

	 
	 $('#checkboxMinP').change(function(){ 
		if($(this).attr("checked")){ 
			 $( "#booking_shape_minpersons" ).spinner( "enable" );
		}else{ 
             $( "#booking_shape_minpersons" ).spinner( "disable" );
		} 
	});
	$('#checkboxMaxP').change(function(){ 
		if($(this).attr("checked")){ 
			 $( "#booking_shape_maxpersons" ).spinner( "enable" );
		}else{ 
              $( "#booking_shape_maxpersons" ).spinner( "disable" );
		} 
	});
	
	$('#book-able').change(function(){ 
		if($(this).attr("checked")){ 
			canvas_.selection.booking_options.bookable = true;
			BookingOptionsAble(true);		
		} else { 
			canvas_.selection.booking_options.bookable = false;
			BookingOptionsAble(false);
		} 
	});
function BookingOptionsAble(bool) {
	if (bool == true) {
		var all=document.getElementsByName("bokabledata");
		 for(var x=0; x < all.length; x++) {			   
		   $('#'+all[x].id).show();
		 }
	} else {
		var all=document.getElementsByName("bokabledata");
		 for(var x=0; x < all.length; x++) {			   
		   $('#'+all[x].id).hide();
		 }
	}
}
	$('.week_checkbox').change(function(){ 
	    var weekDay = this.id.replace(/book_|_cb/g,"");
        var daysList = ["sun","mon","tue","wed","thu","fri","sat"];
		var checked_ = true;
		if($(this).attr("checked")){ 
			 checked_ = true;
		} else { 
             checked_ = false;
		} 
        for ( var i = 0; i < daysList.length; i++ ) {	
            if ( daysList[i] == weekDay ) {
			  canvas_.selection.booking_options.weekDays[daysList[i]] = checked_;
			}
        }		
	});

	
	$("#booking_time_slider1").ionRangeSlider({
		type: "double",
		values:TimeRangeValues,
		from:TimeRangeValues.indexOf("08:00"),
		to:TimeRangeValues.indexOf("18:00"),
		from_max: 95,
		from_shadow: true,
		min_interval: 1,
		onFinish:  function (data) {
          var min_ = TimeRangeValues[data.from];
		  var max_ = TimeRangeValues[data.to];
		  canvas_.selection.booking_options.timeRange[0] = {"from":min_ , "to":max_};
        }
    });
	
});