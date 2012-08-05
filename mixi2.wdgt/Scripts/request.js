//  request.js
// 	Network request class (use Widget Plugin instead of XMLHttpRequest)

var callback_function = null;


function callbackFromPlugin(status, output){
	callback_function(status, output);
}

function NetworkRequest() {
	this.callback = null;
	this.options = "";
	this.error_callback = null;
	this.target = null;
}


NetworkRequest.prototype = {
	addParam : function(key, value) {
		if(this.options.length > 0){ this.options += '&'; };
		this.options += key + "=" + value;
	},
	connect : function(url) {
		var savedThis = this;
		callback_function = 
			function(status, outputstring){ savedThis.loaded(status, outputstring); };
		var method = (this.options.length) > 0 ? "POST" : "GET";
		window.KeychainPlugin.connect(url, method, this.options, "callbackFromPlugin");
	},
	loaded : function(status, outputstring) {
		if(status == 0){
			this.target.success_callback(outputstring, this.hasCookie());
		}else{
			this.target.error_callback(outputstring, status);
		}
	},
	setCallbacks : function (t, c, e){
		this.target = t;
		this.callback = c;
		this.error_callback = e;
	},
	hasCookie : function() {
		return (window.KeychainPlugin.hasSessionCookie("http://mixi.jp", "session") == 1);
	}
}