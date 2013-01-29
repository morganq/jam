define([], function() {
  var self = {};
  self.isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]'; 
  };
  return self;
});
