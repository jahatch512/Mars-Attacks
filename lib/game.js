var Ufo = require("./ufo");
var Bullet = require("./bullet");
var Ship = require("./ship");

var Game = function () {
  this.ufos = [];
  this.bullets = [];
  this.ships = [];

  this.addUfos();
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_UFOS = 7;

Game.prototype.add = function (object) {
  if (object.type === "Ufo") {
    this.ufos.push(object);
  } else if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    this.ships.push(object);
  } else {
    throw "error adding";
  }
};

Game.prototype.addUfos = function () {
  for (var i = 0; i < Game.NUM_UFOS; i++) {
    this.add(new Ufo({ game: this }));
  }
};

Game.prototype.addShip = function () {
  var ship = new Ship({
    pos: [500, 525],
    game: this
  });

  this.add(ship);

  return ship;
};

Game.prototype.allObjects = function () {
  return [].concat(this.ships, this.ufos, this.bullets);
};

Game.prototype.checkCollisions = function () {
  var game = this;

  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1 == obj2) {
        // don't allow self-collision
        return;
      }

      if (obj1.isCollidedWith(obj2)) {
        obj1.collideWith(obj2);
      }
    });
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  // ctx.fillStyle = Game.BG_COLOR;
  // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
  ctx.font = "28px Helvetica Neue";
  ctx.fillStyle = "#39FF14";
  ctx.fillText("Score: ", 780, 40);
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.remove = function (object) {
  if (object instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object instanceof Ufo) {
    var idx = this.ufos.indexOf(object);
    this.ufos[idx] = new Ufo({ game: this });
  } else if (object instanceof Ship) {
    this.ships.splice(this.ships.indexOf(object), 1);
  } else {
    throw "error removing object";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.wrap = function (pos) {
  return [
    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
  ];

  function wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Game;
