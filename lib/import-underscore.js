load({
  "@lib/underscore-min.js": () => window._
}, ([_]) => {
  delete window._;
  return _;
});