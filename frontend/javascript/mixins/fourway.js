goog.provide('game.mixins.Fourway');

goog.require('game.core.KeyHandler');



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
 * @const {!game.core.KeyHandler}
 */
game.mixins.Fourway.KEY_HANDLER = new game.core.KeyHandler();


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
  var KEY_HANDLER = game.mixins.Fourway.KEY_HANDLER;
  var Keycodes = game.core.KeyHandler.Keycodes;
  if (KEY_HANDLER.isDown(Keycodes.RIGHT)) this.moveRight_();
  if (KEY_HANDLER.isDown(Keycodes.LEFT)) this.moveLeft_();
  if (KEY_HANDLER.isDown(Keycodes.UP)) this.moveUp_();
  if (KEY_HANDLER.isDown(Keycodes.DOWN)) this.moveDown_();
};
