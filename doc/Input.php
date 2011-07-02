<?php include "_top.php" ?>
	<div class="right">
		<h1><span class="extra">jsGame.</span>Input<span class="extra">.js</span></h1>
		<h2>Description</h2>
		<p>Keyboard input class. You do not construct an Input object, all of its methods are static.</p>
		<h2>Static Functions</h2>
		<ul>
			<li>
				<div class="fName static">jsGame.Input.keyDown</div>
				<div class="fParams">key name</div>
				<div class="fReturns">boolean</div>
				<div class="fDesc">Returns true if the key is currently being held down.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Input.justPressed</div>
				<div class="fParams">key name</div>
				<div class="fReturns">boolean</div>
				<div class="fDesc">Returns true if the key is pressed this frame, but wasn't the previous frame.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Input.justReleased</div>
				<div class="fParams">key name</div>
				<div class="fReturns">boolean</div>
				<div class="fDesc">Returns true if the key is not pressed this frame, but was the previous frame.</div>
			</li>
		</ul>

	</div>
<?php include "_bottom.php" ?>
