var timelinePopoverOpened = false;
var timelinePopoverOpening = false;
var timelineAdminPopoverOpened = false;
var timelineAdminPopoverOpening = false;
var floorPopoverOpened = false;
var floorPopoverOpening = false;
$(document).ready(function() {
	$(function() {
		$("#admin_seats_add").perfectScrollbar();
		$("#add_persons_info").click(function(){
			$("#admin_reserve_user_data").modal('show');
		});
		$("#add_note_info").click(function(){
			$("#admin_reserve_free_text").modal('show');
		});
		$('#admin_reserve_free_text').on('hidden.bs.modal', function () {
			var message = $("#admin_re_free_text").val();
			if(message != ""  ) {
				$("#add_note_info").addClass("material_add_data_exists");
			} else {
				$("#add_note_info").removeClass("material_add_data_exists");
			}
		});
		$('#admin_reserve_user_data').on('hidden.bs.modal', function () {
			var name = $("#admin_re_user_name").val();
			var email = $("#admin_re_user_mail").val();
			var persons = parseInt($("#admin_re_persons").val());
			if(name!= "" || email!= "" || persons > 1) {
				$("#add_persons_info").addClass("material_add_data_exists");
			} else {
                $("#add_persons_info").removeClass("material_add_data_exists");
			}
		});
		$("#adm_re_cnt_less").click(function(){
			var curr = parseInt($("#admin_re_persons").val());
			if(curr > 1) {
				curr -=1;
				$("#admin_re_persons").val(curr);
			}
		});
		$("#adm_re_cnt_more").click(function(){
			var curr = parseInt($("#admin_re_persons").val());
			curr +=1;
			$("#admin_re_persons").val(curr);

		});
		$("#datepicker_ub").datepicker({
			currentText: "Now",
			defaultDate: DatepickerSetDate,
			autoClose:true,
			showOptions: { direction: "down" },
			dateFormat: "D ,d MM",
			onSelect: function(dateText, inst) {
				updateClosestAdminReservation(false);


			},
			onClose: function(dateText, inst) {
			}
		});
		$( "#datepicker_ub" ).datepicker("setDate", DatepickerSetDate);

		requestBookingAvailability();

		// Waiter booking controller
		$("#close_waiter_booking").click(function() {
			$("#add_booking_popup").css("right","-320px");
			for(var f = 0 ;f < floorCanvases.length ; f++) {
				floorCanvases[f].adminSeatSelect = false;

				floorCanvases[f].valid = false;
			}
			$(".adm_free_seat").remove();
			$(".adm_closed_seat").remove();
			$(".adm_saved_seat").remove();
		});
		$("#admin_add_reservation").click(function() {
			SIapplyBooking();
		});
		$("#admin_add_booking").click(function() {
			updateClosestAdminReservation();
			updateCloseShapesAdminReservation();
			$("#add_booking_popup").css("right","0px");
			for(var f = 0 ;f < floorCanvases.length ; f++) {
				floorCanvases[f].adminSeatSelect = true;
				floorCanvases[f].valid = false;
			}
		});
		$(document).on('click', '.adm_seat_remove', function(e){
			var sid = $(this).attr("id").replace(/adm_seat_remove-/,"");
			for(var f = 0 ;f < floorCanvases.length ; f++) {
               for(var s= 0; s <floorCanvases[f].shapes.length; s++ ) {
				   if(floorCanvases[f].shapes[s].sid==sid) {
					   floorCanvases[f].shapes[s].choosen = false;
					   removeFromAdminReservation(floorCanvases[f].shapes[s],floorCanvases[f].floor_name,floorCanvases[f].floorid);
					   break;
				   }
			   }
				floorCanvases[f].valid = false;
			};
		});
		$("#from_now_dropdown_period").on('click', 'li a', function(){
			$("#from_now_text").text($(this).text());
			$("#from_period_val").val($(this).attr("data-period"));
			updateAvailableEndPeriods();
			updateCloseShapesAdminReservation();
		});
		$("#admin_reserve_start_dropdown").on('click', 'li a', function(){
			$("#admin_reserve_start_text").text($(this).text());
			$("#admin_reserve_start_val").val($(this).attr("data-period"));
			updateAvailableEndPeriods();
			updateCloseShapesAdminReservation();
		});
		$("#admin_reserve_end_dropdown").on('click', 'li a', function(){
			$("#admin_reserve_end_text").text($(this).text());
			$("#admin_reserve_end_val").val($(this).attr("data-period"));
			updateCloseShapesAdminReservation();
		});
			// Bootstrap
		$('#booking_info_modal').modal({
			keyboard: false,
			show:false
		})
		$('#moving-enable').bootstrapToggle({
			on: 'Enabled',
			off: 'Disabled'
		});
		$('#moving-enable').change(function () {
			if ($(this).is(':checked')) {
				for(var f = 0 ;f < floorCanvases.length ; f++) {
					floorCanvases[f].movementEnabled = true;
					floorCanvases[f].valid = false;
				}
			} else {
				for(var f = 0 ;f < floorCanvases.length ; f++) {
					floorCanvases[f].movementEnabled = false;
					floorCanvases[f].valid = false;
				}
			}
		});
		$('.popover_single_hidden_menu').on('shown.bs.collapse', function () {
			var bidsid = $(this).attr("id").replace(/collapseOne_/,"");
			$("#dropdownMenu_pop_"+bidsid).addClass("hidden");
			$("#dropupMenu_pop_"+bidsid).removeClass("hidden");
		})
		$('#canvas_timeline_admin_popover').on('shown.bs.popover', function () {
		    timelineAdminPopoverOpened = true;
			timelineAdminPopoverOpening = false;
		     $('#canvas_popover_hidden').children().html('');// remove same block copied to the popover
			var all=document.getElementsByName("popover_overview_tmb");
			for(var x=0; x < all.length; x++) {
				updatePopoverSpots(all[x].id,'place_point_popover','popover');
			}
			$('.bookable_toggle').bootstrapToggle({
				on: 'Yes',
				off: 'No'
			});
			$('.bookable_toggle').change(function () {
					var sid = this.id.replace(/book-enable-/,""); 
					if ($(this).is(':checked')) {
						interactiveUpdateShapeBookable(sid,true);
					} else {
						interactiveUpdateShapeBookable(sid,false);
					}
			});
		    // $('#ro_from_time').datetimepicker();
		});
		$('#canvas_timeline_popover').on('shown.bs.popover', function () {
			timelinePopoverOpened = true;
			timelinePopoverOpening = false;
			$('[data-toggle="tooltip"]').tooltip();
			$('#canvas_popover_hidden').children().html('');// remove same block copied to the popover
			var all=document.getElementsByName("popover_overview_tmb");
			for(var x=0; x < all.length; x++) {
				updatePopoverSpots(all[x].id,'place_point_popover','popover');
			}
		})

		$('#booking_info_modal').on('shown.bs.modal', function (e) {
			$('[data-toggle="tooltip"]').tooltip();
			var all=document.getElementsByName("modal_overview_tmb");
			for(var x=0; x < all.length; x++) {
				updatePopoverSpots(all[x].id,'place_point_popover','modal');
			}
		})
		$('#cancelation_info_modal').on('shown.bs.modal', function (e) {
			$('[data-toggle="tooltip"]').tooltip();
			var all=document.getElementsByName("modal_overview_tmb");
			for(var x=0; x < all.length; x++) {
				updatePopoverSpots(all[x].id,'place_point_popover','modal');
			}
		})
		$('.modal').on('hide.bs.modal', function (e) {
			$('[data-toggle="tooltip"]').tooltip();
			$(".appended_modal_body").html('');
		})
		$('#alert_modal').on('show.bs.modal', function (e) {
			
		})
		
		
		$('#canvas_floors_popover').on('shown.bs.popover', function () {
			floorPopoverOpened = true;
			floorPopoverOpening = false;
			$('[data-toggle="tooltip"]').tooltip();
			$('#canvas_popover_hidden').children().html('');// remove same block copied to the popover

			$('.popover_single_hidden_menu').on('shown.bs.collapse', function () {
				var bidsid = $(this).attr("id").replace(/collapseOne_/,"");
				$("#dropdownMenu_pop_"+bidsid).addClass("hidden");
				$("#dropupMenu_pop_"+bidsid).removeClass("hidden");
			})
			$('.popover_single_hidden_menu').on('hidden.bs.collapse', function () {
				var bidsid = $(this).attr("id").replace(/collapseOne_/,"");
				$("#dropupMenu_pop_"+bidsid).addClass("hidden");
				$("#dropdownMenu_pop_"+bidsid).removeClass("hidden");

			})
			if($("#popup_scroll-max400").height() >= 300) {
				$("#popup_scroll-max400").addClass("popup_scroll_added_wrap");
				$("#popup_scroll-max400").css("height",250);
				$("#popup_scroll-max400").perfectScrollbar();
				$("#popup_scroll-max400").perfectScrollbar('update');
				$("#popup_scroll-max400").find(".ps-scrollbar-x-rail").css({"opacity":0});
				$("#popup_scroll-max400").find(".ps-scrollbar-x-rail").css({"opacity":1});
			}
		})
		$('#canvas_timeline_admin_popover').on('show.bs.popover', function () {
			timelineAdminPopoverOpening = true;

		})
		$('#canvas_timeline_admin_popover').on('hidden.bs.popover', function () {
			timelineAdminPopoverOpened = false;
			timelineAdminPopoverOpening = false;
			//tl_canvas.adminSelection = null;
			tl_canvas.valid  = false;
		})
		$('#canvas_timeline_popover').on('show.bs.popover', function () {
			timelinePopoverOpening = true;

		})
		$('#canvas_timeline_popover').on('hidden.bs.popover', function () {
			timelinePopoverOpened = false;
			timelinePopoverOpening = false;
		})
		$('#canvas_floors_popover').on('show.bs.popover', function () {
			floorPopoverOpening = true;

		})
		$('#canvas_floors_popover').on('hidden.bs.popover', function () {
			floorPopoverOpened = false;
			floorPopoverOpening = false;

		})

		$(document).on('click', 'body', function(e){
			if(floorPopoverOpened && !floorPopoverOpening) {
				$('.floor_popover_template').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.floor_popover_template').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			}			
			if(timelinePopoverOpened && !timelinePopoverOpening ) {
				$('.canvas_timeline_booking_popover_body').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.canvas_timeline_booking_popover_body').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			}
			if(timelineAdminPopoverOpened && !timelineAdminPopoverOpening) {
				$('.canvas_timeline_admin_popover_body').each(function () {
						//the 'is' for buttons that trigger popups
						//the 'has' for icons within a button that triggers a popup
						if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.canvas_timeline_admin_popover_body').has(e.target).length === 0) {
							$(this).popover('hide');
						}
				});
			}
		});
		$(document).on('shown.bs.collapse', '.notification_collapsed', function(){
			var headid = $("#"+$(this).attr("id")).attr("aria-labelledby");
			$("#"+headid).removeClass("nnb_unread");
			var bid = headid.replace(/headingOne_/,"");
			var all=document.getElementsByName("notification_overview_tmb");
			for(var x=0; x < all.length; x++) {
				var s = bid;
				if(all[x].id.indexOf(bid) > -1) {
					updateReservationSpots(all[x].id,'ovrv_dot');
				}
			}

			var newNotificationsCnt = parseInt($("#new_note_cnt").html());
			newNotificationsCnt = newNotificationsCnt-1;
			$("#new_note_cnt").html(newNotificationsCnt);
			if(newNotificationsCnt > 0) {
				$("#new_note_cnt").show();
			} else {
				$("#new_note_cnt").hide();
			}
		});
		$('.notification_collapsed').on('shown.bs.collapse', function () {
			var headid = $("#"+this.id).attr("aria-labelledby");
			$("#"+headid).removeClass("nnb_unread");
			var bid = headid.replace(/headingOne_/,"");
			var all=document.getElementsByName("notification_overview_tmb");
			for(var x=0; x < all.length; x++) {
				var s = bid;
				if(all[x].id.indexOf(bid) > -1) {
					updateReservationSpots(all[x].id,'ovrv_dot');
				}
			}

			var newNotificationsCnt = parseInt($("#new_note_cnt").html());
			newNotificationsCnt = newNotificationsCnt-1;
			$("#new_note_cnt").html(newNotificationsCnt);
			if(newNotificationsCnt > 0) {
				$("#new_note_cnt").show();
			} else {
				$("#new_note_cnt").hide();
			}
		})

		$(".timeline_page").hover(
				function() {
					$("#current_time_line").css("opacity","1");
				}, function() {
					$("#current_time_line").css("opacity","0");
					tl_canvas.lineHoverIdx = -1;
					tl_canvas.bidMouseOver = null;
					tl_canvas.valid = false;
				}
		);
		$('[data-toggle="tooltip"]').tooltip();
		
		$('.hidden_user_book_data').on('shown.bs.collapse', function () {
			var all=document.getElementsByName("book_list_scroll");
			for(var x=0; x < all.length; x++) {
				$("#"+all[x].id).perfectScrollbar('update');
			}
		})
		$('.hidden_user_book_data').on('hidden.bs.collapse', function () {
			var all=document.getElementsByName("book_list_scroll");
			for(var x=0; x < all.length; x++) {
				$("#"+all[x].id).perfectScrollbar('update');
			}
		});
	
	});
});


function showPopover(x,y,tl_canvas_selection,type) {
    // update BID information
  switch (type) {
    case 'booking_selection':  
	  updateBidDataOnPopover('canvas_popover_hidden',tl_canvas_selection);// waiterViewService.js
      $("#canvas_timeline_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
            trigger: 'click',
            placement:'auto',
			container: 'body',
			template:'<div class="popover canvas_timeline_booking_popover_body"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');	
		break;
    case 'admin_selection': 
	 updateAdminSelectionPopover('canvas_popover_hidden',tl_canvas_selection);// waiterViewService.js
      $("#canvas_timeline_admin_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
            trigger: 'click',
            placement:'right',
			container: 'body',
			template:'<div class="popover canvas_timeline_admin_popover_body"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');	
		break;
	 case 'admin_reserved':
		 updateBidDataOnPopover('canvas_popover_hidden',tl_canvas_selection);// waiterViewService.js
		 $("#canvas_timeline_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
			 trigger: 'click',
			 placement:'auto',
			 container: 'body',
			 template:'<div class="popover canvas_timeline_booking_popover_body"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			 html: true,
			 content: function() {
				 return $('#canvas_popover_hidden').html();
			 }
		 }).popover('show');
		 break;
	case 'line_popover': 
	  updateAdminLinePopover('canvas_popover_hidden',tl_canvas_selection);// waiterViewService.js
      $("#canvas_timeline_admin_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
            trigger: 'click',
            placement:'right',
			container: 'body',
			template:'<div class="popover canvas_timeline_admin_popover_body"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');
		break;
  }
}

