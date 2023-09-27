const root = location.href.replaceAll('index.html', '').replace(/\/$/, '')
define('lib', {
  load: (name, req, onLoad) => {
    require([root + '/../lib/' + name + '.js'], mod => define(name, mod) || onLoad(mod))
  }
})
require(['lib!css', 'lib!jquery.min', 'lib!underscore-min', './model/controller'], (css, jquery, underscore, Controller) => (async () => {
  require(['css!../videor/css/style.css', 'css!./css/style.css'], () => document.body.style.display = '')
  await new Promise((res, interval) => (interval = setInterval(() => window.$ && window._ && res(clearInterval(interval)), 100)))
  window.getAudior && window.getAudior(new Controller())
  console.log('audior ready')
})())
