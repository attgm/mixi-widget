var loginUrl = "mixi.jp/login.pl";
var maxDialy = 50 + 1;
var mixiUrls = { notify:"http://mixi.jp/atom/notify/r=2/",
					diary:"http://mixi.jp/new_friend_diary.pl",
					//comment:"http://mixi.jp/new_comment.pl",
					comment:"http://mixi.jp/list_comment.pl",
					listcomment:"http://mixi.jp/list_comment.pl",
					community:"http://mixi.jp/new_bbs.pl",
					mycommunity:"http://mixi.jp/new_bbs.pl",
					footprint: "http://mixi.jp/show_log.pl",
					myfootprint: "http://mixi.jp/show_self_log.pl",
					message:"http://mixi.jp/list_message.pl",
					album:"http://mixi.jp/new_album.pl",
					review:"http://mixi.jp/new_review.pl",
					music:"http://mixi.jp/new_music.pl",
					video:"http://mixi.jp/new_video.pl",
					voice:"http://mixi.jp/recent_voice.pl",
					schedule:"http://mixi.jp/new_schedule.pl",
					check:"http://mixi.jp/recent_check.pl"
					};
var displayStrage = new Storage();

						 
function setStatus(str) {
	var element = document.getElementById("status");
	element.innerText = str;
}

function setErrorStatus(str) {
	setStatus("Error");
	var html = "<h3>ERROR</h3><div class=\"error\">" + str + "</div>";
	setContext(html);
}


function setContext(str){
	var element = document.getElementById("context");
	element.innerHTML = str;
	
	clearPagePosition();
}


function renewContext(){
	var element = document.getElementById("context");
    var entries = displayStrage.getMargeEntries();
    
    var str = "";
    for(var i=0; i<entries.length; i++){
        str += entries[i].getString();
    }
	element.innerHTML = str;
	clearPagePosition();
}

function splitSubString(str, start, end) {
	var s = str.indexOf(start, 0);
	if (s < 0) return "";
	s += start.length;
	var e = str.indexOf(end, s);
	if (e < 0) e = str.length;
	return str.substring(s, e);
}


function parseDate(str, baseDate) {
	var dateString = str;
	var now = new Date();
	
	var reg = str.match(/[0]*(\d+)\D+[0]*(\d+)\D+[0]*(\d+)\D+[0]*(\d+)\D+(\d+)/);
	if(reg && reg.length == 6){
		return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, 0);
	}
	reg = str.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
	if(reg && reg.length == 7){
		return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, 0);
	}
    reg = str.match(/[0]*(\d+)\D+[0]*(\d+)\D+[0]*(\d+)\D+(\d+)/);
	if(reg && reg.length == 5){
        var year = (parseInt(RegExp.$1) - 1 > baseDate.getMonth()) 
                    ? baseDate.getFullYear() - 1 : baseDate.getFullYear();
		return new Date(year, RegExp.$1 - 1, RegExp.$2, RegExp.$3, RegExp.$4, 0);
	}
	reg = str.match(/(\d{4})\D+[0]*(\d+)\D+[0]*(\d+)/);
    if(reg && reg.length == 4){
		return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3, 0, 0, 1);
	}
	reg = str.match(/[0]*(\d+)\D+[0]*(\d+)/);
	if(reg && reg.length == 3){
		var year = (parseInt(RegExp.$1) - 1 > baseDate.getMonth()) 
                    ? baseDate.getFullYear() - 1 : baseDate.getFullYear();
		return new Date(year, RegExp.$1 - 1, RegExp.$2, 0, 0, 1);
	}
	return new Date();
}


function parseISODate(str) {
	var dateString = str;
	var reg = str.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/);
	if(reg && reg.length == 7){
		return new Date(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, 0);
	}else{
		var reg = str.match(/[0]*(\d+)\D+[0]*(\d+)/);
		return new Date(now.getFullYear(), RegExp.$1, RegExp.$2, 0, 0, 1);
	}
	return new Date();
}



function Request() {
	this.category = null;
	this.action = null;
    this.categoryId = 0;
};


