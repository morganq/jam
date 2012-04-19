jam = function(){
	var _preloadCompletedObjects = 0;
	var _preloadTotalObjects = 0;

	var lib = {};
	var startTime = (new Date()).getTime();
	lib.modules = [];
	lib.cache = {};
	lib.loaded = false;

	// Loads and caches image files or sound files.
	lib.load = function(url, onload){
		var obj;
		if(url.match(/\.(jpeg|jpg|png|gif)(\?.*)?$/)){
			obj = new Image(url);
			obj.onload = function(){ onload(obj); };
			obj.src = url;
			lib.cache[url] = obj;
		}
		else if (url.match(/\.(mp3|ogg|wav)(\?.*)?$/)){
			obj = new Audio();
			obj.addEventListener("loadeddata", function(){ onload(obj); }, false);
			obj.src = url;
			lib.cache[url] = obj;
		}
		return obj;
	}

	// Preload just calls load and counts the number of currently loading objects
	lib.preload = function(url){
		lib.log("preloading: " + url);
		_preloadTotalObjects++;
		lib.load(url, function(obj){
				_preloadCompletedObjects++;
				lib.log("finished preloading: " + url);
			});
	}

	// Draws the loading bar on the canvas object or removes it if
	// everything is done loading
	var _showPreloader = function(context, callback)
	{
		if(_preloadCompletedObjects < _preloadTotalObjects)
		{
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
	}

	// Makes a canvas filling the parent element
	lib.showPreloader = function(element, callback)
	{
		var _canvas = document.createElement("canvas");
		var _context = _canvas.getContext("2d");
		element.appendChild(_canvas);
		_canvas.width = element.clientWidth;
		_canvas.height = element.clientHeight;
		_context.width = element.clientWidth;
		_context.height = element.clientHeight;
		_showPreloader(_context, callback);
	}

	// Includes a file by making a <script> tag
	lib.include = function(name){
		// Could be pretty bad to include a file multiple times
		if(lib.modules.indexOf(name) !== -1)
		{
			lib.log("File " + name + " has already been included. Skipping.");
			return;
		}

		// prevents the browser from caching the js files by putting
		// extra random data on the url with ?
		var nocache = Math.random();

		document.write("<script language='javascript' src='" + name + "?" + nocache + "'></script>");
		lib.modules.push(name);
	};

        var scripts = document.getElementsByTagName("script"),
	// The browsers executes scripts in order. While this script is executing it
	// will be the last script on the page.
	src = scripts[scripts.length-1].src,
	lastSlash = src.lastIndexOf("/"),	  // +1 to preserve the slash
	jsGameSrcPath = (lastSlash === -1)? "": src.slice(0, lastSlash + 1);

	lib.includeModule = function(name){
	    lib.include(jsGameSrcPath + name + ".js");
	};

	// Log is viewable by checking this object or through some debug implementation
	// in a debug module
	lib.logMessages = [];
	lib.log = function(text){
		lib.logMessages.push({"time":(new Date()).getTime() - startTime, "message":text});
		console.log("[" + (((new Date()).getTime() - startTime)/1000).toFixed(3) + "] " + text);
	}
	return lib;
}();

// Load all the default modules
jam.includeModule("Meta");
jam.includeModule("Vector");
jam.includeModule("Util");
jam.includeModule("Game");
jam.includeModule("Sprite");
jam.includeModule("Input");
jam.includeModule("Sound");
jam.includeModule("Text");
