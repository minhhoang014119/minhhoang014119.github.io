load(async () => {
	const Class = await load("@lib-es6/Class");

	return Class.extend({
		syncVal: 0,
		index: 0,
		init: function(data) {
			if (data)
				this.format_srt(data);
		},
		sync: function(val) {
			if (val == undefined)
				return this.syncVal;
			this.syncVal = val;
			return this;
		},
		format_srt: function(data) {
			function get_rows(lines, start, count) {
				var s = [];
				while (count-- > 0)
					if (lines[start++].trim() != '')
						s.push(lines[start - 1]);
				return s.join("\r\n");
			}
			var times = this.times = [];
			var texts = this.texts = [];
			var lines = data.split(/\r\n|\r|\n/);
			lines.forEach((s, i) => {
				if (s.indexOf('-->') != -1) {
					times.push(s.substr(0, 2) * 60 * 60 + s.substr(3, 2) * 60 + s.substr(6, 2) * 1 + s.substr(9, 3) / 1000);
					texts.push(i + 1);
				}
			});
			var i = 0;
			for (var len = texts.length - 1; i < len; ++i)
				texts[i] = get_rows(lines, texts[i], texts[i + 1] - texts[i] - 3);
			texts[i] = get_rows(lines, texts[i], lines.length - texts[i]);
			return this;
		},
		// -> text: new subtile
		// -> false: ''
		// -> true: same old text
		get: function(time) {
			time -= this.syncVal;
			if (this.index > 0 && time >= this.times[this.index - 1] && time < this.times[this.index])
				return true;
			var maxIndex = this.times.length - 1;
			while (this.index > 0 && time < this.times[this.index])
				--this.index;
			while (this.index < maxIndex) {
				if (time < this.times[this.index])
					return false;
				if (time < this.times[this.index + 1])
					return this.result(this.index++);
				++this.index;
			}
			return this.result(maxIndex);
		},
		result: function(index) {
			return this.resultFunc(index, this.times[index], this.texts[index]);
		},
		resultFunc: function(index, time, text) {
			return {
				index: index,
				time: time,
				text: text.trim()
			}
		}
	});
});