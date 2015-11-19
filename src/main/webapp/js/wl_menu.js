var timelinePopoverOpened = false;
var timelinePopoverOpening = false;
var floorPopoverOpened = false;
var floorPopoverOpening = false;
$(document).ready(function() {
	$(function() {


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
			console.log('called');
			$('[data-toggle="tooltip"]').tooltip();
			$(".appended_modal_body").html('');
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
			if((timelinePopoverOpened && !timelinePopoverOpening)||(floorPopoverOpened && !floorPopoverOpening)) {
				$('[data-toggle="popover"]').each(function () {
					//the 'is' for buttons that trigger popups
					//the 'has' for icons within a button that triggers a popup
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
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
		})
		$("#bokbtn_next").click(function(){
			$(".bookings_buttons_").removeClass("selected_bb");
			$("#"+this.id).addClass("selected_bb");
			$(".book_list_").hide();
			$("#book_list_next").show();
			$("#book_list_next").perfectScrollbar('update');
		});
		$("#bokbtn_current").click(function(){
			$(".bookings_buttons_").removeClass("selected_bb");
			$("#"+this.id).addClass("selected_bb");
			$(".book_list_").hide();
			$("#book_list_current").show();
			$("#book_list_current").perfectScrollbar('update');
		});
		$("#bokbtn_past").click(function(){
			$(".bookings_buttons_").removeClass("selected_bb");
			$("#"+this.id).addClass("selected_bb");
			$(".book_list_").hide();
			$("#book_list_past").show();
			$("#book_list_past").perfectScrollbar('update');
		});
		$(".mv_top_tab").click(function(){
			var fid = this.id.replace(/floor_tab_mv_/,"");
			canvas_ = floorid2canvas[fid];
			$(".mv_top_tab").removeClass("mv_top_selected");
			$("#"+this.id).addClass("mv_top_selected");
			$(".floor_page").hide();
			$("#floor_wrap_view_"+fid).show();
		});
		$("#floors_open").click(function(){
			$(".wl_left_menu_button_w").removeClass("wll_selected");
			$(".wl_bottom_menu_button_w").removeClass("wll_selected");
			$("#"+this.id).addClass("wll_selected");
			$(".data_pages_").hide();
			$("#floors_page").show();
		});
		$("#timeline_open").click(function(){
			$(".wl_left_menu_button_w").removeClass("wll_selected");
			$(".wl_bottom_menu_button_w").removeClass("wll_selected");
			$("#"+this.id).addClass("wll_selected");
			$(".data_pages_").hide();
			$("#timeline_page").show();
			console.log("timel");
		});
		$("#settings_open").click(function(){
			$(".wl_left_menu_button_w").removeClass("wll_selected");
			$(".wl_bottom_menu_button_w").removeClass("wll_selected");
			$("#"+this.id).addClass("wll_selected");
			$(".data_pages_").hide();
			$("#settings_page").show();
		});
		$("#new_reservations").click(function() {
			$(".wl_left_menu_button_w").removeClass("wll_selected");
			$(".wl_bottom_menu_button_w").removeClass("wll_selected");
			$("#"+this.id).addClass("wll_selected");
			$(".data_pages_").hide();
			$("#notifications_page").show();
		});
		$('#timeline_canvas').contextMenu('#wl_menu',{
			// Randomly enable or disable each option
			constrainToScreen:true,
			beforeShow: function() {
				if(tl_canvas.selection != null) {
					if (tl_canvas.listSelected.length == 1) {
						$(".only_booking_menu").show();
						$(".wl_menu_option").show();
						$("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
						$("#info_menu_bid_option").html("BookID: "+tl_canvas.bidMouseOver);
						$("#info_menu_bid_option").css("color","rgb(115, 255, 117)");
					} else {
						if(tl_canvas.sameInList == null) {
							$(".only_booking_menu").hide();
							$(".wl_menu_option").hide();
							$("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
							$("#info_menu_bid_option").html("BookID: "+tl_canvas.bidMouseOver);
							$("#info_menu_bid_option").css("color","rgb(115, 255, 117)");
						} else {
							$(".only_booking_menu").hide();
							$(".wl_menu_option").hide();
							$(".only_list_menu").show();
							$("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
							$("#info_menu_bid_option").html("BookID: "+tl_canvas.bidMouseOver);
							$("#info_menu_bid_option").css("color","rgb(115, 255, 117)");
						}
					}
					$("#wl_select_on_floor").show();
					$("#wlm_open_details").show();
				} else {
					$(".only_booking_menu").hide();
					if (tl_canvas.closeSelcted != null) {
						$("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
						$("#info_menu_bid_option").html("PLACE CLOSED");
						$("#info_menu_bid_option").css("color","black");
					} else {
						$("#info_menu_line_option").html(""+tl_canvas.hoverSidName);
						$("#info_menu_bid_option").html("NO BOOKINGS");
						$("#info_menu_bid_option").css("color","red");
					}
					$("#wl_select_on_floor").show();
				}
			}
		});
	});

	$(".shown_user_book_data").click(function(){
		var id_ = $(this).attr("id");
	});
	// DATEPICKER -------------------------------------
	var placeUTCOffsetGlobal = document.getElementById("server_placeUTC").value;
	var d = new Date();
	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = new Date(utc + (3600000 * parseInt(placeUTCOffsetGlobal)));
	var DatepickerSetDate = "+0";
	if (d.getDate() != nd.getDate()) {
		if(d.getTime() > nd.getTime()) {
			// Client timezone is one day higher
			DatepickerSetDate = "-1";
		} else {
			DatepickerSetDate = "+1";
		}
	}
	$("#datepicker_wl_from").datepicker({
		currentText: "Now",
		defaultDate: DatepickerSetDate,
		autoClose:true,
		dateFormat: "dd/mm/yy",
		onSelect: function(dateText, inst) {
			//alert("ONSELECT:"+dateText);
			//requestWlBookings();
		},
		onClose: function(dateText, inst) {
		}
	});
	$( "#datepicker_wl_from" ).datepicker("setDate", DatepickerSetDate);

	$("#datepicker_wl_bottom").datepicker({
		currentText: "Now",
		defaultDate: DatepickerSetDate,
		autoClose:true,
		dateFormat: "D ,d MM",
		onSelect: function(dateText, inst) {
			requestWlBookings();
			updateBookingListRange();
		},
		onClose: function(dateText, inst) {
		}
	});
	$( "#datepicker_wl_bottom" ).datepicker("setDate", DatepickerSetDate);
	updateBookingListRange();


	//-------------------------------------------------
	$("#wl_up").click(function(){
		tl_canvas.selectedUP();
	});
	$("#wl_down").click(function(){
		tl_canvas.selectedDown();
	});
	$("#wl_top").click(function(){
		tl_canvas.selectedTop();
	});
	$("#wl_bottom").click(function(){
		tl_canvas.selectedBottom();
	});
	$("#wlm_highlight_same_order").click(function(){
		tl_canvas.selectSameBooking();
	});
	$("#wlm_open_details").click(function(){
		tl_canvas.openDetails();
	});

	$("#wl_select_on_floor").click(function(){
		tl_canvas.selectPlaces();
	});

	$('#wl_bookings_current').change(function() {
		if($(this).is(":checked")) {
			$("#wl_list_current_list_row").show();
		} else {
			$("#wl_list_current_list_row").hide();
		}
	});
	$('#wl_bookings_next').change(function() {
		if($(this).is(":checked")) {
			$("#wl_list_next_list_row").show();
		} else {
			$("#wl_list_next_list_row").hide();
		}
	});
	$('#wl_bookings_past').change(function() {
		if($(this).is(":checked")) {
			$("#wl_list_past_list_row").show();
		} else {
			$("#wl_list_past_list_row").hide();
		}
	});
	$("#open_bookings_list_btn").click(function(){
		$(this).hide();
		$("#transition_open").addClass("wl_list_show");
		$("#transition_open").removeClass("wl_list_hide");
	});
	$("#close_transition_bookings").click(function(){
		$("#transition_open").addClass("wl_list_hide");
		$("#transition_open").removeClass("wl_list_show");
		$("#open_bookings_list_btn").show();
	});
	$(window).resize(function () {
		waitForFinalEvent(function(){
			// applyPosition() ;
			updatePageDimentions();
			ApplyInitialPosition();
			// Update Opened notification placements
			var all=document.getElementsByName("notification_overview_tmb");
			for(var x=0; x < all.length; x++) {
				updateReservationSpots(all[x].id,'ovrv_dot');
			}
			//...
		}, 500, "some unique string");
	});
	$('#view_options_btn_dropit').dropit();
	$(".vo_wrap_div").click(function(){

		var id_ = $(this).attr('id');
		if(id_=="t100x100") {
			var cp = positionmanager.currentPosition;
			cp.top_perc = 100;
			cp.bot_perc = 0;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 0;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.timeline;
			cp.idtright = null;
			cp.idbleft = null;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="af100x100") {
			var cp = positionmanager.currentPosition;
			cp.top_perc = 100;
			cp.bot_perc = 0;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 0;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.allfloors;
			cp.idtright = null;
			cp.idbleft = null;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="t50xaf50") {
			var cp = positionmanager.currentPosition;
			cp.top_perc = 50;
			cp.bot_perc = 50;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 100;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.timeline;
			cp.idtright = null;
			cp.idbleft = positionmanager.allfloors;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="t50xf50f50") {
			var cp = positionmanager.currentPosition;
			var proposal = calcfloorssize("horisontal",getAvailable(true,cp.right_width),1)
			var floorsH = parseInt(proposal.proposed);
			var totalH = getAvailable(false,cp.right_width);
			if(floorsH > 0.6 * totalH) {
				floorsH = 0.6 * totalH;
			}
			var floorsPerc = 100 * floorsH / totalH;
			var timePerc = 100 - floorsPerc;
			cp.top_perc = timePerc;
			cp.bot_perc = floorsPerc;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			for(var f = 0 ;f < floorCanvases.length ; f++) {
				if(floorCanvases[f].mainfloor) {
					var floorID= floorCanvases[f].floorid;
					for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
							cp.botleft_perc = parseInt(proposal.flist[v].perc);
							cp.idbleft = positionmanager.floors[floorID];
						}
					}
				} else {
					var floorID= floorCanvases[f].floorid;
					for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
							cp.botright_perc = parseInt(proposal.flist[v].perc);
							cp.idbright  = positionmanager.floors[floorID];
						}
					}
				}
			}
			//cp.botleft_perc = ?;
			//cp.botright_perc = ?;
			cp.idtleft = positionmanager.timeline;
			cp.idtright = null;
			//cp.idbleft = positionmanager.allfloors;
			//cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="af100xt100") {
			var cp = positionmanager.currentPosition;
			cp.top_perc = 50;
			cp.bot_perc = 50;
			cp.topleft_perc = 100;
			cp.topright_perc = 0;
			cp.botleft_perc = 100;
			cp.botright_perc = 0;
			cp.idtleft = positionmanager.allfloors;
			cp.idtright = null;
			cp.idbleft = positionmanager.timeline;
			cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		} else if (id_=="f50f50xt100") {
			var cp = positionmanager.currentPosition;
			var proposal = calcfloorssize("horisontal",getAvailable(true,cp.right_width),1)
			var floorsH = parseInt(proposal.proposed);
			var totalH = getAvailable(false,cp.right_width);
			if(floorsH > 0.6 * totalH) {
				floorsH = 0.6 * totalH;
			}
			var floorsPerc = 100 * floorsH / totalH;
			var timePerc = 100 - floorsPerc;
			cp.top_perc = floorsPerc;
			cp.bot_perc = timePerc;
			cp.botleft_perc = 100;
			cp.topright_perc = 0;
			for(var f = 0 ;f < floorCanvases.length ; f++) {
				if(floorCanvases[f].mainfloor) {
					var floorID= floorCanvases[f].floorid;
					for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
							cp.topleft_perc = parseInt(proposal.flist[v].perc);
							cp.idtleft = positionmanager.floors[floorID];
						}
					}
				} else {
					var floorID= floorCanvases[f].floorid;
					for (var v = 0; v < proposal.flist.length ; v++) {
						if(proposal.flist[v].floorid == floorID) {
							cp.topright_perc = parseInt(proposal.flist[v].perc);
							cp.idtright  = positionmanager.floors[floorID];
						}
					}
				}
			}
			//cp.botleft_perc = ?;
			//cp.botright_perc = ?;
			cp.idbleft = positionmanager.timeline;
			cp.idbright = null;
			//cp.idbleft = positionmanager.allfloors;
			//cp.idbright = null;
			positionmanager.currentPosition = cp;
			applyPosition() ;
		}
	});
	$("#show_bookins_row_btn").click(function(){
		if($("#bookings_col_enable").is(":checked")) {
			positionmanager.currentPosition.right_width = 0;
			applyPosition() ;
			$("#transition_open").addClass("wl_list_hide");
			$("#transition_open").removeClass("wl_list_show");
			$("#open_bookings_list_btn").show();
			$("#close_transition_bookings").show();
			$('#bookings_col_enable').prop('checked', false);
			$('#show_bookins_row_btn').html('Show bookings');
		} else {
			positionmanager.currentPosition.right_width = 360;
			applyPosition() ;
			$("#open_bookings_list_btn").hide();
			$("#transition_open").addClass("wl_list_show");
			$("#transition_open").removeClass("wl_list_hide");
			$("#close_transition_bookings").hide();
			$('#bookings_col_enable').prop('checked', true);
			$('#show_bookins_row_btn').html('Hide bookings');

		}
	});
});
function floorAppend(appendTo_,singleBoth,singleFloorID,temp) {

	var appendToWidth = $("#"+appendTo_).width() ;
	var appendToHeight = $("#"+appendTo_).height() ;
	var temp_ = false;
	if(temp!= undefined && temp == true) {
		temp_ = true;
	}
	if(singleBoth) {
		var canvas_ref;
		var floor_ind;
		for (var f = 0 ;f < floorCanvases.length ; f++) {
			if(singleFloorID == floorCanvases[f].floorid) {
				canvas_ref = floorCanvases[f];
				floor_ind = f;
			}
		}

		if(temp_) {
			// Move to temp
			$('#'+appendTo_).append( $('#div_wrap-canvas_'+singleFloorID) );
			return;
		} else {
			if(document.getElementById("canvas_appended_wrapper-"+singleFloorID) != null) {
				if(floorid2canvas[singleFloorID].mainfloor) {
					$("#"+appendTo_).show();
				} else {
					$("#"+appendTo_).hide();
				}
				// Element already exists
				$("#"+appendTo_).append($("#canvas_appended_wrapper-"+singleFloorID));
			} else {
				// Create initial

				var appendData ="<div id='canvas_appended_wrapper-"+singleFloorID+"' class='canvas_shown_wrapper'></div>";
				$("#"+appendTo_).append(appendData);
				appendData ='<div class="zoom_options_book">';
				appendData +='<div id="plus_minus_wrap">';
				appendData +='   <div id="zoom_plus_div" onclick="sizeUp(floorCanvases['+floor_ind+'])" title="Zoom-In">+</div>';
				appendData +='  <div id="zoom_split"></div>';
				appendData +='  <div id="zoom_minus_div"  onclick="sizeDown(floorCanvases['+floor_ind+'])"  title="Zoom-Out">-</div>';
				appendData +=' </div>';
				appendData +='<div id="zoom_reset_div" onclick="zoomResetWrap(floorCanvases['+floor_ind+'],\'canvas_appended_wrapper-'+singleFloorID+'\',\'canvas_wrap_not_scroll_conf-'+singleFloorID+'\')"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>';
				appendData +='</div>';
				$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);

				appendData =' <div id="canvas_wrap_not_scroll_conf-'+singleFloorID+'" class="canvas_wrap_not_scroll_conf"></div>';
				$("#canvas_appended_wrapper-"+singleFloorID).append(appendData);
				canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-"+singleFloorID;
			}
		}




		$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("width",appendToWidth );
		$("#canvas_wrap_not_scroll_conf-"+singleFloorID).css("height",appendToHeight );
		$('#canvas_wrap_not_scroll_conf-'+singleFloorID).append( $('#div_wrap-canvas_'+singleFloorID) );
		zoomResetWrap(floorCanvases[floor_ind],'canvas_appended_wrapper-'+singleFloorID,'canvas_wrap_not_scroll_conf-'+singleFloorID);

	} else {
		var canvas_ref;
		var floor_ind;

		if(temp_) {
			for (var f = 0 ;f < floorCanvases.length ; f++) {
				$('#'+appendTo_).append( $('#div_wrap-canvas_'+floorCanvases[f].floorid) );
			}
			return;
		} else {
			if(document.getElementById("canvas_appended_wrapper-both") != null) {
				$("#"+appendTo_).append($("#canvas_appended_wrapper-both"));
			} else {
				var appendData ="<div id='canvas_appended_wrapper-both' class='canvas_shown_wrapper'></div>";
				$("#"+appendTo_).append(appendData);

				appendData ='<div class="zoom_options_book">';
				appendData +='<div id="plus_minus_wrap">';
				appendData +='   <div id="zoom_plus_div" onclick="sizeUp(canvas_)" title="Zoom-In">+</div>';
				appendData +='  <div id="zoom_split"></div>';
				appendData +='  <div id="zoom_minus_div"  onclick="sizeDown(canvas_)"  title="Zoom-Out">-</div>';
				appendData +=' </div>';
				appendData +='<div id="zoom_reset_div" onclick="zoomResetWrap(canvas_,\'canvas_appended_wrapper-both\',\'canvas_wrap_not_scroll_conf-both\')"><div class="material-icons zoom_reset_mat"  title="Zoom-Reset">fullscreen</div></div>';

				appendData +='</div>';
				$("#canvas_appended_wrapper-both").append(appendData);
				appendData ="<div class='floor_single_name_wrap' id='floor_buttons_wrap'></div>";
				$("#canvas_appended_wrapper-both").append(appendData);

				for (var f = 0 ;f < floorCanvases.length ; f++) {
					canvas_ref = floorCanvases[f];
					appendData ='<div class="floor_single_name_click" onclick="selectFloorByID(\''+canvas_ref.floorid+'\')">'+canvas_ref.floor_name+'</div>';
					$("#floor_buttons_wrap").append(appendData);
				}

				appendData =' <div id="canvas_wrap_not_scroll_conf-both" class="canvas_wrap_not_scroll_conf"></div>';
				$("#canvas_appended_wrapper-both").append(appendData);
				for (var f = 0 ;f < floorCanvases.length ; f++) {
					canvas_ref = floorCanvases[f];
					canvas_ref.scrollID = "canvas_wrap_not_scroll_conf-both";
				}
			}
		}


		$("#canvas_wrap_not_scroll_conf-both").css("width",appendToWidth );
		$("#canvas_wrap_not_scroll_conf-both").css("height",appendToHeight );
		for (var f = 0 ;f < floorCanvases.length ; f++) {
			canvas_ref = floorCanvases[f];
			$('#canvas_wrap_not_scroll_conf-both').append( $('#div_wrap-canvas_'+canvas_ref.floorid) );
		}
		for (var f = 0 ;f < floorCanvases.length ; f++) {
			canvas_ref = floorCanvases[f];
			if(canvas_ref.mainfloor == true) {
				$('#div_wrap-canvas_'+canvas_ref.floorid).show();
				zoomResetWrap(canvas_ref,'canvas_appended_wrapper-both','canvas_wrap_not_scroll_conf-both');
				canvas_ = canvas_ref;
			} else {
				$('#div_wrap-canvas_'+canvas_ref.floorid).hide();
			}
		}
	}
}
function selectFloorByID(floorID) {
	for (var f = 0 ;f < floorCanvases.length ; f++) {
		canvas_ref = floorCanvases[f];
		if(canvas_ref.floorid == floorID) {
			$('#div_wrap-canvas_'+canvas_ref.floorid).show();
			zoomResetWrap(canvas_ref,'canvas_appended_wrapper-both','canvas_wrap_not_scroll_conf-both');
			canvas_ = canvas_ref;
		} else {
			$('#div_wrap-canvas_'+canvas_ref.floorid).hide();
		}
	}
}

