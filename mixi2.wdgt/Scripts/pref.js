var PrefPanel = new Object();

PrefPanel.isShowFront = function() {
	return (document.getElementById(PrefPanel.frontWindow).style.display != "none");
}
