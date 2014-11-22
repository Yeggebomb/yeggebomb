goog.provide('game.core.KeyHandler');
goog.provide('game.core.KeyHandler.Keycodes');



/**
 * KeyHandler singleton class, this class keeps track of key events,
 *
 * @constructor
 */
game.core.KeyHandler = function() {
  /**
   * The current tick to record by.
   *
   * @type {number}
   */
  this.currentTick = 0;
  /**
   * True if we should record events.
   * @type {Boolean}
   */
  this.isRecording = false;
  /**
   * The current time. (for recording).
   *
   * @type {number}
   */
  this.currentTime = null;
  /**
   * True if we should respons to keyUp and keyDown.
   * @type {Boolean}
   */
  this.ignoreKeys = false;
  /**
   * Object that tracks what is currently being pressed.
   * @type {!Object.<!game.core.KeyHandler.Keycodes, boolean>}
   */
  this.pressed = {};
};


/**
 * Records of key events.
 *
 * @type {Array.<Object>}
 */
game.core.KeyHandler.records = {};


/**
 * Doesn't happen by default! Needs to be called (i.e. only for primary user).
 */
game.core.KeyHandler.prototype.setupEventListeners = function() {
  console.log('HAPPENS HOPEFULLY ONLY ONCE');
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
    _.each(this.pressed, function(value, keyCode) {
      this.addRecord_(keyCode, false);
    }.bind(this));
    this.pressed = {};
  }
};


/**
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.mouseDown_ = function(evt) {
  if (evt.which != 1) {
    _.each(this.pressed, function(value, keyCode) {
      this.addRecord_(keyCode, false);
    }.bind(this));
    this.pressed = {};
  }
};


/**
 * Returns true if the given keyCode is currently being pressed.
 *
 * @param {!game.core.KeyHandler.Keycodes} keyCode
 * @return {boolean} true if key is down.
 */
game.core.KeyHandler.prototype.isDown = function(keyCode) {
  return this.pressed[keyCode];
};


/**
 * Callback for keydown event.
 *
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.onKeydown_ = function(evt) {
  var keyCode = evt.keyCode;
  if (this.ignoreKeys) return;
  if (this.isDown(keyCode)) return;  // No need to do this twice.
  this.addRecord_(keyCode, true);
  this.pressed[evt.keyCode] = true;
};


/**
 * Callback for keyup event.
 *
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.onKeyup_ = function(evt) {
  var keyCode = evt.keyCode;
  if (this.ignoreKeys) return;
  this.addRecord_(keyCode, false);
  delete this.pressed[keyCode];
};


/**
 * Disallows the recording of key stroked and ends recording of any keys.
 */
game.core.KeyHandler.prototype.stopRecording = function() {
  _.each(this.pressed, function(value, keyCode) {
    this.addRecord_(keyCode, false);
  }.bind(this));
  this.pressed = {};
  this.isRecording = false;
  this.ignoreKeys = true;
};


/**
 * Allows recording of keys
 */
game.core.KeyHandler.prototype.startRecording = function() {
  game.core.KeyHandler.records = {};
  this.isRecording = true;
  this.ignoreKeys = false;
};


/**
 * Adds a record for recording. Either pressed or un pressed.
 *
 * @param {number} keyCode
 * @param {boolean} value True for keyCode was pressed, false for un pressed.
 * @private
 */
game.core.KeyHandler.prototype.addRecord_ = function(keyCode, value) {
  if (!this.isRecording) return;
  var currentTick = this.currentTick;
  if (!_.isArray(game.core.KeyHandler.records[currentTick])) {
    game.core.KeyHandler.records[currentTick] = [];
  }

  game.core.KeyHandler.records[currentTick].push({
    keyCode: keyCode,
    value: value
  });
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
