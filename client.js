var log = function (d) {
  console.log(d);
};

var Game = new Core();


// Status


var init = function () {
  
    Game.Connect();
    Game.BindSocketEvents();
    /*var I = setInterval(() => {
      if(Game.Socket.connectionS)
    }*/
  } else {
    document.write('WebSocket not supported');
  }
};

var BindEvents = function () {


  $('[data-func]').click(function () {
    var func = $(this).attr('data-func');
    if(Game.FuncRoute[func]) {
      Game[func]();
    }
  });
};



var main = function () {
  log('main()');

  Game.Canvas = document.getElementById('Game');
  Game.ctx = Game.Canvas.getContext('2d');

  Game.Canvas.width = window.innerWidth - 380;
  Game.Canvas.height = window.innerHeight - 50;

  BindEvents();

  Game.raf = requestAnimationFrame(draw, Game.Canvas);


};

$(document).ready(init);
