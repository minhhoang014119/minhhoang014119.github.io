define(['model!videor/model/subText'], SuperSubText => {
  return class SubText extends SuperSubText {
    getText(index) { return this.subTitle.texts[index].replace(/\r\n|\r|\n/g, '<br><br>') || $('<div/>').html(this.subTitle.texts[index].replace(/\r\n|\r|\n/g, '<br>')).text(); }
  }
})
