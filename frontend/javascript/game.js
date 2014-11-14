goog.provide('game.Main');

goog.require('game.Board');
goog.require('game.Player');
goog.require('game.Viewport');
goog.require('game.Window');
goog.require('game.constants.Elements');



/**
 * The game.
 *
 * @constructor
 */
game.Main = function() {
  /** @private {!game.Window} */
  this.window_ = new game.Window();
  /** @private {!game.Viewport} */
  this.viewport_ = new game.Viewport();
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

  this.window_.registerResizeCallback(function() {
    this.viewport_.setRect(
        '25%', '25%', '50%', '50%',
        null, null, this.window_,
        800, 600, 400, 300);
  }.bind(this), true);

  this.board_.setRect(0, 0, 1000, 1000);
  this.player_.setRect(0, 0, 50, 50);
  this.camera_.watch(this.player_);
};


/**
 * Attaches elements to the DOM.
 * TODO: replace with a global singleton entities collection and iterate with
 * isAttached or something and check on update maybe?
 */
game.Main.prototype.attach = function() {
  this.viewport_.attach(document.body);
  this.board_.attach(this.viewport_);
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
