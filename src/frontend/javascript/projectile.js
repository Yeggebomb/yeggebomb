goog.provide('game.Projectile');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Projectile singleton class.
 *
 * @param {!game.ProjectilePool} projectilePool
 * @constructor
 * @extends {game.core.Entity}
 */
game.Projectile = function(projectilePool) {
  game.core.helper.mixin(this, 'shape', 'reset', 'physical', 'dissapearing');

  game.Projectile.base(this, 'constructor');
  this.el.classList.add(game.Projectile.CLASS_NAME);

  this.projectilePool = projectilePool;
  this.bouncyness = 0.7;
  this.friction = 0.1;
};
game.core.helper.inherit(game.Projectile, game.core.Entity);


/**
 * Initialize projectile.
 *
 * @param {!game.core.math.Vector} pos
 * @param {!game.core.math.Vector} vel
 * @param {!game.core.math.Vector} scale
 * @param {number} power
 */
game.Projectile.prototype.create = function(pos, vel, scale, power) {
  this.setMass(1);
  this.setRectangle(0, 0, 5, 5);

  var position = this.getPosition();
  var velocity = this.getVelocity();

  var transformX = -5;
  if (scale.x > 0) transformX += 90;
  var transformY = -10;
  if (scale.y > -0.2) transformY += 30;
  position.x = pos.x + transformX;
  position.y = pos.y + transformY;
  velocity.x = vel.x + scale.x * 100 * power;
  velocity.y = vel.y + scale.y * 100 * power;

  this.setToDissapearIn(10);
  this.registerCollidesWith('ground', this.collisionWithPlatform.bind(this));
  this.registerCollidesWith('ceiling', this.collisionWithPlatform.bind(this));
  this.registerCollidesWith('leftwall', this.collisionWithPlatform.bind(this));
  this.registerCollidesWith('rightwall', this.collisionWithPlatform.bind(this));
};


/**
 * @type {String}
 */
game.Projectile.CLASS_NAME = 'projectile';


/**
 * Callback for when projectile collides with platform.
 *
 * @param {!game.core.Entity} other
 * @param {!game.core.math.Response} response
 * @param {number} delta
 */
game.Projectile.prototype.collisionWithPlatform =
    function(other, response, delta) {
  var position = this.pos.sub(response.overlapV);
  var velocity = this.getVelocity();
  velocity.y *= -this.bouncyness;

  if (velocity.x > this.epsilon) {
    velocity.x -= game.constants.Physics.GRAVITY * this.friction * delta;
    if (velocity.x < 0) velocity.x = 0;
  } else if (velocity.x < this.epsilon) {
    velocity.x += game.constants.Physics.GRAVITY * this.friction * delta;
    if (velocity.x > 0) velocity.x = 0;
  } else {
    velocity.x = 0;
  }
  this.setPosition(position.x, position.y);
};

