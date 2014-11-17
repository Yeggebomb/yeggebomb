goog.provide('game.mixins.Polygon');

goog.require('game.core.math.Vector');



/**
 * Represents a *convex* polygon with any number of points (specified in
 * counter-clockwise order)
 *
 * Note: If you manually change the `points`, `angle`, or `offset` properties,
 * you **must** call `recalc` afterwards so that the changes get applied
 * correctly.
 *
 * Create a new polygon, passing in a position vector, and an array of points
 * (represented by vectors relative to the position vector). If no position is
 * passed in, the position of the polygon will be `(0,0)`.
 *
 * This was stolen from SAT.js: https://github.com/jriecken/sat-js
 *
 * @constructor
 */
game.mixins.Polygon = function() {};


/**
 * Register mixin globally.
 */
game.core.helper.mixins['polygon'] = game.mixins.Polygon.prototype;
game.core.helper.mixins['rectangle'] = game.mixins.Polygon.prototype;


/**
 * Creates a convex pologyon.
 *
 *
 * @param {game.core.math.Vector=} opt_pos A vector representing the origin of
 *     the polygon. (all other points are relative to this one)
 * @param {Array.<game.core.math.Vector>=|number=} opt_points An array of
 *     vectors representing the points in the polygon, in counter-clockwise
 *     order.
 * @return {game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.setShape = function(opt_pos, opt_points) {
  this.pos = opt_pos || new game.core.math.Vector();
  this.points = opt_points || [];
  this.angle = 0;
  this.offset = new game.core.math.Vector();
  this.recalc();

  return this;
};


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
game.mixins.Polygon.prototype.setRect =
    function(x, y, width, height, opt_relativeTo, opt_maxWidth, opt_maxHeight,
        opt_minWidth, opt_minHeight) {

  this.setSize(width, height, opt_relativeTo, opt_maxWidth, opt_maxHeight,
      opt_minWidth, opt_minHeight, false);

  this.setPosition(x, y, opt_relativeTo, false);

  if (_.isFunction(this.updateRect)) this.updateRect();
};


/**
 * For rectangles. Sets the size of the entity.
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
game.mixins.Polygon.prototype.setSize =
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
};


/**
 * For rectangles.
 *
 * @return {number}
 */
game.mixins.Polygon.prototype.getWidth = function() {
  return this.width;
};


/**
 * For rectangles.
 *
 * @return {number}
 */
game.mixins.Polygon.prototype.getHeight = function() {
  return this.height;
};


/**
 * Set the points of the polygon.
 *
 * Note: This calls `recalc` for you.
 *
 * @param {Array.<game.core.math.Vector>=} opt_points An array of vectors
 *     representing the points in the polygon, in counter-clockwise order.
 *
 * @return {!game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.setPoints = function(opt_points) {
  this.points = opt_points;
  this.recalc();
  return this;
};


/**
 * Set the current rotation angle of the polygon.
 *
 * Note: This calls `recalc` for you.
 *
 * @param {number} angle The current rotation angle (in radians).
 * @return {!game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.setAngle = function(angle) {
  this.angle = angle;
  this.recalc();
  return this;
};


/**
 * Set the current offset to apply to the `points` before applying the `angle`
 * rotation.
 *
 * Note: This calls `recalc` for you.
 *
 * @param {game.core.math.Vector} offset The new offset vector.
 * @return {!game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.setOffset = function(offset) {
  this.offset = offset;
  this.recalc();
  return this;
};


/**
 * Rotates this polygon counter-clockwise around the origin of *its local
 * coordinate system* (i.e. `pos`).
 *
 * Note: This changes the **original** points (so any `angle` will be applied
 * on top of this rotation) Note: This calls `recalc` for you.
 *
 * @param {number} angle The angle to rotate (in radians)
 * @return {!game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.rotate = function(angle) {
  var points = this.points;
  var len = points.length;
  for (var i = 0; i < len; i++) {
    points[i].rotate(angle);
  }
  this.recalc();
  return this;
};


/**
 * Translates the points of this polygon by a specified amount relative to the
 * origin of *its own coordinate system* (i.e. `pos`). This is most useful to
 * change the "center point" of a polygon. If you just want to move the whole
 * polygon, change the coordinates of `pos`. Note: This changes the
 * **original** points (so any `offset` will be applied on top of this
 * translation) Note: This calls `recalc` for you.
 *
 * @param {number} x The horizontal amount to translate.
 * @param {number} y The vertical amount to translate.
 * @return {!game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.translate = function(x, y) {
  var points = this.points;
  var len = points.length;
  for (var i = 0; i < len; i++) {
    points[i].x += x;
    points[i].y += y;
  }
  this.recalc();
  return this;
};


/**
 * Computes the calculated collision polygon. Applies the `angle` and `offset`
 * to the original points then recalculates the edges and normals of the
 * collision polygon.
 *
 * This **must** be called if the `points` array, `angle`, or `offset` is
 * modified manualy.
 *
 * @return {!game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.recalc = function() {
  var i;
  // Calculated points - this is what is used for underlying collisions and
  // takes into account the angle/offset set on the polygon.
  var calcPoints = this.calcPoints = [];
  // The edges here are the direction of the `n`th edge of the polygon, relative
  // to the `n`th point. If you want to draw a given edge from the edge value,
  // you must first translate to the position of the starting point.
  var edges = this.edges = [];
  // The normals here are the direction of the normal for the `n`th edge of the
  // polygon, relative to the position of the `n`th point. If you want to draw
  // an edge normal, you must first translate to the position of the starting
  // point.
  var normals = this.normals = [];
  // Copy the original points array and apply the offset/angle
  var points = this.points;
  var offset = this.offset;
  var angle = this.angle;
  var len = points.length;
  for (i = 0; i < len; i++) {
    var calcPoint = points[i].clone();
    calcPoints.push(calcPoint);
    calcPoint.x += offset.x;
    calcPoint.y += offset.y;
    if (angle !== 0) {
      calcPoint.rotate(angle);
    }
  }

  // Calculate the edges/normals
  for (i = 0; i < len; i++) {
    var p1 = calcPoints[i];
    var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
    var e = new game.core.math.Vector().copy(p2).sub(p1);
    var n = new game.core.math.Vector().copy(e).perp().normalize();
    edges.push(e);
    normals.push(n);
  }
  return this;
};
