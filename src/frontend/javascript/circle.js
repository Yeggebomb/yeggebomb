goog.provide('game.Circle');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {game.core.Entity}
 */
game.Circle = function() {
  game.Circle.base(this, 'constructor');
  this.el.classList.add(game.Circle.CLASS_NAME);

  game.core.helper.mixin(this, 'shape', 'gravity', 'physical');
};
game.core.helper.inherit(game.Circle, game.core.Entity);


/**
 * @type {String}
 */
game.Circle.CLASS_NAME = 'platform';


/**
 * Callback for when player collides with platform.
 *
 * @param {!game.core.Entity} other
 * @param {!game.core.math.Response} response
 */
game.Circle.prototype.collisionWithPlatform = function(other, response) {
  var position = this.pos.sub(response.overlapV);
  var velocity = this.getVelocity();
  velocity.y *= -this.bouncyness;
  if (velocity.x > 0) {
    velocity.x -= this.friction;
    if (velocity.x < 0) velocity.x = 0;
  } else {
    velocity.x += this.friction;
    if (velocity.x > 0) velocity.x = 0;
  }
  this.setPosition(position.x, position.y);
};
