require.config({
	baseUrl:"../jam/",
});

require(["jam", "../lib/sylvester"], function(jam, syl) {
  jam.config({dataDir:"data/"});

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
	tm.x = 20;
	tm.y = 10;
	tm.loadCSV(level);

	// convenience
	var scene = g.root.scene;
	scene.add(tm);
		
	var guy = new jam.Sprite(90, 0);
	guy.setImage("player_red.png", 16, 17);
	scene.add(guy);
	guy.acceleration.y = 250;

	guy.on("update", function(dt) {
		jam.Rect.collide(guy, tm);
		if(jam.Input.down("LEFT")) {
			guy.velocity.x = -50;
		}
		else if (jam.Input.down("RIGHT")) {
			guy.velocity.x = 50;
		}
		else {
			guy.velocity.x = 0;
		}
		if(jam.Input.justPressed("UP")) {
			guy.velocity.y = -100;
		}
	});

	g.root.on("update", function() {
		if(jam.Input.justPressed("MOUSE_LEFT")){
			console.log([jam.Input.mouse.x, jam.Input.mouse.y]);
		}
	});

	g.run();
  };

  var preload = function() {
	jam.preload("image.png");
	jam.preload("tiles.png");
	jam.showPreloader(main);
  };

  preload();
  preload();
});
