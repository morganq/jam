require.config({
  baseUrl:"../../jam/",
});

require(["jam", "../lib/sylvester"], function(jam, syl) {
  jam.config({dataDir:"data/"});
  var game;
  var scene;
  var node = function(x, y, width, height, parent){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;
    this._collisionOffsetX = 0;
    this._collisionOffsetY = 0;
    this._collisionOffsetWidth = 0;
    this._collisionOffsetHeight = 0;
    this.nodes = [];
    this.children = [];
    scene.add(this);
  };

  node.prototype.split = function(){
    var w = Math.floor(this.width / 2);
    var h = Math.floor(this.height / 2);

    // Alg quads.
    this.nodes.push(new node(this.x + w, this.y, w, h));
    this.nodes.push(new node(this.x, this.y, w, h));
    this.nodes.push(new node(this.x, this.y + h, w, h));
    this.nodes.push(new node(this.x + w, this.y + h, w, h));
  };

  node.prototype.contains = function(){
  };

  node.prototype.update = function(){
  };

  node.prototype.render = function(ctx, cam){
      var cam = {};
      cam.scroll = {x:0,y:0};
    if(!jam.Debug.showBoundingBoxes) { return; }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,0,0,0.6)";
    ctx.strokeRect( Math.floor(this.x - cam.scroll.x)+0.5,
                    Math.floor(this.y - cam.scroll.y)+0.5,
                    this.width, this.height);
    ctx.strokeStyle = "rgba(0,255,255,0.5)";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  };

  node.prototype.flush = function(){
    if (this.children.length > 0){
      this.children.length = [];
    }
    if (this.nodes.length > 0){
      for (n in this.nodes){
        this.nodes[n].flush();
      }
    }
  };

  node.prototype.MAX_ALLOWED = 2;
  node.prototype.subSprites = [];

  var quadTree = function(width, height){
    var n = new node(0, 0, width - 1, height - 1);
    return n;
  };

  var shots;

  node.prototype.build = function(){
    if (this.children.length > this.MAX_ALLOWED){
      if (this.nodes.length === 0){
        this.split();
      }
      var w = Math.floor(this.width / 2);
      var h = Math.floor(this.height / 2);
      for (i in this.children){
        var c = this.children[i];
        if ((c.x >= this.x + w) && (c.y <= this.y + h)){
          // First quad.
          this.nodes[0].children.push(c);
        } else if ((c.x <= this.x + w) && (c.y <= this.y + h)){
          // Second quad.
          this.nodes[1].children.push(c);
        } else if ((c.x <= this.x + w) && (c.y >= this.y + h)){
          // Third quad.
          this.nodes[2].children.push(c);
        } else if ((c.x >= this.x + w) && (c.y >= this.y + h)){
          // Fourth quad.
          this.nodes[3].children.push(c);
        } else {
          console.log('Panic.');
        }
      }
      this.children = [];
      for (n in this.nodes){
        this.nodes[n].build();
      }
    }
  };

  /**/
  window.setTimeout(function(){
    console.log = function(){
    };
  }, 8000);
  /**/

  node.prototype.calc = function(s){
    // Returns an array of nodes to collide s against, in case s called on a
    // boundry and overlaps multiple nodes.
    //if (!s.overlaps(this)){
    if (!jam.Rect.collide([this], [s])){
      return [];
    }


    var ret = [];
    if (this.children.length > 0){
      ret = ret.concat(this.children);
    }

    if (this.nodes.length > 0){
      for (n in this.nodes){
        var t = this.nodes[n].calc(s);
        ret = ret.concat(t);
      }
    }
    return ret;
  };

  var spawner = function(){
    this.children = [];
    var makeShot = function(x, y){
      var s = new jam.Sprite(x, y);
      s.update = jam.extend(s.update, function(elapsed){

      });
      scene.add(s);
    };
  };

  var initialize = function(){
    game = window.game = new jam.Game(640, 480, document.body);
    // game = new jam.Game(320, 240, document.body, 2);
    scene = game.root.scene;

    var p = new jam.Sprite(0, 0);
    p.setImage("ship.png");
    scene.add(p);

    var qt = quadTree(640, 480);

    scene.add(qt);

    //  var shots = [];
    shots = [];

    p.health = {};
    p.health.max = 10;
    p.health.val = p.health.max;
    p.health.container = new jam.Sprite(20, 20);

    var dig = 10;
    var hei = 20

    var con_can = document.createElement("canvas");
    con_can.width = p.health.max * dig;
    con_can.height = hei;
    var con_ctx = con_can.getContext("2d");
    con_ctx.lineWidth = 1;
    con_ctx.strokeStyle = "rgba(255,0,0,0.6)";
    con_ctx.strokeRect(0, 0, p.health.max * dig, hei);

    p.health.con = new jam.Sprite(520, 20);
    p.health.con.image = con_can;
    p.health.con.width = con_can.width;
    p.health.con.height = con_can.height;
    scene.add(p.health.con);

    var bar_can = document.createElement("canvas");
    bar_can.width = dig;
    bar_can.height = hei;
    var bar_ctx = bar_can.getContext("2d");
    bar_ctx.lineWidth = 1;
    bar_ctx.fillStyle = "rgba(0,255,255,0.5)";
    bar_ctx.fillRect(0, 0, dig, hei);

    p.health.bars = [];

    var x = p.health.con.x;
    var y = p.health.con.y;

    var i;
    for (i = 0; i < p.health.max; i ++){
      var b = new jam.Sprite(x, y);
      x += dig;
      b.image = bar_can;
      b.width = bar_can.width;
      b.height = bar_can.height;
      scene.add(b);
      p.health.bars[i] = b;
    }

    p.hit = function(dmg){
      var i;
      for (i = 0; i < dmg; i++){
        p.health.val -= 1;
        p.health.bars[p.health.val].visible = false;
        if (p.health.val < 1){
          console.log("DIE");
        }

      }
    };

    p.speed = 200;

    //p.update = jam.extend(p.update, function(elapsed){
    p.on("update", function(elapsed) {
      qt.flush();
      qt.children = shots.slice(0);;
      qt.build();
      var pcolls = qt.calc(p);
      for (c in pcolls){
        if (p.overlaps(pcolls[c])){
          p.hit(1);
          scene.remove(pcolls[c]);
          console.log('!');
          shots.splice(shots.indexOf(pcolls[c], 1));
        }
      }
      p.velocity.x = 0;
      p.velocity.y = 0;

      if(jam.Input.down("LEFT")){
  	  p.velocity.x = -p.speed;
  	  //p.playAnimation(p.anim_run);
  	  //p.facing = jam.Sprite.LEFT;
  	} else if(jam.Input.down("RIGHT")){
  	  p.velocity.x = p.speed
        //p.playAnimation(p.anim_run);
  	  //p.facing = jam.Sprite.RIGHT;
  	} else if (jam.Input.down("UP")){
  	  p.velocity.y = -p.speed;
  	  //p.playAnimation(p.anim_up);
  	} else if (jam.Input.down("DOWN")){
  	  p.velocity.y = p.speed;
  	  //p.playAnimation(p.anim_down);
      } else{
  	  //p.playAnimation(p.anim_idle);
      }
    });

    var makeShot = function(x, y){
      var s = new jam.Sprite(x, y);
      s.setImage("shot.png");
      shots.push(s);
      scene.add(s);
      return s
    };

    makeShot(100, 100);
    makeShot(100, 90);
    makeShot(100, 80);
    makeShot(20, 20);

    jam.Debug.showBoundingBoxes = true;
    if (jam.Debug.showBoundingBoxes === true){
      //Debug shit
    }

    game.run();
  };

  var preload = function(){
    jam.preload("ship.png");
    jam.preload("shot.png");
    jam.showPreloader(initialize);
  };

  preload();
});