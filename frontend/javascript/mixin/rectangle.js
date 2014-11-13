goog.provide('game.mixins.Rectangle');

goog.require('game.Point');



/**
 * Requires: Element named this.el
 * @constructor
 */
game.mixins.Rectangle = function() {
  // The constructor is completely ignored and only here for typedef reasons.
  /** @type {number} */
  this.left;
  /** @type {number} */
  this.top;
  /** @type {number} */
  this.width;
  /** @type {number} */
  this.height;
  /** @type {number} */
  this.right;
  /** @type {number} */
  this.bottom;
  /** @type {number} */
  this.scale;
  /** @type {number} */
  this.rotation;
};


/** @private {number} */
game.mixins.Rectangle.LEFT_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.TOP_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.WIDTH_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.HEIGHT_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.RIGHT_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.BOTTOM_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.SCALE_DEFAULT_ = 1;


/** @private {number} */
game.mixins.Rectangle.ROTATION_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.POSITION_DEFAULT_ = new game.Point(
    game.mixins.Rectangle.LEFT_DEFAULT_, game.mixins.Rectangle.TOP_DEFAULT_);


/**
 * Sets the dimensions of the rectangle.
 *
 * @param {number} left
 * @param {number} top
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @param {number} rotation
 */
game.mixins.Rectangle.prototype.setRect =
    function(left, top, width, height, scale, rotation) {
  left = _.isNumber(left) ? left : game.mixins.Rectangle.TOP_DEFAULT_;
  top = _.isNumber(top) ? top : game.mixins.Rectangle.TOP_DEFAULT_;
  rotation = _.isNumber(rotation) ?
      rotation : game.mixins.Rectangle.ROTATION_DEFAULT_;
  scale = _.isNumber(scale) ? scale : game.mixins.Rectangle.SCALE_DEFAULT_;
  width = _.isNumber(width) ? width : game.mixins.Rectangle.WIDTH_DEFAULT_;
  height = _.isNumber(height) ? height : game.mixins.Rectangle.HEIGHT_DEFAULT_;

  var position = new game.Point(left, top);
  this.setPosition(position);
  this.setRotation(rotation);
  this.setScale(scale);
  this.setSize(width, height);

  this.updateTransform();
};


/**
 * True if the class with this mixed in is within another class with this mixed
 * in. WARNING: does not take rotation or scale into account.
 *
 * @param {*} r
 * @return {boolean}
 */
game.mixins.Rectangle.prototype.within = function(r) {
  return (r.left <= this.left && r.right >= this.right &&
      r.top <= this.top && r.bottom >= this.bottom);
};


/**
 * True if the class with this mixed in is within another class with this mixed
 * in. WARNING: does not take rotation or scale into account.
 *
 * @param {*} r
 * @return {boolean}
 */
game.mixins.Rectangle.prototype.overlaps = function(r) {
  return (this.left < r.right && r.left < this.right &&
      this.top < r.bottom && r.top < this.bottom);
};


/**
 * The rotation of the entity.
 *
 * @return {number}
 */
game.mixins.Rectangle.prototype.getRotation = function() {
  return this.rotation;
};


/**
 * The rotation style on the entity (in degrees).
 *
 * @param {number} rotation
 */
game.mixins.Rectangle.prototype.setRotation = function(rotation) {
  this.rotation = rotation;
  this.updateTransform();
};


/**
 * The scale of the entity.
 *
 * @return {number}
 */
game.mixins.Rectangle.prototype.getScale = function() {
  return this.scale;
};


/**
 * The scale style on the entity.
 *
 * @param {number} scale
 */
game.mixins.Rectangle.prototype.setScale = function(scale) {
  this.scale = scale;
  this.updateTransform();
};


/**
 * Sets the size of the entity.
 *
 * @param {number} width
 * @param {number} height
 */
game.mixins.Rectangle.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;

  var position = this.getPosition() || game.mixins.Rectangle.POSITION_DEFAULT_;

  this.right = position.getX() + this.width;
  this.bottom = position.getY() + this.height;

  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  this.updateTransform();
};


/** @return {number} */
game.mixins.Rectangle.prototype.getWidth = function() {
  return this.width;
};


/** @return {number} */
game.mixins.Rectangle.prototype.getHeight = function() {
  return this.height;
};


/**
 * Returns a reference to the position of the entity.
 *
 * @return {!game.Point}
 */
game.mixins.Rectangle.prototype.getPosition = function() {
  // It should return a clone, but because this will happen a lot, I'm fine with
  // modifying the reference. It's cheaper.
  return this.position;
};


/**
 * Sets the position and updates the style.
 *
 * @param {!game.Point} position
 */
game.mixins.Rectangle.prototype.setPosition = function(position) {
  this.position = position;

  this.right = this.position.getX() + this.getWidth();
  this.bottom = this.position.getY() + this.getHeight();

  this.updateTransform();
};


/**
 * Updates the transform style on the element.
 */
game.mixins.Rectangle.prototype.updateTransform = function() {
  var position = this.getPosition() || game.mixins.Rectangle.POSITION_DEFAULT_;
  var rotation = this.getRotation() || game.mixins.Rectangle.ROTATION_DEFAULT_;
  var scale = this.getScale() || game.mixins.Rectangle.SCALE_DEFAULT_;

  var transform = 'rotate(' + rotation + 'deg) ' +
                  'scale(' + scale + ') ' +
                  'translate(' + position.getX('px') +
                  ', ' + position.getY('px') + ')';

  this.el.style.webkitTransform = transform;
  this.el.style.MozTransform = transform;
  this.el.style.msTransform = transform;
  this.el.style.OTransform = transform;
  this.el.style.transform = transform;
};
