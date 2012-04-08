// Extremely simple sound library. Can load or cache a sound and play it.

jam.Sound = function(){
	// Play just calls the audio tag play function, or loads it first
	// then plays it.
	var play = function(url){
		var sound;
		if(jam.cache[url] === undefined){
			sound = jam.load(url, function(obj) { obj.play(); } );
		}
		else
		{
			sound = jam.cache[url]
			sound.play();
		}
		return sound;
	};

	return {
		play : play,
	};
}();
