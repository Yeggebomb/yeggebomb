goog.provide('game.Size');



/**
 * @constructor
 * @param {?number=} opt_width
 * @param {?number=} opt_height
 */
game.Size = function(opt_width, opt_height) {
  /** @private {number} */
  this.width_ = opt_width || 0;
  /** @private {number} */
  this.height_ = opt_height || 0;
};


/**
 * @param {boolean=} opt_unit
 * @return {number|string}
 */
game.Size.prototype.getWidth = function(opt_unit) {
  var width = this.width_;
  if (opt_unit) width += opt_unit;
  return width;
};


/**
 * @param {boolean=} opt_unit
 * @return {number|string}
 */
game.Size.prototype.getHeight = function(opt_unit) {
  var height = this.height_;
  if (opt_unit) height += opt_unit;
  return height;
};
