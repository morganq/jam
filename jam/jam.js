define(["game", "sprite", "rect", "debug"], function(Game, Sprite, Rect, Debug) {
	var lib = {};

	lib.Game = Game;
	lib.Sprite = Sprite;
    lib.Rect = Rect;
    lib.Debug = Debug;

	var _preloadCompletedObjects = 0;
	var _preloadTotalObjects = 0;

	var startTime = new Date().getTime();

	lib.cache = {};
	lib.preloaded = false;
	lib.levelForConsoleLog = 0;

	lib.dataDir = "";

	// Loads and caches image files or sound files.
	lib.load = function(url, onload){
		url = lib.dataDir + url;
		if(lib.cache[url] !== undefined) {
			onload(lib.cache[url]);
			return;
		}

		var obj;
		// IMAGE
		if(url.match(/\.(jpeg|jpg|png|gif)(\?.*)?$/)){
			obj = new Image(url);
			obj.onload = function(){ onload(obj); };
			obj.src = url;
			lib.cache[url] = obj;
		}
		// SOUND
		else if (url.match(/\.(mp3|ogg|wav)(\?.*)?$/)){
			obj = new Audio();
			obj.addEventListener("loadeddata", function(){ onload(obj); }, false);
			obj.src = url;
			lib.cache[url] = obj;
		}
		return obj;
	};

	// Preload just calls load and counts the number of currently loading objects
	lib.preload = function(url){
		lib.log("preloading: " + url);
		_preloadTotalObjects++;
		lib.load(url, function(obj){
			_preloadCompletedObjects++;
			lib.log("finished preloading: " + url);
		});
	};

	// Draws the loading bar on the canvas object or removes it if
	// everything is done loading
	var _showPreloader = function(context, callback)
	{
		if(_preloadCompletedObjects < _preloadTotalObjects)
		{
			// Keep showing it until it's done!
			window.setTimeout(function() { _showPreloader(context, callback); }, 50);
			context.fillStyle = "rgba(0,0,0,1)";
			context.fillRect(context.canvas.width / 2 - 102, context.canvas.height / 2 - 12, 204, 24);
			context.fillStyle = "rgba(255,255,255,1)";
			context.fillRect(context.canvas.width / 2 - 100, context.canvas.height / 2 - 10, 200, 20);
			context.fillStyle = "rgba(0,255,128,1)";
			context.fillRect(context.canvas.width / 2 - 100, context.canvas.height / 2 - 10, _preloadCompletedObjects * 200.0 / _preloadTotalObjects, 20);
		}
		else
		{
			context.canvas.parentNode.removeChild(context.canvas);
			callback();
		}
	};

	// Makes a canvas filling the parent element
	lib.showPreloader = function(element, callback)
	{
		if(callback === undefined) {
			callback = element;
			element = document.body;
		}

		var _canvas = document.createElement("canvas");
		var _context = _canvas.getContext("2d");
		element.appendChild(_canvas);
		_canvas.width = element.clientWidth;
		_canvas.height = element.clientHeight;
		_context.width = element.clientWidth;
		_context.height = element.clientHeight;
		_showPreloader(_context, callback);
	};

	// Log is viewable by checking this object or through some debug implementation
	// in a debug module
	lib.logMessages = [];
	lib.log = function(text, level){
		level = level || 0;
		lib.logMessages.push({
			time:(new Date()).getTime() - startTime,
			level:level,
			message:text});
		if(level >= lib.levelForConsoleLog) {
			console.log("[" + ((new Date().getTime() - startTime)/1000).toFixed(3) + "] " + text);
		}
	};

	return lib;
});
