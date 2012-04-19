// RectCollision gives us functionality for detecting and resolving collisions
// between sprites, and treats them each as a rectangle.
jam.includeModule("RectCollision");

window.onload = function(){
	initialize();
}

initialize = function(){
	// Initialize the game at 500 x 300 pixel resolution. The canvas
	// gets added to the page as a child of document.body
	var game = jam.Game(500, 300, document.body);
	
	// Score [player score, ai score]
	var score = [0,0];

	// The text object which will display the scores
	var scoreTxt = jam.Text(203, 50);
	game.add(scoreTxt);
	
	// Create a sprite representing the ball
	var ball = jam.Sprite(300, 150);
	// Load the ball image (which we preloaded) into the sprite.
	ball.setImage("pong_data/ball.png");
	// Add the ball so that the game knows to draw and update it.
	game.add(ball);
	
	var player = jam.Sprite(10, 100);	// Player's paddle
	player.setImage("pong_data/paddle_player.png");
	game.add(player);

	var ai = jam.Sprite(464, 100);	// AI's Paddle
	ai.setImage("pong_data/paddle_ai.png");
	game.add(ai);

	// Put player and AI in same collision group so the ball 
	// can collide with either.
	var paddles = jam.CollisionGroup();
	paddles.add(player);
	paddles.add(ai);

///////// Object Behaviors //////

	// Define the behavior of the player by extending the functionality
	// of its update function. jam.extend essentially just smooshes
	// two functions together (Here, we're defining a function which calls
	// the original player.update and then afterwards calls the
	// function we're defining below. This replaces its old update function
	// which was the default Sprite update.)
	player.update = jam.extend(player.update, function(elapsed){
		// Reset velocity
		player.velocity.y = 0;
		
		// And then set it based on input
		if( jam.Input.buttonDown("UP") ){
			player.velocity.y = -250;
		}
		if( jam.Input.buttonDown("DOWN") ){
			player.velocity.y = 250;
		}
		
		// Clamp the y position so it doesn't go out of bounds.
		player.y = Math.min(Math.max(0, player.y), 300 - player.height);
	});
	
	// If you want to take a look at what code you end up with after all the 
	// extending of behavior, just inspect the flatCode property of function.
	jam.log(player.update.flatCode);
	// The console will show each function that gets called when the update occurs.
	
	ball.update = jam.extend(ball.update, function(elapsed){
		// First of all, the ball needs to bounce off the paddles.
	
		// Overlaps calls the supplied callback function if a collision 
		// is detected, and passes the two colliding objects into it.
		// In this case, 'paddles' is a collision group with two objects,
		// the player and the ai, and the response to colliding depends on
		// which one was hit.
		ball.overlaps(paddles, function(me, other){
			if(ball.x < 150){
				ball.velocity.x = Math.abs(ball.velocity.x);
			}
			else{
				ball.velocity.x = -Math.abs(ball.velocity.x);
			}

			// Offset the y velocity based on where it hit the paddle
			// This is where we reference 'other' which we get from the overlaps
			// callback. 
			yOff = ((ball.y + ball.height / 2) - (other.y + other.height/2)) / other.height;

			ball.velocity.x *= 1.1;	// Speed up
			ball.velocity.y += yOff * 300;	// Adjust the y speed based on where on the paddle it hit.
		});
		
		// Bounce off the top and bottom
		if(ball.y >= 300 - ball.height || ball.y <= 0){
			ball.velocity.y = -ball.velocity.y
		}
		
		// Score on the left side
		if(ball.x <= 0){
			ball.reset();
			score[1]++;
		}
		// Score on the right side
		if(ball.x + ball.width >= 500){
			ball.reset();
			score[0]++;
		}
	});
	// Scoring behavior
	// Reset will put the ball back in the middle with random direction.
	ball.reset = function(){
		ball.x = 240;
		ball.y = 140;
		ball.velocity.x = Math.random() > 0.5 ? 200 : -200;
		ball.velocity.y = Math.random() * 400 - 200;
	}	
	ball.reset();


	// Very simple AI, just tries to hit the ball by moving towards it
	// if it's nearby.
	ai.update = jam.extend(ai.update, function(elapsed){
		if(ball.x > 100){
			// If the ball is above, go up
			if(ball.y + ball.height / 2 > ai.y + ai.height){
				ai.velocity.y = 200;
			}
			// And below, go down.
			if(ball.y + ball.height / 2 < ai.y){
				ai.velocity.y = -200;
			}
		}
		else{
			ai.velocity.y = 0;
		}
		// Clamp the position just like player
		ai.y = Math.min(Math.max(0, ai.y), 300 - ai.height);
	});


	// Score text
	scoreTxt.font = "40pt calibri";
	scoreTxt.color = "#fff";
	scoreTxt.update = jam.extend(scoreTxt.update, function(){
		scoreTxt.text = score[0] + " - " + score[1];
	});

	bg = jam.Sprite(0,0);	// Background image.
	bg.setImage("pong_data/background.png");
	bg.setLayer(-1);
	game.add(bg);
	
	// Finally, start the game. 
	game.run();
}
