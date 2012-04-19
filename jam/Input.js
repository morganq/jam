// This is how we get keyboard input for now, and maybe mouse in the future.
// This object is much more like a namespace than a class. There's a lot of
// stuff hidden in closures and self is not used. We just return an object with
// the functions we want to expose.

/*	SAMPLE USAGE:

** Basic movement behavior **
if(jam.Input.buttonDown("LEFT")) { player.x = -1; }

** Fire a weapon  **
if(jam.Input.justPressed("X")) {
	var bullet = jam.Sprite(some_x, some_y);
	bullet.setImage("image.png");
	bullet.velocity.x = 200;
	game.add(bullet)
}

** Charge up a jump **
if(jam.Input.buttonDown("Z")) {	charge += elapsed; }
if(jam.Input.justReleased("Z")){	velocity.y = -(charge+40); }

** Bindable buttons **
buttonBindings = {attack: "Z", dash: "X"};
if(jam.Input.buttonDown(buttonBindings.attack)) { player.playAnimation(attacking); }

*/

jam.Input = function(){
        var KEY_CODE_MAP = {
	    192:"~",
	    32:"SPACE",
	    37:"LEFT",
	    38:"UP",
	    39:"RIGHT",
	    40:"DOWN"
	};
	var MOUSE_BUTTON_MAP = {
	    1:'MOUSE_LEFT',
	    3:'MOUSE_RIGHT'
	};
	var self = {}

	var _getMouseCoords = function(e){
		if(jam.Game._canvas === undefined) { return; }
	    var x;
	    var y;
	    if (e.pageX || e.pageY) {
			// Chrome, Opera
			x = e.pageX;
			y = e.pageY;
	    }
	    else { 
			// FireFox
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	    } 
	    x -= jam.Game._canvas.offsetLeft;
	    y -= jam.Game._canvas.offsetTop;

	    if(x >= 0 && x < jam.Game._canvas.width && y >= 0 && y < jam.Game._canvas.height){
			return jam.Vector(x, y);
	    }
	};
	
	self._justPressedButtons = [];
	self._justReleasedButtons = [];
	self._buttons = {};
	self.mouse = jam.Vector(0,0);
	
	// Based on a keycode, get a string name for the key.
	// Special cases for arrow keys
	self._getName = function(code){
	    if((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) 
		{
			return String.fromCharCode(code);
		}
	    else if(code >= 97 && code <= 122){
			return String.fromCharCode(code).toUpperCase();
	    }
	    if(KEY_CODE_MAP[code] != undefined){
			return KEY_CODE_MAP[code];
	    }
		else{
			return "UKNOWN";
	    }
	};

    self._getMouseButton = function(code){
	    if(MOUSE_BUTTON_MAP[code] != undefined){
			return MOUSE_BUTTON_MAP[code];
	    }
		else{
			return "UNKNOWN";
	    }
	};

	self._update = function()
	{
		self._justPressedButtons = [];
		self._justReleasedButtons = [];
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
		return self._justPressedButtons.indexOf(name) !== -1;
	};
	
	self.justReleased = function(name){
		return self._justReleasedButtons.indexOf(name) !== -1;
	};
	
	self.buttonDown = function(name){
		return self._buttons[name];
	};	

	// Hook into the js events for key pressing
	document.onkeydown = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(self._buttons[self._getName(code)] === false || self._buttons[self._getName(code)] === undefined){
			self._buttons[self._getName(code)] = true;
			self._justPressedButtons.push(self._getName(code));
		}
	};
	document.onkeyup = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(self._buttons[self._getName(code)] === true){
			self._buttons[self._getName(code)] = false;
			self._justReleasedButtons.push(self._getName(code));
		}
	};	
	document.onmousedown = function(e){
	    var button = self._getMouseButton(e.which);
	    if(self._buttons[button] === false || self._buttons[button] === undefined){
			self._buttons[button] = true;
			self._justPressedButtons.push(button);
	    }
	};
	document.onmouseup = function(e){
	    var button = self._getMouseButton(e.which);
	    if(self._buttons[button] === true){
			self._buttons[button] = false;
			self._justReleasedButtons.push(button);
	    }
	};
	document.onmousemove = function(e){
	    var mouse = _getMouseCoords(e);
	    if(mouse != undefined){
			self.mouse = mouse;
	    }
	    // Else mouse is not on the canvas so we don't update the position.
	};	
	
	return self;

}();

