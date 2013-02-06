define(["util", "vector", "../lib/sylvester"], function(Util, Vector, Syl) {
	var cls = function(x, y, image) {
		var self = {};	

		self.facing = cls.RIGHT;	

		self.x = x;
		self.y = y;
		self.width = 0;
		self.height = 0;
		self.angle = 0;
		self.alpha = 1.0;

		// Collision flags
		self._collisionOffsetX = 0;
		self._collisionOffsetY = 0;
		self._collisionOffsetWidth = 0;
		self._collisionOffsetHeight = 0;
		// It will stay still when things collide with it, if true
		self.immovable = false;
		self.touchingTop = false;
		self.touchingBottom = false;
		self.touchingLeft = false;
		self.touchingRight = false;

		self.collides = true;

		self.image = null;
		// The sprite can be hidden by setting this to false
		self.visible = true;

		self.scale = 1.0;

		self.velocity = new Vector(0,0);
		self.acceleration = new Vector(0,0);

		// Animation state
		self.animation = null;
		self.lastAnimation = null;
		self.frame = null;
		self.animationFrame = 0;
		self._force = false;	

		// Loads an image; when it's finished loading, sets the sprite's image
		// to it. Automatically adjusts the sprite's width and height.
		self.setImage = function(url_or_obj, frameWidth, frameHeight)
		{
			var postLoad = function(obj){
				self.image = obj;
				self.width = frameWidth || self.image.naturalWidth;
				self.height = frameHeight || self.image.naturalHeight;
			};
			// has 'complete' which means it's an image object
			if(url_or_obj.complete) {
				postLoad(url_or_obj);
			}
			else { // otherwise we'll assume it's a url
				Util.load(url_or_obj, postLoad);
			}
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
				context.drawImage(self.image, sx, sy, sw, sh,
								  -Math.floor(self.width/2),
								  -Math.floor(self.height/2), w, h);
			}

			for (var i = 0; i < self.subSprites.length; ++i){
				self.subSprites[i].render(context);
			}

			context.restore();
		};

		// Simply sets the animation to whatever you pass it.
		self.playAnimation = function(animation, force) { 
			self.animation = animation;
			if(force) { self._force = true; }
			if(!self.frame || force){
				self.frame = self.animation.getFrameData(self, 0);
				self.animationFrame = 0;
			}
		};

		// If you don't want an animation, but you want a single frame from a spritesheet
		self.setSingleFrame = function(index) {
			self.frame = {x: index * self.width, y:0, w: self.width, h:self.height}; 
			self.animation = null;
		}

		// Handle simple physics every tick
		self.update = function(elapsed){
			// This filter just says "only leave me if i'm not in the remove list"
			self.subSprites = self.subSprites.filter(
				function(x,i,a) {
				return self._removeList.indexOf(x) === -1; });
				self._removeList = [];

				if(self.animation !== null){
					self.animationFrame = (self.animationFrame + (elapsed * self.animation.rate));
					if(self.animationFrame > self.animation.numFrames-1) // Wrap around the end
						{
							self.animationFrame = 0;
							if(self.animation.callback !== undefined){
								self.animation.callback();
							}
						}

						// Make sure it's an integer frame index
						self.frame = self.animation.getFrameData(self, Math.floor(self.animationFrame));

						// We don't reset the frame number in case the animation actually
						// changes. It's common for people to make the same playAnimation
						// call every tick, so make sure we only reset stuff if it's a new
						// anim.
						if(self.animation !== self.lastAnimation || self._force){
							self.animationFrame = 0;
							self.frame = self.animation.getFrameData(self, 0);
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

		// List of objects to be removed
		self._removeList = [];

		// Scene Graph stuff
		self.subSprites = [];	
		self.parentSprite = null;

		self.add = function(sprite){
			self.subSprites.push(sprite);
			sprite.parentSprite = self;
		};

		self.remove = function(sprite){
			if(self._removeList.indexOf(sprite) === -1)
				{
					self._removeList.push(sprite);
					sprite.parentSprite = null;
				}
		};		

		// Finds the world-space transform. Recursively up through
		// the scene graph.
		self.getTransform = function() {
			var parentMatrix = Syl.Matrix.I(3);
			if(self.parentSprite) {
				parentMatrix = self.parentSprite.getTransform();
			}
			var translationMatrix = Syl.$M([
										   [1, 0, self.x +self.width/2],
										   [0, 1, self.y +self.height/2],
										   [0, 0, 1]]);

										   var rotationMatrix = Syl.Matrix.RotationZ(self.angle * Math.PI / 180);	
										   var halfWidthTranslationMatrix = Syl.$M([
																				   [1, 0, -self.width/2],
																				   [0, 1, -self.height/2],
																				   [0, 0, 1]]);

																				   return parentMatrix.x(
																					   translationMatrix.x(
																						   rotationMatrix.x(	
																											halfWidthTranslationMatrix)));
		};

		// Inverse worldspace transform
		self.getInverseTransform = function() {
			return self.getTransform().inv();
		}

		// Gives a static-frame sprite under a different parent in the
		// scene graph hierarchy, but with the same absolute position
		// and rotation
		self.transcend = function(otherParent) {
			var totalTrans = otherParent.getInverseTransform().x(self.getTransform());
			newParentPos = totalTrans.x(Syl.$V([0,0,1]));
			offsetPos = totalTrans.x(Syl.$V([1,0,1]));
			var x = newParentPos.elements[0];
			var y = newParentPos.elements[1];
			var ox = offsetPos.elements[0];
			var oy = offsetPos.elements[1];
			var dx = ox-x;
			var dy = oy-y;
			var a = Math.atan2(dy, dx);
			var spr = new cls(x, y);
			spr.frame = self.frame;
			spr.image = self.image;
			spr.angle = a / Math.PI * 180;
			return spr;
		}

		// extending functionality

		Util.mixinOn(self);

		return self;
	};

	cls.LEFT = 0;
	cls.RIGHT = 1;

	cls.Animation = function(frames, rate, offsetX, offsetY, callback){
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		var self = {};
		self.rate = rate;
		self.callback = callback;
		self.numFrames = frames.length;

		self.getFrameData = function(sprite, i) {
			var frame = {};
			frame.x = (frames[i] * sprite.width) + offsetX;
			frame.y = offsetY;
			frame.w = sprite.width;
			frame.h = sprite.height;
			return frame;
		}

		return self;
	};

	return cls;
});
