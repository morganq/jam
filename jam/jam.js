define(["util", "game", "vector", "sprite", "sound", "rect", "debug", "tilemap", "input"], function(Util, Game, Vector, Sprite, Sound, Rect, Debug, TileMap, Input) {
	var lib = {};

	lib.Game = Game;
	lib.Sprite = Sprite;
	lib.Rect = Rect;
	lib.Debug = Debug;
	lib.Vector = Vector;
	lib.Sound = Sound;
	lib.TileMap = TileMap;
	lib.Input = Input;

	lib.cache = Util.cache;

	lib.config = function(obj) {
		Util.dataDir = obj.dataDir || "";
		Util.logLevel = obj.logLevel || 0;
	};

	// Loads and caches image files or sound files.
	lib.load = Util.load;

	// Preload just calls load and counts the number of currently loading objects
	lib.preload = Util.preload;

	// Makes a canvas filling the parent element
	lib.showPreloader = Util.showPreloader;

	lib.log = Util.log;

	return lib;
});
