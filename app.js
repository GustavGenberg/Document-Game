'use strict'

const config = require('./config');
const io = require('socket.io')(config.socket.port);
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');

const UUID = require('./UUID');
const Random = require('./Random');
const CColl = require('./CollisionDetection');
const GameMap = require('./MapHandler');
const CommandLine = {
  Commands: {
    exit: {
      call: function () {
        process.exit();
      }
    },
    quit: {
      call: function () {
        process.exit();
      }
    },
    ReloadMap: {
      call: function () {
        io.emit('Map', GameMap.get('Start'));
      }
    }
  },
  Exists: function (Command) {
    return this.Commands[Command];
  },
  Execute: function (Command) {
    this.Commands[Command].call();
  }
};

const stdin = process.openStdin();

stdin.addListener("data", function(d) {
  if(CommandLine.Exists(d.toString().trim())) {
    CommandLine.Execute(d.toString().trim());
  }
});

const app = express();

const log = {
  blue: (d) => console.log(chalk.blue(d)),
  red: (d) => console.log(chalk.red(d)),
  green: (d) => console.log(chalk.green(d)),
  white: (d) => console.log(chalk.white(d)),
  grey: (d) => console.log(chalk.grey(d))
}

app.listen(config.express.port, () => log.blue(' :: Socket :: Listen on port ' + config.socket.port));


// Server Files

app.get('/', (req, res) => {
  log.blue(' :: Express :: Served /index.html');
  res.sendFile(__dirname + '/index.html')
});

app.get('/client.core.js', (req, res) => {
  log.blue(' :: Express :: Served /client.core.js');
  res.sendFile(__dirname + '/client.core.js')
});

app.get('/client.events.js', (req, res) => {
  log.blue(' :: Express :: Served /client.events.js');
  res.sendFile(__dirname + '/client.events.js')
});

app.get('/game.css', (req, res) => {
  log.blue(' :: Express :: Served /game.css');
  res.sendFile(__dirname + '/game.css')
});

app.get('/Assets/*', (req, res) => {
  log.blue(' :: Express :: Served ' + req.url);
  res.sendFile(__dirname + '/' + req.url);
});

const SocketMap = new Map();
const ClientList = [];
const ClientMap = new Map();

/*

{

  id
  n

}

*/

io.on('connection', (client) => {
  log.white(' :: Game :: Player Connected');

  let ClientID = UUID();
  let newClient = {Nickname: '', x: Random(50, 500), y: Random(50, 500), viewport: {minx: 0, maxx: 500, miny: 0, maxy: 500}};

  ClientList.push(ClientID);

  SocketMap.set(ClientID, client);
  ClientMap.set(ClientID, newClient);

  let Client = ClientMap.get(ClientID);


  client.emit('Connected', []);

  client.emit('Map', GameMap.get('Start'));

  client.on('User-Set-Nickname', (N) => {
    Client.Nickname = N;
    log.blue(N);
  });

  client.on('Ping', (D) => {
    client.emit('Ping', D);
  });

  io.emit('User-Connect', [ClientID, newClient]);
});
