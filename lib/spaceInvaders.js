var Game = require("./game");
var GameView = require("./gameView");


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
