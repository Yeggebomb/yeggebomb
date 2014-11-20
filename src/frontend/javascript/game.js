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
  /** @private {game.Main.State} */
  this.gameState_ = null;
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
  /** @private {number} */
  this.globalTick_ = 0;

  /** @private {FPSMeter}*/
  this.meter_ = new FPSMeter({
    theme: 'light',
    left: 'auto',
    right: '5px',
    graph: true
  });

  this.attach();
  this.init();
  this.switchGameStateTo(game.Main.State.PENDING);
};


/** @enum {number} */
game.Main.State = {
  PENDING: -1,
  RECORDING: 0,
  SYNCING: 1,
  WAITING: 2,
  PLAYBACK: 3
};


/**
 * The framerate our game runs off on.
 *
 * @type {number}
 */
game.Main.FPS = 60;


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
  this.firebaseEvents_.on(
      'value',
      this.onRetrieveEvents.bind(this),
      this.onRetrieveEventsFailed.bind(this));

  this.userInterface_.loginCallback = this.loginCallback.bind(this);
  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME,
      function() {
        this.viewport_.setRectangle('0%', '0%', '100%', '100%',
            this.window_, 1920, 802, 800, 461);
      }.bind(this), true);

  this.rotatedPlatform_.setPolygon(new game.core.math.Vector(160, 120), [
    new game.core.math.Vector(0, 0),
    new game.core.math.Vector(60, 0),
    new game.core.math.Vector(100, 40),
    new game.core.math.Vector(60, 80),
    new game.core.math.Vector(0, 80)
  ]);

  this.platform_.setRectangle(0, 792, 1920, 10);
  this.platform_.el.classList.add('ground');
  this.board_.setRectangle(0, 0, 1920, 802);
  this.backDrop_.setRectangle(0, 0, 1920, 802);
  this.player_.setRectangle(0, 0, 85, 59);
  this.camera_.watch(this.player_);
  this.camera_.addLayer(this.backDrop_, 0.3);

  this.platform_.registerCollider('platform', game.Platform);
  this.player_.registerCollidesWith(
      'platform', this.player_.collisionWithPlatform.bind(this.player_));
};


/**
 * Initializes values to start game.
 */
game.Main.prototype.startGame = function() {
  this.switchGameStateTo(game.Main.State.RECORDING);
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
 * Switches the game state to the given state.
 *
 * @param {!game.Main.State} nextGameState
 */
game.Main.prototype.switchGameStateTo = function(nextGameState) {
  this.gameState_ = nextGameState;
  game.core.helper.removeClassPrefix(this.viewport_.el, 'state-');
  switch (this.gameState_) {
    case game.Main.State.PENDING:
      this.viewport_.el.classList.add('state-pending');
      this.stateChangeToPending();
      break;
    case game.Main.State.RECORDING:
      this.viewport_.el.classList.add('state-recording');
      this.stateChangeToRecording();
      break;
    case game.Main.State.SYNCING:
      this.viewport_.el.classList.add('state-syncing');
      this.stateChangeToSyncing();
      break;
    case game.Main.State.PLAYBACK:
      this.viewport_.el.classList.add('state-playback');
      this.stateChangeToPlayback();
      break;
    default:
      console.error('unrecognized state');
      return;
  }
};


/**
 * Main physics loop.
 */
game.Main.prototype.physicsLoop = function() {
  var currTime = +new Date() / 1000;
  if (!this.lastTimeRan_) this.lastTimeRan_ = +new Date() / 1000;
  if (!this.physicsRemainderTime_) this.physicsRemainderTime_ = 0;

  var dt = (currTime - this.lastTimeRan_) + this.physicsRemainderTime_;
  var dtstep = 1 / game.Main.FPS;
  var steps = Math.floor(dt / dtstep);

  this.physicsRemainderTime_ = dt - dtstep * steps;
  this.camera_.update();
  // Update loop
  for (var step = 0; step < steps; step++) {
    this.gameStateAdvancer(this.globalTick_);

    game.core.Entity.forEach(function(entity) {
      if (entity.isActive()) {
        entity.update(dtstep, this.globalTick_);
        entity.resolveCollisions(dtstep);
      }
    }.bind(this));

    this.globalTick_++;
  }
  this.lastTimeRan_ = currTime;

  setTimeout(this.physicsLoop.bind(this), 0);
};


/**
 * This is what keeps track of what tick we are on and if we should be
 * advancing.
 *1
 * @param {number} currentTick
 */
game.Main.prototype.gameStateAdvancer = function(currentTick) {
  if (currentTick == (game.Main.FPS * game.constants.PLAY_TIME) / 1000) {
    if (this.gameState_ == game.Main.State.RECORDING) {
      this.switchGameStateTo(game.Main.State.SYNCING);
      return;
    }
    if (this.gameState_ == game.Main.State.PLAYBACK) {
      this.switchGameStateTo(game.Main.State.RECORDING);
      return;
    }
  }
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
  this.meter_.tick();
};


/**
 * The state is now pending.
 */
game.Main.prototype.stateChangeToPending = function() {};


/**
 * The state is now recording.
 */
game.Main.prototype.stateChangeToRecording = function() {
  this.globalTick_ = 0;
  this.userInterface_.drawCountDown(
      'Recording:', +new Date() + game.constants.PLAY_TIME);

  this.keyHandler_.startRecording();
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.setVelocity(new game.core.math.Vector());
      entity.setAcceleration(new game.core.math.Vector());
      entity.setMass(game.Player.DEFAULT_MASS);
      entity.isPlayingBack = false;

      var endPosition = entity.endPosition;
      if (endPosition) {
        console.log('error of this much:',
            entity.getPosition().distanceTo(endPosition));
      }
      entity.ignoreKeys(false);
      entity.initialPosition = entity.getPosition().clone();
    }
  }.bind(this));
};


/**
 * The state is now SYNCING.
 */
game.Main.prototype.stateChangeToSyncing = function() {
  this.userInterface_.updateTimerText('Syncing data');

  this.keyHandler_.stopRecording();
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.endPosition = entity.getPosition().clone();
      entity.ignoreKeys(true);
      entity.setVelocity(new game.core.math.Vector());
      entity.setAcceleration(new game.core.math.Vector());
      entity.setMass(0);

      // Write to firebase.
      this.firebaseEvents_.child(entity.user.userId).push(
          game.core.KeyHandler.records,
          function(error) {
            if (error) {
              console.error(error);
              alert('FATAL: ', error);
            } else {
              this.switchGameStateTo(game.Main.State.PLAYBACK);
            }
          }.bind(this));
    }
  }.bind(this));
};


/**
 * The state is now playback.
 */
game.Main.prototype.stateChangeToPlayback = function() {
  this.userInterface_.drawCountDown(
      'Playback:', +new Date() + game.constants.PLAY_TIME);
  this.globalTick_ = 0;  // Reset for playback!
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.setPosition(entity.initialPosition.x, entity.initialPosition.y);
      entity.setMass(game.Player.DEFAULT_MASS);
      entity.isPlayingBack = true;
    }
  }.bind(this));
};


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
 * Retreives data from firebase.
 *
 * @param {Object} snapshot
 */
game.Main.prototype.onRetrieveEvents = function(snapshot) {};


/**
 * Failed Retreives data from firebase.
 *
 * @param {Object} snapshot
 */
game.Main.prototype.onRetrieveEventsFailed = function(snapshot) {
  console.error('onRetrieveEventsFailed', snapshot);
};


// Start
var main = new game.Main();
