const load = (load => {
	load["@"] = /^@[^\/]+/;
	return load;
})((param, func) => {
	var module = null;
	const modules = Promise.all(
		Array.isArray(param) ? param.map(param => load(param))
			: typeof param != "function" ? [
				module = new Promise(res => {
					const params = Object.entries(typeof param == "string" ? { [param]: null } : param)
						.map(([path, valid]) => load[path] || (load[path] = new Promise(res => setTimeout(async () => {
							var func = null;
							path = path.replace(load["@"], path => {
								if (typeof load[path] == "string") {
									return load[path];
								}
								func = load[path];
								return "";
							});
							path = func ? await Promise.resolve(func(path)) : path;
							if (typeof path != "string") {
								return res(path);
							}
							const script = document.createElement("script");
							if (typeof valid == "function") {
								setTimeout(async function loop() {
									const data = await Promise.resolve(valid());
									if (data) {
										return res(data);
									}
									setTimeout(loop);
								});
							} else if (typeof valid == "string") {
								script.type = valid;
							}
							if (path.endsWith(".js")) {
								if (typeof valid != "function") {
									script.onload = () => res(true);
								}
							} else {
								script.res = res;
								path = script.path = path + ".js";
							}
							script.src = path;
							document.head.appendChild(script);
						}))));
					res(typeof param == "string" ? params[0] : Promise.all(params));
				})
			]
				: []
	);
	if (func || typeof param == "function") {
		const res = document.currentScript.res;
		return new Promise(resolve => setTimeout(async () => {
			const data = (func || param).apply(null, await modules);
			resolve(data);
			res && res(data);
		}));
	}
	return module || modules;
});
