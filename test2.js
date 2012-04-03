jsGame.includeModule("Debug");

window.onload = function(){
	jsGame.preload("http://www.softendo.com/public/styles/images/icon_mario.jpg");
	jsGame.preload("./data/coin.wav");
	jsGame.showPreloader(document.getElementById("game"), initialize);
};

var game;
initialize = function(){
	game = jsGame.Game(400, 300, document.getElementById("game"));
	
	var mario = makePlayer();
	game.update = jsGame.ex(game.update, function(){
		updateLog();
	});
	
	game.run();
}

updateLog = function(){
	document.getElementById("log").innerHTML = "";
	for(var i = Math.max(jsGame.logMessages.length - 20,0); i < jsGame.logMessages.length; i++)
	{
		document.getElementById("log").innerHTML += "["+jsGame.logMessages[i].time/1000.0 + "] " + jsGame.logMessages[i].message + "<br/>";
	}
}

makePlayer = function(){
	var m = jsGame.Sprite(200, 150);
	m.setImage("http://www.softendo.com/public/styles/images/icon_mario.jpg");
	game.add(m);
	
	m.update = jsGame.ex(m.update, function(elapsed){
		m.velocity.x = m.velocity.y = 0;
		if(jsGame.Input.keyDown("DOWN")){
			m.velocity.y = 80;
		}
		if(jsGame.Input.keyDown("UP")){
			m.velocity.y = -80;
		}
		if(jsGame.Input.keyDown("LEFT")){
			m.velocity.x = -80;
		}
		if(jsGame.Input.keyDown("RIGHT")){
			m.velocity.x = 80;
		}		
		
		if(jsGame.Input.justPressed("X")){
			jsGame.Sound.play("./data/coin.wav");
		}
	});
	
	return m;
}