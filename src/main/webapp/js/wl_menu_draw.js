var current_submenu="";
var current_shape_selected = "";
var picker_table_initial = {};
picker_table_initial['table'] = true;
picker_table_initial['chair'] = true;
picker_table_initial['combo'] = true;
var jsonCurrent = {};
var jsonShapeType = "";

$(document).ready(function () { 
   updateToolDimentions();

   current_submenu = "background_tab_dimentions";
	  $( "#background_tab_dimentions").css("z-index","1");
	  $( "#draw_tab_shapes").css("z-index","0");
   $("#background_tab_dimentions_submenu").css("left","0px");
   
   $("#background_tab_dimentions").click(function() {
      current_submenu = "background_tab_dimentions";
	  $(".left_nav_tab").addClass("left_nav_tab_hover_disabled");
	  $( "#background_tab_dimentions").removeClass("left_nav_tab_hover_disabled");
	  $( "#background_tab_dimentions").css("z-index","1");
	  $( "#draw_tab_shapes").css("z-index","0");
	  $("#background_tab_dimentions_submenu").css("left","0px");
	  $("#draw_tab_shapes_submenu").css("left","-310px");
	   canvas_.mode("bg");
	   $(".single_shape_options_menu").hide();
	   	$(".sss_col").hide();
		$(".sss_baw").show();
		currentFigurePicker.type = "";
		current_shape_selected = "";
		hideHint();
   });
    $("#draw_tab_shapes").click(function() {
      current_submenu = "draw_tab_shapes";
	  $(".left_nav_tab").addClass("left_nav_tab_hover_disabled");
	  $( "#draw_tab_shapes").removeClass("left_nav_tab_hover_disabled");
	  $( "#draw_tab_shapes").css("z-index","1");
	  $( "#background_tab_dimentions").css("z-index","0");
	  $("#draw_tab_shapes_submenu").css("left","0px");
	  $("#background_tab_dimentions_submenu").css("left","-310px");
	  canvas_.mode();
	  $(".bg_shapes_options").hide();
	  	$(".sss_col").hide();
		$(".sss_baw").show();
		currentFigurePicker.type = "";
		current_shape_selected = "";
		updateHint("Please select any shape","red",true);
   });  
  /* $( ".left_nav_tab" ).click(function() {
      var id_ = $(this).attr("id");
	  if(current_submenu!=id_) {
	        $(".left_nav_tab").addClass("left_nav_tab_hover_disabled");
			$( "#" + id_).removeClass("left_nav_tab_hover_disabled");
			$( "#" + id_ + "_submenu" ).css("z-index",2);
			$( "#" + id_ + "_submenu" ).css("left","0px");  

			current_submenu = id_;
	  }
	  if(current_submenu == "background_tab_dimentions") {
	     canvas_.mode("bg");
	  } else {
	     canvas_.mode();
	  }
   });*/
   $( ".left_nav_tab" ).hover(
      
	  function() {
	    var id_ = $(this).attr("id");
	    if(current_submenu != id_) {
			$( "#" + id_).removeClass("left_nav_tab_hover_disabled");
		}
	  }, function() {
	    var id_ = $(this).attr("id");
	    if(current_submenu != id_) {
			$( "#" + id_).addClass("left_nav_tab_hover_disabled");
		}
	  }
	);


     $( ".fill_type_selectors" ).hover(     
	  function() {
	    var id_ = $(this).attr("id");
	    if(current_submenu != id_) {
			$( "#" + id_  ).css("margin-left",20);
		}
	  }, function() {
	    var id_ = $(this).attr("id");
	    if(current_submenu != id_) {
			$( "#" + id_  ).css("margin-left",15);
		}
	  }
	);
 	/*$(".submenu").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
	    var id_ = $(this).attr("id");
		
		if($( "#" + id_ ).position().left == 500) {
		   // If submenu moved right --> hide it at left
			$(  "#" + id_ ).css("z-index",-1);
			$(  "#" + id_ ).css("left","-310px");
		} else {
		   var csm = id_.replace(/_submenu$/,"");
			if(current_submenu == csm) {
			   // All submenus left
			   var all=document.getElementsByName("submenu");
				 for(var x=0; x < all.length; x++) {
				  if(all[x].id != id_ ) {
				   		$( "#" + all[x].id ).css("z-index",-1);
			            $( "#" + all[x].id ).css("left","-310px");
				   }
				 }
				console.log(id_);
			   $(  "#" + id_ ).css("z-index",1);
			}
		}		
	});  */
	$(".bg_accordion").click(function() {
      var id_ = $(this).attr("id");
	  if(id_=="bg_acc_dimentions") {
	    if($("#bg_acc_dimentions_sub").hasClass("acc_open")) {
		   $("#bg_acc_dimentions_sub").css("height","0px");
		   $("#bg_acc_dimentions_sub").removeClass("acc_open");
		   $("#"+id_).removeClass("bg_accordion_selected");
		} else {
		   $("#bg_acc_dimentions_sub").css("height",140+"px");
		   $("#bg_acc_dimentions_sub").addClass("acc_open");
		   $("#"+id_).addClass("bg_accordion_selected");
		}
	  } else if (id_ == "bg_acc_fill") {
		  if($("#bg_acc_fill_sub").hasClass("acc_open")) {
			   $("#bg_acc_fill_sub").css("height","0px");
			   $("#bg_acc_fill_sub").removeClass("acc_open");
			   $("#"+id_).removeClass("bg_accordion_selected");
			} else {
			   if($("#fill_type_color").hasClass("fill_type_selectors_selected")) {
			       $("#bg_acc_fill_sub").css("height",200 + "px");
			   } else if ($("#fill_type_bgimage").hasClass("fill_type_selectors_selected")) {
			       $("#bg_acc_fill_sub").css("height",300 + "px");
			   } else {
			      if($('#show_on_upload_bg_user').is(':visible')) {
				     $("#bg_acc_fill_sub").css("height",400 + "px");
				  } else {
				     $("#bg_acc_fill_sub").css("height",200 + "px");
				  }
			      
			   }
			  
			   $("#bg_acc_fill_sub").addClass("acc_open");
			   $("#"+id_).addClass("bg_accordion_selected");
			}	  
	  } else if (id_=="bg_acc_draw") {
	    if($("#bg_acc_draw_sub").hasClass("acc_open")) {
		   $("#bg_acc_draw_sub").css("height","0px");
		   $("#bg_acc_draw_sub").removeClass("acc_open");
		   $("#"+id_).removeClass("bg_accordion_selected");
		} else {
		   $("#bg_acc_draw_sub").css("height",$("#background_tab_dimentions_submenu").height() - 155 + "px");
		   $("#bg_acc_draw_sub").addClass("acc_open");
		   $("#"+id_).addClass("bg_accordion_selected");
		}		  
	  }
	});
});

