// Adds some functionality to various modules for debug purposes

/*	SAMPLE USAGE:
** Tilde shows the log **
if(jam.Input.justPressed("~")) { jam.Debug.showLog = !jam.Debug.showLog; }
if(some_condition) { jam.log("something happened!"); }

*/

jam.Debug = {};

// Add a box around all sprites so we can see their collision boxes
jam.Debug.debugRenderExtension = function(self){

		self.render = jam.extend(self.render, function(context, camera) {
			if(!jam.Debug.showBoundingBoxes) { return; }
			context.lineWidth = 1;
			context.strokeStyle = "rgba(255,0,0,0.6)";
			context.strokeRect(	Math.floor(self.x - camera.scroll.x)+0.5,
								Math.floor(self.y - camera.scroll.y)+0.5,
								self.width, self.height);
			
			if( self._collisionOffsetX || self._collisionOffsetY ||
				self._collisionOffsetWidth || self._collisionOffsetHeight)
			{
				context.strokeStyle = "rgba(0,255,255,0.5)";
				context.strokeRect(	Math.floor(self.x - camera.scroll.x + self._collisionOffsetX)+0.5,
									Math.floor(self.y - camera.scroll.y + self._collisionOffsetY)+0.5,
									self.width + self._collisionOffsetWidth,
									self.height + self._collisionOffsetHeight);
			}
		});
		
		return self;
		
};
jam.Sprite = jam.extend(jam.Sprite, jam.Debug.debugRenderExtension, true, true);
if(jam.AnimatedSprite) { jam.AnimatedSprite = jam.extend(jam.AnimatedSprite, jam.Debug.debugRenderExtension, true, true); }

// Draws some text for each log message
jam.Game = jam.extend(jam.Game, function(self){
	self.render = jam.extend(self.render, function(){
		if(!jam.Debug.showLog) { return; }
		self._context.font = "12px courier new";
		var visibleMessages = jam.logMessages.slice(Math.max(jam.logMessages.length - 10, 0), jam.logMessages.length);
		if(visibleMessages.length == 0) { return; }
		self._context.fillStyle = "rgba(255,255,255,0.5)"
		self._context.fillRect(2,2,300,visibleMessages.length * 14 + 2);

		self._context.fillStyle = "black";
		for (i in visibleMessages){
			var msg = visibleMessages[i];
			self._context.fillText("[" + msg.time/1000.0 + "] " + msg.message, 4, i * 14 + 12);
		}
		self._context.strokeStyle = "rgba(0,0,0,1)";
		self._context.strokeRect(2.5,2.5,300,visibleMessages.length * 14 + 2);

	});
	return self;
}, true, true);

// Various debug features can be enabled or disabled individually:
jam.Debug.showBoundingBoxes = false;
jam.Debug.showLog = false;
