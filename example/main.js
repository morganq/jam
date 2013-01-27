require.config({
	baseUrl:"jam/"
});

require(["jam"], function(jam) {

	var main = function() {
		var g = new jam.Game(640, 480);

		// convenience
		var scene = g.root.scene;
		
		var guy = new jam.Sprite(30, 30, "example/data/image.png");
		scene.add(guy);

		guy.on("update", function(elapsed) {
			this.angle += elapsed * 360;
		});

		scene.on("update", function(elapsed) {
			this.alpha -= elapsed / 10;
		});

		g.run();
	};

	var preload = function() {
		jam.preload("example/data/image.png");
		jam.showPreloader(main);
	};

	preload();
});