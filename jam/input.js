define(["vector"], function(Vector) {
	var lib = {};	
	// key -> name
	var keycodeMap = {
		192:"~",
		32:"SPACE",
		37:"LEFT",
		38:"UP",
		39:"RIGHT",
		40:"DOWN"
	};
	// button -> name
	var mousebuttonMap = {
		1:"MOUSE_LEFT",
		3:"MOUSE_RIGHT"
	};
	lib._buttons = [];
	lib._justPressed = [];
	lib._justReleased = [];

	var games = [];
	var focused = null;

	lib.mouse = new Vector(0,0);

	var getMouseButton = function(e) {
		return mousebuttonMap[e];
	}

	var getKeyButton = function(code) {
		// Numbers + uppercase letters [48-57, 65-90]
		if((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
			return String.fromCharCode(code);
		}
		// lowercase letters
		else if(code >= 97 && code <= 122){
			return String.fromCharCode(code).toUpperCase();
		}
		// keys defined in the mapping above
		if(keycodeMap[code] != undefined){
			return keycodeMap[code];
		}
	}

	var getMouseCoords = function(game, e){
		var x;
		var y;
		if (e.pageX || e.pageY) {
			// Chrome, Opera
			x = e.pageX;
			y = e.pageY;
		}
		else { 
			// FireFox
			x = e.clientX + document.body.scrollLeft +
				document.documentElement.scrollLeft; 
			y = e.clientY + document.body.scrollTop +
				document.documentElement.scrollTop; 
		} 
		x -= game._canvas.offsetLeft;
		y -= game._canvas.offsetTop;

		if(x >= 0 && x < game._canvas.width * game.zoom
		   && y >= 0 && y < game._canvas.height * game.zoom){
			   return new Vector(x/game.zoom, y/game.zoom);
		   }
	};

	// Called when a game gets clicked on. Focuses the relevant
	// game and unfocuses the others
	var refocus = function(game) {
		focused = game;
		for(var i = 0; i < games.length; i++) {
			if(games[i] === game) {
				game.gainFocus();
			}
			else {
				games[i].loseFocus();
			}
		}
	}

	// Called by a particular game each frame so that we can
	// reset frame-specific values (the "JUST" pressed and released values)
	var updateFromGame = function(game) {
		lib._justPressed = [];
		lib._justReleased = [];
	}

	// Games register themselves with the input manager so that we can
	// track which game is focused
	lib.registerGame = function(game) {
		var id = games.length;
		games.push(game);
		// Basically this is just "focus the first game that gets created"
		// focused should never be null other than at this point in
		// initialization
		if(!focused) {
			refocus(game);
		}

		// Helper function-wrapper so that I don't have to duplicate
		// the "am i the focused game?" condition in each of the mouse
		// events
		var focusFunc = function(fn) {
			return function(e) { 
				if(game === focused) {
					fn(e);
				}
			}
		}

		// All the mouse stuff is bound to a specific canvas.
		game._canvas.onclick = function() {
			refocus(game);
		};
		game._canvas.onmousedown = focusFunc(function(e) {	
			var button = getMouseButton(e.which);
			if(!lib._buttons[button]) {
				lib._buttons[button] = true;
				lib._justPressed[button] = true;
			}
		});
		game._canvas.onmouseup = focusFunc(function(e) {
			var button = getMouseButton(e.which);
			if(lib._buttons[button]) {
				lib._buttons[button] = false;
				lib._justReleased[button] = true;
			}
		});
		game._canvas.onmousemove = focusFunc(function(e) {
			var mouse = getMouseCoords(game, e);
			if(mouse != undefined){
				lib.mouse = mouse;
			}	
		});
	};

	// The keyboard stuff is not game-specific (because document's the only
	// reasonable place to get key input)
	document.onkeydown = function(e) {
		var code = ('which' in e) ? e.which : e.keyCode;
		var button = getKeyButton(code);
		if(!lib._buttons[button]) {
			lib._buttons[button] = true;
			lib._justPressed[button] = true;
		}
	};
	document.onkeyup = function(e) {
		var code = ('which' in e) ? e.which : e.keyCode;
		var button = getKeyButton(code);
		if(lib._buttons[button]) {
			lib._buttons[button] = false;
			lib._justReleased[button] = true;
		}
	};	

	// Each game calls this.
	lib.update = function(game) {
		if(game === focused) {
			lib._justPressed = [];
			lib._justReleased = [];
		}
	}

	lib.justPressed = function(button) {
		return lib._justPressed[button] || false;
	};
	lib.justReleased = function(button) {
		return lib._justReleased[button] || false;
	};
	lib.down = function(button) {
		return lib._buttons[button] || false;
	};
	lib.up = function(button) {
		return !lib._buttons[button] || true;
	};

	return lib;
});
