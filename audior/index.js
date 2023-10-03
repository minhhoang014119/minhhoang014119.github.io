const root = location.href.replaceAll('index.html', '').replace(/\/$/, '')
define('lib', {
  load: (name, req, onLoad) => {
    require([root + '/../lib/' + name + '.js'], mod => define(name, mod) || onLoad(mod))
  }
})
require(['lib!jquery.min', 'lib!underscore-min'], () => (async () => {
  await new Promise((res, interval) => (interval = setInterval(() => window.$ && window._ && res(clearInterval(interval)), 100)))
  require(['./model/controller'], Controller => {
    const audior = new Controller()
    window.getAudior && window.getAudior(audior)
    console.log('audior ready')
  })
})())
