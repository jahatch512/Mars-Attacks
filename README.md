#Mars Attacks

Mars Attacks is a JavaScript game built using the HTML5 Canvas. It is a first person shooter game with inspiration from Space Invaders and Raiden Jet Fighter.

##Features
 * Fluid gameplay achieved through the requestAnimationFrame function.
 * Uses JavaScript methods like getElementById to add key listeners to DOM elements.
* Modal appears with instructions when the page loads



## Sample Code
```JavaScript

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

```
