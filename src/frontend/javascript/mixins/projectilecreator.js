goog.provide('game.mixins.ProjectileCreator');

goog.require('game.ProjectilePool');
goog.require('game.core.KeyHandler');
goog.require('game.core.helper');



/**
 * An entity mixin that gives the an entity the ability to create projectiles.
 *
 * @constructor
 */
game.mixins.ProjectileCreator = function() {
};


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


/**
 * Key handler
 *
 * @const {!game.core.KeyHandler}
 */
game.mixins.ProjectileCreator.KEY_HANDLER = new game.core.KeyHandler();


/** create and throw new projectile */
game.mixins.ProjectileCreator.prototype.throwProjectile = function() {
  var vel = this.getVelocity();
  var projectile = this.projectilePool.get();
  projectile.create(this.getPosition(), vel);
  projectile.attach(this.el.parentNode);
};


/** Update function */
game.mixins.ProjectileCreator.prototype.update = function() {
  var KEY_HANDLER = game.mixins.Fourway.KEY_HANDLER;
  var Keycodes = game.core.KeyHandler.Keycodes;
  if (KEY_HANDLER.isDown(Keycodes.SPACE)) this.throwProjectile();
};
