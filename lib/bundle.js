/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(7);
	
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	
	  var ctx = canvasEl.getContext("2d");
	
	  var modal = document.getElementById('modal-box');
	  var span = document.getElementsByClassName("close")[0];
	
	
	  span.onclick = function() {
	      modal.style.display = "none";
	      var game = new Game();
	      var gameView = new GameView(game, ctx);
	      gameView.start();
	  };
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ufo = __webpack_require__(2);
	var Bullet = __webpack_require__(6);
	var Ship = __webpack_require__(5);
	
	var Game = function () {
	  this.ufos = [];
	  this.bullets = [];
	  this.ships = [];
	  this.score = 0;
	  this.lives = 3;
	  this.lifeLost = false;
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_UFOS = 10;
	
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
	  this.ufos = [];
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
	  if (this.lives > 0) {
	
	    this.allObjects().forEach(function (object) {
	      object.draw(ctx);
	    });
	
	    if (this.lifeLost) {
	      ctx.fillStyle = "red";
	      ctx.fillText("You have " + this.lives + " lives left. Defend the Galaxy!", 280, 480);
	    }
	
	    ctx.font = "28px Helvetica Neue";
	    ctx.fillStyle = "#39FF14";
	    ctx.fillText("Score: " + this.score, 800, 40);
	    ctx.fillText("Lives: " + this.lives, 800, 70);
	  } else {
	    ctx.fillText("GAME OVER. FINAL SCORE: " + this.score, 270,450);
	  }
	};
	
	Game.prototype.isOutOfBounds = function (pos) {
	  return (pos[0] < 0) || (pos[1] < -280) ||
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
	
	Game.prototype.removeAll = function (){
	  this.bullets = [];
	  this.ufos = [];
	};
	
	Game.prototype.step = function (delta) {
	  this.moveObjects(delta);
	  this.checkCollisions();
	};
	
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Ship = __webpack_require__(5);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = Math.PI * (Math.random() * (0.4) + 0.3);
	    return Util.scale([Math.cos(deg), Math.sin(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, l) {
	    return [vec[0] * l, vec[1] * l];
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass };
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	var Util = __webpack_require__(3);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	var ufoIcon = new Image();
	ufoIcon.src = './assets/images/blueAlien.png';
	
	var missile = new Image();
	missile.src = './assets/images/missile.png';
	
	MovingObject.prototype.collideWith = function (otherObject) {
	
	
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  if (this.type === "Ufo") {
	    ctx.drawImage(ufoIcon, this.pos[0] - 20, this.pos[1] - 25, 50, 50);
	  } else {
	    ctx.drawImage(missile, this.pos[0] - 20, this.pos[1] - 25, 25, 25);
	  }
	
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	MovingObject.prototype.isWrappable = false;
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.remove();
	    }
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	var Bullet = __webpack_require__(6);
	
	
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
	      }.bind(this), 200);
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var UFO = __webpack_require__(2);
	
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.ship = this.game.addShip();
	};
	
	GameView.DIM_X = 1000;
	GameView.DIM_Y = 600;
	
	GameView.MOVES = {
	  "a": [-1,  0],
	  "d": [ 1,  0],
	};
	
	
	GameView.prototype.start = function () {
	
	  document.addEventListener('keydown', function(event){
	    this.ship.keyDown(event);
	  }.bind(this));
	
	  document.addEventListener('keyup', function(event){
	    this.ship.keyUp(event);
	  }.bind(this));
	
	  setTimeout(function(){
	    this.ctx.clearRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
	    this.game.removeAll();
	    this.game.addUfos();
	    this.lastTime = 0;
	    //start the animation
	    requestAnimationFrame(this.animate.bind(this));
	  }.bind(this), 500);
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map