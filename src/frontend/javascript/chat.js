goog.provide('game.Chat');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * Game chat singleton class.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Chat = function() {
  if (game.Chat.prototype._singletonInstance) {
    return game.Chat.prototype._singletonInstance;
  }
  game.Chat.prototype._singletonInstance = this;
  game.Chat.base(this, 'constructor');

  // Firebase stuff
  /** @private {!Firebase} */
  this.firebase_ = new Firebase(game.constants.FIREBASE_URL);
  this.firebaseChat_ = this.firebase_.child('chat');
  this.firebaseMessages_ = this.firebaseChat_.child('messages');
  this.firebaseMessages_.on('child_added', this.messageAdded.bind(this));

  this.el.style.zIndex = 5;
  this.el.classList.add(game.Chat.CLASS_NAME);
  this.el.style.display = 'flex';
  this.el.style.flexDirection = 'column';
  this.textArea = document.createElement('textarea');
  this.textArea.readOnly = true;
  this.textArea.style.flexGrow = '1';
  this.input = document.createElement('input');
  this.input.style.height = '1.3em';
  this.input.style.fontSize = '1em';
  this.el.appendChild(this.textArea);
  this.el.appendChild(this.input);

  game.core.helper.mixin(this, 'shape');

  window.addEventListener('keydown', this.onKeydown_.bind(this), false);

  this.setVisible(false);
};
game.core.helper.inherit(game.Chat, game.core.Entity);


/**
 * @type {String}
 */
game.Chat.CLASS_NAME = 'chat';


/**
 * Callback for keydown event.
 *
 * @param {!Event} evt
 * @private
 */
game.Chat.prototype.onKeydown_ = function(evt) {
  var keyCode = evt.keyCode;
  var Keycodes = game.constants.KEYCODES;
  if (keyCode == Keycodes.ENTER) {
    this.setVisible(true);
    this.sendText();
  }
  if (keyCode == Keycodes.ESC) {
    this.setVisible(false);
  }
};


/**
 * Toggles the visibility of the chat window.
 *
 * @param {boolean} visible
 */
game.Chat.prototype.setVisible = function(visible) {
  if (visible == this.visible) return;
  this.visible = visible;
  if (visible) {
    this.el.style.display = 'flex';
    this.input.focus();
  } else {
    this.el.style.display = 'none';
  }
};


/**
 * Sends the text that is currently input.
 */
game.Chat.prototype.sendText = function() {
  if (this.input.value === '') return;

  var value = this.input.value + '\n';
  this.firebaseMessages_.push({'message': value});
  this.input.value = '';
};


/**
 * Updates the textarea with the new message.
 *
 * @param {Object} data
 */
game.Chat.prototype.messageAdded = function(data) {
  var value = data.val();
  this.textArea.value += value.message;
};
