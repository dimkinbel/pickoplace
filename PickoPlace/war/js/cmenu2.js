 $(function() {
    $('.cmenu2').contextMenu('#menu2',{
    // Randomly enable or disable each option
      beforeShow: function() { 
	      if(canvas_.listSelected.length > 1) {
              $("#copy_menu").addClass("menu_active");
			  $("#paste_menu").addClass("menu_active");	
			  $("#delete_menu").addClass("menu_active");
			  $("#Group_menu").addClass("menu_active");
			  $(".only_singe").hide();
			  $(".only_multi").show();
		 } else {
		      $(".only_singe").show();
			  $(".only_multi").hide();
			  if(canvas_.selection!= null) {
				   $("#copy_menu").addClass("menu_active");
				   $("#delete_menu").addClass("menu_active");
				   $("#bringForward_menu").addClass("menu_active");
				   $("#bringBack_menu").addClass("menu_active");
				   $("#bringToTop_menu").addClass("menu_active");
				   $("#bringToBottom_menu").addClass("menu_active");
				   $("#orderBehav_menu").addClass("menu_active");
			   } else {
				   $("#copy_menu").removeClass("menu_active");
				   $("#delete_menu").removeClass("menu_active");
				   $("#bringForward_menu").removeClass("menu_active");
				   $("#bringBack_menu").removeClass("menu_active");
				   $("#bringToTop_menu").removeClass("menu_active");
				   $("#bringToBottom_menu").removeClass("menu_active");
				   $("#orderBehav_menu").removeClass("menu_active");
			   }
			 if(canvas_.pasteReady != null || canvas_.pasteMultiple_ == true) {		 
				   $("#paste_menu").addClass("menu_active");	 
			 } else {
				   $("#paste_menu").removeClass("menu_active");	
			 }		 
		 }
	  }
   });
  });
 function applyCmenu(ID) {	 
	    $('#'+ID).contextMenu('#menu2',{
	        // Randomly enable or disable each option
	          beforeShow: function() { 
	    	      if(canvas_.listSelected.length > 1) {
	                  $("#copy_menu").addClass("menu_active");
	    			  $("#paste_menu").addClass("menu_active");	
	    			  $("#delete_menu").addClass("menu_active");
	    			  $("#Group_menu").addClass("menu_active");
	    			  $(".only_singe").hide();
	    			  $(".only_multi").show();
	    		 } else {
	    		      $(".only_singe").show();
	    			  $(".only_multi").hide();
	    			  if(canvas_.selection!= null) {
	    				   $("#copy_menu").addClass("menu_active");
	    				   $("#delete_menu").addClass("menu_active");
	    				   $("#bringForward_menu").addClass("menu_active");
	    				   $("#bringBack_menu").addClass("menu_active");
	    				   $("#bringToTop_menu").addClass("menu_active");
	    				   $("#bringToBottom_menu").addClass("menu_active");
	    				   $("#orderBehav_menu").addClass("menu_active");
	    			   } else {
	    				   $("#copy_menu").removeClass("menu_active");
	    				   $("#delete_menu").removeClass("menu_active");
	    				   $("#bringForward_menu").removeClass("menu_active");
	    				   $("#bringBack_menu").removeClass("menu_active");
	    				   $("#bringToTop_menu").removeClass("menu_active");
	    				   $("#bringToBottom_menu").removeClass("menu_active");
	    				   $("#orderBehav_menu").removeClass("menu_active");
	    			   }
	    			 if(canvas_.pasteReady != null || canvas_.pasteMultiple_ == true) {		 
	    				   $("#paste_menu").addClass("menu_active");	 
	    			 } else {
	    				   $("#paste_menu").removeClass("menu_active");	
	    			 }		 
	    		 }
	    	  }
	       });	 
 }