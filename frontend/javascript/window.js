goog.provide('game.Window');

goog.require('game.Entity');
goog.require('game.mixins.Rectangle');
goog.require('helper');



/**
 * Window singleton class, this is a representation of the current window
 * dimensions.
 *
 * @constructor
 * @extends {Game.Entity}
 */
game.Window = function() {
  if (game.Window.prototype._singletonInstance) {
    return game.Window.prototype._singletonInstance;
  }
  game.Window.prototype._singletonInstance = this;
  helper.mixin(this, game.mixins.Rectangle.prototype);

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
game.Window.prototype.callRegistered_ = function() {
  for (var i = 0; i < this.resizeCallbacks_.length; i++) {
    this.resizeCallbacks_[i]();
  }
};


/**
 * Handles window resize events.
 *
 * @private
 */
game.Window.prototype.resize_ = function() {
  this.setSize(document.documentElement.clientWidth,
      document.documentElement.clientHeight);
};


/**
 * Registers a callback to call after window has resized.
 *
 * @param {function()} callback
 * @param {boolean=} opt_callImmediatly Calls this function right away.
 */
game.Window.prototype.registerResizeCallback =
    function(callback, opt_callImmediatly) {
  this.resizeCallbacks_.push(callback);
  if (_.isBoolean(opt_callImmediatly) && opt_callImmediatly) {
    callback();
  }
};
