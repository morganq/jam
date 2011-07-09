<?php include "_top.php"; ?>
			<div class="right">
				<h1>Make something like Pong!</h1>
				<p>
				<em>Try the <a target="_blank" href="http://morganquirk.com/p/jsGame/interactive.html">jsGame Interactive</a> page for these tutorials.</em>
</p>
<p>
What follows is a tutorial for making a game like Pong. It will have one paddle controlled by the player's keyboard and another paddle controlled by the computer. We start with some code which is basically the template of any jsGame program:
</p>
<pre>
window.onload = function(){
	initialize();
}

function initialize(){
	var game = jsGame.Game(500, 300);
	game.run();
}
</pre>
<p>
We make an initialize function which is called when the page has finished loading. The initialize function makes our game "window" which has pixel dimensions of 500 by 300. Remember to call run at the end of your code, or nothing will happen!
</p><p>
If you're coding on the interactive development page, you only need to use the code within the initialize function, in this case the two lines:
</p><pre>
var game = jsGame.Game(500, 300);
game.run();
</pre><p>
		Let's take some time to think about the components of the game, what objects and behaviors need to exist inside it. The game of Pong has very few things to represent. There are two paddles, a ball, and a score tracker. Let's set these up now.
</p>
<pre>
game = jsGame.Game(500, 300);

// Array of two elements for the scores
var score = [0,0];

// Text to display the scores 
var scoreTxt = jsGame.Text(200, 50);
game.add(scoreTxt);
scoreTxt.text = "0 - 0"
scoreTxt.font = "40pt calibri";
scoreTxt.color = "#000";

// Create objects
var ball = jsGame.Sprite(300, 150);
ball.rectangleImage(20,20, "rgb(0,0,0)");
game.add(ball);

var player = jsGame.Sprite(2, 100);
player.rectangleImage(20, 100, "rgb(0,0,0)");
game.add(player);

var ai = jsGame.Sprite(478, 100);
ai.rectangleImage(20, 100, "rgb(0,0,0)");
game.add(ai);

game.run();</pre>
<p>
																					This should be somewhat straight-forward. We make each component by giving it an initial position, then we set its visual properties, and then we 'add' it to the game. Adding it using game.add tells the game that it needs to update the object's logic and draw it on the screen every frame. The score array will keep track of the player's score as score[0] and the AI's score as score[1].
</p><p>

																					One quick thing that will help later: we're going to need to make a "collision group" and put both of our paddles in it. This will allow us to collide the ball against the whole group, and if it's hitting anything inside it we'll know. Put this code above the game.run call.
</p>
<pre>
var paddles = jsGame.CollisionGroup();
paddles.add(player);
paddles.add(ai);
</pre>
<p>
																								Now that we have all our componenets, let's talk about behavior. The first thing to think about is probably the player paddle behavior. In jsGame, we usually define behavior by writing a function that tells the object if and what to change each frame. The typical way this is done is by extending the functionality of the object's update function. Here's the code we're adding, above the game.run(); line.
</p>
<pre>
player.update = jsGame.extend(player.update, function(elapsed){
	// Reset velocity
	player.velocity.y = 0;

	// And then set it based on input
	if( jsGame.Input.keyDown("UP") ){
			player.velocity.y = -250;
	}
	if( jsGame.Input.keyDown("DOWN") ){
			player.velocity.y = 250;
	}

	player.y = Math.min(Math.max(0, player.y), 300 - player.height);
});</pre><p>
																								This appears complicated at first, but you will see this pattern frequently in jsGame code. The first line of code says: "extend the player's update function by attaching this other function to the end of it", and then the rest of the code is defining that other function. The player's behavior is as follows: If you're holding the up arrow, move up at a constant rate. If you're holding the down arrow, move down at a constant rate. Otherwise, don't move. Make sure to stay within the vertical boundaries of the game window. 
</p><p>
																									In the code, we're doing that by setting the velocity to 0 at the beginning of the update, and then changing it if a key is being held down. We use min and max at the bottom of the function to make sure the player's vertical position stays between 0 and the window height. You should now be able to move your paddle with up and down arrow. 
</p><p>
																									Okay, so now what's the AI behavior? He has to chase the ball somehow. My idea was to set his velocity in the direction of the ball if the ball is somewhere near his side of the court. Here, you can drop this code anywhere after ai is defined and before the game.run call.
</p>
<pre>
ai.update = jsGame.extend(ai.update, function(elapsed){
	// Always move towards the ball if the ball is coming towards us
	if(ball.x > 100){
		if(ball.y + ball.height / 2 > ai.y + ai.height){
			ai.velocity.y = 200;
		}
		if(ball.y + ball.height / 2 < ai.y){
			ai.velocity.y = -200;
		}
	}
	// Sit still otherwise
	else{
		ai.velocity.y = 0;
	}
	ai.y = Math.min(Math.max(0, ai.y), 300 - ai.height);
});</pre>
<p>
We use that same line of code at the bottom to make him stay within bounds. 
</p>
<p>
Okay, now for a whole bunch of code which defines the ball behavior. The ball has a number of special cases, based on if it hits a wall at the top or bottom vs. hitting the left or right goals. Another part of its behavior is that depending on where on the paddle the ball hits, it will bounce off at a different angle. 
</p>
<pre>
ball.velocity.x = 100;
ball.velocity.y = 100;
ball.update = jsGame.extend(ball.update, function(){
	if(ball.y >= 300 - ball.height || ball.y <= 0){
		ball.velocity.y = -ball.velocity.y
	}
	// Scoring
	var reset = function(){
		ball.x = 240;
		ball.y = 140;
		ball.velocity.x = Math.random() > 0.5 ? 200 : -200;
		ball.velocity.y = Math.random() * 400 - 200;
	}
	if(ball.x <= 0){
		reset();
		score[1]++;
	}
	if(ball.x + ball.width >= 500){
		reset();
		score[0]++;
	}

	// Use the overlaps callback to bounce off the paddles
	ball.overlaps(paddles, function(me, other){
		if(ball.x < 150){
			ball.velocity.x = Math.abs(ball.velocity.x);
		}
		else{
			ball.velocity.x = -Math.abs(ball.velocity.x);
		}

		// Offset the y velocity based on where it hit the paddle
		yOff = ((ball.y + ball.height / 2)
			 - (other.y + other.height/2)) / other.height;

		ball.velocity.y += yOff * 300;

		// Speed up every bounce
		ball.velocity.x *= 1.1;

	})

});
</pre>
<p>

