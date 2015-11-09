
var ChannelHash = {};
var PrevLoaded = {};
//general ajax function for all requests 
function makeRequest(url,async) {
	var httpRequest = "";
	if (window.XMLHttpRequest) {
		// Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch (e) {}
		}
	}

	if (!httpRequest) {
		console.log('CHANNEL:Giving up : Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.open('POST', url,async);
	httpRequest.send();
	return httpRequest;
}


function requestChannelToken(clientID){	
	loginUser(clientID);
}



loginUser = function(clientID){	
	var userid = clientID;
	if(userid!=null && userid!="") {
	   requestToken(userid);
     }
};

requestToken = function(userid){
	var getTokenURI = '/gettoken?userid=' + userid ;
	var httpRequest = makeRequest(getTokenURI,true);
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				//alert("HTTPReq:   "+ httpRequest.responseText);
				openChannel(httpRequest.responseText);
				console.log("Channel connected:"+userid);
			}else {
				alert('There was a problem with the request.');
			}
		}
	}
};
var channel__;
openChannel = function(token) {
	channel__ = new goog.appengine.Channel(token);
	var socket = channel__.open();
	//alert("Soc  "+socket);
	socket.onopen = onSocketOpen;
	socket.onmessage = onSocketMessage;
	socket.onerror = onSocketError;
	socket.onclose = onSocketClose;
};

onSocketError = function(error){
	console.log("Error is  ("+error.description+" ) and HTML code:"+error.code);
	//Error is  (Token+timed+out. ) and HTML code:401
	if(error.code==401) {
		updatePageView();
	}
};

onSocketOpen = function() {
	console.log("socket opened");
};

onSocketClose = function() {
//	alert('Connection closed.Please reload page to receive Booking requests');
};

onSocketMessage = function(message) {
	//alert("soccet message received");
	console.log(JSON.parse(message.data));
};


function ChatMessageSubmit(random) {
	var messageCount = ChannelHash[random];
	var Message = document.getElementById("chat_input_input"+random).value;
	var userid = document.getElementById("username_value4chat").value;
	var sendMessageURI = '/message?message=' + Message + '&to=' + random+'&from='+userid ;
	var httpRequest = makeRequest(sendMessageURI,true);
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				}else {
				alert('There was a problem with the request.');
			}
		}
	};
	var date = getChatDate();
	updateChatBox(Message,random,"green",false,0);
	 

}
function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

