
var Util = require("./util");
var MovingObject = require("./movingObject");
var UFO = require("./ufo");

var Bullet = function (options) {
  options.radius = Bullet.RADIUS;
  MovingObject.call(this, options);

};

Bullet.RADIUS = 7;
Bullet.SPEED = 30;

Util.inherits(Bullet, MovingObject);

Bullet.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Ufo") {
    this.game.score += 1;
    this.remove();
    otherObject.remove();
  }
};


Bullet.prototype.isWrappable = false;
Bullet.prototype.type = "Bullet";

module.exports = Bullet;
