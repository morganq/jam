require.config({
	baseUrl:"jam/"
});

require(["jam"], function(jam) {
  jam.dataDir = "example/data/";

  var main = function() {
	var g = new jam.Game(320, 240, document.body, 2);

	// convenience
	var scene = g.root.scene;

	var guy = new jam.Sprite(30, 30);
    guy.setImage("player_red.png", 16, 17);
	guy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 16, 17, 10));
	scene.add(guy);
    guy.on("render", jam.Debug.drawBox);

	var dummy = new jam.Sprite(60, 60);
    dummy.setImage("player_red.png", 16, 17);
	dummy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 16, 17, 10));
	scene.add(dummy);
    dummy.on("render", jam.Debug.drawBox);

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
      } else if (e.keyCode == 84) {
        //console.log(jam.Rect.overlap(guy, dummy));
        console.log(jam.Rect.collide(guy, dummy));
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
