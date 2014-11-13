goog.provide('game.Entity');

goog.require('game.Point');
goog.require('game.Size');
goog.require('helper.object');



/**
 * An entity. This can be a player, enemy, object or a thing. Entity will have
 * properties like position, size, scale, class & ID etc..
 *
 * @constructor
 */
game.Entity = function() {
  /** @private {!game.Point} */
  this.position_ = new game.Point();
  /** @type {string} */
  this.background = '';
  /**
   * Scale from 0 to 1.
   * @private {number}
   */
  this.scale_ = 1;
  /**
   * Rotation in degrees.
   * @private {number}
   */
  this.rotation_ = 0;
  /**
   * Skew (x and y) in degrees.
   * @private {!game.Point}
   */
  this.skew_ = new game.Point();
  /** @private {!game.Size} */
  this.size_ = new game.Size();
  /** @private {string} */
  this.id_ = 'entity-' + game.Entity.ID_COUNT++;
  /** @type {!Element} */
  this.el = document.createElement('span');
  this.el.id = this.id_;
  this.el.classList.add(game.Entity.CLASS_NAME);
};


/**
 * Class name's for all entities.
 * @type {string}
 * @const
 */
game.Entity.CLASS_NAME = 'entity';


/** @typedef {Object.<string, {
    width: (number|string),
    height: (number|string)
  }>}  */
game.Size;


/**
 * Global id count.
 * @type {number}
 */
game.Entity.ID_COUNT = 0;


/**
 * Updates the entity information.
 */
game.Entity.prototype.update = function() {};


/**
 * Creates and attaches the dom of this entity to the parent provided.
 * @param {Element|HTMLBodyElement} parent The parent to attach this entity
 *     to.
 */
game.Entity.prototype.attach = function(parent) {
  if (!document.getElementById(this.id_)) {
    parent.appendChild(this.el);
  } else {
    console.warn('Attempted to attach dom element multiple times:', this.el_);
  }
  this.setupEventListeners();
};


/**
 * Detach element from dom.
 */
game.Entity.prototype.detach = function() {
  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  } else {
    console.warn(
        'Attempted to remove dom element when it has no parent', this.el_);
  }
  this.destroyEventListeners();
};


/**
 * Sets up event listeners.
 */
game.Entity.prototype.setupEventListeners = function() {};


/**
 * Destroys event listeners.
 */
game.Entity.prototype.destroyEventListeners = function() {};


/**
 * Gets the size of the entity.
 *
 * @param {?string=} opt_unit Optional unit to be appending on the size.
 * @return {!game.Size}
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
 * Sets the size of the entity.
 *
 * @param {!game.Size} size
 */
game.Entity.prototype.setSize = function(size) {
  this.size_ = helper.object.clone(size);
  this.el.style.width = this.size_.getWidth('px');
  this.el.style.height = this.size_.getHeight('px');
};


/**
 * Returns a reference to the position of the entity.
 *
 * @return {!game.Point}
 */
game.Entity.prototype.getPosition = function() {
  // It should return a clone, but because this will happen a lot, I'm fine with
  // modifying the reference. It's cheaper.
  return this.position_;
};


/**
 * Sets the position and updates the style.
 *
 * @param {!game.Point} position
 */
game.Entity.prototype.setPosition = function(position) {
  this.position_ = position;
  this.updateTransform_();
};


/**
 * The background of the entity.
 *
 * @return {string}
 */
game.Entity.prototype.getBackground = function() {
  return this.background_;
};


/**
 * The background style on the entity.
 *
 * @param {string} background
 */
game.Entity.prototype.setBackground = function(background) {
  this.background_ = background;
  this.el.style.background = background;
};


/**
 * The rotation of the entity.
 *
 * @return {number}
 */
game.Entity.prototype.getRotation = function() {
  return this.rotation_;
};


/**
 * The rotation style on the entity (in degrees).
 *
 * @param {number} rotation
 */
game.Entity.prototype.setRotation = function(rotation) {
  this.rotation_ = rotation;
  this.updateTransform_();
};


/**
 * The scale of the entity.
 *
 * @return {number}
 */
game.Entity.prototype.getScale = function() {
  return this.scale_;
};


/**
 * The scale style on the entity.
 *
 * @param {number} scale
 */
game.Entity.prototype.setScale = function(scale) {
  this.scale_ = scale;
  this.updateTransform_();
};


/**
 * The skew of the entity.
 *
 * @return {!game.Point}
 */
game.Entity.prototype.getSkew = function() {
  return this.skew_;
};


/**
 * The skew style on the entity.
 *
 * @param {!game.Point} skew
 */
game.Entity.prototype.setSkew = function(skew) {
  this.skew_ = skew;
  this.updateTransform_();
};


/**
 * Updates the transform style on the element.
 *
 * @private
 */
game.Entity.prototype.updateTransform_ = function() {
  var transform = 'rotate(' + this.rotation_ + 'deg) ' +
                  'scale(' + this.scale_ + ') ' +
                  'skewX(' + this.skew_.getX('deg') + ') ' +
                  'skewY(' + this.skew_.getY('deg') + ') ' +
                  'translate(' + this.position_.getX('px') +
                  ', ' + this.position_.getY('px') + ')';

  this.el.style.webkitTransform = transform;
  this.el.style.MozTransform = transform;
  this.el.style.msTransform = transform;
  this.el.style.OTransform = transform;
  this.el.style.transform = transform;
};
