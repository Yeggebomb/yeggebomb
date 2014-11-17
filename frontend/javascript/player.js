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
  game.core.helper.mixin(this, 'shape', 'gravity', 'fourway', 'physical');

  /**
   * How bouncy this object is. (0 being nothing 1 being forever bouncy)
   *
   * @type {number}
   */
  this.bouncyness = 0.3;
};
game.core.helper.inherit(game.Player, game.core.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';


/**
 * Callback for when player collides with platform.
 *
 * @param {!game.core.Entity} other
 * @param {!game.core.math.Response} response
 */
game.Player.prototype.collisionWithPlatform = function(other, response) {
  var position = this.pos.sub(response.overlapV);
  this.getVelocity().y *= -this.bouncyness;
  this.setPosition(position.x, position.y);
};
