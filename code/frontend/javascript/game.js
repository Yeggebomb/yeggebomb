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
  /** @private {!game.Platform} */
  this.rotatedPlatform_ = new game.Platform();
  /** @private {!game.Platform} */
  this.sphereObject_ = new game.Circle();
  /** @private {number} */
  this.gameTime_ = +new Date();
  /** @private {number} */
  this.loopTime_ = game.constants.PlayTime;

  this.attach();
  this.init();
  this.update();
};


/** @enum {number} */
game.Main.State = {
  RUNNING: 0,
  SENDING: 1,
  WAITING: 2,
  PLAYBACK: 3
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME,
      function() {
        this.viewport_.setRectangle('25%', '25%', '50%', '50%',
            this.window_, 800, 600, 400, 300);
      }.bind(this), true);

  this.rotatedPlatform_.setPolygon(new game.core.math.Vector(160, 120), [
    new game.core.math.Vector(0, 0),
    new game.core.math.Vector(60, 0),
    new game.core.math.Vector(100, 40),
    new game.core.math.Vector(60, 80),
    new game.core.math.Vector(0, 80)
  ]);

  // this.sphereObject_.setCircle(new game.core.math.Vector(200, 0), 20);

  this.platform_.setRectangle(0, 600, 1000, 100);
  this.platform_.el.classList.add('ground');
  this.board_.setRectangle(0, 0, 1000, 700);
  this.backDrop_.setRectangle(0, 0, 1000, 700);

  this.player_.getVelocity().x = 5;

  this.player_.setRectangle(0, 0, 40, 50);
  this.player_.setMass(5);
  this.camera_.watch(this.player_);
  this.camera_.addLayer(this.backDrop_, 0.3);

  this.platform_.registerCollider('platform', game.Platform);
  this.player_.registerCollidesWith(
      'platform', this.player_.collisionWithPlatform.bind(this.player_));
  // this.sphereObject_.registerCollidesWith(
  //     'platform', this.sphereObject_.collisionWithPlatform.bind(
  //         this.sphereObject_));
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
  this.rotatedPlatform_.attach(this.board_);
  // this.sphereObject_.attach(this.board_);
};


/**
 * Main update loop.
 */
game.Main.prototype.update = function() {
  var currTime = +new Date();
  var deltaMs = currTime - this.gameTime_;
  this.loopTime_ = this.loopTime_ - (deltaMs / 1000);
  if (this.gameState_ == game.Main.State.RUNNING) {
    // Generate your play for this loop.
    var dt = deltaMs / 100;

    // Camera isn't an entity.
    this.camera_.update(dt);

    // Update loop
    _.each(game.core.Entity.All, function(entity) {
      entity.update(dt);
      entity.resolveCollisions(dt);
    });

    // Draw loop
    _.each(game.core.Entity.All, function(entity) {
      if (entity.isDirty) {
        entity.draw();
      }
    });

    // Decide whether to move on to next step.
    if (this.loopTime_ < 0) {
      this.loopTime_ = 1;
      this.gameState_ = game.Main.State.SENDING;
    }
  }

  if (this.gameState_ == game.Main.State.SENDING) {
    // Send information to the server.
    this.loopTime_ = game.constants.WaitTime;
    this.gameState_ = game.Main.State.WAITING;
  }

  if (this.gameState_ == game.Main.State.WAITING) {
    // Wait for info from the server.
    if (this.loopTime_ < 0) {
      this.loopTime_ = game.constants.PlayTime;
      this.gameState_ = game.Main.State.PLAYBACK;
    }
  }

  if (this.gameState_ == game.Main.State.PLAYBACK) {
    // Play back the result of the loop.
    if (this.loopTime_ < 0) {
      this.loopTime_ = game.constants.PlayTime;
      this.gameState_ = game.Main.State.RUNNING;
    }
  }
  this.gameTime_ = currTime;
  window.requestAnimationFrame(this.update.bind(this));
};


// Start
var main = new game.Main();