Request.prototype = {
	success_callback : function(responseText, coockie) {
		if(this.action == "login"){
			this.getSessionId(responseText, coockie);
		}else if(this.action == "get"){
			this.cb_parseHTML(responseText, coockie);
		}
	}
    ,
	error_callback : function(e, s) {
        if(s == 2 && this.action == "get"){
            this.cb_skipCategory(e);
        }
        setErrorStatus(e);
	}
    ,
	login : function (force) {
		this.action = "login";
		
		var savedThis = this;
		var request = new NetworkRequest();
		if(!force && request.hasCookie()){
			this.renewStorage();
			return;
		}
		request.setCallbacks(this, this.getSessionId, this.error_callback);
		
		setStatus("creating session...");
		var url = ((viahttps) ? "https://" : "http://") + loginUrl;
		request.addParam("next_url", "/home.pl");
		var id = escape(document.getElementById("mail").value);
		
		var password = escape(document.getElementById("password").value);
		if (id == "" || password == "") {
			setStatus("Cannot Login");
			return;
		}
		request.addParam("email", id);
		request.addParam("password", password);
		id = ""; password = "";
		this.req = request;
		request.connect(url);
	}
    ,
	loaded : function(responseText, cookie) {
		if(!cookie){
			setStatus("Cannot Login");
			return 0;
		}else if(changedPassword == true){
			var account = document.getElementById("mail").value;
			setGenericPassword(account + ':' + widget.identifier,
								document.getElementById('password').value);
			changedPassword = false;
		}
		restoreTimeout(); // auto reload
		return 1;
	}
    ,
	getSessionId : function (responseText, cookie) {
		if (this.loaded(responseText, cookie) == 0) return;
		var savedThis = this;
		setTimeout(function(){ savedThis.renewStorage(); }, 0.0) 
	}
    ,
    renewStorage : function () {
        if(this.nextCategory(0) != -1){
            var savedThis = this;
            setTimeout(function(){ savedThis.getHtml(); }, 0.0);
        }else{
            renewContext();
            setStatus("done.");
        }
    }
    ,
	getHtml : function() {
		this.action = "get";
		
		setStatus("getting html... " );
		var request =  new NetworkRequest();
		if(!request.hasCookie()){
			this.login();
			return;
		}
		request.setCallbacks(this, this.cb_parseHTML, this.error_callback);
		request.connect(mixiUrls[this.category]);
	}
    ,
    cb_skipCategory : function(errorMessage){
        if(this.nextCategory(++this.categoryId) != -1){
            var savedThis = this;
            setTimeout(function(){ savedThis.getHtml(); }, 0.1);
        } 
    }
    ,
	cb_parseHTML : function(responseText, coockie) {
		if(responseText.indexOf("login_main") >= 0 || responseText.indexOf("login_form") >= 0){
			if(reloginFlag == false){
				reloginFlag = true;
				this.login(true);
			}else{
				setStatus("Cannot Login");
				return 0;
			}
		}
		
		if (this.loaded(responseText, coockie) == 0) return;
		
		if(this.category == 'footprint' || this.category == 'myfootprint'){
			this.parseFootprint(responseText);
		}else if(this.category == 'diary'){
			this.parseDialy(responseText);
		}else if(this.category == 'message'){
			this.parseMessage(responseText);
		}else if(this.category == 'notify'){
			this.parseNotify(responseText);
		}else if(this.category == 'voice'){
			this.parseVoice(responseText);
        }else if(this.category == 'album'){
            this.parsePhoto(responseText);
		}else if(this.category == 'check'){
            this.parseCheck(responseText);
        }else{
			this.parseHTML(responseText);
		}
        this.cb_skipCategory();
    }   
    ,
	parseHTML : function(string) {
		setStatus("parse html..");
		var str = "";
		var diary = string.split(HTML_SEPARATOR);
		
		if (diary.length < 1) return;
		var length = diary.length > maxDialy ? maxDialy : diary.length;
        var entries = new Array();
        var baseDate = new Date();
        
		for(i=1; i<length; i++){
			var url = splitSubString(diary[i], HTML_URL_BEGIN, HTML_URL_END);
			var path = splitSubString(url, "\"", "\"");
			if(path.indexOf("http://") != 0){
				path = 'http://mixi.jp/' + path;
			}
			
			var title = splitSubString(diary[i], url + HTML_TITLE_BEGIN, HTML_TITLE_END).replace(/\s+$/,'');
			var name = splitSubString(diary[i], HTML_NAME_BEGIN, HTML_NAME_END);
			name = splitSubString(name, "(", ")"); // delete brackets
			
			var date = splitSubString(diary[i], HTML_DATE_BEGIN, HTML_DATE_END);
			date = parseDate(date, baseDate);
            entries.push(new StorageEntry(this.category, title, path, name, null, date));
            baseDate = date;
		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
	}
    ,
	parseVoice : function(string) {
		setStatus("parse voice..");
		var str = "";
		var diary = string.split(VC_SEPARATOR);
		
		if (diary.length < 1) return;
		var length = diary.length > maxDialy ? maxDialy : diary.length;
		var entries = new Array();
		var baseDate = new Date();
        
        for(i=1; i<length; i++){
			var uid = splitSubString(diary[i], VC_UID_BEGIN, VC_UID_END);
			var postTime = splitSubString(diary[i], VC_DATE_BEGIN, VC_DATE_END);
			var date = parseDate(postTime, baseDate);
            var name = splitSubString(diary[i], VC_NICK_BEGIN, VC_NICK_END);
			var title = splitSubString(diary[i], VC_SUBJECT_BEGIN, VC_SUBJECT_END);
			title = title.replace(/<.+?>/g,'');
			
			var url = 'http://mixi.jp/view_voice.pl?owner_id=' + uid + '&post_time=' + postTime;
            entries.push(new StorageEntry(this.category, title, url, name, null, date));
			baseDate = date;
		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
	}
    ,
	parseDialy : function(string) {
		setStatus("parse diary..");
		var str = "";
		var diary = string.split(DL_SEPARATOR);
		
		if (diary.length < 1) return;
		var length = diary.length > maxDialy ? maxDialy : diary.length;
        var entries = new Array();
        var baseDate = new Date();
        
		for(i=1; i<length; i++){
			var url = splitSubString(diary[i], DL_URL_BEGIN, DL_URL_END);
			var ownerid = splitSubString(url, DL_OWNERID_BEGIN, DL_OWNERID_END);
			var path = 'http://mixi.jp/' + url.replace(/\"/g, ''); // "
			var title = splitSubString(diary[i], url + DL_TITLE_BEGIN, DL_TITLE_END);
			var name = splitSubString(diary[i], DL_NAME_BEGIN, DL_NAME_END);
			name = splitSubString(name, "(", ")"); // delete brackets
			var date = splitSubString(diary[i], DL_DATE_BEGIN, DL_DATE_END);
			date = parseDate(date, baseDate);
            var nameUrl = 'http://mixi.jp/list_diary.pl?id=' + ownerid;
            
            entries.push(new StorageEntry(this.category, title, path, name, nameUrl, date));
			baseDate = date;
		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
	}
    ,
	parseFootprint : function(string) {
		setStatus("parse footprint...");
		var str = "";
		var element = document.getElementById("context");
		var totalString = splitSubString(string, FP_TOTAL_AREA_BEGIN, FP_TOTAL_AREA_END);
		var total = splitSubString(totalString, FP_TOTAL_BEGIN, FP_TOTAL_END);
		var footString = splitSubString(string, FP_AREA_BEGIN, FP_AREA_END);
		var diary = footString.split(FP_SEPARATOR);
		var baseDate = new Date();
        
		if (diary.length < 1) return;
		var length = diary.length > (maxDialy-1) ? (maxDialy-1) : diary.length;
		var entries = new Array();
		for(i=0; i<length-1; i++){
			var date = splitSubString(diary[i], FP_DATE_BEGIN, FP_DATE_END);
			date = parseDate(date, baseDate);
			var url = splitSubString(diary[i], FP_URL_BEGIN, FP_URL_END);
			var path = url.replace(/\"/g, ''); //"
            path = 'http://mixi.jp/' + path;
			var title = splitSubString(diary[i], url + FP_TITLE_BEGIN, FP_TITLE_END);
            entries.push(new StorageEntry(this.category, title, path, '', null, date));
			baseDate = date;
		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
	}
    ,
	parseMessage : function(string) {
		setStatus("parse inbox...");
		var str = "";
		var element = document.getElementById("context");
		var table = splitSubString(string, MS_AREA_BEGIN, MS_AREA_END)
		var diary = table.split(MS_SEPARATOR);
		if (diary.length < 1) return;
		var length = diary.length > maxDialy ? maxDialy : diary.length;
		var entries = new Array();
		var baseDate = new Date();
		
        for(i=1; i<length; i++){
		      var nick = splitSubString(diary[i], MS_NICK_BEGIN, MS_NICK_END);
		      var date = splitSubString(diary[i], MS_DATE_BEGIN, MS_DATE_END);
		      var url = splitSubString(diary[i], MS_URL_BEGIN, MS_URL_END);
		      var subject = splitSubString(diary[i], url+MS_SUBJECT_BEGIN,MS_SUBJECT_END);
		      url = 'http://mixi.jp/' + url;
              var sender = splitSubString(diary[i], MS_SENDER_BEGIN, MS_SENDER_END);
		          
		      date = parseDate(date, baseDate);
              entries.push(new StorageEntry(this.category, subject,  url, sender, null, date));
              baseDate = date;
		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
	}
    ,
	parseNotify : function(string) {
		if(string.indexOf('xmlns="http://purl.org/atom/app#"') < 0){
			setStatus("parse atom...");
			var str = "";
		
			var feed = splitSubString(string, ATOM_AREA_BEGIN, ATOM_AREA_END);
			var entry = feed.split(ATOM_SEPARATOR);
			if (entry.length < 1) return;
			var length = entry.length > maxDialy ? maxDialy : entry.length;
            var entries = new Array();
            for(i=0; i<length; i++){
			  var title = splitSubString(entry[i], ATOM_TITLE_BEGIN, ATOM_TITLE_END);
		      var url = splitSubString(entry[i], ATOM_URL_BEGIN, ATOM_URL_END);
			  var date = splitSubString(entry[i], ATOM_DATE_BEGIN, ATOM_DATE_END);
			  date = parseISODate(date);
              entries.push(new StorageEntry(this.category, title, url, '', null, date));
		    }
			setContext(str);
			setStatus("done." );
		}else{
			var reg = string.match(/http:\/\/mixi.jp\/atom\/notify\/r=2\/member_id=\d+/);
			if(reg && reg.length == 1){
				mixiUrls['notify'] = reg[0];
				var savedThis = this;
				setTimeout(function(){ savedThis.getHtml(); }, 0.0);
			}
		}
	}
    ,
    parsePhoto : function(string) {
        setStatus("parse photo...");
		var str = "";
		var table = splitSubString(string, PH_AREA_BEGIN, PH_AREA_END)
		var diary = table.split(PH_SEPARATOR);
		if (diary.length < 1) return;
		var length = diary.length > maxDialy ? maxDialy : diary.length;
		var entries = new Array();
		var baseDate = new Date();
		
        for(i=1; i<length; i++){
            var url = splitSubString(diary[i], PH_URL_BEGIN, PH_URL_END);
			var title = splitSubString(diary[i], PH_URL_BEGIN + url + PH_TITLE_BEGIN, PH_TITLE_END);
			var nick = splitSubString(diary[i], PH_NICK_BEGIN, PH_NICK_END);
			var date = splitSubString(diary[i], PH_DATE_BEGIN, PH_DATE_END);
			date = parseDate(date, baseDate);
            entries.push(new StorageEntry(this.category, title, url, nick, null, date));
			baseDate = date;

		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
    }
    ,
    parseCheck : function(string) {
        setStatus("parse check...");
		var str = "";
		var table = splitSubString(string, CK_AREA_BEGIN, CK_AREA_END)
		var diary = table.split(CK_SEPARATOR);
		if (diary.length < 1) return;
		var length = diary.length > maxDialy ? maxDialy : diary.length;
		var entries = new Array();
		var baseDate = new Date();
		
        for(i=1; i<length; i++){
            var path = splitSubString(diary[i], CK_URL_BEGIN, CK_URL_END);
            url = 'http://mixi.jp/view_check.pl?post_time=' + path;
			var title_alt = splitSubString(diary[i], CK_TITLE_BEGIN, CK_TITLE_END);
			var title = splitSubString(title_alt, CK_TITLE_ALT_BEGIN, CK_TITLE_ALT_END);
            var nick = splitSubString(diary[i], CK_NICK_BEGIN, CK_NICK_END);
			var date = splitSubString(diary[i], CK_DATE_BEGIN, CK_DATE_END);
			date = parseDate(date, baseDate);
            entries.push(new StorageEntry(this.category, title, url, nick, null, date));
			baseDate = date;

		}
		displayStrage.setEntries(this.category, entries);
        setStatus("done.");
        renewContext();
    }
    ,
    nextCategory: function(cid) {
        while(cid < kCategories.length){
            if(displayStrage.needUpdate(kCategories[cid])){
                this.categoryId = cid;
                this.category = kCategories[cid];
                return this.categoryId;
            }
            cid++;
        }
        return -1;
    }
}