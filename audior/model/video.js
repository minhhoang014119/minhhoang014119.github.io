define(['https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/7.3.3/wavesurfer.min.js', 'lib!Widget'], (wavesurfer, Widget) => {

  return class Video extends Widget {
    plus_video = this.plus_field.bind(this, this.$video[0]);
    field_video = this.val_field.bind(this, this.$video[0]);
    events() {
      this.$video.on('play', this.on_play_video.bind(this));
      this.$video.on('timeupdate', this.on_time_update.bind(this));
    }
    on_play_video() {
      window.on_play_video && window.on_play_video()
      this.field_video('playbackRate', this.rateValue);
    }
    on_time_update() { if (this.time() >= this.duration() - this.ignore_end()) this.stop(); }
    init() {
      this.wave = wavesurfer.create({
        container: $('.video-container')[0],
        dragToSeek: true,
        mediaControls: true,
        waveColor: 'rgb(65 142 255)',
        progressColor: 'rgb(13, 110, 253)',
      })
      this.wave.on('ready', () => window.on_wave_ready && window.on_wave_ready());
      this.$container = $('.container');
      this.$video = $(this.wave.media);
      this.$ignoreStart = $('.ignore-start');
      this.$ignoreEnd = $('.ignore-end');
      this.rateValue = 1;
    }
    toggle_play() { return this.$video[0].paused ? this.play() : this.pause(); }
    play() { this.$video[0].play(); return this; }
    pause() { this.$video[0].pause(); return this; }
    stop() { return this.time(this.duration()); }
    src(value, pause) { !pause && this.wave.once('ready', () => { this.play(); this.time(this.ignore_start()); }); this.wave.load(value); }
    rate(value) {
      const rate = this.plus_video('playbackRate', value);
      window.on_rate_video && window.on_rate_video(rate)
      return rate
    }
    reset_rate(value) {
      this.field_video('playbackRate', value);
      window.on_rate_video && window.on_rate_video(value)
    }
    save_rate() { this.rateValue = this.rate(); return this; }
    ignore_start = this.val_field.bind(this, this.$ignoreStart[0], 'value');
    ignore_end = this.val_field.bind(this, this.$ignoreEnd[0], 'value');
    seek = this.plus_video.bind(this, 'currentTime');
    time = this.field_video.bind(this, 'currentTime');
    duration = this.field_video.bind(this, 'duration');
    volume = this.field_video.bind(this, 'volume');
    toggle = this.toggle_el.bind(this, '$container');
    is_display = this.is_display.bind(this, '$video');
  }
})
