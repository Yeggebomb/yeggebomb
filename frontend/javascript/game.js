goog.provide('game.Main');

goog.require('game.Player');
goog.require('game.Point');
goog.require('game.constants.Elements');



/**
 * The game.
 *
 * @constructor
 */
game.Main = function() {
  /** @private {!game.Player} */
  this.player_ = new game.Player();
  /** @private {!game.Camera} */
  this.camera_ = new game.Camera();
  /** @private {!Element} The parent game board */
  this.gameBoard_ = game.constants.Elements.GAME_BOARD_EL;
  this.init();
  this.update();
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.player_.setSize(new game.Size(100, 100));
  this.player_.setPosition(new game.Point(100, 100));
  this.player_.setBackground('white');
  this.player_.attach(this.gameBoard_);
};


/**
 * Main update loop.
 */
game.Main.prototype.update = function() {
  window.requestAnimationFrame(this.update.bind(this));
  this.player_.update();
  this.camera_.update();
};


// Start
var main = new game.Main();
