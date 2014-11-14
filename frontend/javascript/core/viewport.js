goog.provide('game.core.Viewport');

goog.require('game.core.Entity');
goog.require('game.core.helper');
goog.require('game.mixins.Rectangle');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.core.Viewport = function() {
  if (game.core.Viewport.prototype._singletonInstance) {
    return game.core.Viewport.prototype._singletonInstance;
  }
  game.core.Viewport.prototype._singletonInstance = this;
  game.core.Viewport.base(this, 'constructor');
  this.el.classList.add(game.core.Viewport.CLASS_NAME);

  game.core.helper.mixin(this, game.mixins.Rectangle.prototype);
};
game.core.helper.inherit(game.core.Viewport, game.core.Entity);


/**
 * @type {String}
 */
game.core.Viewport.CLASS_NAME = 'viewport';
