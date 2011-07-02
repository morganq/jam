<?php include "_top.php" ?>
	<div class="right">
		<h1>jsGame<span class="extra">.js</span></h1>
		<h2>Description</h2>
		<p>jsGame.js is the root engine component which is responsible for loading all modules. It loads a number of modules by default, listed on the left in Core reference.</p>
		<h2>Static Properties</h2>
		<ul>
			<li>
				<div class="pName">modules</div>
				<div class="pType">array</div>
				<div class="pDesc">Stores the currently loaded module names</div>
			</li>
			<li>
				<div class="pName">logMessages</div>
				<div class="pType">array</div>
				<div class="pDesc">A list of every message that has been logged using jsGame.log</div>
			</li>

		</ul>
		<h2>Static Functions</h2>
		<ul>
			<li>
				<div class="fName static">includeModule</div>
				<div class="fParams">name</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Loads a module by looking for &quot;<strong>name</strong>.js&quot; in the current directory and including it with a &lt;script&gt; tag.</div>
			</li>

			<li>
				<div class="fName static">extend</div>
				<div class="fParams">function1, function2</div>
				<div class="fReturns">function</div>
				<div class="fDesc">Extends the first function by attaching the body of the second function to the end of it. Returns the new function created by this combination. This does not modify either of the original functions. </div>
			</li>
			<li>
				<div class="fName static">log</div>
				<div class="fParams">message</div>
				<div class="fReturns">nothing</div>
				<div class="fDesc">Adds this message to the logMessages array with the current timestamp</div>
			</li>

		</ul>

	</div>
<?php include "_bottom.php" ?>
