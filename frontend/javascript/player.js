goog.provide('game.Player');

goog.require('game.Entity');
goog.require('game.KeyHandler');
goog.require('game.Size');
goog.require('game.mixins.Fourway');
goog.require('game.mixins.Twoway');
goog.require('helper');



/**
 * A player.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Player = function() {
  game.Player.base(this, 'constructor');

  this.el.classList.add(game.Player.CLASS_NAME);

  helper.mixin(this, game.mixins.Fourway.prototype);
};
helper.inherit(game.Player, game.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';
