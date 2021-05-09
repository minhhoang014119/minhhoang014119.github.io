// load.timeout = 1000;
load.removeLoadWhenDone = true;
// load.log = true;
// load.basePath = 'http://dangminhhoang.com/videor';
load(['../lib/jquery.min.js', '../lib/underscore-min.js', 'model/controller'], function(a, b, Controller) {
	new Controller();
});