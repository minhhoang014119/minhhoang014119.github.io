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
			if (curScript.timeout) {
				clearTimeout(curScript.timeout);
				curScript.timeout = false;
			}
			var script = document.createElement("script");
			script.load = function(data) {
				script.load = false;
				load[path] = loads[i] = data;
				loadFunc();
			};
			var extFlg = path.endsWith(".js");
			var url = path;
			if (!extFlg) {
				url = curScript.src.substring(0,
						curScript.src.lastIndexOf("/") + 1)
						+ path + ".js";
			}
			script.src = url;
			document.head.appendChild(script);
			script.timeout = setTimeout(function() {
				script.load && !extFlg && console.warn("Time out: " + path);
				script.load && script.load(true);
			}, load.timeout || 0);
		}
	});
}