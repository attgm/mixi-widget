function stringFromDate(date) {
    var now = new Date();
    var time = date.getTime();
    var str = '';
    var diff = Math.floor((now - time) / (1000 * 60 * 60 * 24));
    var month = date.getMonth() + 1;
    
    if(now.getFullYear() != date.getFullYear() && diff > 6){
        str = date.getFullYear() + ' ' + month + '/' + date.getDate();
    }else{
        if(date.getSeconds() == 1){
            str = month + '/' + date.getDate();
        }else{
            if(now.getMonth() != date.getMonth() || now.getDate() != date.getDate()){
                str = month + '/' + date.getDate() + ' ' + ("00" + date.getHours()).slice(-2) + ':' 
                    + ("00" + date.getMinutes()).slice(-2);
            }else{
                str = ("00" + date.getHours()).slice(-2) + ':' + ("00" + date.getMinutes()).slice(-2);
            }
        }
    }
    return str;
}


function StorageEntry(category, title, url, name, nameUrl, date) {
    this.category = category;
    this.title = title;
    this.url = url;
    this.nameUrl = nameUrl;
    this.name = name;
    this.date = date;
}

StorageEntry.prototype = {
    getString : function() {
        var str = "<div class=\"diaryEntry\"><div class=\"diaryTitle\">";
        str += "<img src=\"" + labelIcons[this.category] + "\" class=\"labelIcon\" />";
        if(this.url && this.url.length > 0){
            str += "<a href=\"javascript:openWebsite(\'" + this.url + "\');\">";
        }
        str += this.title;
        if(this.url && this.url.length > 0){
            str += "</a>";
        }
        str += "</div><div class=\"diaryName\">";
        if(this.nameUrl && this.nameUrl.length > 0){
            str += "<a href=\"javascript:openWebsite(\'" + this.nameUrl + "\');\">";
        }
        str += this.name;
        if(this.nameUrl && this.nameUrl.length > 0){
            str += "</a>";
        }
        str += "</div><div class=\"diaryDate\">&nbsp;" + stringFromDate(this.date) + "</div></div>";
        
        return str;
    }
}

function Storage() {
    this.data = new Array();
    this.modified = new Array();
}

Storage.prototype = {
    setEntries : function(category, entry) {
        this.data[category] = entry;
        this.modified[category] = new Date();
    }
    ,
    getMargeEntries : function() {
        var entries = new Array();
        for (var i in this.data) {
            if(denotes[i]){
                entries = entries.concat(this.data[i]);
            }
        }
        entries.sort(function(a,b) {
            return b.date.getTime() - a.date.getTime();
        });
        
        return entries;
    }
    ,
    needUpdate : function(category) {
        var now = new Date();
        if(this.modified[category]){
            var diff = now - this.modified[category];
            return (diff > (1 * 60 * 1000));
        }
        return true;
    }
}