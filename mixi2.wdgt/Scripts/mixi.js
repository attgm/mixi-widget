var changedPassword = false;

var kCategories = ['diary', 'comment', 'community', 'footprint', 'message', 'album', 'video', 'review', 'voice', 'schedule', 'check'];
var currentCategory = 'diary';
var defaultCategoryIndex = 1;
var animator;
var pageAnimator;

var denotes = {
	diary:true,
	comment:true,
	listcomment:false,
	community:true,
	mycommunity:false,
	album:true,
	video:true,
	review:true,
	footprint:true,
	myfootprint:false,
	message:true,
	voice:true,
	check:true
}

var onIcons = {
	diary:'Images/icon_on_03.png',
	comment:'Images/icon_on_04.png',
	listcomment:'Images/icon_on_05.png',
	community:'Images/icon_on_06.png',
	mycommunity:'Images/icon_on_07.png',
	album:'Images/icon_on_08.png',
	video:'Images/icon_on_09.png',
	review:'Images/icon_on_10.png',
	footprint:'Images/icon_on_12.png',
	myfootprint:'Images/icon_on_13.png',
	message:'Images/icon_on_15.png',
	voice:'Images/icon_on_14.png',
	schedule:'images/icon_on_16.png',
	check:'images/icon_on_17.png'
}

var offIcons = {
	diary:'Images/icon_off_03.png',
	comment:'Images/icon_off_04.png',
	listcomment:'Images/icon_off_05.png',
	community:'Images/icon_off_06.png',
	mycommunity:'Images/icon_off_07.png',
	album:'Images/icon_off_08.png',
	video:'Images/icon_off_09.png',
	review:'Images/icon_off_10.png',
	footprint:'Images/icon_off_12.png',
	myfootprint:'Images/icon_off_13.png',
	message:'Images/icon_off_15.png',
	voice:'Images/icon_off_14.png',
	schedule:'images/icon_off_16.png',
	check:'images/icon_off_17.png'
}

var labelIcons = {
	diary:'Images/label_03.png',
	comment:'Images/label_04.png',
	listcomment:'Images/label_05.png',
	community:'Images/label_06.png',
	mycommunity:'Images/label_07.png',
	album:'Images/label_08.png',
	video:'Images/label_09.png',
	review:'Images/label_10.png',
	footprint:'Images/label_12.png',
	myfootprint:'Images/label_13.png',
	message:'Images/label_15.png',
	voice:'Images/label_14.png',
	schedule:'images/label_16.png',
	check:'images/label_17.png'
}


//-- renew engine
var renewEngine;
var kIntervalArray = [0,1,5,10,30,60];
var renewInterval = 0;
var viahttps = false;
var mixiRequest = null;
var finishSetup = false;
var reloginFlag = false;

var gScrollbar, gScrollArea;

function getLocalizedString (key) {
	try {
		var retString = localizedStrings[key];
		if (retString === undefined)
			retString = key;
		return retString;
	} catch (ex) { }
			
	return key;
}


function openWebsite(uri) {
	if (window.widget) {
		widget.openURL(uri);
	} else {
		window.location.href = uri;
	}
}


function onShow() {
	if(finishSetup && PrefPanel.isShowFront()){
		reloginFlag = false;
		renew(false);
	}
}


function onHide() {
		document.getElementById("status").innerText = "get hide event";
	clearTimeout(renewEngine)
	renewEngine = null;
}

function onRemove() {
	var mail = document.getElementById("mail").value;
	if(mail){
		removeGenericPassword(mail + ':' + widget.identifier);
	}
}

function setup() {
	createGenericButton(document.getElementById('done'), getLocalizedString('Done'), 
						function() { PrefPanel.showFront("FrontWindow", "BacksideWindow"); });	
	PrefPanel.setup("flip", "fliprollie");
	
	if(window.widget){
		widget.onshow = onShow;
		widget.onhide = onHide;
		widget.onremove = onRemove;
		
		loadPrefs();
		populateAutorenewSelect();
	
		var element = document.getElementById('httpslabel');
		element.innerText = getLocalizedString('httpslabel');
	}
	
	var frontWindow = document.getElementById("FrontWindow");
	frontWindow.onmousemove = onMouseMove;
	frontWindow.onmouseout = onMouseOut;
		
    getCategory();
	var categoryList = document.getElementById("category");
	var num = kCategories.length;
	for (var i = 0; i < num; i++) {	
		var a = new ToggleButton(categoryList, kCategories[i], onIcons[kCategories[i]], offIcons[kCategories[i]]);
	}
	
	animator = new Fader(500);
	animator.addElement(document.getElementById("flip"));
	
	var request = new NetworkRequest();
	if(document.getElementById("password").value == "" && !request.hasCookie()){
		PrefPanel.showBackside();
	}else{
		renew();
	}
	finishSetup = true;
    
    
    gScrollArea = new AppleScrollArea(document.getElementById("contextclip"));
    gScrollbar = new AppleVerticalScrollbar(document.getElementById("scrollbar"));
    gScrollArea.addScrollbar(gScrollbar);

}


