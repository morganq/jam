// This is how we get keyboard input for now, and maybe mouse in the future.
// This object is much more like a namespace than a class. There's a lot of
// stuff hidden in closures and self is not used. We just return an object with
// the functions we want to expose.

/*	SAMPLE USAGE:

** Basic movement behavior **
if(jsGame.Input.keyDown("LEFT")) { player.x = -1; }

** Fire a weapon  **
if(jsGame.Input.justPressed("X")) {
	var bullet = jsGame.Sprite(some_x, some_y);
	bullet.setImage("image.png");
	bullet.velocity.x = 200;
	game.add(bullet)
}

** Charge up a jump **
if(jsGame.Input.keyDown("Z")) {	charge += elapsed; }
if(jsGame.Input.justReleased("Z")){	velocity.y = -(charge+40); }

** Bindable keys **
keyBindings = {attack: "Z", dash: "X"};
if(jsGame.Input.keyDown(keyBindings.attack)) { player.playAnimation(attacking); }

*/

jsGame.Input = function(){
	var self = {}
	
	// Based on a keycode, get a string name for the key.
	// Special cases for arrow keys
	getName = function(code){
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
	
	var justPressedKeys = [];
	var justReleasedKeys = [];
	var keys = {};
	
	document.onkeydown = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(keys[getName(code)] === false || keys[getName(code)] === undefined){
			keys[getName(code)] = true;
			justPressedKeys.push(getName(code));
		}
	};
	document.onkeyup = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(keys[getName(code)] === true){
			keys[getName(code)] = false;
			justReleasedKeys.push(getName(code));
		}
	};

	var _update = function()
	{
		justPressedKeys = [];
		justReleasedKeys = [];
	}

	// Gotta add our update at the end of the game update. We need
	// an update function to make sure the justPressed and justReleased
	// lists are updated each frame.
	jsGame.Game = jsGame.extend(jsGame.Game, function(cls){
		cls.update = jsGame.extend(cls.update, function(){
			self._update();
		});
		return cls;
	}, true, true);

	self = {
		// Returns true if the key is currently being held down
		keyDown : function(name){
			return keys[name];
		},
		
		// Returns true if the key was pressed this frame
		justPressed : function(name){
			return justPressedKeys.indexOf(name) !== -1;
		},
		
		// Returns true if the key was released this frame
		justReleased : function(name){
			return justReleasedKeys.indexOf(name) !== -1;
		},
		
		// Making this accessible so that it can be extended later.
		_update : _update
	};
	
	return self;


}();

