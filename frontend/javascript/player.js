goog.provide('game.Player');

goog.require('game.Entity');
goog.require('game.KeyHandler');
goog.require('game.Size');
goog.require('helper');



/**
 * A player.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Player = function() {
  game.Player.base(this, 'constructor');

  /** @private {game.KeyHandler} */
  this.keyHandler_ = new game.KeyHandler();

  this.el.classList.add(game.Player.CLASS_NAME);
};
helper.extend(game.Player, game.Entity);


/**
 * @type {String}
 */
game.Player.CLASS_NAME = 'player';


/**
 * Updates the players position.
 */
game.Player.prototype.update = function() {
  if (this.keyHandler_.isDown(game.KeyHandler.Keycodes.RIGHT)) {
    this.moveRight();
  }

  if (this.keyHandler_.isDown(game.KeyHandler.Keycodes.LEFT)) {
    this.moveLeft();
  }
};


/** Move left */
game.Player.prototype.moveLeft = function() {
  var position = this.getPosition();
  position.setX(position.getX() - 1);
  this.setPosition(position);
};


/** Move right */
game.Player.prototype.moveRight = function() {
  var position = this.getPosition();
  position.setX(position.getX() + 1);
  this.setPosition(position);
};

