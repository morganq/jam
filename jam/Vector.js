// Simple Vector library. There's no such thing as operator overloading
// in javascript, so there's a bunch of "static" functions for vector ops.


/*	SAMPLE USAGE:

** Distance between two sprites **
var a = jam.Vector(player.x, player.y);
var b = jam.Vector(enemy.x, enemy.y);
var offset = jam.Vector.sub(a,b);	// Vector between the objects
var distance = offset.getLength();


** Move towards a point **
// Using the stuff from the above example

// Make a unit vector by dividing x and y by the length
var direction = jam.Vector(offset.x / distance, offset.y / distance);

player.velocity = jam.Vector.mul(direction, 80);

*/

jam.Vector = function(x, y){
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
jam.Vector.add = function(v1, v2){
	return jam.Vector(v1.x + v2.x, v1.y + v2.y)
}

// Subtracts vector 2 from vector 1
jam.Vector.sub = function(v1, v2){
	return jam.Vector(v1.x - v2.x, v1.y - v2.y);
}

// Multiplies a vector by a scalar
jam.Vector.mul = function(v, s){
	return jam.Vector(v.x * s, v.y * s);
}

// Divides a vector by a scalar
jam.Vector.div = function(v, s){
	return jam.Vector(v.x / s, v.y / s);
}

// returns true if the components of the vectors are equal
jam.Vector.compare = function(v1, v2){
	return v1.x == v2.x && v1.y == v2.y;
}
