goog.provide('game.Board');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Game board singleton class.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Board = function() {
  if (game.Board.prototype._singletonInstance) {
    return game.Board.prototype._singletonInstance;
  }
  game.Board.prototype._singletonInstance = this;
  game.Board.base(this, 'constructor');
  this.el.classList.add(game.Board.CLASS_NAME);

  game.core.helper.mixin(this, 'shape');
};
game.core.helper.inherit(game.Board, game.core.Entity);


/**
 * @type {String}
 */
game.Board.CLASS_NAME = 'board';
