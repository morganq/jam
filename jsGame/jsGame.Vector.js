// Simple Vector library. There's no such thing as operator overloading
// in javascript. That sucks big time. I made all the operations "static"
// so that the Vector objects are small. 

jsGame.Vector = function(x, y){
	var self = {};
	self.x = x;
	self.y = y;
	self.toString = function() { return "<" + self.x + ", " + self.y + ">"; };
	return self;
}


jsGame.Vector.getLength = function(v){
	return Math.sqrt(v.x*v.x + v.y*v.y);
}

jsGame.Vector.getLengthSq = function(v){
	return v.x*v.x + v.y*v.y;
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

jsGame.Vector.compare = function(v1, v2){
	return v1.x == v2.x && v1.y == v2.y;
}
