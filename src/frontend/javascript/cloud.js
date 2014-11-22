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
  this.fillColor = '#B5AEA5';
  this.setPolygon(this.cloudPosition_, [
    new game.core.math.Vector(0, 60),
    new game.core.math.Vector(20, 10),
    new game.core.math.Vector(50, 10),
    new game.core.math.Vector(60, 20),
    new game.core.math.Vector(65, 40),
    new game.core.math.Vector(70, 30),
    new game.core.math.Vector(85, 30),
    new game.core.math.Vector(90, 40),
    new game.core.math.Vector(100, 60)
  ]);
};
