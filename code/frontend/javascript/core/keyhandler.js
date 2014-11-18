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

  /**
   * True if we should record events.
   * @type {Boolean}
   */
  this.isRecording = true;

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
 * A record of key events.
 * @type {Array.<Object>}
 */
game.core.KeyHandler.record = [];


/**
 * Checks if the app lost visibility. If it does then we can no longer detect
 * keyUp events so we will just wipe out all the keys.
 *
 * @private
 */
game.core.KeyHandler.prototype.visibilityChanged_ = function() {
  if (document.hidden) {
    _.each(this.pressed_, function(keycode) {
      this.endRecordEvent_(keycode);
    }.bind(this));
    this.pressed_ = [];
  }
};


/**
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.mouseDown_ = function(evt) {
  if (evt.which != 1) {
    _.each(this.pressed_, function(keycode) {
      this.endRecordEvent_(keycode);
    }.bind(this));
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
  var skipRecord = false;
  _.each(game.core.KeyHandler.record, function(record) {
    if (record.keyCode == evt.keyCode && record.end == null) {
      skipRecord = true;
    }
  });
  // We should skip recording this entry if we already found an event with this
  // entry.
  if (!skipRecord) {
    this.recordEvent_(evt.keyCode);
  }

  this.pressed_[evt.keyCode] = true;
};


/**
 * Callback for keyup event.
 *
 * @param {!Event} evt
 * @private
 */
game.core.KeyHandler.prototype.onKeyup_ = function(evt) {
  this.endRecordEvent_(evt.keyCode);
  delete this.pressed_[evt.keyCode];
};


/**
 * Disallows the recording of key stroked and ends recording of any keys.
 */
game.core.KeyHandler.prototype.stopRecording = function() {
  _.each(this.pressed_, function(keycode) {
    this.endRecordEvent_(keycode);
  }.bind(this));
  this.isRecording = false;
  game.core.KeyHandler.record = [];
};


/**
 * Allows recording of keys
 */
game.core.KeyHandler.prototype.startRecording = function() {
  game.core.KeyHandler.record = [];
  this.isRecording = true;
};


/**
 * Starts recording the key stroke.
 *
 * @param {number} keyCode
 * @private
 */
game.core.KeyHandler.prototype.recordEvent_ = function(keyCode) {
  if (!this.isRecording) return;
  game.core.KeyHandler.record.push({
    keyCode: keyCode,
    start: +new Date(),
    end: null
  });
};


/**
 * Ends the key.
 *
 * @param {number} keyCode
 */
game.core.KeyHandler.prototype.endRecordEvent_ = function(keyCode) {
  if (!this.isRecording) return;
  var foundRecord = null;

  _.each(game.core.KeyHandler.record, function(record) {
    if (record.keyCode == keyCode && record.end == null) {
      if (foundRecord) {
        console.warn('Crap we found multiple records that we havent ended ' +
            'for this key');
      }
      foundRecord = record;
    }
  });

  if (!foundRecord) {
    console.warn('Crap we couldn\'t find that last record');
    return;
  }

  foundRecord.end = +new Date();
  foundRecord.duration = foundRecord.end - foundRecord.start;
  console.log(game.core.KeyHandler.record);
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
