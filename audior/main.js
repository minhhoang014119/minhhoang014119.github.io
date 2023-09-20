load.timeout = 5000;
load(['../lib/jquery.min.js', '../lib/underscore-min.js', 'model/controller'], function(a, b, Controller) {
  const audior = new Controller();
  window.getAudior && window.getAudior(audior);
});