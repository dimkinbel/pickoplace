$(document).ready(function() {


 
});
var ratingObj = {};

function openFeedback(bid,pid) {
  var all=document.getElementsByName("fedback_drop");
  for(var x=0; x < all.length; x++) {
       document.getElementById(all[x].id).style.display = "none";
	   $("#"+all[x].id).empty();
  }
    var appendData = '';
    appendData+='           <div id="rating_wrap"><div id="close_rating">X</div><div id="arrow_rating"></div>';
	appendData+='		   <table class="rating_table"cellspacing="0" cellpadding="0" style="width: 100%; height: 100%; border-collapse: collapse">';
	appendData+='		    <tr ><td class="rat_name">Food quality</td>';
	appendData+='			     <td class="rat_rat_td"><div id="raty_food"></div></td>';
	appendData+='				 <td class="rat_hint" id="raty_food_hint"></td></tr>';
	appendData+='			<tr ><td class="rat_name">Staff</td>';
	appendData+='			     <td class="rat_rat_td"><div id="raty_staf"></div></td>';
	appendData+='				 <td class="rat_hint" id="raty_staf_hint"></td></tr>	'; 
	appendData+='		    <tr ><td class="rat_name">Location</td>';
	appendData+='			     <td class="rat_rat_td"><div id="raty_loc"></div></td>';
	appendData+='				 <td class="rat_hint" id="raty_loc_hint"></td></tr>	';
	appendData+='		    <tr ><td class="rat_text" colspan="3">';
	appendData+='			     <textarea id="raty_textarea" placeholder="Short review..."></textarea></td></tr>';
	appendData+='			<tr ><td class="rat_text rat_sub_btn" colspan="3">';
	appendData+='		<img id="rating_ajax_gif" src="js/ajax-loader-round.gif" style="display:none"/>	    <div id="raty_submit" onclick="submitFeedback(\''+bid+'\',\''+pid+'\')">SUBMIT</div></td></tr>';
	appendData+='		   </table>';
	appendData+='		 </div>    ';
	
	$("#fedback_drop-"+bid).append(appendData);
	$('#raty_food').raty({
	  path       : 'raty/images',
	  starHalf   : 'star-half-big.png',
	  starOff    : 'star-off-big.png',
	  starOn     : 'star-on-big.png',
	  target     : '#raty_food_hint',
	  targetKeep : true
	});
	$('#raty_staf').raty({
	  path       : 'raty/images',
	  starHalf   : 'star-half-big.png',
	  starOff    : 'star-off-big.png',
	  starOn     : 'star-on-big.png',
	  target     : '#raty_staf_hint',
	  targetKeep : true
	});
	$('#raty_loc').raty({
	  path       : 'raty/images',
	  starHalf   : 'star-half-big.png',
	  starOff    : 'star-off-big.png',
	  starOn     : 'star-on-big.png',
	  target     : '#raty_loc_hint',
	  targetKeep : true
	});
	
	 $("#fedback_drop-"+bid).show();
	 $("#close_rating").click(function(){
		  var all=document.getElementsByName("fedback_drop");
		  for(var x=0; x < all.length; x++) {
			   document.getElementById(all[x].id).style.display = "none";
			   $("#"+all[x].id).empty();
		  }	     
	 });
}
function submitFeedback(bid,pid) {
 
	ratingObj = {};
	var fscore = 0;
	var sscore = 0;
	var lscore = 0;
	if($('#raty_food').raty('score') != undefined) {
		fscore = $('#raty_food').raty('score');
	} 
	if($('#raty_staf').raty('score') != undefined) {
	   sscore = $('#raty_staf').raty('score');
	}
	if($('#raty_loc').raty('score') != undefined) {
		lscore = $('#raty_loc').raty('score');
	}
 
	if(fscore == 0 && sscore == 0 && lscore == 0) {
		alert("Please submit any rating value");
		return;
	}
	var tscore = $('#raty_textarea').val();
	ratingObj.fscore = fscore;
	ratingObj.sscore = sscore;
	ratingObj.lscore = lscore;
	ratingObj.tscore = tscore;
	ratingObj.bid = bid;
	ratingObj.pid = pid;
	setSessionData(function(result) {
		if(result) {
		    	var bookingjson = {rating:JSON.stringify(ratingObj)};
				$.ajax({
					url : "/submitRating",
					data: bookingjson,//
					beforeSend: function () { $("#raty_submit").hide(); $("#rating_ajax_gif").show();},
					success : function(data){
						console.log(data);
						if(data.status=="OK") {
							  updateRatingInteractive(data);
						} else {
						    $("#rating_ajax_gif").hide(); $("#raty_submit").show();							
						}
					},
					dataType : "JSON",
					type : "post"
				});
				
		} else {
		   window.location.href("/");
		}
     });
}
function updateRatingInteractive(data) {
	var bid = data.rating.bid;
	var rating = data.rating;
	$( "#sb_feedback-" + bid ).remove();
	$( "#fedback_drop-" + bid ).remove();
	var appendData = "";
	ratlist = [];
	
	appendData += '	<div class="ratedb" >';
    appendData += '	  <table cellspacing="0" cellpadding="0" style="border-collapse: collapse;margin-left: auto;margin-right: auto;">';
    if(rating.fscore > 0) {
    	var ratdiv = "RAT_"+randomString(10)+"___"+rating.fscore;
    	ratlist.push(ratdiv);
        appendData += '    <tr><td colspan="2" class="ratn" >Food</td></tr>';
        appendData += '    <tr><td><div class="donerating" id="'+ratdiv+'"></div></td><td class="ratval">'+rating.fscore+'</td></tr>';
    }
    if(rating.sscore > 0) {
    	var ratdiv = "RAT_"+randomString(10)+"___"+rating.sscore;
    	ratlist.push(ratdiv);
        appendData += '	   <tr><td colspan="2" class="ratn">Staff</td></tr>';
        appendData += '    <tr><td><div class="donerating" id="'+ratdiv+'"></div></td><td class="ratval">'+rating.sscore+'</td></tr>';
    }
    if(rating.lscore > 0) {
    	var ratdiv = "RAT_"+randomString(10)+"___"+rating.lscore;
    	ratlist.push(ratdiv);
       appendData += '     <tr><td colspan="2" class="ratn">Location</td></tr>';
       appendData += '     <tr><td><div class="donerating" id="'+ratdiv+'"></div></td><td class="ratval">'+rating.lscore+'</td></tr>   '; 
    }
    appendData += '   </table>	';	  
    appendData += '</div>	';	
    
    $("#ratingInteractive-"+bid).append(appendData);
    
	for(var i =  0 ; i < ratlist.length ; i++) {
		var id = ratlist[i];
		var numl = id.split("___");
		var num = parseInt(numl[1]);
		$('#'+id).raty({ score: num ,path:'raty/images',readOnly: true,space: false});
	}
}

