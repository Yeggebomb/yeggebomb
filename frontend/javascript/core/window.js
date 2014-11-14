goog.provide('game.core.Window');

goog.require('game.core.Entity');
goog.require('game.core.helper');
goog.require('game.mixins.Listenable');
goog.require('game.mixins.Rectangle');



/**
 * Window singleton class, this is a representation of the current window
 * dimensions.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.core.Window = function() {
  if (game.core.Window.prototype._singletonInstance) {
    return game.core.Window.prototype._singletonInstance;
  }
  game.core.Window.prototype._singletonInstance = this;
  game.core.helper.mixin(
      this, game.mixins.Rectangle.prototype, game.mixins.Listenable.prototype);

  /**
   * Callbacks to call after window has been resized.
   * @private {Array.<function()>}
   */
  this.resizeCallbacks_ = [];
  this.registerListener(
      game.core.Window.RESIZE_LISTENER_EVENT_NAME, this.resize_.bind(this));
  window.addEventListener('resize',
      this.callListeners.bind(
          this, game.core.Window.RESIZE_LISTENER_EVENT_NAME));
  this.resize_();
};


/**
 * @const {string}
 */
game.core.Window.RESIZE_LISTENER_EVENT_NAME = 'resize';


/**
 * Handles window resize events.
 *
 * @private
 */
game.core.Window.prototype.resize_ = function() {
  this.setSize(document.documentElement.clientWidth,
      document.documentElement.clientHeight);
};
