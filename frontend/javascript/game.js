goog.provide('game.Main');

goog.require('game.Backdrop');
goog.require('game.Board');
goog.require('game.Player');
goog.require('game.core.Root');
goog.require('game.core.Window');



/**
 * The game.
 *
 * @constructor
 */
game.Main = function() {
  /** @private {!game.core.Window} */
  this.window_ = new game.core.Window();
  /** @private {!game.core.Root} */
  this.viewport_ = new game.core.Root();
  /** @private {!game.Player} */
  this.player_ = new game.Player();
  /** @private {!game.core.Camera} */
  this.camera_ = new game.core.Camera();
  /** @private {!game.Board} */
  this.board_ = new game.Board();
  /** @private {!game.Board} */
  this.backDrop_ = new game.Backdrop();

  this.attach();
  this.init();
  this.update();
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {

  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME,
      function() {
        this.viewport_.setRect(
            0, 0, '50%', '50%',
            null, null, this.window_,
            800, 600, 400, 300);
      }.bind(this), true);

  this.board_.setRect(0, 0, 1000, 700);
  this.backDrop_.setRect(0, 0, 1000, 700);
  this.player_.setRect(500, 500, 40, 50);
  this.camera_.watch(this.player_);
  this.camera_.addLayer(this.backDrop_, 0.3);
};


/**
 * Attaches elements to the DOM.
 * TODO: replace with a global singleton entities collection and iterate with
 * isAttached or something and check on update maybe?
 */
game.Main.prototype.attach = function() {
  this.viewport_.attach(document.body);
  this.backDrop_.attach(this.viewport_);
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
