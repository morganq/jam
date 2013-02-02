require.config({
	baseUrl:"jam/",
});

require(["jam", "../lib/sylvester"], function(jam, syl) {
  jam.config({dataDir:"example/data/"});

  var main = function() {

	var level = "1,0,0,0,0,0,0,1\n" +
				"1,0,0,0,0,0,0,1\n" + 
				"1,0,0,0,0,0,1,1\n" +
				"1,0,0,0,0,0,0,1\n" +
				"1,1,0,0,0,0,0,1\n" +
				"1,0,0,0,0,0,0,1\n" +
				"1,0,0,0,0,0,0,1\n" +
				"1,1,1,1,1,1,1,1\n";

	var g = new jam.Game(320, 240, document.body, 2);

	var tm = new jam.TileMap(32, "tiles.png");
	tm.loadCSV(level);

	// convenience
	var scene = g.root.scene;
	scene.add(tm);
		
	var guy = new jam.Sprite(0, 0);
	guy.setImage("player_red.png", 16, 17);
	scene.add(guy);

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
	  }
      return false;
    }
    document.addEventListener('keydown',handlekeydown,false);

	g.run();
  };

  var preload = function() {
	jam.preload("image.png");
	jam.preload("tiles.png");
	jam.showPreloader(main);
  };

  preload();
});
