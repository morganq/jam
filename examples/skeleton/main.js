require.config({
  baseUrl:"../../jam/",
});

require(["jam", "../lib/sylvester"], function(jam, syl) {
  jam.config({dataDir:"data/"});

  var main = function() {
	var g = new jam.Game(320, 240, document.body, 2);

    // Add your game logic here.

	g.run();
  };

  var preload = function() {
    // Preload your assets here.
	jam.showPreloader(main);
  };

  preload();
});
