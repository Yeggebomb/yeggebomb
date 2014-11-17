goog.provide('game.mixins.entity.Reset');

goog.require('game.constants');
goog.require('game.core.helper');



/**
 * Reset mixin. Physical mixin is a dependency.
 *
 * @constructor
 */
game.mixins.entity.Reset = function() {};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['reset'] = game.mixins.entity.Reset.prototype;


/**
 * Delta time in MS.
 *
 * @param {number} deltaTime
 */
game.mixins.entity.Reset.prototype.update = function(deltaTime) {
  var accel = this.getAcceleration();
  accel.x = 0;
  accel.y = 0;
  var vel = this.getVelocity();
  if (vel.x > 1000) {
    vel.x = 1000;
  }
  if (vel.y > 1000) {
    vel.y = 1000;
  }
};

