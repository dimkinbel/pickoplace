/**
 * 
 */
$(document).ready(function() {
	
	UploadAJAXWrapper("bg",10,backgroundLoaded);
	UploadAJAXWrapper("table",10,tableLoaded);
	UploadAJAXWrapper("chair",10,chairLoaded);
	UploadAJAXWrapper("combo",10,comboLoaded);
 
});
function UploadAJAXWrapper(type,count,offset) {

	var uploadjson = {type:type,count:count,offset:offset};
	$.ajax({
	    url : "/uploadDrawImages",
	    data: uploadjson,//
	    beforeSend: function () { },
	    success : function(data){
	    	if(data.imageList.length > 0) {
		  	  console.log(data);
		  	  updateAJAXImages(type,data,true);
		    }
	    },
	    dataType : "JSON",
	    type : "post"
	});
}
var backgroundLoaded = 0;
var tableLoaded = 0;
var chairLoaded = 0;
var comboLoaded = 0;
function updateAJAXImages(type,data,clean) {
	if(type=="bg") {
		 backgroundLoaded+=data.imageList.length;
		 if(clean==true) {
			 $("#background_picker").html("");
			 $("#background_actual_append").html("");
		 }
		 for (var s=0;s<data.imageList.length;s++) {
			 var id = data.imageList[s].id;
			 if($("#" + id).length == 0) {
				  //it doesn't exist
				 var actualURL = data.imageList[s].actualURL;
				 var pickURL = data.imageList[s].pickURL;
				 var appendDataPick = "";
				 appendDataPick+='<img crossOrigin="Anonymous" class="bg_pick_image left bg_pick_image_selectable"  src="'+pickURL+'" id="'+id+'" onclick="selectedBackground(this,\''+id+'_actual\');"/>';
			     $("#background_picker").append(appendDataPick);
				 var appendActual = "";
				 appendActual+='<img crossOrigin="Anonymous" id="'+id+'_actual"  src="'+actualURL+'" style="display:none"/>';
				 $("#background_actual_append").append(appendActual);
			 };
	
		 };
	} else  {
		if(type=="table") {
		    tableLoaded+=data.imageList.length;
		} else if(type=="chair") {
			chairLoaded+=data.imageList.length;
		} else if(type=="combo") {
			comboLoaded+=data.imageList.length;
		}
		 if(clean==true) {
			 $("#"+type+"_picker").html("");
			 $("#actual_uploads_"+type+"_server").html("");
		 }
		 for (var s=0;s<data.imageList.length;s++) {
			 var id = data.imageList[s].id;
			 if($("#" + id).length == 0) {
				  //it doesn't exist
				 var actualURL = data.imageList[s].actualURL;
				 var appendDataPick = "";
				 appendDataPick+='<img class="bg_pick_image left" crossOrigin="Anonymous" src="'+actualURL+'" id="'+id+'" onclick="imgPicker(this,\'show_'+type+'_image\',\''+type+'\');" >';
				 $("#"+type+"_picker").append(appendDataPick);
				 var appendActual = "";
				 appendActual+='<img  crossOrigin="Anonymous"  src="'+actualURL+'" id="'+id+'_actual"  >';
				 $("#actual_uploads_"+type+"_server").append(appendActual);
			 };
	
		 };
	}
}

