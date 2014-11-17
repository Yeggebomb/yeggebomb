goog.provide('game.core.math.Response');

goog.require('game.core.math.Vector');



/**
 * An object representing the result of an intersection. Contains:
 *  - The two objects participating in the intersection
 *  - The vector representing the minimum change necessary to extract the first
 *    object from the second one (as well as a unit vector in that direction and
 *    the magnitude of the overlap)
 *  - Whether the first object is entirely inside the second, and vice versa.
 *
 * @constructor
 */
game.core.math.Response = function() {
  this.a = null;
  this.b = null;
  this.overlapN = new game.core.math.Vector();
  this.overlapV = new game.core.math.Vector();
  this.clear();
};


/**
 * Set some values of the response back to their defaults. Call this between
 * tests if you are going to reuse a single Response object for multiple
 * intersection tests (recommented as it will avoid allcating extra memory)
 *
 * @return {game.core.math.Response} This for chaining
 */
game.core.math.Response.prototype.clear = function() {
  this.aInB = true;
  this.bInA = true;
  this.overlap = Number.MAX_VALUE;
  return this;
};
