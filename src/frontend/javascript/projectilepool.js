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
    var projectile = toReturn[0];
    projectile.isActive_ = true;
    return projectile;
  }
};


/**
 * Return a projectile to the pool.
 *
 * @param {!game.Projectile} projectile
 */
game.ProjectilePool.prototype.returnToPool = function(projectile) {
  var len = this.available.length;
  this.available[len] = projectile;
  projectile.isActive_ = false;
  projectile.detach();//.parentNode.removeChild(this.el);
};
