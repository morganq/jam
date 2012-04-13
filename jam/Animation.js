jam.Animation = {}

// Enables Sprite objects to be animated. Also includes horizontal flipping.
// Sprites can have a current animation object which are defined as a series
// of positions to select from inside one big sprite image. This way, you load
// just one image per sprite, even if it has many animations.


// There are any number of ways of defining these selectors, but this is a
// horizontal strip system: 

// A contiguous region in the sprite image containing frames without any padding
jam.Animation.Strip = function(frames, frameWidth, frameHeight, rate, offsetX, offsetY, callback){
	if(offsetX === undefined) { offsetX = 0; }
	if(offsetY === undefined) { offsetY = 0; }
	animation = {};
	animation.rate = rate;
	animation.frames = [];
	animation.callback = callback;
	var numFrames = frames.length;
	for(var i = 0; i < numFrames; ++i)
	{
		var frame = {};
		frame.x = (frames[i] * frameWidth) + offsetX;
		frame.y = offsetY;
		frame.w = frameWidth;
		frame.h = frameHeight;
		animation.frames.push(frame);
	}
	return animation;
}

jam.AnimatedSprite = jam.extend(jam.Sprite, function(self){

	self.animation = null;
	self.lastAnimation = null;
	self.frame = null;
	self.animationFrame = 0;
	self._force = false;

	// Similar to Sprite's setImage, but we need to care about frameWidth and
	// frameHeight
	self.setImage = function(url, frameWidth, frameHeight)
	{
		if(jam.cache[url] === undefined)
		{
			jam.load(url, function(obj){
				self.image = jam.cache[url];
				self.width = (frameWidth === undefined) ? self.image.naturalWidth : frameWidth;
				self.height = (frameHeight === undefined) ?  self.image.naturalHeight : frameHeight;
				self.imageLoaded();
			});
		}
		else
		{
			self.image = jam.cache[url];
			self.width = (frameWidth === undefined) ? self.image.naturalWidth : frameWidth;
			self.height = (frameHeight === undefined) ?  self.image.naturalHeight : frameHeight;
			self.imageLoaded();			
		}		
		
	};

	// Simply sets the animation to whatever you pass it.
	self.playAnimation = function(animation, force) { 
		self.animation = animation;
		if(force) { self._force = true; }
		if(!self.frame || force){
			self.frame = self.animation.frames[0];
			self.animationFrame = 0;
		}
	}

	// Update needs to (in addition to what Sprite does) update the animation
	// frame and call any animation callbacks are set.
	self.update = jam.extend(self.update, function(elapsed){
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
	});
	
	// Selects the right frame given by the current frame
	// of the animation object. Flips horizontally if needed
	self.render = function(context, camera)
	{
		if(self.image !== null && self.visible){
			var curFrame = null;
			if(self.frame === null || self.frame === undefined){
				curFrame = { x:0, y:0, w:self.width, h:self.height };
			} else {
				curFrame = self.frame;
			}
			
			self._renderHelper(context, camera, self.image,
							    curFrame.w, curFrame.h, curFrame.x, curFrame.y, curFrame.w, curFrame.h);
		}
	};			
	return self;
},true, true);

