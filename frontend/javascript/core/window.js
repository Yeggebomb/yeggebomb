goog.provide('game.core.Window');

goog.require('game.core.Entity');
goog.require('game.core.helper');
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
  game.core.helper.mixin(this, game.mixins.Rectangle.prototype);

  /**
   * Callbacks to call after window has been resized.
   * @private {Array.<function()>}
   */
  this.resizeCallbacks_ = [];
  this.registerResizeCallback(this.resize_.bind(this));
  window.addEventListener('resize', this.callRegistered_.bind(this));
  this.resize_();
};


/**
 * Calls any registered callbacks on resize.
 *
 * @private
 */
game.core.Window.prototype.callRegistered_ = function() {
  for (var i = 0; i < this.resizeCallbacks_.length; i++) {
    this.resizeCallbacks_[i]();
  }
};


/**
 * Handles window resize events.
 *
 * @private
 */
game.core.Window.prototype.resize_ = function() {
  this.setSize(document.documentElement.clientWidth,
      document.documentElement.clientHeight);
};


/**
 * Registers a callback to call after window has resized.
 *
 * @param {function()} callback
 * @param {boolean=} opt_callImmediatly Calls this function right away.
 */
game.core.Window.prototype.registerResizeCallback =
    function(callback, opt_callImmediatly) {
  this.resizeCallbacks_.push(callback);
  if (_.isBoolean(opt_callImmediatly) && opt_callImmediatly) {
    callback();
  }
};
