var MovingObject = require("./movingObject");
var Util = require("./util");
var Bullet = require("./bullet");


var Ship = function (options) {
  this.pos = options.pos;
  this.radius = Ship.RADIUS;
  this.vel = options.vel || [0, 0];
  this.game = options.game;
  this.aPressed = false;
  this.dPressed = false;
  this.justFired = false;
};

var rocketShip = new Image();
rocketShip.src = './assets/images/dopeShip.png';

Ship.prototype.draw = function (ctx) {
  ctx.drawImage(rocketShip, this.pos[0] - 20, this.pos[1] - 25, 60, 60);
};

Ship.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Ufo") {
    this.game.lives -= 1;
    this.game.lifeLost = true;
    this.relocate();
    this.game.removeAll();

    setTimeout(function(){
      this.game.lifeLost = false;
      this.game.addUfos();
    }.bind(this), 1500);
  }
};

Ship.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
};

Ship.prototype.isWrappable = false;

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Ship.prototype.move = function (timeDelta) {
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the Ship should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second

  var offsetX = this.vel[0];
  var offsetY = this.vel[1];

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  if (this.game.isOutOfBounds(this.pos)) {
    this.vel = [0, 0];
  }
};

Ship.prototype.remove = function () {
  this.game.remove(this);
};


Ship.prototype.type = "Ship";

Ship.RADIUS = 15;

// Util.inherits(Ship, MovingObject);

Ship.prototype.fireBullet = function () {
  var norm = Util.norm(this.vel);

  var bullet = new Bullet({
    pos: [this.pos[0]+15, this.pos[1]],
    vel: [0,-5],
    color: this.color,
    game: this.game
  });

  this.game.add(bullet);
};

Ship.prototype.keyDown = function (event) {
  if (event.keyCode === 65){
    this.aPressed = true;
    this.vel[0] = -5;
  } else if (event.keyCode === 68){
    this.dPressed = true;
    this.vel[0] = 5;
  } else if (event.keyCode === 32){
    if (this.justFired === true) {
      return;
    } else {
      this.fireBullet();
      this.justFired = true;
      setTimeout(function(){
        this.justFired = false;
      }.bind(this), 500);
    }
  }
};

Ship.prototype.keyUp = function () {
  if (event.keyCode === 65){
    this.vel[0] = this.dPressed ? 5 : 0;
    this.aPressed = false;

  } else if (event.keyCode === 68){
    this.vel[0] = (this.aPressed) ? -5 : 0;
    this.dPressed = false;
  }
};

Ship.prototype.relocate = function () {
  this.pos = [500, 525];
  this.vel = [0, 0];
};

Ship.prototype.type = "Ship";

module.exports = Ship;
