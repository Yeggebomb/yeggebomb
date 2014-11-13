goog.provide('game.Main');

goog.require('game.Player');
goog.require('game.Point');



/**
 * The game.
 *
 * @constructor
 */
game.Main = function() {
  /** @type {!game.Player} */
  this.player = new game.Player();
  /** @type {!Element} The parent game board */
  this.gameBoard = document.getElementById('board');
  this.init();
  this.update();
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.player.setSize(new game.Size(100, 100));
  this.player.setPosition(new game.Point(100, 100));
  this.player.setBackground('white');
  this.player.attach(this.gameBoard);
};


/**
 * Main update loop.
 */
game.Main.prototype.update = function() {
  window.requestAnimationFrame(this.update.bind(this));
  this.player.update();
};


// Start
var main = new game.Main();
