window.onload = function(){
	jsGame.loadFileAsync("lvl1.map", initialize);
	jsGame.Sound.load("data/coin.wav");
	jsGame.Sound.load("data/jump.wav");
	jsGame.Sound.load("data/shoot.wav");
	jsGame.Sound.load("data/hurt.wav");
	jsGame.Sound.load("data/kill.wav");
	jsGame.Sound.load("data/win.wav");
}

function initialize(mapData)
{
	var game = jsGame.Game(480, 320, document.body);

	var level = null;
	var eg = jsGame.CollisionGroup();
	var mg = jsGame.CollisionGroup(); // Missile group

	makeEnemy = function(map, x, y){
		var e = jsGame.Sprite(x * 32, y * 32)
		e.setImage("http://www.mariomayhem.com/downloads/sprites/smas/smb2-enemies_sheet.png", 32,40);
		var walkAnim = jsGame.Animation.Strip([2,3], 40, 40, 4.0, 0, 104);
		e.playAnimation(walkAnim);
		game.add(e);
		e.acceleration.y = 300;
		e.velocity.x = -50;
		e.dying = false;
		e.update = jsGame.extend(e.update, function(){
			if(level && !e.dying){level.collide(e);}

			if(!e.dying){e.overlaps(mg, function(a,b){
				e.dying = true;
				e.velocity.y = -100;
				b.velocity.x = 0;
				e.velocity.x += b.velocity.x/2;
				jsGame.timer(300, function() {
					game.remove(b);
					mg.remove(b);
				});
				jsGame.Sound.play("data/kill.wav");
				var s = jsGame.Sprite(e.x, e.y+10);
				s.setImage("http://home.gna.org/freeeq/ikiwiki/manual/sprite_coin.png");	
				game.add(s);
				coinGroup.add(s);
			});}

			if(e.dying) { e.flash(5.0); return; }
			e.facing = e.velocity.x > 0 ? jsGame.Sprite.RIGHT : jsGame.Sprite.LEFT;
			if(e.touchingLeft) { e.velocity.x = 50; }
			if(e.touchingRight) { e.velocity.x = -50; }
			if(e.touchingBottom && Math.random() < 0.005) { e.velocity.y = -200; }
		});
		eg.add(e);
	}

	/**** Initialize the map ****/
	var coinGroup = jsGame.CollisionGroup();

	var finishFlash = null;

	var indices = { 9 : function(map, x, y){
			var s = jsGame.Sprite(x*32, y*32);
			s.setImage("http://home.gna.org/freeeq/ikiwiki/manual/sprite_coin.png");	
			game.add(s);
			coinGroup.add(s);
		}, F : function(map, x, y){
			makeEnemy(map, x, y);
		}, E : function(map, x, y){
			var s = jsGame.Sprite(x*32, y*32 - 10);
			s.setImage("http://www.entertainmentpartners.com/uploadedImages/Products/big_flag-sm.png");
			game.add(s);
			finishFlag = s;
		}
		 };

	level = jsGame.LevelMap.loadTileMap(32, mapData, "http://3.bp.blogspot.com/-DFgddbbASUQ/TVrygllgRmI/AAAAAAAAAQU/rYH_mJgGql4/s1600/mario+tileset.png", indices);
	game.add(level);


	/**** Create the player ****/
	var player = jsGame.Sprite(50,0);
	player.setImageColorKey("data/GunstarRed.gif", 38, 40);

	var runAnim = jsGame.Animation.Strip([0,1,2,3,4,5], 45, 40, 6.0, 112, 0);
	var standAnim = jsGame.Animation.Strip([0,1], 35, 40, 1.0, 0, 0);
	var shootAnim = jsGame.Animation.Strip([0, 1, 1, 2, 2, 3], 46, 40, 9.0, 0, 152, function(){
		player.shooting = false;	
	});	
	var getAnim = jsGame.Animation.Strip([0,1,2], 32, 55, 4.0, 60, 664, function(){
		player.getcoin = false;
		player.height = 40
		player.y += 15;
	});

	player.playAnimation(standAnim);
	player.acceleration.y = 850;
	player.health = 476;

	game.add(player);

	player.update = jsGame.extend(player.update, function(){
		if(level){level.collide(player);}
		player.overlaps(coinGroup, function(a, b){
			jsGame.Sound.play("data/coin.wav");
			player.getcoin = true;
			player.height = 55;
			game.remove(b);
			coinGroup.remove(b);
		});
		player.overlaps(eg, function(a, b){
			if(b.dying){return;}
			if(!player.flashing)
			{
				jsGame.Sound.play("data/hurt.wav");
				player.health -= 50;
				player.flash(1.0);
			}
			if(player.health <= 0)
			{
				game.remove(player);
			}
		});
		if(player.overlaps(finishFlag))
		{
			jsGame.Sound.play("data/win.wav");
			var s = jsGame.Sprite(game.camera.scroll.x + 40, game.camera.scroll.y - 20);
			game.update = function(){};
			s.setImage("http://2.bp.blogspot.com/_NwXiQ3VfUFI/TQsZzZUfnqI/AAAAAAAAAVU/4Ybx_V3SgdE/s1600/You%2BWin.jpg");
			game.add(s);
		}
		player.velocity.x = 0;
		if ( jsGame.Input.keyDown("LEFT") )
		{
			player.velocity.x = -200;
			player.facing = jsGame.Sprite.LEFT;
			player.playAnimation(runAnim);
		}
		if ( jsGame.Input.keyDown("RIGHT") )
		{
			player.velocity.x = 200;
			player.facing = jsGame.Sprite.RIGHT;
			player.playAnimation(runAnim);
		}
		if ( player.velocity.x == 0)
		{
			player.playAnimation(standAnim);
		}
		if ( player.shooting === true ){
			player.playAnimation(shootAnim);
			player.velocity.x = 0;
		}
		if ( player.getcoin === true ){
			player.playAnimation(getAnim);
			player.velocity.x = 0;
		}
		if ( jsGame.Input.justPressed("X") && !player.getcoin && !player.shooting )
		{
			jsGame.timer(200, function(){
				jsGame.Sound.play("data/shoot.wav");
				var missile = jsGame.Sprite(player.x, player.y + 10);
				missile.setImage("http://www.attiliocarotenuto.com/articlesfiles/article115/laser.png");	
				jsGame.timer(400, function(){
					mg.remove(missile);
					game.remove(missile);
				});
				missile.facing = player.facing;
				missile.velocity.x = (player.facing === jsGame.Sprite.RIGHT) ? 600 : -600; 
				game.add(missile);
				mg.add(missile);
			});
			player.shooting = true;
			//jsGame.Sound.play("http://rpg.hamsterrepublic.com/wiki-images/2/21/Collision8-Bit.ogg");
		}
		if( jsGame.Input.justPressed("UP") && player.touchingBottom && !player.getcoin && !player.shooting) {
			jsGame.Sound.play("data/jump.wav");
			player.velocity.y = -440;
			//jsGame.Sound.play("http://rpg.hamsterrepublic.com/wiki-images/d/db/Crush8-Bit.ogg");
			jsGame.log("derp");
		}
	});	

	game.update = jsGame.extend(function(){

		if(level){
			level.overlaps(mg, function(a,b){
				b.velocity.x *= 0.7;
				jsGame.timer(300, function() {
					game.remove(b);
					mg.remove(b);
				});
			});
		}

		game.camera.scroll.x = player.x - 240;

		if(jsGame.Input.justPressed("~"))
		{
			jsGame.Debug.showLog = !jsGame.Debug.showLog;
		}

	}, game.update, false, false);


	var hpbar = jsGame.Sprite(2,2);
	hpbar.rectangleImage(476, 10, "rgb(255,0,0)");
	game.add(hpbar);
	hpbar.render = jsGame.extend(function(){
		hpbar.x = game.camera.scroll.x + 2;
		hpbar.y = game.camera.scroll.y + 2;
		hpbar.width = Math.max(player.health,1);
		if(player.health <= 0)
		{
			hpbar.visible = false;
		}
	}, hpbar.render);

	game.run();

}
