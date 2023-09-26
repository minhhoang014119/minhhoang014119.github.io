require(['../lib/jquery.min', '../lib/underscore-min', './model/controller'], (a, b, Controller) => {
  const audior = new Controller()
  window.getAudior && window.getAudior(audior)
})
