// Extension to allow for very easy use of the arrow keys as if they were 
// an 8-direction arcade stick.

// jam.Input.joy is a unit vector pointing
// in the direction of the combination of input keys.

// jam.Input.joyJustChanged is a true if the joystick state has
// changed this frame.

/*	SAMPLE USAGE:

** 8-direction movement **
var speed = 50;
player.velocity = jam.Vector.mul(jam.Input.joy, speed);


** Hadouken **
var moves = [];
var hadouken = [jam.Vector(0, 1), jam.Vector(0.7071, 0.7071), jam.Vector(1, 0)];

// Inside update function
if(jam.Input.joyJustChanged){ moves.push(jam.Input.joy); }

var l = moves.length;
if(	l > 2 && 
	moves[l-3].equals(hadouken[0]) &&
	moves[l-2].equals(hadouken[1]) &&
	moves[l-1].equals(hadouken[2]) &&
	jam.Input.justPressed("X")) {
		// throw a fireball.
}


*/

jam.Input.joy = jam.Vector(0,0);
jam.Input.joyJustChanged = false;
jam.Input._lastJoy = jam.Vector(0,0);
jam.Input._update = jam.extend(jam.Input._update, function(){
	var v = jam.Vector(0,0);
	if(jam.Input.buttonDown("UP")){
		v.y -= 1;
	}
	if(jam.Input.buttonDown("DOWN")){
		v.y += 1;
	}
	if(jam.Input.buttonDown("LEFT")){
		v.x -= 1
	}
	if(jam.Input.buttonDown("RIGHT")){
		v.x += 1;
	}
	if(v.x != 0 && v.y != 0)
	{
		// root 2 over 2
		v.x *= 0.7071;
		v.y *= 0.7071;
	}
	jam.Input.joy = v;
	jam.Input.joyJustChanged = !jam.Vector.compare(v,jam.Input._lastJoy);
	jam.Input._lastJoy = v;
});
