goog.provide('game.Player');

goog.require('game.constants');
goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * A player.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Player = function() {
  game.core.helper.mixin(
      this, 'shape', 'reset', 'fourway', 'physical', 'projectilecreator');
  game.Player.base(this, 'constructor');
  this.el.classList.add(game.Player.CLASS_NAME);

  /**
   * How bouncy this object is. (0 being nothing 1 being forever bouncy)
   *
   * @type {number}
   */
  this.bouncyness = 0.5;

  /**
   * How frictiony the object is.
   *
   * @type {number}
   */
  this.friction = 0.5;

  /**
   * The error for zero.
   *
   * @type {number}
   */
  this.epsilon = 0.01;

  /**
   * The position of an entity at the start of his turn.
   *
   * @type {!game.core.math.Vector}
   */
  this.initialPosition = null;

  /**
   * The position of an entity at the end of his turn.
   *
   * @type {!game.core.math.Vector}
   */
  this.endPosition = null;

  /**
   * Key handler
   *
   * @private {!game.core.KeyHandler}
   */
  this.keyHandler_ = new game.core.KeyHandler();

  /**
   * The authenticated user with this player.
   *
   * @type {Object}
   */
  this.user = null;
  /**
   * If in playback mode or not.
   *
   * @type {boolean}
   */
  this.isPlayingBack = false;
};
game.core.helper.inherit(game.Player, game.core.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';


/**
 * Default mass.
 *
 * @type {number}
 */
game.Player.DEFAULT_MASS = 5;


/**
 * Initialize player.
 */
game.Player.prototype.init = function() {
  // Sets initial mass of object.
  this.setMass(game.Player.DEFAULT_MASS);
};


/** moveLeft */
game.Player.prototype.moveLeft = function() {
  this.getVelocity().x = -35;
  this.scale = {x: 1};
};


/** moveRight */
game.Player.prototype.moveRight = function() {
  this.getVelocity().x = 35;
  this.scale = {x: -1};
};


/** moveUp */
game.Player.prototype.moveUp = function() {
  this.getVelocity().y = -40;
};


/**
 * Update for the player
 * @param {number} dt Delta time since last update.
 * @param {number} currentTick The current tick we are on.
 */
game.Player.prototype.update = function(dt, currentTick) {
  this.keyHandler_.currentTick = currentTick;
  if (this.isPlayingBack) {
    this.playRecordedKeys(currentTick);
  }
  var Keycodes = game.core.KeyHandler.Keycodes;
  if (this.keyHandler_.isDown(Keycodes.RIGHT)) this.moveRight();
  if (this.keyHandler_.isDown(Keycodes.LEFT)) this.moveLeft();
  if (this.keyHandler_.isDown(Keycodes.UP)) this.moveUp();
};


/**
 * Callback for when player collides with platform.
 *
 * @param {!game.core.Entity} other
 * @param {!game.core.math.Response} response
 * @param {number} delta
 */
game.Player.prototype.collisionWithPlatform = function(other, response, delta) {
  var position = this.pos.sub(response.overlapV);
  var velocity = this.getVelocity();
  velocity.y *= -this.bouncyness;

  if (velocity.x > this.epsilon) {
    velocity.x -= 9.8 * this.friction * delta;
    if (velocity.x < 0) velocity.x = 0;
  } else if (velocity.x < this.epsilon) {
    velocity.x += 9.8 * this.friction * delta;
    if (velocity.x > 0) velocity.x = 0;
  } else {
    velocity.x = 0;
  }
  this.setPosition(position.x, position.y);
};


/**
 * Plays recorded keys the KeyHandler.
 *
 * @param {number} currentTick The current tick we are on.
 */
game.Player.prototype.playRecordedKeys = function(currentTick) {
  _.each(game.core.KeyHandler.records[currentTick], function(record) {
    if (_.isBoolean(record.value)) {
      this.keyHandler_.pressed[record.keyCode] = record.value;
    } else {
      delete this.keyHandler_.pressed[record.keyCode];
    }
  }.bind(this));
};


/**
 * If I should ignore keys.
 *
 * @param {boolean} value
 */
game.Player.prototype.ignoreKeys = function(value) {
  this.keyHandler_.ignoreKeys = value;
};
