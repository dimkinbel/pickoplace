function upDownSpinner(inputId,upId,downId,inputVals,inputShow,defaultVal,single) {
   this.vars = {};
   this.inid=inputId;
   this.upid = upId;
   this.downid = downId;
   var plugin = this;
   this.keysList = [];
   this.keysList = inputVals;
   this.defaultVal = defaultVal;
   this.currentVal = defaultVal;
   this.currentIndex;
   this.length_ = this.keysList.length;
   if(inputVals.length != inputShow.length) {
     alert("Different values");
	 return;
   }
   for(var i = 0 ; i < this.keysList.length ; i++) {
      if(defaultVal == this.keysList[i]) {
	     this.currentIndex = i;
	  }
   }
   for(var i=0;i<inputVals.length;i++) {
     this.vars[inputVals[i]] = inputShow[i];
   }
   $("#"+inputId).val(plugin.vars[defaultVal]);
   if(single) {
	   $("#"+upId).click(function() {
		   if(plugin.currentIndex == plugin.keysList.length - 1) {
			  plugin.currentIndex = 0;
		   } else {
			  plugin.currentIndex += 1;
		   }
		   plugin.currentVal = plugin.keysList[plugin.currentIndex];
		   $("#"+inputId).val(plugin.vars[plugin.currentVal]);
	   });
	   $("#"+downId).click(function() {
		   if(plugin.currentIndex == 0) {
			  plugin.currentIndex = plugin.keysList.length - 1;
		   } else {
			  plugin.currentIndex -= 1;
		   }
		   plugin.currentVal = plugin.keysList[plugin.currentIndex];
		   $("#"+inputId).val(plugin.vars[plugin.currentVal]);
	   });
   }
}
upDownSpinner.prototype.Up = function () {
       if(this.currentIndex == this.keysList.length - 1) {
	      this.currentIndex = 0;
	   } else {
	      this.currentIndex += 1;
	   }
	   this.currentVal = this.keysList[this.currentIndex];
	   $("#"+this.inid).val(this.vars[this.currentVal]);   
}
upDownSpinner.prototype.Down = function () {
       if(this.currentIndex == 0) {
	      this.currentIndex = this.keysList.length - 1;
	   } else {
	      this.currentIndex -= 1;
	   }
	   this.currentVal = this.keysList[this.currentIndex];
	   $("#"+this.inid).val(this.vars[this.currentVal]);
}
upDownSpinner.prototype.setVal = function (val) {
    for(var i = 0 ; i < this.keysList.length ; i++) {
      if(val == this.keysList[i]) {
	     this.currentIndex = i;
		 this.currentVal = this.keysList[this.currentIndex];
	     $("#"+this.inid).val(this.vars[this.currentVal]);
	  }
   }   
}
upDownSpinner.prototype.getVal = function () {
   return this.currentVal;
}

function myTimeSpinner(inidH,upH,downH,inidM,upM,downM,defaultH,defaultM,minStep,repeat) {
   this.HourValsSeconds = [];
   this.MinValsSeconds = [];
   this.HourShow = [];
   this.MinShow = [];
   var defaultHsec = defaultH * 3600;
   var defaultMsec = defaultM * 60;
   for(var i = 0 ; i < 3600*24 ; i += 3600) {
      this.HourValsSeconds.push(i);
	  if(i/3600 < 10) {
	    var g = "0"+i/3600;
		this.HourShow.push(g);
	  } else {
	    this.HourShow.push(i/3600);
	  }
   }
   for(var i =0 ; i < 15*60*4 ; i += 15*60) {
      this.MinValsSeconds.push(i);
	  if(i/60 < 10) {
	     var g = "0"+i/60;
		 this.MinShow.push(g);
	  } else {
	  this.MinShow.push(i/60);
	  }
   }
   if(repeat) {
    this.hspinner = new upDownSpinner(inidH,upH,downH,this.HourValsSeconds,this.HourShow,defaultHsec,false);
    this.mspinner = new upDownSpinner(inidM,upM,downM,this.MinValsSeconds,this.MinShow,defaultMsec,false);
   } else {
    this.hspinner = new upDownSpinner(inidH,upH,downH,this.HourValsSeconds,this.HourShow,defaultHsec,true);
    this.mspinner = new upDownSpinner(inidM,upM,downM,this.MinValsSeconds,this.MinShow,defaultMsec,true);   
   }
   var HS = this.hspinner;
   var MS = this.mspinner ;
  if(repeat) {
   $("#"+upH).click(function() {
		   if(HS.currentIndex == HS.keysList.length - 1) {
			  HS.currentIndex = 0;
		   } else {
			  HS.currentIndex += 1;
		   }
		   HS.currentVal = HS.keysList[HS.currentIndex];
		   $("#"+inidH).val(HS.vars[HS.currentVal]);       
   });
   $("#"+downH).click(function() {
		   if(HS.currentIndex == 0) {
			  HS.currentIndex = HS.keysList.length - 1;
		   } else {
			  HS.currentIndex -= 1;
		   }
		   HS.currentVal = HS.keysList[HS.currentIndex];
		   $("#"+inidH).val(HS.vars[HS.currentVal]);
   });
    $("#"+upM).click(function() {
		   if(MS.currentIndex == MS.keysList.length - 1) {
			  MS.currentIndex = 0;
		   } else {
			  MS.currentIndex += 1;
		   }
		   MS.currentVal = MS.keysList[MS.currentIndex];
		   $("#"+inidM).val(MS.vars[MS.currentVal]);       
   });
   $("#"+downM).click(function() {
		   if(MS.currentIndex == 0) {
			  MS.currentIndex = MS.keysList.length - 1;
		   } else {
			  MS.currentIndex -= 1;
		   }
		   MS.currentVal = MS.keysList[MS.currentIndex];
		   $("#"+inidM).val(MS.vars[MS.currentVal]);
   });  
   }
}
myTimeSpinner.prototype.getTime = function () {
  return this.hspinner.getVal()+this.mspinner.getVal();
}