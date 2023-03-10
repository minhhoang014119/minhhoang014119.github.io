load(['../../lib/Widget'], function(Widget){
	return class Video extends Widget {
		plus_video = this.plus_field.bind(this, this.$video[0]);
		field_video = this.val_field.bind(this, this.$video[0]);
		events(){
			this.$video.on('play', this.on_play_video.bind(this));
			this.$video.on('timeupdate', this.on_time_update.bind(this));
		}
		on_play_video(){ this.field_video('playbackRate', this.rateValue); }
		on_time_update(){ if(this.time() >= this.duration() - this.ignore_end()) this.stop(); }
		init(){
			this.$container = $('.container');
			this.$video = $('.video');
			this.$ignoreStart = $('.ignore-start');
			this.$ignoreEnd = $('.ignore-end');
			this.rateValue = 1;
		}
		toggle_play(){ return this.$video[0].paused ? this.play() : this.pause(); }
		play(){ this.$video[0].play(); return this; }
		pause(){ this.$video[0].pause(); return this; }
		stop(){ return this.time(this.duration()); }
		src(value){ this.$video[0].src = value; this.time(this.ignore_start()); return this.play(); }
		rate = this.plus_video.bind(this, 'playbackRate');
		save_rate(){ this.rateValue = this.rate(); return this; }
		ignore_start = this.val_field.bind(this, this.$ignoreStart[0], 'value');
		ignore_end = this.val_field.bind(this, this.$ignoreEnd[0], 'value');
		seek = this.plus_video.bind(this, 'currentTime');
		time = this.field_video.bind(this, 'currentTime');
		duration = this.field_video.bind(this, 'duration');
		volume = this.field_video.bind(this, 'volume');
		toggle = this.toggle_el.bind(this, '$container');
		is_display = this.is_display.bind(this, '$video');
	}
});