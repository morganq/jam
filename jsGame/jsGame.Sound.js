// Extremely simple sound library. Can load or cache a sound and play it.

jsGame.Sound = function(){
	// Play just calls the audio tag play function, or loads it first
	// then plays it.
	var play = function(url){
		var sound;
		if(jsGame.cache[url] === undefined){
			sound = jsGame.load(url, function(obj) { obj.play(); } );
		}
		else
		{
			sound = jsGame.cache[url]
			sound.play();
		}
		return sound;
	};

	return {
		play : play,
	};
}();
