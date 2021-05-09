function load(paths, func) {
	var curScript = document.currentScript;
	var loads = [];
	var loadFunc = function() {
		if (Object.keys(loads).length == paths.length) {
			var param = func && func.apply(this, loads);
			curScript.load && curScript.load(param);
		}
	};
	if (!func) {
		func = paths;
		paths = [];
		return loadFunc();
	}
	paths.forEach(function(path, i) {
		if (load[path]) {
			loads[i] = load[path];
			loadFunc();
		} else {
			var script = document.createElement("script");
			script.load = function(data) {
				script.load = false;
				load[path] = loads[i] = data;
				loadFunc();
			};
			var extFlg = path.endsWith(".js");
			script.src = path + (extFlg ? "" : ".js");
			document.head.appendChild(script);
			setTimeout(function() {
				script.load && !extFlg && console.warn("Time out: " + path);
				script.load && script.load(true);
			}, 500);
		}
	});
}