<?php include "_top.php" ?>
	<div class="right">
		<h1><span class="extra">jsGame.</span>Game<span class="extra">.js</span></h1>
		<h2>Description</h2>
		<p>A Game object contains the game loop which runs your game. The general process is you construct a Game object, use the add method to put your various entities in the world, then call the run method to start the game.</p>
		<h2>Constructor</h2>
		<ul>
			<li>
				<div class="fName">jsGame.Game</div>
				<div class="fParams">width, height, [parentElement]</div>
				<div class="fReturns">new Game</div>
				<div class="fDesc">Makes the game window with the given size. If parent element is specified, the Canvas object will be placed inside that DOM element.</div>
			</li>
		</ul>
		<h2>Properties</h2>
		<ul>
			<li>
				<div class="pName">width</div>
				<div class="pType">number</div>
				<div class="pDesc">Game window width in pixels</div>
			</li>
			<li>
				<div class="pName">height</div>
				<div class="pType">number</div>
				<div class="pDesc">Game window height in pixels</div>
			</li>
			<li>
				<div class="pName">fps</div>
				<div class="pType">number</div>
				<div class="pDesc">Maximum frames per second</div>
			</li>
			<li>
				<div class="pName">elapsed</div>
				<div class="pType">number</div>
				<div class="pDesc">Number of seconds since the last frame</div>
			</li>
			<li>
				<div class="pName">camera</div>
				<div class="pType">object</div>
				<div class="pDesc">Contains a Vector called scroll for the camera's offset, a Vector called size for the width and height of the view, and an object called follow which the camera will scroll to track every tick.</div>
			</li>

		</ul>
		<h2>Functions</h2>
		<ul>
			<li>
				<div class="fName">run</div>
				<div class="fParams"></div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Starts the game loop. This is generally the last function to call in your program.</div>
			</li>
			<li>
				<div class="fName">add</div>
				<div class="fParams">object</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Objects will not be drawn or updated unless they've been added to the game. You must do this with every object you create, unless you have some other way to render and update them.</div>
			</li>
			<li>
				<div class="fName">remove</div>
				<div class="fParams">object</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Removes the object from the game.</div>
			</li>
			<li>
				<div class="fName">setBGColor</div>
				<div class="fParams">red, green, blue</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Sets the background color of the game window.</div>
			</li>
			<li>
				<div class="fName">update</div>
				<div class="fParams"></div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Updates all the game's children. Don't call this function, generally. It is accessable so that you can extend it using jsGame.extend, to add custom code to run every frame.<div>
			</li>
			<li>
				<div class="fName">render</div>
				<div class="fParams"></div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Renders all the game's children. Don't call this function, generally. It is accessable so that you can extend it using jsGame.extend, to add custom code to run every frame.</div>
			</li>
			
		</ul>

	</div>
<?php include "_bottom.php" ?>
