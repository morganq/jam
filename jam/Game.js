/*	SAMPLE USAGE:

** hello world game **
window.onload = function(){
	var game = jam.Game(640, 480, document.body);

	var hello = jam.Text(320, 240);
	hello.text = "hello world";
	hello.color = "rgb(0,0,0)";
	game.add(hello);

	game.run();
}

*/

jam.Game = function(width, height, parentElement){
	var self = {};

	self._canvas = document.createElement("canvas"); 
	self._canvas.style.position = "relative";
	self._context = self._canvas.getContext("2d");
	self._children = [];

	jam.Game._canvas = self._canvas;

	// List of objects to be removed
	self._remove = [];
	
	// Always keep the canvas in the middle of the parent element
	onresize = function(){
		self._canvas.style.left = (parentElement.clientWidth / 2 - width / 2) +"px";
		self._canvas.style.top = (parentElement.clientHeight / 2 - height / 2) + "px";
	}
	onresize();
	parentElement.onresize = onresize;


	self.width = width;
	self.height = height;
	self.fps = 50;		// Frequency
	self.elapsed = 0; 	// Period
	self.time = 0;
	self.camera = {
		scroll:jam.Vector(0,0),
		size:jam.Vector(self.width, self.height),
		follow:null,
	};
	self.bgColor = "rgb(255,255,255)";	

	// If they didn't supply this argument, assume the doc body
	// as the parent element for the canvas
	if(parentElement === undefined || parentElement === null){
		parentElement = document.body;
	}
	parentElement.appendChild(self._canvas);

	self._canvas.width = self.width;
	self._canvas.height = self.height

	self._tick = function(){
		self.update();
		self.render();
		window.setTimeout(self._tick, 1000.0/self.fps);
	};

	// Called every frame. Most importantly, calls update on each child
	// Additionally, clears out removed elements and updates the camera
	self.update = function(){
		// This filter just says "only leave me if i'm not in the remove list"
		self._children = self._children.filter(function(x,i,a){ return self._remove.indexOf(x) === -1 });
		self._remove = [];

		self.elapsed = 1.0/self.fps;
		self.time += self.elapsed;
		
		// Simplest possible follow code
		if(self.camera.follow !== null)
		{
			self.camera.scroll.x = self.camera.follow.x - self.width / 2;
			self.camera.scroll.y = self.camera.follow.y - self.height / 2;
		}

		// Call update on each child and pass it the elapsed time
		for (var i = self._children.length-1; i >= 0; --i)
		{
			self._children[i].update(self.elapsed);
		}
	};

	// Called every frame. Clears the screen then calls render on each child.
	self.render = function(){
		var ctx = self._context;
		ctx.fillStyle = self.bgColor;
		ctx.fillRect(0,0,self.width,self.height);
		for (var i = self._children.length-1; i >= 0; --i)
		{
			self._children[i].render(ctx, self.camera);
		}
	};

	self.add = function(sprite){
		self._children.push(sprite);
		sprite._game = self;
		self.sortSprites();	// Sort to figure out layering
	};

	self.remove = function(sprite){
		if(self._remove.indexOf(sprite) === -1)
		{
			self._remove.push(sprite);
			sprite._game = null;
		}
	};

	self.run = function(){
		self._tick();
	};
	
	self.sortSprites = function(){
		self._children.sort(function(a,b){ return b._layer - a._layer; });
	}

	return self;
};

