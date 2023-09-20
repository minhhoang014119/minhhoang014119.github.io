load(() => {
	function Class() { }
	Class.extend = function(name, Clazz) {
		Clazz = Clazz || name;
		var Class = function() {
			this.init && this.init.apply(this, arguments);
		}
		Clazz.className = { name: name, Class: Class };
		this.prototype.childClasses = this.prototype.hasOwnProperty('childClasses')
			? this.prototype.childClasses : [];
		this.prototype.childClasses.push(Clazz.className);
		Clazz.__proto__ = this.prototype;
		Clazz.super = {
			__proto__: Object.entries(this.prototype).reduce(function(rt, entry) {
				rt[entry[0]] = (function(fn) {
					return typeof fn == 'function' ? function() {
						this.super = (function(self) {
							while (self = self.__proto__)
								if (Object.values(self).includes(fn))
									return self.super;
						})(this);
						var rt = fn.apply(this, arguments);
						delete this.super;
						return rt;
					} : fn;
				})(entry[1]);
				return rt;
			}, {})
		};
		Class.prototype = Clazz;
		Class.extend = this.extend;
		Class.include = function(name, Clazz) {
			Clazz = Clazz || name;
			Object.entries(this.prototype).forEach(function(entry) {
				if (Clazz[entry[0]] == undefined && typeof entry[1] == 'function')
					Clazz[entry[0]] = function() {
						return this.super[entry[0]].apply(this, arguments);
					};
			});
			var childClasses = this.prototype.hasOwnProperty('childClasses')
				? this.prototype.childClasses : [];
			this.prototype.childClasses = [];
			var includeClass = this.extend(name, Clazz);
			this.prototype = includeClass.prototype;
			childClasses.forEach(function(className) {
				var childClass = className.Class;
				var childSuper = childClass.prototype.super;
				var replaceSuper = includeClass.extend(className.name, childClass.prototype);
				childSuper.__proto__ = replaceSuper.prototype.super.__proto__;
				childClass.prototype = replaceSuper.prototype;
			});
			return this;
		}
		return Class;
	}
	return Class;
});