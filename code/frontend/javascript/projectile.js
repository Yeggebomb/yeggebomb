goog.provide('game.Projectile');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Projectile singleton class.
 *
 * @constructor
 * @extends {game.core.Entity}
 */
game.Projectile = function() {
  game.Projectile.base(this, 'constructor');
  this.el.classList.add(game.Projectile.CLASS_NAME);

  game.core.helper.mixin(this, 'shape', 'physical');
  this.init();
};
game.core.helper.inherit(game.Projectile, game.core.Entity);


/**
 * Initialize projectile.
 *
 * @param {game.core.math.Vector} pos
 * @param {game.core.math.Vector} vel
 */
game.Projectile.prototype.init = function(pos, vel) {
  this.setMass(1);
  this.setRectangle(0, 0, 5, 5);

  var position = this.getPosition();
  var velocity = this.getVelocity();

  position.x = pos.x;
  position.y = pos.y;
  velocity.x = vel.x;
  velocity.y = vel.y;
};


/**
 * @type {String}
 */
game.Projectile.CLASS_NAME = 'projectile';

