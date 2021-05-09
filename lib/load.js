function load(paths, func) {
	var curScript = document.currentScript;
	var loads = [];
	var loadFunc = function() {
		if (Object.keys(loads).length == paths.length) {
			curScript.timeout && clearTimeout(curScript.timeout);
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
			curScript.timeout = curScript.timeout && clearTimeout(curScript.timeout);
			var script = document.createElement("script");
			script.load = function(data) {
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
				script.timeout = false;
				!extFlg && console.warn("Time out: " + path);
				var load = script.load;
				script.load = false;
				load.call(script, true);
			}, load.timeout || 300);
		}
	});
}