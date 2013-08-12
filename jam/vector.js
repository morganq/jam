define([], function() {
  var vector = function(x, y) {
	this.x = x;
	this.y = y;
  };

  // Returns a nice string representation of the vector.
  vector.prototype.toString = function() { return "<" + this.x + ", " + this.y + ">"; };

  // Gets the length of the vector.
  vector.prototype.getLength = function() { return Math.sqrt(this.x*this.x+this.y*this.y); };

  // Gets the squared length of the vector. This avoids expensive square root
  // and should be used for comparisons (squaring both sides of the equation).
  vector.prototype.getLengthSq = function() { return this.x*this.x+this.y*this.y; };

  vector.prototype.equals = function(v) { return this.x === v.x && this.y === v.y; };

  // Adds a vector to a vector
  vector.add = function(v1, v2){
	return new vector(v1.x + v2.x, v1.y + v2.y);
  };

  // Subtracts vector 2 from vector 1
  vector.sub = function(v1, v2){
	return new vector(v1.x - v2.x, v1.y - v2.y);
  };

  // Multiplies a vector by a scalar
  vector.mul = function(v, s){
	return new vector(v.x * s, v.y * s);
  };

  // Divides a vector by a scalar
  vector.div = function(v, s){
	return new vector(v.x / s, v.y / s);
  };

  // returns true if the components of the vectors are equal
  vector.compare = function(v1, v2){
	return v1.x == v2.x && v1.y == v2.y;
  };

  return vector;
});
