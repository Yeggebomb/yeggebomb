goog.provide('game.mixins.Physical');

goog.require('game.core.math.Point');



/**
 * This thing has physical characteristics like velocity & acceleration.
 * acceleration.
 *
 * @constructor
 */
game.mixins.Physical = function() {
  /** @private {!game.core.math.Point} */
  this.velocity_ = new game.core.math.Point();
  /** @private {!game.core.math.Point} */
  this.acceleration_ = new game.core.math.Point();
};


/**
 * Returns a reference to the velocity of the entity.
 *
 * @return {!game.core.math.Point}
 */
game.mixins.Physical.prototype.getVelocity = function() {
  // It should return a clone, but because this will happen a lot, I'm fine with
  // modifying the reference. It's cheaper.
  return this.velocity_;
};


/**
 * Sets the velocity and updates the style.
 *
 * @param {!game.core.math.Point} velocity
 */
game.mixins.Physical.prototype.setVelocity = function(velocity) {
  this.velocity_ = velocity;
};


/**
 * Returns a reference to the acceleration of the entity.
 *
 * @return {!game.core.math.Point}
 */
game.mixins.Physical.prototype.getAcceleration = function() {
  // It should return a clone, but because this will happen a lot, I'm fine with
  // modifying the reference. It's cheaper.
  return this.acceleration_;
};


/**
 * Sets the acceleration and updates the style.
 *
 * @param {!game.core.math.Point} acceleration
 */
game.mixins.Physical.prototype.setAcceleration = function(acceleration) {
  this.acceleration_ = acceleration;
};
