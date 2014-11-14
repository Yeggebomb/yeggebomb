goog.provide('game.Viewport');

goog.require('game.Entity');
goog.require('game.mixins.Rectangle');
goog.require('helper');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Viewport = function() {
  if (game.Viewport.prototype._singletonInstance) {
    return game.Viewport.prototype._singletonInstance;
  }
  game.Viewport.prototype._singletonInstance = this;
  game.Viewport.base(this, 'constructor');
  this.el.classList.add(game.Viewport.CLASS_NAME);

  helper.mixin(this, game.mixins.Rectangle.prototype);
};
helper.inherit(game.Viewport, game.Entity);


/**
 * @type {String}
 */
game.Viewport.CLASS_NAME = 'viewport';
