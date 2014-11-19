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
   * How frictiony the air is.
   *
   * @type {number}
   */
  this.airFriction = 0.3;
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


/**
 * moveLeft
 * @param {number} delta
 */
game.Player.prototype.moveLeft = function(delta) {
  this.getVelocity().x -= 30 * this.airFriction * delta;
  this.scale = {x: 1};
};


/**
 * moveRight
 * @param {number} delta
 */
game.Player.prototype.moveRight = function(delta) {
  this.getVelocity().x += 30 * this.airFriction * delta;
  this.scale = {x: -1};
};


/**
 * moveUp
 * @param {number} delta
 */
game.Player.prototype.moveUp = function(delta) {
  this.getVelocity().y -= 90 * this.airFriction * delta;
};


/**
 * Player update.
 *
 * @param {number} delta
 */
game.Player.prototype.update = function(delta) {
  var Keycodes = game.core.KeyHandler.Keycodes;

  if (this.keyHandler_.isDown(Keycodes.RIGHT)) this.moveRight(delta);
  if (this.keyHandler_.isDown(Keycodes.LEFT)) this.moveLeft(delta);
  if (this.keyHandler_.isDown(Keycodes.UP)) this.moveUp(delta);
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
 */
game.Player.prototype.playRecordedKeys = function() {
  _.each(game.core.KeyHandler.records, function(record) {
    setTimeout(function(keyCode) {
      this.keyHandler_.pressed[keyCode] = true;
    }.bind(this, record.keyCode), record.start);
    setTimeout(function(keyCode) {
      delete this.keyHandler_.pressed[keyCode];
    }.bind(this, record.keyCode), record.end);
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
