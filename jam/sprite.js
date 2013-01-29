define(["jam", "vector"], function(jam, Vector) {
	var cls = function(x, y, image) {
		var self = {};	
		
		self._game = null;
		
		self.facing = cls.RIGHT;	
		
		self.x = x;
		self.y = y;
		self.width = 0;
		self.height = 0;
		self.angle = 0;
		self.alpha = 1.0;

        // Stuff related to collision.
        self._collisionOffsetX = 0;
        self._collisionOffsetY = 0;
        self._collisionOffsetWidth = 0;
        self._collisionOffsetHeight = 0;
        self.immovable = false;
        self.touchungTop = false;
        self.touchungBottom = false;
        self.touchungLeft = false;
        self.touchungRight = false;
		
		self.image = null;
		self.visible = true; // The sprite can be hidden by setting this to false
		
		self.velocity = new Vector(0,0);
		self.acceleration = new Vector(0,0);

		// How much the render position is affected by the camera
		self.parallax = new Vector(1,1);

		// Animation state
		self.animation = null;
		self.lastAnimation = null;
		self.frame = null;
		self.animationFrame = 0;
		self._force = false;	
		
		// Loads an image and when it's finished loading, sets the sprite's image
		// to it. Automatically adjusts the sprite's width and height.
		self.setImage = function(url, frameWidth, frameHeight)
		{
			require("jam").load(url, function(obj){
				self.image = obj;
				self.width = (frameWidth === undefined) ? self.image.naturalWidth : frameWidth;
				self.height = (frameHeight === undefined) ?  self.image.naturalHeight : frameHeight;
			});
		};

		if(image !== undefined) {
		  self.setImage(image);
		}

		// Called by game, this is how the Sprite shows up on screen
		self.render = function(context)
		{
			if(!self.visible) { return; }

			var curFrame = null;
			if(self.frame === null || self.frame === undefined){
				curFrame = { x:0, y:0, w:self.width, h:self.height };
			} else {
				curFrame = self.frame;
			}

			self._renderHelper(context, self.image,
				curFrame.w, curFrame.h, curFrame.x, curFrame.y, curFrame.w, curFrame.h);
						
		};

		// Simply sets the animation to whatever you pass it.
		self.playAnimation = function(animation, force) { 
			self.animation = animation;
			if(force) { self._force = true; }
			if(!self.frame || force){
				self.frame = self.animation.frames[0];
				self.animationFrame = 0;
			}
		};
		
		self._renderHelper = function(context, image, w, h, sx, sy, sw, sh){
			// Avoid horrible automatic blending if we have non-integer values
			var tx = Math.floor(self.x + self.width/2);
			var ty = Math.floor(self.y + self.height/2);
			context.save();
			
			// Set up the context transform and alpha before drawing
			context.translate(tx, ty);
			if(self.angle !== 0){ context.rotate(self.angle * Math.PI / 180); }
			if(self.alpha !== 1.0){ context.globalAlpha = self.alpha; }
			if(self.facing == cls.LEFT){ context.scale(-1, 1);}

			if(self.image) {
				context.drawImage(self.image, sx, sy, sw, sh, -Math.floor(self.width/2),-Math.floor(self.height/2), w, h);
			}
			
			for (var i = 0; i < self.subSprites.length; ++i)
			{
				self.subSprites[i].render(context);
			}

			context.restore();
		};
		
		// Handle simple physics every tick
		self.update = function(elapsed){
			// This filter just says "only leave me if i'm not in the remove list"
			self.subSprites = self.subSprites.filter(function(x,i,a) { return self._removeList.indexOf(x) === -1; });
			self._removeList = [];

			if(self.animation !== null){
				self.animationFrame = (self.animationFrame + (elapsed * self.animation.rate));
				if(self.animationFrame > self.animation.frames.length) // Wrap around the end
				{
					self.animationFrame = 0;
					if(self.animation.callback !== undefined){
						self.animation.callback();
					}
				}

				// Make sure it's an integer frame index
				self.frame = self.animation.frames[Math.floor(self.animationFrame)];

				// We don't reset the frame number in case the animation actually
				// changes. It's common for people to make the same playAnimation
				// call every tick, so make sure we only reset stuff if it's a new
				// anim.
				if(self.animation !== self.lastAnimation || self._force){
					self.animationFrame = 0;
					self.frame = self.animation.frames[0];
					self._force = false;
				}
				self.lastAnimation = self.animation;
			}

			// Add to velocity based on accel
			self.velocity = Vector.add(self.velocity, Vector.mul(self.acceleration, elapsed));

			// Add to position based on velocity
			self.x += self.velocity.x * elapsed;
			self.y += self.velocity.y * elapsed;

			for (var i = 0; i < self.subSprites.length; ++i)
			{
				self.subSprites[i].update(elapsed);
			}			
		};


		// Scene Graph stuff
		self.subSprites = [];	

		// List of objects to be removed
		self._removeList = [];

		self.add = function(sprite){
			self.subSprites.push(sprite);
			sprite._game = self;
		};

		self.remove = function(sprite){
			if(self._removeList.indexOf(sprite) === -1)
			{
				self._removeList.push(sprite);
				sprite._game = null;
			}
		};		

		// extending functionality
		self.on = function(fnName, doFn) {
			var old = self[fnName];
			self[fnName] = function() {
				old.apply(self, arguments);
				return doFn.apply(self, arguments);
			};
		};
		
		return self;
	};

	cls.LEFT = 0;
	cls.RIGHT = 1;

	cls.Animation = function(frames, frameWidth, frameHeight, rate, offsetX, offsetY, callback){
		if(offsetX === undefined) { offsetX = 0; }
		if(offsetY === undefined) { offsetY = 0; }
		var self = {};
		self.rate = rate;
		self.frames = [];
		self.callback = callback;
        self.frameWidth = frameWidth;
        self.frameHeight = frameHeight;
		var numFrames = frames.length;
		for(var i = 0; i < numFrames; ++i)
		{
			var frame = {};
			frame.x = (frames[i] * frameWidth) + offsetX;
			frame.y = offsetY;
			frame.w = frameWidth;
			frame.h = frameHeight;
			self.frames.push(frame);
		}
		return self;
	};

	return cls;
});
