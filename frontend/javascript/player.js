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
  game.Player.base(this, 'constructor');
  this.el.classList.add(game.Player.CLASS_NAME);
  game.core.helper.mixin(this, 'fourway', 'physical');

  /**
   * How bouncy this object is. (0 being nothing 1 being forever bouncy)
   *
   * @type {number}
   */
  this.bouncyness = 0.6;
};
game.core.helper.inherit(game.Player, game.core.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';


/**
 * Delta time in MS.
 *
 * @param {number} deltaTime
 */
game.Player.prototype.update = function(deltaTime) {
  var velocity = this.getVelocity();
  velocity.setY(velocity.getY() + game.constants.Gravity * deltaTime);

  var position = this.getPosition();
  this.setPosition(
      position.getX() + velocity.getX(),
      position.getY() + velocity.getY());
};


/**
 * Callback for when player collides with platform.
 */
game.Player.prototype.collisionWithPlatform = function() {
  var velocity = this.getVelocity();
  velocity.setY(velocity.getY() * -this.bouncyness);
};
