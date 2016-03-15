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

	$("#booking_shape_name").bind("change paste keyup", function() {
		var nameExists = false;
		if(canvas_.selection!= null) {
			 for (var i = 0; i < floorCanvases.length ; i++ ) {
				    for(var s = 0 ; s < floorCanvases[i].bookshapes.length ; s++) {
				    	if(!!floorCanvases[i].bookshapes[s].booking_options.givenName && floorCanvases[i].bookshapes[s].booking_options.givenName != "") {
				    		if(floorCanvases[i].bookshapes[s].sid != canvas_.selection.sid) {
				    			if(floorCanvases[i].bookshapes[s].booking_options.givenName == $("#booking_shape_name").val()) {
				    				$("#name_Error_bottom").show();
				    				nameExists = true;
				    			} 
				    		} 
				    	}
				    }
			 }
			 if(nameExists) {
				 $("#name_Error_bottom").show();
			 } else {
				 $("#name_Error_bottom").hide();
				 if(canvas_.selection!= null  && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {
					 console.log( $(this).val());
				     canvas_.selection.booking_options.givenName = $(this).val();
				  }
			 }
		}
	});
	 $('#booking_shape_name___').focusout(function(){
	      if(canvas_.selection!= null  && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {
		     canvas_.selection.booking_options.givenName = $(this).val();
		  }
	 });
	 $("#min_p_minus").click(function(){
	    if(canvas_.selection != null && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {
		   if(parseInt($("#min_p_value").val())>1) {
		       var current = parseInt($("#min_p_value").val());
			   $("#min_p_value").val(current-1);
			   canvas_.selection.booking_options.minPersons  = current-1;
		   }
		}
	 });
	 $("#min_p_plus").click(function(){
	    if(canvas_.selection != null && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {		   
		       var current = parseInt($("#min_p_value").val());
			   $("#min_p_value").val(current+1);
			   canvas_.selection.booking_options.minPersons  = current+1;
			   if(parseInt($("#max_p_value").val()) < canvas_.selection.booking_options.minPersons) {
			       $("#max_p_value").val(canvas_.selection.booking_options.minPersons);
				   canvas_.selection.booking_options.maxPersons = canvas_.selection.booking_options.minPersons;
			   }		   
		}
	 });
	 $("#max_p_minus").click(function(){
	    if(canvas_.selection != null && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {
		   if(parseInt($("#max_p_value").val())>1) {
		       var current = parseInt($("#max_p_value").val());
			   $("#max_p_value").val(current-1);
			   canvas_.selection.booking_options.maxPersons  = current-1;
			   if(parseInt($("#min_p_value").val()) > canvas_.selection.booking_options.maxPersons) {
			       $("#min_p_value").val(canvas_.selection.booking_options.maxPersons);
				   canvas_.selection.booking_options.minPersons = canvas_.selection.booking_options.maxPersons;
			   }
		   }
		}
	 });
	 $("#max_p_plus").click(function(){
	    if(canvas_.selection != null && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {		   
		       var current = parseInt($("#max_p_value").val());
			   $("#max_p_value").val(current+1);
			   canvas_.selection.booking_options.maxPersons  = current+1;		   
		}
	 });

	$('#book-able').change(function(){
        if(canvas_.selection != null && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {	
			if($(this).attr("checked")){ 
				canvas_.selection.booking_options.bookable = true;
			} else { 
				canvas_.selection.booking_options.bookable = false;
			} 
	    }
	});

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
});

function updateBookingOptions() {
   if(canvas_.bgmode == false && canvas_.selection != null && canvas_.listSelected.length == 1 && canvas_.selection.bookableShape) {
        $("#booking_options_wrap_").show();
		$("#used_images_wrap").css("opacity",1);
		if(canvas_.selection.booking_options.bookable == false ) {	
				 document.getElementById("book-able").checked = canvas_.selection.booking_options.bookable;
		} else {
			     document.getElementById("book-able").checked = true;
		}
		if(!!canvas_.selection.booking_options.givenName && canvas_.selection.booking_options.givenName != "") {		   
		   document.getElementById("booking_shape_name").value = canvas_.selection.booking_options.givenName;
		} else {
		   document.getElementById("booking_shape_name").value = "";
		}  
		if(!!canvas_.selection.booking_options.minPersons && canvas_.selection.booking_options.minPersons != "") {
            $("#min_p_value").val(canvas_.selection.booking_options.minPersons);		
		} else {
		    $("#min_p_value").val(1);
		   canvas_.selection.booking_options.minPersons = 1;
		}
		if(!!canvas_.selection.booking_options.maxPersons && canvas_.selection.booking_options.maxPersons != "") {	
           $("#max_p_value").val(canvas_.selection.booking_options.maxPersons);		
		} else {
		   $("#max_p_value").val(1);
		   canvas_.selection.booking_options.maxPersons = 1
		}		
   } else {
        $("#booking_options_wrap_").hide();
		$("#used_images_wrap").css("opacity",0.5);
   }
}