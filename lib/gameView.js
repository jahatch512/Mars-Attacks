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
  if (!this.lastTime) {
    this.lastTime = time;
  }

  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
