goog.provide('game.Main');

goog.require('game.Board');
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
  /** @private {!game.Board} */
  this.board_ = new game.Board();

  this.attach();
  this.init();
  this.update();
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.board_.setRect(0, 0, 1000, 1000);
  this.player_.setRect(100, 100, 100, 100);

  this.camera_.watch(this.player_);
};


/**
 * Attaches elements to the DOM.
 * TODO: replace with a global singleton entities collection and iterate with
 * isAttached or something and check on update maybe?
 */
game.Main.prototype.attach = function() {
  this.board_.attach(game.constants.Elements.VIEWPORT_EL);
  this.player_.attach(this.board_);
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
