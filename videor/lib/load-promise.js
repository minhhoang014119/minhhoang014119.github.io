const load = function(param, func) {
  var module = null;
  const modules = Promise.all(
    Array.isArray(param) ? param.map(function(param) {
      return load(param);
    })
      : typeof param != "function" ? [
        module = load[param] || (load[param] = new Promise(function(res) {
          return setTimeout(function() {
            const script = document.createElement("script");
            script.res = res;
            const path = script.path = param.replace(/^@[^\/]+/, function(path) {
              return load[path];
            });
            if (param.endsWith(".js")) {
              script.onload = function() {
                res(true);
              };
              script.src = path;
            } else {
              script.src = path + ".js";
            }
            document.head.appendChild(script);
          });
        }))
      ]
        : []
  );
  if (func || typeof param == "function") {
    const res = document.currentScript.res;
    return new Promise(function(resolve) {
      setTimeout(function() {
        modules.then(function(params) {
          const data = (func || param).apply(null, params);
          resolve(data);
          res && res(data);
        });
      });
    });
  }
  return module || modules;
};