function loadPrefs() {
	var mail = widget.preferenceForKey("mail");
	if (mail) document.getElementById("mail").value = mail;
	
	var password = findGenericPassword(mail + ':' + widget.identifier);
	if (password) {
		document.getElementById("password").value = password;
	}
	password = '';
	
	defaultCategoryIndex = widget.preferenceForKey("category");
	if(!defaultCategoryIndex) defaultCategoryIndex = 1;
	
    var num = kCategories.length;
	for (var i = 0; i < num; i++) {	
        var d = widget.preferenceForKey(widget.identifier + ":" + kCategories[i]);
        if(d && d.length > 0){
            denote[kCategories[i]] = (d == 'true') ? true : false;
        }
	}
    
	var defi = widget.preferenceForKey("interval");
	if (defi) renewInterval = defi;
	
	var https = widget.preferenceForKey("viahttps");
	if (https) { setViaHttps(https); }
}


function textChanged(id){
	if(id != 'password'){
		var value = document.getElementById(id).value;
		if (window.widget) widget.setPreferenceForKey(value, id);
	}
	if(id == 'password' || id == 'mail'){
		changedPassword = true;
	}
}

function checkboxChanged(id){
	setViaHttps(!viahttps);
}

function setViaHttps(v){
	viahttps = v;
	if (window.widget) widget.setPreferenceForKey(viahttps, "viahttps");
	
	document.getElementById("viahttps").checked = viahttps;	
}


function changeCategory() {
    var str = "";
    var separator = "";
    
    for (var i = 0; i < kCategories.length; i++) {	
        if(denotes[kCategories[i]]){
            str += separator + kCategories[i]; separator = ",";
        }
    }
    if (window.widget) widget.setPreferenceForKey(str,"category:" + widget.identifier);
    renew(false);
}


function getCategory() {
    if (window.widget) {
        var str = widget.preferenceForKey("category:" + widget.identifier);
        if(str){
            var selected = str.split(",");
            
            for (var key in denotes) denotes[key] = false;
            for (var i=0; i < selected.length; i++) denotes[selected[i]] = true;
        }
    }
}


function renew(login) {
	clearTimeout(renewEngine);
	renewEngine = null;
	
	if(!mixiRequest || login){
		mixiRequest = new Request();
		mixiRequest.category = currentCategory;
		mixiRequest.login(false);
	}else{
		mixiRequest.category = currentCategory;
		if(changedPassword == true){
			mixiRequest.login(true);
		}else{
			mixiRequest.renewStorage();
		}
	}
}



function onMouseMove(event)
{
	animator.fadeIn();
}

function onMouseOut(event)
{
	animator.fadeOut();
}


function populateAutorenewSelect() {
	var select = document.getElementById('interval');
	var num = kIntervalArray.length;
	
	for(var i=0; i<num; i++) {
		var element = document.createElement('option');
		element.innerText = getLocalizedString(kIntervalArray[i]);
		var m = kIntervalArray[i]
		if (m == renewInterval) element.selected = true;
		element.value = m
		select.appendChild(element)
	}
	var selectLabel = document.getElementById('intervallabel');
	selectLabel.innerText = getLocalizedString('autorenew');
}

function setRenewInterval(param) {
	renewInterval = param
	if (window.widget) widget.setPreferenceForKey(param, 'interval');
}

//--
function restoreTimeout() {
	clearTimeout(renewEngine);
	if(renewInterval > 0) {
		renewEngine = setTimeout("renew(false)", renewInterval*1000*60);
	}
}

//-- scroller
// 
/*function adjustScrollArrow() {	
}

function pageDown(event){
    return;
    
	var context = document.getElementById("context");
	var clip = document.getElementById("contextclip");
	
	var diff = clip.clientHeight - 18;
	var position = Math.max(context.style.pixelTop - diff, clip.clientHeight - context.clientHeight);
	movePageTo(context.style.pixelTop, position);
}

function pageUp(event){
    return;
	var context = document.getElementById("context");
	var clip = document.getElementById("contextclip");
	
	var diff = clip.clientHeight - 18;
	var position = Math.min(diff + context.style.pixelTop, 0);
	movePageTo(context.style.pixelTop, position);
}

function movePageTo(from, to) {
	if (pageAnimator) {
		pageAnimator.stop();
		delete pageAnimator;
	}
	if(AppleAnimator){
		pageAnimator = new AppleAnimator(250, 13, from, to, pageAnimete);
	}else{
	}
	pageAnimator.start();
}

function pageAnimete(animation, now, first, done) {
	var context = document.getElementById("context");
	context.style.pixelTop = now;
	
	if(done == true){
		adjustScrollArrow();
	}
}
*/
function clearPagePosition(){
	var context = document.getElementById("context");
	context.style.pixelTop = 0;
	refreshDataScrollbar();
}

function refreshDataScrollbar() {
	gScrollArea.refresh();
	gScrollbar.refresh();
}