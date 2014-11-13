goog.provide('game.Board');

goog.require('game.Entity');
goog.require('game.mixins.Rectangle');
goog.require('helper');



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

  helper.mixin(this, game.mixins.Rectangle.prototype);
};
helper.inherit(game.Board, game.Entity);


/**
 * @type {String}
 */
game.Board.CLASS_NAME = 'board';
