goog.provide('game.Main');

goog.require('game.Backdrop');
goog.require('game.Board');
goog.require('game.Platform');
goog.require('game.Player');
goog.require('game.UserInterface');
goog.require('game.constants');
goog.require('game.core.Root');
goog.require('game.core.Window');
goog.require('game.core.helper');
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
  /** @private {!game.Platform} */
  this.platform_ = new game.Platform();
  /** @private {!game.Platform} */
  this.rotatedPlatform_ = new game.Platform();
  /** @private {number} */
  this.gameTime_ = null;
  /** @private {!game.Main.State} */
  this.gameState_ = game.Main.State.PENDING;
  /** @private {!game.UserInterface} */
  this.userInterface_ = new game.UserInterface();
  /** @private {!game.core.KeyHandler} */
  this.keyHandler_ = new game.core.KeyHandler();
  /** @private {!Firebase} */
  this.firebase_ = new Firebase(game.constants.FIREBASE_URL);
  /** @private {!Firebase} */
  this.firebaseEvents_ = this.firebase_.child('events');
  /** @private {Object} */
  this.primaryUser_ = null;

  this.attach();
  this.init();
};


/** @enum {number} */
game.Main.State = {
  PENDING: -1,
  RECORDING: 0,
  SENDING: 1,
  WAITING: 2,
  PLAYBACK: 3
};


/**
 * List of currently playing.
 *
 * @type {Array}
 */
game.Main.Users = [];


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.userInterface_.loginCallback = this.loginCallback.bind(this);
  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME,
      function() {
        this.viewport_.setRectangle('25%', '25%', '50%', '50%',
            this.window_, 1024, 461, 800, 461);
      }.bind(this), true);

  this.rotatedPlatform_.setPolygon(new game.core.math.Vector(160, 120), [
    new game.core.math.Vector(0, 0),
    new game.core.math.Vector(60, 0),
    new game.core.math.Vector(100, 40),
    new game.core.math.Vector(60, 80),
    new game.core.math.Vector(0, 80)
  ]);

  this.platform_.setRectangle(0, 551, 1600, 10);
  this.platform_.el.classList.add('ground');
  this.board_.setRectangle(0, 0, 1600, 561);
  this.backDrop_.setRectangle(0, 0, 1600, 561);
  this.player_.setRectangle(0, 0, 85, 59);
  this.camera_.watch(this.player_);
  this.camera_.addLayer(this.backDrop_, 0.3);

  this.platform_.registerCollider('platform', game.Platform);
  this.player_.registerCollidesWith(
      'platform', this.player_.collisionWithPlatform.bind(this.player_));

  // Kick off the time based loops.
  this.gameStateSwitcher();

};


/**
 * Initializes values to start game.
 */
game.Main.prototype.startGame = function() {
  this.gameState_ = game.Main.State.PLAYBACK;
  // This has a timeout, calling this twice could be weird.
  this.gameStateSwitcher();

  this.physicsLoop();
  this.renderLoop();
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
  this.userInterface_.attach(this.viewport_);
};


/**
 * Game state switcher.
 */
game.Main.prototype.gameStateSwitcher = function() {
  var label = '';
  var remainingTime = 0;
  game.core.helper.removeClassPrefix(this.viewport_.el, 'state-');
  switch (this.gameState_) {
    case game.Main.State.PENDING:
      this.gameState_ = game.Main.State.PENDING;
      this.viewport_.el.classList.add('state-pending');
      // this.stateChangeToPending();
      return;
      break;
    case game.Main.State.RECORDING:
      this.gameState_ = game.Main.State.SENDING;
      this.viewport_.el.classList.add('state-sending');
      remainingTime = game.constants.WAIT_TIME;
      this.stateChangeToSending();
      label = 'Sending:';
      break;
    case game.Main.State.SENDING:
      this.gameState_ = game.Main.State.WAITING;
      this.viewport_.el.classList.add('state-waiting');
      remainingTime = game.constants.WAIT_TIME;
      this.stateChangeToWaiting();
      label = 'Waiting:';
      break;
    case game.Main.State.WAITING:
      this.gameState_ = game.Main.State.PLAYBACK;
      this.viewport_.el.classList.add('state-playback');
      remainingTime = game.constants.PLAY_TIME;
      this.stateChangeToPlayback();
      label = 'Play Back:';
      break;
    case game.Main.State.PLAYBACK:
      this.gameState_ = game.Main.State.RECORDING;
      this.viewport_.el.classList.add('state-recording');
      remainingTime = game.constants.PLAY_TIME;
      this.stateChangeToRecording();
      label = 'Recording:';
      break;
    default:
      console.error('unrecognized state');
  }
  this.userInterface_.drawCountDown(label, +new Date() + remainingTime);

  // remainingTime is relavant to the server time, not implemented
  setTimeout(this.gameStateSwitcher.bind(this), remainingTime);
};


