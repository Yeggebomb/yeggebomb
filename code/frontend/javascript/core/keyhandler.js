goog.provide('game.core.KeyHandler');
goog.provide('game.core.KeyHandler.Keycodes');



/**
 * KeyHandler singleton class, this class keeps track of key events,
 *
 * @constructor
 */
game.core.KeyHandler = function() {
  if (game.core.KeyHandler.prototype._singletonInstance) {
    return game.core.KeyHandler.prototype._singletonInstance;
  }

  game.core.KeyHandler.prototype._singletonInstance = this;
  /**
   * Object that tracks what is currently being pressed.
   * @private {!Object.<!game.core.KeyHandler.Keycodes, boolean>}
   */
  this.pressed_ = {};

  // Add event listeners.
  window.addEventListener('keyup', this.onKeyup_.bind(this), false);
  window.addEventListener('keydown', this.onKeydown_.bind(this), false);
  // Right clicking
  document.addEventListener(
      'visibilitychange', this.visibilityChanged_.bind(this));
  document.addEventListener('mousedown', this.mouseDown_.bind(this));
};


/**
 * Checks if the app lost visibility. If it does then we can no longer detect
 * keyUp events so we will just wipe out all the keys.
 *
 * @private
 */
game.core.KeyHandler.prototype.visibilityChanged_ = function() {
  if (document.hidden) {
    this.pressed_ = [];
  }
};


/**
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.mouseDown_ = function(evt) {
  if (evt.which != 1) {
    this.pressed_ = [];
  }
};


/**
 * Returns true if the given keycode is currently being pressed.
 *
 * @param {!game.core.KeyHandler.Keycodes} keyCode
 * @return {boolean} true if key is down.
 */
game.core.KeyHandler.prototype.isDown = function(keyCode) {
  return this.pressed_[keyCode];
};


/**
 * Callback for keydown event.
 *
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.onKeydown_ = function(evt) {
  this.pressed_[evt.keyCode] = true;
};


/**
 * Callback for keyup event.
 *
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.onKeyup_ = function(evt) {
  delete this.pressed_[evt.keyCode];
};


/**
 * Key codes for common characters in this game.
 *
 * @enum {number}
 */
game.core.KeyHandler.Keycodes = {
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
