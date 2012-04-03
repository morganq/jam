// jsGame modules should attach themselves to the jsGame object.
// This will preserve a nice single namespace for everything jsGame related.

jsGame = function(){
	var lib = {};
	var startTime = (new Date()).getTime();
	lib.modules = [];
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
