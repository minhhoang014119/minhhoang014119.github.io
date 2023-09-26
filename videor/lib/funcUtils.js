define([], () => {
  // -> File
  function open_file(okFunc, multiple) {
    var file = open_file.file = open_file.file || document.createElement('input');
    file.type = 'file';
    file.multiple = !!multiple;
    file.onchange = x => okFunc(!file.files.length ? null : multiple ? Array.from(file.files) : file.files[0]);
    file.click();
  }
  function copy_to_clipboard(data) {
    $('<input/>').appendTo(document.body).val(data).select().dequeue(document.execCommand('copy')).remove();
  }
  // read_file_as_string(func), read_file_as_url(func), read_file_as_bytes(func)
  function read_file_as_string(file, okFunc) {
    var reader = new FileReader();
    reader.onload = function() {
      okFunc(this.result);
    };
    reader.readAsText(file);
  }
  function read_file_as_url(file, okFunc) {
    var reader = new FileReader();
    reader.onload = function() {
      okFunc(this.result);
    };
    reader.readAsDataURL(file);
  }
  function read_file_as_bytes(file, okFunc) {
    var reader = new FileReader();
    reader.onload = function() {
      okFunc(this.result);
    };
    reader.readAsArrayBuffer(file);
  }
  // ajax jquery - option: {url, data, success, error}
  function j_get(option) {
    $.ajax({
      method: 'get',
      url: option.url,
      data: option.data,
      success: option.success,
      error: function(msg) { option.error(msg.responseText); }
    });
  }
  function j_post(option) {
    $.ajax({
      method: 'post', contentType: false, processData: false,
      url: option.url,
      data: (function() { var form = new FormData(); for (var i in option.data) form.append(i, option.data[i]); return form; })(),
      success: option.success,
      error: function(msg) { option.error(msg.responseText); }
    });
  }
  function j_get_json(option) {
    $.ajax({
      method: 'get',
      url: option.url,
      data: option.data,
      success: function(msg) { try { option.success(JSON.parse(msg)); } catch (e) { option.error('Error parse json'); } },
      error: function(msg) { option.error(msg.responseText); }
    });
  }
  function j_post_json(option) {
    $.ajax({
      method: 'post', contentType: false, processData: false,
      url: option.url,
      data: (function() { var form = new FormData(); for (var i in option.data) form.append(i, option.data[i]); return form; })(),
      success: function(msg) { try { option.success(JSON.parse(msg)); } catch (e) { option.error('Error parse json'); } },
      error: function(msg) { option.error(msg.responseText); }
    });
  }
  // ajax fetch - option: {url, data, success, error}
  function f_get(option) {
    fetch(option.url + (function() { var s = ''; for (var i in option.data) s += (s ? '&' : '?') + i + '=' + option.data[i]; return s; })())
      .then(msg => msg.text())
      .then(option.success)
      .catch(option.error);
  }
  function f_post(option) {
    fetch(option.url, { method: 'POST', body: (function() { var form = new FormData(); for (var i in option.data) form.append(i, option.data[i]); return form; })() })
      .then(msg => msg.text())
      .then(option.success)
      .catch(option.error);
  }
  function f_get_json(option) {
    fetch(option.url + (function() { var s = ''; for (var i in option.data) s += (s ? '&' : '?') + i + '=' + option.data[i]; return s; })())
      .then(msg => msg.json())
      .then(option.success)
      .catch(option.error);
  }
  function f_post_json(option) {
    fetch(option.url, { method: 'POST', body: (function() { var form = new FormData(); for (var i in option.data) form.append(i, option.data[i]); return form; })() })
      .then(msg => msg.json())
      .then(option.success)
      .catch(option.error);
  }
  function second_to_string_time(time) {
    var hour = Math.floor(time / (60 * 60));
    var minute = Math.floor(time / 60);
    var second = parseInt(time % 60);
    return (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second)
  }
  function replace_all(src, search, value) {
    while (src.indexOf(search) !== -1)
      src = src.replace(search, value);
    return src;
  }
  function getAbsolutePath(rootPath, relativePath) {
    return (rootPath + '/' + (relativePath || '')).split('/').reduce((rt, dir) => {
      if (dir == '..') {
        if (!rt.pop())
          throw new Error('Access over parent path');
      } else if (dir && dir != '.')
        rt.push(dir);
      return rt;
    }, []).join('/');
  }
  function getRelativePath(rootPath, absolutePath) {
    return getShortPath(rootPath).split('/').reduce((rt, dir, i) => {
      if (rt.length && dir == rt[0])
        rt.shift();
      else
        rt.unshift('..');
      return rt;
    }, getShortPath(absolutePath).split('/')).join('/');
  }
  // lib = 'a/b/c/d';
  // A = 'A';
  // host = 'host';
  // getShortPath('//e/../a///./b/d/../c/////d//////');
  // getAbsolutePath('a/b/c', '//../e/../c///../../b/c/////d//////');
  // getRelativePath('//.//./a//d/..//.//b/./c', '////a//f/..//d///e//')
  return {
    open_file: open_file,
    copy_to_clipboard: copy_to_clipboard,
    read_file_as_string: read_file_as_string,
    read_file_as_url: read_file_as_url,
    read_file_as_bytes: read_file_as_bytes,
    j_get: j_get,
    j_post: j_post,
    j_get_json: j_get_json,
    j_post_json: j_post_json,
    f_get: f_get,
    f_post: f_post,
    f_get_json: f_get_json,
    f_post_json: f_post_json,
    second_to_string_time: second_to_string_time,
    replace_all: replace_all,
    getAbsolutePath: getAbsolutePath,
    getRelativePath: getRelativePath,
  };
})
