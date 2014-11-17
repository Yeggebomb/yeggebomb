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
game.core.helper.mixins['box'] = game.mixins.Polygon.prototype;


/**
 * Creates a convex pologyon or a rectangle (as a convex polygon).
 *
 * This function has two signatures for creating wither a convex polygon or a
 * rectangle.
 *
 * (game.core.math.Vector, Array.<game.core.math.Vector>) to create a polygon.
 * - OR -
 * (game.core.math.Vector, number, number) to create a box (which in turn
 * creates a polygon).
 *
 * @param {game.core.math.Vector=} opt_pos A vector representing the origin of
 *     the polygon. (all other points are relative to this one)
 * @param {Array.<game.core.math.Vector>=|number=} opt_pointsOrWidth An array of
 *     vectors representing the points in the polygon, in counter-clockwise
 *     order. Or the width (if this is provided we are creating a box).
 * @param {number=} opt_height If this is provided we are creating a box.
 * @return {game.mixins.Polygon} This for chaining.
 */
game.mixins.Polygon.prototype.setShape =
    function(opt_pos, opt_pointsOrWidth, opt_height) {
  this.pos = opt_pos || new game.core.math.Vector();

  if (_.isNumber(opt_pointsOrWidth) && _.isNumber(opt_height)) {
    var w = opt_pointsOrWidth;
    var h = opt_height;
    opt_pointsOrWidth = [
      new game.core.math.Vector(), new game.core.math.Vector(w, 0),
      new game.core.math.Vector(w, h), new game.core.math.Vector(0, h)
    ];
  }

  this.points = opt_pointsOrWidth || [];
  this.angle = 0;
  this.offset = new game.core.math.Vector();
  this.recalc();

  return this;
};


/**
 * Set the points of the polygon.
 *
 * Note: This calls `recalc` for you.
 *
 * @param {Array.<game.core.math.Vector>=} opt_points An array of vectors
 *     representing the points in the polygon, in counter-clockwise order.
 *
 * @return {Polygon} This for chaining.
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
 * @return {Polygon} This for chaining.
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
 * @return {Polygon} This for chaining.
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
 * @return {Polygon} This for chaining.
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
 * @return {Polygon} This for chaining.
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
 * @return {Polygon} This for chaining.
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
