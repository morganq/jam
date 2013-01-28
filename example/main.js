require.config({
	baseUrl:"jam/"
});

require(["jam"], function(jam) {
	jam.config({dataDir:"example/data/"});

	var main = function() {
		var g = new jam.Game(320, 240, document.body, 2);

		// convenience
		var scene = g.root.scene;
		
		var guy = new jam.Sprite(30, 30, "player_red.png");
		guy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 16, 17, 10));
		scene.add(guy);

		guy.on("update", function(elapsed) {
			
		});

		g.run();
	};

	var preload = function() {
		jam.preload("image.png");
		jam.showPreloader(main);
	};

	preload();
});