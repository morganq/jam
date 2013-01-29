define([], function() {
	var cls = function(x, y) {
		var self = {};

		self.x = x;
		self.y = y;
		
		// Returns a nice string representation of the vector
		self.toString = function() { return "<" + self.x + ", " + self.y + ">"; };
		
		// Gets the length of the vector
		self.getLength = function() { return Math.sqrt(self.x*self.x+self.y*self.y); };
		
		// Gets the squared length of the vector. This avoids expensive square root
		// and should be used for comparisons (squaring both sides of the equation)
		self.getLengthSq = function() { return self.x*self.x+self.y*self.y; };
		
		self.equals = function(v) { return self.x === v.x && self.y === v.y; };
		
		return self;
	};

	// Adds a vector to a vector
	cls.add = function(v1, v2){
		return new cls(v1.x + v2.x, v1.y + v2.y);
	};

	// Subtracts vector 2 from vector 1
	cls.sub = function(v1, v2){
		return new cls(v1.x - v2.x, v1.y - v2.y);
	};

	// Multiplies a vector by a scalar
	cls.mul = function(v, s){
		return new cls(v.x * s, v.y * s);
	};

	// Divides a vector by a scalar
	cls.div = function(v, s){
		return new cls(v.x / s, v.y / s);
	};

	// returns true if the components of the vectors are equal
	cls.compare = function(v1, v2){
		return v1.x == v2.x && v1.y == v2.y;
	};

	return cls;
});