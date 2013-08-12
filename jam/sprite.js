define(["util", "vector", "../lib/sylvester"], function(Util, Vector, Syl) {
  var sprite = function(x, y, image) {
	this.facing = this.RIGHT;

	this.x = x;
	this.y = y;
	this.width = 0;
	this.height = 0;
	this.angle = 0;
	this.alpha = 1.0;

	// Collision flags
	this._collisionOffsetX = 0;
	this._collisionOffsetY = 0;
	this._collisionOffsetWidth = 0;
	this._collisionOffsetHeight = 0;
	// It will stay still when things collide with it, if true
	this.immovable = false;
	this.touchingTop = false;
	this.touchingBottom = false;
	this.touchingLeft = false;
	this.touchingRight = false;

	this.collides = true;

	this.image = null;
	// The sprite can be hidden by setting this to false
	this.visible = true;

	this.scale = 1.0;

	this.velocity = new Vector(0,0);
	this.acceleration = new Vector(0,0);

	// Animation state
	this.animation = null;
	this.lastAnimation = null;
	this.frame = null;
	this.animationFrame = 0;
	this._force = false;

    if(image !== undefined) {
	  this.setImage(image);
    }

	// List of objects to be removed
	this._removeList = [];

	// Scene Graph stuff
	this.subSprites = [];
	this.parentSprite = null;

	this.add = function(sprite){
	  this.subSprites.push(sprite);
	  sprite.parentSprite = this;
	};

	this.remove = function(sprite){
	  if(this._removeList.indexOf(sprite) === -1)
	  {
		this._removeList.push(sprite);
		sprite.parentSprite = null;
	  }
	};

	// Finds the world-space transform. Recursively up through
	// the scene graph.
	this.getTransform = function() {
	  var parentMatrix = Syl.Matrix.I(3);
	  if(this.parentSprite) {
		parentMatrix = this.parentSprite.getTransform();
	  }
	  var translationMatrix = Syl.$M([
		[1, 0, this.x +this.width/2],
		[0, 1, this.y +this.height/2],
		[0, 0, 1]]);

	  var rotationMatrix = Syl.Matrix.RotationZ(this.angle * Math.PI / 180);
	  var halfWidthTranslationMatrix = Syl.$M([
		[1, 0, -this.width/2],
		[0, 1, -this.height/2],
		[0, 0, 1]]);

	  return parentMatrix.x(
		translationMatrix.x(
		  rotationMatrix.x(
			halfWidthTranslationMatrix)));
	};

	// Inverse worldspace transform
	this.getInverseTransform = function() {
	  return this.getTransform().inv();
	}

	// Gives a static-frame sprite under a different parent in the
	// scene graph hierarchy, but with the same absolute position
	// and rotation
	this.transcend = function(otherParent) {
	  var totalTrans = otherParent.getInverseTransform().x(this.getTransform());
	  newParentPos = totalTrans.x(Syl.$V([0,0,1]));
	  offsetPos = totalTrans.x(Syl.$V([1,0,1]));
	  var x = newParentPos.elements[0];
	  var y = newParentPos.elements[1];
	  var ox = offsetPos.elements[0];
	  var oy = offsetPos.elements[1];
	  var dx = ox-x;
	  var dy = oy-y;
	  var a = Math.atan2(dy, dx);
	  var spr = new sprite(x, y);
	  spr.frame = this.frame;
	  spr.image = this.image;
	  spr.angle = a / Math.PI * 180;
	  return spr;
	}

	// extending functionality

	Util.mixinOn(this);
  };

  sprite.prototype.LEFT = 0;
  sprite.prototype.RIGHT = 1;

  sprite.Animation = function(frames, rate, offsetX, offsetY, callback){
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	this.rate = rate;
	this.callback = callback;
	this.numFrames = frames.length;

	this.getFrameData = function(sprite, i) {
	  var frame = {};
	  frame.x = (frames[i] * sprite.width) + offsetX;
	  frame.y = offsetY;
	  frame.w = sprite.width;
	  frame.h = sprite.height;
	  return frame;
	}
  };

 	// Loads an image; when it's finished loading, sets the sprite's image
	// to it. Automatically adjusts the sprite's width and height.
  sprite.prototype.setImage = function(url_or_obj, frameWidth, frameHeight){
	var postLoad = function(obj){
	  this.image = obj;
	  this.width = frameWidth || this.image.naturalWidth;
	  this.height = frameHeight || this.image.naturalHeight;
	}.bind(this);;
	// Has 'complete' which means it's an image object.
	if(url_or_obj.complete) {
	  postLoad(url_or_obj);
	} else { // Otherwise we'll assume it's a url.
	  Util.load(url_or_obj, postLoad);
	}
  };

  // Called by game, this is how the Sprite shows up on screen
  sprite.prototype.render = function(context){
	if(!this.visible) { return; }

	var curFrame = null;
	if(this.frame === null || this.frame === undefined){
	  curFrame = { x:0, y:0, w:this.width, h:this.height };
	  } else {
		curFrame = this.frame;
	  }

	this._renderHelper(context, this.image,
					   curFrame.w, curFrame.h, curFrame.x, curFrame.y, curFrame.w, curFrame.h);

  };


  sprite.prototype._renderHelper = function(context, image, w, h, sx, sy, sw, sh){
	// Avoid horrible automatic blending if we have non-integer values.
	var tx = Math.floor(this.x + this.width/2);
	var ty = Math.floor(this.y + this.height/2);
	context.save();

	// Set up the context transform and alpha before drawing
	context.translate(tx, ty);
	if(this.angle !== 0){ context.rotate(this.angle * Math.PI / 180); }
	if(this.alpha !== 1.0){ context.globalAlpha = this.alpha; }
	if(this.facing == this.LEFT){ context.scale(-1, 1);}

	if(this.image) {
	  context.drawImage(this.image, sx, sy, sw, sh,
						-Math.floor(this.width/2),
						-Math.floor(this.height/2), w, h);
	}

	for (var i = 0; i < this.subSprites.length; ++i){
	  this.subSprites[i].render(context);
	}

	context.restore();
  };

  // Simply sets the animation to whatever you pass it.
  sprite.prototype.playAnimation = function(animation, force) {
	this.animation = animation;
	if(force) { this._force = true; }
	if(!this.frame || force){
	  this.frame = this.animation.getFrameData(this, 0);
	  this.animationFrame = 0;
	}
  };

  // If you don't want an animation, but you want a single frame from a spritesheet.
  sprite.prototype.setSingleFrame = function(index) {
	this.frame = {x: index * this.width, y:0, w: this.width, h:this.height};
	this.animation = null;
  };

  // Handle simple physics every tick.
  sprite.prototype.update = function(elapsed){
	// This filter just says "only leave me if i'm not in the remove list"
	this.subSprites = this.subSprites.filter(
	  function(x,i,a) {
		return this._removeList.indexOf(x) === -1; }, this);
	this._removeList = [];
	if(this.animation !== null){
	  this.animationFrame = (this.animationFrame + (elapsed * this.animation.rate));
	  if(this.animationFrame > this.animation.numFrames){ // Wrap around the end.
	  	this.animationFrame = 0;
		if(this.animation.callback !== undefined){
		  this.animation.callback();
		}
	  }

	  // Make sure it's an integer frame index.
	  this.frame = this.animation.getFrameData(this, Math.floor(this.animationFrame));

	  // We don't reset the frame number in case the animation actually
	  // changes. It's common for people to make the same playAnimation
	  // call every tick, so make sure we only reset stuff if it's a new
	  // anim.
	  if(this.animation !== this.lastAnimation || this._force){
		this.animationFrame = 0;
		this.frame = this.animation.getFrameData(this, 0);
		this._force = false;
	  }
	  this.lastAnimation = this.animation;
	}

	// Add to velocity based on accel
	this.velocity = Vector.add(this.velocity, Vector.mul(this.acceleration, elapsed));

	// Add to position based on velocity
	this.x += this.velocity.x * elapsed;
	this.y += this.velocity.y * elapsed;

	for (var i = 0; i < this.subSprites.length; ++i){
	  this.subSprites[i].update(elapsed);
	}
  };

  return sprite;
});
