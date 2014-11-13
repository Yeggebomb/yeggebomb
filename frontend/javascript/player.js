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
    this.moveRight_();
  }

  if (this.keyHandler_.isDown(game.KeyHandler.Keycodes.LEFT)) {
    this.moveLeft_();
  }

  if (this.keyHandler_.isDown(game.KeyHandler.Keycodes.UP)) {
    this.moveUp_();
  }

  if (this.keyHandler_.isDown(game.KeyHandler.Keycodes.DOWN)) {
    this.moveDown_();
  }
};


/** @private */
game.Player.prototype.moveLeft_ = function() {
  var position = this.getPosition();
  position.setX(position.getX() - 5);
  this.setPosition(position);
};


/** @private */
game.Player.prototype.moveRight_ = function() {
  var position = this.getPosition();
  position.setX(position.getX() + 5);
  this.setPosition(position);
};


/** @private */
game.Player.prototype.moveUp_ = function() {
  var position = this.getPosition();
  position.setY(position.getY() - 5);
  this.setPosition(position);
};


/** @private */
game.Player.prototype.moveDown_ = function() {
  var position = this.getPosition();
  position.setY(position.getY() + 5);
  this.setPosition(position);
};

