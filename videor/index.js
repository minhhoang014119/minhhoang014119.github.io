const root = location.href.replaceAll('index.html', '').replace(/\/$/, '')
define('lib', {
  load: (name, req, onLoad) => {
    require([root + '/../lib/' + name + '.js'], onLoad)
  }
})
require(['lib!jquery.min', 'lib!underscore-min', './model/controller'], (a, b, Controller) => {
  new Controller();
  alert("ready");
})
