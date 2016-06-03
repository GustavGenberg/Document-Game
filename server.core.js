const UUID = require('./UUID');

var Server = function () {
  this.Rooms = {};
  this.Players = {};
  this.Sockets = {};

}
Server.prototype.CreateRoom = function () {
  this.Rooms[UUID()] = {};
};

var Player = function () {
  this.id = UUID();
  this.nickname = '';
  this.pos = {

  }
}
