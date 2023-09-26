define(['lib!Widget', 'lib!funcUtils'], (Widget, funcUtils) => {
  return class Dialog extends Widget {
    alert(msg) {
      $('<h3/>').addClass('alert').html(msg).appendTo(document.body).click(function() {
        funcUtils.copy_to_clipboard(msg);
        $(this).html(msg + ' - Copied!');
      }).delay(2000).queue(function() {
        $(this).remove().dequeue();
      });
    }
  }
})
