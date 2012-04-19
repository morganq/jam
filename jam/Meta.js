jam.Meta = {};

// Adds a function call to the end of an existing function
// -fOld = the function to call first (and return the value of)
// -fNew = the function to call second
// -returnSecond = optional boolean, return the second func result instead
// -passObject = optional boolean, pass the return value of fOld as first argument
// of fNew. Useful to extend a class constructor!!
jam.Meta.extend = function(fOld, fAdd, returnSecond, passObject)
{
	var fNew = function(){
		var returnValue1 = fOld.apply(null,arguments);
		if(passObject) { 
			var args = [returnValue1];
			for(var i=0,len = arguments.length; i < len; i++)
			{
				args[i+1] = arguments[i];
			}
		}
		var returnValue2 = fAdd.apply(null, passObject ? args : arguments);
		return (returnSecond === true) ? returnValue2 : returnValue1;
	};
	
	// If this is a class constructor then it may have static vars, and this will
	// copy them over.
	for (var key in fOld){
		fNew[key] = fOld[key];
	}
	for (var key in fAdd){
		fNew[key] = fAdd[key];
	}
	fNew.extensions = fAdd.extensions ? fAdd.extensions + 1 : 1;
	fNew.flatCode = (fOld.flatCode ? fOld.flatCode : fOld.toString()) +
					"\n\n" + (fAdd.flatCode ? fAdd.flatCode : fAdd.toString());
	return fNew;
}

// Puts all the properties from an object into the constructor of another.
// Mixin pattern, extend some class (cOld) with contents of another (cMix)
jam.Meta.mixin = function(cOld, cMix)
{
	var cNew = function(){
		var self = cOld.apply(null, arguments);


		return self;
	}
	return cNew;
}

// We want extend to be as easily accessible as possible.
jam.extend = jam.Meta.extend;
jam.ex = jam.Meta.extend;
