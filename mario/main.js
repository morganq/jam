main = function(jam) {
	console.log(jam);
	jam.config({dataDir:"data/"});

	var run = function() {
		var game = new jam.Game(320, 240, document.body, 2);
	}

	jam.preload("image.png");
	jam.preload("tiles.png");
	jam.showPreloader(run);
}