function appendTimeline(appendTo_) {
	var appendToWidth = $("#"+appendTo_).width();
	var appendToHeight = $("#"+appendTo_).height();

	var canvasHeight = appendToHeight - 50 ;
	var buttonsWidth =  430 ;
	$('#timeline_canvas').css("height",canvasHeight+"px");
	$('#timeline_canvas').css("width",appendToWidth+"px");
	document.getElementById('timeline_canvas').height = canvasHeight;
	document.getElementById('timeline_canvas').width = appendToWidth ;
	$("#"+appendTo_).css("position","relative");
	$('#'+appendTo_).append($('#canvas_timeline_div'));
	$('#'+appendTo_).append($('#timeline_buttons_wrap'));
	$('#'+appendTo_).append($('#canvas_slimscroll'));

	tl_canvas.width = appendToWidth ;
	tl_canvas.height = canvasHeight;
	tl_canvas.origHeight = canvasHeight;
	tl_canvas.origHeightReset = canvasHeight;
	tl_canvas.lineReset();
	var ctw = parseInt($('#timeline_canvas').outerWidth()) ;

	$(".slimScrollDiv").remove();
	console.log(ctw);
	$('#canvas_slimscroll').slimScroll({
		position: 'right',
		height: canvasHeight + 'px',
		width:ctw,
		railVisible: true,
		size: '10px',
	});
	$('#canvas_slimscroll').css('height',canvasHeight+"px");
	$('#canvas_slimscroll').css('width',appendToWidth +"px");
	timelinediv.updateNowTime();
}


