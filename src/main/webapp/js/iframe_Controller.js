 var iframeDateSelected = false;
 var iFramePopoverOpened = false;
 var iFramePopoverOpening = false;
var DatepickerSetDate = "+0";
var bookingsManager;
var shapesPrebookedJSON = {};
var minPeriodSeconds = 15*60;
 $(document).ready(function() {
   $('[data-toggle="tooltip"]').tooltip();
   $('#iframe_popover').on('show.bs.popover', function () {
			iFramePopoverOpening = true;

		})
   $('#iframe_popover').on('shown.bs.popover', function () {
			iFramePopoverOpened = true;
			iFramePopoverOpening = false;
			$('#iframe_popover_hidden').children().html('');// remove same block copied to the popover
			
	}); 
   $('#iframe_popover').on('hidden.bs.popover', function () {
			iFramePopoverOpened = false;
			iFramePopoverOpening = false;
	})
	$(document).on('click', '.cancel_popover_pc', function(e){
	 
	   $("#iframe_popover").popover('hide');
	});
	
       $(document).on('click', 'body', function(e){
			if(iFramePopoverOpened && !iFramePopoverOpening) {
				$('.iframe_popover_template').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.iframe_popover_template').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			}
		});
 
        $(document).on('click', '#missing_date_notice', function(e){
		   $(".iframe_popover_template").popover('hide');
		   $("#please_select_date_text").hide();
		   $("#iframe_date_selection").show();
			if(bookingsManager == undefined) {
			   requestBookingAvailability();
			} else {
			
			}
		});
		$("#please_select_date_").click(function() {
		  $("#please_select_date_text").hide();
		  $("#iframe_date_selection").show();
			if(bookingsManager == undefined) {
			   requestBookingAvailability();
			} else {
			
			}		  
		});
		var d = new Date();
		var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		var nd = new Date(utc + (3600000 * parseInt(document.getElementById("server_placeUTC").value)));
		 
		if (d.getDate() != nd.getDate()) {
			if(d.getTime() > nd.getTime()) {
				// Client timezone is one day higher
				DatepickerSetDate = "-1";
			} else {
				DatepickerSetDate = "+1";
			}
		}
		$("#datepicker_ub").datepicker({
			currentText: "Now",
			defaultDate: DatepickerSetDate,
			autoClose:true,
			minDate: "0d",
			showOptions: { direction: "up" },
			dateFormat: "dd M",
			onSelect: function(dateText, inst) { 
				 console.log(dateText);
				 //requestBookingAvailability(); 
				 updateSelectOptions("dropdown_start_floors","dropdown",'datepicker_ub',minPeriodSeconds);
				 updateCloseShapes();
			},
			onClose: function(dateText, inst) {
			},
			beforeShow:function(dateText, inst) {
			  $('[data-toggle="tooltip"]').tooltip("hide");
			}
		});
		$( "#datepicker_ub" ).datepicker("setDate", DatepickerSetDate);
		 
 $("#dropdown_start_floors").on('click', 'li a', function(){
     $("#book_top_start").text($(this).text());
     $("#book_start_val_").val($(this).attr("data-period"));
	 updateAvailableEndPeriods([],true);
     updateCloseShapes();
 });
 $("#dropdown_period_floors").on('click', 'li a', function(){
   $("#book_top_period").text($(this).text()); 
   $("#book_period_val_").val($(this).attr("data-period"));
   updateCloseShapes();
 });
  $("#dropdown_persons_floors").on('click', 'li a', function(){
   $("#book_top_persons").text($(this).text()); 
   $("#book_persons_val_").val($(this).attr("data-period"));
   updateCloseShapes();
 });
 $(document).on('show.bs.dropdown', function () {
  $('[data-toggle="tooltip"]').tooltip("hide");
});
$("#hazmana_iframe_button").click(function(){
		  if(bookingOrder!=null) {
             UpdateBookingModal();		  // iframe_ViewService
		     
		  }
		});

 });
 function showFloorPopoverIF(x,y,sel) {
      // update BID information
	  updateIframePopover('iframe_popover_hidden',sel);//
      $("#iframe_popover").css({'position':'absolute','top':y,'left':x}).popover({
            trigger: 'click',
            placement:'auto',
			container: 'body',
		    viewport:'#pc_iframe_wrap',
			template:'<div class="popover iframe_popover_template"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#iframe_popover_hidden').html();
            }
        }).popover('show');	  		
} 