We set the initial velocity of the ball outside of his update. Inside the update, we start with some simple logic that bounces the ball off the top and bottom of the game window. Then we define a reset function which will be used by both goal conditions. This just resets the position of the ball and sets its velocity randomly. After this we check the two cases of goals: off the left side or off the right side. We set the score based on which one this was.
</p><p>
The next line, with the overlaps call, is how we detect collision between a paddle and the ball. If the ball is overlapping the paddle, it will call the function we've supplied and pass it the ball and whichever thing in the collision group was collided with. If the ball is on the left side of the court, bounce to the right. If it's on the right side, bounce to the left. The rest of this function figures out how to change the velocity based on the y position and accelerates the ball with each bounce.
</p><p>
There's one last thing before we're done. The score text needs to update every frame to always have the latest values for the score.
</p>
<pre>
scoreTxt.update = jsGame.extend(scoreTxt.update, function(){
	scoreTxt.text = score[0] + " - " + score[1];
});</pre>

<p>
And that's it. You can try funny things like giving the ball gravity with ball.acceleration.y = 400; or something.
</p><p>
Full code:
</p>
<pre class="short">
game = jsGame.Game(500, 300);

// Array of two elements for the scores
var score = [0,0];

// Text to display the scores 
var scoreTxt = jsGame.Text(200, 50);
game.add(scoreTxt);
scoreTxt.text = "0 - 0"
scoreTxt.font = "40pt calibri";
scoreTxt.color = "#000";

// Create objects
var ball = jsGame.Sprite(300, 150);
ball.rectangleImage(20,20, "rgb(0,0,0)");
game.add(ball);

var player = jsGame.Sprite(2, 100);
player.rectangleImage(20, 100, "rgb(0,0,0)");
game.add(player);

var ai = jsGame.Sprite(478, 100);
ai.rectangleImage(20, 100, "rgb(0,0,0)");
game.add(ai);

// Collision Group
var paddles = jsGame.CollisionGroup();
paddles.add(player);
paddles.add(ai);

// Player behavior
player.update = jsGame.extend(player.update, function(elapsed){
	// Reset velocity
	player.velocity.y = 0;

	// And then set it based on input
	if( jsGame.Input.keyDown("UP") ){
		player.velocity.y = -250;
	}
	if( jsGame.Input.keyDown("DOWN") ){
		player.velocity.y = 250;
	}

	player.y = Math.min(Math.max(0, player.y), 300 - player.height);
});

// AI behavior
ai.update = jsGame.extend(ai.update, function(elapsed){
	// Always move towards the ball if the ball is coming towards us
	if(ball.x > 100){
		if(ball.y + ball.height / 2 > ai.y + ai.height){
			ai.velocity.y = 200;
		}
		if(ball.y + ball.height / 2 < ai.y){
			ai.velocity.y = -200;
		}
	}
	// Sit still otherwise
	else{
		ai.velocity.y = 0;
	}
	ai.y = Math.min(Math.max(0, ai.y), 300 - ai.height);
});

// Ball behavior
ball.velocity.x = 100;
ball.velocity.y = 100;
ball.update = jsGame.extend(ball.update, function(){
	if(ball.y >= 300 - ball.height || ball.y <= 0){
		ball.velocity.y = -ball.velocity.y
	}
	// Scoring
	var reset = function(){
		ball.x = 240;
		ball.y = 140;
		ball.velocity.x = Math.random() > 0.5 ? 200 : -200;
		ball.velocity.y = Math.random() * 400 - 200;
	}
	if(ball.x <= 0){
		reset();
		score[1]++;
	}
	if(ball.x + ball.width >= 500){
		reset();
		score[0]++;
	}

	// Use the overlaps callback to bounce off the paddles
	ball.overlaps(paddles, function(me, other){
		if(ball.x < 150){
			ball.velocity.x = Math.abs(ball.velocity.x);
		}
		else{
			ball.velocity.x = -Math.abs(ball.velocity.x);
		}

		// Offset the y velocity based on where it hit the paddle
		yOff = ((ball.y + ball.height / 2)
		- (other.y + other.height/2)) / other.height;

		ball.velocity.y += yOff * 300;

		// Speed up every bounce
		ball.velocity.x *= 1.1;

	})

});

scoreTxt.update = jsGame.extend(scoreTxt.update, function(){
	scoreTxt.text = score[0] + " - " + score[1];
});

game.run();
</pre>
</div>
<?php include "_bottom.php"; ?>
