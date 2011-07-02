<?php include "_top.php" ?>
	<div class="right">
		<h1><span class="extra">jsGame.</span>Vector<span class="extra">.js</span></h1>
		<h2>Description</h2>
		<p>A 2-dimensional vector class. Javascript doesn't support operator overloading, so all the functions to operate on Vectors are "static".</p>
		<h2>Properties</h2>
		<ul>
			<li>
				<div class="pName">x</div>
				<div class="pType">number</div>
				<div class="pDesc"></div>
			</li>
			<li>
				<div class="pName">y</div>
				<div class="pType">number</div>
				<div class="pDesc"></div>
			</li>
		</ul>
		<h2>Static Functions</h2>
		<ul>
			<li>
				<div class="fName static">jsGame.Vector.getLength</div>
				<div class="fParams">vector</div>
				<div class="fReturns">number</div>
				<div class="fDesc">Returns the length (magnitude) of the supplied vector. Uses the rather expensive square root operation.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Vector.getLengthSq</div>
				<div class="fParams">vector</div>
				<div class="fReturns">number</div>
				<div class="fDesc">Returns the length (magnitude) of the supplied vector squared. Does not use square root, so is much faster than getLength if you can square the other side of the equation.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Vector.add</div>
				<div class="fParams">vector1, vector2</div>
				<div class="fReturns">vector</div>
				<div class="fDesc">Adds the components of the vectors together and returns the resulting vector.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Vector.sub</div>
				<div class="fParams">vector1, vector2</div>
				<div class="fReturns">vector</div>
				<div class="fDesc">Subtracts the components of the vectors and returns the resulting vector.</div>
			</li>
			<li>
				<div class="fName static">jsGame.Vector.mul</div>
				<div class="fParams">vector, scalar</div>
				<div class="fReturns">vector</div>
				<div class="fDesc">Multiplies the components of the input vector by the scaling factor and returns the resulting vector.</div>
			</li>
			<li>
				<DIV class="fName static">jsGame.Vector.div</div>
				<div class="fParams">vector, scalar</div>
				<div class="fReturns">vector</div>
				<div class="fDesc">Divides the components of the input vector by the scaling factor and returns the resulting vector.</div>
			</li>
		</ul>

	</div>
<?php include "_bottom.php" ?>
