goog.provide('game.Entity');
goog.provide('game.Entity.Size');

goog.require('game.Point');
goog.require('helper.object');



/**
 * An entity, player, enemy, object or thing. Entity will have things like
 * position, size, a dom element, class & ID etc..
 *
 * @constructor
 */
game.Entity = function() {
  /**
   * The position of this entity.
   * @private {!game.Point}
   */
  this.position_ = new game.Point();
  /**
   * The size of this object.
   * @private {!game.Entity.Size}
   */
  this.size_ = {
    width: 0,
    height: 0
  };

  /**
   * @private {string}
   */
  this.id_ = 'entity-' + game.Entity.ID_COUNT++;

  /**
   * The entity's element.
   * @type {!Element}
   */
  this.el = document.createElement('span');
  this.el.id = this.id_;
};


/** @typedef {Object.<string, {
    width: (number|string),
    height: (number|string)
  }>}  */
game.Entity.Size;


/**
 * Global id count.
 * @type {number}
 */
game.Entity.ID_COUNT = 0;


/**
 * Creates and attaches the dom of this entity to the parent provided.
 * @param {Element|HTMLBodyElement} parent The parent to attach this entity
 *     to.
 */
game.Entity.prototype.attach = function(parent) {
  if (!document.getElementById(this.id_)) {
    parent.appendChild(this.el);
  }
};


/**
 * Gets the size of the entity.
 *
 * @param {?string=} opt_unit Optional unit to be appending on the size.
 * @return {!game.Entity.Size}
 */
game.Entity.prototype.getSize = function(opt_unit) {
  var size = helper.object.clone(this.size_);

  if (opt_unit != null) {
    size.width += opt_unit;
    size.height += opt_unit;
  }

  return size;
};


/**
 * The position of the entity.
 *
 * @return {!game.Point}
 */
game.Entity.prototype.getPosition = function() {
  return this.position_;
};
