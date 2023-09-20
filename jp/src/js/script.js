var db = {
	init: function() {
		this.data = JSON.parse(unescape(jsonData))[config];
	},
	// Input
	set_buttons_status: function() {

	},
	set_scroll_position: function() {

	},
	// Output
	get_items: function() {
		return this.data;
	},
	get_buttons_status: function() {

	},
	get_scroll_position: function() {

	},
};
var ui = {
	init: function() {

	},
	// Input
	number: function(kanji) {
		open('https://mazii.net/search?dict=javi&type=k&query=' + encodeURI(kanji) + '&hl=vi-VN');
	},
	kanji: function(self) {
		this.switch_items_visible(self, 'kanji');
	},
	mean: function(self) {
		this.switch_items_visible(self, 'mean');
	},
	kun: function(self) {
		this.switch_items_visible(self, 'kun');
	},
	on: function(self) {
		this.switch_items_visible(self, 'on');
	},
	detail: function(self) {
		this.switch_items_visible(self, 'detail');
	},
	// Output
	render_list: function(items) {
		var html = '';
		items.forEach((item, i) => {
			html += '<div class="buttons">';
			html += '<div class="number" onclick="ui.number(\'' + item.kanji + '\')">' + ((i + 1) + '').padStart(4, '0') + '</div>';
			html += '<div class="kanji">' + item.kanji + '</div>';
			if (item.mean)
				html += '<div class="mean">' + item.mean + '</div>';
			if (item.kun)
				html += '<div class="kun">' + item.kun + '</div>';
			if (item.on)
				html += '<div class="on">' + item.on + '</div>';
			if (item.detail)
				html += '<div class="detail">' + item.detail + '</div>';
			html += '</div>';
		});
		document.querySelector('.list').innerHTML = html;
	},
	// Funs
	switch_items_visible: function(self, tag) {
		// If items is showing then hidden items
		var selfColor = 'black';
		var itemsDisplay = 'none';
		// If items is hidding then show items
		if (self.style.color == 'black') {
			selfColor = 'white';
			itemsDisplay = 'flex';
		}
		// Change visible of items
		document.querySelectorAll('.' + tag).forEach(tag => {
			tag.style.display = itemsDisplay;
		});
		// Fix visible of button is always showing
		self.style.display = 'flex';
		// Set button's color if items is showing then white else black
		self.style.color = selfColor;
	},
};
var ap = {
	init: function() {

	},
	process_list: function() {
		var items = db.get_items();
		ui.render_list(items);
	},
	process_buttons: function() {

	},
	process_scroll: function() {

	},
};
onload = function() {
	db.init();
	ui.init();
	ap.init();

	ap.process_list();
	ap.process_buttons();
	ap.process_scroll();
}