goog.provide('game.Player');

goog.require('game.Entity');
goog.require('game.Size');
goog.require('helper');



/**
 * A player.
 *
 * @constructor
 * @extends {!Game.Entity}
 */
game.Player = function() {
  game.Player.base(this, 'constructor');
  this.el.classList.add(game.Player.CLASS_NAME);
};
helper.extend(game.Player, game.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';
