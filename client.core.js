var Game = function () {
  var _this = this;
  _this.PlayerMap = new Map();
  _this.Players = {};
  _this.viewport = {minx: 0, maxx: 0, miny: 0, maxy : 0};
  _this.Ping = '0 ms';
  _this.FPS = {o: 0, c: 0};
  _this.Keys = {};

  _this.Canvas = document.getElementById('Game');
  _this.ctx = _this.Canvas.getContext('2d');
  _this.resizeCanvas();

  _this.Cache = {
    Assets: {},
    Map: {}
  };

  _this.SocketConfig = {
    host: 'localhost',
    port: 4000
  };
};

Game.prototype = {
  CheckSocketCompitability: () => {
    return 'WebSocket' in window
  },
  resizeCanvas: function () {
    var _this = this;
    _this.Canvas.width = window.innerWidth - 380;
    _this.Canvas.height = window.innerHeight - 50;
  },
  Connect: function () {
    var _this = this;
    _this.Socket = io(_this.SocketConfig.host + ':' + _this.SocketConfig.port);
    _this.BindSocketEvents();
  },
  BindSocketEvents: function () {
    var socket = this.Socket;
    var _this = this;
    socket.on('Connected', () => {
      setInterval(function () {

        _this.FPS.o = _this.FPS.c;
        _this.FPS.c = 0;

        // Game Stats

        $('#FPS span').html(_this.FPS.o);
        $('#PING span').html(_this.Ping);
        socket.emit('Ping', new Date().getTime());
      }, 1000);


      _this.Keyboard();
    });

    socket.on('Ping', (D) => {
      _this.Ping = new Date().getTime() - D + ' ms';
    });

    socket.on('User-Connect', (U) => {
      _this.Players[U[0]] = U[1];
    });

    socket.on('Map', (D) => {
      console.log('Got MAP Package');

      _this.Cache.Map = D;

      for(var i = 0; i < _this.Cache.Map.length; i++) {
        var SRC = _this.Cache.Map[i][0];
        if(!_this.Cache.Assets[SRC]) {
          _this.Cache.Assets[SRC] = new Image();
          _this.Cache.Assets[SRC].src = './Assets/' + SRC + '.png';
        }
      }
    });
  },
  Keyboard: function () {
    var _this = this;
    setInterval(() => {
      if(JSON.stringify(_this.Keys) != _this.Cache.Keys) {
        console.log('CHANGE');
        _this.Socket.emit('KeyChange', _this.Keys);
      }
      _this.Cache.Keys = JSON.stringify(_this.Keys);

      $('#KEYS span').html(JSON.stringify(Game.Keys));

    }, 100);

    /*Object.observe(_this.Keys, function () {
      _this.Socket.emit('KeyChange', _this.Keys);
      console.log('CHANGE');
    });*/
  },
  Draw: function () {
    var _this = this;
    _this.FPS.c++;

    var ctx = _this.ctx;

    ctx.clearRect(0, 0, _this.Canvas.width, _this.Canvas.height);
    ctx.translate(-_this.viewport.minx, -_this.viewport.miny);

    for(var i = 0; i < _this.Cache.Map.length; i++) {
      var SRC = _this.Cache.Map[i][0];

      ctx.drawImage(_this.Cache.Assets[SRC], _this.Cache.Map[i][1], _this.Cache.Map[i][2], _this.Cache.Map[i][3], _this.Cache.Map[i][4]);

    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillText(_this.FPS.o, 10, 10);
    ctx.fillText(new Date().getTime(), 10, 20);
  },
  StartDrawing: function () {
    var _this = this;

    if(_this.raf) {
      _this.StopDrawing();
    }

    _this.Draw();

    _this.raf = requestAnimationFrame(function () {
      _this.StartDrawing();
    });
  },
  StopDrawing: function () {
    var _this = this;
    cancelAnimationFrame(_this.raf);
    _this.raf = null;
  },
  Join: () => {
    this.Socket.emit('User-Set-Nickname', $('#nickname').val());
  }
};

var Player = function (id, nickname, x, y) {
  this.id = id;
  this.nickname = nickname;
  this.x = x;
  this.y = y;
};

Player.prototype = {
  draw: function () {

    ctx.fillRect(20, 20, 20, 20);

  }
};
