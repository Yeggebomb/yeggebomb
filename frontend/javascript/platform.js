goog.provide('game.Platform');

goog.require('game.core.Entity');
goog.require('game.core.helper');
goog.require('game.mixins.Physical');
goog.require('game.mixins.Rectangle');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {game.core.Entity}
 */
game.Platform = function() {
  game.Platform.base(this, 'constructor');
  this.el.classList.add(game.Platform.CLASS_NAME);

  game.core.helper.mixin(this,
      game.mixins.Rectangle.prototype, game.mixins.Physical.prototype);
};
game.core.helper.inherit(game.Platform, game.core.Entity);


/**
 * @type {String}
 */
game.Platform.CLASS_NAME = 'platform';
