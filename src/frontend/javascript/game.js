goog.provide('game.Main');

goog.require('game.Backdrop');
goog.require('game.Board');
goog.require('game.Chat');
goog.require('game.Cloud');
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
  /** @private {!game.core.Camera} */
  this.camera_ = new game.core.Camera();
  /** @private {!game.Board} */
  this.board_ = new game.Board();
  /** @private {!game.Chat} */
  this.chat_ = new game.Chat();
  /** @private {!game.Backdrop} */
  this.backDrop_ = new game.Backdrop();
  /** @private {!game.Platform} */
  this.ceiling_ = new game.Platform();
  /** @private {!game.Platform} */
  this.ground_ = new game.Platform();
  /** @private {!game.Platform} */
  this.leftwall_ = new game.Platform();
  /** @private {!game.Platform} */
  this.rightwall_ = new game.Platform();
  /** @private {!Array.<!game.Cloud>} */
  this.clouds_ = [];
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(160, 120)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(500, 200)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(230, 10)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(780, 90)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(800, 200)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(990, 100)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(1200, 210)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(1440, 500)));
  this.clouds_.push(new game.Cloud(new game.core.math.Vector(1600, 100)));
  /** @private {number} */
  this.gameTime_ = null;
  /** @private {!game.UserInterface} */
  this.userInterface_ = new game.UserInterface();
  /** @private {number} */
  this.globalTick_ = 0;

  /** @private {FPSMeter}*/
  this.meter_ = null;


  // Firebase stuff
  /** @private {!Firebase} */
  this.firebase_ = new Firebase(game.constants.FIREBASE_URL);
  /** @private {!Firebase} */
  this.firebaseUsers_ = this.firebase_.child('users');
  /** @private {!Firebase} */
  this.firebaseGames_ = this.firebase_.child('games');
  /** @private {!Firebase} */
  this.firebaseEvents_ = this.firebase_.child('events');
  /** @private {Object} */
  this.primaryUser_ = null;
  /** @private {Object} */
  this.currentGame_ = null;
  /** @private {number} */
  this.turnNumber_ = 0;
  /** @private {Object} */
  this.userList_ = {};
  /** @private {Object} */
  this.games_ = {};
  /** @private {game.Main.State} */
  this.gameState_ = null;

  this.attach();
  this.init();
  this.switchGameStateTo(game.Main.State.PENDING);
};


/** @enum {string} */
game.Main.State = {
  PENDING: 'PENDONG',
  SYNCING: 'SYNCING',

  NOT_READY: 'NOT_READY',
  READY: 'READY',
  IN_GAME_RECORDING: 'IN_GAME_RECORDING',
  IN_GAME_PLAYBACK: 'IN_GAME_PLAYBACK'
};


/**
 * The framerate our game runs off on.
 *
 * @type {number}
 */
game.Main.FPS = 60;


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  // Setup listners for firebase events.
  // /Users
  this.firebaseUsers_.on('child_changed', this.usersChangedOrAdded.bind(this));
  this.firebaseUsers_.on('child_added', this.usersChangedOrAdded.bind(this));
  this.firebaseUsers_.on('child_removed', this.usersDeleted.bind(this));
  // /Events
  this.firebaseEvents_.on(
      'child_changed', this.eventsChangedOrAdded.bind(this));
  this.firebaseEvents_.on('child_added', this.eventsChangedOrAdded.bind(this));
  // /Games
  this.firebaseGames_.on('child_changed', this.gameChanged.bind(this));
  this.firebaseGames_.on('child_added', this.gameAdded.bind(this));
  this.firebaseGames_.on('child_removed', this.gamesDeleted.bind(this));

  this.camera_.addLayer(this.backDrop_, 0.3);

  this.leftwall_.registerCollider('leftwall', game.Platform);
  this.rightwall_.registerCollider('rightwall', game.Platform);
  this.ground_.registerCollider('ground', game.Platform);
  this.ceiling_.registerCollider('ceiling', game.Platform);

  this.meter_ = new FPSMeter({
    theme: 'light',
    left: 'auto',
    right: '5px',
    graph: true
  });

  this.userInterface_.loginCallback = this.loginCallback.bind(this);
  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME,
      function() {
        this.viewport_.setRectangle('0%', '0%', '100%', '100%',
            this.window_, 1920, 802, 800, 461);
      }.bind(this), true);

  for (var i = 0; i < this.clouds_.length; i++) {
    this.clouds_[i].registerCollider('cloud', game.Cloud);
  }

  this.ceiling_.setRectangle(0, -10, 1920, 10);
  this.ceiling_.el.classList.add('ceiling');
  this.ground_.setRectangle(0, 792, 1920, 10);
  this.ground_.el.classList.add('ground');
  this.leftwall_.setRectangle(-10, 0, 10, 792);
  this.leftwall_.el.classList.add('wall');
  this.rightwall_.setRectangle(1910, 0, 10, 802);
  this.rightwall_.el.classList.add('wall');
  this.board_.setRectangle(0, 0, 1920, 802);
  this.chat_.setRectangle(0, 0, 500, 500);
  this.backDrop_.setRectangle(0, 0, 1920, 802);


  this.initialPosition = {
    x: game.core.helper.getRandomInt(85, this.board_.width - 85),
    y: game.core.helper.getRandomInt(89, this.board_.height - 89)
  };
};


