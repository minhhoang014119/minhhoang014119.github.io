define(['lib!Widget'], Widget => {
  return class File extends Widget {
    init() {
      this.$fileContainer = $('.file-container');
      this.$file = $('.file');
    }
    files(ext) {
      return _.filter(window.files, function(file) {
        return ext ? file.name.toLocaleUpperCase().endsWith('.' + ext.toLocaleUpperCase()) : true;
      });
    }
    file_same_name(name, ext) {
      var self = this; return _.first(_.filter(this.files(ext), function(file) {
        return !self.name_without_ext(file.name).localeCompare(self.name_without_ext(name));
      }));
    }
    file(index, ext) { return this.files(ext)[index]; }
    count(ext) { return this.files(ext).length; }
    has_index(index, ext) { return index > -1 && index < this.count(ext); }
    url(index, ext) { return URL.createObjectURL(this.file(index, ext)); }
    name(index, ext) { return this.file(index, ext).name; }
    name_without_ext(name) { var lastDot = name.lastIndexOf('.'); return lastDot == -1 ? name : name.substring(0, lastDot); }

    is_show() { return this.$file.is(':visible'); }
    toggle = this.toggle_el.bind(this, '$fileContainer');
  }
})
