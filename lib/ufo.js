var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");

var DEFAULTS = {
	COLOR: "red",
	RADIUS: 25,
	SPEED: 4
};


var Ufo = function (options = {}) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || [900 * Math.random(), -250];
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};


Ufo.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};


Util.inherits(Ufo, MovingObject);

Ufo.prototype.type = "Ufo";

module.exports = Ufo;
