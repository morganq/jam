// Simple Vector library. There's no such thing as operator overloading
// in javascript, so there's a bunch of "static" functions for vector ops.


/*	SAMPLE USAGE:

** Distance between two sprites **
var a = jsGame.Vector(player.x, player.y);
var b = jsGame.Vector(enemy.x, enemy.y);
var offset = jsGame.Vector.sub(a,b);	// Vector between the objects
var distance = offset.getLength();


** Move towards a point **
// Using the stuff from the above example

// Make a unit vector by dividing x and y by the length
var direction = jsGame.Vector(offset.x / distance, offset.y / distance);

player.velocity = jsGame.Vector.mul(direction, 80);

*/

jsGame.Vector = function(x, y){
	var self = {};
	self.x = x;
	self.y = y;
	
	// Returns a nice string representation of the vector
	self.toString = function() { return "<" + self.x + ", " + self.y + ">"; };
	
	// Gets the length of the vector
	self.getLength = function() { return Math.sqrt(self.x*self.x+self.y*self.y); }
	
	// Gets the squared length of the vector. This avoids expensive square root
	// and should be used for comparisons (squaring both sides of the equation)
	self.getLengthSq = function() { return self.x*self.x+self.y*self.y; }
	
	self.equals = function(v) { return self.x == v.x && self.y == v.y; }
	
	return self;
}


// Adds a vector to a vector
jsGame.Vector.add = function(v1, v2){
	return jsGame.Vector(v1.x + v2.x, v1.y + v2.y)
}

// Subtracts vector 2 from vector 1
jsGame.Vector.sub = function(v1, v2){
	return jsGame.Vector(v1.x - v2.x, v1.y - v2.y);
}

// Multiplies a vector by a scalar
jsGame.Vector.mul = function(v, s){
	return jsGame.Vector(v.x * s, v.y * s);
}

// Divides a vector by a scalar
jsGame.Vector.div = function(v, s){
	return jsGame.Vector(v.x / s, v.y / s);
}

// returns true if the components of the vectors are equal
jsGame.Vector.compare = function(v1, v2){
	return v1.x == v2.x && v1.y == v2.y;
}