/**
 * Initializes values to start game.
 */
game.Main.prototype.startGame = function() {
  this.switchGameStateTo(game.Main.State.IN_GAME_RECORDING);
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
  this.chat_.attach(this.viewport_);

  this.ground_.attach(this.board_);
  this.ceiling_.attach(this.board_);
  this.leftwall_.attach(this.board_);
  this.rightwall_.attach(this.board_);
  this.userInterface_.attach(this.viewport_);

  for (var i = 0; i < this.clouds_.length; i++) {
    console.log('attach cloud');
    this.clouds_[i].attach(this.board_);
  }
};


/**
 * Add a player
 *
 * @param {Object} userData
 * @param {boolean} isPrimaryUser
 * @return {!game.Player}
 */
game.Main.prototype.addPlayer = function(userData, isPrimaryUser) {
  var player = new game.Player(userData);
  var x, y;
  if (isPrimaryUser) {
    x = this.initialPosition.x;
    y = this.initialPosition.y;
  } else {
    x = userData.initialPosition.x;
    y = userData.initialPosition.y;
  }
  player.setPolygon(new game.core.math.Vector(x, y), [
    new game.core.math.Vector(0, 37),
    new game.core.math.Vector(0, 42),
    new game.core.math.Vector(22, 50),
    new game.core.math.Vector(32, 58),
    new game.core.math.Vector(52, 58),
    new game.core.math.Vector(63, 50),
    new game.core.math.Vector(85, 42),
    new game.core.math.Vector(85, 37),
    new game.core.math.Vector(58, 20),
    new game.core.math.Vector(58, 7),
    new game.core.math.Vector(42, 0),
    new game.core.math.Vector(32, 7),
    new game.core.math.Vector(28, 20)
  ]);
  player.setSize(85, 89);

  if (isPrimaryUser) {
    this.camera_.watch(player);
    player.isPrimaryUser = true;
    player.setKeyHandlers();
  }

  player.registerCollider('player', game.Player);

  player.registerCollidesWith(
      'leftwall', player.collisionWithPlatform.bind(player));
  player.registerCollidesWith(
      'rightwall', player.collisionWithPlatform.bind(player));
  player.registerCollidesWith(
      'ground', player.collisionWithPlatform.bind(player));
  player.registerCollidesWith(
      'ceiling', player.collisionWithPlatform.bind(player));
  player.registerCollidesWith(
      'cloud', player.collisionWithPlatform.bind(player));

  player.attach(this.board_);
  return player;
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
    case game.Main.State.IN_GAME_RECORDING:
      this.viewport_.el.classList.add('state-recording');
      this.stateChangeToRecording();
      break;
    case game.Main.State.SYNCING:
      this.viewport_.el.classList.add('state-syncing');
      this.stateChangeToSyncing();
      break;
    case game.Main.State.IN_GAME_PLAYBACK:
      this.viewport_.el.classList.add('state-playback');
      this.stateChangeToPlayback();
      break;
    case game.Main.State.NOT_READY:
      this.viewport_.el.classList.add('state-not-ready');
      this.stateChangeToNotReady();
      break;
    case game.Main.State.READY:
      this.viewport_.el.classList.add('state-ready');
      this.stateChangeToReady();
      break;
    default:
      console.error('Cannot switch to unrecognized game state:', nextGameState);
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
    this.inGameStateAdvancer(this.globalTick_);

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
game.Main.prototype.inGameStateAdvancer = function(currentTick) {
  if (currentTick == (game.Main.FPS * game.constants.PLAY_TIME) / 1000) {
    if (this.gameState_ == game.Main.State.IN_GAME_RECORDING) {
      this.switchGameStateTo(game.Main.State.SYNCING);
      return;
    }
    if (this.gameState_ == game.Main.State.IN_GAME_PLAYBACK) {
      if (!this.primaryUser_ ||
          !this.primaryUser_.gameId ||
          !this.currentGame_) {
        console.error('In a game but I have no game?!',
            this.primaryUser_,
            this.currentGame_);
        return;
      }

      this.firebaseGames_.
          child(this.primaryUser_.gameId).
          child('worldStates').
          child(this.turnNumber_ - 1).transaction(function(currentData) {
            if (currentData) { return; }

            var worldState = {};
            game.core.Entity.forEach(function(entity) {
              if (entity instanceof game.Player) {
                worldState[entity.user.userId] = entity.getPosition();
              }
            });

            return worldState;
          }.bind(this), function(error, committed, snapshot) {
            if (error) {
              alert('OH sanp firebase failed during a transaction');
              return;
            }
            // setGameStateToThis(snapshot.getTheData)
            this.switchGameStateTo(game.Main.State.IN_GAME_RECORDING);
          }.bind(this));
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
 * The state is now pending (Pending Auth).
 */
game.Main.prototype.stateChangeToPending = function() {};


/**
 * Change the users state to not ready. TODO(jstanton): UI for this.
 */
game.Main.prototype.stateChangeToNotReady = function() {
  this.switchGameStateTo(game.Main.State.READY);
};


/**
 * Change the users state to ready
 */
game.Main.prototype.stateChangeToReady = function() {
  this.userInterface_.updateTimerText('Waiting for 1 more player to connect.');
  this.firebaseUsers_.
      child(this.primaryUser_.userId).child('state').
      set(game.Main.State.READY,
      function(error) {
        if (error) {
          alert('Error setting user state to ready. Abort');
          console.error(error);
          return;
        }
      }.bind(this));
};


/**
 * The state is now recording.
 */
game.Main.prototype.stateChangeToRecording = function() {
  this.globalTick_ = 0;
  this.userInterface_.drawCountDown(
      'Recording:', +new Date() + game.constants.PLAY_TIME);

  var usersInGame = this.getUsersInGame(
      this.primaryUser_.gameId, this.userList_);

  this.createUserIfNotAlreadyCreatedAndInThisGame();

  this.primaryUser_.player.keyHandler_.startRecording();
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      if (entity.health < 0) {
        // Player is dead! Die!
        
      }
      entity.isPlayingBack = false;
      entity.ignoreKeys = false;

      // Only set velocity, acceleration, and mass for current player.
      // Everyone else should just be floating.
      if (entity.user && this.primaryUser_.userId == entity.user.userId) {
        entity.setVelocity(new game.core.math.Vector());
        entity.setAcceleration(new game.core.math.Vector());
        entity.setMass(game.Player.DEFAULT_MASS);
      }

      var endPosition = entity.endPosition;
      if (endPosition) {
        console.log('error of this much:',
            entity.getPosition().distanceTo(endPosition));
      }
      entity.initialPosition = entity.getPosition().clone();
    }
  }.bind(this));
};


/**
 * The state is now SYNCING.
 */
game.Main.prototype.stateChangeToSyncing = function() {
  this.userInterface_.updateTimerText('Syncing data');

  this.primaryUser_.player.keyHandler_.stopRecording();
  var toSend = this.primaryUser_.player.keyHandler_;
  if (!this.primaryUser_.player.keyHandler_.records ||
      !_.isObject(this.primaryUser_.player.keyHandler_.records)) {
    toSend = false;
  }
  game.core.Entity.forEach(function(entity) {
    if (entity instanceof game.Player) {
      entity.endPosition = entity.getPosition().clone();
      entity.setVelocity(new game.core.math.Vector());
      entity.setAcceleration(new game.core.math.Vector());
      entity.setMass(0);

      // Write to firebase.
      this.firebaseEvents_.
          child(this.primaryUser_.gameId).
          child(this.turnNumber_).
          child(this.primaryUser_.userId).
          set(this.primaryUser_.player.keyHandler_.records);
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
      entity.isPlayingBack = true;
      if (entity.initialPosition) {
        entity.setPosition(entity.initialPosition.x, entity.initialPosition.y);
      } else {
        entity.setPosition(0, 0);
      }
      entity.setAcceleration(new game.core.math.Vector());
      entity.setMass(game.Player.DEFAULT_MASS);
    }
    if (entity instanceof game.Projectile) {
      entity.disappear();
    }
  }.bind(this));
};


/**
 * Handle user authData.
 *
 * @param {Object} authData
 */
game.Main.prototype.handleCreds = function(authData) {
  this.primaryUser_ = {
    userId: authData.uid,
    userToken: authData.token,
    userName: authData.google.displayName,
    initialPosition: this.initialPosition
  };

  this.firebaseUsers_.child(this.primaryUser_.userId).set({
    userId: authData.uid,
    name: authData.google.displayName,
    joinedOn: Firebase.ServerValue.TIMESTAMP,
    state: game.Main.State.NOT_READY,
    initialPosition: this.initialPosition
  }, function() {
    this.switchGameStateTo(game.Main.State.NOT_READY);
  }.bind(this));

  this.firebaseUsers_.child(this.primaryUser_.userId).onDisconnect().remove();
};


/**
 * Login
 */
game.Main.prototype.loginCallback = function() {
  var authData = window.localStorage.getItem('authData');
  if (authData !== null) {
    this.handleCreds(JSON.parse(authData));
    return;
  }

  this.firebase_.authWithOAuthPopup('google', function(error, authData) {
    if (error) {
      console.warn(error);
      return;
    }
    window.localStorage.setItem('authData', JSON.stringify(authData));
    this.handleCreds(authData);
  }.bind(this));
};


//
//
// Firebase!
//
//


/**
 * Firebase usersChangedOrAdded
 *
 * @param {Object} user
 */
game.Main.prototype.usersChangedOrAdded = function(user) {
  var userId = user.key();
  var userData = user.val();
  var playerReference;
  if (this.userList_[userId]) {
    playerReference = this.userList_[userId].player;
  }
  this.userList_[userId] = userData;
  this.userList_[userId].player = playerReference;

  if (this.primaryUser_ && userId == this.primaryUser_.userId) {
    this.primaryUser_ = userData;
  }

  if (this.checkIfWeShouldStartAGame()) {
    this.attemptStartGame();
  }
};


/**
 * Firebase usersChangedOrAdded
 *
 * @param {Object} user
 */
game.Main.prototype.usersDeleted = function(user) {
  delete this.userList_[user.key()];
};


/**
 * Firebase usersChangedOrAdded
 *
 * @param {Object} eventData
 */
game.Main.prototype.eventsChangedOrAdded = function(eventData) {
  var eventGameId = eventData.key();
  var eventGameData = eventData.val();

  if (!this.primaryUser_) return;
  if (this.primaryUser_.gameId != eventGameId) return;
  if (!eventGameData[this.turnNumber_]) return;
  var numberOfPlayersWhoAddedData =
      Object.keys(eventGameData[this.turnNumber_]).length;
  var userInGame = this.getUsersInGame(eventGameId, this.userList_);
  if (numberOfPlayersWhoAddedData >= userInGame.length) {
    _.each(eventGameData[this.turnNumber_], function(events, userId) {
      this.userList_[userId].player.keyHandler_.records = events;
    }.bind(this));
    this.turnNumber_++;
    // Switching to PLayback.
    this.switchGameStateTo(game.Main.State.IN_GAME_PLAYBACK);
  }
};


/**
 * Firebase game changed.
 *
 * @param {Object} addedGame
 */
game.Main.prototype.gameChanged = function(addedGame) {
  var gameId = addedGame.key();
  var gameData = addedGame.val();
  gameData.gameId = gameId;
  this.games_[gameId] = gameData;

  if (this.primaryUser_) {
    if (this.primaryUser_.gameId && this.primaryUser_.gameId == gameId) {
      // console.log('A game I am in just got updated');
    }
  }
};


/**
 * Firebase game added.
 *
 * @param {Object} addedGame
 */
game.Main.prototype.gameAdded = function(addedGame) {
  var gameId = addedGame.key();
  var gameData = addedGame.val();
  gameData.gameId = gameId;
  this.games_[gameId] = gameData;

  if (this.primaryUser_) {
    if (this.primaryUser_.gameId && this.primaryUser_.gameId == gameId) {
      if (this.gameState_ != game.Main.State.READY) {
        console.error('A game was just added with my id but I am not ready');
        this.firebaseGames_.child(gameId).child('users').
            child(this.primaryUser_.userId).remove();
        return;
      }
      this.currentGame_ = gameData;
      this.currentGame_.gameId = gameId;

      this.firebaseGames_.
          child(gameId).
          child('users').
          child(this.primaryUser_.userId).onDisconnect().remove();

      // Sets the state, starts the physics and render loops.
      this.startGame();
    }
  }
};


/**
 * Firebase usersChangedOrAdded
 *
 * @param {Object} game
 */
game.Main.prototype.gamesDeleted = function(game) {
  delete this.games_[game.key()];
};


/**
 * Checks if we should start a game or not
 *
 * @return {boolean}
 */
game.Main.prototype.checkIfWeShouldStartAGame = function() {
  var readyUsers = this.getReadyUser();

  return this.gameState_ == game.Main.State.READY &&
      readyUsers.length >= game.constants.NUM_USERS_ALLOWED_TO_START_A_GAME;
};


/**
 * Attempt to start a game. This gets called by multiple users so it's a
 * transaction.
 */
game.Main.prototype.attemptStartGame = function() {
  // BUG this probably doesn't work.
  var sortedUserList = _.sortBy(this.getReadyUser(), function(user) {
    return user.joinedOn;
  });

  // Warning BUG. If someone sets the data right before this happens, I think
  // the transaction will bash over it :(
  this.firebaseUsers_.transaction(function(currentData) {
    var shouldAbort = false;

    _.each(sortedUserList, function(user) {
      var msg = ' while attempting to add him to a game';
      if (!currentData[user.userId]) {
        shouldAbort = true;
      }

      if (currentData[user.userId].state != game.Main.State.READY) {
        shouldAbort = true;
      }

      if (currentData[user.userId].gameId) {
        shouldAbort = true;
      }
    });

    if (shouldAbort) {
      return;
    }

    var randomNumber = this.uniqueishId();
    _.each(sortedUserList, function(user) {
      currentData[user.userId].state = game.Main.State.IN_GAME_RECORDING;
      currentData[user.userId].gameId = randomNumber;
    });

    return currentData;
  }.bind(this), function(error, committed, snapshot) {
    if (error) {
      console.error('Transaction failed abnormally', error);
      return;
    }

    if (!committed) {
      return;
    }

    var gameId = snapshot.val()[this.primaryUser_.userId].gameId;
    var users = this.getUsersInGame(gameId, snapshot.val());

    this.createGame(gameId, users);
  }.bind(this));
};


/**
 * Creates a game with the given gameID and the array of users.
 *
 * @param {string} gameId
 * @param {Array} userArray
 */
game.Main.prototype.createGame = function(gameId, userArray) {
  var users = {};
  // Transforms the array of users to a map of users by id.
  _.each(userArray, function(user) {
    users[user.userId] = user;
  });

  this.firebaseGames_.child(gameId).set({
    started: Firebase.ServerValue.TIMESTAMP,
    users: users
  });
};


/**
 * Gets the users who are in the ready state.
 *
 * @return {Array}
 */
game.Main.prototype.getReadyUser = function() {
  return _.filter(this.userList_, function(user) {
    return user.state == game.Main.State.READY;
  });
};


/**
 * Gets the users in a game from the given gameID and user list.
 *
 * @param {number} gameId
 * @param {Array} users
 * @return {Array}
 */
game.Main.prototype.getUsersInGame = function(gameId, users) {
  return _.filter(users, function(user) {
    return user.gameId == gameId;
  });
};


/**
 * Generates a uniqu-ish id.
 *
 * @return {string}
 */
game.Main.prototype.uniqueishId = function() {
  return Math.floor((1 + Math.random()) * 0x10000000).toString(16);
};


/**
 * createUserIfNotAlreadyCreatedAndInThisGame
 */
game.Main.prototype.createUserIfNotAlreadyCreatedAndInThisGame = function() {
  if (!this.primaryUser_) return;
  console.log(this.primaryUser_.gameId);
  if (!this.primaryUser_.gameId) return;
  var usersInThisGame =
      this.getUsersInGame(this.primaryUser_.gameId, this.userList_);
  _.each(usersInThisGame, function(user) {
    console.log(user.gameId);
    if (!user.gameId) return;
    if (user.gameId != this.primaryUser_.gameId) return;
    console.log(user.player);
    if (!user.player) {
      user.player = this.addPlayer(
          user, user.userId == this.primaryUser_.userId);
    }
  }.bind(this));


};


// Start
var main = new game.Main();
