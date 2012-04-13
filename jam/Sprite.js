
// A Sprite is an object with an image and very simple physics.
// There is no collision detection, but it has position, velocity, acceleration
jam.Sprite = function(x, y){
	var self = {};	
	
	self._layer = 0;
	self._game = null;
	
	self.facing = jam.Sprite.RIGHT;	
	
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
			self._renderHelper(context, camera, self.image,
							   self.width, self.height, 0, 0, self.width, self.height);
		}
	}
	
	self._renderHelper = function(context, camera, image, w, h, sx, sy, sw, sh){
		// Avoid horrible automatic blending if we have non-integer values
		var tx = Math.floor(self.x - camera.scroll.x * self.parallax.x + self.width/2);
		var ty = Math.floor(self.y - camera.scroll.y * self.parallax.y + self.height/2);
		context.save();
		
		// Set up the context transform and alpha before drawing
		context.translate(tx, ty);
		if(self.angle != 0){ context.rotate(self.angle * Math.PI / 180); }
		if(self.alpha != 1.0){ context.globalAlpha = self.alpha; }
		if(self.facing == jam.Sprite.LEFT){ context.scale(-1, 1);}
		
		context.drawImage(self.image, sx, sy, sw, sh, -self.width/2,-self.height/2, w, h);
		
		context.restore();
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
	
	// Sets the layer value then tells the game to sort
	self.setLayer = function(layer){
		self._layer = layer;
		if(self._game){
			self._game.sortSprites();
		}
	}
	
	return self;
};

// "static" constants so that we don't have to remember that
// 0 = left and 1 = right. These control if the sprite is flipped
// horizontally or not.

jam.Sprite.LEFT = 0;
jam.Sprite.RIGHT = 1;