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
	// "static" constants so that we don't have to remember that
	// 0 = left and 1 = right. These control if the sprite is flipped
	// horizontally or not.
	jam.Sprite.LEFT = 0;
	jam.Sprite.RIGHT = 1;		
	
	self.facing = jam.Sprite.RIGHT;
	self.animation = null;
	self.lastAnimation = null;
	self.frame = null;
	self.animationFrame = 0;

	// Similar to Sprite's setImage, but we need to care about frameWidth and
	// frameHeight
	self.setImage = function(url, frameWidth, frameHeight)
	{
		if(jam.cache[url] === undefined)
		{
			jam.load(url, function(obj){
				self.image = jam.cache[url];
				self.width = (frameWidth === undefined) ? self.image.width : frameWidth;
				self.height = (frameHeight === undefined) ?  self.image.height : frameHeight;
				self.imageLoaded();
			});
		}
		else
		{
			self.image = jam.cache[url];
			self.width = (frameWidth === undefined) ? self.image.width : frameWidth;
			self.height = (frameHeight === undefined) ?  self.image.height : frameHeight;
			self.imageLoaded();			
		}		
		
	};

	// Simply sets the animation to whatever you pass it.
	self.playAnimation = function(animation) { 
		self.animation = animation;
		if(self.frame === null){
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
			if(self.animation !== self.lastAnimation){
				self.animationFrame = 0;
				self.frame = self.animation.frames[0];
			}
			self.lastAnimation = self.animation;
		}
	});
	
	// Selects the right frame given by the current frame
	// of the animation object. Flips horizontally if needed
	self.render = function(context, camera)
	{
		// Horrible automatic blending if we have non-integer values
		var _x = Math.floor(self.x - camera.scroll.x * self.parallax.x);
		var _y = Math.floor(self.y - camera.scroll.y * self.parallax.y);

		if(self.image !== null && self.visible){
			if(self.animation === null){
				var curFrame = { x:0, y:0, w:self.width, h:self.height };
			} else {
				var curFrame = self.frame;
			}

			if(self.facing == jam.Sprite.RIGHT){
				context.setTransform(1,0,0,1,0,0);
				context.drawImage(self.image, curFrame.x, curFrame.y, curFrame.w, curFrame.h,
									 _x, _y, curFrame.w, curFrame.h);
			}
			else{
				context.setTransform(-1,0,0,1,_x*2,0);
				context.drawImage(self.image, curFrame.x, curFrame.y, curFrame.w, curFrame.h,
									 _x - curFrame.w, _y, curFrame.w, curFrame.h);
			}
			context.setTransform(1,0,0,1,0,0);
		}
	};			
	return self;
},true, true);

