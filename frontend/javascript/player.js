goog.provide('game.Player');

goog.require('game.core.Entity');
goog.require('game.core.helper');
goog.require('game.mixins.Fourway');



/**
 * A player.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Player = function() {
  game.Player.base(this, 'constructor');
  this.el.classList.add(game.Player.CLASS_NAME);
  game.core.helper.mixin(this, game.mixins.Fourway.prototype);
};
game.core.helper.inherit(game.Player, game.core.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';
