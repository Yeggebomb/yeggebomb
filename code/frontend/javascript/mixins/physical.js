goog.provide('game.mixins.Physical');

goog.require('game.core.helper');
goog.require('game.core.math.Response');
goog.require('game.core.math.Vector');
goog.require('game.core.math.collision');
goog.require('game.mixins.Shape.Type');



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
  // Ask about later.
};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['physical'] = game.mixins.Physical.prototype;


/**
 * Global registered Collider.
 *
 * @type {Object.<string, !Game.core.Entity>}
 */
game.mixins.Physical.Colliders = {};


/**
 * Returns a reference to the velocity of the entity.
 *
 * @return {!game.core.math.Point}
 */
game.mixins.Physical.prototype.getVelocity = function() {
  if (!this.velocity_) {
    this.velocity_ = new game.core.math.Vector(0, 0);
  }
  return this.velocity_;
};


/**
 * Returns a reference to the mass of the entity.
 *
 * @return {!number}
 */
game.mixins.Physical.prototype.getMass = function() {
  if (!this.mass_) {
    this.mass_ = 0;
  }
  return this.mass_;
};


/**
 * Checks for collisions and adjust accordingly.
 * @param {number} delta
 */
game.mixins.Physical.prototype.update = function(delta) {
  if (!_.isObject(this.colliders)) this.colliders = {};
  var collision = false;
  _.each(game.core.Entity.All, function(entity) {
    _.each(this.colliders, function(callback, name) {
      if (entity instanceof game.mixins.Physical.Colliders[name]) {
        var response = new game.core.math.Response();
        var collision = game.core.math.collision;
        var ShapeType = game.mixins.Shape.Type;
        var didCollide = false;

        if ((this.type == ShapeType.POLYGON ||
            this.type == ShapeType.RECTANGLE) &&
            (entity.type == ShapeType.POLYGON ||
            entity.type == ShapeType.RECTANGLE)) {
          didCollide = collision.testPolygonPolygon(this, entity, response);
        } else if (this.type == ShapeType.CIRCLE &&
            (entity.type == ShapeType.POLYGON ||
            entity.type == ShapeType.RECTANGLE)) {
          didCollide = collision.testCirclePolygon(this, entity, response);
          if (didCollide) debugger;
        } else if ((this.type == ShapeType.POLYGON ||
            this.type == ShapeType.RECTANGLE) &&
            entity.type == ShapeType.CIRCLE) {
          didCollide = collision.testPolygonCircle(this, entity, response);
        }

        if (didCollide) {
          callback(entity, response, delta);
        }
      }
    }.bind(this));
  }.bind(this));
};


/**
 * Registers the mass of the object.
 * @param {!number} mass
 */
game.mixins.Physical.prototype.setMass = function(mass) {
  this.mass = mass;
};


/**
 * Registeres objects that can be collided with.
 * @param {string} name
 * @param {!game.core.Entity} type [description]
 */
game.mixins.Physical.prototype.registerCollider = function(name, type) {
  game.mixins.Physical.Colliders[name] = type;
};


/**
 * Registers names of objects that this instance can colide with.
 * @param {string} name
 * @param {Function} callback
 */
game.mixins.Physical.prototype.registerCollidesWith = function(name, callback) {
  if (!_.isObject(this.colliders)) this.colliders = {};
  if (_.isUndefined(game.mixins.Physical.Colliders[name])) {
    console.warn('Warning:', name, 'Is not registered as a colideer');
    return;
  }
  this.colliders[name] = callback;
};
