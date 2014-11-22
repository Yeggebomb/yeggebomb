goog.provide('game.mixins.ProjectileCreator');

goog.require('game.ProjectilePool');
goog.require('game.constants');
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
  this.ticksSinceLastBullet = game.constants.BULLET_DELAY;
  this.readyToShoot = false;
  this.ticksSinceStartBulletThrow = 0;
};


/** create and throw new projectile */
game.mixins.ProjectileCreator.prototype.throwProjectile = function() {
  var shootingPower = this.ticksSinceStartBulletThrow /
      game.constants.BULLET_DELAY + 1;
  var vel = this.getVelocity();
  var projectile = this.projectilePool.get();
  projectile.attach(this.el.parentNode);
  projectile.create(this.getPosition(), vel, this.scale, shootingPower);
  vel.x += this.scale.x * -80;
  vel.y += this.scale.y * 80;
};


/**
 * Update function
 */
game.mixins.ProjectileCreator.prototype.update = function() {
  var Keycodes = game.constants.KEYCODES;
  this.ticksSinceLastBullet += 1;
  if (this.readyToShoot &&
      !this.keyHandler_.isDown(Keycodes.SPACE) &&
      this.ticksSinceLastBullet > game.constants.BULLET_DELAY) {
    this.throwProjectile();
    this.ticksSinceLastBullet = 0;
    this.ticksSinceStartBulletThrow = 0;
    this.readyToShoot = false;
  }
  if (this.keyHandler_.isDown(Keycodes.SPACE)) {
    this.readyToShoot = true;
    this.ticksSinceStartBulletThrow += 1;
  }
};
