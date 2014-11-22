goog.provide('game.Cloud');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Cloud singleton class.
 *
 * @param {game.core.math.Vector} pos
 * @constructor
 * @extends {game.core.Entity}
 */
game.Cloud = function(pos) {
  game.Cloud.base(this, 'constructor');
  this.el.classList.add(game.Cloud.CLASS_NAME);

  /** @private {game.core.math.Vector} */
  this.cloudPosition_ = pos;

  this.init();

  game.core.helper.mixin(this, 'shape', 'physical');
};
game.core.helper.inherit(game.Cloud, game.core.Entity);


/**
 * @type {String}
 */
game.Cloud.CLASS_NAME = 'cloud';


/**
 * Initialize function.
 */
game.Cloud.prototype.init = function() {
  this.setPolygon(this.cloudPosition_, [
    new game.core.math.Vector(0, 0),
    new game.core.math.Vector(60, 0),
    new game.core.math.Vector(100, 40),
    new game.core.math.Vector(60, 80),
    new game.core.math.Vector(0, 80)
  ]);
};
