goog.provide('game.Platform');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {game.core.Entity}
 */
game.Platform = function() {
  game.Platform.base(this, 'constructor');
  this.el.classList.add(game.Platform.CLASS_NAME);

  game.core.helper.mixin(this, 'rectangle', 'physical');
};
game.core.helper.inherit(game.Platform, game.core.Entity);


/**
 * @type {String}
 */
game.Platform.CLASS_NAME = 'platform';
