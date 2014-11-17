goog.provide('game.mixins.Physical');

goog.require('game.core.helper');
goog.require('game.core.math.Point');



/**
 * This thing has physical characteristics like velocity & acceleration.
 * acceleration. Also right now it has to have rectangle collision.
 *
 * @constructor
 */
game.mixins.Physical = function() {
  // This does nothing other than help with type.
  /** @type {Array.<string>} Array of colidee's this instance can colide with */
  this.colliders = {};
};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['physical'] = game.mixins.Physical.prototype;


/**
 * Global registered Colideer.
 *
 * @type {Object.<string, !Game.core.Entity>}
 */
game.mixins.Physical.Colideers = {};


/**
 * Returns a reference to the velocity of the entity.
 *
 * @return {!game.core.math.Point}
 */
game.mixins.Physical.prototype.getVelocity = function() {
  if (!this.velocity_) {
    this.velocity_ = new game.core.math.Point(0, 0);
  }
  return this.velocity_;
};


/**
 * Checks for collisions and adjust accordingly.
 */
game.mixins.Physical.prototype.update = function() {
  if (!_.isObject(this.colliders)) this.colliders = {};
  var collision = false;
  _.each(game.core.Entity.All, function(entity) {
    _.each(this.colliders, function(callback, name) {
      if (entity instanceof game.mixins.Physical.Colideers[name]) {
        // if (this.overlaps(entity)) {
        //   callback();
        // }
      }
    }.bind(this));
  }.bind(this));
};


/**
 * Registeres objects that can be collided with.
 * @param {string} name
 * @param {!game.core.Entity} type [description]
 */
game.mixins.Physical.prototype.registerCollider = function(name, type) {
  game.mixins.Physical.Colideers[name] = type;
};


/**
 * Registers names of objects that this instance can colide with.
 * @param {string} name
 * @param {Function} callback
 */
game.mixins.Physical.prototype.registerCollidesWith = function(name, callback) {
  if (!_.isObject(this.colliders)) this.colliders = {};
  if (_.isUndefined(game.mixins.Physical.Colideers[name])) {
    console.warn('Warning:', name, 'Is not registered as a colideer');
    return;
  }
  this.colliders[name] = callback;
};
