<?php include "_top.php" ?>
	<div class="right">
		<h1><span class="extra">jsGame.</span>Sprite<span class="extra">.js</span></h1>
		<h2>Description</h2>
		<p>A Sprite is the basic game object, which has an image and a position.</p>
		<h2>Constructor</h2>
		<ul>
			<li>
				<div class="fName">jsGame.Sprite</div>
				<div class="fParams">x, y</div>
				<div class="fReturns">new Sprite</div>
				<div class="fDesc">Makes a Sprite at the given location. If you want it to show up in the game, you must add it to the game object using the game's add method.</div> 
			</li>
		</ul>
		<h2>Properties</h2>
		<ul>
			<li>
				<div class="pName">x</div>
				<div class="pType">number</div>
				<div class="pDesc">Horizontal position</div>
			</li>
			<li>
				<div class="pName">y</div>
				<div class="pType">number</div>
				<div class="pDesc">Vertical position</div>
			</li>
			<li>
				<div class="pName">width</div>
				<div class="pType">number</div>
				<div class="pDesc">Width of the sprite. This affects rendering and rectangular collision. </div>
			</li>
			<li>
				<div class="pName">height</div>
				<div class="pType">number</div>
				<div class="pDesc">Height of the sprite. This affects rendering and rectangular collision. </div>
			</li>
			<li>
				<div class="pName">visible</div>
				<div class="pType">boolean</div>
				<div class="pDesc">Does not render if set to false.</div>
			</li>
			<li>
				<div class="pName">velocity</div>
				<div class="pType">Vector</div>
				<div class="pDesc">The x and y velocity of this object. Every frame, inside its update function, the sprite will update its position based on its velocity.</div>
			</li>
			<li>
				<div class="pName">acceleration</div>
				<div class="pType">Vector</div>
				<div class="pDesc">The x and y acceleration of this object. Every frame, inside its update function, the sprite will update its velocity based on its acceleration.</div>
			</li>
			<li>
				<div class="pName">parallax</div>
				<div class="pType">Vector</div>
				<div class="pDesc">This vector is multiplied by the camera's scrolling values to get the sprite's visible position. In other words, if this is (0,0) the sprite will appear to be floating with the camera (like a background image) and if it's (1,1) the sprite will appear to scroll like it's in the foreground.</div>
			</li>

		</ul>
		<h2>Functions</h2>
		<ul>
			<li>
				<div class="fName">setImage</div>
				<div class="fParams">imageURL</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Loads a URL and sets the sprite's image to it. This operation is done in the background while your program continues to run. When the image finishes loading, the sprite will show up.</div>
			</li>
			<li>
				<div class="fName">render</div>
				<div class="fParams">context, camera</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Draws the sprite onto the context, taking into account the scrolling value of the camera. The game calls this function, you won't have to.</div>
			</li>
			<li>
				<div class="fName">update</div>
				<div class="fParams">elapsed</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Updates the sprite's movement. The game will call this function, so you won't have to.</div>
			</li>
		</ul>

	</div>
<?php include "_bottom.php" ?>