/**
 * Main physics loop.
 */
game.Main.prototype.physicsLoop = function() {
  var currTime = +new Date();
  if (!this.gameTime_) this.gameTime_ = +new Date();
  if (!this.physicsRemainderTime_) this.physicsRemainderTime_ = 0;
  var dt = (this.physicsRemainderTime_ + currTime - this.gameTime_) / 100;
  var dtstep = 1 / 60;  // 60 FPS

  var steps = Math.floor(dt / dtstep);
  this.physicsRemainderTime = dt - dtstep * steps;

  this.camera_.update();

  // Update loop
  for (var step = 0; step < steps; step++) {
    _.each(game.core.Entity.All, function(entity) {
      entity.update(dtstep);
      entity.resolveCollisions(dtstep);
    });
  }
  this.gameTime_ = +new Date();
  setTimeout(this.physicsLoop.bind(this), 0);
};


/**
 * Main render loop
 */
game.Main.prototype.renderLoop = function() {
  window.requestAnimationFrame(this.renderLoop.bind(this));
  // Draw loop
  _.each(game.core.Entity.All, function(entity) {
    if (entity.isDirty) {
      entity.draw();
    }
  });
};


/**
 * The state is now recording.
 */
game.Main.prototype.stateChangeToRecording = function() {
  this.keyHandler_.startRecording();
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.setVelocity(new game.core.math.Vector());
      entity.setAcceleration(new game.core.math.Vector());
      entity.setMass(game.Player.DEFAULT_MASS);

      var endPosition = entity.endPosition;
      if (endPosition) {
        console.log('error of this much',
            entity.getPosition().distanceTo(endPosition));
      }
      entity.ignoreKeys(false);
      entity.initialPosition = entity.getPosition().clone();
    }
  }.bind(this));
};


/**
 * The state is now sending.
 */
game.Main.prototype.stateChangeToSending = function() {
  this.keyHandler_.stopRecording();
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.endPosition = entity.getPosition().clone();
      entity.ignoreKeys(true);
      entity.setVelocity(new game.core.math.Vector());
      entity.setAcceleration(new game.core.math.Vector());
      entity.setMass(0);

      // Write to firebase.
      this.firebaseEvents_.child(entity.user.userId)
          .push(game.core.KeyHandler.records);
    }
  }.bind(this));
};


/**
 * The state is now waiting.
 */
game.Main.prototype.stateChangeToWaiting = function() {};


/**
 * Login
 */
game.Main.prototype.loginCallback = function() {
  this.firebase_.authWithOAuthPopup('google', function(error, authData) {
    if (error) {
      console.warn(error);
      return;
    }
    this.primaryUser_ = {
      userId: authData.uid,
      userToken: authData.token,
      userName: authData.google.displayName
    };
    // Eventually we will need an add player function.
    this.player_.user = this.primaryUser_;
    game.Main.Users.push(this.primaryUser_);
    this.startGame();
  }.bind(this));
};


/**
 * The state is now playback.
 */
game.Main.prototype.stateChangeToPlayback = function() {
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.setPosition(entity.initialPosition.x, entity.initialPosition.y);
      entity.setMass(game.Player.DEFAULT_MASS);
      entity.playRecordedKeys();
    }
  }.bind(this));
};

// Start
var main = new game.Main();
