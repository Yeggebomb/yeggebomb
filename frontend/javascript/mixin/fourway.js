goog.provide('game.mixins.Fourway');

goog.require('game.KeyHandler');



/**
 * Requires rectancle mixin.
 *
 * An entity mixin that gives the an entity the ability to move left, right, up
 * or down.
 *
 * @constructor
 */
game.mixins.Fourway = function() {};


/**
 * Key handler
 *
 * @const {!game.KeyHandler}
 */
game.mixins.Fourway.KEY_HANDLER = new game.KeyHandler();


/** @private */
game.mixins.Fourway.prototype.moveLeft_ = function() {
  var position = this.getPosition();
  this.setPosition(position.getX() - 5, position.getY());
};


/** @private */
game.mixins.Fourway.prototype.moveRight_ = function() {
  var position = this.getPosition();
  this.setPosition(position.getX() + 5, position.getY());
};


/** @private */
game.mixins.Fourway.prototype.moveUp_ = function() {
  var position = this.getPosition();
  this.setPosition(position.getX(), position.getY() - 5);
};


/** @private */
game.mixins.Fourway.prototype.moveDown_ = function() {
  var position = this.getPosition();
  this.setPosition(position.getX(), position.getY() + 5);
};


/** Update function */
game.mixins.Fourway.prototype.update = function() {
  if (game.mixins.Fourway.KEY_HANDLER.isDown(game.KeyHandler.Keycodes.RIGHT)) {
    this.moveRight_();
  }

  if (game.mixins.Fourway.KEY_HANDLER.isDown(game.KeyHandler.Keycodes.LEFT)) {
    this.moveLeft_();
  }

  if (game.mixins.Fourway.KEY_HANDLER.isDown(game.KeyHandler.Keycodes.UP)) {
    this.moveUp_();
  }

  if (game.mixins.Fourway.KEY_HANDLER.isDown(game.KeyHandler.Keycodes.DOWN)) {
    this.moveDown_();
  }
};
