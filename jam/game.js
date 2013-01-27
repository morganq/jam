define(["vector", "sprite"], function(Vector, Sprite) {
	return function(width, height, parentElement){
		var self = {};

		self._canvas = document.createElement("canvas");
		self._canvas.style.position = "relative";
		self._context = self._canvas.getContext("2d");

		self.root = new Sprite(0,0);
		self.root.scene = new Sprite(0, 0);
		self.root.add(self.root.scene);
		self.root.ui = new Sprite(0, 0);
		self.root.add(self.root.ui);
		
		if(parentElement === undefined) {
			parentElement = document.body;
		}

		// Always keep the canvas in the middle of the parent element
		var onresize = function(){
			self._canvas.style.left = (parentElement.clientWidth / 2 - width / 2) + "px";
			self._canvas.style.top = (parentElement.clientHeight / 2 - height / 2) + "px";
		};
		onresize();
		parentElement.onresize = onresize;

		self.width = width;
		self.height = height;

		// Timing
		self.fps = 50;
		self.elapsed = 0;	// Time since the last frame in seconds
		self.time = 0;
		var lastFrameTime = new Date().getTime();
		var startTime = lastFrameTime;

		self.bgColor = "rgb(255,255,255)";

		// If they didn't supply this argument, assume the doc body
		// as the parent element for the canvas
		if(parentElement === undefined || parentElement === null){
			parentElement = document.body;
		}
		parentElement.appendChild(self._canvas);

		self._canvas.width = self.width;
		self._canvas.height = self.height;

		self._tick = function(){
			self.update();
			self.render();
			window.setTimeout(self._tick, 1000.0/self.fps);
		};

		// Called every frame. Most importantly, calls update on each child
		// Additionally, clears out removed elements and updates the camera
		self.update = function(){
			currentTime = new Date().getTime();
			self.elapsed = (currentTime - lastFrameTime) / 1000.0;
			lastFrameTime = currentTime;

			self.time = (currentTime - startTime) / 1000.0;

			self.root.update(self.elapsed);
		};

		// Called every frame. Clears the screen then calls render on each child.
		self.render = function(){
			var ctx = self._context;
			ctx.fillStyle = self.bgColor;
			ctx.fillRect(0,0,self.width,self.height);

			self.root.render(ctx);
		};

		self.run = function(){
			self._tick();
		};

		return self;
	};
});