function updateToolDimentions() {
         var all=document.getElementsByName("selected_options");
		  for(var x=0; x < all.length; x++) {
			   document.getElementById(all[x].id).style.display = "none";
		  }  
   		var browserHeight =  document.body.offsetHeight;
	    var browserWidth  =  document.body.offsetWidth;
		var headerHeight = $("#header_drawing").height();
		if(browserHeight - headerHeight < 636) {
			$("#drawing_wrap_content").css("height",636+"px");
		} else {
			$("#drawing_wrap_content").css("height",browserHeight - headerHeight + "px");
		}

		if(browserWidth < 1145) {
			$("#drawing_wrap_content").css("width",1145+"px");
		} else {
			$("#drawing_wrap_content").css("width",browserWidth + "px");
		}
		$("#dr_center_section").css("height",$("#drawing_wrap_content").height()-$("#dr_top_section").height()-$("#dr_bottom_section").height()+"px");
		$("#dr_center_column_wrap").css("width",$("#drawing_wrap_content").width()-$("#dr_left_column_wrap").width()-$("#dr_right_column_wrap").width()+"px");
		$("#submenus").css("height",$("#dr_center_section").height()-$("#left_dr_back_wrap_icons").height() + "px");
		$(".submenu").css("height",$("#dr_center_section").height()-$("#left_dr_back_wrap_icons").height() + "px");
		
	
		
		$("#canvas_td").css("width",$("#dr_center_column_wrap").width() + "px");
		$("#canvas_td").css("height",$("#dr_center_column_wrap").height() + "px");
		$("#canvas_wrapper").css("width",$("#dr_center_column_wrap").width() -2 * 3 + "px");
		$("#canvas_wrapper").css("height",$("#dr_center_column_wrap").height() -2 * 3  + "px");
		
		var  single_shape_options_menu_height = $("#dr_center_section").height() - 20 - $("#book_select_shapes").height() - 10 ;
		$(".single_shape_options_menu").css("height",single_shape_options_menu_height + "px");		
		
		//var img_picker_height = single_shape_options_menu_height - 226
        
		var img_picker_height = single_shape_options_menu_height - 30
		
		$("#table_picker_w").css("height",img_picker_height + "px");		
		$('#table_picker').slimScroll({
			height: img_picker_height+'px'
		});
		$("#chair_picker_w").css("height",img_picker_height + "px");		
		$('#chair_picker').slimScroll({
			height: img_picker_height+'px'
		});
		$("#combo_picker_w").css("height",img_picker_height + "px");		
		$('#combo_picker').slimScroll({
			height: img_picker_height+'px'
		});
		$("#user_picker_w_bg").css("height",$("#background_tab_dimentions_submenu").height() - 155 -320 + "px");		
		$('#user_picker_bg').slimScroll({
			height: $("#background_tab_dimentions_submenu").height() - 155 -320+'px'
		});
		
		var history_height = single_shape_options_menu_height - 253 ;

		$("#user_picker_w").css("height",history_height + "px");		
		$('#user_picker').slimScroll({
			height: history_height+'px'
		});
		
		$("#background_picker_w").css("height",$("#dr_center_section").height()-320+"px");
		$('#background_picker').slimScroll({
			height: $("#dr_center_section").height()-320+'px'
		});
		
		$("#background_accordion_w").css("height",$("#background_tab_dimentions_submenu").height()-30+"px");
		$('#background_accordion_scroll').slimScroll({
			height: $("#background_tab_dimentions_submenu").height()-30+'px'
		});
		
		var mso_width = $("#mso_relative_div").width();
		var mso_margin = $("#canvas_td").width() - mso_width;
		if(mso_margin < 0) {
		   
		} else {
		   $("#mso_relative_div").css("left",mso_margin/2+"px");
		}
}
function updateSlimScroll(content,moveto) {
  $('#hidden_values').append( $('#'+content) );
  $('#'+moveto).children().remove();
  $('#'+moveto).append( $('#'+content) );
  var wrap_width = $('#'+moveto).height();
  
  $('#'+content).slimScroll({
	 height: wrap_width+'px'
  }); 
}
function updateBackgroundSliders() {
   var w = canvas_.width;
   var h = canvas_.height;
   $("#width_c_input").val(w);
   $("#height_c_input").val(h);
   $('#width_dr_slider').slider('value', w);
   $('#height_dr_slider').slider('value', h);
}
function updateBackgroundFillOptions() {
	   $("#show_on_upload_bg_user").hide();
	   $("#uploadBGbutton").show();
	   $("#uploadBGbutton_small").hide();
	   $(".bg_pick_image_selectable").removeClass("choosed_background_selected");
	   if(canvas_.backgroundFill == null) {
	      // Color
		  $('#back_color_pick').css('background-color',canvas_.fillColor);
	      $("#fill_type_color").click();
	   } else {
	       if(canvas_.backgroundType == "tiling") {
		    // Tool Image
		     var pickID = canvas_.backgroundActualId.replace(/_actual/,"");		
	         $("#"+pickID).addClass("choosed_background_selected");
		     $("#fill_type_bgimage").click();
		   } else {
		      // User image
			  $('#show_on_upload_bg_user').show();
			  var UsedImage = "chosed_background_orig_"+canvas_.floorid;
			  document.getElementById("chosed_background_orig").src = document.getElementById(UsedImage).src  ;
			  document.getElementById("chosed_background_orig").width = document.getElementById(UsedImage).width ;
			  document.getElementById("chosed_background_orig").height = document.getElementById(UsedImage).height ;
			  
			  // Update shown 
			  var widthApplied = 100;
			  var heightApplied = 100;
			  var actualWidth = document.getElementById(UsedImage).width;
			  var actualHeight = document.getElementById(UsedImage).height;
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
	    	  document.getElementById("chosed_bgimage").src =  document.getElementById(UsedImage).src ;
	          document.getElementById("chosed_bgimage").style.width = widthApplied + 'px';
	          document.getElementById("chosed_bgimage").style.height = heightApplied + 'px';
	                         
		      $("#fill_type_bguser").click();
	     	   if($("#bg_fill_user_sm").height()- $("#chosed_bgimage").height() - 60 < 145) {
				   $("#for_upload_user_bg_button").css("position","absolute");
				   $("#for_upload_user_bg_button").css("right","10px");
				   $("#for_upload_user_bg_button").css("top","-20px");
				   $("#uploadBGbutton").hide();
				   $("#uploadBGbutton_small").show();
				} else {
				   $("#for_upload_user_bg_button").css("position","relative");
				   $("#for_upload_user_bg_button").css("right","initial");
				   $("#for_upload_user_bg_button").css("top","initial");
				   $("#uploadBGbutton").show();
				   $("#uploadBGbutton_small").hide();							
				}
		   
		   } 
	   }
	}
