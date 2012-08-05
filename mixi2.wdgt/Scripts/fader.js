function Fader() {
	this.elements = new Array();
	this.animator = null;
	
	this.fadeTime = 500;
	this.minOpacity = 0;
	this.maxOpacity = 1;
	
	var self = this;
	this.anime = function (animation, now, first, done) {
		for(i=0; i<self.elements.length; i++){
			self.elements[i].style.opacity = now;
		}
	}
}

Fader.prototype = {
	addElement : function (element) {
		this.elements.push(element);
	},
	fadeIn : function() {
		if(this.fadingIn == true){ return; }
		var from = this.minOpacity;
		if (this.elements.length > 0 && this.elements[0].style.opacity) {
			from = parseInt(this.elements[0].style.opacity);
		}
		this.fadeTo(from, this.maxOpacity);
		this.fadingIn = true;
	},
	fadeOut : function() {
		if(this.fadngIn == false){ return; }
		var from = this.maxOpacity;
		if (this.elements.length > 0 && this.elements[0].style.opacity) {
			from = parseInt(this.elements[0].style.opacity);
		}
		this.fadeTo(from, this.minOpacity);
		this.fadingIn = false;
	},
	fadeTo : function(from, to) {
		if (this.animator) {
			this.animator.stop();
			delete this.animator;
		}
		this.animator = 
			new AppleAnimator(this.fadeTime, 13, from, to, this.anime);
		this.animator.start();
	}
}