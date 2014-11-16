goog.provide('game.Backdrop');

goog.require('game.core.Entity');
goog.require('game.core.helper');



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

  game.core.helper.mixin(this, 'rectangle');
};
game.core.helper.inherit(game.Backdrop, game.core.Entity);


/**
 * @type {String}
 */
game.Backdrop.CLASS_NAME = 'backdrop';
