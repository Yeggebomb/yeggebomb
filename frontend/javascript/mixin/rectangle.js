goog.provide('game.mixins.Rectangle');

goog.require('game.Point');



/**
 * Rectangle mixin, adds properties like width, height, scale, rotation etc..
 * With some helpers like within, or overlaps etc... This will call updateRect
 * when the rect has been updated.
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
 * @param {number|string} left A number for px and a string for percent.
 * @param {number|string} top A number for px and a string for percent.
 * @param {number|string} width A number for px and a string for percent.
 * @param {number|string} height A number for px and a string for percent.
 * @param {number} scale
 * @param {number} rotation
 * @param {Element=|game.Entity=} opt_relativeTo
 * @param {number=} opt_maxWidth
 * @param {number=} opt_maxHeight
 * @param {number=} opt_minWidth
 * @param {number=} opt_minHeight
 */
game.mixins.Rectangle.prototype.setRect =
    function(left, top, width, height, scale, rotation, opt_relativeTo,
            opt_maxWidth, opt_maxHeight, opt_minWidth, opt_minHeight) {

  rotation = _.isNumber(rotation) ?
      rotation : game.mixins.Rectangle.ROTATION_DEFAULT_;

  scale = _.isNumber(scale) ? scale : game.mixins.Rectangle.SCALE_DEFAULT_;

  if (_.isNumber(left)) {
    left = left || game.mixins.Rectangle.LEFT_DEFAULT_;
  } else if (_.isString(left) && opt_relativeTo) {
    left = opt_relativeTo.getWidth() * parseInt(left, 10) / 100;
  }

  if (_.isNumber(top)) {
    top = top || game.mixins.Rectangle.TOP_DEFAULT_;
  } else if (_.isString(top) && opt_relativeTo) {
    top = opt_relativeTo.getHeight() * parseInt(top, 10) / 100;
  }

  if (_.isNumber(width)) {
    width = width || game.mixins.Rectangle.WIDTH_DEFAULT_;
  } else if (_.isString(width) && opt_relativeTo) {
    width = opt_relativeTo.getWidth() * parseInt(width, 10) / 100;
    if (_.isNumber(opt_maxWidth)) {
      width = Math.min(opt_maxWidth, width);
    }
    if (_.isNumber(opt_minWidth)) {
      width = Math.max(opt_minWidth, width);
    }
  }

  if (_.isNumber(height)) {
    height = height || game.mixins.Rectangle.HEIGHT_DEFAULT_;
  } else if (_.isString(height) && opt_relativeTo) {
    height = opt_relativeTo.getHeight() * parseInt(height, 10) / 100;
    if (_.isNumber(opt_maxHeight)) {
      height = Math.min(opt_maxHeight, height);
    }
    if (_.isNumber(opt_minHeight)) {
      height = Math.max(opt_minHeight, height);
    }
  }


  var position = new game.Point(left, top);

  this.setPosition(position);
  this.setRotation(rotation);
  this.setScale(scale);
  this.setSize(width, height);

  if (_.isFunction(this.updateRect)) this.updateRect();
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
  if (_.isFunction(this.updateRect)) this.updateRect();
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
  if (_.isFunction(this.updateRect)) this.updateRect();
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

  if (_.isFunction(this.updateRect)) this.updateRect();
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

  if (_.isFunction(this.updateRect)) this.updateRect();
};
