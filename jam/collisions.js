define(["jam", "vector"], function(jam, Vector) {
  var self = {};
  self.overlaps = function(s1, s2, callback){
    if(s1 === undefined || s2 === undefined) { return false; }
    var g1 = [s1];
    var g2 = [s2];
    var returnValue = false;
    // Now loop through the two lists (n^2 LOL) and compare everything
    // TODO: Quadtree? :P
    for(var i = 0; i < g1.length; ++i) {
      for(var j = 0; j < g2.length; ++j) {
        /** /
        var x1 = g1[i].x + g1[i]._collisionOffsetX;
        var y1 = g1[i].y + g1[i]._collisionOffsetY;
        var w1 = g1[i].width + g1[i]._collisionOffsetWidth;
        var h1 = g1[i].height + g1[i]._collisionOffsetHeight;
        
        var x2 = g2[j].x + g2[j]._collisionOffsetX;
        var y2 = g2[j].y + g2[j]._collisionOffsetY;
        var w2 = g2[j].width + g2[j]._collisionOffsetWidth;
        var h2 = g2[j].height + g2[j]._collisionOffsetHeight;
        /**/

        var x1 = g1[i].x;
        var y1 = g1[i].y;
        var w1 = g1[i].width;
        var h1 = g1[i].height;
        
        var x2 = g2[j].x;
        var y2 = g2[j].y;
        var w2 = g2[j].width;
        var h2 = g2[j].height;

        console.log(x1);
        console.log(y1);
        console.log(w1);
        console.log(h1);

        console.log(x2);
        console.log(y2);
        console.log(w2);
        console.log(h2);
        
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
  return self;
});
