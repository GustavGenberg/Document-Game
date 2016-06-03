document.addEventListener('mousemove', (Event) => {

});
window.onresize = function () {
  Game.resizeCanvas();
};
document.addEventListener('keydown', function (Event) {
  if([37, 38, 39, 40].indexOf(Event.keyCode) > -1) {
    Game.Keys[Event.keyCode] = true;
  }
});
document.addEventListener('keyup', function (Event) {
  if([37, 38, 39, 40].indexOf(Event.keyCode) > -1) {
    delete Game.Keys[Event.keyCode];
  }
});
$("[data-func]").click(function () {
  var a = $(this).attr('data-func');

  if(a == 'StopDrawing') {
    Game.StopDrawing();
  }
  if(a == 'StartDrawing') {
    Game.StartDrawing();
  }
});
