goog.provide('game.mixins.ProjectileCreator');

goog.require('game.ProjectilePool');
goog.require('game.core.KeyHandler');
goog.require('game.core.helper');



/**
 * An entity mixin that gives the an entity the ability to create projectiles.
 *
 * @constructor
 */
game.mixins.ProjectileCreator = function() {};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['projectilecreator'] =
    game.mixins.ProjectileCreator.prototype;


/**
 * Initialize the projectile creator.
 */
game.mixins.ProjectileCreator.prototype.init = function() {
  this.projectilePool = new game.ProjectilePool();
};


/** create and throw new projectile */
game.mixins.ProjectileCreator.prototype.throwProjectile = function() {
  var vel = this.getVelocity();
  var projectile = this.projectilePool.get();
  projectile.create(this.getPosition(), vel);
  projectile.attach(this.el.parentNode);
};


/** Update function */
game.mixins.ProjectileCreator.prototype.update = function() {
  var Keycodes = game.core.KeyHandler.Keycodes;
  if (this.keyHandler_.isDown(Keycodes.SPACE)) this.throwProjectile();
};
