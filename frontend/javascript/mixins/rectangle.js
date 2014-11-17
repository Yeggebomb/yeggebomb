goog.provide('game.mixins.Rectangle');

goog.require('game.core.helper');
goog.require('game.core.math.Point');
goog.require('game.core.math.Vector');



/**
 * Rectangle mixin, adds properties like width, height, scale, rotation etc..
 * With some helpers like within, or overlaps etc... This will callupdateRect
 * when the rect has been updated.
 * @constructor
 */
game.mixins.Rectangle = function() {};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['rectangle'] = game.mixins.Rectangle.prototype;


/**
 * Sets the dimensions of the rectangle.
 *
 * @param {number|string} x A number for px and a string for percent.
 * @param {number|string} y A number for px and a string for percent.
 * @param {number|string} width A number for px and a string for percent.
 * @param {number|string} height A number for px and a string for percent.
 * @param {Element=|game.core.Entity=} opt_relativeTo
 * @param {number=} opt_maxWidth
 * @param {number=} opt_maxHeight
 * @param {number=} opt_minWidth
 * @param {number=} opt_minHeight
 */
game.mixins.Rectangle.prototype.setRect =
    function(x, y, width, height, opt_relativeTo, opt_maxWidth, opt_maxHeight,
        opt_minWidth, opt_minHeight) {

  this.setSize(width, height, opt_relativeTo, opt_maxWidth, opt_maxHeight,
      opt_minWidth, opt_minHeight, false);

  this.setPosition(x, y, opt_relativeTo, false);

  if (_.isFunction(this.updateRect)) this.updateRect();
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

  if (_.isString(width) && opt_relativeTo) {
    width = opt_relativeTo.getWidth() * parseInt(width, 10) / 100;
    if (_.isNumber(opt_maxWidth)) {
      width = Math.min(opt_maxWidth, width);
    }
    if (_.isNumber(opt_minWidth)) {
      width = Math.max(opt_minWidth, width);
    }
  }

  if (_.isString(height) && opt_relativeTo) {
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

  var position = this.position || new game.core.math.Vector(0, 0);

  this.right = position.x + this.width;
  this.bottom = position.y + this.height;

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
