define([], function() {
	var lib = {};

	var preloadCompletedObjects = 0;
	var preloadTotalObjects = 0;

	var startTime = new Date().getTime();

	lib.cache = {};
	lib.preloaded = false;

	lib.logLevel = 0;
	lib.dataDir = "";

	// Loads and caches image files or sound files.
	lib.load = function(url, onload){
		url = lib.dataDir + url;
		if(lib.cache[url] !== undefined) {
			onload(lib.cache[url]);
			return;
		}

		onload = onload || function() {};

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
		preloadTotalObjects++;
		lib.load(url, function(obj){
			preloadCompletedObjects++;
			lib.log("finished preloading: " + url);
		});
	};

	// Draws the loading bar on the canvas object or removes it if
	// everything is done loading
	var showPreloader = function(context, callback)
	{
		if(preloadCompletedObjects < preloadTotalObjects){
			// Keep showing it until it's done!
			window.setTimeout(function() { showPreloader(context, callback); }, 50);
			context.fillStyle = "rgba(0,0,0,1)";
			context.fillRect(context.canvas.width / 2 - 102, context.canvas.height / 2 - 12, 204, 24);
			context.fillStyle = "rgba(255,255,255,1)";
			context.fillRect(context.canvas.width / 2 - 100, context.canvas.height / 2 - 10, 200, 20);
			context.fillStyle = "rgba(0,255,128,1)";
			context.fillRect(context.canvas.width / 2 - 100, context.canvas.height / 2 - 10, preloadCompletedObjects * 200.0 / preloadTotalObjects, 20);
		}
		else{
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

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		element.appendChild(canvas);
		canvas.width = element.clientWidth;
		canvas.height = element.clientHeight;
		context.width = element.clientWidth;
		context.height = element.clientHeight;
		showPreloader(context, callback);
	};

	// Log is viewable by checking this object or through some debug implementation
	// in a debug module
	lib.logMessages = [];
	lib.log = function(text, level){
		level = level || 0;
		lib.logMessages.push({
			time:new Date().getTime() - startTime,
			level:level,
			message:text});
			if(level >= lib.logLevel) {
				console.log("[" + ((new Date().getTime() - startTime)/1000).toFixed(3) + "] " + text);
			}
	};

	lib.isArray = function(o) {
		return Object.prototype.toString.call(o) === '[object Array]'; 
	};

	lib.pack = function(o) {
		if (lib.isArray(o)) {
			return o;
		} else {
			return [o];
		}
	};

	lib.mixinOn = function(o) {
		o.on = function(fnName, doFn) {
			var old = o[fnName];
			o[fnName] = function() {
				old.apply(o, arguments);
				return doFn.apply(o, arguments);
			};
		};
	}

	return lib;
});
