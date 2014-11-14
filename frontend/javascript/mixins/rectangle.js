goog.provide('game.mixins.Rectangle');

goog.require('game.core.math.Point');



/**
 * Rectangle mixin, adds properties like width, height, scale, rotation etc..
 * With some helpers like within, or overlaps etc... This will callupdateRect
 * when the rect has been updated.
 * @constructor
 */
game.mixins.Rectangle = function() {};


/** @private {number} */
game.mixins.Rectangle.X_DEFAULT_ = 0;


/** @private {number} */
game.mixins.Rectangle.Y_DEFAULT_ = 0;


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


/** @private {!game.core.math.Point} */
game.mixins.Rectangle.POSITION_DEFAULT_ = new game.core.math.Point(0, 0);


/**
 * Sets the dimensions of the rectangle.
 *
 * @param {number|string} x A number for px and a string for percent.
 * @param {number|string} y A number for px and a string for percent.
 * @param {number|string} width A number for px and a string for percent.
 * @param {number|string} height A number for px and a string for percent.
 * @param {number} scale
 * @param {number} rotation
 * @param {Element=|game.core.Entity=} opt_relativeTo
 * @param {number=} opt_maxWidth
 * @param {number=} opt_maxHeight
 * @param {number=} opt_minWidth
 * @param {number=} opt_minHeight
 */
game.mixins.Rectangle.prototype.setRect =
    function(x, y, width, height, scale, rotation, opt_relativeTo,
            opt_maxWidth, opt_maxHeight, opt_minWidth, opt_minHeight) {
  this.setPosition(x, y, opt_relativeTo, false);
  this.setRotation(rotation, false);
  this.setScale(scale, false);
  this.setSize(width, height, opt_relativeTo, opt_maxWidth, opt_maxHeight,
      opt_minWidth, opt_minHeight, false);

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
 * @param {boolean=} opt_callUpdate Default is true which will call the update
 *    function.
 */
game.mixins.Rectangle.prototype.setRotation =
    function(rotation, opt_callUpdate) {
  var callUpdate = _.isBoolean(opt_callUpdate) ? opt_callUpdate : true;
  rotation = _.isNumber(rotation) ?
      rotation :
      game.mixins.Rectangle.ROTATION_DEFAULT_;
  this.rotation = rotation;
  if (callUpdate && _.isFunction(this.updateRect)) this.updateRect();
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
 * @param {boolean=} opt_callUpdate Default is true which will call the update
 *    function.
 */
game.mixins.Rectangle.prototype.setScale = function(scale, opt_callUpdate) {
  var callUpdate = _.isBoolean(opt_callUpdate) ? opt_callUpdate : true;
  scale = _.isNumber(scale) ? scale : game.mixins.Rectangle.SCALE_DEFAULT_;

  this.scale = scale;
  if (callUpdate && _.isFunction(this.updateRect)) this.updateRect();
};


/**
 * Sets the size of the entity.
 *
 * @param {number|string} width
 * @param {number|string} height
 * @param {Element=|game.core.Entity=} opt_relativeTo
 * @param {number=} opt_maxWidth
 * @param {number=} opt_maxHeight
 * @param {number=} opt_minWidth
 * @param {number=} opt_minHeight
 * @param {boolean=} opt_callUpdate Default is true which will call the update
 *    function.
 */
game.mixins.Rectangle.prototype.setSize =
    function(width, height, opt_relativeTo, opt_maxWidth, opt_maxHeight,
    opt_minWidth, opt_minHeight, opt_callUpdate) {

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
 * @return {!game.core.math.Point}
 */
game.mixins.Rectangle.prototype.getPosition = function() {
  // It should return a clone, but because this will happen a lot, I'm fine with
  // modifying the reference. It's cheaper.
  return this.position;
};


/**
 * Sets the position and updates the style.
 *
 * @param {number|string} x X-coord or sometimes referred to as left.
 * @param {number|string} y Y-coord or sometimes referred to as top.
 * @param {Element=|game.core.Entity=} opt_relativeTo
 * @param {boolean=} opt_callUpdate Default is true which will call the update
 *    function.
 */
game.mixins.Rectangle.prototype.setPosition =
    function(x, y, opt_relativeTo, opt_callUpdate) {
  var callUpdate = _.isBoolean(opt_callUpdate) ? opt_callUpdate : true;

  if (_.isNumber(x)) {
    x = x || game.mixins.Rectangle.X_DEFAULT_;
  } else if (_.isString(x) && opt_relativeTo) {
    x = opt_relativeTo.getWidth() * parseInt(x, 10) / 100;
  }

  if (_.isNumber(y)) {
    y = y || game.mixins.Rectangle.Y_DEFAULT_;
  } else if (_.isString(y) && opt_relativeTo) {
    y = opt_relativeTo.getHeight() * parseInt(y, 10) / 100;
  }

  if (this.position) {
    this.position.setX(x);
    this.position.setY(y);
  } else {
    this.position = new game.core.math.Point(x, y);
  }

  this.right = x + this.getWidth();
  this.bottom = y + this.getHeight();

  if (callUpdate && _.isFunction(this.updateRect)) this.updateRect();
};
