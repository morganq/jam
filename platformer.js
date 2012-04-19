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
	
	//jam.Debug.showBoundingBoxes = true;		// Uncomment to see the collision regions
	
	var bg = jam.Sprite(0, 0);
	bg.width = 640; bg.height = 480;
	bg.image = document.createElement("canvas");
	bg.image.width = 640;
	bg.image.height = 480;
	erase = false;
	var ctx = bg.image.getContext("2d");
	
	var map = jam.LevelMap.loadTileMap(32, map1, "platformer_data/tiles.png");
	var player = makePlayer(game, map);
	
	bg.color = "rgba(0,128,255,0.75)";
	
	bg.update = jam.extend(bg.update, function(elapsed){
		for(var i = 0; i < 7; i++)
		{
			ctx.beginPath();
			if(erase){
				ctx.arc(player.smoothX + Math.random() * 20 - 10, player.smoothY + Math.random() * 20 - 10, Math.random() * 3 + 2, 0, 2 * Math.PI, false);
				ctx.fillStyle = "rgba(255,255,255, 0.75)";
			}
			else{
				ctx.arc(player.smoothX + Math.random() * 16 - 8, player.smoothY + Math.random() * 16 - 8, Math.random() * 3 + 1, 0, 2 * Math.PI, false);
				ctx.fillStyle = bg.color;	
			}
			ctx.fill();
		}
		ctx.beginPath();
		ctx.arc(player.smoothX, player.smoothY, 4, 0, 2 * Math.PI, false);
		ctx.fillStyle = erase ? "rgba(255,255,255, 0.75)" : bg.color;		
		ctx.fill();
		
		if(jam.Input.justPressed("B")){
			erase = false;
		}
		if(jam.Input.justPressed("E")){
			erase = true;
		}
		if(jam.Input.justPressed("1")){
			bg.color = "rgba(0,128,255,0.75)";
		}
		if(jam.Input.justPressed("2")){
			bg.color = "rgba(255,0,64,0.75)";
		}
		if(jam.Input.justPressed("3")){
			bg.color = "rgba(0,0,0,0.75)";
		}
	});	
	
	game.add(map);	
	game.add(player);
	game.add(bg);
	
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

	player.lastPositions = [];
	player.smoothX = player.x + player.width/2;
	player.smoothY = player.y + player.height/2;
	
	player.update = jam.extend(player.update, function(elapsed){
		// Collision
		player.collide(map);
		
		// Running / standing
		player.velocity.x = 0;
		if(jam.Input.buttonDown("LEFT")){
			player.velocity.x = -90;
			player.playAnimation(player.anim_run);
			player.facing = jam.Sprite.LEFT;
		}
		else if(jam.Input.buttonDown("RIGHT")){
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
		
		player.lastPositions.splice(0,0, jam.Vector(player.x + player.width / 2, player.y + player.height / 2));
		for(var i = 0; i < Math.min(player.lastPositions.length, 10); ++i){
			player.smoothX += player.lastPositions[i].x;
			player.smoothY += player.lastPositions[i].y;
		}
		player.smoothX /= i+1;
		player.smoothY /= i+1;
	});
	return player;
}