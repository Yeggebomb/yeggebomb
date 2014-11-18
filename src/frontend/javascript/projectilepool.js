goog.provide('game.ProjectilePool');

goog.require('game.Projectile');



/**
 * Projectile pool singleton class.
 *
 * @constructor
 */
game.ProjectilePool = function() {
  /**
   * A reference into the array of projectiles of all unused projectiles.
   * @type {Array.<!game.Projectile>}
   */
  this.available = [];
};


/**
 * Get a projectile from the pool.
 *
 * @return {!game.Projectile}
 */
game.ProjectilePool.prototype.get = function() {
  if (this.available.length <= 0) {
    return new game.Projectile(this);
  } else {
    var len = this.available.length - 1;
    var toReturn = this.available.splice(len, 1);
    return toReturn[0];
  }
};


/**
 * Return a projectile to the pool.
 *
 * @param {!game.Projectile} projectile
 */
game.ProjectilePool.prototype.return = function(projectile) {
  var len = this.available.length;
  this.available[len] = projectile;
};