function showFloorPopover(x,y,bidsid) {
      // update BID information
	  updateFloorSidDataOnPopover('canvas_popover_hidden',bidsid);// bookingListManagement_wa.js
      $("#canvas_floors_popover").css({'position':'absolute','top':y,'left':x+30}).popover({
            trigger: 'click',
            placement:'right',
			container: 'body',
			template:'<div class="popover floor_popover_template"   role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			html: true, 
	        content: function() {
              return $('#canvas_popover_hidden').html();
            }
        }).popover('show');
}

function SingleBookingButton(type,bidsid,vars) {
  console.log("TBD clicked:"+type+","+bidsid);
   $('.hidden_pop_btns').tooltip('destroy');
   $('.mat_bl_hid').tooltip('destroy');
   $('#canvas_floors_popover').popover('hide');
   $('#canvas_timeline_popover').popover('hide');
   var bid = "";
   var sid = "";
  if(bidsid.indexOf('_BS_') > -1) {
     var bidsid = bidsid.replace(/pin_id_/,"").split("_BS_");
 	 bid = bidsid[0];
 	 sid = bidsid[1];
  } else {
     bid = bidsid;
  }
  
  switch (type) {
    case 'change_place':  
    case 'info': 
	   $(".modal").modal('hide');
	   updateOnclickModal('booking_info',bid);
	   $('#booking_info_modal').modal('show');
	   break;
	case 'timeline':  
	   highlightTimeline(bid);
	   break;
    case 'cancel': 
	    $(".modal").modal('hide');
	    updateOnclickModal('cancelation_info',bid);
	    $('#cancelation_info_modal').modal('show');
		break;
	case 'finished': 
       	
    case 'not_attended': 
	    $(".modal").modal('hide');
	    updateOnclickModal('not_attended',bid);
	    $('#not_attended_modal').modal('show');
		break;
	case 'show_on_place': 
       	highlightSids(bid); 
		break;
    case 'notification_add': 
	case 'notification_show_on_timeline': 
	case 'set_reserved':
	    addAdminReservationInteractive(sid);
		break;
	case 'cancel_reserved':
	    removeAdminReservationInteractive(bid,sid);
		break;
	case 'open_message_modal': 
	    $(".modal").modal('hide');
	    var hasemail = updateMessageModal(bid);
			if(hasemail == true) {
				$('#contact_email_modal').modal('show');

			} else {
				alert("No eMail Provided")
			}
		break;
	case 'send_message': 
	    sendMessageFromModal(vars);
		break;
  }
}