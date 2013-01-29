define(['util'], function(Util) {
	var lib = {};


	copies = {};

	// Play just calls the audio tag play function, or loads it first
	// then plays it.
	lib.play = function(url){
		var sound = Util.load(url, function(obj){
			// If it's not playing, play it.
			if(obj.paused) {
				obj.play();
			}
			else {
				var clone;				
				if(copies[url]) {
					// Try to find a cached copy which isn't playing, and play that one.
					for(var i = 0; i < copies[url].length; i++) {
						if(copies[url][i].paused) {
							copies[url][i].play();
							return;
						}
					}

					// There aren't any playable cached copies so clone it and play it.
					clone = obj.cloneNode();
					copies[url].push(clone);
					clone.play();
				}
				else {
					// There's no cache at all, so make one and clone the snd and play it.
					clone = obj.cloneNode();
					copies[url] = [obj, clone];
					clone.play();
				}				
			}

		} );
		return sound;
	};

	// Or you can just get a sound to do whatever you like with it!
	lib.get = function(url) {
		return Util.load(url);
	};

	return lib;
});