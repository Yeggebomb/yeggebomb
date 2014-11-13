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


/** @private */
game.mixins.Fourway.prototype.moveLeft_ = function() {
  var position = this.getPosition();
  position.setX(position.getX() - 5);
  this.setPosition(position);
};


/** @private */
game.mixins.Fourway.prototype.moveRight_ = function() {
  var position = this.getPosition();
  position.setX(position.getX() + 5);
  this.setPosition(position);
};


/** @private */
game.mixins.Fourway.prototype.moveUp_ = function() {
  var position = this.getPosition();
  position.setY(position.getY() - 5);
  this.setPosition(position);
};


/** @private */
game.mixins.Fourway.prototype.moveDown_ = function() {
  var position = this.getPosition();
  position.setY(position.getY() + 5);
  this.setPosition(position);
};


/** Update function */
game.mixins.Fourway.prototype.update = function() {
  if (!this.keyHandler_) {
    /** @private {!game.KeyHandler} */
    this.keyHandler_ = new game.KeyHandler();
  }

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
