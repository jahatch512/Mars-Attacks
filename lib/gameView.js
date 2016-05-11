var GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.ship = this.game.addShip();
};

GameView.MOVES = {
  "a": [-1,  0],
  "d": [ 1,  0],
};


GameView.prototype.start = function () {
  key("space", function () { this.ship.fireBullet() }.bind(this));

  document.addEventListener('keydown', function(event){
    this.ship.keyDown(event);
  }.bind(this));

  document.addEventListener('keyup', function(event){
    this.ship.keyUp(event);
  }.bind(this));

  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
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
