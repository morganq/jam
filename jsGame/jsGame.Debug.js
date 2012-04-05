// Adds some functionality to various modules for debug purposes

/*	SAMPLE USAGE:
** Tilde shows the log **
if(jsGame.Input.justPressed("~")) { jsGame.Debug.showLog = !jsGame.Debug.showLog; }
if(some_condition) { jsGame.log("something happened!"); }

*/

jsGame.Debug = {};

// Add a box around all sprites so we can see their collision boxes
jsGame.Debug.debugRenderExtension = function(self){

		self.render = jsGame.extend(self.render, function(context, camera) {
			if(!jsGame.Debug.showBoundingBoxes) { return; }
			context.lineWidth = 1;
			context.strokeStyle = "rgba(255,0,0,0.5)";
			context.strokeRect(	Math.floor(self.x - camera.scroll.x)+0.5,
								Math.floor(self.y - camera.scroll.y)+0.5,
								self.width, self.height);
		});
		
		return self;
		
};
jsGame.Sprite = jsGame.extend(jsGame.Sprite, jsGame.Debug.debugRenderExtension, true, true);
if(jsGame.AnimatedSprite) { jsGame.AnimatedSprite = jsGame.extend(jsGame.AnimatedSprite, jsGame.Debug.debugRenderExtension, true, true); }

// Draws some text for each log message
jsGame.Game = jsGame.extend(jsGame.Game, function(self){
	self.render = jsGame.extend(self.render, function(){
		if(!jsGame.Debug.showLog) { return; }
		self._context.font = "12px courier new";
		var visibleMessages = jsGame.logMessages.slice(Math.max(jsGame.logMessages.length - 10, 0), jsGame.logMessages.length);
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
jsGame.Debug.showBoundingBoxes = false;
jsGame.Debug.showLog = false;