function applyPosition() {
	var currentPosition = positionmanager.currentPosition;
	organizeViews (currentPosition.top_perc ,
			currentPosition.bot_perc ,
			currentPosition.right_width,
			currentPosition.topleft_perc ,
			currentPosition.topright_perc ,
			currentPosition.botleft_perc ,
			currentPosition.botright_perc ,
			currentPosition.idtleft ,
			currentPosition.idtright ,
			currentPosition.idbleft ,
			currentPosition.idbright );
}
function ApplyInitialPosition() {
	// positionmanager
	// Create view objects
	positionmanager.floors = {};
	for (f= 0 ; f < floorCanvases.length ; f++) {
		var flist_ = {};
		flist_.floorid = floorCanvases[f].floorid;
		flist_.single = true;
		flist_.timeline = false;
		positionmanager.floors[flist_.floorid] = flist_;
		floorAppend("floor_wrap_view_"+floorCanvases[f].floorid,true,floorCanvases[f].floorid);
	}
}

//var currentPosition.timeline = "id"
//var currentPosition.floorid{fid} = "id";
//var gridObj = {};
//gridObj.timeline = true;
//gridObj.single = true;
//gridObj.floorid = "floorid";
function getAvailable(width,right_width) {
	var browserHeight = window.innerHeight;
	var browserWidth = window.innerWidth;
	var leftColumnWidth = document.getElementById("left_column__").offsetWidth;
	var headerHeight = document.getElementById("header_td").offsetHeight;
	var buttonsRowHeight = document.getElementById("content_header_row").offsetHeight;
	// assignments
	var rightColumnWidth = right_width;
	if(width) {
		var availableWidth = browserWidth - leftColumnWidth - rightColumnWidth;
		return availableWidth;
	} else {
		var availableHeight = browserHeight - headerHeight - buttonsRowHeight;
		return availableHeight;
	}
}
function organizeViews (top_perc , bot_perc ,right_width,topleft_perc , topright_perc , botleft_perc , botright_perc , idtleft , idtright , idbleft , idbright ) {
	console.log("top_perc="+top_perc+",bot_perc:"+bot_perc+",right_width:"+right_width+",topleft_perc:"+topleft_perc+",topright_perc:"+topright_perc+",botleft_perc:"+botleft_perc+",botright_perc:"+botright_perc);
	var browserHeight = window.innerHeight;
	var browserWidth = window.innerWidth;
	// move to temp
	appendTimeline("temp_appends"); // timeline
	floorAppend("temp_appends",false,"",true); // all floors only wrappers
	$("#content_top_left_cell").html("");
	$("#content_top_right_cell").html("");
	$("#content_bottom_left_cell").html("");
	$("#content_bottom_right_cell").html("");
	//
	var leftColumnWidth = document.getElementById("left_column__").offsetWidth;
	var headerHeight = document.getElementById("header_td").offsetHeight;
	var buttonsRowHeight = document.getElementById("content_header_row").offsetHeight;
	// assignments
	var rightColumnWidth = right_width;
	document.getElementById("content_td_ac_wl").style.width = browserWidth - leftColumnWidth - 2;
	document.getElementById("content_td_ac_wl").style.height = browserHeight - headerHeight - buttonsRowHeight;
	document.getElementById("right_column_like").style.width = right_width + "px";//content_td_ac_wl

	var availableWidth = browserWidth - leftColumnWidth - rightColumnWidth;
	var availableHeight = browserHeight - headerHeight - buttonsRowHeight;
	document.getElementById("center_column_like").style.width = availableWidth;
	document.getElementById("center_column_like").style.height = availableHeight;
	document.getElementById("content_top_row").style.height = (top_perc==0)?"0px":parseInt(0.01 * top_perc * availableHeight)   + "px";
	document.getElementById("content_bottom_row").style.height = (bot_perc==0)?"0px":parseInt(0.01 * bot_perc * availableHeight)   + "px";
	document.getElementById("content_top_left_cell").style.width = (topleft_perc==0)?"0px":parseInt(0.01 * topleft_perc * availableWidth)   + "px";
	document.getElementById("content_top_right_cell").style.width = (topright_perc==0)?"0px":parseInt(0.01 * topright_perc * availableWidth)   + "px";
	document.getElementById("content_bottom_left_cell").style.width = (botleft_perc==0)?"0px":parseInt(0.01 * botleft_perc * availableWidth)  + "px";
	document.getElementById("content_bottom_right_cell").style.width = (botright_perc==0)?"0px":parseInt(0.01 * botright_perc * availableWidth) + "px";
	if (bot_perc == 0) {
		if(topright_perc == 0) {
			//ONLY: idtleft
			if (idtleft.timeline == true) {
				appendTimeline("content_top_left_cell");

			} else {
				if(idtleft.single == true) {
					floorAppend("content_top_left_cell",true,idtleft.floorid);
				} else {
					floorAppend("content_top_left_cell",false,"");
				}
			}
		} else {
			if (idtleft.timeline == true) {
				appendTimeline("content_top_left_cell");
			} else {
				if(idtleft.single == true) {
					floorAppend("content_top_left_cell",true,idtleft.floorid);
				} else {
					floorAppend("content_top_left_cell",false,"");
				}
			}
			if (idtright.timeline == true) {
				appendTimeline("content_top_right_cell");
			} else {
				if(idtright.single == true) {
					floorAppend("content_top_right_cell",true,idtright.floorid);
				} else {
					floorAppend("content_top_right_cell",false,"");
				}
			}
		}
	} else {
		if(topright_perc == 0) {
			//ONLY: idtleft ,
			if (idtleft.timeline == true) {
				appendTimeline("content_top_left_cell");
			} else {
				if(idtleft.single == true) {
					floorAppend("content_top_left_cell",true,idtleft.floorid);
				} else {
					floorAppend("content_top_left_cell",false,"");
				}
			}
		} else {
			//ONLY: idtleft , idtright , idbleft , [idbright]
			if (idtleft.timeline == true) {
				appendTimeline("content_top_left_cell");
			} else {
				if(idtleft.single == true) {
					floorAppend("content_top_left_cell",true,idtleft.floorid);
				} else {
					floorAppend("content_top_left_cell",false,"");
				}
			}
			if (idtright.timeline == true) {
				appendTimeline("content_top_right_cell");
			} else {
				if(idtright.single == true) {
					floorAppend("content_top_right_cell",true,idtright.floorid);
				} else {
					floorAppend("content_top_right_cell",false,"");
				}
			}
		}
		if(botright_perc == 0) {
			//ONLY:  idbleft
			if (idbleft.timeline == true) {
				appendTimeline("content_bottom_left_cell");
			} else {
				if(idbleft.single == true) {
					floorAppend("content_bottom_left_cell",true,idbleft.floorid);
				} else {
					floorAppend("content_bottom_left_cell",false,"");
				}
			}
		} else {
			//ONLY: idtleft , [idtright] , idbleft , idbright
			if (idbleft.timeline == true) {
				appendTimeline("content_bottom_left_cell");
			} else {
				if(idbleft.single == true) {
					floorAppend("content_bottom_left_cell",true,idbleft.floorid);
				} else {
					floorAppend("content_bottom_left_cell",false,"");
				}
			}
			if (idbright.timeline == true) {
				appendTimeline("content_bottom_right_cell");
			} else {
				if(idbright.single == true) {
					floorAppend("content_bottom_right_cell",true,idbright.floorid);
				} else {
					floorAppend("content_bottom_right_cell",false,"");
				}
			}
		}
	}
}
// fdist = {};
// fdist.horver = "horisontal"/"vertical"
// fdist.op = proposed;
// fdist.flist = [];
// fdist.flist[i] = {};
// fdist.flist[i].floorid = floorid;
// fdist.flist[i].w = width;
// fdist.flist[i].h = height;
// fdist.flist[i].wh = width/height;
// fdist.flist[i].perc = perc;
// fdist.flist[i].hw = height/width;
function calcfloorssize (horisontal,available,padding) {
	fdist = {};
	fdist.horver = horisontal;
	fdist.flist = [];
	var minWidth = 10000;
	var minHeight = 10000;
	var maxWidth = 0;
	var maxHeight = 0;
	var totalWH = 0;
	var totalHW = 0;
	for (f= 0 ; f < floorCanvases.length ; f++) {
		var flist_ = {};
		flist_.floorid = floorCanvases[f].floorid;
		flist_.w = floorCanvases[f].origWidth;
		flist_.h = floorCanvases[f].origHeight;
		flist_.wh = flist_.w/flist_.h;
		totalWH+=flist_.wh;
		flist_.hw = flist_.h/flist_.w;
		totalHW+= flist_.hw;
		if (flist_.w < minWidth) {minWidth = flist_.w;}
		if (flist_.w > maxWidth) {maxWidth = flist_.w;}
		if (flist_.h < minWidth) {minHeight = flist_.h;}
		if (flist_.h > maxWidth) {maxHeight = flist_.h;}
		fdist.flist.push(flist_);
	}
	if (horisontal == "horisontal") {
		var proposedH = (available - floorCanvases.length * padding )/totalWH;
		for (f= 0 ; f < fdist.flist.length ; f++) {
			fdist.flist[f].perc =100*proposedH*fdist.flist[f].wh/(available  - floorCanvases.length * padding );
		}
		fdist.proposed = proposedH ;
	} else {

	}
	return fdist;
}
function updatePageDimentions() {
	var browserHeight = window.innerHeight;
	var browserWidth = window.innerWidth;

	$("#wa_left_column").css("width",70+"px");
	$("#wa_left_column").css("height",browserHeight-70+"px");
	$("#bottom_buttons_td").css("height",70+"px");
	$("#content_td_wl").css("width",browserWidth-70+"px");
	$("#content_td_wl").css("height",browserHeight-70+"px");
	$("#bookings_right_div").css("width",300+"px");
	$("#main_views_div").css("width",$("#content_td_wl").width() - $("#bookings_right_div").outerWidth()+"px");
	$("#main_views_div").css("height",$("#content_td_wl").height() + "px");

	$("#floors_page").css("width",$("#main_views_div").width()+"px");
	$("#floors_page").css("height",$("#main_views_div").height()+"px");
	$("#settings_page").css("width",$("#main_views_div").width()+"px");
	$("#settings_page").css("height",$("#main_views_div").height()+"px");
	$("#timeline_page").css("width",$("#main_views_div").width()+"px");
	$("#timeline_page").css("height",$("#main_views_div").height()+"px");
	$(".data_pages_").css("height",$("#main_views_div").height()+"px");

	$("#book_tabs_wrap").css("height",$("#main_views_div").height() - $("#bk_top_tabs").outerHeight()+"px");
	$(".floor_page").css("height",$("#floors_page").height() - $("#mv_top_tabs").outerHeight() +"px");
	$(".floor_page").css("width",$("#main_views_div").width()+"px");
	$(".timeline_page").css("height",$("#timeline_page").height() - $("#timeline_top_tabs").outerHeight() +"px");
	$(".timeline_page").css("width",$("#timeline_page").width()+"px");
	$("#timeline_horisontal_inner").css("height",$("#timeline_page").height() - $("#timeline_top_tabs").outerHeight()  +"px");
	$("#timeline_horisontal_inner").css("width",$("#timeline_page").width() +"px");
	$(".settings_page").css("height",$("#settings_page").height() - $("#settings_top_tabs").outerHeight() +"px");
	$(".settings_page").css("width",$("#settings_page").width()+"px");
	$(".book_list_").css("height",$("#book_tabs_wrap").height() - $("#bookings_list_page_head").outerHeight(true)-$("#list_time_range").outerHeight(true)+"px");
	var all=document.getElementsByName("book_list_scroll");
	for(var x=0; x < all.length; x++) {
		$("#"+all[x].id).perfectScrollbar();
		$("#"+all[x].id).perfectScrollbar('update');
		$("#"+all[x].id).find(".ps-scrollbar-x-rail").css({"opacity":0});
	}
	appendTimeline("timeline_horisontal_inner");

	$("#notifications_page_data_new_booking").perfectScrollbar();
	$("#notifications_page_data_new_booking").perfectScrollbar('update');
	$("#notifications_page_data_new_booking").find(".ps-scrollbar-x-rail").css({"opacity":0});
	$("#notifications_page_data_new_booking").find(".ps-scrollbar-y-rail").css({"opacity":0});
}
function toggleFullScreen() {
	if ((document.fullScreenElement && document.fullScreenElement !== null) ||
			(!document.mozFullScreen && !document.webkitIsFullScreen)) {
		if (document.documentElement.requestFullScreen) {
			document.documentElement.requestFullScreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}
function updateBookingListRange() {
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var currentDate = $( "#datepicker_wl_bottom" ).datepicker( "getDate" );
	var day = currentDate.getDate();
	var mon = monthNames[currentDate.getMonth()];
	var tomorrow = new Date();
	tomorrow.setDate(currentDate.getDate()+1);
	var nextDay = tomorrow.getDate();
	var nextMon = monthNames[tomorrow.getMonth()];
	$("#list_time_range").html(day+" "+mon+" - "+nextDay+" "+nextMon);
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

function updateReservationSpots(divid,spot_class) {
	var bid_fid = divid.replace(/^notif_ovrv_/, "");
	var json = JSON.parse($("#notify_places_input_"+bid_fid).val());
	var fid = json.fid;
	var bid = json.bid;
	var sids = json.sids;
	var sidsJson = {};
	var canvasLink = {};
	for(var i = 0 ; i <sids.length;i++) {
		var sidobj = {};
		sidobj.sid = sids[i].sid;
		sidobj.x=0;
		sidobj.y=0;
		sidobj.rx = 0;
		sidobj.ry = 0;
		sidobj.name = "";
		sidsJson[sids[i].sid] = sidobj;
	}
	for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		var floorid = floorCanvases[cf].floorid;
		if(fid == floorid ) {
			canvasLink = floorCanvases[cf];
			for (var sd = 0 ; sd < floorCanvases[cf].shapes.length ; sd++) {
				if(sidsJson.hasOwnProperty(floorCanvases[cf].shapes[sd].sid)) {
					sidsJson[floorCanvases[cf].shapes[sd].sid].x = floorCanvases[cf].shapes[sd].x;
					sidsJson[floorCanvases[cf].shapes[sd].sid].y = floorCanvases[cf].shapes[sd].y;
					sidsJson[floorCanvases[cf].shapes[sd].sid].name = floorCanvases[cf].shapes[sd].booking_options.givenName;
				}
			}
		}
	}
	if($("#notif_img_"+bid_fid).width() > 0) {
		var paddingLeft = ($("#"+divid).outerWidth(true) - $("#"+divid).width()) / 2;
		var paddingTop = ($("#"+divid).outerHeight(true) - $("#"+divid).height()) / 2;
		console.log(paddingLeft + " " + paddingTop);
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();  //spot_class
				var appendData = '<div class="'+spot_class+'" id="'+id_+'">'+sidsJson[key].name+'</div>';
				$("#"+divid).append(appendData);
				var elemWidth = $("#"+id_).outerWidth();
				var elemHeight = $("#"+id_).outerHeight();
				sidsJson[key].rx = sidsJson[key].x * ($("#notif_img_"+bid_fid).width()/canvasLink.origWidth);
				sidsJson[key].ry = sidsJson[key].y * ($("#notif_img_"+bid_fid).height()/canvasLink.origHeight);

				var cssleft = parseInt(sidsJson[key].rx + paddingLeft - elemWidth / 2);
				var csstop = parseInt(sidsJson[key].ry + paddingTop - elemHeight / 2);
				$("#"+id_).css("left",cssleft+"px");
				$("#"+id_).css("top",csstop+"px");
			}
		}
	} else {
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();
			}
		}
	}
}

