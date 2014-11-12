goog.provide('game.Player');

goog.require('game.Entity');
goog.require('helper');



/**
 * A player.
 *
 * @constructor
 * @extends {!Game.Entity}
 */
game.Player = function() {
  game.Player.base(this, 'constructor');
};
helper.extend(game.Player, game.Entity);
