goog.provide('game.Main');

goog.require('game.Backdrop');
goog.require('game.Board');
goog.require('game.Platform');
goog.require('game.Player');
goog.require('game.core.Root');
goog.require('game.core.Window');
goog.require('game.core.math.Vector');



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
  /** @private {!game.Main.State} */
  this.gameState_ = game.Main.State.RUNNING;
  /** @private {!game.Platform} */
  this.platform_ = new game.Platform();
  /** @private {number} */
  this.gameTime_ = +new Date();

  this.attach();
  this.init();
  this.update();
};


/** @enum {number} */
game.Main.State = {
  RUNNING: 0,
  PAUSED: 1
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME,
      function() {
        this.viewport_.setRect(
            0, 0, '50%', '50%', this.window_, 800, 600, 400, 300);
      }.bind(this), true);

  this.platform_.setShape(new game.core.math.Vector(0, 600), 1000, 100);
  this.board_.setRect(0, 0, 1000, 700);
  this.backDrop_.setRect(0, 0, 1000, 700);
  this.player_.setShape(new game.core.math.Vector(), 40, 50);
  this.camera_.watch(this.player_);
  this.camera_.addLayer(this.backDrop_, 0.3);

  this.platform_.registerCollider('platform', game.Platform);
  this.player_.registerCollidesWith(
      'platform', this.player_.collisionWithPlatform.bind(this.player_));
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
  this.platform_.attach(this.board_);
};


/**
 * Main update loop.
 */
game.Main.prototype.update = function() {
  if (this.gameState_ == game.Main.State.PAUSED) return;
  window.requestAnimationFrame(this.update.bind(this));
  var deltaTime = +new Date() - this.gameTime_;
  this.gameTime_ = +new Date();
  this.player_.update(deltaTime);
  this.camera_.update(deltaTime);
};


// Start
var main = new game.Main();