function updatePopoverSpots(divid,spot_class,type) {
	var bid_fid;
	if(type == 'popover') {
		bid_fid = divid.replace(/^popover_ovrv_/, "");
	} else if (type == 'modal') {
		bid_fid = divid.replace(/^modal_ovrv_/, "");
	}

	var json = JSON.parse($("#"+type+"_places_input_"+bid_fid).val());
	var fid = json.fid;
	var bid = json.bid;
	var sids = json.sids;
	var sidsJson = {};
	var canvasLink = {};
	for(var i = 0 ; i <sids.length;i++) {
		var sidobj = {};
		sidobj.sid = sids[i].sid;
		sidobj.x=0;
		sidobj.y=0;
		sidobj.rx = 0;
		sidobj.ry = 0;
		sidobj.name = "";
		sidsJson[sids[i].sid] = sidobj;
	}
	for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		var floorid = floorCanvases[cf].floorid;
		if(fid == floorid ) {
			canvasLink = floorCanvases[cf];
			for (var sd = 0 ; sd < floorCanvases[cf].shapes.length ; sd++) {
				if(sidsJson.hasOwnProperty(floorCanvases[cf].shapes[sd].sid)) {
					sidsJson[floorCanvases[cf].shapes[sd].sid].x = floorCanvases[cf].shapes[sd].x;
					sidsJson[floorCanvases[cf].shapes[sd].sid].y = floorCanvases[cf].shapes[sd].y;
					sidsJson[floorCanvases[cf].shapes[sd].sid].name = floorCanvases[cf].shapes[sd].booking_options.givenName;
				}
			}
		}
	}
	console.log(sidsJson);
	if($("#"+type+"_img_"+bid_fid).width() > 0) {
		var paddingLeft = ($("#"+divid).outerWidth(true) - $("#"+divid).width()) / 2;
		var paddingTop = ($("#"+divid).outerHeight(true) - $("#"+divid).height()) / 2;
		console.log(paddingLeft + " " + paddingTop);
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_"+type+"_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();  //spot_class
				var appendData = '<div class="'+spot_class+'" id="'+id_+'"  title="'+sidsJson[key].name+'"><i class="material-icons place_point_popover_mat">place</i></div>';
				$("#"+divid).append(appendData);
				var elemWidth = $("#"+id_).outerWidth();
				var elemHeight = $("#"+id_).outerHeight();
				sidsJson[key].rx = sidsJson[key].x * ($("#"+type+"_img_"+bid_fid).width()/canvasLink.origWidth);
				sidsJson[key].ry = sidsJson[key].y * ($("#"+type+"_img_"+bid_fid).height()/canvasLink.origHeight);

				var cssleft = parseInt(sidsJson[key].rx + paddingLeft - elemWidth/2 );
				var csstop = parseInt(sidsJson[key].ry + paddingTop - elemHeight -2 );
				$("#"+id_).css("left",cssleft+"px");
				$("#"+id_).css("top",csstop+"px");
			}
		}
	} else {
		for (var key in sidsJson) {
			if (sidsJson.hasOwnProperty(key)) {
				var id_ = "ovrv_"+type+"_dot_"+sidsJson[key].sid + "__"+bid_fid;
				$("#"+id_).remove();
			}
		}
	}
}
function getRelativeXY(floorID,sid,wrapID,imgID) {
	var paddingLeft = ($("#"+wrapID).outerWidth(true) - $("#"+wrapID).width()) / 2;
	var paddingTop = ($("#"+wrapID).outerHeight(true) - $("#"+wrapID).height()) / 2;

	var returnObj = {};
	returnObj.left = 0;
	returnObj.top = 0;
	returnObj.leftper = 0;
	returnObj.topper = 0

	var origSIDx = 0;
	var origSIDy = 0;

	for (var cf = 0 ; cf < floorCanvases.length ; cf++) {
		var floorid = floorCanvases[cf].floorid;
		if(floorID == floorid ) {
			canvasLink = floorCanvases[cf];
			for (var sd = 0 ; sd < floorCanvases[cf].shapes.length ; sd++) {
				if(sid == floorCanvases[cf].shapes[sd].sid) {
					origSIDx = floorCanvases[cf].shapes[sd].x;
					origSIDy = floorCanvases[cf].shapes[sd].y;
					break;
				}
			}
		}
	}
	returnObj.left = origSIDx * ($("#"+imgID).width()/canvasLink.origWidth);
	returnObj.top  = origSIDy * ($("#"+imgID).height()/canvasLink.origHeight);
	returnObj.leftper = 100.0 * returnObj.left / $("#"+imgID).width();
	returnObj.topper = 100.0 * returnObj.top / $("#"+imgID).height();

	returnObj.left  = parseInt(returnObj.left  + paddingLeft );
	returnObj.top = parseInt(returnObj.top + paddingTop );

	return returnObj;
}
function toggle_accordion(iffrom,idtarget) {
	console.log(idtarget);
	$("#"+idtarget).addClass("in");
}