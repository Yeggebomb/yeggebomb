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
   * If I should ignore key input or not.
   *
   * @type {number}
   */
  this.ignoreKeys = false;

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
