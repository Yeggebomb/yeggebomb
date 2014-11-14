goog.provide('game.Backdrop');

goog.require('game.Entity');
goog.require('game.mixins.Rectangle');
goog.require('helper');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Backdrop = function() {
  if (game.Backdrop.prototype._singletonInstance) {
    return game.Backdrop.prototype._singletonInstance;
  }
  game.Backdrop.prototype._singletonInstance = this;
  game.Backdrop.base(this, 'constructor');
  this.el.classList.add(game.Backdrop.CLASS_NAME);

  helper.mixin(this, game.mixins.Rectangle.prototype);
};
helper.inherit(game.Backdrop, game.Entity);


/**
 * @type {String}
 */
game.Backdrop.CLASS_NAME = 'backdrop';
