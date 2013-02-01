require.config({
	baseUrl:"jam/",
});

require(["jam", "../lib/sylvester"], function(jam, syl) {
  jam.config({dataDir:"example/data/"});

  var main = function() {
	var g = new jam.Game(320, 240, document.body, 2);

	// convenience
	var scene = g.root.scene;
		
	var guy = new jam.Sprite(30, 30);
	guy.setImage("player_red.png", 16, 17);
	guy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 10, 0, 0, function() {
	  //jam.Sound.play("footstep1.mp3");
	}));
	scene.add(guy);

	guy.on("update", function(elapsed) {

	});

    // Lazy movement for testing collisions.
    var handlekeydown = function(e){
      if (e.keyCode == 38) {
        // up
        guy.y -= 5;
      } else if (e.keyCode == 40) {
        // down
        guy.y += 5;
      } else if (e.keyCode == 37) {
        // left
        guy.x -= 5;
      } else if (e.keyCode == 39) {
        // right
        guy.x += 5;
      } else if (e.keyCode == 67) {
        // c
		var t = guy.getTransform();
		console.log(t.inspect());
		var inv = scene.getInverseTransform();
		var test = syl.$V([0, 0, 1]);
		var abs = t.x(test);
		console.log(abs.inspect());
		var fin = inv.x(abs);
		console.log(fin.inspect());
		
      } else if (e.keyCode == 79) {
        // o
		guy.angle += 10;
      } else if (e.keyCode == 83) {
		scene.angle -= 5;
      } else if (e.keyCode == 82) {
		g.root.x -= 5;
	  } else if (e.keyCode == 84) {
		scene.y += 10;
	  } else if (e.keyCode == 85) {
		  g.root.add(guy.transcend(g.root));
	  }
      return false;
    }
    document.addEventListener('keydown',handlekeydown,false);

	g.run();
  };

  var preload = function() {
	jam.preload("image.png");
	jam.showPreloader(main);
  };

  preload();
});
