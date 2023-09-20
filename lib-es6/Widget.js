load(() => class Widget {
	events() { }
	init() { }
	constructor() { this.init(); this.events(); }
	val_field(field, name, val) { field = this[field] || field; if (val == undefined) return field[name]; field[name] = val; return this; }
	flag_field(field, name, val) { return this.val_field(field, name, val == undefined ? !this.val_field(field, name) : val); }
	plus_field(field, name, val) { return this.val_field(field, name, val == undefined ? undefined : this.val_field(field, name) + val); }
	val_prop(prop, val) { if (val == undefined) return this[prop]; this[prop] = val; return this; }
	flag_prop(prop, val) { return this.val_prop(prop, val == undefined ? !this.val_prop(prop) : val); }
	plus_prop(prop, val) { return this.val_prop(prop, val == undefined ? undefined : this.val_prop(prop) + val); }
	toggle_el(el, val) { (this[el] || el).toggle(val); return this; }
	is_display(el) { return (this[el] || el).is(':visible'); }
});