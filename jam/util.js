define([], function() {
  var self = {};

  self.isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]'; 
  };

  self.pack = function(o) {
    if (self.isArray(o)) {
      return o;
    } else {
      return [o];
    }
  };
  return self;
});
