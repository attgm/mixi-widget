function ToggleButton (base, label, onIcon, offIcon) {
	this.base = base;
	this.label = label;
	
	this.onIconPath = onIcon;
	this.offIconPath = offIcon;
    
	this.toggle = document.createElement("div");
	this.toggle.setAttribute("class", "toggleButton");
	
	this.buttonLabel = document.createElement("img");
	this.buttonLabel.width = 24;
	this.buttonLabel.height = 17;
	this.buttonLabel.setAttribute("class", "toggleLabel");
	this.buttonLabel.src = denotes[this.label] == true ? this.onIconPath : this.offIconPath;
	
	this.toggle.appendChild(this.buttonLabel);
    this.base.appendChild(this.toggle);
    
	var self = this;
	this.showOver = function (event) { self.toggle.style.backgroundImage = "url(Images/toggle_over.png)"; };
	this.hideOver = function (event) { self.toggle.style.backgroundImage = "none"; };
    this.toggleFunction = function (event) { 
        denotes[self.label] = !denotes[self.label];
        self.buttonLabel.src = denotes[self.label] == true ? self.onIconPath : self.offIconPath;
        changeCategory();
    }
    
	this.toggle.addEventListener('click', this.toggleFunction, false);
	this.toggle.addEventListener('mouseover', this.showOver, false);
	this.toggle.addEventListener('mouseout', this.hideOver, false);
};