// This is how we get keyboard input for now, and maybe mouse in the future.
// This object is much more like a namespace than a class. There's a lot of
// stuff hidden in closures and self is not used. We just return an object with
// the functions we want to expose.

/*	SAMPLE USAGE:

** Basic movement behavior **
if(jam.Input.keyDown("LEFT")) { player.x = -1; }

** Fire a weapon  **
if(jam.Input.justPressed("X")) {
	var bullet = jam.Sprite(some_x, some_y);
	bullet.setImage("image.png");
	bullet.velocity.x = 200;
	game.add(bullet)
}

** Charge up a jump **
if(jam.Input.keyDown("Z")) {	charge += elapsed; }
if(jam.Input.justReleased("Z")){	velocity.y = -(charge+40); }

** Bindable keys **
keyBindings = {attack: "Z", dash: "X"};
if(jam.Input.keyDown(keyBindings.attack)) { player.playAnimation(attacking); }

*/

jam.Input = function(){
	var self = {}
	
	// Hook into the js events for key pressing
	document.onkeydown = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(self._keys[self._getName(code)] === false || self._keys[self._getName(code)] === undefined){
			self._keys[self._getName(code)] = true;
			self._justPressedKeys.push(self._getName(code));
		}
	};
	document.onkeyup = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(self._keys[self._getName(code)] === true){
			self._keys[self._getName(code)] = false;
			self._justReleasedKeys.push(self._getName(code));
		}
	};	
	
	self._justPressedKeys = [];
	self._justReleasedKeys = [];
	self._keys = {};
	
	// Based on a keycode, get a string name for the key.
	// Special cases for arrow keys
	self._getName = function(code){
		if(code >= 65 && code <= 90) { return String.fromCharCode(code); }
		else if(code >= 97 && code <= 122){
			return String.fromCharCode(code).toUpperCase();
		}
		switch(code){
			case 192: return "~"; break;
			case 37: return "LEFT"; break;
			case 38: return "UP"; break;
			case 39: return "RIGHT"; break;
			case 40: return "DOWN"; break;
			default: return "UNKNOWN";
		}
	};

	self._update = function()
	{
		self._justPressedKeys = [];
		self._justReleasedKeys = [];
	}

	// Now add our update at the end of the game update. We need
	// an update function to make sure the justPressed and justReleased
	// lists are updated each frame.
	jam.Game = jam.extend(jam.Game, function(cls){
		cls.update = jam.extend(cls.update, function(){
			self._update();
		});
		return cls;
	}, true, true);
	
	
	self.justPressed = function(name){
		return self._justPressedKeys.indexOf(name) !== -1;
	};
	
	self.justReleased = function(name){
		return self._justReleasedKeys.indexOf(name) !== -1;
	};
	
	self.keyDown = function(name){
		return self._keys[name];
	};	
	
	return self;

}();