$(document).ready(function () { 
    $(".bg_draw_select").click(function(){
	    var id_ = $(this).attr("id");
		$(".bg_draw_select").removeClass("bg_draw_select_selected");
		$("#"+id_).addClass("bg_draw_select_selected");
		
		if(id_=="bg_draw_select_shapes") {
		    $("#bg_submenu_fill").hide();
			$("#bg_submenu_shapes").show();
		} else if (id_=="bg_draw_select_fill") {
		    $("#bg_submenu_shapes").hide();
			$("#bg_submenu_fill").show();
		}
	
	});
    $(".fill_type_selectors").click(function(){
	    var id_ = $(this).attr("id");
		$(".fill_type_selectors").removeClass("fill_type_selectors_selected");
		$("#"+id_).addClass("fill_type_selectors_selected");
		$(".material_selector_v").hide();
		$(".material_selector_out").show();
		$(".bg_fill_submenus").hide();
		if(id_=="fill_type_color") {
            $("#material_color_out").hide();
			$("#material_color_v").show();
			$("#bg_fill_color_sm").show();
			$("#bg_acc_fill_sub").css("height",200 + "px");
		} else if (id_=="fill_type_bgimage") {
            $("#material_bgimage_out").hide();
			$("#material_bgimage_v").show();
			$("#bg_fill_image_sm").show();
			$("#bg_acc_fill_sub").css("height",300 + "px");
		} else if (id_=="fill_type_bguser") {
            $("#material_bguser_out").hide();
			$("#material_bguser_v").show();
			$("#bg_fill_user_sm").show();
			if($('#show_on_upload_bg_user').is(':visible')) {
				  $("#bg_acc_fill_sub").css("height",400 + "px");
				} else {
				  $("#bg_acc_fill_sub").css("height",200 + "px");
				}
		}
	
	});
	$("#width_dr_slider").slider({
	   min:400,
	   max:1200,
	   step:1,
	   stop: function( event, ui ) {
		  $("#width_c_input").val(ui.value);
		  setCanvasSize(ui.value,canvas_.origHeight);
	   },
	   slide: function( event, ui ) {
		  $("#width_c_input").val(ui.value);
		   document.getElementById(canvas_.canvas.id).width = ui.value;
           document.getElementById(canvas_.canvas.id).height = canvas_.origHeight;
		 // setCanvasSize(ui.value,$("#height_c_input").val());
	   }
    });
	$("#c_width_set").click(function(){
	  var value_ = parseInt($("#width_c_input").val());
	  if($.isNumeric(value_) && value_ >= 400 && value_ <= 1200 ) {
	    $('#width_dr_slider').slider('value', value_);
		setCanvasSize(value_,canvas_.origHeight);
	  } else {
	     alert("["+value_+"] Please enter width between next values: 400-1200");
	  }
	});	
	
	$("#height_dr_slider").slider({
	   min:400,
	   max:1200,
	   step:1,
	   stop: function( event, ui ) {
		  $("#height_c_input").val(ui.value);
		  setCanvasSize(canvas_.origWidth,ui.value);
	   },
	   slide: function( event, ui ) {
		  $("#height_c_input").val(ui.value);
		   document.getElementById(canvas_.canvas.id).width = canvas_.origWidth;
           document.getElementById(canvas_.canvas.id).height = ui.value;
		 // setCanvasSize(parseInt($("#width_c_input").val()),ui.value);
		  
	   }
    });
	$("#c_height_set").click(function(){
	  var value_ = parseInt($("#height_c_input").val());
	  if($.isNumeric(value_) && value_ >= 400 && value_ <= 1200 ) {
	    $('#height_dr_slider').slider('value', value_);
		setCanvasSize(canvas_.origWidth,value_);
	  } else {
	     alert("["+value_+"] Please enter height between next values: 400-1200");
	  }
	});	
		$("#left_width_dr").mousedown(function(){
	      var curv = $("#width_dr_slider").slider("value");
		  if(curv >= 401) {
			  $("#width_c_input").val(curv - 1);
			  $("#c_width_set").click();
		  }
	   });
		$("#right_width_dr").mousedown(function(){
	      var curv = $("#width_dr_slider").slider("value");
		  if(curv <= 1199) {
			  $("#width_c_input").val(curv + 1);
			  $("#c_width_set").click();
		  }
	   });
		$("#left_height_dr").mousedown(function(){
	      var curv = $("#height_dr_slider").slider("value");
		  if(curv >= 401) {
			  $("#height_c_input").val(curv - 1);
			  $("#c_height_set").click();
		  }
	   });
		$("#right_height_dr").mousedown(function(){
	      var curv = $("#height_dr_slider").slider("value");
		   if(curv <= 1199) {
			  $("#height_c_input").val(curv + 1);
			  $("#c_height_set").click();
		  }
	   });
	   
	   // Click on shapes
   $( ".single_shape_select_div" ).hover(    
	  function() {
	    var id_ = $(this).attr("id");
        $(".sss_col").hide();
		$(".sss_baw").show();
		$("#"+id_+"_baw").hide();
		$("#"+id_+"_col").show();
		if(current_shape_selected!="") {
			$("#"+current_shape_selected+"_baw").hide();
			$("#"+current_shape_selected+"_col").show();
		}
	  }, function() {
	    var id_ = $(this).attr("id");
        $(".sss_col").hide();
		$(".sss_baw").show();
		if(current_shape_selected!="") {
			$("#"+current_shape_selected+"_baw").hide();
			$("#"+current_shape_selected+"_col").show();
		}
	  }
	);
   $( ".single_shape_select_div_bg" ).hover(    
	  function() {
	    var id_ = $(this).attr("id");
        $(".sss_col").hide();
		$(".sss_baw").show();
		$("#"+id_+"_baw").hide();
		$("#"+id_+"_col").show();
		if(current_shape_selected!="") {
			$("#"+current_shape_selected+"_baw").hide();
			$("#"+current_shape_selected+"_col").show();
		}
	  }, function() {
	    var id_ = $(this).attr("id");
        $(".sss_col").hide();
		$(".sss_baw").show();
		if(current_shape_selected!="") {
			$("#"+current_shape_selected+"_baw").hide();
			$("#"+current_shape_selected+"_col").show();
		}
	  }
	);	
	   $(".single_shape_select_div").click(function(){
	     var id_ = $(this).attr("id");
		 current_shape_selected = id_;
			$(".sss_col").hide();
			$(".sss_baw").show();
			$("#"+current_shape_selected+"_baw").hide();
			$("#"+current_shape_selected+"_col").show();	 

		 $(".single_shape_options_menu").hide();
		 if(id_=="sss_round") {
		    jsonShapeType = "book_round"
		    $('#for_move_canvas_round').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined  || currentFigurePicker.type != "round") {
			  currentFigurePicker.lineColor = "#013ADF"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "round") {
			  currentFigurePicker.fillColor = "#81BEF7";
			}
			ShapePickerNew('round');
			$("#round_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#round_fill_color").css("background-color",currentFigurePicker.fillColor );
			
			// $('#right_col_scroll').perfectScrollbar();
            // $('#right_col_scroll').perfectScrollbar('update');
            // $("#right_col_scroll").find(".ps-scrollbar-x-rail").css({"opacity":0});
			$('#book_round_append_').append( $('#_round_append_') );
		 } else if(id_=="sss_circle") {
		    jsonShapeType = "book_circle"
		    $('#for_move_canvas_circle').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "circle") {
			  currentFigurePicker.lineColor = "#DF0101"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "circle") {
			  currentFigurePicker.fillColor = "#F5A9A9";
			}
			ShapePickerNew('circle');
			$("#circle_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#circle_fill_color").css("background-color",currentFigurePicker.fillColor );
			$('#book_circle_append_').append( $('#_circle_append_') );		 
		 } else if(id_=="sss_trapex") {
		    jsonShapeType = "book_trapex"
		    $('#for_move_canvas_trapex').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "trapex") {
			  currentFigurePicker.lineColor = "#088A4B"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "trapex") {
			  currentFigurePicker.fillColor = "#81F7BE";
			}
			ShapePickerNew('trapex');
			$("#trapex_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#trapex_fill_color").css("background-color",currentFigurePicker.fillColor );
			$('#book_trapex_append_').append( $('#_trapex_append_') );			 
		 } else if(id_=="sss_rect") {
		    jsonShapeType = "book_rect"
		    $('#for_move_canvas_rectangle').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "rectangle") {
			  currentFigurePicker.lineColor = "#4B088A"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "rectangle") {
			  currentFigurePicker.fillColor = "#BCA9F5";
			}
			ShapePickerNew('rectangle');
			$("#rectangle_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#rectangle_fill_color").css("background-color",currentFigurePicker.fillColor );
			$('#book_rect_append_').append( $('#_rect_append_') );				 
		 }else if(id_=="sss_line") {
		    jsonShapeType = "book_line"
		    $('#for_move_canvas_line').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "line") {
			  currentFigurePicker.lineColor = "black"			  
			}
			ShapePickerNew('line');
			$("#line_line_color").css("background-color",currentFigurePicker.lineColor);
			$('#book_line_append_').append( $('#_line_append_') );		 
		 }else if(id_=="sss_text") {
		    jsonShapeType = "book_text"
		    $('#for_move_canvas_text').append( $('#move_text_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "text") {
			  currentFigurePicker.font_color = "black"
              currentFigurePicker.text = document.getElementById("text_shape_value").value;
			  currentFigurePicker.font_bold = document.getElementById("font_style_selector").value;
			  currentFigurePicker.font_style = document.getElementById("font__selector").value;
			  currentFigurePicker.font_size = document.getElementById("font_size_selector").value;
			  currentFigurePicker.shadow = true;
			  currentFigurePicker.shadow_x  = 1;
			  currentFigurePicker.shadow_y  = 1;
			  currentFigurePicker.shadow_blur  = 1;
			  currentFigurePicker.shadow_color =  "grey"; 
			}
			ShapePickerNew('text',"show_text_canvas");
			$("#text_line_color").css("background-color",currentFigurePicker.font_color);
			$("#text_shadow_color").css("background-color",currentFigurePicker.shadow_color);
			$('#book_text_append_').append( $('#_text_append_') );	
		 } else if(id_=="sss_table") {
		    jsonShapeType = "book_table"
		    if($("#show_table_image").attr('src') == undefined) {
			   $("#hide_on_empty_table").hide();
			   currentFigurePicker.type = "";
			   updateHint("Please select any shape","red",true);
			} else {
			   $("#hide_on_empty_table").show();
			   currentFigurePicker = JSON.parse($("#json_saved_imgPicker_table").val());
			   updateHint("Double-click to add Image","green",true);
			}
		 } else if(id_=="sss_chair") {
		    jsonShapeType = "book_chair"
		    if($("#show_chair_image").attr('src') == undefined) {
			   $("#hide_on_empty_chair").hide();
			   currentFigurePicker.type = "";
			   updateHint("Please select any shape","red",true);
			} else {
			   $("#hide_on_empty_chair").show();
			   currentFigurePicker = JSON.parse($("#json_saved_imgPicker_chair").val());
			   updateHint("Double-click to add Image","green",true);
			}
		 } else if(id_=="sss_combo") {
		    jsonShapeType = "book_combo"
		    if($("#show_combo_image").attr('src') == undefined) {
			   $("#hide_on_empty_combo").hide();
			   currentFigurePicker.type = "";
			   updateHint("Please select any shape","red",true);
			} else {
			   $("#hide_on_empty_combo").show();
			   currentFigurePicker = JSON.parse($("#json_saved_imgPicker_combo").val());
			   updateHint("Double-click to add Image","green",true);
			}
		 } else if(id_=="sss_user") {
		    jsonShapeType = "book_user"
		     if(globalIgnoreSRC) {
			       globalIgnoreSRC = false;
				   $("#show_on_upload_user").show();
				   updateHint("Double-click to add Image","green",true);				 
			 } else {
				if($("#chosed_image").attr('src') == undefined) {
				   $("#show_on_upload_user").hide();
				   currentFigurePicker.type = "";
				   updateHint("Please select any shape","red",true);
				} else {
				   $("#show_on_upload_user").show();
				   currentFigurePicker = JSON.parse($("#json_saved_imgPicker_user").val());
				   updateHint("Double-click to add Image","green",true);
				}
			}
		 }
		 $("#"+id_+"_sso").show();
	   });
	   // Background shapes selectors
	   $(".single_shape_select_div_bg").click(function(){
	     var id_ = $(this).attr("id");
		 current_shape_selected = id_;
			$(".sss_col").hide();
			$(".sss_baw").show();
			$("#"+current_shape_selected+"_baw").hide();
			$("#"+current_shape_selected+"_col").show();	 

		 $(".bg_shapes_options").hide();
		 if(id_=="sssbg_round") {
		    jsonShapeType = "bg_round"
		    $('#for_move_canvas_round').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined  || currentFigurePicker.type != "round") {
			  currentFigurePicker.lineColor = "#013ADF"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "round") {
			  currentFigurePicker.fillColor = "#81BEF7";
			}
			ShapePickerNew('round');
			$("#round_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#round_fill_color").css("background-color",currentFigurePicker.fillColor );
            $('#bg_round_append_').append( $('#_round_append_') );
		 } else if(id_=="sssbg_circle") {
		    jsonShapeType = "bg_circle"
		    $('#for_move_canvas_circle').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "circle") {
			  currentFigurePicker.lineColor = "#DF0101"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "circle") {
			  currentFigurePicker.fillColor = "#F5A9A9";
			}
			ShapePickerNew('circle');
			$("#circle_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#circle_fill_color").css("background-color",currentFigurePicker.fillColor );
			$('#bg_circle_append_').append( $('#_circle_append_') );		 
		 } else if(id_=="sssbg_trapex") {
		    jsonShapeType = "bg_trapex"
		    $('#for_move_canvas_trapex').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "trapex") {
			  currentFigurePicker.lineColor = "#088A4B"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "trapex") {
			  currentFigurePicker.fillColor = "#81F7BE";
			}
			ShapePickerNew('trapex');
			$("#trapex_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#trapex_fill_color").css("background-color",currentFigurePicker.fillColor );
			$('#bg_trapex_append_').append( $('#_trapex_append_') );		 
		 } else if(id_=="sssbg_rect") {
		    jsonShapeType = "bg_rect"
		    $('#for_move_canvas_rectangle').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "rectangle") {
			  currentFigurePicker.lineColor = "#4B088A"			  
			}
			if(currentFigurePicker==undefined || currentFigurePicker.fillColor==undefined || currentFigurePicker.type != "rectangle") {
			  currentFigurePicker.fillColor = "#BCA9F5";
			}
			ShapePickerNew('rectangle');
			$("#rectangle_line_color").css("background-color",currentFigurePicker.lineColor);
			$("#rectangle_fill_color").css("background-color",currentFigurePicker.fillColor );
			$('#bg_rect_append_').append( $('#_rect_append_') );		 
		 }else if(id_=="sssbg_line") {
		    jsonShapeType = "bg_line"
		    $('#for_move_canvas_line').append( $('#move_show_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "line") {
			  currentFigurePicker.lineColor = "black"			  
			}
			ShapePickerNew('line');
			$("#line_line_color").css("background-color",currentFigurePicker.lineColor);
			$('#bg_line_append_').append( $('#_line_append_') );		 
		 }else if(id_=="sssbg_text") {
		    jsonShapeType = "bg_text"
		    $('#for_move_canvas_text').append( $('#move_text_canvas') );
			if(currentFigurePicker==undefined || currentFigurePicker.lineColor==undefined || currentFigurePicker.type != "text") {
			  currentFigurePicker.font_color = "black"
              currentFigurePicker.text = document.getElementById("text_shape_value").value;
			  currentFigurePicker.font_bold = document.getElementById("font_style_selector").value;
			  currentFigurePicker.font_style = document.getElementById("font__selector").value;
			  currentFigurePicker.font_size = document.getElementById("font_size_selector").value;
			  currentFigurePicker.shadow = true;
			  currentFigurePicker.shadow_x  = 1;
			  currentFigurePicker.shadow_y  = 1;
			  currentFigurePicker.shadow_blur  = 1;
			  currentFigurePicker.shadow_color =  "grey"; 
			}
			ShapePickerNew('text',"show_text_canvas");
			$("#text_line_color").css("background-color",currentFigurePicker.font_color);
			$("#text_shadow_color").css("background-color",currentFigurePicker.shadow_color);
			$('#bg_text_append_').append( $('#_text_append_') );
		 }  else if(id_=="sssbg_user") {
		     jsonShapeType = "bg_user"
		     if(globalIgnoreSRC) {
			       globalIgnoreSRC = false;
				   $("#show_on_upload_user_bg").show();
				   updateHint("Double-click to add Image","green",true);				 
			 } else {
				if($("#chosed_image_bg").attr('src') == undefined) {
				   $("#show_on_upload_user_bg").hide();
				   currentFigurePicker.type = "";
				   updateHint("Please select any shape","red",true);
				} else {
				   $("#show_on_upload_user_bg").show();
				   currentFigurePicker = JSON.parse($("#json_saved_imgPicker_user_bg").val());
				   updateHint("Double-click to add Image","green",true);
				}
			}
		 }
		 $("#"+id_+"_options").show();
	   });
});