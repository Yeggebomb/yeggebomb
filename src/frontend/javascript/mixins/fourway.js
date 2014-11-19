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
  this.getVelocity().x = -75;
};


/** moveRight */
game.mixins.Fourway.prototype.moveRight = function() {
  this.getVelocity().x = 75;
};


/** moveUp */
game.mixins.Fourway.prototype.moveUp = function() {
  this.getVelocity().y = -80;
};


/** moveDown */
game.mixins.Fourway.prototype.moveDown = function() {
  //this.getVelocity().y += 2;
};


/** Update function */
game.mixins.Fourway.prototype.update = function() {
  var KEY_HANDLER = game.mixins.Fourway.KEY_HANDLER;
  var Keycodes = game.core.KeyHandler.Keycodes;

  if (_.isBoolean(this.ignoreKeys) && this.ignoreKeys) {
    return;
  }

  if (KEY_HANDLER.isDown(Keycodes.RIGHT)) this.moveRight();
  if (KEY_HANDLER.isDown(Keycodes.LEFT)) this.moveLeft();
  if (KEY_HANDLER.isDown(Keycodes.UP)) this.moveUp();
  if (KEY_HANDLER.isDown(Keycodes.DOWN)) this.moveDown();
};
