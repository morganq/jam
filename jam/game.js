define(["vector", "sprite", "collisions"], function(Vector, Sprite, Collision) {
	return function(width, height, parentElement, zoom){
		var self = {};

		self._canvas = document.createElement("canvas");
		self._canvas.setAttribute("style","image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering:-webkit-optimize-contrast; -ms-interpolation-mode:nearest-neighbor;");
		self._canvas.style.position = "relative";
		self._canvas.style.border = "1px solid black";
		self._context = self._canvas.getContext("2d");

		zoom = zoom || 1;

		self.root = new Sprite(0,0);
		self.root.scene = new Sprite(0, 0);
		self.root.add(self.root.scene);
		self.root.ui = new Sprite(0, 0);
		self.root.add(self.root.ui);
		
		if(parentElement === undefined) {
			parentElement = document.body;
		}

		self.width = width;
		self.height = height;
		self._canvas.width = width;
		self._canvas.height = height;
		self._context.width = self.width;
		self._context.height = self.height;


		// Always keep the canvas in the middle of the parent element
		var onresize = function(){
			self._canvas.style.left = (parentElement.clientWidth / 2 - (self.width * zoom) / 2) + "px";
			self._canvas.style.top = (parentElement.clientHeight / 2 - (self.height * zoom) / 2) + "px";
			self._canvas.style.width = (self.width * zoom) + "px";
			self._canvas.style.height = (self.height * zoom) + "px";
		};
		onresize();
		parentElement.onresize = onresize;

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
			ctx.save();
			//ctx.scale(zoom, zoom);
			ctx.fillStyle = self.bgColor;
			ctx.fillRect(0,0,self.width,self.height);

			self.root.render(ctx);
			ctx.restore();
		};

		self.run = function(){
			self._tick();
		};

		return self;
	};
});
