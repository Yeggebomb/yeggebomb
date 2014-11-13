goog.provide('game.KeyHandler');
goog.provide('game.KeyHandler.Keycodes');



/**
 * KeyHandler singleton class, this class keeps track of key events,
 *
 * @constructor
 */
game.KeyHandler = function() {
  if (game.KeyHandler.prototype._singletonInstance) {
    return game.KeyHandler.prototype._singletonInstance;
  }

  game.KeyHandler.prototype._singletonInstance = this;

  /**
   * Object that tracks what is currently being pressed.
   *
   * @private {!Object.<!game.KeyHandler.Keycodes, boolean>}
   */
  this.pressed_ = {};

  // Add event listeners.
  window.addEventListener('keyup', this.onKeyup_.bind(this), false);
  window.addEventListener('keydown', this.onKeydown_.bind(this), false);
};


/**
 * Returns true if the given keycode is currently being pressed.
 *
 * @param {!game.KeyHandler.Keycodes} keyCode
 * @return {boolean} true if key is down.
 */
game.KeyHandler.prototype.isDown = function(keyCode) {
  return this.pressed_[keyCode];
};


/**
 * Callback for keydown event.
 *
 * @param {!Event} evt
 * @private
 */
game.KeyHandler.prototype.onKeydown_ = function(evt) {
  this.pressed_[evt.keyCode] = true;
};


/**
 * Callback for keyup event.
 *
 * @param {!Event} evt
 * @private
 */
game.KeyHandler.prototype.onKeyup_ = function(evt) {
  delete this.pressed_[evt.keyCode];
};


/**
 * Key codes for common characters in this game.
 *
 * @enum {number}
 */
game.KeyHandler.Keycodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};
