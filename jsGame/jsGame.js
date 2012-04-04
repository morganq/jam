// jsGame modules should attach themselves to the jsGame object.
// This will preserve a nice single namespace for everything jsGame related.

jsGame = function(){
	var _preloadCompletedObjects = 0;
	var _preloadTotalObjects = 0;

	var lib = {};
	var startTime = (new Date()).getTime();
	lib.modules = [];
	lib.cache = {};
	lib.loaded = false;
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
	
	lib.preload = function(url){
		lib.log("preloading: " + url);
		_preloadTotalObjects++;	
		lib.load(url, function(obj){
				_preloadCompletedObjects++;
				lib.log("finished preloading: " + url);
			});
	}
	
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
	}
	lib.includeModule = function(name){ lib.include("jsGame/jsGame."+name+".js"); }
	
	// Log is viewable by checking this object or through some debug implementation
	// in a debug module
	lib.logMessages = [];
	lib.log = function(text){
		lib.logMessages.push({"time":(new Date()).getTime() - startTime, "message":text});
	}
	return lib;
}();

// Load all the default modules
jsGame.includeModule("Meta");
jsGame.includeModule("Util");
jsGame.includeModule("Game");
jsGame.includeModule("Sprite");
jsGame.includeModule("Input");
jsGame.includeModule("Vector");
jsGame.includeModule("Sound");
jsGame.includeModule("Text");
