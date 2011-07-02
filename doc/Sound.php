<?php include "_top.php" ?>
	<div class="right">
		<h1><span class="extra">jsGame.</span>Sound<span class="extra">.js</span></h1>
		<h2>Description</h2>
		<p>Has functions for loading and playing sound files of any type supported by the browser. You don't construct a Sound object, you just call its static functions.</p>
		<h2>Static Functions</h2>
		<ul>
			<li>
				<div class="fName static">jsGame.Sound.play</div>
				<div class="fParams">soundURL</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Plays a sound file. If the sound's already been loaded then it will play immediately, otherwise it will load it first.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Sound.load</div>
				<div class="fParams">soundURL</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Loads a sound file into the sound cache. If you call play on the same URL it will use the cached version and will play immediately.</div>
			</li>
		</ul>

	</div>
<?php include "_bottom.php" ?>
