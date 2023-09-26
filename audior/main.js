const root = location.href.replace(/[^\/]*$/, '')
define('lib', {
  load: (name, req, onLoad) => {
    require([root + 'lib/' + name + '.js'], onLoad)
  }
})
define('model', {
  load: (name, req, onLoad) => {
    require([root + 'model/' + name + '.js'], onLoad)
  }
})
require(['lib!jquery.min', 'lib!underscore-min', 'model!controller'], (a, b, Controller) => {
  const audior = new Controller()
  window.getAudior && window.getAudior(audior)
})
