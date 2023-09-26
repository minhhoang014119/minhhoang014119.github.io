define(['lib!Widget', 'lib!SubTitle', 'lib!funcUtils'], (Widget, SubTitle, funcUtils) => {
  return class SubText extends Widget {
    init() {
      this.$container = $('.container');
      this.$subText = $('.subText');
      this.subTitle = new SubTitle();
    }
    load(data, timeCallBack, textCallBack) {
      this.subTitle.format_srt(data);
      this.timeCallBack = timeCallBack;
      this.textCallBack = textCallBack;
      this.make_content();
    }
    clear() {
      this.$subText.empty()
    }
    make_content() {
      var self = this;
      var temp = _.template(
        '<div class="sub-item">' +
        '<div class="sub-time"><%= time %></div>' +
        '<div class="sub-text"><%= text %></div>' +
        '</div>'
      );
      this.clear();
      _.each(this.subTitle.times, function(time, index) {
        var $item = $(temp({
          time: funcUtils.second_to_string_time(time),
          text: self.getText(index)
        })).appendTo(self.$subText);
        if (self.timeCallBack) $item.find('.sub-time').click(self.timeCallBack.bind(this, index));
        if (self.textCallBack) $item.find('.sub-text').click(self.textCallBack.bind(this, index));
      });
    }
    getText(index) { return $('<div/>').html(this.subTitle.texts[index].replace(/\r\n|\r|\n/g, '<br>')).text(); }
    time(index) { return this.subTitle.times[index]; }
    text(index) { return this.subTitle.texts[index]; }
    sync = this.plus_field.bind(this, this.subTitle, 'syncVal');
    toggle(valueO) {
      super.toggle_el('$subText', valueO);
      this.$container.toggleClass('has-sub', valueO);
    }
    scroll_to(index) {
      if (this.$active)
        this.$active.toggleClass('active', false);
      this.$active = this.$subText.find('.sub-item').eq(index).toggleClass('active', true);;
      var top = 0;
      this.$subText.find('.sub-item').each(function(i, o) { if (i < index) top += $(o).outerHeight(); });
      this.$subText.stop().animate({ scrollTop: top - this.$subText.height() / 2 + this.$active.outerHeight() / 2 });
    }
  }
})
