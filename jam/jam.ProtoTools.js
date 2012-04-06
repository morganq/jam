// Various tools for prototyping.

// Give Sprites a rectangleImage function so you can quickly prototype objects
// and characters without worrying about images or animations
jam.Sprite = jam.extend(jam.Sprite, function(self){	
	self.rectangleImage = function(width, height, color){
		self.width = width;
		self.height = height;
		
		var tCanvas = document.createElement("canvas");
		tCanvas.width = width;
		tCanvas.height = height;
		var tContext = tCanvas.getContext("2d");
		tContext.fillStyle = color;
		tContext.fillRect(0,0,width,height);
		self.image = tCanvas;
	}
	return self;
}, true, true);