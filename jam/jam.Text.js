// A sprite-like object which renders by drawing text to the screen

/*	SAMPLE USAGE:
	
** Score display **
var score = 0;
var scoreText = jam.Text(10, 30);
scoreText.font = "16pt monospace";
scoreText.color = "rgb(0,0,0)";
game.add(scoreText);

// in update
scoreText.text = score;

*/

jam.Text = jam.extend(jam.Sprite, function(self){

	self.text = "";
	self.font = "";
	self.color = ""

	self.render = function(context, camera){
		context.font = self.font;
		context.fillStyle = self.color;
		context.fillText(self.text,
			self.x - camera.scroll.x * self.parallax.x,
			self.y - camera.scroll.y * self.parallax.y);
	};

	return self

}, true, true);
