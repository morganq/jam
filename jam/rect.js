define(["jam", "vector"], function(jam, Vector) {
  var self = {};
  self.overlaps = function(s1, s2, callback){
    if(s1 === undefined || s2 === undefined) { return false; }
    // Temporary.
    var g1 = [s1];
    var g2 = [s2];
    var returnValue = false;
    // Now loop through the two lists (n^2 LOL) and compare everything
    // TODO: Quadtree? :P
    for(var i = 0; i < g1.length; ++i) {
      for(var j = 0; j < g2.length; ++j) {

        var x1 = g1[i].x + g1[i]._collisionOffsetX;
        var y1 = g1[i].y + g1[i]._collisionOffsetY;
        var w1 = g1[i].width + g1[i]._collisionOffsetWidth;
        var h1 = g1[i].height + g1[i]._collisionOffsetHeight;
        
        var x2 = g2[j].x + g2[j]._collisionOffsetX;
        var y2 = g2[j].y + g2[j]._collisionOffsetY;
        var w2 = g2[j].width + g2[j]._collisionOffsetWidth;
        var h2 = g2[j].height + g2[j]._collisionOffsetHeight;

        // Detect overlap (maybe this should be overlapSingle)
        if ( x1 + w1 > x2 && y1 + h1 > y2 &&
             x1 <= x2 + w2 && y1 <= y2 + h2 ) {
          if(callback !== undefined){callback(g1[i], g2[j]);}
          returnValue = true;
        }
      }
    }
    return returnValue;
  };

  self.collide = function(s1, s2){
    if(s1 === undefined || s2 === undefined) { return false; }
    // Temporary.
    var g1 = [s1];
    var g2 = [s2];

    var returnValue = false;
    for(var i = 0; i < g1.length; ++i) {
      for(var j = 0; j < g2.length; ++j) {
        self.collideSingle(g1[i], g2[j]);
      }
    }
  };

  self.collideSingle = function(s1, s2) {
    if(!self.collide(s1, s2)){
      return false;
    }
    
    // Figure out how much each object will need to move based on which ones are immmovable
    var staticCo1, staticCo2;
    if(s1.immovable && s2.immovable) { return; }
    else if(s1.immovable) { staticCo2 = 1.0; staticCo1 = 0.0;}
    else if(s2.immovable) { staticCo1 = 1.0; staticCo2 = 0.0;}
    else { staticCo1 = 0.5; staticCo2 = 0.5; }
    
    var x1 = s1.x + s1._collisionOffsetX;
    var y1 = s1.y + s1._collisionOffsetY;
    var w1 = s1.width + s1._collisionOffsetWidth;
    var h1 = s1.height + s1._collisionOffsetHeight;
    
    var x2 = s2.x + s2._collisionOffsetX;
    var y2 = s2.y + s2._collisionOffsetY;
    var w2 = s2.width + s2._collisionOffsetWidth;
    var h2 = s2.height + s2._collisionOffsetHeight;
    
    var penLeft = -(x1 + w1 - x2);
    var penRight = -(x1 - (x2 + w2));
    var penTop = -(y1 + h1 - y2);
    var penBottom = -(y1 - (y2 + h2));
    
    var minHorizSep = (penRight < -penLeft ? penRight : penLeft);
    var minVertSep = (penBottom < -penTop ? penBottom : penTop);
    
    // Separate the objects, reset their velocities
    // and set the touching flags.    
    if(Math.abs(minHorizSep) < Math.abs(minVertSep)){
      if ( minHorizSep > 0 ) {
        s1.touchingLeft = true;
        s1.velocity.x = Math.max(0, s1.velocity.x);
        s2.touchingRight = true;
        s2.velocity.x = Math.min(0, s2.velocity.x);
      }
      else {
        s1.touchingRight = true;
        s1.velocity.x = Math.min(0, s1.velocity.x);
        s2.touchingLeft = true;
        s2.velocity.x = Math.max(0, s2.velocity.x);
      }
      s1.x += minHorizSep * staticCo1;
      s2.x -= minHorizSep * staticCo2;
    } else {
      if ( minVertSep > 0 ) {
        s1.touchingTop = true;
        s1.velocity.y = Math.max(0, s1.velocity.y);
        s2.touchingBottom = true;
        s2.velocity.y = Math.min(0, s2.velocity.y);
      }
      else {
        s1.touchingBottom = true;
        s1.velocity.y = Math.min(0, s1.velocity.y);
        s2.touchingTop = true;
        s2.velocity.y = Math.max(0, s2.velocity.y);
      }
      s1.y += minVertSep * staticCo1;
      s2.y -= minVertSep * staticCo2;
    }
    return true;
  }
  return self;
});
