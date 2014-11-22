goog.provide('game.mixins.entity.Dissapearing');

goog.require('game.constants');
goog.require('game.core.helper');



/**
 * Dissapearing mixin.
 * This should only be used for projectiles.
 * TODO(laculp): Merge into the projectile class.
 *
 * @constructor
 */
game.mixins.entity.Dissapearing = function() {};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['dissapearing'] =
    game.mixins.entity.Dissapearing.prototype;


/**
 * Initialize the dissapear time.
 *
 * @param {number} sec Time in seconds to dissapear in.
 */
game.mixins.entity.Dissapearing.prototype.setToDissapearIn = function(sec) {
  this.dissapearInSec = sec;
};


/**
 * @param {number} deltaTime
 */
game.mixins.entity.Dissapearing.prototype.update = function(deltaTime) {
  this.dissapearInSec -= deltaTime;
  if (this.dissapearInSec < 0) {
    this.disappear();
  }
};


/**
 * Delete the projectile from the game.
 */
game.mixins.entity.Dissapearing.prototype.disappear = function() {
  this.projectilePool.returnToPool(this);
};

