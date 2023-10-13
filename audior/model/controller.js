define(['lib!Widget', './file', './video', './subText', './dialog', 'lib!funcUtils'],
  (Widget, File, Video, SubText, Dialog, funcUtils) => {
    var file = new File();
    var video = new Video();
    var dialog = new Dialog();
    var subText = new SubText();

    return class Controller extends Widget {
      get_video() { return video }
      is_video_display() { return video.is_display() }
      events() {
        file.$file.change(this.on_file_change.bind(this));
        $('.button').click(this.play.bind(this));
        this.$window.keydown(this.on_window_key_down.bind(this));
        video.$video.keydown(this.on_window_key_down.bind(this));
        video.$video.click(function() { this.blur(); });
        video.$video.focus(function() { this.blur(); });
        video.$video.on('timeupdate', this.on_time_update.bind(this));
      }
      on_file_change(ev) {
        window.files = ev.target.files
        this.play_init();
      }
      on_window_key_down(ev) {
        this.check_key_down(ev.key);
      }
      on_time_update() {
        var time = video.time();
        localStorage.setItem('time', time);
        this.update_subtitle(time);
        this.check_loop_ab(time);
      }
      on_sub_time_click(index, ev) {
        this.seek_to_subtitle_index(index);
      }
      on_sub_text_click() { }
      init() {
        video.toggle(false);
        subText.toggle(false);
        this.$window = $(window);
        this.index = (localStorage.getItem('index') || 0) * 1;
        subText.subTitle.syncVal = (localStorage.getItem('syncVal') || 0) * 1;
        this.timeA = null;
        this.timeB = null;
      }
      play_init() {
        this.index = 0;
        localStorage.setItem('index', this.index);
        localStorage.setItem('time', 0);
        this.play();
      }
      load(keep) {
        if (file.has_index(this.index, this.get_file_extention())) {
          video.src(file.url(this.index, this.get_file_extention()), true);
          video.time((localStorage.getItem('time') || 0) * 1);
          this.load_sub();
          !keep && this.toggle_file_video();
          this.alert_play_info();
        }
      }
      play() {
        if (file.has_index(this.index, this.get_file_extention())) {
          video.src(file.url(this.index, this.get_file_extention()));
          video.time((localStorage.getItem('time') || 0) * 1);
          this.load_sub();
          this.toggle_file_video();
          this.alert_play_info();
        }
      }

      check_key_down(key) {
        switch (key) {
          case 'ArrowUp': video.rate(0.1); video.save_rate(); this.alert_rate(); break;
          case 'ArrowDown': video.rate(-0.1); video.save_rate(); this.alert_rate(); break;
          case 'r': video.reset_rate(1); video.save_rate(); this.alert_rate(); break;
          case 'ArrowRight': case 'd': video.seek(2); break;
          case 'ArrowLeft': case 'a': video.seek(-2); break;
          case 'b': if (file.has_index(this.index - 1, this.get_file_extention())) { video.src(file.url(--this.index, this.get_file_extention())); localStorage.setItem('index', this.index); this.load_sub(); } this.alert_play_info(); break;
          case 'n': if (file.has_index(this.index + 1, this.get_file_extention())) { video.src(file.url(++this.index, this.get_file_extention())); localStorage.setItem('index', this.index); this.load_sub(); } this.alert_play_info(); break;
          case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7':
          case '8': case '9': if (video.is_display()) { video.volume(key * 0.1); this.alert_volume(); } break;
          case '.': video.volume(1); this.alert_volume(); break;
          case '+': subText.sync(1); localStorage.setItem('syncVal', subText.sync()); this.alert_sync(); break;
          case '-': subText.sync(-1); localStorage.setItem('syncVal', subText.sync()); this.alert_sync(); break;
          case 'Enter': this.alert_play_info(); break;
          case 'p': case ' ': case 'x': video.toggle_play(); break;
          case 'Escape': video.pause(); this.toggle_file_video(); break;
          case 'f': video.time(0); break;
          case '/': this.timeA && video.time(this.timeA); break;
          case 'q': this.timeA = video.time(); window.on_loop_video && window.on_loop_video(); this.alert_time_a(); break;
          case '*': this.timeB = null; break;
          case 'e': this.timeB = video.time(); window.on_loop_video && window.on_loop_video(); this.alert_time_b(); break;
          case 'Delete': case 'r': this.timeA = this.timeB = this.count = null; window.on_loop_video && window.on_loop_video(); this.alert_clear_ab(); break;
          case 'Insert': if (this.timeA != null && video.time() != this.timeA) video.time(this.timeA); else if (this.timeB != null) video.time(this.timeB); break;
        }
      }
      get_file_extention() { return 'mp3'; }
      update_subtitle(time) {
        if (this.hasSub) {
          var item = subText.subTitle.get(time);
          if (item !== true && item !== false)
            subText.scroll_to(item.index);
        }
      }
      check_loop_ab(time) {
        if (this.timeA != null && this.timeB != null && time > this.timeB) {
          document.title = this.count = (this.count || 0) + 1;
          window.on_loop_ab && window.on_loop_ab()
          video.time(this.timeA || 0);
        }
      }
      seek_to_subtitle_index(index) { video.time(subText.time(index) + subText.subTitle.syncVal); }
      load_sub() {
        var self = this;
        var sub = file.file_same_name(file.file(this.index, this.get_file_extention()).name, 'srt');
        if (sub)
          funcUtils.read_file_as_string(sub, function(data) {
            subText.load(
              data,
              self.on_sub_time_click.bind(this),
              self.on_sub_text_click.bind(this)
            );
            self.hasSub = true;
          }.bind(this));
        else
          this.hasSub = false;
        subText.toggle(!!sub);
      }
      toggle_file_video() { file.toggle(); video.toggle(); }
      alert_play_info() { if (file.count(this.get_file_extention())) dialog.alert(this.index + 1 + '/' + file.count(this.get_file_extention()) + ' - ' + file.name(this.index, this.get_file_extention()) + ' - Inore start: ' + video.ignore_start() + ' - Inore end: ' + video.ignore_end()); }
      alert_rate() { dialog.alert('rate: ' + Math.round(video.rate() * 10) / 10); }
      alert_volume() { dialog.alert('volume: ' + video.volume()); }
      alert_sync() { dialog.alert('sync: ' + Math.round(subText.sync() * 10) / 10); }
      alert_time_a() { dialog.alert('time a: ' + funcUtils.second_to_string_time(this.timeA)); }
      alert_time_b() { dialog.alert('time b: ' + funcUtils.second_to_string_time(this.timeB)); }
      alert_clear_ab() { dialog.alert('clear time ab'); }
    }
  })
