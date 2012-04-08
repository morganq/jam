// A Sprite is an object with an image and very simple physics.
// There is no collision detection, but it has position, velocity, acceleration
jam.Sprite = function(x, y){
	var self = {};
	
	self._layer = 0;
	self._game = null;
	
	self.x = x;
	self.y = y;
	self.width = 0;
	self.height = 0;
	self.angle = 0;
	self.alpha = 1.0;
	
	self.image = null;
	self.visible = true; // The sprite can be hidden by setting this to false
	
	self.velocity = jam.Vector(0,0);
	self.acceleration = jam.Vector(0,0);

	// How much the render position is affected by the camera
	self.parallax = jam.Vector(1,1);
	
	// Loads an image and when it's finished loading, sets the sprite's image
	// to it. Automatically adjusts the sprite's width and height.
	self.setImage = function(url)
	{
		if(jam.cache[url] === undefined)
		{
			jam.load(url, function(obj){
				self.image = obj;
				self.width = self.image.naturalWidth;
				self.height = self.image.naturalHeight;
				self.imageLoaded();
			});
		}
		else
		{
			self.image = jam.cache[url];
			self.width = self.image.naturalWidth;
			self.height = self.image.naturalHeight;
			self.imageLoaded();			
		}
	}

	// In case you need to do something when the image finishes loading.
	self.imageLoaded = function(){};

	// Called by game, this is how the Sprite shows up on screen
	self.render = function(context, camera)
	{
		if(self.image !== null && self.visible){
			var tx = self.x - camera.scroll.x * self.parallax.x + self.width/2;
			var ty = self.y - camera.scroll.y * self.parallax.y + self.height/2;
			var a = self.angle * Math.PI / 180;
			context.translate(tx, ty);
			if(self.angle != 0){ context.rotate(a); }
			if(self.alpha != 1.0){ context.globalAlpha = self.alpha; }
			
			context.drawImage(self.image,-self.width/2,-self.height/2);
			
			if(self.angle != 0){ context.rotate(-a); }
			if(self.alpha != 1.0){ context.globalAlpha = 1.0; }
			context.translate(-tx, -ty);
		}
	}
	
	// Handle simple physics every tick
	self.update = function(elapsed){
		// This vector math stuff sucks because there's no such thing as
		// operator overloading

		// Add to velocity based on accel
		var va = jam.Vector.add, vm = jam.Vector.mul;
		self.velocity = va(self.velocity, vm(self.acceleration, elapsed));

		// Add to position based on velocity
		self.x += self.velocity.x * elapsed;
		self.y += self.velocity.y * elapsed;
	}
	
	self.setLayer = function(layer){
		self._layer = layer;
		if(self._game){
			self._game.sortSprites();
		}
	}
	
	return self;
};
