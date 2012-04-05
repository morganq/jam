// Extension to allow for very easy use of the arrow keys as if they were 
// an 8-direction arcade stick.

// jsGame.Input.joy is a unit vector pointing
// in the direction of the combination of input keys.

// jsGame.Input.joyJustChanged is a true if the joystick state has
// changed this frame.

/*	SAMPLE USAGE:

** 8-direction movement **
var speed = 50;
player.velocity = jsGame.Vector.mul(jsGame.Input.joy, speed);


** Hadouken **
var moves = [];
var hadouken = [jsGame.Vector(0, 1), jsGame.Vector(0.7071, 0.7071), jsGame.Vector(1, 0)];

// Inside update function
if(jsGame.Input.joyJustchanged){ moves.push(jsGame.Input.joy); }

var l = moves.length;
if(	l > 2 && 
	moves[l-3].equals(hadouken[0]) &&
	moves[l-2].equals(hadouken[1]) &&
	moves[l-1].equals(hadouken[2]) &&
	jsGame.Input.justPressed("X")) {
		// throw a fireball.
}


*/

jsGame.Input.joy = jsGame.Vector(0,0);
jsGame.Input.joyJustChanged = false;
jsGame.Input._lastJoy = jsGame.Vector(0,0);
jsGame.Input._update = jsGame.extend(jsGame.Input._update, function(){
	var v = jsGame.Vector(0,0);
	if(jsGame.Input.keyDown("UP")){
		v.y -= 1;
	}
	if(jsGame.Input.keyDown("DOWN")){
		v.y += 1;
	}
	if(jsGame.Input.keyDown("LEFT")){
		v.x -= 1
	}
	if(jsGame.Input.keyDown("RIGHT")){
		v.x += 1;
	}
	if(v.x != 0 && v.y != 0)
	{
		// root 2 over 2
		v.x *= 0.7071;
		v.y *= 0.7071;
	}
	jsGame.Input.joy = v;
	jsGame.Input.joyJustChanged = !jsGame.Vector.compare(v,jsGame.Input._lastJoy);
	jsGame.Input._lastJoy = v;
});
