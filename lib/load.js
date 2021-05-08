
function load(paths, returnFunc) {
    if (!load.timeout) load.timeout = false;
    if (!load.log) load.log = false;
    if (!load.removeLoadWhenDone) load.removeLoadWhenDone = false;
    if (!load.removeScriptTag) load.removeScriptTag = false;
    if (!load.basePath) load.basePath = '';
    if (!load.l) load.l = function(){ if (load.log) console.log.apply(console, arguments); };
    if (!load.w) load.w = function(){ if (load.log) console.warn.apply(console, arguments); };
    if (typeof paths == 'function') { returnFunc = paths; paths = []; }
    else if (!Array.isArray(paths)) paths = [paths];
    if (!load.modules) load.modules = {};
    if (!load.watchs) load.watchs = {};
    if (!load.get) load.get = function (name, okFunc, isExternal) {
        load.l('get name: ' + name);
        var module = load.modules[name];
        if (module !== undefined && module != 'loading')
            return okFunc(module);
        load.modules[name] = 'loading';
        var timer = load.timeout && !isExternal && setTimeout(function () {
            if (load.modules[name] == 'loading') {
                load.modules[name] = 'missing';
                load.l('Missing module: ' + name);
                okFunc(null);
            }
        }, load.timeout);
        var watch = load.watchs[name];
        load.watchs[name] = function (module) {
            if (load.timeout) clearTimeout(timer);
            if (watch) watch(module);
            okFunc(module);
        };
        if (watch) return;
        var el = document.createElement('script');
        el.src = name.replace(/(\.js)*$/i, '.js');
        el.onload = isExternal &&  load.set.bind(0, name, 'external');
        document.head.appendChild(el);
        if (load.removeScriptTag) el.remove();
    };
    if (!load.set) load.set = function (name, module) {
        load.l('set name: ' + name, module);
        var watch = load.watchs[name];
        if (!watch) return;
        load.modules[name] = module;
        load.watchs[name] = false;
        if (watch) watch(module);
        if (load && load.removeLoadWhenDone && watch && Object.values(load.watchs).every(watch => !watch))
            load = undefined;
    };
    if (!load.getAbsolutePath) load.getAbsolutePath = function (rootPath, relativePath) {
        return (rootPath + '/' + (relativePath || '')).split('/').reduce((rt, dir) => {
            if (dir == '..') {
                if (!rt.pop()) throw new Error('Access over parent path');
            } else if (dir && dir != '.') rt.push(dir);
            return rt;
        }, []).join('/');
    };
    if (!load.getRelativePath) load.getRelativePath = function (rootPath, absolutePath) {
        return load.getAbsolutePath(rootPath).split('/').reduce((rt, dir, i) => {
            if (rt.length && dir == rt[0]) rt.shift();
            else rt.unshift('..');
            return rt;
        }, load.getAbsolutePath(absolutePath).split('/')).join('/');
    };
    if (!load.getKey) load.getKey = function (path) {
        var hostBase = load.basePath ? location.origin + load.basePath : location.href.replace(/[^/]+$/, '');
        var kq = load.getRelativePath(
            hostBase,
            path.startsWith(location.origin) ? path : load.getAbsolutePath(
                hostBase, path
            )
        ).replace(/(\.js)*$/i, '');
        load.w('------------- ' + (path.startsWith(location.origin) ? 'Set' : 'Get') + ' -------------');
        load.l('hostBase', hostBase);
        load.l('path', path);
        load.l('kq', kq);
        return kq;
    };
    if (!load.checkKey) load.checkKey = function (key) {
        if (load.modules[key] && load.modules[key] != 'loading')
            throw new Error('You can call function load only one for define module: ' + key);
    };
    var key = load.getKey(document.currentScript.src);
    load.checkKey(key);
    var count = paths.length;
    if (!count) return load.set(key, returnFunc && returnFunc());
    var modules = [];
    function next(i, isExternal){
        if (i == paths.length) return;
        var path = paths[i];
        load.w('path', path);
        if (path === true) return next(++i, true, --count);
        var name = path.startsWith('http') && !path.startsWith(location.origin) ? path : load.getKey(path);
        isExternal = isExternal || name.startsWith('http');
        load.get(name, function (module) {
            modules[i] = module;
            if (!--count)
                return load.set(key, returnFunc && returnFunc.apply(null, Object.values(modules)));
            if (isExternal) next(++i);
        }, isExternal);
        if (!isExternal) next(++i);
    }
    next(0);
}