'use strict'

const config = require('./config');
const io = require('socket.io')(config.socket.port);
const express = require('express');
const chalk = require('chalk');
const UUID = require('./UUID');

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

app.get('/game.core.js', (req, res) => {
  log.blue(' :: Express :: Served /game.core.js');
  res.sendFile(__dirname + '/game.core.js')
});

app.get('/client.js', (req, res) => {
  log.blue(' :: Express :: Served /client.js');
  res.sendFile(__dirname + '/client.js')
});

app.get('/game.css', (req, res) => {
  log.blue(' :: Express :: Served /game.css');
  res.sendFile(__dirname + '/game.css')
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
  let newClient = {Nickname: '', x: 0, y: 0, viewport: {minx: 0, maxx: 500, miny: 0, maxy: 500}};

  ClientList.push(ClientID);

  SocketMap.set(ClientID, client);
  ClientMap.set(ClientID, newClient);


  client.emit('Connected');

  client.on('User-Set-Nickname', () => {

  });

  client.on('Ping', (D) => {
    client.emit('Ping', D);
  });

  io.emit('User-Connect', {})
});
