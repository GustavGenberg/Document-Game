var CheckSocketCompitability = function () {
  return 'WebSocket' in window
};
var log = function (d) {
  console.log(d);
};

var Game = {};
Game.viewport = {minx: 0, maxx: 0, miny: 0, maxy : 0};

// Status
Game.Ping = '0 ms';
Game.FPS = {o: 0, c: 0};

var init = function () {
  if(CheckSocketCompitability()) {
    Game.socket = io(':4000');
    Game.socket.on('Connected', main);
  } else {
    document.write('WebSocket not supported');
  }
};

var BindEvents = function () {
  window.onresize = function () {
    Game.Canvas.width = window.innerWidth - 380;
    Game.Canvas.height = window.innerHeight - 50;
  };

  Game.socket.on('Ping', (D) => {
    Game.Ping = new Date().getTime() - D + ' ms';
  });
};

var draw = function () {
  Game.FPS.c++;

  var ctx = Game.ctx;
  ctx.clearRect(0, 0, Game.Canvas.width, Game.Canvas.height);

  ctx.translate(-Game.viewport.minx, -Game.viewport.miny);

  ctx.fillRect(20, 20, 20, 20);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillText(Game.FPS.o, 5, 10);

  cancelAnimationFrame(Game.raf);
  Game.raf = requestAnimationFrame(draw, Game.Canvas);
};

var main = function () {
  log('main()');

  Game.Canvas = document.getElementById('Game');
  Game.ctx = Game.Canvas.getContext('2d');

  Game.Canvas.width = window.innerWidth - 380;
  Game.Canvas.height = window.innerHeight - 50;

  BindEvents();

  Game.raf = requestAnimationFrame(draw, Game.Canvas);

  setInterval(function () {
    Game.FPS.o = Game.FPS.c;
    Game.FPS.c = 0;

    // Game Stats

    $('#FPS span').html(Game.FPS.o);
    $('#PING span').html(Game.Ping);
    Game.socket.emit('Ping', new Date().getTime());
  }, 1000);
};

$(document).ready(init);
