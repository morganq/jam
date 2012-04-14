jam.includeModule("RectCollision");
jam.includeModule("Animation");
jam.includeModule("LevelMap");
jam.includeModule("Debug");

jam.include("platformer_data/map.js");

window.onload = function(){
	// Start loading images immediately instead of when they're needed
	jam.preload("platformer_data/player.png");
	
	// Show a loading bar until all the preloading is done, at which point
	// call initialize()
	jam.showPreloader(document.body, initialize);
}

initialize = function(){
	var game = jam.Game(640, 480, document.body);
	
	jam.Debug.showBoundingBoxes = true;		// Uncomment to see the collision regions
	
	var map = jam.LevelMap.loadTileMap(32, map1, "platformer_data/tiles.png");
	var player = makePlayer(game, map);
	
	game.add(map);	
	game.add(player);
	
	game.run();
}

makePlayer = function(game, map){
	var player = jam.AnimatedSprite(250, 400);
	player.setImage("platformer_data/player.png", 32, 32);
	// Set up player's animations
	player.anim_idle = jam.Animation.Strip([0], 32, 32, 0);
	player.anim_run = jam.Animation.Strip([1,2,3,4,5,6], 32, 32, 9);
	player.anim_jump = jam.Animation.Strip([32], 32, 32, 0);
	player.playAnimation(player.anim_idle);
	
	player.setCollisionOffsets(6, 0, 20, 31);
	player.setLayer(1);

	
	player.update = jam.extend(player.update, function(elapsed){
		// Collision
		player.collide(map);
		
		// Running / standing
		player.velocity.x = 0;
		if(jam.Input.keyDown("LEFT")){
			player.velocity.x = -90;
			player.playAnimation(player.anim_run);
			player.facing = jam.Sprite.LEFT;
		}
		else if(jam.Input.keyDown("RIGHT")){
			player.velocity.x = 90;
			player.playAnimation(player.anim_run);
			player.facing = jam.Sprite.RIGHT;
		}
		else{
			player.playAnimation(player.anim_idle);
		}
		
		// Jumping animation
		if(!player.touchingBottom){
			player.playAnimation(player.anim_jump);
		}
		
		// Jumping
		if((jam.Input.justPressed("X") || jam.Input.justPressed("UP")) && player.touchingBottom){
			player.velocity.y = -200;
		}
		
		// Gravity
		player.velocity.y += 400 * elapsed;
	});
	return player;
}