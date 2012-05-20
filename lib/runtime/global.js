function getGlobal(){
	return (function(){
		return this;
	}).call(null);
}

var global = getGlobal();
