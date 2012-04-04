// Extension to allow for very easy use of the arrow keys as if they were 
// an 8-direction arcade stick.

// jsGame.Input.joy is a unit vector pointing
// in the direction of the combination of input keys.

// jsGame.Input.joyJustChanged is a true if the joystick state has
// changed this frame.

jsGame.Input.joy = jsGame.Vector(0,0);
jsGame.Input.joyJustChanged = false;
jsGame.Input._lastJoy = jsGame.Vector(0,0);
jsGame.Input.update = jsGame.extend(jsGame.Input.update, function(){
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
