var colors = [
	'#ff0000', '#ff8000', '#ffff00', '#80ff00',
	'#00ff00', '#00ff80', '#00ffff', '#80ffff',
	'#ffffff', '#ffff80', '#ffff00', '#ff8000'];
var i = 11;
setInterval(function(){
	$('h1').css('color', colors[i]);
    if (--i < 0)
    	i = 11;
}, 1000 / 12);