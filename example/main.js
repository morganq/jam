require.config({
	baseUrl:"jam/"
});

require(["jam"], function(jam) {
  jam.config({dataDir:"example/data/"});

  var main = function() {
	var g = new jam.Game(320, 240, document.body, 2);

	// convenience
	var scene = g.root.scene;
		
	var guy = new jam.Sprite(30, 30);
	guy.setImage("player_red.png", 16, 17);
	guy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 10, 0, 0, function() {
	  jam.Sound.play("footstep1.mp3");
	}));
	scene.add(guy);
    guy.on("render", jam.Debug.drawBox);

	var dummy = new jam.Sprite(60, 60);
    dummy.setImage("player_red.png", 16, 17);
	dummy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 10, 0, 0));
	scene.add(dummy);
    dummy.on("render", jam.Debug.drawBox);

	var immovableDummy = new jam.Sprite(80, 80);
    immovableDummy.setImage("player_red.png", 16, 17);
	immovableDummy.playAnimation(new jam.Sprite.Animation([1,2,3,4,5,6], 10, 0, 0));
	scene.add(immovableDummy);
    immovableDummy.on("render", jam.Debug.drawBox);
    immovableDummy.immovable = true;

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
        console.log(jam.Rect.collide(guy, dummy));
        console.log(jam.Rect.collide(guy, immovableDummy));
      } else if (e.keyCode == 79) {
        // o
        console.log(jam.Rect.overlap(guy, dummy));
        console.log(jam.Rect.overlap(guy, immovableDummy));
      } else if (e.keyCode == 83) {
        console.log(jam.Rect.separate(guy, dummy));
        console.log(jam.Rect.separate(guy, immovableDummy));
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
