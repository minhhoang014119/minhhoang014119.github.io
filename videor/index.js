const root = location.href.replaceAll('index.html', '').replace(/\/$/, '')
define('lib', {
  load: (name, req, onLoad) => {
    require([root + '/../lib/' + name + '.js'], onLoad)
  }
})
require(['lib!jquery.min', 'lib!underscore-min', './model/controller'], (jquery, underscore, Controller) => (async () => {
  await new Promise((res, interval) => (interval = setInterval(() => window.$ && window._ && res(clearInterval(interval)), 100)))
  const videor = new Controller()
  window.getAudior && window.getAudior(videor)
  console.log('videor ready')
})())
