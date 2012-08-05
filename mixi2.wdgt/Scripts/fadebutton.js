function FadeButton (flip, label, callback) {
	this.flip = flip;
	
	this.flipLabel = document.createElement("img");
	this.flipLabel.width = 13;
	this.flipLabel.height = 13;
	this.flipLabel.src = label;
	
	this.flipCircle = document.createElement("div");
	this.flipCircle.setAttribute("class", "flipCircle");
	
	this.flip.appendChild(this.flipCircle);
	this.flip.appendChild(this.flipLabel);
    
	var self = this;
	this.showCircle = function (event) { self.flipCircle.style.display = 'block'; };
	this.hideCircle = function (event) { self.flipCircle.style.display = 'none'; };

	this.flip.addEventListener('click', callback, false);
	this.flip.addEventListener("mouseover", this.showCircle, false);
	this.flip.addEventListener("mouseout", this.hideCircle, false);
};