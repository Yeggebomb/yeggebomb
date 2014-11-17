goog.provide('game.mixins.Fourway');

goog.require('game.core.KeyHandler');
goog.require('game.core.helper');



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
 * Register mixin globally.
 */
game.core.helper.mixins['fourway'] = game.mixins.Fourway.prototype;


/**
 * Key handler
 *
 * @const {!game.core.KeyHandler}
 */
game.mixins.Fourway.KEY_HANDLER = new game.core.KeyHandler();


/** moveLeft */
game.mixins.Fourway.prototype.moveLeft = function() {
  var position = this.getPosition();
  this.setPosition(position.x - 5, position.y);
};


/** moveRight */
game.mixins.Fourway.prototype.moveRight = function() {
  var position = this.getPosition();
  this.setPosition(position.x + 5, position.y);
};


/** moveUp */
game.mixins.Fourway.prototype.moveUp = function() {
  var position = this.getPosition();
  this.setPosition(position.x, position.y - 5);
};


/** moveDown */
game.mixins.Fourway.prototype.moveDown = function() {
  var position = this.getPosition();
  this.setPosition(position.x, position.y + 5);
};


/** Update function */
game.mixins.Fourway.prototype.update = function() {
  var KEY_HANDLER = game.mixins.Fourway.KEY_HANDLER;
  var Keycodes = game.core.KeyHandler.Keycodes;
  if (KEY_HANDLER.isDown(Keycodes.RIGHT)) this.moveRight();
  if (KEY_HANDLER.isDown(Keycodes.LEFT)) this.moveLeft();
  if (KEY_HANDLER.isDown(Keycodes.UP)) this.moveUp();
  if (KEY_HANDLER.isDown(Keycodes.DOWN)) this.moveDown();
};
